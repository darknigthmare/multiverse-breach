import assert from 'node:assert/strict';
import { test } from 'node:test';

import { MELEE_STATES } from '../src/game/melee/meleeStateMachine.js';
import {
  PLAYER_ANCHOR_MELEE_MANIFEST,
  PLAYER_ANCHOR_MELEE_SHEETS,
  getMeleeAnimationFrame,
  getMeleeAnimationManifest,
  getMeleeAnimationSheetSources,
  getMeleeSheetLayout,
  resolveMeleeAnimation,
  validateMeleeAnimationManifest
} from '../src/game/melee/meleeAnimationManifest.js';

const REQUIRED_ANIMATION_FIELDS = [
  'sheet', 'row', 'startColumn', 'frameCount', 'fps', 'loop',
  'rootMotion', 'hurtboxes', 'hitboxes', 'events'
];

test('player_anchor manifest declares strict P4 atlas identity and geometry', () => {
  const manifest = PLAYER_ANCHOR_MELEE_MANIFEST;
  assert.strictEqual(getMeleeAnimationManifest('player_anchor'), manifest);
  assert.equal(getMeleeAnimationManifest('unknown'), null);
  assert.equal(manifest.characterId, 'player_anchor');
  assert.equal(manifest.context, 'melee');
  assert.equal(manifest.atlasVersion, 'p4-openai-v1');
  assert.equal(manifest.cellWidth, 256);
  assert.equal(manifest.cellHeight, 256);
  assert.equal(manifest.imageWidth, 1024);
  assert.equal(manifest.imageHeight, 1024);
  assert.equal(manifest.columns, 4);
  assert.equal(manifest.rows, 4);
  assert.equal(manifest.facingMode, 'flip');
  assert.deepEqual(validateMeleeAnimationManifest(manifest), []);
});

test('all 45 melee states have complete bounded metadata and a baseline', () => {
  const manifest = PLAYER_ANCHOR_MELEE_MANIFEST;
  assert.equal(MELEE_STATES.length, 45);
  assert.equal(Object.keys(manifest.animations).length, 45);
  assert.equal(Object.keys(manifest.anchorByState).length, 45);

  MELEE_STATES.forEach(state => {
    const entry = manifest.animations[state];
    assert.ok(entry, `${state}: missing animation`);
    REQUIRED_ANIMATION_FIELDS.forEach(field => {
      assert.ok(Object.prototype.hasOwnProperty.call(entry, field), `${state}: missing ${field}`);
    });
    assert.ok(Object.values(PLAYER_ANCHOR_MELEE_SHEETS).includes(entry.sheet), `${state}: unknown sheet`);
    assert.ok(Number.isInteger(entry.row) && entry.row >= 0 && entry.row < manifest.rows, `${state}: row`);
    assert.ok(Number.isInteger(entry.startColumn) && entry.startColumn >= 0, `${state}: startColumn`);
    assert.ok(Number.isInteger(entry.frameCount) && entry.frameCount > 0, `${state}: frameCount`);
    assert.ok(entry.startColumn + entry.frameCount <= manifest.columns, `${state}: column overflow`);
    assert.ok(entry.fps > 0, `${state}: fps`);
    assert.equal(typeof entry.loop, 'boolean', `${state}: loop`);
    ['rootMotion', 'hurtboxes', 'hitboxes', 'events'].forEach(field => {
      assert.ok(Array.isArray(entry[field]), `${state}: ${field}`);
    });
    const anchor = manifest.anchorByState[state];
    assert.ok(anchor, `${state}: missing anchor`);
    assert.ok(Number.isFinite(anchor.x) && Number.isFinite(anchor.y), `${state}: anchor coordinates`);
    assert.equal(anchor.baseline, state.startsWith('ledge') ? 'ledgeGrip' : 'feet', `${state}: baseline`);
  });

  assert.ok(new Set(Object.values(manifest.animations).map(entry => entry.frameCount)).size > 1);
});

