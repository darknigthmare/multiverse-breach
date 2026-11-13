// Kyary Pamyu Pamyu — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Kyary Pamyu Pamyu", "kyary", "https://www.vogue.com/article/kyary-pamyu-pamyu-j-pop-beauty-fashion", [
    item("Eye Bow", "Noeud avec oeil", "Single pastel hair bow centered on one surreal blue eye motif, original design and no text."),
    item("Candy Microphone", "Microphone bonbon", "One striped candy-like handheld microphone with pink grille and glossy toy finish."),
    item("Rabbit Doll", "Poupee lapin", "Single pastel stuffed rabbit with mismatched button eyes and surreal fashion details."),
    item("PonPon Bow", "Noeud PonPon", "One oversized multicolor ribbon bow with polka-dot panels and dangling pompons."),
  ]));
}
