// Metal Gear — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#1d2624', '#050807'], floor: 'rgba(107, 133, 123, 0.16)', grid: 'rgba(133, 166, 151, 0.25)', motif: 'stealthbase', accent: '#9eb79d' });
}

export function createOpenaiBackdropsTactics() {
  return ('/backgrounds/metal-gear-tactics-openai.png');
}
