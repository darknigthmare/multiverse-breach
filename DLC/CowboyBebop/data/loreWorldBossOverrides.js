// Cowboy Bebop — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Cowboy Bebop",
    "cowboy-bebop-vicious-red-dragon-syndicate",
    "Vicious",
    "duelist",
    "Cowboy Bebop anime - The Real Folk Blues",
    "https://cowboybebop.fandom.com/wiki/Vicious",
    "Vicious with grey hair, black coat and katana on the Red Dragon headquarters stairs; the Syndicate guards remain separate units.",
    [
      phase("headquarters-ascent", "Guard crossfire", "Grenade pressure", "Katana intercept"),
      phase("staircase-duel", "Fast draw", "Close slash", "Mutual final strike"),
    ],
  ));
}
