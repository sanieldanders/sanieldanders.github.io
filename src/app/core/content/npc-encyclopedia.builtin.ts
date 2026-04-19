import type { NpcEncyclopediaEntry } from '../models/app-data.model';

/** Shipped NPC profiles (add images under `public/npcs/`). */
export const NPC_ENCYCLOPEDIA_BUILTIN: readonly NpcEncyclopediaEntry[] = [
  {
    id: 'enya-sarutobi',
    sectionId: 'non-player',
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
    sectionId: 'non-player',
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
    sectionId: 'non-player',
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
    sectionId: 'non-player',
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
    sectionId: 'non-player',
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
    sectionId: 'non-player',
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
    sectionId: 'non-player',
    portraitUrl: './npcs/Sarutobi,Yusuke.png',
    name: 'Yusuke Sarutobi',
    age: '48',
    birthday: 'January 1st',
    occupationRank: 'Commander of the Leaf Shinobi Forces',
    affiliations: 'Konoha',
    description:
      'Yusuke Sarutobi is an old-guard military commander who represents discipline, structure, and uncompromising service to Konoha. He is the kind of leader who values clear orders, competence, and chain of command above sentiment, and his presence reinforces that the village\'s military operates with real hierarchy and expectation. He sits above major branches like the Police Shinobi Division and helps define the serious, grounded tone of Konoha\'s active command structure.'
  },
  {
    id: 'hanabi-hyuga',
    sectionId: 'non-player',
    portraitUrl: './npcs/Hyuga,Hanabi.png',
    name: 'Hanabi Hyuga',
    age: '55',
    birthday: 'March 27th',
    occupationRank: 'Hokage Council. Head of Hyuga Clan',
    affiliations: 'Konoha',
    description:
      'Hanabi Hyuga is one of Konoha\'s most respected senior figures, serving both as head of the Hyuga clan and as a member of the village council. She is poised, confident, and quietly warm beneath her discipline, carrying herself with the precision and authority expected of a lifelong Hyuga master. In the village\'s leadership structure, she represents stability, tradition, and the enduring political weight of one of Konoha\'s most powerful clans.'
  },
  {
    id: 'sai-yamanaka',
    sectionId: 'non-player',
    portraitUrl: './npcs/Yamanaka,Sai.png',
    name: 'Sai Yamanaka',
    age: '62',
    birthday: 'November 25th',
    occupationRank: 'Retired ANBU Chief, Senior Instructor',
    affiliations: 'Konoha',
    description:
      'Sai is an older retired black-ops shinobi who now serves as a senior instructor, using decades of ANBU experience to train younger generations in discipline, observation, and emotional control. He is quiet, restrained, and difficult to read, with a calm teaching style built on sharp observation and precise correction rather than warmth or theatrics. Though no longer an active field operative, he still carries the eerie composure and quiet authority of someone shaped by covert work and long years of service.'
  },
  {
    id: 'shikadai-nara',
    sectionId: 'non-player',
    portraitUrl: './npcs/Nara,Shikadai.png',
    name: 'Shikadai Nara',
    age: '40',
    birthday: 'September 23rd',
    occupationRank: 'Hokage Council. Head of Nara Clan',
    affiliations: 'Konoha',
    description:
      'Shikadai Nara is a high-ranking strategist and council member who inherited both the intelligence and quiet presence of his father, Shikamaru, so strongly that the resemblance between them is immediately obvious. He is calm, perceptive, and effortlessly analytical, the kind of leader who never appears hurried but always seems to be several steps ahead of everyone else. In Konoha, he serves as both the head of the Nara clan and one of the village\'s key political minds, helping shape decisions at the highest level.'
  },
  {
    id: 'mikari-nara',
    sectionId: 'non-player',
    portraitUrl: './npcs/Nara,Mikari.png',
    name: 'Mikari Nara',
    age: '16',
    birthday: 'October 30th',
    occupationRank: 'Genin; member of Team Three',
    affiliations: 'Konoha',
    description:
      'Mikari Nara is a bright, observant, and deceptively playful young shinobi who carries the intelligence of the Nara clan with much more visible youthful energy than her elders. She is relaxed, curious, and a little nosy, often seeming casual or half-distracted while actually paying close attention to everything around her. She comes across as clever, hard to underestimate for long, and the kind of genin who notices more than people expect and enjoys proving it.'
  },
  {
    id: 'reina-nara',
    sectionId: 'non-player',
    portraitUrl: './npcs/Nara,Reina.png',
    name: 'Reina Nara',
    age: '26',
    birthday: 'August 17th',
    occupationRank: 'Jonin team leader of Team Two',
    affiliations: 'Konoha',
    description:
      'Reina Nara is a calm, highly capable field tactician and respected jonin who carries the familiar stillness of the Nara clan, but with a sharper martial edge than most. She is composed, quietly demanding, and extremely observant, the kind of leader who expects others to think before they act and who commands respect without ever needing to raise her voice. Among her family and peers, she stands as a professional standard of discipline, restraint, and quiet competence.'
  },
  {
    id: 'sayuri-nara',
    sectionId: 'non-player',
    portraitUrl: './npcs/Nara,Sayuri.png',
    name: 'Sayuri Nara',
    age: '46',
    birthday: 'July 8th',
    occupationRank: 'Tokubetsu Jonin',
    affiliations: 'Konoha',
    description:
      'Sayuri Nara is a dry, perceptive, and quietly protective elder of the Nara family who notices problems early and rarely wastes words. She is practical, intelligent, and difficult to fool, with a calm presence that makes her feel more like a steady family anchor than a loud authority figure. She values competence, patience, and clear thinking, and tends to offer guidance through sharp observations rather than open reassurance.'
  },
  {
    id: 'aiko-yamanaka',
    sectionId: 'non-player',
    portraitUrl: './npcs/Yamanaka,Aiko.png',
    name: 'Aiko Yamanaka',
    age: '49',
    birthday: 'February 19th',
    occupationRank: 'Head of the Intelligence Division; Hokage Council',
    affiliations: 'Konoha',
    description:
      'Aiko Yamanaka is one of Konoha\'s most important intelligence and political figures, serving simultaneously as head of the Intelligence Division, head of the Yamanaka clan, and a member of the village council. She is calm, perceptive, and extremely difficult to mislead, the kind of woman who provides context, hidden meaning, and strategic interpretation when the village faces situations others do not yet fully understand. In practice, she is the person who turns scattered reports, suspicious behavior, and fragmented evidence into usable truth, making her a central force behind how Konoha recognizes and responds to threats before they fully emerge.'
  },
  {
    id: 'tatsumi-yamanaka',
    sectionId: 'non-player',
    portraitUrl: './npcs/Yamanaka,Tatsumi.png',
    name: 'Tatsumi Yamanaka',
    age: '26',
    birthday: 'May 1st',
    occupationRank: 'Jonin team leader of Team Eight',
    affiliations: 'Konoha',
    description:
      'Tatsumi Yamanaka is a brilliant, flirtatious, and socially dangerous jonin who is widely regarded as one of the most beautiful women in Konoha and knows exactly how to use that to her advantage. She is confident, poised, and highly self-aware, using charm, allure, and emotional pressure as tactical tools while leading Team Eight with polish, discipline, and a fierce competitive edge. Beneath her playful and provocative surface, she is a deeply capable shinobi who excels at reading people, controlling social space, and making others underestimate her until it is far too late.'
  },
  {
    id: 'daisuke-senju',
    sectionId: 'non-player',
    portraitUrl: './npcs/Senju,Daisuke.png',
    name: 'Daisuke Senju',
    age: '25',
    birthday: 'January 24th',
    occupationRank: 'Head of the Medical Corps; Chief Researcher; Special Jonin',
    affiliations: 'Konoha; Shinobi World Medical Corps (SWMC)',
    description:
      'Daisuke Senju is a brilliant medical prodigy who leads Konoha\'s Medical Corps while also serving as its chief researcher, making him one of the village\'s most important minds in healing and medical innovation. He is intensely intelligent, perfectionistic, and chronically distracted, often moving so quickly through ideas that other people struggle to keep up with him. In practice, he represents the highest level of medical excellence in Konoha, even if his absent-minded, hyper-focused nature makes him feel more like a genius scholar than a traditional authority figure.'
  },
  {
    id: 'renji-senju',
    sectionId: 'non-player',
    portraitUrl: './npcs/Senju,Renji.png',
    name: 'Renji Senju',
    age: '37',
    birthday: 'December 15th',
    occupationRank: 'Head of the Senju Clan; Elite Jonin',
    affiliations: 'Konoha',
    description:
      'Renji Senju is the steady, quietly authoritative head of the Senju clan and the older brother of Daisuke Senju. He is calm, perceptive, and deeply reliable, the kind of man who carries responsibility without needing recognition for it, and who commands trust through steadiness rather than force of personality. In Konoha, he serves as both a respected field commander and a stabilizing clan patriarch, taking on the broader burdens of leadership that Daisuke would never want.'
  },
  {
    id: 'erin-sarutobi',
    sectionId: 'non-player',
    portraitUrl: './npcs/Sarutobi,Erin.png',
    name: 'Erin Sarutobi',
    age: 'Early 43',
    birthday: 'October 1st',
    occupationRank: 'Head of the Sarutobi Clan',
    affiliations: 'Konoha',
    description:
      'Erin Sarutobi is a veteran clan leader whose authority comes from experience, composure, and a deeply rooted sense of duty. She is measured, deliberate, and difficult to rush, carrying herself with the confidence of someone who has spent years navigating both clan responsibility and village politics. As head of the Sarutobi clan and Enya\'s mother, she represents the weight of legacy, discipline, and quiet strength within Konoha\'s old guard.'
  },
  {
    id: 'himawari-uzumaki',
    sectionId: 'non-player',
    portraitUrl: './npcs/Uzumaki,Himawari.png',
    name: 'Himawari Uzumaki',
    age: '39',
    birthday: 'April 11th',
    occupationRank: 'Guardian of the Leaf; international intermediary',
    affiliations: 'Jinchuriki, Konoha',
    description:
      'Himawari Uzumaki is one of Konoha\'s most respected and quietly powerful figures, serving as both the Guardian of the Leaf and a key intermediary in the village\'s international relationships. She is calm, centered, and deeply controlled, carrying immense personal power with a softness and restraint that make her even more formidable. In practice, she represents stability, diplomacy, and overwhelming force held in reserve, the kind of person whose presence alone tells others the situation is serious.'
  },
  {
    id: 'lochlan-uzumaki',
    sectionId: 'non-player',
    portraitUrl: './npcs/Uzumaki,Lochlan.png',
    name: 'Lochlan Uzumaki',
    age: '35',
    birthday: 'June 6th',
    occupationRank: 'Commander of ANBU Black Ops',
    affiliations: 'Konoha',
    description:
      'Lochlan Uzumaki is the charismatic and highly dangerous commander of Konoha\'s ANBU Black Ops, a man known for balancing easy charm with surgical lethality. He has a disarming social presence and an almost playful confidence, but beneath that is a shinobi shaped by covert work, precision, and the ability to make deadly decisions without hesitation. In Konoha, he represents the village\'s hidden edge: the smiling face that can still become the knife when it needs to.'
  },
  {
    id: 'shikaichi-nara',
    sectionId: 'player',
    portraitUrl: './npcs/Nara,Shikaichi.png',
    name: 'Shikaichi Nara (Ichi)',
    age: '16',
    birthday: 'July 17th',
    occupationRank: 'Genin of Team One',
    affiliations: 'Konoha',
    description:
      'Shikaichi looks a lot like his grandmother Temari but with low tired eyes like Shikamaru. Always has a book in his hands (usually some kind of combat tactics book) and hates disruptive people who don\'t \"fall in line\". When stressed he will often just disappear and can be found on a rooftop or high place reading in the quiet. He hates to be disturbed while reading; it\'s very important to him to calm down and regroup.'
  },
  {
    id: 'nasu-ketsuryu',
    sectionId: 'player',
    portraitUrl: './npcs/Ketsuryū,Nāsu.png',
    name: 'Nāsu Ketsuryū',
    age: '16',
    birthday: 'October 7th',
    occupationRank: 'Genin of Team One',
    affiliations: 'Konoha',
    description: [
      'Forged not by bloodline, but by necessity, this shinobi walks a path rarely chosen—and even more rarely survived. Orphaned at a young age and raised by medical-nin, they grew up surrounded by discipline, anatomy charts, and the quiet, constant tension between life and death. Where others inherited legacy, they built themselves from nothing.',
      'They chose the path of a combat medic, rejecting the safety of the rear lines in favor of the chaos of the front. To them, protection means presence. If they are close enough, fast enough, skilled enough—no one has to die. On the battlefield, they move in a relentless rhythm: strike, step, heal. Their taijutsu is sharpened by medical precision, targeting muscles, joints, and chakra pathways to disable efficiently. The same hands that mend shattered bodies can just as easily break them.',
      'Despite their role, they are not naturally optimistic. A quiet pessimism lingers in their thoughts—an expectation that things will go wrong, that people will fall, that they may not be enough. But instead of breaking them, this mindset fuels their drive. They prepare more. Train harder. Push further. Because if the worst is coming, they intend to meet it head-on.',
      'Still, they strive for something more than survival—they want belonging. Having grown up without a true family, they are learning, slowly and awkwardly, how to be part of a team. Trust does not come easily, but loyalty does. Once they accept someone as a comrade, they will endure any pain, take any hit, and risk everything to keep them alive. They would rather fall themselves than watch another take their place on the operating table.',
      'Outside of combat, their studies take a darker, more experimental turn. In stolen moments of free time, they research and attempt to develop a unique chakra-afflicting technique—one that could drain chakra from an enemy and redirect it to themselves or an ally. To them, this is the next evolution of medical ninjutsu: not just healing damage, but preventing it by weakening the source. It is a dangerous line of research, one that toes the boundary between healing and harm—but they are willing to walk it.',
      'Their ultimate goal is not just to survive or even to be recognized—it is to create a legacy. They want to found a clan of their own, built not on bloodline, but on philosophy: strength through protection, power through control, and the unbreakable will to stand between life and death. A clan that ensures no one grows up as alone as they did.',
      'Until then, they fight on the front lines—unyielding, self-sacrificing, and determined to prove that even someone with no name can become unforgettable.'
    ].join('\n\n')
  },
  {
    id: 'kenzou-namikaze',
    sectionId: 'player',
    portraitUrl: './npcs/Namikaze,Kenzou.png',
    name: 'Kenzou Namikaze',
    age: '16',
    birthday: 'February 28th',
    occupationRank: 'Genin of Team One',
    affiliations: 'Konoha',
    description: [
      'Kenzou is independent, calm, and collected—a people person who matches others\' energy and personalities well, moves easily between silly and serious, and is a strong talker. He cares for those close to him and is ruthless against threats; he sits in the grey and rejects absolutes.',
      'He can be annoying to those who are more reserved, or who are snobby about their passions. He can be pretentious, overconfident in his understanding of social situations or of specific people and their intentions, and he has poor time management. He disregards guidelines he finds unnecessary, often to a fault.',
      'Likes: arts (music, poetry, literature), sports, botany, history, philosophy, and beautiful scenery. Dislikes: absolutes, dismissive people, arrogance, bland food, and traveling.'
    ].join('\n\n')
  }
];
