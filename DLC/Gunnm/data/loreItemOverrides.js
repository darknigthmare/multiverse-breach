// Gunnm — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Gunnm", "gunnm", "https://battleangel.fandom.com/wiki/Damascus_Blade", [
    item("Damascus Blade", "Lame Damascus", "Single long curved Damascus steel blade with layered wave pattern and cybernetic grip."),
    item("Motorball", "Motorball", "One heavy steel racing ball with segmented armor plates, recessed bolts and scuff marks."),
    item("Hunter-Warrior Badge", "Badge Hunter-Warrior", "Single worn metal bounty badge with angular cyberpunk insignia and no readable text."),
    item("Gally's Cyborg Heart", "Coeur cybernetique de Gally", "One compact biomechanical heart with red core, silver valves and bundled black cables."),
  ]));
}
