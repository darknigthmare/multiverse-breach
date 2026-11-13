// Scary Movie — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#221a23', '#060306'], floor: 'rgba(158, 68, 115, 0.15)', grid: 'rgba(255, 255, 255, 0.18)', motif: 'hauntedset', accent: '#f05aa7' });
}

export function createOpenaiBackdropsRpg() {
  return ('/backgrounds/scary-movie-rpg-openai.png');
}
