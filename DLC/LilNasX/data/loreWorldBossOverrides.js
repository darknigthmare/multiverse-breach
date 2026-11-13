// Lil Nas X — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Lil Nas X",
    "lil-nas-x-old-town-road-rift-rider",
    "https://www.lilnasx.com/",
    "Source-locked performer wardrobe across original western-pop stage transitions with mount, vehicle and dance layers; no enemy rider.",
  ));
}
