// Queen Bee — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Queen Bee", "queen_bee", "https://ziyoou-vachi.com/about/index_e.html", [
    item("Honeycomb Microphone", "Microphone nid d abeille", "Single gold-black stage microphone with hexagonal honeycomb grille and no logo."),
    item("Avu-chan Fan", "Eventail d Avu-chan", "One folding black-red performance fan with iridescent feather pattern and no text."),
    item("Glam Glove", "Gant glam", "Single long black sequined glove with gold claw-like fingertip ornaments."),
    item("Album Mask", "Masque d album", "One original theatrical half-mask with black-gold insect geometry and no copied cover art."),
  ]));
}
