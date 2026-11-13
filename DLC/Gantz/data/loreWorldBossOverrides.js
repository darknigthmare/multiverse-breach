// Gantz — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Gantz",
    "gantz-nurarihyon-osaka-final-form",
    "Nurarihyon",
    "kaiju",
    "Gantz manga - Osaka arc",
    "https://gantz.fandom.com/wiki/Nurarihyon",
    "A transformation atlas covering Nurarihyon's old-man guise, detached head, demon body and giant Osaka forms without blending them.",
    [
      phase("old-man-regeneration", "Body reconstruction", "Head detachment", "Counter adaptation"),
      phase("demon-forms", "Laser gaze", "Multiplication", "Giant limb sweep"),
      phase("core-destruction", "Hidden weak point", "Regeneration lock", "Team finisher"),
    ],
    { renderHeight: 520, footprint: { width: 3, height: 3, placement: "edge" } },
  ));
}
