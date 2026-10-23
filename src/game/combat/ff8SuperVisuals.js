const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

// These are visual trajectories only. Selection, range and damage remain on
// the authoritative action timeline; rendering never moves a combatant.
export function sampleNativeSuperMotion({ heroId, universe, phase, progress, height = 72 }) {
  if (heroId !== 'laguna_ff8' || universe !== 'Final Fantasy VIII' || phase !== 'super') return { x: 0, y: 0 };
  const time = clamp(Number(progress) || 0, 0, 1);
  const rise = Math.sin(Math.min(1, time / 0.2) * Math.PI / 2);
  const landing = time < 0.8 ? 1 : (1 - time) / 0.2;
  return { x: 0, y: -height * 0.9 * rise * Math.max(0, landing) };
}

export function getFf8SuperVisualState({ actor, profile, action, target, height = 72, applyMotion = true }) {
  if (!actor || !action || profile?.universe !== 'Final Fantasy VIII' || actor.universe !== profile.universe) return null;
  const heroId = profile.sourceHeroId;
  if ((actor.sourceHeroId || actor.sourceId || actor.id) !== heroId) return null;
  const identities = { laguna_ff8: 'Desperado', selphie_ff8: 'The End', irvine_ff8: 'Hyper Shot' };
  if (identities[heroId] !== profile.name) return null;
  const progress = clamp(action.elapsed / Math.max(0.01, action.duration), 0, 1);
  const release = action.elapsed >= action.hitAt;
  const motion = applyMotion ? sampleNativeSuperMotion({ heroId, universe: profile.universe, phase: 'super', progress, height }) : { x: 0, y: 0 };
  const facing = action.facing < 0 ? -1 : 1;
  return {
    heroId, name: profile.name, progress, release, facing, height,
    color: profile.color || '#f3d595',
    origin: { x: actor.x + facing * height * 0.17, y: actor.y + motion.y - height * 0.42 },
    target: { x: target?.x ?? actor.x + facing * Math.min(profile.range || 240, 240), y: target?.y ?? actor.y },
    motion, impactProgress: clamp(action.hitAt / Math.max(0.01, action.duration), 0.01, 0.95),
    gameplayEffect: 'none', source1to1Verified: false
  };
}

export function drawFf8SuperVisuals(ctx, state) {
  if (!state) return false;
  const { heroId, origin, target, progress, release, facing, height } = state;
  const scale = height / 72;
  ctx.save();
  ctx.strokeStyle = state.color;
  ctx.fillStyle = state.color;
  if (heroId === 'selphie_ff8') {
    // The End concludes in a meadow. It does not acquire an explosive beam or
    // healing semantics just because the flowers are peaceful imagery.
    const bloom = Math.min(1, progress / state.impactProgress);
    for (let i = 0; i < 15; i++) {
      const x = target.x + (i - 7) * 14 * scale;
      const y = target.y - 2 - Math.sin(i * 2.3) * 5 * scale;
      ctx.strokeStyle = '#75a65f'; ctx.lineWidth = 1.5 * scale;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 8 * bloom * scale); ctx.stroke();
      ctx.fillStyle = i % 3 === 0 ? '#ffe59a' : '#f4f2e3';
      for (let petal = 0; petal < 5; petal++) {
        const angle = petal * Math.PI * 2 / 5;
        ctx.beginPath(); ctx.arc(x + Math.cos(angle) * 3 * bloom * scale, y - 10 * bloom * scale + Math.sin(angle) * 3 * bloom * scale, 2 * bloom * scale, 0, Math.PI * 2); ctx.fill();
      }
    }
  } else if (heroId === 'laguna_ff8') {
    const muzzleY = origin.y - height * 0.04;
    if (release && progress < 0.8) {
      ctx.lineWidth = 2 * scale;
      for (let i = 0; i < 3; i++) {
        const travel = (progress * 4 + i / 3) % 1;
        const x = origin.x + (target.x - origin.x) * travel;
        const y = muzzleY + (target.y - height * 0.3 - muzzleY) * travel;
        ctx.beginPath(); ctx.moveTo(x - facing * 9 * scale, y - 2 * scale); ctx.lineTo(x, y); ctx.stroke();
      }
    } else if (!release) {
      const travel = Math.min(1, progress / state.impactProgress);
      ctx.fillStyle = '#6f8052';
      ctx.beginPath(); ctx.arc(origin.x + (target.x - origin.x) * travel,
        muzzleY + (target.y - muzzleY) * travel - Math.sin(travel * Math.PI) * height * 0.65, 3 * scale, 0, Math.PI * 2); ctx.fill();
    }
  } else {
    // Hyper Shot's Pulse Ammo is represented by a brief impulse tracer rather
    // than a sustained laser. This does not grant armor penetration to gameplay.
    const travel = release ? Math.min(1, (progress - state.impactProgress) / Math.max(0.01, 1 - state.impactProgress) * 2) : 0;
    const x = origin.x + (target.x - origin.x) * travel;
    const y = origin.y + (target.y - height * 0.38 - origin.y) * travel;
    if (release && travel < 1) {
      ctx.strokeStyle = '#fff2c6'; ctx.lineWidth = 5 * scale;
      ctx.beginPath(); ctx.moveTo(x - facing * 18 * scale, y); ctx.lineTo(x + facing * 4 * scale, y); ctx.stroke();
      ctx.strokeStyle = state.color; ctx.lineWidth = 2 * scale;
      ctx.beginPath(); ctx.arc(x, y, 7 * scale, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    }
  }
  ctx.restore();
  return true;
}
