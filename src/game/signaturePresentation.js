import { drawPixelEnemy } from './renderer.js';

// Staging around existing artwork. These effect shapes are not new source
// creature sprites or a claim to reproduce the original choreography.
export function drawSignatureEffect(ctx, state, x, y, radius, reducedMotion = false) {
  const tick = reducedMotion ? 0 : state.tick;
  const active = state.tick >= (state.windupTicks ?? 24) + (state.revealTicks ?? 36);
  ctx.save();
  try {
    ctx.translate(x, y);
    ctx.strokeStyle = state.color;ctx.fillStyle = state.color;ctx.lineWidth = active ? 5 : 2;
    ctx.globalAlpha *= active ? 0.8 : 0.35;
    const line = (x1, y1, x2, y2) => { ctx.beginPath();ctx.moveTo(x1, y1);ctx.lineTo(x2, y2);ctx.stroke(); };
    switch (state.style) {
      case 'beam':
      case 'spiral': {
        line(-radius, 0, radius, 0);
        if (active) { ctx.globalAlpha *= 0.4;ctx.fillRect(-radius, -10, radius * 2, 20); }
        if (state.style === 'spiral') {
          ctx.beginPath();
          for (let i = 0; i <= 40; i++) { const px = -radius + i * radius / 20, py = Math.sin(i * 0.55 - tick * 0.08) * 22; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
          ctx.stroke();
        }
        break;
      }
      case 'slash':
        for (let i = 0; i < Math.min(5, Math.max(1, state.hit)); i++) {
          const offset = (i - 2) * radius * 0.22;
          line(-radius * 0.65 + offset, i % 2 ? -radius * 0.65 : radius * 0.65,
            radius * 0.65 + offset, i % 2 ? radius * 0.65 : -radius * 0.65);
        }
        break;
      case 'lightning':
        ctx.beginPath();ctx.moveTo(-radius, 0);
        for (let i = 1; i <= 12; i++) ctx.lineTo(-radius + i * radius / 6, i === 12 ? 0 : (i % 2 ? -1 : 1) * radius * 0.21);
        ctx.stroke();break;
      case 'barrage':
        for (let i = 0; i < 6; i++) { const py = (i - 2.5) * radius * 0.2;line(-radius, py, radius * 0.5, py * 0.6);ctx.fillRect(radius * 0.5, py * 0.6 - 3, 8, 6); }
        break;
      case 'ice':
        for (let i = 0; i < 6; i++) {
          const angle = i * Math.PI / 3;ctx.save();ctx.rotate(angle);ctx.beginPath();
          ctx.moveTo(radius * 0.2, 0);ctx.lineTo(radius * 0.7, -10);ctx.lineTo(radius, 0);ctx.lineTo(radius * 0.7, 10);ctx.closePath();ctx.stroke();ctx.restore();
        }
        break;
      case 'fire':
      case 'acid':
        for (let i = 0; i < 5; i++) {
          const px = (i - 2) * radius * 0.32, py = Math.sin(i + tick * 0.045) * radius * 0.16;
          ctx.beginPath();ctx.ellipse(px, py, radius * 0.11, state.style === 'fire' ? radius * 0.42 : radius * 0.17, 0.25, 0, Math.PI * 2);ctx.fill();
        }
        break;
      case 'healing':
        for (let i = 0; i < 5; i++) {
          const angle = i * Math.PI * 2 / 5 + tick * 0.012, px = Math.cos(angle) * radius * 0.7, py = Math.sin(angle) * radius * 0.7;
          line(px - 8, py, px + 8, py);line(px, py - 8, px, py + 8);
        }
        break;
      case 'radial':
      case 'summon':
        for (let i = 1; i <= 3; i++) { ctx.beginPath();ctx.ellipse(0, 0, radius * i / 3, radius * i / 3 * (state.style === 'summon' ? 0.5 : 1), 0, 0, Math.PI * 2);ctx.stroke(); }
        break;
      case 'orb':
        ctx.beginPath();ctx.arc(0, 0, radius * (active ? 0.65 : 0.32), 0, Math.PI * 2);ctx.stroke();
        ctx.globalAlpha *= 0.3;ctx.fill();break;
      default: break;
    }
  } finally { ctx.restore(); }
}

export function drawSignatureCinematic(ctx, state, actor, drawActor, { reducedMotion = false } = {}) {
  if (!ctx || !state || !ctx.canvas) return;
  // The battlefield now carries the real returning disc, not a cutscene hit.
  if ((state.projectile === 'returning-disc' || state.summonAgent) && state.hit > 0) return;
  const { width: w, height: h } = ctx.canvas;
  const intro = Math.min(1, state.tick / 12);
  const outro = Math.min(1, (state.duration - state.tick) / 18);
  const opacity = Math.max(0, Math.min(intro, outro));
  ctx.save();
  try {
    ctx.globalAlpha = opacity;
    ctx.fillStyle = 'rgba(3,5,15,0.72)';ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#050713';ctx.fillRect(0, 0, w, h * 0.14);ctx.fillRect(0, h * 0.86, w, h * 0.14);
    const centerX = w * 0.65, centerY = h * 0.47;
    const radius = Math.min(w * 0.21, h * 0.25);
    drawSignatureEffect(ctx, state, centerX, centerY, radius, reducedMotion);
    for (let i = 0; i < Math.min(32, state.hits); i++) {
      ctx.globalAlpha = opacity * (i < state.hit ? 1 : 0.26);
      ctx.fillStyle = state.color;
      const px = centerX - radius + i * radius * 2 / Math.max(1, state.hits - 1);
      ctx.beginPath();ctx.arc(px, h * 0.75, state.hits > 6 ? 4 : 7, 0, Math.PI * 2);ctx.fill();
    }
    ctx.globalAlpha = opacity;
    if (actor) {
      const draw = actor.sourceSignature?.key?.includes('::') ? drawPixelEnemy : drawActor;
      if (draw) draw(ctx, w * 0.23, h * 0.76, { ...actor, state: 'special' }, reducedMotion ? 0 : state.tick, 1, Math.min(180, h * 0.53));
    }
    ctx.textAlign = 'center';ctx.fillStyle = '#f6f2e9';
    ctx.font = `bold ${Math.max(10, Math.min(19, Math.floor(w / 40)))}px monospace`;
    ctx.fillText(state.name, w / 2, h * 0.095, w * 0.90);
    ctx.font = `bold ${Math.max(11, Math.floor(h / 20))}px monospace`;
    ctx.fillText(`${state.hit} / ${state.hits}`, centerX, h * 0.66);
    if (state.summonName) { ctx.font = 'bold 14px monospace';ctx.fillText(state.summonName, centerX, h * 0.27, w * 0.5); }
    ctx.font = '12px monospace';ctx.fillStyle = state.color;
    ctx.fillText(state.universe || '', w / 2, h * 0.95, w * 0.90);
  } finally { ctx.restore(); }
}
