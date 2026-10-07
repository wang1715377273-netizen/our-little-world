import type { WeatherData } from "@/features/weather/types/weather";

export function getMockWeather(): WeatherData {
  return {
    location: {
      city: "烟台",
      country: "中国",
    },
    dateLabel: "星期一，10 月 5 日",
    current: {
      temperature: 23,
      condition: "晴朗",
      icon: "sun",
      feelsLike: 24,
      high: 25,
      low: 16,
    },
    hourly: [
      { time: "现在", temperature: 23, icon: "sun" },
      { time: "14:00", temperature: 24, icon: "sun" },
      { time: "15:00", temperature: 25, icon: "sun" },
      { time: "16:00", temperature: 24, icon: "partly-cloudy" },
      { time: "17:00", temperature: 22, icon: "partly-cloudy" },
      { time: "18:00", temperature: 20, icon: "cloud" },
      { time: "19:00", temperature: 19, icon: "cloud" },
      { time: "20:00", temperature: 18, icon: "cloud" },
    ],
    daily: [
      { day: "今天", condition: "晴朗", high: 25, low: 16, icon: "sun" },
      { day: "周二", condition: "晴间多云", high: 24, low: 17, icon: "partly-cloudy" },
      { day: "周三", condition: "晴朗", high: 26, low: 18, icon: "sun" },
      { day: "周四", condition: "多云", high: 23, low: 16, icon: "partly-cloudy" },
      { day: "周五", condition: "晴朗", high: 24, low: 15, icon: "sun" },
      { day: "周六", condition: "晴间多云", high: 22, low: 14, icon: "partly-cloudy" },
      { day: "周日", condition: "晴朗", high: 23, low: 15, icon: "sun" },
    ],
    details: [
      { kind: "humidity", label: "湿度", value: "48%" },
      { kind: "wind", label: "风速", value: "东南风 3级" },
      { kind: "visibility", label: "能见度", value: "16 km" },
      { kind: "pressure", label: "气压", value: "1018 hPa" },
      { kind: "precipitation", label: "降水概率", value: "2%" },
    ],
    temperatureTrend: [
      { time: "06:00", temperature: 16 },
      { time: "09:00", temperature: 19 },
      { time: "12:00", temperature: 23 },
      { time: "15:00", temperature: 25 },
      { time: "18:00", temperature: 22 },
      { time: "21:00", temperature: 18 },
    ],
    romanticMessage: "今天的烟台，适合一起散步。",
    romanticDescription: "阳光落在海边，也落在我们想见面的地方。",
    observedAt: "2026-10-05T12:00:00+08:00",
  };
}
