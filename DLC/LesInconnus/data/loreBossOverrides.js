// Les Inconnus — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy, fallbackName }) {
  return (definePolicy({
    removeSlots: [fallbackName('Les Inconnus', 'CA')],
    convertTo: { [fallbackName('Les Inconnus', 'EG')]: 'comedyChallenge:lockedSketch' },
    fr: 'Les sketches n ont pas d antagoniste transversal; le sketch doit etre choisi avant toute entite.',
    en: 'The sketches have no shared antagonist; a specific sketch must be selected before creating an entity.'
  }));
}
