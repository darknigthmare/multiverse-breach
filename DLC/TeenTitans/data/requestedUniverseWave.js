// Teen Titans — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'teen_titans',
    universe: 'Teen Titans',
    mediaType: 'series',
    faction: 'arcane',
    mode: 'Smash',
    difficulty: 'Very Hard',
    titleFr: 'Teen Titans',
    stage: 'Titans Tower HIVE Assault',
    boss: 'Trigon Demon Father',
    hero: ['robin_tt', 'Robin', 'tactical'],
    allies: [['cyborg_tt', 'Cyborg', 'marine'], ['raven_tt', 'Raven', 'hacker']],
    monsters: ['H.I.V.E. Five Cadet', 'Control Freak Remote Drone', 'Brother Blood Student'],
    bosses: ['Slade Apprentice Trial', 'Terra Betrayal Golem'],
    worldBoss: 'Trigon Demon Father',
    gear: [['robin_bo_staff', 'Robin Bo Staff', 'Baton de Robin', { atk: 9, spd: 2 }], ['cyborg_sonic_cannon', 'Cyborg Sonic Cannon', 'Canon sonique de Cyborg', { atk: 10, hp: 45 }], ['raven_azarath_cloak', 'Raven Azarath Cloak', 'Cape d Azarath de Raven', { def: 8, hp: 55 }]],
    event: ['evt_titans_go_formation', 'Titans Go Formation', 'Formation Titans Go', 'The team locks one enemy inside Robin tactics, Cyborg pressure, and Raven containment before the breach can isolate them.', 'L equipe verrouille un ennemi entre tactique de Robin, pression de Cyborg et confinement de Raven avant que la breche les isole.'],
    theme: 'Titans Tower teamwork, Slade manipulation, H.I.V.E. pressure, Raven and Trigon prophecy, and teen heroes learning to fight as a unit',
    desc: { en: 'The Titans work as a team first: technology, sorcery, alien strength, animal morphing, and Robin tactics should stay distinct.', fr: 'Les Titans fonctionnent d abord en equipe: technologie, sorcellerie, force extraterrestre, morphing animal et tactique de Robin restent distincts.' },
    motif: 'arcanecity',
    colors: ['#171b2c', '#030306', '#7f5cff'],
    stageVariants: [['Tactics', 'HIVE Academy Break-In', 'Hard', 'Brother Blood Student'], ['RPG', 'Azarath Trigon Eclipse', 'Expert', 'Trigon Demon Father']]
  });
}
