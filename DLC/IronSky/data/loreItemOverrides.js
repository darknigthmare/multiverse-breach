// Iron Sky — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Iron Sky", "iron_sky", "https://en.wikipedia.org/wiki/Iron_Sky", [
    item("Command Smartphone", "Smartphone de commande", "Single black early touchscreen smartphone displaying abstract blue control shapes without text."),
    item("Moon Helmet", "Casque lunaire", "One retro white lunar helmet with black visor, ribbed hose port and no insignia."),
    item("Flying Saucer Key", "Cle de soucoupe", "Single silver disc-shaped vehicle key with tiny radial fins and blue center light."),
    item("Gotterdammerung Control Unit", "Unite de controle du Gotterdammerung", "One bulky retro-futurist control box with metal toggles, red lamps and no readable labels."),
  ]));
}
