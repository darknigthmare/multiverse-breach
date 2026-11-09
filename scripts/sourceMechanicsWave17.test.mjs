import test from 'node:test';import assert from 'node:assert/strict';
import{resolveGoldenLuteStepWave17,startMediGunBeamWave17,advanceMediGunBeamWave17,activateUberChargeWave17,findChargedMedicWave17,hasStockUberProtectionWave17,stopMediGunBeamWave17,advanceSourceMechanicsWave17,sourceCellWave17,canUseOkarunAllOutWave17,consumeOkarunAllOutWave17}from'../src/game/combat/sourceMechanicsWave17.js';
const unit=(id,universe,x=0,y=0)=>({id,runtimeId:id+':runtime',universe,currentHp:100,maxHp:100,state:'idle',x,y});
const melody=()=>unit('crypt_necrodancer_melody','Crypt of the NecroDancer');
const medic=()=>unit('team_fortress_2_medic','Team Fortress 2');
const from={x:1,y:1,z:0},to={x:2,y:1,z:0};
test('Golden Lute hits only four cardinal neighbors of actual departure and arrival, never distant or upper surfaces',()=>{
 const actor=melody();const positions=[[1,0,0],[2,0,0],[3,1,0],[1,2,0],[2,2,0],[9,9,0],[1,0,1],[0,0,0]];
 const targets=positions.map(([x,y,z],i)=>({actor:unit('target'+i,'Other'),cell:{x,y,z},hostile:true}));
 const result=resolveGoldenLuteStepWave17(actor,from,to,targets,{accepted:true});assert.equal(result.length,5);assert.deepEqual(result.map(c=>c.targetId),[targets[0],targets[3],targets[1],targets[2],targets[4]].map(t=>t.actor.runtimeId));
 assert.ok(result.every(c=>c.acceptedMovement&&c.mechanism==='melody-golden-lute-cardinal-step'));
});
test('Lute rejects stationary casts, diagonal movement, teleports, off-beat, dead owners, and Cadence with another person’s lute',()=>{
 const actor=melody(),target={actor:unit('enemy','Other'),cell:{x:2,y:0},hostile:true};
 for(const destination of[from,{x:2,y:2},{x:5,y:1},{x:2,y:1,z:1}])assert.deepEqual(resolveGoldenLuteStepWave17(actor,from,destination,[target],{accepted:true}),[]);
 assert.deepEqual(resolveGoldenLuteStepWave17(actor,from,to,[target],{accepted:false}),[]);assert.deepEqual(resolveGoldenLuteStepWave17(actor,from,to,[target],{accepted:true,onBeat:false}),[]);
 actor.currentHp=0;assert.deepEqual(resolveGoldenLuteStepWave17(actor,from,to,[target],{accepted:true}),[]);actor.currentHp=100;actor.id='crypt_necrodancer_cadence';assert.deepEqual(resolveGoldenLuteStepWave17(actor,from,to,[target],{accepted:true}),[]);
});
test('Lute does not hit allies, defeated targets, or reapply when a render/read repeats a stationary frame',()=>{
 const actor=melody(),friend=unit('friend','Other'),dead=unit('dead','Other');dead.currentHp=0;assert.deepEqual(resolveGoldenLuteStepWave17(actor,from,to,[{actor:friend,hostile:false,cell:{x:2,y:0}},{actor:dead,hostile:true,cell:{x:2,y:0}}],{accepted:true}),[]);
 let hits=0;actor.x=64;actor.y=64;const enemy=unit('enemy','Other',192,64),engine={heroes:[actor],enemies:[enemy]};const options={applyLute:()=>hits++};advanceSourceMechanicsWave17(engine,[engine.heroes,engine.enemies],1/60,options);actor.x=128;advanceSourceMechanicsWave17(engine,[engine.heroes,engine.enemies],1/60,options);assert.equal(hits,1);for(let n=0;n<60;n++)advanceSourceMechanicsWave17(engine,[engine.heroes,engine.enemies],1/60,options);assert.equal(hits,1);assert.deepEqual(sourceCellWave17(actor),{x:2,y:1,z:0});
});
function beam(){const m=medic(),p=unit('team_fortress_2_scout','Team Fortress 2',64),other=unit('third','Other',96);const actors=[m,p,other];const allies=(a,b)=>[m,p].includes(a)&&[m,p].includes(b);return{m,p,other,actors,allied:allies};}
test('Medi Gun requires stock Medic, living allied distinct patient, real range and line of sight',()=>{
 for(const option of[{allied:false},{allied:true,lineOfSight:false},{allied:true,range:1}]){const c=beam();assert.equal(startMediGunBeamWave17(c.m,c.p,option),false);}
 const c=beam();assert.equal(startMediGunBeamWave17(c.m,c.m,{allied:true}),false);assert.equal(startMediGunBeamWave17(c.p,c.m,{allied:true}),false);assert.equal(startMediGunBeamWave17(c.m,c.p,{allied:true}),true);assert.equal(c.m.sourceMediGunWave17.charge,0);assert.equal(findChargedMedicWave17(c.p,c.actors),null);assert.equal(activateUberChargeWave17(c.p,c.actors),null);
});
test('Only forty seconds of an actually maintained below-threshold beam build a full stock charge, never a cast or wall-time jump',()=>{
 const c=beam();assert.equal(startMediGunBeamWave17(c.m,c.p,{allied:true}),true);for(let i=0;i<2399;i++){c.p.currentHp=50;advanceMediGunBeamWave17(c.m,c.actors,1/60,c);}assert.ok(c.m.sourceMediGunWave17.charge<1);assert.equal(findChargedMedicWave17(c.p,c.actors),null);advanceMediGunBeamWave17(c.m,c.actors,1/60,c);assert.equal(findChargedMedicWave17(c.p,c.actors),c.m);assert.ok(Math.abs(c.m.sourceMediGunWave17.elapsed-40)<1e-9);
 const fresh=beam();startMediGunBeamWave17(fresh.m,fresh.p,{allied:true});advanceMediGunBeamWave17(fresh.m,fresh.actors,3600,fresh);assert.equal(fresh.m.sourceMediGunWave17.elapsed,.1);assert.ok(fresh.m.sourceMediGunWave17.charge<.003);
});
test('Overheal threshold halves charge rate and caps healing at150%, with no charging or healing while paused',()=>{
 const c=beam();c.p.currentHp=145;startMediGunBeamWave17(c.m,c.p,{allied:true});advanceMediGunBeamWave17(c.m,c.actors,.1,c);assert.ok(Math.abs(c.m.sourceMediGunWave17.charge-.00125)<1e-12);for(let n=0;n<100;n++)advanceMediGunBeamWave17(c.m,c.actors,.1,c);assert.equal(c.p.currentHp,150);
 const before=JSON.stringify(c.m.sourceMediGunWave17),hp=c.p.currentHp;advanceMediGunBeamWave17(c.m,c.actors,1,{...c,paused:true});assert.equal(JSON.stringify(c.m.sourceMediGunWave17),before);assert.equal(c.p.currentHp,hp);
});
test('Eight-second stock Über protects only the actual connected Medic and patient and never heals/deals damage on activation',()=>{
 const c=beam();startMediGunBeamWave17(c.m,c.p,{allied:true});for(let n=0;n<2400;n++){c.p.currentHp=50;advanceMediGunBeamWave17(c.m,c.actors,1/60,c);}const hp=c.p.currentHp;assert.equal(activateUberChargeWave17(c.p,c.actors),c.m);assert.equal(c.p.currentHp,hp);assert.equal(hasStockUberProtectionWave17(c.m,c.actors,c.allied),true);assert.equal(hasStockUberProtectionWave17(c.p,c.actors,c.allied),true);assert.equal(hasStockUberProtectionWave17(c.other,c.actors,c.allied),false);
 for(let n=0;n<479;n++)advanceMediGunBeamWave17(c.m,c.actors,1/60,c);assert.equal(hasStockUberProtectionWave17(c.p,c.actors,c.allied),true);advanceMediGunBeamWave17(c.m,c.actors,1/60,c);assert.equal(hasStockUberProtectionWave17(c.p,c.actors,c.allied),false);assert.equal(c.m.sourceMediGunWave17.uberRemaining,0);
});
test('Beam death, removal, lost range, interruption and explicit release immediately revoke patient protection',()=>{
 for(const failure of['medic-dead','patient-dead','medic-removed','patient-removed','range','stun','release']){const c=beam();startMediGunBeamWave17(c.m,c.p,{allied:true});c.m.sourceMediGunWave17.charge=1;activateUberChargeWave17(c.p,c.actors);if(failure==='medic-dead')c.m.currentHp=0;if(failure==='patient-dead')c.p.currentHp=0;if(failure==='medic-removed')c.actors.splice(c.actors.indexOf(c.m),1);if(failure==='patient-removed')c.actors.splice(c.actors.indexOf(c.p),1);if(failure==='range')c.p.x=999;if(failure==='stun')c.m.hitstun=.1;if(failure==='release')stopMediGunBeamWave17(c.m);assert.equal(hasStockUberProtectionWave17(c.p,c.actors,c.allied),false,failure);advanceMediGunBeamWave17(c.m,c.actors,1/60,c);assert.equal(c.m.sourceMediGunWave17.connected,false,failure);}
});
test('Stock Medi Gun overheal decays back to normal HP in15 simulated seconds after the beam ends',()=>{
 const c=beam(),engine={width:1000,heroes:[c.m,c.p],enemies:[c.other]};startMediGunBeamWave17(c.m,c.p,{allied:true});for(let n=0;n<1000;n++)advanceMediGunBeamWave17(c.m,c.actors,1/60,c);assert.equal(c.p.currentHp,150);stopMediGunBeamWave17(c.m);for(let n=0;n<900;n++)advanceSourceMechanicsWave17(engine,[engine.heroes,engine.enemies],1/60);assert.ok(Math.abs(c.p.currentHp-100)<1e-8);assert.ok(c.p.currentHp>=100);
});

