import test from 'node:test';
import assert from 'node:assert/strict';
import { EQUIP_ITEMS_DB } from '../src/game/heroes.js';
import { getMosaicExhibits,getMosaicExhibitView,getMosaicExhibitZones,drawMosaicService } from '../src/game/mosaicExhibits.js';
import { getMosaicZoneAnchor,advanceMosaicPlayer,resolveMosaicInteraction,isMosaicPositionBlocked } from '../src/game/mosaicCityRuntime.js';
test('every source relic stays in its own universe; no catalogue or ownership mutation',()=>{
 const before=JSON.stringify(EQUIP_ITEMS_DB);let n=0;
 for(const universe of new Set(EQUIP_ITEMS_DB.map(i=>i.universe))){
  const entries=getMosaicExhibits(EQUIP_ITEMS_DB,universe);n+=entries.length;
  assert.ok(entries.every(e=>e.universe===universe&&!e.owned&&e.presentation==='ARCHIVE_DISPLAY_NOT_WORLD_ASSET'));
  assert.equal(entries.length,new Set(EQUIP_ITEMS_DB.filter(i=>i.universe===universe).map(i=>i.id)).size);
 }
 assert.ok(n>1500);assert.equal(JSON.stringify(EQUIP_ITEMS_DB),before);
});
test('disabled records are absent and plus relics count as owned without granting anything',()=>{
 const items=[{id:'a',universe:'Nexus',name:{fr:'Éclat',en:'Shard'},desc:{fr:'Archive',en:'Record'}},{id:'b',universe:'Nexus'}, {id:'a',universe:'Nexus'}];
 const inventory=['a_plus'],disabled=['b'];const result=getMosaicExhibits(items,'Nexus',{inventory,disabled,lang:'en'});
 assert.equal(result.length,1);assert.equal(result[0].name,'Shard');assert.equal(result[0].owned,true);
 assert.deepEqual(inventory,['a_plus']);assert.deepEqual(disabled,['b']);assert.deepEqual(getMosaicExhibits(items,''),[]);
});
test('search is accent-insensitive and pagination clamps to three on a small directory',()=>{
 const entries=Array.from({length:8},(_,i)=>({id:String(i),name:'Éclat '+i,description:'Trame'}));
 assert.equal(getMosaicExhibitView(entries,{query:'eclat'}).matching,8);
 assert.equal(getMosaicExhibitView(entries,{page:500}).page,2);assert.equal(getMosaicExhibitView(entries,{page:500}).items.length,2);
 assert.equal(getMosaicExhibitView(entries,{query:'absent'}).pages,1);assert.equal(getMosaicExhibitView(entries,{size:NaN}).items.length,3);
});
test('each exhibit can be approached by ordinary collision-safe movement, not teleportation',()=>{
 const district={id:'universe-nexus',universe:'Nexus',worldW:2100,worldH:1300};
 const zones=getMosaicExhibitZones(district,[{id:'a',name:'A'},{id:'b',name:'B'},{id:'c',name:'C'},{id:'d',name:'D'}]);assert.equal(zones.length,3);
 for(const z of zones){
  const anchor=getMosaicZoneAnchor(z),s={player:{x:460,y:730,speed:2.35},npcs:[],keys:{},destination:anchor,pendingInteraction:{type:'zone',id:z.id},
   obstacles:zones.map(item=>{const a=getMosaicZoneAnchor(item);return {x:a.x-22,y:a.y+8,w:44,h:10};})};
  let reached=false;
  for(let frame=0;frame<1000;frame++){
   const old={...s.player};advanceMosaicPlayer(s,district,1000/60);
   assert.ok(Math.hypot(old.x-s.player.x,old.y-s.player.y)<=2.35+1e-8);assert.equal(isMosaicPositionBlocked(s.player,s.obstacles),false);
   if(resolveMosaicInteraction(s.player,{zones},s.pendingInteraction)){reached=true;break;}
  }
  assert.ok(reached,z.id);
 }
 assert.deepEqual(getMosaicExhibitZones({id:'atrium'},[]),[]);
});
test('service silhouettes draw within their existing footprint without changing zone identity',()=>{
 for(const action of ['codex','journal','arcs','mission','party','inventory','anchor','exhibit','other']){
  let calls=0;const ctx=new Proxy({},{get:()=>()=>calls++,set:()=>true}),zone={id:'x',action,color:'#abc'},before={...zone};
  drawMosaicService(ctx,zone,{x:100,y:100});assert.ok(calls>5);assert.deepEqual(zone,before);
 }
});
