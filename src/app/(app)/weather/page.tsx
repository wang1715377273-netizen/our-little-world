import { WeatherDesktop } from "@/components/weather/desktop/WeatherDesktop";
import { WeatherMobile } from "@/components/weather/mobile/WeatherMobile";
import { WeatherProvider } from "@/features/weather/store/weatherStore";

export default function WeatherPage() {
  return (
    <WeatherProvider>
      <WeatherDesktop />
      <WeatherMobile />
    </WeatherProvider>
  );
}
