// Evil Dead — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Evil Dead", "evil_dead", "https://www.evildeadthegame.com/en/", [
    item("Necronomicon Ex-Mortis", "Necronomicon Ex-Mortis", "Single flesh-bound ancient book with distorted face relief, stitched seams and iron corner clasps."),
    item("Chainsaw", "Tronconneuse", "One battered red chainsaw with silver guide bar, black top handle and dried cabin grime."),
    item("Boomstick", "Boomstick", "One short double-barrel shotgun with sawn wooden stock and dark blued steel."),
    item("Kandarian Dagger", "Dague kandarienne", "Single bone-handled ritual dagger with jagged asymmetrical blade and carved skull details."),
  ]));
}
