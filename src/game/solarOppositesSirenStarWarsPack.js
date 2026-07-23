const localized = (fr, en) => ({ fr, en });

const action = (name, type, dmg, extra = {}) => ({
  name,
  type,
  dmg,
  ...extra
});

const fighter = ({
  id,
  name,
  cat,
  color,
  accent,
  weaponType,
  stats,
  simple,
  secondary,
  defense,
  special,
  equipment,
  incarnation,
  canonStatus = 'canon'
}) => ({
  id,
  name,
  cat,
  color,
  secondaryColor: accent,
  weaponType,
  weaponColor: accent,
  stats,
  simple,
  secondary,
  defense,
  special,
  equipment,
  incarnation,
  canonStatus
});

const plaque = ({
  clearance,
  rankFr,
  rankEn,
  roleFr,
  roleEn,
  callSign,
  originFr,
  originEn,
  dossierFr,
  dossierEn,
  breachFr,
  breachEn,
  doctrineFr,
  doctrineEn,
  threatFr,
  threatEn,
  tags
}) => ({
  clearance,
  rank: localized(rankFr, rankEn),
  role: localized(roleFr, roleEn),
  callSign,
  origin: localized(originFr, originEn),
  dossier: localized(dossierFr, dossierEn),
  breachLore: localized(breachFr, breachEn),
  doctrine: localized(doctrineFr, doctrineEn),
  threat: localized(threatFr, threatEn),
  tags
});

const korvo = fighter({
  id: 'korvo_solar',
  name: 'Korvo',
  cat: 'hacker',
  color: '#9fd9f2',
  accent: '#1b2638',
  weaponType: 'raygun',
  stats: { hp: 112, atk: 13, def: 7, spd: 7 },
  simple: action('Shlorpian Ray Burst', 'energy', 1.05),
  secondary: action('Quantum Ring Calibration', 'hack', 1.75, { cd: 6 }),
  defense: action('Nanobot Hardlight Screen', 'shield', 0, { dur: 2.2, reduce: 0.82 }),
  special: action('Planetary Science Override', 'science_aoe', 4.55, { color: '#9fd9f2' }),
  equipment: ['Shlorpian Ray Pistol', 'Quantum Ring', 'Pupa Telemetry Scanner'],
  incarnation: 'Solar Opposites - suburban Earth mission'
});

const terry = fighter({
  id: 'terry_solar',
  name: 'Terry',
  cat: 'tactical',
  color: '#86d45a',
  accent: '#f28c28',
  weaponType: 'raygun',
  stats: { hp: 126, atk: 11, def: 8, spd: 7 },
  simple: action('Casual Raygun Snap', 'energy', 0.98),
  secondary: action('Earth-Culture Distraction', 'taunt', 1.45, { cd: 5 }),
  defense: action('Shlorpian Family Cover', 'shield', 0, { dur: 2.4, reduce: 0.78 }),
  special: action('Suburban Gadget Avalanche', 'gadget_aoe', 4.25, { color: '#f28c28' }),
  equipment: ['Shlorpian Ray Pistol', 'Earth Souvenir Pack', 'Emergency Replicator'],
  incarnation: 'Solar Opposites - suburban Earth mission'
});

const yumyulack = fighter({
  id: 'yumyulack_solar',
  name: 'Yumyulack',
  cat: 'hacker',
  color: '#a8def2',
  accent: '#765b3d',
  weaponType: 'shrink_ray',
  stats: { hp: 104, atk: 13, def: 5, spd: 8 },
  simple: action('Shrink Ray Tap', 'shrink', 1.02),
  secondary: action('Wall Containment Beam', 'control', 1.7, { cd: 6 }),
  defense: action('Miniature Decoy Habitat', 'dodge', 0, { dur: 1.8, reduce: 0.76 }),
  special: action('Pocket Civilization Collapse', 'shrink_aoe', 4.45, { color: '#8cdcf4' }),
  equipment: ['Shrink Ray', 'Specimen Terrarium', 'Shlorpian Wrist Computer'],
  incarnation: 'Solar Opposites - replicant scientist'
});

const jesse = fighter({
  id: 'jesse_solar',
  name: 'Jesse',
  cat: 'tactical',
  color: '#7fd45d',
  accent: '#f483b6',
  weaponType: 'raygun',
  stats: { hp: 118, atk: 11, def: 7, spd: 8 },
  simple: action('Replicant Ray Shot', 'energy', 0.96),
  secondary: action('Neighborhood Rescue Route', 'support', 1.35, { cd: 5 }),
  defense: action('Pupa-Safe Diversion', 'dodge', 0, { dur: 2.0, reduce: 0.8 }),
  special: action('Earth Friendship Chain', 'support_aoe', 4.1, { color: '#f483b6' }),
  equipment: ['Shlorpian Ray Pistol', 'Replicant Utility Band', 'Pupa Emergency Beacon'],
  incarnation: 'Solar Opposites - replicant student'
});

const sirenHead = fighter({
  id: 'siren_head',
  name: 'Siren Head',
  cat: 'horror',
  color: '#6b3828',
  accent: '#202020',
  weaponType: 'broadcast',
  stats: { hp: 172, atk: 16, def: 9, spd: 7 },
  simple: action('Number Station Burst', 'sound', 1.12),
  secondary: action('Stolen Voice Lure', 'fear', 1.9, { cd: 6 }),
  defense: action('Tree-Line Camouflage', 'dodge', 0, { dur: 2.3, reduce: 0.86 }),
  special: action('Emergency Broadcast Blackout', 'sound_aoe', 4.95, { color: '#b33b2e' }),
  equipment: ['Twin Organic Sirens', 'Mimetic Broadcast Archive', 'Camouflage Tissue'],
  incarnation: 'Trevor Henderson original solitary mimetic predator'
});

const longHorse = fighter({
  id: 'long_horse',
  name: 'Long Horse',
  cat: 'tactical',
  color: '#d8d2bd',
  accent: '#3a332d',
  weaponType: 'omen',
  stats: { hp: 132, atk: 9, def: 10, spd: 7 },
  simple: action('Vertebral Warning Arc', 'spirit', 0.88),
  secondary: action('Disaster Omen', 'debuff', 1.2, { cd: 5 }),
  defense: action('Impossible Corner Retreat', 'dodge', 0, { dur: 2.6, reduce: 0.9 }),
  special: action('Patron Warning Across Worlds', 'support_aoe', 3.8, { color: '#d8d2bd' }),
  equipment: ['Infinite Vertebral Path', 'Cinnamon Omen Trace', 'Cross-Thread Warning'],
  incarnation: 'Trevor Henderson benevolent omen entity'
});

const cartoonCat = fighter({
  id: 'cartoon_cat',
  name: 'Cartoon Cat',
  cat: 'slayer',
  color: '#111111',
  accent: '#f3ead7',
  weaponType: 'rubber_hose',
  stats: { hp: 128, atk: 17, def: 6, spd: 9 },
  simple: action('Rubber-Hose Claw', 'melee', 1.18),
  secondary: action('Faux-Body Stretch', 'melee', 2.05, { cd: 6 }),
  defense: action('Old-Film Frame Skip', 'dodge', 0, { dur: 1.7, reduce: 0.88 }),
  special: action('Broadcast Cartoon Manifestation', 'horror_aoe', 5.0, { color: '#f3ead7' }),
  equipment: ['Faux Cartoon Body', 'Old-Media Portal', 'Elastic Claws'],
  incarnation: 'Trevor Henderson old-media manifestation'
});

const ahsokaPadawan = fighter({
  id: 'ahsoka_padawan',
  name: 'Ahsoka Tano (Padawan)',
  cat: 'slayer',
  color: '#e77836',
  accent: '#7ed957',
  weaponType: 'lightsaber',
  stats: { hp: 110, atk: 14, def: 6, spd: 9 },
  simple: action('Reverse-Grip Green Saber', 'melee', 1.08),
  secondary: action('Padawan Force Leap', 'force', 1.7, { cd: 5 }),
  defense: action('Shien Deflection', 'shield', 0, { dur: 1.9, reduce: 0.82 }),
  special: action('Skyguy Battlefield Lesson', 'force_aoe', 4.35, { color: '#7ed957' }),
  equipment: ['Green Lightsaber', 'Padawan Comlink', 'Clone Wars Field Bracers'],
  incarnation: 'The Clone Wars - early Padawan, age fourteen'
});

