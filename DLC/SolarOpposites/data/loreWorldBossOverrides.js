// Solar Opposites — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "Solar Opposites",
    null,
    "stageSetpiece",
    "Solar Opposites - Pupa terraformation premise",
    "Stabiliser la Pupa, limiter la transformation du quartier et evacuer les civils avant la terraformation.",
    "Stabilize the Pupa, limit the neighborhood transformation and evacuate civilians before terraforming.",
    "La Pupa n'est pas un antagoniste classique et aucun world boss runtime n'existait lors de l'audit.",
    "The Pupa is not a conventional antagonist, and no runtime world boss existed at audit time.",
    ["https://www.hulu.com/series/solar-opposites-f089664b-1a87-433b-86a5-24e7da5a246a"],
    "Shlorpian suburban house, source-locked Pupa states, alien gadgets and neighborhood terraformation masks; no evil Pupa form.",
  ));
}
