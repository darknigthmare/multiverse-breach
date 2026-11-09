import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EQUIPMENT_ACTION_HEADERS as HEADERS,
  EQUIPMENT_PROGRESS_SCHEMA,
  parsePreviousActions,
  mergeEquipmentProgress,
} from './equipment_progress.mjs';

/** Small, independent dossiers keep preservation and identity cases readable. */
function action(id = 'actor:alpha', changes = {}) {
  return {
    id: `dossier:${id}`, priority: 'P1', name: id, universe: 'Univers test',
    type: 'Personnage', issue: 'Source à vérifier', action: 'Comparer le modèle',
    evidence: 'Modèle déclaré dans le jeu', observed: 'Ouvert', key: id,
    source: 'https://example.org/source', findingCount: 1, findingIds: `${id}:source`,
    ...changes,
  };
}

/** Produce the published worksheet shape, with an intentionally stale result. */
function row(record, status = 'À faire', proof = '', owner = '') {
  return [record.priority, record.name, record.universe, record.type, record.issue,
    record.action, record.evidence, record.observed, record.key, record.source,
    status, proof, owner, 'Résultat précédent ignoré', record.id,
    record.findingCount, record.findingIds];
}

/** Parse via the real boundary instead of hand-constructing normal-case snapshots. */
function snapshot(...rows) {
  return parsePreviousActions(HEADERS, rows);
}

test('all four manual statuses and exact input strings survive a row reorder', () => {
  const current = ['a', 'b', 'c', 'd'].map(id => action(`actor:${id}`));
  const statuses = ['À faire', 'En cours', 'À vérifier', 'Terminé'];
  const old = snapshot(...current.map((record, index) => row(record, statuses[index], `  preuve ${index}\r\n`, ` responsable ${index} `)));
  const before = JSON.stringify(old);
  const merged = mergeEquipmentProgress([...current].reverse(), old);
  assert.deepEqual(merged.records.map(record => record.status), [...statuses].reverse());
  assert.deepEqual(merged.records.map(record => record.proof), ['  preuve 3\r\n', '  preuve 2\r\n', '  preuve 1\r\n', '  preuve 0\r\n']);
  assert.equal(merged.records[0].owner, ' responsable 3 ');
  assert.deepEqual(merged.summary, { total: 4, previous: 4, new: 0, matched: 4, reopened: 0, retired: 0, completedWithProof: 1 });
  assert.equal(JSON.stringify(old), before);
  assert.equal(ownStatus(current[0]), false);
});

/** Detect accidental mutation of the caller's plain action objects. */
function ownStatus(record) { return Object.hasOwn(record, 'status'); }

test('headers are mapped by exact name even after every column is moved', () => {
  const record = action();
  const original = row(record, 'Terminé', 'preuve exacte', 'Équipe A');
  const permutation = [14, 12, 1, 15, 3, 10, 7, 4, 13, 2, 16, 8, 6, 0, 11, 9, 5];
  const parsed = parsePreviousActions(permutation.map(i => HEADERS[i]), [permutation.map(i => original[i])]);
  assert.deepEqual(parsed, snapshot(original));
  assert.equal(parsed.schema, EQUIPMENT_PROGRESS_SCHEMA);
  assert.deepEqual(parsed.records[0].findingIds, [record.findingIds]);
});

test('the calculated result is optional and never used as saved progress', () => {
  const record = action();
  const values = row(record, 'En cours', 'preuve');
  values[13] = { formula: '=IF(...)' };
  assert.equal(snapshot(values).records[0].status, 'En cours');
  assert.deepEqual(parsePreviousActions(HEADERS.filter((_, i) => i !== 13), [values.filter((_, i) => i !== 13)]), snapshot(values));
});

