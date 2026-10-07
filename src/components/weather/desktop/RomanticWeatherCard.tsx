import { Heart } from "lucide-react";
import { WeatherCard } from "@/components/weather/common/WeatherCard";

export function RomanticWeatherCard({
  message,
  description,
}: {
  message: string;
  description: string;
}) {
  return (
    <WeatherCard className="flex items-center justify-between gap-8 overflow-hidden p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">Our Little World</p>
        <h2 className="mt-3 text-xl font-semibold">{message}</h2>
        <p className="mt-2 text-sm text-white/70">{description}</p>
      </div>
      <Heart className="mr-5 size-10 fill-rose-200/70 text-rose-100/90" />
    </WeatherCard>
  );
}
