// Chucky — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'andy',
    name: 'Andy Barclay',
    universe: 'Chucky',
    category: 'horror',
    primaryColor: '#3498db',
    secondaryColor: '#e74c3c',
    weaponType: 'baseballbat',
    weaponColor: '#d35400',
    stats: { hp: 120, atk: 12, def: 8, spd: 7 },
    simple: { name: 'Bat Swing', type: 'melee', dmg: 1.0 },
    secondary: { name: 'Jack-in-the-box Bomb', type: 'projectile', cd: 6, dmg: 1.7 },
    defense: { name: 'Hide in Closet', type: 'dodge', dur: 2.0, reduce: 0.8 },
    special: { name: 'Friendly Fire Trap', type: 'trap', dmg: 4.3 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'voodoo_amulet', universe: 'Chucky', name: { en: 'Damballa Amulet', fr: 'Amulette de Damballa' }, boost: { hp: 70, atk: 8 }, cost: 120 });
}

export function createEquipItemsDb2() {
  return ({ id: 'kitchen_knife', universe: 'Chucky', name: { en: 'Polished Kitchen Knife', fr: 'Couteau de Cuisine Aiguisé' }, boost: { atk: 11 }, cost: 90 });
}

export function createEquipItemsDb3() {
  return ({ id: 'toy_battery', universe: 'Chucky', name: { en: 'Good Guy Battery', fr: 'Pile de Jouet Good Guy' }, boost: { def: 5, spd: 2 }, cost: 85 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_chucky_toy',
    name: { en: 'Jack-in-the-Box Lure', fr: 'Diable en Boîte Piégé' },
    desc: { en: 'Places a laughing toy trap: explodes when enemies touch it, dealing 180 damage.', fr: 'Place un diable en boîte explosif rieur qui inflige 180 dégâts aux ennemis à proximité.' },
    effect: 'jack_box_trap'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'tiffany', name: 'Tiffany Valentine', cat: 'slayer', color: '#dfe6e9' },
    { id: 'glen', name: 'Glen / Glenda', cat: 'tactical', color: '#a29bfe' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'kyle_chucky', name: 'Kyle', cat: 'tactical', color: '#5dade2' },
    { id: 'nica_chucky', name: 'Nica Pierce', cat: 'horror', color: '#6c3483' },
    { id: 'jake_chucky', name: 'Jake Wheeler', cat: 'hacker', color: '#3498db' }
  ]);
}
