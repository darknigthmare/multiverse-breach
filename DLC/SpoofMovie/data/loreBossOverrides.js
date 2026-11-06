// Spoof Movie — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy, fallbackName }) {
  return (definePolicy({
    removeSlots: [fallbackName('Spoof Movie', 'CA')],
    convertTo: { [fallbackName('Spoof Movie', 'EG')]: 'movieSetPiece:dontBeAMenace1996' },
    fr: 'Le titre francais est rattache a Don t Be a Menace (1996) : la finale reste un set piece comique avec Cure-dents, sans faux boss transversal.',
    en: 'The French title is locked to Don t Be a Menace (1996): the finale remains a comic set piece with Toothpick, not an invented cross-film boss.'
  }));
}
