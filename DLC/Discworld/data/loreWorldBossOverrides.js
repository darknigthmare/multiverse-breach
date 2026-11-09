// Discworld — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Discworld",
    "discworld-dungeon-dimensions-breach",
    "Bel-Shamharoth",
    "cosmic",
    "Discworld - The Colour of Magic temple encounter",
    "https://wiki.lspace.org/Bel-Shamharoth",
    "An original text-grounded octopoid horror with a central eye, tentacles and impossible octagonal temple geometry; no generic portal core.",
    [
      phase("forbidden-angles", "Tentacle sweep", "Eye gaze", "Dark geometry"),
      phase("octogram-seal", "Light-zone collapse", "Temple distortion", "Octogram closure"),
    ],
  ));
}
