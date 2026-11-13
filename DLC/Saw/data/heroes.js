// Saw — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'jigsaw',
    name: 'Billy the Puppet',
    universe: 'Saw',
    category: 'horror',
    primaryColor: '#7b241c',
    secondaryColor: '#f2f4f4',
    weaponType: 'tricycle',
    weaponColor: '#1c2833',
    stats: { hp: 125, atk: 13, def: 8, spd: 7 },
    simple: { name: 'Tricycle Bump', type: 'melee', dmg: 1.0 },
    secondary: { name: 'Reverse Trap Clamp', type: 'projectile', cd: 7, dmg: 1.9 },
    defense: { name: 'Pig Costume Cover', type: 'dodge', dur: 2.0, reduce: 0.85 },
    special: { name: 'I Want To Play A Game', type: 'fear', dmg: 4.8 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'bear_trap', universe: 'Saw', name: { en: 'Reverse Bear Trap Key', fr: 'Clé de Piège à Ours' }, boost: { atk: 15 }, cost: 140 });
}

export function createEquipItemsDb2() {
  return ({ id: 'tape_recorder', universe: 'Saw', name: { en: 'Jigsaw Tape Recorder', fr: 'Dictaphone Jigsaw' }, boost: { def: 7, spd: 1 }, cost: 100 });
}

export function createEquipItemsDb3() {
  return ({ id: 'jigsaw_puzzle_piece', universe: 'Saw', name: { en: 'Puzzle Flesh Piece', fr: 'Pièce de Chair Découpée' }, boost: { hp: 80 }, cost: 90 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_saw_trap',
    name: { en: 'Jigsaw Key', fr: 'Clé de Jigsaw' },
    desc: { en: 'Locks the strongest enemy in a ticking trap, dealing 250 damage and paralyzing it for 5 seconds.', fr: 'Piège l\'ennemi le plus fort : lui inflige 250 dégâts et le paralyse pendant 5 secondes.' },
    effect: 'trap_snap'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'amanda', name: 'Amanda Young', cat: 'slayer', color: '#d63031' },
    { id: 'hoffman', name: 'Mark Hoffman', cat: 'tactical', color: '#2d3436' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'lawrence_gordon', name: 'Lawrence Gordon', cat: 'tactical', color: '#d5dbdb' },
    { id: 'lynn_denlon', name: 'Lynn Denlon', cat: 'hacker', color: '#c0392b' },
    { id: 'adam_saw', name: 'Adam Stanheight', cat: 'horror', color: '#7f8c8d' }
  ]);
}
