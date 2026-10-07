export type ID = string;

export type CoupleRole = "partner_a" | "partner_b";

export type Mood =
  | "happy"
  | "sad"
  | "angry"
  | "tired"
  | "annoyed"
  | "miss_you"
  | "speechless"
  | "anxious"
  | "wronged"
  | "afraid"
  | "serious"
  | "emo";

export type Moment = {
  id: ID;
  coupleId: ID;
  date: string;
  title: string;
  content: string;
  imageUrl?: string;
  tags: string[];
  location?: string;
  mood?: Mood;
};

export type GalleryPhoto = {
  id: ID;
  coupleId: ID;
  albumId?: ID;
  src: string;
  alt: string;
  title: string;
  date: string;
  tags: string[];
  isFavorite: boolean;
};

export type Letter = {
  id: ID;
  coupleId: ID;
  title: string;
  excerpt: string;
  body: string;
  signature?: string;
  authorName: string;
  date?: string;
  isRead: boolean;
};

export type Anniversary = {
  id: ID;
  coupleId: ID;
  title: string;
  date: string;
  description: string;
  type: "met" | "together" | "birthday" | "milestone" | "custom";
  repeat: "none" | "yearly";
};

export type Song = {
  id: ID;
  coupleId: ID;
  title: string;
  artist: string;
  coverUrl?: string;
  audioUrl?: string;
  lyricExcerpt?: string;
};

export type GameSummary = {
  id: ID;
  title: string;
  description: string;
  status: "planned" | "ready" | "draft";
};

export type EmotionItem = {
  id: Mood;
  label: string;
  tone: string;
  note: string;
};
