import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PORTAL_FALLBACK_VISUAL,
  PORTAL_VISUAL_MANIFEST,
  PORTAL_VISUALS_BY_UNIVERSE,
  getPortalFrameForPhase,
  getPortalVisual,
  resolvePortalVisual
} from '../src/game/visuals/portalVisualCatalog.js';

const assertFrozenRecord = (record, label) => {
  assert.ok(Object.isFrozen(record), `${label}: record must be frozen`);
  assert.ok(Object.isFrozen(record.atlas), `${label}: atlas must be frozen`);
  assert.ok(Object.isFrozen(record.review), `${label}: review must be frozen`);
  for (const key of ['motifs', 'materials', 'palette', 'mustAvoid', 'officialReferenceUrls']) {
    assert.ok(Object.isFrozen(record[key]), `${label}: ${key} must be frozen`);
  }
};

test('portal manifest exposes approved immutable exact universe records', () => {
  assert.ok(Array.isArray(PORTAL_VISUAL_MANIFEST));
  assert.ok(PORTAL_VISUAL_MANIFEST.length >= 4);
  assert.ok(Object.isFrozen(PORTAL_VISUAL_MANIFEST));
  assert.ok(Object.isFrozen(PORTAL_VISUALS_BY_UNIVERSE));

  for (const record of PORTAL_VISUAL_MANIFEST) {
    assert.equal(record.status, 'approved');
    assert.equal('isFallback' in record, false);
    assertFrozenRecord(record, record.universe);
    assert.strictEqual(PORTAL_VISUALS_BY_UNIVERSE[record.universe], record);
    assert.strictEqual(getPortalVisual(record.universe), record);
    const resolved = resolvePortalVisual(record.universe);
    assertFrozenRecord(resolved, `${record.universe} resolved`);
    assert.notStrictEqual(resolved, record);
    assert.equal(resolved.universe, record.universe);
    assert.equal(resolved.status, 'approved');
    assert.equal(resolved.isFallback, false);
    assert.strictEqual(resolved.atlas, record.atlas);
    assert.strictEqual(resolved.review, record.review);
  }
});

test('unknown universe resolves to the immutable Nexus production fallback', () => {
  const requestedUniverse = 'QA Missing Continuity';
  assert.equal(getPortalVisual(requestedUniverse), null);
  assertFrozenRecord(PORTAL_FALLBACK_VISUAL, 'Nexus fallback');
  assert.equal(PORTAL_FALLBACK_VISUAL.universe, 'Nexus de Convergence');
  assert.equal(PORTAL_FALLBACK_VISUAL.status, 'production');

  const resolved = resolvePortalVisual(requestedUniverse);
  assert.ok(Object.isFrozen(resolved));
  assert.equal(resolved.status, 'production');
  assert.equal(resolved.isFallback, true);
  assert.equal(resolved.requestedUniverse, requestedUniverse);
  assert.strictEqual(resolved.atlas, PORTAL_FALLBACK_VISUAL.atlas);
  assert.strictEqual(resolved.review, PORTAL_FALLBACK_VISUAL.review);
  assert.strictEqual(resolved.palette, PORTAL_FALLBACK_VISUAL.palette);
});

test('portal phases select the four progressive atlas cells', () => {
  assert.equal(getPortalFrameForPhase('sealed'), 0);
  assert.equal(getPortalFrameForPhase('charging'), 1);
  assert.equal(getPortalFrameForPhase('cutting'), 2);
  assert.equal(getPortalFrameForPhase('opening'), 2);
  assert.equal(getPortalFrameForPhase('revealing'), 3);
  assert.equal(getPortalFrameForPhase('complete'), 3);
});

test('portal catalog rejects mutation attempts', () => {
  const record = PORTAL_VISUAL_MANIFEST[0];
  assert.throws(() => {
    PORTAL_VISUAL_MANIFEST.push(record);
  }, TypeError);
  assert.throws(() => {
    record.status = 'production';
  }, TypeError);
  assert.throws(() => {
    record.atlas.frames = 1;
  }, TypeError);
  assert.throws(() => {
    record.palette.push('chroma green');
  }, TypeError);
});
