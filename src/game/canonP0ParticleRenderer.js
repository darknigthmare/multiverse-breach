// Procedural combat feedback only: exact character / Patronus artwork remains
// a separate, pending visual review. Return false for the legacy renderer.
const TYPES = new Set([
  'bullet', 'smoke', 'batarang', 'camera_flash', 'shadow_wisp', 'starbolt',
  'spell_bolt', 'patronus', 'electric_beam', 'flame', 'thrown_prop', 'sound_call', 'toxin_cloud'
]);

export function drawP0CanonParticle(ctx, particle) {
  const p = particle;
  if (!TYPES.has(p.type)) return false;
  ctx.save();
  ctx.fillStyle = p.color;
  ctx.strokeStyle = p.color;
  if (['bullet', 'thrown_prop'].includes(p.type)) {
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  } else if (['starbolt', 'shadow_wisp', 'spell_bolt', 'smoke', 'patronus', 'toxin_cloud'].includes(p.type)) {
    ctx.shadowColor = p.color;
    ctx.shadowBlur = ['smoke', 'patronus'].includes(p.type) ? 4 : 8;
    if (['smoke', 'patronus', 'toxin_cloud'].includes(p.type)) ctx.globalAlpha *= 0.5;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.size * (p.type === 'spell_bolt' ? 1.2 : 0.7), p.size / 2, Math.atan2(p.vy, p.vx), 0, Math.PI * 2);
    ctx.fill();
  } else if (p.type === 'batarang') {
    ctx.translate(p.x, p.y);
    ctx.rotate(Math.atan2(p.vy, p.vx));
    ctx.beginPath();
    ctx.moveTo(-p.size / 2, -p.size / 3);
    ctx.lineTo(-p.size / 4, -p.size / 6);
    ctx.lineTo(0, -p.size / 3);
    ctx.lineTo(p.size / 4, -p.size / 6);
    ctx.lineTo(p.size / 2, -p.size / 3);
    ctx.lineTo(p.size / 4, p.size / 4);
    ctx.lineTo(0, 0);
    ctx.lineTo(-p.size / 4, p.size / 4);
    ctx.closePath();
    ctx.fill();
  } else if (p.type === 'camera_flash') {
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p.x - p.size / 2, p.y);
    ctx.lineTo(p.x + p.size / 2, p.y);
    ctx.moveTo(p.x, p.y - p.size / 2);
    ctx.lineTo(p.x, p.y + p.size / 2);
    ctx.stroke();
  } else if (p.type === 'electric_beam') {
    ctx.lineWidth = p.size;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 6;
    const length = Math.max(1, Math.hypot(p.vx, p.vy));
    const perpendicularX = -p.vy / length;
    const perpendicularY = p.vx / length;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    for (let step = 1; step <= 6; step++) {
      const offset = step === 6 ? 0 : step % 2 ? 5 : -5;
      ctx.lineTo(p.x + p.vx * step * 1.7 + perpendicularX * offset,
        p.y + p.vy * step * 1.7 + perpendicularY * offset);
    }
    ctx.stroke();
  } else if (p.type === 'flame') {
    ctx.beginPath();
    ctx.moveTo(p.x, p.y - p.size);
    ctx.lineTo(p.x + p.size / 2, p.y + p.size / 2);
    ctx.lineTo(p.x - p.size / 2, p.y + p.size / 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffe576';
    ctx.fillRect(p.x - p.size / 6, p.y - p.size / 3, p.size / 3, p.size / 2);
  } else if (p.type === 'sound_call') {
    ctx.translate(p.x, p.y);
    ctx.rotate(Math.atan2(p.vy, p.vx));
    ctx.lineWidth = 2;
    for (const radius of [p.size / 3, p.size * 2 / 3]) {
      ctx.beginPath();
      ctx.arc(0, 0, radius, -Math.PI / 3, Math.PI / 3);
      ctx.stroke();
    }
  }
  ctx.restore();
  return true;
}
