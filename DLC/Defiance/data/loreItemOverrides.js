// Defiance — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Defiance", "defiance", "https://www.imfdb.org/wiki/Defiance_-_Season_1", [
    item("Nolan's Pistol", "Pistolet de Nolan", "Single rugged hybrid human-alien pistol with dark frame, silver barrel and worn leather grip."),
    item("Ark-tech Device", "Appareil Ark-tech", "One compact alien mechanism with layered metal petals and cyan energy core."),
    item("E-Rep Badge", "Badge E-Rep", "Single angular metal authority badge with blue inset and no readable lettering."),
    item("Charge Blade", "Lame de charge", "One short alien energy blade emitter with metallic handle and bright blue edge."),
  ]));
}
