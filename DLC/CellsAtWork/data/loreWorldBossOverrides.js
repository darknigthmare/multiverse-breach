// Cells at Work! — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Cells at Work!",
    "cells-at-work-sepsis-breach",
    "Cancer Cell",
    "large",
    "Cells at Work! anime - Cancer Cell arc",
    "https://cellsatwork.fandom.com/wiki/Cancer_Cell",
    "Cancer Cell in his canonical pale humanoid form with asymmetrical mutation, dark clothing and proliferating cell masses; sepsis remains an environmental mode.",
    [
      phase("immune-evasion", "Cell mimicry", "Mutated arm strike", "Rapid proliferation"),
      phase("immune-response", "Tissue overgrowth", "Regeneration", "Killer T Cell breakthrough"),
    ],
  ));
}
