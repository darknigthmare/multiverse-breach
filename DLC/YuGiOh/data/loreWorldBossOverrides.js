// Yu-Gi-Oh — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Yu-Gi-Oh!",
    "yu-gi-oh-obelisk-the-tormentor-god",
    "Zorc Necrophades",
    "kaiju",
    "Yu-Gi-Oh! Duel Monsters - Memory World arc",
    "https://yugioh.fandom.com/wiki/Zorc_Necrophades",
    "Giant black-violet horned demon Zorc with the Memory World proportions and serpent-like tail, without card frame or Obelisk anatomy.",
    [
      phase("memory-world", "Darkness breath", "Demon claw", "Monster destruction"),
      phase("horakhty-condition", "Dark regeneration", "Shadow eruption", "Light-of-Creation defeat"),
    ],
  ));
}
