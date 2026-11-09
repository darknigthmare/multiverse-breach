// Unreal — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#17283f', '#03060d'], floor: 'rgba(47, 129, 195, 0.18)', grid: 'rgba(255, 92, 51, 0.35)', motif: 'tournament', accent: '#ff5c33' });
}

export function createOpenaiBackdropsTactics() {
  return ('/backgrounds/unreal-smash-openai.png');
}

export function createOpenaiBackdropsSmash() {
  return ('/backgrounds/unreal-smash-openai.png');
}
