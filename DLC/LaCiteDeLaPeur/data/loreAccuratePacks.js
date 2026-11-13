// La Cite de la Peur — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('clipboard', 'Producer Clipboard Strike', 'Publicity Placard Rush', 'Press Line Cover', 'Cannes Premiere Blitz', '#d4b235'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('prop_sickle', 'Red Is Dead Prop Swing', 'Actor Panic Scream', 'Clumsy Stunt Guard', 'Final Take Catastrophe', '#254486'));
}

export function createLoreAccurateHeroOverrides3({ loadout }) {
  return (loadout('security_pistol', 'Security Warning Shot', 'Rolled Newspaper Baton', 'Bodyguard Dive', 'Carioca Counterattack', '#7c7f86'));
}
