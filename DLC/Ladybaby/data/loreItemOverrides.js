// Ladybaby — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Ladybaby", "ladybaby", "https://www.ttmnet.co.jp/artists/ladybaby/", [
    item("Metal Microphone", "Microphone metal", "Single black-silver concert microphone wrapped by a small red chain detail."),
    item("Maid Bow", "Noeud de maid", "One black-white frilled maid bow with lace edges and red center gem."),
    item("Mini Stage Axe", "Mini hache de scene", "Single miniature foam stage axe with silver-black head and red ribbon."),
    item("Concert Pass", "Pass de concert", "One laminated red-black concert pass with abstract shapes and no readable text."),
  ]));
}
