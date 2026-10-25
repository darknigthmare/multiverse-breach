import { beginBrowserReceipt, closeBrowserWithReceipt } from './aragorn-browser-receipt.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=process.env.ARAGORN_BROWSER_OUTPUT || 'docs/combat-fidelity-wave14-2026-10-25/aragorn-sources/browser';
await fs.mkdir(base,{recursive:true});
const receipt = await beginBrowserReceipt(import.meta.url);
let observedReport = null;
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1280,height:1100}}),pageErrors=[],consoleErrors=[],failedRequests=[];
page.on('pageerror',error=>pageErrors.push(error.message));
page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
page.on('requestfailed',request=>failedRequests.push({url:request.url(),error:request.failure()?.errorText}));
try {
 await page.goto('http://127.0.0.1:5188/',{waitUntil:'networkidle'});
 const result=await page.evaluate(async()=>{
  const compiled=await(await fetch('/src/components/GameCanvas.jsx')).text();
  const engineUrl=compiled.match(/from "(\/src\/game\/engineSmash\.js[^"]*)"/)[1];
  const rendererUrl=compiled.match(/from "(\/src\/game\/renderer\.js[^"]*)"/)[1];
  const {EngineSmash}=await import(engineUrl);
  const {drawPixelSprite,preloadSpriteSheetSrcs}=await import(rendererUrl);
  const {HEROES_DB}=await import('/src/game/heroes.js');
  const {getMeleeAnimationManifest,getMeleeAnimationSheetSources}=await import('/src/game/melee/meleeAnimationManifest.js');
  const {getHeroMeleeAnimationFrame}=await import('/src/game/spriteAssets.js');
  const {tickMeleeCombatActor,performMeleeLedgeAction}=await import('/src/game/melee/meleeCombatRuntime.js');
  const aragorn=HEROES_DB.find(hero=>hero.id==='aragorn_lotr'),manifest=getMeleeAnimationManifest('aragorn_lotr');
  const sources=getMeleeAnimationSheetSources('aragorn_lotr');preloadSpriteSheetSrcs(sources);
  await Promise.all(sources.map(src=>new Promise((resolve,reject)=>{const image=new Image();image.onload=resolve;image.onerror=reject;image.src=src;})));
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const canvas=document.createElement('canvas');canvas.width=1040;canvas.height=20*160;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#131b23';ctx.fillRect(0,0,canvas.width,canvas.height);
  const rawDraw=ctx.drawImage.bind(ctx),draws=[],cases=[];
  ctx.drawImage=function(image,...args){const m=ctx.getTransform();draws.push({sheet:new URL(image.src).pathname,args,m:{a:m.a,b:m.b,c:m.c,d:m.d,e:m.e,f:m.f}});return rawDraw(image,...args);};
  function require(value,message){if(!value)throw new Error(message);}
  function snap(actor){return JSON.stringify({x:actor.x,y:actor.y,vx:actor.vx,vy:actor.vy,state:actor.state,hp:actor.currentHp,ledge:actor.ledge,visual:actor.meleeLedgeVisual});}
  let row=0,attachedDraws=0;
  for(const camp of ['player','opponent'])for(const side of ['left','right'])for(const action of ['hold','climb','drop','jump','attack']){
   const enemyData={monsters:[aragorn],bosses:[],customRoster:[aragorn]};
   const stage={universe:'The Lord of the Rings',mode:'Smash',difficulty:'Training',skipPreMatchInTraining:true,disableItems:true,disableHazards:true,customBattle:{singleRoster:true,opponentControl:'p2'}};
   const engine=new EngineSmash(960,540,[aragorn],enemyData,{add:()=>{}},()=>{},()=>{},stage);
   const actor=camp==='player'?engine.heroes[0]:engine.enemies[0];
   const platform={x1:300,x2:650,y:320,type:'stone'};engine.platforms=[platform];
   Object.assign(actor,{x:side==='left'?292:658,y:346,vx:0,vy:1,currentHp:100,maxHp:100,state:'fall',stateElapsed:.3,action:null,meleePresentation:null,presentationPhase:null,ledge:null,ledgeRegrabTimer:0,ledgeActionTimer:0,facing:side==='left'?-1:1});
   engine.applyPhysics(actor);
   require(actor.state==='ledgeCatch'&&actor.ledge?.platform===platform&&actor.ledge.side===side,`${camp}/${side} must physically catch`);
   require(actor.x===(side==='left'?293:657)&&actor.y===346&&actor.vx===0&&actor.vy===0,'Catch snap must be exact');
   const captured={state:actor.state,x:actor.x,y:actor.y,side:actor.ledge.side};
   for(let step=0;step<10;step++)tickMeleeCombatActor(actor,1/60);
   require(actor.state==='ledgeHang','Catch timer must naturally enter hang');
   const held=snap(actor);engine.applyPhysics(actor);require(snap(actor)===held,'Hanging physics must remain fixed');
   ctx.fillStyle='#c8dfd8';ctx.font='12px monospace';ctx.fillText(`${camp} / ${side} / ${action}`,12,row*160+15);
   const columns=new Set(),contacts=[];
   function drawFrame(column){
    const before=snap(actor),frame=getHeroMeleeAnimationFrame(actor,actor.stateElapsed*1000);
    const shift=column*140;
    const translated={...actor,x:(side==='left'?195:420)+shift,y:row*160+75,ledge:actor.ledge?{side,platform:{x1:202+shift,x2:413+shift,y:row*160+49}}:null,meleeLedgeVisual:actor.meleeLedgeVisual?{side,platform:{x1:202+shift,x2:413+shift,y:row*160+49}}:null};
    const n=draws.length;drawPixelSprite(ctx,translated.x,translated.y,translated,1000,translated.facing,100,'melee');
    require(draws.length===n+1,'One native actor draw required');
    const actual=draws.at(-1);require(actual.sheet.startsWith('/sprites/generated/melee-aragorn-wave14/'),'Physical flow must use Aragorn full45');
    require(snap(actor)===before,'Renderer must preserve real actor physics');
    columns.add(actual.args[0]/256);
    if(frame.anchor.attachToLedge===true&&['ledgeCatch','ledgeHang','ledgeClimb'].includes(actor.state)){
     const px=actual.args[4]+frame.anchor.x*actual.args[6],py=actual.args[5]+frame.anchor.y*actual.args[7];
     const worldX=actual.m.a*px+actual.m.c*py+actual.m.e,worldY=actual.m.b*px+actual.m.d*py+actual.m.f;
     const target=(side==='left'?202:413)+shift;
     ctx.strokeStyle='#69ced1';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(target,row*160+49);ctx.lineTo(target+(side==='left'?60:-60),row*160+49);ctx.stroke();
     require(Math.abs(worldX-target)<1e-8&&Math.abs(worldY-(row*160+49))<1e-8,'Measured visible glove must attach to the real visual platform edge');
     attachedDraws++;contacts.push({column:actual.args[0]/256,handWorld:{x:worldX,y:worldY}});
    }
   }
   if(action==='hold'){
    for(let i=0;i<4;i++){actor.stateElapsed=(i+.01)/manifest.animations.ledgeHang.fps;drawFrame(i);}
   }else{
    require(performMeleeLedgeAction(actor,action),`${action} must be accepted from a real hang`);
    const actionStart={state:actor.state,x:actor.x,y:actor.y,vx:actor.vx,vy:actor.vy,regrab:actor.ledgeRegrabTimer};
    if(action==='climb'){
     require(actor.state==='ledgeClimb'&&!actor.ledge&&actor.meleeLedgeVisual?.platform===platform,'Climb must retain live visual edge without physical hanging');
     for(let i=0;i<4;i++){actor.stateElapsed=(i+.01)/manifest.animations.ledgeClimb.fps;drawFrame(i);}
     for(let i=0;i<22;i++)tickMeleeCombatActor(actor,1/60);
     require(actor.state==='idle'&&actor.y===platform.y,'Climb must finish on platform');
    }else{
     drawFrame(0);
     if(action==='drop'||action==='jump'){
      require(actor.ledgeRegrabTimer>0,'Leaving edge must set regrab cooldown');
      require(action==='drop'?actor.vy>0:actor.vy<0,'Drop and jump must have opposite vertical velocity');
      const exitState=actor.state,naturalExit=[];
      for(let step=0;step<40&&actor.state===exitState;step++){
       const frame=getHeroMeleeAnimationFrame(actor,actor.stateElapsed*1000);
       naturalExit.push({step,state:actor.state,elapsed:actor.stateElapsed,column:frame.col,x:actor.x,y:actor.y,vx:actor.vx,vy:actor.vy,regrab:actor.ledgeRegrabTimer});
       if(!columns.has(frame.col))drawFrame(frame.col);
       tickMeleeCombatActor(actor,1/60);actor.vy+=engine.gravity;engine.applyPhysics(actor);
       require(!actor.ledge,'Leaving edge must not immediately regrab');
      }
      require([...columns].sort().join(',')==='0,1,2,3','Natural physical ledge exit must display four poses');
      require(actor.y!==actionStart.y&&actor.vy>actionStart.vy,'Physics and gravity must continue during exit poses');
      require(['jumpRise','jumpApex','fall','land'].includes(actor.state),'Air locomotion or landing must resume after exit');
      captured.naturalExit=naturalExit;
     }else require(actor.action?.id==='ledgeAttack','Edge attack must use actual melee action');
    }
    captured.actionStart=actionStart;
   }
   cases.push({camp,side,action,captured,columns:[...columns].sort(),contacts,final:{state:actor.state,x:actor.x,y:actor.y,vx:actor.vx,vy:actor.vy},physicsPreservedByRendering:true});row++;
  }
  return {passed:true,cases,caseCount:cases.length,attachedDraws,pageErrors:[],engineUrl,rendererUrl,capture:canvas.toDataURL('image/png'),source1to1Verified:false};
 });
 assert.equal(result.caseCount,20);assert.equal(result.attachedDraws,32);assert.deepEqual(pageErrors,[]);
 assert.ok(failedRequests.every(request=>request.url.startsWith('https://fonts.googleapis.com/')&&request.error==='net::ERR_TUNNEL_CONNECTION_FAILED'));
 assert.equal(consoleErrors.length,failedRequests.length);
 await fs.writeFile(`${base}/aragorn-physical-ledge.png`,Buffer.from(result.capture.split(',')[1],'base64'));
 const {capture:_capture,...report}=result;Object.assign(report,{pageErrors,consoleErrors,failedRequests});
 observedReport=report;
} catch(error){await fs.writeFile(`${base}/aragorn-physical-ledge-failure.json`,JSON.stringify({error:error.message,stack:error.stack,pageErrors,consoleErrors,failedRequests},null,2)+'\n');throw error;}finally{await closeBrowserWithReceipt(browser,receipt,observedReport,`${base}/aragorn-physical-ledge-result.json`,Boolean(process.env.ARAGORN_BROWSER_OUTPUT));}