test('An injured former-overheal patient never receives a free refill from overheal decay',()=>{const c=beam(),engine={width:1000,heroes:[c.m,c.p],enemies:[c.other]};c.p.sourceMediGunOverhealWave17=true;c.p.currentHp=30;advanceSourceMechanicsWave17(engine,[engine.heroes,engine.enemies],1/60);assert.equal(c.p.currentHp,30);assert.equal(c.p.sourceMediGunOverhealWave17,false);});
test('The actual stock beam heals exactly24HP per connected simulated second, independently of the patient maximum',()=>{
 const c=beam();c.p.currentHp=5;c.p.maxHp=1000;startMediGunBeamWave17(c.m,c.p,{allied:true});for(let i=0;i<60;i++)advanceMediGunBeamWave17(c.m,c.actors,1/60,c);assert.ok(Math.abs(c.p.currentHp-29)<1e-9);
});
test('A different committed weapon action disconnects the actual Medic beam before another native weapon can be used',()=>{
 const c=beam(),engine={heroes:[c.m,c.p],enemies:[c.other],width:1000};startMediGunBeamWave17(c.m,c.p,{allied:true});c.m.action={identity:{name:'Syringe Gun',sourceHeroId:'team_fortress_2_medic',universe:'Team Fortress 2',effect:'damage'}};advanceSourceMechanicsWave17(engine,[engine.heroes,engine.enemies],1/60);assert.equal(c.m.sourceMediGunWave17.connected,false);assert.equal(c.m.sourceMediGunWave17.endedBy,'another-command');
});

test('The two all-out uses belong to the actual Okarun identity, never a same-universe borrowed name',()=>{
 const profile={sourceHeroId:'oken_dandadan',universe:'Dandadan',sourceOkarunAllOutWave17:true,maxAllOutUses:2},actor=unit('oken_dandadan','Dandadan');
 assert.equal(canUseOkarunAllOutWave17(unit('momo_ayase','Dandadan'),profile),false);assert.equal(consumeOkarunAllOutWave17(actor,profile),true);assert.equal(consumeOkarunAllOutWave17(actor,profile),true);assert.equal(consumeOkarunAllOutWave17(actor,profile),false);assert.equal(actor.sourceOkarunAllOutUsesWave17,2);
});