const ahsokaSiege = fighter({
  id: 'ahsoka',
  name: 'Ahsoka Tano (Siege of Mandalore)',
  cat: 'slayer',
  color: '#e77836',
  accent: '#4ea8ff',
  weaponType: 'dual_lightsaber',
  stats: { hp: 122, atk: 16, def: 7, spd: 9 },
  simple: action('Twin Blue Saber Cut', 'melee', 1.15),
  secondary: action('Mandalore Throne-Room Counter', 'force', 1.95, { cd: 5 }),
  defense: action('Order 66 Deflection', 'shield', 0, { dur: 2.1, reduce: 0.86 }),
  special: action('Siege of Mandalore Break', 'force_aoe', 4.8, { color: '#4ea8ff' }),
  equipment: ['Twin Blue Lightsabers', 'Mandalorian Siege Tunic', 'Fulcrum Frequency'],
  incarnation: 'The Clone Wars - Siege of Mandalore'
});

const ahsokaAdult = fighter({
  id: 'ahsoka_adult',
  name: 'Ahsoka Tano (Adult)',
  cat: 'tactical',
  color: '#d96f35',
  accent: '#f4f8ff',
  weaponType: 'dual_lightsaber',
  stats: { hp: 130, atk: 15, def: 9, spd: 8 },
  simple: action('White Saber Crosscut', 'melee', 1.12),
  secondary: action('Fulcrum Route Read', 'force', 1.75, { cd: 5 }),
  defense: action('World Between Worlds Step', 'dodge', 0, { dur: 2.3, reduce: 0.9 }),
  special: action('Ahsoka the White', 'light_aoe', 4.75, { color: '#f4f8ff' }),
  equipment: ['Twin White Lightsabers', 'T-6 Shuttle Beacon', 'Fulcrum Archive'],
  incarnation: 'Rebels and Ahsoka - mature former Jedi'
});

const aaylaSecura = fighter({
  id: 'aayla_secura',
  name: 'Aayla Secura',
  cat: 'slayer',
  color: '#4ba6d8',
  accent: '#6cc7ff',
  weaponType: 'lightsaber',
  stats: { hp: 120, atk: 15, def: 7, spd: 8 },
  simple: action('Blue Saber Advance', 'melee', 1.1),
  secondary: action('Felucia Flank', 'force', 1.8, { cd: 6 }),
  defense: action('Jedi General Guard', 'shield', 0, { dur: 2.0, reduce: 0.82 }),
  special: action('Commander Bly Formation', 'force_aoe', 4.55, { color: '#6cc7ff' }),
  equipment: ['Blue Lightsaber', 'Jedi Field Bracers', 'Clone Command Comlink'],
  incarnation: 'Clone Wars Jedi General'
});

const darthMaul = fighter({
  id: 'darth_maul',
  name: 'Darth Maul',
  cat: 'slayer',
  color: '#b72822',
  accent: '#ff2d24',
  weaponType: 'double_lightsaber',
  stats: { hp: 134, atk: 17, def: 6, spd: 9 },
  simple: action('Double-Bladed Saber Rush', 'melee', 1.2),
  secondary: action('Dathomirian Force Choke', 'force', 2.05, { cd: 6 }),
  defense: action('Cybernetic Spin Parry', 'shield', 0, { dur: 1.8, reduce: 0.84 }),
  special: action('Shadow Collective Dominion', 'dark_aoe', 5.0, { color: '#ff2d24' }),
  equipment: ['Double-Bladed Red Lightsaber', 'Cybernetic Legs', 'Mandalore Command Seal'],
  incarnation: 'The Clone Wars - ruler of Mandalore'
});

const darthRevan = fighter({
  id: 'darth_revan',
  name: 'Darth Revan',
  cat: 'tactical',
  color: '#282329',
  accent: '#8f4dff',
  weaponType: 'dual_lightsaber',
  stats: { hp: 138, atk: 16, def: 9, spd: 7 },
  simple: action('Red Saber Judgment', 'melee', 1.14),
  secondary: action('Purple Saber Reversal', 'force', 1.95, { cd: 6 }),
  defense: action('Revanite Mask Focus', 'shield', 0, { dur: 2.2, reduce: 0.86 }),
  special: action('Star Forge Command', 'force_aoe', 4.95, { color: '#8f4dff' }),
  equipment: ['Revan Mask', 'Red Lightsaber', 'Purple Lightsaber'],
  incarnation: 'Knights of the Old Republic iconic masked identity',
  canonStatus: 'legends'
});

const darthTalon = fighter({
  id: 'darth_talon',
  name: 'Darth Talon',
  cat: 'slayer',
  color: '#b52c32',
  accent: '#ef2828',
  weaponType: 'lightsaber',
  stats: { hp: 118, atk: 16, def: 6, spd: 9 },
  simple: action('One Sith Saber Cut', 'melee', 1.15),
  secondary: action('Twi lek Hunter Lunge', 'force', 1.95, { cd: 5 }),
  defense: action('Sith Tattoo Focus', 'dodge', 0, { dur: 1.8, reduce: 0.84 }),
  special: action('Hand of Darth Krayt', 'dark_aoe', 4.85, { color: '#ef2828' }),
  equipment: ['Red Lightsaber', 'One Sith Armor', 'Ritual Sith Tattoos'],
  incarnation: 'Star Wars Legacy - Hand of Darth Krayt',
  canonStatus: 'legends'
});

export const SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_EXPANSIONS = {
  'Solar Opposites': [korvo, terry, yumyulack, jesse],
  'Siren Head': [sirenHead, longHorse, cartoonCat],
  'Star Wars': [
    ahsokaPadawan,
    ahsokaAdult,
    aaylaSecura,
    darthRevan,
    darthTalon
  ]
};

export const SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_OVERRIDES = {
  ahsoka: ahsokaSiege,
  darth_maul: darthMaul
};

