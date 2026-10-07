"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MobileNavigation } from "@/components/navigation/mobile-navigation";
import { Sidebar } from "@/components/navigation/sidebar";
import { PersistentMusicPlayer } from "@/components/music/persistent-player";
import { cn } from "@/lib/utils/cn";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const isMusicPage = pathname === "/music";

  return (
    <div className="min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
      <main
        className={cn(
          "min-h-screen lg:pt-24 lg:transition-[padding-left] lg:duration-[380ms] lg:ease-[cubic-bezier(0.22,1,0.36,1)]",
          isMusicPage ? "pt-0 app-shell__main--music" : "pt-24",
          isMusicPage ? "pb-0 lg:pb-0" : "pb-32 lg:pb-8",
          collapsed ? "lg:pl-[92px]" : "lg:pl-[324px]",
        )}
      >
        <div className="fixed left-4 right-4 top-4 z-50 flex items-center gap-3 lg:left-auto lg:right-6 lg:top-6 lg:block lg:w-[calc(100vw-2rem)] lg:max-w-sm">
          <MobileNavigation />
          <div className={cn("min-w-0 flex-1", isMusicPage && "hidden")}>
            <PersistentMusicPlayer />
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
