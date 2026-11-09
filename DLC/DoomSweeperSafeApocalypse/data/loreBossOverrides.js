// Doom Sweeper — Safe Apocalypse — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSpritePromptPrefix() {
  return ([
  'Use case: stylized-concept.',
  'Asset type: transparent game sprite sheet for a 2D canvas battle game.',
  'Create one original highly detailed dark-fantasy pixel-art animation sheet, 1024x1024, exactly 4 columns x 4 rows, sixteen equal 256x256 cells.',
  'One boss entity only, except for a canonically inseparable duo or trio explicitly required by the visual lock; full body, three-quarter side battle angle facing right, centered with identical scale and anatomy in every cell.',
  'Row 1 idle breathing, row 2 walk or run cycle, row 3 canonical signature attack, row 4 hit or recoil cycle.',
  'Perfectly flat solid #00ff00 chroma background, no floor, no cast shadow, no text, no labels, no border, no watermark, no cropped limbs and no duplicate subject.'
].join(' '));
}