test('new dossiers start À faire and do not borrow another dossier’s proof', () => {
  const old = action('actor:old'), added = action('actor:new');
  const merged = mergeEquipmentProgress([added, old], snapshot(row(old, 'Terminé', 'preuve ancienne', 'Alice')));
  assert.deepEqual([merged.records[0].status, merged.records[0].proof, merged.records[0].owner], ['À faire', '', '']);
  assert.equal(merged.records[1].status, 'Terminé');
  assert.equal(merged.summary.new, 1);
  assert.equal(merged.summary.matched, 1);
});

test('a new finding reopens a completed dossier while retaining its evidence', () => {
  const original = action();
  const current = action(undefined, { findingCount: 2, findingIds: `${original.findingIds}\nactor:alpha:visual` });
  const merged = mergeEquipmentProgress([current], snapshot(row(original, 'Terminé', 'https://example.org/proof', 'Alice')));
  assert.equal(merged.records[0].status, 'À vérifier');
  assert.equal(merged.records[0].proof, 'https://example.org/proof');
  assert.equal(merged.records[0].owner, 'Alice');
  assert.equal(merged.summary.completedWithProof, 0);
  assert.deepEqual(merged.reopened[0].reasonCodes, ['NEW_FINDINGS']);
  assert.deepEqual(merged.reopened[0].addedFindingIds, ['actor:alpha:visual']);
  assert.deepEqual(merged.reopened[0].changedFields, []);
});

test('changed review content reopens the same stable IDs for every A:J field', () => {
  const original = action();
  for (const field of ['priority', 'name', 'universe', 'type', 'issue', 'action', 'evidence', 'observed', 'key', 'source']) {
    const current = { ...original, [field]: `${original[field]} modifié` };
    const merged = mergeEquipmentProgress([current], snapshot(row(original, 'En cours', 'preuve à conserver', 'Alice')));
    assert.equal(merged.records[0].status, 'À vérifier', field);
    assert.deepEqual(merged.reopened[0].reasonCodes, ['REVIEW_CONTENT_CHANGED'], field);
    assert.deepEqual(merged.reopened[0].changedFields, [field], field);
    assert.equal(merged.records[0].proof, 'preuve à conserver', field);
  }
});

test('both reopening reasons are retained without overwriting manual columns', () => {
  const original = action();
  const current = { ...original, source: 'https://example.org/new', findingCount: 2, findingIds: `${original.findingIds}\nactor:alpha:icon` };
  const merged = mergeEquipmentProgress([current], snapshot(row(original, 'À faire', 'note', 'Bob')));
  assert.equal(merged.records[0].status, 'À vérifier');
  assert.deepEqual(merged.reopened[0].reasonCodes, ['NEW_FINDINGS', 'REVIEW_CONTENT_CHANGED']);
  assert.equal(merged.reopened[0].previousStatus, 'À faire');
  assert.deepEqual([merged.records[0].proof, merged.records[0].owner], ['note', 'Bob']);
});

test('removed dossiers retain all prior progress and are never auto-completed', () => {
  const absent = action('actor:absent'), present = action('actor:present');
  const old = snapshot(row(absent, 'En cours', 'ancienne preuve', 'Alice'), row(present, 'À faire'));
  const merged = mergeEquipmentProgress([present], old);
  assert.equal(merged.summary.retired, 1);
  assert.equal(merged.summary.completedWithProof, 0);
  assert.equal(merged.retiredRecords[0].status, 'En cours');
  assert.equal(merged.retiredRecords[0].proof, 'ancienne preuve');
  assert.equal(merged.retiredRecords[0].owner, 'Alice');
  assert.deepEqual(merged.retiredRecords[0].reviewContent, old.records[0].reviewContent);
  assert.equal(merged.retiredRecords[0].progressChange.kind, 'retired');
});

test('removing finding IDs alone does not close or reopen unchanged review work', () => {
  const original = action(undefined, { findingCount: 2, findingIds: 'actor:alpha:source\nactor:alpha:icon' });
  const merged = mergeEquipmentProgress([action()], snapshot(row(original, 'En cours', 'note')));
  assert.equal(merged.records[0].status, 'En cours');
  assert.equal(merged.summary.reopened, 0);
  assert.deepEqual(merged.records[0].progressChange.removedFindingIds, ['actor:alpha:icon']);
});

