// Home Alone — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'home_alone',
    universe: 'Home Alone',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'Tactics',
    difficulty: 'Medium',
    titleFr: 'Maman, j ai rate l avion',
    stage: 'McCallister House Trap Grid',
    boss: 'Wet Bandits Final Entry',
    cast: [
      ['kevin_mccallister', 'Kevin McCallister', 'hacker'],
      ['old_man_marley', 'Old Man Marley', 'marine'],
      ['kate_mccallister', 'Kate McCallister', 'tactical']
    ],
    enemies: ['Wet Bandit Decoy', 'Basement Furnace Fear', 'False Delivery Intruder'],
    bosses: ['Harry Lime', 'Marv Murchins'],
    gear: [
      ['paint_can', 'Stairwell Paint Can', 'Pot de peinture de l escalier'],
      ['tarantula', 'Buzz s Tarantula', 'Tarentule de Buzz'],
      ['talkboy', 'Talkboy Recorder', 'Enregistreur Talkboy']
    ],
    event: ['trap_plan', 'Battle Plan Montage', 'Montage du plan de bataille', 'Kevin converts every empty tile into a visible trap and routes enemies through the safest chain.', 'Kevin transforme chaque case vide en piege visible et dirige les ennemis dans la chaine la plus sure.'],
    origin: ['Forgotten at home for Christmas, Kevin defends his family house from Harry and Marv with improvised traps and nerve.', 'Oublie chez lui pour Noel, Kevin defend la maison familiale contre Harry et Marv avec des pieges improvises et du sang-froid.'],
    breach: ['his floor plan overlays the Citadel, and harmless household props become real tactical cover without losing their comic timing.', 'son plan de maison se superpose a la Citadelle, et les accessoires domestiques deviennent de vraies couvertures tactiques sans perdre leur rythme comique.'],
    motif: 'arcanecity',
    colors: ['#25352f', '#050706', '#c83f39']
  }));
}
