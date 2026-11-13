// House of the Dead 2 — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "House of the Dead 2",
    "house-of-the-dead-2-emperor-type-alpha",
    "Emperor Type Alpha",
    "large",
    "The House of the Dead 2 (1998) - Goldman incident",
    "https://thehouseofthedead.fandom.com/wiki/Emperor",
    "Exact Emperor Type Alpha: translucent pale-blue humanoid body, visible spinning red heart core and multiple floating transparent orbs; retain its smooth unfinished synthetic anatomy and never replace it with armor or a throne.",
    [
      phase("goldman-rooftop", "Orb throw", "Arm-sword morph", "Heart-core guard"),
      phase("tarot-emulation", "Judgment mimic", "Hierophant mimic", "Tower mimic"),
      phase("emergency-orbit", "Spinning orb rush", "Core exposure", "Goldman tower finish"),
    ],
    { renderHeight: 258, anchor: { x: 0.78, y: 0.72 } },
  ));
}
