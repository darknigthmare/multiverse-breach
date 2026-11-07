// Predators — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Predators',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Game Preserve Planet',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    bossName: 'Berserker Predator',
    title: { en: 'Predators', fr: 'Predators' },
    desc: {
      en: 'A game preserve planet where abducted killers face Super Predators, tracker beasts, and shifting alliances.',
      fr: 'Une planete-reserve ou des tueurs enleves affrontent Super Predators, molosses pisteurs et alliances fragiles.'
    },
    hero: { id: 'royce_predators', name: 'Royce', cat: 'tactical', color: '#3f4f3f' },
    allies: [
      { id: 'berserker_predator', name: 'Berserker Predator', cat: 'slayer', color: '#4a1f1f' },
      { id: 'hanzo_predators', name: 'Hanzo', cat: 'slayer', color: '#2f3536' }
    ],
    monsters: ['Tracker Hound', 'Falconer Drone', 'Preserve Trap'],
    bosses: ['Falconer Predator', 'Tracker Predator'],
    worldBoss: 'Berserker Predator',
    gear: [
      ['predators_falconer', 'Falconer Drone Eye', 'Oeil du drone fauconnier', { spd: 2, atk: 6 }],
      ['predators_tracker_chain', 'Tracker Chain', 'Chaine de pisteur', { def: 6, hp: 45 }],
      ['predators_yakuza_blade', 'Yakuza Duel Blade', 'Lame de duel yakuza', { atk: 10 }]
    ],
    event: ['evt_predators_preserve', 'Preserve Pack Hunt', 'Chasse de la reserve', 'Tracker beasts pin enemies while the squad gains speed.', 'Les molosses pisteurs bloquent les ennemis et accelerent l escouade.'],
    decor: { sky: ['#1f321c', '#030802'], floor: 'rgba(53, 147, 67, 0.18)', grid: 'rgba(158, 217, 74, 0.27)', motif: 'jungle', accent: '#9ed94a' }
  });
}
