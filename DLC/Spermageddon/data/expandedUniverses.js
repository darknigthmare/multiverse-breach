// Spermageddon — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLegacyNonCombatTrialNameRoutes() {
  return (['Spermageddon', 'escape', ['Hormone Gremlin', 'Body Cell Patrol', 'Awkward Musical Note', 'Contraception Gatekeeper', 'Cringe Chorus Beast']]);
}

export function createExpandedUniverses() {
  return ({
    universe: 'Spermageddon',
    mediaType: 'movie',
    faction: 'arcane',
    stageName: 'Body Odyssey Breach',
    mode: 'Smash',
    difficulty: 'Medium',
    bossName: 'Biology Musical Apocalypse',
    title: { en: 'Spermageddon', fr: 'Spermageddon' },
    desc: { en: 'A crude animated body-odyssey musical becomes a surreal inner-world breach of cells, songs, and chaos.', fr: 'Une odyssee corporelle animee et crue devient une breche interne de cellules, chansons et chaos.' },
    hero: { id: 'simen_spermageddon', name: 'Simen', cat: 'hacker', color: '#e6e6ff' },
    allies: [{ id: 'cumilla_spermageddon', name: 'Cumilla', cat: 'tactical', color: '#ff8fb3' }, { id: 'body_guard_cell', name: 'Body Guard Cell', cat: 'marine', color: '#75d5ff' }],
    monsters: ['Hormone Gremlin', 'Body Cell Patrol', 'Awkward Musical Note'],
    bosses: ['Contraception Gatekeeper', 'Cringe Chorus Beast'],
    worldBoss: 'Biology Musical Apocalypse',
    gear: [['sperm_mic', 'Tiny Musical Mic', 'Micro miniature', { spd: 2, atk: 4 }], ['sperm_cell_map', 'Body Route Map', 'Carte du corps', { def: 4, hp: 60 }], ['sperm_rhythm', 'Awkward Rhythm Core', 'Noyau rythme genant', { atk: 8 }]],
    event: ['evt_sperm_musical_surge', 'Awkward Musical Surge', 'Montee musicale genante', 'A surreal chorus scrambles enemy timing.', 'Un choeur surrealiste brouille le timing ennemi.'],
    decor: { sky: ['#2b1a33', '#060208'], floor: 'rgba(255, 143, 179, 0.14)', grid: 'rgba(117, 213, 255, 0.24)', motif: 'speaker', accent: '#75d5ff' }
  });
}
