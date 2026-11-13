// Minions — definitions consumed by src/game/smashAbilityProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonSmashAbilityProfiles({ contact, ranged }) {
  return (Object.freeze({ simple: contact, secondary: ranged, special: contact }));
}

export function createCanonSmashAbilityProfiles2({ contact, ranged }) {
  return (Object.freeze({ simple: contact, secondary: ranged, special: contact }));
}

export function createCanonSmashAbilityProfiles3({ contact, ranged }) {
  return (Object.freeze({
    simple: contact,
    secondary: ranged,
    special: Object.freeze({ delivery: 'ranged', shape: 'area', range: 160, verticalRange: 100, directional: false })
  }));
}
