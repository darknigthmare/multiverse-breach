import { getCharacterAnimationFrame } from './characterAnimationCatalog.js';

const clamp = value => Math.max(0, Math.min(1, Number(value) || 0));
const finite = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const definitions = {
  robin_tt: ['Teen Titans', 'Enchaînement au bâton de Robin', 'staff', 'damage', 185],
  cyborg_tt: ['Teen Titans', 'Sonic Cannon de Cyborg', 'sonic', 'damage', 760],
  raven_tt: ['Teen Titans', 'Azarath Metrion Zinthos — barrière', 'barrier', 'guard', 1200],
  starfire_tt: ['Teen Titans', 'Salve de starbolts de Starfire', 'starbolts', 'damage', 640],
  beast_boy_tt: ['Teen Titans', 'Charge du T-Rex vert', 'trex', 'damage', 185],
  kiryu_yakuza: ['Yakuza', 'Coup du Dragon de Dojima', 'dragon-combo', 'damage', 185],
  majima_yakuza: ['Yakuza', 'Style Mad Dog — coupe au tantō', 'tanto', 'damage', 185],
  ichiban_yakuza: ['Yakuza', 'Giga Swing', 'bat-sweep', 'damage', 420],
  saejima_yakuza: ['Yakuza', 'Herculean Spirit', 'personal-guard', 'guard', 1],
  akiyama_yakuza: ['Yakuza', 'Launch Strike', 'kicks', 'damage', 185],
  blade_wolf_mgr: ['Metal Gear Rising', 'Coupe de la scie caudale', 'tail-saw', 'damage', 170],
  jetstream_sam: ['Metal Gear Rising', 'Iai de Murasama', 'murasama', 'damage', 185],
  armstrong_mgr: ['Metal Gear Rising', 'Frappe sismique d’Armstrong', 'ground-quake', 'damage', 190],
  mistral_mgr: ['Metal Gear Rising', 'Spirale de L’Étranger', 'polearm', 'damage', 195],
  monsoon_mgr: ['Metal Gear Rising', 'Assaut magnétique de Monsoon', 'metal-debris', 'damage', 560],
  laios_meshi: ['Dungeon Meshi', 'Coupe de Kensuke', 'kensuke', 'damage', 170],
  marcille_meshi: ['Dungeon Meshi', 'Explosion magique de Marcille', 'ambrosia', 'damage', 420],
  senshi_meshi: ['Dungeon Meshi', 'Repas équilibré du donjon', 'meal', 'heal', 760],
  chilchuck_meshi: ['Dungeon Meshi', 'Désamorçage des pièges de Chilchuck', 'safe-route', 'guard', 760],
  falin_meshi: ['Dungeon Meshi', 'Magie de soin de Falin', 'healing', 'heal', 760]
};
const contactKinds = new Set(['staff', 'trex', 'dragon-combo', 'tanto', 'bat-sweep', 'kicks', 'tail-saw', 'murasama', 'polearm', 'kensuke']);
// Orifice centers measured on the packed256px native cells, excluding the
// surrounding sonic halo. A lowered/retracted cannon has no emitting anchor.
const cyborgMuzzles = {
  super: [{ x: 202, y: 118 }, { x: 164, y: 117 }, { x: 158, y: 119 }, null],
  fatality: [null, { x: 189, y: 121 }, { x: 160, y: 120 }, null]
};
export function supportsNativeSuperWave8(profile) {
  const spec = definitions[profile?.sourceHeroId];
  return !!spec && profile.universe === spec[0] && profile.name === spec[1] && (!profile.effect || profile.effect === spec[3]);
}
export const supportsTrackedProjectileVisualWave8 = profile => supportsNativeSuperWave8(profile)
  && profile.sourceHeroId === 'starfire_tt' && profile.effect === 'damage' && profile.delivery === 'projectile';

