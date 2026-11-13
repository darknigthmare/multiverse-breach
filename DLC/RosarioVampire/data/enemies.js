// Rosario + Vampire — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Ghoul Student Outcast', hp: 75, atk: 10, spd: 5, color: '#566573', weapon: 'bite' },
      { name: 'Lesser Werewolf Brawler', hp: 90, atk: 12, spd: 6, color: '#5d4037', weapon: 'claws' },
      { name: 'Academy Harpy Minion', hp: 65, atk: 9, spd: 7, color: '#af7ac5', weapon: 'dive' }
    ],
    bosses: [
      { name: 'Kokoa Shuzen sister', hp: 480, atk: 18, spd: 7, color: '#c0392b', weapon: 'bat', special: 'Ko-chan Giant Hammer' },
      { name: 'Kuyou Fire Fox Demon', hp: 540, atk: 20, spd: 6, color: '#d35400', weapon: 'fire', special: 'Flame Tail Fire Slash' }
    ],
    worldBoss: { name: 'Alucard Dragon Colossus', hp: 1400, atk: 33, spd: 3, color: '#1a1118', weapon: 'darkness', special: 'Cataclysmic Vampire Roar' }
  });
}
