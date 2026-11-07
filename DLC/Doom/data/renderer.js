// Doom — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#4b0807', '#110101'], floor: 'rgba(229, 64, 42, 0.22)', grid: 'rgba(255, 80, 42, 0.42)', motif: 'hellgate', accent: '#ff4f2b' });
}

export function createOpenaiBackdropsRpg() {
  return ('/backgrounds/doom-rpg-openai.png');
}
