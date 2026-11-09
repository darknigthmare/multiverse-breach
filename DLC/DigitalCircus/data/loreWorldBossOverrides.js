// Digital Circus — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "The Amazing Digital Circus",
    "digital-circus-caine-ringmaster-ai",
    "nonCombatFinal",
    "The Amazing Digital Circus - ongoing series, source locked through audit date 2026-07-17",
    "Resoudre une aventure corrompue, eviter les abstracts et stabiliser une sortie pendant que Caine reste l'arbitre.",
    "Resolve a corrupted adventure, avoid abstracts and stabilize an exit while Caine remains the game master.",
    "La serie en cours ne confirme pas Caine comme antagoniste final tuable.",
    "The ongoing series does not establish Caine as a killable final antagonist.",
    ["https://www.glitchprod.com/the-amazing-digital-circus"],
    "Modular digital circus with contradictory doors, Caine and Bubble as non-hostile layered presenters, glitch masks and abstracted hazards.",
  ));
}
