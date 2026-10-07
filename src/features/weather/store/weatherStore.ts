"use client";

import { create } from "zustand";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { getMockWeather } from "@/features/weather/api/mockWeather";
import type { WeatherData } from "@/features/weather/types/weather";

type WeatherState = {
  weather: WeatherData | null;
  setWeather: (weather: WeatherData | null) => void;
};

export const useWeatherStore = create<WeatherState>((set) => ({
  weather: getMockWeather(),
  setWeather: (weather) => set({ weather }),
}));

export function WeatherProvider({ children }: { children: ReactNode }) {
  const weather = useWeatherStore((state) => state.weather);
  const setWeather = useWeatherStore((state) => state.setWeather);

  useEffect(() => {
    if (!weather) setWeather(getMockWeather());
  }, [setWeather, weather]);

  return children;
}
