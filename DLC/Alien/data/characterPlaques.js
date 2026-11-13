// Alien — definitions consumed by src/game/characterPlaques.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCharacterPlaques() {
  return ({
    clearance: 'WY-NOSTROMO',
    rank: { fr: 'Lieutenante du Nostromo', en: 'Nostromo warrant officer' },
    role: { fr: 'Survie anti-Xenomorphe', en: 'Anti-Xenomorph survival' },
    callSign: 'Ripley',
    origin: { fr: 'Alien (1979) - Nostromo / Narcissus', en: 'Alien (1979) - Nostromo / Narcissus' },
    dossier: {
      fr: 'Ripley est la survivante du Nostromo dans Alien (1979). Elle utilise le lance-flammes improvise de l equipage, organise sa fuite vers le Narcissus et repousse le Big Chap avec le harpon de la navette.',
      en: 'Ripley is the Nostromo survivor from Alien (1979). She uses the crew s improvised flamethrower, escapes to the Narcissus and repels the Big Chap with the shuttle harpoon gun.'
    },
    doctrine: { fr: 'Lance-flammes improvise, evasion du Nostromo, harpon du Narcissus.', en: 'Improvised flamethrower, Nostromo escape, Narcissus harpoon.' },
    tags: ['Nostromo', 'Narcissus', 'Alien 1979', 'Flame', 'Survivor']
  });
}
