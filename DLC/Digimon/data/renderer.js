// Digimon — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#0f263e', '#03070d'], floor: 'rgba(50, 155, 225, 0.15)', grid: 'rgba(250, 205, 60, 0.3)', motif: 'digitalfield', accent: '#facd3c' });
}

export function createOpenaiBackdropsTactics() {
  return ('/backgrounds/digimon-tactics-openai.png');
}
