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
  },
  {
    id: 'shikamaru-nara',
    portraitUrl: './npcs/Nara,Shikamaru.png',
    name: 'Shikamaru Nara',
    age: '62',
    birthday: 'September 22nd',
    occupationRank: 'Hokage',
    affiliations: 'Konoha',
    description: [
      'Shikamaru is the current Hokage and the highest active authority in Konoha. He is the one who receives major reports, delegates investigations upward through the chain of command, and decides how much freedom lower-ranked shinobi are actually allowed to have.',
      'Shikamaru is an older man who clearly looks his age, with a lean, intelligent face lined by years of pressure and decision-making. He has dark hair streaked with gray, worn in the classic Nara style pulled back into a high spiked ponytail, though thinner and more weathered now. He wears a short pointed beard threaded with gray, and his expression is often tired but intensely observant.'
    ].join('\n\n')
  },
  {
    id: 'sarada-uchiha',
    portraitUrl: './npcs/Uchiha,Sarada.png',
    name: 'Sarada Uchiha',
    age: '40',
    birthday: 'March 31st',
    occupationRank: 'Future Hokage',
    affiliations: 'Konoha',
    description:
      'Sarada Uchiha is one of the most important figures in Konoha\'s current leadership, serving on the council and standing as the village\'s clearest symbol of continuity, strength, and future authority. She is calm, precise, and intensely composed, known for elite combat ability, battlefield awareness, and a reputation as a duelist and strategist rather than a loud public icon. In practice, she helps shape village policy at the highest level while carrying the weight of being the woman everyone assumes will one day become Hokage.'
  }
];
