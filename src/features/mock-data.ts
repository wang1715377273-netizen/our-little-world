import {
  addDays,
  differenceInCalendarDays,
  format,
  isAfter,
  parseISO,
} from "date-fns";
import { zhCN } from "date-fns/locale";
import type { Anniversary, EmotionItem, GalleryPhoto, GameSummary, Moment, Song } from "@/types/domain";

export const coupleProfile = {
  coupleId: "mock-couple-001",
  name: "我们之间",
  partnerA: "你",
  partnerB: "我",
  initialsA: "Y",
  initialsB: "M",
  metAt: "2023-12-31",
  togetherAt: "2024-01-01",
};

export const moments: Moment[] = [
  {
    id: "moment-001",
    coupleId: coupleProfile.coupleId,
    date: "2023-12-31",
    title: "第一次打招呼",
    content: "很安静的开始，后来慢慢变成了一个只属于我们的世界。",
    tags: ["初见", "回忆"],
    location: "线上",
    mood: "happy",
  },
  {
    id: "moment-002",
    coupleId: coupleProfile.coupleId,
    date: "2024-01-01",
    title: "在一起",
    content: "从这一天开始，时间有了更温柔的数法。",
    imageUrl: "/images/gallery-1.svg",
    tags: ["纪念日"],
    mood: "serious",
  },
  {
    id: "moment-003",
    coupleId: coupleProfile.coupleId,
    date: "2024-04-10",
    title: "一百天",
    content: "一些小习惯，慢慢变成了我们之间的节奏。",
    tags: ["里程碑"],
    mood: "happy",
  },
  {
    id: "moment-004",
    coupleId: coupleProfile.coupleId,
    date: "2026-09-27",
    title: "一千天",
    content: "不是终点，只是很长故事里一个发光的记号。",
    imageUrl: "/images/gallery-3.svg",
    tags: ["一千天", "里程碑"],
    mood: "happy",
  },
];

export const photos: GalleryPhoto[] = [
  {
    id: "photo-004",
    coupleId: coupleProfile.coupleId,
    src: "/images/gallery/our-memory-001.jpg",
    alt: "我们的真实照片，竖幅构图",
    title: "我们的记忆 · 一",
    date: "2026-10-01",
    tags: ["真实照片", "回忆"],
    isFavorite: true,
  },
  {
    id: "photo-005",
    coupleId: coupleProfile.coupleId,
    src: "/images/gallery/our-memory-002.jpg",
    alt: "我们的真实照片，横幅构图",
    title: "我们的记忆 · 二",
    date: "2026-10-01",
    tags: ["真实照片", "日常"],
    isFavorite: false,
  },
];

export const anniversaries: Anniversary[] = [
  {
    id: "anniversary-001",
    coupleId: coupleProfile.coupleId,
    title: "相识的日子",
    date: "2023-12-31",
    description: "这个小世界开始的地方。",
    type: "met",
    repeat: "yearly",
  },
  {
    id: "anniversary-002",
    coupleId: coupleProfile.coupleId,
    title: "在一起纪念日",
    date: "2024-01-01",
    description: "我们正式开始计时的日子。",
    type: "together",
    repeat: "yearly",
  },
  {
    id: "anniversary-003",
    coupleId: coupleProfile.coupleId,
    title: "一千天",
    date: "2026-09-27",
    description: "很长故事里的一个重要记号。",
    type: "milestone",
    repeat: "none",
  },
];

export const songs: Song[] = [
  {
    id: "song-003",
    coupleId: coupleProfile.coupleId,
    title: "慢慢喜欢你",
    artist: "莫文蔚",
    audioUrl: "/audio/manman-xihuan-ni.mp3",
    lyricExcerpt: "真实音频已接入常驻播放器。",
  },
];

export const games: GameSummary[] = [
  { id: "memory-match", title: "记忆翻翻看", description: "用照片和时光节点做一组只属于我们的配对游戏。", status: "planned" },
  { id: "couple-quiz", title: "默契问答", description: "回答一些小问题，再重新认识彼此一次。", status: "planned" },
  { id: "guess-the-date", title: "猜猜哪一天", description: "从一段回忆里猜出它发生的日期。", status: "draft" },
  { id: "our-trivia", title: "我们的题库", description: "未来会从真实回忆里生成专属小测验。", status: "planned" },
];

export const emotions: EmotionItem[] = [
  { id: "happy", label: "开心", tone: "明亮", note: "把今天变轻的原因存下来。" },
  { id: "sad", label: "伤心", tone: "轻轻的", note: "一个可以慢慢说出来的地方。" },
  { id: "angry", label: "生气", tone: "克制", note: "先留一点空间，再好好说话。" },
  { id: "tired", label: "疲惫", tone: "柔软", note: "休息本身也很重要。" },
  { id: "annoyed", label: "烦躁", tone: "坦诚", note: "小摩擦也可以被温柔地看见。" },
  { id: "miss_you", label: "想我", tone: "靠近", note: "写给距离的一句话。" },
  { id: "speechless", label: "无语", tone: "安静", note: "不急着解释，也没关系。" },
  { id: "anxious", label: "焦虑", tone: "稳定", note: "以后可以在这里放一些安心的话。" },
  { id: "wronged", label: "委屈", tone: "认真", note: "先把感受放好，再慢慢讲清楚。" },
  { id: "afraid", label: "害怕", tone: "保护", note: "未来可以放一些安慰和陪伴。" },
  { id: "serious", label: "认真", tone: "清楚", note: "重要的话，值得有一个安静的房间。" },
  { id: "emo", label: "emo", tone: "低落", note: "给那些说不清楚的夜晚。" },
];

export const dashboardStats = {
  today: format(new Date(), "yyyy年M月d日 EEEE", { locale: zhCN }),
  daysTogether: differenceInCalendarDays(new Date(), parseISO(coupleProfile.togetherAt)) + 1,
  daysKnown: differenceInCalendarDays(new Date(), parseISO(coupleProfile.metAt)) + 1,
  nextAnniversary: anniversaries
    .map((item) => {
      const original = parseISO(item.date);
      const candidate = item.repeat === "yearly" ? new Date(new Date().getFullYear(), original.getMonth(), original.getDate()) : original;
      const date = isAfter(candidate, new Date()) ? candidate : addDays(candidate, item.repeat === "yearly" ? 365 : 0);
      return { ...item, daysUntil: Math.max(0, differenceInCalendarDays(date, new Date())) };
    })
    .sort((a, b) => a.daysUntil - b.daysUntil)[0],
  quote: "很小的普通瞬间，也会成为故事的一部分。",
};
