// Ghost in the Shell — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'motoko',
    name: 'Motoko Kusanagi',
    universe: 'Ghost in the Shell',
    category: 'tactical',
    primaryColor: '#5b2c6f',
    secondaryColor: '#85c1e9',
    weaponType: 'gun',
    weaponColor: '#17202a',
    stats: { hp: 135, atk: 16, def: 10, spd: 7 },
    simple: { name: 'SMG Bullet Fire', type: 'bullet', dmg: 1.1 },
    secondary: { name: 'Camouflage Strike Strike', type: 'melee', cd: 6, dmg: 1.8 },
    defense: { name: 'Cybernetic Shield Shield', type: 'shield', dur: 2.5, reduce: 0.85 },
    special: { name: 'Ghost Hack Override', type: 'glitch', dmg: 5.1 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'cyberbrain', universe: 'Ghost in the Shell', name: { en: 'Section 9 Cyberbrain', fr: 'Cyber-Cerveau Section 9' }, boost: { hp: 50, spd: 4 }, cost: 120 });
}

export function createEquipItemsDb2() {
  return ({ id: 'seburo_rifle', universe: 'Ghost in the Shell', name: { en: 'Seburo C-26A Rifle', fr: 'Fusil Seburo C-26A' }, boost: { atk: 14 }, cost: 130 });
}

export function createEquipItemsDb3() {
  return ({ id: 'thermoptic_cam', universe: 'Ghost in the Shell', name: { en: 'Thermoptic Camouflage', fr: 'Camouflage Optique' }, boost: { def: 9 }, cost: 110 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_gs_tachi',
    name: { en: 'Tachikoma Air Support', fr: 'Appui Aérien Tachikoma' },
    desc: { en: 'Summons a Tachikoma spider tank that fires grenades dealing 160 damage and locking enemies for 3 seconds.', fr: 'Déploie un Tachikoma tirant des grenades de barrage : inflige 160 dégâts et paralyse pendant 3 secondes.' },
    effect: 'tachikoma_strike'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'batou', name: 'Batou', cat: 'marine', color: '#b2bec3' },
    { id: 'togusa', name: 'Togusa', cat: 'tactical', color: '#ffeaa7' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'aramaki', name: 'Daisuke Aramaki', cat: 'tactical', color: '#bdc3c7' },
    { id: 'saito_gits', name: 'Saito', cat: 'tactical', color: '#566573' },
    { id: 'ishikawa_gits', name: 'Ishikawa', cat: 'hacker', color: '#7f8c8d' },
    { id: 'tachikoma', name: 'Tachikoma', cat: 'hacker', color: '#3498db' }
  ]);
}
