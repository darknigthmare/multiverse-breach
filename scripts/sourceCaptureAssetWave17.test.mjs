import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getEnemySpriteSheetSrc } from '../src/game/spriteAssets.js';
import { CANONICAL_CAPTURE_NPC_WAVE17, getSourceCaptureEnemyAssetsWave17 } from '../src/game/combat/sourceCaptureEnemyCatalogWave17.js';

test('the real capture NPC preloads its exact native PNG instead of a derived missing boss path', () => {
  const asset = getSourceCaptureEnemyAssetsWave17().find(entry => entry.sourceEnemyId === CANONICAL_CAPTURE_NPC_WAVE17.sourceEnemyId);
  assert.ok(asset);
  assert.equal(getEnemySpriteSheetSrc(CANONICAL_CAPTURE_NPC_WAVE17), asset.sheet);
  assert.equal(getEnemySpriteSheetSrc({ ...CANONICAL_CAPTURE_NPC_WAVE17, id: 'enemy:2:kitten' }), asset.sheet);
});
test('neither an unrelated universe nor a display name authorizes the capture NPC preload route', () => {
  const sheet = getEnemySpriteSheetSrc(CANONICAL_CAPTURE_NPC_WAVE17);
  assert.notEqual(getEnemySpriteSheetSrc({ ...CANONICAL_CAPTURE_NPC_WAVE17, universe: 'Other' }), sheet);
  assert.notEqual(getEnemySpriteSheetSrc({ ...CANONICAL_CAPTURE_NPC_WAVE17, id: 'other', sourceEnemyId: 'other' }), sheet);
});
