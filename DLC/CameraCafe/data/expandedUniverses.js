// Camera Cafe — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Camera Cafe',
    mediaType: 'series',
    faction: 'cyber',
    stageName: 'Office Coffee Machine Loop',
    mode: 'Tactics',
    difficulty: 'Medium',
    bossName: 'Corporate Coffee Machine Core',
    title: { en: 'Camera Cafe', fr: 'Camera Cafe' },
    desc: { en: 'French office absurdity compresses gossip, hierarchy, and coffee-machine static into workplace combat.', fr: 'L absurde de bureau francais compresse ragots, hierarchie et parasites de machine a cafe en combat professionnel.' },
    hero: { id: 'jean_claude_camera', name: 'Jean-Claude Convenant', cat: 'tactical', color: '#5f6f7f' },
    allies: [{ id: 'herve_camera', name: 'Herve Dumont', cat: 'hacker', color: '#8a7a63' }, { id: 'maeva_camera', name: 'Maeva Capucin', cat: 'marine', color: '#b88b8b' }],
    monsters: ['HR Memo Drone', 'Broken Copier', 'Coffee Queue Rival'],
    bosses: ['Open Space Rumor Swarm', 'Director Office Lock'],
    worldBoss: 'Corporate Coffee Machine Core',
    gear: [['cc_mug', 'Office Mug', 'Mug de bureau', { hp: 70 }], ['cc_badge', 'Access Badge', 'Badge acces', { spd: 1, def: 5 }], ['cc_memo', 'Aggressive Memo', 'Note agressive', { atk: 7 }]],
    event: ['evt_cc_pause_cafe', 'Pause Cafe Ambush', 'Embuscade pause cafe', 'Office gossip distracts enemies and gives the team tempo.', 'Les ragots de bureau distraient les ennemis et donnent du tempo.'],
    decor: { sky: ['#20282f', '#050708'], floor: 'rgba(160, 135, 100, 0.16)', grid: 'rgba(200, 220, 230, 0.22)', motif: 'facility', accent: '#c8dce6' }
  });
}
