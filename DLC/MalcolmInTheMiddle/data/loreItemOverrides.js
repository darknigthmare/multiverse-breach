// Malcolm in the Middle — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Malcolm in the Middle", "malcolm", "https://malcolminthemiddle.fandom.com/wiki/Rollerskates", [
    item("Krelboyne Textbook", "Manuel des Krelboynes", "Single thick school science textbook with geometric atom shapes and no copied title."),
    item("Hal's Roller Skate", "Patin a roulettes de Hal", "One retro quad roller skate with brown boot, orange wheels and white laces."),
    item("Dewey's Hamster Ball", "Boule de hamster de Dewey", "Single clear plastic hamster exercise ball with circular air slots and blue latch."),
    item("Lois' Clipboard", "Porte-bloc de Lois", "One brown store clipboard holding blank checklist boxes and a red pen."),
  ]));
}
