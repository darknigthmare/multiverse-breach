// Hazbin Hotel — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Hazbin Hotel",
    "hazbin-hotel-extermination-overlord",
    "Adam",
    "duelist",
    "Hazbin Hotel season 1 - Extermination finale",
    "https://hazbinhotel.fandom.com/wiki/Adam",
    "Adam with horned exorcist mask, golden wings, white robe and guitar-axe, matching season-one graphic language without copying a frame.",
    [
      phase("hotel-rooftop", "Guitar-axe cleave", "Light ray", "Exorcist reinforcement"),
      phase("mask-break", "Aerial dive", "Holy blast", "Niffty intervention"),
    ],
    { renderHeight: 190, anchor: { x: 0.8, y: 0.7 } },
  ));
}
