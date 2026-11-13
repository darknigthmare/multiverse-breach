// Resident Evil — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Resident Evil",
    "resident-evil-william-birkin-g-stage-4",
    "William Birkin G4",
    "large",
    "Resident Evil 2 - William Birkin G4",
    "https://residentevil.fandom.com/wiki/William_Birkin/gameplay",
    "Quadrupedal red G4 Birkin with central maw and multiple orange eyes, kept separate from the later train-bound G5 mutation.",
    [
      phase("g4-charge", "Quadruped rush", "Claw rake", "Wall leap"),
      phase("eye-stagger", "Multi-eye weak points", "Frenzy", "Platform collapse"),
    ],
    { renderHeight: 286, footprint: { width: 2, height: 2, placement: "grid" } },
  ));
}
