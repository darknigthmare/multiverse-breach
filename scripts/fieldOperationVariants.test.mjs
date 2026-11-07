import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMosaicReconnaissanceDossier, normalizeMosaicReconnaissance, startMosaicReconnaissance,
  advanceMosaicReconnaissance, getMosaicReconnaissanceObjective } from '../src/game/mosaicReconnaissance.js';
import { resolveMosaicInteraction } from '../src/game/mosaicCityRuntime.js';
import { sanitizeSaveCore } from '../src/game/saveValidation.js';
import { createExtinctionRelayOperation, interactExtinctionRelayOperation,
  tickExtinctionRelayOperation, getExtinctionRelayStatus } from '../src/game/extinctionRelayOperation.js';
import { fieldOperationPreferenceStore, createFieldOperationPreferenceStore,
  normalizeFieldOperationPreferences, DEFAULT_FIELD_OPERATION_PREFERENCES, FIELD_OPERATION_PREFERENCES_KEY } from '../src/game/fieldOperationPreferences.js';

const district = {id:'district-test',universe:'Test'};
const hero = {id:'resident',universe:'Test'};
const anchor = {id:'anchor',action:'anchor',universe:'Test'};
const dossier = buildMosaicReconnaissanceDossier({district,residents:[hero],exhibits:[{id:'first',universe:'Test'},{id:'second',universe:'Test'}],anchor});
const npc = resolveMosaicInteraction({x:0,y:0}, {npcs:[{hero,x:0,y:0}]});
const inspect = id => ({type:'zone',id:`district-test::exhibit::${id}`,distance:0,
  target:{id:`district-test::exhibit::${id}`,action:'exhibit',exhibitId:id,universe:'Test'}});
const report = {type:'zone',id:'anchor',distance:0,target:anchor};
function begin(goal=2) {
  const progress = startMosaicReconnaissance(normalizeMosaicReconnaissance(),dossier,'fr',{exhibitGoal:goal}).progress;
  return advanceMosaicReconnaissance(progress,dossier,npc).progress;
}

