// Ecco the Dolphin — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Ecco the Dolphin",
    "ecco-vortex-queen-deep-signal",
    "Vortex Queen",
    "large",
    "Ecco the Dolphin (1992) - Welcome to the Machine finale",
    "https://eccothedolphin.fandom.com/wiki/Vortex_Queen",
    "The original Mega Drive Vortex Queen: an enormous green biomechanical head with exposed vulnerable eyes, a detachable biting jaw and organic Vortex projectiles, without humanoid anatomy or added armor.",
    [
      phase("vortex-brood", "Vortex projectile volley", "Eye weak-point cycle", "Jaw detachment"),
      phase("queen-core", "Independent jaw pursuit", "Rapid brood release", "Sonar eye strike"),
    ],
    {
      renderHeight: 348,
      anchor: { x: 0.77, y: 0.68 },
      footprint: { width: 3, height: 2, placement: "anchored" },
      loreFr: "La Reine Vortex commande la ruche alien de Welcome to the Machine; Ecco doit frapper ses yeux au sonar tout en evitant sa machoire et ses projectiles.",
      loreEn: "The Vortex Queen commands the alien hive in Welcome to the Machine; Ecco must strike her eyes with sonar while avoiding her jaw and projectiles.",
    },
  ));
}
