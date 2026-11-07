// Mad Max — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#412409', '#0c0501'], floor: 'rgba(221, 116, 36, 0.2)', grid: 'rgba(255, 150, 58, 0.28)', motif: 'desert', accent: '#ff963a' });
}

export function createOpenaiBackdropsRpg() {
  return ('/backgrounds/mad-max-rpg-openai.png');
}
