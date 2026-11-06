// Gears of War — definitions consumed by src/game/renderer.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createDecorThemes() {
  return ({ sky: ['#301615', '#080303'], floor: 'rgba(101, 64, 55, 0.2)', grid: 'rgba(190, 45, 36, 0.35)', motif: 'fortress', accent: '#d84a36' });
}

export function createOpenaiBackdropsRpg() {
  return ('/backgrounds/gears-of-war-rpg-openai.png');
}
