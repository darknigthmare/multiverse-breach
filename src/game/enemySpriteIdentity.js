import { getEnemySpriteSheetSrc } from './spriteAssets.js';

// Runtime labels and the battle's primary universe do not change the body of
// the original actor. Bind that image before applying either transformation.
export const preserveEnemySpriteIdentity = (enemy, defaultUniverse = '') => {
  if (!enemy?.name) return enemy;
  const sourceUniverse = enemy.sourceUniverse || enemy.universe || defaultUniverse;
  const spriteSource = getEnemySpriteSheetSrc({ ...enemy, universe: sourceUniverse });
  return {
    ...enemy,
    ...(sourceUniverse ? { sourceUniverse } : {}),
    ...(spriteSource ? { spriteSource } : {})
  };
};
