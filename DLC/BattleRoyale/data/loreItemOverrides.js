// Battle Royale — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Battle Royale", "battle_royale", "https://www.rottentomatoes.com/m/battle_royale", [
    item("Explosive Collar", "Collier explosif", "Single thick steel student collar with segmented plates, small red indicator and locking clasp."),
    item("Island Map", "Carte de l ile", "One folded paper island map showing a grid and coastline but no readable labels."),
    item("Survival Bag", "Sac de survie", "One olive school-issue canvas backpack with buckles, rolled blanket and no printed number."),
    item("Assigned Weapon Card", "Carte d arme assignee", "Single plain issue card with abstract weapon silhouette and color code, no readable text."),
  ]));
}