export const SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE = [
  {
    key: 'solar_opposites',
    universe: 'Solar Opposites',
    mediaType: 'series',
    faction: 'sciFi',
    mode: 'RPG',
    difficulty: 'Hard',
    titleFr: 'Solar Opposites',
    stage: 'Suburban Shlorpian Terraforming Incident',
    boss: 'Red Goobler Containment Failure',
    worldBoss: 'Pupa Terraforming Event',
    hero: ['korvo_solar', 'Korvo', 'hacker'],
    allies: [
      ['terry_solar', 'Terry', 'tactical'],
      ['yumyulack_solar', 'Yumyulack', 'hacker'],
      ['jesse_solar', 'Jesse', 'tactical']
    ],
    monsters: ['Shlorpian Replicator Drone', 'Nanobot Goobler', 'Wall Patrol Miniature'],
    bosses: ['Red Goobler', 'SilverCop Retrieval Unit'],
    gear: [
      ['solar_shrink_ray', 'Yumyulack Shrink Ray', 'Rayon reducteur de Yumyulack', { atk: 9, spd: 2 }],
      ['solar_quantum_ring', 'Korvo Quantum Ring', 'Anneau quantique de Korvo', { def: 7, hp: 45 }],
      ['solar_pupa_scanner', 'Pupa Telemetry Scanner', 'Scanner telemetrique du Pupa', { hp: 75, spd: 1 }]
    ],
    event: [
      'evt_solar_pupa_pulse',
      'Pupa Terraforming Pulse',
      'Impulsion terraformante du Pupa',
      'The Pupa releases a controlled growth pulse that roots enemies while Korvo redirects the sequence away from civilians.',
      'Le Pupa libere une impulsion de croissance controlee qui immobilise les ennemis pendant que Korvo detourne la sequence loin des civils.'
    ],
    theme: 'Shlorpian science, suburban chaos, the Wall micro-society, Gooblers, and the Pupa terraforming mission',
    desc: {
      en: 'Korvo, Terry, Yumyulack, and Jesse escaped the destruction of Shlorp and crashed into suburban Earth while protecting the Pupa, a living supercomputer intended to terraform the planet. In Multiverse Breach, portal radiation makes the Pupa read Mosaic City as a replacement world, so the family must contain its own technology before whole districts become competing suburban biomes.',
      fr: 'Korvo, Terry, Yumyulack et Jesse ont fui la destruction de Shlorp avant de s ecraser dans une banlieue terrestre en protegeant le Pupa, superordinateur vivant destine a terraformer la planete. Dans Multiverse Breach, le rayonnement des portails fait lire la Cite-Mosaique au Pupa comme monde de remplacement; la famille doit contenir sa propre technologie avant que des quartiers entiers deviennent des biomes de banlieue concurrents.'
    },
    motif: 'arcanecity',
    colors: ['#17272f', '#030607', '#86d45a'],
    stageVariants: [
      ['Tactics', 'The Wall Pocket-City Uprising', 'Hard', 'Duke Wall Regime'],
      ['Smash', 'Shlorpian Roof-Array Breakdown', 'Very Hard', 'SilverCop Retrieval Unit']
    ]
  },
  {
    key: 'siren_head',
    universe: 'Siren Head',
    mediaType: 'web',
    faction: 'horror',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    titleFr: 'Siren Head',
    stage: 'North American Forest Number Station',
    boss: 'False Distress Broadcast Relay',
    worldBoss: 'Siren Head Mimetic Hunt',
    hero: ['siren_head', 'Siren Head', 'horror'],
    allies: [
      ['long_horse', 'Long Horse', 'tactical'],
      ['cartoon_cat', 'Cartoon Cat', 'slayer']
    ],
    monsters: ['Tree-Line Mimic', 'Stolen Voice Echo', 'Number Station Lure'],
    bosses: ['Broadcast Relay Colossus', 'Old-Media Faux Body'],
    gear: [
      ['siren_number_recorder', 'Number Station Field Recorder', 'Enregistreur de station de nombres', { atk: 8, spd: 1 }],
      ['siren_camouflage_stake', 'Tree-Line Survey Stake', 'Piquet de releve forestier', { def: 7, hp: 50 }],
      ['siren_omen_trace', 'Long Horse Omen Trace', 'Trace de presage de Long Horse', { hp: 80, spd: 1 }]
    ],
    event: [
      'evt_siren_long_horse_warning',
      'Long Horse Warning',
      'Avertissement de Long Horse',
      'Long Horse bends through impossible corners to mark the only route whose voices were not copied by Siren Head.',
      'Long Horse se courbe par des angles impossibles pour signaler la seule route dont les voix n ont pas ete copiees par Siren Head.'
    ],
    theme: 'Trevor Henderson cryptid horror, rural disappearances, audio mimicry, impossible silhouettes, and old-media manifestations',
    desc: {
      en: 'Siren Head is treated as a solitary mimetic predator rather than an SCP or a mechanical robot. Its organic sirens imitate broadcasts and familiar voices while its body disappears against trees and utility structures. In Multiverse Breach, stolen A.R.C.A. distress calls let the entity hunt across portals; Long Horse warns survivors, while Cartoon Cat exploits the same media fractures for its own hostile manifestation.',
      fr: 'Siren Head est traite comme un predateur mimetique solitaire, et non comme un SCP ou un robot mecanique. Ses sirenes organiques imitent les emissions et les voix familieres tandis que son corps se confond avec les arbres et structures techniques. Dans Multiverse Breach, des appels de detresse A.R.C.A. voles lui permettent de chasser entre les portails; Long Horse avertit les survivants, tandis que Cartoon Cat exploite les memes fractures mediatiques pour sa propre manifestation hostile.'
    },
    motif: 'wasteland',
    colors: ['#211915', '#030302', '#9b4b35'],
    stageVariants: [
      ['RPG', 'Abandoned Cemetery Broadcast Trail', 'Very Hard', 'Tree-Line Mimic'],
      ['Smash', 'Dead Television Studio Manifestation', 'Expert', 'Old-Media Faux Body']
    ]
  }
];

export const SOLAR_OPPOSITES_SIREN_STAR_WARS_LORE_DB = {
  'Solar Opposites': {
    mediaType: 'series',
    faction: 'sciFi',
    title: localized('Solar Opposites', 'Solar Opposites'),
    desc: SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE[0].desc,
    theme: SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE[0].theme,
    stageName: SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE[0].stage,
    bossName: SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE[0].boss,
    worldBoss: SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE[0].worldBoss
  },
  'Siren Head': {
    mediaType: 'web',
    faction: 'horror',
    title: localized('Siren Head', 'Siren Head'),
    desc: SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE[1].desc,
    theme: SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE[1].theme,
    stageName: SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE[1].stage,
    bossName: SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE[1].boss,
    worldBoss: SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE[1].worldBoss
  }
};

