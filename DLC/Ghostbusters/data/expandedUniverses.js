// Ghostbusters — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Ghostbusters',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'New York Containment Breach',
    mode: 'Tactics',
    difficulty: 'Hard',
    bossName: 'Gozer Dimension Gate',
    title: { en: 'Ghostbusters', fr: 'Ghostbusters' },
    desc: { en: 'Proton packs, ghost traps, ectoplasm, and New York hauntings cross the streams into the Nexus.', fr: 'Packs a protons, pieges fantomes, ectoplasme et hantises new-yorkaises croisent les effluves dans le Nexus.' },
    hero: { id: 'venkman_gb', name: 'Peter Venkman', cat: 'hacker', color: '#b8a77a' },
    allies: [{ id: 'stantz_gb', name: 'Ray Stantz', cat: 'tactical', color: '#d9c58f' }, { id: 'zeddemore_gb', name: 'Winston Zeddemore', cat: 'marine', color: '#a8905f' }],
    monsters: ['Class Five Free-Roamer', 'Slimer Ectoplasm', 'Library Ghost'],
    bosses: ['Terror Dog Sentinel', 'Stay Puft Manifestation'],
    worldBoss: 'Gozer Dimension Gate',
    gear: [['gb_proton', 'Proton Pack Coil', 'Bobine pack proton', { atk: 10 }], ['gb_trap', 'Ghost Trap', 'Piege fantome', { def: 6, spd: 1 }], ['gb_meter', 'PKE Meter', 'Detecteur PKE', { spd: 2, hp: 35 }]],
    event: ['evt_gb_cross_streams', 'Cross the Streams', 'Croiser les effluves', 'A proton convergence damages ghosts and seals summons.', 'Une convergence protonique blesse les spectres et scelle les invocations.'],
    decor: { sky: ['#1b2730', '#030507'], floor: 'rgba(120, 210, 150, 0.14)', grid: 'rgba(100, 255, 160, 0.28)', motif: 'arcanecity', accent: '#64ffa0' }
  });
}
