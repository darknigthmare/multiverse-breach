// Vocaloid — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Synth Hologram Spawn', hp: 70, atk: 9, spd: 7, color: '#e0007a', weapon: 'sound' },
      { name: 'Note Sprite Dancer', hp: 60, atk: 8, spd: 8, color: '#39c5bb', weapon: 'laser' },
      { name: 'Digital Music Cube', hp: 90, atk: 10, spd: 5, color: '#9b59b6', weapon: 'bash' }
    ],
    bosses: [
      { name: 'Dark Melancholy Diva', hp: 480, atk: 18, spd: 7, color: '#8e44ad', weapon: 'music', special: 'Melancholy Screaming Note' },
      { name: 'Hologram glitch core', hp: 450, atk: 16, spd: 8, color: '#2ecc71', weapon: 'glitch', special: 'Hologram Fragmentation' }
    ],
    worldBoss: { name: 'Shibuya Gigantic Stage Core', hp: 1200, atk: 27, spd: 5, color: '#240a1d', weapon: 'speaker', special: 'Deafening Mega-Concert Pulse' }
  });
}
