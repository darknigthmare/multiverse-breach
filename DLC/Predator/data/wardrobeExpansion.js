// Predator — definitions consumed by src/game/wardrobeExpansion.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureDesignExtension({ design }) {
  return (design('Predator','predator','ceremony','Rituel de Convergence','Convergence ritual','Lanières originales et plaques patinées sur armure existante ; masque, crâne et dreadlocks de Jungle Hunter conservés, aucune confusion avec City Hunter.','Original straps and weathered panels on existing armor; keep Jungle Hunter’s mask, skull and dreadlocks, no City Hunter substitution.'));
}

export function createSignatureDesignExtension2({ design }) {
  return (design('Predator','city_hunter','urban','Traqueur des toits Nexus','Nexus rooftop stalker','Finitions urbaines sur les pièces déjà portées, marquage de clan inventé identifié Nexus ; conserver masque, peau et proportions de City Hunter.','Urban finish on already-worn parts, an invented clan marking labelled Nexus; preserve City Hunter’s mask, skin and proportions.'));
}
