// Evil Dead (2013) — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'evil_dead_2013',
    universe: 'Evil Dead (2013)',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'RPG',
    difficulty: 'Very Hard',
    titleFr: 'Evil Dead (remake)',
    stage: 'Abomination Cabin Blood Rain',
    boss: 'The Abomination',
    cast: [
      ['mia_allen_ed2013', 'Mia Allen', 'slayer'],
      ['david_allen_ed2013', 'David Allen', 'tactical'],
      ['eric_ed2013', 'Eric', 'hacker']
    ],
    enemies: ['Possessed Friend', 'Cellar Deadite', 'Demonic Tree Root'],
    bosses: ['Possessed Mia', 'The Abomination'],
    gear: [
      ['chainsaw', 'Cabin Chainsaw', 'Tronconneuse de la cabane'],
      ['naturom_demonto', 'Naturom Demonto', 'Naturom Demonto'],
      ['nail_gun', 'Improvised Nail Gun', 'Pistolet a clous improvise']
    ],
    event: ['blood_rain', 'Blood Rain Last Stand', 'Dernier combat sous la pluie de sang', 'Mia tears free of the possession and drives the chainsaw through the dominant demon.', 'Mia se libere de la possession et enfonce la tronconneuse dans le demon dominant.'],
    origin: ['A withdrawal intervention in the Knowby cabin becomes a possession massacre after the Naturom Demonto is opened and its warnings are read aloud.', 'Une intervention de sevrage dans la cabane Knowby devient un massacre de possession apres l ouverture du Naturom Demonto et la lecture de ses avertissements.'],
    breach: ['the book counts portal copies as additional souls, accelerating the ritual unless Mia destroys the original demonic signature.', 'le livre compte les copies de portail comme des ames supplementaires et accelere le rite, sauf si Mia detruit la signature demoniaque originale.'],
    motif: 'hauntedset',
    colors: ['#2a0e0d', '#050101', '#d7382f']
  }));
}
