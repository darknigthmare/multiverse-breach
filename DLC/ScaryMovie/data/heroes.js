// Scary Movie — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'cindy',
    name: 'Cindy Campbell',
    universe: 'Scary Movie',
    category: 'horror',
    primaryColor: '#ec407a',
    secondaryColor: '#ffffff',
    weaponType: 'fists',
    weaponColor: '#ffb6c1',
    stats: { hp: 125, atk: 12, def: 8, spd: 8 },
    simple: { name: 'Comedic Slap', type: 'melee', dmg: 0.9 },
    secondary: { name: 'Parody Scream', type: 'sound', cd: 5, dmg: 1.6 },
    defense: { name: 'Dumb Dodge Jump', type: 'dodge', dur: 1.8, reduce: 0.8 },
    special: { name: 'Slasher Movie Spoil', type: 'fear', dmg: 4.4 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'cindy_diary', universe: 'Scary Movie', name: { en: 'Cindy\'s Highschool Diary', fr: 'Journal de Cindy' }, boost: { hp: 60, def: 4 }, cost: 80 });
}

export function createEquipItemsDb2() {
  return ({ id: 'ghostface_tape', universe: 'Scary Movie', name: { en: 'Scary Video Tape', fr: 'Cassette Vidéo Scary' }, boost: { atk: 8 }, cost: 90 });
}

export function createEquipItemsDb3() {
  return ({ id: 'comedy_mask', universe: 'Scary Movie', name: { en: 'Hilarious Scary Mask', fr: 'Masque d\'Effroi Comique' }, boost: { spd: 3 }, cost: 80 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_sm_joint',
    name: { en: '"Wassup" Party Joint', fr: 'Joint de Fête "Wassup"' },
    desc: { en: 'Plays funny wassup lines: stuns all enemies in a laughing loop for 5 seconds.', fr: 'Déclenche un fou rire collectif : étourdit tous les ennemis pendant 5 secondes.' },
    effect: 'wassup_high'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'cindy', name: 'Cindy Campbell', cat: 'horror', color: '#ffeaa7' },
    { id: 'shorty', name: 'Shorty Meeks', cat: 'tactical', color: '#55efc4' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'brenda_meeks', name: 'Brenda Meeks', cat: 'tactical', color: '#f4d03f' },
    { id: 'ray_wilkins', name: 'Ray Wilkins', cat: 'hacker', color: '#5dade2' },
    { id: 'doofy', name: 'Doofy Gilmore', cat: 'horror', color: '#ecf0f1' }
  ]);
}

export function createCanonRosterExtraPatch() {
  return ([
    { id: 'gail_hailstorm', name: 'Gail Hailstorm', cat: 'tactical', color: '#d7dbdd', simpleName: 'News Van Microphone Hit', secondaryName: 'Live Broadcast Distraction', defenseName: 'Camera Crew Cover', specialName: 'Parody News Meltdown' }
  ]);
}
