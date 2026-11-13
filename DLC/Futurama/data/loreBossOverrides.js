// Futurama — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy, fallbackName }) {
  return (definePolicy({
    removeSlots: [fallbackName('Futurama', 'EG'), fallbackName('Futurama', 'CA')],
    fr: 'Roberto Knife Bot et Hypnotoad Broadcast sont deja presents et les fallbacks sont des doublons.',
    en: 'Roberto Knife Bot and Hypnotoad Broadcast already exist, making the fallbacks duplicates.'
  }));
}
