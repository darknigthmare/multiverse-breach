import assert from 'node:assert/strict';
import { before, after, afterEach, test } from 'node:test';
import { createServer } from 'vite';
import { TACTICS_UNIVERSE_BATTLEFIELDS_WAVE15 as TACTICS_UNIVERSE_BATTLEFIELDS } from '../src/game/tacticsUniverseBattlefieldsWave15.js';
import { getTerrainNeighbors, canOccupyTerrainSurface } from '../src/game/tacticsTerrain.js';
let vite, EngineTactics;const engines=[],noop=()=>{};
before(async()=>{
  vite=await createServer({appType:'custom',logLevel:'silent',server:{middlewareMode:true,watch:null}});
  ({EngineTactics}=await vite.ssrLoadModule('/src/game/engineTactics.js?universe-runtime'));
});
afterEach(()=>engines.splice(0).forEach(engine=>engine.dispose()));after(async()=>vite?.close());
const hero=id=>({id,name:id,universe:'Nexus de Convergence',category:'fixture',weaponType:'rifle',primaryColor:'#6ad5e0',stats:{hp:1000,atk:1000,def:10,spd:90},simple:{name:'Fixture physical shot',dmg:1,tactics:{delivery:'ranged',shape:'single',range:4,minRange:1,requiresLineOfSight:true}},secondary:{name:'Fixture second shot',dmg:1,cd:2},special:{name:'Fixture super',dmg:1},defense:{name:'Fixture guard',reduce:.4,dur:1}});
function make(field){
 const opponents=[{id:'passive-enemy',name:'Passive fixture',universe:'Nexus de Convergence',hp:99999,atk:0,spd:1,simple:{name:'No advance',dmg:0}}];
 const e=new EngineTactics(1040,460,[hero('fixture-a'),hero('fixture-b'),hero('fixture-c')],{monsters:opponents,bosses:[],customRoster:opponents},{add:noop},noop,noop,{mode:'Tactics',universe:field.source.universe,tacticsBattlefieldId:field.id,difficulty:'Custom',customBattle:{singleRoster:true,opponentControl:'p2'}});engines.push(e);return e;
}
function place(e,unit,id){const s=e.terrain.byId.get(id);assert.ok(s,id);Object.assign(unit,{gridX:s.x,gridY:s.y,gridZ:s.z,surfaceId:s.id});e.syncActorsToCamera();}
function turn(e,unit=e.heroes[0]){e.activeUnit=unit;e.activeUnitType='hero';e.movementBudget=2;e.movementSpent=0;e.actionPhase='move';e.selectedAction=null;e.selectedActionExplicit=false;e.calculateMovementRange();}
for(const field of Object.values(TACTICS_UNIVERSE_BATTLEFIELDS)){
 test(field.id+': real engine animates a legal route, charges exact AP and pauses at the actual surface',()=>{
  const e=make(field),unit=e.heroes[0];turn(e);assert.equal(e.sourceTacticsSector,true);assert.equal(e.battlefield.id,field.id);
  const choice=e.movementRange.find(cell=>cell.surfaceId!==unit.surfaceId&&cell.cost>0&&cell.cost<=2);assert.ok(choice,'No first legal move');
  const support=e.terrain.byId.get(choice.surfaceId),result=e.handleCellClick(support.x,support.y,support.id);assert.equal(result.handled,true);assert.equal(e.movementSpent,choice.cost);assert.ok(result.path.length>=2);
  e.update();e.setPaused(true);const frozen=JSON.stringify({x:unit.x,y:unit.y,motion:unit.terrainMotion,spent:e.movementSpent});for(let i=0;i<30;i++)e.update();assert.equal(JSON.stringify({x:unit.x,y:unit.y,motion:unit.terrainMotion,spent:e.movementSpent}),frozen);
  e.setPaused(false);for(let i=0;i<80&&unit.terrainMotion;i++)e.update();assert.equal(unit.terrainMotion,undefined);assert.equal(unit.surfaceId,support.id);assert.equal(unit.gridZ,support.z);assert.equal(e.movementSpent,choice.cost);
  const projected=e.getUnitScreenPosition(support.x,support.y,support.id);assert.equal(unit.x,projected.x);assert.equal(unit.y,projected.y);
 });
 test(field.id+': actual surface objective resolves through engine effects without rewriting counters',()=>{
  const e=make(field),unit=e.heroes[0];
  if(e.objective==='control'){
   const point=e.tiles.find(tile=>tile.type==='objective');assert.ok(point);place(e,unit,point.id);
   const before=e.objectiveProgress;for(let i=0;i<8;i++)e.updateTacticsObjective();assert.equal(e.objectiveProgress,before,'Refresh without a completed turn scored control');
   for(let i=0;i<e.objectiveTarget&&!e.gameOver;i++){
    turn(e);e.endActiveTurn();const scored=e.objectiveProgress;for(let j=0;j<8;j++)e.updateTacticsObjective();assert.equal(e.objectiveProgress,scored,'Repeated refresh farmed a turn');
   }
  }else if(e.objective==='extract'){
   const zones=e.battlefield.extractionZone;assert.ok(zones.length>=e.objectiveTarget);
   for(let i=0;i<e.objectiveTarget;i++)place(e,e.heroes[i],zones[i].surfaceId);
   e.updateTacticsObjective();
  }else if(e.objective==='artifact'){
   const artifacts=e.tiles.filter(tile=>tile.type==='artifact');assert.equal(artifacts.length,e.objectiveTarget);
   for(const tile of artifacts){place(e,unit,tile.id);e.applyStartTileEffect(unit);e.applyStartTileEffect(unit);}
   assert.equal(e.collectedArtifactKeys.size,artifacts.length);
  }else if(e.objective==='disable'){
   const objectives=e.obstacles.filter(obstacle=>obstacle.type==='objective');assert.equal(objectives.length,e.objectiveTarget);
   for(const objective of objectives){
    const support=e.terrain.byId.get(objective.surfaceId);
    const approach=getTerrainNeighbors(e.terrain,support,{unit}).map(ref=>e.terrain.byId.get(ref.surfaceId)).find(s=>canOccupyTerrainSurface(e.terrain,s,{unit})&&!e.isCellOccupied(s.x,s.y,unit,s.id));assert.ok(approach,'No attack approach');place(e,unit,approach.id);
    const applied=e.applyProfiledAttack(unit,objective,'simple',1000,null,'hero');assert.ok(applied.some(entry=>entry.unit===objective),'Real profile rejected objective contact');assert.ok(objective.hp<=0);
   }
  }else assert.fail('Uncovered objective '+e.objective);
  assert.equal(e.objectiveProgress,e.objectiveTarget);assert.equal(e.gameOver,true);assert.equal(e.battleResult,'victory');
 });
}

