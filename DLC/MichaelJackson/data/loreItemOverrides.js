// Michael Jackson — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Michael Jackson", "michael_jackson", "https://www.si.edu/object/nmaahc_2009.42.2", [
    item("Black Fedora", "Fedora noir", "Single black stage fedora with narrow white band and sharply pinched crown."),
    item("Sequined Glove", "Gant sequine", "Single right-hand white glove laid flat and densely covered with silver sequins."),
    item("Folded Thriller-style Jacket", "Veste style Thriller pliee", "One folded red-black leather stage jacket with angular paneling and no wearer."),
    item("Black Loafers", "Mocassins noirs", "One complete pair of black leather loafers with white socks folded inside."),
  ]));
}
