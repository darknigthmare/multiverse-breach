// Scary Movie — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Ghostface Impostor Guy', hp: 65, atk: 8, spd: 6, color: '#2c3e50', weapon: 'knife' },
      { name: 'Comedic Dummy Doll', hp: 70, atk: 9, spd: 5, color: '#cca43b', weapon: 'bite' },
      { name: 'Spoof Movie Alien', hp: 75, atk: 10, spd: 6, color: '#27ae60', weapon: 'spit' }
    ],
    bosses: [
      { name: 'Brenda Meeks Ghost Form', hp: 420, atk: 15, spd: 7, color: '#8e44ad', weapon: 'sound', special: 'Outrageous Scream Wave' },
      { name: 'Bobby Prinze Assassin', hp: 440, atk: 16, spd: 6, color: '#34495e', weapon: 'knife', special: 'Parody Movie Twist Slap' }
    ],
    worldBoss: { name: 'Ghostface Wassup Slasher', hp: 1100, atk: 25, spd: 5, color: '#1c2833', weapon: 'knife', special: 'Wassup Call Confusion Loop' }
  });
}