test('cross-check requires distinct evidence and routes to the unexamined relic', () => {
  let progress = begin();
  const first = advanceMosaicReconnaissance(progress,dossier,inspect('first'));
  assert.equal(first.reason,'evidence_recorded'); progress=first.progress;
  assert.equal(progress.dossiers[district.id].exhibitId,null);
  assert.deepEqual(getMosaicReconnaissanceObjective(progress,dossier).targetIds,['district-test::exhibit::second']);
  assert.match(getMosaicReconnaissanceObjective(progress,dossier,'en').text,/1\/2/);
  assert.equal(advanceMosaicReconnaissance(progress,dossier,inspect('first')).reason,'already_examined');
  assert.equal(advanceMosaicReconnaissance(progress,dossier,report).changed,false);
  const second = advanceMosaicReconnaissance(progress,dossier,inspect('second'));
  assert.equal(second.reason,'exhibit_recorded');
  const end = advanceMosaicReconnaissance(second.progress,dossier,report);
  assert.equal(end.reason,'completed');
  assert.deepEqual(end.progress.dossiers[district.id].evidenceIds,['first','second']);
  assert.equal(advanceMosaicReconnaissance(end.progress,dossier,report).changed,false);
});
test('cross-check never accepts an impossible one-relic dossier', () => {
  const one = buildMosaicReconnaissanceDossier({district,residents:[hero],exhibits:[{id:'first',universe:'Test'}],anchor});
  const empty = normalizeMosaicReconnaissance();
  const denied = startMosaicReconnaissance(empty,one,'fr',{exhibitGoal:2});
  assert.equal(denied.reason,'insufficient_exhibits'); assert.equal(denied.progress,empty);
  assert.equal(startMosaicReconnaissance(empty,one,'fr',{exhibitGoal:1}).reason,'started');
});
test('remote and foreign evidence cannot advance cross-check', () => {
  const progress=begin();
  for(const event of [{...inspect('first'),distance:100},inspect('foreign'),{...inspect('first'),target:{...inspect('first').target,universe:'Other'}}]) {
    assert.equal(advanceMosaicReconnaissance(progress,dossier,event).progress,progress);
  }
});
test('cross-check survives save sanitation and pack absence without free completion', () => {
  const progress=advanceMosaicReconnaissance(begin(),dossier,inspect('first')).progress;
  const save=sanitizeSaveCore(JSON.parse(JSON.stringify({gold:31,activityProgress:{mosaicReconnaissance:progress}})));
  const restored=normalizeMosaicReconnaissance(save.activityProgress.mosaicReconnaissance);
  assert.deepEqual(restored,progress); assert.equal(save.gold,31);
  assert.equal(getMosaicReconnaissanceObjective(restored,null).status,'unavailable');
  const forged=normalizeMosaicReconnaissance({dossiers:{x:{universe:'Missing Pack',residentId:'h',exhibitGoal:2,evidenceIds:['a','a'],exhibitId:'b',completed:true}}});
  assert.equal(forged.dossiers.x.completed,false);assert.equal(forged.dossiers.x.exhibitId,null);
});
test('preferences affect new contracts only; default dossier shape stays unchanged', t => {
  t.after(()=>fieldOperationPreferenceStore.write({schemaVersion:1}));
  const legacy=begin(1); assert.equal(Object.hasOwn(legacy.dossiers[district.id],'exhibitGoal'),false);
  fieldOperationPreferenceStore.write({schemaVersion:1,reconnaissance:'cross-check',relays:'contested'});
  assert.equal(startMosaicReconnaissance(legacy,dossier).progress,legacy);
  assert.equal(startMosaicReconnaissance(normalizeMosaicReconnaissance(),dossier).progress.dossiers[district.id].exhibitGoal,2);
  const operation=createExtinctionRelayOperation({enabled:true,runId:'one'});
  assert.equal(operation.contested,true);
  fieldOperationPreferenceStore.write({schemaVersion:1}); assert.equal(operation.contested,true);
});
function relay() {
  const item={id:'beacon-1',type:'beacon',wave:1,wx:0,wy:0};
  const run={runId:'relay',phase:'running',t:0,wave:1,px:0,py:0,loot:[item],enemies:[{hp:10,wx:1,wy:0}],ammo:9,hp:100};
  const operation=createExtinctionRelayOperation({enabled:true,runId:'relay',contested:true});
  return {run,item,operation:interactExtinctionRelayOperation(operation,run,item).operation};
}
function ticks(operation,run,n) {let next=operation;for(let i=0;i<n;i++){run.t++;next=tickExtinctionRelayOperation(next,run);}return next;}
test('live hostiles block contested synchronization without touching combat state or RNG', t => {
  t.mock.method(Math,'random',()=>{throw new Error('unexpected RNG');});
  const f=relay();const before=JSON.stringify(f.run.enemies);
  const next=ticks(f.operation,f.run,180);
  assert.equal(next.beacons['beacon-1'].ticks,0);
  assert.match(getExtinctionRelayStatus(next,'beacon-1').shortText,/contesté/);
  assert.equal(JSON.stringify(f.run.enemies),before);assert.equal(f.run.ammo,9);assert.equal(f.run.hp,100);
});
test('clearing the perimeter resumes progress; enemy reentry blocks final confirmation', () => {
  const f=relay(); f.run.enemies[0].wx=3;
  let next=ticks(f.operation,f.run,90);assert.equal(next.beacons['beacon-1'].ticks,90);
  f.run.enemies[0].wx=1;next=ticks(next,f.run,90);assert.equal(next.beacons['beacon-1'].ticks,90);
  f.run.enemies[0].hp=0;next=ticks(next,f.run,90);assert.equal(next.beacons['beacon-1'].status,'ready');
  f.run.enemies[0].hp=10;
  const denied=interactExtinctionRelayOperation(next,f.run,f.item);
  assert.equal(denied.allowCollect,false);assert.equal(denied.reason,'contested');
  f.run.enemies=[];next=ticks(denied.operation,f.run,1);
  const secure=interactExtinctionRelayOperation(next,f.run,f.item);
  assert.equal(secure.allowCollect,true);assert.equal(secure.operation.beacons['beacon-1'].status,'secured');
  assert.equal(interactExtinctionRelayOperation(secure.operation,f.run,f.item).allowCollect,false);
});
test('paused and out-of-range relays cannot earn synchronization', () => {
  const f=relay();f.run.enemies=[];f.run.paused=true;
  assert.equal(ticks(f.operation,f.run,60),f.operation);
  f.run.paused=false;f.run.px=8;
  const next=ticks(f.operation,f.run,60);assert.equal(next.beacons['beacon-1'].ticks,0);
  assert.equal(interactExtinctionRelayOperation(next,f.run,f.item).reason,'out_of_range');
});
test('invalid and defeated hostiles do not jam; the exact range boundary does', () => {
  const f=relay(); f.run.enemies=[{hp:0,wx:0,wy:0},{hp:3,wx:NaN,wy:0},{hp:Infinity,wx:0,wy:0}];
  let next=ticks(f.operation,f.run,1);assert.equal(next.beacons['beacon-1'].ticks,1);
  f.run.enemies=[{hp:1,wx:2,wy:0}];next=ticks(next,f.run,1);assert.equal(next.beacons['beacon-1'].ticks,1);
});
test('standard relays retain timing even with an enemy on the beacon', () => {
  const f=relay();const normal=createExtinctionRelayOperation({enabled:true,runId:f.run.runId,contested:false});
  const activated=interactExtinctionRelayOperation(normal,f.run,f.item).operation;
  const ready=ticks(activated,f.run,180);
  assert.equal(ready.beacons['beacon-1'].status,'ready');assert.equal(Object.hasOwn(ready,'contested'),false);
});
test('malformed preferences use historical modes', () => {
  for (const value of [null, [], 'cross-check', {}, {schemaVersion:2,relays:'contested'}]) {
    assert.deepEqual(normalizeFieldOperationPreferences(value),DEFAULT_FIELD_OPERATION_PREFERENCES);
  }
});
test('preference normalization retains only supported choices without mutating input', () => {
  const source=Object.freeze({schemaVersion:1,reconnaissance:'cross-check',relays:'contested',gold:999});
  assert.deepEqual(normalizeFieldOperationPreferences(source),{schemaVersion:1,reconnaissance:'cross-check',relays:'contested'});
  assert.equal(source.gold,999);
});
test('preferences persist using only their dedicated key', () => {
  const values=new Map([['multiverse_breach_save_v2','untouched']]);
  const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};
  const store=createFieldOperationPreferenceStore(()=>storage);
  assert.equal(store.write({schemaVersion:1,reconnaissance:'cross-check',relays:'contested'}).persisted,true);
  assert.equal(createFieldOperationPreferenceStore(()=>storage).read().value.relays,'contested');
  assert.equal(values.get('multiverse_breach_save_v2'),'untouched');
  assert.deepEqual([...values.keys()],['multiverse_breach_save_v2',FIELD_OPERATION_PREFERENCES_KEY]);
});
test('storage denial keeps session choices and reports failure', () => {
  const store=createFieldOperationPreferenceStore(()=>{throw new Error('denied');});
  assert.equal(store.read().persisted,false);
  const result=store.write({schemaVersion:1,reconnaissance:'cross-check',relays:'contested'});
  assert.equal(result.persisted,false);result.value.relays='standard';
  assert.equal(store.read().value.relays,'contested');
});
test('failed writes never reload the old saved preference over the session', () => {
  let denied=true;
  const store=createFieldOperationPreferenceStore(()=>({getItem:()=>JSON.stringify(DEFAULT_FIELD_OPERATION_PREFERENCES),setItem:()=>{if(denied)throw new Error('quota');}}));
  store.write({schemaVersion:1,relays:'contested'});assert.equal(store.read().value.relays,'contested');
  denied=false;assert.equal(store.write({schemaVersion:1}).persisted,true);
});
test('corrupted JSON never crashes the menu or the next run', () => {
  const store=createFieldOperationPreferenceStore(()=>({getItem:()=>'{'}));
  assert.deepEqual(store.read(),{value:{...DEFAULT_FIELD_OPERATION_PREFERENCES},persisted:false});
});
