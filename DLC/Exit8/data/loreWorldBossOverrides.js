// Exit 8 — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "Exit 8",
    "exit-8-exit-8-anomaly-loop",
    "nonCombatFinal",
    "The Exit 8 - original game corridor loop",
    "Observer chaque passage, revenir en arriere en cas d'anomalie et atteindre correctement la sortie 8.",
    "Observe every passage, turn back when an anomaly appears and correctly reach Exit 8.",
    "Le jeu ne contient ni antagoniste final ni combat.",
    "The game contains neither a final antagonist nor combat.",
    ["https://store.steampowered.com/app/2653790/The_Exit_8/"],
    "Modular white subway corridor with walker, doors, lights, flooding and interchangeable anomaly layers; signage remains a separate UI layer.",
  ));
}
