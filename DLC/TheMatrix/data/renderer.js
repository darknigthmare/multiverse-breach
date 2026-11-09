// The Matrix — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#032403', '#000500'], floor: 'rgba(45, 206, 90, 0.1)', grid: 'rgba(57, 255, 110, 0.42)', motif: 'code', accent: '#39ff6e' });
}

export function createOpenaiBackdropsTactics() {
  return ('/backgrounds/matrix-tactics-openai.png');
}
