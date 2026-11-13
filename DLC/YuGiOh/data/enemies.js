// Yu-Gi-Oh — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Kuriboh', hp: 50, atk: 4, spd: 6, color: '#795548', weapon: 'multiply_guard' },
      { name: 'Celtic Guardian Warrior', hp: 90, atk: 11, spd: 5, color: '#27ae60', weapon: 'sword' },
      { name: 'Red-Eyes Baby Dragon', hp: 80, atk: 12, spd: 6, color: '#17202a', weapon: 'fire' }
    ],
    bosses: [
      { name: 'Blue-Eyes White Dragon', hp: 620, atk: 23, spd: 5, color: '#d9e8fb', weapon: 'beam', special: 'Burst Stream of Destruction' },
      { name: 'Dark Magician Shadow', hp: 500, atk: 19, spd: 6, color: '#2a1a5e', weapon: 'magic', special: 'Dark Magic Attack Blast' }
    ],
    worldBoss: { name: 'Obelisk The Tormentor God', hp: 1500, atk: 35, spd: 4, color: '#1b4f72', weapon: 'fists', special: 'Fist of Fate Infinite Smash' }
  });
}

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Summoned Skull', hp: 125, atk: 15, spd: 5, color: '#d7dbdd', weapon: 'lightning' },
      { name: 'Harpie Lady Trio', hp: 95, atk: 13, spd: 8, color: '#f5b7b1', weapon: 'claws' },
      { name: 'Toon World Mimic', hp: 105, atk: 12, spd: 6, color: '#f4d03f', weapon: 'toon_trap' }
    ],
    bosses: [
      { name: 'Red-Eyes Black Dragon', hp: 600, atk: 24, spd: 6, color: '#111317', weapon: 'inferno_fire', special: 'Inferno Fire Blast' },
      { name: 'Exodia the Forbidden One', hp: 800, atk: 30, spd: 3, color: '#d4af37', weapon: 'obliteration', special: 'Obliterate the Field' }
    ]
  });
}
