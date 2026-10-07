import {
  CalendarDays,
  Camera,
  CloudSun,
  Gamepad2,
  HeartHandshake,
  Home,
  Info,
  Mail,
  Music2,
  Settings,
  Smile,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavigationItem = {
  href: string;
  label: string;
  shortLabel?: string;
  icon: LucideIcon;
  group: "primary" | "secondary";
  mobilePrimary?: boolean;
};

export const navigationItems: NavigationItem[] = [
  { href: "/dashboard", label: "首页", shortLabel: "首页", icon: Home, group: "primary", mobilePrimary: true },
  { href: "/moments", label: "我们的时光", shortLabel: "时光", icon: Sparkles, group: "primary", mobilePrimary: true },
  { href: "/weather", label: "天气", icon: CloudSun, group: "primary" },
  { href: "/gallery", label: "相册", shortLabel: "相册", icon: Camera, group: "primary", mobilePrimary: true },
  { href: "/letters", label: "情书", shortLabel: "情书", icon: Mail, group: "primary", mobilePrimary: true },
  { href: "/cycle", label: "经期日历", icon: CalendarDays, group: "primary" },
  { href: "/music", label: "我们的歌", icon: Music2, group: "primary" },
  { href: "/anniversaries", label: "纪念日", icon: HeartHandshake, group: "primary" },
  { href: "/games", label: "一起玩", icon: Gamepad2, group: "primary" },
  { href: "/emotions", label: "情绪盒", icon: Smile, group: "primary" },
  { href: "/about", label: "关于我们", icon: Info, group: "secondary" },
  { href: "/settings", label: "设置", icon: Settings, group: "secondary" },
];

export const mobilePrimaryItems = navigationItems.filter((item) => item.mobilePrimary);
export const mobileDrawerItems = navigationItems.filter((item) => !item.mobilePrimary);
