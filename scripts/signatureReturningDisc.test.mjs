import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSignatureReturningDiscs, DISC_RULES, discContactTime } from '../src/game/signatureReturningDisc.js';
const unit = (id, x) => ({ id, x, y: 200, currentHp: 100, state: 'idle', special: { key: 'test' }, facing: 1 });
function make() {
  const owner = unit('owner', 100), target = unit('target', 360), replacement = unit('replacement', 370);
  const hits = []; const engine = { heroes: [owner], enemies: [target, replacement], platforms: [],
    applyDamage: (...args) => { hits.push(args); args[1].currentHp -= args[2]; } };
  const sideOf = a => engine.heroes.includes(a) ? 'player' : engine.enemies.includes(a) ? 'enemy' : null;
  const action = owner.special;
  const definition = { key: 'test', projectile: 'returning-disc', range: 360 };
  const f = createSignatureReturningDiscs(engine, { sideOf, enemiesOf: a => sideOf(a) === 'player' ? engine.enemies : engine.heroes,
    validAction: (a, v, key) => a.special === action && v === action && key === 'test' });
  return { owner, target, replacement, engine, hits, f, definition };
}
const ticks = (f, n) => { for (let i = 0; i < n; i++) f.advance(); };
const start = s => s.f.launch(s.owner, s.target, s.definition, 25);

test('swept contacts catch a target between endpoints, not only at the endpoint', () => {
  assert.equal(discContactTime({x:0,y:0},{x:100,y:0},{x:50,y:0},10),0.4);
  assert.equal(discContactTime({x:0,y:0},{x:100,y:0},{x:50,y:30},10),null);
  assert.equal(discContactTime({x:0,y:0},{x:0,y:0},{x:0,y:0},10),0);
  assert.equal(discContactTime({x:0,y:0},{x:0,y:0},{x:50,y:0},10),null);
  assert.equal(discContactTime({x:NaN,y:0},{x:5,y:0},{x:2,y:0},10),null);
});
test('outbound flight delays damage, hits once and returns without another hit', () => {
  const s=make();assert.equal(start(s),true);assert.equal(start(s),false);
  ticks(s.f,10);assert.equal(s.hits.length,0);assert.equal(s.f.snapshot()[0].phase,'outbound');
  ticks(s.f,20);assert.equal(s.hits.length,1);assert.equal(s.f.snapshot()[0].phase,'return');
  ticks(s.f,60);assert.equal(s.hits.length,1);assert.equal(s.f.snapshot().length,0);
});
for(const key of ['paused','targeting','prematch']) test(`${key} suspends flight age and movement`,()=>{
  const s=make();start(s);ticks(s.f,3);const before=s.f.snapshot();
  if(key==='paused')s.engine.paused=true;
  if(key==='targeting')s.engine.isTargetingPaused=()=>true;
  if(key==='prematch')s.engine.isMatchInputLocked=()=>true;
  ticks(s.f,200);assert.deepEqual(s.f.snapshot(),before);assert.equal(s.hits.length,0);
});
for(const change of ['dead','removed','side','position','action']) test(`owner ${change} disposes flight without damages`,()=>{
  const s=make();start(s);
  if(change==='dead')s.owner.currentHp=0;
  if(change==='removed')s.engine.heroes=[];
  if(change==='side'){s.engine.heroes=[];s.engine.enemies.push(s.owner);}
  if(change==='position')s.owner.x=Infinity;
  if(change==='action')s.owner.special={key:'test'};
  assert.equal(s.f.snapshot().length,0);ticks(s.f,160);assert.equal(s.hits.length,0);
});
for(const change of ['dead','removed','side','evade']) test(`target ${change} never grants damage to a replacement`,()=>{
  const s=make();start(s);ticks(s.f,4);
  if(change==='dead')s.target.currentHp=0;
  if(change==='removed')s.engine.enemies=[s.replacement];
  if(change==='side'){s.engine.enemies=[s.replacement];s.engine.heroes.push(s.target);}
  if(change==='evade')s.target.y=50;
  ticks(s.f,160);assert.equal(s.hits.length,0);assert.equal(s.f.snapshot().length,0);
});
test('return follows the moving owner without damage or a permanent busy state',()=>{
  const s=make();start(s);ticks(s.f,30);s.owner.x=220;ticks(s.f,30);
  assert.equal(s.hits.length,1);assert.equal(s.f.has(s.owner),false);
});
test('a target crossing a flight segment cannot tunnel through it',()=>{
  const s=make();s.target.x=180;start(s);ticks(s.f,1);s.target.x=80;ticks(s.f,1);
  assert.equal(s.hits.length,1);
});
test('solid platform intercepts before the target; pass-through rails do not',()=>{
  for(const passThrough of [false,true]){
    const s=make();s.target.y=280;s.engine.platforms=[{x1:120,x2:500,y:220,passThrough}];start(s);ticks(s.f,120);
    assert.equal(s.hits.length,passThrough?1:0);
  }
});
test('returned snapshots cannot mutate live projectile data',()=>{
  const s=make();start(s);const p=s.f.snapshot()[0];p.x=NaN;p.phase='return';
  assert.equal(s.f.snapshot()[0].phase,'outbound');assert.ok(Number.isFinite(s.f.snapshot()[0].x));
});
for(const flag of ['gameOver','disposed']) test(`${flag} clears all flights immediately`,()=>{
  const s=make();start(s);s.engine[flag]=true;assert.deepEqual(s.f.snapshot(),[]);ticks(s.f,160);assert.equal(s.hits.length,0);
});
for(const damage of [0,-1,NaN,Infinity,'25']) test(`invalid damage ${String(damage)} is rejected`,()=>{
  const s=make();assert.equal(s.f.launch(s.owner,s.target,s.definition,damage),false);assert.equal(s.f.has(s.owner),false);
});
test('out-of-range throw rejected; chase expires even when owner outruns the return',()=>{
  const s=make();s.target.x=999;assert.equal(start(s),false);s.target.x=360;start(s);s.target.currentHp=0;
  for(let i=0;i<=DISC_RULES.lifetime;i++){s.owner.x-=100;s.f.advance();}
  assert.equal(s.f.has(s.owner),false);
});
test('re-entrant damage callback cannot hit the target twice',()=>{
  const s=make();const original=s.engine.applyDamage;s.engine.applyDamage=(...args)=>{original(...args);s.f.advance();};start(s);ticks(s.f,100);assert.equal(s.hits.length,1);
});
