// Meet the Feebles — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Meet the Feebles", "feebles", "https://www.nzfilm.co.nz/films/meet-feebles", [
    item("Heidi's Microphone", "Microphone de Heidi", "Single vintage silver stage microphone with rounded grille and pale stand clip."),
    item("Wynyard's Rifle", "Fusil de Wynyard", "One worn military rifle with dark wood stock, steel barrel and stage-backlot grime."),
    item("Backstage Pass", "Pass coulisses", "Single laminated backstage pass with bright border and abstract shapes, no readable text."),
    item("Show Clapperboard", "Clap de spectacle", "One small black-white production clapperboard with blank fields and no lettering."),
  ]));
}
