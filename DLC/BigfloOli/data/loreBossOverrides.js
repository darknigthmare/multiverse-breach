// Bigflo & Oli — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy, fallbackName }) {
  return (definePolicy({
    removeSlots: [fallbackName('Bigflo & Oli', 'CA')],
    convertTo: { [fallbackName('Bigflo & Oli', 'EG')]: 'rhythmChallenge:rapBattle' },
    fr: 'La confrontation est une battle musicale sans transformer les artistes en ennemis.',
    en: 'The confrontation is a music battle without turning the artists into enemies.'
  }));
}
