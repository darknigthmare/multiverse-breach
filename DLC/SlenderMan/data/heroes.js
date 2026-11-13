// Slender Man — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'survivor',
    name: 'Slender Survivor',
    universe: 'Slender Man',
    category: 'horror',
    primaryColor: '#7f8c8d',
    secondaryColor: '#f1c40f',
    weaponType: 'flashlight',
    weaponColor: '#f39c12',
    stats: { hp: 115, atk: 11, def: 7, spd: 8 },
    simple: { name: 'Flashlight Shine', type: 'beam', dmg: 0.8 },
    secondary: { name: 'Page Trap', type: 'summon', cd: 7, dmg: 1.6 },
    defense: { name: 'Camera Static Dash', type: 'dodge', dur: 2.0, reduce: 0.8 },
    special: { name: '8 Pages Gathering', type: 'fear', dmg: 4.5 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'slender_page', universe: 'Slender Man', name: { en: 'Eerie Notebook Page', fr: 'Page de Carnet Maudite' }, boost: { def: 7, spd: 2 }, cost: 80 });
}

export function createEquipItemsDb2() {
  return ({ id: 'lens_filter', universe: 'Slender Man', name: { en: 'Glitch Camera Lens', fr: 'Lentille de Caméra Brouillée' }, boost: { atk: 8, def: 5 }, cost: 100 });
}

export function createEquipItemsDb3() {
  return ({ id: 'flashlight_b', universe: 'Slender Man', name: { en: 'High Lumen Battery', fr: 'Batterie Flashlight Torche' }, boost: { hp: 80 }, cost: 85 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_slender_static',
    name: { en: 'Static Noise Tape', fr: 'Cassette Grésillante' },
    desc: { en: 'Causes screen static that stuns all standard enemies for 5 seconds.', fr: 'Provoque des interférences qui paralysent les monstres normaux pendant 5 secondes.' },
    effect: 'static_stun'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'masky', name: 'Masky', cat: 'tactical', color: '#6c5ce7' },
    { id: 'hoody', name: 'Hoody', cat: 'slayer', color: '#ffeaa7' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'kate_slender', name: 'Kate', cat: 'horror', color: '#bdc3c7' },
    { id: 'lauren_slender', name: 'Lauren', cat: 'tactical', color: '#7f8c8d' },
    { id: 'charlie_slender', name: 'Charlie Matheson', cat: 'horror', color: '#2c3e50' }
  ]);
}
