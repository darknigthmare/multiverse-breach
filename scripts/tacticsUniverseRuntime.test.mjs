import assert from 'node:assert/strict';
import { before, after, afterEach, test } from 'node:test';
import { createServer } from 'vite';
import { TACTICS_UNIVERSE_BATTLEFIELDS } from '../src/game/tacticsUniverseBattlefields.js';
import { getTerrainNeighbors, canOccupyTerrainSurface } from '../src/game/tacticsTerrain.js';
let vite, EngineTactics, HEROES_DB;const engines=[],noop=()=>{};
before(async()=>{
  vite=await createServer({appType:'custom',logLevel:'silent',server:{middlewareMode:true,watch:null}});
  ({EngineTactics}=await vite.ssrLoadModule('/src/game/engineTactics.js?universe-runtime'));
  ({HEROES_DB}=await vite.ssrLoadModule('/src/game/heroes.js'));
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

for(const battlefield of ['nexus_skybridge','training_grid'])for(const side of ['hero','enemy']){
 test(`${battlefield}: ${side} Typhoon stays actor-centred and rejects the diagonal outside its converted radius`,()=>{
  const jensen=HEROES_DB.find(h=>h.id==='deus_ex_adam_jensen'),fixtures=Array.from({length:4},(_,i)=>hero('radial-fixture-'+i));
  const players=side==='hero'?[jensen]:fixtures,opponents=side==='enemy'?[jensen]:fixtures;
  const e=new EngineTactics(1040,460,players,{monsters:opponents,bosses:[],customRoster:opponents},{add:noop},noop,noop,{universe:'Nexus de Convergence',tacticsBattlefieldId:battlefield,customBattle:{singleRoster:true,opponentControl:'p2'}});engines.push(e);
  const actor=(side==='hero'?e.heroes:e.enemies)[0],victims=side==='hero'?e.enemies:e.heroes;
  e.obstacles=[];
  const positions=e.verticalTerrain?[[4,5],[3,5],[5,5],[4,4],[6,3]]:[[3,2],[2,2],[4,2],[3,1],[5,4]];
  for(const [i,u] of [actor,...victims].entries()){
   const [x,y]=positions[i];Object.assign(u,{gridX:x,gridY:y,gridZ:0,surfaceId:e.verticalTerrain?`ground:${x}:${y}`:undefined,currentHp:10000,maxHp:10000,state:'idle'});
  }
  if(e.verticalTerrain)e.syncActorsToCamera();
  const profile=e.getAttackProfile(actor,'special');assert.equal(profile.delivery,'radial');assert.equal(profile.shape,'radial');assert.equal(profile.range,2);assert.equal(profile.areaRadius,2);assert.equal(profile.minRange,0);
  assert.equal(e.canAttackCell(actor,actor,profile),true);
  const hp=victims.map(u=>u.currentHp),applied=e.applyProfiledAttack(actor,actor,'special',20,null,side);
  for(let i=0;i<3;i++){assert.ok(applied.some(entry=>entry.unit===victims[i]),'near victim '+i);assert.ok(victims[i].currentHp<hp[i]);}
  assert.equal(victims[3].currentHp,hp[3],'diagonal at sqrt(8) remains outside radius2');assert.ok(!applied.some(entry=>entry.unit===victims[3]));
  if(e.verticalTerrain){
   Object.assign(victims[0],{surfaceId:'bridge:4:3',gridX:4,gridY:3,gridZ:3});place(e,actor,'ground:4:3');
   const before=victims[0].currentHp;e.applyProfiledAttack(actor,actor,'special',20,null,side);assert.equal(victims[0].currentHp,before,'upper bridge remains outside Euclidean radius and occluded by slab');
  }
 });
}

for(const battlefield of ['nexus_skybridge','training_grid'])for(const side of ['hero','enemy']){
 test(`${battlefield}: ${side} stale radial selection and an empty radius preserve charge and turn`,()=>{
  const jensen=HEROES_DB.find(h=>h.id==='deus_ex_adam_jensen'),fixture=hero('stale-target');
  const players=side==='hero'?[jensen]:[fixture],opponents=side==='enemy'?[jensen]:[fixture];
  const e=new EngineTactics(1040,460,players,{monsters:opponents,bosses:[],customRoster:opponents},{add:noop},noop,noop,{universe:'Nexus de Convergence',tacticsBattlefieldId:battlefield,customBattle:{singleRoster:true,opponentControl:'p2'}});engines.push(e);e.obstacles=[];
  const actor=(side==='hero'?e.heroes:e.enemies)[0],victim=(side==='hero'?e.enemies:e.heroes)[0];
  const move=(u,x,y)=>{Object.assign(u,{gridX:x,gridY:y,gridZ:0,surfaceId:e.verticalTerrain?`ground:${x}:${y}`:undefined});if(e.verticalTerrain)e.syncActorsToCamera();};
  move(actor,3,2);move(victim,4,2);actor.specialCharge=100;e.activeUnit=actor;e.activeUnitType=side;e.actionPhase='action';assert.equal(e.selectAction('special'),true);
  assert.ok(e.attackRange.some(c=>c.x===4&&c.y===2));const hp=victim.currentHp,turns=e.turnsElapsed;
  move(actor,0,0);const stale=e.handleCellClick(4,2,victim.surfaceId);assert.equal(stale.handled,false);assert.equal(actor.specialCharge,100);assert.equal(e.turnsElapsed,turns);assert.equal(victim.currentHp,hp);
  move(actor,3,2);move(victim,7,4);e.cancelSelectedAction();assert.equal(e.selectAction('special'),true);const empty=e.handleCellClick(4,2,e.verticalTerrain?'ground:4:2':null);assert.equal(empty.handled,false);assert.equal(actor.specialCharge,100);assert.equal(e.turnsElapsed,turns);assert.equal(victim.currentHp,hp);
 });
}