test('whitespace-only proof is not counted as completed with proof', () => {
  const records = ['a', 'b', 'c'].map(id => action(`actor:${id}`));
  const merged = mergeEquipmentProgress(records, snapshot(row(records[0], 'Terminé', ' \t\n '), row(records[1], 'Terminé', ''), row(records[2], 'Terminé', ' référence ')));
  assert.equal(merged.summary.completedWithProof, 1);
  assert.deepEqual(merged.records.map(record => record.status), ['Terminé', 'Terminé', 'Terminé']);
  assert.equal(merged.records[0].proof, ' \t\n ');
});

test('normalization of review cells does not normalize manual proof or owner', () => {
  const record = action(undefined, { issue: '- Premier\nDeuxième', action: 'Comparer\nConfirmer' });
  const previousRow = row(record, 'Terminé', ' preuve\r\n ', ' Alice ');
  previousRow[4] = "'- Premier\r\nDeuxième";
  previousRow[5] = '  Comparer\r\nConfirmer  ';
  const merged = mergeEquipmentProgress([record], snapshot(previousRow));
  assert.equal(merged.summary.reopened, 0);
  assert.equal(merged.records[0].proof, ' preuve\r\n ');
  assert.equal(merged.records[0].owner, ' Alice ');
});

test('repinning this repository’s source commit preserves progress but path and external URL changes reopen it', () => {
  const base = 'https://github.com/darknigthmare/multiverse-breach/blob/';
  const oldRef = 'a'.repeat(40), newRef = 'b'.repeat(40);
  const original = action(undefined, { source: `${base}${oldRef}/src/game/heroes.js\n${base}${oldRef}/src/game/items.js\nhttps://example.org/canon` });
  const current = { ...original, source: original.source.replaceAll(oldRef, newRef) };
  const previous = snapshot(row(original, 'Terminé', 'preuve', 'Alice'));
  const merged = mergeEquipmentProgress([current], previous);
  assert.equal(merged.summary.reopened, 0);
  assert.equal(merged.records[0].status, 'Terminé');
  assert.equal(merged.records[0].source, current.source);
  assert.equal(merged.records[0].reviewContent.source, `${base}{commit}/src/game/heroes.js\n${base}{commit}/src/game/items.js\nhttps://example.org/canon`);
  for (const source of [
    current.source.replace('heroes.js', 'enemies.js'),
    current.source.replace('example.org/canon', 'example.org/new-canon'),
    current.source.replaceAll('darknigthmare/multiverse-breach', 'another/project'),
  ]) {
    assert.equal(mergeEquipmentProgress([{ ...current, source }], previous).summary.reopened, 1);
  }
  const external = action(undefined, { source: `https://example.org/blob/${oldRef}/source` });
  assert.equal(mergeEquipmentProgress([{ ...external, source: external.source.replace(oldRef, newRef) }], snapshot(row(external, 'Terminé', 'preuve'))).summary.reopened, 1);
});

test('literal formula-looking strings remain safe text; actual formula objects are rejected', () => {
  const record = action();
  for (const text of ['- une liste', '+ précision', '@alice', '= texte littéral']) {
    const merged = mergeEquipmentProgress([record], snapshot(row(record, 'Terminé', text, text)));
    assert.equal(merged.records[0].proof, text);
    assert.equal(merged.records[0].owner, text);
  }
  for (const column of [11, 12]) {
    for (const value of [42, true, { formula: '=HYPERLINK("x")' }, ['texte']]) {
      const invalid = row(record);
      invalid[column] = value;
      assert.throws(() => snapshot(invalid), /expected text/u);
    }
  }
  const empty = row(record);
  empty[11] = null;
  empty[12] = undefined;
  assert.deepEqual([snapshot(empty).records[0].proof, snapshot(empty).records[0].owner], ['', '']);
});

