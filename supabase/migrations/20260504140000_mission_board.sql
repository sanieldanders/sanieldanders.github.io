-- Mission board entries (ninja scroll UI); readable by all authenticated users; CRUD for admin_users only.

create table if not exists public.mission_board_entries (
  id uuid primary key default gen_random_uuid(),
  rank text not null check (rank in ('D', 'C', 'B', 'A', 'S', 'Special')),
  name text not null,
  description text not null default '',
  notes text not null default '',
  reward_experience text not null default '',
  reward_ryo text not null default '',
  reward_downtime text not null default '',
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null
);

comment on table public.mission_board_entries is 'Campaign mission board; rank drives scroll color in the UI.';

create index if not exists idx_mission_board_entries_rank on public.mission_board_entries (rank);
create index if not exists idx_mission_board_entries_created_at on public.mission_board_entries (created_at desc);

alter table public.mission_board_entries enable row level security;

drop policy if exists "mission_board_entries_select_authenticated" on public.mission_board_entries;
create policy "mission_board_entries_select_authenticated"
  on public.mission_board_entries for select
  using (auth.uid() is not null);

drop policy if exists "mission_board_entries_admin_insert" on public.mission_board_entries;
create policy "mission_board_entries_admin_insert"
  on public.mission_board_entries for insert
  with check (
    exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  );

drop policy if exists "mission_board_entries_admin_update" on public.mission_board_entries;
create policy "mission_board_entries_admin_update"
  on public.mission_board_entries for update
  using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

drop policy if exists "mission_board_entries_admin_delete" on public.mission_board_entries;
create policy "mission_board_entries_admin_delete"
  on public.mission_board_entries for delete
  using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

notify pgrst, 'reload schema';
