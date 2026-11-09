import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { HEROES_DB, EQUIP_ITEMS_DB } from '../src/game/heroes.js';
import { MOSAIC_DIALOGUE_RESIDENT_IDS, getMosaicResidentDialogue, beginMosaicResidentDialogue,
  getMosaicReconnaissanceLedger } from '../src/game/mosaicResidentDialogue.js';
import { advanceMosaicPlayer, resolveMosaicInteraction, getMosaicZoneAnchor } from '../src/game/mosaicCityRuntime.js';
import { getMosaicExhibits, getMosaicExhibitZones } from '../src/game/mosaicExhibits.js';
import { buildMosaicReconnaissanceDossier, normalizeMosaicReconnaissance, startMosaicReconnaissance,
  advanceMosaicReconnaissance, getMosaicReconnaissanceObjective } from '../src/game/mosaicReconnaissance.js';
import { sanitizeSaveCore } from '../src/game/saveValidation.js';
// Character plaques use the repository's extensionless Vite imports.
register('./sourceSceneTestLoader.mjs', import.meta.url);
const { CHARACTER_PLAQUES, getCharacterPlaque } = await import('../src/game/characterPlaques.js');
const universe = 'Nexus de Convergence';
const hero = HEROES_DB.find(value=>value.id==='arca_bastion');
const npc = {hero,x:680,y:490};
const plaque = getCharacterPlaque(hero);
const district = {id:'universe-nexus',universe,worldW:1920,worldH:1180};
const exhibits = getMosaicExhibits(EQUIP_ITEMS_DB,universe);
const anchor = {id:'nexus-anchor',universe,action:'anchor',x:760,y:875,w:400,h:150};
const dossier = buildMosaicReconnaissanceDossier({district,residents:[hero],exhibits,anchor});
const interaction = () => resolveMosaicInteraction(npc,{npcs:[npc]});

