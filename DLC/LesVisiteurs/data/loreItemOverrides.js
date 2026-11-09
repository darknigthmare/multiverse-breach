// Les Visiteurs — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Les Visiteurs", "les_visiteurs", "https://fr.wikipedia.org/wiki/Les_Visiteurs_%28film%2C_1993%29", [
    item("Time Potion Vial", "Fiole de potion temporelle", "Single medieval glass vial of murky green potion sealed with wax and rough twine."),
    item("Godefroy's Sword", "Epee de Godefroy", "One broad medieval knight sword with straight crossguard, leather grip and worn steel."),
    item("Godefroy's Signet Ring", "Chevaliere de Godefroy", "Single heavy gold medieval signet ring with a heraldic face and no readable inscription."),
    item("Time Grimoire", "Grimoire du temps", "One small weathered medieval grimoire with iron clasps, leather cover and occult diagrams without text."),
  ]));
}
