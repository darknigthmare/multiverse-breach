// Ghostbusters — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Ghostbusters",
    "ghostbusters-gozer-dimension-gate",
    "Stay Puft Marshmallow Man",
    "kaiju",
    "Ghostbusters (1984) - Gozer rooftop finale",
    "https://ghostbusters.fandom.com/wiki/Stay_Puft_Marshmallow_Man",
    "The 1984 Stay Puft destructor form with sailor collar, red neckerchief and soft white body towering over New York streets.",
    [
      phase("manhattan-march", "Building crush", "Street stomp", "Marshmallow grab"),
      phase("rooftop-crossrip", "Proton-stream weak points", "Gozer gate surge", "Cross-stream detonation"),
    ],
  ));
}
