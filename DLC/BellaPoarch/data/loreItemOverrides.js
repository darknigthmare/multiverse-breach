// Bella Poarch — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Bella Poarch", "bella_poarch", "https://en.wikipedia.org/wiki/Build_a_Bitch", [
    item("Doll Key", "Cle de poupee", "Single oversized brass wind-up doll key with heart-shaped loops and worn factory finish."),
    item("Stitched Heart", "Coeur recousu", "One small fabric heart with black stitches, red-pink panels and no text."),
    item("Horn Headband", "Serre-tete a cornes", "Single black headband with two small curved red-black fantasy horns."),
    item("Combat Boot", "Botte de combat", "One black lace-up combat boot with thick sole, silver eyelets and pink accent."),
  ]));
}
