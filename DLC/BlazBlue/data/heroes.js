// BlazBlue — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'ragna',
    name: 'Ragna the Bloodedge',
    universe: 'BlazBlue',
    category: 'slayer',
    primaryColor: '#c0392b',
    secondaryColor: '#2c3e50',
    weaponType: 'greatsword',
    weaponColor: '#7f8c8d',
    stats: { hp: 150, atk: 18, def: 9, spd: 6 },
    simple: { name: 'Dead Spike', type: 'melee', dmg: 1.1 },
    secondary: { name: 'Gauntlet Hades', type: 'melee', cd: 6, dmg: 1.8 },
    defense: { name: 'Barrier Trigger', type: 'shield', dur: 2.0, reduce: 0.8 },
    special: { name: 'Black Onslaught', type: 'dark_aoe', dmg: 5.2 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'idea_engine', universe: 'BlazBlue', name: { en: 'Idea Engine Core', fr: 'Cœur d\'Idea Engine' }, boost: { hp: 90, atk: 8 }, cost: 120 });
}

export function createEquipItemsDb2() {
  return ({ id: 'azure_grimoire', universe: 'BlazBlue', name: { en: 'Azure Grimoire Replica', fr: 'Grimoire d\'Azur' }, boost: { atk: 12 }, cost: 140 });
}

export function createEquipItemsDb3() {
  return ({ id: 'restrict_band', universe: 'BlazBlue', name: { en: 'Gravity Limiter Band', fr: 'Anneau Limiteur de Gravité' }, boost: { def: 8, spd: 1 }, cost: 100 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_bb_azure',
    name: { en: 'Azure Grimoire Core', fr: 'Cœur de Grimoire d\'Azure' },
    desc: { en: 'Drains 50% health of all enemies and transfers it as healing to the squad.', fr: 'Vole 50 PV à tous les ennemis présents pour soigner les membres de l\'escouade.' },
    effect: 'azure_drain'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'jin', name: 'Jin Kisaragi', cat: 'tactical', color: '#74b9ff' },
    { id: 'noel', name: 'Noel Vermillion', cat: 'marine', color: '#0984e3' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'rachel_bb', name: 'Rachel Alucard', cat: 'hacker', color: '#d7bde2' },
    { id: 'hazama_bb', name: 'Hazama', cat: 'horror', color: '#27ae60' },
    { id: 'tsubaki_bb', name: 'Tsubaki Yayoi', cat: 'tactical', color: '#f8c471' },
    { id: 'hakumen_bb', name: 'Hakumen', cat: 'slayer', color: '#ecf0f1' }
  ]);
}
