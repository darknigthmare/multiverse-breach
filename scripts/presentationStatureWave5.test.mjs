import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { createServer } from 'vite';
import { HEROES_DB } from '../src/game/heroes.js';
import { getCharacterAnimationAssets } from '../src/game/combat/characterAnimationCatalog.js';

let vite, drawPixelSprite, originalImage;
before(async () => {
  originalImage = globalThis.Image;
  globalThis.Image = class {
    complete = true; naturalWidth = 1024; naturalHeight = 2048;
    set src(value) { this.currentSrc = value; this.onload?.(); }
  };
  vite = await createServer({ root: fileURLToPath(new URL('..', import.meta.url)), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ drawPixelSprite } = await vite.ssrLoadModule('/src/game/renderer.js'));
});
after(async () => { globalThis.Image = originalImage; await vite?.close(); });

const draw = (asset, phase, col, facing) => {
  const calls = [], scales = [];
  const ctx = new Proxy({ drawImage: (...args) => calls.push(args), scale: (...args) => scales.push(args) }, {
    get: (target, key) => key in target ? target[key] : () => {}, set: () => true
  });
  const actor = { ...HEROES_DB.find(hero => hero.id === asset.heroId), state: 'idle', presentationPhase: phase,
    presentationProgress: [0.01, 0.3, 0.6, 0.99][col], presentationImpactProgress: 0.5 };
  const before = JSON.stringify(actor);
  drawPixelSprite(ctx, 500, 500, actor, 1000, facing, 256, 'melee');
  assert.equal(JSON.stringify(actor), before);
  assert.equal(calls.length, 1);
  assert.equal(scales.at(-1)[0], facing);
  return calls[0];
};

test('measured standing bodies keep their stature when a large weapon or VFX expands the source row', () => {
  const historical = JSON.parse(readFileSync(new URL('../docs/combat-fidelity-wave5-2026-10-20/current.json', import.meta.url)));
  const keys = new Set(historical.meleeBindings.nativeStatureCorrections.map(row => `${row.heroId}:${row.row}`));
  const corrected = getCharacterAnimationAssets().flatMap(asset => (asset.normalization?.rows || []).flatMap((row, index) =>
    row.statureReview && keys.has(`${asset.heroId}:${index}`) ? [{ asset, row, index, phase: Object.keys(asset.phases).find(phase => asset.phases[phase].row === index) }] : []));
  assert.equal(corrected.length, 28, 'all28 historical Wave5 measurements must remain reachable');
  for (const id of ['doom_marine_classic', 'doomslayer', 'leon', 'arca_bastion'])
    assert.ok(corrected.some(entry => entry.asset.heroId === id && entry.phase === 'super'), `${id}: missing measured super stature`);
  for (const { asset, row, index, phase } of corrected) {
    const review = row.statureReview;
    assert.equal(review.measurementKind, 'visual-body-roi');
    assert.equal(review.excludesWeaponEffects, true);
    assert.ok(row.renderScale >= 0.5 && row.renderScale <= 3);
    assert.ok(review.bodyBounds.length === 4 && review.referenceBodyBounds.length === 4);
    assert.ok(Math.abs(review.bodyBounds[3] - review.normalizedBodyHeight) <= 1);
    assert.ok(Math.abs(review.referenceBodyBounds[3] - review.referenceBodyHeight) <= 1);
    const source = readFileSync(new URL(`../public${asset.sheet}`, import.meta.url));
    assert.equal(source.readUInt32BE(16), 1024); assert.equal(source.readUInt32BE(20), 2048);
    for (const facing of [1, -1]) {
      const [, sx, sy, sw, sh, dx, dy, dw, dh] = draw(asset, phase, review.sourceComparableColumn, facing);
      assert.equal(sx, review.sourceComparableColumn * 256); assert.equal(sy, index * 256);
      assert.deepEqual([sw, sh], [256, 256], 'the full native source cell remains visible');
      const expectedHeight = review.referenceBodyHeight * review.nativeComparableBodyHeight / review.nativeReferenceBodyHeight * (review.referenceRenderScale ?? 1);
      assert.ok(Number.isFinite(expectedHeight) && expectedHeight > 0);
      assert.ok(Math.abs(review.normalizedBodyHeight * dh / sh - expectedHeight) <= 2, `${asset.heroId}:${phase}: body still shrank`);
      assert.ok(Math.abs(dy + 244 * dh / 256) < 0.0001, 'feet moved away from their baseline');
      assert.equal(dw, dh); assert.equal(dx, -dw / 2);
    }
  }
});

test('the35 historical native presentation sheets keep their exact drawing scale', () => {
  const baseline = JSON.parse(readFileSync(new URL('../docs/combat-fidelity-wave5-2026-10-20/runtime-baseline.json', import.meta.url)));
  for (const old of baseline.assets) {
    const asset = getCharacterAnimationAssets().find(asset => asset.heroId === old.heroId);
    const args = draw(asset, 'intro', 0, 1);
    assert.deepEqual(args.slice(5), [-128, -244, 256, 256]);
  }
});
