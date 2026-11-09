// Alien 3 — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Alien 3',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Fiorina 161 Furnace Run',
    mode: 'RPG',
    difficulty: 'Hard',
    bossName: 'Runner Alien',
    title: { en: 'Alien 3', fr: 'Alien 3' },
    desc: {
      en: 'A prison foundry without weapons, where survival depends on doors, bait, heat, and sacrifice.',
      fr: 'Une fonderie-prison sans armes, ou la survie depend des portes, des leurres, de la chaleur et du sacrifice.'
    },
    hero: { id: 'ripley_a3', name: 'Ellen Ripley A3', cat: 'horror', color: '#8b6f5a' },
    allies: [
      { id: 'dillon_a3', name: 'Dillon', cat: 'marine', color: '#6a4f3f' },
      { id: 'morse_a3', name: 'Morse', cat: 'tactical', color: '#7d7d68' }
    ],
    monsters: ['Prisoner Host', 'Vent Runner', 'Furnace Swarm'],
    bosses: ['Leadworks Chase', 'Company Retrieval Team'],
    worldBoss: 'Runner Alien',
    gear: [
      ['a3_furnace_key', 'Furnace Control Key', 'Cle de fourneau', { def: 6, hp: 50 }],
      ['a3_signal_flare', 'Industrial Signal Flare', 'Fussee industrielle', { atk: 7, spd: 1 }],
      ['a3_pipe_trap', 'Lead Pipe Trap', 'Piege au tuyau', { atk: 8, def: 3 }]
    ],
    event: ['evt_a3_furnace', 'Leadworks Furnace Trap', 'Piege du fourneau', 'A furnace blast burns and slows the strongest enemy.', 'Un souffle de fourneau brule et ralentit l ennemi le plus fort.'],
    decor: { sky: ['#2d2016', '#090503'], floor: 'rgba(148, 92, 48, 0.2)', grid: 'rgba(255, 121, 44, 0.28)', motif: 'facility', accent: '#ff792c' }
  });
}
