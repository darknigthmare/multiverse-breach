// War of the Worlds — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'War of the Worlds',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Tripod Red Weed Invasion',
    mode: 'RPG',
    difficulty: 'Very Hard',
    bossName: 'Martian Tripod Harvester',
    title: { en: 'War of the Worlds', fr: 'War of the Worlds - Steven Spielberg' },
    desc: { en: 'Spielberg s invasion collapses panic, red weed, EMP storms, and towering tripods into survival sci-fi.', fr: 'L invasion de Spielberg condense panique, herbe rouge, tempetes EMP et tripodes geants en survie SF.' },
    hero: { id: 'ray_wotw', name: 'Ray Ferrier', cat: 'tactical', color: '#4a5960' },
    allies: [{ id: 'rachel_wotw', name: 'Rachel Ferrier', cat: 'horror', color: '#b6a08c' }, { id: 'robbie_wotw', name: 'Robbie Ferrier', cat: 'marine', color: '#6b6f72' }],
    monsters: ['Red Weed Tendril', 'Tripod Probe Eye', 'Refugee Panic Echo'],
    bosses: ['Basement Probe Sweep', 'EMP Street Collapse'],
    worldBoss: 'Martian Tripod Harvester',
    gear: [['wotw_fuse', 'Dead Fuse Box', 'Boitier fusible mort', { def: 5, hp: 55 }], ['wotw_tripod_eye', 'Tripod Lens Shard', 'Eclat lentille tripod', { atk: 9 }], ['wotw_redweed', 'Red Weed Sample', 'Echantillon herbe rouge', { hp: 80 }]],
    event: ['evt_wotw_emp', 'EMP Skyfall', 'Chute EMP', 'Tripod interference disables enemy tech for one beat.', 'Les interferences tripodes coupent la technologie ennemie un instant.'],
    decor: { sky: ['#1d2428', '#030405'], floor: 'rgba(130, 30, 30, 0.18)', grid: 'rgba(118, 205, 255, 0.24)', motif: 'wasteland', accent: '#76cdff' }
  });
}