test('ten authored Nexus residents expose source paragraphs in both languages without inventing dialogue quotes',()=>{
  assert.equal(MOSAIC_DIALOGUE_RESIDENT_IDS.length,10);
  let topics=0;
  for(const id of MOSAIC_DIALOGUE_RESIDENT_IDS) {
    const h=HEROES_DB.find(value=>value.id===id);assert.ok(CHARACTER_PLAQUES[id]);
    const source=getCharacterPlaque(h),before=JSON.stringify(source);
    for(const lang of ['fr','en']) {
      const conversation=getMosaicResidentDialogue(h,source,lang);
      assert.equal(conversation.heroId,id);assert.equal(conversation.name,h.name);
      assert.ok(conversation.topics.length>=3);
      for(const topic of conversation.topics) {
        assert.equal(topic.body,source[topic.sourceField][lang]);
        assert.equal(topic.body,CHARACTER_PLAQUES[id][topic.sourceField][lang]);
      }
      if(lang==='fr')topics+=conversation.topics.length;
    }
    assert.equal(JSON.stringify(source),before);
  }
  assert.equal(topics,39);
  assert.equal(getMosaicResidentDialogue(HEROES_DB.find(value=>value.id==='arca_mirelle'),plaque),null,'Mirelle retains her existing authored welcome, not a generic invented dossier');
  assert.equal(getMosaicResidentDialogue({...hero,id:'not-authored'},plaque),null);
  assert.equal(getMosaicResidentDialogue({...hero,universe:'foreign'},plaque),null);
});
test('directory entries, remote interactions, mismatched IDs and unowned residents cannot begin a conversation',()=>{
  const valid=interaction(),options={ownedHeroIds:[hero.id],plaque};
  assert.equal(beginMosaicResidentDialogue(valid,options).heroId,hero.id);
  for(const value of [null,{id:hero.id}, {...valid,type:'zone'}, {...valid,id:'other'},
    ...[undefined,NaN,Infinity,-1,58.001].map(distance=>({...valid,distance}))]) {
    assert.equal(beginMosaicResidentDialogue(value,options),null);
  }
  assert.equal(beginMosaicResidentDialogue(valid,{...options,ownedHeroIds:[]}),null);
});
test('ordinary walking reaches the resident, then reading every source topic cannot complete any reconnaissance step',()=>{
  const state={player:{x:820,y:760,speed:2.35},keys:{},npcs:[npc],destination:{x:npc.x,y:npc.y},pendingInteraction:{type:'npc',id:hero.id}};
  let actual=null,moves=0;
  for(let i=0;i<1000&&!actual;i++){
    const before={...state.player};advanceMosaicPlayer(state,district,1000/60);
    const distance=Math.hypot(state.player.x-before.x,state.player.y-before.y);
    assert.ok(distance<=2.35+1e-8);if(distance>0)moves++;
    actual=resolveMosaicInteraction(state.player,{npcs:[npc]},{type:'npc',id:hero.id});
  }
  assert.ok(actual&&moves>0);
  const progress=startMosaicReconnaissance(normalizeMosaicReconnaissance(),dossier,'fr',{exhibitGoal:2}).progress;
  const conversation=beginMosaicResidentDialogue(actual,{ownedHeroIds:[hero.id],plaque});
  const saved=advanceMosaicReconnaissance(progress,dossier,actual).progress,before=JSON.stringify(saved);
  for(const topic of conversation.topics){assert.ok(topic.body.length>30);getMosaicReconnaissanceLedger(saved);}
  assert.equal(JSON.stringify(saved),before);assert.equal(saved.dossiers[district.id].exhibitId,null);
  assert.equal(saved.dossiers[district.id].completed,false);
});
test('ledger preserves witness, both distinct proofs and ordering through actual interactions and a save round trip',()=>{
  let saved=startMosaicReconnaissance(normalizeMosaicReconnaissance(),dossier,'en',{exhibitGoal:2}).progress;
  saved=advanceMosaicReconnaissance(saved,dossier,interaction()).progress;
  assert.equal(getMosaicReconnaissanceObjective(saved,dossier).total,4);
  assert.equal(getMosaicReconnaissanceObjective(saved,dossier).index,1);
  const zones=getMosaicExhibitZones(district,exhibits);
  for(let i=0;i<2;i++){
    const event=resolveMosaicInteraction(getMosaicZoneAnchor(zones[i]),{zones},{type:'zone',id:zones[i].id});
    saved=advanceMosaicReconnaissance(saved,dossier,event).progress;
    assert.equal(getMosaicReconnaissanceObjective(saved,dossier).index,i+2);
    const entry=getMosaicReconnaissanceLedger(saved,{heroes:[hero],exhibits,districts:{[district.id]:district}})[0];
    assert.equal(entry.witness.name,hero.name);assert.equal(entry.evidence.length,i+1);assert.equal(entry.evidenceGoal,2);
    assert.equal(entry.completed,false);assert.equal(entry.active,true);assert.equal(entry.available,true);
  }
  saved=advanceMosaicReconnaissance(saved,dossier,resolveMosaicInteraction(getMosaicZoneAnchor(anchor),{zones:[anchor]})).progress;
  assert.equal(getMosaicReconnaissanceObjective(saved,dossier).index,4);
  const payload={gold:20,inventory:['owned'],activityProgress:{mosaicReconnaissance:saved}};
  const restored=sanitizeSaveCore(JSON.parse(JSON.stringify(payload)));
  const options={heroes:[hero],exhibits,districts:{[district.id]:district},lang:'en'};
  const rows=getMosaicReconnaissanceLedger(restored.activityProgress.mosaicReconnaissance,options);
  assert.deepEqual(rows,getMosaicReconnaissanceLedger(saved,options));assert.equal(rows[0].completed,true);assert.equal(rows[0].active,false);
  assert.deepEqual(rows[0].evidence.map(value=>value.id),exhibits.slice(0,2).map(value=>value.id));
  assert.equal(restored.gold,20);assert.deepEqual(restored.inventory,['owned']);
});
test('absent DLC, characters or relic definitions never erase proof identities or present an unavailable district as accessible',()=>{
  const source=normalizeMosaicReconnaissance({activeDistrictId:'uninstalled',dossiers:{
    uninstalled:{universe:'Removed pack',residentId:'old-resident',exhibitGoal:2,evidenceIds:['old-relic'],completed:false},
    archived:{universe:'Other pack',residentId:'witness',exhibitId:'relic',completed:true}
  }}),before=JSON.stringify(source);
  const rows=getMosaicReconnaissanceLedger(source,{districts:{uninstalled:{universe:'Wrong pack'}}});
  assert.equal(rows[0].active,true);assert.equal(rows[0].available,false);
  assert.deepEqual(rows[0].witness,{id:'old-resident',name:'old-resident'});
  assert.deepEqual(rows[0].evidence,[{id:'old-relic',name:'old-relic'}]);
  assert.equal(rows[1].completed,true);assert.equal(rows[1].available,false);assert.equal(rows[1].evidenceGoal,1);
  assert.equal(JSON.stringify(source),before);
});
test('ledger handles malicious-looking IDs as data and cannot invent prerequisites from malformed proof',()=>{
  const source=JSON.parse('{"dossiers":{"__proto__":{"universe":"Retained","residentId":"old","exhibitId":"proof","completed":true},"constructor":{"universe":"Absent","residentId":null,"exhibitGoal":2,"evidenceIds":["forged"],"completed":true}}}');
  const rows=getMosaicReconnaissanceLedger(source);
  assert.equal(rows.length,2);assert.ok(rows.every(value=>value.available===false));
  const invalid=rows.find(value=>value.districtId==='constructor');
  assert.equal(invalid.witness,null);assert.equal(invalid.evidence.length,0);assert.equal(invalid.completed,false);
  assert.equal({}.completed,undefined);
});
