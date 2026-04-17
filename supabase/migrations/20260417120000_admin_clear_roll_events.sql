-- Clear shared roll_events; callable only by users in admin_users.
-- Apply in Supabase Dashboard → SQL Editor, or: supabase db push

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

notify pgrst, 'reload schema';
