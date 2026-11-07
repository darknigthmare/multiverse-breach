// Moonwalker — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Moonwalker", "moonwalker", "https://www.imfdb.org/wiki/Moonwalker", [
    item("Fedora", "Fedora", "Single black fedora with narrow white band, crisp crown and stage-worn brim."),
    item("Falling Star Token", "Jeton d etoile filante", "One luminous silver star-shaped token with a short blue-white comet trail."),
    item("Pulse Laser Cannon", "Canon laser a impulsion", "Single compact futuristic silver pulse cannon with red emitter and angular grip."),
    item("Lancia Stratos Key", "Cle de Lancia Stratos", "One 1980s car key with black plastic bow, silver blade and no manufacturer logo."),
  ]));
}
