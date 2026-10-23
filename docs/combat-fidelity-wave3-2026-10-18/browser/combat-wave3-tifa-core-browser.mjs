import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try {
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5188/',{waitUntil:'networkidle'});
 const result=await page.evaluate(async()=>{
  const {drawPixelSprite,preloadSpriteSheetSrcs}=await import('/src/game/renderer.js');
  const {HEROES_DB}=await import('/src/game/heroes.js');
  const {MELEE_STATES}=await import('/src/game/melee/meleeStateMachine.js');
  const {getMeleeAnimationManifest,getMeleeAnimationSheetSources}=await import('/src/game/melee/meleeAnimationManifest.js');
  const {getHeroMeleeAnimationFrame,getHeroSpriteSheetSrc}=await import('/src/game/spriteAssets.js');
  const source=HEROES_DB.find(h=>h.id==='tifa_ff7'), manifest=getMeleeAnimationManifest(source.id);
  if(!manifest||MELEE_STATES.length!==45)throw new Error('Incomplete real Tifa manifest');
  const seifer=HEROES_DB.find(h=>h.id==='seifer_ff8');
  const sources=[...getMeleeAnimationSheetSources('tifa_ff7'),getHeroSpriteSheetSrc(seifer,'melee')];
  preloadSpriteSheetSrcs(sources);
  await Promise.all(sources.map(src=>new Promise((resolve,reject)=>{const i=new Image();i.onload=resolve;i.onerror=reject;i.src=src;})));
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const canvas=document.createElement('canvas');canvas.width=900;canvas.height=600;const ctx=canvas.getContext('2d'),original=ctx.drawImage.bind(ctx),calls=[];
  ctx.drawImage=function(image,...args){const m=ctx.getTransform();calls.push({sheet:new URL(image.src).pathname,args,m:{a:m.a,b:m.b,c:m.c,d:m.d,e:m.e,f:m.f}});return original(image,...args);};
  for(const state of MELEE_STATES)for(const facing of[1,-1])for(let column=0;column<4;column++){
   const actor={...source,id:'tifa-p2',sourceHeroId:source.id,state,stateElapsed:(column+.01)/manifest.animations[state].fps};
   const before=JSON.stringify(actor),n=calls.length,expected=getHeroMeleeAnimationFrame(actor,actor.stateElapsed*1000);
   drawPixelSprite(ctx,450,450,actor,1000,facing,72,'melee');const actual=calls.at(-1);
   if(calls.length!==n+1||actual.sheet!==expected.animation.sheet||actual.args[0]!==expected.col*256||actual.args[1]!==expected.row*256||actual.args[2]!==256||actual.args[3]!==256||Math.sign(actual.m.a)!==facing)throw new Error(JSON.stringify({state,column,facing,actual,expected}));
   if(JSON.stringify(actor)!==before)throw new Error('Render mutated core actor');
  }
  const coreDraws=calls.length;
  for(const side of['left','right'])for(let column=0;column<4;column++){
   const actor={...source,state:'ledgeHang',stateElapsed:(column+.01)/manifest.animations.ledgeHang.fps,x:side==='left'?243:657,y:226,facing:side==='left'?-1:1,ledge:{side,platform:{x1:250,x2:650,y:200}}};
   const before=JSON.stringify(actor),frame=getHeroMeleeAnimationFrame(actor,actor.stateElapsed*1000);
   drawPixelSprite(ctx,actor.x,actor.y,actor,1000,actor.facing,72,'melee');const c=calls.at(-1);
   const px=c.args[4]+frame.anchor.x*256*c.args[6]/256,py=c.args[5]+frame.anchor.y*256*c.args[7]/256;
   const wx=c.m.a*px+c.m.c*py+c.m.e,wy=c.m.b*px+c.m.d*py+c.m.f;
   if(Math.abs(wx-(side==='left'?250:650))>1e-8||Math.abs(wy-200)>1e-8)throw new Error('Native hand misses actual ledge');
   if(JSON.stringify(actor)!==before)throw new Error('Grip render moved physical actor');
  }
  const gripDraws=calls.length-coreDraws;
  for(const [row,state]of['idle','run','attack','hit'].entries())for(const facing of[1,-1])for(let col=0;col<4;col++){
   const actor={...seifer,state,stateElapsed:(col*10+.01)/60},n=calls.length;drawPixelSprite(ctx,450,450,actor,1000,facing,72,'melee');const c=calls.at(-1);
   if(calls.length!==n+1||c.sheet!==getHeroSpriteSheetSrc(actor,'melee')||c.args[0]!==col*256||c.args[1]!==row*256||Math.sign(c.m.a)!==facing)throw new Error('Wrong Seifer base pose');
  }
  return{character:source.id,states:45,distinctCorePoses:180,coreFrameDraws:coreDraws,gripFrameDraws:gripDraws,seiferFrameDraws:calls.length-coreDraws-gripDraws,physicsUnchanged:true};
 });
 assert.equal(result.coreFrameDraws,360);assert.equal(result.gripFrameDraws,8);assert.equal(result.seiferFrameDraws,32);assert.deepEqual(errors,[]);console.log(JSON.stringify({...result,errors}));
}finally{await browser.close();}
