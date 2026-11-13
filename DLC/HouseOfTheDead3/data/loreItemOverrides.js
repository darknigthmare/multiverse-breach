// House of the Dead 3 — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("House of the Dead 3", "house_of_the_dead_3", "https://www.gamesdatabase.org/Media/SYSTEM/Arcade//Manual/formated/The_House_of_the_Dead_III_-_2002_-_Sega.pdf", [
    item("Modified Short SPAS-12", "SPAS-12 court modifie", "Single source-accurate modified short SPAS-12: no shoulder stock, very short dark barrel, perforated heat shield, chunky pump and integrated fore-end light, shown as one complete weapon."),
    item("Medical Kit", "Trousse medicale", "Single compact EFI field medical kit with a scuffed off-white shell, red emergency panels, black latch and no readable text."),
    item("12-Gauge Shotgun Shell", "Cartouche de calibre 12", "Single upright red 12-gauge shotgun shell with a ribbed plastic hull, bright brass base and no loose pellets, box or duplicate shell."),
    item("Crystal Coin", "Piece de cristal", "Single large translucent cyan-blue crystal bonus medallion with a thick faceted rim, frosted luminous core and no number, lettering or copied symbol."),
  ]));
}
