import assert from 'node:assert/strict';
import test from 'node:test';
import { getHeroById } from '../src/game/heroes.js';
import { resolvePresentationScript, samplePresentationScript } from '../src/game/combat/presentationCatalog.js';
import { REVIEWED_KOTOR_I_REVAN_CORRECTION as reviewed, getQuarantinedCanonSprite } from '../src/game/canonicalSpriteQuarantine.js';

const revan = getHeroById('darth_revan');

for (const phase of ['intro', 'outro', 'victory']) {
  test(`reviewed Revan has an explicit ${phase} clip on the accepted base16`, () => {
    const script = resolvePresentationScript(revan, phase);
    assert.ok(script, `${phase} must resolve the bounded reviewed presentation`);
    assert.equal(script.phase, phase);
    assert.equal(script.provenance.kind, 'reviewed-base16-presentation');
    assert.equal(script.provenance.canonicalSequence, false);
    assert.equal(script.provenance.fullSource1to1Verified, false);
    const samples = Array.from({ length: 61 }, (_, i) => samplePresentationScript(script, script.duration * i / 60));
    assert.ok(samples.every(sample => sample.asset.sheet === reviewed.sheet));
    assert.ok(samples.every(sample => sample.asset.rows === 4 && [0, 1].includes(sample.asset.row)));
    assert.ok(samples.every(sample => sample.asset.dedicatedPhaseAsset === false));
    assert.ok(samples.every(sample => sample.effect.kind === 'none' && sample.scale === 1));
    assert.ok(new Set(samples.map(sample => `${sample.asset.row}:${sample.asset.col}`)).size >= 4);
    if (phase === 'intro') {
      assert.ok(samples[0].x < samples.at(-1).x);
      assert.equal(samples.at(-1).x, 0);
      assert.equal(samples.at(-1).asset.row, 0);
    } else if (phase === 'outro') {
      assert.ok(samples.at(-1).x < samples[0].x - 100);
      assert.equal(samples.at(-1).facing, -1);
      assert.ok(samples.at(-1).opacity < 1);
    } else {
      assert.ok(samples.every(sample => sample.x === 0 && sample.y === 0));
      assert.ok(samples.every(sample => sample.asset.row === 0));
    }
  });
}

test('the new clips neither authorize another edition nor expose unreviewed W13 phase artwork', () => {
  for (const actor of [
    { ...revan, incarnation: 'Star Wars: Knights of the Old Republic II' },
    { ...revan, universe: 'Another universe' },
    { ...revan, sourceHeroId: 'ahsoka' },
    { ...revan, sourceId: 'luke' },
    { ...revan, sourceHeroId: {} },
    { ...revan, id: 'combat:revan:2', sourceHeroId: 'darth_revan' },
    { ...revan, incarnation: undefined }
  ]) {
    for (const phase of ['intro', 'outro', 'victory']) {
      const script = resolvePresentationScript(actor, phase);
      assert.notEqual(script?.provenance.kind, 'reviewed-base16-presentation');
      if (getQuarantinedCanonSprite(actor)) {
        assert.equal(script, null, 'the original rejected actor has no sample that can normalize and restore a body');
        assert.equal(samplePresentationScript(script, 0), null);
      }
      if (script) {
        const sample = samplePresentationScript(script, script.duration / 2);
        assert.notEqual(sample.asset.kind, 'reviewed-character-base16');
        assert.notEqual(sample.asset.sheet, reviewed.sheet);
      }
    }
  }
  for (const phase of ['fatality', 'defeat', 'roundVictory', 'roundDefeat', 'super']) {
    assert.equal(resolvePresentationScript(revan, phase), null, `${phase} is not silently delivered by reusing idle`);
  }
});

test('sampling is deterministic, clamps to the endpoints and leaves the source actor unchanged', () => {
  const actor = structuredClone(revan);
  const before = structuredClone(actor);
  const script = resolvePresentationScript(actor, 'intro');
  assert.ok(script);
  assert.deepEqual(samplePresentationScript(script, 0.45), samplePresentationScript(script, 0.45));
  const body = sample => ({ progress: sample.progress, x: sample.x, y: sample.y, asset: sample.asset });
  assert.deepEqual(body(samplePresentationScript(script, -2)), body(samplePresentationScript(script, 0)));
  assert.deepEqual(body(samplePresentationScript(script, script.duration + 2)), body(samplePresentationScript(script, script.duration)));
  assert.deepEqual(actor, before);
});
