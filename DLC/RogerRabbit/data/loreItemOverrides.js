// Roger Rabbit — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Roger Rabbit", "roger_rabbit", "https://rogerrabbit.fandom.com/wiki/Portable_Hole", [
    item("Dip Canister", "Bidon de Trempette", "Single yellow-black industrial solvent canister with hazard color blocks but no readable text."),
    item("Portable Hole", "Trou portable", "One rolled black flexible disc partly unfurled, perfectly dark center and thin grey rim."),
    item("Acme Will", "Testament Acme", "Single sealed legal parchment with red wax seal and no readable document text."),
    item("Gag Mallet", "Maillet gag", "One oversized cartoon wooden mallet with striped handle and brightly painted head."),
  ]));
}
