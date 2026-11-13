// Rick & Morty — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Feral Cronenberg Monster', hp: 100, atk: 12, spd: 5, color: '#d98880', weapon: 'bite' },
      { name: 'Gromflamite Galactic Soldier', hp: 80, atk: 10, spd: 5, color: '#2e4053', weapon: 'gun' },
      { name: 'Gazorpian Female Warrior', hp: 85, atk: 11, spd: 6, color: '#a569bd', weapon: 'fists' }
    ],
    bosses: [
      { name: 'Evil Morty Commander', hp: 500, atk: 19, spd: 7, color: '#1f618d', weapon: 'laser', special: 'Cybernetic Override Ray' },
      { name: 'Tammy Galactic Agent', hp: 480, atk: 18, spd: 6, color: '#7d6608', weapon: 'gun', special: 'Overwatch Droid Support' }
    ],
    worldBoss: { name: 'Federal Prison AI Core', hp: 1300, atk: 30, spd: 4, color: '#1b2631', weapon: 'laser', special: 'Portal Ring Beam Sweep' }
  });
}
