"use client";

import { CloudSun, Settings2 } from "lucide-react";
import { WeatherBackground } from "@/components/weather/common/WeatherBackground";
import { DailyForecast } from "@/components/weather/desktop/DailyForecast";
import { HourlyForecast } from "@/components/weather/desktop/HourlyForecast";
import { RomanticWeatherCard } from "@/components/weather/desktop/RomanticWeatherCard";
import { TemperatureChart } from "@/components/weather/desktop/TemperatureChart";
import { WeatherDetailGrid } from "@/components/weather/desktop/WeatherDetailGrid";
import { WeatherHero } from "@/components/weather/desktop/WeatherHero";
import { useWeather } from "@/features/weather/hooks/useWeather";

export function WeatherDesktop() {
  const { weather } = useWeather();

  if (!weather) return null;

  return (
    <div className="hidden min-h-screen lg:block">
      <WeatherBackground>
        <main className="mx-auto w-full max-w-[1280px] px-10 py-8">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl border border-white/25 bg-white/15">
                <CloudSun className="size-6 text-amber-100" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-wide">天气</p>
                <p className="mt-0.5 text-xs text-white/60">Our Little World</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="天气设置"
              className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
            >
              <Settings2 className="size-5" />
            </button>
          </header>

          <div className="mt-8 grid grid-cols-[1.2fr_0.8fr] gap-5">
            <WeatherHero current={weather.current} location={weather.location} dateLabel={weather.dateLabel} />
            <DailyForecast days={weather.daily} />
          </div>

          <div className="mt-5">
            <HourlyForecast hours={weather.hourly} />
          </div>

          <div className="mt-5">
            <TemperatureChart points={weather.temperatureTrend} />
          </div>

          <div className="mt-5">
            <WeatherDetailGrid details={weather.details} />
          </div>

          <div className="mt-5">
            <RomanticWeatherCard message={weather.romanticMessage} description={weather.romanticDescription} />
          </div>
        </main>
      </WeatherBackground>
    </div>
  );
}
