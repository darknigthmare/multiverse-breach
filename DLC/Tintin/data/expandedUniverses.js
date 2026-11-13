// Tintin — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'tintin',
    universe: 'Tintin',
    mediaType: 'manga',
    faction: 'arcane',
    mode: 'Tactics',
    difficulty: 'Hard',
    stage: 'Marlinspike Unicorn Treasure Trail',
    boss: 'Red Rackham Secret Fleet',
    cast: [
      ['tintin_hero', 'Tintin', 'tactical'],
      ['captain_haddock', 'Captain Haddock', 'marine'],
      ['professor_calculus', 'Professor Calculus', 'hacker']
    ],
    enemies: ['Bordurian Agent', 'Smuggler Crew', 'False Detective'],
    bosses: ['Colonel Sponsz', 'Rastapopoulos'],
    gear: [
      ['unicorn_scroll', 'Unicorn Parchment', 'Parchemin de la Licorne'],
      ['shark_sub', 'Calculus Shark Submarine', 'Sous-marin requin de Tournesol'],
      ['snowy_flask', 'Snowy Rescue Flask', 'Flasque de secours de Milou']
    ],
    event: ['snowy_clue', 'Snowy Finds the Clue', 'Milou trouve l indice', 'Snowy uncovers the missing evidence, revealing the real objective and all disguised enemies.', 'Milou retrouve la preuve manquante, revele le vrai objectif et tous les ennemis deguises.'],
    origin: ['Reporter Tintin, Snowy, Haddock, and Calculus travel through conspiracies, expeditions, treasure hunts, and political dangers.', 'Le reporter Tintin, Milou, Haddock et Tournesol traversent conspirations, expeditions, chasses au tresor et dangers politiques.'],
    breach: ['a blank speech balloon follows Tintin between portals and removes clues from events, forcing the reporter to reconstruct the missing narrative.', 'une bulle blanche suit Tintin entre les portails et retire les indices des evenements, obligeant le reporter a reconstruire le recit manquant.'],
    motif: 'shipdeck',
    colors: ['#17334a', '#03070a', '#e6b448']
  }));
}
