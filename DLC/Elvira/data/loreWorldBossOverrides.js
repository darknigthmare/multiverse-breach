// Elvira — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Elvira",
    "elvira-macabre-spellbook-coven",
    "Vincent Talbot",
    "duelist",
    "Elvira: Mistress of the Dark (1988)",
    "https://elvira.fandom.com/wiki/Vincent_Talbot",
    "Vincent Talbot as the film warlock in dark formal clothing with the spellbook and ritual effects separated from his body.",
    [
      phase("cinema-scheme", "Occult bolt", "Prop trap", "Spellbook theft"),
      phase("ritual-duel", "Binding circle", "Fire spell", "Spell reversal"),
    ],
  ));
}
