// Steins;Gate — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "Steins;Gate",
    "steins-gate-sern-attractor-field",
    "nonCombatFinal",
    "Steins;Gate visual novel/anime - Rounder raid and world-line resolution",
    "Infiltrer le laboratoire, recuperer l'IBN 5100 et annuler les D-mails dans l'ordre avant le choix de ligne d'univers.",
    "Infiltrate the laboratory, recover the IBN 5100 and undo the D-mails in order before the world-line choice.",
    "Un champ d'attraction est un principe narratif, pas un ennemi physique.",
    "An attractor field is a narrative principle, not a physical enemy.",
    ["https://steins-gate.fandom.com/wiki/Rounders"],
    "Future Gadget Lab, PhoneWave, IBN 5100, Moeka and Rounders as separate actors, with world-line and phone effects on separate layers.",
  ));
}
