"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { appConfig } from "@/lib/constants/app";
import { navigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

export const MOBILE_NAV_DRAWER_ID = "mobile-navigation-drawer";

const DRAWER_DURATION = 0.4;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname === "/dashboard";
  return pathname.startsWith(href);
}

export function MobileNavigationDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const primary = navigationItems.filter((item) => item.group === "primary");
  const secondary = navigationItems.filter((item) => item.group === "secondary");

  // 关闭后仍需保留滑出动画，因此在动画结束后再切换 visibility；
  // pointer-events 必须立即失效，否则遮罩会在动画期间继续吞掉 TopBar 的点击。
  const layerStyle = {
    pointerEvents: open ? "auto" : "none",
    visibility: open ? "visible" : "hidden",
    transition: open ? "visibility 0s" : `visibility 0s linear ${DRAWER_DURATION * 1000}ms`,
  } as const;

  return (
    <>
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: DRAWER_DURATION, ease: "easeInOut" }}
        onClick={onClose}
        style={layerStyle}
        className="fixed inset-0 z-[60] bg-foreground/18 backdrop-blur-[5px] lg:hidden"
      />
      <motion.aside
        id={MOBILE_NAV_DRAWER_ID}
        role="dialog"
        aria-modal="true"
        aria-label="移动端导航"
        aria-hidden={!open}
        inert={!open}
        initial={false}
        animate={{ x: open ? 0 : "-100%" }}
        transition={{ duration: DRAWER_DURATION, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
        style={layerStyle}
        className="glass-panel fixed inset-y-0 left-0 z-[70] flex h-[100dvh] max-h-[100dvh] w-[50vw] flex-col overflow-hidden rounded-r-xl rounded-l-none px-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] lg:hidden"
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-border/70 pb-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-semibold">OL</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold">{appConfig.name}</p>
            <p className="truncate text-[10px] text-muted-foreground">{appConfig.subtitle}</p>
          </div>
        </div>

        <nav className="mt-4 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto" aria-label="主要导航">
          {primary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              className={cn(
                "flex min-h-9 shrink-0 touch-manipulation items-center gap-2 rounded-md px-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
                isActive(pathname, item.href)
                  ? "bg-primary text-primary-foreground shadow-subtle"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <span className="flex size-7 shrink-0 items-center justify-center">
                <item.icon className="size-4 shrink-0" />
              </span>
              <span className="min-w-0 whitespace-nowrap">{item.label}</span>
            </Link>
          ))}
        </nav>

        <nav className="mt-4 flex shrink-0 flex-col gap-1 border-t border-border/70 pt-4" aria-label="辅助导航">
          {secondary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              className={cn(
                "flex min-h-9 shrink-0 touch-manipulation items-center gap-2 rounded-md px-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
                isActive(pathname, item.href)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <span className="flex size-7 shrink-0 items-center justify-center">
                <item.icon className="size-4 shrink-0" />
              </span>
              <span className="min-w-0 whitespace-nowrap">{item.label}</span>
            </Link>
          ))}
        </nav>
      </motion.aside>
    </>
  );
}
