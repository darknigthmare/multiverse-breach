// Chucky — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#2e1d21', '#080304'], floor: 'rgba(205, 70, 60, 0.16)', grid: 'rgba(70, 170, 255, 0.24)', motif: 'toyfactory', accent: '#ffcf4a' });
}

export function createOpenaiBackdropsSmash() {
  return ('/backgrounds/chucky-play-pals-breach-openai-v2.png');
}
