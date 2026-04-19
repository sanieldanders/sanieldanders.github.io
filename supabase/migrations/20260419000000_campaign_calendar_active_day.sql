-- Single-row state: which in-world day is "today" for the campaign (highlighted on the calendar).
-- active_on uses Gregorian year 2000 as anchor, matching calendar_events.

create table if not exists public.campaign_calendar_state (
  id smallint primary key default 1 check (id = 1),
  active_on date not null,
  anb_year int not null default 60 check (anb_year >= 1 and anb_year <= 9999),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

comment on table public.campaign_calendar_state is 'Singleton (id=1): campaign active calendar day; UI shows month/day + ANB year.';

alter table public.campaign_calendar_state
  drop constraint if exists campaign_calendar_state_active_on_year_2000;

alter table public.campaign_calendar_state
  add constraint campaign_calendar_state_active_on_year_2000 check (extract(year from active_on) = 2000);

insert into public.campaign_calendar_state (id, active_on, anb_year)
values (1, '2000-01-01', 60)
on conflict (id) do nothing;

alter table public.campaign_calendar_state enable row level security;

drop policy if exists "campaign_calendar_state_select_authenticated" on public.campaign_calendar_state;
create policy "campaign_calendar_state_select_authenticated"
  on public.campaign_calendar_state for select
  using (auth.uid() is not null);

drop policy if exists "campaign_calendar_state_admin_update" on public.campaign_calendar_state;
create policy "campaign_calendar_state_admin_update"
  on public.campaign_calendar_state for update
  using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

notify pgrst, 'reload schema';
