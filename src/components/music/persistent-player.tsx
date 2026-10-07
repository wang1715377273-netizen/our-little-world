"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingMarquee } from "@/components/music/floating-marquee";
import { musicData } from "@/data/musicData";
import { songs } from "@/features/mock-data";
import { pauseCurrentSong, setOnSongEnded, subscribeToPlayback } from "@/features/music/audio-controller";
import { usePlayerStore } from "@/features/music/player-store";
import { useCurrentLyric } from "@/features/music/use-current-lyric";

export function PersistentMusicPlayer() {
  const { currentSongId, isPlaying, playbackError, togglePlaying, next, previous } = usePlayerStore();
  const currentSong = songs.find((song) => song.id === currentSongId) ?? songs[0];
  const currentMusicSong = musicData.find((song) => song.id === currentSongId) ?? musicData[0];
  const { currentLyric, lyricsError, lyricsLoading } = useCurrentLyric(currentMusicSong.lyric);

  // 播放本身由 store 在按钮点击的同步调用栈里发起（移动端手势授权要求），
  // 这里只负责把音频的真实状态同步回界面，避免与点击链路形成重复播放。
  useEffect(() => {
    setOnSongEnded(() => {
      const state = usePlayerStore.getState();

      // 只有一首歌时不自动无限重播，避免无人值守时反复占用带宽与内存。
      if (songs.length > 1) {
        state.next();
        return;
      }

      pauseCurrentSong();
      usePlayerStore.setState({ isPlaying: false });
    });
  }, []);

  useEffect(() => subscribeToPlayback((playing) => usePlayerStore.setState({ isPlaying: playing })), []);

  if (!currentSong) return null;

  const cover = currentMusicSong.cover;
  const lyricText = lyricsError ? "暂无歌词" : lyricsLoading ? "歌词加载中…" : currentLyric || "暂无歌词";
  const hint =
    playbackError === "autoplay-blocked"
      ? "浏览器阻止了自动播放，请再点一次"
      : playbackError
        ? "音频加载失败，请稍后再试"
        : null;

  return (
    <section className="floating-player flex h-11 min-w-0 items-center gap-2 rounded-lg border bg-card/92 px-1.5 shadow-subtle backdrop-blur lg:h-auto lg:gap-3 lg:p-3 lg:shadow-soft">
      <div className="relative size-7 shrink-0 overflow-hidden rounded-md bg-muted lg:size-11">
        <Image src={cover} alt="" fill className="object-cover" sizes="(min-width: 1024px) 44px, 28px" />
      </div>
      <div className="floating-player__track-info min-w-0 flex-1">
        <FloatingMarquee
          resetKey={`${currentSong.id}-title`}
          playing={isPlaying}
          className="text-xs font-medium lg:text-sm"
        >
          {currentSong.title} - {currentSong.artist}
        </FloatingMarquee>
        <FloatingMarquee
          resetKey={`${currentSong.id}-${currentLyric || lyricText}`}
          playing={isPlaying}
          className={`text-[10px] lg:text-xs ${hint ? "text-destructive" : "text-muted-foreground"}`}
        >
          {hint ?? lyricText}
        </FloatingMarquee>
      </div>
      {/* 控件保持 40px 以上的可点区域并使用 touch-manipulation，避免移动端 tap 丢失或延迟 */}
      <div className="flex shrink-0 items-center gap-0 lg:gap-1">
        <Button className="touch-manipulation" variant="ghost" size="icon" aria-label="上一首" onClick={previous}>
          <SkipBack />
        </Button>
        <Button
          className="touch-manipulation"
          variant="subtle"
          size="icon"
          aria-label={isPlaying ? "暂停" : "播放"}
          onClick={togglePlaying}
        >
          {isPlaying ? <Pause /> : <Play />}
        </Button>
        <Button className="touch-manipulation" variant="ghost" size="icon" aria-label="下一首" onClick={next}>
          <SkipForward />
        </Button>
      </div>
    </section>
  );
}
