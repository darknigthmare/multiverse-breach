// Dungeon Meshi — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Dungeon Meshi",
    "dungeon-meshi-winged-lion-appetite",
    "The Winged Lion",
    "cosmic",
    "Delicious in Dungeon manga - demon finale",
    "https://delicious-in-dungeon.fandom.com/wiki/Winged_Lion",
    "The golden Winged Lion with wings, mane and shifting desire manifestations, maintaining its calm smile and unsettling expressions.",
    [
      phase("golden-country", "Desire illusion", "Monster manifestation", "Body transformation"),
      phase("devoured-desire", "Wish inversion", "Appetite collapse", "Laios consumption condition"),
    ],
  ));
}
