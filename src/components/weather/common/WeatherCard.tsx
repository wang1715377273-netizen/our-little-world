import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function WeatherCard({
  children,
  className,
  as = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div";
}) {
  const Component = as;

  return (
    <Component
      className={cn(
        "rounded-3xl border border-white/25 bg-white/[0.18] shadow-[0_20px_60px_rgb(20_52_83/0.16)] backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </Component>
  );
}
