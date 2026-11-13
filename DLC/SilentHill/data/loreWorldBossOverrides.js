// Silent Hill — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Silent Hill",
    "silent-hill-god-of-the-otherworld-core",
    "Incubus",
    "kaiju",
    "Silent Hill (1999) - Incubus ending route",
    "https://silenthill.fandom.com/wiki/Incubus",
    "Incubus as the dark winged horned demon above the burning altar, without any mechanical core or Silent Hill 3 design.",
    [
      phase("altar-manifestation", "Vertical lightning", "Wing hover", "Fire rain"),
      phase("ritual-collapse", "Aglaophotis reaction", "Falling lightning", "Altar extinction"),
    ],
    { renderHeight: 438, anchor: { x: 0.73, y: 0.58 } },
  ));
}
