// Payday — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#172235', '#03060b'], floor: 'rgba(40, 88, 145, 0.16)', grid: 'rgba(248, 198, 56, 0.28)', motif: 'vault', accent: '#f8c638' });
}

export function createOpenaiBackdropsSmash() {
  return ('/backgrounds/payday-smash-openai.png');
}
