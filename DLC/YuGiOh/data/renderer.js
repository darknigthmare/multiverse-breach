// Yu-Gi-Oh — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#221335', '#05030d'], floor: 'rgba(218, 164, 45, 0.16)', grid: 'rgba(174, 92, 255, 0.28)', motif: 'duelarena', accent: '#e4b449' });
}

export function createOpenaiBackdropsTactics() {
  return ('/backgrounds/yu-gi-oh-tactics-openai.png');
}