export function sampleNativeSuperMotionWave8({ heroId, universe, phase, progress, impactProgress = 0.5, height = 72 }) {
  if (phase !== 'super' || definitions[heroId]?.[0] !== universe) return { x: 0, y: 0 };
  const p = clamp(progress), impact = Math.max(0.05, Math.min(0.9, finite(impactProgress, 0.5)));
  const approach = p < impact ? Math.sin(p / impact * Math.PI / 2) : Math.max(0, 1 - (p - impact) / (1 - impact));
  const h = Math.max(1, Math.min(1000, finite(height, 72)));
  const reach = { robin_tt: 0.2, beast_boy_tt: 0.28, kiryu_yakuza: 0.22, majima_yakuza: 0.27, akiyama_yakuza: 0.25, blade_wolf_mgr: 0.23, jetstream_sam: 0.32, mistral_mgr: 0.18, laios_meshi: 0.2 }[heroId] || 0;
  return { x: h * reach * approach, y: heroId === 'akiyama_yakuza' && p < impact ? -Math.sin(p / impact * Math.PI) * h * 0.18 : 0 };
}

// Pure projection. Engines own collision, costs, statuses and the impact clock.
// Native artwork supplies all bodies, forms, weapons, food and trap tools.
export function getNativeSuperVisualStateWave8({ actor, profile, action, target, height = 72, applyMotion = true, projectileVisual = null, contactVisual = null }) {
  if (!supportsNativeSuperWave8(profile) || !actor || !action || actor.universe !== profile.universe
    || (actor.sourceHeroId || actor.sourceId || actor.id) !== profile.sourceHeroId) return null;
  const spec = definitions[profile.sourceHeroId], supportive = spec[3] !== 'damage';
  const duration = Math.max(0.01, finite(action.duration, 1.1)), elapsed = Math.max(0, finite(action.elapsed, 0));
  const hitAt = Math.max(0.001, Math.min(duration, finite(action.hitAt, duration * 0.5)));
  const progress = clamp(elapsed / duration), impactProgress = Math.max(0.01, Math.min(0.95, hitAt / duration));
  const facing = action.facing < 0 ? -1 : 1;
  height = Math.max(1, Math.min(1000, finite(height, 72)));
  const range = Math.max(1, Math.min(10000, finite(profile.range, spec[4])));
  const ground = { x: finite(actor.x, 0), y: finite(actor.y, 0) };
  const motion = applyMotion ? sampleNativeSuperMotionWave8({ heroId: profile.sourceHeroId, universe: profile.universe, phase: 'super', progress, impactProgress, height }) : { x: 0, y: 0 };
  const tx = finite(target?.x, ground.x + facing * Math.min(range, 240)), ty = finite(target?.y, ground.y), forward = (tx - ground.x) * facing;
  const confirmed = !supportive && contactVisual?.confirmed === true && Number.isFinite(contactVisual.x) && Number.isFinite(contactVisual.y);
  const point = supportive ? { ...ground } : confirmed ? { x: contactVisual.x, y: contactVisual.y }
    : { x: ground.x + facing * (forward > 0 ? Math.min(range, forward) : range), y: ty };
  const tracked = supportsTrackedProjectileVisualWave8(profile) && ['launch', 'flight', 'impact'].includes(projectileVisual?.phase)
    ? { phase: projectileVisual.phase, x: finite(projectileVisual.x, ground.x), y: finite(projectileVisual.y, ground.y), travelProgress: clamp(projectileVisual.travelProgress),
      elapsed: Math.max(0, finite(projectileVisual.elapsed, 0)), duration: Math.max(0.001, finite(projectileVisual.duration, 0.24)) } : null;
  let origin = { x: ground.x + (height * 0.22 + motion.x) * facing, y: ground.y - height * 0.48 + motion.y };
  let nativeMuzzleActive;
  if (profile.sourceHeroId === 'cyborg_tt') {
    const phase = actor.presentationPhase === 'fatality' ? 'fatality' : 'super';
    const frame = getCharacterAnimationFrame(actor, { phase, progress, impactProgress });
    if (frame) {
      const column = Number.isInteger(actor.presentationFrame?.col) ? Math.max(0, Math.min(3, actor.presentationFrame.col)) : frame.col;
      const anchor = cyborgMuzzles[phase][column];
      nativeMuzzleActive = !!anchor;
      if (anchor) {
        const bodyScale = Math.max(0.5, Math.min(3, Number(frame.asset.normalization?.rows?.[frame.row]?.renderScale) || 1));
        const scale = height / frame.asset.frameHeight * bodyScale, baseline = frame.asset.normalization?.baseline || 244;
        origin = { x: ground.x + motion.x * facing + (anchor.x - frame.asset.frameWidth / 2) * scale * facing,
          y: ground.y + motion.y + (anchor.y - baseline) * scale };
      }
    }
  }
  return { family: 'native-wave8', heroId: profile.sourceHeroId, name: profile.name, kind: spec[2], effect: spec[3], supportive,
    progress, impactProgress, release: elapsed >= hitAt, releaseProgress: clamp((progress - impactProgress) / (1 - impactProgress)),
    facing, height, range, color: profile.color || '#d0e7ff', ground, motion,
    origin, ...(nativeMuzzleActive !== undefined ? { nativeMuzzleActive } : {}), target: point,
    contactEligible: !supportive && (contactVisual !== null ? confirmed : !!target && forward >= 0 && forward <= range && Math.abs(ty - ground.y) <= 96),
    ...(contactVisual !== null ? { contactVisual: confirmed ? { confirmed: true, ...point } : { confirmed: false } } : {}),
    ...(tracked ? { projectileVisual: tracked } : {}), gameplayEffect: 'none', source1to1Verified: false };
}