export const SOLAR_OPPOSITES_SIREN_STAR_WARS_CHARACTER_PLAQUES = {
  korvo_solar: plaque({
    clearance: 'SOL-KORV',
    rankFr: 'Scientifique shlorpien',
    rankEn: 'Shlorpian scientist',
    roleFr: 'Controle technologique et lecture de terraformation',
    roleEn: 'Technology control and terraforming analysis',
    callSign: 'Korvo',
    originFr: 'Shlorp / banlieue terrestre - mission du Pupa',
    originEn: 'Shlorp / suburban Earth - Pupa mission',
    dossierFr: 'Dans sa Trame d origine, Korvo fait partie des quatre Shlorpiens evacues avant la destruction de leur monde. Echoue dans une banlieue americaine avec Terry et leurs replicants Yumyulack et Jesse, il traite la Terre comme une planete primitive et tente de poursuivre la mission centrale: proteger le Pupa jusqu a sa forme finale de terraformation. Son intelligence, ses anneaux quantiques, rayons, nanorobots et inventions domestiques sont immenses, mais son impatience transforme souvent une correction scientifique en nouvelle crise.',
    dossierEn: 'In his origin Thread, Korvo is one of four Shlorpians evacuated before their world was destroyed. Stranded in American suburbia with Terry and their replicants Yumyulack and Jesse, he treats Earth as a primitive planet while continuing the central mission: protect the Pupa until its final terraforming form. His intelligence, quantum rings, rays, nanobots, and household inventions are immense, but his impatience often turns a scientific correction into a new crisis.',
    breachFr: 'La Premiere Breche fait confondre au Pupa la Cite-Mosaique avec une planete de remplacement. Korvo rejoint A.R.C.A. pour mesurer cette lecture avant qu elle ne convertisse les salles stabilisees en banlieues incompatibles. Il refuse toutefois de remettre le Pupa a l organisation: sa doctrine consiste a corriger ses propres machines tout en conservant la responsabilite familiale de la mission shlorpienne. Le Sans-Auteur exploite sa nostalgie de Shlorp en lui proposant une copie parfaite de la planete; Korvo la rejette lorsqu il comprend qu elle exige d effacer la Terre et tous les liens formes depuis le crash.',
    breachEn: 'The First Breach causes the Pupa to mistake Mosaic City for a replacement planet. Korvo joins A.R.C.A. to measure that reading before it converts stabilized rooms into incompatible suburbs. He still refuses to surrender the Pupa to the organization: his doctrine is to correct his own machines while keeping family responsibility for the Shlorpian mission. The Authorless exploits his nostalgia for Shlorp by offering a perfect copy of the planet; Korvo rejects it when he understands that it requires erasing Earth and every bond formed since the crash.',
    doctrineFr: 'Rayon shlorpien, anneau quantique, scan du Pupa, nanobouclier et neutralisation de terraformation.',
    doctrineEn: 'Shlorpian ray, quantum ring, Pupa scan, nanoshield, and terraforming neutralization.',
    threatFr: 'Risque A.R.C.A.: une solution imposee trop vite peut stabiliser la machine tout en sacrifiant les habitants qu il avait oublie de compter.',
    threatEn: 'A.R.C.A. risk: a solution imposed too quickly can stabilize the machine while sacrificing residents he forgot to count.',
    tags: ['Solar Opposites', 'Shlorp', 'Pupa', 'Science', 'Hacker']
  }),
  terry_solar: plaque({
    clearance: 'SOL-TERR',
    rankFr: 'Specialiste culturel improvise',
    rankEn: 'Improvised culture specialist',
    roleFr: 'Soutien mobile, diversion et cohesion familiale',
    roleEn: 'Mobile support, diversion, and family cohesion',
    callSign: 'Terry',
    originFr: 'Shlorp / banlieue terrestre - mission du Pupa',
    originEn: 'Shlorp / suburban Earth - Pupa mission',
    dossierFr: 'Dans sa Trame d origine, Terry est l adulte shlorpien qui adopte le plus volontiers la culture terrestre: television, nourriture, vetements, fetes et habitudes de voisinage. Ce gout ne le rend pas incompetent; il lui donne une lecture sociale que Korvo ne possede pas. Terry sait quand une invention menace la famille, quand un voisin devient un temoin et quand un plaisir terrestre peut servir de pont entre des extraterrestres bloques et leur monde d accueil.',
    dossierEn: 'In his origin Thread, Terry is the Shlorpian adult who most readily embraces Earth culture: television, food, clothes, parties, and neighborhood habits. That taste does not make him incompetent; it gives him a social reading Korvo lacks. Terry knows when an invention threatens the family, when a neighbor becomes a witness, and when an Earth pleasure can bridge stranded aliens and their adopted world.',
    breachFr: 'Dans la Cite-Mosaique, Terry stabilise les fragments de banlieue par leurs habitudes reelles plutot que par des calculs abstraits. Ses souvenirs de series, magasins et rituels domestiques donnent a A.R.C.A. des reperes humains pour distinguer une maison vecue d un decor copie. Le Sans-Auteur le cible avec des quartiers composes uniquement de divertissements sans consequences. Terry comprend que ce paradis ne contient ni famille a proteger ni personne avec qui partager ces plaisirs, puis utilise sa chaine de gadgets absurdes pour rouvrir la route authentique.',
    breachEn: 'In Mosaic City, Terry stabilizes suburban fragments through their lived habits instead of abstract calculations. His memories of shows, stores, and domestic rituals give A.R.C.A. human markers that distinguish a lived-in home from a copied set. The Authorless targets him with districts made only of consequence-free entertainment. Terry realizes that this paradise contains neither family to protect nor anyone with whom to share those pleasures, then uses his chain of absurd gadgets to reopen the authentic route.',
    doctrineFr: 'Tir opportuniste, diversion culturelle, couverture familiale, gadgets domestiques et extraction de civils.',
    doctrineEn: 'Opportunistic fire, cultural diversion, family cover, household gadgets, and civilian extraction.',
    threatFr: 'Risque A.R.C.A.: les fausses Trames de confort peuvent retenir Terry assez longtemps pour laisser le Pupa poursuivre une sequence non surveillee.',
    threatEn: 'A.R.C.A. risk: false comfort Threads can hold Terry long enough for the Pupa to continue an unsupervised sequence.',
    tags: ['Solar Opposites', 'Shlorp', 'Earth', 'Support', 'Tactical']
  }),
  yumyulack_solar: plaque({
    clearance: 'SOL-YUMY',
    rankFr: 'Replicant experimental',
    rankEn: 'Experimental replicant',
    roleFr: 'Miniaturisation, controle de zone et analyse hostile',
    roleEn: 'Miniaturization, zone control, and hostile analysis',
    callSign: 'Yumyulack',
    originFr: 'Replicant shlorpien / societe miniature du Mur',
    originEn: 'Shlorpian replicant / miniature Wall society',
    dossierFr: 'Dans sa Trame d origine, Yumyulack est le replicant de Korvo. Il partage son mepris initial pour la Terre et transforme une curiosite scientifique en systeme de captivite: son rayon reducteur place des humains dans le Mur de sa chambre. Cette societe miniature developpe ses propres pouvoirs, revoltes, religions et tragedies. Yumyulack reste brillant et dangereux precisement parce qu il considere longtemps les vies reduites comme des specimens plutot que comme un peuple dont il porte la responsabilite.',
    dossierEn: 'In his origin Thread, Yumyulack is Korvo replicant. He shares Korvo early contempt for Earth and turns scientific curiosity into a system of captivity: his shrink ray places humans inside the Wall in his room. That miniature society develops its own powers, revolts, religions, and tragedies. Yumyulack remains brilliant and dangerous precisely because he long treats the reduced lives as specimens rather than a people for whom he is responsible.',
    breachFr: 'Les portails font du Mur une matrice capable d enfermer des fragments d univers entiers a l echelle miniature. Yumyulack pourrait ainsi sauver des quartiers de l effacement, mais chaque sauvegarde devient aussi une prison qu il controle. Son arc Breach ne glorifie pas le rayon reducteur: A.R.C.A. lui impose de rendre taille, sortie et autonomie a toute population extraite. Ses attaques miniaturisent temporairement armes et couvertures, jamais une conscience comme simple recompense.',
    breachEn: 'The portals turn the Wall into a matrix capable of holding entire universe fragments at miniature scale. Yumyulack could save districts from deletion this way, but every save also becomes a prison he controls. His Breach arc does not glorify the shrink ray: A.R.C.A. requires him to restore size, exit, and autonomy to every extracted population. His attacks temporarily miniaturize weapons and cover, never a consciousness as a mere reward.',
    doctrineFr: 'Rayon reducteur, confinement temporaire, lecture du Mur, decoy miniature et restitution obligatoire.',
    doctrineEn: 'Shrink ray, temporary containment, Wall analysis, miniature decoy, and mandatory restoration.',
    threatFr: 'Risque A.R.C.A.: son detachement scientifique peut convertir une evacuation en collection de specimens.',
    threatEn: 'A.R.C.A. risk: his scientific detachment can turn an evacuation into a specimen collection.',
    tags: ['Solar Opposites', 'Replicant', 'The Wall', 'Shrink Ray', 'Hacker']
  }),
  jesse_solar: plaque({
    clearance: 'SOL-JESS',
    rankFr: 'Replicant de liaison',
    rankEn: 'Liaison replicant',
    roleFr: 'Secours, mediation et ancrage relationnel',
    roleEn: 'Rescue, mediation, and relational anchoring',
    callSign: 'Jesse',
    originFr: 'Replicant shlorpienne / lycee terrestre',
    originEn: 'Shlorpian replicant / Earth high school',
    dossierFr: 'Dans sa Trame d origine, Jesse est la replicante de Terry et partage son affection pour les humains. Sa vie scolaire, ses amities et son empathie l obligent a voir les consequences que les adultes shlorpiens reduisent souvent a une experience. Elle reste equipee d une technologie extraterrestre dangereuse, mais son reflexe consiste plus volontiers a proteger une personne, reparer une relation ou faire comprendre a sa famille que la Terre n est pas un decor jetable.',
    dossierEn: 'In her origin Thread, Jesse is Terry replicant and shares his affection for humans. Her school life, friendships, and empathy force her to see consequences the Shlorpian adults often reduce to an experiment. She still carries dangerous alien technology, but her first instinct is more often to protect someone, repair a relationship, or make her family understand that Earth is not a disposable set.',
    breachFr: 'A.R.C.A. utilise Jesse comme liaison dans les quartiers ou la technologie shlorpienne a deja altere des civils. Elle identifie les personnes que les cartes classent comme dommages secondaires et maintient leurs liens assez longtemps pour que la Trame retrouve sa forme. Quand le Pupa diffuse plusieurs futurs incompatibles, Jesse refuse de choisir seulement celui ou sa famille survit: elle cherche la route qui permet aussi aux habitants de conserver leur propre histoire.',
    breachEn: 'A.R.C.A. uses Jesse as liaison in districts where Shlorpian technology has already altered civilians. She identifies people the maps classify as collateral damage and holds their connections long enough for the Thread to recover its shape. When the Pupa broadcasts several incompatible futures, Jesse refuses to choose only the one where her family survives: she searches for the route that also lets residents keep their own history.',
    doctrineFr: 'Tir de couverture, balise du Pupa, mediation, diversion et chaine de secours.',
    doctrineEn: 'Cover fire, Pupa beacon, mediation, diversion, and rescue chain.',
    threatFr: 'Risque A.R.C.A.: sa volonte de sauver simultanement famille et civils peut la maintenir dans une zone apres la fermeture de la route sure.',
    threatEn: 'A.R.C.A. risk: her determination to save family and civilians at once can keep her in a zone after the safe route closes.',
    tags: ['Solar Opposites', 'Replicant', 'Pupa', 'Rescue', 'Tactical']
  }),
  siren_head: plaque({
    clearance: 'SH-NULL',
    rankFr: 'Anomalie mimetique solitaire',
    rankEn: 'Solitary mimetic anomaly',
    roleFr: 'Predateur sonore sous verrou de resonance',
    roleEn: 'Audio predator under resonance lock',
    callSign: 'Siren Head',
    originFr: 'Legende visuelle de Trevor Henderson - zones rurales et forestieres',
    originEn: 'Trevor Henderson visual legend - rural and wooded areas',
    dossierFr: 'Dans sa Trame d origine, Siren Head est un unique predateur organique, immense et emacie, dont le cou porte deux sirenes fusionnees a la chair et aux cables. Il n est ni un SCP ni un robot. Il se confond avec les arbres et poteaux, se deplace avec une vitesse contradictoire a sa silhouette et utilise alertes, stations de nombres, fragments musicaux, animaux ou voix humaines imitees pour isoler ses proies. Sa force vient moins d un duel frontal que de la certitude qu un appel familier peut etre un piege.',
    dossierEn: 'In its origin Thread, Siren Head is a single organic predator, immense and emaciated, with two sirens fused to flesh and cables atop its neck. It is neither an SCP nor a robot. It blends with trees and utility poles, moves with speed that contradicts its silhouette, and uses alerts, number stations, music fragments, animals, or copied human voices to isolate prey. Its power comes less from a direct duel than from the certainty that a familiar call may be a trap.',
    breachFr: 'La Premiere Breche lui donne acces aux archives audio des equipes disparues. Chaque portail devient alors un haut-parleur possible et chaque appel de secours une piste de chasse. A.R.C.A. ne recrute pas Siren Head: elle enferme une empreinte de son comportement dans une plaquette de resonance utilisable en simulation. Cette version jouable reste un outil dangereux, incapable de promettre une alliance. Sa mission personnelle consiste a detruire les relais copies par le Sans-Auteur avant que le vrai predateur ne puisse parler avec toutes les voix du Nexus.',
    breachEn: 'The First Breach grants it access to audio archives from missing teams. Every portal becomes a possible speaker and every distress call a hunting trail. A.R.C.A. does not recruit Siren Head: it seals a behavioral imprint inside a resonance plaque usable in simulation. This playable version remains a dangerous tool incapable of promising alliance. Its personal mission is to destroy relays copied by the Authorless before the true predator can speak with every voice in the Nexus.',
    doctrineFr: 'Mimique audio, camouflage forestier, rafale de station de nombres et brouillage des appels ennemis.',
    doctrineEn: 'Audio mimicry, forest camouflage, number-station burst, and hostile-call jamming.',
    threatFr: 'Risque A.R.C.A. maximal: ne jamais suivre une voix emise par la plaquette hors du perimetre de simulation.',
    threatEn: 'Maximum A.R.C.A. risk: never follow a voice emitted by the plaque outside the simulation perimeter.',
    tags: ['Siren Head', 'Trevor Henderson', 'Mimicry', 'Audio', 'Horror']
  }),
  long_horse: plaque({
    clearance: 'TH-LH',
    rankFr: 'Entite de presage',
    rankEn: 'Omen entity',
    roleFr: 'Alerte interdimensionnelle et extraction',
    roleEn: 'Cross-dimensional warning and extraction',
    callSign: 'Long Horse',
    originFr: 'Mythos de Trevor Henderson - presage bienveillant',
    originEn: 'Trevor Henderson mythos - benevolent omen',
    dossierFr: 'Dans sa Trame d origine, Long Horse apparait comme un crane de cheval sans machoire inferieure prolonge par un cou vertebral apparemment sans fin. Son arrivee annonce un malheur mais ne le provoque pas: l entite avertit et protege plutot qu elle ne chasse. Sa geometrie lui permet de se courber autour d angles impossibles et de traverser des distances que le terrain visible ne contient pas.',
    dossierEn: 'In its origin Thread, Long Horse appears as a horse skull without a lower jaw, extended by an apparently endless vertebral neck. Its arrival warns of misfortune but does not cause it: the entity warns and protects rather than hunts. Its geometry lets it bend around impossible corners and cross distances the visible terrain cannot contain.',
    breachFr: 'Long Horse percoit les portails mensongers comme des articulations mal placees dans son propre cou. Il se manifeste avant les attaques de Siren Head et indique une route dont les voix n ont pas ete copiees. A.R.C.A. ne tente pas de le contenir; elle enregistre seulement les presages et laisse l entite choisir quand apparaitre. En combat, sa plaquette represente un avertissement et une issue, jamais une monture ni une arme ordinaire.',
    breachEn: 'Long Horse perceives deceptive portals as misplaced joints in its own neck. It manifests before Siren Head attacks and marks a route whose voices were not copied. A.R.C.A. does not attempt containment; it records the omens and lets the entity choose when to appear. In combat, its plaque represents warning and escape, never an ordinary mount or weapon.',
    doctrineFr: 'Presage, marquage de route sure, esquive par angle impossible et soutien de retrait.',
    doctrineEn: 'Omen, safe-route marking, impossible-corner evasion, and retreat support.',
    threatFr: 'Risque A.R.C.A.: confondre son avertissement avec la cause du desastre ferait perdre la seule avance disponible.',
    threatEn: 'A.R.C.A. risk: mistaking its warning for the cause of disaster would waste the only available lead.',
    tags: ['Siren Head', 'Trevor Henderson', 'Omen', 'Rescue', 'Tactical']
  }),
  cartoon_cat: plaque({
    clearance: 'TH-CCAT',
    rankFr: 'Manifestation de faux media',
    rankEn: 'False-media manifestation',
    roleFr: 'Assaut elastique et rupture de cadre',
    roleEn: 'Elastic assault and frame breaking',
    callSign: 'Cartoon Cat',
    originFr: 'Mythos de Trevor Henderson - forme filtree par les anciens medias',
    originEn: 'Trevor Henderson mythos - form filtered through old media',
    dossierFr: 'Dans sa Trame d origine, Cartoon Cat n est pas un personnage comique devenu reel, mais une entite malveillante qui utilise une image de dessin anime ancien comme faux corps. Sa silhouette noire, son sourire trop large et ses membres elastiques imitent le langage rubber-hose pour mieux transformer une forme familiere en predateur. La croyance, les ecrans et les images servent de passage a cette manifestation.',
    dossierEn: 'In its origin Thread, Cartoon Cat is not a comic character made real, but a malevolent entity using an old-cartoon image as a false body. Its black silhouette, oversized grin, and elastic limbs imitate rubber-hose language to turn a familiar form into a predator. Belief, screens, and images act as passages for this manifestation.',
    breachFr: 'Le Sans-Auteur diffuse Cartoon Cat dans les vignettes d archives et tente de lui offrir chaque interface comme nouvelle peau. A.R.C.A. isole une incarnation dans une plaquette de combat pour retourner son elasticite contre les cadres corrompus, sans jamais la classer comme allie fiable. Son arc consiste a couper la chaine d images qui nourrit la manifestation avant qu elle ne puisse sortir de l ecran de mission.',
    breachEn: 'The Authorless broadcasts Cartoon Cat through archive thumbnails and tries to offer every interface as a new skin. A.R.C.A. isolates one incarnation inside a combat plaque to turn its elasticity against corrupted frames, without ever classifying it as a reliable ally. Its arc is to sever the chain of images feeding the manifestation before it can leave the mission screen.',
    doctrineFr: 'Allonge rubber-hose, saut de frame, griffe elastique et rupture de diffusion.',
    doctrineEn: 'Rubber-hose reach, frame skip, elastic claw, and broadcast rupture.',
    threatFr: 'Risque A.R.C.A. maximal: toute reproduction non verrouillee de sa plaquette peut devenir un nouveau seuil.',
    threatEn: 'Maximum A.R.C.A. risk: any unlocked reproduction of its plaque can become a new threshold.',
    tags: ['Siren Head', 'Trevor Henderson', 'Old Media', 'Manifestation', 'Slayer']
  }),
  ahsoka_padawan: plaque({
    clearance: 'SW-AH14',
    rankFr: 'Padawan commandante',
    rankEn: 'Padawan commander',
    roleFr: 'Mobilite Jedi et apprentissage sous pression',
    roleEn: 'Jedi mobility and learning under pressure',
    callSign: 'Snips',
    originFr: 'Republique galactique - debut de la Guerre des Clones',
    originEn: 'Galactic Republic - early Clone Wars',
    dossierFr: 'Dans sa Trame d origine, Ahsoka Tano est une Togruta de quatorze ans confiee comme Padawan a Anakin Skywalker. Vive, inventive et parfois trop sure de son jugement, elle apprend a commander des clones dans une guerre qui transforme des apprentis en officiers. Cette incarnation porte sa tenue marron et bordeaux des premieres campagnes, manie un sabre vert en prise inversee et n a pas encore subi la rupture avec l Ordre Jedi.',
    dossierEn: 'In her origin Thread, Ahsoka Tano is a fourteen-year-old Togruta assigned as Padawan to Anakin Skywalker. Quick, inventive, and sometimes too certain of her judgment, she learns to command clones in a war that turns apprentices into officers. This incarnation wears her brown and burgundy early-campaign outfit, wields one green lightsaber in reverse grip, and has not yet endured her break with the Jedi Order.',
    breachFr: 'La Breche separe Ahsoka de son propre avenir et lui montre des fragments qu elle ne devrait pas connaitre: Mandalore, l Ordre 66 et le masque de Vader. A.R.C.A. verrouille ces images pour ne pas voler ses choix. Son arc personnel consiste a sauver une section clone sans utiliser la connaissance du futur comme condamnation, puis a comprendre que le courage n est pas l absence d erreur mais la responsabilite prise apres celle-ci.',
    breachEn: 'The Breach separates Ahsoka from her own future and shows fragments she should not know: Mandalore, Order 66, and Vader mask. A.R.C.A. locks those images so they do not steal her choices. Her personal arc is to save a clone section without using future knowledge as a sentence, then understand that courage is not the absence of mistakes but responsibility taken after them.',
    doctrineFr: 'Sabre vert en prise inversee, bond de Force, deflexion Shien et commandement clone.',
    doctrineEn: 'Reverse-grip green saber, Force leap, Shien deflection, and clone command.',
    threatFr: 'Risque A.R.C.A.: une memoire future non filtree peut briser sa confiance en Anakin avant que leur histoire ne soit vecue.',
    threatEn: 'A.R.C.A. risk: an unfiltered future memory can break her trust in Anakin before their history is lived.',
    tags: ['Star Wars', 'Ahsoka', 'Padawan', 'Clone Wars', 'Slayer']
  }),
  ahsoka: plaque({
    clearance: 'SW-AH17',
    rankFr: 'Commandante hors de l Ordre',
    rankEn: 'Commander outside the Order',
    roleFr: 'Duel, protection des clones et rupture de siege',
    roleEn: 'Dueling, clone protection, and siege breaking',
    callSign: 'Fulcrum-0',
    originFr: 'Mandalore - derniers jours de la Guerre des Clones',
    originEn: 'Mandalore - final days of the Clone Wars',
    dossierFr: 'Dans sa Trame d origine, Ahsoka a quitte l Ordre Jedi apres avoir ete accusee a tort de l attentat du Temple. Elle revient sans reprendre le titre de Jedi pour diriger la 332e compagnie avec Rex pendant le siege de Mandalore. Anakin lui rend deux sabres dont les lames sont devenues bleues. Elle affronte Maul, le capture, puis survit a l Ordre 66 en refusant autant que possible de massacrer les clones asservis par leurs puces inhibitrices.',
    dossierEn: 'In her origin Thread, Ahsoka has left the Jedi Order after being falsely accused in the Temple bombing. She returns without reclaiming the Jedi title to lead the 332nd with Rex during the Siege of Mandalore. Anakin returns two lightsabers whose blades have become blue. She duels and captures Maul, then survives Order 66 while refusing whenever possible to massacre clones enslaved by their inhibitor chips.',
    breachFr: 'Le fragment de Mandalore arrive dans le Nexus avec un ordre contradictoire: capturer Maul, proteger Rex et fuir un croiseur dont la chute existe deja dans les archives. Ahsoka utilise les portails comme des routes de sauvetage, jamais comme moyen de corriger le passe. Son arc la confronte a une copie de la 332e qui ne peut etre sauvee qu en laissant Maul libre. Elle choisit les vies presentes plutot que la victoire symbolique et accepte que cette decision ait un cout.',
    breachEn: 'The Mandalore fragment reaches the Nexus with contradictory orders: capture Maul, protect Rex, and escape a cruiser whose fall already exists in the archives. Ahsoka uses portals as rescue routes, never as a way to correct the past. Her arc confronts her with a copy of the 332nd that can only be saved by leaving Maul free. She chooses present lives over symbolic victory and accepts that the decision has a cost.',
    doctrineFr: 'Deux sabres bleus, contre de trone, deflexion Ordre 66 et rupture de siege.',
    doctrineEn: 'Twin blue sabers, throne-room counter, Order 66 deflection, and siege break.',
    threatFr: 'Risque A.R.C.A.: les echos de clones morts peuvent transformer chaque ordre tactique en paralysie morale.',
    threatEn: 'A.R.C.A. risk: echoes of dead clones can turn every tactical order into moral paralysis.',
    tags: ['Star Wars', 'Ahsoka', 'Mandalore', 'Order 66', 'Slayer']
  }),
  ahsoka_adult: plaque({
    clearance: 'SW-AHAD',
    rankFr: 'Fulcrum et ancienne Jedi',
    rankEn: 'Fulcrum and former Jedi',
    roleFr: 'Mentorat, lecture de Force et verrou temporel',
    roleEn: 'Mentorship, Force reading, and temporal lock',
    callSign: 'Fulcrum',
    originFr: 'Rebellion / Nouvelle Republique - apres l Ordre 66',
    originEn: 'Rebellion / New Republic - after Order 66',
    dossierFr: 'Dans sa Trame d origine, Ahsoka adulte a survecu a la chute de la Republique, construit deux sabres blancs avec des cristaux purifies et servi la Rebellion sous le nom de Fulcrum. Elle affronte la verite d Anakin devenu Darth Vader, traverse le Monde entre les Mondes grace a Ezra, puis poursuit Thrawn et Ezra au-dela des routes galactiques connues. Cette incarnation n est plus definie par un rang Jedi: elle choisit ce qu elle transmet et ce qu elle refuse de reproduire.',
    dossierEn: 'In her origin Thread, adult Ahsoka survived the fall of the Republic, built two white lightsabers from purified crystals, and served the Rebellion under the Fulcrum identity. She confronts the truth of Anakin as Darth Vader, crosses the World Between Worlds through Ezra, then pursues Thrawn and Ezra beyond known galactic routes. This incarnation is no longer defined by Jedi rank: she chooses what to pass on and what she refuses to repeat.',
    breachFr: 'Les portails du Nexus ressemblent dangereusement au Monde entre les Mondes, mais Ahsoka reconnait qu ils n en suivent pas les lois. Elle devient la gardienne des routes qui montrent le passe sans autoriser sa consommation. Le Sans-Auteur lui offre un passage ou Anakin ne tombe jamais; elle le ferme parce qu il efface Luke, Leia, Ezra et toutes les decisions nees de cette perte. Sa victoire n est pas d obtenir une histoire parfaite, mais d empecher le Nexus de prendre la memoire pour une permission de reecrire.',
    breachEn: 'Nexus portals resemble the World Between Worlds dangerously closely, but Ahsoka recognizes that they do not follow its laws. She becomes guardian of routes that show the past without allowing it to be consumed. The Authorless offers her a passage where Anakin never falls; she closes it because it erases Luke, Leia, Ezra, and every choice born from that loss. Her victory is not obtaining a perfect history, but preventing the Nexus from mistaking memory for permission to rewrite.',
    doctrineFr: 'Deux sabres blancs, lecture Fulcrum, pas intertemporel limite et mentorat de cellule.',
    doctrineEn: 'Twin white sabers, Fulcrum analysis, limited intertime step, and cell mentorship.',
    threatFr: 'Risque A.R.C.A.: tout portail imitant le Monde entre les Mondes doit etre considere hostile jusqu a preuve causale contraire.',
    threatEn: 'A.R.C.A. risk: any portal imitating the World Between Worlds must be treated as hostile until causally proven otherwise.',
    tags: ['Star Wars', 'Ahsoka', 'Fulcrum', 'White Sabers', 'Tactical']
  }),
  aayla_secura: plaque({
    clearance: 'SW-AAYL',
    rankFr: 'Generale Jedi',
    rankEn: 'Jedi General',
    roleFr: 'Avant-garde agile et commandement clone',
    roleEn: 'Agile vanguard and clone command',
    callSign: 'Secura',
    originFr: 'Ryloth / Republique galactique - Guerre des Clones',
    originEn: 'Ryloth / Galactic Republic - Clone Wars',
    dossierFr: 'Dans sa Trame d origine, Aayla Secura est une Jedi Twi lek a la peau bleue, ancienne Padawan de Quinlan Vos et Generale pendant la Guerre des Clones. Elle combat sur Geonosis, Maridun et Felucia, travaille avec le Commandant Bly et enseigne a Ahsoka que l attachement ne doit pas detruire le devoir envers les vivants. L Ordre 66 retourne finalement ses propres soldats contre elle sur Felucia.',
    dossierEn: 'In her origin Thread, Aayla Secura is a blue-skinned Twi lek Jedi, former Padawan of Quinlan Vos, and General during the Clone Wars. She fights on Geonosis, Maridun, and Felucia, serves with Commander Bly, and teaches Ahsoka that attachment must not destroy duty toward the living. Order 66 ultimately turns her own soldiers against her on Felucia.',
    breachFr: 'Une faille de Felucia repete l Ordre 66 comme un signal sans emetteur et transforme chaque clone archive en assaillant. Aayla refuse de traiter Bly et ses hommes comme des ennemis ordinaires. Elle remonte le signal, neutralise les puces reproduites par le Nexus et recupere les memoires d avant l ordre. Son arc Breach transforme sa derniere seconde en mission active: sauver la relation de confiance que Palpatine avait convertie en arme.',
    breachEn: 'A Felucia breach repeats Order 66 as a signal without a sender and turns every archived clone into an attacker. Aayla refuses to treat Bly and his men as ordinary enemies. She traces the signal, disables chips reproduced by the Nexus, and recovers memories from before the order. Her Breach arc turns her final second into an active mission: save the trust Palpatine converted into a weapon.',
    doctrineFr: 'Sabre bleu, flanc de Felucia, parade Jedi et coordination avec le Commandant Bly.',
    doctrineEn: 'Blue saber, Felucia flank, Jedi guard, and Commander Bly coordination.',
    threatFr: 'Risque A.R.C.A.: les commandes clone falsifiees peuvent exploiter son refus legitime d abandonner ses soldats.',
    threatEn: 'A.R.C.A. risk: forged clone commands can exploit her justified refusal to abandon her soldiers.',
    tags: ['Star Wars', 'Aayla Secura', 'Jedi', 'Felucia', 'Slayer']
  }),
  darth_maul: plaque({
    clearance: 'SW-MAUL',
    rankFr: 'Ancien apprenti Sith',
    rankEn: 'Former Sith apprentice',
    roleFr: 'Duel agressif et domination criminelle',
    roleEn: 'Aggressive dueling and criminal domination',
    callSign: 'Maul',
    originFr: 'Dathomir / Mandalore - Ordre Sith et Shadow Collective',
    originEn: 'Dathomir / Mandalore - Sith Order and Shadow Collective',
    dossierFr: 'Dans sa Trame d origine, Maul est un Zabrak de Dathomir faconne par Darth Sidious comme arme contre les Jedi. Il manie un sabre rouge a double lame, tue Qui-Gon Jinn puis est tranche par Obi-Wan Kenobi. Sa haine le maintient en vie; des jambes mecaniques remplacent son corps perdu et Mother Talzin restaure son esprit. Maul construit le Shadow Collective, prend Mandalore, perd Savage face a Sidious et transforme sa survie en obsession contre Kenobi et contre tous les maitres qui l ont utilise.',
    dossierEn: 'In his origin Thread, Maul is a Dathomirian Zabrak shaped by Darth Sidious as a weapon against the Jedi. He wields a double-bladed red lightsaber, kills Qui-Gon Jinn, then is cut down by Obi-Wan Kenobi. Hatred keeps him alive; mechanical legs replace his lost body and Mother Talzin restores his mind. Maul builds the Shadow Collective, takes Mandalore, loses Savage to Sidious, and turns survival into obsession against Kenobi and every master who used him.',
    breachFr: 'Le Nexus contient des milliers d echos d Obi-Wan, mais aucun n appartient a la route que Maul croit devoir achever. Il conquiert des portails comme il conquis Mandalore et tente de batir un nouveau Shadow Collective avec des factions fracturees. Son arc Breach le force a choisir entre poursuivre un faux Kenobi fabrique pour le retenir ou detruire le relais de Sidious qui controle les fragments. Il brise le relais, non par redemption, mais parce qu il refuse enfin qu un maitre choisisse la forme de sa haine.',
    breachEn: 'The Nexus contains thousands of Obi-Wan echoes, but none belongs to the route Maul believes he must finish. He conquers portals as he conquered Mandalore and tries to build a new Shadow Collective from fractured factions. His Breach arc forces him to choose between pursuing a false Kenobi built to hold him or destroying the Sidious relay controlling the fragments. He breaks the relay, not through redemption, but because he finally refuses to let a master choose the shape of his hatred.',
    doctrineFr: 'Sabre double, rotation cybernetique, etranglement de Force et commandement du Shadow Collective.',
    doctrineEn: 'Double saber, cybernetic spin, Force choke, and Shadow Collective command.',
    threatFr: 'Risque A.R.C.A. critique: toute signature Kenobi peut provoquer une rupture immediate de mission.',
    threatEn: 'Critical A.R.C.A. risk: any Kenobi signature can trigger immediate mission rupture.',
    tags: ['Star Wars', 'Maul', 'Dathomir', 'Mandalore', 'Slayer']
  }),
  darth_revan: plaque({
    clearance: 'SW-REVN',
    rankFr: 'Seigneur Sith amnesique',
    rankEn: 'Amnesiac Sith Lord',
    roleFr: 'Duel hybride, commandement et choix de Force',
    roleEn: 'Hybrid dueling, command, and Force choice',
    callSign: 'Revan',
    originFr: 'Legends - Ancienne Republique / Guerre Civile Jedi',
    originEn: 'Legends - Old Republic / Jedi Civil War',
    dossierFr: 'Dans la continuite Legends de Knights of the Old Republic, Revan est un Jedi parti combattre les Mandaloriens, devenu Seigneur Sith avec Malak, puis capture et prive de sa memoire par le Conseil Jedi. Le joueur reconstruit cette identite et choisit ce qu elle devient. Sa silhouette iconique associe capuche noire, armure sombre, masque mandalorien rouge et sabres rouge et violet; elle represente une histoire ou identite, responsabilite et alignement ne peuvent pas etre separes du choix.',
    dossierEn: 'In the Legends continuity of Knights of the Old Republic, Revan is a Jedi who went to fight the Mandalorians, became a Sith Lord with Malak, then was captured and stripped of memory by the Jedi Council. The player rebuilds that identity and chooses what it becomes. The iconic silhouette combines a black hood, dark armor, a red Mandalorian mask, and red and purple sabers; it represents a story where identity, responsibility, and alignment cannot be separated from choice.',
    breachFr: 'Le Sans-Auteur voit dans l amnesie de Revan une porte ideale: remplacer une personne par son dossier sans que personne ne puisse prouver la difference. Revan repond en cartographiant chaque decision conservee plutot qu en cherchant une version unique de lui-meme. La Forge Stellaire reconstituee par la Breche produit des soldats a partir de souvenirs supprimes; son arc personnel exige de detruire cette production, puis de laisser l Ancre choisir si le masque reste symbole de peur, de dette ou de seconde chance.',
    breachEn: 'The Authorless sees Revan amnesia as an ideal doorway: replace a person with a file while nobody can prove the difference. Revan answers by mapping every preserved choice instead of searching for one definitive self. A Breach-rebuilt Star Forge manufactures soldiers from deleted memories; the personal arc requires destroying that production, then letting the Anchor decide whether the mask remains a symbol of fear, debt, or second chance.',
    doctrineFr: 'Masque de focalisation, sabres rouge et violet, contre de Force et commandement de Forge Stellaire.',
    doctrineEn: 'Focus mask, red and purple sabers, Force counter, and Star Forge command.',
    threatFr: 'Risque A.R.C.A.: une restauration forcee de memoire peut recreer Darth Revan sans les choix qui l avaient transforme.',
    threatEn: 'A.R.C.A. risk: forced memory restoration can recreate Darth Revan without the choices that changed that identity.',
    tags: ['Star Wars', 'Legends', 'Revan', 'KOTOR', 'Tactical']
  }),
  darth_talon: plaque({
    clearance: 'SW-TALN',
    rankFr: 'Main du One Sith',
    rankEn: 'Hand of the One Sith',
    roleFr: 'Traque, infiltration et assassinat Sith',
    roleEn: 'Hunting, infiltration, and Sith assassination',
    callSign: 'Talon',
    originFr: 'Legends - ere Legacy / One Sith de Darth Krayt',
    originEn: 'Legends - Legacy era / Darth Krayt One Sith',
    dossierFr: 'Dans la continuite Legends de Star Wars: Legacy, Darth Talon est une Twi lek Sith a la peau rouge couverte de tatouages noirs rituels. Formee dans l ordre One Sith de Darth Krayt, elle devient l une de ses Mains, traque Cade Skywalker et manie un sabre rouge avec une violence precise. Ses tatouages ne sont pas decoratifs: ils signalent son appartenance, sa discipline et la possession politique de son corps par l ordre Sith.',
    dossierEn: 'In the Legends continuity of Star Wars: Legacy, Darth Talon is a red-skinned Twi lek Sith covered in ritual black tattoos. Trained within Darth Krayt One Sith order, she becomes one of his Hands, hunts Cade Skywalker, and wields a red lightsaber with precise violence. Her tattoos are not decoration: they mark allegiance, discipline, and the Sith order political ownership of her body.',
    breachFr: 'Les fractures du Nexus transforment ses tatouages en lignes de coordonnees capables de marquer une cible entre plusieurs univers. Krayt lui ordonne de retrouver un Cade qui n existe que comme echo d archive. Talon decouvre que le signal vient du Sans-Auteur, lequel cherche a faire du One Sith une police de suppression. Son arc ne la rend pas soudainement heroique: elle coupe la marque parce qu elle refuse qu une autorite inconnue supplante son serment, puis conserve les coordonnees pour ses propres objectifs.',
    breachEn: 'Nexus fractures turn her tattoos into coordinate lines able to mark a target across universes. Krayt orders her to find a Cade who exists only as an archive echo. Talon discovers the signal comes from the Authorless, who wants the One Sith to become deletion police. Her arc does not make her suddenly heroic: she cuts the mark because she refuses to let an unknown authority replace her oath, then keeps the coordinates for her own purposes.',
    doctrineFr: 'Sabre rouge, bond de traque, focalisation des tatouages et execution de cible marquee.',
    doctrineEn: 'Red saber, hunter leap, tattoo focus, and marked-target execution.',
    threatFr: 'Risque A.R.C.A. critique: la cooperation cesse des qu une cible prioritaire du One Sith apparait dans la Trame.',
    threatEn: 'Critical A.R.C.A. risk: cooperation ends the moment a One Sith priority target appears in the Thread.',
    tags: ['Star Wars', 'Legends', 'Darth Talon', 'One Sith', 'Slayer']
  })
};

