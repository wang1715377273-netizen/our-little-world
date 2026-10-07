create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.couples (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Between Us',
  started_at date,
  met_at date,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type public.couple_member_role as enum ('partner_a', 'partner_b');

create table public.couple_members (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.couple_member_role not null,
  joined_at timestamptz not null default now(),
  unique (couple_id, user_id),
  unique (couple_id, role)
);

create table public.moments (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  title text not null,
  content text,
  happened_at timestamptz not null,
  location text,
  mood text,
  tags text[] not null default '{}',
  cover_photo_id uuid,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.photo_albums (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  title text not null,
  description text,
  created_at timestamptz not null default now()
);

create table public.photos (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  album_id uuid references public.photo_albums(id) on delete set null,
  storage_path text not null,
  title text,
  alt text,
  captured_at timestamptz,
  tags text[] not null default '{}',
  is_favorite boolean not null default false,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.moments
  add constraint moments_cover_photo_fk foreign key (cover_photo_id) references public.photos(id) on delete set null;

create table public.letters (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  title text not null,
  body text not null,
  author_id uuid references public.profiles(id) on delete set null,
  is_private boolean not null default true,
  unlock_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cycle_records (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  record_date date not null,
  status text,
  note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (couple_id, record_date)
);

create table public.songs (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  title text not null,
  artist text,
  cover_storage_path text,
  audio_storage_path text,
  lyrics text,
  created_at timestamptz not null default now()
);

create table public.anniversaries (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  title text not null,
  event_date date not null,
  description text,
  type text not null default 'custom',
  repeat text not null default 'none',
  created_at timestamptz not null default now()
);

create table public.games (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  status text not null default 'planned',
  created_at timestamptz not null default now()
);

create table public.game_records (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  game_id uuid not null references public.games(id) on delete cascade,
  player_id uuid references public.profiles(id) on delete set null,
  score integer,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.emotions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  description text
);

create table public.emotion_notes (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  emotion_id uuid references public.emotions(id) on delete set null,
  author_id uuid references public.profiles(id) on delete set null,
  note text not null,
  media_storage_path text,
  created_at timestamptz not null default now()
);

create index moments_couple_happened_idx on public.moments (couple_id, happened_at desc);
create index photos_couple_created_idx on public.photos (couple_id, created_at desc);
create index letters_couple_created_idx on public.letters (couple_id, created_at desc);
create index cycle_records_couple_date_idx on public.cycle_records (couple_id, record_date desc);
create index emotion_notes_couple_created_idx on public.emotion_notes (couple_id, created_at desc);

create or replace function public.is_couple_member(target_couple_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.couple_members
    where couple_id = target_couple_id
      and user_id = auth.uid()
  );
$$;

alter table public.profiles enable row level security;
alter table public.couples enable row level security;
alter table public.couple_members enable row level security;
alter table public.moments enable row level security;
alter table public.photo_albums enable row level security;
alter table public.photos enable row level security;
alter table public.letters enable row level security;
alter table public.cycle_records enable row level security;
alter table public.songs enable row level security;
alter table public.anniversaries enable row level security;
alter table public.games enable row level security;
alter table public.game_records enable row level security;
alter table public.emotions enable row level security;
alter table public.emotion_notes enable row level security;

create policy "profiles_self_select" on public.profiles for select using (id = auth.uid());
create policy "profiles_self_update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy "couples_member_select" on public.couples for select using (public.is_couple_member(id));
create policy "couple_members_member_select" on public.couple_members for select using (public.is_couple_member(couple_id));

create policy "moments_member_all" on public.moments for all using (public.is_couple_member(couple_id)) with check (public.is_couple_member(couple_id));
create policy "photo_albums_member_all" on public.photo_albums for all using (public.is_couple_member(couple_id)) with check (public.is_couple_member(couple_id));
create policy "photos_member_all" on public.photos for all using (public.is_couple_member(couple_id)) with check (public.is_couple_member(couple_id));
create policy "letters_member_all" on public.letters for all using (public.is_couple_member(couple_id)) with check (public.is_couple_member(couple_id));
create policy "cycle_records_member_all" on public.cycle_records for all using (public.is_couple_member(couple_id)) with check (public.is_couple_member(couple_id));
create policy "songs_member_all" on public.songs for all using (public.is_couple_member(couple_id)) with check (public.is_couple_member(couple_id));
create policy "anniversaries_member_all" on public.anniversaries for all using (public.is_couple_member(couple_id)) with check (public.is_couple_member(couple_id));
create policy "game_records_member_all" on public.game_records for all using (public.is_couple_member(couple_id)) with check (public.is_couple_member(couple_id));
create policy "emotion_notes_member_all" on public.emotion_notes for all using (public.is_couple_member(couple_id)) with check (public.is_couple_member(couple_id));

create policy "games_read_all_authenticated" on public.games for select to authenticated using (true);
create policy "emotions_read_all_authenticated" on public.emotions for select to authenticated using (true);
