// Vocaloid — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ performancePolicy }) {
  return (performancePolicy(
    "Vocaloid",
    "vocaloid-shibuya-gigantic-stage-core",
    "https://ec.crypton.co.jp/pages/prod/virtualsinger/cv01_us",
    "Virtual Shibuya stage with source-locked Hatsune Miku silhouette, holographic musicians, cyan-pink lighting and crowd layers; no hostile core.",
  ));
}
