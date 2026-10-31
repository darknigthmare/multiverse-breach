import { resolveSourceScene, isSourceScenePropVisible } from './sourceSceneStages.js';
import { getSourceSceneDanger } from './sourceSceneEncounter.js';
import { HEROES_DB } from './heroes.js';
import { drawPixelSprite } from './renderer.js';

const JUNGLE_HUNTER_HERO = HEROES_DB.find(hero => hero.id==='predator' && hero.universe==='Predator');
const GREYBACK_ELDER_HERO = HEROES_DB.find(hero => hero.id==='greyback_yautja' && hero.universe==='Predator');

/** Distinct in-engine schematics; existing actor PNGs are reused, not certified 1:1. */
export function drawSourceSceneBackdrop(ctx, stage, width, height) {
  const d=resolveSourceScene(stage);
  if(!d)return false;
  ctx.save();
  ctx.fillStyle=d.material==='prey'?'#1c3029':d.material==='ship'?'#0b1616':d.material==='jungle'?'#0d2019':d.material==='shuttle'?'#17292e':d.material==='silo'?'#211d18':'#151e28';
  ctx.fillRect(0,0,width,height);
  ctx.strokeStyle=d.material==='prey'?'#527752':d.material==='ship'?'#3b625d':d.material==='jungle'?'#376243':d.material==='shuttle'?'#819d9f':'#52606c';ctx.lineWidth=2;
  for(let x=0;x<width;x+=Math.max(50,width/9)) {
    ctx.beginPath();ctx.moveTo(x,70);ctx.lineTo(width/2+(x-width/2)*0.75,height);ctx.stroke();
  }
  ctx.fillStyle=d.accent;ctx.fillRect(0,72,width,3);
  ctx.fillStyle=d.material==='prey'?'#24432f':d.material==='ship'?'#14312d':d.material==='jungle'?'#18372a':d.material==='silo'?'#30291f':'#263845';ctx.fillRect(0,76,width,28);
  ctx.fillStyle=d.accent;ctx.font='bold 12px monospace';ctx.textAlign='center';
  ctx.fillText(d.name,width/2,94);
  if(d.material==='hangar') {
    // Suspended gantry and cargo framing, not the LV-426 hive texture.
    ctx.strokeStyle='#6f7c84';ctx.lineWidth=5;
    ctx.strokeRect(width*0.13,112,width*0.74,height*0.57);
    for(let i=0;i<6;i++){ctx.fillStyle=i%2?'#292b29':d.accent;ctx.fillRect(width*0.13+i*width*0.124,112,width*0.062,8);}
  } else if(d.material==='shuttle') {
    ctx.strokeStyle='#aac2c4';ctx.lineWidth=10;ctx.strokeRect(width*0.08,112,width*0.84,height*0.60);
    ctx.fillStyle='#080f17';ctx.fillRect(width*0.38,114,width*0.24,22);
  } else if(d.material==='prey') {
    // 1719 forest clearing and familiar bog, not the 1987 rainforest or a
    // generic Yautja ship. Schematic staging; real reference-art review pending.
    ctx.fillStyle='#27412c';
    for(let i=0;i<13;i++){
      const x=width*((i+0.2)/13),top=105+(i%4)*9;
      ctx.fillRect(x,top,7+(i%3)*3,height*0.54);
      ctx.beginPath();ctx.ellipse(x+5,top+25,25+(i%4)*9,32,0,0,Math.PI*2);ctx.fill();
    }
    ctx.fillStyle='#5e6641';ctx.fillRect(0,height*0.72,width,height*0.28);
    ctx.fillStyle='#364a3c';
    ctx.beginPath();ctx.ellipse(width*0.70,height*0.79,width*0.15,height*0.12,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#9b9873';ctx.lineWidth=3;
    ctx.beginPath();ctx.ellipse(width*0.70,height*0.79,width*0.15,height*0.12,0,0,Math.PI*2);ctx.stroke();
  } else if(d.material==='ship') {
    // Original geometric ship schematic, NOT a captured or approved film background.
    ctx.fillStyle='#132722';ctx.fillRect(width*0.11,114,width*0.78,height*0.58);
    ctx.strokeStyle='#618e7e';ctx.lineWidth=5;
    for(let i=0;i<7;i++){
      const x=width*(0.13+i*0.12);
      ctx.beginPath();ctx.moveTo(x,116);ctx.lineTo(x-width*0.04,height*0.75);ctx.stroke();
    }
    ctx.fillStyle='#070e0f';ctx.fillRect(width*0.24,height*0.26,width*0.55,height*0.31);
    for(let i=0;i<8;i++){
      const x=width*(0.29+i*0.062),y=height*(0.37+(i%2)*0.06);
      ctx.fillStyle=i===3?'#879d91':'#bbac7f';
      ctx.beginPath();ctx.ellipse(x,y,7+(i%3)*2,9,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#15211e';ctx.fillRect(x-5,y+7,10,4);
    }
    ctx.fillStyle='#8fae9e';ctx.font='bold 10px monospace';ctx.textAlign='center';
    ctx.fillText('LOST TRIBE · TROPHY CHAMBER',width/2,126);
  } else if(d.material==='jungle') {
    // River, canopy and log are schematic staging; no unverified film stills.
    ctx.fillStyle='#122c20';
    for(let i=0;i<14;i++) {
      const x=width*(i/13);
      ctx.fillRect(x,102+(i%3)*7,10+(i%3)*5,height*0.48);
      ctx.beginPath();ctx.arc(x+5,125+(i%3)*7,28+(i%4)*7,0,Math.PI*2);ctx.fill();
    }
    ctx.fillStyle='rgba(36,89,112,0.6)';
    ctx.beginPath();ctx.moveTo(0,height*0.78);ctx.lineTo(width*0.54,height*0.65);
    ctx.lineTo(width,height*0.84);ctx.lineTo(width,height);ctx.lineTo(0,height);ctx.fill();
    ctx.strokeStyle='#8c6c38';ctx.lineWidth=9;
    ctx.beginPath();ctx.moveTo(width*0.57,height*0.43);ctx.lineTo(width*0.76,height*0.43);ctx.stroke();
  } else {
    ctx.strokeStyle='#ab7133';ctx.lineWidth=3;
    ctx.beginPath();ctx.ellipse(width/2,height*0.60,width*0.25,height*0.22,0,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='#d9aa54';ctx.font='10px monospace';ctx.fillText('BLACK MESA · ROCKET TEST',width/2,123);
  }
  ctx.restore();return true;
}

export function drawSourceSceneBoard(ctx, engine, animTime, drawEnemy) {
  const s=engine.sourceScene;
  if(!s)return;
  const d=s.definition;
  ctx.save();
  const cell=(x,y,fill)=>{ctx.fillStyle=fill;engine.traceCellPath(ctx,x,y,3);ctx.fill();};
  const label=(p,value,color='#e5edf0')=>{const at=engine.gridToScreen(p.x,p.y);ctx.fillStyle=color;ctx.textAlign='center';ctx.font='bold 9px monospace';ctx.fillText(value,at.x,at.y+5);};
  for(const prop of d.field.props) {
    // Avoid prematurely drawing a mask, trophy or other story prop before its beat.
    if(!isSourceScenePropVisible(s,prop))continue;
    // Sarii returns Naru's rope hatchet during the duel before the bog.
    // Move the protected dog marker near her; art remains schematic.
    const p=d.material==='prey'&&prop.id==='sarii'&&s.sariiHatchetReturned
      ? {...prop,x:4,y:3} : prop;
    const at=engine.gridToScreen(p.x,p.y),bounds=engine.getCellBounds(p.x,p.y,4);
    cell(p.x,p.y,p.kind==='pit'||p.kind==='airlock'?'#04090c':p.kind==='refuge'?'#213e41':'#344049');
    ctx.strokeStyle=p.kind==='refuge'?'#6cc8bc':d.accent;ctx.lineWidth=2;
    engine.traceCellPath(ctx,p.x,p.y,5);ctx.stroke();
    if(p.kind==='ladder')for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(at.x-7,bounds.top+5+i*6);ctx.lineTo(at.x+7,bounds.top+5+i*6);ctx.stroke();}
    if(p.kind==='valve'){ctx.beginPath();ctx.arc(at.x,at.y-9,9,0,Math.PI*2);ctx.stroke();}
    if(p.kind==='generator'){ctx.fillStyle='#549d74';ctx.fillRect(at.x-11,at.y-14,22,7);}
    if(p.kind==='mud'||p.kind==='river'){
      ctx.fillStyle=p.kind==='mud'?'#4c4e35':'#2e7790';
      ctx.beginPath();ctx.ellipse(at.x,at.y-8,15,6,0,0,Math.PI*2);ctx.fill();
    }
    if(p.kind==='trap'){
      ctx.strokeStyle='#b98e4f';ctx.lineWidth=5;
      ctx.beginPath();ctx.moveTo(at.x-13,at.y-11);ctx.lineTo(at.x+12,at.y-22);ctx.stroke();
    }
    if(p.kind==='companion'){
      // Provisional dog-shaped tactical marker; Sarii's 2022 PNG remains open.
      ctx.fillStyle='#c8ac82';
      ctx.beginPath();ctx.ellipse(at.x-2,at.y-11,10,5,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(at.x+10,at.y-16,6,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.moveTo(at.x+8,at.y-20);ctx.lineTo(at.x+9,at.y-29);
      ctx.lineTo(at.x+15,at.y-21);ctx.fill();
      ctx.lineWidth=2;ctx.strokeStyle='#c8ac82';
      for(const dx of [-8,4]){
        ctx.beginPath();ctx.moveTo(at.x+dx,at.y-9);ctx.lineTo(at.x+dx,at.y+1);ctx.stroke();
      }
    }
    if(p.kind==='exit'&&d.material==='prey'){
      ctx.fillStyle='#e5d69c';
      ctx.beginPath();ctx.moveTo(at.x-10,at.y-14);ctx.lineTo(at.x+1,at.y-21);
      ctx.lineTo(at.x+1,at.y-7);ctx.fill();
    }
    if(p.kind==='herb'){
      ctx.strokeStyle='#94a64d';ctx.lineWidth=2;
      for(let i=-1;i<=1;i++){
        ctx.beginPath();ctx.moveTo(at.x,at.y);ctx.lineTo(at.x+i*7,at.y-16);ctx.stroke();
        ctx.fillStyle='#d5a44e';ctx.beginPath();ctx.arc(at.x+i*7,at.y-16,3,0,Math.PI*2);ctx.fill();
      }
    }
    if(p.kind==='bog'){
      ctx.fillStyle='#40472f';ctx.beginPath();
      ctx.ellipse(at.x,at.y-4,18,7,0,0,Math.PI*2);ctx.fill();
    }
    if(p.kind==='bone_mask'||p.kind==='target'){
      ctx.strokeStyle='#e5d7b7';ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(at.x,at.y-12,9,Math.PI,2*Math.PI);ctx.stroke();
      ctx.fillStyle='#ead5b8';ctx.fillRect(at.x-7,at.y-12,14,5);
    }
    if(p.kind==='trophy'){
      if(d.material==='prey'){
        // The 1719 proof is one severed Feral head, not the Lost Tribe's
        // 1990 wall of multiple skulls. Schematic only; artwork still pending.
        ctx.fillStyle='#7f715d';ctx.beginPath();
        ctx.ellipse(at.x,at.y-11,11,12,0,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle='#c6bca4';ctx.lineWidth=3;
        ctx.beginPath();ctx.moveTo(at.x-8,at.y-12);ctx.lineTo(at.x-12,at.y-3);
        ctx.moveTo(at.x+8,at.y-12);ctx.lineTo(at.x+12,at.y-3);ctx.stroke();
      } else {
        // The 1990 Lost Tribe ship has a separate wall of skull trophies.
        ctx.fillStyle='#b9c9b2';
        for(let i=0;i<3;i++){
          ctx.beginPath();ctx.ellipse(at.x-11+i*11,at.y-12,5,6,0,0,Math.PI*2);ctx.fill();
          ctx.fillStyle='#0c1615';ctx.fillRect(at.x-14+i*11,at.y-14,6,3);
          ctx.fillStyle='#b9c9b2';
        }
      }
    }
    if(p.kind==='net' && s.done.has('net') && !s.done.has('cut_net')){
      ctx.strokeStyle='#d8f0c8';ctx.lineWidth=1;
      for(let i=-14;i<15;i+=7){
        ctx.beginPath();ctx.moveTo(at.x+i,at.y-25);ctx.lineTo(at.x+i+10,at.y+4);ctx.stroke();
      }
    }
    if(p.kind==='fire'&&s.done.has('lure')){
      ctx.fillStyle='#ffae44';ctx.beginPath();ctx.moveTo(at.x,at.y-27);
      ctx.lineTo(at.x-9,at.y-8);ctx.lineTo(at.x+9,at.y-8);ctx.fill();
    }
    label(p,p.label);
  }
  for(const c of d.commands.filter(c=>!c.repeatable)) {
    if(s.done.has(c.id))continue;
    const ready=c.requires.every(r=>s.done.has(r));
    if(ready){cell(c.cell.x,c.cell.y,'rgba(69,201,158,0.25)');label(c.cell,'◆','#baffd6');}
  }
  for(const p of getSourceSceneDanger(s)){cell(p.x,p.y,'rgba(255,80,48,0.42)');label(p,'!','#fff0c9');}
  const threatVisible=!s.complete && !(d.material==='hangar'&&s.done.has('outer')) && !(d.material==='shuttle'&&s.done.has('harpoon')) && !(d.material==='silo'&&s.done.has('ignite')) && !(d.material==='jungle'&&s.done.has('crush')) && !(d.material==='ship'&&s.done.has('duel')) && !(d.material==='prey'&&s.done.has('redirect'));
  let pos=d.threatCell;
  if(d.material==='hangar'&&s.done.has('grapple'))pos=s.done.has('inner')?{x:6,y:3}:{x:s.actor.gridX+0.4,y:s.actor.gridY};
  if(d.material==='shuttle'&&s.done.has('flush'))pos={x:5,y:2};
  if(d.material==='jungle'&&s.done.has('wash'))pos=s.done.has('bait')?{x:6,y:3}:{x:6,y:4};
  if(d.material==='prey'&&s.done.has('take_mask'))pos=s.done.has('bog')?{x:6,y:4}:{x:6,y:3};
  const at=engine.gridToScreen(pos.x,pos.y);
  if(threatVisible && d.material==='jungle' && JUNGLE_HUNTER_HERO) {
    // Reuse the existing 1987-character sheet (not an independently approved boss bitmap).
    ctx.save();ctx.globalAlpha=s.done.has('disrupt')?1:0.58;
    drawPixelSprite(ctx,at.x,at.y,{...JUNGLE_HUNTER_HERO,state:'idle'},animTime,-1,92,'tactics');
    ctx.restore();
  } else if(threatVisible && s.threat && drawEnemy) {
    drawEnemy(ctx,at.x,at.y,s.threat,animTime,-1,d.material==='hangar'?112:76);
    if(d.material==='prey'&&s.done.has('take_mask')){
      // This one-frame pre-existing Feral image may still show its original
      // mask: display a clear review marker, NEVER imply maskless art exists.
      ctx.fillStyle='#f2d29d';ctx.font='bold 9px monospace';ctx.textAlign='center';
      ctx.fillText('MASK OFF · VARIANT PENDING',at.x,at.y-83);
    }
  } else if(threatVisible && d.material==='silo') {
    // Three schematic stalks; authored animation/GoldSrc model comparison is still pending.
    for(let i=0;i<3;i++) {
      const dx=(i-1)*20, bend=Math.sin(animTime*0.025+i)*10;
      ctx.strokeStyle=['#8c6043','#ae7952','#694f39'][i];ctx.lineWidth=9;
      ctx.beginPath();ctx.moveTo(at.x+dx,at.y+8);ctx.quadraticCurveTo(at.x+dx+bend,at.y-45,at.x+dx-12+bend,at.y-85+i*9);ctx.stroke();
      ctx.fillStyle='#cb9b6d';ctx.beginPath();ctx.ellipse(at.x+dx-12+bend,at.y-85+i*9,10,5,0,0,Math.PI*2);ctx.fill();
    }
  }
  if(d.material==='hangar'&&s.done.has('loader')&&!s.done.has('release')) {
    const a=engine.gridToScreen(s.actor.gridX,s.actor.gridY);
    ctx.strokeStyle='#edba33';ctx.lineWidth=4;ctx.strokeRect(a.x-20,a.y-48,40,46);
    for(const sign of [-1,1]) {ctx.beginPath();ctx.moveTo(a.x+sign*20,a.y-32);ctx.lineTo(a.x+sign*32,a.y-13);ctx.lineTo(a.x+sign*40,a.y-20);ctx.stroke();}
  }
  if(s.done.has('ignite')&&d.material==='silo') {
    cell(4,3,'#e9ac3e');label({x:4,y:3},'CLEAR','#fff0bd');
  }
  if(d.material==='jungle'&&s.done.has('crush')) {
    cell(6,2,'rgba(207,163,85,0.45)');
    label({x:6,y:2},'LOG DOWN','#fff0bd');
  }
  if(d.material==='prey'&&s.done.has('sarii_hatchet')&&!s.done.has('bog')){
    label({x:5,y:3},'HATCHET BACK','#c8deab');
  }
  if(d.material==='prey'&&s.done.has('set_mask')){
    // The guidance ray follows the player's selected target. Do not draw an
    // automatically perfect lock or an invented plasma shot from the mask.
    const mount=d.field.props.find(p=>p.id==='mask_mount');
    const bog=d.field.props.find(p=>p.id==='bog');
    const aim=s.maskAimTarget;
    if(mount && aim && !s.done.has('redirect')){
      const origin=engine.gridToScreen(mount.x,mount.y);
      const target=engine.gridToScreen(aim.x,aim.y);
      const aligned=bog && aim.x===bog.x && aim.y===bog.y;
      ctx.save();ctx.setLineDash([5,4]);
      ctx.strokeStyle=aligned?'#b4f3d4':'#e77762';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(origin.x,origin.y-24);
      ctx.lineTo(target.x,target.y-16);ctx.stroke();
      ctx.setLineDash([]);ctx.beginPath();ctx.arc(target.x,target.y-16,5,0,Math.PI*2);ctx.stroke();
      ctx.restore();
      if(s.done.has('bog')&&aligned)label(bog,'BOLT TARGET','#ffb885');
    } else if(mount && !s.done.has('redirect')){
      label(mount,'AIM REQUIRED','#f7d8a3');
    }
  }
  if(d.material==='ship' && s.done.has('duel') && !s.complete) {
    // The elder is a non-hostile witness; a pre-existing unverified sprite.
    if(GREYBACK_ELDER_HERO){
      const elder=engine.gridToScreen(7,2);
      drawPixelSprite(ctx,elder.x,elder.y,{...GREYBACK_ELDER_HERO,state:'idle'},animTime,-1,76,'tactics');
    }
    if(s.done.has('gift'))label({x:6,y:2},'1715','#ffdda0');
    if(s.done.has('ignite'))label({x:6,y:4},'IGNITION','#ff9c6b');
  }
  ctx.restore();
}