export function drawNativeSuperVisualsWave8(ctx, state) {
  if (!state) return false;
  const { kind, ground, origin, target, height: h, facing, progress: p, release, releaseProgress: q } = state;
  const s = h / 72, center = { x: target.x, y: target.y - h * 0.42 };
  const line = (a, b) => { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); };
  const ring = (x, y, radius, flatten = 1) => { ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.01, radius), Math.max(0.01, radius * flatten), 0, 0, Math.PI * 2); ctx.stroke(); };
  const impact = () => { if (release && state.contactEligible) ring(center.x, center.y, (6 + 20 * q) * s); };
  ctx.save(); ctx.globalAlpha *= 0.82; ctx.lineWidth = 2 * s; ctx.strokeStyle = state.color;
  if (state.supportive) {
    // Local accents cannot follow the enemy target supplied by combat preview.
    ctx.globalAlpha *= release ? 1 - q * 0.65 : 0.25 + p;
    if (kind === 'barrier' || kind === 'personal-guard') {
      ctx.strokeStyle = kind === 'barrier' ? '#b7a0ed' : '#d2b98a';
      const direction = facing < 0 ? Math.PI : 0;
      ctx.beginPath(); ctx.arc(ground.x, ground.y - h * 0.43, h * 0.46, direction - Math.PI * 0.77, direction + Math.PI * 0.77); ctx.stroke();
    } else if (kind === 'safe-route') {
      ctx.strokeStyle = '#d6bf8d'; ctx.setLineDash([4 * s, 5 * s]);
      line({ x: ground.x - h * 0.35, y: ground.y - 2 * s }, { x: ground.x + h * 0.4, y: ground.y - 2 * s });
    } else {
      // Prepared food stays physical in the native art; healing is a UI accent.
      ctx.strokeStyle = kind === 'meal' ? '#f4d49b' : '#a6e9c4';
      ring(ground.x, ground.y - 3 * s, (13 + p * 7) * s, 0.28);
      if (release) {
        const y = ground.y - h * (0.63 + q * 0.18);
        line({ x: ground.x - 5 * s, y }, { x: ground.x + 5 * s, y });
        line({ x: ground.x, y: y - 5 * s }, { x: ground.x, y: y + 5 * s });
      }
    }
  } else if (state.projectileVisual) {
    const v = state.projectileVisual; ctx.strokeStyle = '#82f95d';
    if (v.phase === 'launch') { ctx.globalAlpha *= 0.45; ring(origin.x, origin.y, (3 + 4 * p) * s); }
    else if (v.phase === 'flight') {
      ctx.lineWidth = 4 * s;
      line({ x: v.x - facing * 8 * s, y: v.y }, { x: v.x + facing * 7 * s, y: v.y });
      ring(v.x, v.y, 4 * s, 0.65);
    } else ring(v.x, v.y, (6 + 19 * clamp(v.elapsed / v.duration)) * s);
  } else if (contactKinds.has(kind)) {
    // No procedural limb, animal, bat, chain saw, polearm or sword body.
    if (!release) { ctx.globalAlpha *= 0.3; ring(origin.x, origin.y, (4 + 3 * p) * s, 0.6); }
    else if (state.contactEligible) {
      if (kind !== 'trex' && kind !== 'dragon-combo' && kind !== 'kicks') {
        for (let i = 0; i < 2; i++) line({ x: center.x - facing * (14 + i * 4) * s, y: center.y + (10 - i * 7) * s }, { x: center.x + facing * 16 * s, y: center.y - (10 - i * 7) * s });
      }
      impact();
    }
  } else if (kind === 'sonic') {
    ctx.strokeStyle = '#83dafa';
    if (state.nativeMuzzleActive === false) impact();
    else if (!release) ring(origin.x, origin.y, (4 + p * 8) * s);
    else {
      ctx.lineWidth = (5 - q * 3) * s; line(origin, center);
      for (let i = 1; i <= 3; i++) ring(origin.x + (center.x - origin.x) * i / 4, origin.y + (center.y - origin.y) * i / 4, (5 + i * 2) * s, 1);
      impact();
    }
  } else if (kind === 'ground-quake') {
    if (!release) ring(ground.x, ground.y - 2 * s, 9 * s, 0.25);
    else if (state.contactEligible) {
      ring(ground.x + facing * 14 * s, ground.y, (15 + 40 * q) * s, 0.22);
      for (let i = 0; i < 3; i++) line({ x: ground.x + facing * (12 + i * 10) * s, y: ground.y }, { x: ground.x + facing * (19 + i * 12) * s, y: ground.y - (3 + i * 2) * s });
      impact();
    }
  } else if (kind === 'metal-debris') {
    const launchAt = state.impactProgress * 0.55;
    if (p < launchAt) ring(origin.x, origin.y, (6 + p * 6) * s, 0.45);
    else if (!release) {
      // Small non-body metal fragments travel before the authoritative impact.
      // All segmented anatomy is native art, never these rectangles.
      const travel = clamp((p - launchAt) / Math.max(0.001, state.impactProgress - launchAt));
      for (let i = 0; i < 4; i++) {
        const t = travel ** (1 + i * 0.12), x = origin.x + (center.x - origin.x) * t, y = origin.y + (center.y - origin.y) * t + Math.sin(t * Math.PI) * (i - 1.5) * 8 * s;
        ctx.strokeRect(x - 3 * s, y - 2 * s, 6 * s, 4 * s);
      }
    } else if (state.contactEligible) {
      for (let i = 0; i < 4; i++) {
        const angle = i * Math.PI / 2, spread = q * 18 * s;
        ctx.strokeRect(center.x + Math.cos(angle) * spread - 3 * s, center.y + Math.sin(angle) * spread - 2 * s, 6 * s, 4 * s);
      }
      impact();
    }
  } else if (kind === 'ambrosia') {
    if (!release) ring(origin.x, origin.y, (4 + 7 * p) * s);
    else if (state.contactEligible) {
      ring(center.x, center.y, (10 + 35 * q) * s);
      ring(center.x, center.y, (6 + 22 * q) * s, 0.55);
    }
  } else if (kind === 'starbolts') {
    // Smash and RPG resolve this ranged super on their action clock. Project
    // its casting/flight into that same clock without spawning a second hit.
    // Fighter supplies the physical projectile above and never uses this path.
    ctx.strokeStyle = '#82f95d';
    const launchAt = state.impactProgress * 0.55;
    if (p < launchAt) { ctx.globalAlpha *= 0.4; ring(origin.x, origin.y, (4 + p * 5) * s); }
    else if (!release) {
      const travel = clamp((p - launchAt) / Math.max(0.001, state.impactProgress - launchAt));
      const x = origin.x + (center.x - origin.x) * travel, y = origin.y + (center.y - origin.y) * travel;
      ctx.lineWidth = 4 * s;
      line({ x: x - facing * 8 * s, y }, { x: x + facing * 7 * s, y });
      ring(x, y, 4 * s, 0.65);
    } else impact();
  }
  ctx.restore(); return true;
}
