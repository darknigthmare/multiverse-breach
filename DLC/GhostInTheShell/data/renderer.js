// Ghost in the Shell — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#061f2b', '#010508'], floor: 'rgba(54, 158, 184, 0.15)', grid: 'rgba(65, 255, 172, 0.32)', motif: 'cybercity', accent: '#41ffac' });
}

export function createOpenaiBackdropsSmash() {
  return ('/backgrounds/ghost-in-the-shell-smash-openai.png');
}
