// Alien — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'ripley',
    name: 'Ellen Ripley',
    universe: 'Alien',
    incarnation: 'Alien (1979) - Nostromo / Narcissus',
    referenceUrl: 'https://www.20thcenturystudios.com/movies/alien',
    visualAnchor: 'Ellen Ripley as played by Sigourney Weaver in Alien (1979): short curly brown hair, Nostromo flight suit and improvised flamethrower. No M41A pulse rifle, M240 incinerator or power loader from Aliens.',
    canonStatus: 'source-locked-gameplay-adaptation',
    visualReviewStatus: 'pending',
    equipment: ['Nostromo improvised flamethrower', 'Narcissus harpoon gun'],
    category: 'marine',
    primaryColor: '#8b8589',
    secondaryColor: '#4682b4',
    weaponType: 'gun',
    weaponColor: '#2f4f4f',
    stats: { hp: 130, atk: 14, def: 8, spd: 6 },
    simple: { name: 'Nostromo Flamethrower', type: 'fire', dmg: 1.0 },
    secondary: { name: 'Improvised Flame Burst', type: 'fire', cd: 7, dmg: 1.7 },
    defense: { name: 'Nostromo Escape', type: 'dodge', dur: 2.0, reduce: 0.75 },
    special: { name: 'Narcissus Harpoon', type: 'projectile', dmg: 4.2 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'motion_tracker', universe: 'Alien', name: { en: 'M314 Motion Tracker', fr: 'Détecteur de Mouvements' }, boost: { def: 5, spd: 2 }, cost: 100 });
}

export function createEquipItemsDb2() {
  return ({ id: 'welding_torch', universe: 'Alien', name: { en: 'Industrial Welder', fr: 'Chalumeau de Soudure' }, boost: { atk: 6, hp: 30 }, cost: 90 });
}

export function createEquipItemsDb3() {
  return ({ id: 'acid_mask', universe: 'Alien', name: { en: 'Hazmat Acid Guard', fr: 'Masque Anti-Acide' }, boost: { hp: 80 }, cost: 110 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_alien_egg',
    name: { en: 'Xenomorph Egg', fr: 'Œuf de Xénomorphe' },
    desc: { en: 'Places an egg that hatches a Facehugger, paralyzing the strongest enemy for 5 seconds.', fr: 'Place un œuf qui libère un Facehugger, paralysant l\'ennemi le plus fort pendant 5 secondes.' },
    effect: 'facehugger_stun'
  });
}

export function createExtraHeroData() {
  return ([
    {
      id: 'hicks', name: 'Corporal Hicks', cat: 'tactical', color: '#7f8c8d',
      incarnation: 'Aliens (1986) - Corporal Dwayne Hicks, uninjured field appearance',
      referenceUrl: 'https://www.20thcenturystudios.com/movies/aliens',
      visualAnchor: 'Michael Biehn as Corporal Dwayne Hicks in Aliens (1986): short swept-back brown hair, light stubble, anatomical left-ear communications headset, worn gray-green Colonial Marine armor with a small red heart accent, camouflage trousers, shin guards and brown combat boots. Keep the legacy Alien roster ID; do not substitute Hudson, an Alien (1979) crew uniform or an acid-injured appearance.',
      canonStatus: 'source-locked-gameplay-adaptation',
      visualReviewStatus: 'pending',
      equipment: ['Compact shotgun', 'Colonial Marine field armor', 'Left-ear communications headset']
    },
    { id: 'bishop', name: 'Bishop', cat: 'hacker', color: '#bdc3c7' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'dallas_alien', name: 'Captain Dallas', cat: 'tactical', color: '#8e8c7f' },
    { id: 'parker_alien', name: 'Parker', cat: 'marine', color: '#7d6d5f' },
    { id: 'lambert_alien', name: 'Lambert', cat: 'horror', color: '#c6b6a3' },
    { id: 'newt_aliens', name: 'Newt', cat: 'hacker', color: '#e0c18c' },
    { id: 'ash_alien', name: 'Ash', cat: 'hacker', color: '#d8d8d8' }
  ]);
}
