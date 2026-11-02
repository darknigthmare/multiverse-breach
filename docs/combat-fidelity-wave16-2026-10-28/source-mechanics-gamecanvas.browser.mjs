import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const require=createRequire(import.meta.url),{chromium}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const docs='docs/combat-fidelity-wave16-2026-10-28',harness=docs+'/source-mechanics-gamecanvas.browser.mjs';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex'),startedAt=new Date().toISOString();
const final=process.argv.includes('--after-production-freeze');
if(!final&&!process.argv.includes('--preliminary'))throw new Error('Choose --preliminary or --after-production-freeze');
const prefix='source-mechanics-gamecanvas-'+(final?'final':'preliminary');
const freezePath=docs+'/production-freeze.json';let freezeSha256=null;
if(final){const bytes=await fs.readFile(freezePath),freeze=JSON.parse(bytes);assert.equal(freeze.productionFrozen,true);assert.ok(Date.parse(freeze.createdAt)<=Date.parse(startedAt));freezeSha256=hash(bytes);}
async function sourceFiles(directory){return(await Promise.all((await fs.readdir(directory,{withFileTypes:true})).map(file=>file.isDirectory()?sourceFiles(path.join(directory,file.name)):/\.(?:js|jsx|json)$/.test(file.name)?[path.join(directory,file.name)]:[]))).flat();}
const trackedSource=[...await sourceFiles('src/game'),'src/components/GameCanvas.jsx','src/components/RpgTargetingPanel.jsx',harness];
const subjectIds=new Set(['oddworld_abe_possession','akane_tsunemori','cuphead_mugman','cuphead_ms_chalice','hakumen_bb','shinya_kogami','noble_six']);
const subjectPngs=[];
for(const file of trackedSource.filter(file=>file.endsWith('.generated.json'))){
 const parsed=JSON.parse(await fs.readFile(file));for(const asset of Array.isArray(parsed.entries)?parsed.entries:[])if(subjectIds.has(asset.heroId||asset.sourceHeroId||asset.id)&&typeof asset.sheet==='string'&&asset.sheet.startsWith('/'))subjectPngs.push('public'+asset.sheet);
}
const tracked=[...new Set([...trackedSource,...subjectPngs,'public/sprites/generated/bosses/oddworld/slig.png','public/sprites/generated/source-protection-entities-wave16/shield-pal.png'])].sort();
const inputs=()=>Promise.all(tracked.map(async file=>({path:file,sha256:hash(await fs.readFile(file))})));
const initialInputs=await inputs(),rows=[],artifacts=[],pageErrors=[];
const cases=[
 {kind:'possession',heroId:'oddworld_abe_possession',label:'POSSESSION',effect:'control'},
 {kind:'paralyzer',heroId:'akane_tsunemori',label:'PARALYZER',effect:'control'},
 {kind:'invulnerability',heroId:'cuphead_mugman',label:'INVULNÉRABLE',effect:'guard'},
 {kind:'shield',heroId:'cuphead_ms_chalice',label:'SHIELD PAL',effect:'guard'},
 {kind:'counter',heroId:'hakumen_bb',label:'CONTRE CONDITIONNEL',effect:'guard'}
];
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});let page,browserClosed=false;
try{
 page=await browser.newPage({viewport:{width:1440,height:1100}});page.on('pageerror',error=>pageErrors.push(error.message));
 for(const sample of cases)for(const side of['player','enemy']){
  const item={...sample,side},slug=`${sample.heroId}-${side}`;
  await page.goto(process.env.BROWSER_BASE_URL||'http://127.0.0.1:5188/',{waitUntil:'domcontentloaded'});
  const mounted=await page.evaluate(async item=>{
   const component=await(await fetch('/src/components/GameCanvas.jsx')).text(),main=await(await fetch('/src/main.jsx')).text();
   const reactUrl=component.match(/from ["'](\/node_modules\/\.vite[^/]*\/deps\/react\.js[^"']*)["']/)?.[1],domUrl=main.match(/from ["'](\/node_modules\/\.vite[^/]*\/deps\/react-dom_client\.js[^"']*)["']/)?.[1];
   if(!reactUrl||!domUrl)throw new Error('Application React singleton URLs unavailable');
   const react=await import(reactUrl),React=react.default||react,dom=await import(domUrl),{createRoot}=dom.default||dom;
   const engineUrl=component.match(/from ["'](\/src\/game\/engineRpg\.js[^"']*)["']/)?.[1];if(!engineUrl)throw new Error('Compiled GameCanvas engine URL unavailable');
   const{EngineRpg}=await import(engineUrl),{default:GameCanvas}=await import('/src/components/GameCanvas.jsx'),{HEROES_DB}=await import('/src/game/heroes.js'),{ENEMIES_DB}=await import('/src/game/enemies.js');
   const hero=id=>{const h=HEROES_DB.find(value=>value.id===id);if(!h)throw new Error(id);return h;};
   const own=[hero(item.heroId)],other=[hero(item.kind==='paralyzer'?'shinya_kogami':'noble_six'),...(item.kind==='possession'?[hero('shinya_kogami')]:[])];
   const slig=item.kind==='possession'?structuredClone(ENEMIES_DB.Oddworld.monsters.find(body=>body.id==='oddworld_slig')):null;
   if(slig&&(!slig.possessionEligible||slig.sourceEnemyId!=='oddworld_slig'))throw new Error('Historical typed Slig absent');
   const sourceBody=slig?JSON.stringify(slig):null;
   const update=EngineRpg.prototype.update,execute=EngineRpg.prototype.executeRpgAction;
   EngineRpg.prototype.update=function(...args){
    if(!this.sourceMechanicsPrepared){this.sourceMechanicsPrepared=true;this.autoBattle=false;this.enemyGlobalRecovery=100000;
     const allies=item.side==='player'?this.heroes:this.enemies,targets=item.side==='player'?this.enemies:this.heroes,actor=allies[0],facing=item.side==='player'?1:-1;
     if(slig){const old=targets[0],body={...slig,stats:{hp:slig.hp,atk:slig.atk,def:slig.def||5,spd:slig.spd||5},battleId:old.battleId.replace(/noble_six/,'oddworld_slig'),runtimeId:old.runtimeId.replace(/noble_six/,'oddworld_slig'),maxHp:slig.hp,currentHp:slig.hp,atb:100,specialCharge:0,cooldown:0,state:'idle',stateTimer:0,actionPending:false,facing:-facing,statusEffects:{infected:0,glitched:0,radiated:0}};targets[0]=body;}
     for(const unit of[...this.heroes,...this.enemies]){unit.atb=-100000;unit.specialCharge=100;unit.state='idle';unit.actionPending=false;unit.cooldown=0;unit.statusEffects={infected:0,glitched:0,radiated:0};}
     actor.x=actor.homeX=item.side==='player'?400:640;actor.y=actor.homeY=350;actor.atb=100;actor.facing=facing;
     targets.forEach((unit,index)=>{unit.x=unit.homeX=actor.x+facing*(180+index*90);unit.y=unit.homeY=350;});
     if(slig)targets[0].atb=99.99;
     if(item.kind==='paralyzer')targets[0].paralyzerEligible=true;
     window.sourceMechanics={engine:this,actor,allies,targets,item,sourceBody,events:[],ready:true};
    }return update.apply(this,args);
   };
   EngineRpg.prototype.executeRpgAction=function(context,...args){const result=execute.call(this,context,...args);if(result&&((context.actor===window.sourceMechanics?.actor&&context.abilityType==='special')||context.profile?.action?.sourceSligRifle))this.setPaused(true);return result;};
   const enemies=item.side==='enemy'?own:other,players=item.side==='enemy'?other:own;
   const customBattle={singleRoster:true,opponentControl:'p2',items:false,enemyData:{monsters:enemies,bosses:[],customRoster:enemies}};
   const stage={id:760016,name:'Mécaniques source RPG · scène contrôlée',universe:own[0].universe,mode:'RPG',difficulty:'Training',disableItems:true,customBattle};
   const props={lang:'fr',playerProfile:{name:'Contrôle W16'},activeTeam:players.map(h=>h.id),stage,heroLevels:{},equippedGear:{},equippedEventItems:{},heroTalents:{},heroSkins:{},completedStages:[],hiddenUniverses:[],disabledAssets:{},dedicatedSession:true};
   document.getElementById('root').style.display='none';const host=document.body.appendChild(document.createElement('div'));
   function Review(){const[paused,setPaused]=React.useState(false);return React.createElement(React.Fragment,null,React.createElement('button',{type:'button',onClick:()=>setPaused(value=>!value)},paused?'Reprendre le contrôle':'Pause de contrôle'),React.createElement(GameCanvas,{...props,sessionPaused:paused}));}
   window.sourceMechanicsRoot=createRoot(host);window.sourceMechanicsRoot.render(React.createElement(Review));return{engineUrl,reactUrl,domUrl,actor:item.heroId,historicalSligRecord:sourceBody};
  },item);
  await page.waitForFunction(()=>window.sourceMechanics?.ready);
  const command=page.locator('button.btn-special').filter({hasText:new RegExp(item.kind==='possession'?'CHANT DE POSSESSION':item.kind==='paralyzer'?'PARALYZER':item.kind==='invulnerability'?'SUPER ART II':item.kind==='shield'?'SHIELD PAL':'YUKIKAZE','i')});
  await command.waitFor({timeout:25000});await command.click();await page.getByRole('button',{name:'Confirmer les cibles'}).waitFor();
  const preview=await page.evaluate(()=>{const c=window.sourceMechanics,t=c.engine.getTargetingState();return{effect:t.effect,profile:t.profile,eligible:t.eligibleTargets,estimates:t.estimates,atb:c.actor.atb,charge:c.actor.specialCharge,valid:t.valid};});
  assert.equal(preview.effect,item.effect);assert.equal(preview.atb,100);assert.equal(preview.charge,100);assert.equal(preview.valid,true);assert.equal(preview.eligible.length,1);assert.ok(preview.estimates.every(e=>e.amount===0));
  const panelText=await page.getByRole('region',{name:'Ciblage RPG'}).innerText();assert.ok(panelText.includes(item.label));
  const selectionPath=`${docs}/${prefix}-${slug}-selection.png`;await page.screenshot({path:selectionPath,fullPage:true});artifacts.push({path:selectionPath,sha256:hash(await fs.readFile(selectionPath)),bytes:(await fs.stat(selectionPath)).size});
  await page.getByRole('button',{name:'Annuler sans coût'}).click();assert.deepEqual(await page.evaluate(()=>{const{actor}=window.sourceMechanics;return[actor.atb,actor.specialCharge,actor.cooldown];}),[100,100,0]);
  await command.click();await page.getByRole('button',{name:'Confirmer les cibles'}).click();await page.getByRole('button',{name:'Pause de contrôle'}).click();await page.waitForFunction(()=>window.sourceMechanics.engine.paused===true);
  const observed=await page.evaluate(async item=>{
   const c=window.sourceMechanics,{engine,actor,allies,targets}=c;
   const units=()=>[...engine.heroes,...engine.enemies].map(unit=>({id:unit.battleId,hp:unit.currentHp,x:unit.x,y:unit.y,heroTeam:engine.heroes.includes(unit)}));
   const baseline=units(),snap=()=>JSON.stringify({actor,allies,targets,queue:engine.actionQueue}),pause=snap();for(let n=0;n<90;n++)engine.update();if(snap()!==pause)throw new Error('Paused gameplay changed');
   const apply=engine.applyRpgImpact.bind(engine);engine.applyRpgImpact=(source,profile,accepted,...args)=>{const before=units(),result=apply(source,profile,accepted,...args);if(source===actor)c.events.push({effect:profile.effect,targetIds:accepted.map(a=>a.battleId),before,after:units()});return result;};
   const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d');
   let companionTrace=null,traceCompanion=()=>{},restoreCompanion=null;
   if(item.kind==='shield'){
    const catalog=await import('/src/game/combat/sourceProtectionEntityCatalogWave16.js');
    const asset=catalog.getSourceProtectionEntityAssetsWave16().find(asset=>asset.id==='shield-pal-wave16');if(!asset)throw new Error('Autonomous Shield Pal asset absent');
    const loaded=new Image();loaded.src=asset.sheet;await loaded.decode();
    engine.draw(ctx,0,'fr');await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    const original=ctx.drawImage.bind(ctx);restoreCompanion=()=>{ctx.drawImage=original;};
    companionTrace={sheet:asset.sheet,sourcePngSha256:asset.sha256,actualDraws:[],duplicateDuringNativeCast:false,tick:0,getFrame:catalog.getSourceProtectionEntityFrameWave16};
    ctx.drawImage=(image,...args)=>{
     if(new URL(image.src).pathname===asset.sheet){const row=args[1]/256,col=args[0]/256;if(!Number.isInteger(row)||!Number.isInteger(col)||args[2]!==256||args[3]!==256)throw new Error('Wrong autonomous Pal source cell');
      const duringNativeCast=actor.state==='special'&&actor.rpgSpecialDurationTicks>0&&actor.stateTimer>0&&!actor.sourceProtectionEntityWave16?.absorbedOnce;
      if(duringNativeCast)companionTrace.duplicateDuringNativeCast=true;
      companionTrace.actualDraws.push({tick:companionTrace.tick,phase:['arrival','guard','absorb','departure'][row],row,col,index:row*4+col,sheet:asset.sheet,facing:Math.sign(ctx.getTransform().a),duringNativeCast});
     }return original(image,...args);
    };
    traceCompanion=()=>{const before=snap();engine.draw(ctx,0,'fr');if(before!==snap())throw new Error('Companion draw mutated gameplay');};
    traceCompanion();
   }
   const trajectory=[];const step=count=>{for(let n=0;n<count;n++){engine.setPaused(false);engine.update();engine.setPaused(true);if(companionTrace)companionTrace.tick++;traceCompanion();if(item.kind==='counter')trajectory.push({x:actor.x,targetX:targets[0].x,targetHp:targets[0].currentHp});}};
   let steps=0;while(c.events.length===0&&steps++<100)step(1);if(c.events.length!==1)throw new Error('Exactly one initial source impact required');
   if(item.kind==='possession'&&targets[0].sourceControlWave16.phase==='channeling')step(1);
   const statusPause=snap();for(let n=0;n<90;n++)engine.update();if(snap()!==statusPause)throw new Error('Armed source status changed while paused');
   const armed={cost:{atb:actor.atb,charge:actor.specialCharge},protection:actor.sourceProtectionWave16?{...actor.sourceProtectionWave16}:null,control:targets[0].sourceControlWave16?{...targets[0].sourceControlWave16}:null,units:units()};
   if(JSON.stringify(armed.units)!==JSON.stringify(baseline.map(unit=>({...unit}))))throw new Error('Source effect changed HP, stored camp or physical position');
   const {getCharacterAnimationFrame}=await import('/src/game/combat/characterAnimationCatalog.js'),{getHeroSpriteSheetSrc}=await import('/src/game/spriteAssets.js');
   const actorFrame=getCharacterAnimationFrame(engine.getRpgPresentationActor(actor)),actorSheet=actorFrame?.asset.sheet||getHeroSpriteSheetSrc(actor,'rpg');
   const sheets=[actorSheet,...targets.map(unit=>unit.sourceEnemyId==='oddworld_slig'?'/sprites/generated/bosses/oddworld/slig.png':getHeroSpriteSheetSrc(unit,'rpg'))];
   await Promise.all(sheets.map(async sheet=>{const image=new Image();image.src=sheet;await image.decode();}));
   engine.draw(ctx,0,'fr');await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   const actualDraw=ctx.drawImage.bind(ctx),draws=[];ctx.drawImage=(image,...args)=>{draws.push({sheet:new URL(image.src).pathname,sourceCell:args.slice(0,4),destination:args.slice(4)});return actualDraw(image,...args);};
   const beforeDraw=snap();engine.draw(ctx,0,'fr');let image=canvas.toDataURL('image/png');engine.draw(ctx,0,'fr');ctx.drawImage=actualDraw;if(snap()!==beforeDraw)throw new Error('Draw mutated gameplay');
   if(!draws.some(draw=>draw.sheet===actorSheet))throw new Error('Real actor PNG missing');
   if(item.kind==='possession'&&!draws.some(draw=>draw.sheet==='/sprites/generated/bosses/oddworld/slig.png'))throw new Error('Real historical Slig PNG missing');
   const incoming=[];const incomingAttack=()=>{const attacker=targets[0],opposite=item.side==='player'?'enemy':'player';attacker.atb=100;attacker.state='idle';attacker.actionPending=false;engine.enemyActionLock=false;engine.enemyGlobalRecovery=0;
    const before=units();engine.setPaused(false);const accepted=engine.beginTargeting(attacker,'simple',opposite)&&engine.confirmTargeting();engine.setPaused(true);if(!accepted)throw new Error('Real incoming command rejected');step(30);incoming.push({accepted,before,after:units()});};
   let mechanicalProof={};
   if(item.kind==='paralyzer'){if(armed.control?.kind!=='paralyzer'||armed.control.remaining!==1.5)throw new Error('Paralyzer duration/source mismatch');step(100);if(targets[0].sourceControlWave16.active)throw new Error('Paralyzer did not expire');mechanicalProof={expired:true,noHpChange:targets[0].currentHp===baseline.find(u=>u.id===targets[0].battleId).hp,noLift:targets[0].y===350};}
   if(item.kind==='possession'){if(armed.control?.phase!=='active'||armed.control.kind!=='possession')throw new Error('Possession channel incomplete');mechanicalProof={historicalBody:targets[0].sourceEnemyId,storedCampUnchanged:units().find(u=>u.id===targets[0].battleId).heroTeam===baseline.find(u=>u.id===targets[0].battleId).heroTeam,commandState:engine.getRpgPossessionCommandState(item.side)};}
   if(item.kind==='invulnerability'){if(armed.protection?.remaining!==4.85)throw new Error('Source duration not4.85');incomingAttack();if(actor.currentHp!==baseline.find(u=>u.id===actor.battleId).hp)throw new Error('Invulnerability failed');step(300);if(actor.sourceProtectionWave16.active)throw new Error('Invulnerability did not expire');incomingAttack();mechanicalProof={blockedFirst:true,expired:true,damageAfterExpiry:actor.currentHp<baseline.find(u=>u.id===actor.battleId).hp};if(!mechanicalProof.damageAfterExpiry)throw new Error('No damage after invulnerability expired');}
   if(item.kind==='shield'){
    step(240);if(!actor.sourceProtectionWave16.active||actor.sourceProtectionWave16.charges!==1||actor.sourceProtectionEntityWave16?.phase!=='guard')throw new Error('Shield or companion incorrectly timed out');
    const guardPause=snap();for(let n=0;n<90;n++)engine.update();if(snap()!==guardPause)throw new Error('Persistent companion changed during pause');
    traceCompanion();image=canvas.toDataURL('image/png');
    incomingAttack();if(actor.currentHp!==baseline.find(u=>u.id===actor.battleId).hp||actor.sourceProtectionWave16.active)throw new Error('Shield did not consume exactly one hit');
    step(60);const lastDrawCount=companionTrace.actualDraws.length;traceCompanion();
    const removedAfterDeparture=!actor.sourceProtectionEntityWave16.active&&companionTrace.getFrame(actor,72)===null&&companionTrace.actualDraws.length===lastDrawCount;
    incomingAttack();const actualFrameIndices=[...new Set(companionTrace.actualDraws.map(draw=>draw.index))].sort((a,b)=>a-b),actualPhases=[...new Set(companionTrace.actualDraws.map(draw=>draw.phase))];
    mechanicalProof={persistedFourSeconds:true,blockedFirst:true,damageSecond:actor.currentHp<baseline.find(u=>u.id===actor.battleId).hp,
      protectionCompanion:{assetId:'shield-pal-wave16',sheet:companionTrace.sheet,sourcePngSha256:companionTrace.sourcePngSha256,actualFrameIndices,phases:actualPhases,
        persistentBeforeHit:true,pauseStable:true,removedAfterDeparture,noDuplicateDuringNativeCast:!companionTrace.duplicateDuringNativeCast,actualDraws:companionTrace.actualDraws}};
    if(!mechanicalProof.damageSecond||!removedAfterDeparture||companionTrace.duplicateDuringNativeCast||JSON.stringify(actualFrameIndices)!==JSON.stringify(Array.from({length:16},(_,i)=>i))||JSON.stringify(actualPhases)!==JSON.stringify(['arrival','guard','absorb','departure']))throw new Error('Real sixteen-frame companion lifecycle failed');
   }
   if(item.kind==='counter'){const targetHp=targets[0].currentHp,startX=actor.x;incomingAttack();let counterSteps=0;while(targets[0].currentHp===targetHp&&counterSteps++<45)step(1);mechanicalProof={armedWithZeroDamage:true,incomingAccepted:incoming.length===1,ownerHpUnchanged:actor.currentHp===baseline.find(u=>u.id===actor.battleId).hp,retaliationDamagedOriginalAttacker:targets[0].currentHp<targetHp,physicalDash:trajectory.some(point=>Math.abs(point.x-startX)>1),boundedDash:trajectory.every((point,index)=>!index||Math.abs(point.x-trajectory[index-1].x)<=140/6+.001),trajectory,confirmedContact:!!actor.rpgSpecialVisual?.visualConfirmedContact,startX,endX:actor.x};if(!mechanicalProof.ownerHpUnchanged||!mechanicalProof.retaliationDamagedOriginalAttacker||!mechanicalProof.physicalDash||!mechanicalProof.boundedDash||!mechanicalProof.confirmedContact)throw new Error('Conditional physical counter failed');engine.draw(ctx,0,'fr');image=canvas.toDataURL('image/png');const native=getCharacterAnimationFrame(engine.getRpgPresentationActor(actor));mechanicalProof.effectFrame=native?{assetId:native.asset.id,sheet:native.asset.sheet,row:native.row,col:native.col}:null;}
   restoreCompanion?.();
   return{steps,armed,baseline,bodyEvidence:{actorSheet,kind:actorFrame?'native32':'base16',realPngDraw:true,draws},events:c.events,incoming,mechanicalProof,pauseStable:true,renderReadOnly:true,image};
  },item);
  assert.equal(observed.armed.cost.charge,0);assert.ok(observed.armed.cost.atb<100);assert.equal(observed.events[0].effect,item.effect);
  if(final)assert.match(observed.bodyEvidence.actorSheet,/combat-character-(?:animations|corrections)-wave16-part-[abc]/);
  const effectPath=`${docs}/${prefix}-${slug}-effect.png`;await fs.writeFile(effectPath,Buffer.from(observed.image.split(',')[1],'base64'));delete observed.image;artifacts.push({path:effectPath,sha256:hash(await fs.readFile(effectPath)),bytes:(await fs.stat(effectPath)).size});
  if(item.kind==='possession'){
   await page.getByRole('button',{name:'Reprendre le contrôle'}).click();await page.waitForFunction(()=>window.sourceMechanics.engine.paused===false);
   const rifle=page.getByRole('button',{name:'Tir du fusil du Slig possédé'});await rifle.waitFor();await rifle.click();await page.getByRole('button',{name:'Confirmer les cibles'}).waitFor();
   const rifleSelection=await page.evaluate(()=>{const c=window.sourceMechanics,t=c.engine.getTargetingState();return{actorId:t.actorId,name:t.abilityName,targets:t.eligibleTargets.map(t=>t.id),ownerCharge:c.actor.specialCharge,bodyAtb:c.targets[0].atb};});
   assert.equal(rifleSelection.ownerCharge,0);assert.equal(rifleSelection.bodyAtb,100);assert.match(rifleSelection.name,/fusil du Slig/);
   await page.getByRole('button',{name:'Annuler sans coût'}).click();
   await rifle.click();await page.getByRole('button',{name:'Confirmer les cibles'}).click();
   await page.getByRole('button',{name:'Pause de contrôle'}).click();await page.waitForFunction(()=>window.sourceMechanics.engine.paused===true);
   const rifleProof=await page.evaluate(()=>{
    const c=window.sourceMechanics,body=c.targets[0],victim=c.targets[1],before=victim.currentHp,engine=c.engine;
    if(body.atb!==0||c.actor.specialCharge!==0)throw new Error('Rifle must consume the Slig ATB, not charge Abe again');
    for(let n=0;n<15;n++){engine.setPaused(false);engine.update();engine.setPaused(true);}
    if(!(victim.currentHp<before)||body.rpgPossessedRifleLastReleaseWave16?.nativePoint?.col!==2)throw new Error('Actual Slig rifle release missing');
    const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d'),actual=ctx.drawImage.bind(ctx),draws=[];
    ctx.drawImage=(image,...args)=>{if(new URL(image.src).pathname==='/sprites/generated/bosses/oddworld/slig.png')draws.push(args.slice(0,4));return actual(image,...args);};
    engine.draw(ctx,0,'fr');ctx.drawImage=actual;
    if(!draws.some(cell=>cell[0]===512&&cell[1]===256&&cell[2]===256&&cell[3]===256))throw new Error('Slig native attack cell2 is not really drawn');
    return{atb:body.atb,ownerCharge:c.actor.specialCharge,before,after:victim.currentHp,nativeRelease:body.rpgPossessedRifleLastReleaseWave16,sourceCells:draws,image:canvas.toDataURL('image/png')};
   });
   await fs.writeFile(effectPath,Buffer.from(rifleProof.image.split(',')[1],'base64'));delete rifleProof.image;
   Object.assign(artifacts.find(artifact=>artifact.path===effectPath),{sha256:hash(await fs.readFile(effectPath)),bytes:(await fs.stat(effectPath)).size});
   await page.getByRole('button',{name:'Reprendre le contrôle'}).click();await page.waitForFunction(()=>window.sourceMechanics.engine.paused===false);
   await page.getByRole('button',{name:'Libérer le Slig'}).click();
   assert.equal(await page.evaluate(()=>window.sourceMechanics.targets[0].sourceControlWave16.active),false);
   observed.mechanicalProof.actualGameCanvasRifleSelection=rifleSelection;observed.mechanicalProof.actualGameCanvasRifleShot=rifleProof;observed.mechanicalProof.actualGameCanvasRelease=true;
  }
  rows.push({item,mounted,preview,panelText,...observed});await page.evaluate(()=>window.sourceMechanicsRoot?.unmount());console.log(JSON.stringify({completed:rows.length,kind:item.kind,side}));
 }
 const finalInputs=await inputs(),stable=JSON.stringify(initialInputs)===JSON.stringify(finalInputs);if(final)assert.equal(stable,true);assert.deepEqual(pageErrors,[]);assert.equal(rows.length,10);assert.equal(artifacts.length,20);
 await browser.close();browserClosed=true;const browserClosedAt=new Date().toISOString(),finishedAt=new Date().toISOString();const report={passed:true,preliminary:!final,harness,harnessSha256:hash(await fs.readFile(harness)),startedAt,finishedAt,finalProductionFreezeClaimed:final,productionFreezePath:final?freezePath:null,productionFreezeSha256:freezeSha256,
  method:'Ten real GameCanvas special-command selections/cancellations/confirmations, both camps. Real typed historical Slig replaces only its fixture roster slot; Kogami is explicitly Sibyl-eligible in this controlled scene. Production updates, attacks, collisions, costs and statuses are unchanged by the harness. Incoming protection/counter tests execute real EngineRpg simple commands after preparing their actual bodies/ATB within range. The Slig fixture starts at99.99 ATB with ordinary opposing recovery held; its own natural post-channel ATB tick reaches100, without the possession granting charge.',
  actualGameCanvasFlows:10,sourceMechanicFlows:10,selectionCaptures:10,effectCaptures:10,allInitialCostsOnce:true,allPausesStable:rows.every(r=>r.pauseStable),allRendersReadOnly:rows.every(r=>r.renderReadOnly),artifacts,rows,sourceFiles:initialInputs,sourceFilesAfter:finalInputs,productionInputsStableDuringRun:stable,pageErrors,allBrowserWindowsClosed:true,browserClosedAt,source1to1Verified:false};
 await fs.writeFile(`${docs}/${prefix}-result.json`,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:true,flows:10,artifacts:20,stable,pageErrors}));
}catch(error){await fs.writeFile(`${docs}/${prefix}-failure.json`,JSON.stringify({startedAt,error:String(error),pageErrors,rows,artifacts,browserClosed},null,2)+'\n');if(page&&!browserClosed)await page.screenshot({path:`${docs}/${prefix}-failure.png`,fullPage:true});throw error;}
finally{if(!browserClosed)await browser.close();}
