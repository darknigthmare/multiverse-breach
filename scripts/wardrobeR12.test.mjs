import { OFFICIAL_COSTUMES_R13, WARDROBE_SOURCE_SCOPES_R13 } from '../src/game/wardrobeOfficialR13.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { HEROES_DB } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { createPlayerHero } from '../src/game/playerHero.js';
import { sanitizeSaveCore } from '../src/game/saveValidation.js';
import { OFFICIAL_COSTUMES_R12, WARDROBE_SOURCES_R12, WARDROBE_RESEARCH_R12, UNBOUND_COSTUME_RESEARCH_R12, WARDROBE_SOURCE_SCOPES_R12, DRDR_NAMED_PACKS_R12 } from '../src/game/wardrobeOfficialR12.js';
import { ALL_OFFICIAL_WARDROBE, getOfficialCostumes, getWardrobeResearchTargets, getWardrobeCoverage, getWardrobeSourceScopeCoverage, wardrobeActorKey, applyActorAppearance, isSafeWardrobeReference } from '../src/game/wardrobe.js';
import { assessNamedCostumeScope } from '../src/game/wardrobeSourceCoverage.js';
import { getWardrobeUnlockCatalogue, getWardrobeBoosterPool, getWardrobeBoosterProgress, drawWardrobeBoosterBonus, grantWardrobeBoosterBonus } from '../src/game/wardrobeBoosterRewards.js';
const actors=[createPlayerHero(),...HEROES_DB];
for(const [u,r] of Object.entries(ENEMIES_DB))for(const a of [...r.monsters,...r.bosses,r.worldBoss].filter(Boolean))actors.push({...a,universe:a.universe||u});
const byKey=new Map(actors.map(a=>[wardrobeActorKey(a),a]));
const all=getWardrobeUnlockCatalogue(),visible=[...new Set(all.map(e=>e.universe))];
const keys=new Set(OFFICIAL_COSTUMES_R12.map(c=>c.key));
const isNew=e=>keys.has(e.id.slice(e.id.lastIndexOf(':')+1));
const r13Keys=new Set(OFFICIAL_COSTUMES_R13.map(e=>e.key));
const r13Bindings=OFFICIAL_COSTUMES_R13.reduce((n,e)=>n+e.actorIds.length,0);
const added=all.filter(isNew),previous=all.filter(e=>!isNew(e)&&!r13Keys.has(e.id.slice(e.id.lastIndexOf(':')+1)));
const pool=u=>getWardrobeBoosterPool({banner:{id:`universe:${u}`,universe:u},visibleUniverses:visible});
const frank=byKey.get(wardrobeActorKey({universe:'Dead Rising',id:'dead_rising_frank_west'}));
const scope=WARDROBE_SOURCE_SCOPES_R12[0];
test('26 definitions bind to 29 exact rights across ten newly documented actors',()=>{
 assert.equal(OFFICIAL_COSTUMES_R12.length,26);assert.equal(keys.size,26);assert.equal(added.length,29);
 assert.equal(new Set(added.map(e=>e.actorKey)).size,10);assert.equal(ALL_OFFICIAL_WARDROBE.length,143+OFFICIAL_COSTUMES_R13.length);
 assert.equal(all.filter(e=>e.origin==='OFFICIAL').length,149+r13Bindings);assert.equal(all.length,19953+r13Bindings);assert.equal(previous.length,19924);
 assert.equal(byKey.size,4936);assert.equal(new Set(all.filter(e=>e.origin==='OFFICIAL').map(e=>e.actorKey)).size,54);
});
test('all 19924 pre-R12 IDs have unchanged digest',()=>assert.equal(createHash('sha256').update(JSON.stringify(previous.map(e=>e.id).sort())).digest('hex'),'6b300ad5b03f8b8770478359b1e9926266b54bd39177883f528b47642e8b40dd'));
for(const row of OFFICIAL_COSTUMES_R12)for(const actorId of row.actorIds){
 test(`R12 exact wearer and pending art: ${actorId}/${row.key}`,()=>{
  const a=byKey.get(wardrobeActorKey({id:actorId,universe:row.universe}));assert.ok(a);
  const e=getOfficialCostumes(a).find(c=>c.key===row.key);assert.ok(e);assert.ok(row.brief.fr&&row.brief.en);
  assert.ok(WARDROBE_SOURCES_R12.some(s=>s.id===row.sourceId&&s.url===row.sourceUrl));assert.ok(isSafeWardrobeReference(e.sourceUrl));
  assert.equal(e.artworkStatus,'NOT_PRODUCED');assert.equal(e.artApproval,'NOT_REVIEWED');assert.equal(e.production.status,'ARTWORK_PENDING');
  assert.equal(e.production.sourceMode,e.sourceMode);assert.equal(e.equippable,false);assert.equal(applyActorAppearance(a,e.id),a);
 });
 test(`R12 matching booster, immutable inventory and no power grant: ${actorId}/${row.key}`,()=>{
  const a=byKey.get(wardrobeActorKey({id:actorId,universe:row.universe}));
  const entry=getOfficialCostumes(a).find(c=>c.key===row.key),r=all.find(e=>e.id===entry.id);assert.ok(pool(row.universe).includes(r));
  const multi=getWardrobeBoosterPool({banner:{id:'multi'},visibleUniverses:visible});assert.ok(multi.includes(r));
  for(const k of ['component','sourceMode','targetIncarnation'])assert.equal(r[k],entry[k]);
  const old=['equipment','equipment'],out=grantWardrobeBoosterBonus(old,r,pool(row.universe));assert.deepEqual(old,['equipment','equipment']);assert.deepEqual(out,[...old,r.id]);
  assert.equal(grantWardrobeBoosterBonus(out,r,pool(row.universe)),out);assert.ok(!r.stats&&!r.weapon&&!r.special);
 });
}
test('all six DRDR named pack manifests sum to twenty distinct costumes',()=>{
 assert.equal(DRDR_NAMED_PACKS_R12.length,6);assert.equal(DRDR_NAMED_PACKS_R12.flatMap(p=>p.items).length,20);
 assert.equal(scope.expectedItems.length,20);assert.ok(OFFICIAL_COSTUMES_R12.filter(c=>c.universe==='Dead Rising').every(c=>c.actorIds.length===1&&c.actorIds[0]===frank.id));
});
test('Frank cosplays never become RE, Mega Man, Chuck or clown boss grants',()=>{
 for(const id of ['leon','chris_redfield','dead_rising_chuck_greene','dead_rising_adam']){
  const a=actors.find(x=>x.id===id);assert.ok(a);assert.ok(!getOfficialCostumes(a).some(c=>c.key.startsWith('drdr-')));
 }
 for(const u of ['Resident Evil','Mega Man','Street Fighter'])assert.ok(!pool(u).some(e=>e.id.includes(':drdr-')));
});
test('four Slipknot items are masks, not four costumes or band identities',()=>{
 const mask=OFFICIAL_COSTUMES_R12.filter(c=>c.key.startsWith('dbd-slipknot-'));assert.equal(mask.length,4);
 assert.ok(mask.every(c=>c.component==='head-mask'&&c.nature==='official-accessory'));
 assert.equal(new Set(mask.map(c=>c.actorIds[0])).size,4);
});
test('shirt is restricted to the three present original survivors',()=>{
 const c=OFFICIAL_COSTUMES_R12.find(c=>c.key==='dbd-eddies-live-shirt');assert.equal(c.actorIds.length,3);assert.equal(c.component,'torso-only');
 assert.ok(!c.actorIds.includes('leon'));assert.equal(added.filter(e=>e.id.endsWith(':dbd-eddies-live-shirt')).length,3);
});
test('Scullyphones have two verified bindings, not invented color rights',()=>{
 const c=OFFICIAL_COSTUMES_R12.find(c=>c.key==='kf2-scullyphones');assert.equal(c.actorIds.length,2);
 assert.equal(c.sourceEvidence,'PUBLISHER_CATALOGUE_EXCERPT');assert.equal(c.component,'headphones');
 assert.ok(!getOfficialCostumes({id:'killing_floor_2_ana_larive_punk_violette',universe:'Killing Floor 2'}).some(c=>c.key==='kf2-scullyphones'));
});
test('disabled enemies and hidden universes still exclude new rights',()=>{
 const e=added.find(e=>e.actorId==='dead_by_daylight_doctor');assert.ok(e);
 assert.ok(!getWardrobeBoosterPool({banner:{id:'multi'},visibleUniverses:visible,disabledAssets:{enemies:[e.actorKey]}}).includes(e));
 assert.ok(!getWardrobeBoosterPool({banner:{id:'multi'},visibleUniverses:visible,hiddenUniverses:['Dead Rising']}).some(e=>e.id.includes(':drdr-')));
});
for(const [u,n] of [['Dead Rising',20],['Dead by Daylight',7],['Killing Floor 2',2]])test(`completed old ${u} pool reopens exactly ${n} rights`,()=>{
 const p=pool(u);let inventory=p.filter(e=>!isNew(e)).map(e=>e.id);assert.equal(getWardrobeBoosterProgress(p,inventory).remaining,n);
 const awarded=new Set();for(let i=0;i<n;i++){const e=drawWardrobeBoosterBonus({pool:p,inventory,rng:()=>0.37});assert.ok(e&&isNew(e)&&!awarded.has(e.id));awarded.add(e.id);inventory=grantWardrobeBoosterBonus(inventory,e,p);}
 assert.equal(getWardrobeBoosterProgress(p,inventory).remaining,0);assert.equal(drawWardrobeBoosterBonus({pool:p,inventory}),null);
});
test('new rights survive normalization without granting characters',()=>{
 const ids=added.map(e=>e.id),out=sanitizeSaveCore({inventory:['old','old',...ids],unlockedHeroes:['leon']},{knownHeroIds:HEROES_DB.map(a=>a.id)});
 assert.deepEqual(out.inventory,['old','old',...ids]);assert.ok(!out.unlockedHeroes.includes(frank.id));assert.equal(out.gold,0);
});
test('research stays distinct from active rewards on exact actors',()=>{
 assert.equal(WARDROBE_RESEARCH_R12.length,10);
 for(const r of WARDROBE_RESEARCH_R12){assert.ok(byKey.has(wardrobeActorKey(r)));const t=getWardrobeResearchTargets(r).find(t=>t.key===r.key);assert.ok(t);assert.equal(t.officialConfirmed,false);assert.ok(!all.some(e=>e.id===t.entryId));}
});
test('four unbound DBD wearers never fuzzy-match active characters',()=>{
 assert.equal(UNBOUND_COSTUME_RESEARCH_R12.length,4);
 for(const r of UNBOUND_COSTUME_RESEARCH_R12){assert.ok(!actors.some(a=>a.universe===r.universe&&a.name===r.actorName));assert.equal(r.status,'ACTOR_BINDING_MISSING');assert.equal(r.equippable,false);assert.ok(!added.some(e=>e.name.en===r.costume));}
});
test('named scope completion does not close global research or approve art',()=>{
 const r=getWardrobeSourceScopeCoverage(frank)[0];assert.equal(r.status,'NAMED_SCOPE_COMPLETE');assert.equal(r.expected,20);assert.equal(r.matched,20);
 assert.equal(r.allCharacterCostumesResearched,false);assert.equal(r.artApproved,false);assert.equal(r.equippable,false);
 assert.equal(getWardrobeCoverage(frank).sourceResearch,'PARTIAL_DOCUMENTED');
});
test('a missing manifest item leaves the scope incomplete',()=>{
 const r=assessNamedCostumeScope(frank,scope,ALL_OFFICIAL_WARDROBE.filter(c=>c.key!=='drdr-nemesis'));
 assert.equal(r.status,'NAMED_SCOPE_INCOMPLETE');assert.deepEqual(r.missing,['drdr-nemesis']);assert.equal(r.matched,19);
});
test('wrong wearer cannot complete a named scope',()=>assert.equal(assessNamedCostumeScope({...frank,id:'other'},scope,ALL_OFFICIAL_WARDROBE).status,'ACTOR_MISMATCH'));
test('wrong universe cannot complete a named scope',()=>assert.equal(assessNamedCostumeScope({...frank,universe:'Resident Evil'},scope,ALL_OFFICIAL_WARDROBE).matched,0));
test('same key duplicated is a conflict, not extra completeness',()=>{
 const r=assessNamedCostumeScope(frank,scope,[...ALL_OFFICIAL_WARDROBE,OFFICIAL_COSTUMES_R12[0]]);assert.equal(r.status,'NAMED_SCOPE_INCOMPLETE');assert.equal(r.duplicates.length,1);
});
for(const key of ['sourceUrl','coverageScopeId','name'])test(`scope cannot silently accept mismatched ${key}`,()=>{
 const rows=ALL_OFFICIAL_WARDROBE.map(c=>c.key==='drdr-nemesis'?{...c,[key]:key==='name'?{en:'Other'}:'wrong'}:c);
 assert.deepEqual(assessNamedCostumeScope(frank,scope,rows).conflicts,['drdr-nemesis']);
});
test('empty or duplicate source manifests are rejected',()=>{
 for(const expectedItems of [[],[scope.expectedItems[0],scope.expectedItems[0]],[{key:'',name:'x'}]])assert.throws(()=>assessNamedCostumeScope(frank,{...scope,expectedItems},ALL_OFFICIAL_WARDROBE));
});
test('all 4936 actors retain honest open research and unmodified data',()=>{
 const before=JSON.stringify(actors);let covered=0;
 for(const a of actors){const c=getWardrobeCoverage(a);assert.equal(c.allCharacterCostumesResearched,false);assert.equal(c.completedCostumes,0);if(c.namedSourceScopes.length)covered++;}
 assert.equal(covered,1+new Set(WARDROBE_SOURCE_SCOPES_R13.map(s=>`${s.universe}::${s.actorId}`)).size);assert.equal(JSON.stringify(actors),before);
});
test('named scope results are not shared mutable state',()=>{
 const a=getWardrobeSourceScopeCoverage(frank);a[0].missing.push('fake');assert.equal(getWardrobeSourceScopeCoverage(frank)[0].missing.length,0);
});
test('publisher whitelist does not accept subdomain or credential tricks',()=>{
 assert.equal(isSafeWardrobeReference('https://deadbydaylight.com/news/slipknot-collection/'),true);
 for(const u of ['https://deadbydaylight.com.evil.test','http://deadbydaylight.com','https://u:p@deadbydaylight.com'])assert.equal(isSafeWardrobeReference(u),false);
});
