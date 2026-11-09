// Predator — definitions consumed by src/game/characterPlaques.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCharacterPlaques() {
  return ({
    clearance: 'YAU-01',
    rank: { fr: 'Jungle Hunter', en: 'Jungle Hunter' },
    role: { fr: 'Traque et duel plasma', en: 'Hunt and plasma duel' },
    callSign: 'Yautja',
    origin: { fr: 'Predator (1987) - jungle d Amerique centrale', en: 'Predator (1987) - Central American jungle' },
    dossier: {
      fr: 'Predateur discipline par le code de chasse. Le Nexus l indexe comme combattant de pression: camouflage, ciblage thermique et execution des menaces dominantes.',
      en: 'Predator bound by the hunt code. The Nexus indexes him as a pressure fighter: cloaking, thermal targeting, and execution of dominant threats.'
    },
    doctrine: { fr: 'Lames de poignet, plasma caster, camouflage optique, duel sans masque.', en: 'Wristblades, plasma caster, optical camouflage, unmasked duel.' },
    tags: ['Yautja', 'Cloak', 'Plasma', 'Hunter']
  });
}

export function createCharacterPlaques2() {
  return ({
    clearance: 'VAL-VERDE',
    rank: { fr: 'Major operations speciales', en: 'Special Operations Major' },
    role: { fr: 'Contre-chasse jungle', en: 'Jungle counter-hunt' },
    callSign: 'Dutch',
    origin: { fr: 'Val Verde', en: 'Val Verde' },
    dossier: {
      fr: 'Soldat qui a compris qu une chasse peut se retourner. Dutch est indexe pour pieges, endurance et combat contre predateur superieur.',
      en: 'Soldier who learned that a hunt can be reversed. Dutch is indexed for traps, endurance, and combat against superior predators.'
    },
    doctrine: { fr: 'Armes lourdes, pieges, combat de boue thermique.', en: 'Heavy weapons, traps, thermal mud combat.' },
    tags: ['Jungle', 'Trap', 'Commando', 'Counterhunt']
  });
}
