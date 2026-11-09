// Hellraiser — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Chatterer Cenobite Guard', hp: 85, atk: 10, spd: 4, color: '#7f8c8d', weapon: 'claws' },
      { name: 'Butterball Cenobite', hp: 120, atk: 8, spd: 3, color: '#5d5d5d', weapon: 'cleaver' },
      { name: 'Female Cenobite Sister', hp: 80, atk: 11, spd: 5, color: '#8e44ad', weapon: 'needles' }
    ],
    bosses: [
      { name: 'Pinhead Cenobite Leader', hp: 580, atk: 22, spd: 3, color: '#2c3e50', weapon: 'chains', special: 'Tear Your Soul Apart Chains' },
      { name: 'The Engineer Beast', hp: 640, atk: 20, spd: 5, color: '#1a0505', weapon: 'jaws', special: 'Crushing Maw Bite Charge' }
    ],
    worldBoss: { name: 'Leviathan Diamond God', hp: 1450, atk: 34, spd: 2, color: '#000000', weapon: 'darkness', special: 'Labyrinth Labyrinth Dark Beam' }
  });
}
