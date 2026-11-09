// Psycho-Pass — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "Psycho-Pass",
    "psycho-pass-sibyl-system-collective",
    "nonCombatFinal",
    "Psycho-Pass season 1 - Sibyl System judgement",
    "Scanner les coefficients, atteindre la chambre de Sibyl et choisir de reveler, rejeter ou proteger le systeme.",
    "Scan coefficients, reach Sibyl's chamber and choose whether to expose, reject or protect the system.",
    "Sibyl est un collectif et un dilemme politique, pas un robot final.",
    "Sibyl is a collective and a political dilemma, not a final robot.",
    ["https://en.wikipedia.org/wiki/Psycho-Pass"],
    "Nona Tower brain chamber, Dominator, scan cones and judgement portraits; no invented Sibyl mech.",
  ));
}
