// Predator — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Jungle Predator Scout', hp: 95, atk: 11, spd: 5, color: '#5a544c', weapon: 'wristblade' },
      { name: 'Cloaked Stalker Scout', hp: 80, atk: 13, spd: 6, color: '#688e7a', weapon: 'laser' },
      { name: 'Predator Hound', hp: 70, atk: 12, spd: 7, color: '#4a4239', weapon: 'bite' }
    ],
    bosses: [
      { name: 'City Hunter Predator', hp: 480, atk: 20, spd: 5, color: '#524940', weapon: 'smart_disc', special: 'Smart Disc Throw' },
      { name: 'Berserker Predator', hp: 540, atk: 23, spd: 5, color: '#661b1b', weapon: 'wristblade', special: 'Berserk Rage Slash' }
    ],
    worldBoss: { name: 'Bad Blood Alpha Predator', hp: 1320, atk: 32, spd: 4, color: '#1c1c1c', weapon: 'spear', special: 'Plasma Gauntlet Overload' }
  });
}

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Thermal Decoy Hunter', hp: 92, atk: 12, spd: 7, color: '#6b6f59', weapon: 'cloak_blade' },
      { name: 'Tracker Predator Hound', hp: 85, atk: 13, spd: 8, color: '#4d3d33', weapon: 'jaw' },
      { name: 'Falconer Drone', hp: 75, atk: 11, spd: 8, color: '#667067', weapon: 'aerial_scan' },
      { name: 'Mercenary Trophy Guard', hp: 100, atk: 11, spd: 5, color: '#34495e', weapon: 'rifle' }
    ],
    bosses: [
      { name: 'Elder Predator Trialmaster', hp: 610, atk: 23, spd: 5, color: '#7b6a4d', weapon: 'ceremonial_spear', special: 'Blooded Honor Trial' },
      { name: 'Predalien Trophy Spawn', hp: 650, atk: 25, spd: 5, color: '#2c2a20', weapon: 'acid_wristblades', special: 'Hybrid Hunt Frenzy' }
    ]
  });
}
