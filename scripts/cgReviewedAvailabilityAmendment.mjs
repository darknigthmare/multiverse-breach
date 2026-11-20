import assert from 'node:assert/strict';
import { readCgRiftDossiers } from './cgHistoricalRiftEvidence.mjs';
import { createHash } from 'node:crypto';
import { lstatSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { hasCgIdentityPurpose, isCgReferenceImageAttested } from './cgSourceEvidence.mjs';

export const CG_REVIEWED_AVAILABILITY_AMENDMENT_PATH = 'scripts/fixtures/cg-reviewed-availability-amendment-2026-11-13.json';
export const CG_REVIEWED_AVAILABILITY_AMENDMENT_SHA256 = '65fd79dc231ab247c15fc788b50e4edf7645bfff61cdb60610761aec6196699f';
const historicalSha256 = 'ce0e0a87c4308f39207b550721b94a1c6cd117775be853ba93f2336863b6132e';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const pick = (object, fields) => Object.fromEntries(fields.filter(key => Object.hasOwn(object, key)).map(key => [key, object[key]]));
const exact = (actual, expected, message) => assert.deepEqual(actual, expected, message);
const historicalKeyOrder = (current, historical) => Object.fromEntries([
  ...Object.keys(historical).filter(key => Object.hasOwn(current, key)),
  ...Object.keys(current).filter(key => !Object.hasOwn(historical, key))
].map(key => [key, current[key]]));
/** Technical reader shared by the closed amendment and small synthetic tests. */
export function inspectCgHistoricalImageAvailability(root, pin) {
  assert.ok(pin && typeof pin.path === 'string' && /^public\/images\/[A-Za-z0-9_./-]+\.png$/.test(pin.path)
    && !pin.path.split('/').some(part => !part || part === '.' || part === '..'), 'Unsafe historical image path');
  assert.match(pin.sha256 || '', /^[a-f0-9]{64}$/, 'Historical image requires an exact SHA-256');
  assert.ok(Number.isSafeInteger(pin.bytes) && pin.bytes > 0 && pin.bytes <= 64 * 1024 * 1024, 'Historical image requires an exact bounded byte count');
  assert.ok(pin.format === 'PNG' && Number.isSafeInteger(pin.width) && pin.width > 0
    && Number.isSafeInteger(pin.height) && pin.height > 0, 'Historical image requires exact PNG dimensions');
  let file = path.resolve(root);
  for (const [index, component] of pin.path.split('/').entries()) {
    file = path.join(file, component);
    let info;
    try { info = lstatSync(file); }
    catch (error) { if (error.code === 'ENOENT') return { available: false, reason: 'absent' }; throw error; }
    assert.equal(info.isSymbolicLink(), false, 'Historical image path must not contain a symlink');
    assert.ok(index === pin.path.split('/').length - 1 ? info.isFile() : info.isDirectory(), 'Historical image must have regular directory ancestors and file');
  }
  const available = isCgReferenceImageAttested(root, { ...pin, path: pin.path, format: pin.format.toLowerCase() });
  return { available, reason: available ? 'attested' : 'unattested' };
}

/** No plan mutation or authority is granted by this small branch selector. */
export function deriveCgAvailabilityIdentity({ historicalIdentity, fallbackIdentity, availableIdentityReferences }) {
  assert.ok(availableIdentityReferences.every(hasCgIdentityPurpose), 'Costume support cannot establish identity');
  return availableIdentityReferences.length
    ? { ...historicalIdentity, identityVisualReferences: availableIdentityReferences }
    : structuredClone(fallbackIdentity);
}

// The caller must retain its complete historical serialization/report check
// after this narrow projection. Unrelated fields are preserved, not reset.
export function projectCgReviewedAvailabilityAmendment({ root, published, projected, heroes, catalog }) {
  const bytes = readFileSync(path.join(root, CG_REVIEWED_AVAILABILITY_AMENDMENT_PATH));
  assert.equal(digest(bytes), CG_REVIEWED_AVAILABILITY_AMENDMENT_SHA256, 'Closed CG availability amendment changed; append a reviewed amendment');
  const contract = JSON.parse(bytes);
  const publishedBytes = readFileSync(path.join(root, 'docs/cg/roster-production-2026-10-18.json'));
  assert.equal(digest(publishedBytes), historicalSha256, 'Historical CG plan pin must remain unchanged');
  exact(published, JSON.parse(publishedBytes), 'Historical CG plan object changed');
  assert.equal(contract.schemaVersion, 1);
  assert.equal(contract.identityAuthority, false);
  assert.equal(contract.changesGenerationHistory, false);
  assert.equal(contract.historicalPlanSha256, historicalSha256);
  assert.equal(contract.subjectCount, 58);
  assert.equal(contract.cases.length, 58);
  const dossiers = new Map(readCgRiftDossiers(root).map(item => [item.id, item]));
  const p0 = JSON.parse(readFileSync(path.join(root, 'docs/audits/fidelity-p0-wave4-2026-10-01.json'))).entries;
  const result = { ...projected, subjects: projected.subjects.slice(), entries: projected.entries.slice() };
  const negative = [], hydrated = [], verifiedImages = new Map(), seen = new Set();
  for (const entry of contract.cases) {
    assert.equal(seen.has(entry.characterId), false, 'Duplicate CG availability owner');
    seen.add(entry.characterId);
    const historical = published.subjects[entry.subjectIndex], current = projected.subjects[entry.subjectIndex];
    for (const subject of [historical, current]) {
      assert.equal(subject?.characterId, entry.characterId, 'CG availability owner or order changed');
      assert.equal(subject.universe, entry.universe, 'CG availability universe changed');
      assert.equal(subject.characterArcStageId, entry.characterArcStageId, 'CG availability source stage changed');
    }
    assert.equal(digest(JSON.stringify(historical.identity)), entry.historicalIdentitySha256, 'Historical CG identity changed');
    const hero = heroes.find(item => item.id === entry.characterId), dossier = dossiers.get(entry.characterArcStageId);
    assert.ok(hero && dossier, 'CG availability fallback source declarations missing');
    const pilot = catalog.find(item => item.characterId === entry.characterId && item.type === 'characterSolo');
    exact({ hero: pick(hero, contract.heroInputFields), dossier: pick(dossier, contract.dossierInputFields),
      pilot: pilot ? pick(pilot, contract.pilotInputFields) : null, p0: p0.some(item => item.id === entry.characterId) },
    entry.sourceInputs, `${entry.characterId}: CG availability public fallback inputs changed`);
    for (const receipt of entry.sourceReceipts) {
      assert.match(receipt.path, /^docs\/cg\/[A-Za-z0-9_./-]+\.json$/);
      assert.equal(receipt.path.split('/').includes('..'), false);
      const source = readFileSync(path.join(root, receipt.path));
      assert.equal(digest(source), receipt.sha256, `${entry.characterId}: CG source receipt changed`);
      const document = JSON.parse(source);
      assert.equal(document.characterId || document.heroId, entry.characterId, 'CG source receipt owner changed');
    }
    const available = [];
    for (const reference of historical.identity.identityVisualReferences) {
      if (!hasCgIdentityPurpose(reference)) continue;
      const pin = entry.identityImages.find(item => item.referencePath === reference.path && item.sha256 === reference.sha256);
      assert.ok(pin, `${entry.characterId}: historical identity image has no exact format/size receipt`);
      assert.equal(pin.path, reference.path.startsWith('/') ? 'public' + reference.path : reference.path, 'Historical reference and image ledger paths differ');
      const ledgerBytes = readFileSync(path.join(root, pin.ledgerReceipt.path));
      assert.equal(digest(ledgerBytes), pin.ledgerReceipt.sha256, 'Historical image ledger receipt changed');
      const ledger = JSON.parse(ledgerBytes);
      exact(pick(ledger.image, ['sha256', 'bytes', 'format', 'width', 'height']), pick(pin, ['sha256', 'bytes', 'format', 'width', 'height']), 'Historical image ledger metadata changed');
      assert.equal(ledger.repositoryPath, pin.path, 'Historical image ledger path changed');
      const key = JSON.stringify(pin);
      if (!verifiedImages.has(key)) verifiedImages.set(key, inspectCgHistoricalImageAvailability(root, pin));
      if (verifiedImages.get(key).available) available.push(reference);
    }
    const expected = deriveCgAvailabilityIdentity({ historicalIdentity: historical.identity, fallbackIdentity: entry.fallbackIdentity, availableIdentityReferences: available });
    exact(current.identity, expected, `${entry.characterId}: current identity must be the exact attested historical target or unqualified fallback`);
    assert.equal(current.identity.visualFidelityApproved, false, 'Availability cannot approve artwork fidelity');
    (available.length ? hydrated : negative).push(entry.characterId);
    result.subjects[entry.subjectIndex] = historicalKeyOrder({ ...current, identity: historical.identity }, historical);
    for (const cell of entry.unproducedCells) {
      const old = published.entries[cell.entryIndex], now = projected.entries[cell.entryIndex];
      for (const item of [old, now]) {
        assert.equal(item?.id, cell.entryId, 'CG availability entry order changed');
        assert.equal(item.characterId, entry.characterId);
        assert.equal(item.type, 'characterSolo');
        assert.equal(item.generatedImageCount, 0, 'Availability cannot project delivered artwork');
        assert.equal(item.status, 'needs-reference');
        assert.equal(item.galleryRegistered, false);
        assert.equal(item.currentAssets, null);
      }
      const expectedFields = available.length ? pick(old, contract.entryFields) : cell.fallback;
      exact(pick(now, contract.entryFields), expectedFields, `${entry.characterId}: unproduced CG01 dependency changed`);
      result.entries[cell.entryIndex] = historicalKeyOrder({ ...now, ...pick(old, contract.entryFields) }, old);
      const oldCell = historical.matrix.CG01, currentCell = current.matrix.CG01;
      assert.equal(currentCell.entryId, old.id);
      assert.equal(currentCell.generatedImageCount, 0);
      exact(currentCell.themeSource, expectedFields.themeSource, 'CG01 matrix must mirror its current unproduced entry');
      result.subjects[entry.subjectIndex] = { ...result.subjects[entry.subjectIndex], matrix: historicalKeyOrder({
        ...current.matrix, CG01: historicalKeyOrder({ ...currentCell, themeSource: oldCell.themeSource }, oldCell) }, historical.matrix) };
    }
  }
  return { projected: result, evidence: { mode: 'exact-historical-identity-image-availability',
    amendment: CG_REVIEWED_AVAILABILITY_AMENDMENT_PATH, amendmentSha256: digest(bytes),
    subjectsVerified: contract.cases.length, unavailableSubjects: negative, attestedHistoricalSubjects: hydrated,
    restrictiveIdentityUseSubjects: ['aura_7'], historicalImagePinsChecked: verifiedImages.size,
    attestedImageCount: [...verifiedImages.values()].filter(item => item.reason === 'attested').length,
    absentImageCount: [...verifiedImages.values()].filter(item => item.reason === 'absent').length,
    unattestedImageCount: [...verifiedImages.values()].filter(item => item.reason === 'unattested').length,
    deliveredImageChanges: 0, visualFidelityApproved: false, fullSource1to1Verified: false,
    historicalPlanPreserved: true, futureExactHydrationAllowed: true } };
}
