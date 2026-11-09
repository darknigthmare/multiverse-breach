// Negima — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Contract Shadow Imp', hp: 70, atk: 9, spd: 6, color: '#76448a', weapon: 'magic' },
      { name: 'Magic Combat Puppet', hp: 90, atk: 11, spd: 5, color: '#a04000', weapon: 'blade' },
      { name: 'Contract Beast Beetle', hp: 85, atk: 10, spd: 5, color: '#273746', weapon: 'bash' }
    ],
    bosses: [
      { name: 'Kotaro Inugami Wolf-boy', hp: 500, atk: 19, spd: 7, color: '#d35400', weapon: 'claws', special: 'Shadow Wolf Clone Strike' },
      { name: 'Fate Averruncus Earth Mage', hp: 600, atk: 22, spd: 6, color: '#2c3e50', weapon: 'stone', special: 'Petrification Spear Pillar' }
    ],
    worldBoss: { name: 'Mage of the Beginning God', hp: 1500, atk: 36, spd: 4, color: '#09010f', weapon: 'magic', special: 'Genesis Void Magic Blast' }
  });
}
