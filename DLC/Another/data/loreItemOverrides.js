// Another — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Another", "another", "https://another.fandom.com/wiki/Mei_Misaki/Image_Gallery", [
    item("Mei's Eyepatch", "Cache-oeil de Mei", "Single plain white medical eyepatch with thin straps and subtle fabric folds."),
    item("Blue Doll", "Poupee bleue", "One delicate blue-eyed ball-jointed doll in dark blue gothic dress and bonnet."),
    item("Class 3 Roster", "Registre de la classe 3", "Single closed school roster notebook with worn grey cover and no readable writing."),
    item("Umbrella", "Parapluie", "One folded clear school umbrella with pointed metal tip and pale curved handle."),
  ]));
}
