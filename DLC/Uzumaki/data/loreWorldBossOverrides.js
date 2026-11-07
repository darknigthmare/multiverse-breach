// Uzumaki — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "Uzumaki",
    "uzumaki-spiral-city-maw",
    "stageSetpiece",
    "Uzumaki manga - ancient spiral city beneath Kurouzu-cho",
    "Descendre dans l'ancienne cite, suivre les chemins deformes et atteindre le centre avant l'effondrement cyclique.",
    "Descend into the ancient city, follow distorted paths and reach the center before the cyclical collapse.",
    "La spirale est une force architecturale et cyclique, pas une gueule geante a tuer.",
    "The spiral is an architectural cyclical force, not a giant maw to kill.",
    ["https://www.viz.com/uzumaki"],
    "Black-and-white pixel-art underground spiral city, twisted row houses, absorbed silhouettes, wind and collapse layers; no giant mouth.",
  ));
}
