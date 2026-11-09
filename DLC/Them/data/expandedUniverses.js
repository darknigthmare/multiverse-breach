// Them! — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'them_1954',
    universe: 'Them!',
    mediaType: 'movie',
    faction: 'sciFi',
    mode: 'Tactics',
    difficulty: 'Hard',
    titleFr: 'Des monstres attaquent la ville',
    stage: 'Los Angeles Storm Drain Colony',
    boss: 'Queen Ant Brood Chamber',
    cast: [
      ['ben_peterson_them', 'Ben Peterson', 'tactical'],
      ['pat_medford_them', 'Pat Medford', 'hacker'],
      ['robert_graham_them', 'Robert Graham', 'marine']
    ],
    enemies: ['Giant Worker Ant', 'Giant Soldier Ant', 'Brood Tunnel Ambusher'],
    bosses: ['Queen Guard Pair', 'Queen Ant'],
    gear: [
      ['formic_acid', 'Formic Acid Sample', 'Echantillon d acide formique'],
      ['geiger_counter', 'Desert Geiger Counter', 'Compteur Geiger du desert'],
      ['flamethrower', 'Nest Flamethrower', 'Lance-flammes de nid']
    ],
    event: ['nest_purge', 'Storm Drain Nest Purge', 'Purge du nid des egouts', 'A.R.C.A. seals the tunnels before concentrated flame purges the brood lanes.', 'A.R.C.A. scelle les tunnels avant qu une flamme concentree purge les couloirs de ponte.'],
    origin: ['Atomic testing creates giant ants whose organized colonies threaten 1950s America from desert nests and city tunnels.', 'Les essais atomiques creent des fourmis geantes dont les colonies organisees menacent l Amerique des annees 1950 depuis le desert et les egouts.'],
    breach: ['a queen mistakes portal resonance for a mating signal and seeds connected worlds with eggs before A.R.C.A. can quarantine them.', 'une reine prend la resonance des portails pour un signal nuptial et pond dans plusieurs mondes connectes avant la quarantaine A.R.C.A.'],
    motif: 'facility',
    colors: ['#2a2416', '#050403', '#e7c35a']
  }));
}
