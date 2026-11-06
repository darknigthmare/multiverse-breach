// La Cite de la Peur — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "La Cite de la Peur",
    "la-cite-de-la-peur-odile-deray-premiere-trap",
    "nonCombatFinal",
    "La Cite de la Peur (1994) - Cannes premiere",
    "Proteger Odile, enqueter dans les coulisses puis apprehender le tueur pendant la premiere.",
    "Protect Odile, investigate backstage and apprehend the killer during the premiere.",
    "Odile est un objectif allie et ne doit jamais etre transformee en boss.",
    "Odile is an allied objective and must never be turned into a boss.",
    ["https://fr.wikipedia.org/wiki/La_Cit%C3%A9_de_la_peur"],
    "Cannes red carpet, festival backstage, masked killer and the main trio as separate layers; Odile is always visually allied.",
  ));
}
