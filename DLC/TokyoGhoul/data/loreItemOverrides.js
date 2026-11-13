// Tokyo Ghoul — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Tokyo Ghoul", "tokyo_ghoul", "https://youngjump.jp/tokyoghoul/tg/data/", [
    item("Quinque Case", "Mallette quinque", "Single closed CCG quinque carrying case: rigid dark gunmetal briefcase, reinforced silver corners, thick black handle, compact red release switch and no weapon deployed, insignia, letters or numbers."),
    item("Kaneki's Ghoul Mask", "Masque de goule de Kaneki", "Single empty black leather ghoul mask made for Kaneki: asymmetric right-eye patch, one open left-eye socket, silver zipper mouth and fixed stylized white teeth, no head, face, hair or wearable stand."),
    item("Rc Suppressant Injector", "Injecteur de suppresseur Rc", "Single sealed CCG medical injector containing pale opaque Rc suppressant, clear tubular chamber, dark plunger collar and covered stainless needle, no hand, loose syringe parts, label or readable dosage."),
    item("Anteiku Coffee Cup", "Tasse de cafe Anteiku", "Single small antique ivory ceramic coffee cup filled with plain black coffee, subtly fluted body and dark brown rim, no saucer, spoon, steam shape, sugar, logo or readable decoration."),
  ]));
}
