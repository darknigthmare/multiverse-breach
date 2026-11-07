// Final Fantasy VII — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Final Fantasy VII",
    "final-fantasy-vii-safer-sephiroth-jenova-core",
    "Safer Sephiroth",
    "cosmic",
    "Final Fantasy VII (1997) - Northern Crater",
    "https://finalfantasy.fandom.com/wiki/Safer_Sephiroth",
    "Safer Sephiroth with one black wing, white lower wings, halo and exposed core anatomy, preceded by Bizarro Sephiroth as a separate phase.",
    [
      phase("bizarro-sephiroth", "Core transfer", "Multiple target limbs", "Bizarro Energy"),
      phase("safer-sephiroth", "Pale Horse", "Shadow Flare", "Supernova"),
      phase("mind-duel", "Omnislash condition", "Masamune counter", "Lifestream fade"),
    ],
  ));
}