test('invalid headers, incomplete rows, missing IDs and invalid statuses fail closed', () => {
  const record = action();
  assert.throws(() => parsePreviousActions([...HEADERS, 'ID dossier'], [[...row(record), record.id]]), /Duplicate Actions header/u);
  assert.throws(() => parsePreviousActions(HEADERS.filter(header => header !== 'Source'), []), /Missing Actions header: Source/u);
  assert.throws(() => snapshot(row(record).slice(0, -1)), /incomplete row/u);
  for (const id of ['', '   ', 0, null]) {
    const invalid = row(record); invalid[14] = id;
    assert.throws(() => snapshot(invalid), /missing or non-text ID/u);
  }
  for (const status of ['Fini', ' Terminé ', '', null]) assert.throws(() => snapshot(row(record, status)), /invalid progress status/u);
});

test('duplicate dossier and finding IDs are rejected in both old and current data', () => {
  const a = action('actor:a'), b = action('actor:b');
  assert.throws(() => snapshot(row(a), row(a)), /duplicate dossier ID/u);
  assert.throws(() => mergeEquipmentProgress([a, a]), /duplicate dossier ID/u);
  assert.throws(() => snapshot(row(a), row({ ...b, findingIds: a.findingIds })), /ambiguous finding ID/u);
  assert.throws(() => mergeEquipmentProgress([a, { ...b, findingIds: a.findingIds }]), /ambiguous finding ID/u);
  for (const ids of ['', ' ', `${a.findingIds}\n`, `${a.findingIds}\n${a.findingIds}`]) {
    const bad = { ...a, findingCount: 2, findingIds: ids };
    assert.throws(() => snapshot(row(bad)), /ID/u);
    assert.throws(() => mergeEquipmentProgress([bad]), /ID/u);
  }
  assert.throws(() => snapshot(row({ ...a, findingCount: 5 })), /finding count/u);
  assert.throws(() => mergeEquipmentProgress([{ ...a, findingCount: 5 }]), /finding count/u);
});

test('a finding cannot silently migrate to a different dossier and inherit a wrong review', () => {
  const old = action('actor:old'), changed = action('actor:new', { findingIds: old.findingIds });
  assert.throws(() => mergeEquipmentProgress([changed], snapshot(row(old, 'Terminé', 'preuve'))), /changed dossier/u);
});

test('JSON snapshot callers receive the same strict validation as worksheet imports', () => {
  const record = action(), good = snapshot(row(record));
  assert.throws(() => mergeEquipmentProgress([record], { ...good, schema: 'unknown' }), /Unsupported/u);
  const missingContent = structuredClone(good); delete missingContent.records[0].reviewContent.source;
  assert.throws(() => mergeEquipmentProgress([record], missingContent), /reviewContent.source/u);
  const invalidProof = structuredClone(good); invalidProof.records[0].proof = { formula: '=1' };
  assert.throws(() => mergeEquipmentProgress([record], invalidProof), /expected text/u);
  const duplicates = structuredClone(good); duplicates.records.push(duplicates.records[0]);
  assert.throws(() => mergeEquipmentProgress([record], duplicates), /duplicate dossier ID/u);
  const currentMissingContent = { ...record }; delete currentMissingContent.source;
  assert.throws(() => mergeEquipmentProgress([currentMissingContent], good), /reviewContent.source/u);
});

test('no previous snapshot initializes all records and an empty new set retains all retired records', () => {
  const record = action();
  const initial = mergeEquipmentProgress([record]);
  assert.deepEqual(initial.summary, { total: 1, previous: 0, new: 1, matched: 0, reopened: 0, retired: 0, completedWithProof: 0 });
  const retired = mergeEquipmentProgress([], snapshot(row(record, 'Terminé', 'preuve')));
  assert.equal(retired.records.length, 0);
  assert.equal(retired.retiredRecords.length, 1);
  assert.equal(retired.summary.completedWithProof, 0);
  assert.equal(retired.retiredRecords[0].status, 'Terminé');
});
