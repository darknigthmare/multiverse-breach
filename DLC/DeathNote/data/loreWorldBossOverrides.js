// Death Note — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "Death Note",
    "death-note-kira-judgment-loop",
    "nonCombatFinal",
    "Death Note manga/anime - Yellow Box Warehouse",
    "Comparer les carnets et les preuves, interrompre l'ecriture de Mikami puis demasquer Light comme Kira.",
    "Compare notebooks and evidence, stop Mikami from writing, then expose Light as Kira.",
    "Le climax est une deduction et une revelation; une boucle Kira combattable trahirait la scene.",
    "The climax is deduction and exposure; a fightable Kira loop would betray the scene.",
    ["https://deathnote.fandom.com/wiki/Yellow_Box_Warehouse"],
    "Yellow Box Warehouse with Light, Near, Mikami and both teams as positional silhouettes, notebooks, watch and evidence props.",
  ));
}
