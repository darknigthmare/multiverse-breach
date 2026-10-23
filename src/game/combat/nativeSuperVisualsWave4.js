const clamp = n => Math.max(0, Math.min(1, Number(n) || 0));
const definitions = {
  redxiii_ff7: ['Final Fantasy VII', 'Cosmo Memory', 'cosmo-flare'],
  yuffie_ff7: ['Final Fantasy VII', 'All Creation', 'creation-beam'],
  vincent_ff7: ['Final Fantasy VII', 'Chaos', 'chaos-transform'],
  naruto_uzumaki_young: ['Naruto', 'Rasengan', 'rasengan-contact'],
  sasuke_uchiha_young: ['Naruto', 'Chidori', 'chidori-contact'],
  sakura_haruno_young: ['Naruto', 'Bunshin no Jutsu', 'clone-smoke'],
  piccolo_dbz: ['Dragon Ball Z', 'Special Beam Cannon', 'spiral-beam'],
  kakashi_war: ['Naruto Shippuden', 'Kamui', 'ocular-distortion']
};

export function getNativeSuperVisualStateWave4({ actor, profile, action, target, height = 72 }) {
  const definition = definitions[profile?.sourceHeroId];
  if (!definition || !actor || !action || profile.universe !== definition[0] || actor.universe !== definition[0]
    || profile.name !== definition[1] || (actor.sourceHeroId || actor.sourceId || actor.id) !== profile.sourceHeroId) return null;
  if (['clone-smoke', 'chaos-transform'].includes(definition[2]) && profile.effect && profile.effect !== 'buff') return null;
  const duration = Math.max(0.01, Number(action.duration) || 0.01);
  const progress = clamp(action.elapsed / duration), impactProgress = Math.max(0.01, Math.min(0.95, Number(action.hitAt / duration) || 0.5));
  const release = action.elapsed >= action.hitAt, facing = action.facing < 0 ? -1 : 1;
  const self = ['clone-smoke', 'chaos-transform'].includes(definition[2]);
  return {
    family: 'native-wave4', heroId: profile.sourceHeroId, kind: definition[2], name: profile.name,
    progress, impactProgress, release, releaseProgress: clamp((progress - impactProgress) / (1 - impactProgress)),
    facing, height, color: profile.color || '#cae8ff',
    ground: { x: actor.x, y: actor.y },
    origin: { x: actor.x + facing * height * 0.22, y: actor.y - height * 0.48 },
    target: self ? { x: actor.x, y: actor.y } : { x: target?.x ?? actor.x + facing * Math.min(Number(profile.range) || 220, 220), y: target?.y ?? actor.y },
    gameplayEffect: 'none', source1to1Verified: false
  };
}

export function drawNativeSuperVisualsWave4(ctx, state) {
  if (!state) return false;
  const { kind, progress: p, release, releaseProgress: q, origin, ground, target, height, facing } = state;
  const scale = height / 72, charge = clamp(p / state.impactProgress);
  const center = { x: target.x, y: target.y - height * 0.42 };
  const line = (x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
  const ring = (x, y, r, squash = 1) => { ctx.beginPath(); ctx.ellipse(x, y, r, r * squash, 0, 0, Math.PI * 2); ctx.stroke(); };
  ctx.save(); ctx.strokeStyle = state.color; ctx.fillStyle = state.color; ctx.lineWidth = 2 * scale;
  if (kind === 'ocular-distortion') {
    // Kamui is ocular space distortion at the target, without a hand beam.
    const radius = (release ? 24 * (1 - q) : 7 + 17 * charge) * scale;
    for (let arm = 0; arm < 3; arm++) {
      ctx.beginPath();
      for (let i = 0; i <= 32; i++) {
        const t = i / 32, angle = t * Math.PI * 2 + arm * Math.PI * 2 / 3 + p * 5;
        const x = center.x + Math.cos(angle) * radius * t, y = center.y + Math.sin(angle) * radius * t * 1.2;
        if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  } else if (kind === 'spiral-beam' || kind === 'creation-beam') {
    const hand = { x: origin.x + facing * height * (release ? 0.16 : -0.06), y: ground.y - height * (kind === 'spiral-beam' ? 0.65 : 0.45) };
    if (!release) ring(hand.x, hand.y, (2 + 6 * charge) * scale);
    else if (q < 0.9) {
      ctx.lineWidth = (kind === 'creation-beam' ? 9 : 3) * scale * Math.sin((0.12 + q * 0.8) * Math.PI);
      line(hand.x, hand.y, center.x, center.y);
      if (kind === 'spiral-beam') {
        ctx.lineWidth = 1.5 * scale;
        const dx = center.x - hand.x, dy = center.y - hand.y, distance = Math.max(1, Math.hypot(dx, dy));
        ctx.beginPath();
        for (let i = 0; i <= 64; i++) {
          const t = i / 64, wave = Math.sin(t * Math.PI * 14 - q * 10) * 5 * scale;
          const x = hand.x + dx * t - dy / distance * wave, y = hand.y + dy * t + dx / distance * wave;
          if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
  } else if (kind === 'rasengan-contact' || kind === 'chidori-contact') {
    // Both remain in the hand. The authoritative engine handles the approach;
    // neither technique acquires a projectile trajectory or a ranged impact.
    const x = origin.x + facing * height * 0.1, y = origin.y;
    if (q < 0.8) for (let i = 0; i < 5; i++) {
      const angle = i * Math.PI * 2 / 5 + p * 11, r = (4 + 5 * charge) * scale;
      if (kind === 'rasengan-contact') ring(x + Math.cos(angle) * 2 * scale, y + Math.sin(angle) * 2 * scale, r, 0.6);
      else {
        const dx = Math.cos(angle) * r * 1.9, dy = Math.sin(angle) * r * 1.9;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dx * 0.4 + Math.sin(p * 24 + i) * 3 * scale, y + dy * 0.4);
        ctx.lineTo(x + dx, y + dy); ctx.stroke();
      }
    }
  } else if (kind === 'cosmo-flare') {
    const x = release ? center.x : ground.x, y = release ? center.y : ground.y - height * 0.85;
    const r = (release ? 8 + Math.sin(q * Math.PI) * 36 : 3 + charge * 10) * scale;
    ring(x, y, r);
    for (let i = 0; i < 10; i++) {
      const a = i * Math.PI / 5 + p * 1.5;
      line(x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7, x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25);
    }
  } else if (kind === 'clone-smoke') {
    // The native body atlas contains the nonphysical clone. These wisps stay
    // beside Sakura; they never target allies or depict damaging clones.
    for (let i = 0; i < 6; i++) {
      const t = (p + i / 6) % 1;
      ring(ground.x + facing * (14 + i * 3) * scale, ground.y - t * height * 0.7,
        (3 + t * 6) * scale, 0.7);
    }
  } else {
    ring(ground.x, ground.y - 2 * scale, (16 + Math.sin(p * Math.PI) * 14) * scale, 0.23);
    for (let i = 0; i < 6; i++) {
      const angle = i * Math.PI / 3 + p * 2, radius = height * 0.38;
      line(ground.x + Math.cos(angle) * radius, ground.y - height * 0.48 + Math.sin(angle) * radius,
        ground.x + Math.cos(angle) * radius * 1.2, ground.y - height * 0.48 + Math.sin(angle) * radius * 1.2);
    }
  }
  ctx.restore();
  return true;
}
