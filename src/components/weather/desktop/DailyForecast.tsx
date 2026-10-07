import { WeatherCard } from "@/components/weather/common/WeatherCard";
import { WeatherIcon } from "@/components/weather/common/WeatherIcon";
import type { DailyWeather } from "@/features/weather/types/weather";


export function DailyForecast({ days }: { days: DailyWeather[] }) {
  return (
    <WeatherCard className="p-6">
      <h2 className="text-base font-semibold">未来 7 天</h2>
      <div className="mt-4 divide-y divide-white/15">
        {days.map(({ day, condition, high, low, icon }) => (
          <div key={day} className="grid grid-cols-[80px_1fr_auto] items-center gap-4 py-3 first:pt-1 last:pb-0">
            <span className="text-sm font-medium">{day}</span>
            <div className="flex items-center gap-3 text-sm text-white/70">
              <WeatherIcon name={icon} className="size-5 text-amber-100" />
              <span>{condition}</span>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="font-semibold">{high}°</span>
              <span className="text-white/50">{low}°</span>
            </div>
          </div>
        ))}
      </div>
    </WeatherCard>
  );
}
