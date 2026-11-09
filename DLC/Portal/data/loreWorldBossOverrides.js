// Portal — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Portal",
    "portal-glados-central-core",
    "GLaDOS",
    "stationary",
    "Portal (2007) - Central AI Chamber",
    "https://half-life.fandom.com/wiki/GLaDOS",
    "Portal 1 GLaDOS suspended from her ceiling rail, white mechanical shell, yellow optic, detachable personality cores and neurotoxin conduits.",
    [
      phase("rocket-redirection", "Rocket turret lock", "Mechanical swing", "Core detachment"),
      phase("neurotoxin", "Neurotoxin countdown", "Core incineration", "Chamber collapse"),
    ],
    { renderHeight: 340, anchor: { x: 0.78, y: 0.43 } },
  ));
}
