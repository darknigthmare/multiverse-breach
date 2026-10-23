const clamp = n => Math.max(0, Math.min(1, Number(n) || 0));
const finite = (n, fallback) => Number.isFinite(Number(n)) ? Number(n) : fallback;
const definitions = {
  boruto_uzumaki: ['Boruto: Naruto Next Generations', 'Vanishing Rasengan', 'vanishing-orb'],
  sarada_uchiha: ['Boruto: Naruto Next Generations', 'Chidori', 'chidori-contact'],
  mitsuki_boruto: ['Boruto: Naruto Next Generations', 'Lightning Release: Snake Lightning', 'snake-lightning'],
  masterchief: ['Halo', 'Spartan Laser', 'spartan-laser'],
  johnson: ['Halo', 'Spartan Laser', 'spartan-laser'],
  arbiter: ['Halo', 'Energy Sword Lunge', 'energy-sword'],
  leon: ['Resident Evil', 'Special Rocket Launcher', 'rocket'],
  jill: ['Resident Evil', 'FINGeR Railgun', 'railgun'],
  rebecca_chambers: ['Resident Evil', 'First Aid', 'first-aid'],
  doomslayer: ['Doom', 'BFG-9000', 'bfg'],
  doom_marine_classic: ['Doom', 'BFG-9000', 'classic-bfg'],
  solbadguy: ['Guilty Gear', 'Tyrant Rave', 'tyrant-rave'],
  ky: ['Guilty Gear', 'Ride the Lightning', 'ride-lightning'],
  arca_mirelle: ['Nexus de Convergence', 'Suture du Voile', 'suture'],
  arca_bastion: ['Nexus de Convergence', 'Verrou de Convergence', 'convergence-lock']
};

export function supportsNativeSuperWave5(profile) {
  const definition = definitions[profile?.sourceHeroId];
  return !!definition && profile.universe === definition[0] && profile.name === definition[1];
}

export function supportsTrackedProjectileVisualWave5(profile) {
  return supportsNativeSuperWave5(profile) && profile.effect === 'damage' && profile.delivery === 'projectile'
    && ['vanishing-orb', 'rocket'].includes(definitions[profile.sourceHeroId][2]);
}

export function sampleNativeSuperMotionWave5({ heroId, universe, phase, progress, impactProgress = 0.5, height = 72 }) {
  if (phase !== 'super' || definitions[heroId]?.[0] !== universe) return { x: 0, y: 0 };
  const distance = { arbiter: 0.4, sarada_uchiha: 0.35, solbadguy: 0.22, ky: 0.65 }[heroId];
  if (!distance) return { x: 0, y: 0 };
  const p = clamp(progress), impact = Math.max(0.05, Math.min(0.9, finite(impactProgress, 0.5)));
  const approach = p < impact ? Math.sin(p / impact * Math.PI / 2) : Math.max(0, 1 - (p - impact) / (1 - impact));
  return { x: Math.max(1, Math.min(1000, finite(height, 72))) * distance * approach, y: 0 };
}

export function getNativeSuperVisualStateWave5({ actor, profile, action, target, height = 72, applyMotion = true, projectileVisual = null }) {
  if (!supportsNativeSuperWave5(profile) || !actor || !action || actor.universe !== profile.universe
    || (actor.sourceHeroId || actor.sourceId || actor.id) !== profile.sourceHeroId) return null;
  const kind = definitions[profile.sourceHeroId][2];
  if (profile.effect && profile.effect !== (kind === 'first-aid' ? 'heal' : 'damage')) return null;
  const duration = Math.max(0.01, finite(action.duration, 0.01)), elapsed = Math.max(0, finite(action.elapsed, 0));
  const hitAt = Math.max(0.001, Math.min(duration, finite(action.hitAt, duration * 0.5)));
  const progress = clamp(elapsed / duration), impactProgress = Math.max(0.01, Math.min(0.95, hitAt / duration));
  const facing = action.facing < 0 ? -1 : 1;
  height = Math.max(1, Math.min(1000, finite(height, 72)));
  const range = Math.max(1, Math.min(10000, finite(profile.range, 640)));
  const x = finite(actor.x, 0), y = finite(actor.y, 0);
  const motion = applyMotion ? sampleNativeSuperMotionWave5({ heroId: profile.sourceHeroId, universe: profile.universe,
    phase: 'super', progress, impactProgress, height }) : { x: 0, y: 0 };
  const tx = finite(target?.x, x + facing * Math.min(range, 240));
  const contact = ['energy-sword', 'chidori-contact', 'tyrant-rave', 'ride-lightning', 'suture', 'first-aid'].includes(kind);
  const forward = (tx - x) * facing;
  const tracked = supportsTrackedProjectileVisualWave5(profile) && ['launch', 'flight', 'impact'].includes(projectileVisual?.phase)
    ? { phase: projectileVisual.phase, x: finite(projectileVisual.x, x), y: finite(projectileVisual.y, y),
      travelProgress: clamp(projectileVisual.travelProgress), elapsed: Math.max(0, finite(projectileVisual.elapsed, 0)),
      duration: Math.max(0.001, finite(projectileVisual.duration, 0.24)) } : null;
  return {
    family: 'native-wave5', heroId: profile.sourceHeroId, kind, name: profile.name, progress, impactProgress,
    release: elapsed >= hitAt, releaseProgress: clamp((progress - impactProgress) / (1 - impactProgress)), facing, height,
    color: profile.color || '#c4eaff', motion, range,
    ground: { x, y }, origin: { x: x + (motion.x + height * 0.22) * facing, y: y + motion.y - height * 0.48 },
    target: { x: contact ? tx : x + facing * (forward > 0 ? Math.min(range, forward) : range), y: finite(target?.y, y) },
    ...(tracked ? { projectileVisual: tracked } : {}), gameplayEffect: 'none', source1to1Verified: false
  };
}

