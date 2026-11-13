// Predator: Killer of Killers — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Predator: Killer of Killers',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Yautja Anthology Arena',
    mode: 'Tactics',
    difficulty: 'Expert',
    bossName: 'First Blooded Champion',
    title: { en: 'Predator: Killer of Killers', fr: 'Predator: Killer of Killers' },
    desc: {
      en: 'An animated anthology breach where elite warriors from different eras are selected for Yautja judgment.',
      fr: 'Une breche anthologique animee ou des guerriers de plusieurs epoques sont choisis pour le jugement Yautja.'
    },
    hero: { id: 'viking_kok', name: 'Viking Shieldmaiden', cat: 'slayer', color: '#7f8c8d' },
    allies: [
      { id: 'ninja_kok', name: 'Shadow Ninja', cat: 'horror', color: '#111111' },
      { id: 'pilot_kok', name: 'War Pilot', cat: 'tactical', color: '#4f5d45' }
    ],
    monsters: ['Era-Hunter Drone', 'Blooded Initiate', 'Trophy Collector'],
    bosses: ['Samurai Hunt Master', 'Air War Predator'],
    worldBoss: 'First Blooded Champion',
    gear: [
      ['kok_blooded_mark', 'Blooded Mark', 'Marque de sang', { atk: 10, def: 4 }],
      ['kok_viking_shield', 'Runic Shield', 'Bouclier runique', { def: 8, hp: 45 }],
      ['kok_predator_spear', 'Trial Combistick', 'Combistick d epreuve', { atk: 9, spd: 1 }]
    ],
    event: ['evt_kok_trial', 'Blooded Trial', 'Epreuve de sang', 'Era champions strike in sequence and mark the boss.', 'Les champions d epoque frappent en sequence et marquent le boss.'],
    decor: { sky: ['#251b1b', '#050303'], floor: 'rgba(112, 85, 64, 0.18)', grid: 'rgba(255, 80, 64, 0.28)', motif: 'duelarena', accent: '#ff5040' }
  });
}
