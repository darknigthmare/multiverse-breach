// Gears of War — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Gears of War",
    "gears-of-war-gargantuan-brumak",
    "Brumak",
    "kaiju",
    "Gears of War - Locust war continuity",
    "https://gearsofwar.fandom.com/wiki/Brumak",
    "Massive reptilian Brumak with Locust harness, arm cannons, dorsal missile rack and a separately targetable pilot.",
    [
      phase("heavy-ordnance", "Arm cannon burst", "Missile barrage", "Stomp"),
      phase("weapon-stripping", "Harness weak points", "Pilot exposure", "Final collapse"),
    ],
    { renderHeight: 470, footprint: { width: 3, height: 3, placement: "edge" } },
  ));
}
