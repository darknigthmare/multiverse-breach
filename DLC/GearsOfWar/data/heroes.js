// Gears of War — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'marcus',
    name: 'Marcus Fenix',
    universe: 'Gears of War',
    category: 'tactical',
    primaryColor: '#4a4e52',
    secondaryColor: '#ff4500',
    weaponType: 'chainsaw',
    weaponColor: '#8b0000',
    stats: { hp: 160, atk: 15, def: 12, spd: 4 },
    simple: { name: 'Lancer Fire', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Chainsaw Lunge', type: 'melee', cd: 8, dmg: 2.2 },
    defense: { name: 'Roadie Cover', type: 'shield', dur: 2.5, reduce: 0.8 },
    special: { name: 'Hammer of Dawn', type: 'beam_aoe', dmg: 5.0, color: '#ff4500' }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'cog_armor', universe: 'Gears of War', name: { en: 'COG Combat Plate', fr: 'Plastron CGU' }, boost: { hp: 60, def: 6 }, cost: 100 });
}

export function createEquipItemsDb2() {
  return ({ id: 'frag_grenade', universe: 'Gears of War', name: { en: 'Frag Grenade Mod', fr: 'Grenade à Fragmentation' }, boost: { atk: 8 }, cost: 100 });
}

export function createEquipItemsDb3() {
  return ({ id: 'snub_pistol', universe: 'Gears of War', name: { en: 'Snub Pistol Holster', fr: 'Pistolet Snub' }, boost: { spd: 1 }, cost: 80 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_gears_hammer',
    name: { en: 'Orbital Beacon', fr: 'Balise Orbitale CGU' },
    desc: { en: 'Targets all enemies with a secondary orbital blast from the Hammer of Dawn (150 damage).', fr: 'Cible tous les ennemis avec un tir secondaire du Rayon de l\'Aube (150 dégâts).' },
    effect: 'hammer_strike'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'dom', name: 'Dom Santiago', cat: 'marine', color: '#3498db' },
    { id: 'cole', name: 'Augustus Cole', cat: 'slayer', color: '#f1c40f' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'baird', name: 'Damon Baird', cat: 'hacker', color: '#95a5a6' },
    { id: 'anya_stroud', name: 'Anya Stroud', cat: 'tactical', color: '#d8d3c0' },
    { id: 'hoffman_cog', name: 'Colonel Hoffman', cat: 'marine', color: '#4d5656' },
    { id: 'carmine_cog', name: 'Carmine', cat: 'marine', color: '#6c7a89' },
    { id: 'kait_diaz', name: 'Kait Diaz', cat: 'slayer', color: '#7b241c' }
  ]);
}
