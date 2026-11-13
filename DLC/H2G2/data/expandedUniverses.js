// H2G2 — definitions consumed by src/game/expandedUniverses.js.

export function createExpandedUniverseRecord() {
  return ({
      key: 'h2g2',
      universe: 'H2G2',
      mediaType: 'movie',
      faction: 'sciFi',
      mode: 'RPG',
      difficulty: 'Medium',
      titleFr: 'H2G2',
      stage: 'Heart of Gold Improbability Drive',
      boss: 'Vogon Constructor Fleet',
      hero: ['arthur_dent_h2g2', 'Arthur Dent', 'hacker'],
      allies: [['ford_prefect', 'Ford Prefect', 'tactical'], ['trillian_h2g2', 'Trillian', 'slayer']],
      monsters: ['Vogon Guard', 'Bureaucratic Form Drone', 'Improbability Creature'],
      bosses: ['Marvin Depression Field', 'Vogon Constructor Fleet'],
      gear: [['h2g2_towel', 'Extremely Useful Towel', 'Serviette extremement utile', { def: 6, hp: 50 }], ['h2g2_babel_fish', 'Babel Fish', 'Poisson Babel', { spd: 2, def: 3 }], ['h2g2_guide', 'Hitchhiker s Guide', 'Guide du voyageur galactique', { hp: 70, atk: 4 }]],
      event: ['evt_h2g2_improbability', 'Infinite Improbability Jump', 'Saut d improbabilite infinie', 'The Heart of Gold turns the enemy formation into a harmless statistical impossibility for one beat.', 'Le Coeur en Or transforme la formation ennemie en impossibilite statistique inoffensive pendant un instant.'],
      theme: 'cosmic absurdity, guide entries, Vogon bureaucracy, towels, Babel fish, and probability disasters',
      motif: 'shipdeck',
      colors: ['#14243a', '#02050a', '#7dd3ff']
    });
}
