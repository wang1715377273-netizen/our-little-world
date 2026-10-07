"use client";

import { useWeatherStore } from "@/features/weather/store/weatherStore";

export function useWeather() {
  const weather = useWeatherStore((state) => state.weather);

  return {
    weather,
    isLoading: weather === null,
  };
}
