// House of 1000 Corpses — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("House of 1000 Corpses", "house_1000_corpses", "https://en.wikipedia.org/wiki/House_of_1000_Corpses", [
    item("Captain Spaulding Mask", "Masque de Captain Spaulding", "Single sinister clown mask with white face, blue eye shapes, red mouth and bald cap."),
    item("Murder Ride Ticket", "Ticket Murder Ride", "One aged carnival admission ticket with faded red-black ornament but no readable text."),
    item("Otis' Revolver", "Revolver d Otis", "One worn long-barrel revolver with dark steel frame and brown grip."),
    item("Dr. Satan Surgical Tool", "Outil chirurgical de Dr. Satan", "Single corroded surgical clamp modified with jagged steel jaws and dirty cloth wrap."),
  ]));
}
