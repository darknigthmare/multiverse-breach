import test from 'node:test';
import assert from 'node:assert/strict';
import { grantBattleItemShield, absorbBattleItemDamage, previewBattleItemDamage } from '../src/game/battleItemShield.js';
import { calculateRpgDamage } from '../src/game/rpgTargeting.js';

test('a shield protects future hits and never restores health', () => {
  const actor = { currentHp: 20, maxHp: 100 };
  assert.equal(grantBattleItemShield(actor, 30), 30);
  assert.equal(actor.currentHp, 20);
  assert.equal(previewBattleItemDamage(actor, 45), 15);
  assert.equal(actor.battleItemShield, 30, 'preview spent shield');
  assert.equal(absorbBattleItemDamage(actor, 45), 15);
  assert.equal(actor.battleItemShield, 0);
  assert.equal(absorbBattleItemDamage(actor, 45), 45);
});

test('repeated shield grants refresh a bounded pool without stacking or resurrection', () => {
  const actor = { currentHp: 10, maxHp: 100 };
  grantBattleItemShield(actor, 60);
  assert.equal(grantBattleItemShield(actor, 60), 0);
  assert.equal(actor.battleItemShield, 60);
  grantBattleItemShield(actor, 10000);
  assert.equal(actor.battleItemShield, 100);
  assert.equal(grantBattleItemShield({ currentHp: 0, maxHp: 100 }, 100), 0);
  assert.equal(absorbBattleItemDamage(actor, -20), 0);
  assert.equal(actor.battleItemShield, 100);
});

test('RPG preview and real damage consume item protection exactly once after DEF and guard', () => {
  const actor = { currentHp: 100, maxHp: 100, stats: { def: 100 }, state: 'defense', defense: { reduce: 0.5 }, battleItemShield: 10 };
  const preview = calculateRpgDamage(actor, 100);
  const actual = absorbBattleItemDamage(actor, calculateRpgDamage(actor, 100, 1, false));
  assert.equal(preview, 15);
  assert.equal(actual, preview);
  assert.equal(actor.battleItemShield, 0);
});
