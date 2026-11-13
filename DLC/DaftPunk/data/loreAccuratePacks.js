// Daft Punk — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('shep_interstella', 'Shep (Interstella 5555)', 'slayer', '#4aa3df', 'guitar', 'Crescendolls Guitar Shot', 'Digital Rescue Dive', 'Cosmic Fan Guard', 'Interstella Sacrifice')
  ]);
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Derezzed Grid Drone', 85, 13, 7, '#00d8ff', 'grid_laser'),
      monster('Harder Better Faster Loop', 95, 14, 8, '#d4af37', 'loop_strike'),
      monster('Technologic Command Line', 90, 12, 7, '#bdc3c7', 'code_pulse')
    ],
    bosses: [
      boss('Alive Pyramid Light Wall', 540, 20, 5, '#ffc740', 'light_grid', 'Alive Pyramid Sync'),
      boss('Robot Rock Titan', 590, 23, 5, '#bdc3c7', 'robot_riff', 'Robot Rock Overdrive')
    ],
    worldBoss: boss('Derezzed Pyramid Core', 1240, 30, 6, '#00d8ff', 'derezzed_beam', 'TRON Grid Collapse')
  });
}
