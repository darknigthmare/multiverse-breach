import test from 'node:test';
import assert from 'node:assert/strict';
import { json,prefix,verifyHashes } from './closure-support.mjs';
import { validateCompletedRift,assertReviewWindow } from './rift-review-support.mjs';

test('real completed execution binds147 current files,120 references and9 archived original reports',()=>{
  const {snapshot}=validateCompletedRift();assert.equal(snapshot.integrityFileCount,147);assert.equal(snapshot.referenceCount,120);
  assert.equal(snapshot.originalFinalReports.length,9);assert.equal(snapshot.authorizesRiftWrites,false);
  assert.ok(snapshot.originalProductionFreezeArchive.path.includes('/closure-after-failed-build-'));
  assert.ok(snapshot.originalFinalReports.every(r=>r.path.includes('/closure-after-failed-build-')));
});
const invalidCases=[
 ['failed original command','result.json',r=>r.steps[2].exitCode=1],
 ['missing original command','result.json',r=>r.steps.pop()],
 ['invented subprocess receipt','result.json',r=>r.steps[2].receiptOrigin='synthetic'],
 ['reordered original dates','result.json',r=>r.steps[2].startedAt=r.startedAt],
 ['modified completed output','result.json',r=>r.generatedSha256After['src/game/riftDossierAssets.json']='0'.repeat(64)],
 ['missing reference','authorization.json',r=>r.references.pop()],
 ['reduced integrity coverage','final-integrity.json',r=>r.hashChecks=146],
 ['invented final-write date','allow-final-writes.json',r=>r.createdAt='2099-01-01T00:00:00.000Z']
];
for(const [name,basename,mutate]of invalidCases)test('reject '+name,()=>{
  assert.throws(()=>validateCompletedRift({readJson:path=>{const value=json(path);if(path.endsWith('/'+basename))mutate(value);return value;}}));
});
test('completed mode rejects every changed input, including the Rift registry',()=>{
  const refresh=json(prefix+'rift-refresh/result.json'),gate=json(prefix+'rift-refresh/allow-final-writes.json');
  assert.throws(()=>verifyHashes({'src/game/riftDossierAssets.json':'0'.repeat(64)},{refresh,gate,allowTransition:false}),/no SHA transition/);
});
test('original write chronology retains step2 then original gate then step3',()=>{
  const refresh=json(prefix+'rift-refresh/result.json'),gate=json(prefix+'rift-refresh/allow-final-writes.json');
  assert.deepEqual(refresh.finalWriteGate,gate);
  assert.ok(Date.parse(refresh.steps[1].finishedAt)<=Date.parse(gate.createdAt));
  assert.ok(Date.parse(gate.createdAt)<=Date.parse(refresh.steps[2].startedAt));
});
const execution={startedAt:'2026-10-26T12:00:01Z',finishedAt:'2026-10-26T12:00:05Z',browserClosedAt:'2026-10-26T12:00:04Z',allBrowserWindowsClosed:true};
test('review chronology admits a fresh closed browser after freeze',()=>assertReviewWindow(execution,'2026-10-26T12:00:00Z','2026-10-26T12:00:06Z'));
test('review chronology rejects proof before new freeze',()=>assert.throws(()=>assertReviewWindow(execution,'2026-10-26T12:00:02Z','2026-10-26T12:00:06Z')));
test('review chronology rejects a gate before proof completion',()=>assert.throws(()=>assertReviewWindow(execution,'2026-10-26T12:00:00Z','2026-10-26T12:00:03Z')));
test('review chronology rejects an open browser',()=>assert.throws(()=>assertReviewWindow({...execution,allBrowserWindowsClosed:false},'2026-10-26T12:00:00Z','2026-10-26T12:00:06Z')));
test('review chronology rejects a close time after the execution',()=>assert.throws(()=>assertReviewWindow({...execution,browserClosedAt:'2026-10-26T12:00:07Z'},'2026-10-26T12:00:00Z','2026-10-26T12:00:08Z')));
