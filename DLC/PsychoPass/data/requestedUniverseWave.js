// Psycho-Pass — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'psycho_pass',
    universe: 'Psycho-Pass',
    mediaType: 'series',
    faction: 'cyber',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    titleFr: 'Psycho-Pass',
    stage: 'Tokyo Public Safety Bureau Sweep',
    boss: 'Sibyl System Collective',
    hero: ['akane_tsunemori', 'Akane Tsunemori', 'tactical'],
    allies: [['shinya_kogami', 'Shinya Kogami', 'marine'], ['nobuchika_ginoza', 'Nobuchika Ginoza', 'tactical']],
    monsters: ['Helmet Rioter', 'Crime Coefficient Drone', 'Sibyl Security Enforcer'],
    bosses: ['Shogo Makishima', 'Kirito Kamui'],
    gear: [['dominator_psychopass', 'Dominator', 'Dominator', { atk: 10, def: 4 }], ['holo_disguise', 'Holographic Disguise', 'Deguisement holographique', { spd: 2, def: 6 }], ['cymatic_scan', 'Cymatic Scan Lens', 'Lentille de scan cymatique', { def: 7, hp: 45 }]],
    event: ['evt_dominator_mode', 'Dominator Mode Authorization', 'Autorisation du Dominator', 'Sibyl measures the target and authorizes only the mode allowed by its current Crime Coefficient.', 'Sibyl mesure la cible et n autorise que le mode permis par son Coefficient de Criminalite.' ],
    theme: 'Crime Coefficients, Dominator authorization, Inspectors, Enforcers, and the moral machinery of Sibyl',
    desc: { en: 'The Dominator never becomes a generic gun: its target scan and Sibyl authorization gate every shot.', fr: 'Le Dominator ne devient jamais une arme generique: scan de cible et autorisation de Sibyl conditionnent chaque tir.' },
    motif: 'facility',
    colors: ['#12212c', '#020405', '#52e5ff'],
    stageVariants: [['RPG', 'Hyper-Oats Facility Hostage Route', 'Hard', 'Shogo Makishima'], ['Smash', 'SEAUn Intervention Grid', 'Expert', 'Sibyl System Collective']]
  });
}