export function drawNativeSuperVisualsWave5(ctx, state) {
  if (!state) return false;
  const { kind, progress: p, release, releaseProgress: q, origin, ground, target, height, facing } = state;
  const scale = height / 72, charge = clamp(p / state.impactProgress);
  const center = { x: target.x, y: target.y - height * 0.42 };
  const line = (x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
  const ring = (x, y, r, squash = 1) => { ctx.beginPath(); ctx.ellipse(x, y, r, r * squash, 0, 0, Math.PI * 2); ctx.stroke(); };
  ctx.save(); ctx.strokeStyle = state.color; ctx.fillStyle = state.color; ctx.lineWidth = 2 * scale;
  if (state.projectileVisual) {
    // Fighter launches a real travelling projectile at hitAt. Its cosmetic
    // body and confirmed collision use that same clock/position; the condensed
    // pre-impact trip used by the other engines cannot stand in for its flight.
    const visual = state.projectileVisual;
    if (visual.phase === 'launch') {
      if (kind === 'vanishing-orb' && !release) for (let i = 0; i < 3; i++) ring(origin.x, origin.y, (2 + i * 1.3 + charge * 2) * scale, 0.65);
    } else if (visual.phase === 'flight') {
      if (kind === 'vanishing-orb') {
        if (visual.travelProgress < 0.45 || visual.travelProgress >= 0.95)
          for (let i = 0; i < 3; i++) ring(visual.x, visual.y, (3 + i * 1.5) * scale, 0.65);
      } else {
        ctx.fillStyle = '#718267'; ctx.fillRect(visual.x - 5 * scale, visual.y - 2 * scale, 10 * scale, 4 * scale);
        ctx.strokeStyle = '#ffb055'; line(visual.x - facing * 12 * scale, visual.y, visual.x - facing * 5 * scale, visual.y);
      }
    } else {
      const impact = clamp(visual.elapsed / visual.duration);
      ctx.globalAlpha *= 1 - impact;
      if (kind === 'vanishing-orb') for (let i = 0; i < 3; i++) ring(visual.x, visual.y, (3 + i * 2 + impact * 10) * scale, 0.65);
      else for (let i = 0; i < 7; i++) {
        const angle = i * Math.PI * 2 / 7, radius = (5 + impact * 45) * scale;
        line(visual.x + Math.cos(angle) * radius * 0.4, visual.y + Math.sin(angle) * radius * 0.4,
          visual.x + Math.cos(angle) * radius, visual.y + Math.sin(angle) * radius);
      }
    }
    ctx.restore();
    return true;
  }
  if (kind === 'spartan-laser' || kind === 'railgun') {
    const muzzle = { x: origin.x + facing * height * 0.16, y: origin.y - height * 0.06 };
    if (!release) {
      ring(muzzle.x, muzzle.y, (2 + 5 * charge) * scale);
      if (kind === 'railgun') for (let i = 0; i < 4; i++) {
        const dx = -facing * (i + 1) * 6 * scale;
        line(muzzle.x + dx, muzzle.y - Math.sin(p * 30 + i) * 5 * charge * scale,
          muzzle.x + dx - facing * 3 * scale, muzzle.y + 3 * charge * scale);
      }
    } else if (q < 0.7) {
      ctx.lineWidth = (kind === 'railgun' ? 8 : 5) * scale * (1 - q);
      line(muzzle.x, muzzle.y, center.x, center.y);
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5 * scale;
      line(muzzle.x, muzzle.y, center.x, center.y);
      ring(center.x, center.y, (5 + q * 18) * scale, 1.3);
    }
  } else if (['vanishing-orb', 'rocket', 'bfg', 'classic-bfg'].includes(kind)) {
    // Condensed travel reaches contact on the existing impact; every streak
    // remains cosmetic. It never spawns a second projectile or damage event.
    const travel = clamp((charge - 0.35) / 0.65);
    const x = origin.x + (center.x - origin.x) * travel, y = origin.y + (center.y - origin.y) * travel;
    if (kind === 'vanishing-orb') {
      const visible = travel < 0.45 || travel >= 0.95;
      if (visible && q < 0.3) for (let i = 0; i < 3; i++) ring(x, y, (3 + i * 1.5) * scale, 0.65);
    } else if (kind === 'rocket') {
      if (!release) {
        ctx.fillStyle = '#718267'; ctx.fillRect(x - 5 * scale, y - 2 * scale, 10 * scale, 4 * scale);
        ctx.strokeStyle = '#ffb055'; line(x - facing * 12 * scale, y, x - facing * 5 * scale, y);
      } else if (q < 0.45) for (let i = 0; i < 7; i++) {
        const a = i * Math.PI * 2 / 7, r = (5 + q * 45) * scale;
        line(center.x + Math.cos(a) * r * 0.4, center.y + Math.sin(a) * r * 0.4,
          center.x + Math.cos(a) * r, center.y + Math.sin(a) * r);
      }
    } else if (q < 0.8) {
      const r = (kind === 'classic-bfg' ? 7 : 10) * scale * (release ? 1 - q * 0.7 : 0.5 + charge * 0.5);
      ctx.fillStyle = kind === 'classic-bfg' ? '#52ff32' : '#39ff14';
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 5; i++) {
        const a = i * Math.PI * 2 / 5 + p * 5, length = r * (release ? 2.5 : 1.4);
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a + 0.2) * length * 0.5, y + Math.sin(a + 0.2) * length * 0.5);
        ctx.lineTo(x + Math.cos(a) * length, y + Math.sin(a) * length); ctx.stroke();
      }
    }
  } else if (kind === 'snake-lightning') {
    for (let strand = 0; strand < 2; strand++) {
      const extent = release ? 1 : charge * 0.25;
      ctx.beginPath();
      for (let i = 0; i <= 32; i++) {
        const t = i / 32 * extent;
        const x = origin.x + (center.x - origin.x) * t;
        const y = origin.y + (center.y - origin.y) * t + Math.sin(t * Math.PI * 6 - p * 10 + strand * Math.PI) * 9 * scale;
        if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  } else if (kind === 'first-aid') {
    // A medical cue at the selected ally, without an offensive ray.
    ctx.strokeStyle = '#76e7a1'; ctx.lineWidth = 3 * scale;
    for (let i = 0; i < 4; i++) {
      const t = (p + i / 4) % 1, x = target.x + Math.sin(i * 2.4) * 12 * scale, y = target.y - height * t * 0.7;
      line(x - 3 * scale, y, x + 3 * scale, y); line(x, y - 3 * scale, x, y + 3 * scale);
    }
  } else if (kind === 'energy-sword' || kind === 'chidori-contact' || kind === 'tyrant-rave' || kind === 'ride-lightning') {
    if (kind === 'energy-sword') {
      // The two luminous prongs are a blade, never a remote beam.
      const length = height * 0.45;
      for (const offset of [-3, 3]) line(origin.x, origin.y + offset * scale, origin.x + facing * length, origin.y - 9 * scale + offset * scale);
    } else if (kind === 'tyrant-rave') {
      for (let i = 0; i < 5; i++) {
        const r = (8 + Math.sin((p + i * 0.08) * Math.PI) * 9) * scale;
        line(origin.x - facing * r * 0.4, origin.y + i * scale, origin.x + facing * r, origin.y - r * 0.7 + i * scale);
      }
    } else if (kind === 'ride-lightning') {
      ring(ground.x + state.motion.x * facing, ground.y - height * 0.5, height * 0.4, 1.3);
      for (let i = 0; i < 4; i++) {
        const y = ground.y - height * (0.2 + i * 0.18);
        line(origin.x - facing * height * 0.5, y, origin.x - facing * height * 0.7, y + Math.sin(p * 25 + i) * 7 * scale);
      }
    } else for (let i = 0; i < 5; i++) {
      const a = i * Math.PI * 2 / 5 + p * 12, r = (5 + charge * 8) * scale;
      ctx.beginPath(); ctx.moveTo(origin.x, origin.y); ctx.lineTo(origin.x + Math.cos(a + 0.3) * r * 0.45, origin.y + Math.sin(a) * r * 0.45);
      ctx.lineTo(origin.x + Math.cos(a) * r, origin.y + Math.sin(a) * r); ctx.stroke();
    }
  } else if (kind === 'suture') {
    for (let i = 0; i < 4; i++) {
      const offset = (i - 1.5) * 9 * scale;
      ctx.beginPath(); ctx.moveTo(origin.x, origin.y);
      ctx.quadraticCurveTo((origin.x + center.x) / 2, Math.min(origin.y, center.y) - 15 * charge * scale + offset, center.x, center.y + offset); ctx.stroke();
      line(center.x - 4 * scale, center.y + offset - 3 * scale, center.x + 4 * scale, center.y + offset + 3 * scale);
    }
  } else {
    const x = origin.x + facing * 12 * scale, y = ground.y - height * 0.42;
    ctx.beginPath();
    for (let i = 0; i <= 6; i++) {
      const a = i * Math.PI / 3, px = x + Math.cos(a) * 9 * scale, py = y + Math.sin(a) * 16 * scale;
      if (!i) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    if (release && q < 0.8) { ctx.lineWidth = 4 * scale * (1 - q); line(x, y, center.x, center.y); }
  }
  ctx.restore();
  return true;
}
