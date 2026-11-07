// Guilty Gear — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#351419', '#090304'], floor: 'rgba(206, 57, 46, 0.17)', grid: 'rgba(255, 205, 70, 0.3)', motif: 'gearstage', accent: '#f2c744' });
}

export function createOpenaiBackdropsSmash() {
  return ('/backgrounds/guilty-gear-smash-openai.png');
}
