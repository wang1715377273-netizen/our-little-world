import { WeatherCard } from "@/components/weather/common/WeatherCard";

import type { TemperaturePoint } from "@/features/weather/types/weather";

export function TemperatureChart({ points }: { points: TemperaturePoint[] }) {
  const min = Math.min(...points.map((point) => point.temperature));
  const max = Math.max(...points.map((point) => point.temperature));
  const chartPoints = points
    .map((point, index) => {
      const x = points.length === 1 ? 8 : 8 + (560 / (points.length - 1)) * index;
      const y = 112 - ((point.temperature - min) / Math.max(1, max - min)) * 70;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <WeatherCard className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">温度趋势</h2>
          <p className="mt-1 text-xs text-white/60">今天的温度变化</p>
        </div>
        <span className="text-sm text-white/70">{min}° — {max}°</span>
      </div>
      <div className="mt-6 h-44">
        <svg viewBox="0 0 576 136" className="h-full w-full overflow-visible" role="img" aria-label="今日温度从16度升至25度后下降">
          <defs>
            <linearGradient id="weather-chart-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.22" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`M ${chartPoints} L 568 136 L 8 136 Z`} fill="url(#weather-chart-fill)" />
          <polyline points={chartPoints} fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          {chartPoints.split(" ").map((point, index) => {
            const [x, y] = point.split(",");
            return <circle key={point} cx={x} cy={y} r={index === 3 ? 5 : 3.5} fill="#9bc9e9" stroke="white" strokeWidth="2" />;
          })}
        </svg>
      </div>
      <div className="mt-2 flex justify-between text-xs text-white/55">
        {points.map((point) => <span key={point.time}>{point.time}</span>)}
      </div>
    </WeatherCard>
  );
}
