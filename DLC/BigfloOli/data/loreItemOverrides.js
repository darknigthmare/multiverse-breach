// Bigflo & Oli — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Bigflo & Oli", "bigflo_oli", "https://vimeo.com/234312930", [
    item("Toulouse Cap", "Casquette de Toulouse", "Single dark baseball cap with red-white city color blocks and no copied logo or text."),
    item("Rose Festival Wristband", "Bracelet du Rose Festival", "One woven pink concert wristband with abstract pattern and no readable lettering."),
    item("Trumpet", "Trompette", "Single polished brass trumpet with three valves and compact stage reflections."),
    item("Stage Microphone", "Microphone de scene", "One black handheld rap microphone with silver grille and no branding."),
  ]));
}
