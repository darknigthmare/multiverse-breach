// Rosario + Vampire — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'tsukune',
    name: 'Moka Akashiya',
    universe: 'Rosario + Vampire',
    category: 'slayer',
    primaryColor: '#f5b041',
    secondaryColor: '#2c3e50',
    weaponType: 'kicking',
    weaponColor: '#cca43b',
    stats: { hp: 145, atk: 18, def: 9, spd: 8 },
    simple: { name: 'High Kick Sweep', type: 'melee', dmg: 1.2 },
    secondary: { name: 'Vampiric Burst Burst', type: 'darkness', cd: 8, dmg: 2.0 },
    defense: { name: 'Outer Charm Charm', type: 'dodge', dur: 2.0, reduce: 0.8 },
    special: { name: 'Inner Vampire Slash', type: 'melee_aoe', dmg: 5.4 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'rosario_cross', universe: 'Rosario + Vampire', name: { en: 'Moka Rosary Cross', fr: 'Croix de Moka' }, boost: { hp: 80, def: 6 }, cost: 130 });
}

export function createEquipItemsDb2() {
  return ({ id: 'vampire_bat', universe: 'Rosario + Vampire', name: { en: 'Lilith Vampire Bat', fr: 'Chauve-Souris Lilith' }, boost: { atk: 12 }, cost: 110 });
}

export function createEquipItemsDb3() {
  return ({ id: 'yokai_badge', universe: 'Rosario + Vampire', name: { en: 'Yokai Academy Uniform', fr: 'Uniforme de Yokai' }, boost: { spd: 2 }, cost: 90 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_rv_rosary',
    name: { en: 'Rosary Cross Release', fr: 'Libération du Rosaire' },
    desc: { en: 'Outer Moka releases rosary: Inner Moka sweeps dealing 200 damage and heals the squad for 100 HP.', fr: 'Libère le rosaire : Moka Interne balaie l\'écran infligeant 200 dégâts et soigne l\'escouade de 100 PV.' },
    effect: 'vampire_fury'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'tsukune', name: 'Tsukune Aono', cat: 'tactical', color: '#ffeaa7' },
    { id: 'kurumu', name: 'Kurumu Kurono', cat: 'horror', color: '#fd79a8' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'tsukune_aono', name: 'Tsukune Aono', cat: 'tactical', color: '#ffeaa7' },
    { id: 'yukari_rv', name: 'Yukari Sendo', cat: 'hacker', color: '#9b59b6' },
    { id: 'mizore_rv', name: 'Mizore Shirayuki', cat: 'horror', color: '#85c1e9' },
    { id: 'gin_rv', name: 'Gin Morioka', cat: 'slayer', color: '#95a5a6' }
  ]);
}
