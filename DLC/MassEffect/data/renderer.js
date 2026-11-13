// Mass Effect — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#071a34', '#01040a'], floor: 'rgba(66, 117, 170, 0.16)', grid: 'rgba(73, 179, 255, 0.34)', motif: 'citadel', accent: '#58baff' });
}

export function createOpenaiBackdropsTactics() {
  return ('/backgrounds/mass-effect-tactics-openai.png');
}
