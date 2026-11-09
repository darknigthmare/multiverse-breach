// Pingu — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "Pingu",
    "pingu-frozen-fish-avalanche",
    "nonCombatFinal",
    "Pingu - family-friendly clay animation continuity",
    "Retrouver la famille, degager la neige et rapporter les poissons apres l'avalanche.",
    "Find the family, clear the snow and bring back the fish after the avalanche.",
    "Cet univers enfantin n'a pas d'antagoniste final et une avalanche avec HP serait incoherente.",
    "This child-friendly universe has no final antagonist, and an avalanche with HP would be incoherent.",
    ["https://www.pingu.jp/"],
    "Clay-like pixel-art ice field, igloo, Pingu family, fish, snow and crack tile states; no living avalanche.",
  ));
}
