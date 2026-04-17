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

-- ---------------------------------------------------------------------------
-- 3) Shared dice roll feed (realtime) by character_id
-- ---------------------------------------------------------------------------

create table if not exists public.roll_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null default 'roll' check (event_type in ('roll', 'message')),
  character_id text not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  user_email text not null,
  roller_name text,
  skill text,
  ability text,
  d20 smallint check (d20 between 1 and 20),
  modifier integer,
  total integer,
  message text,
  created_at timestamptz not null default now()
);

comment on table public.roll_events is 'Shared, realtime dice roll events keyed by character_id.';

alter table public.roll_events add column if not exists event_type text;
alter table public.roll_events add column if not exists message text;
alter table public.roll_events add column if not exists roller_name text;
alter table public.roll_events alter column event_type set default 'roll';
update public.roll_events set event_type = 'roll' where event_type is null;
alter table public.roll_events alter column event_type set not null;
alter table public.roll_events drop constraint if exists roll_events_event_type_check;
alter table public.roll_events
  add constraint roll_events_event_type_check check (event_type in ('roll', 'message'));
alter table public.roll_events alter column skill drop not null;
alter table public.roll_events alter column ability drop not null;
alter table public.roll_events alter column d20 drop not null;
alter table public.roll_events alter column modifier drop not null;
alter table public.roll_events alter column total drop not null;
alter table public.roll_events drop constraint if exists roll_events_payload_check;
alter table public.roll_events
  add constraint roll_events_payload_check check (
    (event_type = 'roll' and roller_name is not null and skill is not null and ability is not null and d20 is not null and modifier is not null and total is not null)
    or
    (event_type = 'message' and message is not null and length(trim(message)) > 0)
  );

create index if not exists idx_roll_events_character_created
  on public.roll_events (character_id, created_at desc);

alter table public.roll_events enable row level security;

drop policy if exists "roll_events_select_authenticated" on public.roll_events;
create policy "roll_events_select_authenticated"
  on public.roll_events for select
  using (auth.uid() is not null);

drop policy if exists "roll_events_insert_self" on public.roll_events;
create policy "roll_events_insert_self"
  on public.roll_events for insert
  with check (auth.uid() = user_id);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'roll_events'
  ) then
    alter publication supabase_realtime add table public.roll_events;
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- 4) Admin: clear shared roll/chat log (callable only by users in admin_users)
-- ---------------------------------------------------------------------------

create or replace function public.admin_clear_roll_events()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;
  if not exists (select 1 from public.admin_users au where au.user_id = uid) then
    raise exception 'Not authorized';
  end if;
  -- Some hosts require DELETE to include a WHERE clause (bare DELETE is rejected).
  delete from public.roll_events where true;
end;
$$;

comment on function public.admin_clear_roll_events() is 'Deletes all rows from roll_events; restricted to admin_users.';

grant execute on function public.admin_clear_roll_events() to authenticated;

-- Help PostgREST pick up new/updated RPCs immediately (otherwise you may see “schema cache” errors until reload).
notify pgrst, 'reload schema';
