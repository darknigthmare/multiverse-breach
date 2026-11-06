// Superhero Movie — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'superhero_movie',
    universe: 'Superhero Movie',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'Smash',
    difficulty: 'Medium',
    stage: 'Empire City Dragonfly Disaster',
    boss: 'Hourglass Life-Drain Machine',
    cast: [
      ['rick_riker_sm', 'Rick Riker / Dragonfly', 'slayer'],
      ['trey_sm', 'Trey', 'hacker'],
      ['jill_johnson_sm', 'Jill Johnson', 'tactical']
    ],
    enemies: ['Corporate Henchman', 'Mutant Animal Gag', 'Award Ceremony Guard'],
    bosses: ['Lou Landers', 'The Hourglass'],
    gear: [
      ['dragonfly_wing', 'Dragonfly Wing Harness', 'Harnais d ailes de Dragonfly'],
      ['nail_gun', 'Accidental Nail Gun', 'Pistolet a clous accidentel'],
      ['hourglass_vial', 'Hourglass Energy Vial', 'Fiole d energie Hourglass']
    ],
    event: ['dragonfly_landing', 'Dragonfly Hero Landing', 'Atterrissage heroique de Dragonfly', 'Rick misses the landing, demolishes the enemy cover, and somehow saves the squad.', 'Rick rate son atterrissage, detruit la couverture ennemie et sauve quand meme l escouade.'],
    origin: ['Rick Riker gains clumsy insect powers and becomes Dragonfly while the Hourglass drains lives to remain young.', 'Rick Riker obtient des pouvoirs d insecte maladroits et devient Dragonfly tandis que l Hourglass vole des vies pour rester jeune.'],
    breach: ['the parody world copies every heroic protocol at the wrong scale, producing dangerous results that still satisfy Nexus mission conditions.', 'le monde parodique copie chaque protocole heroique a la mauvaise echelle, avec des resultats dangereux qui valident pourtant les objectifs du Nexus.'],
    motif: 'arcanecity',
    colors: ['#172d3f', '#030609', '#e24a46']
  }));
}
