// Resident Evil — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#272325', '#070707'], floor: 'rgba(117, 40, 35, 0.18)', grid: 'rgba(209, 61, 50, 0.25)', motif: 'biohazard', accent: '#e95444' });
}

export function createOpenaiBackdropsTactics() {
  return ('/backgrounds/resident-evil-tactics-openai.png');
}
