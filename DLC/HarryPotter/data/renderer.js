// Harry Potter — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#1a1730', '#05040c'], floor: 'rgba(170, 121, 42, 0.16)', grid: 'rgba(215, 184, 105, 0.3)', motif: 'castle', accent: '#d9b86b' });
}

export function createOpenaiBackdropsRpg() {
  return ('/backgrounds/harry-potter-rpg-openai.png');
}
