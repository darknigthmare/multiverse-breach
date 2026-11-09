// Cthulhu — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Cthulhu", "cthulhu", "https://www.hplovecraft.com/WRITINGS/texts/fiction/cc.aspx", [
    item("Cthulhu Idol", "Idole de Cthulhu", "Single small green-black stone idol of a winged tentacled figure on a squat pedestal."),
    item("R'lyeh Bas-relief", "Bas-relief de R'lyeh", "One broken dark stone tablet carved with impossible city angles and a central tentacled silhouette."),
    item("Johansen Manuscript", "Manuscrit de Johansen", "Single tied bundle of aged handwritten pages with ink lines rendered unreadable."),
    item("Alert Compass", "Boussole affolee", "One antique brass compass with a visibly off-center needle and salt-corroded glass."),
  ]));
}
