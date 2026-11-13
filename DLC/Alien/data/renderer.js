// Alien — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#0b2530', '#02080c'], floor: 'rgba(98, 122, 129, 0.18)', grid: 'rgba(103, 208, 218, 0.24)', motif: 'hive', accent: '#8adbe6' });
}

export function createOpenaiBackdropsSmash() {
  return ('/backgrounds/alien-smash-openai.png');
}
