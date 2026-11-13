// Parasyte — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'parasyte',
    universe: 'Parasyte',
    mediaType: 'manga',
    faction: 'horror',
    mode: 'RPG',
    difficulty: 'Very Hard',
    titleFr: 'Parasyte',
    stage: 'East Fukuyama Parasite Hunt',
    boss: 'Gotou Five-Parasite Body',
    hero: ['shinichi_migi', 'Shinichi Izumi and Migi', 'horror'],
    allies: [['satomi_murano', 'Satomi Murano', 'tactical'], ['mamoru_uda', 'Mamoru Uda and Jaw', 'slayer']],
    monsters: ['Split-Head Parasite', 'Parasite Dog', 'City Hall Parasite Host'],
    bosses: ['Reiko Tamura', 'Hideo Shimada'],
    gear: [['migi_cell_sample', 'Migi Cell Sample', 'Echantillon cellulaire de Migi', { hp: 70, spd: 2 }], ['parasite_blade_arm', 'Parasite Blade Arm', 'Bras-lame parasite', { atk: 11 }], ['shinichi_school_bag', 'Shinichis School Bag', 'Sac scolaire de Shinichi', { def: 6, hp: 45 }]],
    event: ['evt_migi_reflex', 'Migi Autonomous Reflex', 'Reflexe autonome de Migi', 'Migi blocks a lethal strike while Shinichi reads the attackers killing intent.', 'Migi bloque un coup mortel pendant que Shinichi lit l intention meurtriere de l attaquant.'],
    theme: 'body-snatching parasites, human empathy, predatory biology, and Shinichis uneasy symbiosis with Migi',
    desc: { en: 'This is Parasyte, not Parasite Eve: alien organisms replace human heads while Migi remains trapped in Shinichis right hand.', fr: 'Il s agit de Parasyte, pas de Parasite Eve: des organismes extraterrestres remplacent les tetes humaines tandis que Migi reste prisonnier de la main droite de Shinichi.' },
    motif: 'facility',
    colors: ['#252118', '#050403', '#d8e36b'],
    stageVariants: [['Tactics', 'Fukuyama City Hall Assault', 'Very Hard', 'Reiko Tamura'], ['Smash', 'Forest Fire Gotou Pursuit', 'Expert', 'Gotou Five-Parasite Body']]
  });
}
