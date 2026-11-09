// La Casa de Papel — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("La Casa de Papel", "casa_papel", "https://casa-de-papel.hypnoweb.net/la-casa-de-papel/les-dossiers-du-professeur/les-objets/masques.271.74/", [
    item("Dali Mask", "Masque de Dali", "Single pale theatrical mask with arched brows, curled moustache and black elastic strap."),
    item("Folded Red Jumpsuit", "Combinaison rouge pliee", "One neatly folded red hooded jumpsuit with front zipper and no wearer."),
    item("Professor's Origami", "Origami du Professeur", "Single small paper bird folded from cream paper, no writing."),
    item("Gold Bar", "Lingot d or", "One heavy rectangular gold bar with worn edges and no stamped serial or text."),
  ]));
}
