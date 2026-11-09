// Spy x Family — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Spy x Family',
    mediaType: 'manga',
    faction: 'cyber',
    stageName: 'Berlint Operation Strix',
    mode: 'Tactics',
    difficulty: 'Medium',
    bossName: 'Operation Strix Collapse',
    title: { en: 'Spy x Family', fr: 'Spy x Family' },
    desc: { en: 'Espionage, assassination, telepathy, and found-family secrets become a precision tactical breach.', fr: 'Espionnage, assassinat, telepathie et famille improvisee deviennent une breche tactique de precision.' },
    hero: { id: 'loid_forger', name: 'Loid Forger', cat: 'tactical', color: '#6f8f78' },
    allies: [{ id: 'yor_forger', name: 'Yor Forger', cat: 'slayer', color: '#111111' }, { id: 'anya_forger', name: 'Anya Forger', cat: 'hacker', color: '#ff9fbd' }],
    monsters: ['Ostania Agent', 'Eden Hall Bully', 'Secret Police Tail'],
    bosses: ['Garden Assassin Cell', 'Desmond Security Wall'],
    worldBoss: 'Operation Strix Collapse',
    gear: [['sxf_bond_tag', 'Bond Mission Tag', 'Medaille mission Bond', { spd: 2, hp: 45 }], ['sxf_thorn_pin', 'Thorn Princess Pin', 'Epingle Princesse Epine', { atk: 10 }], ['sxf_spy_watch', 'Twilight Spy Watch', 'Montre espion Twilight', { def: 5, atk: 4 }]],
    event: ['evt_sxf_mind_read', 'Telepathic Read', 'Lecture telepathique', 'Anya reads enemy intent and boosts dodge timing.', 'Anya lit les intentions ennemies et ameliore l esquive.'],
    decor: { sky: ['#1f2f28', '#030605'], floor: 'rgba(154, 126, 86, 0.16)', grid: 'rgba(255, 159, 189, 0.24)', motif: 'arcanecity', accent: '#ff9fbd' }
  });
}
