// Dungeon Meshi — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Walking Mushroom Circle', hp: 75, atk: 9, spd: 5, color: '#d6b465', weapon: 'spores' },
      { name: 'Undine Water Mass', hp: 110, atk: 13, spd: 5, color: '#5dade2', weapon: 'water_blast' },
      { name: 'Treasure Insect Swarm', hp: 70, atk: 10, spd: 7, color: '#f4d03f', weapon: 'mimic_bite' }
    ],
    bosses: [
      { name: 'Chimera Falin', hp: 660, atk: 24, spd: 5, color: '#f5d6a1', weapon: 'dragon_magic', special: 'Dragon Soul Wail' },
      { name: 'Mad Mage Thistle', hp: 610, atk: 22, spd: 6, color: '#8e44ad', weapon: 'dungeon_magic', special: 'Dungeon Master Rewrite' }
    ]
  });
}
