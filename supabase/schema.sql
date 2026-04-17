-- Jutsu Companion — Supabase schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
--
-- Requires: Auth enabled (auth.users is created by Supabase).
-- App data shape matches localStorage / Electron JSON: { "profiles": [], "characters": [] }

-- ---------------------------------------------------------------------------
-- 1) Main cloud save: one row per user (whole AppData as JSON)
-- ---------------------------------------------------------------------------

create table if not exists public.user_app_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{"profiles":[],"characters":[]}'::jsonb,
  updated_at timestamptz not null default now()
);

comment on table public.user_app_data is 'Per-user saved state for the Angular app (profiles + characters).';
comment on column public.user_app_data.data is 'Serialized AppData: { profiles, characters }';

-- Auto-touch updated_at on row updates
create or replace function public.set_user_app_data_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_user_app_data_updated on public.user_app_data;
create trigger trg_user_app_data_updated
  before update on public.user_app_data
  for each row
  execute function public.set_user_app_data_updated_at();

alter table public.user_app_data enable row level security;

drop policy if exists "user_app_data_select_own" on public.user_app_data;
create policy "user_app_data_select_own"
  on public.user_app_data for select
  using (auth.uid() = user_id);

drop policy if exists "user_app_data_insert_own" on public.user_app_data;
create policy "user_app_data_insert_own"
  on public.user_app_data for insert
  with check (auth.uid() = user_id);

drop policy if exists "user_app_data_update_own" on public.user_app_data;
create policy "user_app_data_update_own"
  on public.user_app_data for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "user_app_data_delete_own" on public.user_app_data;
create policy "user_app_data_delete_own"
  on public.user_app_data for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 2) Optional: account-level profile (display name, etc.) — not in-game Profile
-- ---------------------------------------------------------------------------

create table if not exists public.user_account_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.user_account_profiles is 'Optional UI metadata for the logged-in user (distinct from app Profile jutsu lists).';

create or replace function public.set_user_account_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_user_account_profiles_updated on public.user_account_profiles;
create trigger trg_user_account_profiles_updated
  before update on public.user_account_profiles
  for each row
  execute function public.set_user_account_profiles_updated_at();

alter table public.user_account_profiles enable row level security;

drop policy if exists "user_account_profiles_select_own" on public.user_account_profiles;
create policy "user_account_profiles_select_own"
  on public.user_account_profiles for select
  using (auth.uid() = user_id);

drop policy if exists "user_account_profiles_insert_own" on public.user_account_profiles;
create policy "user_account_profiles_insert_own"
  on public.user_account_profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "user_account_profiles_update_own" on public.user_account_profiles;
create policy "user_account_profiles_update_own"
  on public.user_account_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "user_account_profiles_delete_own" on public.user_account_profiles;
create policy "user_account_profiles_delete_own"
  on public.user_account_profiles for delete
  using (auth.uid() = user_id);
