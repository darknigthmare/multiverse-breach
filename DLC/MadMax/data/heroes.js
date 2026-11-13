// Mad Max — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'max',
    name: 'Mad Max',
    universe: 'Mad Max',
    category: 'tactical',
    primaryColor: '#78281f',
    secondaryColor: '#f5b041',
    weaponType: 'shotgun',
    weaponColor: '#1c2833',
    stats: { hp: 140, atk: 15, def: 9, spd: 6 },
    simple: { name: 'Interceptor Shells', type: 'shotgun', dmg: 1.1 },
    secondary: { name: 'Harpoon Hook Drag', type: 'projectile', cd: 5, dmg: 1.7 },
    defense: { name: 'Interceptor Door Block', type: 'shield', dur: 2.0, reduce: 0.8 },
    special: { name: 'Thunderstick Volley', type: 'rocket', dmg: 5.2 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'db_shotgun', universe: 'Mad Max', name: { en: 'Sawed-Off Shotgun', fr: 'Fusil à Pompe Scié' }, boost: { atk: 12 }, cost: 110 });
}

export function createEquipItemsDb2() {
  return ({ id: 'v8_jacket', universe: 'Mad Max', name: { en: 'Leather Interceptor Jacket', fr: 'Blouson d\'Intercepteur' }, boost: { hp: 80, def: 6 }, cost: 100 });
}

export function createEquipItemsDb3() {
  return ({ id: 'v8_engine', universe: 'Mad Max', name: { en: 'Interceptor V8 Supercharger', fr: 'Compresseur V8 Interceptor' }, boost: { spd: 3 }, cost: 120 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_mm_car',
    name: { en: 'Interceptor Rig Summon', fr: 'Charge de l\'Interceptor' },
    desc: { en: 'The V8 Interceptor rams through all enemies, dealing 220 crash damage and pushing them back.', fr: 'L\'Interceptor V8 fonce sur le terrain : inflige 220 dégâts d\'écrasement et repousse les cibles.' },
    effect: 'interceptor_ram'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'furiosa', name: 'Furiosa', cat: 'slayer', color: '#7f8c8d' },
    { id: 'nux', name: 'Nux', cat: 'marine', color: '#ffeaa7' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'toast_mm', name: 'Toast the Knowing', cat: 'tactical', color: '#d7b98e' },
    { id: 'capable_mm', name: 'Capable', cat: 'hacker', color: '#d98880' },
    { id: 'chumbucket_mm', name: 'Chumbucket', cat: 'hacker', color: '#b7950b' }
  ]);
}
