// Le Cinquième Element — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'korben',
    name: 'Korben Dallas',
    universe: 'Le Cinquième Element',
    category: 'marine',
    primaryColor: '#d35400',
    secondaryColor: '#17202a',
    weaponType: 'gun',
    weaponColor: '#f39c12',
    stats: { hp: 145, atk: 16, def: 10, spd: 6 },
    simple: { name: 'ZF-1 Fire', type: 'bullet', dmg: 1.1 },
    secondary: { name: 'Mini-Rocket Mode', type: 'rocket', cd: 7, dmg: 1.9 },
    defense: { name: 'Cab Door Shield', type: 'shield', dur: 2.0, reduce: 0.75 },
    special: { name: 'Big Badaboom Blast', type: 'fire_aoe', dmg: 5.0 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'element_stones', universe: 'Le Cinquième Element', name: { en: 'Four Element Stones', fr: 'Pierres des Éléments' }, boost: { hp: 80 }, cost: 100 });
}

export function createEquipItemsDb2() {
  return ({ id: 'multipass', universe: 'Le Cinquième Element', name: { en: 'Leeloo Multi-Pass', fr: 'Multi-Pass de Leeloo' }, boost: { spd: 4 }, cost: 110 });
}

export function createEquipItemsDb3() {
  return ({ id: 'zf1_blaster', universe: 'Le Cinquième Element', name: { en: 'ZF-1 Blaster Weapon', fr: 'Blaster ZF-1' }, boost: { atk: 12 }, cost: 130 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_fe_stones',
    name: { en: 'Divine Elements Align', fr: 'Lumière Divine du 5e Élément' },
    desc: { en: 'Unleashes divine cosmic light: heals squad by 200 HP and grants invulnerability for 3 seconds.', fr: 'Libère la lumière divine : soigne l\'escouade de 200 PV et octroie l\'invulnérabilité pendant 3 secondes.' },
    effect: 'divine_light'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'leeloo', name: 'Leeloo', cat: 'slayer', color: '#ff7675' },
    { id: 'ruby_rhod', name: 'Ruby Rhod', cat: 'tactical', color: '#fdcb6e' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'zorg', name: 'Jean-Baptiste Emanuel Zorg', cat: 'hacker', color: '#6e2c00' },
    { id: 'cornelius', name: 'Vito Cornelius', cat: 'hacker', color: '#d5b895' },
    { id: 'munro_fifth', name: 'General Munro', cat: 'marine', color: '#34495e' }
  ]);
}
