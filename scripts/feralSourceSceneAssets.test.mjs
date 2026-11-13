import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { register } from 'node:module';
import { test } from 'node:test';
import { SOURCE_SCENE_STAGES } from '../src/game/sourceSceneStages.js';
import { createSourceSceneEncounter } from '../src/game/sourceSceneEncounter.js';
import { MASKED_FERAL_SOURCE_SCENE_ART, getSourceSceneMaskedFeralSprite, getSourceSceneEnemyPreloadOverride } from '../src/game/sourceSceneThreatAssets.js';
import { resolveStageEnemyData } from '../src/game/stageEnemyResolver.js';

register('./sourceSceneTestLoader.mjs', import.meta.url);
const { ENEMIES_DB } = await import('../src/game/enemies.js');
const { getEnemySpriteSheetSrc } = await import('../src/game/spriteAssets.js');
const { preserveEnemySpriteIdentity } = await import('../src/game/enemySpriteIdentity.js');

const stage = SOURCE_SCENE_STAGES.find(value => value.id === 50106);
const actor = { id: 'naru_prey', universe: 'Prey' };
const archivedSource = '/sprites/generated/bosses/predator/feral-predator.png';
const threat = { name: 'Feral Predator', universe: 'Prey', spriteSource: archivedSource };
const createScene = (changes = {}) => createSourceSceneEncounter(stage, [actor], { bosses: [{ ...threat, ...changes }] });

test('Naru’s authored Prey scene reuses the actual masked sixteen-pose delivery without mutating the catalog', () => {
  const source = structuredClone(threat);
  const scene = createSourceSceneEncounter(stage, [actor], { bosses: [source] });
  const report = JSON.parse(readFileSync(new URL(`../${MASKED_FERAL_SOURCE_SCENE_ART.evidence}`, import.meta.url)));
  const delivery = report.entries.find(entry => entry.id === 'feral_predator' && entry.universe === 'Prey');
  assert.ok(delivery);
  assert.equal(scene.threat.spriteSource, delivery.output);
  assert.equal(getSourceSceneMaskedFeralSprite(scene), delivery.output);
  assert.equal(delivery.processing.nonemptyCells, 16);
  assert.equal(delivery.canonicalFidelityApproved, false);
  assert.equal(MASKED_FERAL_SOURCE_SCENE_ART.artApproved, false);
  assert.deepEqual(source, threat);
  assert.equal(source.spriteSource, archivedSource);
});

test('the real Prey enemy roster binds its locked 1719 world boss without requiring the playable ally incarnation', () => {
  const roster = ENEMIES_DB.Prey;
  const before = JSON.stringify(roster);
  const scene = createSourceSceneEncounter(stage, [actor], roster);
  assert.equal(scene.threat.legacyWorldBossId, 'prey-feral-predator');
  assert.deepEqual(scene.threat.continuity, {
    id: 'prey-2022-great-plains-1719',
    label: 'Prey (2022) - Great Plains 1719',
    status: 'locked', source: 'world-bosses-lore-gap-audit-2026-07-17'
  });
  assert.equal(scene.threat.incarnation, undefined, 'boss continuity is not the playable masked-ally incarnation field');
  assert.equal(scene.threat.spriteSource, MASKED_FERAL_SOURCE_SCENE_ART.spriteSource);
  assert.equal(getSourceSceneMaskedFeralSprite(scene), MASKED_FERAL_SOURCE_SCENE_ART.spriteSource);
  assert.equal(JSON.stringify(roster), before, 'binding leaves authoritative enemies untouched');
  for (const change of [
    { legacyWorldBossId: 'predator-jungle-hunter' },
    { continuity: { ...scene.threat.continuity, id: 'predator-1987' } },
    { continuity: { ...scene.threat.continuity, label: 'Predator (1987)' } },
    { continuity: { ...scene.threat.continuity, status: 'pending' } }
  ]) {
    assert.equal(getSourceSceneMaskedFeralSprite({ ...scene, threat: { ...scene.threat, ...change } }), '');
  }
  scene.done.add('take_mask');
  assert.equal(getSourceSceneMaskedFeralSprite(scene), '', 'the real boss cannot retain its masked display after mask theft');
});

test('stealing the mask prevents reuse before mounting it, in the bog, and after the guided bolt', () => {
  const scene = createScene();
  assert.ok(getSourceSceneMaskedFeralSprite(scene));
  scene.done.add('flintlock');
  assert.ok(getSourceSceneMaskedFeralSprite(scene));
  for (const command of ['take_mask', 'set_mask', 'sarii_hatchet', 'bog', 'redirect', 'trophy']) {
    scene.done.add(command);
    assert.equal(getSourceSceneMaskedFeralSprite(scene), '', command);
  }
  const completed = createScene();
  completed.complete = true;
  assert.equal(getSourceSceneMaskedFeralSprite(completed), '');
});

