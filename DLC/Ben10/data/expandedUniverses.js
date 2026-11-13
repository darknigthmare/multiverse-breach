// Ben 10 — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'ben_10',
    universe: 'Ben 10',
    mediaType: 'series',
    faction: 'sciFi',
    mode: 'RPG',
    difficulty: 'Hard',
    stage: 'Bellwood Omnitrix Invasion',
    boss: 'Vilgax Omnitrix Override',
    cast: [
      ['ben_tennyson', 'Ben Tennyson', 'slayer'],
      ['gwen_tennyson', 'Gwen Tennyson', 'hacker'],
      ['kevin_levin', 'Kevin Levin', 'tactical']
    ],
    enemies: ['DNA Alien', 'Forever Knight', 'Vilgax Drone'],
    bosses: ['Kevin 11 Mutation', 'Vilgax'],
    gear: [
      ['omnitrix_core', 'Omnitrix Core', 'Noyau Omnitrix'],
      ['charm', 'Charm of Bezel', 'Charme de Bezel'],
      ['plumber_badge', 'Plumber Badge', 'Insigne des Plombiers']
    ],
    event: ['master_control', 'Omnitrix Master Control', 'Controle maitre de l Omnitrix', 'Ben cycles through the exact alien forms needed to counter every enemy class.', 'Ben enchaine les formes extraterrestres exactes pour contrer chaque classe ennemie.'],
    origin: ['Ben Tennyson uses the Omnitrix to transform into alien heroes while Gwen, Kevin, and the Plumbers confront cosmic threats.', 'Ben Tennyson utilise l Omnitrix pour devenir des heros extraterrestres tandis que Gwen, Kevin et les Plombiers affrontent des menaces cosmiques.'],
    breach: ['the Omnitrix samples entire universe signatures as DNA, risking transformations that contain worlds instead of species.', 'l Omnitrix echantillonne des signatures d univers entieres comme ADN, risquant des transformations qui contiennent des mondes plutot que des especes.'],
    motif: 'facility',
    colors: ['#142a1d', '#030604', '#56ef54']
  }));
}
