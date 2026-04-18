-- World calendar events (in-universe year shown as 60 ANB); stored dates use Gregorian year 2000 as a fixed anchor (leap year).
-- Apply in Supabase Dashboard → SQL Editor, or: supabase db push

create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  event_on date not null,
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null
);

comment on table public.calendar_events is 'Campaign calendar entries; UI displays month/day in ANB year; event_on uses year 2000 only.';

alter table public.calendar_events
  drop constraint if exists calendar_events_event_on_year_2000;

alter table public.calendar_events
  add constraint calendar_events_event_on_year_2000 check (extract(year from event_on) = 2000);

create index if not exists idx_calendar_events_event_on on public.calendar_events (event_on);

alter table public.calendar_events enable row level security;

drop policy if exists "calendar_events_select_authenticated" on public.calendar_events;
create policy "calendar_events_select_authenticated"
  on public.calendar_events for select
  using (auth.uid() is not null);

drop policy if exists "calendar_events_admin_insert" on public.calendar_events;
create policy "calendar_events_admin_insert"
  on public.calendar_events for insert
  with check (
    exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  );

drop policy if exists "calendar_events_admin_update" on public.calendar_events;
create policy "calendar_events_admin_update"
  on public.calendar_events for update
  using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

drop policy if exists "calendar_events_admin_delete" on public.calendar_events;
create policy "calendar_events_admin_delete"
  on public.calendar_events for delete
  using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

notify pgrst, 'reload schema';
