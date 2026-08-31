// Canvas and accessible target buttons use the same runtime IDs. Empty space
// never confirms a command or changes the acting character.
export function pickRpgTarget(targeting, x, y) {
  if (!targeting || !Number.isFinite(x) || !Number.isFinite(y)) return null;
  return targeting.eligibleTargets.map(target => ({ target, distance: Math.hypot((x - target.x) / (target.hitWidth || 42), (y - target.y) / (target.hitHeight || 48)) }))
    .filter(entry => entry.distance <= 1)
    .sort((a, b) => a.distance - b.distance)[0]?.target.id || null;
}

export function drawRpgTargeting(ctx, targeting, actors) {
  if (!targeting) return;
  const actor = actors.find(unit => (unit.battleId || unit.runtimeId || unit.id) === targeting.actorId);
  ctx.save();
  ctx.lineWidth = 2;
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  targeting.eligibleTargets.forEach(target => {
    const affected = targeting.previewTargetIds.includes(target.id);
    ctx.strokeStyle = affected ? '#a2ffc3' : '#f5d572';
    ctx.fillStyle = affected ? '#a2ffc3' : '#f5d572';
    if (affected && actor) {
      ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.moveTo(actor.x, actor.y); ctx.lineTo(target.x, target.y); ctx.stroke();
    }
    ctx.setLineDash(affected ? [] : [4, 4]);
    ctx.beginPath(); ctx.ellipse(target.x, target.y, target.hitWidth || 42, target.hitHeight || 48, 0, 0, Math.PI * 2); ctx.stroke();
    const estimate = targeting.estimates?.find(entry => entry.id === target.id);
    const label = `${affected ? '✓ ' : ''}${target.name}${affected && estimate?.amount > 0 ? ` (${estimate.min}–${estimate.max})` : ''}`;
    const halfWidth = ctx.measureText(label).width / 2 + 4;
    const labelX = Math.max(halfWidth, Math.min(ctx.canvas.width - halfWidth, target.x));
    const labelY = Math.max(40, target.y - (target.hitHeight || 48) - 8);
    ctx.fillStyle = '#07121deb'; ctx.fillRect(labelX - halfWidth, labelY - 12, halfWidth * 2, 17);
    ctx.fillStyle = affected ? '#a2ffc3' : '#f5d572'; ctx.fillText(label, labelX, labelY);
  });
  ctx.restore();
}
