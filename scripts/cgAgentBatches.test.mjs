import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,readFileSync,readdirSync,rmSync,writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'node:test';
import {validateAgentBatches} from './cgAgentBatches.mjs';

const slots=Array.from({length:15},(_,i)=>`CG${String(i+1).padStart(2,'0')}`);
const matrix=status=>Object.fromEntries(slots.map(slot=>[slot,{status}]));
function fixture(){
 const ids=Array.from({length:43},(_,i)=>`subject_${String(i+1).padStart(2,'0')}`);
 const completed=['complete_generated','complete_with_na'];
 const plan={subjects:[...ids.map(characterId=>({characterId,matrix:matrix('needs-reference')})),...completed.map(characterId=>({characterId,matrix:matrix('generated')}))]};
 plan.subjects.at(-1).matrix.CG02={status:'not-applicable-source-reviewed',reason:'Fixture has no separate equipment'};
 const batch={schemaVersion:1,date:'2026-10-26',batchSize:40,totalSubjects:45,alreadyCompleteSubjects:2,incompleteSubjects:43,
  plannedLots:2,firstConcurrentLots:1,firstConcurrentSubjects:40,lastRemainderSubjects:3,baselineCompleteCharacterIds:completed,
  imageGenerationImpliedByAssignment:false,assignmentDoesNotCertifyGeneration:true,absoluteFidelityCertified:false,
  lots:[{lotId:'lot-01',owner:'/root/producer_01',status:'running',subjectCount:40,characterIds:ids.slice(0,40)},
        {lotId:'lot-02',owner:null,status:'queued-not-started',subjectCount:3,characterIds:ids.slice(40)}]};
 return {batch,plan};
}

test('baseline partition covers40+3 assigned subjects plus generated/N/A exclusions without mutating either input',()=>{
 const {batch,plan}=fixture(),before=structuredClone({batch,plan}),summary=validateAgentBatches(batch,plan);
 assert.equal(summary.assignedSubjects,43);assert.equal(summary.baselineCompleteSubjects,2);assert.equal(summary.coveredSubjects,45);
 assert.equal(summary.activeLots,1);assert.equal(summary.activeSubjects,40);assert.equal(summary.queuedLots,1);assert.equal(summary.queuedSubjects,3);
 assert.equal(summary.lastLotSubjects,3);assert.equal(summary.lastRemainderSubjects,3);
 assert.equal(summary.imageGenerationImpliedByAssignment,false);assert.equal(summary.imagesGeneratedByThisValidator,0);assert.equal(summary.absoluteFidelityCertified,false);
 assert.deepEqual({batch,plan},before);
});

test('cross-lot duplicate IDs are rejected even when the total row count is unchanged',()=>{
 const {batch,plan}=fixture();batch.lots[1].characterIds[0]=batch.lots[0].characterIds[0];
 assert.throws(()=>validateAgentBatches(batch,plan),/Duplicate assigned characterId across lots/);
});

test('unknown IDs and uncovered known subjects cannot silently replace baseline membership',()=>{
 const unknown=fixture();unknown.batch.lots[1].characterIds[0]='missing_from_plan';
 assert.throws(()=>validateAgentBatches(unknown.batch,unknown.plan),/Unknown assigned characterId/);
 const omitted=fixture();omitted.batch.lots[1].characterIds.pop();omitted.batch.lots[1].subjectCount--;
 assert.throws(()=>validateAgentBatches(omitted.batch,omitted.plan),/Missing roster subjects/);
});

test('baseline-complete IDs must be unique, known, excluded and complete in all fifteen slots',()=>{
 const unknown=fixture();unknown.batch.baselineCompleteCharacterIds[0]='unknown_baseline';
 assert.throws(()=>validateAgentBatches(unknown.batch,unknown.plan),/Unknown baseline complete characterId/);
 const duplicate=fixture();duplicate.batch.baselineCompleteCharacterIds[1]=duplicate.batch.baselineCompleteCharacterIds[0];
 assert.throws(()=>validateAgentBatches(duplicate.batch,duplicate.plan),/Duplicate baseline complete characterId/);
 const overlap=fixture();overlap.batch.lots[1].characterIds[0]='complete_generated';
 assert.throws(()=>validateAgentBatches(overlap.batch,overlap.plan),/Baseline complete characterId also assigned/);
 const incomplete=fixture();incomplete.plan.subjects.at(-2).matrix.CG15.status='needs-reference';
 assert.throws(()=>validateAgentBatches(incomplete.batch,incomplete.plan),/not finished in all fifteen/);
 const absentCell=fixture();delete absentCell.plan.subjects.at(-2).matrix.CG15;
 assert.throws(()=>validateAgentBatches(absentCell.batch,absentCell.plan),/not finished in all fifteen/);
});

test('a39-subject nonfinal lot is rejected even when its missing ID moves into the last lot',()=>{
 const {batch,plan}=fixture();batch.lots[1].characterIds.push(batch.lots[0].characterIds.pop());batch.lots[0].subjectCount=39;batch.lots[1].subjectCount=4;
 assert.throws(()=>validateAgentBatches(batch,plan),/Nonfinal lot must contain40/);
});

