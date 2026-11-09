// BlazBlue — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#111b3d', '#030511'], floor: 'rgba(47, 107, 218, 0.16)', grid: 'rgba(107, 210, 255, 0.32)', motif: 'arcanecity', accent: '#68d6ff' });
}

export function createOpenaiBackdropsRpg() {
  return ('/backgrounds/blazblue-rpg-openai.png');
}
