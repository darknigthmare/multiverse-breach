import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { HEROES_DB } from '../src/game/heroes.js';
import { getQuarantinedCanonSprite, QUARANTINED_CANON_SPRITES } from '../src/game/canonicalSpriteQuarantine.js';
import { getHeroSpriteSheetSrc, getReviewedQuarantinedHeroSprite } from '../src/game/spriteAssets.js';
import { evidenceForSubject } from './buildCgRosterProductionPlan.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const loader = fileURLToPath(new URL('./sourceSceneTestLoader.mjs', import.meta.url));
const bible = fileURLToPath(new URL('./buildCgRosterFidelityBible.mjs', import.meta.url));

for (const [id, record] of Object.entries(QUARANTINED_CANON_SPRITES)) {
  test(`${id}: rejected original stays OLD while a bounded reviewed correction is tracked separately`, () => {
    const hero = HEROES_DB.find(candidate => candidate.id === id);
    assert.deepEqual(getQuarantinedCanonSprite(hero), record);
    const correction = getReviewedQuarantinedHeroSprite(hero);
    if (id === 'darth_revan') {
      assert.equal(correction?.sheet, '/sprites/generated/combat-character-corrections-wave13-part-b/darth_revan.png');
      assert.equal(correction.sha256, 'c9f46d3fc0e0144afab53632c1be6d07508975645b2b2bfff30478e5e5fb1fbf');
      assert.equal(correction.incarnation, record.incarnation);
      assert.equal(getHeroSpriteSheetSrc(hero), correction.sheet);
      assert.notEqual(getHeroSpriteSheetSrc(hero), record.asset, 'the rejected dual-saber original is still unavailable');
    } else assert.ok(!getHeroSpriteSheetSrc(hero), 'Other quarantined actors still select no bitmap');
    const identity = evidenceForSubject(hero, { candidatsReferencesLocalesAudit: [record.asset] });
    assert.deepEqual(identity.runtimeSpriteQuarantine, { characterId: id, ...record });
    if (correction) {
      assert.equal(identity.runtimeSpriteCorrection.path, correction.sheet);
      assert.equal(identity.runtimeSpriteCorrection.sha256, correction.sha256);
      assert.equal(identity.runtimeSpriteCorrection.selectedInRuntime, true);
      assert.equal(identity.runtimeSpriteCorrection.visualFidelityApproved, false);
      assert.equal(identity.runtimeSpriteCorrection.canonicalFidelityApproved, false);
    }
    assert.equal(identity.incarnation, record.incarnation);
    assert.equal(identity.visualFidelityApproved, false);
    assert.equal(identity.evidenceStatus, 'needs-reference');
    assert.equal(identity.identityVisualReferences, undefined);
    assert.equal(identity.localCandidates.find(candidate => candidate.path === record.asset).archivalOnly, true);
    const dossier = JSON.parse(execFileSync(process.execPath, ['--loader', loader, bible, '--inspect', id], {
      cwd: root, encoding: 'utf8', maxBuffer: 2 * 1024 * 1024
    }));
    assert.deepEqual(dossier.runtimeSpriteQuarantine, { characterId: id, ...record });
    if (correction) {
      assert.equal(dossier.readiness.currentSprite.path, correction.sheet);
      assert.equal(dossier.readiness.currentSprite.sha256, correction.sha256);
      assert.equal(dossier.readiness.currentSprite.selectedInRuntime, true);
      assert.equal(dossier.readiness.currentSprite.visualFidelityApproved, false);
      assert.equal(dossier.readiness.currentSprite.canonicalFidelityApproved, false);
      assert.equal(dossier.readiness.currentSprite.fullSource1to1Verified, false);
    } else assert.equal(dossier.readiness.currentSprite.selectedInRuntime, false);
    assert.equal(dossier.readiness.visualFidelityApproved, false);
    const old = dossier.localVisuals.find(candidate => candidate.path === record.asset);
    assert.ok(old.exists, 'Archival bitmap stays available');
    assert.equal(old.archivalOnly, true);
    assert.equal(old.selectedInRuntime, false);
    assert.match(old.status, /^OLD-quarantined/);
    if (correction) {
      const selected = dossier.localVisuals.find(candidate => candidate.path === correction.sheet);
      assert.equal(selected?.selectedInRuntime, true);
      assert.equal(selected.archivalOnly, false);
      assert.equal(selected.runtimeEligible, true);
    } else assert.ok(dossier.localVisuals.every(candidate => !candidate.selectedInRuntime));
  });
}

test('the same ID in another universe or incarnation receives no quarantine annotations', () => {
  const hero = HEROES_DB.find(candidate => candidate.id === 'ahsoka');
  for (const other of [{ ...hero, universe: 'Other universe' }, { ...hero, incarnation: 'Other incarnation' },
    { ...hero, id: 'other_actor' }]) {
    const identity = evidenceForSubject(other, { candidatsReferencesLocalesAudit: ['/sprites/historical.png'] });
    assert.equal(identity.runtimeSpriteQuarantine, undefined);
    assert.equal(identity.localCandidates[0].archivalOnly, undefined);
    assert.equal(identity.localCandidates[0].runtimeEligible, undefined);
  }
});
