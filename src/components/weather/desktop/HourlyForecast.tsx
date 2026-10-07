import { WeatherCard } from "@/components/weather/common/WeatherCard";
import { WeatherIcon } from "@/components/weather/common/WeatherIcon";
import type { HourlyWeather } from "@/features/weather/types/weather";

export function HourlyForecast({ hours }: { hours: HourlyWeather[] }) {
  return (
    <WeatherCard className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">逐小时预报</h2>
        <span className="text-xs text-white/60">未来 8 小时</span>
      </div>
      <div className="mt-6 grid grid-cols-8 divide-x divide-white/15">
        {hours.map((hour) => (
          <div key={hour.time} className="flex flex-col items-center gap-3 px-3 text-center">
            <span className="text-xs text-white/65">{hour.time}</span>
            <WeatherIcon name={hour.icon} className={hour.icon === "sun" ? "text-amber-100" : "text-white/80"} />
            <span className="text-sm font-semibold">{hour.temperature}°</span>
          </div>
        ))}
      </div>
    </WeatherCard>
  );
}
