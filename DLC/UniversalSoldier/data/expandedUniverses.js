// Universal Soldier — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'universal_soldier',
    universe: 'Universal Soldier',
    mediaType: 'movie',
    faction: 'sciFi',
    mode: 'Tactics',
    difficulty: 'Hard',
    stage: 'UniSol Cryogenic Convoy',
    boss: 'GR13 Cooling System Rampage',
    cast: [
      ['luc_deveraux_us', 'Luc Deveraux', 'marine'],
      ['veronica_roberts_us', 'Veronica Roberts', 'tactical'],
      ['maggie_us', 'Maggie', 'hacker']
    ],
    enemies: ['UniSol Trooper', 'Programmed Veteran', 'Cooling Convoy Guard'],
    bosses: ['Andrew Scott / GR13', 'S.E.T.H. Core'],
    gear: [
      ['coolant', 'UniSol Coolant Pack', 'Pack de refroidissement UniSol'],
      ['memory_file', 'Luc Memory File', 'Dossier memoire de Luc'],
      ['rifle', 'GR44 Tactical Rifle', 'Fusil tactique GR44']
    ],
    event: ['memory_return', 'Deveraux Memory Return', 'Retour de memoire de Deveraux', 'Luc rejects the command program, restores his identity, and disables nearby UniSol control links.', 'Luc rejette le programme de commandement, restaure son identite et coupe les liens de controle UniSol voisins.'],
    origin: ['Dead soldiers are revived as conditioned UniSols until Luc Deveraux recovers his memories and turns against the program.', 'Des soldats morts sont ressuscites comme UniSols conditionnes jusqu a ce que Luc Deveraux retrouve ses souvenirs et se retourne contre le programme.'],
    breach: ['the project uses duplicate hero bodies as replacement soldiers, making personal memory the only proof that a revived fighter is not disposable.', 'le projet utilise des corps de heros dupliques comme soldats de remplacement, faisant de la memoire personnelle la seule preuve qu un combattant ressuscite n est pas jetable.'],
    motif: 'facility',
    colors: ['#162630', '#030608', '#74c7d8']
  }));
}
