// Left 4 Dead — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Left 4 Dead", "left_4_dead", "https://developer.valvesoftware.com/wiki/Category:Left_4_Dead_Weapons", [
    item("Auto Shotgun", "Fusil a pompe automatique", "Single Left 4 Dead Auto Shotgun: matte-grey semi-automatic receiver, long black barrel above a tubular magazine, black synthetic pistol grip, collapsible stock, ghost-ring sights and compact under-barrel flashlight."),
    item("First Aid Kit", "Trousse de premiers soins", "Single original-game red rectangular soft medical pouch with black zippers, top carry handle and a white square patch bearing one red medical cross, no shoulder straps or words."),
    item("Pain Pills", "Antidouleurs", "Single original-game white plastic pain-pill bottle with a red screw cap and blank red-white-blue pharmacy label blocks, sealed and shown without loose tablets or readable lettering."),
    item("Rescue Radio", "Radio de sauvetage", "Single weathered finale rescue radio: olive-drab rectangular field transceiver with black speaker grille, short antenna, cream control knobs, red transmit lamp and one connected handset resting in its cradle."),
  ]));
}
