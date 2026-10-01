// Explicit, readable interaction markers. These geometric overlays do not
// certify the existing boss sprite as a faithful Half-Life model.
export function drawNihilanthEncounter(ctx, runtime, animTime, width, height, lang = 'fr') {
  if (!runtime?.boss || runtime.boss.currentHp <= 0) return;
  ctx.save();
  runtime.crystals.forEach((crystal, index) => {
    if (crystal.currentHp <= 0) return;
    ctx.fillStyle = '#b086bf';
    ctx.strokeStyle = '#ecd4ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(crystal.x, crystal.y - 34);
    ctx.lineTo(crystal.x + 12, crystal.y - 18);
    ctx.lineTo(crystal.x + 7, crystal.y);
    ctx.lineTo(crystal.x - 7, crystal.y);
    ctx.lineTo(crystal.x - 12, crystal.y - 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px "Share Tech Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(lang === 'fr' ? `CRISTAL ${index + 1}` : `CRYSTAL ${index + 1}`, crystal.x, crystal.y - 43);
    ctx.fillStyle = '#3c2848';
    ctx.fillRect(crystal.x - 18, crystal.y - 40, 36, 3);
    ctx.fillStyle = '#d8bcff';
    ctx.fillRect(crystal.x - 18, crystal.y - 40, 36 * crystal.currentHp / crystal.maxHp, 3);
    if (runtime.rechargeTicks > 0) {
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = '#e6a551';
      ctx.beginPath();
      ctx.moveTo(crystal.x, crystal.y - 22);
      ctx.lineTo(runtime.boss.x, runtime.boss.y - 40);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  });
  ctx.fillStyle = '#e6a551';
  for (let index = 0; index < runtime.energySpheres; index++) {
    const angle = animTime * 0.035 + index * Math.PI * 2 / 20;
    ctx.beginPath();
    ctx.arc(runtime.boss.x + Math.cos(angle) * 39, runtime.boss.y - 36 + Math.sin(angle) * 16, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  if (runtime.headOpen) {
    const brain = runtime.brain;
    ctx.fillStyle = '#e9b46a';
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(brain.x, brain.y - 10, 10 + Math.sin(animTime * 0.12) * 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.font = '10px "Share Tech Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(lang === 'fr' ? 'CERVEAU EXPOSE' : 'EXPOSED BRAIN', brain.x, brain.y - 25);
  }
  runtime.projectiles.forEach(projectile => {
    ctx.fillStyle = '#b66dff';
    ctx.strokeStyle = '#ebd2ff';
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
  const destroyed = runtime.crystals.filter(crystal => crystal.currentHp <= 0).length;
  ctx.fillStyle = 'rgba(0,0,0,0.76)';
  ctx.fillRect(20, height - 31, Math.min(width - 40, 580), 24);
  ctx.fillStyle = '#ecd4ff';
  ctx.textAlign = 'left';
  ctx.font = '11px "Share Tech Mono", monospace';
  const phase = runtime.headOpen ? (lang === 'fr' ? 'VISEZ LE CERVEAU' : 'TARGET THE BRAIN')
    : (lang === 'fr' ? 'DETRUISEZ LES CRISTAUX / AFFAIBLISSEZ-LE' : 'DESTROY CRYSTALS / WEAKEN NIHILANTH');
  ctx.fillText(`${destroyed}/3 | ${runtime.energySpheres}/20 | ${phase}`, 28, height - 15, width - 60);
  ctx.restore();
}
