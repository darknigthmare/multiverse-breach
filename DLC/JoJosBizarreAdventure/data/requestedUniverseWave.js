// JoJo's Bizarre Adventure — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'jojo_bizarre_adventure',
    universe: "JoJo's Bizarre Adventure",
    mediaType: 'manga',
    faction: 'arcane',
    mode: 'Smash',
    difficulty: 'Very Hard',
    titleFr: 'JoJos Bizarre Adventure',
    stage: 'Cairo DIO Mansion Pursuit',
    boss: 'DIO The World',
    hero: ['jotaro_kujo', 'Jotaro Kujo', 'slayer'],
    allies: [['joseph_joestar', 'Joseph Joestar', 'tactical'], ['giorno_giovanna', 'Giorno Giovanna', 'hacker']],
    monsters: ['Vampire Zombie', 'Stand User Assassin', 'Pillar Man Spawn'],
    bosses: ['Kars Ultimate Life Form', 'Diavolo King Crimson'],
    gear: [['stand_arrow', 'Stand Arrow', 'Fleche de Stand', { atk: 10, spd: 1 }], ['stone_mask_jojo', 'Stone Mask', 'Masque de pierre', { hp: 65, atk: 7 }], ['red_stone_aja', 'Red Stone of Aja', 'Pierre rouge d Aja', { atk: 8, def: 6 }]],
    event: ['evt_star_platinum_time_stop', 'Star Platinum: The World', 'Star Platinum: The World', 'Jotaro stops time for a brief decisive barrage without granting the squad unrestricted time travel.', 'Jotaro arrete brievement le temps pour une rafale decisive sans offrir a l escouade un voyage temporel libre.'],
    theme: 'Joestar bloodlines, Hamon, Stands, vampires, and flamboyant battles of precise supernatural rules',
    desc: { en: 'Every Stand retains its own range and rule; the Breach cannot turn them into interchangeable magic.', fr: 'Chaque Stand conserve sa portee et sa regle; la Breche ne peut pas les transformer en magie interchangeable.' },
    motif: 'arcanecity',
    colors: ['#241438', '#050208', '#d75cff'],
    stageVariants: [['RPG', 'Battle Tendency Volcano', 'Hard', 'Kars Ultimate Life Form'], ['Tactics', 'Rome Colosseum Requiem', 'Expert', 'Diavolo King Crimson']]
  });
}
