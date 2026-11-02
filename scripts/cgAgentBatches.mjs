#!/usr/bin/env node
/** Read-only validation of the frozen baseline partition and current lot ownership. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT=fileURLToPath(new URL('..',import.meta.url));
export const DEFAULT_BATCH_FILE='docs/cg/roster-agent-batches-40-2026-10-26.json';
export const DEFAULT_PRODUCTION_PLAN_FILE='docs/cg/roster-production-2026-10-18.json';
const SLOT_IDS=Array.from({length:15},(_,i)=>`CG${String(i+1).padStart(2,'0')}`);
const ASSIGNMENT_STATUSES=new Set(['queued-not-started','pending-agent-start','running','completed','blocked','paused']);
const nonemptyString=value=>typeof value==='string'&&value.length>0&&value.trim()===value;
const finished=cell=>cell?.status==='generated'||(typeof cell?.status==='string'&&cell.status.startsWith('not-applicable'));
const hasCompleteCgMatrix=subject=>Boolean(subject?.matrix&&Object.keys(subject.matrix).length===15&&SLOT_IDS.every(slot=>finished(subject.matrix[slot])));
const integer=(value,label)=>assert(Number.isSafeInteger(value)&&value>=0,`${label} must be a nonnegative integer`);

/**
 * Validate baseline membership, not today's incomplete set. An assigned subject
 * may finish later without moving out of its original lot. Matrix states are
 * checked to keep baseline subjects and completed lots finished in every slot.
 * This validator neither opens images nor certifies their production or fidelity.
 */