test('frame resolution honors variable counts, loops, clamps and start columns', () => {
  const manifest = PLAYER_ANCHOR_MELEE_MANIFEST;

  const walkLast = getMeleeAnimationFrame(manifest, 'walk', 250);
  assert.equal(walkLast.animation.frameCount, 3);
  assert.equal(walkLast.frame, 2);
  assert.equal(walkLast.col, 2);
  assert.equal(getMeleeAnimationFrame(manifest, 'walk', 375).frame, 0);

  const idleWrapped = getMeleeAnimationFrame(manifest, 'idle', 500);
  assert.equal(idleWrapped.animation.frameCount, 4);
  assert.equal(idleWrapped.frame, 0);

  const landClamped = getMeleeAnimationFrame(manifest, 'land', 10_000);
  assert.equal(landClamped.animation.loop, false);
  assert.equal(landClamped.frame, 2);
  assert.equal(landClamped.col, 3);

  const turnClamped = getMeleeAnimationFrame(manifest, 'turn', 10_000);
  assert.equal(turnClamped.animation.frameCount, 1);
  assert.equal(turnClamped.frame, 0);
  assert.equal(turnClamped.col, 0);

  const fallback = getMeleeAnimationFrame(manifest, 'not-a-state', 0);
  assert.strictEqual(fallback.animation, manifest.animations.idle);
  assert.strictEqual(resolveMeleeAnimation(manifest, 'not-a-state'), manifest.animations.idle);
  assert.equal(getMeleeAnimationFrame(null, 'idle', 0), null);
});

test('five unique sources resolve from character id or object and expose 256 layouts', () => {
  const expected = Object.values(PLAYER_ANCHOR_MELEE_SHEETS);
  const fromId = getMeleeAnimationSheetSources('player_anchor');
  const fromActor = getMeleeAnimationSheetSources({ id: 'player_anchor' });

  assert.equal(expected.length, 5);
  assert.equal(new Set(expected).size, 5);
  assert.deepEqual(fromId, expected);
  assert.deepEqual(fromActor, expected);
  assert.deepEqual(getMeleeAnimationSheetSources('unknown'), []);

  expected.forEach(source => {
    assert.deepEqual(getMeleeSheetLayout(source), {
      columns: 4,
      rows: 4,
      cellWidth: 256,
      cellHeight: 256
    });
    assert.deepEqual(getMeleeSheetLayout(`https://assets.example.test${source}?v=1`), {
      columns: 4,
      rows: 4,
      cellWidth: 256,
      cellHeight: 256
    });
  });
  assert.equal(getMeleeSheetLayout('/sprites/generated/unknown.webp'), null);
});

test('resolved frames expose state-specific feet and ledgeGrip anchors', () => {
  const manifest = PLAYER_ANCHOR_MELEE_MANIFEST;
  const standing = getMeleeAnimationFrame(manifest, 'run', 0);
  const ledge = getMeleeAnimationFrame(manifest, 'ledgeHang', 0);

  assert.deepEqual(standing.anchor, { x: 0.5, y: 0.94, baseline: 'feet' });
  assert.deepEqual(ledge.anchor, { x: 0.5, y: 0.72, baseline: 'ledgeGrip' });
  assert.equal(standing.trim, null);
  assert.equal(ledge.trim, null);
});

test('manifest validator reports malformed state geometry and metadata', () => {
  const source = PLAYER_ANCHOR_MELEE_MANIFEST;
  const missingIdle = {
    ...source,
    animations: { ...source.animations, idle: undefined }
  };
  assert.ok(validateMeleeAnimationManifest(missingIdle).some(error => error.includes('idle')));

  const overflowing = {
    ...source,
    animations: {
      ...source.animations,
      walk: { ...source.animations.walk, startColumn: 3, frameCount: 3 }
    }
  };
  assert.ok(validateMeleeAnimationManifest(overflowing).some(error => error.includes('walk')));

  const invalidContext = { ...source, context: 'rpg' };
  assert.ok(validateMeleeAnimationManifest(invalidContext).includes("context must be 'melee'"));
});
