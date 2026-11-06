// Dragon Ball Z — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'dragon_ball_z',
    universe: 'Dragon Ball Z',
    mediaType: 'manga',
    faction: 'arcane',
    mode: 'Smash',
    difficulty: 'Expert',
    titleFr: 'Dragon Ball Z',
    stage: 'Cell Games Arena',
    boss: 'Majin Buu Planetary Crisis',
    hero: ['goku_dbz', 'Son Goku', 'slayer'],
    allies: [['vegeta_dbz', 'Vegeta', 'slayer'], ['piccolo_dbz', 'Piccolo', 'tactical']],
    monsters: ['Saibaman', 'Frieza Soldier', 'Cell Junior'],
    bosses: ['Frieza Final Form', 'Perfect Cell'],
    gear: [['senzu_bean', 'Senzu Bean', 'Haricot Senzu', { hp: 120 }], ['scouter_dbz', 'Saiyan Scouter', 'Detecteur Saiyan', { atk: 6, spd: 2 }], ['dragon_radar', 'Dragon Radar', 'Radar du Dragon', { def: 6, spd: 2 }]],
    event: ['evt_spirit_bomb', 'Spirit Bomb', 'Genkidama', 'Allied life energy gathers slowly into a single attack whose charge must be protected.', 'L energie vitale des allies se rassemble lentement en une attaque unique dont la charge doit etre protegee.'],
    theme: 'Saiyan transformations, ki control, Namek, androids, Cell, and the escalating Majin Buu crisis',
    desc: { en: 'Power rises through training, ki discipline, and defined transformations rather than free Nexus scaling.', fr: 'La puissance progresse par entrainement, maitrise du ki et transformations definies, pas par une inflation libre du Nexus.' },
    motif: 'wasteland',
    colors: ['#132c47', '#020609', '#ff9d28'],
    stageVariants: [['Tactics', 'Namek Frieza Landing Zone', 'Very Hard', 'Frieza Final Form'], ['RPG', 'Hyperbolic Time Chamber', 'Expert', 'Perfect Cell']]
  });
}
