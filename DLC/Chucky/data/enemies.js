// Chucky — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Evil Toy Soldier Patrol', hp: 65, atk: 8, spd: 5, color: '#e74c3c', weapon: 'gun' },
      { name: 'Cursed Stitched Doll', hp: 80, atk: 10, spd: 6, color: '#cca43b', weapon: 'bite' },
      { name: 'Voodoo Doll Puppet', hp: 50, atk: 12, spd: 7, color: '#7f5a38', weapon: 'zap' }
    ],
    bosses: [
      { name: 'Chucky Doll Killer', hp: 400, atk: 17, spd: 7, color: '#f1c40f', weapon: 'knife', special: 'Voodoo Damballa Curse Fire', spriteSource: '/sprites/generated/heroes/chucky/chucky.png' },
      { name: 'Tiffany Doll Bride', hp: 380, atk: 15, spd: 7, color: '#ececec', weapon: 'knife', special: 'Aerosol Spray Fire Blast', spriteSource: '/sprites/generated/heroes/chucky/tiffany.png' }
    ],
    worldBoss: { name: 'Play Pals Assembly Core', hp: 1100, atk: 25, spd: 4, color: '#2c3e50', weapon: 'machinery', special: 'Unleash Defective Toy Swarm' }
  });
}
