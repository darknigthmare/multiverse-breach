// Dead Space — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#10202b', '#03070b'], floor: 'rgba(104, 116, 128, 0.18)', grid: 'rgba(76, 201, 210, 0.26)', motif: 'shipdeck', accent: '#65d7de' });
}

export function createOpenaiBackdropsTactics() {
  return ('/backgrounds/dead-space-tactics-openai.png');
}
