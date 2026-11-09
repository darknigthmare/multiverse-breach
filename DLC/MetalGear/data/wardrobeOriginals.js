// Metal Gear — definitions consumed by src/game/wardrobeOriginals.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureDesigns({ p }) {
  return (p('Metal Gear','snake','Infiltration Zéro','Zero infiltration','Combinaison textile mate, coutures graphite, bandes d’identification rabattables ; préserver bandana et identité Solid Snake, jamais l’œil de Big Boss.','Matte textile suit, graphite seams and fold-away ID strips; preserve Solid Snake’s bandana and identity, never Big Boss’s eye patch.'));
}

export function createSignatureDesigns2({ p }) {
  return (p('Metal Gear','big_boss','Commandant des Mondes','Commander of worlds','Veste de commandement originale, sangle d’épaule et insigne Nexus distinct ; préserver les marqueurs de Big Boss sans ajouter les signes de Venom.','Original command jacket, shoulder strap and distinct Nexus badge; retain Big Boss’s markers without adding Venom’s identifiers.'));
}
