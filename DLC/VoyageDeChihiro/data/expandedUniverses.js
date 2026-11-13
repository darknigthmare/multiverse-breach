// Voyage de Chihiro — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLegacyNonCombatTrialNameRoutes() {
  return (['Voyage de Chihiro', 'evidence', ['Yubaba']]);
}

export function createLegacyNonCombatTrialNameRoutes2() {
  return (['Voyage de Chihiro', 'switches', ['Kashira Trio']]);
}

export function createExpandedUniverseRecord() {
  return ({ key: 'spirited_away', universe: 'Voyage de Chihiro', mediaType: 'movie', faction: 'arcane', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Voyage de Chihiro', stage: 'Bathhouse Spirit Crossing', boss: 'No-Face Gold Hunger', hero: ['chihiro_ogino', 'Chihiro', 'tactical'], allies: [['haku_spirited', 'Haku', 'slayer'], ['lin_spirited', 'Lin', 'hacker']], theme: 'spirit bathhouse rules, river dragons, masked hunger, and courage through enchanted labor', motif: 'castle', colors: ['#162d2a', '#020706', '#6ff0c8'] });
}