export function validateAgentBatches(batch,productionPlan){
 assert(batch&&typeof batch==='object'&&!Array.isArray(batch),'Agent batch must be an object');
 assert(Array.isArray(productionPlan?.subjects),'Production plan must contain subjects');
 assert.equal(batch.batchSize,40,'Each full ownership lot must contain40 subjects');
 assert.equal(batch.imageGenerationImpliedByAssignment,false,'Assignment must not imply image generation');
 assert.equal(batch.assignmentDoesNotCertifyGeneration,true,'Assignment must explicitly deny generation certification');
 assert.equal(batch.absoluteFidelityCertified,false,'Assignment must not certify absolute visual fidelity');
 assert(Array.isArray(batch.lots),'Agent batch must contain lots');
 assert(Array.isArray(batch.baselineCompleteCharacterIds),'Explicit baselineCompleteCharacterIds are required');

 const known=new Map();
 for(const subject of productionPlan.subjects){
  assert(nonemptyString(subject.characterId),'Production subject needs a nonempty characterId');
  assert(!known.has(subject.characterId),`Duplicate production-plan characterId: ${subject.characterId}`);
  known.set(subject.characterId,subject);
 }
 const baselineComplete=new Set();
 for(const id of batch.baselineCompleteCharacterIds){
  assert(nonemptyString(id),'Baseline complete characterId must be a nonempty string');
  assert(!baselineComplete.has(id),`Duplicate baseline complete characterId: ${id}`);
  assert(known.has(id),`Unknown baseline complete characterId: ${id}`);
  assert(hasCompleteCgMatrix(known.get(id)),`Baseline complete subject is not finished in all fifteen generated/N/A slots: ${id}`);
  baselineComplete.add(id);
 }

 const assigned=new Map(),lotIds=new Set(),activeOwners=new Map();
 let activeLots=0,activeSubjects=0,queuedLots=0,queuedSubjects=0,pendingLots=0,completedLots=0;
 for(const [index,lot]of batch.lots.entries()){
  assert(nonemptyString(lot.lotId),'Each lot needs a nonempty lotId');
  assert(!lotIds.has(lot.lotId),`Duplicate lotId: ${lot.lotId}`);lotIds.add(lot.lotId);
  assert(ASSIGNMENT_STATUSES.has(lot.status),`Invalid assignment status for ${lot.lotId}: ${lot.status}; image/source states are not assignment states`);
  assert(Array.isArray(lot.characterIds),`Missing characterIds for ${lot.lotId}`);
  assert.equal(lot.subjectCount,lot.characterIds.length,`subjectCount differs from IDs in ${lot.lotId}`);
  if(index<batch.lots.length-1)assert.equal(lot.characterIds.length,40,`Nonfinal lot must contain40 subjects: ${lot.lotId}`);
  else assert(lot.characterIds.length>0&&lot.characterIds.length<=40,`Final lot must contain1–40 subjects: ${lot.lotId}`);
  if(lot.status==='queued-not-started'){
   assert.equal(lot.owner,null,`Queued lot owner must be null: ${lot.lotId}`);
   queuedLots++;queuedSubjects+=lot.characterIds.length;
  }else{
   assert(nonemptyString(lot.owner),`Owned lot needs a nonempty owner: ${lot.lotId}`);
   // A previous completed lot may retain its producer while that agent takes a
   // later lot; concurrent/pending ownership must remain exclusive.
   if(lot.status!=='completed'){
    assert(!activeOwners.has(lot.owner),`Owner assigned to multiple active lots: ${lot.owner} (${activeOwners.get(lot.owner)} and ${lot.lotId})`);
    activeOwners.set(lot.owner,lot.lotId);
   }
   if(lot.status==='running'){activeLots++;activeSubjects+=lot.characterIds.length;}
   if(lot.status==='pending-agent-start')pendingLots++;
   if(lot.status==='completed')completedLots++;
  }
  for(const id of lot.characterIds){
   assert(nonemptyString(id),`Invalid characterId in ${lot.lotId}`);
   assert(known.has(id),`Unknown assigned characterId: ${id} (${lot.lotId})`);
   assert(!baselineComplete.has(id),`Baseline complete characterId also assigned: ${id}`);
   assert(!assigned.has(id),`Duplicate assigned characterId across lots: ${id} (${assigned.get(id)} and ${lot.lotId})`);
   if(lot.status==='completed')assert(hasCompleteCgMatrix(known.get(id)),`Completed lot still has unfinished CG slots: ${lot.lotId}/${id}`);
   assigned.set(id,lot.lotId);
  }
 }
 const missing=[...known.keys()].filter(id=>!assigned.has(id)&&!baselineComplete.has(id));
 assert.equal(missing.length,0,`Missing roster subjects from assignment/baseline partition: ${missing.join(', ')}`);
 for(const key of ['totalSubjects','alreadyCompleteSubjects','incompleteSubjects','plannedLots','firstConcurrentLots','firstConcurrentSubjects','lastRemainderSubjects'])integer(batch[key],key);
 assert.equal(batch.totalSubjects,known.size,'totalSubjects differs from the production roster');
 assert.equal(batch.alreadyCompleteSubjects,baselineComplete.size,'alreadyCompleteSubjects differs from explicit baseline IDs');
 assert.equal(batch.incompleteSubjects,assigned.size,'incompleteSubjects must retain the baseline assignment count');
 assert.equal(assigned.size+baselineComplete.size,known.size,'Assigned/baseline IDs must partition the entire roster');
 assert.equal(batch.plannedLots,batch.lots.length,'plannedLots differs from actual lots');
 assert.equal(batch.lots.length,Math.ceil(assigned.size/40),'Lots do not fit full40-subject lots plus a final remainder');
 const remainder=assigned.size%40;
 assert.equal(batch.lastRemainderSubjects,remainder,'lastRemainderSubjects differs from the baseline assignment remainder');
 if(batch.lots.length)assert.equal(batch.lots.at(-1).characterIds.length,remainder||40,'Final lot does not match the baseline remainder');
 assert(batch.firstConcurrentLots<=batch.lots.length,'firstConcurrentLots exceeds the available lots');
 assert.equal(batch.firstConcurrentSubjects,batch.lots.slice(0,batch.firstConcurrentLots).reduce((n,lot)=>n+lot.characterIds.length,0),'firstConcurrentSubjects differs from initial lot membership');

 return {schemaVersion:1,status:'passed-assignment-integrity',date:batch.date,batchSize:40,totalSubjects:known.size,
         assignedSubjects:assigned.size,baselineCompleteSubjects:baselineComplete.size,coveredSubjects:assigned.size+baselineComplete.size,
         plannedLots:batch.lots.length,activeLots,activeSubjects,queuedLots,queuedSubjects,remainingQueuedLots:queuedLots,
         pendingLots,completedLots,firstConcurrentLots:batch.firstConcurrentLots,firstConcurrentSubjects:batch.firstConcurrentSubjects,
         lastLotSubjects:batch.lots.at(-1)?.characterIds.length||0,lastRemainderSubjects:remainder,
         assignmentDoesNotCertifyGeneration:true,imageGenerationImpliedByAssignment:false,imagesGeneratedByThisValidator:0,
         imagesInstalledByThisValidator:0,absoluteFidelityCertified:false};
}

function main(args){
 let batchFile=DEFAULT_BATCH_FILE,planFile=DEFAULT_PRODUCTION_PLAN_FILE;
 for(let i=0;i<args.length;i++){
  if(args[i]==='--help'){
   assert.equal(args.length,1,'--help must be used alone');
   process.stdout.write('Usage: node scripts/cgAgentBatches.mjs [--batch FILE] [--plan FILE]\nRead-only validation; no images or files are written.\n');return;
  }
  assert(['--batch','--plan'].includes(args[i]),`Unknown argument: ${args[i]}`);
  assert(args[i+1]&&!args[i+1].startsWith('--'),`Missing value for ${args[i]}`);
  if(args[i]==='--batch')batchFile=args[++i];else planFile=args[++i];
 }
 const load=file=>{const bytes=readFileSync(path.resolve(ROOT,file));return {data:JSON.parse(bytes),pin:{path:file,sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length}};};
 const batch=load(batchFile),plan=load(planFile),summary=validateAgentBatches(batch.data,plan.data);
 process.stdout.write(JSON.stringify({...summary,inputs:{assignment:batch.pin,productionPlan:plan.pin}},null,2)+'\n');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{main(process.argv.slice(2));}catch(error){process.stderr.write(`cgAgentBatches: ${error.message}\n`);process.exitCode=1;}
}