export const SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES = {
  korvo_solar: '/sprites/generated/heroes/solar-opposites/korvo-solar.png',
  terry_solar: '/sprites/generated/heroes/solar-opposites/terry-solar.png',
  yumyulack_solar: '/sprites/generated/heroes/solar-opposites/yumyulack-solar.png',
  jesse_solar: '/sprites/generated/heroes/solar-opposites/jesse-solar.png',
  siren_head: '/sprites/generated/heroes/siren-head/siren-head.png',
  long_horse: '/sprites/generated/heroes/siren-head/long-horse.png',
  cartoon_cat: '/sprites/generated/heroes/siren-head/cartoon-cat.png',
  ahsoka_padawan: '/sprites/generated/heroes/star-wars/ahsoka-padawan.png',
  ahsoka: '/sprites/generated/heroes/star-wars/ahsoka.png',
  ahsoka_adult: '/sprites/generated/heroes/star-wars/ahsoka-adult.png',
  aayla_secura: '/sprites/generated/heroes/star-wars/aayla-secura.png',
  darth_maul: '/sprites/generated/heroes/star-wars/darth-maul.png',
  darth_revan: '/sprites/generated/heroes/star-wars/darth-revan.png',
  darth_talon: '/sprites/generated/heroes/star-wars/darth-talon.png'
};

