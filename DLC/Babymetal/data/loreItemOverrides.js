// Babymetal — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Babymetal", "babymetal", "https://www.asmart.jp/en/shop/babymetal/product/10027584", [
    item("Fox Mask", "Masque de renard", "Single white kitsune stage mask with red-black painted details and gold bell accents."),
    item("Kitsune Charm", "Charme kitsune", "One small fox-head metal charm on a red cord with black enamel details."),
    item("Red Tutu Bow", "Noeud de tutu rouge", "Single folded red-black stage costume bow with layered tulle and metallic edging."),
    item("Stage Microphone", "Microphone de scene", "One black handheld performance microphone with red ring and no branding."),
  ]));
}
