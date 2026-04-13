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
  },
  {
    id: 'shun-aburame',
    portraitUrl: './npcs/Aburame,Shun.png',
    name: 'Shun Aburame',
    age: '44',
    birthday: 'June 12th',
    occupationRank: 'Head Academy Instructor',
    affiliations: 'Konoha',
    description:
      'Shun Aburame is a quiet, observant academy instructor known for patience, discipline, and a teaching style that values steady competence over flashy talent. He comes across as hard to impress but fair, the kind of teacher who notices everything, speaks only when needed, and takes the responsibility of shaping future shinobi very seriously. To students, he feels like someone calm, exacting, and deeply committed to making them capable rather than comfortable.'
  },
  {
    id: 'kaede-hyuga',
    portraitUrl: './npcs/Hyuga,Kaede.png',
    name: 'Kaede Hyuga',
    age: '38',
    birthday: 'April 14th',
    occupationRank: 'Commander of the Police Shinobi Division',
    affiliations: 'Konoha',
    description:
      'Kaede Hyuga is a disciplined, truth-driven investigator who balances sharp professionalism with a strong commitment to evidence over assumption. She is controlled, serious, and difficult to sway, the kind of leader who investigates before judging and who treats truth as more important than convenience. Within Konoha, she represents the line between ordinary law enforcement and the larger political and military structure above it.'
  },
  {
    id: 'rei-hatake',
    portraitUrl: './npcs/Hatake,Rei.png',
    name: 'Rei Hatake',
    age: '42',
    birthday: 'November 22nd',
    occupationRank: 'Senior ANBU Officer',
    affiliations: 'Konoha',
    description:
      'Rei Hatake is a highly spoken of Shinobi. Silent, exacting, and efficient, his work ethic is second to none. He is the stark opposite of Lochlan, which makes him a good right hand for the ANBU leadership structure. He carries the kind of reputation that makes other shinobi measure a threat more seriously the moment his name comes up.'
  },
  {
    id: 'yusuke-sarutobi',
    portraitUrl: './npcs/Sarutobi,Yusuke.png',
    name: 'Yusuke Sarutobi',
    age: '48',
    birthday: 'January 1st',
    occupationRank: 'Commander of the Leaf Shinobi Forces',
    affiliations: 'Konoha',
    description:
      'Yusuke Sarutobi is an old-guard military commander who represents discipline, structure, and uncompromising service to Konoha. He is the kind of leader who values clear orders, competence, and chain of command above sentiment, and his presence reinforces that the village\'s military operates with real hierarchy and expectation. He sits above major branches like the Police Shinobi Division and helps define the serious, grounded tone of Konoha\'s active command structure.'
  }
];
