// Blackpink — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Blackpink", "blackpink", "https://shop.blackpinkmusic.com/pages/blackpink-official-light-stick-user-guide", [
    item("Pink Hammer Lightstick", "Lightstick marteau rose", "Single pink-black concert lightstick shaped like a double-headed toy hammer, no copied logo."),
    item("Geomungo", "Geomungo", "One traditional Korean zither with dark polished wood, six strings and decorative bridge."),
    item("Stage Microphone", "Microphone de scene", "One pink metallic handheld concert microphone with black grille and no branding."),
    item("Crown Hairpin", "Epingle couronne", "Single small gold crown-shaped hairpin set with pink stones and no lettering."),
  ]));
}
