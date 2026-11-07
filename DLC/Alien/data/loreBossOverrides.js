// Alien — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Ash - Revealed Android',
      weapon: 'inhuman_strength_and_magazine',
      special: 'Synthetic Reveal',
      phases: ['Uses restrained human-form grapples and the documented magazine suffocation attempt', 'Torn neck reveals white synthetic fluid and internal cables'],
      lore: {
        fr: 'Ash remplace l equipe de recuperation Weyland-Yutani abstraite.',
        en: 'Ash replaces the abstract Weyland-Yutani retrieval team.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/alien',
      visualAnchor: 'Exact Ian Holm likeness, Nostromo science-officer uniform, rolled magazine and source-accurate torn android neck with white fluid.'
    }
  ]);
}

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: {
      'Alien Queen': 'universe:Aliens',
      'Xenomorph Praetorian': 'universe:Alien vs Predator'
    },
    fr: 'La reine et le Praetorian n appartiennent pas au roster local du film Alien 1979.',
    en: 'The Queen and Praetorian do not belong in the local Alien 1979 roster.'
  }));
}
