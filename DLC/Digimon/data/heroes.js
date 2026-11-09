// Digimon — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'taichi',
    name: 'Tai & Agumon',
    universe: 'Digimon',
    category: 'tactical',
    primaryColor: '#f39c12',
    secondaryColor: '#27ae60',
    weaponType: 'fireclaw',
    weaponColor: '#d35400',
    stats: { hp: 140, atk: 17, def: 9, spd: 7 },
    simple: { name: 'Sharp Claw Scratch', type: 'melee', dmg: 1.1 },
    secondary: { name: 'Baby Flame Spit', type: 'fire', cd: 5, dmg: 1.7 },
    defense: { name: 'Digivice Shield Shield', type: 'shield', dur: 2.2, reduce: 0.8 },
    special: { name: 'Mega Flame Breath', type: 'fire_aoe', dmg: 5.2 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'courage_crest', universe: 'Digimon', name: { en: 'Crest of Courage', fr: 'Symbole du Courage' }, boost: { hp: 100 }, cost: 130 });
}

export function createEquipItemsDb2() {
  return ({ id: 'digivice_relic', universe: 'Digimon', name: { en: 'Classic Digivice', fr: 'Digivice Classique' }, boost: { def: 8 }, cost: 100 });
}

export function createEquipItemsDb3() {
  return ({ id: 'fire_ring', universe: 'Digimon', name: { en: 'Agumon Fire Ring', fr: 'Anneau de Feu Agumon' }, boost: { atk: 12 }, cost: 110 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_dm_warp',
    name: { en: 'Warp Digivolution Signal', fr: 'Signal de Warp-Évolution' },
    desc: { en: 'Agumon digivolves to WarGreymon and drops a massive Gaia Force fireball (280 damage).', fr: 'Agumon évolue en WarGreymon et lance une sphère Gaia Force géante (280 dégâts).' },
    effect: 'digivolve_warp'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'matt', name: 'Matt & Gabumon', cat: 'slayer', color: '#74b9ff' },
    { id: 'izzy', name: 'Izzy & Tentomon', cat: 'hacker', color: '#81ecec' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'sora_biyomon', name: 'Sora & Biyomon', cat: 'tactical', color: '#e74c3c' },
    { id: 'mimi_palmon', name: 'Mimi & Palmon', cat: 'hacker', color: '#2ecc71' },
    { id: 'joe_gomamon', name: 'Joe & Gomamon', cat: 'marine', color: '#5dade2' },
    { id: 'kari_gatomon', name: 'Kari & Gatomon', cat: 'hacker', color: '#f8c471' },
    { id: 'tk_patamon', name: 'T.K. & Patamon', cat: 'tactical', color: '#f4d03f' }
  ]);
}
