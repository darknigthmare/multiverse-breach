// The Matrix — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'neo',
    name: 'Neo',
    universe: 'The Matrix',
    category: 'hacker',
    primaryColor: '#0a0a0a',
    secondaryColor: '#00ff00',
    weaponType: 'fists',
    weaponColor: '#ffffff',
    stats: { hp: 140, atk: 17, def: 9, spd: 8 },
    simple: { name: 'Kung Fu Punch', type: 'melee', dmg: 1.1 },
    secondary: { name: 'Dual Uzi Spray', type: 'bullet_spray', cd: 5, dmg: 1.8 },
    defense: { name: 'Bullet Time Stop', type: 'dodge', dur: 3.0, reduce: 0.95 },
    special: { name: 'Reality Rewrite', type: 'glitch', dmg: 5.5 }
  });
}

export function createEquipItemsDb() {
  return ({
    id: 'sunglasses',
    universe: 'The Matrix',
    name: { en: 'Operator Mirrored Sunglasses', fr: 'Lunettes miroir operateur' },
    desc: {
      fr: 'Signature visuelle des esprits libres et des Agents. A.R.C.A. l utilise comme filtre de lecture: voir le code sans oublier la personne derriere l avatar.',
      en: 'Visual signature of free minds and Agents. A.R.C.A. uses it as a reading filter: see the code without forgetting the person behind the avatar.'
    },
    boost: { def: 7, spd: 2 },
    cost: 100
  });
}

export function createEquipItemsDb2() {
  return ({
    id: 'matrix_code',
    universe: 'The Matrix',
    name: { en: 'Falling Green Code Thread', fr: 'Fil de code vert tombant' },
    desc: {
      fr: 'Fragment lisible de la simulation. Il ne donne pas seulement des degats: il permet de comprendre quand une regle locale ment pour maintenir une prison.',
      en: 'Readable fragment of the simulation. It does not only grant damage: it helps understand when a local rule lies to maintain a prison.'
    },
    boost: { atk: 12 },
    cost: 120
  });
}

export function createEquipItemsDb3() {
  return ({
    id: 'leather_coat',
    universe: 'The Matrix',
    name: { en: 'Nebuchadnezzar Reinforced Coat', fr: 'Manteau renforce Nebuchadnezzar' },
    desc: {
      fr: 'Manteau de combat charge dans la Matrice par un operateur de Zion. Il protege l avatar assez longtemps pour atteindre un telephone de sortie.',
      en: 'Combat coat loaded into the Matrix by a Zion operator. It protects the avatar long enough to reach an exit phone.'
    },
    boost: { hp: 70, def: 5 },
    cost: 110
  });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_matrix_glitch',
    name: { en: 'Zion Operator Code Hack', fr: 'Piratage operateur Zion' },
    desc: {
      en: 'A Zion operator injects a clean override into the simulation. Agents lose timing, exile programs desync, and the squad receives a short exit-phone window instead of a non-lore stun.',
      fr: 'Un operateur de Zion injecte une surcharge propre dans la simulation. Les Agents perdent leur timing, les programmes exiles se desynchronisent et l escouade recoit une courte fenetre de telephone de sortie.'
    },
    effect: 'freeze_matrix'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'trinity', name: 'Trinity', cat: 'slayer', color: '#2c3e50' },
    { id: 'morpheus', name: 'Morpheus', cat: 'tactical', color: '#34495e' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'agent_smith', name: 'Agent Smith', cat: 'hacker', color: '#1a1d24' },
    { id: 'niobe_matrix', name: 'Niobe', cat: 'tactical', color: '#2c3e50' },
    { id: 'tank_matrix', name: 'Tank', cat: 'hacker', color: '#27ae60' },
    { id: 'oracle_matrix', name: 'The Oracle', cat: 'hacker', color: '#d9b36c' }
  ]);
}

export function createHeroOverrides() {
  return ({
    simple: { name: 'Loaded Kung Fu Strike', type: 'melee', dmg: 1.15 },
    secondary: { name: 'Bullet Time Counter', type: 'dodge_strike', cd: 6, dmg: 1.8 },
    defense: { name: 'Stop Bullets', type: 'shield', dur: 2.2, reduce: 0.9 },
    special: { name: 'Source Code Rewrite', type: 'glitch_aoe', dmg: 5.2, color: '#39ff6e' }
  });
}

export function createHeroOverrides2() {
  return ({
    weaponType: 'gun',
    weaponColor: '#050505',
    simple: { name: 'Dual Pistol Entry', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Lobby Wall Run', type: 'melee', cd: 6, dmg: 1.7 },
    defense: { name: 'Exit Phone Route', type: 'dodge', dur: 2.0, reduce: 0.82 },
    special: { name: 'Motorcycle Extraction', type: 'support_aoe', dmg: 4.4, color: '#2c3e50' }
  });
}

export function createHeroOverrides3() {
  return ({
    weaponType: 'katana',
    weaponColor: '#34495e',
    simple: { name: 'Dojo Loaded Strike', type: 'melee', dmg: 1.05 },
    secondary: { name: 'Red Pill Break', type: 'hack', cd: 6, dmg: 1.55 },
    defense: { name: 'Nebuchadnezzar Command', type: 'shield', dur: 2.1, reduce: 0.78 },
    special: { name: 'There Is No Spoon', type: 'mind_aoe', dmg: 4.5, color: '#39ff6e' }
  });
}
