"use client";

import { useEffect, useMemo, useState } from "react";
import { subscribeToTimeUpdate } from "@/features/music/audio-controller";
import { parseLrc, type Lyric } from "@/utils/lrcParser";

const lyricCache = new Map<string, Promise<Lyric[]>>();

function loadLyrics(lyricUrl: string) {
  const cached = lyricCache.get(lyricUrl);
  if (cached) return cached;

  const request = fetch(lyricUrl)
    .then(async (response) => {
      if (!response.ok) throw new Error("歌词加载失败");
      return parseLrc(await response.text()).filter(
        (lyric) => !/^(作词|作曲|编曲|制作)：/.test(lyric.text),
      );
    })
    .catch(() => {
      throw new Error("歌词加载失败");
    });

  lyricCache.set(lyricUrl, request);
  return request;
}

export function useCurrentLyric(lyricUrl: string) {
  const [lyrics, setLyrics] = useState<Lyric[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadedLyricUrl, setLoadedLyricUrl] = useState<string | null>(null);
  const [lyricsErrorUrl, setLyricsErrorUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void loadLyrics(lyricUrl)
      .then((parsed) => {
        if (cancelled) return;
        setLyrics(parsed);
        setLoadedLyricUrl(lyricUrl);
        setLyricsErrorUrl(null);
      })
      .catch(() => {
        if (cancelled) return;
        setLyrics([]);
        setLoadedLyricUrl(null);
        setLyricsErrorUrl(lyricUrl);
      });

    return () => {
      cancelled = true;
    };
  }, [lyricUrl]);

  useEffect(
    () =>
      subscribeToTimeUpdate((time, total) => {
        setCurrentTime(time);
        setDuration(total);
      }),
    [],
  );

  const currentLyrics = useMemo(
    () => (loadedLyricUrl === lyricUrl ? lyrics : []),
    [loadedLyricUrl, lyricUrl, lyrics],
  );
  const lyricsError = lyricsErrorUrl === lyricUrl;
  const lyricsLoading = !lyricsError && loadedLyricUrl !== lyricUrl;

  const currentLyricIndex = useMemo(() => {
    let activeIndex = -1;
    for (let index = 0; index < currentLyrics.length; index += 1) {
      if (currentLyrics[index].time <= currentTime) activeIndex = index;
      else break;
    }
    return currentLyrics.length > 0 ? Math.max(0, activeIndex) : -1;
  }, [currentTime, currentLyrics]);

  const currentLyric =
    currentLyricIndex >= 0 ? currentLyrics[currentLyricIndex]?.text ?? "" : "";

  return {
    lyrics,
    currentTime,
    duration,
    lyricsError,
    lyricsLoading,
    currentLyricIndex,
    currentLyric,
  };
}
