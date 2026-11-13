// Prometheus — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Prometheus",
    "prometheus-engineer-juggernaut",
    "Last Engineer",
    "large",
    "Prometheus (2012) - LV-223 finale",
    "https://avp.fandom.com/wiki/Last_Engineer",
    "The pale Last Engineer in black biomechanical pressure suit, very tall and muscular; Juggernaut remains scenery and Trilobite a separate asset.",
    [
      phase("temple-awakening", "Heavy strike", "Body throw", "Corridor pursuit"),
      phase("lifeboat", "Door breach", "Trilobite grapple", "Deacon epilogue trigger"),
    ],
  ));
}
