// Oliver Tree — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Turbo Scooter Crash', 80, 13, 8, '#ff6f3c', 'scooter_ram'),
      monster('Alien Boy UFO Glitch', 90, 12, 7, '#39c5bb', 'ufo_zap'),
      monster('Miss You Viral Echo', 75, 14, 6, '#d8d43f', 'echo_loop')
    ],
    bosses: [
      boss('Bowl Cut Persona', 500, 19, 7, '#d8d43f', 'persona_glitch', 'Bowl Cut Reset'),
      boss('Cowboy Tears Rodeo Loop', 540, 20, 6, '#8d6e63', 'rodeo_lasso', 'Cowboy Tears Loop')
    ],
    worldBoss: boss('Turbo Scooter Breakdown', 1120, 28, 8, '#ff6f3c', 'turbo_crash', 'Turbo Viral Collapse')
  });
}
