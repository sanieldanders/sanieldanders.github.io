import type { NpcEncyclopediaEntry } from '../models/app-data.model';

/** Shipped NPC profiles (add images under `public/npcs/`). */
export const NPC_ENCYCLOPEDIA_BUILTIN: readonly NpcEncyclopediaEntry[] = [
  {
    id: 'enya-sarutobi',
    portraitUrl: './npcs/Sarutobi,Enya.png',
    name: 'Enya Sarutobi',
    age: '24',
    birthday: 'September 9th',
    occupationRank: 'Jonin',
    affiliations: 'Konoha',
    description: [
      'Enya is a tall, lean kunoichi with a poised, athletic build. She has long raven-black hair worn in a tight mid-back braid, angular features, and sharp observant eyes with a quiet warmth behind them. She wears standard shinobi attire with a fitted flak jacket, dark flexible layers, fingerless gloves, and a utility pouch.',
      'A defining detail is her bo staff, which she carries with relaxed familiarity. It is not decorative, it is a natural part of how she moves and fights.',
      'In combat Enya is a skilled, composed battlefield controller rather than a reckless frontliner. She is fast, precise, and measured, and she uses her staff and Wind Release with the kind of discipline that makes her feel extremely competent without showboating.'
    ].join('\n\n')
  }
];
