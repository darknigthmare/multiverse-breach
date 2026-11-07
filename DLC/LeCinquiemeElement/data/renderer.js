// Le Cinquième Element — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#1d2740', '#050713'], floor: 'rgba(236, 135, 57, 0.14)', grid: 'rgba(83, 225, 255, 0.3)', motif: 'cruise', accent: '#ff9d4c' });
}

export function createOpenaiBackdropsTactics() {
  return ('/backgrounds/fifth-element-tactics-openai.png');
}
