import test from 'node:test';
import assert from 'node:assert/strict';
import { HEROES_DB } from '../src/game/heroes.js';
import { getExtinctionRoster } from '../src/game/extinctionContent.js';
import { getExtinctionSignature, createExtinctionProtocolState, getExtinctionProtocolStatus,
  activateExtinctionProtocol as cast, tickExtinctionProtocols as tick, damageExtinctionEnemy,
  clearExtinctionProtocolEffects, drawExtinctionProtocols, getExtinctionProtocolBrief } from '../src/game/extinctionSignatures.js';

const IDS = ['arca_tessera','arca_quillon','arca_nadir','arca_elyra','arca_oryn'];
const make = (id) => ({ phase:'running', runId:'campaign-run', heroId:id,
  heroCategory:HEROES_DB.find(hero=>hero.id===id).category,
  px:0,py:0,angle:0,vx:0,vy:0,hp:40,maxHp:140,kills:0,ammo:20,reserveAmmo:45,reloadPulse:0,
  weapon:{type:'pistol',ammo:20,maxAmmo:20},enemies:[],
  protocols:createExtinctionProtocolState(getExtinctionSignature(HEROES_DB.find(hero=>hero.id===id)), 'campaign-run') });
const enemy = (wx=0,wy=4,hp=500) => ({wx,wy,hp,maxHp:hp,size:1,kind:'Traqueur'});
const advance = (state,n,kill) => { for(let i=0;i<n;i++) tick(state,kill); };

