import { resolveSourceScene } from './sourceSceneStages.js';
import { getSourceSceneDanger } from './sourceSceneEncounter.js';

/** Distinct in-engine schematics; existing actor PNGs are reused, not certified 1:1. */
export function drawSourceSceneBackdrop(ctx, stage, width, height) {
  const d=resolveSourceScene(stage);
  if(!d)return false;
  ctx.save();
  ctx.fillStyle=d.material==='shuttle'?'#17292e':d.material==='silo'?'#211d18':'#151e28';
  ctx.fillRect(0,0,width,height);
  ctx.strokeStyle=d.material==='shuttle'?'#819d9f':'#52606c';ctx.lineWidth=2;
  for(let x=0;x<width;x+=Math.max(50,width/9)) {
    ctx.beginPath();ctx.moveTo(x,70);ctx.lineTo(width/2+(x-width/2)*0.75,height);ctx.stroke();
  }
  ctx.fillStyle=d.accent;ctx.fillRect(0,72,width,3);
  ctx.fillStyle=d.material==='silo'?'#30291f':'#263845';ctx.fillRect(0,76,width,28);
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
  for(const p of d.field.props) {
    const at=engine.gridToScreen(p.x,p.y),bounds=engine.getCellBounds(p.x,p.y,4);
    cell(p.x,p.y,p.kind==='pit'||p.kind==='airlock'?'#04090c':p.kind==='refuge'?'#213e41':'#344049');
    ctx.strokeStyle=p.kind==='refuge'?'#6cc8bc':d.accent;ctx.lineWidth=2;
    engine.traceCellPath(ctx,p.x,p.y,5);ctx.stroke();
    if(p.kind==='ladder')for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(at.x-7,bounds.top+5+i*6);ctx.lineTo(at.x+7,bounds.top+5+i*6);ctx.stroke();}
    if(p.kind==='valve'){ctx.beginPath();ctx.arc(at.x,at.y-9,9,0,Math.PI*2);ctx.stroke();}
    if(p.kind==='generator'){ctx.fillStyle='#549d74';ctx.fillRect(at.x-11,at.y-14,22,7);}
    label(p,p.label);
  }
  for(const c of d.commands.filter(c=>!c.repeatable)) {
    if(s.done.has(c.id))continue;
    const ready=c.requires.every(r=>s.done.has(r));
    if(ready){cell(c.cell.x,c.cell.y,'rgba(69,201,158,0.25)');label(c.cell,'◆','#baffd6');}
  }
  for(const p of getSourceSceneDanger(s)){cell(p.x,p.y,'rgba(255,80,48,0.42)');label(p,'!','#fff0c9');}
  const threatVisible=!s.complete && !(d.material==='hangar'&&s.done.has('outer')) && !(d.material==='shuttle'&&s.done.has('harpoon')) && !(d.material==='silo'&&s.done.has('ignite'));
  let pos=d.threatCell;
  if(d.material==='hangar'&&s.done.has('grapple'))pos=s.done.has('inner')?{x:6,y:3}:{x:s.actor.gridX+0.4,y:s.actor.gridY};
  if(d.material==='shuttle'&&s.done.has('flush'))pos={x:5,y:2};
  const at=engine.gridToScreen(pos.x,pos.y);
  if(threatVisible && s.threat && drawEnemy) drawEnemy(ctx,at.x,at.y,s.threat,animTime,-1,d.material==='hangar'?112:76);
  else if(threatVisible && d.material==='silo') {
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
  ctx.restore();
}
