// Digital Circus — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'pomni',
    name: 'Digital Circus',
    universe: 'Digital Circus',
    category: 'horror',
    primaryColor: '#c0392b',
    secondaryColor: '#2980b9',
    weaponType: 'juggleballs',
    weaponColor: '#f1c40f',
    stats: { hp: 115, atk: 11, def: 6, spd: 9 },
    simple: { name: 'Juggle Throw', type: 'projectile', dmg: 0.9 },
    secondary: { name: 'Glitch Flare', type: 'glitch', cd: 5, dmg: 1.7 },
    defense: { name: 'Cardboard Box Hide', type: 'dodge', dur: 2.0, reduce: 0.8 },
    special: { name: 'Abstracted Panic Strike', type: 'dark_aoe', dmg: 4.6 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'pomni_hat', universe: 'Digital Circus', name: { en: 'Pomni\'s Jester Hat', fr: 'Chapeau de Pomni' }, boost: { hp: 60, def: 5 }, cost: 90 });
}

export function createEquipItemsDb2() {
  return ({ id: 'gloink_crown', universe: 'Digital Circus', name: { en: 'Gloink Queen Crown', fr: 'Couronne Gloink' }, boost: { atk: 9 }, cost: 100 });
}

export function createEquipItemsDb3() {
  return ({ id: 'glitch_abstract', universe: 'Digital Circus', name: { en: 'Abstracted Glitch Core', fr: 'Noyau d\'Abstraction' }, boost: { spd: 3 }, cost: 120 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_dc_eyes',
    name: { en: 'Caine\'s Eyes', fr: 'Les Yeux de Caine' },
    desc: { en: 'Glitches reality: reduces all enemies defense to 0 and freezes them for 6 seconds.', fr: 'Pirate la scène : réduit la défense ennemie à 0 et les gèle pendant 6 secondes.' },
    effect: 'circus_glitch'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'jax', name: 'Jax', cat: 'tactical', color: '#a29bfe' },
    { id: 'caine', name: 'Caine', cat: 'hacker', color: '#ff7675' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'ragatha', name: 'Ragatha', cat: 'tactical', color: '#c0392b' },
    { id: 'kinger', name: 'Kinger', cat: 'hacker', color: '#f7dc6f' },
    { id: 'gangle', name: 'Gangle', cat: 'horror', color: '#e74c3c' },
    { id: 'zooble', name: 'Zooble', cat: 'slayer', color: '#9b59b6' }
  ]);
}
