// Zero Escape: The Nonary Games — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "Zero Escape: The Nonary Games",
    "zero-escape-the-nonary-games-zero-time-door-protocol",
    "nonCombatFinal",
    "Zero Escape - Zero Time Dilemma Decision Game",
    "Assembler les fragments temporels, resoudre les mots de passe et prendre les decisions qui ouvrent la route de sortie.",
    "Assemble timeline fragments, solve the passwords and make the decisions that open the escape route.",
    "Un protocole de porte n'est pas un combattant; la revelation de Zero II doit rester sous spoiler lock.",
    "A door protocol is not a combatant; Zero II's identity must remain spoiler-locked.",
    ["https://zeroescape.fandom.com/wiki/Zero_II"],
    "Decision Game shelter with wards, X-doors, bracelets and timeline fragments; Delta remains silhouette-only until the resolution state.",
  ));
}
