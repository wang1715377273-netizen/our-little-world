"use client";

import { create } from "zustand";
import { songs } from "@/features/mock-data";
import {
  pauseCurrentSong,
  playCurrentSong,
  setCurrentSongVolume,
  type PlayFailureReason,
} from "@/features/music/audio-controller";

type PlayerState = {
  currentSongId: string;
  isPlaying: boolean;
  volume: number;
  /** 最近一次播放失败的原因，供界面给出可读提示（不跳转页面）。 */
  playbackError: PlayFailureReason | null;
  setCurrentSong: (songId: string) => void;
  togglePlaying: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
};

let playbackRequestId = 0;

export const usePlayerStore = create<PlayerState>((set, get) => {
  // 移动端浏览器（Chrome Android / iOS Safari）只允许在"用户手势的同步调用栈"里发起 play()，
  // 放到 effect 里异步执行会被判为缺少手势而拒绝。因此播放必须在按钮点击链路中同步发起。
  const startPlayback = (songId: string) => {
    const requestId = (playbackRequestId += 1);
    const volume = get().volume;

    void playCurrentSong(songId, volume).then((result) => {
      if (result.ok) {
        if (requestId === playbackRequestId) set({ playbackError: null });
        return;
      }

      // aborted 表示被更新的请求取代；过期请求也不应覆盖最新状态。
      if (result.reason === "aborted" || requestId !== playbackRequestId) return;

      set({ isPlaying: false, playbackError: result.reason });
    });
  };

  return {
    currentSongId: songs[0]?.id ?? "",
    isPlaying: false,
    volume: 70,
    playbackError: null,

    setCurrentSong: (songId) => {
      set({ currentSongId: songId, isPlaying: true, playbackError: null });
      startPlayback(songId);
    },

    togglePlaying: () => {
      const { isPlaying, currentSongId } = get();

      if (isPlaying) {
        playbackRequestId += 1;
        pauseCurrentSong();
        set({ isPlaying: false, playbackError: null });
        return;
      }

      set({ isPlaying: true, playbackError: null });
      startPlayback(currentSongId);
    },

    next: () => {
      const index = songs.findIndex((song) => song.id === get().currentSongId);
      const nextSong = songs[(index + 1) % songs.length];

      if (!nextSong) return;

      set({ currentSongId: nextSong.id, isPlaying: true, playbackError: null });
      startPlayback(nextSong.id);
    },

    previous: () => {
      const index = songs.findIndex((song) => song.id === get().currentSongId);
      const nextIndex = index <= 0 ? songs.length - 1 : index - 1;
      const previousSong = songs[nextIndex];

      if (!previousSong) return;

      set({ currentSongId: previousSong.id, isPlaying: true, playbackError: null });
      startPlayback(previousSong.id);
    },

    setVolume: (volume) => {
      set({ volume });
      setCurrentSongVolume(volume);
    },
  };
});
