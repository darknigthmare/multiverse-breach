// La Cite de la Peur — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("La Cite de la Peur", "cite_peur", "https://fr.wikipedia.org/wiki/La_Cit%C3%A9_de_la_peur_%28film%2C_1994%29", [
    item("Red Is Dead Sickle", "Faucille de Red Is Dead", "Single theatrical curved sickle with dark handle, polished blade and slasher-film wear."),
    item("Hammer", "Marteau", "One ordinary claw hammer with steel head and worn wooden handle."),
    item("Cannes Festival Badge", "Badge du Festival de Cannes", "Single laminated festival access badge with color blocks and no copied logo or readable text."),
    item("Film Reel", "Bobine du film", "One metal 35mm film reel with dark celluloid wound around it and a loose short tail."),
  ]));
}
