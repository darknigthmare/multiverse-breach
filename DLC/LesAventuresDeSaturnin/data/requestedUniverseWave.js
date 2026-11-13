// Les Aventures de Saturnin — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'saturnin_duck',
    universe: 'Les Aventures de Saturnin',
    mediaType: 'series',
    faction: 'arcane',
    mode: 'RPG',
    difficulty: 'Medium',
    titleFr: 'Les Aventures de Saturnin',
    stage: 'Saturnins Miniature Animal Village',
    boss: 'Foxes Village Caper',
    hero: ['saturnin_duck', 'Saturnin the Duck', 'tactical'],
    allies: [['police_dog_saturnin', 'Police Dog', 'marine'], ['professor_popof', 'Professor Popof', 'hacker']],
    monsters: ['Mischievous Fox', 'Runaway Miniature Car', 'Village Garden Mole'],
    bosses: ['Dame Belette Scheme', 'Foxes Village Caper'],
    gear: [['saturnin_ski_goggles', 'Saturnins Ski Goggles', 'Lunettes de ski de Saturnin', { def: 6, spd: 2 }], ['miniature_car_key', 'Miniature Car Key', 'Cle de voiture miniature', { spd: 2, hp: 45 }], ['popof_toolbox', 'Professor Popofs Toolbox', 'Boite a outils du professeur Popof', { def: 7, hp: 50 }]],
    event: ['evt_saturnin_village_chase', 'Saturnin Village Chase', 'Poursuite au village de Saturnin', 'Saturnin rallies the real-animal village through miniature roads, gardens, and a precisely timed rescue.', 'Saturnin mobilise le village d animaux reels a travers routes miniatures, jardins et sauvetage parfaitement cadence.' ],
    theme: 'Jean Touranes real-animal miniature village, a temperamental yellow duckling, and practical everyday adventures',
    desc: { en: 'Saturnin remains the yellow live-action duckling from the French ORTF series, surrounded by real animals in miniature sets.', fr: 'Saturnin reste le caneton jaune en prises de vues reelles de la serie francaise de l ORTF, entoure de vrais animaux dans des decors miniatures.' },
    motif: 'arcanecity',
    colors: ['#2b3518', '#060803', '#ffd83d'],
    stageVariants: [['Tactics', 'Professor Popofs Workshop', 'Medium', 'Dame Belette Scheme'], ['Smash', 'Saturnin Alpine Ski Run', 'Hard', 'Foxes Village Caper']]
  });
}
