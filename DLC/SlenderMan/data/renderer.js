// Slender Man — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#151818', '#020303'], floor: 'rgba(111, 125, 112, 0.13)', grid: 'rgba(210, 224, 210, 0.16)', motif: 'forest', accent: '#cbd8c8' });
}

export function createOpenaiBackdropsTactics() {
  return ('/backgrounds/slender-man-smash-openai.png');
}

export function createOpenaiBackdropsSmash() {
  return ('/backgrounds/slender-man-smash-openai.png');
}
