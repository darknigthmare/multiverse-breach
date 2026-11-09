import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {COMBAT_SOURCE_DEFINITIONS_WAVE17_PART_B as definitions} from '../src/game/combat/combatSourceDefinitionsWave17PartB.js';
import {ABILITIES_WAVE17_PART_B as kits} from '../src/game/combat/abilities/abilitiesWave17PartB.js';
const plan=JSON.parse(fs.readFileSync('docs/combat-fidelity-wave17-2026-11-02/batch-plan-before.json'));
const amendment=JSON.parse(fs.readFileSync('docs/combat-fidelity-wave17-2026-11-02/batch-amendments-before-generation.json'));
const reviewed=[...plan.parts.B,...amendment.replacements.filter(r=>r.part==='B').map(r=>r.replacementId),'hammond'];
const stripMarkers=a=>Object.fromEntries(Object.entries(a).filter(([k])=>!['sourceMediGunWave17','sourceGoldenLuteWave17'].includes(k)));

test('W17 B keeps all 43 reviewed identities and preserves existing named partial slots',()=>{
 assert.deepEqual(Object.keys(kits),reviewed);assert.deepEqual(Object.keys(definitions),reviewed);
 let added=0;
 for(const row of plan.heroes.filter(r=>r.part==='B')){
  const kit=kits[row.hero.id];added+=row.missingExplicitSlots.length;
  for(const key of ['simple','secondary','defense']){
   assert.ok(kit[key]?.targeting,row.hero.id+'/'+key);
   if(row.priorAuthored?.[key])assert.deepEqual(stripMarkers(kit[key]),row.priorAuthored[key]);
  }
 }
 assert.equal(added,75);
 for(const id of reviewed){assert.equal(definitions[id].source1to1Verified,false);assert.equal(kits[id].source1to1Verified,false);assert.ok(definitions[id].sourceWork);}
});

test('ordinary people and friendly ink-world support never receive possessed or generic damage',()=>{
 for(const id of ['sophie_hotd','bendy_ink_machine_boris','atomic_heart_tereshkova','dana_barrett_gb','louis_tully_gb','hammond']){
  for(const key of ['simple','secondary','defense','special']){
   assert.equal(kits[id][key].dmg,0,id+'/'+key);
   assert.notEqual(kits[id][key].targeting.effect,'damage',id+'/'+key);
   assert.notEqual(kits[id][key].targeting.effect,'heal',id+'/'+key);
  }
 }
 assert.match(definitions.nemesis_awaken_realms_scientist.appearance,/wheelchair/);
 assert.match(definitions.nemesis_awaken_realms_scout.appearance,/female/);
 assert.match(kits.nemesis_awaken_realms_scientist.simple.name,/pistolet/);
 assert.match(kits.nemesis_awaken_realms_scout.simple.name,/fusil/);
});

test('TF2 stock loadouts and Lute ownership retain the runtime admission markers',()=>{
 assert.doesNotMatch(kits.team_fortress_2_scout.special.name,/Bonk/i);
 assert.doesNotMatch(kits.team_fortress_2_soldier.special.name,/banner|bannière/i);
 assert.match(kits.team_fortress_2_soldier.simple.name,/Roquette/);
 for(const slot of ['secondary','special']){
  assert.equal(kits.team_fortress_2_medic[slot].sourceMediGunWave17,true);
  assert.equal(kits.team_fortress_2_medic[slot].targeting.effect,'heal');
 }
 assert.doesNotMatch(kits.crypt_necrodancer_cadence.special.name,/Lute|luth/i);
 for(const slot of ['simple','secondary','special'])assert.equal(kits.crypt_necrodancer_melody[slot].sourceGoldenLuteWave17,true);
 assert.match(definitions.bendy_ink_machine_henry.sourceWork,/2022/);
 assert.match(definitions.absolver_downfall_windfall.sourceWork,/declared custom/);
});
