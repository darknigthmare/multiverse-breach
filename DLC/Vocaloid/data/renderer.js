// Vocaloid — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#153043', '#050616'], floor: 'rgba(37, 218, 197, 0.14)', grid: 'rgba(255, 75, 190, 0.32)', motif: 'concert', accent: '#39e5d0' });
}

export function createOpenaiBackdropsRpg() {
  return ('/backgrounds/vocaloid-smash-openai.png');
}

export function createOpenaiBackdropsSmash() {
  return ('/backgrounds/vocaloid-smash-openai.png');
}
