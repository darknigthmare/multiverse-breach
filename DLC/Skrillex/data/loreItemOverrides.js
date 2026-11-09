// Skrillex — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Skrillex", "skrillex", "https://wmg.jp/skrillex/news/60025/", [
    item("Mothership Stage Panel", "Panneau Mothership", "Single angular black LED stage panel emitting original red-white geometric light patterns."),
    item("Studio Headphones", "Casque audio", "One black over-ear studio headset with asymmetric side shave-inspired color accent."),
    item("MIDI Controller", "Controleur MIDI", "One compact black MIDI pad controller with colored square pads and unlabeled knobs."),
    item("Tour Pass", "Pass de tournee", "Single laminated black-red tour pass with abstract spaceship silhouette and no readable text."),
  ]));
}
