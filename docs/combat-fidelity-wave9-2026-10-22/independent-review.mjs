import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

// Independent adversarial fixtures: run production projections and real RPG
// acceptance, without substituting hit, shield, target or damage decisions.
const root = fileURLToPath(new URL('../../', import.meta.url));
const reportPath = new URL('./independent-review.json', import.meta.url);
const ids = ['marcus','dom','cole','baird','hoffman_cog','shepard','garrus','liara','tali','wrex','motoko','batou','togusa','aramaki','saito_gits','chris_redfield','claire_redfield','ada_wong','barry_burton','carlos_oliveira'];
const offensive = ids.filter(id => !['baird','hoffman_cog','wrex','aramaki'].includes(id));
const callers = ['marcus','shepard','motoko','chris_redfield'];
const checks = [], observations = [], pending = [], engines = [];
const noop = () => {};
const read = path => readFile(new URL('../../' + path, import.meta.url));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
async function check(name, run) {
  try { const result = await run(); checks.push({ name, status: 'passed', ...result }); }
  catch(error) { checks.push({ name, status: 'failed', message: error.message, stack: error.stack?.split('\n').slice(0,6), actual: error.actual, expected: error.expected }); }
}
function recorder() {
  const calls = [], stack = []; let props = { globalAlpha: 0.7, lineWidth: 3, strokeStyle: '#123456', fillStyle: '#654321' }; const initial = {...props};
  const ctx = new Proxy({}, {get(_,key) {
    if (key in props) return props[key];
    if (key === 'save') return () => {stack.push({...props}); calls.push(['save']);};
    if (key === 'restore') return () => {assert.ok(stack.length); props=stack.pop(); calls.push(['restore']);};
    if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => ({addColorStop:noop});
    return (...args) => {args.filter(n => typeof n === 'number').forEach(n => assert.ok(Number.isFinite(n), String(key))); calls.push([String(key),...args]);};
  }, set(_,key,value) {if(typeof value === 'number') assert.ok(Number.isFinite(value),String(key)); props[key]=value; return true;}});
  return {ctx,calls,balanced() {assert.equal(stack.length,0);assert.deepEqual(props,initial);}};
}
const vite = await createServer({root,appType:'custom',logLevel:'silent',server:{middlewareMode:true}});
let sources;
try {
  const {HEROES_DB} = await vite.ssrLoadModule('/src/game/heroes.js');
  const {EngineRpg} = await vite.ssrLoadModule('/src/game/engineRpg.js');
  const {EngineFighter} = await vite.ssrLoadModule('/src/game/engineFighter.js');
  const {resolveMeleeSuper,resolveUniverseSummon} = await vite.ssrLoadModule('/src/game/combatIdentity.js');
  const {getCharacterAnimationFrame:getFrame,resolveCharacterAnimationAsset:resolveCharacterAsset} = await vite.ssrLoadModule('/src/game/combat/characterAnimationCatalog.js');
  const {getCharacterSuperVisualState:getState,drawCharacterSuperVisuals:drawState} = await vite.ssrLoadModule('/src/game/combat/characterSuperVisuals.js');
  const {projectNativeSuperAnchorWave9:projectAnchor} = await vite.ssrLoadModule('/src/game/combat/nativeSuperVisualsWave9.js');
  const {getSummonChoreographyState:getChoreography,drawSummonChoreographyEffects:drawChoreography} = await vite.ssrLoadModule('/src/game/combat/summonChoreography.js');
  const {getSummonAnimationFrame:getSummonFrame,resolveSummonAnimationAsset:resolveSummonAsset} = await vite.ssrLoadModule('/src/game/combat/summonAnimationCatalog.js');
  const {projectNativeSummonEffectOriginWave9:projectSummon,drawRosterSummonCueWave9:drawCue} = await vite.ssrLoadModule('/src/game/combat/rosterSummonChoreographyWave9.js');
  const hero = id => {const found=HEROES_DB.find(h=>h.id===id);assert.ok(found,id);return found;};
  const dummy = id => ({id,name:id,universe:'Independent Wave9 fixtures',weaponType:'melee',primaryColor:'#abcdef',secondaryColor:'#fedcba',stats:{hp:10000,atk:10,def:10,spd:1},simple:{name:'Fixture strike',type:'melee',dmg:1},secondary:{name:'Fixture shot',type:'bullet',dmg:1},defense:{name:'Fixture guard',type:'shield',reduce:.4,dur:1},special:{name:'Fixture finish',type:'bullet',dmg:1}});
  function make(id,side='player') {
    const own=[hero(id),dummy('allied-observer')],others=[dummy('target-a'),dummy('target-b'),dummy('target-c')];
    const players=side==='player'?own:others,enemies=side==='enemy'?own:others;
    const engine=new EngineRpg(1040,520,players,{monsters:enemies,bosses:[],customRoster:enemies},{add:noop},noop,noop,{universe:'Nexus de Convergence',disableHazards:true,customBattle:{singleRoster:true,opponentControl:'p2'}});
    engine.autoBattle=false;engine.enemyGlobalRecovery=1e6;engines.push(engine);
    [...engine.heroes,...engine.enemies].forEach(a=>{a.currentHp=a.maxHp=10000;a.atb=-1e6;a.specialCharge=100;a.state='idle';a.vx=a.vy=0;});
    const allies=side==='player'?engine.heroes:engine.enemies,targets=side==='player'?engine.enemies:engine.heroes,actor=allies[0];
    actor.atb=100;actor.facing=side==='player'?1:-1;actor.x=side==='player'?300:740;actor.y=350;targets.forEach((t,i)=>{t.x=actor.x+actor.facing*(60+i*20);t.y=350;});
    return {engine,actor,allies,targets,side};
  }
  function special(c) {
    assert.equal(c.engine.beginTargeting(c.actor,'special',c.side),true,JSON.stringify({id:c.actor.sourceHeroId||c.actor.id,side:c.side,can:c.engine.canUseAction(c.actor,'special',c.side),eligible:c.engine.getActionContext(c.actor,'special',c.side).eligibleTargets.map(t=>t.battleId),actor:{x:c.actor.x,y:c.actor.y},targets:c.targets.map(t=>({x:t.x,y:t.y}))}));
    const targeting=c.engine.getTargetingState();
    if(targeting?.shape==='single'&&targeting.profile.targetSide==='enemy')assert.equal(c.engine.selectTarget(c.targets[0].battleId),true);
    const selected=[...(c.engine.getTargetingState()?.previewTargetIds||[])];
    assert.equal(c.engine.confirmTargeting(),true);return c.targets.filter(t=>selected.includes(t.battleId));
  }
  const advance = (engine,ticks) => {for(let i=0;i<ticks;i++)engine.update();};
  const impactSpecial = c => advance(c.engine,c.engine.actionQueue[0].ticks+1);
  function startSummon(c) {assert.equal(c.engine.summon(c.actor,c.side),true);assert.equal(c.engine.confirmTargeting(),true);assert.ok(c.engine.activeSummon);return c.engine.activeSummon;}
  const toImpact = (engine,scene) => {while(scene.tick<scene.impactTick)engine.advanceSummon();};
  function summonEffects(c,scene) {
    const state=getChoreography(scene,c.engine),asset=resolveSummonAsset(scene.descriptor),frame=getSummonFrame(scene,state),projected=projectSummon(state,asset,frame),record=recorder();
    drawChoreography(record.ctx,projected,'behind');drawChoreography(record.ctx,projected,'front');record.balanced();
    return {state:projected,calls:record.calls,ellipses:record.calls.filter(call=>call[0]==='ellipse')};
  }
  const anchors = Object.assign({},...await Promise.all(['A','B','C','D'].map(async part=>JSON.parse(await read(`src/game/combat/nativeSuperAnchorsWave9Part${part}.generated.json`)))));

  await check('20 exact identities, confirmed target projection, denial and render purity',()=>{
    let assertions=0;
    for(const id of ids)for(const facing of [-1,1])for(const height of [45,112]){
      const actor={...hero(id),x:430,y:370,currentHp:1000},profile=resolveMeleeSuper(actor),supportive=profile.effect!=='damage';
      const action={elapsed:profile.hitAt+.05,duration:profile.duration,hitAt:profile.hitAt,facing},target={x:430+facing*80,y:370,currentHp:1000};
      const options={actor,profile,action,target,height,contactVisual:{confirmed:false}},before=JSON.stringify(options),state=getState(options);
      assert.equal(state.family,'native-wave9');assert.equal(state.contactEligible,false);assert.equal(state.source1to1Verified,false);
      const a=recorder();drawState(a.ctx,state);a.balanced();assert.equal(a.calls.filter(c=>c[0]==='ellipse').length,supportive&&id!=='wrex'?1:0);
      const accepted=getState({...options,target:{x:9999,y:-9999,currentHp:0},contactVisual:{confirmed:true,x:511,y:367}});
      assert.deepEqual(accepted.target,supportive?state.ground:{x:511,y:367});
      const b=recorder();drawState(b.ctx,accepted);b.balanced();
      assert.equal(JSON.stringify(options),before);assert.equal(getState({...options,actor:{...actor,universe:'Wrong'}}),null);
      assert.equal(getState({...options,profile:{...profile,name:'Wrong action'}}),null);assertions++;
    }
    return {fixtures:assertions};
  });

  await check('available native column anchors match packed dimensions, per-row renderScale and P2 reflection',()=>{
    let checked=0,missing=[];
    for(const id of ids){const actor=hero(id),asset=resolveCharacterAsset(actor),table=anchors[id];
      if(!asset||!table){if(offensive.includes(id))missing.push(id);continue;}
      for(const phase of ['super','fatality'])for(let col=0;col<4;col++)for(const facing of [-1,1])for(const height of [51,142]){
        const point=table[phase]?.[col];if(point===null||point===undefined)continue;
        assert.ok(Number.isFinite(point.x)&&Number.isFinite(point.y),`${id}.${phase}[${col}] must be {x,y}; received ${JSON.stringify(point)}`);
        const view={...actor,x:511,y:344,presentationPhase:phase,presentationFrame:{col},action:{facing}},frame=getFrame(view,{phase,progress:.5,impactProgress:.41});
        const scale=Math.max(.1,Math.min(5,Number(asset.normalization.rows[frame.row].renderScale)||1));
        const projected=projectAnchor(view,.5,.41,height),factor=height/asset.frameHeight*scale;
        assert.ok(projected);assert.equal(projected.col,col);assert.equal(projected.renderScale,scale);
        assert.ok(Math.abs(projected.x-(511+(point.x-asset.frameWidth/2)*factor*facing))<1e-9);
        assert.ok(Math.abs(projected.y-(344+(point.y-asset.normalization.baseline)*factor))<1e-9);checked++;
      }
    }
    if(missing.length)pending.push({kind:'native-anchor-art-not-registered',identities:missing});
    assert.deepEqual(missing,[],'All16 offensive W9 identities must have registered native atlas and measured anchors');
    return {projections:checked,pendingIdentities:missing};
  });

  await check('external orbital columns never originate from the carried designator',()=>{
    for(const id of ['marcus','chris_redfield'])for(const facing of [-1,1]){
      const actor={...hero(id),x:200,y:370},profile=resolveMeleeSuper(actor),height=82;
      const state=getState({actor,profile,action:{elapsed:profile.hitAt+.04,duration:profile.duration,hitAt:profile.hitAt,facing},target:{x:200+facing*150,y:370},height,contactVisual:{confirmed:true,x:200+facing*150,y:370}});
      const r=recorder();drawState(r.ctx,state);r.balanced();const start=r.calls.find(c=>c[0]==='moveTo'),end=r.calls.find(c=>c[0]==='lineTo');
      assert.equal(start[1],end[1]);assert.ok(start[2]<actor.y-height*3);assert.equal(end[1],state.target.x);assert.notEqual(start[1],actor.x);
    }return {columns:4};
  });

  await check('ordinary RPG flight stops at the impact and cannot restart after confirmed or denied contact',()=>{
    let checked=0,unavailable=[];
    for(const id of offensive.filter(id=>!['marcus','chris_redfield','liara'].includes(id)))for(const facing of [-1,1]){
      const actor={...hero(id),x:400,y:350},profile=resolveMeleeSuper(actor),impact=profile.hitAt;
      const action={elapsed:impact*.85,duration:profile.duration,hitAt:impact,facing},target={x:400+facing*200,y:350};
      const state=getState({actor,profile,action,target,height:90,contactVisual:{confirmed:false}});
      const before=recorder();drawState(before.ctx,state);before.balanced();
      if(state.nativeMuzzleActive)assert.ok(before.calls.some(call=>call[0]==='lineTo'),id);else unavailable.push(id);
      for(const elapsed of [impact,impact+.05,profile.duration*.95])for(const confirmed of [false,true]){
        const after=getState({actor,profile,action:{...action,elapsed},target,height:90,contactVisual:confirmed?{confirmed:true,x:target.x,y:target.y}:{confirmed:false}}),r=recorder();
        drawState(r.ctx,after);r.balanced();assert.equal(r.calls.filter(call=>call[0]==='lineTo').length,0,`${id}: post-impact flight`);checked++;
      }
    }return {postImpactProjections:checked,preImpactAnchorUnavailable:[...new Set(unavailable)]};
  });

  await check('real RPG Wrex guards only himself, and Tali Attack Drone damages one selected enemy',()=>{
    for(const side of ['player','enemy'])for(const id of ['wrex','tali']){
      const c=make(id,side),profile=resolveMeleeSuper(c.actor),before=c.targets.map(t=>t.currentHp);special(c);impactSpecial(c);
      if(id==='wrex'){assert.equal(profile.targetSide,'self');assert.equal(profile.shape,'single');assert.ok(c.actor.rpgGuardTicks>0);assert.ok(!c.allies[1].rpgGuardTicks);assert.deepEqual(c.targets.map(t=>t.currentHp),before);}
      else {assert.equal(profile.targetSide,'enemy');assert.equal(profile.shape,'single');assert.equal(profile.maxTargets,1);assert.equal(c.targets.filter((t,i)=>t.currentHp<before[i]).length,1);assert.equal(c.targets[0].currentHp<before[0],true);}
      observations.push({case:'personal support/single drone',id,side,targetSide:profile.targetSide,shape:profile.shape});
    }return {realActions:4};
  });

  await check('real RPG special acceptance: shields and dead selections cannot confirm, accepted points remain fixed after move/KO',()=>{
    let fixtures=0;
    for(const id of offensive)for(const side of ['player','enemy'])for(const reason of ['shield','dead','accepted']){
      const c=make(id,side),chosen=special(c);assert.ok(chosen.length);
      if(reason==='shield')chosen.forEach(t=>{t.battleItemShield=1e9;});if(reason==='dead')chosen.forEach(t=>{t.currentHp=0;});
      const before=c.targets.map(t=>t.currentHp);impactSpecial(c);const visual=c.actor.rpgSpecialVisual;
      if(reason==='accepted'){
        assert.equal(visual.visualConfirmedContact?.confirmed,true,id);const frozen={...visual.visualConfirmedContact};
        chosen.forEach(t=>{t.x+=251;t.y-=70;t.currentHp=0;});const r=recorder();c.engine.drawRpgCharacterSuperEffects(r.ctx);r.balanced();assert.deepEqual(visual.visualConfirmedContact,frozen);
        assert.ok(r.calls.some(call=>call[0]==='ellipse'&&Math.abs(call[1]-frozen.x)<1e-9),id);
      } else {assert.deepEqual(c.targets.map(t=>t.currentHp),before);assert.equal(visual?.visualConfirmedContact,undefined,id);const r=recorder();c.engine.drawRpgCharacterSuperEffects(r.ctx);r.balanced();assert.equal(r.calls.filter(call=>call[0]==='ellipse').length,0,id);}
      fixtures++;
    }return {realActions:fixtures};
  });

  await check('real Fighter launches from native muzzles, preserves direction after crossing, suppresses recovery and denied-hit flashes',()=>{
    let fixtures=0,anchored=0;
    for(const id of offensive.filter(id=>resolveMeleeSuper(hero(id)).delivery==='projectile'))for(const side of ['player','cpu']){
      const own=[hero(id)],others=[dummy('fighter-target')],engine=new EngineFighter(1600,520,side==='player'?own:others,side==='cpu'?own:others,{add:noop},noop,noop,{opponentControl:'p2'});
      engines.push(engine);engine.countdown=0;const actor=engine.getActive(side),target=engine.getOpponent(side),facing=side==='player'?1:-1;
      actor.x=facing>0?300:1300;actor.y=target.y=engine.groundY;target.x=actor.x+facing*400;actor.facing=facing;actor.currentHp=actor.maxHp=target.currentHp=target.maxHp=10000;actor.meter=100;actor.state=target.state='idle';
      assert.equal(engine.triggerSideAction(side,'super'),true,id);const action=actor.action;engine.updateActions(action.hitAt*.5);assert.equal(engine.projectiles.length,0);
      engine.updateActions(action.hitAt-action.elapsed+1e-7);assert.equal(engine.projectiles.length,1,id);const shot=engine.projectiles[0],state=getState({actor,profile:action.identity,action,target,height:142});
      if(state.nativeMuzzleActive){assert.equal(shot.x,state.origin.x);assert.equal(shot.y,state.origin.y);anchored++;}
      assert.equal(Math.sign(shot.vx),facing);assert.ok(Math.abs(shot.life*520+(shot.x-actor.x)*facing-action.range)<1e-8);
      actor.x+=facing*500;actor.facing=-facing;target.invulnerable=100;const hp=target.currentHp,r=recorder();engine.drawProjectile(r.ctx,shot);r.balanced();
      assert.ok(r.calls.some(c=>c[0]==='moveTo'&&Math.abs(c[1]-(shot.x-facing*6*142/72))<1e-8&&c[2]===shot.y));
      const frozen=JSON.stringify(shot);for(let i=0;i<8;i++)engine.updateProjectiles(0);assert.equal(JSON.stringify(shot),frozen);
      actor.action.elapsed=actor.action.duration*.99;const recovery=recorder();engine.drawPersonalSuper(recovery.ctx,actor);recovery.balanced();assert.equal(recovery.calls.filter(c=>c[0]==='ellipse').length,0,id);
      for(let i=0;i<180&&engine.projectiles.length;i++)engine.updateProjectiles(1/60);assert.equal(target.currentHp,hp);assert.equal(engine.projectileVisualImpacts.length,0);fixtures++;
    }return {realProjectiles:fixtures,nativeMuzzleChecks:anchored};
  });

  await check('four real RPG reinforcements: protected targets produce no accepted contact rings',()=>{
    const failures=[];
    for(const id of callers)for(const side of ['player','enemy']){
      const c=make(id,side),scene=startSummon(c);scene.targets.forEach(t=>{t.battleItemShield=1e9;});const before=scene.targets.map(t=>t.currentHp);
      toImpact(c.engine,scene);assert.deepEqual(scene.targets.map(t=>t.currentHp),before);const effects=summonEffects(c,scene);
      observations.push({case:'reinforcement fully shielded',id,side,acceptedHpDeltas:scene.targets.map((t,i)=>t.currentHp-before[i]),contactRings:effects.ellipses.length});
      if(effects.ellipses.length)failures.push({id,side,contactRings:effects.ellipses.length});
    }
    assert.deepEqual(failures,[],'Protected reinforcement targets must not receive accepted-hit rings');return {realActions:8};
  });

  await check('four real RPG reinforcements: accepted contacts freeze before target movement/KO',()=>{
    const failures=[];
    for(const id of callers)for(const side of ['player','enemy']){
      const c=make(id,side),scene=startSummon(c),before=scene.targets.map(t=>t.currentHp);toImpact(c.engine,scene);
      assert.ok(scene.targets.some((t,i)=>t.currentHp<before[i]));const first=summonEffects(c,scene),snapshot=first.ellipses;
      scene.targets.forEach(t=>{t.x+=211;t.y-=73;t.currentHp=0;});const next=summonEffects(c,scene);
      if(JSON.stringify(snapshot)!==JSON.stringify(next.ellipses))failures.push({id,side,before:snapshot,after:next.ellipses});
    }
    assert.deepEqual(failures,[],'A reinforcement contact ring must stay at the accepted impact point');return {realActions:8};
  });

  await check('four reinforcements only acknowledge actual mixed-target HP drops, without replacing dead or removed identities',()=>{
    let fixtures=0;
    for(const id of callers)for(const side of ['player','enemy'])for(const reason of ['shield-first','dead-first','removed-first']){
      const c=make(id,side),scene=startSummon(c),first=scene.targets[0],chosen=[...scene.targets];
      if(reason==='shield-first')first.battleItemShield=1e9;
      if(reason==='dead-first')first.currentHp=0;
      if(reason==='removed-first'){const team=side==='player'?c.engine.enemies:c.engine.heroes;team.splice(team.indexOf(first),1);}
      const before=chosen.map(t=>t.currentHp),points=chosen.map(t=>({x:t.x,y:t.y}));toImpact(c.engine,scene);const effects=summonEffects(c,scene);
      const accepted=chosen.map((t,i)=>t.currentHp<before[i]?points[i]:null).filter(Boolean);
      assert.equal(effects.ellipses.length,accepted.length,`${id}:${reason}`);
      assert.deepEqual(effects.ellipses.map(e=>({x:e[1],y:e[2]})),accepted.map(p=>({x:p.x,y:p.y-c.engine.height*.095})));
      assert.equal(chosen[0].currentHp,before[0],'The invalid first target cannot be replaced by a new hit');fixtures++;
    }return {realActions:fixtures};
  });

  await check('eleven historical native summons retain full metadata, PNG bytes and the original live-target scene contract',async()=>{
    const baseline=JSON.parse(await read('docs/combat-fidelity-wave9-2026-10-22/runtime-baseline.json')).summonAssets;
    assert.equal(baseline.length,11);let fixtures=0;
    for(const asset of baseline){
      const caller=HEROES_DB.find(h=>{const d=resolveUniverseSummon(h);return d&&[d.universe,d.entityName,d.action?.name].join('::')===asset.key;});assert.ok(caller,asset.id);
      assert.equal(hash(await read('public'+asset.sheet)),asset.sha256);
      for(const side of ['player','enemy']){
        const c=make(caller.id,side);[...c.allies,...c.targets].forEach(t=>{t.currentHp=t.maxHp*.5;});const scene=startSummon(c);
        assert.deepEqual(resolveSummonAsset(scene.descriptor),asset);assert.equal(Object.hasOwn(scene,'visualContacts'),false,asset.id);
        const time=scene.impactTick+1,sceneAt={...scene,tick:time,impacted:true},state=getChoreography(sceneAt,c.engine);scene.targets[0].x+=41;
        const moved=getChoreography(sceneAt,c.engine);assert.equal(moved.targets[0].x-state.targets[0].x,41,'The new W9 frozen-contact rule must not alter historical live geometry');fixtures++;
      }
    }return {historicalAssets:baseline.length,realSceneContracts:fixtures};
  });

  await check('four reinforcement travels use the packed muzzle, end at impact and remain pure under P2 rotation',()=>{
    let projections=0;
    for(const id of callers)for(const side of ['player','enemy']){
      const c=make(id,side),scene=startSummon(c),asset=resolveSummonAsset(scene.descriptor);
      for(const tick of [scene.impactTick-7,scene.impactTick,scene.impactTick+1,scene.impactTick+12]){
        scene.tick=tick;const state=getChoreography(scene,c.engine),frame=getSummonFrame(scene,state),anchor=asset.effectAnchors[frame.phase]?.[frame.col],projected=projectSummon(state,asset,frame),before=JSON.stringify({state,asset,frame});
        if(anchor){const factor=state.performer.size/asset.frameHeight,dx=(anchor.x-asset.frameWidth/2)*factor*state.performer.facing,dy=(anchor.y-asset.normalization.baseline)*factor,angle=state.performer.rotation||0;
          assert.ok(Math.abs(projected.origin.x-(state.performer.x+dx*Math.cos(angle)-dy*Math.sin(angle)))<1e-9);assert.ok(Math.abs(projected.origin.y-(state.performer.y+dx*Math.sin(angle)+dy*Math.cos(angle)))<1e-9);}
        for(const visual of projected.visuals){const r=recorder();drawCue(r.ctx,projected,visual);if(tick>=scene.impactTick)assert.equal(r.calls.filter(call=>call[0]==='lineTo').length,0,'Reinforcement cannot launch after impact');}
        assert.equal(JSON.stringify({state,asset,frame}),before);projections++;
      }
    }return {projections};
  });
  sources = await Promise.all(['src/game/combat/nativeSuperVisualsWave9.js','src/game/combat/characterSuperVisuals.js','src/game/combat/rosterSummonChoreographyWave9.js','src/game/engineRpg.js','src/game/engineFighter.js','src/game/combat/characterAnimationCatalog.js','src/game/combat/summonChoreography.js','src/game/combat/summonAnimationsWave9.generated.json',...['A','B','C','D'].map(part=>`src/game/combat/nativeSuperAnchorsWave9Part${part}.generated.json`)].map(async path=>({path,sha256:hash(await read(path))})));
} finally {engines.forEach(e=>e.dispose());await vite.close();}
const report={date:'2026-10-22',method:'Independent production Vite SSR projections and real EngineRpg targeting, shield/damage acceptance, simulation queues and summon impacts. No gameplay method is stubbed. Canvas recorder inspects actual drawing commands; this does not claim source pixel fidelity or browser coverage.',source1to1Verified:false,checks,observations,pending,sources,summary:{passed:checks.filter(c=>c.status==='passed').length,failed:checks.filter(c=>c.status==='failed').length}};
await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({summary:report.summary,failures:checks.filter(c=>c.status==='failed'),pending},null,2));
process.exitCode=report.summary.failed?1:0;
