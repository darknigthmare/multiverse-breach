import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
const startedAt=new Date().toISOString();
const harness='docs/combat-fidelity-wave15-2026-10-26/browser/native-super-runtime.browser.mjs';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const harnessSha256=hash(await fs.readFile(harness));
const require=createRequire(import.meta.url);
const {chromium}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const directory=path.resolve('docs/combat-fidelity-wave15-2026-10-26/browser');
await fs.mkdir(directory,{recursive:true});
const errors=[],failedRequests=[],consoleErrors=[];
const phase=process.env.W15_RUNTIME_PHASE||'preliminary';
assert.ok(['preliminary','final'].includes(phase),'W15_RUNTIME_PHASE must be preliminary or final');
let partial=false;
const outputPrefix=phase==='final'?'native-super':'native-super-preliminary';
const productionFreezePath='docs/combat-fidelity-wave15-2026-10-26/production-freeze.json';
let productionFreezeSha256=null;
if(phase==='final'){
  assert.equal(process.env.W15_PRODUCTION_FROZEN,'1','Final run requires root production-freeze signal');
  const bytes=await fs.readFile(productionFreezePath),freeze=JSON.parse(bytes);
  assert.equal(freeze.productionFrozen,true);assert.ok(Date.parse(freeze.createdAt)<=Date.parse(startedAt),'Harness started before the declared freeze');
  productionFreezeSha256=hash(bytes);
}
const frozenPlan=JSON.parse(await fs.readFile('docs/combat-fidelity-wave15-2026-10-26/batch-plan-before.json'));
const {COMBAT_SOURCE_DEFINITIONS_WAVE15}=await import('../../../src/game/combat/combatSourceDefinitionsWave15.js');
const plan={...frozenPlan,heroes:frozenPlan.heroes.map(entry=>({...entry,source:COMBAT_SOURCE_DEFINITIONS_WAVE15[entry.hero.id]}))};
const failureReportPaths=[],refused=[],refusalFiles=[];
for(const part of ['a','b','c']){
  const file=`docs/combat-fidelity-wave15-2026-10-26/part-${part}/request-failures.json`;
  let report;try{report=JSON.parse(await fs.readFile(file));}catch(error){if(error.code==='ENOENT')continue;throw error;}
  failureReportPaths.push(file);
  for(const failure of report.failures||[]){
    for(const record of failure.receipts||[failure]){
      const bytes=await fs.readFile(record.receipt),receipt=JSON.parse(bytes);
      assert.equal(receipt.code,'moderation_blocked');assert.equal(receipt.imageReturned,false);
      assert.equal(receipt.requestId,record.requestId);assert.equal(receipt.failed,true);
      if(record.receiptSha256)assert.equal(hash(bytes),record.receiptSha256);
      refusalFiles.push(record.receipt);
    }
    refused.push({...failure,id:failure.heroId});
  }
}
assert.equal(new Set(refused.map(record=>record.id)).size,refused.length);
const registries=[];
for(const part of ['A','B','C'])for(const prefix of ['characterAnimations','characterSpriteCorrections']){
  const file=`src/game/combat/${prefix}Wave15Part${part}.generated.json`;
  try{registries.push({file,prefix,...JSON.parse(await fs.readFile(file))});}
  catch(error){if(phase!=='preliminary'||error.code!=='ENOENT')throw error;}
}
const allExpectedIds=plan.heroes.map(entry=>entry.hero.id),blockedIds=refused.map(entry=>entry.id);
assert.equal(allExpectedIds.length,120);assert.equal(new Set(allExpectedIds).size,120);
const expectedDelivered=allExpectedIds.filter(id=>!blockedIds.includes(id));
const actualDelivered=registries.filter(registry=>registry.prefix==='characterAnimations').flatMap(registry=>registry.entries).map(entry=>entry.heroId||entry.id);
const actualBases=registries.filter(registry=>registry.prefix==='characterSpriteCorrections').flatMap(registry=>registry.entries);
const unavailableIds=allExpectedIds.filter(id=>!actualDelivered.includes(id));
const pendingIds=unavailableIds.filter(id=>!blockedIds.includes(id));partial=pendingIds.length>0;
for(const prefix of ['characterAnimations','characterSpriteCorrections']){
  const entries=registries.filter(registry=>registry.prefix===prefix).flatMap(registry=>registry.entries),actual=entries.map(entry=>entry.heroId||entry.id);
  assert.equal(new Set(actual).size,actual.length,prefix+' duplicate identities');
  assert.ok(actual.every(id=>expectedDelivered.includes(id)),prefix+' published a refused or non-batch source');
  if(phase==='final')assert.deepEqual([...actual].sort(),[...expectedDelivered].sort(),prefix+': final delivery differs from frozen batch');
  for(const entry of entries){
    const bytes=await fs.readFile('public'+entry.sheet);assert.equal(hash(bytes),entry.sha256,entry.sheet+' manifest SHA');
    assert.equal(bytes.readUInt32BE(16),entry.width);assert.equal(bytes.readUInt32BE(20),entry.height);assert.ok([4,6].includes(bytes[25]));
    assert.equal(entry.frames,prefix==='characterAnimations'?32:16);
  }
}
const ids=allExpectedIds;
const expectedProjectileIds=plan.heroes.filter(entry=>entry.source.effect==='damage'&&entry.source.delivery==='projectile').map(entry=>entry.hero.id);
assert.equal(expectedProjectileIds.length,66);
const measuredAnchors=Object.assign({},...await Promise.all(['A','B','C'].map(async part=>JSON.parse(await fs.readFile(`src/game/combat/nativeSuperAnchorsWave15Part${part}.generated.json`)))));
const pendingProjectileAnchorIds=expectedProjectileIds.filter(id=>actualDelivered.includes(id)&&['super','fatality'].some(phase=>![1,2].every(col=>Number.isFinite(measuredAnchors[id]?.[phase]?.[col]?.x)&&Number.isFinite(measuredAnchors[id]?.[phase]?.[col]?.y))));
partial=partial||pendingProjectileAnchorIds.length>0;
if(phase==='final')assert.deepEqual(pendingProjectileAnchorIds,[],'Final runtime requires genuine aiming/release source points for each delivered projectile');
const expectedBeamIds=plan.heroes.filter(entry=>entry.source.effect==='damage'&&entry.source.delivery==='beam').map(entry=>entry.hero.id);
assert.deepEqual(expectedBeamIds,['evolve_markov']);
const pendingBeamAnchorIds=expectedBeamIds.filter(id=>actualDelivered.includes(id)&&['super','fatality'].some(phase=>![1,2].every(col=>Number.isFinite(measuredAnchors[id]?.[phase]?.[col]?.x)&&Number.isFinite(measuredAnchors[id]?.[phase]?.[col]?.y))));
partial=partial||pendingBeamAnchorIds.length>0;
if(phase==='final')assert.deepEqual(pendingBeamAnchorIds,[],'Final Markov beam requires its real measured weapon origin');
const projectileFamily=source=>source.weaponType==='bow'?'bow':['staff','wand','energy','emitter'].includes(source.weaponType)?'native-energy-emitter':/dispersion|blaster|fusion|pulse|shock|flak|f44aa/.test(source.kind)?'source-specific-pulse':/rocket/.test(source.kind)?'rocket':'ballistic';
const projectileFamilies=Object.fromEntries(['ballistic','bow','native-energy-emitter','source-specific-pulse','rocket'].map(family=>[family,plan.heroes.filter(entry=>expectedProjectileIds.includes(entry.hero.id)&&projectileFamily(entry.source)===family).map(entry=>entry.hero.id)]));
assert.equal(Object.values(projectileFamilies).flat().length,66);

