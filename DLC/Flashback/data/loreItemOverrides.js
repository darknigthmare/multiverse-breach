// Flashback — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Flashback", "flashback", "https://www.world-of-nintendo.com/manuals/super_nes/flashback.shtml", [
    item("Holocube", "Holocube", "Small black angular memory cube projecting a cyan holographic face above one corner."),
    item("Shield Cartridge", "Cartouche de bouclier", "Compact dark sci-fi cartridge with cyan energy window and two metal contacts."),
    item("Mechanical Mouse", "Souris mecanique", "Palm-sized grey robotic mouse with jointed legs, red sensor eye and segmented tail."),
    item("Teleport Receiver", "Recepteur de teleportation", "Portable dark receiver unit with cyan screen, antenna and chunky 1990s sci-fi controls."),
  ]));
}
