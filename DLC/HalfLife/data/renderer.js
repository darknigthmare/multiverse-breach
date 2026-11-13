// Half-Life — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#33200f', '#080401'], floor: 'rgba(230, 104, 26, 0.16)', grid: 'rgba(255, 134, 37, 0.32)', motif: 'lab', accent: '#ff7a1a' });
}

export function createOpenaiBackdropsSmash() {
  return ('/backgrounds/half-life-smash-openai.png');
}
