// Payday — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'dallas',
    name: 'Dallas',
    universe: 'Payday',
    category: 'tactical',
    primaryColor: '#7a221f',
    secondaryColor: '#ffffff',
    weaponType: 'gun',
    weaponColor: '#474747',
    stats: { hp: 135, atk: 15, def: 8, spd: 6 },
    simple: { name: 'AMCAR Rifle', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Sentry Deploy', type: 'summon', cd: 8, dmg: 1.7 },
    defense: { name: 'Medic Bag heal', type: 'heal', dur: 1.5, reduce: 0.5 },
    special: { name: 'Guys, The Thermal Drill!', type: 'drill_smash', dmg: 4.6 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'armor_bag', universe: 'Payday', name: { en: 'Heavy Armor Bag', fr: 'Sac d\'Armures Lourdes' }, boost: { hp: 60, def: 8 }, cost: 100 });
}

export function createEquipItemsDb2() {
  return ({ id: 'drill_bit', universe: 'Payday', name: { en: 'Titanium Drill Bit', fr: 'Mèche de Perceuse Titanium' }, boost: { atk: 10 }, cost: 110 });
}

export function createEquipItemsDb3() {
  return ({ id: 'zipline_c', universe: 'Payday', name: { en: 'Escape Zipline Hook', fr: 'Crochet de Tyrolienne' }, boost: { spd: 2 }, cost: 80 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_pay_drill',
    name: { en: 'Thermal Drill Droppod', fr: 'Perceuse Thermique' },
    desc: { en: 'Drops a giant thermal drill on the highest health enemy, dealing 200 armor-piercing damage.', fr: 'Parachute une perceuse thermique géante sur l\'ennemi le plus fort, infligeant 200 dégâts d\'armure.' },
    effect: 'drill_drop'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'wolf_pd', name: 'Wolf', cat: 'slayer', color: '#c0392b' },
    { id: 'hoxton', name: 'Hoxton', cat: 'hacker', color: '#2980b9' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'chains_pd', name: 'Chains', cat: 'marine', color: '#2c3e50' },
    { id: 'houston_pd', name: 'Houston', cat: 'tactical', color: '#34495e' },
    { id: 'clover_pd', name: 'Clover', cat: 'slayer', color: '#27ae60' },
    { id: 'bain_pd', name: 'Bain', cat: 'hacker', color: '#95a5a6' }
  ]);
}
