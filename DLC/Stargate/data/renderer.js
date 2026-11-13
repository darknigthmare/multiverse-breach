// Stargate — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#132c43', '#030812'], floor: 'rgba(196, 151, 58, 0.16)', grid: 'rgba(80, 200, 255, 0.3)', motif: 'stargate', accent: '#d7b45a' });
}

export function createOpenaiBackdropsRpg() {
  return ('/backgrounds/stargate-rpg-openai.png');
}
