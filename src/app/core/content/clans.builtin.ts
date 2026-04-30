import type { ClanEntry } from '../models/clan-entry.model';

/** Built from the clan packet provided in chat (lore + traits + clan jutsu). */
export const CLANS_BUILTIN: readonly ClanEntry[] = [
  {
    id: 'aburame',
    name: 'Aburame Clan',
    tagline: 'Creepy Crawly',
    affiliations: 'Konoha',
    traits: ['+2 INT, +1 WIS', 'Nature and Animal Handling', 'Insect-Speak', 'Parasitic Technique'],
    features: ['Bug Host', 'Chakra Sense', 'Chakra Consumption', 'Insect Focus'],
    signatureJutsu: ['Human Cocoon', 'Insect Sphere', 'Parasitic Destruction', 'Insect Clone'],
    notes: 'Noble Konoha clan using symbiotic insects as living weapons and chakra predators.'
  },
  {
    id: 'akimichi',
    name: 'Akimichi Clan',
    tagline: 'Big Appetite',
    affiliations: 'Konoha',
    traits: ['+2 CON, +1 STR', 'Athletics and Survival'],
    features: ['Calories', 'Lunch Breaks', 'Food Pills', 'Master Metabolic Manipulation'],
    signatureJutsu: ['Body Fat Cushion', 'Human Boulder', 'Partial Expansion', 'Butterfly Mode'],
    notes: 'Body-size and weight manipulation through Yang Release; calorie economy powers their techniques.'
  },
  {
    id: 'bakuton',
    name: 'Bakuton',
    tagline: 'An Explosive Personality',
    affiliations: 'Multiple villages',
    traits: ['+2 CON, +1 INT', 'Chakra Control and combat skill', 'Explosion Release Affinity'],
    features: ['Branch Style', 'Cataclysmic', 'Concussive Blasts', 'Explosion Release'],
    signatureJutsu: ['Explosion Release: Break', 'Clay Birds', 'Fury', 'Atomic Missile'],
    notes: 'Explosive bloodline with Artistic and Reckless branches; battlefield control through force.'
  },
  {
    id: 'fuma',
    name: 'Fuma Clan',
    tagline: 'We Never Miss',
    affiliations: 'Traveling clan, Land of Fire routes',
    traits: ['+2 DEX, +1 WIS', 'Perception and Martial Arts', 'Ranged and thrown weapon focus'],
    features: ['House of Flying Daggers', 'Specialized Tools', 'Working the Angles', 'Lethal Precision'],
    signatureJutsu: ['Falling Heaven: Divide', 'Falling Heaven: Rain', 'Falling Heaven: Focus', 'Execution'],
    notes: 'Weapon-trajectory specialists with elite shuriken and thrown-weapon mastery.'
  },
  {
    id: 'futton',
    name: 'Futton',
    tagline: 'A Corrosive Breath',
    affiliations: 'Kirigakure lineages and splinters',
    traits: ['+2 INT or STR, +1 CON', 'Martial Arts + Athletics/Ninshou', 'Boil Release Affinity'],
    features: ['Boil Over', 'Corrosive Pressure', 'Boiling Chakra', 'Boil Release'],
    signatureJutsu: ['Skilled Mist', 'Steam Bullet', 'Unrivaled Strength', 'Acidic Explosion'],
    notes: 'Boil Release users that corrode defenses and convert fire/water flow into acid pressure.'
  },
  {
    id: 'hatake',
    name: 'Hatake Clan',
    tagline: 'Baring White Fangs',
    affiliations: 'Konoha',
    traits: ['+2 INT, +1 CHA', 'Ninshou and Perception', 'Lightning Affinity'],
    features: ['White Chakra', 'Lightning Release Adept', 'White Lightning'],
    signatureJutsu: ['(Known from clan package; feature-oriented section provided)'],
    notes: 'High-speed lightning specialists with White Chakra resource conversion and overcharge control.'
  },
  {
    id: 'hebi',
    name: 'Hebi Clan',
    tagline: "The Basilisk's Blessings",
    affiliations: 'Land of Grass, dispersed mercenary lines',
    traits: ['+2 STR or DEX, +1 CON', 'Survival and Animal Handling', "Poisoner's Kit"],
    features: ['Snake Speech', 'Serpent Mimicry', 'Regeneration', 'Poison Potency'],
    signatureJutsu: ['Adaptive Camouflage', 'Formation of One Thousand Snakes', 'Serpent Adaptation', "Silver Cobra's Blessing"],
    notes: 'Poison-and-blade clan with serpentine physiology and stance-based bukijutsu chains.'
  },
  {
    id: 'hoshigaki',
    name: 'Hoshigaki Clan',
    tagline: 'The Tailless Beast',
    affiliations: 'Land of Water diaspora',
    traits: ['+2 CON, +1 STR', 'Animal Handling and Athletics', 'Water Affinity', 'Amphibious'],
    features: ['Commander of the Deep', 'Brute Strength', 'Ravenous Chakra', 'Shark Skinned Predator'],
    signatureJutsu: ['(See clan packet section for complete list)'],
    notes: 'Aquatic apex fighters who convert water-tech damage into chakra pressure and predatory forms.'
  },
  {
    id: 'hozuki',
    name: 'Hozuki Clan',
    tagline: "Demon's Second Coming",
    affiliations: 'Land of Water',
    traits: ['+2 STR, +1 INT', 'Martial Arts and Chakra Control', 'Water Affinity'],
    features: ['Water Dependency', 'Made of Water', 'Water Reservoirs', 'Reflective Surface'],
    signatureJutsu: ['Great Water Arm', 'Water Body', 'Water Muscles', 'Hydrofication'],
    notes: 'Liquefaction bloodline with high water adaptation and anti-lightning weakness tradeoff.'
  },
  {
    id: 'hyuga',
    name: 'Hyuga Clan',
    tagline: "The Village's Strongest",
    affiliations: 'Konoha',
    traits: ['+2 WIS, +1 DEX', 'Perception and Insight', 'Byakugan lineage'],
    features: ['Branch Family', 'Byakugan', 'Gentle Fist Stance'],
    signatureJutsu: ['Palm Rotation', 'Palm Strike', '8 Trigrams 64 Palms', 'Lion Palm'],
    notes: 'Byakugan and chakra-point combat; split Main/Side branch doctrine and elite taijutsu seal disruption.'
  },
  {
    id: 'inuzuka',
    name: 'Inuzuka Clan',
    tagline: 'The Most Loyal',
    affiliations: 'Konoha',
    traits: ['+2 STR or DEX, +1 WIS', 'Animal Handling and Acrobatics', 'Dog-Speak'],
    features: ['Beast Master', 'Wild Sense', 'Savage Attack', 'Bestial Fury'],
    signatureJutsu: ['Beast-Human Clone', 'Dynamic Marking', 'Fang Over Fang', 'Double Headed Wolf'],
    notes: 'Canine-bond clan built around ninken teamwork, pursuit, and coordinated feral offense.'
  },
  {
    id: 'jiton',
    name: 'Jiton',
    tagline: 'A Magnetic Personality',
    affiliations: 'Land of Wind',
    traits: ['+2 INT, +1 CON', 'Ninshou and Survival', 'Magnet Release Affinity'],
    features: ['Dust Layer', 'Magnetic Mark', 'Swirling Currents', 'Magnet Release'],
    signatureJutsu: ['Dust Coat', 'Magnetic Polarization', 'Dust Wings', 'Imperial Dust Funeral'],
    notes: 'Magnet users controlling dust/sand/metal fields for movement denial and crushing area control.'
  },
  {
    id: 'jugo',
    name: 'Jugo',
    tagline: 'Monstrous Oppressors',
    affiliations: 'Scattered bloodline',
    traits: ['+2 STR, +1 CON', 'Athletics and Acrobatics'],
    features: ['Raw Chakra', 'Raw Chakra Form', "Nature's Brute"],
    signatureJutsu: ['Chakra Cannon', 'Furious Fists', 'Jet Propulsion Barrage', 'Obliteration Warp Cannon'],
    notes: 'Mutation-style clan leveraging raw chakra dice, bodily transformation, and heavy force projection.'
  },
  {
    id: 'kaguya',
    name: 'Kaguya Clan',
    tagline: 'Savage Battle Instincts',
    affiliations: 'Extinct line remnants',
    traits: ['+2 STR or DEX, +1 CON', 'Athletics and Martial Arts'],
    features: ['Dead Bone Pulse', 'Bone Weapons', 'Shikotsumyaku Stance', 'Battle Hunger'],
    signatureJutsu: ['Dance of the Camellia', 'Dance of the Willow', 'Clematis: Flower', 'Seedling Fern'],
    notes: 'Bone-manipulation clan with brutal close-combat dance arts and escalating skeletal weapon forms.'
  },
  {
    id: 'kurama',
    name: 'Kurama Clan',
    tagline: 'Illusions as Real as Reality',
    affiliations: 'Konoha',
    traits: ['+2 WIS or CHA, +1 INT', 'Illusions and Insight'],
    features: ['Genjutsu Specialty', 'Genjutsu Resistance', 'Onijutsu', 'Genjutsu Conversions'],
    signatureJutsu: ['(Core is feature and Onijutsu system in supplied packet)'],
    notes: 'High-tier genjutsu clan with Onijutsu coils that bend illusion mechanics into physical consequences.'
  },
  {
    id: 'kuru',
    name: 'Kuru Clan',
    tagline: "The Wolf's Curse",
    affiliations: 'Land of Wolves, dispersed south',
    traits: ['+2 WIS, +1 CON', 'Insight and Chakra Control'],
    features: ['Yin Chakra Adept', 'Kurugan', 'Foresight actions'],
    signatureJutsu: ['Dark Devotion Fist', 'Pierce the Veil', 'Dark Rift', 'Unfettered Foresight'],
    notes: 'Yin-focused dojutsu line using predictive pressure, darkness techniques, and anti-element doctrine.'
  },
  {
    id: 'namikaze',
    name: 'Namikaze',
    tagline: 'Faster Than the Eye Can See',
    affiliations: 'Land of Fire lineages',
    traits: ['+2 DEX, +1 INT', 'Acrobatics and Chakra Control', 'Swift Release Affinity'],
    features: ['Supernatural Speed', 'Speed dice', 'Evasive Nature', 'Swift Release'],
    signatureJutsu: ['Swift Expedience', 'Mirror Image Technique', 'Thunder Flash', 'Flash Step'],
    notes: 'Speedline clan centered on mobility spikes, initiative pressure, and wind/lightning conversion.'
  },
  {
    id: 'nara',
    name: 'Nara Clan',
    tagline: 'Inconceivable Foresight',
    affiliations: 'Konoha',
    traits: ['+2 INT, +1 CHA', 'Investigation and Insight'],
    features: ['Coordinate', 'Master Tactician', 'Genius Potential', 'Masters of the Shadows'],
    signatureJutsu: ['Shadow Possession', 'Shadow Sewing Needle', 'Black Spider Lily', 'Shadow Web Execution'],
    notes: 'Strategic shadow-control clan specializing in battlefield command and action denial.'
  },
  {
    id: 'ranton',
    name: 'Ranton',
    tagline: 'Laser Focused',
    affiliations: 'Land of Lightning',
    traits: ['+2 DEX, +1 INT', 'Ninshou and Nature', 'Storm Release Affinity'],
    features: ['Twin Style (Storm/Laser)', 'Storm Release', 'Galvanation'],
    signatureJutsu: ['Laser Beam', 'Tri-Beam', 'Laser Dance', 'Laser Circus'],
    notes: 'Storm Release users blending water/lightning into beam and wave control with shock escalation.'
  },
  {
    id: 'ryu',
    name: 'Ryu Clan',
    tagline: 'Wrath of a Dragon',
    affiliations: 'Land of Lightning roots, widespread',
    traits: ['+2 INT, +1 CON', 'Ninshou and Chakra Control'],
    features: ['Blood of the Dragon', "Dragon's Claws", "Dragon's Rage"],
    signatureJutsu: ['Dragon Breath', 'Dragon Strike', 'Dragon Cloak', "Dragon's Ascension"],
    notes: 'Draconic lineage with chosen element channeling and rage-form scaling combat stats.'
  },
  {
    id: 'sarutobi',
    name: 'Sarutobi Clan',
    tagline: 'Bound by a Code of Honor',
    affiliations: 'Konoha',
    traits: ['+2 STR or INT, +1 CON', 'Flexible skill picks', 'General Literacy'],
    features: ['Advanced Nature Transformation', 'Advanced Chakra Control', 'Will of Fire Focus points'],
    signatureJutsu: ['(Sarutobi packet is feature-heavy and cross-element focused)'],
    notes: 'Elemental versatility clan with focus-point team support and broad nature mastery.'
  },
  {
    id: 'senju',
    name: 'Senju',
    tagline: "The Leaf's Patriarchs",
    affiliations: 'Land of Fire / Konoha',
    traits: ['+2 CON, +1 STR', 'Chakra Control and Ninshou', 'Wood Release Affinity'],
    features: ['Built Different', 'Mitotic Regeneration', 'Sacred Body', 'Mokuton Suppression'],
    signatureJutsu: ['Great Forest Technique', 'Wood Clone', 'Wood Dragon Summoning', 'Tree Bind Flourishing Burial'],
    notes: 'Wood Release and vitality-focused lineage with strong sustain, constructs, and chakra suppression.'
  },
  {
    id: 'shakuton',
    name: 'Shakuton',
    tagline: 'Too Hot to Touch',
    affiliations: 'Land of Wind dispersal',
    traits: ['+2 INT, +1 WIS', 'Survival and Ninshou', 'Scorch Release Affinity'],
    features: ['Even Hotter', 'Scorching Heat', 'Scorching Aura', 'Immolation'],
    signatureJutsu: ['Scorching Murder', 'Violent Slaughtering Flame', 'Hellfire Murder', 'Majestic Violent Murdering Hellfire Destroyer'],
    notes: 'Scorch users with mote economy and escalating burn states into immolation.'
  },
  {
    id: 'shikigami',
    name: 'Shikigami',
    tagline: 'A Work of Art',
    affiliations: 'Coven-style lineage',
    traits: ['+2 INT, +1 DEX', 'Sleight of Hand and Performance', 'Weaponsmith/Demolitions tools'],
    features: ['Papercraft', 'Paper Expert', 'Paper Reservoir', 'Divine Shikigami'],
    signatureJutsu: ['Paper Shuriken', 'Paper Clone', 'Paper Coffin', 'Dance of the Shikigami'],
    notes: 'Paper manipulation specialists with tool synergy, explosive scripting, and angel-form combat.'
  },
  {
    id: 'shoton',
    name: 'Shoton',
    tagline: 'Diamonds in the Rough',
    affiliations: 'Land of Sound origins, Earth-country spread',
    traits: ['+2 CON, +1 CHA', 'Nature and Survival', 'Crystal Release Affinity'],
    features: ['One with Earth', 'Crystalline Stone', 'Rock Hard Stability', 'Crystalized Focus'],
    signatureJutsu: ['Crystal Armor', 'Crystal Needles', 'Crystal Prison', 'Crystal Imprisonment Wave'],
    notes: 'Crystal release line focused on hard-control prisons and durable crystal structures.'
  },
  {
    id: 'tsuchigumo',
    name: 'Tsuchigumo Clan',
    tagline: 'Arachnophobia',
    affiliations: 'Rice/Sound origins, Grass and Leaf ties',
    traits: ['+2 DEX, +1 WIS', 'Acrobatics and Perception', 'Shortbow/Longbow proficiency'],
    features: ['Third Eye', 'Web Weapons', 'Web Traps', 'Exoskeleton'],
    signatureJutsu: ['Web Bind', 'Web Throw', 'Spider Web Area', 'Spider Nest Summoning'],
    notes: 'Spider-themed web-control clan with trapcraft, ranged pressure, and arachnid summons.'
  },
  {
    id: 'uchiha',
    name: 'Uchiha Clan',
    tagline: 'The Curse of Hatred',
    affiliations: 'Konoha',
    traits: ['+2 DEX or INT, +1 INT or WIS', 'Insight + combat/illusion pick', 'Fire Affinity'],
    features: ['Advanced Adaptation', 'Sharingan Tomoe progression'],
    signatureJutsu: ['Genjutsu: Sharingan!', 'Uchiha Awaiting Stance', 'Uchiha Flame Ball', 'Uchiha Flame Spiral'],
    notes: 'Sharingan adaptation tree with reaction control, copy-wheel mechanics, and elite fire/genjutsu.'
  },
  {
    id: 'uzumaki',
    name: 'Uzumaki Clan',
    tagline: 'Never Backing Down',
    affiliations: 'Former Whirlpool, now strong in Konoha',
    traits: ['+2 CON, +1 CHA', 'Chakra Control and Ninshou'],
    features: ['Wellspring of Chakra', 'Reserve Cells', 'Fuinjutsu Master', 'Draining Seals'],
    signatureJutsu: ['Adamantine Striking Chains', 'Basic Seal', '5-Pronged Seal', 'River Dam Seal'],
    notes: 'Sealing masters with exceptional stamina and reserve chakra economy.'
  },
  {
    id: 'yamanaka',
    name: 'Yamanaka Clan',
    tagline: 'Impossible to Pin Down',
    affiliations: 'Konoha',
    traits: ['+2 WIS or CHA, +1 INT', 'Illusions and Insight'],
    features: ['Mental Connections', 'Mental Boons', 'Mental Clarity', 'Master Mental Alteration'],
    signatureJutsu: ['Mind Body Transfer', 'Mind Body Disturbance', 'Mass Mind Body Dance', 'Mind Puppet Switch: Cursed Seal'],
    notes: 'Mind-control and psychic disruption clan built for infiltration, control, and information warfare.'
  },
  {
    id: 'yoton',
    name: 'Yoton',
    tagline: 'Blood of the Earth',
    affiliations: 'Land of Earth',
    traits: ['+2 INT, +1 CON', 'Nature and Survival', 'Lava Release Affinity'],
    features: ['Calcified Skin', 'Churning Magma', 'Lava Release', 'Molten Core'],
    signatureJutsu: ['Lava Stream', 'Quicklime Hardening', 'Lava Chakra Mode', 'Planet-Branding Blast'],
    notes: 'Lava users blending fire/earth for hazard zones, armor erosion, and molten condition escalation.'
  },
  {
    id: 'yuki',
    name: 'Yuki Clan',
    tagline: 'Cold to the Bone',
    affiliations: 'Land of Water lineage',
    traits: ['+2 DEX or INT, +1 INT or CHA', 'Chakra Control and Ninshou', 'Ice Release Affinity'],
    features: ['Frigid Cold', 'Chilled Body', 'Ice Release', 'Frostbite evolution'],
    signatureJutsu: ['Ice Dagger', 'Ice Prison', 'Frozen Capturing Field', 'Demonic Ice Mirrors'],
    notes: 'Ice release clan specializing in control terrain, chill escalation, and mirror-domain combat.'
  }
];
