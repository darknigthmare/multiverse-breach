// Dino Crisis — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#17332a', '#030d09'], floor: 'rgba(44, 160, 116, 0.16)', grid: 'rgba(253, 87, 68, 0.24)', motif: 'facility', accent: '#ff6b56' });
}

export function createOpenaiBackdropsSmash() {
  return ('/backgrounds/dino-crisis-smash-openai.png');
}
