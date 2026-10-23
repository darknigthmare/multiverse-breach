import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import sharp from 'sharp';
import { COMBAT_SOURCE_DEFINITIONS_WAVE11 as definitions } from '../../src/game/combat/combatSourceDefinitionsWave11.js';

// Independent adversarial fixtures: run production projections and real RPG
// acceptance, without substituting hit, shield, target or damage decisions.
const root = fileURLToPath(new URL('../../', import.meta.url));
const reportPath = new URL(process.argv.includes('--summons-only') ? './independent-review-summons-preflight.json' : './independent-review.json', import.meta.url);
// These twelve images were actually opened for independent visual review before freeze.
const reviewedSummonVisuals = [
  {
    "path": "docs/combat-fidelity-wave11-2026-10-23/summon-spike-contact.png",
    "sha256": "fb1073f7e3a368af4f729ffd2b89bff4226a07d9f46d07a51562f1490013d0b6"
  },
  {
    "path": "docs/combat-fidelity-wave11-2026-10-23/summon-ronon-contact.png",
    "sha256": "3d57aea73c3f5e15b3668047b2cb227eb3243be65dde723dbd5955bb65b4d075"
  },
  {
    "path": "docs/combat-fidelity-wave11-2026-10-23/summon-greer-contact.png",
    "sha256": "094bd34ce2e98ce58b85bd45156ac272c77191e20bccbd570803f5e0349c5f55"
  },
  {
    "path": "docs/combat-fidelity-wave11-2026-10-23/summon-roland-contact.png",
    "sha256": "72d7919aca4ea553c6b5e2e14f1873aa9cb1316cf5b4168e2954979da8072fca"
  },
  {
    "path": "docs/combat-fidelity-wave11-2026-10-23/summon-furiosa-contact.png",
    "sha256": "26aa211fb9f9876345b2c98eef909fec2c765aa00049e5af9854172dfd7afba9"
  },
  {
    "path": "docs/combat-fidelity-wave11-2026-10-23/summon-korben-contact.png",
    "sha256": "6b5f5fd80137e1417c586e38b452bf4c1ce94bf33430a3319be909391baccb3b"
  },
  {
    "path": "docs/combat-fidelity-wave11-2026-10-23/summon-lancelot-contact.png",
    "sha256": "9398c36186e785937bc19b4d77038c1fa9d11191e27537ad2fd455017d79a173"
  },
  {
    "path": "docs/combat-fidelity-wave11-2026-10-23/summon-ronon-anchor-review.png",
    "sha256": "3ebb56e3f0569ad50ec40f384f58aa115e326517b3c3d0f6ec6e2c183c73a72b"
  },
  {
    "path": "docs/combat-fidelity-wave11-2026-10-23/summon-greer-anchor-review.png",
    "sha256": "0ba9fade2c57758be0036d4bb51d4f3a29a0ec0f6203f74a76fd5bf8ca3cc522"
  },
  {
    "path": "docs/combat-fidelity-wave11-2026-10-23/summon-roland-anchor-review.png",
    "sha256": "b4a8dd892410ea4a1c774ecca57733ec33b22deddd76748b5a5900dd0519cc1c"
  },
  {
    "path": "docs/combat-fidelity-wave11-2026-10-23/summon-furiosa-anchor-review.png",
    "sha256": "bfed9176d01f3b746cf3a7a7f2e1e2beb44b14afc12b2e457c9231e6cb0e8a8f"
  },
  {
    "path": "docs/combat-fidelity-wave11-2026-10-23/summon-korben-anchor-review.png",
    "sha256": "de3aa24e29d7cc0f36519fc3c66d8db733564c6044d63ea8f8abfa5534d9c448"
  }
];
const ids = Object.keys(definitions), offensive = ids.filter(id => definitions[id].effect === 'damage');
const supports = ids.filter(id => definitions[id].effect !== 'damage');
const ranged = offensive.filter(id => ['projectile','beam'].includes(definitions[id].delivery));
const callers = ['buffy_summers','sheppard_sga','rush_sgu','lilith_borderlands','max','leeloo','arthur_kaamelott'];
const supportCallers = ['harry_potter'];
const blockedNative = new Set(['harry_potter','hermione_granger','snape']);
assert.ok(process.argv.includes('--after-production-freeze'),'Wait for root production freeze before executing this review');
const summonOnly = process.argv.includes('--summons-only');
const checks = [], observations = [], pending = [], engines = [];
const noop = () => {};
const read = path => readFile(new URL('../../' + path, import.meta.url));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const guardedRuntimePaths=['src/game/spriteAssets.js','src/game/engineRpg.js','src/game/engineFighter.js','src/game/combatIdentity.js','src/game/combat/characterSuperVisuals.js','src/game/combat/nativeSuperVisualsWave11.js','src/game/combat/rosterSummonChoreographyWave11.js'];
const runtimeBefore=Object.fromEntries(await Promise.all(guardedRuntimePaths.map(async path=>[path,hash(await read(path))])));
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
  for(const proof of reviewedSummonVisuals)assert.equal(hash(await read(proof.path)),proof.sha256,proof.path+': the actually reviewed image changed');
  const {HEROES_DB} = await vite.ssrLoadModule('/src/game/heroes.js');
  const {EngineRpg} = await vite.ssrLoadModule('/src/game/engineRpg.js');
  const {EngineFighter} = await vite.ssrLoadModule('/src/game/engineFighter.js');
  const {resolveMeleeSuper,resolveUniverseSummon,resolveCombatAbility} = await vite.ssrLoadModule('/src/game/combatIdentity.js');
  const {getHeroSpriteSheetSrc,getSpriteSheetLayout,getSpriteStateResolution} = await vite.ssrLoadModule('/src/game/spriteAssets.js');
  const {getCharacterAnimationFrame:getFrame,resolveCharacterAnimationAsset:resolveCharacterAsset} = await vite.ssrLoadModule('/src/game/combat/characterAnimationCatalog.js');
  const {getCharacterSuperVisualState:getState,drawCharacterSuperVisuals:drawState} = await vite.ssrLoadModule('/src/game/combat/characterSuperVisuals.js');
  const projectAnchor = summonOnly ? null : (await vite.ssrLoadModule('/src/game/combat/nativeSuperVisualsWave11.js')).projectNativeSuperAnchorWave11;
  const {SUMMON_CHOREOGRAPHIES,getSummonChoreographyState:getChoreography,drawSummonChoreographyEffects:drawChoreography} = await vite.ssrLoadModule('/src/game/combat/summonChoreography.js');
  const {getSummonAnimationFrame:getSummonFrame,resolveSummonAnimationAsset:resolveSummonAsset} = await vite.ssrLoadModule('/src/game/combat/summonAnimationCatalog.js');
  const {projectNativeSummonEffectOriginWave11:projectSummon,drawRosterSummonCueWave11:drawCue} = await vite.ssrLoadModule('/src/game/combat/rosterSummonChoreographyWave11.js');
  const blockedSources=JSON.parse(await read('docs/combat-fidelity-wave11-2026-10-23/blocked-reference-before.json'));
  const hero = id => {const found=HEROES_DB.find(h=>h.id===id);assert.ok(found,id);return found;};
  const dummy = id => ({id,name:id,universe:'Independent Wave11 fixtures',weaponType:'melee',primaryColor:'#abcdef',secondaryColor:'#fedcba',stats:{hp:10000,atk:10,def:10,spd:1},simple:{name:'Fixture strike',type:'melee',dmg:1},secondary:{name:'Fixture shot',type:'bullet',dmg:1},defense:{name:'Fixture guard',type:'shield',reduce:.4,dur:1},special:{name:'Fixture finish',type:'bullet',dmg:1}});
  function make(id,side='player') {
    const own=[hero(id),dummy('allied-observer')],others=[dummy('target-a'),dummy('target-b'),dummy('target-c')];
    const players=side==='player'?own:others,enemies=side==='enemy'?own:others;
    const particleEvents=[];
    const engine=new EngineRpg(1040,520,players,{monsters:enemies,bosses:[],customRoster:enemies},{add:(...args)=>particleEvents.push(args)},noop,noop,{universe:'Nexus de Convergence',disableHazards:true,customBattle:{singleRoster:true,opponentControl:'p2'}});
    engine.autoBattle=false;engine.enemyGlobalRecovery=1e6;engines.push(engine);
    [...engine.heroes,...engine.enemies].forEach(a=>{a.currentHp=a.maxHp=10000;a.atb=-1e6;a.specialCharge=100;a.state='idle';a.vx=a.vy=0;});
    const allies=side==='player'?engine.heroes:engine.enemies,targets=side==='player'?engine.enemies:engine.heroes,actor=allies[0];
    actor.atb=100;actor.facing=side==='player'?1:-1;actor.x=side==='player'?300:740;actor.y=350;targets.forEach((t,i)=>{t.x=actor.x+actor.facing*(60+i*20);t.y=350;});
    return {engine,actor,allies,targets,side,particleEvents};
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
  const anchors = summonOnly ? {} : Object.assign({},...await Promise.all(['A','B','C','D'].map(async part=>JSON.parse(await read(`src/game/combat/nativeSuperAnchorsWave11Part${part}.generated.json`)))));

  if (!summonOnly) {
  await check('40 exact identities, confirmed target projection, denial and render purity',()=>{
    let assertions=0;
    for(const id of ids)for(const facing of [-1,1])for(const height of [45,112]){
      const actor={...hero(id),x:430,y:370,currentHp:1000},profile=resolveMeleeSuper(actor),supportive=profile.effect!=='damage';
      const action={elapsed:profile.hitAt+.05,duration:profile.duration,hitAt:profile.hitAt,facing},target={x:430+facing*80,y:370,currentHp:1000};
      const options={actor,profile,action,target,height,contactVisual:{confirmed:false}},before=JSON.stringify(options),state=getState(options);
      assert.equal(state.family,'native-wave11');assert.equal(state.contactEligible,false);assert.equal(state.source1to1Verified,false);
      const a=recorder();drawState(a.ctx,state);a.balanced();assert.equal(a.calls.filter(c=>c[0]==='ellipse').length,supportive?1:0);
      const accepted=getState({...options,target:{x:9999,y:-9999,currentHp:0},contactVisual:{confirmed:true,x:511,y:367}});
      assert.deepEqual(accepted.target,supportive?state.ground:{x:511,y:367});
      const b=recorder();drawState(b.ctx,accepted);b.balanced();
      assert.equal(JSON.stringify(options),before);assert.equal(getState({...options,actor:{...actor,universe:'Wrong'}}),null);
      assert.equal(getState({...options,profile:{...profile,name:'Wrong action'}}),null);assertions++;
    }
    let blockedCloneProjections=0;
    for(const id of blockedNative)for(const sourceField of ['sourceHeroId','sourceId']){
      const actor={...hero(id),id:'p2-independent-clone-'+id,[sourceField]:id,state:'support'};
      assert.equal(getHeroSpriteSheetSrc(actor,'combat'),blockedSources.find(e=>e.id===id).sheet);
      assert.equal(resolveCharacterAsset(actor),null,'Existing blocked sprite is never a dedicated32');
      assert.notEqual(getHeroSpriteSheetSrc({...actor,universe:'Wrong universe'},'combat'),blockedSources.find(e=>e.id===id).sheet);
      blockedCloneProjections++;
    }
    return {fixtures:assertions,blockedCloneProjections};
  });

  await check('available native column anchors are visible source pixels and match packed dimensions, per-row renderScale and P2 reflection',async()=>{
    let checked=0,sourcePixels=0,missing=[];
    for(const id of ids){const actor=hero(id),asset=resolveCharacterAsset(actor),table=anchors[id];
      if(blockedNative.has(id)){assert.equal(asset,null,id+': blocked image must not count as native');continue;}
      if(!asset||!table){if(ranged.includes(id))missing.push(id);continue;}
      const decoded=await sharp(await read('public'+asset.sheet)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
      if(ranged.includes(id))for(const phase of ['super','fatality']){
        // An overhead, non-firing staff in startup has no emitting point.
        // The actual impact column must have its measured physical aperture.
        assert.ok(Number.isFinite(table[phase]?.[2]?.x)&&Number.isFinite(table[phase]?.[2]?.y),`${id}.${phase}[2] missing measured aperture`);
        assert.equal(table[phase]?.[3],null,`${id}.${phase}[3] lowered weapon must not emit`);
      }
      for(const phase of ['super','fatality'])for(let col=0;col<4;col++)for(const facing of [-1,1])for(const height of [51,142]){
        const point=table[phase]?.[col];if(point===null||point===undefined)continue;
        assert.ok(Number.isFinite(point.x)&&Number.isFinite(point.y),`${id}.${phase}[${col}] must be {x,y}; received ${JSON.stringify(point)}`);
        const view={...actor,x:511,y:344,presentationPhase:phase,presentationFrame:{col},action:{facing}},frame=getFrame(view,{phase,progress:.5,impactProgress:.41});
        assert.ok(Number.isInteger(point.x)&&Number.isInteger(point.y)&&point.x>=0&&point.x<asset.frameWidth&&point.y>=0&&point.y<asset.frameHeight,`${id}.${phase}[${col}] must be a real cell pixel`);
        const pixel=((frame.row*asset.frameHeight+point.y)*decoded.info.width+col*asset.frameWidth+point.x)*4;
        assert.ok(decoded.data[pixel+3]>24,`${id}.${phase}[${col}] anchor center alpha=${decoded.data[pixel+3]} is outside the visible source`);
        if(facing===-1&&height===51)sourcePixels++;
        const scale=Math.max(.1,Math.min(5,Number(asset.normalization.rows[frame.row].renderScale)||1));
        const projected=projectAnchor(view,.5,.41,height),factor=height/asset.frameHeight*scale;
        assert.ok(projected);assert.equal(projected.col,col);assert.equal(projected.renderScale,scale);
        assert.ok(Math.abs(projected.x-(511+(point.x-asset.frameWidth/2)*factor*facing))<1e-9);
        assert.ok(Math.abs(projected.y-(344+(point.y-asset.normalization.baseline)*factor))<1e-9);checked++;
      }
    }
    if(missing.length)pending.push({kind:'native-anchor-art-not-registered',identities:missing});
    assert.deepEqual(missing,[],'All12 native ranged W11 identities must have registered atlas and measured anchors; Harry is an explicit historical fallback');
    return {projections:checked,visibleSourcePixels:sourcePixels,pendingIdentities:missing};
  });

  await check('ordinary RPG flight stops at the impact and cannot restart after confirmed or denied contact',()=>{
    let checked=0,unavailable=[];
    for(const id of offensive.filter(id=>definitions[id].delivery==='projectile'))for(const facing of [-1,1]){
      const actor={...hero(id),x:400,y:350},profile=resolveMeleeSuper(actor),impact=profile.hitAt;
      const action={elapsed:impact*.85,duration:profile.duration,hitAt:impact,facing},target={x:400+facing*200,y:350};
      const state=getState({actor,profile,action,target,height:90,contactVisual:{confirmed:false}});
      const before=recorder();drawState(before.ctx,state);before.balanced();
      if(state.nativeMuzzleActive)assert.ok(before.calls.some(call=>call[0]===('lineTo')),id);else unavailable.push(id);
      for(const elapsed of [impact,impact+.05,profile.duration*.95])for(const confirmed of [false,true]){
        const after=getState({actor,profile,action:{...action,elapsed},target,height:90,contactVisual:confirmed?{confirmed:true,x:target.x,y:target.y}:{confirmed:false}}),r=recorder();
        drawState(r.ctx,after);r.balanced();assert.equal(r.calls.filter(call=>call[0]==='lineTo').length,0,`${id}: post-impact flight`);
        assert.equal(r.calls.filter(call=>call[0]==='ellipse').length,confirmed?1:0,`${id}: post-impact energy cannot masquerade as denied contact`);checked++;
      }
    }return {postImpactProjections:checked,preImpactAnchorUnavailable:[...new Set(unavailable)]};
  });

  await check('melee and area supers acknowledge accepted contacts without fictitious projectile travel',()=>{
    let fixtures=0;
    for(const id of offensive.filter(id=>definitions[id].delivery!=='projectile'))for(const facing of [-1,1]){
      const actor={...hero(id),x:450,y:350},profile=resolveMeleeSuper(actor),target={x:450+facing*70,y:350};
      const options={actor,profile,target,height:90,action:{elapsed:profile.hitAt*.9,duration:profile.duration,hitAt:profile.hitAt,facing},contactVisual:{confirmed:false}};
      const before=recorder();drawState(before.ctx,getState(options));before.balanced();assert.equal(before.calls.filter(c=>c[0]==='lineTo').length,0,id);
      const accepted=getState({...options,action:{...options.action,elapsed:profile.hitAt+.04},contactVisual:{confirmed:true,...target}}),r=recorder();drawState(r.ctx,accepted);r.balanced();
      assert.equal(r.calls.filter(c=>c[0]==='lineTo').length,0,id);assert.equal(r.calls.filter(c=>c[0]==='ellipse').length,1,id);fixtures++;
    }return {projections:fixtures};
  });

  await check('seventeen real RPG support actions preserve every enemy HP and apply only their declared ally effect',()=>{
    let fixtures=0,basicBeneficialActions=0;
    for(const side of ['player','enemy'])for(const id of supports){
      const c=make(id,side),profile=resolveMeleeSuper(c.actor);c.allies.forEach(a=>{a.currentHp=a.maxHp*.45;});const before=c.targets.map(t=>t.currentHp),beforeAllies=c.allies.map(a=>a.currentHp);special(c);impactSpecial(c);
      assert.equal(profile.effect,definitions[id].effect,id);assert.equal(profile.delivery,'support');
      assert.deepEqual(c.targets.map(t=>t.currentHp),before,id);assert.deepEqual(c.allies.map(a=>a.currentHp),beforeAllies,id+': guard/buff must not invent healing');
      const receiving=profile.effect==='guard'?c.allies.filter(a=>a.rpgGuardTicks>0):c.allies.filter(a=>a.rpgBuffTicks>0);
      assert.ok(receiving.length,id);if(profile.targetSide==='self')assert.deepEqual(receiving,[c.actor]);
      const r=recorder();c.engine.drawRpgCharacterSuperEffects(r.ctx);r.balanced();
      assert.equal(r.calls.filter(call=>call[0]==='lineTo').length,0,id);
      assert.equal(c.particleEvents.filter(event=>event.includes('laser_line')).length,0,id+': support super must not emit a generic laser particle');
      observations.push({case:'support',id,side,effect:profile.effect,targetSide:profile.targetSide,receiving:receiving.map(a=>a.sourceHeroId||a.id)});fixtures++;
    }
    for(const id of ids)for(const side of ['player','enemy'])for(const slot of ['simple','secondary']){
      const profile=resolveCombatAbility(hero(id),slot);if(profile.effect==='damage')continue;
      const c=make(id,side),before=c.targets.map(t=>t.currentHp),beforeAllies=c.allies.map(t=>t.currentHp);
      const actualEmit=c.engine.emitTargetedProjectile;
      let targetedProjectileCalls=0;
      c.engine.emitTargetedProjectile=function(...args){targetedProjectileCalls++;return actualEmit.apply(this,args);};
      assert.equal(c.engine.beginTargeting(c.actor,slot,c.side),true,id+'/'+slot);assert.equal(c.engine.confirmTargeting(),true);
      assert.equal(c.actor.state,'support',id+'/'+slot+': beneficial basic action must not enter attack state');
      const layout=getSpriteSheetLayout(getHeroSpriteSheetSrc(c.actor,'combat')),binding=getSpriteStateResolution('support',layout);
      if(offensive.includes(id)){
        assert.equal(binding.row,0,id+'/'+slot+': reused calm idle, no offensive row2');
        assert.equal(binding.dedicated,false,id+'/'+slot+': reused idle must not count as dedicated support art');
      }
      advance(c.engine,c.engine.actionQueue[0].ticks+1);assert.deepEqual(c.targets.map(t=>t.currentHp),before);assert.deepEqual(c.allies.map(t=>t.currentHp),beforeAllies);
      assert.equal(targetedProjectileCalls,0,id+'/'+slot+': a beneficial basic must not call the real projectile emitter');
      assert.equal(c.particleEvents.filter(event=>event.includes('laser_line')).length,0,id+'/'+slot+': no targeted laser-line particle');
      basicBeneficialActions++;
    }
    return {realActions:fixtures,basicBeneficialActions};
  });

  await check('real RPG special acceptance: shields and dead selections cannot confirm, accepted points remain fixed after move/KO',()=>{
    let fixtures=0;
    for(const id of offensive)for(const side of ['player','enemy'])for(const reason of ['shield','dead','removed','accepted']){
      const c=make(id,side),chosen=special(c);assert.ok(chosen.length);
      if(reason==='shield')chosen.forEach(t=>{t.battleItemShield=1e9;});if(reason==='dead')chosen.forEach(t=>{t.currentHp=0;});if(reason==='removed'){const team=c.side==='player'?c.engine.enemies:c.engine.heroes;chosen.forEach(t=>team.splice(team.indexOf(t),1));}
      const before=c.targets.map(t=>t.currentHp),chosenHp=chosen.map(t=>t.currentHp);impactSpecial(c);const visual=c.actor.rpgSpecialVisual;
      if(reason==='accepted'){
        assert.equal(visual.visualConfirmedContact?.confirmed,true,id);const frozen={...visual.visualConfirmedContact};
        chosen.forEach(t=>{t.x+=251;t.y-=70;t.currentHp=0;});const r=recorder();c.engine.drawRpgCharacterSuperEffects(r.ctx);r.balanced();assert.deepEqual(visual.visualConfirmedContact,frozen);
        assert.ok(r.calls.some(call=>call[0]==='ellipse'&&Math.abs(call[1]-frozen.x)<1e-9),id);
      } else {assert.deepEqual(c.targets.map(t=>t.currentHp),before);assert.deepEqual(chosen.map(t=>t.currentHp),chosenHp,'A removed or invalid selected identity must never be replaced');assert.equal(visual?.visualConfirmedContact,undefined,id);const r=recorder();c.engine.drawRpgCharacterSuperEffects(r.ctx);r.balanced();assert.equal(r.calls.filter(call=>call[0]==='ellipse').length,0,id);}
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
      else{assert.equal(id,'harry_potter');assert.equal(shot.x,actor.x+58*facing);assert.equal(shot.y,actor.y-64);}
      assert.equal(Math.sign(shot.vx),facing);assert.ok(Math.abs(shot.life*520+(shot.x-actor.x)*facing-action.range)<1e-8);
      actor.x+=facing*500;actor.facing=-facing;target.invulnerable=100;const hp=target.currentHp,r=recorder();engine.drawProjectile(r.ctx,shot);r.balanced();
      assert.ok(r.calls.some(c=>c[0]==='moveTo'&&Math.abs(c[1]-(shot.x-facing*6*142/72))<1e-8&&c[2]===shot.y),id);
      const frozen=JSON.stringify(shot);for(let i=0;i<8;i++)engine.updateProjectiles(0);assert.equal(JSON.stringify(shot),frozen);
      actor.action.elapsed=actor.action.duration*.99;const recovery=recorder();engine.drawPersonalSuper(recovery.ctx,actor);recovery.balanced();assert.equal(recovery.calls.filter(c=>c[0]==='ellipse').length,0,id);
      for(let i=0;i<180&&engine.projectiles.length;i++)engine.updateProjectiles(1/60);assert.equal(target.currentHp,hp);assert.equal(engine.projectileVisualImpacts.length,0);fixtures++;
    }assert.equal(fixtures,26);assert.equal(anchored,24);return {realProjectiles:fixtures,nativeMuzzleChecks:anchored,historicalStarts:fixtures-anchored};
  });

  }

  await check('seven real RPG reinforcements: protected targets produce no accepted contact rings',()=>{
    const failures=[];
    for(const id of callers)for(const side of ['player','enemy']){
      const c=make(id,side),scene=startSummon(c);scene.targets.forEach(t=>{t.battleItemShield=1e9;});const before=scene.targets.map(t=>t.currentHp);
      toImpact(c.engine,scene);assert.deepEqual(scene.targets.map(t=>t.currentHp),before);const effects=summonEffects(c,scene);
      observations.push({case:'reinforcement fully shielded',id,side,acceptedHpDeltas:scene.targets.map((t,i)=>t.currentHp-before[i]),contactRings:effects.ellipses.length});
      if(effects.ellipses.length)failures.push({id,side,contactRings:effects.ellipses.length});
    }
    assert.deepEqual(failures,[],'Protected reinforcement targets must not receive accepted-hit rings');return {realActions:callers.length*2};
  });

  await check('seven real RPG reinforcements: accepted contacts freeze before target movement/KO',()=>{
    const failures=[];
    for(const id of callers)for(const side of ['player','enemy']){
      const c=make(id,side),scene=startSummon(c),before=scene.targets.map(t=>t.currentHp);toImpact(c.engine,scene);
      assert.ok(scene.targets.some((t,i)=>t.currentHp<before[i]));const first=summonEffects(c,scene),snapshot=first.ellipses;
      scene.targets.forEach(t=>{t.x+=211;t.y-=73;t.currentHp=0;});const next=summonEffects(c,scene);
      if(JSON.stringify(snapshot)!==JSON.stringify(next.ellipses))failures.push({id,side,before:snapshot,after:next.ellipses});
    }
    assert.deepEqual(failures,[],'A reinforcement contact ring must stay at the accepted impact point');return {realActions:callers.length*2};
  });

  await check('seven reinforcements only acknowledge actual mixed-target HP drops, without replacing dead or removed identities',()=>{
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

  await check('twenty-three historical native summons preserve complete metadata, PNG bytes and their existing scene contracts',async()=>{
    const baseline=JSON.parse(await read('docs/combat-fidelity-wave11-2026-10-23/runtime-baseline.json')).summonAssets;
    const {projectNativeSummonEffectOriginWave10:historicalProject}=await vite.ssrLoadModule('/src/game/combat/rosterSummonChoreographyWave10.js');
    const contactIds=new Set(['gears-dom','mass-effect-garrus','ghost-in-the-shell-batou','resident-evil-leon','matrix-trinity','stargate-tealc','half-life-alyx','fallout-nick','aliens-hicks','payday-chains']);
    assert.equal(baseline.length,23);let fixtures=0;
    for(const asset of baseline){
      const caller=HEROES_DB.find(h=>{const d=resolveUniverseSummon(h);return d&&[d.universe,d.entityName,d.action?.name].join('::')===asset.key;});assert.ok(caller,asset.id);
      assert.equal(hash(await read('public'+asset.sheet)),asset.sha256);
      for(const side of ['player','enemy']){
        const c=make(caller.id,side);[...c.allies,...c.targets].forEach(t=>{t.currentHp=t.maxHp*.5;});const scene=startSummon(c);
        assert.deepEqual(resolveSummonAsset(scene.descriptor),asset);assert.equal(Object.hasOwn(scene,'visualContacts'),contactIds.has(asset.id),asset.id);
        toImpact(c.engine,scene);const state=getChoreography(scene,c.engine),frame=getSummonFrame(scene,state);
        assert.deepEqual(projectSummon(state,asset,frame),historicalProject(state,asset,frame),'The W11 origin wrapper must preserve all historical W10 projections');
        const oldTargets=JSON.parse(JSON.stringify(state.targets));scene.targets[0].x+=41;
        const moved=getChoreography(scene,c.engine);
        if(contactIds.has(asset.id))assert.deepEqual(moved.targets,oldTargets,'The ten W9/W10 contact snapshots must remain frozen');
        else assert.equal(moved.targets[0].x-state.targets[0].x,41,'The thirteen earlier or supportive scenes retain their historical live geometry');fixtures++;
      }
    }return {historicalAssets:baseline.length,realSceneContracts:fixtures};
  });

  await check('seventy-two historical entity callers keep their exact binding; ten selected callers explicitly change partner',async()=>{
    const frozen=JSON.parse(await read('docs/combat-fidelity-wave11-2026-10-23/baseline.json'));
    const bytes=await read('src/game/combat/entityAssets.generated.json');assert.equal(hash(bytes),frozen.inputHashes['src/game/combat/entityAssets.generated.json']);
    const registry=JSON.parse(bytes).entries;
    for(const asset of registry)assert.equal(hash(await read('public'+asset.sheet)),asset.sha256,asset.id);
    const changed=new Set(['freeman','barney','alyx_vance','eli_vance','kleiner','dallas','wolf_pd','hoxton','chains_pd','clover_pd']);
    let preserved=0,replaced=0;
    for(const entry of registry)for(const id of entry.callers){
      const descriptor=resolveUniverseSummon(hero(id));assert.ok(descriptor,id);
      if(changed.has(id)){assert.equal(descriptor.performerRole,'reinforcement');assert.ok(descriptor.performer?.id!==id);assert.equal(descriptor.provenance.partnerSelection,'wave10-explicit-source-version');replaced++;}
      else{assert.equal([descriptor.universe,descriptor.entityName,descriptor.action.name].join('::'),entry.key,id);assert.equal(descriptor.entityRender.asset.id,entry.id,id);preserved++;}
    }
    assert.equal(preserved,72);assert.equal(replaced,10);
    const shephard=HEROES_DB.find(h=>h.id==='shephard'||/Shephard/i.test(h.name));assert.ok(shephard,'Historical Adrian Shephard roster identity');
    const descriptor=resolveUniverseSummon(shephard);assert.match(descriptor.action.name,/Dog/i);assert.equal(descriptor.entityRender.asset.id,'half-life-dog');
    return {historicalBindings:preserved,intentionalReplacements:replaced,historicalLegacyPngs:registry.length,shephardId:shephard.id};
  });

  await check('twenty-eight historical choreographies preserve their exact source definitions and sampled geometry',async()=>{
    const frozen=JSON.parse(await read('docs/combat-fidelity-wave11-2026-10-23/baseline.json')).entities.entries;
    let projections=0;
    for(const entry of frozen){
      const spec=SUMMON_CHOREOGRAPHIES[entry.key];assert.ok(spec,entry.key);assert.equal(spec.path,entry.path);assert.equal(spec.sourceReference,entry.sourceReference);
      const scene={actor:{id:'caller',x:140,y:330},targets:[{id:'target',x:600,y:330}],choreography:spec,side:'player',durationTicks:192,impactTick:99};
      const samples=entry.sampledGeometry.map(sample=>getChoreography({...scene,tick:sample.tick},{width:760,height:420}));
      // Compare exactly in the archived JSON representation (JSON stores -0 as0).
      assert.deepEqual(JSON.parse(JSON.stringify(samples.map(sample=>({tick:sample.tick,...sample.performer})))),entry.sampledGeometry,entry.key);
      assert.deepEqual([...new Set(samples.map(sample=>sample.poseIndex))],entry.poseIndices);
      assert.deepEqual([...new Set(samples.flatMap(sample=>sample.visuals.map(visual=>visual.kind)))],entry.effectKinds);
      projections+=samples.length;
    }
    assert.equal(frozen.length,28);return {historicalChoreographies:frozen.length,projections};
  });

  await check('Hermione legacy support never damages, heals or draws an offensive bolt and acknowledges the actual partner',()=>{
    let fixtures=0;
    for(const id of supportCallers)for(const side of ['player','enemy']){
      const c=make(id,side),before=c.targets.map(t=>t.currentHp),scene=startSummon(c);
      assert.equal(scene.profile.effect,'guard');assert.equal(Object.hasOwn(scene,'visualContacts'),false);
      assert.equal(c.actor.atb,0);assert.equal(c.actor.specialCharge,0);
      toImpact(c.engine,scene);assert.deepEqual(c.targets.map(t=>t.currentHp),before);assert.ok(c.allies.some(t=>t.rpgGuardTicks>0));
      const effect=summonEffects(c,scene);assert.equal(effect.calls.filter(call=>call[0]==='lineTo').length,0);assert.equal(effect.ellipses.length,1);
      assert.equal(effect.ellipses[0][1],effect.state.performer.x);assert.equal(effect.ellipses[0][2],effect.state.performer.y-2);
      const hp=c.targets.map(t=>t.currentHp),tick=scene.tick;c.engine.setPaused(true);for(let n=0;n<120;n++)c.engine.update();assert.equal(scene.tick,tick);assert.deepEqual(c.targets.map(t=>t.currentHp),hp);c.engine.setPaused(false);
      c.engine.dispose();for(let n=0;n<120;n++)c.engine.update();assert.deepEqual(c.targets.map(t=>t.currentHp),hp);fixtures++;
    }return {realActions:fixtures};
  });

  await check('eight reinforcement commands preserve cancellation, unique cost, pause and caller interruption without late impact',()=>{
    let fixtures=0;
    for(const id of [...callers,...supportCallers])for(const side of ['player','enemy'])for(const reason of ['dead-caller','removed-caller','dispose']){
      const c=make(id,side);assert.equal(c.engine.summon(c.actor,side),true);assert.equal(c.actor.atb,100);assert.equal(c.actor.specialCharge,100);
      assert.equal(c.engine.cancelTargeting(),true);assert.equal(c.actor.atb,100);assert.equal(c.actor.specialCharge,100);assert.equal(c.engine.activeSummon,null);
      const scene=startSummon(c);assert.equal(c.actor.atb,0);assert.equal(c.actor.specialCharge,0);assert.equal(c.actor.summonUsed,true);assert.equal(c.engine.summon(c.actor,side),false);
      const before=c.targets.map(t=>t.currentHp),tick=scene.tick;c.engine.setPaused(true);for(let n=0;n<10;n++)c.engine.update();assert.equal(scene.tick,tick);assert.deepEqual(c.targets.map(t=>t.currentHp),before);c.engine.setPaused(false);
      if(reason==='dead-caller')c.actor.currentHp=0;
      if(reason==='removed-caller'){const team=side==='player'?c.engine.heroes:c.engine.enemies;team.splice(team.indexOf(c.actor),1);}
      if(reason==='dispose')c.engine.dispose();
      for(let n=0;n<scene.durationTicks+10;n++)c.engine.advanceSummon();
      assert.equal(c.engine.activeSummon,null);assert.equal(scene.impacted,false);assert.deepEqual(c.targets.map(t=>t.currentHp),before);
      assert.ok(c.allies.every(t=>!t.rpgBuffTicks&&!t.rpgGuardTicks));assert.equal(c.actor.specialCharge,0);fixtures++;
    }return {realInterruptedCommands:fixtures};
  });

  await check('eight reinforcement travels use the packed muzzle, end at impact and remain pure under P2 rotation',()=>{
    let projections=0;
    for(const id of [...callers,...supportCallers])for(const side of ['player','enemy']){
      const c=make(id,side),scene=startSummon(c),asset=resolveSummonAsset(scene.descriptor);
      for(const tick of [scene.impactTick-7,scene.impactTick,scene.impactTick+1,scene.impactTick+12]){
        scene.tick=tick;const state=getChoreography(scene,c.engine),frame=getSummonFrame(scene,state),anchor=asset?.effectAnchors?.[frame?.phase]?.[frame?.col],projected=projectSummon(state,asset,frame),before=JSON.stringify({state,asset,frame});
        if(anchor){const factor=state.performer.size/asset.frameHeight,dx=(anchor.x-asset.frameWidth/2)*factor*state.performer.facing,dy=(anchor.y-asset.normalization.baseline)*factor,angle=state.performer.rotation||0;
          assert.ok(Math.abs(projected.origin.x-(state.performer.x+dx*Math.cos(angle)-dy*Math.sin(angle)))<1e-9);assert.ok(Math.abs(projected.origin.y-(state.performer.y+dx*Math.sin(angle)+dy*Math.cos(angle)))<1e-9);}
        for(const visual of projected.visuals){const r=recorder();drawCue(r.ctx,projected,visual);if(tick>=scene.impactTick)assert.equal(r.calls.filter(call=>call[0]==='lineTo').length,0,'Reinforcement cannot launch after impact');}
        assert.equal(JSON.stringify({state,asset,frame}),before);projections++;
      }
    }return {projections};
  });
  sources = await Promise.all([...guardedRuntimePaths,...reviewedSummonVisuals.map(p=>p.path),'src/game/combat/nativeSuperVisualsWave11.js','src/game/combat/characterSuperVisuals.js','src/game/combat/rosterSummonChoreographyWave11.js','src/game/engineRpg.js','src/game/engineFighter.js','src/game/combatIdentity.js','src/game/combat/combatSourceDefinitionsWave11.js','src/game/combat/rosterReinforcementsWave11.js','src/game/combat/characterAnimationCatalog.js','src/game/combat/summonChoreography.js','src/game/combat/summonAnimationsWave11.generated.json','src/game/combat/entityAssets.generated.json','docs/combat-fidelity-wave11-2026-10-23/independent-review.mjs','docs/combat-fidelity-wave11-2026-10-23/runtime-baseline.json',...(!summonOnly?['A','B','C','D'].flatMap(part=>[`src/game/combat/nativeSuperAnchorsWave11Part${part}.generated.json`,`src/game/combat/characterAnimationsWave11Part${part}.generated.json`]):[])].map(async path=>({path,sha256:hash(await read(path))})));
  for(const path of guardedRuntimePaths)assert.equal(hash(await read(path)),runtimeBefore[path],path+': production changed during review');
} finally {engines.forEach(e=>e.dispose());await vite.close();}
const report={date:'2026-10-23',runtimeSourceHashesBefore:runtimeBefore,visualReview:{reviewed:reviewedSummonVisuals,adaptationOnly:true,source1to1Verified:false,observations:'Seven sixteen-cell contact sheets and five barrel-anchor sheets actually viewed: complete bodies, continuous selected clothing, no procedural body or vehicle; five measured apertures lie on barrel tips / flash roots. Roland source halo border exception is documented, not repainted; final packed margin is checked by its builder. This does not certify source footage or anatomical identity.'},method:'Independent production Vite SSR projections and real EngineRpg targeting, shield/damage acceptance, simulation queues and summon impacts. No gameplay method is stubbed. Canvas recorder inspects actual drawing commands; this does not claim source pixel fidelity or browser coverage.',source1to1Verified:false,checks,observations,pending,sources,scope:{identities:ids.length,offensive:offensive.length,supports:supports.length,ranged:ranged.length,reinforcements:callers.length+supportCallers.length,summonsOnlyPreflight:summonOnly},summary:{passed:checks.filter(c=>c.status==='passed').length,failed:checks.filter(c=>c.status==='failed').length}};
await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({summary:report.summary,failures:checks.filter(c=>c.status==='failed'),pending},null,2));
process.exitCode=report.summary.failed?1:0;
