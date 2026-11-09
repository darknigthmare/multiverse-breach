// Deadmau5 — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Deadmau5", "deadmau5", "https://timeline.deadmau5.com/timeline/mau5head/", [
    item("Mau5head", "Mau5head", "Single large round mouse-eared electronic helmet with LED eyes, original color layout and no logo."),
    item("Cube Stage Panel", "Panneau du Cube", "One detached triangular LED stage panel showing abstract cyan-magenta pixels without text."),
    item("Studio Headphones", "Casque audio", "Single black-red over-ear studio headset with padded band and coiled cable."),
    item("Set USB Drive", "Cle USB de set", "One compact black USB drive with red indicator light and no branding."),
  ]));
}
