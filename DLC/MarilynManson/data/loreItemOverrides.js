// Marilyn Manson — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Marilyn Manson", "marilyn_manson", "https://www.marilynmansoncollection.com/museum", [
    item("Mechanical Animals Prosthetic Arm", "Bras prothetique Mechanical Animals", "Single pale biomechanical prosthetic forearm with segmented fingers and smooth alien joints."),
    item("Stage Podium", "Pupitre de scene", "One compact black metal podium top with industrial bolts and abstract occult ornament."),
    item("Contact Lens Case", "Etui de lentilles", "Single small black contact lens case opened to reveal one pale and one dark lens."),
    item("Prop Knife Microphone", "Microphone-couteau factice", "Single theatrical microphone shaped with a blunt knife-like body, clearly a stage prop and no logo."),
  ]));
}
