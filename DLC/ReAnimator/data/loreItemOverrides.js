// Re-Animator — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Re-Animator", "re_animator", "https://www.re-animatorfilms.com/Re-Animator.html", [
    item("Green Reagent Syringe", "Seringue de reactif vert", "Single large medical syringe filled with luminous green reagent, steel needle and black plunger."),
    item("Severed-head Tray", "Plateau pour tete sectionnee", "One empty stainless surgical tray with raised rim, straps and green reagent stains."),
    item("Miskatonic ID Badge", "Badge de Miskatonic", "Single clipped hospital identity badge with green stripe and no copied logo or readable name."),
    item("Medical Bag", "Sac medical", "One worn black leather doctor's bag with brass clasp and green vial holder visible inside."),
  ]));
}
