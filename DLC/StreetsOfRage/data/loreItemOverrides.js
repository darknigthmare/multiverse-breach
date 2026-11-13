// Streets of Rage — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Streets of Rage", "streets_of_rage", "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/71165/manuals/04%20SOR2_PC_MG_EFIGS_US_v6.pdf?t=1733765070", [
    item("Apple", "Pomme", "Single bright red arcade apple with one green leaf and a strong white pixel highlight."),
    item("Roast Chicken", "Poulet roti", "One whole roast chicken on no plate, golden skin and compact arcade pickup silhouette."),
    item("Steel Pipe", "Tuyau d acier", "Single straight grey steel pipe with scuffed ends and street grime."),
    item("Police Badge", "Badge de police", "Single gold police shield badge with blue inset, no copied seal or readable lettering."),
  ]));
}
