import assert from 'node:assert/strict';
import { before, after, afterEach, test } from 'node:test';
import { createServer } from 'vite';
let vite, Fighter, heroes, enemies, kits, melee, codex;
const engines=[];
before(async()=>{
  vite=await createServer({appType:'custom',logLevel:'silent',server:{middlewareMode:true}});
  ({EngineFighter:Fighter}=await vite.ssrLoadModule('/src/game/engineFighter.js'));
  ({HEROES_DB:heroes}=await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ENEMIES_DB:enemies}=await vite.ssrLoadModule('/src/game/enemies.js'));
  ({SIGNATURE_SOURCE_KITS:kits}=await vite.ssrLoadModule('/src/game/signatureSourceKits.js'));
  melee=await vite.ssrLoadModule('/src/game/fighterMeleeSignatures.js');
  codex=await vite.ssrLoadModule('/src/game/signatureCodex.js');
});
afterEach(()=>engines.splice(0).forEach(e=>e.dispose()));
after(async()=>vite?.close());
const ordinary=id=>({id,name:id,universe:'QA',stats:{hp:1000,atk:15,def:5,spd:8}});
function fixture(id,side='player'){
  const source=typeof id==='string'?structuredClone(heroes.find(h=>h.id===id)):structuredClone(id);assert.ok(source);
  const e=new Fighter(960,540,side==='player'?[source,ordinary('p-reserve')]:[ordinary('p'),ordinary('p-reserve')],side==='cpu'?[source,ordinary('c-reserve')]:[ordinary('c'),ordinary('c-reserve')],{add(){}},()=>{},()=>{},{opponentControl:'p2'});
  engines.push(e);e.countdown=0;
  const a=e.getActive(side),b=e.getOpponent(side);Object.assign(a,{x:350,y:e.groundY,meter:100});Object.assign(b,{x:410,y:e.groundY,currentHp:10000,maxHp:10000});
  return {e,a,b,side,source};
}
for(const side of ['player','cpu']){
  test(`${side}: a close-range Beat Rush cannot be launched across the screen`,()=>{
    const {e,a,b}=fixture('tifa_ff7',side);b.x=800;
    assert.equal(e.canUseSuper(side),false);assert.equal(e.tryAction(side,'super'),false);assert.equal(a.meter,100);
  });
  test(`${side}: Omnislash resolves fifteen contacts rather than one generic super`,()=>{
    const {e,a}=fixture('cloud_ff7',side);assert.equal(e.tryAction(side,'super'),true);
    for(let i=0;i<240;i++){e.hitStop=0;e.updateActions(1/60);}
    assert.equal(e.stats[side].maxCombo,15);assert.equal(a.special.name,'Omnislash');
  });
  test(`${side}: Rasengan checks distance again before impact`,()=>{
    const {e,b}=fixture('naruto_uzumaki_young',side);e.tryAction(side,'super');b.x=800;const hp=b.currentHp;
    e.updateActions(0.46);assert.equal(b.currentHp,hp);
  });
}
function advance(e,steps=240){for(let i=0;i<steps;i++){e.hitStop=0;e.updateActions(1/60);}}
function sourceFor(d){
  if(d.actorId)return heroes.find(h=>h.id===d.actorId);
  const roster=enemies[d.universe];
  const a=[...(roster?.monsters||[]),...(roster?.bosses||[]),roster?.worldBoss].filter(Boolean)
    .find(a=>(a.canonicalName||a.name)===d.enemyName);
  assert.ok(a,d.key);
  return {...a,universe:d.universe,id:a.id||d.enemyId||d.key,
    stats:a.stats||{hp:a.hp||300,atk:a.atk||15,def:a.def||5,spd:a.spd||8}};
}
test('every explicitly covered identity uses its source name, reach and contact count on both camps',async t=>{
  assert.equal(melee.FIGHTER_MELEE_SIGNATURE_KEYS.length,39);
  for(const key of melee.FIGHTER_MELEE_SIGNATURE_KEYS)for(const side of ['player','cpu'])await t.test(`${side}: ${key}`,()=>{
    const d=kits[key],{e,a,b,source}=fixture(sourceFor(d),side),before=JSON.stringify(source);
    assert.equal(melee.getFighterMeleeDefinition(a),d);
    assert.equal(a.special.name,d.name);assert.equal(e.getSnapshot()[side].superName,d.name);
    b.x=a.x+d.range+1;assert.equal(e.canUseSuper(side),false);assert.equal(e.tryAction(side,'super'),false);assert.equal(a.meter,100);
    b.x=a.x+60;a.attackPower=18;b.defensePower=10;
    assert.equal(e.tryAction(side,'super'),true);assert.equal(a.meter,0);assert.equal(e.tryAction(side,'super'),false);
    const hp=b.currentHp;e.updateActions(0.44);assert.equal(b.currentHp,hp);advance(e);
    assert.equal(e.stats[side].maxCombo,d.hits);assert.ok(Math.abs(e.stats[side].damage-37.8)<1e-8);
    assert.ok(Math.abs(hp-b.currentHp-37.8)<1e-8);assert.equal(a.action,null);
    assert.equal(JSON.stringify(source),before);assert.doesNotThrow(()=>JSON.stringify(e.teams));
    e.dispose();
  });
});
for(const side of ['player','cpu']){
  test(`${side}: launch direction is committed and a crossing target is not tracked`,()=>{
    const {e,b}=fixture('squall_ff8',side);e.tryAction(side,'super');b.x=290;const hp=b.currentHp;
    advance(e);assert.equal(b.currentHp,hp);assert.equal(e.stats[side].damage,0);
  });
  test(`${side}: height and invulnerability are tested for each contact`,()=>{
    for(const escape of ['height','invulnerability']){
      const {e,a,b}=fixture('squall_ff8',side);e.tryAction(side,'super');e.updateActions(0.46);const hp=b.currentHp;
      if(escape==='height')b.y=a.y-150;else b.invulnerable=10;
      advance(e);assert.equal(b.currentHp,hp);assert.equal(e.stats[side].maxCombo,1);
    }
  });
  test(`${side}: low attack minimum and guard reduction are shared over the full super, not per hit`,()=>{
    for(const guarded of [false,true]){
      const {e,a,b}=fixture('cloud_ff7',side);a.attackPower=.01;b.guarding=guarded;b.facing=-1;
      e.tryAction(side,'super');advance(e);
      assert.ok(Math.abs(e.stats[side].damage-(guarded?.6:3))<1e-8);
      if(guarded)assert.ok(Math.abs(b.guard-58)<1e-8);
    }
  });
  test(`${side}: intermediate hits do not eject their target; the final hit launches`,()=>{
    const {e,b}=fixture('squall_ff8',side);e.tryAction(side,'super');e.updateActions(.46);
    assert.equal(b.vx,0);assert.equal(b.vy,0);advance(e);assert.ok(Math.abs(b.vx)>0);assert.ok(b.vy<0);
  });
  test(`${side}: target tag removes pending hits without giving them to a reserve`,()=>{
    const {e,b}=fixture('cloud_ff7',side);e.tryAction(side,'super');const other=side==='player'?'cpu':'player';
    assert.equal(e.requestTag(other,1),true);const replacement=e.getActive(other);replacement.invulnerable=0;replacement.x=410;
    const hp=replacement.currentHp;advance(e);assert.equal(replacement.currentHp,hp);assert.equal(b.currentHp,10000);
  });
  test(`${side}: tagging out and back does not restore a pending target ticket`,()=>{
    const {e,b}=fixture('cloud_ff7',side);e.tryAction(side,'super');const other=side==='player'?'cpu':'player';
    assert.equal(e.requestTag(other,1),true);e.getTeam(other).tagCooldown=0;
    assert.equal(e.requestTag(other,0),true);b.invulnerable=0;b.x=410;const hp=b.currentHp;
    advance(e);assert.equal(b.currentHp,hp);
  });
  test(`${side}: native target KO then immediate restoration cannot inherit the old sequence`,()=>{
    const {e,a,b}=fixture('cloud_ff7',side);e.tryAction(side,'super');
    e.applyHit(a,b,{type:'heavy',base:1e7,knockback:0,guardDamage:0});assert.equal(b.currentHp,0);
    Object.assign(b,{currentHp:1000,state:'idle',hitstun:0,koDelay:0});const damage=e.stats[side].damage;
    advance(e);assert.equal(b.currentHp,1000);assert.equal(e.stats[side].damage,damage);assert.equal(e.stats[side].kos,1);
  });
  for(const alteration of ['skill-object','skill-power','source','universe','continuity','custom-profile','target-source','target-side','replacement']){
    test(`${side}: ${alteration} invalidates a committed contact instead of replacing it`,()=>{
      const {e,a,b}=fixture('squall_ff8',side);e.tryAction(side,'super');const hp=b.currentHp;
      if(alteration==='skill-object')a.special={...a.special};
      if(alteration==='skill-power')a.special.dmg=100;
      if(alteration==='source')a.sourceId='someone-else';
      if(alteration==='universe')a.sourceUniverse='Other';
      if(alteration==='continuity')a.continuityScope='Other incarnation';
      if(alteration==='custom-profile')a.special.fighterProfile={effect:'damage'};
      if(alteration==='target-source')b.sourceId='someone-else';
      if(alteration==='target-side')b.side=side;
      if(alteration==='replacement')e.getTeam(b.side).fighters[0]={...b};
      advance(e);assert.equal(b.currentHp,hp);assert.equal(e.stats[side].damage,0);
    });
  }
  test(`${side}: pause and impact freeze preserve timing, interruption cannot revive a detached token`,()=>{
    const {e,a,b}=fixture('squall_ff8',side);e.tryAction(side,'super');e.updateActions(.2);
    const token=a.action.meleeSignature;e.setPaused(true);e.updateActions(1);assert.equal(a.action.elapsed,.2);
    e.setPaused(false);e.hitStop=.2;e.updateActions(1);assert.equal(a.action.elapsed,.2);e.hitStop=0;
    e.applyHit(b,a,{type:'light',base:5,knockback:0,guardDamage:0});assert.equal(a.action,null);
    const hp=b.currentHp;e.hitStop=0;e.fighterMelee.advance(token);advance(e);assert.equal(b.currentHp,hp);
  });
  test(`${side}: caster KO, completion and disposal discard all remaining contacts`,()=>{
    for(const event of ['ko','finish','dispose']){
      const {e,a,b}=fixture('cloud_ff7',side);e.tryAction(side,'super');const token=a.action.meleeSignature;
      if(event==='ko'){e.applyHit(b,a,{type:'heavy',base:1e7,knockback:0,guardDamage:0});Object.assign(a,{currentHp:1000,state:'idle',hitstun:0});}
      if(event==='finish')e.finish('victory');if(event==='dispose')e.dispose();
      const hp=b.currentHp;e.hitStop=0;e.fighterMelee.advance(token);advance(e);assert.equal(b.currentHp,hp);
    }
  });
  test(`${side}: prepared multi-hit super executes in the real update loop without relocating a victim`,()=>{
    const {e,a,b}=fixture('cloud_ff7',side);a.attackPower=18;b.defensePower=10;
    assert.equal(e.tryAction(side,'super'),true);for(let i=0;i<360;i++)e.update(1/60);
    assert.equal(e.stats[side].maxCombo,15);assert.ok(Math.abs(e.stats[side].damage-37.8)<1e-8);
  });
}
for(const field of ['meter','currentHp','x','y'])test(`invalid ${field} prevents commitment and resource expenditure`,()=>{
  for(const bad of [NaN,Infinity,'100']){
    const {e,a}=fixture('tifa_ff7');a[field]=bad;
    assert.equal(e.tryAction('player','super'),false);assert.equal(a.action,null);
  }
});
test('custom profiles, unsupported universes, noncombatants and summons are not converted; direct fire stays ranged',()=>{
  for(const patch of [{id:'Other'},{universe:'Other'},{nonCombat:true},{combatEligible:false},
    {fighterAttacks:{super:{effect:'damage'}}},{special:{name:'Custom',dmg:1}},
    {special:{...heroes.find(h=>h.id==='tifa_ff7').special,fighterProfile:{effect:'damage'}}}]){
    const {a}=fixture({...heroes.find(h=>h.id==='tifa_ff7'),...patch});assert.equal(melee.getFighterMeleeDefinition(a),null);
    assert.equal(a.special?.sourceSignatureKey,undefined);
  }
  const {a: ranged}=fixture('goku_dbz');
  assert.equal(melee.getFighterContactDefinition(ranged).delivery,'ranged');
  for(const id of ['aerith_ff7','team_fortress_2_medic','lightning_ff13','city_hunter']){
    const {a}=fixture(id);assert.equal(melee.getFighterMeleeDefinition(a),null);
  }
});
test('damage splitting conserves tenths even for low damage and rejects malformed contact metadata',()=>{
  for(const total of [1,2,3,8,15,32])for(const amount of [.6,3,12.34,37.8,1000]){
    const sum=Array.from({length:total},(_,index)=>melee.splitFighterMeleeDamage(amount,{total,index})).reduce((a,b)=>a+b,0);
    assert.ok(Math.abs(sum-Math.round(amount*10)/10)<1e-8);
  }
  for(const contact of [null,{}, {total:0,index:0},{total:'15',index:0},{total:Infinity,index:0},{total:4,index:4}]){
    assert.equal(melee.splitFighterMeleeDamage(37.8,contact),37.8);
  }
});
for(const close of [true,false])test(`CPU ${close?'uses its valid contact sequence':'does not spend a contact super across the arena'}`,()=>{
  const {e,a,b}=fixture('tifa_ff7','cpu');if(!close)b.x=800;e.aiThink=0;const random=Math.random;
  try{Math.random=()=>0;e.updateAi(1/60);}finally{Math.random=random;}
  if(close)assert.equal(a.action?.type,'super');else assert.notEqual(a.action?.type,'super');
});
for(const lang of ['fr','en'])test(`${lang}: codex distinguishes Fighter contacts without claiming new signatures or artwork`,()=>{
  const source=structuredClone(heroes.find(h=>h.id==='cloud_ff7'));const before=JSON.stringify(source);
  const text=codex.getSignatureSummary(codex.getSignatureCodex(source),lang);
  assert.match(text,/Fighter/);assert.match(text,/15/);assert.match(text,lang==='fr'?/réservistes/:/reserves/);
  assert.match(text,lang==='fr'?/non certifiées/:/not certified/);assert.equal(JSON.stringify(source),before);
  const ranged=codex.getSignatureSummary(codex.getSignatureCodex(heroes.find(h=>h.id==='goku_dbz')),lang);
  assert.match(ranged,/Fighter/);assert.match(ranged,lang==='fr'?/à distance/:/ranged/);
  assert.doesNotMatch(ranged,lang==='fr'?/à courte portée/:/close-range/);
});
