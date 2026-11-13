// RRRrrrr!!! — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('club', 'Clean-Hair Club Swing', 'First-Crime Investigation', 'Shampoo Bowl Guard', 'Tribe Chief Command', '#c99552'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('bone_knife', 'Dirty-Hair Bone Feint', 'Undercover Tribe Dash', 'Mud Camouflage', 'Shampoo Spy Ambush', '#8b4b2f'));
}

export function createLoreAccurateHeroOverrides3({ loadout }) {
  return (loadout('club', 'Dirty-Hair Club Smash', 'Belly Charge', 'Mud Clod Guard', 'Tonton Tribe Stomp', '#7b3c27'));
}
