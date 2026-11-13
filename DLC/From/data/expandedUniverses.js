// From — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLegacyNonCombatTrialNameRoutes() {
  return (['From', 'switches', ['Faraway Tree Echo', 'Music Box Ballerina']]);
}

export function createLegacyNonCombatTrialNameRoutes2() {
  return (['From', 'survive', ['Cicada Nightmare']]);
}

export function createExpandedUniverses({ makeLoreBossWave }) {
  return ({
    universe: 'From',
    mediaType: 'series',
    faction: 'horror',
    stageName: 'Town That Does Not Let Go',
    mode: 'RPG',
    difficulty: 'Very Hard',
    bossName: 'Smiling Night Entity',
    title: { en: 'From', fr: 'From' },
    desc: { en: 'A trapped town loops roads, talismans, radio static, and smiling night creatures into a survival breach.', fr: 'Une ville piege boucle routes, talismans, parasites radio et creatures souriantes en breche de survie.' },
    hero: { id: 'boyd_from', name: 'Boyd Stevens', cat: 'tactical', color: '#4f5d4f' },
    allies: [{ id: 'tabitha_from', name: 'Tabitha Matthews', cat: 'horror', color: '#8e6f55' }, { id: 'jade_from', name: 'Jade Herrera', cat: 'hacker', color: '#6f7f8f' }],
    monsters: ['Smiling Townwalker', 'Faraway Tree Echo', 'Cicada Nightmare'],
    bosses: makeLoreBossWave('From', 'From'),
    worldBoss: 'Smiling Night Entity',
    gear: [['from_talisman', 'Protection Talisman', 'Talisman de protection', { def: 8, hp: 45 }], ['from_radio', 'Broken Radio Tower Part', 'Piece de tour radio', { spd: 1, atk: 6 }], ['from_map_pin', 'Impossible Road Pin', 'Repere de route impossible', { hp: 70 }]],
    event: ['evt_from_talisman_ring', 'Talisman Night Lock', 'Verrou nocturne talisman', 'Talismans seal the squad and reduce incoming horror damage.', 'Les talismans scellent l escouade et reduisent les degats d horreur.'],
    decor: { sky: ['#1a2420', '#030504'], floor: 'rgba(88, 106, 82, 0.17)', grid: 'rgba(220, 200, 140, 0.22)', motif: 'hauntedset', accent: '#dcc88c' }
  });
}
