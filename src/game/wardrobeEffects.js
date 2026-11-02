import { resolveWardrobeEffect } from './wardrobe.js';
/** A bounded, static ground accent, not a costume, hitbox, light source or gameplay bonus. */
export function drawWardrobeEffect(ctx,x,y,actor,targetHeight=72) {
  const effect=resolveWardrobeEffect(actor,actor?.wardrobeEffect);
  if(!effect || actor?.state==='dead' || ![x,y,targetHeight].every(Number.isFinite) || targetHeight<=0)return false;
  const r=Math.min(240,Math.max(8,targetHeight*0.34));
  ctx.save();
  try {
    ctx.globalAlpha*=0.72;ctx.strokeStyle=effect.color;ctx.lineWidth=Math.max(1,r/18);
    ctx.translate(x,y-2);ctx.beginPath();
    // Static shape: no camera-time animation, no random particles, no new timing/pause contract.
    if(effect.shape==='beacon') {
      ctx.moveTo(-r,-r*.14);ctx.lineTo(-r*.65,r*.15);ctx.lineTo(-r,r*.4);
      ctx.moveTo(r,-r*.14);ctx.lineTo(r*.65,r*.15);ctx.lineTo(r,r*.4);
    } else if(effect.shape==='seal') {
      ctx.moveTo(0,-r*.3);ctx.lineTo(r,r*.08);ctx.lineTo(0,r*.45);ctx.lineTo(-r,r*.08);ctx.closePath();
    } else {ctx.ellipse(0,r*.08,r,r*.3,0,0.2,Math.PI*1.84);}
    ctx.stroke();
  } finally {ctx.restore();}
  return true;
}
