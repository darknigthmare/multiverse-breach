import { LORE_SPRITE_PROMPT_PREFIX } from '../../../src/game/loreSpritePromptPrefix.js';

// Doom Sweeper — Safe Apocalypse — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSpritePromptPrefix() {
  return LORE_SPRITE_PROMPT_PREFIX;
}
