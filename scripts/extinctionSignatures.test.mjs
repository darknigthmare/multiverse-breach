import test from 'node:test';
import assert from 'node:assert/strict';
import { HEROES_DB } from '../src/game/heroes.js';
import { createPlayerHero } from '../src/game/playerHero.js';
import { EXTINCTION_SIGNATURE_IDS, getExtinctionSignature, createExtinctionProtocolState,
  activateExtinctionProtocol as cast, getExtinctionProtocolStatus as status, tickExtinctionProtocols as tick,
  damageExtinctionEnemy as hurt, mitigateExtinctionProtocolDamage as reduce, extinctionSegmentHit, drawExtinctionProtocols } from '../src/game/extinctionSignatures.js';
const heroes = [createPlayerHero(), ...HEROES_DB];
const make = (id = 'arca_mirelle') => ({phase:'running', heroId:id, heroCategory:'hacker', runId:7,
  px:0,py:0,angle:0,hp:30,maxHp:120,kills:0,reloadPulse:0,ammo:24,
  weapon:{type:'pistol',ammo:24,maxAmmo:24}, enemies:[],
  protocols:createExtinctionProtocolState(getExtinctionSignature(heroes.find(h=>h.id===id)),7)});
const enemy = (wx=0,wy=4,hp=500) => ({wx,wy,hp,maxHp:hp,size:1,kind:'Traqueur'});
for (const id of EXTINCTION_SIGNATURE_IDS) {
  test(`all four ${id} actions preserve source name/type, execute and retain source data`,()=>{
    const hero=heroes.find(h=>h.id===id),before=JSON.stringify(hero),p=getExtinctionSignature(hero);
    assert.deepEqual(Object.keys(p.actions),['simple','secondary','defense','special']);
    for(const slot of Object.keys(p.actions)){
      assert.deepEqual(p.actions[slot].name,hero[slot].name);assert.equal(p.actions[slot].sourceType,hero[slot].type);
      const s=make(id);s.enemies=[enemy(0,1)];s.protocols.charge=100;
      assert.equal(cast(s,slot).activated,true);assert.equal(s.protocols.casts[slot],1);
      assert.equal(cast(s,slot).reason,'cooldown');
      assert.equal(s.protocols.charge,slot==='special'?0:s.protocols.charge);
    }
    assert.equal(JSON.stringify(hero),before);
  });
}
test('uncurated and peaceful identities retain the old mode, without borrowed actions',()=>{
  assert.equal(getExtinctionSignature({id:'masterchief'}),null);
  assert.equal(getExtinctionSignature({...heroes.find(h=>h.id==='arca_mirelle'),nonCombat:true}),null);
  assert.equal(getExtinctionSignature({...heroes.find(h=>h.id==='arca_mirelle'),category:'trial'}),null);
});
test('ranged primary spends one round and obeys reload, empty magazine, pickup and cooldown',()=>{
  const s=make();assert.equal(cast(s,'simple').activated,true);assert.equal(s.ammo,23);assert.equal(s.weapon.ammo,23);
  assert.equal(cast(s,'simple').reason,'cooldown');for(let i=0;i<20;i++)tick(s);
  s.reloadPulse=1;assert.equal(status(s,'simple'),'reload');s.reloadPulse=0;s.weapon.ammo=0;
  assert.equal(status(s,'simple'),'ammo');s.weapon.type='rocket';assert.equal(status(s,'simple'),'pickup');
});
test('melee costs no ammunition and only contacts the close facing target',()=>{
  const s=make('arca_marrow');s.weapon.ammo=0;s.ammo=0;
  const close=enemy(0,1),far=enemy(0,8),back=enemy(0,-1);s.enemies=[close,far,back];
  cast(s,'simple');assert.ok(close.hp<500);assert.equal(far.hp,500);assert.equal(back.hp,500);assert.equal(s.ammo,0);
});
test('beam contacts in range and facing, not targets behind or outside cone/range',()=>{
  const s=make('player_anchor'),front=enemy(0,5),next=enemy(0,8),far=enemy(0,30),side=enemy(6,3),back=enemy(0,-2);
  s.enemies=[front,next,far,side,back];cast(s,'secondary');
  assert.ok(front.hp<500&&next.hp<500);for(const e of [far,side,back])assert.equal(e.hp,500);
});
test('projectile travels in world coordinates before an impact, and is consumed exactly once',()=>{
  const s=make(),e=enemy(0,4,10);s.enemies=[e];let killed=0;cast(s,'simple');
  assert.equal(e.hp,10);assert.equal(s.protocols.projectiles.length,1);
  for(let i=0;i<25;i++)tick(s,()=>killed++);
  assert.equal(e.hp,0);assert.equal(killed,1);assert.equal(s.kills,1);assert.equal(s.protocols.projectiles.length,0);
});
test('segment collision catches tunnelling and resolves the nearer target first',()=>{
  assert.equal(extinctionSegmentHit(0,0,0,10,0,5,1),0.4);
  assert.equal(extinctionSegmentHit(0,0,0,10,5,5,1),null);
  assert.equal(extinctionSegmentHit(0,0,0,0,0,0,1),0);
  const s=make();s.enemies=[enemy(0,8),enemy(0,3)];cast(s,'simple');s.protocols.projectiles[0].vy=10;tick(s);
  assert.equal(s.enemies[0].hp,500);assert.ok(s.enemies[1].hp<500);
});
test('mine arms after 30 frames, stays still, and damages nearby rather than distant targets',()=>{
  const s=make('arca_sable');const close=enemy(0,2),splash=enemy(1,2),far=enemy(5,7);s.enemies=[close,splash,far];cast(s,'secondary');
  const initial={...s.protocols.projectiles[0]};for(let i=0;i<29;i++)tick(s);
  assert.equal(close.hp,500);assert.equal(s.protocols.projectiles[0].wy,initial.wy);tick(s);
  assert.ok(close.hp<500&&splash.hp<500);assert.equal(far.hp,500);assert.equal(s.protocols.projectiles.length,0);
});
test('a missed projectile expires and cannot cross the whole arena indefinitely',()=>{
 const s=make();cast(s,'simple');for(let i=0;i<81;i++)tick(s);assert.equal(s.protocols.projectiles.length,0);
});
test('ultimate charge is earned on actual damage, capped and spent once, never on own ultimate',()=>{
 const s=make('arca_sable');s.enemies=[enemy(0,2)];assert.equal(cast(s,'special').reason,'charge');
 for(let i=0;i<15;i++)hurt(s,s.enemies[0],1,null,8);assert.equal(s.protocols.charge,100);
 cast(s,'special');assert.equal(s.protocols.charge,0);assert.equal(cast(s,'special').reason,'cooldown');
 for(let i=0;i<15;i++)tick(s);assert.equal(s.protocols.charge,0);assert.ok(s.enemies[0].hp<400);
});
test('champion shield rejects all centralized damage until the live drones are gone',()=>{
 const s=make(),boss={...enemy(0,5),kind:'Champion de Trame',shieldActive:true},drone={...enemy(1,3,10),kind:'Drone Protecteur'};s.enemies=[boss,drone];
 assert.equal(hurt(s,boss,900,null,8),0);assert.equal(s.protocols.charge,0);hurt(s,drone,10);
 assert.ok(hurt(s,boss,900)>0);assert.equal(boss.hp,0);assert.equal(boss.shieldActive,false);
 assert.equal(hurt(s,boss,100),0);assert.equal(s.kills,2);
});
test('guard uses source reduction/duration and no stacking exploit with a barricade',()=>{
 const s=make('arca_bastion');cast(s,'secondary');assert.equal(reduce(s,100),60);cast(s,'defense');
 assert.ok(Math.abs(reduce(s,100)-18)<1e-8);for(let i=0;i<156;i++)tick(s);assert.equal(reduce(s,100),60);
 for(let i=0;i<144;i++)tick(s);assert.equal(reduce(s,100),100);
});
test('heal/drone effects are bounded; nova dash respects arena and buff expires',()=>{
 const h=make();h.hp=115;cast(h,'secondary');assert.equal(h.hp,120);
 const d=make('arca_loom');d.hp=119;cast(d,'secondary');for(let i=0;i<60;i++)tick(d);assert.equal(d.hp,120);
 const s=make('arca_nova');s.px=7;s.py=27;s.angle=Math.PI/4;cast(s,'defense');assert.equal(s.px,7.5);assert.equal(s.py,28);
 cast(s,'secondary');assert.equal(s.protocols.buff,240);for(let i=0;i<240;i++)tick(s);assert.equal(s.protocols.buff,0);
});
test('pause freezes cooldowns, projectile motion and support effects',()=>{
 const s=make();cast(s,'simple');cast(s,'defense');s.paused=true;const before=structuredClone(s.protocols);
 for(let i=0;i<120;i++)tick(s);assert.deepEqual(s.protocols,before);assert.equal(cast(s,'secondary').reason,'paused');
 s.enemies=[enemy()];assert.equal(hurt(s,s.enemies[0],100),0);
});
test('end, stale owner or stale run cannot execute or update a signature',()=>{
 for(const change of [s=>s.phase='ended',s=>s.heroId='arca_nova',s=>s.runId++]){
  const s=make();cast(s,'simple');change(s);const before=structuredClone(s.protocols);tick(s);
  assert.deepEqual(s.protocols,before);assert.equal(cast(s,'secondary').activated,false);
 }
 const s=make();cast(s,'simple');s.protocols.projectiles[0].runId--;tick(s);assert.equal(s.protocols.projectiles.length,0);
});
test('procedural feedback is drawn without mutating simulation or borrowing assets',()=>{
 const s=make('arca_marrow');cast(s,'simple');const before=structuredClone(s);let strokes=0;
 const ctx=new Proxy({stroke(){strokes++;}},{get:(t,p)=>t[p]||(()=>{}),set:()=>true});
 drawExtinctionProtocols(ctx,s,840,430,()=>({camZ:0,aim:0}));assert.ok(strokes>0);assert.deepEqual(s,before);
});
test('world projectile art keeps the exact owner and aspect; missing or foreign art uses neutral feedback',()=>{
 const s=make();cast(s,'simple');let draws=[];
 const ctx=new Proxy({drawImage(...args){draws.push(args);}},{get:(t,p)=>t[p]||(()=>{}),set:()=>true});
 const image={complete:true,naturalWidth:300,naturalHeight:100},project=()=>({camZ:3,aim:0});
 drawExtinctionProtocols(ctx,s,840,430,project,{ownerId:'arca_sable',image});assert.equal(draws.length,0);
 drawExtinctionProtocols(ctx,s,840,430,project,{ownerId:'arca_mirelle',image});assert.equal(draws.length,1);
 const args=draws[0];assert.equal(args[7]/args[8],3);
 image.complete=false;draws=[];drawExtinctionProtocols(ctx,s,840,430,project,{ownerId:'arca_mirelle',image});assert.equal(draws.length,0);
});
