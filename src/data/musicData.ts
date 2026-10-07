export interface MusicSong {
  id: string;
  title: string;
  artist: string;
  audio: string;
  cover: string;
  lyric: string;
  story: string;
  date: string;
}

export const musicData: MusicSong[] = [
  {
    id: "song-003",
    title: "慢慢喜欢你",
    artist: "莫文蔚",
    audio: "/audio/manman-xihuan-ni.mp3",
    cover: "/music/manman-xihuan-ni.jpg",
    lyric: "/music/manman-xihuan-ni.lrc",
    story: "这首歌记录了我们慢慢靠近彼此的时光。",
    date: "2026",
  },
];
