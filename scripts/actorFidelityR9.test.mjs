import { OFFICIAL_COSTUMES_R10 } from '../src/game/wardrobeOfficialR10.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { HEROES_DB } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { createPlayerHero } from '../src/game/playerHero.js';
import { CANON_ROSTER_WAVE } from '../src/game/canonRosterWave.js';
import { OFFICIAL_COSTUMES_R9, WARDROBE_SOURCES_R9, WARDROBE_RESEARCH_R9 } from '../src/game/wardrobeOfficialR9.js';
import { OFFICIAL_WARDROBE } from '../src/game/wardrobeOfficial.js';
import { OFFICIAL_COSTUME_EXTENSION } from '../src/game/wardrobeExpansion.js';
import { OFFICIAL_COSTUMES_R7 } from '../src/game/wardrobeOfficialR7.js';
import { getOfficialCostumes, getWardrobeResearchTargets, wardrobeActorKey, applyActorAppearance, ALL_OFFICIAL_WARDROBE } from '../src/game/wardrobe.js';
import { getWardrobeUnlockCatalogue, getWardrobeBoosterPool } from '../src/game/wardrobeBoosterRewards.js';
import { buildActorFidelityBacklog, actorSourceScope, inspectActorRaster, readActorTechniques, indexActorContinuities } from '../src/game/actorFidelityBacklog.js';
const actors=[createPlayerHero(),...HEROES_DB];
for(const [universe,r] of Object.entries(ENEMIES_DB))for(const a of [...(r.monsters||[]),...(r.bosses||[]),...(r.worldBoss?[r.worldBoss]:[])])actors.push({...a,universe:a.universe||universe});
const byKey=new Map(actors.map(a=>[wardrobeActorKey(a),a]));
const all=getWardrobeUnlockCatalogue();
const universes=[...new Set(actors.map(a=>a.universe))];
const countByActor={lightning_ff13:14,sonic_hedgehog:4,horizon_zero_dawn_aloy:2,borderlands_2_salvador_gunzerking:4};
test('R9 has 24 distinct variants with exact names, not packs counted as costumes',()=>{
 assert.equal(OFFICIAL_COSTUMES_R9.length,24);assert.equal(ALL_OFFICIAL_WARDROBE.length,88+OFFICIAL_COSTUMES_R10.length);
 assert.equal(new Set(OFFICIAL_COSTUMES_R9.map(r=>r.key)).size,24);
 for(const [id,count] of Object.entries(countByActor))assert.equal(OFFICIAL_COSTUMES_R9.filter(r=>r.actorIds.includes(id)).length,count);
});
for(const row of OFFICIAL_COSTUMES_R9) {
 test(`R9 ${row.key}: exact wearer, appropriate booster and no fake equip`,()=>{
  const key=wardrobeActorKey({id:row.actorIds[0],universe:row.universe}), actor=byKey.get(key);assert.ok(actor);
  const entry=getOfficialCostumes(actor).find(e=>e.key===row.key);assert.ok(entry);
  assert.ok(WARDROBE_SOURCES_R9.some(s=>s.id===row.sourceId&&s.url===row.sourceUrl));
  assert.equal(entry.equippable,false);assert.equal(entry.artApproval,'NOT_REVIEWED');assert.equal(entry.visualEvidence,'NOT_INSPECTED');
  assert.equal(applyActorAppearance(actor,entry.id),actor);assert.ok(entry.visualSpec.fr&&entry.visualSpec.en);
  const reward=all.find(e=>e.id===entry.id);assert.ok(reward);assert.equal(reward.actorKey,key);
  const pool=getWardrobeBoosterPool({banner:{id:`universe:${actor.universe}`,universe:actor.universe},visibleUniverses:universes});
  assert.ok(pool.some(e=>e.id===entry.id));
  assert.equal(getOfficialCostumes({...actor,universe:'Unrelated'}).some(e=>e.key===row.key),false);
 });
}
test('R5 to R7 designs and saved identifiers are all retained',()=>{
 for(const r of [...OFFICIAL_WARDROBE,...OFFICIAL_COSTUME_EXTENSION,...OFFICIAL_COSTUMES_R7])for(const id of r.actorIds){
  const actor=byKey.get(wardrobeActorKey({id,universe:r.universe}));assert.ok(actor);
  assert.ok(getOfficialCostumes(actor).some(e=>e.key===r.key));
 }
 assert.equal(all.length,19895+OFFICIAL_COSTUMES_R10.length);assert.equal(all.filter(e=>e.origin==='OFFICIAL').length,91+OFFICIAL_COSTUMES_R10.length);
});
test('Lightning crossover garbs never become Cloud or Lara rewards',()=>{
 for(const id of ['cloud_ff7','lara_croft_tr'])assert.ok(!getOfficialCostumes(actors.find(a=>a.id===id)).some(e=>e.key.startsWith('lr-')));
});
test('named resource pack, unconfirmed Noctis binding and excluded PC Aerith remain research only',()=>{
 assert.equal(WARDROBE_RESEARCH_R9.length,3);
 for(const research of WARDROBE_RESEARCH_R9){
  const actor=byKey.get(wardrobeActorKey(research));assert.ok(actor);
  assert.ok(getWardrobeResearchTargets(actor).some(r=>r.key===research.key));
  assert.ok(!all.some(e=>e.id.endsWith(`research-${research.key}`)));
 }
 assert.ok(!OFFICIAL_COSTUMES_R9.some(r=>r.actorIds.includes('noctis_ff15')));
});
test('partial customization is explicit: two heads, two body skins, footwear only',()=>{
 assert.equal(OFFICIAL_COSTUMES_R9.filter(r=>r.component==='head-only').length,2);
 assert.equal(OFFICIAL_COSTUMES_R9.filter(r=>r.component==='body-skin-only').length,2);
 assert.equal(OFFICIAL_COSTUMES_R9.filter(r=>r.component==='footwear-only').length,1);
});
test('research uses exact identity; a namesake cannot acquire it',()=>assert.equal(getWardrobeResearchTargets({id:'noctis_ff15',universe:'Wrong'}).length,0));
const sample={id:'x',name:'Subject',universe:'Source',simple:{name:'Subject Signature Strike'}};
const tree=new Map([['public/sprites/present.png',{sha:'123',size:42}]]);
test('read-only backlog never approves art from a valid file',()=>{
 const row=buildActorFidelityBacklog(sample,{rasterProbes:[inspectActorRaster('/sprites/present.png','auto','idle',tree,{columns:4,rows:4})]});
 assert.equal(row.artApproved,false);assert.equal(row.completeness,'OPEN_NOT_EXHAUSTIVE');assert.equal(row.missingRasterPaths.length,0);
 assert.ok(row.tasks.some(t=>t.code==='ANIMATION_AND_VISUAL_REVIEW'));
});
test('file absence names the exact missing path without alleging a crash',()=>{
 const row=buildActorFidelityBacklog(sample,{rasterProbes:[inspectActorRaster('/sprites/missing.png','auto','idle',tree)]});
 assert.deepEqual(row.missingRasterPaths,['/sprites/missing.png']);assert.ok(row.tasks.some(t=>t.code==='RASTER_MISSING'));
});
test('unresolved and externally hosted files are not miscounted as missing',()=>{
 for(const src of ['',null,'https://example.com/a.png','//example.com/a.png'])assert.equal(inspectActorRaster(src,'auto','idle',tree).present,null);
});
test('encoded traversal is refused',()=>assert.equal(inspectActorRaster('/sprites/%2e%2e/a.png','auto','idle',tree).status,'INVALID_PATH'));
test('static HUD is not a gameplay animation fault',()=>{
 const probes=[inspectActorRaster('/sprites/present.png','hud','idle',tree,{columns:1,rows:1})];
 assert.equal(buildActorFidelityBacklog(sample,{rasterProbes:probes}).staticGameplayPaths.length,0);
});
test('same file used in HUD and gameplay still gets gameplay warning',()=>{
 const probes=['hud','auto'].map(c=>inspectActorRaster('/sprites/present.png',c,'idle',tree,{columns:1,rows:1}));
 assert.equal(buildActorFidelityBacklog(sample,{rasterProbes:probes}).staticGameplayPaths.length,1);
});
test('a fan-made sprite of an external identity is not classified as an OC',()=>assert.equal(actorSourceScope({...sample,canonStatus:'original fan-made artwork'}),'EXTERNAL_OR_UNRESOLVED'));
test('explicit original identity gets internal design work, not invented official costumes',()=>{
 const row=buildActorFidelityBacklog({...sample,originalContent:true});
 assert.equal(row.officialResearchStatus,'EXTERNAL_NOT_APPLICABLE');assert.ok(!row.tasks.some(t=>t.code==='OFFICIAL_COSTUME_RESEARCH'));
 assert.ok(row.tasks.some(t=>t.code==='INTERNAL_DESIGN_REVIEW'));
});
test('original universe membership is exact',()=>{
 assert.equal(actorSourceScope(sample,new Set(['Source'])),'ORIGINAL_DESIGN');assert.equal(actorSourceScope(sample,new Set(['source'])),'EXTERNAL_OR_UNRESOLVED');
});
test('generic attack detection reports the source names; it does not invent a replacement',()=>{
 assert.equal(readActorTechniques(sample)[0].genericName,true);
 assert.equal(readActorTechniques({...sample,simple:{name:'Hunter Bow'}})[0].genericName,false);
});
test('missing metadata produces concrete, separate tasks',()=>{
 const row=buildActorFidelityBacklog(sample);for(const c of ['INCARNATION_UNSPECIFIED','VISUAL_CONTRACT_MISSING','REFERENCE_MISSING'])assert.ok(row.tasks.some(t=>t.code===c));
 assert.ok(row.tasks.every(t=>t.status==='OPEN'&&t.artApproved===false));
});
test('source face substitution is a contract issue, not automatic pixel evidence',()=>{
 const row=buildActorFidelityBacklog({...sample,visualAnchor:'original face'});
 assert.ok(row.tasks.some(t=>t.code==='SOURCE_FACE_CONTRACT_REVIEW'));assert.equal(row.artApproved,false);
});
test('plain generic visual boilerplate remains a gap despite a nonempty anchor',()=>{
 const row=buildActorFidelityBacklog({...sample,visualAnchor:'Subject, preserving the canonical silhouette, palette, outfit and signature prop from the locked continuity.'});
 assert.ok(row.tasks.some(t=>t.code==='VISUAL_CONTRACT_GENERIC'));
});
const pack={universe:'Source',key:'p',continuity:'Episode 1',hero:['x','Subject','marine'],allies:[],monsters:[],bosses:[]};
test('continuity is recovered only through exact actor/universe membership',()=>{
 const ix=indexActorContinuities([pack]);const row=buildActorFidelityBacklog(sample,{continuityIndex:ix});
 assert.equal(row.incarnation,'Episode 1');assert.equal(row.incarnationEvidence,'EXACT_PACK_BINDING');
 assert.ok(!row.tasks.some(t=>t.code==='INCARNATION_UNSPECIFIED'));
 assert.equal(buildActorFidelityBacklog({...sample,id:'wrong'},{continuityIndex:ix}).incarnation,'');
});
test('conflicting pack continuities stay unresolved',()=>{
 const ix=indexActorContinuities([pack,{...pack,continuity:'Episode 2'}]);const row=buildActorFidelityBacklog(sample,{continuityIndex:ix});
 assert.equal(row.incarnation,'');assert.equal(row.incarnationEvidence,'AMBIGUOUS_PACK_BINDING');
 assert.ok(row.tasks.some(t=>t.code==='PACK_CONTINUITY_CONFLICT'));
});
test('actor-declared incarnation is not overwritten by a pack',()=>assert.equal(buildActorFidelityBacklog({...sample,incarnation:'Exact model'},{continuityIndex:indexActorContinuities([pack])}).incarnation,'Exact model'));
test('all 4936 current actors receive separate dossiers without mutating the roster',()=>{
 const before=JSON.stringify(actors),ix=indexActorContinuities(CANON_ROSTER_WAVE),keys=new Set();
 for(const a of actors){const row=buildActorFidelityBacklog(a,{continuityIndex:ix});assert.ok(!keys.has(row.actorKey));keys.add(row.actorKey);assert.ok(row.tasks.length>0);assert.equal(row.actorName,a.name);}
 assert.equal(keys.size,4936);assert.equal(JSON.stringify(actors),before);
});
test('all official sources retain publishers and checked date, without inventing visual review',()=>{
 assert.equal(WARDROBE_SOURCES_R9.length,7);assert.ok(WARDROBE_SOURCES_R9.every(s=>s.checkedOn==='2026-10-24'&&s.publisher));
});
