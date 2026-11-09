// Dynamite Duke — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Dynamite Duke", "dynamite_duke", "https://gamefaqs.gamespot.com/sms/575448-dynamite-duke/faqs/73830", [
    item("Cybernetic Arm Plate", "Plaque de bras cybernetique", "Heavy steel cybernetic forearm armor plate with exposed bolts and a red status light."),
    item("Machine Gun", "Mitrailleuse", "Compact late-1980s arcade machine gun with dark receiver, short barrel and folded stock."),
    item("Flash Bomb", "Bombe aveuglante", "Single round military flash bomb with metal casing, safety lever and bright warning band without text."),
    item("Red Ammo Crate", "Caisse de munitions rouge", "Small red metal ammunition crate with reinforced corners, latch and no printed markings."),
  ]));
}
