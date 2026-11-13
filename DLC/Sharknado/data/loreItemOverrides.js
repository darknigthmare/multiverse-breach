// Sharknado — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Sharknado", "sharknado", "https://www.rottentomatoes.com/m/sharknado", [
    item("Chainsaw", "Tronconneuse", "Single orange chainsaw with long silver bar, black grip and storm-splashed finish."),
    item("Surfboard", "Planche de surf", "One bright surfboard with shark-bite notch and abstract stripes without logo."),
    item("Explosive Cylinder", "Bouteille explosive", "Single red compressed-gas cylinder with valve cage and no readable warning text."),
    item("Shark Tooth", "Dent de requin", "One large triangular white shark tooth with serrated edge and weathered root."),
  ]));
}
