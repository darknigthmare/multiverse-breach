// Fallout — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'valtweller',
    name: 'Vault Dweller',
    universe: 'Fallout',
    category: 'tactical',
    primaryColor: '#f1c40f',
    secondaryColor: '#2980b9',
    weaponType: 'gun',
    weaponColor: '#7f8c8d',
    stats: { hp: 140, atk: 14, def: 9, spd: 6 },
    simple: { name: '10mm Pistol', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'V.A.T.S. Targeting', type: 'zap', cd: 5, dmg: 1.7 },
    defense: { name: 'Stimpak Charge', type: 'heal', dur: 1.5, reduce: 0.6 },
    special: { name: 'Mini Nuke (Fat Man)', type: 'rocket', dmg: 5.8 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'stimpak_box', universe: 'Fallout', name: { en: 'Stimpak Supply Box', fr: 'Boîte de Stimpaks Vault-Tec' }, boost: { hp: 110 }, cost: 80 });
}

export function createEquipItemsDb2() {
  return ({ id: 'bobblehead', universe: 'Fallout', name: { en: 'Vault Boy Bobblehead', fr: 'Figurine Vault Boy' }, boost: { atk: 6, def: 6, spd: 1 }, cost: 110 });
}

export function createEquipItemsDb3() {
  return ({ id: 'fusion_core', universe: 'Fallout', name: { en: 'T-60 Fusion Core', fr: 'Réacteur à Fusion' }, boost: { def: 11 }, cost: 100 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_fo_nuke',
    name: { en: 'Fat Man Mini-Nuke', fr: 'Mini-Nuke Fat Man' },
    desc: { en: 'Fires a mini nuclear warhead: causes a huge explosion dealing 250 radiation damage to all enemies.', fr: 'Tire une mini-bombe nucléaire tactique : inflige 250 dégâts de radiations à tous.' },
    effect: 'fatman_nuke'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'paladin', name: 'Paladin Danse', cat: 'marine', color: '#7f8c8d' },
    { id: 'nick_v', name: 'Nick Valentine', cat: 'hacker', color: '#2d3436' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'dogmeat', name: 'Dogmeat', cat: 'slayer', color: '#8b6f47' },
    { id: 'piper_wright', name: 'Piper Wright', cat: 'tactical', color: '#c0392b' },
    { id: 'preston_garvey', name: 'Preston Garvey', cat: 'marine', color: '#2c3e50' },
    { id: 'boone_fnv', name: 'Craig Boone', cat: 'tactical', color: '#566573' }
  ]);
}
