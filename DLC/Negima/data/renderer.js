// Negima — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#183323', '#040a05'], floor: 'rgba(82, 175, 94, 0.16)', grid: 'rgba(244, 214, 93, 0.28)', motif: 'worldtree', accent: '#f4d65d' });
}

export function createOpenaiBackdropsTactics() {
  return ('/backgrounds/negima-tactics-openai.png');
}
