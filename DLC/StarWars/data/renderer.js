// Star Wars — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#05061a', '#000107'], floor: 'rgba(88, 103, 130, 0.16)', grid: 'rgba(84, 179, 255, 0.3)', motif: 'trench', accent: '#54b3ff' });
}

export function createOpenaiBackdropsSmash() {
  return ('/backgrounds/star-wars-smash-openai.png');
}
