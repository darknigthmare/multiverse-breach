// Portal — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'chell',
    name: 'Chell',
    universe: 'Portal',
    category: 'hacker',
    primaryColor: '#ff6600',
    secondaryColor: '#ffffff',
    weaponType: 'portalgun',
    weaponColor: '#dcdcdc',
    stats: { hp: 120, atk: 12, def: 7, spd: 8 },
    simple: { name: 'Portal Fling', type: 'projectile', dmg: 0.9 },
    secondary: { name: 'Turret Summon', type: 'summon', cd: 7, dmg: 1.8 },
    defense: { name: 'Portal Redirect', type: 'dodge', dur: 2.0, reduce: 0.9 },
    special: { name: 'Neurotoxin Vent', type: 'poison', dmg: 4.4 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'longfall_boot', universe: 'Portal', name: { en: 'Long Fall Boots', fr: 'Bottes de Longue Chute' }, boost: { def: 8, spd: 2 }, cost: 110 });
}

export function createEquipItemsDb2() {
  return ({ id: 'potatos_battery', universe: 'Portal', name: { en: 'PotatOS AI Core', fr: 'PatatOS de Batterie' }, boost: { atk: 8 }, cost: 90 });
}

export function createEquipItemsDb3() {
  return ({ id: 'heart_cube', universe: 'Portal', name: { en: 'Companion Cube Heart', fr: 'Cœur de Cube de Voyage' }, boost: { hp: 120 }, cost: 130 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_portal_cube',
    name: { en: 'Companion Cube', fr: 'Cube de Voyage' },
    desc: { en: 'Drops a heavy Companion Cube that shields the squad, absorbing up to 200 incoming damage.', fr: 'Dépose un Cube de Voyage protecteur qui absorbe jusqu\'à 200 points de dégâts.' },
    effect: 'companion_shield'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'atlas', name: 'Atlas', cat: 'tactical', color: '#2980b9' },
    { id: 'pbody', name: 'P-Body', cat: 'marine', color: '#d35400' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'glados', name: 'GLaDOS', cat: 'hacker', color: '#dfe6e9' },
    { id: 'wheatley', name: 'Wheatley', cat: 'hacker', color: '#2980b9' },
    { id: 'cave_johnson', name: 'Cave Johnson', cat: 'tactical', color: '#f39c12' },
    { id: 'caroline_portal', name: 'Caroline', cat: 'hacker', color: '#e8d2a6' }
  ]);
}
