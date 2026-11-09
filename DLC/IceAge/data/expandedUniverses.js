// Ice Age — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'ice_age',
    universe: 'Ice Age',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'RPG',
    difficulty: 'Medium',
    titleFr: 'L Age de glace',
    stage: 'Glacier Migration Pass',
    boss: 'Continental Drift Ice Wall',
    cast: [
      ['manny_iceage', 'Manny', 'marine'],
      ['sid_iceage', 'Sid', 'hacker'],
      ['diego_iceage', 'Diego', 'slayer']
    ],
    enemies: ['Dodo Mob', 'Pirate Ape', 'Ice Cave Predator'],
    bosses: ['Soto', 'Captain Gutt'],
    gear: [
      ['acorn', 'Scrat s Acorn', 'Gland de Scrat'],
      ['tusk_guard', 'Mammoth Tusk Guard', 'Protection de defense de mammouth'],
      ['ice_bridge', 'Glacier Bridge Shard', 'Eclat de pont glaciaire']
    ],
    event: ['scrat_crack', 'Scrat Continental Crack', 'Fissure continentale de Scrat', 'Scrat loses the acorn and accidentally splits the battlefield away from the enemy boss.', 'Scrat perd son gland et separe accidentellement le champ de bataille du boss ennemi.'],
    origin: ['Manny, Sid, and Diego form an unlikely herd while migrations, melting ice, and continental disasters reshape their prehistoric world.', 'Manny, Sid et Diego forment une troupe improbable tandis que migrations, fonte des glaces et catastrophes continentales transforment leur monde prehistorique.'],
    breach: ['Scrat s acorn falls through a portal and cracks the multiverse map, forcing the herd to escort displaced species home.', 'le gland de Scrat tombe dans un portail et fissure la carte du multivers, obligeant la troupe a raccompagner des especes deplacees.'],
    motif: 'wasteland',
    colors: ['#17313d', '#030708', '#a8e2f0']
  }));
}
