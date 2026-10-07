export type WeatherIconName = "sun" | "partly-cloudy" | "cloud" | "rain" | "wind" | "humidity";

export type WeatherLocation = {
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
};

export type CurrentWeather = {
  temperature: number;
  condition: string;
  icon: WeatherIconName;
  feelsLike: number;
  high: number;
  low: number;
};

export type HourlyWeather = {
  time: string;
  temperature: number;
  icon: WeatherIconName;
};

export type DailyWeather = {
  day: string;
  condition: string;
  high: number;
  low: number;
  icon: WeatherIconName;
};

export type WeatherDetail = {
  kind: "humidity" | "wind" | "visibility" | "pressure" | "precipitation";
  label: string;
  value: string;
};

export type TemperaturePoint = {
  time: string;
  temperature: number;
};

export type WeatherData = {
  location: WeatherLocation;
  dateLabel: string;
  current: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
  details: WeatherDetail[];
  temperatureTrend: TemperaturePoint[];
  romanticMessage: string;
  romanticDescription: string;
  observedAt: string;
};
