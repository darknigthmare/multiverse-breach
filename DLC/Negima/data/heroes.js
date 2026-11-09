// Negima — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'negi',
    name: 'Negi Springfield',
    universe: 'Negima',
    category: 'hacker',
    primaryColor: '#ec7063',
    secondaryColor: '#f7dc6f',
    weaponType: 'magic_staff',
    weaponColor: '#a04000',
    stats: { hp: 130, atk: 15, def: 7, spd: 8 },
    simple: { name: 'Wind Arrow Storm', type: 'magic', dmg: 1.0 },
    secondary: { name: 'Lightning Spark Bolt', type: 'zap', cd: 6, dmg: 1.8 },
    defense: { name: 'Sagitta Magica Barrier', type: 'shield', dur: 2.2, reduce: 0.8 },
    special: { name: 'Magia Erebea Fusion', type: 'dark_aoe', dmg: 5.3 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'pactio_card', universe: 'Negima', name: { en: 'Negi Pactio Card', fr: 'Carte de Pactio de Negi' }, boost: { hp: 70, atk: 7 }, cost: 110 });
}

export function createEquipItemsDb2() {
  return ({ id: 'magic_staff_item', universe: 'Negima', name: { en: 'Negi Magic Staff', fr: 'Bâton de Mage de Negi' }, boost: { atk: 11 }, cost: 100 });
}

export function createEquipItemsDb3() {
  return ({ id: 'wizard_robes', universe: 'Negima', name: { en: 'Woolsack Wizard Robes', fr: 'Robe de Magicien' }, boost: { def: 8 }, cost: 90 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_ng_erebea',
    name: { en: 'Magia Erebea Dark Core', fr: 'Magia Erebea Sombre' },
    desc: { en: 'Negi fuses with dark magic: boosts squad Attack by 50% and Speed by 20% for 15 seconds.', fr: 'Negi fusionne avec la magie sombre : augmente l\'attaque de 50% et la vitesse de 20% pendant 15 secondes.' },
    effect: 'magia_erebea'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'asuna', name: 'Asuna Kagurazaka', cat: 'slayer', color: '#e17055' },
    { id: 'evangeline', name: 'Evangeline McDowell', cat: 'horror', color: '#6c5ce7' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'konoka_negima', name: 'Konoka Konoe', cat: 'hacker', color: '#f5b7b1' },
    { id: 'setsuna_negima', name: 'Setsuna Sakurazaki', cat: 'slayer', color: '#34495e' },
    { id: 'nodoka_negima', name: 'Nodoka Miyazaki', cat: 'hacker', color: '#d7bde2' }
  ]);
}
