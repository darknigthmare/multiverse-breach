// Star Wars — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Stormtrooper Patrol', hp: 80, atk: 8, spd: 5, color: '#f2f4f4', weapon: 'gun' },
      { name: 'Imperial Probe Droid', hp: 70, atk: 11, spd: 6, color: '#7f8c8d', weapon: 'laser' },
      { name: 'Tusken Sand Raider', hp: 90, atk: 10, spd: 5, color: '#cca43b', weapon: 'staff' }
    ],
    bosses: [
      { name: 'Darth Maul Assassin', hp: 580, atk: 22, spd: 8, color: '#c0392b', weapon: 'saber', special: 'Double Saber Spin Sweep' },
      { name: 'Count Dooku Sith Lord', hp: 540, atk: 20, spd: 6, color: '#2b2b2b', weapon: 'saber', special: 'Force Lightning Shock' }
    ],
    worldBoss: { name: 'Darth Vader Sith Master', hp: 1550, atk: 36, spd: 4, color: '#000000', weapon: 'saber', special: 'Force Telekinesis Choke' }
  });
}

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Stormtrooper Squad', hp: 85, atk: 10, spd: 5, color: '#ecf0f1', weapon: 'blaster' },
      { name: 'Droideka Shield Droid', hp: 120, atk: 13, spd: 4, color: '#bd8d46', weapon: 'twin_blaster' },
      { name: 'Inquisitor Hunter', hp: 125, atk: 15, spd: 7, color: '#1c1c1c', weapon: 'red_lightsaber' }
    ],
    bosses: [
      { name: 'Darth Vader Sith Lord', hp: 720, atk: 28, spd: 5, color: '#0a0a0a', weapon: 'force_choke', special: 'Dark Side Corridor Advance' },
      { name: 'Emperor Palpatine', hp: 650, atk: 26, spd: 5, color: '#4a235a', weapon: 'force_lightning', special: 'Unlimited Power' }
    ]
  });
}
