// Korn — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Korn", "korn", "https://www.hrgiger.com/music/korn.htm", [
    item("Biomechanical Microphone Stand", "Pied de micro biomecanique", "Single sculptural dark-metal microphone stand with ribbed vertebral forms and no copied logo."),
    item("Bagpipes", "Cornemuse", "One complete dark tartan bagpipe instrument with black drones and silver fittings."),
    item("Seven-string Guitar", "Guitare sept cordes", "Single dark seven-string electric guitar with low-slung body and no copied brand."),
    item("Follow the Leader Doll", "Poupee Follow the Leader", "One small vintage school-uniform doll with shadowed face, original pose and no copied cover art."),
  ]));
}
