import { OFFICIAL_COSTUMES_R7 } from '../src/game/wardrobeOfficialR7.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {getOfficialCostumes,getOriginalCostumes,getWardrobeEffects,getWardrobeCoverage,getWardrobeResearchTargets,
 wardrobeActorKey,wardrobeEntryId,applyActorAppearance,resolveWardrobeEffect,isSafeWardrobeReference,ALL_OFFICIAL_WARDROBE} from '../src/game/wardrobe.js';
import {OFFICIAL_WARDROBE} from '../src/game/wardrobeOfficial.js';
import {ORIGINAL_COLLECTIONS,SIGNATURE_DESIGNS} from '../src/game/wardrobeOriginals.js';
import {OFFICIAL_COSTUME_EXTENSION,SIGNATURE_DESIGN_EXTENSION} from '../src/game/wardrobeExpansion.js';
import {getCostumeProductionContract,filterWardrobeEntries,assertUniqueWardrobeEntries} from '../src/game/wardrobeProduction.js';
const leon={id:'leon',universe:'Resident Evil',name:'Leon',stats:{hp:100},special:{name:'Keep'}};
for(const row of OFFICIAL_WARDROBE)for(const id of row.actorIds)test(`retain official ${id}/${row.key}`,()=>{
 const entry=getOfficialCostumes({id,universe:row.universe}).find(c=>c.key===row.key);
 assert.ok(entry);assert.equal(entry.id,wardrobeEntryId({id,universe:row.universe},row.key));
 assert.equal(entry.sourceUrl,row.sourceUrl);assert.equal(entry.equippable,false);
});
for(const row of SIGNATURE_DESIGNS)test(`retain bespoke ${row.universe}/${row.id}`,()=>{
 const item=getOriginalCostumes(row).find(c=>c.id===wardrobeEntryId(row,'original-signature'));
 assert.ok(item);assert.deepEqual(item.name,row.name);assert.deepEqual(item.brief,row.brief);
});
for(const row of OFFICIAL_COSTUME_EXTENSION)test(`new sourced ${row.key}`,()=>{
 const actor={id:row.actorIds[0],universe:row.universe};const entry=getOfficialCostumes(actor).find(c=>c.key===row.key);
 assert.ok(entry);assert.ok(isSafeWardrobeReference(entry.sourceUrl));assert.ok(entry.sourceWork);
 assert.ok(entry.visualSpec.fr && entry.visualSpec.en);assert.equal(entry.production.status,'ARTWORK_PENDING');
 assert.equal(applyActorAppearance(actor,entry.id),actor);assert.equal(entry.production.artApproved,false);
});
test('commando added without erasing shared briefs',()=>{
 const entries=getOriginalCostumes(leon);for(const c of ORIGINAL_COLLECTIONS)assert.ok(entries.some(x=>x.key===c.key));
 const commando=entries.find(x=>x.key==='commando');assert.ok(commando);assert.equal(commando.designMethod,'PARAMETRIC_BRIEF');
 assert.match(commando.brief.en,/Children/);assert.match(commando.brief.en,/Abstract trials/);
});
test('multiple bespoke designs survive for same actor',()=>{
 const rows=getOriginalCostumes({id:'ripley',universe:'Alien'});
 assert.ok(rows.some(r=>r.key==='signature'));assert.ok(rows.some(r=>r.key==='commando-engineer'));
 assertUniqueWardrobeEntries(rows);
});
test('new concepts remain keyed to exact universe and identity',()=>{
 assert.equal(getOriginalCostumes({...leon,universe:'Other'}).filter(x=>x.designMethod==='CHARACTER_SPECIFIC_BRIEF').length,0);
});
test('all expansion original descriptions bilingual and non-equippable',()=>{
 for(const d of SIGNATURE_DESIGN_EXTENSION){const e=getOriginalCostumes(d).find(c=>c.id===wardrobeEntryId(d,`original-personal-${d.key}`));assert.ok(e);assert.ok(e.brief.fr&&e.brief.en);assert.equal(e.equippable,false);}
});
test('Source conflict cannot become an official suit',()=>{
 const a={id:'isaac',universe:'Dead Space'};
 assert.ok(getWardrobeResearchTargets(a).some(t=>t.status==='SOURCE_CONFLICT'));
 assert.ok(!getOfficialCostumes(a).some(t=>t.key.includes('first-contact')));
});
test('multiplayer armor research not an auto-assignment to Chief',()=>{
 const a={id:'masterchief',universe:'Halo'};
 assert.equal(getOfficialCostumes(a).length,0);assert.equal(getWardrobeResearchTargets(a)[0].officialConfirmed,false);
});
test('unknown character is not declared to have no official alternatives',()=>assert.equal(getWardrobeCoverage({id:'unknown',universe:'Halo'}).sourceResearch,'NOT_RESEARCHED'));
test('all production tasks start TODO with no implicit art approval',()=>{
 for(const e of [...getOfficialCostumes(leon),...getOriginalCostumes(leon)]){
  const c=getCostumeProductionContract(e);assert.equal(c.tasks.length,5);assert.ok(c.tasks.every(t=>t.status==='TODO'));assert.equal(c.equippable,false);
 }
});
test('production contract distinguishes palette, hair and accessory',()=>{
 const f=n=>getCostumeProductionContract({nature:n}).focus.en;
 assert.notEqual(f('official-palette'),f('official-costume'));assert.match(f('official-hairstyle'),/Hair only/);assert.match(f('official-accessory'),/attachment/);
});
test('contract instances do not leak mutable task state',()=>{
 const a=getCostumeProductionContract({}),b=getCostumeProductionContract({});a.tasks[0].status='DONE';assert.equal(b.tasks[0].status,'TODO');
});
test('effects not counted as costume production',()=>assert.equal(getCostumeProductionContract(getWardrobeEffects(leon)[0]),null));
test('search ignores accents and case',()=>assert.equal(filterWardrobeEntries(getOfficialCostumes(leon),'sherif').length,1));
test('search all tokens within one record',()=>assert.equal(filterWardrobeEntries(getOfficialCostumes(leon),'RE2 Villain').length,0));
test('search by source work',()=>assert.ok(filterWardrobeEntries(getOfficialCostumes(leon),'2019').length>0));
test('nature filter distinguishes accessory',()=>assert.ok(filterWardrobeEntries(getOfficialCostumes(leon),'','official-accessory').every(c=>c.nature==='official-accessory')));
test('duplicate and empty identity rejected',()=>{assert.throws(()=>assertUniqueWardrobeEntries([{id:'x',actorKey:'a'},{id:'x',actorKey:'a'}]));assert.throws(()=>assertUniqueWardrobeEntries([{id:'x'}]));});
test('save keys remain v1 despite catalogue version increase',()=>assert.ok(wardrobeEntryId(leon,'effect-cyan').startsWith('wardrobe-v1:')));
test('effect unchanged and cannot cross identity or source scene',()=>{
 const id=getWardrobeEffects(leon)[0].id,a=applyActorAppearance(leon,id);
 assert.equal(a.stats,leon.stats);assert.equal(a.special,leon.special);assert.equal(resolveWardrobeEffect({...leon,id:'jill'},id),null);
 assert.equal(applyActorAppearance(leon,id,{}, {sourceLocked:true}),leon);
});
test('invalid colors are not copied',()=>{for(const color of ['#12345','#1234567','url(x)','red'])assert.equal(applyActorAppearance(leon,'x',{x:{colors:{primaryColor:color}}}).primaryColor,undefined);});
test('valid CSS hex colors retained',()=>{for(const color of ['#abc','#abcd','#aabbcc','#aabbccdd'])assert.equal(applyActorAppearance(leon,'x',{x:{colors:{primaryColor:color}}}).primaryColor,color);});
test('reference allowlist rejects suffix and credential tricks',()=>{for(const url of ['https://na.store.square-enix-games.com.evil.test/x','https://x:y@www.halowaypoint.com/','javascript:alert(1)'])assert.equal(isSafeWardrobeReference(url),false);});
test('all official definitions kept in exportable registry',()=>assert.equal(ALL_OFFICIAL_WARDROBE.length,OFFICIAL_WARDROBE.length+OFFICIAL_COSTUME_EXTENSION.length+OFFICIAL_COSTUMES_R7.length));
test('empty actor safe',()=>{assert.equal(wardrobeActorKey(null),'');assert.deepEqual(getWardrobeResearchTargets({}),[]);assert.equal(applyActorAppearance(leon,'x',null),leon);});
