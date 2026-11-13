// Men in Black — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'men_in_black',
    universe: 'Men in Black',
    mediaType: 'movie',
    faction: 'sciFi',
    mode: 'Tactics',
    difficulty: 'Hard',
    stage: 'MIB Headquarters Galaxy Lockdown',
    boss: 'Edgar Bug Galaxy Theft',
    cast: [
      ['agent_j_mib', 'Agent J', 'slayer'],
      ['agent_k_mib', 'Agent K', 'tactical'],
      ['agent_l_mib', 'Agent L', 'hacker']
    ],
    enemies: ['Arquillian Impostor', 'Alien Fugitive', 'Syndicate Bug Drone'],
    bosses: ['Serleena', 'Edgar the Bug'],
    gear: [
      ['noisy_cricket', 'Noisy Cricket', 'Noisy Cricket'],
      ['neuralyzer', 'Neuralyzer', 'Neuralyseur'],
      ['galaxy', 'Galaxy Marble', 'Galaxie miniature']
    ],
    event: ['neuralyze', 'Mass Neuralyzer Flash', 'Flash neuralyseur collectif', 'A calibrated flash erases hostile targeting data without removing allied mission memory.', 'Un flash calibre efface les donnees de ciblage hostiles sans retirer la memoire de mission alliee.'],
    origin: ['A secret agency regulates alien life on Earth with hidden technology, cover stories, neuralyzers, and agents J and K.', 'Une agence secrete regule la vie extraterrestre sur Terre avec technologies cachees, couvertures, neuralyseurs et les agents J et K.'],
    breach: ['aliens begin using universe packs as forged immigration papers, while the Neuralyzer threatens the very memories A.R.C.A. needs to stabilize reality.', 'des extraterrestres utilisent les packs d univers comme faux papiers, tandis que le Neuralyseur menace les souvenirs dont A.R.C.A. a besoin pour stabiliser la realite.'],
    motif: 'facility',
    colors: ['#111b1e', '#020304', '#71dfd8']
  }));
}
