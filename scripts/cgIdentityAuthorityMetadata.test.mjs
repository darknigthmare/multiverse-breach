import assert from 'node:assert/strict';
import test from 'node:test';
import { getCgPilotAuthority, getCgPilotWorldAuthority, CG_PILOT_EQUIPMENT_MISSING } from './cgIdentityAuthorityMetadata.mjs';
import { evidenceForSubject } from './buildCgRosterProductionPlan.mjs';

const runtime = { id: 'masterchief', name: 'Master Chief', universe: 'Halo', incarnation: 'Halo 3 — John-117',
  visualAnchor: 'Halo 3 Mark VI armour', equipment: ['MA5C'], referenceUrls: ['https://example.test/halo3'], referenceUrl: 'https://example.test/halo3' };
const pilot = { characterId: 'masterchief', continuityId: 'halo-infinite-gen3', promptSummary: 'John-117 wearing his Halo Infinite GEN3 armour.',
  sourceRefs: ['https://example.test/halo-infinite-cg-pilot'] };

test('historical Halo Infinite CG keeps its authority and cannot borrow Halo 3 equipment', () => {
  const result = evidenceForSubject(runtime, null, pilot, false, [], null);
  assert.equal(result.incarnation, 'halo-infinite-gen3');
  assert.equal(result.identityLock, pilot.promptSummary);
  assert.deepEqual(result.equipment, []);
  assert.ok(result.missing.includes(CG_PILOT_EQUIPMENT_MISSING));
  assert.deepEqual(result.currentRuntimeSource.equipment, ['MA5C']);
  assert.deepEqual(result.sourceRefs, pilot.sourceRefs);
  assert.deepEqual(result.currentRuntimeSource.referenceUrls, ['https://example.test/halo3']);
  assert.equal(result.currentRuntimeSource.incarnation, runtime.incarnation);
  assert.equal(result.currentRuntimeSource.authority, false);
  assert.equal(result.currentRuntimeSource.visualFidelityApproved, false);
  assert.equal(result.visualFidelityApproved, false);
});

test('same-edition structured CG equipment is retained instead of taking runtime defaults', () => {
  const authority = getCgPilotAuthority({ ...runtime, incarnation: 'halo-infinite-gen3' }, { ...pilot, equipment: ['MA40 — pilot authority'] });
  assert.deepEqual(authority.equipment, ['MA40 — pilot authority']);
  assert.equal(authority.equipmentMissing, false);
  assert.deepEqual(authority.currentRuntimeSource.equipment, ['MA5C']);
  assert.equal(authority.currentRuntimeSource.authority, false);
});

test('incomplete CG authority leaves equipment unknown even when edition labels agree', () => {
  const authority = getCgPilotAuthority({ ...runtime, incarnation: pilot.continuityId }, pilot);
  assert.deepEqual(authority.equipment, []);
  assert.equal(authority.equipmentMissing, true);
  assert.deepEqual(getCgPilotWorldAuthority(authority), { sourceWork: pilot.continuityId, period: pilot.continuityId,
    locations: [], architecture: [], palette: [], props: [], boundaries: [
      'Cible historique du pilote CG : les lieux, matières et accessoires de cette édition restent à attester avec une référence propre à ce pilote.',
      'La déclaration actuelle du héros runtime est conservée séparément avec authority:false ; elle ne renseigne pas le décor ou l’équipement de l’image CG historique.' ] });
});

test('qualified identity without equipment cannot borrow a runtime weapon', () => {
  const qualified = { incarnation: 'qualified exact edition', visualAnchor: 'Inspected exact-edition identity lock',
    sourceEvidenceFiles: [], referenceUrls: [], identityVisualReferences: [], evidenceStatus: 'reference-ready' };
  const result = evidenceForSubject(runtime, null, null, false, [], qualified);
  assert.deepEqual(result.equipment, []);
  assert.equal(result.incarnation, qualified.incarnation);
  assert.equal(result.currentRuntimeSource, undefined);
  assert.equal(result.visualFidelityApproved, false);
});

test('a pilot without an explicit runtime edition has no invented runtime authority', () => {
  const authority = getCgPilotAuthority({ id: 'fixture', universe: 'Fixture', equipment: ['unscoped gameplay sword'] }, pilot);
  assert.equal(authority.currentRuntimeSource, null);
  assert.equal(getCgPilotWorldAuthority(authority), null);
});
