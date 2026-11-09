import { OFFICIAL_COSTUMES_R14 } from '../src/game/wardrobeOfficialR14.js';
import { OFFICIAL_COSTUMES_R13 } from '../src/game/wardrobeOfficialR13.js';
import { OFFICIAL_COSTUMES_R12 } from '../src/game/wardrobeOfficialR12.js';
import { OFFICIAL_COSTUMES_R11 } from '../src/game/wardrobeOfficialR11.js';
import { OFFICIAL_COSTUMES_R10 } from '../src/game/wardrobeOfficialR10.js';
import { OFFICIAL_COSTUMES_R9 } from '../src/game/wardrobeOfficialR9.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { HEROES_DB } from '../src/game/heroes.js';
import { OFFICIAL_COSTUMES_R7,UNBOUND_COSTUME_RESEARCH_R7 } from '../src/game/wardrobeOfficialR7.js';
import { getOfficialCostumes,wardrobeActorKey,applyActorAppearance,getWardrobeCoverage,ALL_OFFICIAL_WARDROBE } from '../src/game/wardrobe.js';
import { COSTUME_FIDELITY_CRITERIA as criteria,COSTUME_REFERENCE_VIEWS as views,assessCostumeFidelity,isLocalEvidencePath } from '../src/game/wardrobeFidelity.js';
const raiden=HEROES_DB.find(h=>h.id==='raiden_mgr');
const entry=getOfficialCostumes(raiden).find(x=>x.key==='mgr-cyborg-ninja');
function complete(){
  const inventory=new Map();let i=0;
  const evidence=()=>{const path=`audit/costume/image-${++i}.png`,sha256=i.toString(16).padStart(64,'0');inventory.set(path,{sha256,pixelSha256:sha256,decoded:true,bytes:200,width:512,height:512});return {path,sha256};};
  const review={entryId:entry.id,actorKey:entry.actorKey,incarnation:'Revengeance Raiden — Cyborg Ninja skin',sourceWork:entry.sourceWork,reviewer:'Test reviewer',reviewedOn:'2026-10-24',scores:Object.fromEntries(criteria.map(c=>[c.key,c.max])),notes:Object.fromEntries(criteria.map(c=>[c.key,'Synthetic proof used only by unit tests.'])),references:views.map(view=>({view,sourceUrl:entry.sourceUrl,...evidence()})),sheet:evidence(),inGame:evidence(),checkedStates:['rpg:idle','tactics:attack','melee:shieldHold'].map(state=>({state,passed:true,notes:'Synthetic state check',...evidence()}))};
  return {review,inventory,requirements:{actorKey:entry.actorKey,asOf:'2026-10-24',states:review.checkedStates.map(x=>x.state)}};
}
for(const row of OFFICIAL_COSTUMES_R7)test(`R7 exact actor and immutable moveset: ${row.key}`,()=>{
 const actor=HEROES_DB.find(h=>h.id===row.actorIds[0]&&h.universe===row.universe);assert.ok(actor,row.actorIds[0]);
 const item=getOfficialCostumes(actor).find(x=>x.key===row.key);assert.ok(item);assert.ok(item.visualSpec.fr&&item.visualSpec.en);
 assert.equal(item.equippable,false);assert.equal(applyActorAppearance(actor,item.id),actor);assert.equal(item.production.fidelityCriteria.length,10);
});
test('all 64 R7 definitions retained alongside the R9 extension',()=>assert.equal(ALL_OFFICIAL_WARDROBE.length,64+OFFICIAL_COSTUMES_R9.length+(OFFICIAL_COSTUMES_R10.length+OFFICIAL_COSTUMES_R11.length)+OFFICIAL_COSTUMES_R12.length+OFFICIAL_COSTUMES_R13.length+OFFICIAL_COSTUMES_R14.length));
test('Raiden Cyborg Ninja is not rebound to Gray Fox or MGS2 Raiden',()=>{
 assert.equal(getOfficialCostumes({id:'gray_fox',universe:'Metal Gear'}).length,0);
 assert.equal(getOfficialCostumes({id:'raiden',universe:'Metal Gear'}).length,0);
 assert.equal(getOfficialCostumes(raiden).length,5);
});
test('Agent 47 retains the six R7 named suits, not associated pack weapons',()=>{const rows=getOfficialCostumes({id:'hitman_woa_agent_47',universe:'HITMAN — World of Assassination'}).filter(c=>OFFICIAL_COSTUMES_R7.some(r=>r.key===c.key));assert.equal(rows.length,6);for(const row of rows)assert.ok(!row.weapon&&!row.stats&&!row.special);});
test('Barry title-level evidence stays explicitly distinguished',()=>{const row=ALL_OFFICIAL_WARDROBE.find(x=>x.key==='rev2-barry-commandant');assert.equal(row.sourceEvidence,'PUBLISHER_PRODUCT_TITLE_ONLY');assert.equal(row.artApproval,'NOT_REVIEWED');});
test('Chris research partial, no assertion of exhaustive official list',()=>assert.equal(getWardrobeCoverage({id:'chris_redfield',universe:'Resident Evil'}).sourceResearch,'PARTIAL_DOCUMENTED'));
test('criteria total exactly 100',()=>assert.equal(criteria.reduce((n,c)=>n+c.max,0),100));
test('complete synthetic record is only ready for manual review, never equips',()=>{const x=complete(),r=assessCostumeFidelity(entry,x.review,x.inventory,x.requirements);assert.deepEqual(r.blockers,[]);assert.equal(r.status,'READY_FOR_MANUAL_REVIEW');assert.equal(r.score,100);assert.equal(r.artApproved,false);assert.equal(r.equippable,false);});
test('a bare numerical 100 cannot pass evidence gate',()=>{const x=complete(),r=assessCostumeFidelity(entry,{scores:x.review.scores});assert.equal(r.score,100);assert.equal(r.status,'EVIDENCE_INCOMPLETE');assert.equal(r.artApproved,false);});
for(const c of criteria)test(`score ${c.key} missing/negative/overweight/string/NaN is rejected`,()=>{for(const score of [undefined,-1,c.max+0.01,String(c.max),NaN,Infinity]){const x=complete();x.review.scores[c.key]=score;const r=assessCostumeFidelity(entry,x.review,x.inventory,x.requirements);assert.equal(r.score,null);assert.ok(r.blockers.includes(`INVALID_SCORE:${c.key}`));}});
for(const [score,expected] of [[90,'GARDER_A_CONFIRMER'],[89,'RETOUCHES'],[80,'RETOUCHES'],[79,'REFAIRE_PARTIEL'],[65,'REFAIRE_PARTIEL'],[64,'REFAIRE']])test(`review threshold ${score}`,()=>{const x=complete();let remaining=100-score;for(const c of criteria){const deduction=Math.min(remaining,c.max);x.review.scores[c.key]-=deduction;remaining-=deduction;}const r=assessCostumeFidelity(entry,x.review,x.inventory,x.requirements);assert.equal(r.score,score);assert.equal(r.proposedAction,expected);assert.equal(r.artApproved,false);});
for(const [label,mutate,blocker] of [
 ['wrong wearer',x=>x.review.actorKey=wardrobeActorKey({id:'gray_fox',universe:'Metal Gear'}),'IDENTITY_MISMATCH'],
 ['wrong costume',x=>x.review.entryId='something-else','IDENTITY_MISMATCH'],
 ['wrong work',x=>x.review.sourceWork='Metal Gear Solid 1','SOURCE_EDITION_MISMATCH'],
 ['no reviewer',x=>x.review.reviewer=' ','REVIEWER_REQUIRED'],
 ['invalid date',x=>x.review.reviewedOn='2026-02-31','REVIEW_DATE_REQUIRED'],
 ['future date',x=>x.review.reviewedOn='2027-01-01','FUTURE_REVIEW_DATE'],
 ['no incarnation',x=>x.review.incarnation='','INCARNATION_REQUIRED'],
 ['empty note',x=>x.review.notes.head='','CRITERION_NOTE_REQUIRED:head'],
 ['sheet missing',x=>x.inventory.delete(x.review.sheet.path),'COSTUME_SHEET_REQUIRED'],
 ['sheet swapped',x=>x.inventory.get(x.review.sheet.path).sha256='f'.repeat(64),'COSTUME_SHEET_REQUIRED'],
 ['no runtime contract',x=>x.requirements.states=[],'RUNTIME_STATES_REQUIRED'],
 ['wrong runtime actor',x=>x.requirements.actorKey='other','RUNTIME_IDENTITY_MISMATCH'],
 ['state missing',x=>x.review.checkedStates=[],'STATE_PROOF_REQUIRED:rpg:idle'],
 ['state failed',x=>x.review.checkedStates[0].passed=false,'STATE_PROOF_REQUIRED:rpg:idle'],
 ['game capture missing',x=>x.review.inGame=null,'IN_GAME_CAPTURE_REQUIRED'],
 ['source is output',x=>x.review.sheet={...x.review.references[0]},'SOURCE_IS_OUTPUT_SHEET'],
 ['output not in-game proof',x=>x.review.inGame=x.review.sheet,'IN_GAME_CAPTURE_IS_SHEET'],
 ['same image for views',x=>x.review.references[1]={...x.review.references[0],view:'back'},'REFERENCE_VIEWS_NOT_DISTINCT'],
 ['wrong source link',x=>x.review.references[0].sourceUrl='https://example.com','REFERENCE_SOURCE_MISMATCH:front']
])test(`evidence rejects ${label}`,()=>{const x=complete();mutate(x);assert.ok(assessCostumeFidelity(entry,x.review,x.inventory,x.requirements).blockers.includes(blocker));});
for(const view of views)test(`requires reference view ${view}`,()=>{const x=complete();x.review.references=x.review.references.filter(v=>v.view!==view);assert.ok(assessCostumeFidelity(entry,x.review,x.inventory,x.requirements).blockers.includes(`REFERENCE_FILE_REQUIRED:${view}`));});
test('path validation rejects remote, traversal, encoded and ambiguous paths',()=>{for(const path of ['../x.png','/x.png','a//b.png','a/./b.png','https://x/y.png','a%2fb.png','a\\b.png','a.png?query','a.png#x'])assert.equal(isLocalEvidencePath(path),false,path);assert.equal(isLocalEvidencePath('audit/wardrobe/r7/front.png'),true);});
test('null and hostile shape inputs fail closed without throwing',()=>{for(const value of [null,false,[],42])assert.equal(assessCostumeFidelity(null,value,null,null).status,'EVIDENCE_INCOMPLETE');});
test('inventory is not taken from a review supplied boolean',()=>{const x=complete();x.review.artApproved=true;x.review.filesVerified=true;const r=assessCostumeFidelity(entry,x.review,new Map(),x.requirements);assert.equal(r.status,'EVIDENCE_INCOMPLETE');assert.equal(r.artApproved,false);});
test('no source mutation',()=>{const x=complete(),before=JSON.stringify(x.review);assessCostumeFidelity(entry,x.review,x.inventory,x.requirements);assert.equal(JSON.stringify(x.review),before);});

test('three unbound source costumes stay separate from playable catalogue',()=>{
 for(const target of UNBOUND_COSTUME_RESEARCH_R7){assert.ok(!HEROES_DB.some(a=>a.name===target.actorName));assert.equal(target.equippable,false);assert.equal(target.status,'ACTOR_BINDING_MISSING');}
 assert.equal(UNBOUND_COSTUME_RESEARCH_R7.length,3);
});
for(const kind of ['inGame','checkedStates'])test(`renamed output sheet cannot be used as ${kind} evidence`,()=>{
 const x=complete(),copy={path:'audit/renamed-sheet.png',sha256:x.review.sheet.sha256};
 x.inventory.set(copy.path,{...x.inventory.get(x.review.sheet.path)});
 if(kind==='inGame')x.review.inGame=copy;else Object.assign(x.review.checkedStates[0],copy);
 const result=assessCostumeFidelity(entry,x.review,x.inventory,x.requirements);
 assert.ok(result.blockers.includes(kind==='inGame'?'IN_GAME_CAPTURE_IS_SHEET':'STATE_PROOF_IS_SHEET:rpg:idle'));
});
