// The Simpsons — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("The Simpsons", "simpsons", "https://simpsonswiki.com/wiki/Duff_Brewery", [
    item("Pink Donut", "Donut rose", "Single ring donut with pink frosting and multicolored sprinkles."),
    item("Duff Beer Can", "Canette de biere Duff", "Single red cartoon beer can with white oval shape and no copied brand text or logo."),
    item("Bart's Skateboard", "Skateboard de Bart", "One small red-orange skateboard with yellow wheels and scratched deck."),
    item("Cursed Krusty Doll", "Poupee Krusty maudite", "Single small clown doll with blue hair, green shirt, red nose and sinister wind-up switch."),
  ]));
}
