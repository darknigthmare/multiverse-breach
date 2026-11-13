// Buckethead — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroOverrides() {
  return ({
    weaponType: 'guitar',
    weaponColor: '#f5f5f5',
    simple: { name: 'Silent Shred Line', type: 'sound', dmg: 1.05 },
    secondary: { name: 'Bucketheadland Maze Riff', type: 'hack', cd: 6, dmg: 1.6 },
    defense: { name: 'White Mask Stillness', type: 'dodge', dur: 2.0, reduce: 0.82 },
    special: { name: 'Soothsayer Resonance Gate', type: 'music_aoe', dmg: 4.8, color: '#f5f5f5' }
  });
}

export function createHeroOverrides2() {
  return ({
    weaponType: 'drone',
    weaponColor: '#1a1a1a',
    simple: { name: 'Dark Ambient Pulse', type: 'darkness', dmg: 0.95 },
    secondary: { name: 'Death Cube Slow Room', type: 'fear', cd: 7, dmg: 1.45 },
    defense: { name: 'Drone Corridor Veil', type: 'shield', dur: 2.2, reduce: 0.8 },
    special: { name: 'Inverted Mask Lament', type: 'dark_aoe', dmg: 4.3, color: '#9d9d9d' }
  });
}

export function createHeroOverrides3() {
  return ({
    weaponType: 'guitar',
    weaponColor: '#d9d9d9',
    simple: { name: 'Pike Pick Slash', type: 'melee', dmg: 1.1 },
    secondary: { name: 'Motif Shift Solo', type: 'sound', cd: 6, dmg: 1.75 },
    defense: { name: 'Riff Route Step', type: 'dodge', dur: 1.8, reduce: 0.76 },
    special: { name: 'Pike Archive Cascade', type: 'music_aoe', dmg: 4.55, color: '#f5f5f5' }
  });
}
