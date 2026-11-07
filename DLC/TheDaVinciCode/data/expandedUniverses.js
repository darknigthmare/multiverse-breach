// The Da Vinci Code — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'da_vinci_code',
    universe: 'The Da Vinci Code',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'Tactics',
    difficulty: 'Hard',
    titleFr: 'Da Vinci Code',
    stage: 'Louvre Rose Line Cipher',
    boss: 'Priory Keystone Conspiracy',
    cast: [
      ['robert_langdon_dvc', 'Robert Langdon', 'hacker'],
      ['sophie_neveu_dvc', 'Sophie Neveu', 'tactical'],
      ['bezu_fache_dvc', 'Bezu Fache', 'marine']
    ],
    enemies: ['Opus Dei Pursuer', 'False Priory Agent', 'Cipher Guardian'],
    bosses: ['Silas', 'The Teacher'],
    gear: [
      ['cryptex', 'Rosewood Cryptex', 'Cryptex en bois de rose'],
      ['fleur_key', 'Fleur-de-lis Key', 'Cle fleur-de-lis'],
      ['rose_map', 'Rose Line Chart', 'Carte de la ligne rose']
    ],
    event: ['cryptex', 'Cryptex Revelation', 'Revelation du Cryptex', 'Langdon solves the active symbol chain, opening locked routes and cancelling false objectives.', 'Langdon resout la chaine de symboles active, ouvre les routes verrouillees et annule les faux objectifs.'],
    origin: ['Langdon and Sophie follow a murder trail through art, symbols, the Priory of Sion, and a secret guarded by competing institutions.', 'Langdon et Sophie suivent une piste de meurtre a travers l art, les symboles, le Prieure de Sion et un secret garde par des institutions rivales.'],
    breach: ['the Rose Line intersects the galaxy map, making every portal coordinate look like evidence in a conspiracy engineered by the Authorless.', 'la ligne rose croise la carte galactique, transformant chaque coordonnee de portail en preuve d une conspiration du Sans-Auteur.'],
    motif: 'castle',
    colors: ['#251d16', '#050403', '#c69b50']
  }));
}
