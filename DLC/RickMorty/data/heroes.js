// Rick & Morty — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'rick',
    name: 'Rick Sanchez',
    universe: 'Rick & Morty',
    category: 'hacker',
    primaryColor: '#5dade2',
    secondaryColor: '#f4d03f',
    weaponType: 'portalgun',
    weaponColor: '#7d6608',
    stats: { hp: 130, atk: 16, def: 8, spd: 8 },
    simple: { name: 'Sci-Fi Raygun', type: 'laser', dmg: 1.1 },
    secondary: { name: 'Portal Fling Trap', type: 'projectile', cd: 6, dmg: 1.8 },
    defense: { name: 'Personal Bubble', type: 'shield', dur: 2.5, reduce: 0.9 },
    special: { name: 'Microverse Battery Overcharge', type: 'beam_aoe', dmg: 5.5 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'portal_gun_item', universe: 'Rick & Morty', name: { en: 'Rick\'s Portal Gun', fr: 'Pistolet à Portails de Rick' }, boost: { atk: 12, spd: 2 }, cost: 150 });
}

export function createEquipItemsDb2() {
  return ({ id: 'rick_flask', universe: 'Rick & Morty', name: { en: 'Rick\'s Metallic Flask', fr: 'Flasque en Métal de Rick' }, boost: { hp: 90 }, cost: 80 });
}

export function createEquipItemsDb3() {
  return ({ id: 'plumbus', universe: 'Rick & Morty', name: { en: 'Universal Household Plumbus', fr: 'Plumbus Standard' }, boost: { def: 8 }, cost: 110 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_rm_box',
    name: { en: 'Mr. Meeseeks Box', fr: 'Boîte à Meeseeks' },
    desc: { en: 'Summons a horde of helpful Mr. Meeseeks to deal 150 damage and restore 80 HP to the squad.', fr: 'Invoque des Mr. Meeseeks qui infligent 150 dégâts et redonnent 80 PV à l\'escouade.' },
    effect: 'meeseeks_swarm'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'morty', name: 'Morty Smith', cat: 'tactical', color: '#ffeaa7' },
    { id: 'summer', name: 'Summer Smith', cat: 'slayer', color: '#ff7675' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'birdperson', name: 'Birdperson', cat: 'marine', color: '#34495e' },
    { id: 'beth_smith', name: 'Beth Smith', cat: 'tactical', color: '#f5cba7' },
    { id: 'mr_meeseeks', name: 'Mr. Meeseeks', cat: 'slayer', color: '#5dade2' }
  ]);
}
