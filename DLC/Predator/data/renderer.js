// Predator — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#21320f', '#050a02'], floor: 'rgba(41, 151, 74, 0.18)', grid: 'rgba(111, 211, 90, 0.28)', motif: 'jungle', accent: '#9bff62' });
}

export function createOpenaiBackdropsRpg() {
  return ('/backgrounds/predator-rpg-openai.png');
}
