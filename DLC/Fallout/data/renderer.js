// Fallout — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#352a14', '#0a0702'], floor: 'rgba(177, 142, 77, 0.18)', grid: 'rgba(73, 210, 95, 0.24)', motif: 'wasteland', accent: '#49d25f' });
}

export function createOpenaiBackdropsSmash() {
  return ('/backgrounds/fallout-smash-openai.png');
}
