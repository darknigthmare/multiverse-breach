// Spoof Movie — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Spoof Movie", "spoof_movie", "https://www.imdb.com/title/tt0116126/", [
    item("Loc Dog Warhead Remote", "Telecommande de l ogive de Loc Dog", "Single oversized military remote held beside Loc Dog's absurd yellow-nosed truck warhead, chunky red trigger and no readable labels."),
    item("Grandma's Handbag", "Sac a main de Grand-mere", "Single compact dark handbag carried by Loc Dog's formidable grandmother, sturdy handles and exaggerated comic weight."),
    item("Ashtray's Juice Cup", "Gobelet de jus de Cendar", "Single clear takeaway cup filled with amber juice, white lid and straw, a direct prop conversion of the film's title joke."),
    item("Po'Nopoly Board", "Plateau Po'Nopoly", "Single folded parody board-game set used by Ashtray, Loc Dog, Preach and Crazy Legs, original colored street grid with no copied lettering."),
  ]));
}
