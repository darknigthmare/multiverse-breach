// Harry Potter — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'harry',
    name: 'Harry Potter',
    universe: 'Harry Potter',
    category: 'hacker',
    primaryColor: '#6c3483',
    secondaryColor: '#f1c40f',
    weaponType: 'wand',
    weaponColor: '#5c3a21',
    stats: { hp: 120, atk: 14, def: 7, spd: 7 },
    simple: { name: 'Expelliarmus', type: 'zap', dmg: 1.0 },
    secondary: { name: 'Stupefy Spell', type: 'projectile', cd: 6, dmg: 1.7 },
    defense: { name: 'Protego Shield', type: 'shield', dur: 2.2, reduce: 0.85 },
    special: { name: 'Expecto Patronum', type: 'magic_aoe', dmg: 4.8 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'gryffindor_sword', universe: 'Harry Potter', name: { en: 'Gryffindor Sword', fr: 'Épée de Gryffondor' }, boost: { atk: 10, hp: 50 }, cost: 100 });
}

export function createEquipItemsDb2() {
  return ({ id: 'invisibility_cloak', universe: 'Harry Potter', name: { en: 'Invisibility Cloak', fr: 'Cape d\'Invisibilité' }, boost: { def: 8, spd: 2 }, cost: 120 });
}

export function createEquipItemsDb3() {
  return ({ id: 'marauder_map', universe: 'Harry Potter', name: { en: 'Marauder\'s Map', fr: 'Carte du Maraudeur' }, boost: { spd: 3 }, cost: 80 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_hp_wand',
    name: { en: 'Elder Wand', fr: 'Baguette de Sureau' },
    desc: { en: 'Casts Avada Kedavra secondary blast: deals 200 damage to all enemies and stuns them for 3 seconds.', fr: 'Lance un souffle d\'Avada Kedavra : inflige 200 dégâts à tous et les étourdit pendant 3 secondes.' },
    effect: 'spell_avada'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'hermione', name: 'Hermione Granger', cat: 'hacker', color: '#fdcb6e' },
    { id: 'ron', name: 'Ron Weasley', cat: 'tactical', color: '#e67e22' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'dumbledore', name: 'Albus Dumbledore', cat: 'hacker', color: '#9b59b6' },
    { id: 'sirius_black', name: 'Sirius Black', cat: 'slayer', color: '#2c3e50' },
    { id: 'snape', name: 'Severus Snape', cat: 'hacker', color: '#1c1c1c' },
    { id: 'voldemort', name: 'Lord Voldemort', cat: 'horror', color: '#d5dbdb' }
  ]);
}
