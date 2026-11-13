// Heavy Metal 2000 — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Heavy Metal 2000", "heavy_metal_2000", "https://en.wikipedia.org/wiki/Heavy_Metal_2000", [
    item("Julie's Sword", "Epee de Julie", "Single broad futuristic sword with dark steel blade, red grip and battle-worn edge."),
    item("Fountain Key Crystal", "Cristal-cle de la fontaine", "One faceted blue-white alien key crystal in a small dark metal mount."),
    item("FAKK2 Talisman", "Talisman FAKK2", "Single metallic protective talisman with angular alien shape and central red gem, no text."),
    item("Odin's Weapon", "Arme d Odin", "One heavy alien energy pistol with ribbed black body and luminous blue barrel chamber."),
  ]));
}
