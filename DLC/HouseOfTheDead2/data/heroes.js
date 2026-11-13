// House of the Dead 2 — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroOverrides() {
  return ({
    weaponType: 'gun',
    weaponColor: '#282c31',
    simple: { name: 'AMS Critical Shot', type: 'bullet', dmg: 1.08 },
    secondary: { name: 'Venice Rescue Route', type: 'tactical', cd: 6, dmg: 1.72 },
    defense: { name: 'Civilian Cover Step', type: 'dodge', dur: 1.9, reduce: 0.84 },
    special: { name: 'Emperor Core Volley', type: 'bullet_aoe', dmg: 4.7, color: '#ff9d4a' }
  });
}

export function createHeroOverrides2() {
  return ({
    weaponType: 'gun',
    weaponColor: '#30363c',
    simple: { name: 'AMS Handgun Burst', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Canal Rescue Cover', type: 'projectile', cd: 6, dmg: 1.7 },
    defense: { name: 'Partner Guard', type: 'shield', dur: 2.1, reduce: 0.82 },
    special: { name: 'Goldman Tower Sweep', type: 'bullet_aoe', dmg: 4.45, color: '#ffc06d' }
  });
}

export function createHeroOverrides3() {
  return ({
    weaponType: 'gun',
    weaponColor: '#33383d',
    simple: { name: 'AMS Support Shot', type: 'bullet', dmg: 0.96 },
    secondary: { name: 'Civilian Evacuation Mark', type: 'tactical', cd: 7, dmg: 1.42 },
    defense: { name: 'AMS Rescue Medkit', type: 'heal', dur: 2.4, reduce: 0.82 },
    special: { name: 'Venice Agent Crossfire', type: 'bullet_aoe', dmg: 4.2, color: '#dc7a27' }
  });
}
