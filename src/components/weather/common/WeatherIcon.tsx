import { Cloud, CloudRain, CloudSun, Droplets, Sun, Wind } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { WeatherIconName } from "@/features/weather/types/weather";

export type { WeatherIconName } from "@/features/weather/types/weather";

const icons = {
  sun: Sun,
  "partly-cloudy": CloudSun,
  cloud: Cloud,
  rain: CloudRain,
  wind: Wind,
  humidity: Droplets,
} satisfies Record<WeatherIconName, typeof Sun>;

export function WeatherIcon({
  name = "sun",
  className,
}: {
  name?: WeatherIconName;
  className?: string;
}) {
  const Icon = icons[name];

  return <Icon aria-hidden="true" className={cn("size-6", className)} />;
}