test('all five campaign kits stay behind existing ownership and retain their twenty exact source actions',()=>{
  const source=HEROES_DB.filter(hero=>IDS.includes(hero.id));
  assert.equal(source.length,5);
  assert.deepEqual(getExtinctionRoster(source,[]),[]);
  assert.deepEqual(getExtinctionRoster(source,['arca_nadir']).map(hero=>hero.id),['arca_nadir']);
  for(const hero of source) {
    assert.equal(hero.campaignExclusive,true); assert.ok(hero.unlockMissionId>0);
    const original=JSON.stringify(hero),profile=getExtinctionSignature(hero);
    assert.equal(Object.keys(profile.actions).length,4);
    for(const [slot,action] of Object.entries(profile.actions)) {
      assert.deepEqual(action.name,hero[slot].name); assert.equal(action.sourceType,hero[slot].type);
      assert.notEqual(action.kind,'support','every declared summon must have a real implementation');
    }
    assert.equal(JSON.stringify(hero),original);
  }
});
test('Quillon sends a travelling warrant; his ultimate explodes only on impact and respects champion shielding',()=>{
  const s=make('arca_quillon'),target=enemy(0,4),splash=enemy(1,4),distant=enemy(5,4);
  s.enemies=[target,splash,distant]; cast(s,'secondary');
  assert.equal(target.hp,500); assert.equal(s.protocols.projectiles.length,1);
  advance(s,20); assert.ok(target.hp<500); assert.equal(splash.hp,500);
  const boss={...enemy(0,4),kind:'Champion de Trame',shieldActive:true};
  const drone={...enemy(5,12),kind:'Drone Protecteur'};
  s.enemies=[boss,splash,drone];s.protocols.charge=100;cast(s,'special');
  assert.equal(boss.hp,500);advance(s,20);
  assert.equal(boss.hp,500);assert.ok(splash.hp<500);assert.equal(s.protocols.charge,0);
  damageExtinctionEnemy(s,drone,1000);s.protocols.cooldowns.special=0;s.protocols.charge=100;
  cast(s,'special');advance(s,20);assert.ok(boss.hp<500);assert.equal(boss.shieldActive,false);
});
test('Elyra buff changes real damage, evasive step stays in bounds and refusal pulse uses local range',()=>{
  const s=make('arca_elyra'),target=enemy(0,2);s.enemies=[target];
  cast(s,'secondary');cast(s,'simple');
  assert.equal(500-target.hp,Math.round(s.protocols.profile.actions.simple.damage*1.15));
  s.px=7;s.py=27;s.angle=Math.PI/4;cast(s,'defense');assert.equal(s.px,7.5);assert.equal(s.py,28);
  const near=enemy(s.px+1,s.py),far=enemy(s.px+9,s.py);s.enemies=[near,far];s.protocols.charge=100;
  cast(s,'special');assert.ok(near.hp<500);assert.equal(far.hp,500);
  advance(s,240);assert.equal(s.protocols.buff,0);assert.equal(s.protocols.guard,0);
});
test('Oryn blade needs no rounds and only reaches close targets, then the witness beam crosses facing enemies',()=>{
  const s=make('arca_oryn'),near=enemy(0,2),far=enemy(0,10),back=enemy(0,-2);
  s.ammo=0;s.weapon.ammo=0;s.enemies=[near,far,back];cast(s,'simple');cast(s,'secondary');
  assert.ok(near.hp<500);assert.equal(far.hp,500);assert.equal(back.hp,500);assert.equal(s.ammo,0);
  s.protocols.charge=100;cast(s,'special');assert.ok(far.hp<500);assert.equal(back.hp,500);
  cast(s,'defense');assert.equal(s.py,2.4);assert.ok(s.protocols.guard>0);
});
test('Tessera reflection is stationary, delayed, range-limited and records a kill only once',()=>{
  const s=make('arca_tessera'),target=enemy(0,3,10),far=enemy(0,10);s.enemies=[target,far];
  let kills=0;const count=()=>kills++;
  cast(s,'secondary',{onKill:count});const fixed={wx:s.protocols.reflection.wx,wy:s.protocols.reflection.wy};
  assert.equal(target.hp,10);assert.equal(s.protocols.projectiles.length,0);
  s.px=6;s.py=15;advance(s,59,count);assert.equal(target.hp,10);
  tick(s,count);assert.equal(target.hp,0);assert.equal(far.hp,500);assert.equal(kills,1);assert.equal(s.kills,1);
  assert.deepEqual({wx:s.protocols.reflection.wx,wy:s.protocols.reflection.wy},fixed);
  assert.equal(s.protocols.charge,8);
  advance(s,240,count);assert.equal(s.protocols.reflection,null);assert.equal(kills,1);assert.equal(far.hp,500);
  assert.equal(s.protocols.casts.secondary,1);assert.equal(s.rewards,undefined);
});
test('a reflection cannot bypass the champion shield; a second reflection cannot be stacked',()=>{
  const s=make('arca_tessera'),boss={...enemy(0,2),kind:'Champion de Trame',shieldActive:true},drone={...enemy(0,7),kind:'Drone Protecteur'};
  s.enemies=[boss,drone];cast(s,'secondary');const reflection=s.protocols.reflection;
  assert.equal(cast(s,'secondary').reason,'cooldown');assert.equal(s.protocols.reflection,reflection);
  advance(s,60);assert.equal(boss.hp,500);assert.equal(s.protocols.charge,0);
  damageExtinctionEnemy(s,drone,1000);advance(s,60);assert.ok(boss.hp<500);assert.equal(boss.shieldActive,false);
});
test('Nadir deploys and recalls one return probe without restoring health, ammunition or cooldown',()=>{
  const s=make('arca_nadir');s.px=-2;s.py=5;
  cast(s,'secondary');assert.deepEqual([s.px,s.py],[-2,5]);
  const cooldown=s.protocols.cooldowns.secondary;
  s.px=5;s.py=17;s.vx=.4;s.vy=.6;s.hp=12;s.ammo=4;s.weapon.ammo=4;
  advance(s,80);assert.equal(getExtinctionProtocolStatus(s,'secondary'),'ready');
  assert.equal(cast(s,'secondary').reason,'returned');
  assert.deepEqual([s.px,s.py,s.vx,s.vy],[-2,5,0,0]);
  assert.equal(s.hp,12);assert.equal(s.ammo,4);assert.equal(s.reserveAmmo,45);
  assert.equal(s.protocols.cooldowns.secondary,cooldown-80);assert.equal(s.protocols.casts.secondary,1);
  assert.equal(s.protocols.returns,1);assert.equal(s.protocols.returnProbe,null);
  assert.equal(cast(s,'secondary').reason,'cooldown');assert.equal(s.rewards,undefined);
});
test('return probe expires in active time, cannot be recalled while paused, and heals only through the named ultimate',()=>{
  const s=make('arca_nadir');cast(s,'secondary');s.px=4;s.py=6;s.paused=true;
  const paused=structuredClone(s);advance(s,720);assert.equal(cast(s,'secondary').reason,'paused');assert.deepEqual(s,paused);
  s.paused=false;advance(s,360);assert.equal(s.protocols.returnProbe,null);assert.equal(cast(s,'secondary').reason,'cooldown');
  assert.deepEqual([s.px,s.py],[4,6]);
  s.protocols.charge=100;cast(s,'special');assert.equal(s.hp,105);
  advance(s,60);assert.equal(getExtinctionProtocolStatus(s,'secondary'),'ready');
  cast(s,'secondary');assert.deepEqual([s.protocols.returnProbe.wx,s.protocols.returnProbe.wy],[4,6]);
});
test('support state from another owner or run never deals damage or recalls coordinates',()=>{
  for(const id of ['arca_tessera','arca_nadir']) {
    for(const corrupt of [entry=>entry.ownerId='other',entry=>entry.runId='previous',entry=>entry.wx=NaN]) {
      const s=make(id),target=enemy(0,2);s.enemies=[target];cast(s,'secondary');
      const key=id==='arca_tessera'?'reflection':'returnProbe';corrupt(s.protocols[key]);
      const before=[s.px,s.py];assert.equal(cast(s,'secondary').reason,'cooldown');tick(s);
      assert.equal(s.protocols[key],null);assert.deepEqual([s.px,s.py],before);assert.equal(target.hp,500);
    }
  }
});
test('support world markers render without mutating simulation or borrowing character art',()=>{
  for(const id of ['arca_tessera','arca_nadir']) {
    const s=make(id);cast(s,'secondary');s.py=-1;const before=structuredClone(s);let strokes=0;
    const ctx=new Proxy({stroke(){strokes++;},drawImage(){throw new Error('no borrowed image');}},{get:(t,p)=>t[p]||(()=>{}),set:()=>true});
    drawExtinctionProtocols(ctx,s,840,430,()=>({camZ:3,aim:0}));assert.ok(strokes>0);assert.deepEqual(s,before);
    assert.ok(getExtinctionProtocolBrief(s.protocols.profile.actions.secondary,'fr').length>20);
    assert.ok(getExtinctionProtocolBrief(s.protocols.profile.actions.secondary,'en').length>20);
  }
});
test('end cleanup removes anchors and effects while retaining cast history and the single reward receipt',()=>{
  for(const id of ['arca_tessera','arca_nadir']) {
    const s=make(id);cast(s,'secondary');cast(s,'simple');s.phase='ended';s.rewards={gold:17};
    clearExtinctionProtocolEffects(s);clearExtinctionProtocolEffects(s);advance(s,720);
    assert.equal(s.protocols.projectiles.length,0);assert.equal(s.protocols.effects.length,0);
    assert.equal(s.protocols[id==='arca_tessera'?'reflection':'returnProbe'],null);
    assert.equal(s.protocols.casts.secondary,1);assert.deepEqual(s.rewards,{gold:17});
    assert.equal(cast(s,'secondary').reason,'unavailable');
  }
});
