// Dead Space — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'isaac',
    name: 'Isaac Clarke',
    universe: 'Dead Space',
    category: 'marine',
    primaryColor: '#7e5109',
    secondaryColor: '#00ffff',
    weaponType: 'plasma_cutter',
    weaponColor: '#1a1104',
    stats: { hp: 150, atk: 17, def: 11, spd: 5 },
    simple: { name: 'Cutter Vertical', type: 'laser', dmg: 1.1 },
    secondary: { name: 'Stasis Slowdown', type: 'gravity', cd: 6, dmg: 1.6 },
    defense: { name: 'RIG Heavy Shield', type: 'shield', dur: 2.5, reduce: 0.85 },
    special: { name: 'Telekinetic Smash', type: 'gravity_aoe', dmg: 4.9 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'plasma_cutter_item', universe: 'Dead Space', name: { en: 'Industrial Plasma Cutter', fr: 'Cutter Plasma' }, boost: { atk: 14 }, cost: 140 });
}

export function createEquipItemsDb2() {
  return ({ id: 'rig_plate', universe: 'Dead Space', name: { en: 'RIG Suit Metal Plate', fr: 'Blindage de RIG' }, boost: { hp: 70, def: 6 }, cost: 100 });
}

export function createEquipItemsDb3() {
  return ({ id: 'stasis_battery', universe: 'Dead Space', name: { en: 'Stasis Charge Battery', fr: 'Pile Stase de RIG' }, boost: { spd: 2 }, cost: 80 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_ds_marker',
    name: { en: 'Red Marker Shard', fr: 'Fragment de Monolithe Rouge' },
    desc: { en: 'Emits Marker signals: drives all enemies insane, dealing 120 damage and paralyzing them for 4 seconds.', fr: 'Émet des ondes de Monolithe : rend les ennemis fous, infligeant 120 dégâts et les paralysant pendant 4 secondes.' },
    effect: 'marker_insanity'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'carver', name: 'John Carver', cat: 'marine', color: '#7f8c8d' },
    { id: 'ellie', name: 'Ellie Langford', cat: 'tactical', color: '#fdcb6e' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'nicole_brennan', name: 'Nicole Brennan', cat: 'hacker', color: '#85c1e9' },
    { id: 'zach_hammond', name: 'Zach Hammond', cat: 'marine', color: '#566573' },
    { id: 'kendra_daniels', name: 'Kendra Daniels', cat: 'tactical', color: '#c0c0c0' }
  ]);
}
