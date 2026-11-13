// Virus — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Virus", "virus_1999", "https://www.imfdb.org/index.php/Virus", [
    item("Ship Keycard", "Carte d acces du navire", "Single scratched ship access card with red magnetic stripe and no readable vessel name."),
    item("Welder", "Poste a souder", "One handheld industrial arc welder with thick cable, metal grip and blue spark at the tip."),
    item("Mechanical Eye Module", "Module d oeil mecanique", "Single red-lensed biomechanical camera eye with steel iris and bundled black wires."),
    item("Nadia's Shotgun", "Fusil de Nadia", "One worn pump-action shotgun with black polymer stock and taped flashlight mount."),
  ]));
}
