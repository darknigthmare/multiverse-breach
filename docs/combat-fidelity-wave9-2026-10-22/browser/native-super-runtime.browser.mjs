import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const directory=path.resolve('docs/combat-fidelity-wave9-2026-10-22/browser');
await fs.mkdir(directory,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const errors=[],failedRequests=[],consoleErrors=[];
try{
  const page=await browser.newPage({viewport:{width:1900,height:1100}});page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure()?.errorText}));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
  await page.goto(process.env.BROWSER_BASE_URL||'http://127.0.0.1:5188/',{waitUntil:'networkidle'});
  const result=await page.evaluate(async()=>{
    const must=(value,message)=>{if(!value)throw new Error(message);},equal=(a,b,message)=>must(JSON.stringify(a)===JSON.stringify(b),message);
    const gameSource=await(await fetch('/src/components/GameCanvas.jsx')).text(),fighterSource=await(await fetch('/src/components/FighterMode.jsx')).text();
    const dependency=(source,name)=>source.match(new RegExp('from "(/src/game/'+name+'\\.js[^\\"]*)"'))[1];
    const urls={rpg:dependency(gameSource,'engineRpg'),melee:dependency(gameSource,'engineSmash'),fighter:dependency(fighterSource,'engineFighter'),renderer:dependency(gameSource,'renderer')};
    const smashSource=await(await fetch(urls.melee)).text(),rendererSource=await(await fetch(urls.renderer)).text();
    urls.meleeRuntime=smashSource.match(/from "(\/src\/game\/melee\/meleeCombatRuntime\.js[^"]*)"/)[1];
    urls.visual=smashSource.match(/from "(\/src\/game\/combat\/characterSuperVisuals\.js[^"]*)"/)[1];
    urls.identity=smashSource.match(/from "(\/src\/game\/combatIdentity\.js[^"]*)"/)[1];
    urls.catalog=rendererSource.match(/from "(\/src\/game\/combat\/characterAnimationCatalog\.js[^"]*)"/)[1];
    const [{EngineRpg},{EngineSmash},{EngineFighter},renderer,{tickMeleeCombatActor},{resolveMeleeSuper,resolveCombatHeroSpriteActor},{getCharacterAnimationFrame:getFrame,resolveCharacterAnimationAsset:getAsset},{HEROES_DB:heroes},{getHeroSpriteSheetSrc:getBase},{getCharacterSuperVisualState:getVisual,supportsTrackedCharacterSuperVisual:supportsTracked}]=await Promise.all([
      import(urls.rpg),import(urls.melee),import(urls.fighter),import(urls.renderer),import(urls.meleeRuntime),import(urls.identity),import(urls.catalog),import('/src/game/heroes.js'),import('/src/game/spriteAssets.js'),import(urls.visual)]);
    const ids=['marcus','dom','cole','baird','hoffman_cog','shepard','garrus','liara','tali','wrex','motoko','batou','togusa','aramaki','saito_gits','chris_redfield','claire_redfield','ada_wong','barry_burton','carlos_oliveira'];
    const supported=new Set(['baird','hoffman_cog','wrex','aramaki']);
    const hero=id=>{const h=heroes.find(h=>h.id===id);must(h,id);return h;},noop=()=>{},particles={add:noop};
    const sources=[...new Set(ids.flatMap(id=>[getAsset(hero(id))?.sheet,getBase(hero(id),'melee')]).filter(Boolean))];renderer.preloadSpriteSheetSrcs(sources);
    await Promise.all(sources.map(async src=>{const image=new Image();image.src=src;await image.decode();must(image.naturalWidth>0,src);}));await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    document.getElementById('root').style.display='none';document.body.style.background='#0d1420';
    const canvas=document.createElement('canvas');canvas.width=420;canvas.height=260;canvas.setAttribute('aria-label','Wave9 real runtime case');document.body.append(canvas);
    const ctx=canvas.getContext('2d'),originalDraw=ctx.drawImage.bind(ctx),draws=[],fxCalls=[];for(const name of ['moveTo','lineTo','ellipse']){const original=ctx[name].bind(ctx);ctx[name]=(...args)=>{fxCalls.push([name,...args]);return original(...args);};}
    ctx.drawImage=function(image,...args){draws.push({sheet:new URL(image.src).pathname,args,transform:{a:ctx.getTransform().a,d:ctx.getTransform().d,e:ctx.getTransform().e,f:ctx.getTransform().f}});return originalDraw(image,...args);};
    const grid=document.createElement('canvas');grid.width=1800;grid.height=20*260;document.body.append(grid);const gc=grid.getContext('2d');
    const dummy=id=>({id,name:id,universe:'Wave9 browser training',category:'test',weaponType:'melee',primaryColor:'#89aacc',secondaryColor:'#ddeeff',stats:{hp:5000,atk:20,def:8,spd:5},simple:{name:'Training',type:'melee',dmg:1},secondary:{name:'Training',type:'bullet',dmg:1,cd:3},defense:{name:'Training',type:'shield',reduce:0.4,dur:1},special:{name:'Training',type:'bullet',dmg:2}});
    function make(mode,side,id){const own=[hero(id),dummy('ally')],other=['near-one','near-two','far-one'].map(dummy),players=side==='player'?own:other,opponents=side==='opponent'?own:other;let engine,engineSide,actor,allies,targets;
      if(mode==='fighter'){engine=new EngineFighter(1800,500,players,opponents,particles,noop,noop,{opponentControl:'p2'});engine.countdown=0;engineSide=side==='player'?'player':'cpu';actor=engine.getActive(engineSide);allies=engine.getTeam(engineSide).fighters;targets=engine.getTeam(side==='player'?'cpu':'player').fighters;}
      else{const data={monsters:opponents,bosses:[],customRoster:opponents},options={universe:'Nexus de Convergence',disableHazards:true,customBattle:{singleRoster:true,opponentControl:'p2'}};engine=mode==='rpg'?new EngineRpg(1800,500,players,data,particles,noop,noop,options):new EngineSmash(1800,500,players,data,particles,noop,noop,{...options,mode:'Smash'});if(mode==='rpg')engine.autoBattle=false;else engine.syncPreMatchFromServer(3000);engineSide=side==='player'?'player':mode==='rpg'?'enemy':'cpu';allies=side==='player'?engine.heroes:engine.enemies;targets=side==='player'?engine.enemies:engine.heroes;actor=allies[0];}
      for(const unit of [...allies,...targets]){unit.maxHp=Math.max(1000,unit.maxHp);unit.currentHp=unit.maxHp;unit.state='idle';unit.vx=0;unit.vy=0;unit.y=mode==='rpg'?330:engine.groundY;unit.atb=100;unit.specialCharge=100;}
      const facing=side==='player'?1:-1;actor.x=facing>0?200:1500;actor.facing=facing;actor.meter=100;allies[1].x=actor.x-facing*80;targets.forEach((t,i)=>{t.x=actor.x+facing*[60,75,-350][i];});return{mode,side,engineSide,engine,actor,allies,targets,facing,id};}
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
      advance(c,profile.hitAt-0.1+0.02);const spriteActor=side==='opponent'&&mode!=='fighter'?resolveCombatHeroSpriteActor(c.actor)||c.actor:c.actor;
      const view=mode==='rpg'?c.engine.getRpgPresentationActor(spriteActor):mode==='melee'?c.engine.getMeleeVisualActor(spriteActor):c.actor,frame=getFrame(view),asset=getAsset(view),beforeDraw=snap(c),count=draws.length;
      const paint=()=>{ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.fillStyle='#172032';ctx.fillRect(0,0,420,260);ctx.fillStyle='#c9e9e6';ctx.font='12px monospace';ctx.fillText(`${id} ${mode} ${side==='player'?'J1':'J2'}`,8,18);ctx.save();ctx.translate(210-c.actor.x,218-c.actor.y);
        if(mode==='rpg'){if(side==='opponent')c.engine.drawRpgEnemy(ctx,c.actor,0);else c.engine.drawRpgHero(ctx,c.actor,0);c.engine.drawRpgCharacterSuperEffects(ctx);}else{if(mode==='fighter'){c.engine.projectiles.forEach(p=>c.engine.drawProjectile(ctx,p));c.engine.projectileVisualImpacts.forEach(p=>c.engine.drawProjectileImpact(ctx,p));}renderer.drawPixelSprite(ctx,view.x,view.y,view,0,view.facing,mode==='fighter'?142:72,'melee');if(mode==='fighter')c.engine.drawPersonalSuper(ctx,c.actor);else c.engine.drawMeleeSuper(ctx,c.actor);}ctx.restore();};
      paint();const body=draws.slice(count).find(draw=>draw.sheet===(frame?asset.sheet:getBase(view,'melee')));must(body,`${id}/${mode}/${side}: real PNG body missing `+JSON.stringify({expected:frame?asset.sheet:getBase(view,'melee'),actual:draws.slice(count),actor:{id:view.id,sourceHeroId:view.sourceHeroId,sourceId:view.sourceId,spriteKey:view.spriteKey}}));
      let bodyKind;
      {must(frame&&frame.col===2,`${id}/${mode}/${side}: actual impact must select native column2`);equal(body.args.slice(0,4),[512,frame.row*256,256,256],'actual native crop');must(Math.sign(body.transform.a)===view.facing,`native facing ${id}/${mode}/${side} view=${view.facing} actual=${body.transform.a}`);bodyKind='native32';equal(asset.frames,32,'native pose count');}
      const firstCanvas=canvas.toDataURL();paint();equal(canvas.toDataURL(),firstCanvas,'same simulation frame rendered differently');equal(snap(c),beforeDraw,'render mutated runtime');
      gc.drawImage(canvas,(modeIndex*2+sideIndex)*300,heroIndex*260,300,260);
      const support=supported.has(id),guardAtImpact=guards(c);if(support){equal(hp(c.targets),beforeEnemies,'support damaged enemy');equal(events.length,0,'support caused damage event');if(profile.effect==='heal')must(c.allies.some((a,i)=>a.currentHp>beforeAllies[i]),'heal absent');else if(profile.effect==='buff'){must(mode==='rpg'?c.actor.rpgBuffTicks>0:mode==='fighter'?c.actor.superBuffSeconds>0:c.actor.meleeSuperSupport?.effect==='buff','actual buff absent');}else{must(guardAtImpact[0]>0,'guard absent');if(profile.targetSide==='self')must(!(guardAtImpact[1]>0),'personal guard leaked to ally');else must(guardAtImpact[1]>0,'group guard missed ally');}}
      advance(c,1.4);if(!support){must(events.length>0,`${id}/${mode}/${side}: no real hit`);equal(new Set(events).size,events.length,'repeated impact');}
      const settled={allies:hp(c.allies),enemies:hp(c.targets)};advance(c,1.4);equal({allies:hp(c.allies),enemies:hp(c.targets)},settled,'replayed hit/heal');
      results.push({id,mode,side,name:profile.name,effect:profile.effect,cost:100,pauseStable:true,renderReadOnly:true,bodyKind,bodySheet:body.sheet,bodyCell:body.args.slice(0,4),bodyTransform:body.transform,declaredNativePoses:asset?.frames||0,acceptedDamageEvents:events.length,guardAtImpact,allyHpDelta:c.allies.map((a,i)=>a.currentHp-beforeAllies[i]),enemyHpDelta:c.targets.map((a,i)=>a.currentHp-beforeEnemies[i]),impactUnique:true});c.engine.dispose?.();
    }
    const projectileCases=[];
    for(const id of ids.filter(id=>supportsTracked(resolveMeleeSuper(hero(id)))))for(const side of ['player','opponent']){
      const c=make('fighter',side,id),profile=resolveMeleeSuper(c.actor),target=c.targets[0],events=[];target.x=c.actor.x+c.facing*Math.min(500,profile.range-60);const hpBefore=target.currentHp,apply=c.engine.applyHit.bind(c.engine);
      c.engine.applyHit=(source,unit,...args)=>{const old=unit.currentHp,r=apply(source,unit,...args);if(source===c.actor&&unit.currentHp<old)events.push(unit);return r;};
      must(commit(c),id+' projectile cast');advance(c,c.actor.action.hitAt-0.01);equal(c.engine.projectiles.length,0,'projectile before hitAt');equal(target.currentHp,hpBefore,'damage before launch');
      const action=c.actor.action;c.engine.updateActions(action.hitAt-action.elapsed);equal(c.engine.projectiles.length,1,id+' missing physical projectile');const shot=c.engine.projectiles[0],expected=getVisual({actor:c.actor,profile,action,target,height:142});must(expected.nativeMuzzleActive,id+' native muzzle inactive');
      must(Math.abs(shot.x-expected.origin.x)<1e-9&&Math.abs(shot.y-expected.origin.y)<1e-9,id+' generic spawn replaced native opening');equal(target.currentHp,hpBefore,'launch damaged distant target');
      const nativeSpawn={x:shot.x,y:shot.y,point:expected.nativeAnchor.nativePoint,col:expected.nativeAnchor.col,renderScale:expected.nativeAnchor.renderScale};equal(nativeSpawn.col,2,'launch must use the actual release pose');
      c.actor.x+=c.facing*600;c.actor.facing=-c.facing;target.guarding=true;target.facing=-c.facing;
      const paintFlight=()=>{fxCalls.length=0;c.engine.drawProjectile(ctx,shot);return JSON.stringify(fxCalls);};const first=paintFlight(),state=snap(c),s=142/72;
      must(fxCalls.some(call=>call[0]==='moveTo'&&Math.abs(call[1]-(shot.x-c.facing*6*s))<1e-9&&call[2]===shot.y),id+' flying art does not follow real collision coordinates');
      for(let i=0;i<100;i++){c.engine.updateProjectiles(0);equal(paintFlight(),first,'paused projectile draw changed');}equal(snap(c),state,'paused projectile mutated simulation');
      let limit=240;while(!c.engine.projectileVisualImpacts.length&&limit-->0)advance(c,1/120);must(limit>0,id+' shot missed');equal(events.length,1,id+' repeated hit');must(target.guard<100,'incoming guard direction lost');
      const impact=c.engine.projectileVisualImpacts[0],hpAfter=target.currentHp;fxCalls.length=0;c.engine.drawProjectileImpact(ctx,impact);const beforeMove=JSON.stringify(fxCalls);target.x-=c.facing*500;target.y-=200;target.currentHp=0;fxCalls.length=0;c.engine.drawProjectileImpact(ctx,impact);equal(JSON.stringify(fxCalls),beforeMove,'stored impact followed moved/dead target');
      advance(c,2);equal(events.length,1,'replayed collision');equal(c.engine.projectiles.length,0,'unexpired shot');equal(c.engine.projectileVisualImpacts.length,0,'unexpired impact');
      projectileCases.push({id,side,nativeSpawn,committedFacing:c.facing,acceptedDamage:hpBefore-hpAfter,acceptedDamageEvents:events.length,guarded:true,pauseStable:true,realFlightCoordinates:true,impact:{x:impact.x,y:impact.y},movedDeadTargetPreservesContact:true});c.engine.dispose?.();
    }
    return {urls,sources,results,projectileCases,bodyKinds:results.reduce((a,r)=>(a[r.bodyKind]=(a[r.bodyKind]||0)+1,a),{}),gridImage:grid.toDataURL('image/png')};
  });
  assert.equal(result.results.length,120);assert.deepEqual(result.bodyKinds,{native32:120});assert.equal(result.projectileCases.length,24);assert.deepEqual(errors,[]);
  assert.ok(failedRequests.every(r=>r.url.startsWith('https://fonts.googleapis.com/')&&r.error==='net::ERR_TUNNEL_CONNECTION_FAILED'));assert.equal(consoleErrors.length,failedRequests.length);
  await fs.writeFile(path.join(directory,'native-super-runtime-grid.png'),Buffer.from(result.gridImage.split(',')[1],'base64'));const {gridImage:_gridImage,...report}=result;
  await fs.writeFile(path.join(directory,'native-super-runtime.json'),JSON.stringify({passed:true,method:'Chromium actual engines imported from exact compiled component URLs, controlled authoritative stepping and real native/base PNG drawing. No keyboard UI flow claim.',...report,errors,failedRequests,consoleErrors,source1to1Verified:false},null,2)+'\n');
  console.log(JSON.stringify({passed:true,cases:result.results.length,physicalProjectileCases:result.projectileCases.length,bodyKinds:result.bodyKinds,errors}));
}catch(error){await fs.writeFile(path.join(directory,'native-super-runtime-failure.json'),JSON.stringify({error:error.message,stack:error.stack,errors,failedRequests,consoleErrors},null,2)+'\n');throw error;}finally{await browser.close();}
