// Yu-Gi-Oh — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'yugi',
    name: 'Yugi Muto',
    universe: 'Yu-Gi-Oh',
    category: 'tactical',
    primaryColor: '#2a1a5e',
    secondaryColor: '#f1c40f',
    weaponType: 'cards',
    weaponColor: '#d35400',
    stats: { hp: 125, atk: 14, def: 7, spd: 7 },
    simple: { name: 'Draw! Card Throw', type: 'projectile', dmg: 1.0 },
    secondary: { name: 'Dark Magician Attack', type: 'magic', cd: 7, dmg: 1.9 },
    defense: { name: 'Spellbinding Circle', type: 'shield', dur: 2.0, reduce: 0.8 },
    special: { name: 'Exodia Obliterate!', type: 'magic_aoe', dmg: 6.0 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'millennium_puzzle', universe: 'Yu-Gi-Oh', name: { en: 'Millennium Puzzle Gold', fr: 'Puzzle du Millénium' }, boost: { hp: 100, atk: 10, def: 5 }, cost: 200 });
}

export function createEquipItemsDb2() {
  return ({ id: 'duel_disk', universe: 'Yu-Gi-Oh', name: { en: 'KC Duel Disk System', fr: 'Disque de Duel Kaiba' }, boost: { atk: 8, spd: 2 }, cost: 120 });
}

export function createEquipItemsDb3() {
  return ({ id: 'trap_card', universe: 'Yu-Gi-Oh', name: { en: 'Face-Down Trap Card', fr: 'Carte Piège Face Cachée' }, boost: { def: 9 }, cost: 100 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_yugi_card',
    name: { en: 'Swords of Revealing Light', fr: 'Épées de Révélation de la Lumière' },
    desc: { en: 'Prevents all enemies from moving or attacking for 3 turns (or 6 seconds).', fr: 'Empêche tous les ennemis de se déplacer ou d\'attaquer pendant 6 secondes.' },
    effect: 'swords_block'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'kaiba', name: 'Seto Kaiba', cat: 'hacker', color: '#2980b9' },
    { id: 'joey', name: 'Joey Wheeler', cat: 'slayer', color: '#e67e22' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'tea_ygo', name: 'Tea Gardner', cat: 'hacker', color: '#f8c471' },
    { id: 'bakura_ygo', name: 'Ryo Bakura', cat: 'horror', color: '#d5dbdb' },
    { id: 'mai_ygo', name: 'Mai Valentine', cat: 'tactical', color: '#f4d03f' },
    { id: 'pegasus_ygo', name: 'Maximillion Pegasus', cat: 'hacker', color: '#d7bde2' }
  ]);
}
