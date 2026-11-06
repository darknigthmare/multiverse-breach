// Rick & Morty — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#102d27', '#030806'], floor: 'rgba(83, 224, 95, 0.15)', grid: 'rgba(173, 80, 255, 0.3)', motif: 'portalgarage', accent: '#4de65c' });
}

export function createOpenaiBackdropsSmash() {
  return ('/backgrounds/rick-morty-smash-openai.png');
}
