// Saw — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "Saw",
    "saw-jigsaw-classroom-trap-hub",
    "nonCombatFinal",
    "Saw - Jigsaw test-room continuity",
    "Comprendre les indices, desamorcer les mecanismes et choisir qui sauver avant la fermeture de la salle.",
    "Interpret the clues, disarm the mechanisms and decide whom to save before the room seals.",
    "Jigsaw construit des epreuves morales; aucun Trap Hub mecanique n'est un combattant canonique.",
    "Jigsaw constructs moral tests; no mechanical Trap Hub is a canonical combatant.",
    ["https://www.lionsgate.com/movies/saw"],
    "Original industrial test room with CRT Billy message, timer, chains, keys, doors and armed/disarmed/failure prop states.",
  ));
}
