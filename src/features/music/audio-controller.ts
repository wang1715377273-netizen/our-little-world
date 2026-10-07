import { songs } from "@/features/mock-data";

export type PlayFailureReason = "no-source" | "autoplay-blocked" | "aborted" | "load-error";

export type PlayResult = { ok: true } | { ok: false; reason: PlayFailureReason; message?: string };

type PlaybackListener = (isPlaying: boolean) => void;
type TimeUpdateListener = (currentTime: number, duration: number) => void;

let audioElement: HTMLAudioElement | null = null;
let onEndedHandler: () => void = () => undefined;
let playToken = 0;
const playbackListeners = new Set<PlaybackListener>();
const timeUpdateListeners = new Set<TimeUpdateListener>();

function notifyPlaybackListeners(isPlaying: boolean) {
  playbackListeners.forEach((listener) => listener(isPlaying));
}

function notifyTimeUpdate(element: HTMLAudioElement) {
  timeUpdateListeners.forEach((listener) => listener(element.currentTime, element.duration || 0));
}

function clampVolume(volume: number) {
  if (!Number.isFinite(volume)) return 1;
  return Math.min(1, Math.max(0, volume / 100));
}

function getAudioElement() {
  if (audioElement) return audioElement;
  if (typeof document === "undefined") return null;

  const element = document.createElement("audio");
  element.preload = "metadata";

  // 移动端浏览器对"游离于文档之外"的媒体元素支持不可靠：可能无法播放、
  // 也可能被系统提前回收。必须挂到文档中，再用样式隐藏，避免影响布局与点击。
  element.dataset.appPlayer = "true";
  element.setAttribute("aria-hidden", "true");
  element.style.position = "fixed";
  element.style.left = "-1px";
  element.style.top = "-1px";
  element.style.width = "1px";
  element.style.height = "1px";
  element.style.opacity = "0";
  element.style.pointerEvents = "none";

  element.addEventListener("playing", () => notifyPlaybackListeners(true));
  element.addEventListener("pause", () => notifyPlaybackListeners(false));
  element.addEventListener("ended", () => onEndedHandler());
  element.addEventListener("error", () => notifyPlaybackListeners(false));
  element.addEventListener("timeupdate", () => notifyTimeUpdate(element));
  element.addEventListener("loadedmetadata", () => notifyTimeUpdate(element));

  document.body.appendChild(element);
  audioElement = element;
  return element;
}

export function playCurrentSong(songId: string, volume: number): Promise<PlayResult> {
  const element = getAudioElement();
  if (!element) {
    return Promise.resolve({ ok: false, reason: "load-error", message: "当前环境不支持音频播放" });
  }

  const song = songs.find((item) => item.id === songId) ?? songs[0];
  const audioUrl = song?.audioUrl;

  if (!audioUrl) return Promise.resolve({ ok: false, reason: "no-source" });

  const token = (playToken += 1);

  try {
    const targetUrl = new URL(audioUrl, window.location.href).href;

    // 切歌时先暂停再换源，避免"play() 被新的加载请求中断"。
    if (element.getAttribute("src") !== targetUrl) {
      element.pause();
      element.src = targetUrl;
    }

    element.volume = clampVolume(volume);

    return element.play().then(
      (): PlayResult => (token === playToken ? { ok: true } : { ok: false, reason: "aborted" }),
      (error: unknown): PlayResult => {
        const name = error instanceof Error ? error.name : "";

        if (name === "AbortError") return { ok: false, reason: "aborted", message: name };
        // 移动端浏览器（尤其 Chrome Android / iOS Safari）会拒绝非用户手势触发的播放。
        if (name === "NotAllowedError" || name === "SecurityError") {
          return { ok: false, reason: "autoplay-blocked", message: name };
        }

        return { ok: false, reason: "load-error", message: name || String(error) };
      },
    );
  } catch (error) {
    // 任何同步异常都在这里收口，绝不让错误逃逸到 React 渲染阶段触发 Error Boundary。
    return Promise.resolve({ ok: false, reason: "load-error", message: String(error) });
  }
}

export function pauseCurrentSong() {
  // 递增 token，让仍在进行中的 play() 失效，避免暂停后又开始播放。
  playToken += 1;

  const element = getAudioElement();
  if (element && !element.paused) element.pause();
}

export function setCurrentSongVolume(volume: number) {
  const element = getAudioElement();
  if (element) element.volume = clampVolume(volume);
}

export function setOnSongEnded(handler: () => void) {
  onEndedHandler = handler;
}

export function subscribeToPlayback(listener: PlaybackListener) {
  playbackListeners.add(listener);
  return () => {
    playbackListeners.delete(listener);
  };
}

export function subscribeToTimeUpdate(listener: TimeUpdateListener) {
  const element = getAudioElement();
  if (element) listener(element.currentTime, element.duration || 0);
  timeUpdateListeners.add(listener);
  return () => {
    timeUpdateListeners.delete(listener);
  };
}

export function seekCurrentSong(time: number) {
  const element = getAudioElement();
  if (!element) return;
  element.currentTime = Math.max(0, Math.min(time, element.duration || time));
}
