import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { HEROES_DB } from '../src/game/heroes.js';
import { OFFICIAL_COSTUMES_R14, WARDROBE_NAMED_PACKS_R14, WARDROBE_SOURCES_R14,
 WARDROBE_SOURCE_SCOPES_R14, WARDROBE_RESEARCH_R14 } from '../src/game/wardrobeOfficialR14.js';
import { ALL_OFFICIAL_WARDROBE, getOfficialCostumes, getWardrobeCoverage, getWardrobeResearchTargets,
 getWardrobeSourceScopeCoverage, wardrobeActorKey, applyActorAppearance, isSafeWardrobeReference } from '../src/game/wardrobe.js';
import { getWardrobeUnlockCatalogue, getWardrobeBoosterPool, getWardrobeBoosterProgress,
 drawWardrobeBoosterBonus, grantWardrobeBoosterBonus } from '../src/game/wardrobeBoosterRewards.js';
import { assessNamedCostumeScope } from '../src/game/wardrobeSourceCoverage.js';
import { sanitizeSaveCore } from '../src/game/saveValidation.js';
const all=getWardrobeUnlockCatalogue();
const keys=new Set(OFFICIAL_COSTUMES_R14.map(c=>c.key));
const isNew=e=>keys.has(e.id.split(':').at(-1));
const added=all.filter(isNew),previous=all.filter(e=>!isNew(e));
const visible=[...new Set(all.map(e=>e.universe))];
const pool=(u,extra={})=>getWardrobeBoosterPool({banner:{id:`universe:${u}`,universe:u},visibleUniverses:visible,...extra});
const wearer=row=>HEROES_DB.find(a=>a.universe===row.universe&&a.id===row.actorIds[0]);
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
test('fourteen named variants across two exact wearers; no actor or fake art added',()=>{
 assert.equal(OFFICIAL_COSTUMES_R14.length,14);assert.equal(added.length,14);assert.equal(keys.size,14);
 assert.equal(new Set(added.map(e=>e.actorKey)).size,2);assert.equal(new Set(all.map(e=>e.actorKey)).size,4936);
 assert.equal(ALL_OFFICIAL_WARDROBE.length,190);assert.equal(all.length,20153);assert.equal(all.filter(e=>e.origin==='OFFICIAL').length,349);
 assert.equal(new Set(all.filter(e=>e.origin==='OFFICIAL').map(e=>e.actorKey)).size,55);
});
test('all 20139 previous rights retain both IDs and full descriptors byte-for-byte',()=>{
 assert.equal(previous.length,20139);
 assert.equal(hash(previous.map(e=>e.id).sort()),'d047702d02910f9e5162468b62e74786a50116175b8a4baa8fed5fe6e24839a1');
 assert.equal(hash(previous),'5e0962674ff96f83a4a227c3c2327dfa99215a3b70787a6d3b7266bf07deb24e');
});
for(const row of OFFICIAL_COSTUMES_R14){
 test(`R14 exact actor, edition and pending-art contract: ${row.key}`,()=>{
  const actor=wearer(row);assert.ok(actor);const before=JSON.stringify(actor);
  const c=getOfficialCostumes(actor).find(c=>c.key===row.key);assert.ok(c);assert.equal(c.actorKey,wardrobeActorKey(actor));
  assert.ok(WARDROBE_SOURCES_R14.some(s=>s.id===row.sourceId&&s.url===row.sourceUrl));assert.ok(isSafeWardrobeReference(row.sourceUrl));
  assert.ok(row.brief.fr.length>150&&row.brief.en.length>150);assert.ok(row.component&&row.targetIncarnation&&row.sourceMode);
  assert.equal(c.equippable,false);assert.equal(c.artworkStatus,'NOT_PRODUCED');assert.equal(c.artApproval,'NOT_REVIEWED');
  assert.equal(c.visualEvidence,'NOT_INSPECTED');assert.equal(c.production.status,'ARTWORK_PENDING');
  assert.equal(applyActorAppearance(actor,c.id),actor);assert.equal(JSON.stringify(actor),before);
  assert.equal(getWardrobeCoverage(actor).allCharacterCostumesResearched,false);
 });
 test(`R14 booster, mask/disable filters and idempotent ownership: ${row.key}`,()=>{
  const actor=wearer(row),c=getOfficialCostumes(actor).find(c=>c.key===row.key),e=all.find(e=>e.id===c.id);assert.ok(e);
  const p=pool(row.universe);assert.ok(p.includes(e));assert.ok(getWardrobeBoosterPool({banner:{id:'multi'},visibleUniverses:visible}).includes(e));
  assert.ok(!pool(row.universe,{hiddenUniverses:[row.universe]}).includes(e));
  assert.ok(!pool(row.universe,{disabledAssets:{heroes:[actor.id]}}).includes(e));
  assert.ok(!pool(row.universe==='RoboCop'?'HITMAN — World of Assassination':'RoboCop').includes(e));
  assert.equal(e.sourceMode,row.sourceMode);assert.equal(e.component,row.component);assert.equal(e.targetIncarnation,row.targetIncarnation);
  const original=['equipment','equipment','future:keep'],owned=grantWardrobeBoosterBonus(original,e,p);
  assert.deepEqual(owned,[...original,e.id]);assert.equal(original.length,3);assert.equal(grantWardrobeBoosterBonus(owned,e,p),owned);
  assert.ok(!e.stats&&!e.weapon&&!e.special);assert.equal(row.sourceGameplayTransferred,false);
 });
}
for(const scope of WARDROBE_SOURCE_SCOPES_R14)test(`independent named scope: ${scope.id}`,()=>{
 const actor={id:scope.actorId,universe:scope.universe};
 const complete=getWardrobeSourceScopeCoverage(actor).find(s=>s.scopeId===scope.id);assert.equal(complete.status,'NAMED_SCOPE_COMPLETE');
 assert.equal(complete.expected,scope.expectedItems.length);assert.equal(complete.equippable,false);assert.equal(complete.artApproved,false);
 assert.equal(complete.allCharacterCostumesResearched,false);
 const removed=scope.expectedItems[0].key;
 const report=assessNamedCostumeScope(actor,scope,ALL_OFFICIAL_WARDROBE.filter(c=>c.key!==removed));
 assert.deepEqual(report.missing,[removed]);assert.equal(report.status,'NAMED_SCOPE_INCOMPLETE');
});
for(const [u,count] of [['HITMAN — World of Assassination',13],['RoboCop',1]])test(`old completed ${u} pool receives only its ${count} new rights`,()=>{
 const p=pool(u);let inventory=p.filter(e=>!isNew(e)).map(e=>e.id);assert.equal(getWardrobeBoosterProgress(p,inventory).remaining,count);
 const seen=new Set();for(let i=0;i<count;i++){const e=drawWardrobeBoosterBonus({pool:p,inventory,rng:()=>0.4});assert.ok(isNew(e)&&!seen.has(e.id));seen.add(e.id);inventory=grantWardrobeBoosterBonus(inventory,e,p);}
 assert.equal(getWardrobeBoosterProgress(p,inventory).remaining,0);assert.equal(drawWardrobeBoosterBonus({pool:p,inventory}),null);
});
test('nine named source subsets do not promise complete wardrobes or all seven sins',()=>{
 assert.equal(WARDROBE_NAMED_PACKS_R14.length,9);
 const greed=WARDROBE_SOURCE_SCOPES_R14.find(s=>s.id==='r14-greed-act1-wearable');assert.equal(greed.expectedItems.length,1);
 assert.ok(WARDROBE_RESEARCH_R14.some(r=>r.key==='r14-other-six-sins'));
});
test('named garments never copy celebrity targets, NPCs, weapons or paid mission privileges',()=>{
 for(const id of ['hitman_woa_diana_burnwood','hitman_woa_lucas_grey','robocop_anne_lewis','robocop_warren_reed']){
  const a=HEROES_DB.find(a=>a.id===id);assert.ok(a);assert.ok(!getOfficialCostumes(a).some(c=>keys.has(c.key)));
 }
 for(const x of ['The Splitter SMG','The Banker Silenced Pistol','The Smoke','Auto-9 prototype skin','The Contagion'])assert.ok(!added.some(c=>c.name.en===x));
});
test('Damaged is a body model pending reference review, not a gifted shotgun or blue palette',()=>{
 const c=OFFICIAL_COSTUMES_R14.find(c=>c.key==='r14-robocop-damaged');assert.equal(c.nature,'official-model');assert.equal(c.component,'body-model');
 assert.equal(c.modelChange,'UNASSESSED');assert.equal(c.sourceMode,'ROGUE_CITY_MURPHY_FILM1987_INSPIRED');
 assert.ok(!OFFICIAL_COSTUMES_R14.some(c=>c.name.en==='Blue Armor'));
});
test('all four specific research leads bind to actual identities but not rewards',()=>{
 assert.equal(WARDROBE_RESEARCH_R14.length,4);
 for(const r of WARDROBE_RESEARCH_R14){assert.ok(HEROES_DB.some(a=>a.id===r.id&&a.universe===r.universe));
  const t=getWardrobeResearchTargets(r).find(t=>t.key===r.key);assert.ok(t);assert.equal(t.officialConfirmed,false);assert.equal(t.equippable,false);assert.ok(!all.some(e=>e.id===t.entryId));}
});
test('save normalization preserves new rights, duplicate equipment and future IDs',()=>{
 const inventory=['gear','gear','future:id',...added.map(c=>c.id)];const data={inventory,unlockedHeroes:['leon'],heroSkins:{}};
 const saved=sanitizeSaveCore(data,{knownHeroIds:HEROES_DB.map(h=>h.id)});
 assert.deepEqual(saved.inventory,inventory);assert.equal(saved.gold,0);assert.ok(!saved.unlockedHeroes.includes('alex_murphy_robocop'));
});
test('publisher hosts accepted only with exact HTTPS host and no credentials',()=>{
 for(const host of ['ioi.dk','www.nacongaming.com']){assert.ok(isSafeWardrobeReference(`https://${host}/source`));
  for(const url of [`http://${host}/source`,`https://${host}.evil.test`,`https://u:p@${host}/`])assert.equal(isSafeWardrobeReference(url),false);}
});
// Mutation tests model an author omitting a delivered row BEFORE module evaluation.
// With the old circular implementation, the expected list silently lost that row too.
const r13Source=fs.readFileSync(new URL('../src/game/wardrobeOfficialR13.js',import.meta.url),'utf8');
for(const [group,replacement,lost,scopeId] of [
 ['payday','[...payday.slice(1),...magicka]','r13-pd2-lawless-named-components-wild-bunch','pd2-lawless-named-components'],
 ['magicka','[...payday,...magicka.slice(1)]','r13-magicka-gamer-zombie','magicka-gamer-named-robes']
])test(`omitted ${group} delivery cannot shrink its independent source expectations`,async()=>{
 const marker='Object.freeze([...payday,...magicka])';assert.equal(r13Source.split(marker).length,2);
 const changed=r13Source.replace(marker,`Object.freeze(${replacement})`);
 const m=await import(`data:text/javascript;base64,${Buffer.from(changed).toString('base64')}`);
 const s=m.WARDROBE_SOURCE_SCOPES_R13.find(s=>s.id===scopeId);assert.ok(s.expectedItems.some(e=>e.key===lost));
 const r=assessNamedCostumeScope({id:s.actorId,universe:s.universe},s,m.OFFICIAL_COSTUMES_R13);
 assert.deepEqual(r.missing,[lost]);assert.equal(r.status,'NAMED_SCOPE_INCOMPLETE');
});
test('R14 omitted generated delivery also retains the source requirement',async()=>{
 const raw=fs.readFileSync(new URL('../src/game/wardrobeOfficialR14.js',import.meta.url),'utf8');
 const marker='WARDROBE_NAMED_PACKS_R14.flatMap(p=>p.items.map';assert.equal(raw.split(marker).length,2);
 const changed=raw.replace(marker,"WARDROBE_NAMED_PACKS_R14.flatMap(p=>p.items.filter(i=>i.key!=='r14-rapacious').map");
 const m=await import(`data:text/javascript;base64,${Buffer.from(changed).toString('base64')}`);
 const s=m.WARDROBE_SOURCE_SCOPES_R14.find(s=>s.id==='r14-greed-act1-wearable');
 assert.equal(s.expectedItems.length,1);assert.equal(assessNamedCostumeScope({id:s.actorId,universe:s.universe},s,m.OFFICIAL_COSTUMES_R14).status,'NAMED_SCOPE_INCOMPLETE');
});
