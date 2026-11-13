import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { register } from 'node:module';
import test from 'node:test';
import { CG_PILOT_EQUIPMENT_MISSING } from './cgIdentityAuthorityMetadata.mjs';
register('./sourceSceneTestLoader.mjs', import.meta.url);
const { HEROES_DB } = await import('../src/game/heroes.js');
const { CG_CATALOG } = await import('../src/game/cg/cgCatalog.js');
const bible = JSON.parse(readFileSync(new URL('../docs/cg/roster-fidelity-bible-2026-10-18.json', import.meta.url)));

for (const id of ['masterchief', 'arbiter']) test(`${id}: actual Bible keeps the historical CG authority apart from the current runtime edition`, () => {
  const actual = bible.subjects.find(subject => subject.characterId === id);
  const pilot = CG_CATALOG.find(entry => entry.characterId === id && entry.type === 'characterSolo');
  const runtime = HEROES_DB.find(hero => hero.id === id);
  assert.equal(actual.incarnation.label, pilot.continuityId);
  assert.equal(actual.identityLock, typeof pilot.promptSummary === 'string' ? pilot.promptSummary : pilot.promptSummary.fr || pilot.promptSummary.en);
  assert.deepEqual(actual.visualLocks.equipment, [CG_PILOT_EQUIPMENT_MISSING]);
  assert.ok(actual.readiness.missing.includes(CG_PILOT_EQUIPMENT_MISSING));
  assert.equal(actual.readiness.visualFidelityApproved, false);
  assert.equal(actual.qualificationStatus, 'published-pilot-target-needs-edition-specific-source-comparison');
  assert.equal(actual.currentRuntimeSource.actorId, id);
  assert.equal(actual.currentRuntimeSource.universe, runtime.universe);
  assert.equal(actual.currentRuntimeSource.incarnation, runtime.incarnation);
  assert.deepEqual(actual.currentRuntimeSource.equipment, runtime.equipment);
  assert.deepEqual(actual.currentRuntimeSource.referenceUrls, [...new Set([...(runtime.referenceUrls || []), runtime.referenceUrl].filter(Boolean))]);
  assert.equal(actual.currentRuntimeSource.authority, false);
  assert.equal(actual.currentRuntimeSource.visualFidelityApproved, false);
  assert.equal(actual.universeCoherence.sourceWork, pilot.continuityId);
  for (const field of ['locations', 'architecture', 'palette', 'props']) assert.deepEqual(actual.universeCoherence[field], []);
  assert.deepEqual(actual.sourceRefs.filter(reference => reference.role === 'historical-cg-pilot-target-reference').map(reference => reference.url || reference.path), pilot.sourceRefs);
  assert.deepEqual(actual.sourceRefs.filter(reference => reference.role === 'current-runtime-declaration-not-cg-identity-authority').map(reference => reference.url || reference.path), actual.currentRuntimeSource.referenceUrls);
  assert.ok(actual.sourceRefs.filter(reference => reference.role === 'current-runtime-declaration-not-cg-identity-authority').every(reference => reference.authority === false));
  assert.ok(actual.localVisuals.filter(reference => reference.role === 'current-runtime-reference-not-historical-cg-authority').every(reference => reference.authority === false && reference.usedForCgIdentity === false));
  assert.equal(actual.localVisuals.some(reference => reference.role === 'independent-canon-reference'), false,
    'runtime reference qualification cannot establish identity for the historical CG edition');
});
