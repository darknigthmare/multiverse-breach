// Baby Cart — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Baby Cart", "baby_cart", "https://en.wikipedia.org/wiki/Lone_Wolf_and_Cub%3A_White_Heaven_in_Hell", [
    item("Daigoro's Cart", "Chariot de Daigoro", "Single wooden Edo-period baby cart with high wicker hood, iron-rim wheels and concealed panels."),
    item("Dotanuki Sword", "Sabre dotanuki", "One sturdy Japanese dotanuki sword in dark scabbard with practical wrapped hilt."),
    item("Hidden Cart Machine Gun", "Mitrailleuse dissimulee du chariot", "Single compact period-stylized multi-barrel gun module folded out from a wooden cart panel."),
    item("Daigoro's Drum", "Petit tambour de Daigoro", "One small hand drum with tan hide heads, dark wooden body and short strap."),
  ]));
}
