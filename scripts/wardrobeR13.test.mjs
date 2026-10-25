import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {HEROES_DB} from '../src/game/heroes.js';
import {ENEMIES_DB} from '../src/game/enemies.js';
import {createPlayerHero} from '../src/game/playerHero.js';
import {sanitizeSaveCore} from '../src/game/saveValidation.js';
import {OFFICIAL_COSTUMES_R13,WARDROBE_SOURCES_R13,PAYDAY_WEARERS_R13,MAGICKA_WEARERS_R13,
 PAYDAY_NAMED_PACKS_R13,WARDROBE_SOURCE_SCOPES_R13,WARDROBE_RESEARCH_R13,UNBOUND_COSTUME_RESEARCH_R13} from '../src/game/wardrobeOfficialR13.js';
import {ALL_OFFICIAL_WARDROBE,getOfficialCostumes,getWardrobeSourceScopeCoverage,getWardrobeCoverage,
 getWardrobeResearchTargets,wardrobeActorKey,applyActorAppearance} from '../src/game/wardrobe.js';
import {assessNamedCostumeScope} from '../src/game/wardrobeSourceCoverage.js';
import {getWardrobeUnlockCatalogue,getWardrobeBoosterPool,getWardrobeBoosterProgress,
 drawWardrobeBoosterBonus,grantWardrobeBoosterBonus} from '../src/game/wardrobeBoosterRewards.js';
