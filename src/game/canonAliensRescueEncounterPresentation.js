// Readable interaction overlays, not a certified recreation of the film set.
// Newt is a rescue marker and accompanies the carrier; she is never a target.
export function emitAliensHiveAttackEffect(particles, actor, target, actionOrType) {
  if (!actor?.aliensHiveLoadout || !particles?.add) return false;
  const action = typeof actionOrType === 'string' ? actor[actionOrType] : actionOrType;
  if (!action || !['M41A Pulse Rifle', 'M240 Incinerator', 'M41A Grenade'].includes(action.name)) return false;
  const destination = target || { x: actor.x + (actor.facing || 1) * 90, y: actor.y };
  const dx = destination.x - actor.x;
  const dy = destination.y - actor.y;
  const distance = Math.max(1, Math.hypot(dx, dy));
  const ux = dx / distance;
  const uy = dy / distance;
  const x = actor.x + ux * 16;
  const y = actor.y - 16 + uy * 16;
  if (action.name === 'M240 Incinerator') {
    for (const offset of [-1, 0, 1]) {
      particles.add(x, y + offset * 4, ux * 6, uy * 6 + offset * 0.15,
        '#ff8d27', 10, Math.max(12, Math.ceil(distance / 6)), 'flame');
    }
  } else if (action.name === 'M41A Grenade') {
    particles.add(x, y, ux * 6, uy * 6, '#7f846e', 6,
      Math.max(12, Math.ceil(distance / 6)), 'thrown_prop');
    if (target) {
      for (let index = 0; index < 6; index++) {
        const angle = index * Math.PI / 3;
        particles.add(target.x, target.y - 16, Math.cos(angle) * 2,
          Math.sin(angle) * 2, '#e6a551', 4, 18, 'spark');
      }
    }
  } else {
    particles.add(x, y, ux * 10, uy * 10, '#9c9683', 3,
      Math.max(12, Math.ceil(distance / 10)), 'bullet');
  }
  return true;
}

export function drawAliensRescueEncounter(ctx, runtime, heroes, animTime, width, height, lang = 'fr') {
  if (!runtime) return;
  const fr = lang === 'fr';
  ctx.save();
  ctx.lineWidth = 2;
  ctx.font = '11px "Share Tech Mono", monospace';
  ctx.textAlign = 'center';
  if (!runtime.rescued) {
    const point = runtime.rescuePoint;
    ctx.strokeStyle = runtime.phase === 'rescue' ? '#e6be7b' : '#869a9f';
    ctx.fillStyle = 'rgba(30,45,48,0.7)';
    ctx.beginPath();
    ctx.arc(point.x, point.y - 12, 16 + Math.sin(animTime * 0.08) * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#e6be7b';
    ctx.fillText('NEWT', point.x, point.y - 38);
    ctx.fillText(runtime.phase === 'rescue' ? (fr ? 'LIBERER' : 'RESCUE') : (fr ? 'ATTEINDRE LE NID' : 'REACH THE NEST'), point.x, point.y + 20);
  } else {
    const carrier = heroes.find(hero => (hero.battleId || hero.runtimeId || hero.id) === runtime.carrierId);
    if (carrier) {
      ctx.fillStyle = '#e6be7b';
      ctx.fillText(fr ? 'NEWT ACCOMPAGNE' : 'NEWT WITH YOU', carrier.x, carrier.y - 48);
    }
  }
  const exit = runtime.exitPoint;
  ctx.globalAlpha = runtime.rescued ? 1 : 0.42;
  ctx.fillStyle = 'rgba(89,169,137,0.25)';
  ctx.strokeStyle = '#83d1ad';
  ctx.fillRect(exit.x - 23, exit.y - 46, 46, 46);
  ctx.strokeRect(exit.x - 23, exit.y - 46, 46, 46);
  ctx.fillStyle = '#b8efcf';
  ctx.fillText(fr ? 'EVACUATION' : 'EVACUATE', exit.x, exit.y - 57);
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(0,0,0,0.76)';
  ctx.fillRect(20, height - 31, Math.min(width - 40, 660), 24);
  ctx.fillStyle = '#e6be7b';
  ctx.textAlign = 'left';
  const instruction = runtime.complete ? (fr ? 'NEWT SAUVEE / EVACUATION REUSSIE' : 'NEWT RESCUED / EVACUATION COMPLETE')
    : runtime.rescued ? (fr ? 'REJOIGNEZ LA SORTIE AVEC NEWT / REINE NON LETALE' : 'REACH THE EXIT WITH NEWT / NONLETHAL QUEEN')
      : runtime.queen ? (fr ? 'REJOIGNEZ NEWT / LIBEREZ-LA / FUYEZ' : 'REACH NEWT / FREE HER / ESCAPE')
        : (fr ? 'TRAVERSEZ LA RUCHE POUR ATTEINDRE LE NID' : 'CROSS THE HIVE TO REACH THE NEST');
  ctx.fillText(instruction, 28, height - 15, width - 60);
  ctx.restore();
}
