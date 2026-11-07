// Atarashii Gakko — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy, fallbackName }) {
  return (definePolicy({
    removeSlots: [fallbackName('Atarashii Gakko', 'CA')],
    fr: 'Un seul avatar de clip precis suffit; le second fallback est retire.',
    en: 'One precise music-video avatar is sufficient; the second fallback is removed.'
  }));
}
