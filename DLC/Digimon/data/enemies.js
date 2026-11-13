// Digimon — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Vicious Gazimon Scout', hp: 80, atk: 9, spd: 6, color: '#7d3c98', weapon: 'claws' },
      { name: 'Goblimon Club Swinger', hp: 85, atk: 10, spd: 5, color: '#1e8449', weapon: 'club' },
      { name: 'Bakemon Floating Ghost', hp: 70, atk: 11, spd: 6, color: '#ececec', weapon: 'touch' }
    ],
    bosses: [
      { name: 'Devimon Dark Agent', hp: 580, atk: 21, spd: 6, color: '#17202a', weapon: 'claws', special: 'Death Claw Heart Grab' },
      { name: 'Myotismon Vampire Lord', hp: 620, atk: 23, spd: 6, color: '#78281f', weapon: 'darkness', special: 'Grisly Wing Bat Swarm' }
    ],
    worldBoss: { name: 'Apocalymon Void Core', hp: 1480, atk: 36, spd: 3, color: '#03010c', weapon: 'claws', special: 'Darkness Zone Obliteration' }
  });
}
