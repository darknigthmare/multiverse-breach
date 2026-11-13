// Halo — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Halo",
    "halo-covenant-scarab-mech",
    "Type-47 Scarab",
    "kaiju",
    "Halo 3 - Type-47B Deutoros continuity",
    "https://www.halopedia.org/Scarab",
    "Purple Covenant Type-47B Scarab with four articulated legs, focus cannon, deck turret, boarding ramp and rear power core.",
    [
      phase("scarab-advance", "Focus cannon", "Leg stomp", "Deck turret"),
      phase("boarding", "Joint destruction", "Interior defenders", "Rear core overload"),
    ],
    { renderHeight: 540, footprint: { width: 4, height: 4, placement: "edge" } },
  ));
}
