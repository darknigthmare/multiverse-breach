// 28 Days Later — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'twenty_eight_days_later',
    universe: '28 Days Later',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'RPG',
    difficulty: 'Very Hard',
    titleFr: '28 jours plus tard',
    stage: 'London Rage Evacuation',
    boss: 'Mansion Soldier Lockdown',
    cast: [
      ['jim_28dl', 'Jim', 'slayer'],
      ['selena_28dl', 'Selena', 'tactical'],
      ['hannah_28dl', 'Hannah', 'hacker']
    ],
    enemies: ['Rage Infected', 'Tunnel Infected', 'Rogue Soldier'],
    bosses: ['Mailers Chain Break', 'Major West'],
    gear: [
      ['machete', 'Selena s Machete', 'Machette de Selena'],
      ['taxi_keys', 'London Taxi Keys', 'Cles du taxi londonien'],
      ['hello_banner', 'HELLO Rescue Banner', 'Banniere de secours HELLO']
    ],
    event: ['mailers_release', 'Mailer Release', 'Liberation de Mailer', 'The chained infected crashes through the hostile garrison while survivors sprint for extraction.', 'L infecte enchaine traverse la garnison hostile pendant que les survivants courent vers l extraction.'],
    origin: ['A laboratory Rage virus empties Britain in weeks, leaving Jim, Selena, and Hannah between infected crowds and predatory survivors.', 'Un virus de Rage vide la Grande-Bretagne en quelques semaines, laissant Jim, Selena et Hannah entre foules infectees et survivants predateurs.'],
    breach: ['Rage crosses portals in seconds but burns out quickly, turning every delayed extraction into a brutal timing problem.', 'la Rage traverse les portails en quelques secondes mais s epuise vite, transformant chaque extraction retardee en probleme brutal de timing.'],
    motif: 'wasteland',
    colors: ['#24120f', '#040201', '#d4432f']
  }));
}
