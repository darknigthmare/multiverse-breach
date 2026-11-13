// Billie Eilish — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Billie Eilish", "billie_eilish", "https://store.billieeilish.com/shop", [
    item("Blohsh Pendant", "Pendentif Blohsh", "Single silver abstract leaning-figure pendant on a short chain, original geometry and no logo."),
    item("Black Crown", "Couronne noire", "One small dripping black crown prop with uneven points and glossy finish."),
    item("Folded Yellow Raincoat", "Impermeable jaune plie", "One folded oversized yellow raincoat with black snaps and wet vinyl sheen."),
    item("Spider Box", "Boite a araignee", "Single small matte-black display box with one silver spider relief, no text."),
  ]));
}