const rampApproaches={
 ff8_dollet_tactics:[[1,3],[2,3]],
 re_spencer_courtyard_tactics:[[1,2],[2,2]],
 fallout_red_rock_tactics:[[0,3],[1,3]],
 halflife_white_forest_tactics:[[3,6],[4,6]]
};
for(const field of Object.values(TACTICS_UNIVERSE_BATTLEFIELDS))test(field.id+': a real accepted ramp move animates feet through intermediate world heights',()=>{
 const e=make(field),unit=e.heroes[0],[[sx,sy],[tx,ty]]=rampApproaches[field.id];
 const id=(x,y)=>`${field.id}:ground:${x}:${y}`;
 place(e,unit,id(sx,sy));turn(e);
 const target=e.terrain.byId.get(id(tx,ty)),choice=e.movementRange.find(cell=>cell.surfaceId===target.id);
 assert.ok(choice,'Authored ramp entry is not reachable');assert.equal(target.shape,'ramp');
 const result=e.handleCellClick(tx,ty,target.id);assert.equal(result.handled,true);assert.equal(e.movementSpent,choice.cost);
 const samples=[];
 for(let tick=0;tick<80&&unit.terrainMotion;tick++){e.update();if(unit.terrainRenderPosition)samples.push({...unit.terrainRenderPosition});}
 assert.ok(samples.some(p=>p.z>0&&p.z<target.z),'Ramp animation never used an intermediate world height');
 assert.ok(samples.every(p=>p.z>=0&&p.z<=target.z));
 assert.equal(unit.surfaceId,target.id);assert.equal(unit.gridZ,target.z);assert.equal(unit.terrainMotion,undefined);
 assert.equal(e.movementSpent,choice.cost,'Interpolation must not refund or recharge the accepted route');
});

test('Dollet stacked control posts score only the exact occupied surface and ignore a rival on the other storey',()=>{
 const field=TACTICS_UNIVERSE_BATTLEFIELDS.ff8_dollet_tactics,e=make(field),unit=e.heroes[0];
 const low=`${field.id}:ground:6:6`,high=`${field.id}:bridge:6:6`;
 place(e,unit,low);place(e,e.enemies[0],high);turn(e);e.endActiveTurn();
 assert.equal(e.objectiveProgress,1,'The occupied street post scores once; the gallery is separately contested');
 const e2=make(field);place(e2,e2.heroes[0],high);place(e2,e2.enemies[0],low);turn(e2);e2.endActiveTurn();
 assert.equal(e2.objectiveProgress,1,'The occupied gallery scores once; the street is a different surface');
});

