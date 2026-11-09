// Ristar — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Ristar", "ristar", "https://segaretro.org/images/0/08/Ristar_Steam_manual.pdf", [
    item("Star Handle", "Poignee etoile", "Single yellow five-point star handle attached to a short blue grip, clean 16-bit silhouette."),
    item("Little Star", "Petite etoile", "Small bright yellow five-point collectible star with a soft white center glow."),
    item("Restore Star", "Etoile de soin", "Larger luminous green-yellow five-point star with a restorative halo."),
    item("Yellow Jewel", "Joyau jaune", "Single faceted golden-yellow gem with chunky 16-bit cuts and bright central shine."),
  ]));
}
