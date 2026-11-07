// Hellraiser — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'kirsty',
    name: 'Kirsty Cotton',
    universe: 'Hellraiser',
    category: 'horror',
    primaryColor: '#ecf0f1',
    secondaryColor: '#9b59b6',
    weaponType: 'puzzlebox',
    weaponColor: '#d4af37',
    stats: { hp: 125, atk: 13, def: 8, spd: 6 },
    simple: { name: 'Puzzle Twist Spark', type: 'projectile', dmg: 1.0 },
    secondary: { name: 'Summon Chain Trap', type: 'zap', cd: 7, dmg: 1.7 },
    defense: { name: 'Cenobite Bargain', type: 'shield', dur: 2.5, reduce: 0.85 },
    special: { name: 'Lament Configuration', type: 'portal_vortex', dmg: 5.0 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'cenobite_hook', universe: 'Hellraiser', name: { en: 'Barbed Cenobite Hook', fr: 'Crochet de Cénobite' }, boost: { atk: 13 }, cost: 120 });
}

export function createEquipItemsDb2() {
  return ({ id: 'puzzle_piece', universe: 'Hellraiser', name: { en: 'Golden Puzzle Gear', fr: 'Engrenage Lament Doré' }, boost: { hp: 70, def: 7 }, cost: 110 });
}

export function createEquipItemsDb3() {
  return ({ id: 'pillar_stone', universe: 'Hellraiser', name: { en: 'Pillar of Souls Fragment', fr: 'Fragment du Pilier des Âmes' }, boost: { def: 9 }, cost: 100 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_hell_box',
    name: { en: 'Lament Box Trigger', fr: 'Mécanisme Lament' },
    desc: { en: 'Spawns chains from rifts that bind enemies, preventing them from moving and reducing their Defense to 0 for 8 seconds.', fr: 'Fait surgir des chaînes qui immobilisent les cibles et réduisent leur Défense à 0 pendant 8 secondes.' },
    effect: 'chain_bind'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'female_cenobite', name: 'Female Cenobite', cat: 'slayer', color: '#b2bec3' },
    { id: 'butterball', name: 'Butterball', cat: 'tactical', color: '#636e72' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'pinhead', name: 'Pinhead', cat: 'horror', color: '#d5dbdb' },
    { id: 'chatterer', name: 'Chatterer', cat: 'slayer', color: '#c0b6a0' },
    { id: 'julia_cotton', name: 'Julia Cotton', cat: 'horror', color: '#8b0000' }
  ]);
}
