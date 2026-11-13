// Hellraiser — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#2b1511', '#070202'], floor: 'rgba(146, 45, 35, 0.18)', grid: 'rgba(218, 160, 72, 0.26)', motif: 'labyrinth', accent: '#d19845' });
}

export function createOpenaiBackdropsRpg() {
  return ('/backgrounds/hellraiser-rpg-openai.png');
}
