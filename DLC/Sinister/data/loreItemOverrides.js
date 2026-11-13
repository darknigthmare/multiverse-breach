// Sinister — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Sinister", "sinister", "https://en.wikipedia.org/wiki/Sinister_%28film%29", [
    item("Super 8 Reel", "Bobine Super 8", "Single small metal Super 8 film reel wound with dark home-movie film."),
    item("Super 8 Projector", "Projecteur Super 8", "One beige vintage film projector with twin reel arms, lens and power cord."),
    item("Bughuul Drawing", "Dessin de Bughuul", "Single child's crayon drawing of a tall dark face-like shape, original composition and no text."),
    item("Film Box", "Boite de film", "One plain white cardboard film box with black stripe and no copied title or writing."),
  ]));
}
