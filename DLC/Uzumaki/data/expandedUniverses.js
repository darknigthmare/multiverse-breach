// Uzumaki — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLegacyNonCombatTrialNameRoutes() {
  return (['Uzumaki', 'rescue', ['Spiral Snail Student', 'Azami Spiral Eye']]);
}

export function createLegacyNonCombatTrialNameRoutes2() {
  return (['Uzumaki', 'survive', ['Twisted Hair Storm']]);
}

export function createLegacyNonCombatTrialNameRoutes3() {
  return (['Uzumaki', 'escape', ['Cremation Smoke Coil', 'Lighthouse Coil']]);
}

export function createExpandedUniverses() {
  return ({
    universe: 'Uzumaki',
    mediaType: 'manga',
    faction: 'horror',
    stageName: 'Kurozu-cho Spiral Curse',
    mode: 'RPG',
    difficulty: 'Very Hard',
    bossName: 'Spiral City Maw',
    title: { en: 'Uzumaki', fr: 'Uzumaki - Spirale' },
    desc: { en: 'Spiral obsession bends a coastal town into body horror, pattern madness, and impossible geometry.', fr: 'L obsession de la spirale tord une ville cotiere en body horror, folie de motif et geometrie impossible.' },
    hero: { id: 'kirie_uzumaki', name: 'Kirie Goshima', cat: 'horror', color: '#3d3d3d' },
    allies: [{ id: 'shuichi_uzumaki', name: 'Shuichi Saito', cat: 'hacker', color: '#6d6d6d' }, { id: 'azami_uzumaki', name: 'Azami Spiral Echo', cat: 'slayer', color: '#2f2f2f' }],
    monsters: ['Spiral Snail Student', 'Twisted Hair Storm', 'Cremation Smoke Coil'],
    bosses: ['Azami Spiral Eye', 'Lighthouse Coil'],
    worldBoss: 'Spiral City Maw',
    gear: [['uzu_spiral_shell', 'Spiral Shell', 'Coquille spirale', { def: 6, atk: 4 }], ['uzu_black_notebook', 'Kurozu Notebook', 'Carnet de Kurozu', { spd: 2, hp: 40 }], ['uzu_coil_lantern', 'Coiled Lantern', 'Lanterne spiralee', { atk: 8 }]],
    event: ['evt_uzu_spiral_lock', 'Spiral Pattern Lock', 'Verrouillage spirale', 'A spiral curse traps enemies in looping movement.', 'Une malediction spirale enferme les ennemis dans une boucle.'],
    decor: { sky: ['#202020', '#050505'], floor: 'rgba(190, 190, 180, 0.12)', grid: 'rgba(230, 230, 220, 0.22)', motif: 'sigil', accent: '#d7d7cb' }
  });
}
