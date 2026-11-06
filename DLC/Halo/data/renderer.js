// Halo — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#0e3022', '#02100b'], floor: 'rgba(52, 178, 125, 0.14)', grid: 'rgba(80, 214, 205, 0.35)', motif: 'ringworld', accent: '#5af2d6' });
}

export function createOpenaiBackdropsTactics() {
  return ('/backgrounds/halo-tactics-openai.png');
}
