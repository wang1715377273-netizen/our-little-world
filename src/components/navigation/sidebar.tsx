"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { appConfig } from "@/lib/constants/app";
import { navigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname === "/dashboard";
  return pathname.startsWith(href);
}

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const primary = navigationItems.filter((item) => item.group === "primary");
  const secondary = navigationItems.filter((item) => item.group === "secondary");

  return (
    <TooltipProvider delayDuration={120}>
      <motion.aside
        animate={{ width: collapsed ? 68 : 280 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="glass-panel fixed left-5 top-6 z-30 hidden h-[calc(100vh-3rem)] flex-col overflow-hidden rounded-xl p-3 lg:flex"
      >
        <div className="flex h-11 shrink-0 items-center">
          <button
            type="button"
            aria-label={collapsed ? "展开导航栏" : "收起导航栏"}
            onClick={onToggle}
            className={cn(
              "flex h-11 min-w-0 items-center justify-start gap-3 rounded-md text-left transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2",
              collapsed ? "w-11" : "w-full",
            )}
          >
            <div className="flex size-11 min-h-11 min-w-11 max-w-11 flex-none aspect-square items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-base font-semibold">OL</span>
            </div>
            <div
              className={cn(
                "min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-[340ms] ease-in-out",
                collapsed ? "pointer-events-none max-w-0 opacity-0" : "max-w-[190px] opacity-100 delay-75",
              )}
            >
              <p className="truncate text-sm font-semibold">{appConfig.name}</p>
              <p className="truncate text-xs text-muted-foreground">{appConfig.subtitle}</p>
            </div>
          </button>
        </div>

        <nav className="mt-8 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
          {primary.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex h-11 items-center justify-start gap-3 overflow-hidden rounded-md px-0 text-sm font-medium transition-[width,background-color,box-shadow] duration-[380ms] ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2",
                      collapsed ? "w-11" : "w-full",
                      active ? "bg-primary text-primary-foreground shadow-subtle" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <span className="flex size-11 min-h-11 min-w-11 max-w-11 flex-none aspect-square items-center justify-center">
                      <item.icon className="size-5 shrink-0" />
                    </span>
                    <span
                      className={cn(
                        "min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-[340ms] ease-in-out",
                        collapsed ? "pointer-events-none max-w-0 opacity-0" : "max-w-[190px] opacity-100 delay-75",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
              </Tooltip>
            );
          })}
        </nav>

        <div className="mt-auto flex shrink-0 flex-col gap-1 pt-6">
          <nav className="flex flex-col gap-1">
            {secondary.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-11 items-center justify-start gap-3 overflow-hidden rounded-md px-0 text-sm font-medium text-muted-foreground transition-[width,background-color] duration-[380ms] ease-in-out hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2",
                  collapsed ? "w-11" : "w-full",
                  isActive(pathname, item.href) && "bg-muted text-foreground",
                )}
              >
                <span className="flex size-11 min-h-11 min-w-11 max-w-11 flex-none aspect-square items-center justify-center">
                  <item.icon className="size-5 shrink-0" />
                </span>
                <span
                  className={cn(
                    "min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-[340ms] ease-in-out",
                    collapsed ? "pointer-events-none max-w-0 opacity-0" : "max-w-[190px] opacity-100 delay-75",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
