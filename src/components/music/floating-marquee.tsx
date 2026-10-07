"use client";

import type { CSSProperties, ReactNode } from "react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

type FloatingMarqueeProps = {
  children: ReactNode;
  resetKey: string;
  playing: boolean;
  className?: string;
};

export function FloatingMarquee({
  children,
  resetKey,
  playing,
  className,
}: FloatingMarqueeProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const [distance, setDistance] = useState(0);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;
    setDistance(Math.max(0, content.scrollWidth - viewport.clientWidth));
  }, []);

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    if (viewportRef.current) observer.observe(viewportRef.current);
    if (contentRef.current) observer.observe(contentRef.current);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, resetKey, children]);

  const duration = Math.max(8, distance / 38 + 3.5);

  return (
    <div
      ref={viewportRef}
      className={cn("floating-marquee", distance > 0 && "floating-marquee--active", className)}
    >
      <span
        key={resetKey}
        ref={contentRef}
        className="floating-marquee__content"
        style={
          {
            "--floating-marquee-distance": `${distance}px`,
            "--floating-marquee-duration": `${duration}s`,
            "--floating-marquee-play-state": playing ? "running" : "paused",
          } as CSSProperties
        }
      >
        {children}
      </span>
    </div>
  );
}
