// BlazBlue — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "BlazBlue",
    "blazblue-sword-core-mu-12",
    "Mu-12",
    "duelist",
    "BlazBlue: Continuum Shift - Mu-12 ending route",
    "https://blazblue.wiki/wiki/Mu-12",
    "Mu-12 in white and black armor with mechanical crown and separate Steins Gunner blade units, never a floating sword core.",
    [
      phase("steins-gunner", "Floating blade volley", "Laser line", "Teleport slash"),
      phase("astral-overload", "Steins Gunner formation", "Beam crossfire", "Astral Heat"),
    ],
  ));
}
