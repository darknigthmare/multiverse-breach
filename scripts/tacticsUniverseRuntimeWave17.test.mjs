import assert from 'node:assert/strict';
import { before, after, afterEach, test } from 'node:test';
import { createServer } from 'vite';
import { TACTICS_UNIVERSE_BATTLEFIELDS_WAVE17 as TACTICS_UNIVERSE_BATTLEFIELDS } from '../src/game/tacticsUniverseBattlefieldsWave17.js';
import { getTerrainNeighbors, canOccupyTerrainSurface } from '../src/game/tacticsTerrain.js';
let vite, EngineTactics;const engines=[],noop=()=>{};
before(async()=>{
  vite=await createServer({appType:'custom',logLevel:'silent',server:{middlewareMode:true,watch:null}});
  ({EngineTactics}=await vite.ssrLoadModule('/src/game/engineTactics.js?universe-runtime-wave17'));
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
  const view=e.getTerrainViewState();assert.deepEqual(view.selectedSurface.materialLabel,field.surfaces.find(s=>s.id===unit.surfaceId).materialLabel);
  assert.equal(typeof view.selectedSurface.materialLabel.fr,'string');
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

const upperTargets = {
 bge_lighthouse_tactics: ['bridge', 7, 5],
 rayman_teensies_forest_tactics: ['bridge', 7, 3],
 atomic_vdnh_gallery_tactics: ['bridge', 7, 6],
 zootopia_rainforest_tactics: ['bridge', 5, 5]
};
async function passUntilNextHeroTurn(e, unit) {
 for (let turnCount = 0; turnCount < 40; turnCount++) {
  if (e.activeUnit === unit && e.actionPhase === 'move' && e.movementSpent === 0) return;
  if (e.actionPhase !== 'end') e.endActiveTurn();
  for (let tick = 0; tick < 39; tick++) e.update();
  assert.equal(e.gameOver, false, 'The ascent must finish in a live battle');
 }
 assert.fail('The normal turn queue did not return to the ascending hero');
}
for (const field of Object.values(TACTICS_UNIVERSE_BATTLEFIELDS)) test(field.id + ': real movement ascends from its authored spawn through successive AP-limited turns', async () => {
 const e = make(field), unit = e.heroes[0], [layer, x, y] = upperTargets[field.id];
 const destination = `${field.id}:${layer}:${x}:${y}`, initial = unit.surfaceId;
 assert.equal(initial, field.heroSpawns[0].surfaceId);
 const visited = [initial], costs = [];
 for (let stepCount = 0; stepCount < 60 && unit.surfaceId !== destination; stepCount++) {
  if (e.activeUnit !== unit || e.actionPhase === 'end') await passUntilNextHeroTurn(e, unit);
  if (e.actionPhase === 'action') assert.equal(e.cancelSelectedAction(), true);
  const full = e.getReachableCells(unit, Infinity).find(cell => cell.surfaceId === destination);
  assert.ok(full && full.path.length > 1, 'An actual unoccupied route must lead to the upper surface');
  const nextId = full.path[1];
  let step = e.movementRange.find(cell => cell.surfaceId === nextId);
  if (!step) {
   e.endActiveTurn(); await passUntilNextHeroTurn(e, unit);
   step = e.movementRange.find(cell => cell.surfaceId === nextId);
  }
  assert.ok(step, nextId + ': one physical transition must fit the new turn budget');
  const support = e.terrain.byId.get(nextId), spentBefore = e.movementSpent;
  const applied = e.handleCellClick(support.x, support.y, support.id);
  assert.equal(applied.handled, true); assert.ok(unit.terrainMotion);
  assert.equal(e.movementSpent, spentBefore + step.cost);
  assert.ok(e.movementSpent <= e.movementBudget);
  for (let frame = 0; frame < 120 && unit.terrainMotion; frame++) e.update();
  assert.equal(unit.terrainMotion, undefined); assert.equal(unit.surfaceId, support.id);
  assert.equal(unit.gridZ, support.z);
  visited.push(support.id); costs.push(step.cost);
 }
 assert.equal(unit.surfaceId, destination);
 assert.ok(unit.gridZ >= 2); assert.ok(visited.length > 4);
 assert.ok(visited.some(id => ['stairs', 'ramp'].includes(e.terrain.byId.get(id).shape)));
 assert.ok(costs.some(cost => cost === 2), 'A real ascent consumes the authored incline AP cost');
});
