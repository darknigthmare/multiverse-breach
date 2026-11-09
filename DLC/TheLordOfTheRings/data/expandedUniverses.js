// The Lord of the Rings — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'lord_of_the_rings',
    universe: 'The Lord of the Rings',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'RPG',
    difficulty: 'Very Hard',
    titleFr: 'Le Seigneur des Anneaux',
    stage: 'Barad-dur Eye of Sauron Siege',
    boss: 'Sauron Ring-Wraith Convergence',
    worldBoss: 'Morgoth Shadow Beyond the Door of Night',
    cast: [
      ['aragorn_lotr', 'Aragorn', 'slayer'],
      ['gandalf_lotr', 'Gandalf', 'hacker'],
      ['legolas_lotr', 'Legolas', 'tactical'],
      ['gimli_lotr', 'Gimli', 'marine']
    ],
    enemies: ['Uruk-hai Warband', 'Warg Rider', 'Mumakil Siege Host', 'Nazgul'],
    bosses: ['Mouth of Sauron', 'Balrog of Moria', 'Sauron'],
    gear: [
      ['anduril', 'Anduril Flame of the West', 'Anduril Flamme de l Ouest'],
      ['mithril', 'Mithril Mail', 'Cotte de mithril'],
      ['phial', 'Phial of Galadriel', 'Fiole de Galadriel']
    ],
    event: ['beacons', 'Beacons of Gondor', 'Feux d alarme du Gondor', 'The beacons call a Rohirrim charge across every hostile lane.', 'Les feux appellent une charge des Rohirrim a travers toutes les lignes ennemies.'],
    origin: ['Middle-earth is bound by the War of the Ring, ancient peoples, the Fellowship, and Sauron s will to dominate every free mind.', 'La Terre du Milieu est liee par la Guerre de l Anneau, les peuples anciens, la Communaute et la volonte de Sauron de dominer tout esprit libre.'],
    breach: ['a shard of the One Ring teaches the Eye of Sauron to see portals, while A.R.C.A. must keep Morgoth s older shadow outside the Trame.', 'un eclat de l Anneau Unique apprend a l Oeil de Sauron a voir les portails, tandis qu A.R.C.A. doit maintenir l ombre plus ancienne de Morgoth hors de la Trame.'],
    motif: 'castle',
    colors: ['#2a1b12', '#050302', '#e06b2f'],
    stageVariants: [['Tactics', 'Pelennor Fields Breachfront', 'Very Hard', 'Mumakil Siege Host']]
  }));
}
