// Cloverfield — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Cloverfield", "cloverfield", "https://cloverfield.fandom.com/wiki/Production_Notes", [
    item("Hud's Camcorder", "Camescope de Hud", "Single handheld consumer camcorder with flip-out screen, tape bay and scratched black casing."),
    item("Memory Card", "Carte memoire", "One small black flash memory card with gold contacts and no printed brand or capacity."),
    item("Rob and Beth Photo", "Photo de Rob et Beth", "Single slightly bent instant photograph showing two indistinct silhouettes, no copied faces or text."),
    item("Evacuation Badge", "Badge d evacuation", "One laminated emergency evacuation pass with colored stripe and abstract icon, no readable text."),
  ]));
}
