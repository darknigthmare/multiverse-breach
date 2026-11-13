// Futurama — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Futurama", "futurama", "https://www.theinfosphere.org/Fry_and_the_Slurm_Factory", [
    item("Slurm Can", "Canette de Slurm", "Single bright green sci-fi soda can with abstract swirl shapes and no copied logo or text."),
    item("Planet Express Badge", "Badge Planet Express", "One red-white delivery badge with a simple rocket silhouette and no copied lettering."),
    item("Holophonor", "Holophonor", "Single ornate brass wind instrument with curved bell, keys and small holographic emitter."),
    item("Dark-matter Pellet", "Granule de matiere noire", "One small faceted black-violet fuel pellet with dense purple glow."),
  ]));
}
