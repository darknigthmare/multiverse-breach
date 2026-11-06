// Chicken Run — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Chicken Run", "chicken_run", "https://www.netflix.com/tudum/articles/chicken-run-ending-explained", [
    item("Tunnel Spoon", "Cuillere de tunnel", "Single bent metal kitchen spoon with scratched bowl and dirt on the handle."),
    item("Escape Blueprint", "Plan d evasion", "One rolled blue escape blueprint partly open with white schematic lines and no readable labels."),
    item("Fowler's RAF Medal", "Medaille RAF de Fowler", "Single aged brass service medal with striped ribbon and no copied insignia text."),
    item("Crate-plane Propeller", "Helice de l avion-caisse", "One handmade wooden aircraft propeller with bolted hub and uneven carved blades."),
  ]));
}
