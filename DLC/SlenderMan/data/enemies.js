// Slender Man — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Mindless Proxy Agent', hp: 75, atk: 9, spd: 6, color: '#34495e', weapon: 'melee' },
      { name: 'Flickering Shadow Ghoul', hp: 65, atk: 11, spd: 7, color: '#17202a', weapon: 'claws' },
      { name: 'Static Ghost Child', hp: 55, atk: 8, spd: 5, color: '#ececec', weapon: 'touch' }
    ],
    bosses: [
      { name: 'Slender Man Stalker', hp: 520, atk: 18, spd: 5, color: '#000000', weapon: 'tendrils', special: 'Static Blur Blindness' },
      { name: 'The Observer Phantom', hp: 440, atk: 15, spd: 6, color: '#2e4053', weapon: 'claws', special: 'Camera Static Flash' }
    ],
    worldBoss: { name: 'Slender Woods Nexus Core', hp: 1150, atk: 26, spd: 4, color: '#1c2833', weapon: 'fear', special: 'Dimensional Static Obliteration' }
  });
}
