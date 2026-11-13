// Saw — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#231b18', '#070403'], floor: 'rgba(111, 45, 35, 0.18)', grid: 'rgba(199, 58, 42, 0.24)', motif: 'traproom', accent: '#c73a2a' });
}

export function createOpenaiBackdropsSmash() {
  return ('/backgrounds/saw-smash-openai.png');
}
