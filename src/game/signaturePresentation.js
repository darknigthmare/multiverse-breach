// Abstract staging around the EXISTING actor artwork. This does not generate or
// certify a source creature model. Rendering never changes combat or its clock.
export function drawSignatureCinematic(ctx, state, actor, drawActor, { reducedMotion = false } = {}) {
  if (!ctx || !state || !ctx.canvas) return;
  const { width: w, height: h } = ctx.canvas;
  const intro = Math.min(1, state.tick / 12);
  const outro = Math.min(1, (state.duration - state.tick) / 18);
  const opacity = Math.max(0, Math.min(intro, outro));
  ctx.save();
  try {
    ctx.globalAlpha = opacity;
    ctx.fillStyle = 'rgba(3,5,15,0.72)'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#050713'; ctx.fillRect(0, 0, w, h * 0.14); ctx.fillRect(0, h * 0.86, w, h * 0.14);
    ctx.strokeStyle = state.color; ctx.lineWidth = 2;
    const centerX = w * 0.64, centerY = h * 0.49;
    const radius = Math.min(w * 0.20, h * 0.26);
    for (let i = 0; i < state.hits; i++) {
      const angle = i * Math.PI * 2 / state.hits - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius, y = centerY + Math.sin(angle) * radius;
      ctx.globalAlpha = opacity * (i < state.hit ? 1 : 0.26);
      ctx.fillStyle = state.color;
      ctx.beginPath(); ctx.arc(x, y, state.hits > 6 ? 5 : 9, 0, Math.PI * 2); ctx.fill();
      if (!reducedMotion && state.phase === 'impact' && i === state.hit - 1) {
        ctx.beginPath(); ctx.moveTo(w * 0.27, h * 0.50); ctx.lineTo(x, y); ctx.stroke();
      }
    }
    ctx.globalAlpha = opacity;
    if (actor && drawActor) drawActor(ctx, w * 0.23, h * 0.76, { ...actor, state: 'special' }, reducedMotion ? 0 : state.tick, 1, Math.min(180, h * 0.53));
    ctx.textAlign = 'center'; ctx.fillStyle = '#f6f2e9';
    ctx.font = `bold ${Math.max(10, Math.min(19, Math.floor(w / 40)))}px monospace`;
    ctx.fillText(state.name, w / 2, h * 0.095, w * 0.90);
    ctx.font = `bold ${Math.max(11, Math.floor(h / 18))}px monospace`;
    ctx.fillText(`${state.hit} / ${state.hits}`, centerX, centerY + 8);
    ctx.font = '12px monospace'; ctx.fillStyle = state.color;
    ctx.fillText(state.universe || '', w / 2, h * 0.95, w * 0.90);
  } finally { ctx.restore(); }
}
