// Les Inconnus — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('microphone', 'Stand-Up Mic Check', 'Satirical Character Switch', 'Prime-Time Composure', 'Sketch Trio Finale', '#f0c75e'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('cue_cards', 'Deadpan Cue Card', 'Straight-Man Reversal', 'Studio Timing Guard', 'Absurd Sketch Crescendo', '#d8d8d8'));
}

export function createLoreAccurateHeroOverrides3({ loadout }) {
  return (loadout('megaphone', 'Megaphone Punchline', 'Parody Character Charge', 'Stage Jacket Guard', 'Prime-Time Satire Barrage', '#e0a93f'));
}
