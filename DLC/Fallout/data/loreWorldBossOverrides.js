// Fallout — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Fallout",
    "fallout-rogue-liberty-prime-mech",
    "The Master",
    "stationary",
    "Fallout (1997) - Cathedral Vault",
    "https://fallout.fandom.com/wiki/Master",
    "The Master fused into an organic-computer mass with human face, screens and mechanical arms in the Cathedral Vault control room.",
    [
      phase("unity-control", "Psychic assault", "Super Mutant reinforcement", "Mechanical arm sweep"),
      phase("sterility-proof", "Dialogue challenge", "Console sabotage", "Vault self-destruct"),
    ],
    { renderHeight: 322, footprint: { width: 3, height: 2, placement: "anchored" } },
  ));
}
