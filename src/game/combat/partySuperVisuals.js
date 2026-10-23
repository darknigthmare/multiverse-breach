const clamp = n => Math.max(0, Math.min(1, Number(n) || 0));
const definitions = {
  lightning_ff13: ['Final Fantasy XIII', 'Army of One', 'gunblade-combination'],
  fang_ff13: ['Final Fantasy XIII', 'Highwind', 'descending-lance'],
  vanille_ff13: ['Final Fantasy XIII', 'Death', 'saboteur-magic'],
  snow_ff13: ['Final Fantasy XIII', 'Sovereign Fist', 'descending-fist'],
  sazh_ff13: ['Final Fantasy XIII', 'Cold Blood', 'dual-pistol-volley'],
  hope_ff13: ['Final Fantasy XIII', 'Last Resort', 'raining-magic'],
  noctis_ff15: ['Final Fantasy XV', 'Armiger', 'royal-arm-orbit'],
  gladiolus_ff15: ['Final Fantasy XV', 'Dawnhammer', 'greatsword-impact'],
  ignis_ff15: ['Final Fantasy XV', 'Overwhelm', 'tactical-combination'],
  prompto_ff15: ['Final Fantasy XV', 'Trigger Happy', 'firearm-volley'],
  lunafreya_ff15: ['Final Fantasy XV', 'Oracle’s Blessing', 'oracle-blessing']
};

export function supportsPartySuper(profile) {
  const definition = definitions[profile?.sourceHeroId];
  return !!definition && profile.universe === definition[0] && profile.name === definition[1];
}

export function samplePartySuperMotion({ heroId, universe, phase, progress, impactProgress = 0.5, height = 72 }) {
  const definition = definitions[heroId];
  if (!definition || universe !== definition[0] || phase !== 'super'
    || !['descending-lance', 'descending-fist'].includes(definition[2])) return { x: 0, y: 0 };
  const p = clamp(progress), impact = Math.max(0.05, Math.min(0.9, impactProgress));
  // Land on the simulation's impact, then recover on the ground. This changes
  // only the displayed body, never its platform, range or collision position.
  const flight = p < impact ? Math.sin(Math.PI * p / impact) : 0;
  return { x: 0, y: -height * (heroId === 'fang_ff13' ? 1.25 : 0.85) * flight };
}

export function getPartySuperVisualState({ actor, profile, action, target, height = 72, applyMotion = true }) {
  if (!supportsPartySuper(profile) || !actor || !action || actor.universe !== profile.universe
    || (actor.sourceHeroId || actor.sourceId || actor.id) !== profile.sourceHeroId) return null;
  if (profile.sourceHeroId === 'lunafreya_ff15' && profile.effect && profile.effect !== 'heal') return null;
  const duration = Math.max(0.01, Number(action.duration) || 0.01);
  const progress = clamp(action.elapsed / duration), impactProgress = Math.max(0.01, Math.min(0.95, action.hitAt / duration));
  const release = action.elapsed >= action.hitAt;
  const facing = action.facing < 0 ? -1 : 1;
  const motion = applyMotion ? samplePartySuperMotion({ heroId: profile.sourceHeroId, universe: profile.universe,
    phase: 'super', progress, impactProgress, height }) : { x: 0, y: 0 };
  return {
    family: 'party', heroId: profile.sourceHeroId, kind: definitions[profile.sourceHeroId][2], progress, release,
    impactProgress, releaseProgress: release ? clamp((progress - impactProgress) / (1 - impactProgress)) : 0,
    facing, height, color: profile.color || '#dce8ff', motion,
    origin: { x: actor.x + facing * height * 0.2, y: actor.y + motion.y - height * 0.48 },
    ground: { x: actor.x, y: actor.y },
    target: { x: target?.x ?? actor.x + facing * Math.min(profile.range || 220, 220), y: target?.y ?? actor.y },
    gameplayEffect: 'none', source1to1Verified: false
  };
}

