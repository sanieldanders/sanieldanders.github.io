-- Run once in Supabase Dashboard -> SQL Editor.
-- The NOT EXISTS guard prevents duplicate missions if this script is run again.

insert into public.mission_board_entries (
  rank,
  name,
  description,
  notes,
  reward_experience,
  reward_ryo,
  reward_downtime
)
select
  'C',
  'Quiet Roads, Empty Stores',
  $description$Over the last two weeks, several Konoha-linked supply points throughout the Land of Fire have reported repeated small thefts. No single theft has been severe enough to trigger a major response, but the pattern is escalating.

The stolen goods are practical field supplies: preserved food, canteens, lamp oil, bandages, rope, repair tools, weather cloaks, and small quantities of chakra-restoring provisions. No valuables, weapons, or luxury goods have been targeted.

Your team is assigned to investigate the theft pattern, identify the parties responsible, recover stolen supplies where possible, and determine whether the thefts threaten Konoha trade, patrol routes, or internal security.

Primary Objectives:

- Stop further thefts from Konoha-linked supply points.
- Identify the thieves and their intended use for the stolen provisions.
- Locate and secure any hidden supply caches.
- Report on whether the thefts are connected to a larger organization.

Secondary Objectives:

- Capture suspects alive.
- Protect civilian supply workers.
- Avoid revealing Konoha patrol routes or logistics records.
- Recover evidence identifying the network’s next relay site.$description$,
  $notes$Initial reports indicate the thieves avoid main roads and strike only lightly guarded locations. Investigators have found signs of small caches hidden along minor forest paths, creek crossings, and abandoned charcoal-burner trails.

The pattern suggests the supplies are being moved gradually toward multiple hidden relay sites rather than sold. Treat this as a potential intelligence operation. Do not assume the thieves are acting independently.

Use discretion around civilians and merchants. The supply points are Konoha-affiliated, but most workers are noncombatants.$notes$,
  '600 XP',
  '450 Ryo; additional 100 Ryo for recovering a cache network map or identifying the organization funding the operation',
  '6 weeks'
where not exists (
  select 1
  from public.mission_board_entries
  where rank = 'C'
    and name = 'Quiet Roads, Empty Stores'
);

select *
from public.mission_board_entries
where rank = 'C'
  and name = 'Quiet Roads, Empty Stores';
