// Silent Hill — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#2c2926', '#090807'], floor: 'rgba(135, 124, 105, 0.14)', grid: 'rgba(199, 170, 122, 0.18)', motif: 'fogtown', accent: '#c4a56f' });
}

export function createOpenaiBackdropsRpg() {
  return ('/backgrounds/silent-hill-rpg-openai.png');
}