const actors=[createPlayerHero(),...HEROES_DB];
for(const [u,r] of Object.entries(ENEMIES_DB))for(const a of [...r.monsters,...r.bosses,r.worldBoss].filter(Boolean))actors.push({...a,universe:a.universe||u});
const byKey=new Map(actors.map(a=>[wardrobeActorKey(a),a]));
const all=getWardrobeUnlockCatalogue(),visible=[...new Set(all.map(e=>e.universe))];
const keys=new Set(OFFICIAL_COSTUMES_R13.map(e=>e.key));
const isNew=e=>keys.has(e.id.slice(e.id.lastIndexOf(':')+1));
const additions=all.filter(isNew),old=all.filter(e=>!isNew(e));
const pool=(universe,extra={})=>getWardrobeBoosterPool({banner:{id:`universe:${universe}`,universe},visibleUniverses:visible,...extra});
test('R13 has 33 source definitions, 186 exact assignments, nine previously uncovered identities',()=>{
 assert.equal(OFFICIAL_COSTUMES_R13.length,33);assert.equal(keys.size,33);assert.equal(additions.length,186);
 assert.equal(new Set(additions.map(e=>e.actorKey)).size,9);assert.equal(ALL_OFFICIAL_WARDROBE.length,176);
 assert.equal(all.filter(e=>e.origin==='OFFICIAL').length,335);assert.equal(all.length,20139);
 assert.equal(new Set(all.filter(e=>e.origin==='OFFICIAL').map(e=>e.actorKey)).size,54);assert.equal(byKey.size,4936);
});
test('all 19953 previous entitlement IDs retain the exact SHA-256',()=>{
 assert.equal(old.length,19953);assert.equal(createHash('sha256').update(JSON.stringify(old.map(e=>e.id).sort())).digest('hex'),'3b4fdc6ce85e908b3760b6aa0d3e45f62eb53b8c16e161b7f26c8905271d956c');
});
for(const row of OFFICIAL_COSTUMES_R13)test(`source component and explicit recipient review: ${row.key}`,()=>{
 assert.ok(WARDROBE_SOURCES_R13.some(s=>s.id===row.sourceId&&s.url===row.sourceUrl));
 assert.ok(row.brief.fr.length>80&&row.brief.en.length>80);assert.ok(row.sourceMode&&row.targetIncarnation&&row.component);
 assert.equal(row.sourceEvidence,'PUBLISHER_NAMED_SHARED_COSMETIC');assert.equal(row.wearerEvidence,'PER_WEARER_VISUAL_REFERENCE_REQUIRED');
 for(const id of row.actorIds){
  const a=byKey.get(wardrobeActorKey({id,universe:row.universe}));assert.ok(a);
  const c=getOfficialCostumes(a).find(e=>e.key===row.key);assert.ok(c);assert.equal(c.artworkStatus,'NOT_PRODUCED');
  assert.equal(c.equippable,false);assert.equal(c.production.status,'ARTWORK_PENDING');assert.equal(c.production.artApproved,false);
  assert.equal(applyActorAppearance(a,c.id),a);assert.equal(c.production.component,row.component);
  const r=all.find(e=>e.id===c.id);assert.ok(r&&pool(row.universe).includes(r));assert.equal(r.sourceWork,row.sourceWork);
  assert.ok(!r.stats&&!r.weapon&&!r.special);assert.equal(row.sourceGameplayTransferred,false);
 }
});
for(const [universe,ids,count] of [['Payday',PAYDAY_WEARERS_R13,29],['Magicka',MAGICKA_WEARERS_R13,4]])for(const id of ids)test(`exact wardrobe and booster containment: ${universe}/${id}`,()=>{
 const a=byKey.get(wardrobeActorKey({universe,id}));assert.ok(a);const before=JSON.stringify(a);
 assert.equal(getOfficialCostumes(a).filter(c=>keys.has(c.key)).length,count);
 assert.ok(getWardrobeBoosterPool({banner:{id:'multi'},visibleUniverses:visible}).some(e=>isNew(e)&&e.actorId===id));
 assert.ok(!pool(universe,{disabledAssets:{heroes:[id]}}).some(e=>isNew(e)&&e.actorId===id));
 assert.ok(!pool(universe,{hiddenUniverses:[universe]}).some(isNew));
 assert.ok(!getOfficialCostumes({...a,universe:'Wrong universe'}).some(c=>keys.has(c.key)));
 assert.equal(getWardrobeCoverage(a).allCharacterCostumesResearched,false);assert.equal(JSON.stringify(a),before);
});
test('Bain is not a playable heister recipient and enemies get no shared player kit',()=>{
 assert.ok(!getOfficialCostumes({id:'bain_pd',universe:'Payday'}).some(c=>keys.has(c.key)));
 assert.ok(additions.every(e=>e.actorKind==='hero'));
 assert.ok(!additions.some(e=>e.actorName==='Bain'||e.universe==='Alien'));
});
test('12 Lawless components are four suits, four masks, four glove pairs, not twelve full suits',()=>{
 const rows=OFFICIAL_COSTUMES_R13.filter(e=>e.coverageScopeId==='pd2-lawless-named-components');assert.equal(rows.length,12);
 for(const component of ['outfit-only','head-mask','hands-gloves'])assert.equal(rows.filter(e=>e.component===component).length,4);
});
test('Mega City has sixteen paid components and one separately documented free outfit',()=>{
 assert.equal(PAYDAY_NAMED_PACKS_R13[1].items.length,16);assert.equal(PAYDAY_NAMED_PACKS_R13[2].items.length,1);
 const free=OFFICIAL_COSTUMES_R13.find(e=>e.name.en==='Dragon Bomber Red');assert.equal(free.sourceAcquisition,'FREE_UPDATE_IN_SOURCE');
 assert.notEqual(free.coverageScopeId,'pd2-megacity-paid-named-components');
});
test('gloves, masks and wizard hat grant no other part of their source pack',()=>{
 for(const entry of additions.filter(e=>e.component!=='outfit-only')){
  const inventory=grantWardrobeBoosterBonus([],entry,pool(entry.universe));assert.deepEqual(inventory,[entry.id]);
 }
});
test('Magicka hat is not a sword, staff, spell or full body costume',()=>{
 const hat=OFFICIAL_COSTUMES_R13.find(e=>e.key==='r13-magicka-survival-hat');assert.equal(hat.component,'headwear');assert.equal(hat.nature,'official-accessory');
 assert.ok(!additions.some(e=>['Sharp Sword','Staff +1','Meteor Shower'].includes(e.name.en)));
});
test('cosplay and source names never move into other franchise pools',()=>{
 for(const u of ['Half-Life','Day of the Tentacle','Star Wars','Alien','Resident Evil'])assert.ok(!pool(u).some(isNew));
});
for(const [universe,n] of [['Payday',174],['Magicka',12]])test(`completed ${universe} collection reopens exactly ${n} new rights`,()=>{
 const p=pool(universe);let inventory=p.filter(e=>!isNew(e)).map(e=>e.id);assert.equal(getWardrobeBoosterProgress(p,inventory).remaining,n);
 const seen=new Set();for(let i=0;i<n;i++){
  const e=drawWardrobeBoosterBonus({pool:p,inventory,rng:()=>0.5});assert.ok(e&&isNew(e)&&!seen.has(e.id));seen.add(e.id);
  inventory=grantWardrobeBoosterBonus(inventory,e,p);assert.equal(grantWardrobeBoosterBonus(inventory,e,p),inventory);
 }
 assert.equal(drawWardrobeBoosterBonus({pool:p,inventory}),null);assert.equal(getWardrobeBoosterProgress(p,inventory).remaining,0);
});
test('186 new entitlements survive save normalization, equipment duplicates and future ids preserved',()=>{
 const inv=['equipment','equipment','future:keep',...additions.map(e=>e.id)];
 const saved=sanitizeSaveCore({inventory:inv,unlockedHeroes:['leon'],heroSkins:{}},{knownHeroIds:HEROES_DB.map(a=>a.id)});
 const baseline=sanitizeSaveCore({inventory:[],unlockedHeroes:['leon']},{knownHeroIds:HEROES_DB.map(a=>a.id)});
 assert.deepEqual(saved.inventory,inv);assert.deepEqual(saved.unlockedHeroes,baseline.unlockedHeroes);assert.equal(saved.gold,0);
 assert.ok(!saved.unlockedHeroes.some(id=>PAYDAY_WEARERS_R13.includes(id)||MAGICKA_WEARERS_R13.includes(id)));
});
for(const scope of WARDROBE_SOURCE_SCOPES_R13)test(`named component/edition scope remains review-only: ${scope.actorId}/${scope.id}`,()=>{
 const a=byKey.get(wardrobeActorKey({id:scope.actorId,universe:scope.universe}));assert.ok(a);
 const r=getWardrobeSourceScopeCoverage(a).find(s=>s.scopeId===scope.id);assert.equal(r.status,'NAMED_SCOPE_COMPLETE');
 assert.equal(r.matched,scope.expectedItems.length);assert.equal(r.equippable,false);assert.equal(r.artApproved,false);assert.equal(r.allCharacterCostumesResearched,false);
});
const scope=WARDROBE_SOURCE_SCOPES_R13[0],actor=byKey.get(wardrobeActorKey({id:scope.actorId,universe:scope.universe}));
for(const field of ['nature','component','sourceWork','sourceMode'])test(`same name but wrong ${field} cannot complete a source scope`,()=>{
 const key=scope.expectedItems[0].key;const rows=ALL_OFFICIAL_WARDROBE.map(c=>c.key===key?{...c,[field]:'different'}:c);
 const result=assessNamedCostumeScope(actor,scope,rows);assert.equal(result.status,'NAMED_SCOPE_INCOMPLETE');assert.deepEqual(result.conflicts,[key]);
});
for(const field of ['nature','component','sourceWork','sourceMode'])test(`malformed declared ${field} is rejected rather than ignored`,()=>{
 for(const value of ['',null,3,{},'   '])assert.throws(()=>assessNamedCostumeScope(actor,{...scope,expectedItems:[{...scope.expectedItems[0],[field]:value}]},ALL_OFFICIAL_WARDROBE));
});
test('legacy R12 name-only scope remains complete',()=>{
 const a=byKey.get(wardrobeActorKey({id:'dead_rising_frank_west',universe:'Dead Rising'}));
 assert.equal(getWardrobeSourceScopeCoverage(a)[0].status,'NAMED_SCOPE_COMPLETE');
});
test('nine wearer-specific research targets remain outside unlock pools',()=>{
 assert.equal(WARDROBE_RESEARCH_R13.length,9);
 for(const target of WARDROBE_RESEARCH_R13){assert.ok(byKey.has(wardrobeActorKey(target)));const r=getWardrobeResearchTargets(target).find(e=>e.key===target.key);assert.ok(r);assert.equal(r.officialConfirmed,false);assert.ok(!all.some(e=>e.id===r.entryId));}
});
test('three villain identities and adult Hokage are not assigned to archetypes or younger Naruto',()=>{
 assert.equal(UNBOUND_COSTUME_RESEARCH_R13.length,4);
 for(const r of UNBOUND_COSTUME_RESEARCH_R13){assert.equal(r.equippable,false);assert.ok(!actors.some(a=>a.universe===r.universe&&a.name===r.actorName));assert.ok(!additions.some(e=>e.name.en===r.costume));}
 for(const id of ['naruto_uzumaki_young','naruto_six_paths'])assert.ok(!getOfficialCostumes(actors.find(a=>a.id===id)).some(c=>c.key.startsWith('r13-')));
});
