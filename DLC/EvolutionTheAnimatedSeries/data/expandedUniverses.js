// Evolution: The Animated Series — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Evolution: The Animated Series',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Genus Command Field',
    mode: 'Tactics',
    difficulty: 'Medium',
    bossName: 'Genus Swarm Queen',
    title: { en: 'Evolution: The Animated Series', fr: 'Evolution : la serie animee' },
    desc: {
      en: 'The Genus threat spreads into animated monster-of-the-week mutations and field-response science missions.',
      fr: 'La menace Genus devient une suite de mutations animees et de missions scientifiques de terrain.'
    },
    hero: { id: 'ira_evo_anim', name: 'Ira Kane Animated', cat: 'hacker', color: '#2ecc71' },
    allies: [
      { id: 'harry_evo_anim', name: 'Harry Block Animated', cat: 'tactical', color: '#3498db' },
      { id: 'gassie_evo_anim', name: 'Gassie', cat: 'slayer', color: '#d35400' }
    ],
    monsters: ['Genus Runner', 'Mutant Flyer', 'Cell Splitter'],
    bosses: ['Genus Brute', 'Animated Hive Node'],
    worldBoss: 'Genus Swarm Queen',
    gear: [
      ['evoa_genus_scanner', 'Genus Scanner', 'Scanner Genus', { spd: 2, def: 4 }],
      ['evoa_field_pack', 'Field Science Pack', 'Sac scientifique terrain', { hp: 75 }],
      ['evoa_cell_sample', 'Animated Cell Sample', 'Cellule animee', { atk: 8, def: 3 }]
    ],
    event: ['evt_evoa_counteragent', 'Genus Counteragent', 'Contre-agent Genus', 'A counteragent weakens mutation waves and grants speed.', 'Un contre-agent affaiblit les mutations et donne de la vitesse.'],
    decor: { sky: ['#1d3b4a', '#03080b'], floor: 'rgba(58, 180, 145, 0.16)', grid: 'rgba(90, 230, 178, 0.28)', motif: 'facility', accent: '#5ae6b2' }
  });
}
