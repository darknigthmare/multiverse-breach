// Fullmetal Alchemist — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'fullmetal_alchemist',
    universe: 'Fullmetal Alchemist',
    mediaType: 'manga',
    faction: 'arcane',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    titleFr: 'Fullmetal Alchemist',
    stage: 'Central Promised Day',
    boss: 'Father Beyond the Gate',
    hero: ['edward_elric', 'Edward Elric', 'hacker'],
    allies: [['alphonse_elric', 'Alphonse Elric', 'marine'], ['roy_mustang', 'Roy Mustang', 'tactical']],
    monsters: ['Mannequin Soldier', 'State Alchemist Chimera', 'Central Command Trooper'],
    bosses: ['Pride Selim Bradley', 'King Bradley Wrath'],
    gear: [['state_alchemist_watch', 'State Alchemist Pocket Watch', 'Montre d Alchimiste d Etat', { def: 6, spd: 2 }], ['philosophers_stone_shard', 'Philosophers Stone Shard', 'Eclat de Pierre philosophale', { atk: 10, hp: 50 }], ['flame_glove', 'Mustangs Ignition Glove', 'Gant d ignition de Mustang', { atk: 11 }]],
    event: ['evt_equivalent_exchange', 'Equivalent Exchange Array', 'Cercle d echange equivalent', 'The Elrics rebuild cover from available matter without creating material from nothing.', 'Les Elric reconstruisent une couverture avec la matiere disponible sans rien creer a partir du neant.'],
    theme: 'equivalent exchange, human transmutation, homunculi, Amestris conspiracies, and the Promised Day',
    desc: { en: 'Alchemy obeys equivalent exchange and transmutation circles unless a Gate-trained alchemist pays the proper price.', fr: 'L alchimie obeit a l echange equivalent et aux cercles de transmutation, sauf si un alchimiste passe par la Porte et paie le prix.' },
    motif: 'fortress',
    colors: ['#1f2b31', '#040607', '#d7b65a'],
    stageVariants: [['RPG', 'Laboratory Five Homunculus Trap', 'Hard', 'Pride Selim Bradley'], ['Smash', 'Briggs Fortress Invasion', 'Very Hard', 'King Bradley Wrath']]
  });
}
