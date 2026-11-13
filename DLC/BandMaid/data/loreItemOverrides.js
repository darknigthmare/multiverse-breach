// Band-Maid — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Band-Maid", "band_maid", "https://bandmaid.tokyo/biography?locale=en", [
    item("Maid Headband", "Serre-tete de maid", "Single black-white frilled maid headband with symmetrical lace and ribbon."),
    item("Zemaitis Guitar", "Guitare Zemaitis", "One engraved metal-top electric guitar with dark body and no copied brand or lettering."),
    item("Bass Guitar", "Guitare basse", "Single dark stage bass guitar with four strings, silver hardware and red accent."),
    item("Drumstick", "Baguette de batterie", "One worn wooden concert drumstick with black grip tape and chipped tip."),
  ]));
}
