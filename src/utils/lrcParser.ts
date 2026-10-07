export interface Lyric {
  time: number;
  text: string;
}

const timestampPattern = /\[(\d{1,3}):(\d{2})(?:[.:](\d{1,3}))?\]/g;

function parseTimestamp(minutes: string, seconds: string, fraction = "0") {
  const milliseconds = Number(fraction.padEnd(3, "0").slice(0, 3));
  return Number(minutes) * 60 + Number(seconds) + milliseconds / 1000;
}

export function parseLrc(source: string): Lyric[] {
  return source
    .split(/\r?\n/)
    .flatMap((line) => {
      const timestamps = [...line.matchAll(timestampPattern)];
      const text = line.replace(timestampPattern, "").trim();

      if (!text || timestamps.length === 0) return [];

      return timestamps.map((match) => ({
        time: parseTimestamp(match[1], match[2], match[3]),
        text,
      }));
    })
    .sort((a, b) => a.time - b.time);
}
