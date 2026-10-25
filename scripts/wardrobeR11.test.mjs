import { OFFICIAL_COSTUMES_R12 } from '../src/game/wardrobeOfficialR12.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { HEROES_DB } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { sanitizeSaveCore } from '../src/game/saveValidation.js';
import { OFFICIAL_COSTUMES_R11, WARDROBE_SOURCES_R11, UNBOUND_COSTUME_RESEARCH_R11, WARDROBE_RESEARCH_R11 } from '../src/game/wardrobeOfficialR11.js';
import { ALL_OFFICIAL_WARDROBE, getOfficialCostumes, getWardrobeResearchTargets, wardrobeActorKey, applyActorAppearance } from '../src/game/wardrobe.js';
import { getWardrobeUnlockCatalogue, getWardrobeBoosterPool, getWardrobeBoosterProgress, drawWardrobeBoosterBonus, grantWardrobeBoosterBonus } from '../src/game/wardrobeBoosterRewards.js';
const all=getWardrobeUnlockCatalogue(),visible=[...new Set(all.map(r=>r.universe))];
const additions=new Set(OFFICIAL_COSTUMES_R11.map(r=>r.key));
const rights=all.filter(r=>OFFICIAL_COSTUMES_R11.some(c=>c.key===r.id.slice(r.id.lastIndexOf(':')+1)));
const r12Keys=new Set(OFFICIAL_COSTUMES_R12.map(c=>c.key));
const previous=all.filter(r=>!rights.includes(r)&&!r12Keys.has(r.id.slice(r.id.lastIndexOf(':')+1)));
const r12Bindings=OFFICIAL_COSTUMES_R12.reduce((n,c)=>n+c.actorIds.length,0);
const pool=u=>getWardrobeBoosterPool({banner:{id:`universe:${u}`,universe:u},visibleUniverses:visible});
const actorFor=row=>HEROES_DB.find(a=>a.id===row.actorIds[0]&&a.universe===row.universe);
test('R11 adds eleven named variants without changing actor or prior right counts',()=>{
 assert.equal(OFFICIAL_COSTUMES_R11.length,11);assert.equal(additions.size,11);assert.equal(rights.length,11);
 assert.equal(ALL_OFFICIAL_WARDROBE.length,117+OFFICIAL_COSTUMES_R12.length);assert.equal(all.filter(r=>r.origin==='OFFICIAL').length,120+r12Bindings);
 assert.equal(all.length,19924+r12Bindings);assert.equal(previous.length,19913);assert.equal(new Set(all.map(r=>r.actorKey)).size,4936);
});
test('all previous persisted entitlement IDs retain their baseline digest',()=>{
 const digest=createHash('sha256').update(JSON.stringify(previous.map(r=>r.id).sort())).digest('hex');
 assert.equal(digest,'717d1b9f9c02c99a372097d17f206cb80c3d11d0947b32dab562272eb7bf3588');
});
for(const row of OFFICIAL_COSTUMES_R11){
 test(`R11 exact actor, source and production contract: ${row.key}`,()=>{
  const actor=actorFor(row);assert.ok(actor);const e=getOfficialCostumes(actor).find(r=>r.key===row.key);assert.ok(e);
  assert.equal(e.actorKey,wardrobeActorKey(actor));assert.equal(e.actorIds.length,1);
  assert.ok(WARDROBE_SOURCES_R11.some(s=>s.id===e.sourceId&&s.url===e.sourceUrl));
  assert.ok(e.brief.fr&&e.brief.en&&e.targetIncarnation&&e.sourceMode);
  assert.equal(e.production.sourceMode,e.sourceMode);assert.equal(e.production.relatedDesignKey,e.relatedDesignKey);
  assert.equal(e.production.status,'ARTWORK_PENDING');assert.equal(e.equippable,false);assert.equal(e.artApproval,'NOT_REVIEWED');
 });
 test(`R11 booster and inventory preserve source context: ${row.key}`,()=>{
  const actor=actorFor(row),entry=getOfficialCostumes(actor).find(r=>r.key===row.key),right=all.find(r=>r.id===entry.id);
  assert.ok(pool(row.universe).includes(right));assert.ok(getWardrobeBoosterPool({banner:{id:'multi'},visibleUniverses:visible}).includes(right));
  for(const key of ['component','sourceMode','targetIncarnation','relatedDesignKey'])assert.equal(right[key],entry[key]);
  const inventory=grantWardrobeBoosterBonus(['old-equipment','old-equipment'],right,pool(row.universe));
  assert.deepEqual(inventory,['old-equipment','old-equipment',entry.id]);assert.equal(grantWardrobeBoosterBonus(inventory,right,pool(row.universe)),inventory);
  assert.equal(applyActorAppearance(actor,entry.id),actor);assert.ok(!right.stats&&!right.weapon&&!right.special);
 });
 test(`R11 exclusion and exact identity: ${row.key}`,()=>{
  const entry=getOfficialCostumes(actorFor(row)).find(r=>r.key===row.key);
  assert.ok(!getWardrobeBoosterPool({banner:{id:`universe:${row.universe}`,universe:row.universe},visibleUniverses:visible,hiddenUniverses:[row.universe]}).some(r=>r.id===entry.id));
  assert.ok(!getWardrobeBoosterPool({banner:{id:'multi'},visibleUniverses:visible,disabledAssets:{heroes:row.actorIds}}).some(r=>r.id===entry.id));
  assert.ok(!getOfficialCostumes({id:row.actorIds[0],universe:'Other'}).some(r=>r.key===row.key));
 });
}
test('Classic Jam and Modern Adventure are full models with different target contexts',()=>{
 const classic=OFFICIAL_COSTUMES_R11.find(r=>r.key==='generations-jam-legacy'),modern=OFFICIAL_COSTUMES_R11.find(r=>r.key==='generations-adventure-legacy');
 assert.equal(classic.nature,'official-model');assert.equal(modern.component,'full-model');assert.notEqual(classic.sourceMode,modern.sourceMode);
});
test('Superstars and Frontiers holiday entries never share an identifier or edition',()=>{
 const holiday=getOfficialCostumes({id:'sonic_hedgehog',universe:'Sonic'}).filter(r=>r.name.en.toLowerCase().includes('holiday'));
 assert.equal(holiday.length,2);assert.equal(new Set(holiday.map(r=>r.id)).size,2);assert.equal(new Set(holiday.map(r=>r.sourceWork)).size,2);
});
test('the official Shadow costume is worn by Sonic, not a new Shadow actor',()=>{
 const c=OFFICIAL_COSTUMES_R11.find(r=>r.key==='superstars-shadow-costume');assert.deepEqual(c.actorIds,['sonic_hedgehog']);
 assert.equal(getOfficialCostumes({id:'shadow',universe:'Sonic'}).length,0);
});
test('three LEGO models bind separately to Sonic, Tails and Knuckles',()=>{
 const rows=OFFICIAL_COSTUMES_R11.filter(r=>r.key.includes('lego-'));assert.equal(rows.length,3);assert.equal(new Set(rows.map(r=>r.actorIds[0])).size,3);
 assert.ok(rows.every(r=>r.nature==='official-model'&&r.component==='full-model'));
});
test('DOOMicorn variants remain variants rather than invented complete sets or proven recolors',()=>{
 const rows=OFFICIAL_COSTUMES_R11.filter(r=>r.relatedDesignKey);assert.equal(rows.length,2);
 assert.ok(rows.every(r=>r.nature==='official-skin'&&r.component==='skin-variant'&&r.relatedDesignKey==='eternal-doomicorn'));
 for(const r of rows)assert.ok(OFFICIAL_COSTUMES_R11.some(parent=>parent.key===r.relatedDesignKey&&parent.actorIds[0]===r.actorIds[0]));
});
test('a variant entitlement grants neither its parent nor all pack contents',()=>{
 const variant=rights.find(r=>r.relatedDesignKey==='eternal-doomicorn');assert.ok(variant);
 const inventory=grantWardrobeBoosterBonus([],variant,pool('Doom'));assert.deepEqual(inventory,[variant.id]);
});
test('Doom Slayer costumes are not handed to the Classic Marine, UAC Marine or Hayden',()=>{
 for(const id of ['doom_marine_classic','doom_marine','hayden'])assert.equal(getOfficialCostumes({id,universe:'Doom'}).length,0);
});
test('five unbound appearances have no false reward or fuzzy wearer binding',()=>{
 assert.equal(UNBOUND_COSTUME_RESEARCH_R11.length,5);
 for(const candidate of UNBOUND_COSTUME_RESEARCH_R11){
  assert.equal(candidate.equippable,false);assert.equal(candidate.status,'ACTOR_BINDING_MISSING');
  assert.ok(!HEROES_DB.some(a=>a.universe===candidate.universe&&a.name===candidate.actorName));
  const r=ENEMIES_DB[candidate.universe];assert.ok(![...r.monsters,...r.bosses,r.worldBoss].some(a=>a?.name===candidate.actorName));
  assert.ok(!all.some(r=>r.actorName===candidate.actorName&&r.sourceWork===candidate.sourceWork));
 }
});
test('Mech Sonic and Royal Raiment research do not become unlock rights',()=>{
 assert.equal(WARDROBE_RESEARCH_R11.length,2);
 for(const target of WARDROBE_RESEARCH_R11){const item=getWardrobeResearchTargets(target).find(r=>r.key===target.key);assert.ok(item);assert.equal(item.officialConfirmed,false);assert.ok(!all.some(r=>r.id===item.entryId));}
});
test('a formerly completed Sonic pool reopens only its eight new rights',()=>{
 const sonic=pool('Sonic'),oldInventory=sonic.filter(r=>!rights.includes(r)).map(r=>r.id);
 assert.equal(getWardrobeBoosterProgress(sonic,oldInventory).remaining,8);
 let inventory=oldInventory;const awarded=new Set();
 for(let n=0;n<8;n++){const reward=drawWardrobeBoosterBonus({pool:sonic,inventory,rng:()=>0.5});assert.ok(reward);assert.ok(!awarded.has(reward.id));awarded.add(reward.id);inventory=grantWardrobeBoosterBonus(inventory,reward,sonic);}
 assert.equal(getWardrobeBoosterProgress(sonic,inventory).remaining,0);assert.equal(drawWardrobeBoosterBonus({pool:sonic,inventory}),null);
});
test('new rights survive save normalization without actor or item grants',()=>{
 const ids=rights.map(r=>r.id),out=sanitizeSaveCore({inventory:['old','old',...ids],unlockedHeroes:['sonic_hedgehog']},{knownHeroIds:HEROES_DB.map(r=>r.id)});
 assert.deepEqual(out.inventory,['old','old',...ids]);assert.equal(out.gold,0);assert.ok(!out.unlockedHeroes.includes('doomslayer'));
});

test('DOOM publisher-index evidence retains its narrower scope',()=>{
 const rows=OFFICIAL_COSTUMES_R11.filter(r=>r.sourceId==='bethesda-doomicorn');assert.equal(rows.length,3);
 assert.ok(rows.every(r=>r.sourceEvidence==='PUBLISHER_INDEXED_DESCRIPTION'));
 assert.match(WARDROBE_SOURCES_R11.find(r=>r.id==='bethesda-doomicorn').scope,/age gate/);
});
