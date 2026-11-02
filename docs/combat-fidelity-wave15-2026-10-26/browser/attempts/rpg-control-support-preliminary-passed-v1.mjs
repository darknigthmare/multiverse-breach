import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const require=createRequire(import.meta.url),{chromium}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const docs='docs/combat-fidelity-wave15-2026-10-26',harness=docs+'/rpg-control-support.browser.mjs';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex'),startedAt=new Date().toISOString();
const final=process.argv.includes('--after-production-freeze');
if(!final&&!process.argv.includes('--preliminary'))throw new Error('Choose --preliminary or --after-production-freeze');
const prefix=final?'rpg-control-support':'rpg-control-support-preliminary';
const freezePath=docs+'/production-freeze.json';let freezeSha256=null;
if(final){const bytes=await fs.readFile(freezePath),freeze=JSON.parse(bytes);assert.equal(freeze.productionFrozen,true);assert.ok(Date.parse(freeze.createdAt)<=Date.parse(startedAt));freezeSha256=hash(bytes);}
async function sourceFiles(directory){const files=await fs.readdir(directory,{withFileTypes:true});return(await Promise.all(files.map(file=>file.isDirectory()?sourceFiles(path.join(directory,file.name)):/\.(?:js|jsx|json)$/.test(file.name)?[path.join(directory,file.name)]:[]))).flat();}
const tracked=[...await sourceFiles('src/game'),'src/components/GameCanvas.jsx','src/components/RpgTargetingPanel.jsx',harness];
const inputs=()=>Promise.all(tracked.map(async file=>({path:file,sha256:hash(await fs.readFile(file))})));
const initialInputs=await inputs(),rows=[],artifacts=[],pageErrors=[];
const cases=[
 {kind:'control',heroId:'borderlands_2_maya_phaselock',slot:'special',ability:'Phaselock de Maya',duration:2.4},
 {kind:'control',heroId:'borderlands_2_maya_phaselock',slot:'secondary',ability:'Prise de Phaselock de Maya',duration:1.2},
 {kind:'heal',heroId:'evolve_val',slot:'special',ability:'Soin du Healing Burst de Val',duration:0}
];
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
let page,browserClosed=false;
try{
 page=await browser.newPage({viewport:{width:1440,height:1100}});page.on('pageerror',error=>pageErrors.push(error.message));
 for(const sample of cases)for(const side of ['player','enemy']){
  const item={...sample,side},slug=`${sample.heroId}-${sample.slot}-${side}`;
  await page.goto(process.env.BROWSER_BASE_URL||'http://127.0.0.1:5188/',{waitUntil:'domcontentloaded'});
  const mounted=await page.evaluate(async item=>{
   const component=await(await fetch('/src/components/GameCanvas.jsx')).text(),main=await(await fetch('/src/main.jsx')).text();
   const reactUrl=component.match(/from ["'](\/node_modules\/\.vite\/deps\/react\.js[^"']*)["']/)?.[1],domUrl=main.match(/from ["'](\/node_modules\/\.vite\/deps\/react-dom_client\.js[^"']*)["']/)?.[1];
   if(!reactUrl||!domUrl)throw new Error('Application React singleton URLs unavailable');
   const react=await import(reactUrl),React=react.default||react,dom=await import(domUrl),{createRoot}=dom.default||dom;
   const engineUrl=component.match(/from ["'](\/src\/game\/engineRpg\.js[^"']*)["']/)?.[1];if(!engineUrl)throw new Error('Compiled GameCanvas engine URL unavailable');
   const{EngineRpg}=await import(engineUrl),{default:GameCanvas}=await import('/src/components/GameCanvas.jsx'),{HEROES_DB}=await import('/src/game/heroes.js');
   const hero=id=>{const h=HEROES_DB.find(value=>value.id===id);if(!h)throw new Error(id);return h;};
   const own=[hero(item.heroId),...(item.kind==='heal'?[hero('evolve_markov'),hero('evolve_maggie')]:[])],other=[hero('noble_six')];
   const update=EngineRpg.prototype.update,execute=EngineRpg.prototype.executeRpgAction;
   EngineRpg.prototype.update=function(...args){
    if(!this.controlSupportPrepared){this.controlSupportPrepared=true;this.autoBattle=false;this.enemyGlobalRecovery=0;
     const allies=item.side==='player'?this.heroes:this.enemies,targets=item.side==='player'?this.enemies:this.heroes,facing=item.side==='player'?1:-1,actor=allies[0];
     for(const unit of [...this.heroes,...this.enemies]){unit.maxHp=5000;unit.currentHp=item.kind==='heal'&&allies.includes(unit)?1500:5000;unit.atb=-100000;unit.specialCharge=100;unit.state='idle';unit.actionPending=false;unit.cooldown=0;unit.statusEffects={infected:0,glitched:0,radiated:0};}
     actor.x=actor.homeX=item.side==='player'?300:740;actor.y=actor.homeY=350;actor.atb=100;actor.facing=facing;
     allies.slice(1).forEach((unit,index)=>{unit.x=unit.homeX=actor.x-facing*[120,330][index];unit.y=unit.homeY=350;});
     targets.forEach((unit,index)=>{unit.x=unit.homeX=actor.x+facing*(180+index*60);unit.y=unit.homeY=350;});
     window.controlSupport={engine:this,actor,allies,targets,item,events:[],ready:true};
    }return update.apply(this,args);
   };
   EngineRpg.prototype.executeRpgAction=function(context,...args){const result=execute.call(this,context,...args);if(result&&context.actor===window.controlSupport?.actor&&context.abilityType===item.slot)this.setPaused(true);return result;};
   const enemies=item.side==='enemy'?own:other,players=item.side==='enemy'?other:own;
   const customBattle={singleRoster:true,opponentControl:'p2',items:false,enemyData:{monsters:enemies,bosses:[],customRoster:enemies}};
   const stage={id:760015,name:'Contrôle RPG · positions de référence',universe:own[0].universe,mode:'RPG',difficulty:'Training',disableItems:true,customBattle};
   const props={lang:'fr',playerProfile:{name:'Contrôle W15'},activeTeam:players.map(h=>h.id),stage,heroLevels:{},equippedGear:{},equippedEventItems:{},heroTalents:{},heroSkins:{},completedStages:[],hiddenUniverses:[],disabledAssets:{},dedicatedSession:true};
   document.getElementById('root').style.display='none';const host=document.body.appendChild(document.createElement('div'));
   function Review(){const[paused,setPaused]=React.useState(false);return React.createElement(React.Fragment,null,React.createElement('button',{type:'button',onClick:()=>setPaused(value=>!value)},paused?'Reprendre le contrôle':'Pause de contrôle'),React.createElement(GameCanvas,{...props,sessionPaused:paused}));}
   window.controlSupportRoot=createRoot(host);window.controlSupportRoot.render(React.createElement(Review));return{engineUrl,reactUrl,domUrl,own:own.map(h=>h.id),opponents:other.map(h=>h.id)};
  },item);
  const command=page.locator(item.slot==='special'?'button.btn-special':'button.btn-action').filter({hasText:new RegExp(item.ability,'i')});await command.waitFor({timeout:25000});await page.waitForFunction(()=>window.controlSupport?.ready);
  const configured=await page.evaluate(()=>{const c=window.controlSupport;return{width:c.engine.width,height:c.engine.height,actor:{id:c.actor.sourceHeroId||c.actor.sourceId||c.actor.id,x:c.actor.x,y:c.actor.y},allies:c.allies.map(a=>({id:a.sourceHeroId||a.sourceId||a.id,x:a.x,y:a.y,hp:a.currentHp})),targets:c.targets.map(a=>({id:a.sourceHeroId||a.sourceId||a.id,x:a.x,y:a.y,hp:a.currentHp}))};});
  await command.click();await page.getByRole('button',{name:'Confirmer les cibles'}).waitFor();
  const preview=await page.evaluate(()=>{const c=window.controlSupport,t=c.engine.getTargetingState();return{effect:t.effect,range:t.profile.range,targets:t.eligibleTargets.map(a=>({name:a.name,side:a.side})),estimates:t.estimates,atb:c.actor.atb,charge:c.actor.specialCharge,cooldown:c.actor.cooldown,valid:t.valid};});
  assert.equal(preview.effect,item.kind);assert.equal(preview.range,item.kind==='control'?480:220);assert.equal(preview.atb,100);assert.equal(preview.charge,100);assert.equal(preview.cooldown,0);assert.equal(preview.valid,true);
  const panel=page.getByRole('region',{name:'Ciblage RPG'}),panelText=await panel.innerText();
  console.log(JSON.stringify({phase:'preview',item,panelText,preview}));
  if(item.kind==='control'){assert.ok(/immobilisation/i.test(panelText));assert.ok(panelText.toLocaleLowerCase('fr-FR').includes(item.duration.toLocaleString('fr-FR')+' s'));assert.equal(preview.targets.length,1);assert.ok(preview.estimates.every(e=>e.amount===0));}
  else{assert.equal(preview.targets.length,2);assert.ok(preview.targets.some(a=>a.name==='Markov'));assert.ok(!preview.targets.some(a=>a.name==='Maggie'));assert.ok(!preview.targets.some(a=>a.name==='Noble Six'));}
  const selectionPath=`${docs}/${prefix}-${slug}-selection.png`;await page.screenshot({path:selectionPath,fullPage:true});artifacts.push({path:selectionPath,sha256:hash(await fs.readFile(selectionPath))});
  await page.getByRole('button',{name:'Annuler sans coût'}).click();assert.deepEqual(await page.evaluate(()=>{const{actor}=window.controlSupport;return[actor.atb,actor.specialCharge,actor.cooldown];}),[100,100,0]);
  await command.click();await page.getByRole('button',{name:'Confirmer les cibles'}).click();await page.getByRole('button',{name:'Pause de contrôle'}).click();await page.waitForFunction(()=>window.controlSupport.engine.paused===true);
  const observed=await page.evaluate(async item=>{
   const c=window.controlSupport,{engine,actor,allies,targets}=c,enemyHp=targets.map(a=>a.currentHp),allyHp=allies.map(a=>a.currentHp);
   const snap=()=>JSON.stringify({actor,allies,targets,queue:engine.actionQueue});const beforePause=snap();for(let n=0;n<80;n++)engine.update();if(snap()!==beforePause)throw new Error('Pause mutated real simulation');
   const apply=engine.applyRpgImpact.bind(engine);engine.applyRpgImpact=(source,profile,units,...args)=>{const before=units.map(a=>a.currentHp),result=apply(source,profile,units,...args);if(source===actor)c.events.push({effect:profile.effect,targetIds:units.map(a=>a.battleId||a.id),before,after:units.map(a=>a.currentHp)});return result;};
   let steps=0;while(c.events.length===0&&steps++<90){engine.setPaused(false);engine.update();engine.setPaused(true);}if(c.events.length!==1)throw new Error('Expected exactly one real impact');
   const atImpact={atb:actor.atb,charge:actor.specialCharge,cooldown:actor.cooldown,allies:allies.map(a=>({id:a.sourceHeroId||a.sourceId||a.id,hp:a.currentHp,guard:a.rpgGuardTicks||0,buff:a.rpgBuffTicks||0})),targets:targets.map(a=>({id:a.sourceHeroId||a.sourceId||a.id,hp:a.currentHp,controlTicks:a.rpgControlTicks||0,x:a.x,y:a.y}))};
   const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d'),state=snap();ctx.fillStyle='#172032';ctx.fillRect(0,0,canvas.width,canvas.height);engine.draw(ctx,0,'fr');const image=canvas.toDataURL('image/png');engine.draw(ctx,0,'fr');if(snap()!==state)throw new Error('Drawing changed gameplay');
   if(item.kind==='control'){if(!targets[0].rpgControlTicks)throw new Error('No real Phaselock');if(JSON.stringify(targets.map(a=>a.currentHp))!==JSON.stringify(enemyHp))throw new Error('Control damaged enemy');}
   else{if(!(allies[0].currentHp>allyHp[0]&&allies[1].currentHp>allyHp[1]&&allies[2].currentHp===allyHp[2]))throw new Error('HealingBurst range failed');if(JSON.stringify(targets.map(a=>a.currentHp))!==JSON.stringify(enemyHp))throw new Error('HealingBurst damaged enemy');}
   const afterImpactHp={allies:allies.map(a=>a.currentHp),targets:targets.map(a=>a.currentHp)};
   for(let n=0;n<200;n++){engine.setPaused(false);engine.update();engine.setPaused(true);}
   const settled={allies:allies.map(a=>a.currentHp),targets:targets.map(a=>a.currentHp)};if(JSON.stringify(settled)!==JSON.stringify(afterImpactHp))throw new Error('Effect replay or unrelated damage');
   if(item.kind==='control'&&targets[0].rpgControlTicks>0)throw new Error('Phaselock did not expire');
   return{steps,atImpact,events:c.events,enemyHp,allyHp,settled,pauseStable:true,renderReadOnly:true,controlExpired:item.kind==='control'?!(targets[0].rpgControlTicks>0):null,image};
  },item);
  assert.equal(observed.events.length,1);assert.equal(observed.atImpact.charge,item.slot==='special'?0:100);if(item.slot==='secondary')assert.ok(observed.atImpact.cooldown>0);
  const impactPath=`${docs}/${prefix}-${slug}-impact.png`;await fs.writeFile(impactPath,Buffer.from(observed.image.split(',')[1],'base64'));delete observed.image;artifacts.push({path:impactPath,sha256:hash(await fs.readFile(impactPath))});
  rows.push({item,mounted,configured,preview,panelText,...observed});await page.evaluate(()=>{window.controlSupportRoot?.unmount();});
  console.log(JSON.stringify({completed:rows.length,hero:item.heroId,slot:item.slot,side,effect:preview.effect,events:observed.events.length}));
 }
 const finalInputs=await inputs(),stable=JSON.stringify(initialInputs)===JSON.stringify(finalInputs);if(final)assert.equal(stable,true);assert.deepEqual(pageErrors,[]);assert.equal(rows.length,6);
 await browser.close();browserClosed=true;
 const report={passed:true,startedAt,finishedAt:new Date().toISOString(),finalProductionFreezeClaimed:final,productionFreezePath:final?freezePath:null,productionFreezeSha256:freezeSha256,method:'Real mounted GameCanvas, visible command/cancel/confirm controls, six real RPG actions in both camps. Setup explicitly positions a real NobleSix within480px for Phaselock and one Evolve ally inside220px plus one outside for HealingBurst; this is a controlled scene, not a promise that every default formation is in range. Core updates/impacts/resources are production methods; paused manual stepping never synthesizes damage, healing or status.',actualGameCanvasFlows:rows.length,controlFlows:rows.filter(r=>r.item.kind==='control').length,healingBurstFlows:rows.filter(r=>r.item.kind==='heal').length,artifacts,rows,sourceFiles:initialInputs,sourceFilesAfter:finalInputs,productionInputsStableDuringRun:stable,pageErrors,allBrowserWindowsClosed:true,browserClosedAt:new Date().toISOString(),source1to1Verified:false};
 await fs.writeFile(`${docs}/${prefix}.json`,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:true,flows:rows.length,artifacts:artifacts.length,stable,pageErrors}));
}catch(error){await fs.writeFile(`${docs}/${prefix}-failure.json`,JSON.stringify({startedAt,error:String(error),pageErrors,rows,artifacts,browserClosed},null,2)+'\n');throw error;}
finally{if(!browserClosed)await browser.close();}
