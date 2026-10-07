"use client";

import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { MOBILE_NAV_DRAWER_ID, MobileNavigationDrawer } from "@/components/navigation/mobile-navigation-drawer";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeDrawer = () => {
    const drawer = document.getElementById(MOBILE_NAV_DRAWER_ID);
    const activeElement = document.activeElement;

    if (drawer?.contains(activeElement)) {
      if (triggerRef.current) {
        triggerRef.current.focus();
      } else if (activeElement instanceof HTMLElement) {
        activeElement.blur();
      }
    }

    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      {/*
        Hamburger 始终挂载：避免 Drawer 开合时按钮被卸载 / 重新挂载，
        导致 tap 期间目标元素被替换而丢失 click 事件。
        Drawer 打开时它被 Backdrop（z-60）覆盖，视觉与行为保持不变。
      */}
      <button
        ref={triggerRef}
        type="button"
        aria-label="打开导航菜单"
        aria-expanded={open}
        aria-controls={MOBILE_NAV_DRAWER_ID}
        onClick={() => (open ? closeDrawer() : setOpen(true))}
        className="relative z-10 flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-lg bg-card/90 text-foreground shadow-subtle backdrop-blur transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 lg:hidden"
      >
        <Menu className="size-6" aria-hidden="true" />
      </button>

      <MobileNavigationDrawer open={open} onClose={closeDrawer} />
    </>
  );
}
