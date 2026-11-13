import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { HEROES_DB } from '../src/game/heroes.js';
import { getQuarantinedCanonSprite, QUARANTINED_CANON_SPRITES } from '../src/game/canonicalSpriteQuarantine.js';
import { getHeroSpriteSheetSrc } from '../src/game/spriteAssets.js';
import { evidenceForSubject } from './buildCgRosterProductionPlan.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const loader = fileURLToPath(new URL('./sourceSceneTestLoader.mjs', import.meta.url));
const bible = fileURLToPath(new URL('./buildCgRosterFidelityBible.mjs', import.meta.url));

for (const [id, record] of Object.entries(QUARANTINED_CANON_SPRITES)) {
  test(`${id}: exact runtime quarantine remains OLD in plan and Bible`, () => {
    const hero = HEROES_DB.find(candidate => candidate.id === id);
    assert.deepEqual(getQuarantinedCanonSprite(hero), record);
    assert.ok(!getHeroSpriteSheetSrc(hero), 'The runtime getter must select no bitmap');
    const identity = evidenceForSubject(hero, { candidatsReferencesLocalesAudit: [record.asset] });
    assert.deepEqual(identity.runtimeSpriteQuarantine, { characterId: id, ...record });
    assert.equal(identity.incarnation, record.incarnation);
    assert.equal(identity.visualFidelityApproved, false);
    assert.equal(identity.evidenceStatus, 'needs-reference');
    assert.equal(identity.identityVisualReferences, undefined);
    assert.equal(identity.localCandidates.find(candidate => candidate.path === record.asset).archivalOnly, true);
    const dossier = JSON.parse(execFileSync(process.execPath, ['--loader', loader, bible, '--inspect', id], {
      cwd: root, encoding: 'utf8', maxBuffer: 2 * 1024 * 1024
    }));
    assert.deepEqual(dossier.runtimeSpriteQuarantine, { characterId: id, ...record });
    assert.equal(dossier.readiness.currentSprite.selectedInRuntime, false);
    assert.equal(dossier.readiness.visualFidelityApproved, false);
    const old = dossier.localVisuals.find(candidate => candidate.path === record.asset);
    assert.ok(old.exists, 'Archival bitmap stays available');
    assert.equal(old.archivalOnly, true);
    assert.equal(old.selectedInRuntime, false);
    assert.match(old.status, /^OLD-quarantined/);
    assert.ok(dossier.localVisuals.every(candidate => !candidate.selectedInRuntime));
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
