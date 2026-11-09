// House of the Dead — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroOverrides() {
  return ({
    weaponType: 'gun',
    weaponColor: '#25282b',
    simple: { name: 'AMS Handgun Double Tap', type: 'bullet', dmg: 1.05 },
    secondary: { name: 'Curien Mansion Rescue Shot', type: 'projectile', cd: 6, dmg: 1.8 },
    defense: { name: 'AMS Agent Sidestep', type: 'dodge', dur: 1.9, reduce: 0.84 },
    special: { name: 'Magician Weak-Point Volley', type: 'bullet_aoe', dmg: 4.6, color: '#ff4b3e' }
  });
}

export function createHeroOverrides2() {
  return ({
    weaponType: 'gun',
    weaponColor: '#303338',
    simple: { name: 'AMS Precision Shot', type: 'bullet', dmg: 1.02 },
    secondary: { name: 'G File Weak-Point Read', type: 'tactical', cd: 6, dmg: 1.65 },
    defense: { name: 'Cold Agent Cover', type: 'dodge', dur: 2.0, reduce: 0.84 },
    special: { name: 'DBR Laboratory Crossfire', type: 'bullet_aoe', dmg: 4.45, color: '#ff6e61' }
  });
}

export function createHeroOverrides3() {
  return ({
    weaponType: 'gun',
    weaponColor: '#85898f',
    simple: { name: 'Emergency Sidearm Shot', type: 'bullet', dmg: 0.86 },
    secondary: { name: 'Curien Research Warning', type: 'debuff', cd: 7, dmg: 1.35 },
    defense: { name: 'Laboratory First Aid', type: 'heal', dur: 2.4, reduce: 0.8 },
    special: { name: 'Mansion Survivor Protocol', type: 'support_aoe', dmg: 3.9, color: '#dc281b' }
  });
}
