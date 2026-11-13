// Chainsaw Man — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'chainsaw_man',
    universe: 'Chainsaw Man',
    mediaType: 'manga',
    faction: 'horror',
    mode: 'Smash',
    difficulty: 'Very Hard',
    titleFr: 'Chainsaw Man',
    stage: 'Tokyo Public Safety Devil Hunt',
    boss: 'Gun Devil Catastrophe',
    hero: ['denji_chainsaw', 'Denji', 'slayer'],
    allies: [['power_blood_fiend', 'Power', 'horror'], ['aki_hayakawa', 'Aki Hayakawa', 'tactical']],
    monsters: ['Bat Devil', 'Eternity Devil', 'Zombie Devil Horde'],
    bosses: ['Katana Man', 'Bomb Devil Reze'],
    gear: [['pochita_pull_cord', 'Pochita Pull Cord', 'Cordon de Pochita', { atk: 10, hp: 40 }], ['fox_contract_seal', 'Fox Devil Contract Seal', 'Sceau du Demon-Renard', { atk: 8, spd: 2 }], ['aki_curse_nail', 'Aki Curse Nail', 'Clou maudit d Aki', { atk: 12, def: 3 }]],
    event: ['evt_chainsaw_transformation', 'Chainsaw Transformation', 'Transformation tronconneuse', 'Denji pulls the cord, tears through the hostile line, and restores health by drinking devil blood.', 'Denji tire sur le cordon, dechire la ligne hostile et recupere de la vie avec le sang des demons.'],
    theme: 'Public Safety devil contracts, chainsaw transformations, fiends, and lethal bargains in Tokyo',
    desc: { en: 'Public Safety hunters survive by contracting devils whose prices remain binding inside the Breach.', fr: 'Les chasseurs de la Securite publique survivent grace a des contrats demoniaques dont le prix reste valable dans la Breche.' },
    motif: 'arcanecity',
    colors: ['#241413', '#050202', '#ff3b24'],
    stageVariants: [['Tactics', 'Hotel Eternity Devil Loop', 'Very Hard', 'Eternity Devil'], ['RPG', 'Gun Devil Snowfield Memory', 'Expert', 'Gun Devil Catastrophe']]
  });
}
