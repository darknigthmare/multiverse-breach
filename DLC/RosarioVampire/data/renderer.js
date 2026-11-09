// Rosario + Vampire — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#2a1735', '#07030d'], floor: 'rgba(203, 76, 165, 0.15)', grid: 'rgba(98, 214, 255, 0.27)', motif: 'academy', accent: '#df64c5' });
}

export function createOpenaiBackdropsRpg() {
  return ('/backgrounds/rosario-vampire-rpg-openai.png');
}
