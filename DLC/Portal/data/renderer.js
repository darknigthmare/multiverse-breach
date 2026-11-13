// Portal — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#10151c', '#030507'], floor: 'rgba(232, 232, 232, 0.11)', grid: 'rgba(80, 180, 255, 0.32)', motif: 'testchamber', accent: '#ff9f1a' });
}

export function createOpenaiBackdropsRpg() {
  return ('/backgrounds/portal-rpg-openai.png');
}
