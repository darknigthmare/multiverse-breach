// Dandadan — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('jiji_dandadan', 'Jiji', 'slayer', '#b23a48', 'curse', 'Athletic Straight', 'Evil Eye Aura Kick', 'Cursed House Brace', 'Evil Eye Ground Break'),
    hero('seiko_dandadan', 'Seiko Ayase', 'tactical', '#d9d9e5', 'bat', 'Spirit Medium Bat Swing', 'Localized Barrier Seal', 'Ward Boundary', 'Turbo Granny Exorcism'),
    hero('turbo_granny_cat', 'Turbo Granny - Maneki-neko', 'horror', '#f4f1df', 'claws', 'Lucky Cat Claw', 'One Hundred Kilometre Dash', 'Maneki-neko Vessel Guard', 'Turbo Granny Spiritual Scream')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('psychic', 'Psychokinetic Aura Hand', 'Telekinetic Grip Throw', 'Psychic Hand Barrier', 'Moe Moe Tri-Beam', '#63e6d5'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('curse', 'Turbo Granny Dash', 'All-Out Headbutt', 'Cursed Speed Guard', 'One Hundred Kilometres Per Hour', '#d84a42'));
}

export function createLoreAccurateHeroOverrides3({ loadout }) {
  return (loadout('silky', 'Acrobatic Silky Kick', 'Crimson Hair Lash', 'Silky Spiral Guard', 'Acrobatic Silky Waltz', '#ef4770'));
}
