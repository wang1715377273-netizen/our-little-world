import { Droplets, Eye, Gauge, Umbrella, Wind } from "lucide-react";
import { WeatherCard } from "@/components/weather/common/WeatherCard";
import type { WeatherDetail } from "@/features/weather/types/weather";

const detailIcons = {
  humidity: Droplets,
  wind: Wind,
  visibility: Eye,
  pressure: Gauge,
  precipitation: Umbrella,
} as const;

export function WeatherDetailGrid({ details }: { details: WeatherDetail[] }) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {details.map(({ kind, label, value }) => {
        const Icon = detailIcons[kind];
        return (
        <WeatherCard key={label} className="p-5">
          <Icon className="size-5 text-white/70" />
          <p className="mt-5 text-xs text-white/60">{label}</p>
          <p className="mt-1 text-sm font-semibold">{value}</p>
        </WeatherCard>
        );
      })}
    </div>
  );
}