export const SOLAR_OPPOSITES_SIREN_STAR_WARS_REFERENCE_ENTRIES = [
  ['Korvo', 'Solar Opposites - current suburban outfit', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.korvo_solar, ['https://www.hulu.com/series/solar-opposites-f089664b-1a87-433b-86a5-24e7da5a246a']],
  ['Terry', 'Solar Opposites - current suburban outfit', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.terry_solar, ['https://www.hulu.com/series/solar-opposites-f089664b-1a87-433b-86a5-24e7da5a246a']],
  ['Yumyulack', 'Solar Opposites - replicant trench-coat outfit', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.yumyulack_solar, ['https://www.hulu.com/series/solar-opposites-f089664b-1a87-433b-86a5-24e7da5a246a']],
  ['Jesse', 'Solar Opposites - replicant pink polka-dot dress', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.jesse_solar, ['https://www.hulu.com/series/solar-opposites-f089664b-1a87-433b-86a5-24e7da5a246a']],
  ['Siren Head', 'Trevor Henderson solitary twin-siren mimetic predator', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.siren_head, ['https://www.trevorhenderson.com/', 'https://trevorhenderson.fandom.com/wiki/Siren_Head']],
  ['Long Horse', 'Trevor Henderson benevolent endless-neck omen entity', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.long_horse, ['https://www.trevorhenderson.com/', 'https://trevorhenderson.fandom.com/wiki/Long_Horse']],
  ['Cartoon Cat', 'Trevor Henderson old-media faux cartoon body', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.cartoon_cat, ['https://www.trevorhenderson.com/', 'https://trevorhenderson.fandom.com/wiki/Cartoon_Cat']],
  ['Ahsoka Tano (Padawan)', 'The Clone Wars early Padawan with one green lightsaber', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.ahsoka_padawan, ['https://www.starwars.com/databank/ahsoka-tano']],
  ['Ahsoka Tano (Siege of Mandalore)', 'The Clone Wars final-season Mandalore outfit with twin blue lightsabers', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.ahsoka, ['https://www.starwars.com/databank/ahsoka-tano', 'https://www.starwars.com/series/clone-wars/old-friends-not-forgotten-episode-guide']],
  ['Ahsoka Tano (Adult)', 'Rebels and Ahsoka mature former Jedi with twin white lightsabers', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.ahsoka_adult, ['https://www.starwars.com/databank/ahsoka-tano', 'https://www.starwars.com/series/star-wars-rebels/fire-across-the-galaxy-concept-art-gallery']],
  ['Aayla Secura', 'Clone Wars Twi lek Jedi General', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.aayla_secura, ['https://www.starwars.com/databank/aayla-secura']],
  ['Darth Maul', 'The Clone Wars Mandalore incarnation with cybernetic legs', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.darth_maul, ['https://www.starwars.com/databank/maul']],
  ['Darth Revan', 'Knights of the Old Republic iconic masked Legends identity', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.darth_revan, ['https://www.starwars.com/news/from-a-certain-point-of-view-whos-the-best-star-wars-games-character', 'https://www.starwars.com/news/darth-revan-force-fx-elite-lightsaber']],
  ['Darth Talon', 'Star Wars Legacy red Twi lek One Sith Hand', SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES.darth_talon, ['https://starwars.fandom.com/wiki/Darth_Talon']]
].map(([character, incarnation, output, referencePages]) => ({
  character,
  incarnation,
  output,
  referencePages,
  referenceImages: [],
  verifiedAt: '2026-07-23'
}));
