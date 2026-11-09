// Steins;Gate — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'steins_gate',
    universe: 'Steins;Gate',
    mediaType: 'series',
    faction: 'cyber',
    mode: 'RPG',
    difficulty: 'Hard',
    titleFr: 'Steins;Gate',
    stage: 'Akihabara Future Gadget Laboratory',
    boss: 'SERN Attractor Field',
    hero: ['rintaro_okabe', 'Rintaro Okabe', 'hacker'],
    allies: [['kurisu_makise', 'Kurisu Makise', 'hacker'], ['itaru_hashida', 'Itaru Hashida', 'tactical']],
    monsters: ['SERN Rounder', 'Jellyman Experiment', 'D-Mail Divergence Echo'],
    bosses: ['FB Rounder Network', 'Nae Time-Leap Echo'],
    gear: [['phonewave', 'PhoneWave Name Subject to Change', 'PhoneWave nom provisoire', { spd: 2, atk: 6 }], ['ibn_5100', 'IBN 5100', 'IBN 5100', { def: 8, hp: 55 }], ['divergence_meter', 'Divergence Meter', 'Divergence Meter', { spd: 2, def: 5 }]],
    event: ['evt_operation_skuld', 'Operation Skuld', 'Operation Skuld', 'Okabe deceives observed history without changing the event the world believes it witnessed.', 'Okabe trompe l histoire observee sans changer l evenement que le monde croit avoir vu.'],
    theme: 'D-Mails, world lines, Reading Steiner, SERN pursuit, and the cost of forcing convergence to change',
    desc: { en: 'Time travel follows world-line convergence rather than free rewinds, and Okabe alone retains memories across shifts.', fr: 'Le voyage temporel suit la convergence des lignes d univers plutot qu un rembobinage libre, et Okabe seul conserve ses souvenirs entre les changements.' },
    motif: 'facility',
    colors: ['#241c16', '#050403', '#ff9a3d'],
    stageVariants: [['Tactics', 'SERN Rounder Apartment Raid', 'Very Hard', 'FB Rounder Network'], ['Smash', 'Radio Kaikan Operation Skuld', 'Expert', 'SERN Attractor Field']]
  });
}
