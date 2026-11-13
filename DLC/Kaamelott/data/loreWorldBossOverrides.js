// Kaamelott — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Kaamelott",
    "kaamelott-graal-rift",
    "Lancelot du Lac",
    "duelist",
    "Kaamelott - Premier Volet (2021)",
    "https://kaamelott.fandom.com/fr/wiki/Kaamelott_-_Premier_Volet",
    "KV1 Lancelot with grey hair, towering organic white armor, broad shoulders, cape and sword, without a Grail portal.",
    [
      phase("white-fortress", "High guard", "Thrust", "White Guard command"),
      phase("excalibur-duel", "Armor break", "Counter slash", "Final sword exchange"),
    ],
    { renderHeight: 194 },
  ));
}
