// Secret of Monkey Island — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Secret of Monkey Island", "monkey_island", "https://monkeyisland.fandom.com/wiki/Rubber_Chicken_With_A_Pulley_In_The_Middle", [
    item("Rubber Chicken with Pulley", "Poulet en caoutchouc avec poulie", "Single yellow rubber chicken with a small metal pulley mounted through its middle."),
    item("Grog Mug", "Chope de grog", "One dented pirate tankard holding vivid green corrosive grog with faint vapor."),
    item("Voodoo Doll", "Poupee vaudou", "Small stitched cloth pirate doll with one pin and colored thread, no human hand."),
    item("Treasure Map", "Carte au tresor", "Single rolled parchment treasure map partly open, red route marks but no readable words."),
  ]));
}
