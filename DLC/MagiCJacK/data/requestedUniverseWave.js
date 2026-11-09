// MagiC JacK — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'magic_jack_youtuber',
    universe: 'MagiC JacK',
    mediaType: 'series',
    faction: 'horror',
    mode: 'RPG',
    difficulty: 'Hard',
    titleFr: 'MagiC JacK',
    stage: 'La Minute Sapiens Tribunal',
    boss: 'Human Lobby Incarnation',
    hero: ['magic_jack_ginolin', 'MagiC JacK', 'horror'],
    allies: [['max_rage_ginolin', 'Max Rage', 'slayer'], ['sapiens_witness', 'Sapiens Witness', 'tactical']],
    monsters: ['Lobby Advocate', 'Consumption Avatar', 'Speciesist Broadcast Drone'],
    bosses: ['Human Lobby Incarnation', 'Polymorph Judgment Double'],
    gear: [['magicjack_judge_hammer', 'MagiC JacK Judges Hammer', 'Marteau de juge MagiC JacK', { atk: 9, def: 5 }], ['sapiens_camera', 'La Minute Sapiens Camera', 'Camera de La Minute Sapiens', { spd: 2, def: 6 }], ['max_rage_microphone', 'Max Rage Microphone', 'Micro de Max Rage', { atk: 8, hp: 50 }]],
    event: ['evt_magicjack_polymorph', 'Alien Polymorph Indictment', 'Requisitoire polymorphe extraterrestre', 'MagiC JacK changes form to expose a human contradiction rather than borrowing an unrelated superpower.', 'MagiC JacK change de forme pour exposer une contradiction humaine sans emprunter un pouvoir etranger.' ],
    theme: 'Maxime Ginolins polymorphic alien persona, courtroom satire, filmmaking, music, and confrontational human critique',
    desc: { en: 'MagiC JacK is the polymorphic alien persona performed by filmmaker and musician Maxime Ginolin, not a generic stage magician.', fr: 'MagiC JacK est le personnage extraterrestre polymorphe interprete par le realisateur et musicien Maxime Ginolin, pas un magicien generique.' },
    motif: 'hauntedset',
    colors: ['#22131d', '#040204', '#f05765'],
    stageVariants: [['Tactics', 'Grosse Social Mirror Set', 'Hard', 'Polymorph Judgment Double'], ['Smash', 'Max Rage Concert Indictment', 'Very Hard', 'Human Lobby Incarnation']]
  });
}
