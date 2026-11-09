// House of the Dead 3 — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroOverrides() {
  return ({
    weaponType: 'shotgun',
    weaponColor: '#25282a',
    simple: { name: 'AMS Pump Shotgun Blast', type: 'shotgun', dmg: 1.16 },
    secondary: { name: 'Partner Rescue Shot', type: 'projectile', cd: 6, dmg: 1.9 },
    defense: { name: 'Facility Combat Roll', type: 'dodge', dur: 1.9, reduce: 0.85 },
    special: { name: 'Wheel of Fate Chamber Salvo', type: 'shotgun_aoe', dmg: 4.75, color: '#5dff88' }
  });
}

export function createHeroOverrides2() {
  return ({
    weaponType: 'shotgun',
    weaponColor: '#313438',
    simple: { name: 'Veteran Shotgun Blast', type: 'shotgun', dmg: 1.12 },
    secondary: { name: 'G File Creature Read', type: 'tactical', cd: 6, dmg: 1.7 },
    defense: { name: 'Veteran Cover Step', type: 'dodge', dur: 2.0, reduce: 0.85 },
    special: { name: 'BioReactor Suppression', type: 'shotgun_aoe', dmg: 4.6, color: '#80ffab' }
  });
}

export function createHeroOverrides3() {
  return ({
    weaponType: 'shotgun',
    weaponColor: '#292d31',
    simple: { name: 'Commando Shotgun Blast', type: 'shotgun', dmg: 1.14 },
    secondary: { name: 'EFI Breach Advance', type: 'projectile', cd: 6, dmg: 1.86 },
    defense: { name: 'Rogan Team Cover', type: 'shield', dur: 2.2, reduce: 0.83 },
    special: { name: 'Death Corridor Last Stand', type: 'shotgun_aoe', dmg: 4.68, color: '#38ca66' }
  });
}
