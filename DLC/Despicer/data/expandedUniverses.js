// Despicer — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Despicer',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Hell Maze Despicer Rift',
    mode: 'RPG',
    difficulty: 'Hard',
    bossName: 'Despicer Hell Warden',
    title: { en: 'Despiser', fr: 'Despicer' },
    desc: { en: 'A surreal low-budget afterlife war twists purgatory roads, demons, and lost souls into a hell breach.', fr: 'Une guerre d apres-vie surrealiste tord routes de purgatoire, demons et ames perdues en breche infernale.' },
    hero: { id: 'gordon_despiser', name: 'Gordon Hauge', cat: 'horror', color: '#8a5a3d' },
    allies: [{ id: 'maggie_despiser', name: 'Maggie', cat: 'tactical', color: '#a56f5b' }, { id: 'afterlife_guard', name: 'Afterlife Guard', cat: 'marine', color: '#5d6870' }],
    monsters: ['Purgatory Crawler', 'Hell Road Wraith', 'Demon Pawn'],
    bosses: ['Soul Gate Keeper', 'Infernal Highway Beast'],
    worldBoss: 'Despicer Hell Warden',
    gear: [['despiser_coin', 'Afterlife Coin', 'Piece d apres-vie', { hp: 70 }], ['despiser_map', 'Purgatory Map', 'Carte du purgatoire', { spd: 2, def: 3 }], ['despiser_blade', 'Hell Road Blade', 'Lame route infernale', { atk: 9 }]],
    event: ['evt_despiser_soulroad', 'Soul Road Detour', 'Detour route des ames', 'The afterlife road redirects enemy damage into a demon pawn.', 'La route des ames redirige les degats ennemis vers un pion demon.'],
    decor: { sky: ['#30130f', '#070201'], floor: 'rgba(190, 73, 35, 0.18)', grid: 'rgba(255, 120, 64, 0.28)', motif: 'wasteland', accent: '#ff7840' }
  });
}
