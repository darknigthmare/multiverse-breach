import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const docs='docs/combat-fidelity-wave17-2026-11-02',folder=docs+'/capture-npc',harness=folder+'/rpg-smash.browser.mjs';
const final=process.argv.includes('--after-production-freeze'),startedAt=new Date().toISOString();
if(!final&&!process.argv.includes('--preliminary'))throw Error('Choose --preliminary or --after-production-freeze');
const prefix=folder+'/rpg-smash-'+(final?'final':'preliminary'),sha=bytes=>createHash('sha256').update(bytes).digest('hex');
let freezeSha256=null;if(final){const b=await fs.readFile(docs+'/production-freeze.json'),f=JSON.parse(b);assert.equal(f.productionFrozen,true);assert.ok(Date.parse(f.createdAt)<=Date.parse(startedAt));freezeSha256=sha(b);}
async function files(dir){return(await Promise.all((await fs.readdir(dir,{withFileTypes:true})).map(f=>f.isDirectory()?files(dir+'/'+f.name):/\.(?:js|jsx|json)$/.test(f.name)?[dir+'/'+f.name]:[]))).flat();}
const tracked=[...await files('src/game'),'src/components/GameCanvas.jsx','src/components/RpgTargetingPanel.jsx','public/sprites/generated/source-capture-enemies-wave17/black-cat-gang-kitten.png',folder+'/rpg-smash.browser.mjs'];
const snapshot=()=>Promise.all(tracked.sort().map(async path=>({path,sha256:sha(await fs.readFile(path))})));
const beforeInputs=await snapshot(),rows=[],artifacts=[],errors=[];await fs.mkdir(folder,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});let page,closed=false;
try{
 page=await browser.newPage({viewport:{width:1440,height:1050}});page.on('pageerror',e=>errors.push(e.message));
 for(const mode of ['RPG','Smash'])for(const side of ['player','enemy']){
  await page.goto(process.env.BROWSER_BASE_URL||'http://127.0.0.1:5297/',{waitUntil:'domcontentloaded'});
  const mount=await page.evaluate(async({mode,side})=>{
   const c=await(await fetch('/src/components/GameCanvas.jsx')).text(),m=await(await fetch('/src/main.jsx')).text();
   const reactUrl=c.match(/from ["'](\/node_modules\/\.vite[^/]*\/deps\/react\.js[^"']*)["']/)?.[1],domUrl=m.match(/from ["'](\/node_modules\/\.vite[^/]*\/deps\/react-dom_client\.js[^"']*)["']/)?.[1];
   const engineUrl=c.match(new RegExp('from ["\'](\\/src\\/game\\/engine'+(mode==='RPG'?'Rpg':'Smash')+'\\.js[^"\']*)["\']'))?.[1];
   if(!reactUrl||!domUrl||!engineUrl)throw Error('Exact GameCanvas production modules unavailable');
   const R=await import(reactUrl),React=R.default||R,D=await import(domUrl),{createRoot}=D.default||D;
   const mod=await import(engineUrl),Engine=mod[mode==='RPG'?'EngineRpg':'EngineSmash'];
   const {default:GameCanvas}=await import('/src/components/GameCanvas.jsx'),{HEROES_DB}=await import('/src/game/heroes.js');
   const catalog=await import('/src/game/combat/sourceCaptureEnemyCatalogWave17.js'),{initializeMeleeActorRuntime}=await import('/src/game/melee/meleeCombatRuntime.js');
   const waffle=HEROES_DB.find(h=>h.id==='tail_concerto_waffle'),placeholder=HEROES_DB.find(h=>h.id==='cloud_ff7'),npc=structuredClone(catalog.CANONICAL_CAPTURE_NPC_WAVE17);
   const update=Engine.prototype.update,commit=Engine.prototype[mode==='RPG'?'executeRpgAction':'triggerMeleeSuper'];
   Engine.prototype.update=function(...args){if(!this.npcReviewPrepared){this.npcReviewPrepared=true;this.autoBattle=false;this.enemyGlobalRecovery=100000;
    const allies=side==='player'?this.heroes:this.enemies,opponents=side==='player'?this.enemies:this.heroes,actor=allies[0],old=opponents[0],facing=side==='player'?1:-1;
    // Only initial scenario construction: one exact NPC record, with its own
    // statistics, identity, four actions and runtime. No hero powers are copied.
    let body={...npc,stats:{...npc.stats},maxHp:npc.hp,currentHp:npc.hp,runtimeId:'w17-kit-runtime-'+side,battleId:'w17-kit-battle-'+side,atb:-100000,specialCharge:0,cooldown:0,state:'idle',stateTimer:0,actionPending:false,facing:-facing,statusEffects:{infected:0,glitched:0,radiated:0},vx:0,vy:0,isLeader:true};
    if(mode==='Smash')body=initializeMeleeActorRuntime(body);
    opponents[0]=body;const platform=mode==='Smash'?this.platforms.filter(p=>p.x2-p.x1>=240).sort((a,b)=>(b.x2-b.x1)-(a.x2-a.x1))[0]:null;if(mode==='Smash'&&!platform)throw Error('No actual shared support platform in this scene');const ground=platform?platform.y:350;
    actor.x=actor.homeX=platform?(platform.x1+platform.x2)/2-facing*70:side==='player'?400:640;actor.y=actor.homeY=ground;actor.facing=facing;actor.atb=100;actor.specialCharge=100;actor.state='idle';actor.action=null;actor.actionPending=false;actor.cooldown=0;
    body.x=body.homeX=actor.x+facing*140;body.y=body.homeY=ground;body.stats={...npc.stats};body.currentHp=body.maxHp=npc.hp;
    if(mode==='RPG'){this.selectedHeroId=this.heroes[0].id;this.selectedEnemyId=this.enemies[0].battleId||this.enemies[0].id;}
    else{this.activeHeroId=this.heroes[0].id;this.activeOpponentId=this.enemies[0].runtimeId||this.enemies[0].id;this.syncPreMatchFromServer(3000);this.completeMeleeIntros();this.preMatchReleaseCueMs=0;actor.state=body.state='idle';}
    window.npcProof={engine:this,actor,npc:body,mode,side,ground,catalog,initialNpcSource:structuredClone(npc),removedPlaceholderId:old.id,ready:true};
   }return update.apply(this,args);};
   Engine.prototype[mode==='RPG'?'executeRpgAction':'triggerMeleeSuper']=function(...args){const result=commit.apply(this,args);if(result)this.setPaused(true);return result;};
   const players=side==='player'?[waffle]:[placeholder],enemies=side==='player'?[npc]:[waffle];
   const stage={id:760017,name:'Capture canonique · scénario contrôlé',universe:'Tail Concerto',mode,difficulty:'Training',disableItems:true,disableHazards:true,customBattle:{singleRoster:true,opponentControl:'p2',items:false,enemyData:{monsters:enemies,bosses:[],customRoster:enemies}}};
   const props={lang:'fr',playerProfile:{name:'Capture source W17'},activeTeam:players.map(h=>h.id),stage,heroLevels:{},equippedGear:{},equippedEventItems:{},heroTalents:{},heroSkins:{},completedStages:[],hiddenUniverses:[],disabledAssets:{},dedicatedSession:true};
   document.getElementById('root').style.display='none';const host=document.body.appendChild(document.createElement('div'));
   function Review(){const[p,setP]=React.useState(false);return React.createElement(React.Fragment,null,React.createElement('button',{onClick:()=>setP(!p)},p?'Reprendre le contrôle':'Pause de contrôle'),React.createElement(GameCanvas,{...props,sessionPaused:p}));}
   window.npcProofRoot=createRoot(host);window.npcProofRoot.render(React.createElement(Review));return{mode,side,engineUrl,reactUrl,domUrl};
  },{mode,side});
  await page.waitForFunction(()=>window.npcProof?.ready);
  const action=mode==='RPG'?async()=>{if(side==='player')await page.locator('button.btn-special').filter({hasText:/BULLE/i}).first().click();else await page.keyboard.press('KeyI');await page.getByRole('button',{name:'Confirmer les cibles'}).waitFor();}:async()=>{await page.keyboard.press(side==='player'?'KeyL':'Numpad3',{delay:90});};
  let panel=null;if(mode==='RPG'){await action();panel=await page.getByRole('region',{name:'Ciblage RPG'}).innerText();assert.ok(panel.includes('CAPTURE NON LÉTALE'));await page.getByRole('button',{name:'Annuler sans coût'}).click();assert.deepEqual(await page.evaluate(()=>{const a=window.npcProof.actor;return[a.atb,a.specialCharge,a.cooldown];}),[100,100,0]);await action();await page.getByRole('button',{name:'Confirmer les cibles'}).click();}else await action();
  await page.waitForFunction(()=>window.npcProof.engine.paused===true&&window.npcProof.actor.specialCharge<100);
  await page.getByRole('button',{name:'Pause de contrôle',exact:true}).click();
  const result=await page.evaluate(async()=>{
   const c=window.npcProof,{engine:e,actor,npc,catalog}=c,canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d');
   const asset=catalog.getSourceCaptureEnemyAssetsWave17()[0],image=new Image();image.src=asset.sheet;await image.decode();
   const units=()=>[...e.heroes,...e.enemies].map(u=>({id:u.battleId||u.runtimeId||u.id,sourceId:u.sourceEnemyId||u.sourceHeroId||u.id,hp:u.currentHp,y:u.y,team:e.heroes.includes(u)?'hero':'enemy'}));
   const start=units(),state=()=>JSON.stringify({units:units(),capture:npc.sourceBubbleCaptureWave17,visual:npc.sourceBubbleCaptureVisualSecondsWave17,release:npc.sourceKittenReleaseSecondsWave17,charge:actor.specialCharge,action:actor.action,queue:e.actionQueue});
   const draw=()=>{const before=state();e.draw(ctx,0,'fr');if(state()!==before)throw Error('Draw mutated simulation state');};
   draw();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
   const original=ctx.drawImage.bind(ctx),trace=[];let tick=0;
   ctx.drawImage=(img,...a)=>{if(new URL(img.src).pathname===asset.sheet){const row=a[1]/256,col=a[0]/256;trace.push({tick,row,col,index:row*4+col,phase:['idle','run','captured','released'][row],facing:Math.sign(ctx.getTransform().a),destination:a.slice(4)});}return original(img,...a);};
   const step=n=>{for(let i=0;i<n;i++){e.setPaused(false);e.update();e.setPaused(true);tick++;draw();}};
   let armedTicks=0;while(!npc.sourceBubbleCaptureWave17?.active&&armedTicks++<100)step(1);
   if(!npc.sourceBubbleCaptureWave17?.active)throw Error('Real UI command never captured canonical NPC');
   const armed=units(),capture={...npc.sourceBubbleCaptureWave17},capturedImage=canvas.toDataURL('image/png');
   const paused=state();for(let i=0;i<90;i++){e.update();draw();}if(state()!==paused)throw Error('Capture/visual/body changed while paused');
   if(npc.currentHp!==start.find(x=>x.sourceId==='tail_concerto_red_vest_kitten').hp||npc.y!==c.ground||capture.inputProxy!==null||capture.changesFaction!==false)throw Error('Capture modified HP, altitude, camp or input ownership: '+JSON.stringify({start,armed,ground:c.ground,capture}));
   let expiry=0;while(npc.sourceBubbleCaptureWave17.active&&expiry++<120)step(1);if(npc.sourceBubbleCaptureWave17.active)throw Error('Capture did not expire');
   step(1);const releasedImage=canvas.toDataURL('image/png');step(36);const after=units();
   ctx.drawImage=original;
   const phases=[...new Set(trace.map(x=>x.phase))],capturedColumns=[...new Set(trace.filter(x=>x.phase==='captured').map(x=>x.col))].sort(),releasedColumns=[...new Set(trace.filter(x=>x.phase==='released').map(x=>x.col))].sort();
   if(JSON.stringify(capturedColumns)!=='[0,1,2,3]'||JSON.stringify(releasedColumns)!=='[0,1,2,3]')throw Error('Actual four captured/released poses were not drawn');
   if(npc.currentHp!==npc.maxHp||after.find(x=>x.sourceId===npc.sourceEnemyId).team!==start.find(x=>x.sourceId===npc.sourceEnemyId).team)throw Error('Release altered NPC health/camp');
   return{mode:c.mode,side:c.side,initialNpcSource:c.initialNpcSource,removedPlaceholderId:c.removedPlaceholderId,bodySheet:asset.sheet,bodySha256:asset.sha256,capture,armedTicks,expiryTicks:expiry,start,armed,after,phases,capturedColumns,releasedColumns,actualDraws:trace,realUiCommand:true,pauseStable:true,renderReadOnly:true,noHpChange:true,noLift:true,noFactionChange:true,noInputProxy:true,capturedImage,releasedImage};
  });
  for(const phase of ['captured','released']){const path=prefix+'-'+mode.toLowerCase()+'-'+side+'-'+phase+'.png';await fs.writeFile(path,Buffer.from(result[phase+'Image'].split(',')[1],'base64'));artifacts.push({path,sha256:sha(await fs.readFile(path))});delete result[phase+'Image'];}
  rows.push({...result,mount,panel});await page.evaluate(()=>{window.npcProofRoot.unmount();window.npcProof.engine.dispose?.();});console.log(mode,side,'PASS');
 }
 assert.equal(rows.length,4);assert.deepEqual(errors,[]);
 const afterInputs=await snapshot(),stable=JSON.stringify(beforeInputs)===JSON.stringify(afterInputs);if(final)assert.equal(stable,true);
 await browser.close();closed=true;assert.equal(browser.isConnected(),false);const browserClosedAt=new Date().toISOString();await fs.writeFile(prefix+'-result.json',JSON.stringify({schemaVersion:1,passed:rows.length===4&&errors.length===0&&(!final||stable),harness,harnessSha256:sha(await fs.readFile(harness)),actualGameCanvasFlows:rows.length,allBrowserWindowsClosed:true,browserClosedAt,startedAt,finishedAt:new Date().toISOString(),productionFreezePath:final?docs+'/production-freeze.json':null,productionFreezeSha256:freezeSha256,preliminary:!final,finalProductionFreezeClaimed:final,source1to1Verified:false,productionInputsStableDuringRun:stable,productionInputsBefore:beforeInputs,productionInputsAfter:afterInputs,flows:rows.length,rows,artifacts,pageErrors:errors,browserClosed:closed},null,2)+'\n');console.log('PASS',rows.length,'actual GameCanvas canonical NPC captures');
}catch(error){await fs.writeFile(prefix+'-failure.json',JSON.stringify({error:error.stack,rows,artifacts,pageErrors:errors},null,2)+'\n');if(page)await page.screenshot({path:prefix+'-failure.png',fullPage:true}).catch(()=>{});throw error;}finally{if(!closed)await browser.close();}
