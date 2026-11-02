import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import registry from '../src/game/combat/characterActionAnimationsWave16PartC.generated.json' with { type: 'json' };
import { createSourceBladeProjectorWave16, projectSourceBladeContactWave16 as project,
  intersectsSourceBladeHurtboxWave16 as intersects } from '../src/game/combat/combatBladeContactWave16.js';

const actor = () => ({ id: 'kirito_sao', universe: 'Sword Art Online', x: 100, y: 200, facing: 1 });
const profile = () => ({ sourceHeroId: 'kirito_sao', universe: 'Sword Art Online', name: 'Starburst Stream',
  effect: 'damage', delivery: 'melee', duration: 3.5, hitSequence: {
    kind: 'starburst-stream', hitCount: 16, firstAt: .8, lastAt: 3.05, releaseWindow: .09
  } });
const asset = registry.entries.find(entry => entry.id === 'kirito-starburst-stream-wave16');
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} differs from ${b}`);

test('all sixteen real contact clocks select sixteen different native cells and measured primary blades', () => {
  assert.ok(asset, 'The actual Kirito16 source registry must be delivered');
  const cells = new Set(), blades = new Set();
  for (let index = 0; index < 16; index++) {
    const result = project(actor(), profile(), .8 + index * .15, 256);
    assert.ok(result); assert.equal(result.index, index);
    assert.equal(result.row, Math.floor(index / 4)); assert.equal(result.col, index % 4);
    assert.deepEqual(result.nativePoint, asset.contactAnchors[index].point);
    assert.deepEqual(result.sourcePoint, asset.contactAnchors[index].sourcePoint);
    assert.equal(result.blade, asset.contactAnchors[index].blade);
    assert.equal(result.sheetSha256, asset.sha256);
    assert.equal(result.sourceImageSha256, asset.sourceImageSha256);
    cells.add(`${result.frame.sx}:${result.frame.sy}`); blades.add(result.blade);
  }
  assert.equal(cells.size, 16); assert.deepEqual([...blades].sort(), ['dark-repulser', 'elucidator']);
  assert.equal(project(actor(), profile(), .95 - .0001, 256).index, 0);
  assert.equal(project(actor(), profile(), .95, 256).index, 1);
  assert.equal(project(actor(), profile(), 3.139, 256).index, 15);
});

test('the real source and packed PNG SHA match and all32 blade points touch visible native metal pixels', async () => {
  const root = new URL('../', import.meta.url), packed = fs.readFileSync(new URL('public' + asset.sheet, root));
  const original = fs.readFileSync(new URL(asset.sourceImage, root));
  const hash = bytes => createHash('sha256').update(bytes).digest('hex');
  assert.equal(hash(packed), asset.sha256); assert.equal(hash(original), asset.sourceImageSha256);
  const p = await sharp(packed).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const s = await sharp(original).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (const anchor of asset.contactAnchors) for (const measurement of [anchor, anchor.otherBlade]) {
    const x = anchor.col * 256 + measurement.point.x, y = anchor.row * 256 + measurement.point.y;
    assert.ok(p.data[(y * p.info.width + x) * 4 + 3] > 24, `Packed metal missing at contact${anchor.index}`);
    assert.ok(s.data[(measurement.sourcePoint.y * s.info.width + measurement.sourcePoint.x) * 4 + 3] > 24,
      `Source metal missing at contact${anchor.index}`);
  }
});

test('ground registration, row scale, translation and both facing directions preserve exact physical projection', () => {
  const right = project(actor(), profile(), .8, 256);
  close(right.x, 231.1296913893567); close(right.y, 88.19468418381165);
  const left = project({ ...actor(), facing: -1 }, profile(), .8, 256);
  close(right.x + left.x, 200); close(right.y, left.y);
  close(right.otherBlade.x + left.otherBlade.x, 200);
  const shifted = project({ ...actor(), x: 400, y: 700 }, profile(), .8, 256);
  close(shifted.x - right.x, 300); close(shifted.y - right.y, 500);
  const doubled = project(actor(), profile(), .8, 512);
  close(doubled.x - 100, (right.x - 100) * 2); close(doubled.y - 200, (right.y - 200) * 2);
  const actionFacing = project({ ...actor(), facing: -1, action: { facing: 1 } }, profile(), .8, 256);
  close(actionFacing.x, right.x);
  assert.equal(right.baseline, 244); assert.equal(right.contactGeometry, 'measured-primary-blade-tip');
});

test('hurtbox contact uses the engine rectangle exactly, including edges and rejecting even a small real gap', () => {
  const p = project(actor(), profile(), .8, 256);
  assert.equal(intersects(p, { x: p.x - 1, y: p.y - 1, width: 2, height: 2 }), true);
  assert.equal(intersects(p, { x: p.x, y: p.y, w: 1, h: 1 }), true);
  assert.equal(intersects(p, { left: p.x - 1, top: p.y - 1, right: p.x, bottom: p.y }), true);
  assert.equal(intersects(p, { x: p.x + 1e-6, y: p.y - 10, width: 50, height: 20 }), false);
  assert.equal(intersects(p, { x: p.x - 10, y: p.y + 1e-6, width: 20, height: 50 }), false);
  for (const box of [null, {}, { x: 0, y: 0, width: -1, height: 1 },
    { x: 0, y: 0, width: 0, height: 1 }, { left: 0, top: 0, right: Infinity, bottom: 20 }])
    assert.equal(intersects(p, box), false);
});

test('two measured sword tips cannot become an invented segment or a second automatic contact', () => {
  const p = project(actor(), profile(), .8, 256);
  const midpoint = { x: (p.x + p.otherBlade.x) / 2, y: (p.y + p.otherBlade.y) / 2 };
  assert.equal(intersects(p, { x: midpoint.x - 2, y: midpoint.y - 2, width: 4, height: 4 }), false);
  assert.equal(intersects(p, { x: p.otherBlade.x - 2, y: p.otherBlade.y - 2, width: 4, height: 4 }), false);
  assert.equal(p.hiltPoint, undefined); assert.equal(p.segment, undefined);
});

test('aliases, foreign universes, support, other actions and changed schedules never acquire source blade coordinates', () => {
  for (const change of [{ sourceHeroId: 'kirito' }, { universe: 'ALO' }, { name: 'Other action' },
    { effect: 'buff' }, { delivery: 'beam' }, { hitSequence: { ...profile().hitSequence, hitCount: 4 } },
    { hitSequence: { ...profile().hitSequence, firstAt: .9 } },
    { hitSequence: { ...profile().hitSequence, releaseWindow: .1 } }])
    assert.equal(project(actor(), { ...profile(), ...change }, 1, 256), null);
  assert.equal(project({ ...actor(), id: 'another' }, profile(), 1, 256), null);
  assert.equal(project({ ...actor(), universe: 'Other' }, profile(), 1, 256), null);
  for (const elapsed of [-1, .799999, 3.14, Infinity, NaN]) assert.equal(project(actor(), profile(), elapsed, 256), null);
  for (const height of [0, -1, Infinity, NaN]) assert.equal(project(actor(), profile(), 1, height), null);
  assert.equal(project({ ...actor(), x: NaN }, profile(), 1, 256), null);
  assert.equal(project(null, profile(), 1, 256), null);
  assert.equal(intersects(null, { x: 0, y: 0, width: 10, height: 10 }), false);
});

test('missing or incompletely reviewed registries return null instead of a fabricated actor-center anchor', () => {
  for (const missing of [undefined, {}, { entries: [] }, { entries: {} }])
    assert.equal(createSourceBladeProjectorWave16(missing)(actor(), profile(), 1, 256), null);
  const alterations = [entry => { entry.contactAnchors.pop(); },
    entry => { entry.contactAnchors[0].visuallyReviewed = false; },
    entry => { entry.contactAnchors[0].point = null; },
    entry => { entry.contactAnchors[0].otherBlade.point.x = 256; },
    entry => { entry.normalization.rows[0].renderScale = NaN; },
    entry => { entry.contactAnchors = new Array(16); },
    entry => { entry.sha256 = ''; }];
  for (const alter of alterations) {
    const clone = structuredClone(asset); alter(clone);
    assert.equal(createSourceBladeProjectorWave16({ entries: [clone] })(actor(), profile(), 1, 256), null);
  }
});

test('projection and collision do not mutate an accepted action, pose evidence, HP, resources or actor position', () => {
  const a = { ...actor(), hp: 50, meter: 100, action: { facing: 1, elapsed: .8, sequenceCursor: 0 } }, p = profile();
  const before = JSON.stringify({ a, p, asset }); Object.freeze(a.action); Object.freeze(a); Object.freeze(p);
  const result = project(a, p, .8, 256);
  intersects(result, { x: result.x - 1, y: result.y - 1, width: 2, height: 2 });
  result.nativePoint.x = -999; result.otherBlade.nativePoint.y = -999;
  assert.equal(JSON.stringify({ a, p, asset }), before);
  assert.equal(project(a, p, .8, 256).nativePoint.x, asset.contactAnchors[0].point.x);
  assert.equal(result.gameplayEffect, 'none');
});