test('queued lots have null owners and pending/running owners cannot own two lots',()=>{
 const queued=fixture();queued.batch.lots[1].owner='/root/not_started';
 assert.throws(()=>validateAgentBatches(queued.batch,queued.plan),/Queued lot owner must be null/);
 const duplicate=fixture();duplicate.batch.lots[1].status='pending-agent-start';duplicate.batch.lots[1].owner=duplicate.batch.lots[0].owner;
 assert.throws(()=>validateAgentBatches(duplicate.batch,duplicate.plan),/Owner assigned to multiple active lots/);
 const missing=fixture();missing.batch.lots[0].owner=null;
 assert.throws(()=>validateAgentBatches(missing.batch,missing.plan),/Owned lot needs a nonempty owner/);
});

test('the final remainder and declared coverage counts must match actual IDs',()=>{
 const remainder=fixture();remainder.batch.lastRemainderSubjects=2;
 assert.throws(()=>validateAgentBatches(remainder.batch,remainder.plan),/lastRemainderSubjects differs/);
 const count=fixture();count.batch.incompleteSubjects=44;
 assert.throws(()=>validateAgentBatches(count.batch,count.plan),/baseline assignment count/);
 const subjectCount=fixture();subjectCount.batch.lots[1].subjectCount=2;
 assert.throws(()=>validateAgentBatches(subjectCount.batch,subjectCount.plan),/subjectCount differs/);
});

test('source qualification, refusals and non-attempts are not generated or N/A completion',()=>{
 for(const status of ['qualified-reference','ready-for-generation','provider-refused','not-attempted']){
  const {batch,plan}=fixture();const subject=plan.subjects.at(-2);
  subject.identity={evidenceStatus:'source-qualified',visualFidelityApproved:false};subject.matrix.CG01={status,sourceViewed:true,sourceQualified:true};
  assert.throws(()=>validateAgentBatches(batch,plan),/not finished in all fifteen/,status);
 }
 const {batch,plan}=fixture();plan.subjects[0].identity={evidenceStatus:'source-qualified'};
 const s=validateAgentBatches(batch,plan);assert.equal(s.assignedSubjects,43);assert.equal(s.imagesGeneratedByThisValidator,0);
});

test('a lot completed after the baseline retains its original assigned membership',()=>{
 const {batch,plan}=fixture();for(const s of plan.subjects.slice(0,40))s.matrix=matrix('generated');batch.lots[0].status='completed';
 plan.subjects[0].matrix.CG02={status:'not-applicable-source-reviewed',reason:'No separate signature equipment in the documented source'};
 // The completed producer can take the next remainder without two concurrent owners.
 batch.lots[1].status='running';batch.lots[1].owner=batch.lots[0].owner;
 const s=validateAgentBatches(batch,plan);assert.equal(s.assignedSubjects,43);assert.equal(s.baselineCompleteSubjects,2);
 assert.equal(s.completedLots,1);assert.equal(s.activeLots,1);assert.equal(s.activeSubjects,3);assert.equal(s.queuedLots,0);
 assert.equal(batch.lots[0].characterIds.length,40);assert.equal(batch.incompleteSubjects,43);
});

test('a completed lot requires every assigned character to finish all applicable CG slots',()=>{
 for(const status of ['needs-reference','ready-for-generation','provider-refused','not-attempted']){
  const {batch,plan}=fixture();
  for(const subject of plan.subjects.slice(0,40))subject.matrix=matrix('generated');
  plan.subjects[39].matrix.CG15={status};batch.lots[0].status='completed';
  assert.throws(()=>validateAgentBatches(batch,plan),/Completed lot still has unfinished CG slots: lot-01\/subject_40/,status);
 }
});

test('assignment states and explicit flags cannot claim generated art or certified fidelity',()=>{
 const state=fixture();state.batch.lots[0].status='generated';
 assert.throws(()=>validateAgentBatches(state.batch,state.plan),/image\/source states are not assignment states/);
 const generated=fixture();generated.batch.imageGenerationImpliedByAssignment=true;
 assert.throws(()=>validateAgentBatches(generated.batch,generated.plan),/must not imply image generation/);
 const fidelity=fixture();fidelity.batch.absoluteFidelityCertified=true;
 assert.throws(()=>validateAgentBatches(fidelity.batch,fidelity.plan),/must not certify absolute visual fidelity/);
});

test('the CLI reads private fixture JSON and writes no files',t=>{
 const dir=mkdtempSync(path.join(os.tmpdir(),'cg-agent-batches-test-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));
 const {batch,plan}=fixture(),batchFile=path.join(dir,'batch.json'),planFile=path.join(dir,'plan.json');
 writeFileSync(batchFile,JSON.stringify(batch));writeFileSync(planFile,JSON.stringify(plan));const before=[readFileSync(batchFile),readFileSync(planFile)];
 const cli=fileURLToPath(new URL('./cgAgentBatches.mjs',import.meta.url));
 const summary=JSON.parse(execFileSync(process.execPath,[cli,'--batch',batchFile,'--plan',planFile],{encoding:'utf8'}));
 assert.equal(summary.assignedSubjects,43);assert.equal(summary.activeSubjects,40);assert.equal(summary.imagesGeneratedByThisValidator,0);
 assert.deepEqual(readdirSync(dir).sort(),['batch.json','plan.json']);assert(before[0].equals(readFileSync(batchFile)));assert(before[1].equals(readFileSync(planFile)));
});
