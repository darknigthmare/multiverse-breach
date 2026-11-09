// Star Wars — definitions consumed by src/game/smashAbilityProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonSmashAbilityProfiles({ ranged }) {
  return (Object.freeze({
    simple: ranged,
    secondary: ranged,
    special: Object.freeze({ ...ranged, shape: 'multi', maxTargets: 3 })
  }));
}

export function createCanonSmashAbilityProfiles2({ contact, ranged }) {
  return (Object.freeze({ simple: contact, secondary: ranged, special: contact }));
}

export function createCanonSmashAbilityProfiles3({ contact, ranged }) {
  return (Object.freeze({
    simple: contact,
    secondary: ranged,
    special: Object.freeze({ ...ranged, knockback: 0 })
  }));
}
