// VelociPastor — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'VelociPastor',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Parish Raptor Confession',
    mode: 'Smash',
    difficulty: 'Medium',
    bossName: 'VelociPastor Dino Form',
    title: { en: 'VelociPastor', fr: 'VelociPastor' },
    desc: { en: 'A low-budget sacred mutation turns faith, claws, and absurd monster cinema into a breach signature.', fr: 'Une mutation sacree de serie B melange foi, griffes et cinema absurde en signature de breche.' },
    hero: { id: 'doug_velocipastor', name: 'Doug Jones Pastor', cat: 'horror', color: '#6c8a4b' },
    allies: [{ id: 'carol_velocipastor', name: 'Carol', cat: 'slayer', color: '#c45b5b' }, { id: 'frankie_velocipastor', name: 'Frankie Mermaid', cat: 'tactical', color: '#5c6f7f' }],
    monsters: ['Rubber Suit Raptor', 'Cult Ninja Acolyte', 'Confession Ghoul'],
    bosses: ['Dragon Warrior Monk', 'Possessed Parish Bell'],
    worldBoss: 'VelociPastor Dino Form',
    gear: [['vp_claw_rosary', 'Clawed Rosary', 'Rosaire griffe', { atk: 8, def: 3 }], ['vp_parish_coat', 'Parish Coat', 'Manteau de paroisse', { hp: 75 }], ['vp_ninja_script', 'Ninja Script Page', 'Page de script ninja', { spd: 2, atk: 4 }]],
    event: ['evt_vp_dino_sermon', 'Dino Sermon', 'Sermon raptor', 'The raptor sermon frightens enemies and boosts melee allies.', 'Le sermon raptor effraie les ennemis et renforce les allies de melee.'],
    decor: { sky: ['#24341d', '#050905'], floor: 'rgba(114, 86, 55, 0.18)', grid: 'rgba(153, 218, 91, 0.25)', motif: 'hauntedset', accent: '#99da5b' }
  });
}
