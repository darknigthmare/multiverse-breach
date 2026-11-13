// Cyberpunk: Edgerunners — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'cyberpunk_edgerunners',
    universe: 'Cyberpunk: Edgerunners',
    mediaType: 'series',
    faction: 'cyber',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    titleFr: 'Cyberpunk: Edgerunners',
    stage: 'Night City Arasaka Tower Run',
    boss: 'Adam Smasher Full Borg',
    hero: ['david_martinez', 'David Martinez', 'slayer'],
    allies: [['lucy_edgerunners', 'Lucy', 'hacker'], ['rebecca_edgerunners', 'Rebecca', 'marine']],
    monsters: ['Maelstrom Borg', 'Arasaka Security Trooper', 'Militech Combat Drone'],
    bosses: ['Maine Cyberpsychosis', 'Militech Basilisk Convoy'],
    gear: [['david_sandevistan', 'Military Sandevistan', 'Sandevistan militaire', { spd: 3, atk: 8 }], ['lucy_monowire', 'Lucy Monowire', 'Monofilament de Lucy', { atk: 10, spd: 2 }], ['rebecca_guts', 'Rebeccas Guts Shotgun', 'Fusil Guts de Rebecca', { atk: 12, hp: 35 }]],
    event: ['evt_edgerunner_overclock', 'Sandevistan Overclock', 'Sandevistan en surcharge', 'David chains impossible movements before cyberpsychosis pressure catches up with him.', 'David enchaine des mouvements impossibles avant que la pression cyberpsychotique ne le rattrape.'],
    theme: 'Night City mercenary runs, chrome overload, netrunning, and cyberpsychosis under Arasaka pressure',
    desc: { en: 'Edgerunners trade flesh, time, and sanity for one more job beneath Arasakas control of Night City.', fr: 'Les edgerunners echangent chair, temps et raison contre une mission de plus sous le controle d Arasaka sur Night City.' },
    motif: 'arcanecity',
    colors: ['#18162c', '#030306', '#f5e942'],
    stageVariants: [['Smash', 'Santo Domingo Highway Ambush', 'Hard', 'Militech Basilisk Convoy'], ['RPG', 'Moon Dream Braindance', 'Very Hard', 'Adam Smasher Full Borg']]
  });
}
