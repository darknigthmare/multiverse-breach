// Neon Genesis Evangelion — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "Neon Genesis Evangelion",
    "neon-genesis-evangelion-lilith-third-impact",
    "stageSetpiece",
    "The End of Evangelion - Third Impact continuity",
    "Survivre aux Evas de production en serie puis traverser la sequence environnementale du Third Impact.",
    "Survive the Mass Production Evas, then navigate the environmental Third Impact sequence.",
    "Lilith et le Third Impact sont un evenement cosmique; les reduire a une unite standard serait faux.",
    "Lilith and Third Impact are a cosmic event; reducing them to a standard unit would be false.",
    ["https://wiki.evageeks.org/Mass_Production_Evangelions"],
    "Separate Mass Production Eva encounter layers followed by red horizon, Rei-Lilith, crosses and Tree-of-Life masks; no walking Lilith sprite.",
  ));
}
