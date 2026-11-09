// Rammstein — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Rammstein',
    mediaType: 'music',
    faction: 'horror',
    stageName: 'Industrial Feuerzone',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'Engel Wings Pyro Rig',
    title: { en: 'Rammstein', fr: 'Rammstein' },
    desc: {
      en: 'Industrial metal staged as a furnace arena: flame columns, steel rhythm, and theatrical pressure.',
      fr: 'Metal industriel transforme en arene de fournaise : colonnes de feu, rythme d acier et pression scenique.'
    },
    hero: { id: 'till_lindemann', name: 'Till Lindemann', cat: 'slayer', color: '#7b241c' },
    allies: [
      { id: 'richard_kruspe', name: 'Richard Z. Kruspe', cat: 'slayer', color: '#566573' },
      { id: 'paul_landers', name: 'Paul Landers', cat: 'tactical', color: '#a04000' }
    ],
    monsters: ['Flame Projector Rig', 'Industrial Spark Shower', 'Stage Smoke Wall'],
    bosses: ['Mein Teil Butcher Table', 'Du Hast Pyro Wall'],
    worldBoss: 'Engel Wings Pyro Rig',
    gear: [
      ['rammstein_flamer', 'Stage Flamethrower', 'Lance-flammes de scene', { atk: 11 }],
      ['rammstein_steel_boots', 'Steel Stage Boots', 'Bottes de scene acier', { def: 6, hp: 45 }],
      ['rammstein_mic_stand', 'Reinforced Mic Stand', 'Pied micro renforce', { atk: 8, spd: 1 }]
    ],
    event: ['evt_rammstein_pyro', 'Feuerzone Burst', 'Explosion Feuerzone', 'Pyro columns burn enemies and boost squad attack.', 'Des colonnes pyro brulent les ennemis et renforcent l attaque.'],
    decor: { sky: ['#36110d', '#090201'], floor: 'rgba(179, 55, 31, 0.21)', grid: 'rgba(255, 105, 45, 0.34)', motif: 'concert', accent: '#ff692d' }
  });
}
