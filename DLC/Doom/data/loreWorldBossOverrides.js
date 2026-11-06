// Doom — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Doom",
    "doom-icon-of-sin-titan",
    "Icon of Sin",
    "kaiju",
    "Doom Eternal - Final Sin",
    "https://doom.fandom.com/wiki/Icon_of_Sin/Doom_Eternal",
    "Doom Eternal Icon of Sin with Urdak armor and eight independently degradable body sections above the ruined city.",
    [
      phase("urdak-armor", "Building punch", "Meteor rain", "Demon summon"),
      phase("exposed-titan", "Eight body weak zones", "Flame wave", "Crucible finish"),
    ],
    { renderHeight: 650, footprint: { width: 0, height: 0, placement: "backdrop" } },
  ));
}
