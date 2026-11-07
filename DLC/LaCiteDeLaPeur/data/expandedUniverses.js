// La Cite de la Peur — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLegacyNonCombatTrialNameRoutes() {
  return (['La Cite de la Peur', 'evidence', ['Emile Gravier', 'Jean-Paul Martoni']]);
}

export function createExpandedUniverseRecord() {
  return ({ key: 'cite_peur', universe: 'La Cite de la Peur', mediaType: 'movie', faction: 'horror', mode: 'RPG', difficulty: 'Medium', titleFr: 'La Cite de la Peur', stage: 'Cannes Projection Slasher', boss: 'Odile Deray Premiere Trap', hero: ['odile_deray', 'Odile Deray', 'tactical'], allies: [['simon_jeremi', 'Simon Jeremi', 'hacker'], ['serge_karamazov', 'Serge Karamazov', 'slayer']], theme: 'French comedy thriller, film festival murders, meta-cinema jokes, and chaotic publicity tactics', motif: 'hauntedset', colors: ['#261414', '#040202', '#ff5757'] });
}