test('other film scenes, copied definitions and replacement protagonists cannot borrow Feral’s masked atlas', () => {
  const scene = createScene();
  for (const definition of SOURCE_SCENE_STAGES.filter(value => value !== stage)) {
    assert.equal(getSourceSceneMaskedFeralSprite({ ...scene, definition }), '');
  }
  assert.equal(getSourceSceneMaskedFeralSprite({ ...scene, definition: { ...stage } }), '');
  assert.equal(getSourceSceneMaskedFeralSprite({ ...scene, actor: { id: 'predator', universe: 'Predator' } }), '');
  assert.equal(getSourceSceneMaskedFeralSprite({ ...scene, actor: { ...actor, universe: 'Predator' } }), '');
});

test('a conflicting threat identity, universe, mask state or explicit incarnation keeps its own art', () => {
  for (const change of [
    { name: 'City Hunter' }, { universe: 'Predator' }, { sourceUniverse: 'Predator' },
    { id: 'predator' }, { sourceId: 'city_hunter' }, { sourceHeroId: 'greyback_yautja' },
    { incarnation: 'Prey (2022) - unmasked Feral Predator' },
    { sourceIncarnation: 'Prey (2022) - Bear Blood Feral' }, { masked: false }
  ]) {
    const scene = { ...createScene(), threat: { ...threat, ...change } };
    assert.equal(getSourceSceneMaskedFeralSprite(scene), '', JSON.stringify(change));
  }
  for (const id of ['feral_predator', 'prey-feral-predator']) {
    assert.ok(getSourceSceneMaskedFeralSprite(createScene({ id })));
  }
});

test('absent or unresolved Feral does not create a substitute body', () => {
  const scene = createSourceSceneEncounter(stage, [actor], { bosses: [{ name: 'Jungle Hunter', universe: 'Predator' }] });
  assert.equal(scene.threat, null);
  assert.equal(getSourceSceneMaskedFeralSprite(scene), '');
  assert.equal(getSourceSceneMaskedFeralSprite(null), '');
  assert.equal(getSourceSceneMaskedFeralSprite({ ...createScene(), done: [] }), '');
});

test('the real stage pool preloads the rendered Feral atlas without requesting its absent default boss path', () => {
  const enemyData = resolveStageEnemyData({ stage, ...ENEMIES_DB.Prey });
  const enemies = [...enemyData.monsters, ...enemyData.bosses, enemyData.worldBoss].filter(Boolean)
    .map(enemy => ({ ...preserveEnemySpriteIdentity(enemy, stage.universe), universe: stage.universe }));
  assert.equal(enemies.length, 1, 'only the film-specific threat enters the source-scene preload');
  assert.equal(enemies[0].legacyWorldBossId, 'prey-feral-predator');
  const before = JSON.stringify(enemies);
  const spriteSources = enemies.map(enemy => getSourceSceneEnemyPreloadOverride(stage, [actor], enemy)
    || getEnemySpriteSheetSrc(enemy));
  const encounter = createSourceSceneEncounter(stage, [actor], enemyData);
  assert.deepEqual(spriteSources, [encounter.threat.spriteSource]);
  assert.equal(spriteSources[0], MASKED_FERAL_SOURCE_SCENE_ART.spriteSource);
  assert.ok(!spriteSources.includes('/sprites/generated/bosses/prey/feral-predator.png'));
  assert.equal(JSON.stringify(enemies), before, 'preload does not rewrite the source roster');
  for (const patch of [
    { mode: 'RPG' }, { universe: 'Predator' }, { incarnation: 'Predator (1987)' },
    { customBattle: {} }, { isCustomBattle: true }, { isCustom: true },
    { forceBaseArena: true }, { dlcSuppressedArena: true }
  ]) {
    assert.equal(getSourceSceneEnemyPreloadOverride({ ...stage, ...patch }, [actor], enemies[0]), '', JSON.stringify(patch));
  }
  assert.equal(getSourceSceneEnemyPreloadOverride(stage, [], enemies[0]), '');
  assert.equal(getSourceSceneEnemyPreloadOverride(stage, [actor, actor], enemies[0]), '');
  assert.equal(getSourceSceneEnemyPreloadOverride(stage, [{ ...actor, universe: 'Predator' }], enemies[0]), '');
  assert.equal(getSourceSceneEnemyPreloadOverride(stage, [actor], { ...enemies[0], sourceUniverse: 'Predator' }), '');
});