export function drawPartySuperVisuals(ctx, state) {
  if (!state) return false;
  const { kind, origin, ground, target, progress, release, releaseProgress: q, facing, height } = state;
  const scale = height / 72, center = { x: target.x, y: target.y - height * 0.42 };
  const line = (x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
  const ring = (x, y, radius, flatten = 1) => { ctx.beginPath(); ctx.ellipse(x, y, radius, radius * flatten, 0, 0, Math.PI * 2); ctx.stroke(); };
  ctx.save(); ctx.strokeStyle = state.color; ctx.fillStyle = state.color; ctx.lineWidth = 2 * scale;
  if (kind === 'dual-pistol-volley' || kind === 'firearm-volley') {
    // Seventeen visible Cold Blood shots share the one authoritative damage
    // event. These finite tracers never create projectiles or extra hits.
    const count = kind === 'dual-pistol-volley' ? 17 : 12;
    if (release && q < 1) for (let i = 0; i < count; i++) {
      const t = (q * count - i) * 2;
      if (t < 0 || t > 1) continue;
      const y = origin.y + (kind === 'dual-pistol-volley' ? (i % 2 ? 3 : -3) * scale : 0);
      const x = origin.x + (center.x - origin.x) * t;
      const py = y + (center.y - y) * t;
      line(x - facing * 9 * scale, py, x, py);
    }
  } else if (kind === 'raining-magic') {
    for (let i = 0; i < 8; i++) {
      const t = clamp(progress / state.impactProgress), x = origin.x + (center.x - origin.x + (i - 3.5) * 10 * scale) * t;
      const y = origin.y + (center.y - origin.y) * t - Math.sin(t * Math.PI) * height * 1.4;
      if (t > 0 && t < 1) { ctx.beginPath(); ctx.arc(x, y - Math.sin(t * Math.PI) * i * 3 * scale, 3 * scale, 0, Math.PI * 2); ctx.fill(); }
      else if (release && q < 0.3) ring(x, center.y, (3 + q * 15) * scale);
    }
  } else if (kind === 'royal-arm-orbit') {
    // Condensed royal-weapon silhouettes, not an additional equipment loadout.
    for (let i = 0; i < 5; i++) {
      const angle = progress * Math.PI * 2 + i * Math.PI * 2 / 5;
      const x = ground.x + Math.cos(angle) * height * 0.45;
      const y = ground.y - height * 0.52 + Math.sin(angle) * height * 0.3;
      const tip = 19 * scale, dx = Math.cos(angle) * tip, dy = Math.sin(angle) * tip;
      line(x, y, x + dx, y + dy); line(x - dy * 0.2, y + dx * 0.2, x + dy * 0.2, y - dx * 0.2);
    }
  } else if (kind === 'oracle-blessing') {
    // The oracle blesses the chosen ally. No hostile beam or attack silhouette.
    ring(target.x, target.y - 3 * scale, (18 + 16 * progress) * scale, 0.25);
    for (let i = 0; i < 7; i++) {
      const t = (progress + i / 7) % 1, x = target.x + Math.sin(i * 2.4) * 22 * scale;
      const y = target.y - t * height;
      line(x - 2 * scale, y, x + 2 * scale, y); line(x, y - 3 * scale, x, y + 3 * scale);
    }
  } else if (kind === 'saboteur-magic') {
    for (let i = 0; i < 6; i++) {
      const angle = i * Math.PI / 3 + progress * 2;
      const radius = (24 + Math.sin(progress * Math.PI) * 12) * scale;
      const x = center.x + Math.cos(angle) * radius, y = center.y + Math.sin(angle) * radius;
      line(x, y, x + Math.cos(angle + 0.8) * 8 * scale, y + Math.sin(angle + 0.8) * 8 * scale);
    }
  } else if (kind === 'descending-lance' || kind === 'descending-fist' || kind === 'greatsword-impact') {
    if (!release && kind !== 'greatsword-impact') line(origin.x, origin.y - 14 * scale, origin.x + facing * 8 * scale, origin.y + 14 * scale);
    if (release && q < 0.7) {
      ring(target.x, target.y - 2 * scale, (8 + 38 * q) * scale, 0.25);
      const rays = kind === 'descending-fist' ? 4 : 6;
      for (let i = 0; i < rays; i++) {
        const angle = -Math.PI + Math.PI * (i + 0.5) / rays;
        line(target.x, target.y, target.x + Math.cos(angle) * (10 + q * 25) * scale, target.y + Math.sin(angle) * (10 + q * 25) * scale);
      }
    }
  } else {
    // Army of One retains blade-and-gun timing; Overwhelm shows Ignis's own
    // movement cue without fabricating absent party members or extra damage.
    const count = kind === 'gunblade-combination' ? 11 : 3;
    if (release && q < 1) for (let i = 0; i < count; i++) {
      const t = (q * count - i) * 2;
      if (t < 0 || t > 1) continue;
      const dx = (t - 0.5) * 30 * scale;
      line(center.x - facing * 12 * scale + dx, center.y - 15 * scale, center.x + facing * 12 * scale - dx, center.y + 15 * scale);
    }
    if (kind === 'gunblade-combination' && release && q > 0.55 && q < 0.8) line(origin.x, origin.y, center.x, center.y);
  }
  ctx.restore(); return true;
}
