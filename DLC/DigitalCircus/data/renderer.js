// Digital Circus — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#251041', '#07020f'], floor: 'rgba(251, 80, 154, 0.16)', grid: 'rgba(255, 226, 68, 0.34)', motif: 'circus', accent: '#ffe244' });
}

export function createOpenaiBackdropsRpg() {
  return ('/backgrounds/digital-circus-rpg-openai.png');
}