const legacyReferences=[];
for(const id of unavailableIds){
  const frozen=plan.heroes.find(entry=>entry.hero.id===id),bytes=await fs.readFile('public'+frozen.referenceAsset);
  assert.equal(hash(bytes),frozen.referenceSha256,id+' historical body changed');
  legacyReferences.push({id,sheet:frozen.referenceAsset,sha256:frozen.referenceSha256,reason:blockedIds.includes(id)?'refused':'pending'});
}
// Track all gameplay source modules, not only the direct harness imports. Hash
// barriers on both sides of the closed browser exclude mixed production runs.
async function sourceFiles(directory){
  const children=await fs.readdir(directory,{withFileTypes:true});
  const nested=await Promise.all(children.map(child=>child.isDirectory()?sourceFiles(path.join(directory,child.name)):/\.(?:js|json)$/.test(child.name)?[path.join(directory,child.name)]:[]));
  return nested.flat();
}
const trackedFiles=[...new Set([
  ...await sourceFiles('src/game'),...(phase==='final'?[productionFreezePath]:[]),'src/components/GameCanvas.jsx','src/components/FighterMode.jsx',
  'docs/combat-fidelity-wave15-2026-10-26/batch-plan-before.json',...failureReportPaths,
  ...refusalFiles,...legacyReferences.map(entry=>'public'+entry.sheet),
  ...registries.flatMap(registry=>registry.entries.flatMap(entry=>['public'+entry.sheet,...(entry.sourceImages||[]).map(source=>source.path)]))
])].sort();
const inputHashes=()=>Promise.all(trackedFiles.map(async path=>({path,sha256:hash(await fs.readFile(path))})));
const initialInputHashes=await inputHashes();
let page;
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
  page=await browser.newPage({viewport:{width:1900,height:1100}});page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure()?.errorText}));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
  await page.goto(process.env.BROWSER_BASE_URL||'http://127.0.0.1:5188/',{waitUntil:'networkidle'});
  const result=await page.evaluate(async({unavailableIds,actualBases,legacyReferences,expectedIds,allExpectedIds,expectedProjectileIds})=>{
    window.__nativeRuntimeWave15Progress={authoritativeFixtures:0,tacticsFixtures:0,physicalProjectileCases:0};
    const must=(value,message)=>{if(!value)throw new Error(message);},equal=(a,b,message)=>must(JSON.stringify(a)===JSON.stringify(b),message);
    const gameSource=await(await fetch('/src/components/GameCanvas.jsx')).text(),fighterSource=await(await fetch('/src/components/FighterMode.jsx')).text();
    const dependency=(source,name)=>source.match(new RegExp('from "(/src/game/'+name+'\\.js[^\\"]*)"'))[1];
    const urls={rpg:dependency(gameSource,'engineRpg'),melee:dependency(gameSource,'engineSmash'),fighter:dependency(fighterSource,'engineFighter'),tactics:dependency(gameSource,'engineTactics'),renderer:dependency(gameSource,'renderer')};
    const smashSource=await(await fetch(urls.melee)).text(),rendererSource=await(await fetch(urls.renderer)).text();
    urls.meleeRuntime=smashSource.match(/from "(\/src\/game\/melee\/meleeCombatRuntime\.js[^"]*)"/)[1];
    urls.visual=smashSource.match(/from "(\/src\/game\/combat\/characterSuperVisuals\.js[^"]*)"/)[1];
    urls.identity=smashSource.match(/from "(\/src\/game\/combatIdentity\.js[^"]*)"/)[1];
    urls.catalog=rendererSource.match(/from "(\/src\/game\/combat\/characterAnimationCatalog\.js[^"]*)"/)[1];
    const [{EngineRpg},{EngineSmash},{EngineFighter},{EngineTactics},renderer,{tickMeleeCombatActor},{resolveMeleeSuper,resolveCombatHeroSpriteActor},{getCharacterAnimationFrame:getFrame,resolveCharacterAnimationAsset:getAsset},{HEROES_DB:heroes},{getHeroSpriteSheetSrc:getBase,getSpriteSheetLayout:getLayout,getSpriteStateResolution:getResolution},{getCharacterSuperVisualState:getVisual,supportsTrackedCharacterSuperVisual:supportsTracked}]=await Promise.all([
      import(urls.rpg),import(urls.melee),import(urls.fighter),import(urls.tactics),import(urls.renderer),import(urls.meleeRuntime),import(urls.identity),import(urls.catalog),import('/src/game/heroes.js'),import('/src/game/spriteAssets.js'),import(urls.visual)]);
    const {COMBAT_SOURCE_DEFINITIONS_WAVE15:definitions}=await import('/src/game/combat/combatSourceDefinitionsWave15.js');
    const blocked=new Set(unavailableIds),baseSheets=new Map(actualBases.map(entry=>[entry.heroId,entry.sheet]));const historical=new Map(legacyReferences.map(entry=>[entry.id,entry]));
    equal(Object.keys(definitions).sort(),[...allExpectedIds].sort(),'source definitions batch mismatch');const ids=expectedIds;const supported=new Set(ids.filter(id=>!['damage','control'].includes(definitions[id].effect)));const controlled=new Set(ids.filter(id=>definitions[id].effect==='control'));
    const {drawCombatControl}=await import('/src/game/combat/combatControlWave15.js');
    const hero=id=>{const h=heroes.find(h=>h.id===id);must(h,id);return h;},noop=()=>{},particles={add:noop};
    const sources=[...new Set([...ids.flatMap(id=>[getAsset(hero(id))?.sheet,getBase(hero(id),'melee')]),getBase(hero('noble_six'),'melee')].filter(Boolean))],decodedImages=new Map();renderer.preloadSpriteSheetSrcs(sources);
    await Promise.all(sources.map(async src=>{const image=new Image();image.src=src;await image.decode();must(image.naturalWidth>0,src);decodedImages.set(src,image);}));await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    document.getElementById('root').style.display='none';document.body.style.background='#0d1420';
    const canvas=document.createElement('canvas');canvas.width=420;canvas.height=260;canvas.setAttribute('aria-label','Wave15 real runtime case');document.body.append(canvas);
    const ctx=canvas.getContext('2d'),originalDraw=ctx.drawImage.bind(ctx),draws=[],fxCalls=[];for(const name of ['moveTo','lineTo','ellipse']){const original=ctx[name].bind(ctx);ctx[name]=(...args)=>{fxCalls.push([name,...args]);return original(...args);};}
    ctx.drawImage=function(image,...args){draws.push({sheet:new URL(image.src).pathname,args,transform:{a:ctx.getTransform().a,d:ctx.getTransform().d,e:ctx.getTransform().e,f:ctx.getTransform().f}});return originalDraw(image,...args);};
    const grid=document.createElement('canvas');grid.width=1800;grid.height=ids.length*260;document.body.append(grid);const gc=grid.getContext('2d');
    const dummy=id=>({id,name:id,universe:'Wave15 browser training',category:'test',weaponType:'melee',primaryColor:'#89aacc',secondaryColor:'#ddeeff',stats:{hp:5000,atk:20,def:8,spd:5},simple:{name:'Training',type:'melee',dmg:1},secondary:{name:'Training',type:'bullet',dmg:1,cd:3},defense:{name:'Training',type:'shield',reduce:0.4,dur:1},special:{name:'Training',type:'bullet',dmg:2}});
    function make(mode,side,id){const own=[hero(id),dummy('ally')],other=[id==='borderlands_2_maya_phaselock'?hero('noble_six'):dummy('near-one'),dummy('near-two'),dummy('far-one')],players=side==='player'?own:other,opponents=side==='opponent'?own:other;let engine,engineSide,actor,allies,targets;
      if(mode==='fighter'){engine=new EngineFighter(1800,500,players,opponents,particles,noop,noop,{opponentControl:'p2'});engine.countdown=0;engineSide=side==='player'?'player':'cpu';actor=engine.getActive(engineSide);allies=engine.getTeam(engineSide).fighters;targets=engine.getTeam(side==='player'?'cpu':'player').fighters;}
      else{const data={monsters:opponents,bosses:[],customRoster:opponents},options={universe:'Nexus de Convergence',disableHazards:true,customBattle:{singleRoster:true,opponentControl:'p2'}};engine=mode==='rpg'?new EngineRpg(1800,500,players,data,particles,noop,noop,options):new EngineSmash(1800,500,players,data,particles,noop,noop,{...options,mode:'Smash'});if(mode==='rpg')engine.autoBattle=false;else engine.syncPreMatchFromServer(3000);engineSide=side==='player'?'player':mode==='rpg'?'enemy':'cpu';allies=side==='player'?engine.heroes:engine.enemies;targets=side==='player'?engine.enemies:engine.heroes;actor=allies[0];}
      for(const unit of [...allies,...targets]){unit.maxHp=Math.max(1000,unit.maxHp);unit.currentHp=unit.maxHp;unit.state='idle';unit.vx=0;unit.vy=0;unit.y=mode==='rpg'?330:engine.groundY;unit.atb=100;unit.specialCharge=100;}
      const facing=side==='player'?1:-1;actor.x=facing>0?200:1500;actor.facing=facing;actor.meter=100;allies[1].x=actor.x-facing*80;targets.forEach((t,i)=>{t.x=actor.x+facing*[60,75,-350][i];});if(mode==='rpg')for(const unit of [...allies,...targets]){unit.homeX=unit.x;unit.homeY=unit.y;}return{mode,side,engineSide,engine,actor,allies,targets,facing,id};}
    const hp=units=>units.map(a=>a.currentHp),meter=c=>c.mode==='fighter'?c.actor.meter:c.actor.specialCharge,setMeter=(c,n)=>{if(c.mode==='fighter')c.actor.meter=n;else c.actor.specialCharge=n;};
    function commit(c){if(c.mode==='fighter')return c.engine.triggerSideAction(c.engineSide,'super');if(c.mode==='melee')return c.side==='player'?c.engine.triggerAbility(c.actor,'special'):c.engine.triggerOpponentAbility('special');if(!c.engine.beginTargeting(c.actor,'special',c.engineSide))return false;const t=c.engine.getTargetingState();if(!t)return true;if(t.shape==='single'&&t.profile.targetSide==='enemy')must(c.engine.selectTarget(c.targets[0].battleId),'target');c.targetIds=[...c.engine.getTargetingState().previewTargetIds];return c.engine.confirmTargeting();}
    function advance(c,seconds){if(c.mode==='rpg'){for(let i=0;i<Math.round(seconds*60);i++)c.engine.update();return;}for(let t=0;t<seconds-1e-9;){const dt=Math.min(1/60,seconds-t);if(c.mode==='fighter'){c.engine.updateActions(dt);c.engine.updateProjectiles(dt);}else tickMeleeCombatActor(c.actor,dt,{resolveActionHit:(actor,action)=>c.engine.resolveMeleeActionHit(actor,action)});t+=dt;}}
    const snap=c=>JSON.stringify({actor:c.actor,allies:c.allies,targets:c.targets,queue:c.engine.actionQueue,projectiles:c.engine.projectiles,impacts:c.engine.projectileVisualImpacts,stats:c.engine.stats});
    const guards=c=>c.allies.map(a=>c.mode==='rpg'?a.rpgGuardTicks:c.mode==='fighter'?a.superGuardSeconds:a.meleeSuperSupport?.effect==='guard'?a.meleeSuperSupport.remaining:0);
    const results=[];
    for(const [heroIndex,id] of ids.entries())for(const [modeIndex,mode] of ['rpg','melee','fighter'].entries())for(const [sideIndex,side] of ['player','opponent'].entries()){
      const c=make(mode,side,id),profile=resolveMeleeSuper(c.actor),events=[],beforeEnemies=hp(c.targets);
      if(profile.effect==='heal')c.allies.forEach(a=>{a.currentHp=a.maxHp*0.45;});const beforeAllies=hp(c.allies),applyName=mode==='fighter'?'applyHit':'applyDamage',apply=c.engine[applyName].bind(c.engine);
      c.engine[applyName]=(source,target,...args)=>{const old=target.currentHp,r=apply(source,target,...args);if(source===c.actor&&target.currentHp<old)events.push(target);return r;};
      setMeter(c,99);must(!commit(c),`${id}:99% accepted`);equal(meter(c),99,'meter99');setMeter(c,100);must(commit(c),`${id}/${mode}/${side}: cast rejected`);equal(meter(c),0,'meter cost');must(!commit(c),'duplicate cast accepted');
      advance(c,0.1);equal(hp(c.targets),beforeEnemies,'early damage');equal(hp(c.allies),beforeAllies,'early support');
      const paused=snap(c);if(mode==='rpg')c.engine.setPaused(true);for(let i=0;i<100;i++)if(mode==='rpg')c.engine.update();else if(mode==='fighter'){c.engine.updateActions(0);c.engine.updateProjectiles(0);}else tickMeleeCombatActor(c.actor,0,{resolveActionHit:(a,action)=>c.engine.resolveMeleeActionHit(a,action)});if(mode==='rpg')c.engine.setPaused(false);equal(snap(c),paused,'paused state changed');
      let startupElapsed=.1,preReleaseFeedback=null;
      if(mode!=='fighter'&&profile.effect==='damage'&&profile.delivery==='projectile'){
        const aimingElapsed=profile.hitAt*.75;advance(c,aimingElapsed-startupElapsed);startupElapsed=aimingElapsed;
        const aimingView=mode==='rpg'?c.engine.getRpgPresentationActor(c.actor):c.engine.getMeleeVisualActor(c.actor),aimingFrame=getFrame(aimingView),state=snap(c);
        if(aimingFrame)equal(aimingFrame.col,1,id+': pre-release browser fixture must show the aiming pose');
        fxCalls.length=0;if(mode==='rpg')c.engine.drawRpgCharacterSuperEffects(ctx);else c.engine.drawMeleeSuper(ctx,c.actor);
        equal(fxCalls.length,0,id+': native aiming pose emitted premature projectile feedback');equal(snap(c),state,'pre-release rendering mutated real simulation');equal(hp(c.targets),beforeEnemies,'pre-release damage');equal(meter(c),0,'pre-release rendering changed paid cost');
        preReleaseFeedback={elapsed:aimingElapsed,hitAt:profile.hitAt,nativeColumn:aimingFrame?.col??null,feedbackCommands:fxCalls.length,renderReadOnly:true};
      }
      advance(c,profile.hitAt-startupElapsed+0.02);const spriteActor=side==='opponent'&&mode!=='fighter'?resolveCombatHeroSpriteActor(c.actor)||c.actor:c.actor;
      const view=mode==='rpg'?c.engine.getRpgPresentationActor(spriteActor):mode==='melee'?c.engine.getMeleeVisualActor(spriteActor):c.actor,frame=getFrame(view),asset=getAsset(view),beforeDraw=snap(c),count=draws.length;
      const paint=()=>{ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.fillStyle='#172032';ctx.fillRect(0,0,420,260);ctx.fillStyle='#c9e9e6';ctx.font='12px monospace';ctx.fillText(`${id} ${mode} ${side==='player'?'J1':'J2'}`,8,18);ctx.save();ctx.translate(210-c.actor.x,218-c.actor.y);
        if(mode==='rpg'){if(side==='opponent')c.engine.drawRpgEnemy(ctx,c.actor,0);else c.engine.drawRpgHero(ctx,c.actor,0);c.engine.drawRpgCharacterSuperEffects(ctx);}else{if(mode==='fighter'){c.engine.projectiles.forEach(p=>c.engine.drawProjectile(ctx,p));c.engine.projectileVisualImpacts.forEach(p=>c.engine.drawProjectileImpact(ctx,p));}renderer.drawPixelSprite(ctx,view.x,view.y,view,0,view.facing,mode==='fighter'?142:72,'melee');if(mode==='fighter')c.engine.drawPersonalSuper(ctx,c.actor);else c.engine.drawMeleeSuper(ctx,c.actor);}
        if(controlled.has(id)){const victim=c.targets[0];if(mode==='rpg'){if(side==='player')c.engine.drawRpgEnemy(ctx,victim,0);else c.engine.drawRpgHero(ctx,victim,0);}else{renderer.drawPixelSprite(ctx,victim.x,victim.y,victim,0,victim.facing,mode==='fighter'?142:72,'melee');drawCombatControl(ctx,victim,mode==='fighter'?142:72);}}ctx.restore();};
      paint();const body=draws.slice(count).find(draw=>draw.sheet===(frame?asset.sheet:getBase(view,'melee')));must(body,`${id}/${mode}/${side}: real PNG body missing `+JSON.stringify({expected:frame?asset.sheet:getBase(view,'melee'),actual:draws.slice(count),actor:{id:view.id,sourceHeroId:view.sourceHeroId,sourceId:view.sourceId,spriteKey:view.spriteKey}}));
      let radialOrigin=null;
      if(profile.delivery==='radial'){
        const actualAction=mode==='rpg'?c.actor.rpgSpecialVisual:c.actor.action;
        radialOrigin=actualAction?.visualConfirmedContact?.origin;
        equal(radialOrigin,{x:c.actor.x,y:c.actor.y},id+'/'+mode+'/'+side+': accepted augmentation origin must be the actual caster');
        const radial=getVisual({actor:view,profile,action:actualAction,target:c.targets[0],height:mode==='fighter'?142:72,contactVisual:actualAction.visualConfirmedContact});
        equal(radial.ground,radialOrigin,'radial feedback left the accepted caster position');equal(radial.projectileVisual,undefined,'radial augmentation fabricated ballistic travel');
        equal(draws.slice(count).length,1,'radial feedback painted an extra body');
      }
      let bodyKind;
      if(blocked.has(id)){
        equal(frame,null,id+' has no dedicated native phase');equal(asset,null,id+' has no dedicated native atlas');const layout=getLayout(getBase(view,'melee')),binding=getResolution(view.state||'special',layout);
        must(body.sheet.startsWith('/sprites/generated/'),id+' must use a real published PNG');
        equal(body.sheet,baseSheets.get(id)||historical.get(id).sheet,id+' must draw its own published base or unchanged historical body');
        if(!baseSheets.has(id))equal(binding.dedicated,false,id+' cannot claim a dedicated native super');
        must(body.args[0]>=0&&body.args[1]>=0&&body.args[2]>0&&body.args[3]>0,id+' invalid historical PNG crop');
        const rpgDuration=c.actor.rpgSpecialDurationTicks/60;
        const actualAction=c.actor.action||{duration:rpgDuration,elapsed:view.presentationProgress*rpgDuration,hitAt:c.actor.rpgSpecialImpactProgress*rpgDuration,facing:c.actor.rpgSpecialVisual?.facing};
        const missingVisual=getVisual({actor:view,profile,action:actualAction,target:c.targets[0],height:mode==='fighter'?142:72});
        must(missingVisual,`${id}/${mode}/${side}: selected W15 projection missing`);
        equal(missingVisual.nativeArtworkAvailable,false,id+' cannot claim delivered W15 artwork');
        bodyKind=baseSheets.has(id)?'base16-without-native32':'legacy-fallback';
      }else{must(frame&&frame.col===2,`${id}/${mode}/${side}: actual impact must select native column2`);equal(body.args.slice(0,4),[512,frame.row*256,256,256],'actual native crop');must(Math.sign(body.transform.a)===view.facing,`native facing ${id}/${mode}/${side} view=${view.facing} actual=${body.transform.a}`);bodyKind='native32';equal(asset.frames,32,'native pose count');}
      const firstCanvas=canvas.toDataURL();paint();equal(canvas.toDataURL(),firstCanvas,'same simulation frame rendered differently');equal(snap(c),beforeDraw,'render mutated runtime');
      gc.drawImage(canvas,(modeIndex*2+sideIndex)*300,heroIndex*260,300,260);
      const support=supported.has(id),control=controlled.has(id),guardAtImpact=guards(c),controlAtImpact=control?(mode==='rpg'?c.targets[0].rpgControlTicks>0:c.targets[0].combatControl?.remaining>0):false;if(control){equal(hp(c.targets),beforeEnemies,'control damaged an enemy');equal(hp(c.allies),beforeAllies,'control healed or shielded an ally');equal(events.length,0,'control emitted damage');must(controlAtImpact,'actual enemy Phaselock absent');}else if(support){equal(hp(c.targets),beforeEnemies,'support damaged enemy');equal(events.length,0,'support caused damage event');if(profile.effect==='heal')must(c.allies.some((a,i)=>a.currentHp>beforeAllies[i]),'heal absent');else if(profile.effect==='buff'){must(mode==='rpg'?c.actor.rpgBuffTicks>0:mode==='fighter'?c.actor.superBuffSeconds>0:c.actor.meleeSuperSupport?.effect==='buff','actual buff absent');}else{must(guardAtImpact[0]>0,'guard absent');if(profile.targetSide==='self')must(!(guardAtImpact[1]>0),'personal guard leaked to ally');else must(guardAtImpact[1]>0,'group guard missed ally');}}
      advance(c,1.4);if(!support&&!control){must(events.length>0,`${id}/${mode}/${side}: no real hit`);equal(new Set(events).size,events.length,'repeated impact');}
      const settled={allies:hp(c.allies),enemies:hp(c.targets)};advance(c,1.4);equal({allies:hp(c.allies),enemies:hp(c.targets)},settled,'replayed hit/heal');
      results.push({id,mode,side,name:profile.name,effect:profile.effect,cost:100,pauseStable:true,renderReadOnly:true,bodyKind,bodySheet:body.sheet,bodyCell:body.args.slice(0,4),bodyTransform:body.transform,declaredNativePoses:asset?.frames||0,acceptedDamageEvents:events.length,preReleaseFeedback,radialOrigin,guardAtImpact,controlAtImpact,allyHpDelta:c.allies.map((a,i)=>a.currentHp-beforeAllies[i]),enemyHpDelta:c.targets.map((a,i)=>a.currentHp-beforeEnemies[i]),impactUnique:true});c.engine.dispose?.();window.__nativeRuntimeWave15Progress.authoritativeFixtures=results.length;
    }
    // These are real EngineTactics surface-addressed combat fixtures. Selection
    // and accepted effects use production methods, while deterministic stepping
    // advances the actual stateTimer. They are not keyboard journeys.
    const tacticsCases=[],tacticsGrid=document.createElement('canvas');
    tacticsGrid.width=2400;tacticsGrid.height=ids.length*260;
    const tgc=tacticsGrid.getContext('2d');
    function makeTactics(id,side,index){
      const own=[hero(id),dummy('tactics-ally')],other=[id==='borderlands_2_maya_phaselock'?hero('noble_six'):dummy('tactics-near-one'),dummy('tactics-near-two'),dummy('tactics-far-one')];
      const players=side==='player'?own:other,opponents=side==='opponent'?own:other;
      const engine=new EngineTactics(1800,850,players,{monsters:opponents,bosses:[],customRoster:opponents},particles,noop,noop,{
        universe:'Nexus de Convergence',tacticsBattlefieldId:'nexus_skybridge',disableHazards:true,
        customBattle:{singleRoster:true,opponentControl:'p2'},difficulty:'Medium'
      });
      must(engine.verticalTerrain&&engine.terrain.vertical,'Tactics must be the real vertical engine');
      const allies=side==='player'?engine.heroes:engine.enemies,targets=side==='player'?engine.enemies:engine.heroes;
      const actor=allies[0],upper=index%2===0,layer=upper?'bridge':'ground';
      function place(unit,surfaceId){const surface=engine.terrain.byId.get(surfaceId);must(surface,surfaceId);Object.assign(unit,{surfaceId,gridX:surface.x,gridY:surface.y,gridZ:surface.z,state:'idle',stateTimer:0,cooldown:0,maxHp:5000,currentHp:5000,specialCharge:100});}
      place(actor,`${layer}:${side==='player'?5:6}:3`);place(allies[1],`${layer}:${side==='player'?4:7}:3`);
      place(targets[0],`${layer}:${side==='player'?6:5}:3`);place(targets[1],`${layer}:${side==='player'?7:4}:3`);place(targets[2],'ground:0:0');
      if(resolveMeleeSuper(hero(id)).effect==='heal')allies.forEach(unit=>unit.currentHp=unit.maxHp*.45);
      engine.syncActorsToCamera();engine.activeUnit=actor;engine.activeUnitType=side==='player'?'hero':'enemy';
      engine.actionPhase='action';engine.selectedAction=null;engine.selectedActionExplicit=false;engine.movementBudget=2;engine.movementSpent=0;
      return{id,side,engine,actor,allies,targets,layer,upper};
    }
    const tacticsSnapshot=c=>JSON.stringify({heroes:c.engine.heroes,enemies:c.engine.enemies,phase:c.engine.actionPhase,activeType:c.engine.activeUnitType,selected:c.engine.selectedAction,turns:c.engine.turnsElapsed,damageDealt:c.engine.damageDealt,damageTaken:c.engine.damageTaken});
    for(const [heroIndex,id] of ids.entries())for(const [sideIndex,side] of ['player','opponent'].entries()){
      const c=makeTactics(id,side,heroIndex),{engine,actor}=c,profile=engine.getAttackProfile(actor,'special');
      const control=profile.effect==='control',support=!['damage','control'].includes(profile.effect),beforeEnemies=hp(c.targets),beforeAllies=hp(c.allies),events=[];
      const apply=engine.applyDamage.bind(engine);engine.applyDamage=(source,target,...args)=>{const old=target.currentHp,result=apply(source,target,...args);if(source===actor&&target.currentHp<old)events.push(target);return result;};
      actor.specialCharge=99;must(!engine.selectAction('special'),`${id}/${side}: Tactics accepted99`);equal(actor.specialCharge,99,'Tactics refused cost mutated');
      actor.specialCharge=100;must(engine.selectAction('special'),`${id}/${side}: Tactics refused special selection`);
      const target=profile.targetSide==='self'?actor:support?c.allies[1]:c.targets[0];
      const accepted=engine.handleSurfaceClick(target.surfaceId);
      must(accepted.handled&&accepted.type==='action',`${id}/${side}: Tactics did not commit `+JSON.stringify({accepted,profile,target:target.surfaceId,range:engine.attackRange}));
      equal(actor.specialCharge,0,'Tactics actual cost');must(!engine.selectAction('special'),'Tactics duplicate cast accepted');
      equal(actor.state,'special','Tactics must retain special pose');equal(actor.stateTimer,35,'Tactics initial presentation timer');
      if(control){equal(engine.getActionBaseDamage(actor,'special'),0,'Tactics control has nonzero base damage');equal(hp(c.targets),beforeEnemies,'Tactics control damaged enemy');equal(hp(c.allies),beforeAllies,'Tactics control modified ally HP');equal(events.length,0,'Tactics control emitted damage');must(c.targets[0].tacticsControl?.remainingTurns>0,'Tactics true enemy bind absent');}
      else if(support){
        equal(engine.getActionBaseDamage(actor,'special'),0,'Tactics support has nonzero base damage');equal(hp(c.targets),beforeEnemies,'Tactics support damaged opposing camp');equal(events.length,0,'Tactics support emitted damage');
        if(profile.effect==='guard')must((profile.targetSide==='self'?[actor]:c.allies).every(unit=>unit.tacticsGuardTicks>0),`${id}: Tactics actual group guard absent`);
        else if(profile.effect==='buff')must((profile.targetSide==='self'?[actor]:c.allies).every(unit=>unit.tacticsBuffTicks>0),`${id}: Tactics actual group buff absent`);
        else if(profile.effect==='heal')must(c.allies.some((unit,index)=>unit.currentHp>beforeAllies[index]),'Tactics heal absent');
      }else{must(events.length>0,`${id}/${side}: Tactics accepted no damage`);equal(events.length,new Set(events).size,'Tactics repeated accepted contact');}
      const effects={controls:c.targets.map(unit=>unit.tacticsControl?{kind:unit.tacticsControl.kind,remainingTurns:unit.tacticsControl.remainingTurns}:null),guards:c.allies.map(unit=>unit.tacticsGuardTicks||0),buffs:c.allies.map(unit=>unit.tacticsBuffTicks||0),allyHpDelta:c.allies.map((unit,index)=>unit.currentHp-beforeAllies[index]),enemyHpDelta:c.targets.map((unit,index)=>unit.currentHp-beforeEnemies[index])};
      engine.setPaused(true);const paused=tacticsSnapshot(c);for(let i=0;i<100;i++)engine.update();equal(tacticsSnapshot(c),paused,'Tactics pause advanced simulation');
      const initialView=engine.verticalTerrain.drawActor(actor);equal(initialView.presentationProgress,0,'Tactics paused first pose progressed');engine.setPaused(false);
      const samples=[];let elapsed=0;
      for(const [sampleIndex,targetTicks] of [0,10,20,32].entries()){
        while(elapsed<targetTicks){engine.update();elapsed++;}
        equal(actor.stateTimer,35-targetTicks,'Tactics real stateTimer progression');
        const view=engine.verticalTerrain.drawActor(actor),frame=getFrame(view),asset=getAsset(view),before=tacticsSnapshot(c);
        function paintTactics(animTime){
          const n=draws.length;ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.fillStyle='#172032';ctx.fillRect(0,0,420,260);
          ctx.fillStyle='#c9e9e6';ctx.font='12px monospace';ctx.fillText(`${id} tactics ${side==='player'?'J1':'J2'} ${c.layer} t=${elapsed}`,8,18);
          ctx.save();ctx.translate(210-actor.x,218-actor.y);engine.drawTacticsUnit(ctx,{unit:actor,type:side==='player'?'hero':'enemy'},animTime);if(control)engine.drawTacticsUnit(ctx,{unit:c.targets[0],type:side==='player'?'enemy':'hero'},animTime);ctx.restore();
          const expected=frame?asset.sheet:getBase(view,'tactics'),body=draws.slice(n).find(draw=>draw.sheet===expected);
          must(body,`${id}/${side}: Tactics real PNG missing `+JSON.stringify({expected,actual:draws.slice(n),view:{id:view.id,state:view.state,phase:view.presentationPhase}}));
          return body;
        }
        const body=paintTactics(0);equal(tacticsSnapshot(c),before,'Tactics body draw mutated runtime');
        if(blocked.has(id)){equal(frame,null,id+' Tactics refusal has new native frame');equal(asset,null,id+' Tactics refusal has new native asset');equal(body.sheet,historical.get(id).sheet,id+' Tactics must retain historical identity pixels');}
        else{must(frame,`${id}/${side}: Tactics native super frame absent`);equal(frame.col,sampleIndex,`${id}/${side}: Tactics did not play all four native columns`);equal(body.args.slice(0,4),[sampleIndex*256,7*256,256,256],'Tactics actual native source crop');must(Math.sign(body.transform.a)===view.facing,'Tactics committed facing lost');equal(asset.frames,32,'Tactics delivered native count');}
        const second=paintTactics(973);equal(second.args.slice(0,4),body.args.slice(0,4),'Tactics source cell follows global animation time');equal(tacticsSnapshot(c),before,'Tactics rendering mutated simulation');
        tgc.drawImage(canvas,(sideIndex*4+sampleIndex)*300,heroIndex*260,300,260);
        samples.push({elapsedTicks:elapsed,stateTimer:actor.stateTimer,progress:view.presentationProgress,nativeColumn:frame?.col??null,bodySheet:body.sheet,bodyCell:body.args.slice(0,4),bodyTransform:body.transform,renderReadOnly:true,independentOfGlobalAnimationClock:true});
      }
      const settled={allies:hp(c.allies),enemies:hp(c.targets)},eventCount=events.length;
      for(let i=0;i<8;i++)engine.update();equal({allies:hp(c.allies),enemies:hp(c.targets)},settled,'Tactics replayed effect when animation ended');equal(events.length,eventCount,'Tactics replayed accepted contact');
      tacticsCases.push({id,mode:'tactics',side,name:profile.name,effect:profile.effect,targetSide:profile.targetSide,cost:100,surfaceId:actor.surfaceId,gridZ:actor.gridZ,layer:c.layer,verticalArena:engine.battlefield.id,actualSurfaceTarget:target.surfaceId,immediateAcceptedEffect:true,acceptedDamageEvents:events.length,effects,pauseStable:true,renderReadOnly:true,bodyKind:blocked.has(id)?'legacy-fallback':'native32',samples});engine.dispose();window.__nativeRuntimeWave15Progress.tacticsFixtures=tacticsCases.length;
    }
    const projectileCases=[],projectileIds=ids.filter(id=>supportsTracked(resolveMeleeSuper(hero(id))));equal([...projectileIds].sort(),[...expectedProjectileIds].sort(),'tracked projectile identity mismatch');
    const projectileGrid=document.createElement('canvas');projectileGrid.width=1800;projectileGrid.height=projectileIds.length*260;const pgc=projectileGrid.getContext('2d');
    function captureProjectile(c,stage,point,stageIndex){
      const before=snap(c),n=draws.length;ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.fillStyle='#172032';ctx.fillRect(0,0,420,260);ctx.fillStyle='#c9e9e6';ctx.font='12px monospace';ctx.fillText(`${c.id} ${c.side==='player'?'J1':'J2'} ${stage}`,8,18);ctx.save();ctx.translate(210-point.x,170-point.y);
      renderer.drawPixelSprite(ctx,c.actor.x,c.actor.y,c.actor,0,c.actor.facing,142,'melee');c.engine.projectiles.forEach(p=>c.engine.drawProjectile(ctx,p));c.engine.projectileVisualImpacts.forEach(p=>c.engine.drawProjectileImpact(ctx,p));if(c.actor.action?.type==='super')c.engine.drawPersonalSuper(ctx,c.actor);ctx.restore();
      equal(snap(c),before,'projectile capture mutated runtime');const currentFrame=getFrame(c.actor),expectedSheet=currentFrame?getAsset(c.actor)?.sheet:getBase(c.actor,'melee'),body=draws.slice(n).find(d=>d.sheet===expectedSheet);must(body,c.id+' capture has no real actor PNG');if(stage==='launch'&&!blocked.has(c.id)){must(body,c.id+' launch has no real native body');equal(body.args.slice(0,4),[512,7*256,256,256],'launch body must use real super column2');}if(blocked.has(c.id))must(!currentFrame,'blocked character has no new launch pose');
      pgc.drawImage(canvas,((c.side==='player'?0:3)+stageIndex)*300,projectileIds.indexOf(c.id)*260,300,260);return{stage,x:point.x,y:point.y,realActorBody:!!body,bodyKind:currentFrame?'native32':blocked.has(c.id)?'legacy-fallback':'base16',bodySheet:body.sheet,bodyCell:body.args.slice(0,4),renderReadOnly:true};
    }
    for(const id of projectileIds)for(const side of ['player','opponent']){
      const c=make('fighter',side,id),profile=resolveMeleeSuper(c.actor),target=c.targets[0],events=[];target.x=c.actor.x+c.facing*Math.min(500,profile.range-60);const hpBefore=target.currentHp,apply=c.engine.applyHit.bind(c.engine);
      c.engine.applyHit=(source,unit,...args)=>{const old=unit.currentHp,r=apply(source,unit,...args);if(source===c.actor&&unit.currentHp<old)events.push(unit);return r;};
      must(commit(c),id+' projectile cast');advance(c,c.actor.action.hitAt-0.01);equal(c.engine.projectiles.length,0,'projectile before hitAt');equal(target.currentHp,hpBefore,'damage before launch');
      const action=c.actor.action;c.engine.updateActions(action.hitAt-action.elapsed);equal(c.engine.projectiles.length,1,id+' missing physical projectile');const shot=c.engine.projectiles[0],expected=getVisual({actor:c.actor,profile,action,target,height:142});equal(expected.nativeMuzzleActive,!blocked.has(id),id+' measured native versus pending artwork distinction');
      const origin=blocked.has(id)?{x:c.actor.x+c.facing*58,y:c.actor.y-64}:expected.origin;must(Math.abs(shot.x-origin.x)<1e-9&&Math.abs(shot.y-origin.y)<1e-9,id+' physical origin mismatch');equal(target.currentHp,hpBefore,'launch damaged distant target');
      const nativeSpawn={x:shot.x,y:shot.y,point:expected.nativeAnchor?.nativePoint||null,col:expected.nativeAnchor?.col??null,renderScale:expected.nativeAnchor?.renderScale??null,kind:blocked.has(id)?'unavailable-native-fallback':'measured-native',weaponKind:definitions[id].kind};if(!blocked.has(id)){
        equal(nativeSpawn.col,2,'launch must use the actual release pose');
        const frame=getFrame(c.actor),image=decodedImages.get(frame.asset.sheet),point=nativeSpawn.point;
        must(image&&point&&Number.isInteger(point.x)&&Number.isInteger(point.y),id+' invalid measured source point');
        const probe=document.createElement('canvas');probe.width=7;probe.height=7;const probeContext=probe.getContext('2d',{willReadFrequently:true});
        probeContext.drawImage(image,frame.col*256+point.x-3,frame.row*256+point.y-3,7,7,0,0,7,7);
        const pixels=probeContext.getImageData(0,0,7,7).data,rgba=Array.from(pixels.slice((3*7+3)*4,(3*7+3)*4+4));
        let nativePixels=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]>24)nativePixels++;
        const weaponFamily=definitions[id].weaponType,minNativePixels=['bow','wand','staff','energy','emitter','omnitool'].includes(weaponFamily)?1:8;
        must(rgba[3]>24&&nativePixels>=minNativePixels,id+' measured arrow/gun/emitter point does not address actual native pixels');
        nativeSpawn.weaponFamily=weaponFamily;nativeSpawn.minimumVisibleSourcePixels=minNativePixels;
        nativeSpawn.sourceRaster={sheet:frame.asset.sheet,row:frame.row,col:frame.col,rgba,nativePixelsInRadius3:nativePixels};
      }const captures=[captureProjectile(c,'launch',shot,0)];
      c.actor.x+=c.facing*600;c.actor.facing=-c.facing;target.guarding=true;target.facing=-c.facing;
      const paintFlight=()=>{fxCalls.length=0;c.engine.drawProjectile(ctx,shot);return JSON.stringify(fxCalls);};const first=paintFlight(),state=snap(c),s=142/72;
      if(!blocked.has(id)){const shape=expected.projectilePresentation.shape;must(fxCalls.some(call=>shape==='orb'?call[0]==='ellipse'&&call[1]===shot.x&&call[2]===shot.y:shape==='crystal'?call[0]==='moveTo'&&call[1]===shot.x&&Math.abs(call[2]-(shot.y-4*s))<1e-9:shape==='spark'?call[0]==='moveTo'&&Math.abs(call[1]-(shot.x-c.facing*6*s))<1e-9&&Math.abs(call[2]-(shot.y+2*s))<1e-9:call[0]==='moveTo'&&Math.abs(call[1]-(shot.x-c.facing*(shape==='arrow'?9:shape==='rocket-marker'?8:6)*s))<1e-9&&call[2]===shot.y),id+' source-specific projectile visual left its collision coordinates');}
      for(let i=0;i<100;i++){c.engine.updateProjectiles(0);equal(paintFlight(),first,'paused projectile draw changed');}equal(snap(c),state,'paused projectile mutated simulation');const firstX=shot.x;advance(c,Math.min(0.1,100/Math.max(1,Math.abs(shot.vx))));must((shot.x-firstX)*c.facing>0,'real projectile must travel before collision');equal(target.currentHp,hpBefore,'flight before collision damaged target');captures.push(captureProjectile(c,'flight',shot,1));
      let limit=240;while(!c.engine.projectileVisualImpacts.length&&limit-->0)advance(c,1/120);must(limit>0,id+' shot missed');equal(events.length,1,id+' repeated hit');must(target.guard<100,'incoming guard direction lost');
      const impact=c.engine.projectileVisualImpacts[0],hpAfter=target.currentHp;captures.push(captureProjectile(c,'impact',impact,2));fxCalls.length=0;c.engine.drawProjectileImpact(ctx,impact);const beforeMove=JSON.stringify(fxCalls);target.x-=c.facing*500;target.y-=200;target.currentHp=0;fxCalls.length=0;c.engine.drawProjectileImpact(ctx,impact);equal(JSON.stringify(fxCalls),beforeMove,'stored impact followed moved/dead target');
      advance(c,2);equal(events.length,1,'replayed collision');equal(c.engine.projectiles.length,0,'unexpired shot');equal(c.engine.projectileVisualImpacts.length,0,'unexpired impact');
      projectileCases.push({id,side,captures,nativeSpawn,committedFacing:c.facing,acceptedDamage:hpBefore-hpAfter,acceptedDamageEvents:events.length,guarded:true,pauseStable:true,realFlightCoordinates:true,impact:{x:impact.x,y:impact.y},movedDeadTargetPreservesContact:true});c.engine.dispose?.();window.__nativeRuntimeWave15Progress.physicalProjectileCases=projectileCases.length;
    }
    return {urls,sources,results,projectileCases,tacticsCases,tacticsBodyKinds:tacticsCases.reduce((a,r)=>(a[r.bodyKind]=(a[r.bodyKind]||0)+1,a),{}),bodyKinds:results.reduce((a,r)=>(a[r.bodyKind]=(a[r.bodyKind]||0)+1,a),{}),gridImage:grid.toDataURL('image/png'),projectileGridImage:projectileGrid.toDataURL('image/png'),tacticsGridImage:tacticsGrid.toDataURL('image/png')};
  },{blockedIds,unavailableIds,actualBases,legacyReferences,expectedIds:ids,allExpectedIds,expectedProjectileIds});
  await browser.close();
  const browserClosedAt=new Date().toISOString();
  assert.deepEqual(await inputHashes(),initialInputHashes,'Production metadata changed during the controlled browser run');
  assert.equal(result.results.length,720);assert.equal(result.bodyKinds.native32||0,actualDelivered.length*6);assert.equal(Object.values(result.bodyKinds).reduce((a,b)=>a+b,0),720);
  assert.equal(result.tacticsCases.length,240);assert.equal(result.tacticsBodyKinds.native32||0,actualDelivered.length*2);assert.equal(Object.values(result.tacticsBodyKinds).reduce((a,b)=>a+b,0),240);
  assert.equal(result.projectileCases.length,expectedProjectileIds.length*2);assert.equal(result.projectileCases.filter(c=>c.nativeSpawn.kind==='measured-native').length,expectedProjectileIds.filter(id=>actualDelivered.includes(id)).length*2);assert.equal(result.projectileCases.filter(c=>c.nativeSpawn.kind==='unavailable-native-fallback').length,expectedProjectileIds.filter(id=>unavailableIds.includes(id)).length*2);assert.deepEqual(errors,[]);
  assert.ok(failedRequests.every(r=>r.url.startsWith('https://fonts.googleapis.com/')&&r.error==='net::ERR_TUNNEL_CONNECTION_FAILED'));assert.equal(consoleErrors.length,failedRequests.length);
  await fs.writeFile(path.join(directory,`${outputPrefix}-runtime-grid.png`),Buffer.from(result.gridImage.split(',')[1],'base64'));await fs.writeFile(path.join(directory,`${outputPrefix}-projectile-grid.png`),Buffer.from(result.projectileGridImage.split(',')[1],'base64'));await fs.writeFile(path.join(directory,`${outputPrefix}-tactics-grid.png`),Buffer.from(result.tacticsGridImage.split(',')[1],'base64'));const {gridImage:_gridImage,projectileGridImage:_projectileGridImage,tacticsGridImage:_tacticsGridImage,...report}=result;
  const artifacts=await Promise.all([`${outputPrefix}-runtime-grid.png`,`${outputPrefix}-projectile-grid.png`,`${outputPrefix}-tactics-grid.png`].map(async name=>({path:'docs/combat-fidelity-wave15-2026-10-26/browser/'+name,sha256:hash(await fs.readFile(path.join(directory,name)))})));
  assert.equal(hash(await fs.readFile(harness)),harnessSha256,'harness changed during run');
  await fs.writeFile(path.join(directory,`${outputPrefix}-runtime.json`),JSON.stringify({passed:true,phase,partial,selectedHeroCount:ids.length,expectedFullBatch:allExpectedIds.length,productionFreezeAcknowledged:phase==='final',productionFreezePath:phase==='final'?productionFreezePath:null,productionFreezeSha256,refused,pendingIds,pendingProjectileAnchorIds,pendingBeamAnchorIds,expectedBeamIds,projectileFamilies,unavailableIds,legacyReferences,deliveredNativeBodies:actualDelivered.length,startedAt,finishedAt:new Date().toISOString(),harness,harnessSha256,artifacts,allBrowserWindowsClosed:true,browserClosedAt,method:`Chromium actual engines imported from exact compiled component URLs, controlled authoritative stepping and real native/base PNG drawing. ${ids.length*6} authoritative fixtures and ${expectedProjectileIds.length*2} actual physical flights; ${actualDelivered.length} delivered native bodies and ${unavailableIds.length} bodies awaiting native32 (${blockedIds.length} confirmed refusals, ${pendingIds.length} still pending) derived from real current manifests and receipts. ${ids.length*2} additional real vertical EngineTactics fixtures on upper and lower surface IDs, with all four delivered super columns advanced by the actual stateTimer. Tactics accepted effects are immediate; other three modes resolve their real timed contacts. No keyboard UI flow claim.`,...report,inputHashes:initialInputHashes,errors,failedRequests,consoleErrors,source1to1Verified:false},null,2)+'\n');
  console.log(JSON.stringify({passed:true,phase,partial,cases:result.results.length,physicalProjectileCases:result.projectileCases.length,tacticsCases:result.tacticsCases.length,bodyKinds:result.bodyKinds,errors}));
}catch(error){const fixtureProgress=await page?.evaluate(()=>window.__nativeRuntimeWave15Progress||null).catch(()=>null);await browser.close();const browserClosedAt=new Date().toISOString();await fs.writeFile(path.join(directory,`${outputPrefix}-runtime-failure.json`),JSON.stringify({phase,partial,pendingIds,pendingProjectileAnchorIds,pendingBeamAnchorIds,expectedBeamIds,projectileFamilies,deliveredNativeBodies:actualDelivered.length,startedAt,finishedAt:new Date().toISOString(),allBrowserWindowsClosed:true,browserClosedAt,fixtureProgress,error:error.message,stack:error.stack,errors,failedRequests,consoleErrors},null,2)+'\n');throw error;}finally{await browser.close();}
