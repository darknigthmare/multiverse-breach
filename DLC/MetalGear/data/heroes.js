// Metal Gear — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'snake',
    name: 'Solid Snake',
    universe: 'Metal Gear',
    category: 'tactical',
    primaryColor: '#3a4454',
    secondaryColor: '#f1c40f',
    weaponType: 'gun',
    weaponColor: '#2b2b2b',
    stats: { hp: 140, atk: 16, def: 9, spd: 6 },
    simple: { name: 'SOCOM Laser Pistol', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Nikita Missile', type: 'rocket', cd: 8, dmg: 2.0 },
    defense: { name: 'Cardboard Box', type: 'dodge', dur: 2.5, reduce: 0.9 },
    special: { name: 'Chaff & CQC Combo', type: 'melee_aoe', dmg: 5.1 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'bandana_infinite', universe: 'Metal Gear', name: { en: 'Infinite Bandana', fr: 'Bandana Infini' }, boost: { atk: 12 }, cost: 150 });
}

export function createEquipItemsDb2() {
  return ({ id: 'cardboard_c', universe: 'Metal Gear', name: { en: 'Reinforced Box Cover', fr: 'Carton Renforcé' }, boost: { def: 9 }, cost: 90 });
}

export function createEquipItemsDb3() {
  return ({ id: 'ration_box', universe: 'Metal Gear', name: { en: 'Military Ration Pack', fr: 'Ration Militaire' }, boost: { hp: 90 }, cost: 80 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_mg_chaff',
    name: { en: 'Chaff Grenade', fr: 'Grenade Chaff' },
    desc: { en: 'Disrupts electronic sensors, preventing enemies from preparing boss special attacks for 10 seconds.', fr: 'Brouille les radars, empêchant les boss de préparer leurs super attaques pendant 10 secondes.' },
    effect: 'chaff_scrambler'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'raiden', name: 'Raiden', cat: 'slayer', color: '#95a5a6' },
    { id: 'otacon', name: 'Otacon', cat: 'hacker', color: '#16a085' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'meryl_mgs', name: 'Meryl Silverburgh', cat: 'tactical', color: '#a93226' },
    { id: 'liquid_snake', name: 'Liquid Snake', cat: 'slayer', color: '#7f5c38' },
    { id: 'the_boss_mgs', name: 'The Boss', cat: 'marine', color: '#d7d7c5' },
    { id: 'ocelot_mgs', name: 'Revolver Ocelot', cat: 'tactical', color: '#8e6e53' }
  ]);
}
