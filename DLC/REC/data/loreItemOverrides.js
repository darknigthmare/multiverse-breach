// REC — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("REC", "rec", "https://www.sonypictures.com/movies/rec", [
    item("Pablo's Camera", "Camera de Pablo", "Single shoulder-mounted broadcast video camera with top microphone and scratched black casing."),
    item("Firefighter Axe", "Hache de pompier", "One red-headed firefighter axe with wooden handle and worn rescue grip."),
    item("Rosary", "Rosaire", "Single dark wooden rosary coiled around one small metal cross."),
    item("Attic Key", "Cle du grenier", "One old brass apartment key with oval bow, chipped teeth and a small cloth tag without text."),
  ]));
}
