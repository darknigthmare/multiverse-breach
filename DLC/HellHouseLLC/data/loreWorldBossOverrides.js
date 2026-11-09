// Hell House LLC — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "Hell House LLC",
    "hell-house-llc-abaddon-clown-entity",
    "nonCombatFinal",
    "Hell House LLC (2015) - Abaddon Hotel",
    "Retrouver les bandes, survivre au rituel du sous-sol et sortir avant que les portes de l'Abaddon se referment.",
    "Recover the tapes, survive the basement ritual and escape before the Abaddon doors close.",
    "Le clown est un mannequin ou une manifestation; il n'existe pas comme entite finale nommee et combattable.",
    "The clown is a mannequin or manifestation; it does not exist as a named fightable final entity.",
    ["https://en.wikipedia.org/wiki/Hell_House_LLC"],
    "Abaddon basement with camera-light states, cultists, Andrew Tully and clown mannequins on separate layers, plus sealed-door states.",
  ));
}
