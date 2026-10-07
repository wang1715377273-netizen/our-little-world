"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import {
  Heart,
  ListMusic,
  Maximize2,
  Pause,
  Play,
  Repeat1,
  Repeat2,
  SkipBack,
  SkipForward,
  Shuffle,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { musicData } from "@/data/musicData";
import {
  seekCurrentSong,
  setOnSongEnded,
} from "@/features/music/audio-controller";
import { usePlayerStore } from "@/features/music/player-store";
import { useCurrentLyric } from "@/features/music/use-current-lyric";
import { cn } from "@/lib/utils/cn";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

export function MusicExperience() {
  const { currentSongId, isPlaying, playbackError, togglePlaying, next, previous, volume, setVolume } = usePlayerStore();
  const currentSong = musicData.find((song) => song.id === currentSongId) ?? musicData[0];
  const [playMode, setPlayMode] = useState<"sequential" | "shuffle">("sequential");
  const [repeatMode, setRepeatMode] = useState<"all" | "one">("all");
  const [showMobileLyrics, setShowMobileLyrics] = useState(false);
  const [modeToast, setModeToast] = useState<{ message: string; id: number } | null>(null);
  const modeToastIdRef = useRef(0);
  const modeToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    lyrics,
    currentTime,
    duration,
    lyricsError,
    lyricsLoading,
    currentLyricIndex,
  } = useCurrentLyric(currentSong.lyric);
  const activeLyricRef = useRef<HTMLLIElement>(null);
  const lyricsWindowRef = useRef<HTMLDivElement>(null);
  const mobileLyricsWindowRef = useRef<HTMLDivElement>(null);
  const activeMobileLyricRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const html = document.documentElement;
    const body = document.body;
    const previousHtml = {
      overflow: html.style.overflow,
      height: html.style.height,
      overscrollBehavior: html.style.overscrollBehavior,
    };
    const previousBody = {
      overflow: body.style.overflow,
      height: body.style.height,
      overscrollBehavior: body.style.overscrollBehavior,
    };

    const restore = () => {
      html.style.overflow = previousHtml.overflow;
      html.style.height = previousHtml.height;
      html.style.overscrollBehavior = previousHtml.overscrollBehavior;
      body.style.overflow = previousBody.overflow;
      body.style.height = previousBody.height;
      body.style.overscrollBehavior = previousBody.overscrollBehavior;
    };
    const applyViewportLock = () => {
      if (!media.matches) {
        restore();
        return;
      }

      html.style.overflow = "hidden";
      html.style.height = "100dvh";
      html.style.overscrollBehavior = "none";
      body.style.overflow = "hidden";
      body.style.height = "100dvh";
      body.style.overscrollBehavior = "none";
    };

    applyViewportLock();
    media.addEventListener("change", applyViewportLock);
    return () => {
      media.removeEventListener("change", applyViewportLock);
      restore();
    };
  }, []);

  useEffect(
    () => () => {
      if (modeToastTimeoutRef.current) clearTimeout(modeToastTimeoutRef.current);
    },
    [],
  );

  const toggleMobileRepeatMode = () => {
    const nextMode = repeatMode === "one" ? "all" : "one";
    setRepeatMode(nextMode);
    setModeToast({
      message: nextMode === "one" ? "单曲循环" : "顺序播放",
      id: (modeToastIdRef.current += 1),
    });

    if (modeToastTimeoutRef.current) clearTimeout(modeToastTimeoutRef.current);
    modeToastTimeoutRef.current = setTimeout(() => setModeToast(null), 1400);
  };

  useEffect(() => {
    setOnSongEnded(() => {
      const state = usePlayerStore.getState();
      if (repeatMode === "one") {
        state.setCurrentSong(currentSongId);
      } else if (musicData.length > 1) {
        state.next();
      } else {
        usePlayerStore.setState({ isPlaying: false });
      }
    });
  }, [currentSongId, next, repeatMode]);

  useEffect(() => {
    const windowElement = lyricsWindowRef.current;
    const activeElement = activeLyricRef.current;
    if (!windowElement || !activeElement) return;

    const windowRect = windowElement.getBoundingClientRect();
    const activeRect = activeElement.getBoundingClientRect();
    const activeOffset = activeRect.top - windowRect.top + windowElement.scrollTop;
    const targetTop =
      activeOffset - windowElement.clientHeight / 2 + activeElement.offsetHeight / 2;
    windowElement.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
  }, [currentLyricIndex]);

  useEffect(() => {
    if (!showMobileLyrics) return;

    const windowElement = mobileLyricsWindowRef.current;
    const activeElement = activeMobileLyricRef.current;
    if (!windowElement || !activeElement) return;

    const windowRect = windowElement.getBoundingClientRect();
    const activeRect = activeElement.getBoundingClientRect();
    const activeOffset = activeRect.top - windowRect.top + windowElement.scrollTop;
    const targetTop =
      activeOffset - windowElement.clientHeight / 2 + activeElement.offsetHeight / 2;
    windowElement.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
  }, [currentLyricIndex, lyrics, showMobileLyrics]);

  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const hint =
    playbackError === "autoplay-blocked"
      ? "浏览器阻止了自动播放，请再点一次播放"
      : playbackError
        ? "音频加载失败，请稍后再试"
        : null;

  return (
    <section
      className="music-experience"
      style={{ "--music-cover": `url("${currentSong.cover}")` } as CSSProperties}
    >
      <div className="music-experience__veil" aria-hidden="true" />
      <div className="music-mobile-player">
        <header className="music-mobile-player__header">{currentSong.title}</header>

        <div className="music-mobile-middle">
          {showMobileLyrics ? (
            <div
              className="music-mobile-lyrics-stage"
              role="button"
              tabIndex={0}
              aria-label="返回唱片播放器"
              onClick={() => setShowMobileLyrics(false)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setShowMobileLyrics(false);
                }
              }}
            >
              {lyricsError || lyricsLoading || lyrics.length === 0 ? (
                <p className="music-mobile-lyrics-empty">
                  {lyricsError ? "歌词暂时无法加载。" : lyricsLoading ? "正在读取歌词…" : "暂无歌词"}
                </p>
              ) : (
                <div ref={mobileLyricsWindowRef} className="music-mobile-lyrics-window" aria-live="polite">
                  <ul>
                    {lyrics.map((lyric, index) => (
                      <li
                        key={`${lyric.time}-${index}`}
                        ref={index === currentLyricIndex ? activeMobileLyricRef : undefined}
                        className={cn(
                          index === currentLyricIndex && "music-mobile-lyric--active",
                          index === currentLyricIndex - 1 && "music-mobile-lyric--near",
                          index === currentLyricIndex + 1 && "music-mobile-lyric--near",
                        )}
                      >
                        {lyric.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="music-mobile-cover-stage">
              <button
                type="button"
                className="music-mobile-turntable"
                aria-label="打开歌词"
                onClick={() => setShowMobileLyrics(true)}
              >
                <span className="music-mobile-vinyl-wrap" aria-hidden="true">
                  <span className={cn("music-mobile-vinyl", isPlaying && "music-mobile-vinyl--playing")}>
                    <span className="music-mobile-vinyl__grooves" />
                    <span className="music-mobile-vinyl__cover">
                      <Image
                        src={currentSong.cover}
                        alt=""
                        fill
                        sizes="(max-width: 1023px) 82vw, 380px"
                        className="object-cover"
                      />
                      <span className="music-mobile-vinyl__spindle" />
                    </span>
                  </span>
                </span>
                <span
                  className={cn(
                    "music-mobile-tonearm-anchor",
                    isPlaying ? "music-mobile-tonearm-anchor--playing" : "music-mobile-tonearm-anchor--rest",
                  )}
                  aria-hidden="true"
                >
                  <Image src="/music/needle.png" alt="" fill sizes="clamp(10rem, 42vw, 16rem)" />
                </span>
              </button>
            </div>
          )}
        </div>

        <div
          className="music-mobile-controls"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <div className="music-mobile-track-info">
            <h1>{currentSong.title}</h1>
            <p>{currentSong.artist}</p>
          </div>

          <div className="music-mobile-progress">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={Math.min(currentTime, duration || 0)}
              aria-label="播放进度"
              style={{ "--music-progress": `${progress}%` } as CSSProperties}
              onChange={(event) => seekCurrentSong(Number(event.target.value))}
            />
            <div className="music-mobile-progress__times">
              <span>{formatTime(currentTime)}</span>
              <span>{duration > 0 ? formatTime(duration) : "--:--"}</span>
            </div>
          </div>

          <div className="music-mobile-control-group" aria-label="播放控制">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="music-mobile-control-button"
              aria-label={repeatMode === "one" ? "单曲循环" : "顺序播放"}
              onClick={toggleMobileRepeatMode}
            >
              {repeatMode === "one" ? <Repeat1 /> : <Repeat2 />}
            </Button>
            <Button type="button" variant="ghost" size="icon" className="music-mobile-control-button" aria-label="上一首" onClick={previous}>
              <SkipBack />
            </Button>
            <Button
              type="button"
              variant="subtle"
              size="icon"
              className="music-mobile-play-button"
              aria-label={isPlaying ? "暂停" : "播放"}
              onClick={togglePlaying}
            >
              {isPlaying ? <Pause /> : <Play />}
            </Button>
            <Button type="button" variant="ghost" size="icon" className="music-mobile-control-button" aria-label="下一首" onClick={next}>
              <SkipForward />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="music-mobile-control-button" aria-label="播放列表" disabled>
              <ListMusic />
            </Button>
          </div>
        </div>
        {modeToast ? (
          <div key={modeToast.id} className="music-mobile-mode-toast" role="status" aria-live="polite">
            {modeToast.message}
          </div>
        ) : null}
      </div>

      <div className="music-experience__content">
        <div className="music-experience__main">
          <div className="music-now-playing">
            <div className={cn("music-cover-frame", isPlaying && "music-cover-frame--playing")}>
              <Image
                src={currentSong.cover}
                alt={`${currentSong.title} - ${currentSong.artist} 封面`}
                fill
                priority
                sizes="(max-width: 1023px) 72vw, 360px"
                className="object-cover"
              />
            </div>
            <div className="music-track-meta">
              <p className="music-kicker music-kicker--mobile-only">OUR LITTLE WORLD / NOW PLAYING</p>
              <h1>{currentSong.title}</h1>
              <p className="music-artist">{currentSong.artist}</p>
              <div className="music-memory-card music-memory-card--mobile-only">
                <p className="music-memory-card__label">这首歌的故事</p>
                <p>{currentSong.story}</p>
                <span>{currentSong.date}</span>
              </div>
            </div>
          </div>

          <div className="music-lyrics-panel">
              <div className="music-lyrics-panel__header music-lyrics-panel__header--mobile-only">
              <span>LYRICS</span>
              <span>{lyricsError ? "暂无歌词" : `${lyrics.length} lines`}</span>
            </div>
            <div ref={lyricsWindowRef} className="music-lyrics-window" aria-live="polite">
              {lyricsError ? (
                <p className="music-lyrics-empty">歌词暂时无法加载。</p>
              ) : lyrics.length === 0 ? (
                <p className="music-lyrics-empty">正在读取歌词…</p>
              ) : (
                <ul>
                  {lyrics.map((lyric, index) => (
                    <li
                      key={`${lyric.time}-${index}`}
                      ref={index === currentLyricIndex ? activeLyricRef : undefined}
                      className={cn(
                        index === currentLyricIndex && "music-lyric--active",
                        index === currentLyricIndex - 1 && "music-lyric--near",
                        index === currentLyricIndex + 1 && "music-lyric--near",
                      )}
                    >
                      {lyric.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="music-player-bar">
          <div className="music-player-bar__desktop">
            <TooltipProvider delayDuration={200}>
              <div className="music-player-bar__desktop-controls" aria-label="播放控制">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="music-desktop-control-button"
                      aria-label={playMode === "shuffle" ? "随机播放" : "顺序播放"}
                      onClick={() => setPlayMode((mode) => (mode === "shuffle" ? "sequential" : "shuffle"))}
                    >
                      {playMode === "shuffle" ? <Shuffle data-icon="inline-start" /> : <ListMusic data-icon="inline-start" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">{playMode === "shuffle" ? "随机播放" : "顺序播放"}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" className="music-desktop-control-button" aria-label="上一首" onClick={previous}>
                      <SkipBack data-icon="inline-start" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">上一首</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="subtle"
                      size="icon"
                      className="music-desktop-play-button"
                      aria-label={isPlaying ? "暂停" : "播放"}
                      onClick={togglePlaying}
                    >
                      {isPlaying ? <Pause data-icon="inline-start" /> : <Play data-icon="inline-start" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">{isPlaying ? "暂停" : "播放"}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" className="music-desktop-control-button" aria-label="下一首" onClick={next}>
                      <SkipForward data-icon="inline-start" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">下一首</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="music-desktop-control-button"
                      aria-label={repeatMode === "one" ? "单曲循环" : "列表循环"}
                      onClick={() => setRepeatMode((mode) => (mode === "one" ? "all" : "one"))}
                    >
                      {repeatMode === "one" ? <Repeat1 data-icon="inline-start" /> : <Repeat2 data-icon="inline-start" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">{repeatMode === "one" ? "单曲循环" : "列表循环"}</TooltipContent>
                </Tooltip>
              </div>
              <div className="music-progress-row music-progress-row--desktop">
                <span>{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={Math.min(currentTime, duration || 0)}
                  aria-label="播放进度"
                  style={{ "--music-progress": `${progress}%` } as CSSProperties}
                  onChange={(event) => seekCurrentSong(Number(event.target.value))}
                />
                <span>{duration > 0 ? formatTime(duration) : "--:--"}</span>
              </div>
            </TooltipProvider>
          </div>

          <div className="music-player-bar__mobile">
            <div className="music-player-bar__track">
              <div className="music-player-bar__track-info">
                <div className="music-player-bar__thumb">
                  <Image src={currentSong.cover} alt="" fill sizes="48px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="truncate">{currentSong.title}</p>
                  <span className="truncate">{currentSong.artist}</span>
                </div>
              </div>

              <div className="music-player-bar__controls">
                <Button type="button" variant="ghost" size="icon" className="music-icon-button" aria-label="上一首" title="上一首" onClick={previous}>
                  <SkipBack />
                </Button>
                <Button type="button" variant="subtle" size="icon" className="music-play-button" aria-label={isPlaying ? "暂停" : "播放"} title={isPlaying ? "暂停" : "播放"} onClick={togglePlaying}>
                  {isPlaying ? <Pause /> : <Play />}
                </Button>
                <Button type="button" variant="ghost" size="icon" className="music-icon-button" aria-label="下一首" title="下一首" onClick={next}>
                  <SkipForward />
                </Button>
              </div>

              <div className="music-player-bar__tools">
                <Button type="button" variant="ghost" size="icon" className="music-icon-button hidden sm:inline-flex" aria-label="收藏" title="收藏">
                  <Heart />
                </Button>
                <label className="music-volume-control hidden md:flex" title="音量">
                  <Volume2 aria-hidden="true" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    aria-label="音量"
                    onChange={(event) => setVolume(Number(event.target.value))}
                  />
                </label>
                <Button type="button" variant="ghost" size="icon" className="music-icon-button hidden sm:inline-flex" aria-label="播放列表" title="播放列表">
                  <ListMusic />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="music-icon-button hidden sm:inline-flex" aria-label="重复播放" title="重复播放">
                  <Repeat2 />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="music-icon-button hidden lg:inline-flex" aria-label="全屏" title="全屏">
                  <Maximize2 />
                </Button>
              </div>
            </div>
            <div className="music-progress-row">
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={Math.min(currentTime, duration || 0)}
                aria-label="播放进度"
                style={{ "--music-progress": `${progress}%` } as CSSProperties}
                onChange={(event) => seekCurrentSong(Number(event.target.value))}
              />
              <span>{formatTime(duration)}</span>
            </div>
            {hint ? <p className="music-playback-hint">{hint}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
