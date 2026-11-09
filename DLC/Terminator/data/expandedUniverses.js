// Terminator — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'terminator',
    universe: 'Terminator',
    mediaType: 'movie',
    faction: 'sciFi',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    stage: 'Los Angeles Future War Time Displacement',
    boss: 'Skynet Temporal Defense Grid',
    worldBoss: 'Skynet Core',
    cast: [
      ['sarah_connor_term', 'Sarah Connor', 'tactical'],
      ['t800_term', 'T-800', 'marine'],
      ['john_connor_term', 'John Connor', 'hacker']
    ],
    enemies: ['T-800 Endoskeleton', 'Hunter-Killer Drone', 'T-1000 Infiltrator'],
    bosses: ['T-1000', 'T-X'],
    gear: [
      ['phase_plasma', 'Phased Plasma Rifle', 'Fusil plasma a phase'],
      ['cpu', 'Learning CPU', 'Processeur d apprentissage'],
      ['time_chip', 'Time Displacement Chip', 'Puce de deplacement temporel']
    ],
    event: ['no_fate', 'No Fate Counterstrike', 'Contre-attaque Sans destin', 'Sarah cancels the predicted enemy action and the T-800 answers with plasma fire.', 'Sarah annule l action ennemie predite et le T-800 repond par un tir plasma.'],
    origin: ['Skynet s machine war reaches backward through time to erase the human resistance before it can exist.', 'La guerre des machines de Skynet remonte le temps pour effacer la resistance humaine avant sa naissance.'],
    breach: ['the time displacement field mistakes alternate universes for editable histories, multiplying Judgment Day instead of preventing it.', 'le champ de deplacement temporel prend les univers alternatifs pour des histoires modifiables, multipliant le Jugement dernier au lieu de l empecher.'],
    motif: 'facility',
    colors: ['#17212b', '#030405', '#ef493d']
  }));
}
