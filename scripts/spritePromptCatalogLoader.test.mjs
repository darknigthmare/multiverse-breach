import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadSpritePromptCatalogs } from './buildSpritePromptPack.mjs';

test('sprite tooling loads the complete game graph after content moves into DLC folders', async () => {
  const [heroes, enemies, items, overrides, policies, stages, sprites] = await loadSpritePromptCatalogs();
  for (const universe of ['Halo', 'Half-Life', 'Nexus de Convergence']) {
    assert.ok(heroes.HEROES_DB.some(hero => hero.universe === universe), `Hero catalog lost ${universe}`);
    assert.ok(enemies.ENEMIES_DB[universe], `Enemy catalog lost ${universe}`);
  }
  assert.ok(stages.STAGE_LORE_PROFILES.Discworld, 'Expanded stage profiles resolve their DLC data');
  assert.ok(Object.keys(stages.STAGE_ARC_LORE_PROFILES).length, 'Shared crossover profiles remain available');
  assert.ok(Array.isArray(items.BATTLE_ITEM_CATALOG) && items.BATTLE_ITEM_CATALOG.length);
  assert.ok(Object.keys(overrides.LORE_ITEM_OVERRIDES).length);
  assert.ok(Object.keys(policies.LORE_WORLD_BOSS_POLICIES).length);
  assert.equal(typeof sprites.getItemSpriteSrc, 'function');
  assert.equal(sprites.getItemSpriteSrc({ id: 'test-item', icon: '/sprites/existing.png' }), '/sprites/existing.png');
});
