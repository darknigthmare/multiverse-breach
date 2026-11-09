/**
 * Procedural fallback for source-identified energy swords when a character's
 * art is missing. These are readable silhouettes, NOT certified 1:1 sprites.
 * Only known weapon types are rendered; all coordinates are local pixels.
 */
const segment = (x,y,w,h) => Object.freeze({x,y,w,h});
const freezePlan = (hilts,blades) => Object.freeze({
  hilts:Object.freeze(hilts), blades:Object.freeze(blades)
});
const GEOMETRY = Object.freeze({
  lightsaber: freezePlan(
    [segment(0,-2,7,4)],
    [segment(7,-1,18,2)]
  ),
  dual_lightsaber: freezePlan(
    [segment(0,-6,7,3), segment(-2,3,6,3)],
    [segment(7,-5,17,2), segment(4,4,12,2)]
  ),
  double_lightsaber: freezePlan(
    [segment(-6,-2,12,4)],
    [segment(-24,-1,18,2), segment(6,-1,18,2)]
  )
});
export const getEnergyBladeFallbackGeometry = type => GEOMETRY[type] || null;

/** Returns false without drawing for unknown types. Requires an already saved canvas context. */
export function drawFallbackEnergyBlades(ctx,type,color) {
  const geometry = getEnergyBladeFallbackGeometry(type);
  if (!geometry) return false;
  ctx.fillStyle = '#727c87';
  for (const hilt of geometry.hilts) ctx.fillRect(hilt.x,hilt.y,hilt.w,hilt.h);
  ctx.fillStyle = '#26303c';
  for (const hilt of geometry.hilts) ctx.fillRect(hilt.x+1,hilt.y+1,hilt.w-2,1);
  const bladeColor = typeof color === 'string' && /^#[0-9a-fA-F]{6}$/.test(color) ? color : '#ff4444';
  ctx.fillStyle = bladeColor;
  ctx.shadowColor = bladeColor;
  ctx.shadowBlur = 6;
  for (const blade of geometry.blades) ctx.fillRect(blade.x,blade.y,blade.w,blade.h);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#f5f8ff';
  for (const blade of geometry.blades) ctx.fillRect(blade.x,blade.y,blade.w,1);
  return true;
}
