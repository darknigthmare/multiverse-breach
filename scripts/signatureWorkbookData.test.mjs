import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTracker, trackerCsv, trackerState } from './signatureWorkbookData.mjs';
const sha = 'a6b90e01d54d997ba7421055d29c94ccd25f2f5d';
const entry = { key: 'test::hero::0::id', universe: 'Test', name: '=HYPERLINK("bad")', kind: 'hero', actorId: 'id' };
test('reconstructed export never claims it is the original workbook or approves gameplay/art', () => {
  const result = buildTracker({ entries: [entry] }, sha);
  assert.match(result.origin, /NOT the unidentified original Excel/);
  assert.equal(result.rows[0][9], 'A_INTEGRER'); assert.equal(result.rows[0][10], 'NON_CERTIFIEE');
  assert.equal(result.sourceCommit, sha); assert.equal(result.rows[0][0], entry.key);
});
test('functional status distinguishes noncombatants, partial contracts and missing entries', () => {
  assert.equal(trackerState({excludedNonCombat:true,authoredSignature:'x'}),'NON_COMBATTANT');
  for (const key of ['authoredSignature','meleeSuper','nativeSummon','equippedInvocation']) assert.equal(trackerState({[key]:'x'}),'CONTRAT_PARTIEL');
  assert.equal(trackerState({}),'A_INTEGRER');
});
for(const source of ['', 'main', 'a'.repeat(39), 'g'.repeat(40)]) test(`unverified source ${source.slice(0,6)} is rejected`,()=>{
  assert.throws(()=>buildTracker({entries:[]},source),/source commit/);
});
test('duplicate keys, malformed inventories and unsupported approval are rejected',()=>{
  for(const input of [{},null,{entries:[entry,entry]},{entries:[{}]},{entries:[{...entry,fidelityApproved:true}]}]) assert.throws(()=>buildTracker(input,sha));
});
test('CSV is escaped as text, including whitespace before formulas, quotes and line breaks',()=>{
  const rows=[['=1+1','+cmd','-1','@SUM(A1)',' \t=1','safe;value','a"b','line\nline']];
  const csv=trackerCsv({columns:['Test'],rows});assert.ok(csv.startsWith('\uFEFF'));
  for(const literal of ["'=1+1","'+cmd","'-1","'@SUM(A1)","' \t=1"]) assert.ok(csv.includes(literal));
  assert.ok(csv.includes('"safe;value"'));assert.ok(csv.includes('"a""b"'));assert.ok(csv.includes('"line\nline"'));
  assert.deepEqual(rows[0].slice(0,2),['=1+1','+cmd']);
});
