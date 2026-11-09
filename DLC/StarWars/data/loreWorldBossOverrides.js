// Star Wars — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Star Wars",
    "star-wars-darth-vader-sith-master",
    "Darth Vader",
    "duelist",
    "Star Wars original trilogy - Return of the Jedi",
    "https://www.starwars.com/databank/darth-vader",
    "Original-trilogy Darth Vader with correct helmet, armor, chest controls and cape in the Death Star II throne room.",
    [
      phase("throne-room", "Lightsaber combo", "Force push", "Saber throw"),
      phase("inner-conflict", "Force choke", "Bridge pressure", "Luke disarm"),
      phase("redemption", "Palpatine hazard", "Scripted choice", "Emperor throw"),
    ],
  ));
}
