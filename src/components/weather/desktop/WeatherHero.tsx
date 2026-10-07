import { MapPin, RefreshCw } from "lucide-react";
import { WeatherCard } from "@/components/weather/common/WeatherCard";
import { WeatherIcon } from "@/components/weather/common/WeatherIcon";
import type { CurrentWeather, WeatherLocation } from "@/features/weather/types/weather";

export function WeatherHero({
  current,
  location,
  dateLabel,
}: {
  current: CurrentWeather;
  location: WeatherLocation;
  dateLabel: string;
}) {
  return (
    <WeatherCard className="relative overflow-hidden p-8 lg:p-10">
      <div className="relative flex items-start justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <MapPin className="size-4" />
            <span>{location.city}，{location.country}</span>
          </div>
          <p className="mt-8 text-lg font-medium text-white/75">{dateLabel}</p>
          <div className="mt-2 flex items-start gap-5">
            <span className="text-[7rem] font-semibold leading-none tracking-[-0.08em]">{current.temperature}°</span>
            <div className="pt-4">
              <WeatherIcon name={current.icon} className="size-14 text-amber-100" />
              <p className="mt-3 text-xl font-medium">{current.condition}</p>
              <p className="mt-1 text-sm text-white/70">体感温度 {current.feelsLike}°</p>
            </div>
          </div>
          <div className="mt-6 flex gap-5 text-sm text-white/75">
            <span>最高 {current.high}°</span>
            <span>最低 {current.low}°</span>
          </div>
        </div>
        <button
          type="button"
          aria-label="刷新天气"
          className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/75 transition hover:bg-white/20 hover:text-white"
        >
          <RefreshCw className="size-4" />
        </button>
      </div>
    </WeatherCard>
  );
}
