const clamp = value => Math.max(0, Math.min(1, Number(value) || 0));
const finite = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const definitions = {
  sonic_hedgehog: ['Sonic', 'Light Speed Attack', 'light-speed', 'damage', 170],
  miles_tails_prower: ['Sonic', 'Cyclone Power Laser', 'cyclone-laser', 'damage', 640],
  knuckles_echidna: ['Sonic', 'Thunder Arrow', 'thunder-arrow', 'damage', 640],
  jotaro_kujo: ["JoJo's Bizarre Adventure", 'Star Platinum — Ora Ora', 'ora-ora', 'damage', 170],
  giorno_giovanna: ["JoJo's Bizarre Adventure", 'Gold Experience — Muda Muda', 'muda-muda', 'damage', 170],
  joseph_joestar: ["JoJo's Bizarre Adventure", 'Hermit Purple — Hamon', 'hermit-hamon', 'damage', 170],
  devil_may_cry_dante: ['Devil May Cry', 'Sin Devil Trigger — Judgement', 'judgement', 'damage', 170],
  devil_may_cry_nero: ['Devil May Cry', 'Devil Trigger — Showdown', 'showdown', 'damage', 170],
  devil_may_cry_lady: ['Devil May Cry', 'Kalina Ann', 'kalina-ann', 'damage', 640],
  skullgirls_parasoul: ['Skullgirls', 'Inferno Brigade', 'inferno-brigade', 'damage', 640],
  skullgirls_big_band: ['Skullgirls', 'Super-Sonic Jazz', 'super-sonic-jazz', 'damage', 170],
  skullgirls_beowulf: ['Skullgirls', 'Three Wulf Moonsault', 'moonsault', 'damage', 170],
  snake: ['Metal Gear', 'Combo de coups de Snake', 'snake-combo', 'damage', 170],
  raiden: ['Metal Gear', 'Zandatsu Overdrive', 'zandatsu', 'damage', 170],
  otacon: ['Metal Gear', 'Philanthropy Upload', 'codec-support', 'buff', 760]
};
const contactKinds = new Set(['light-speed', 'ora-ora', 'muda-muda', 'hermit-hamon', 'judgement', 'showdown', 'super-sonic-jazz', 'moonsault', 'snake-combo', 'zandatsu']);

export function supportsNativeSuperWave6(profile) {
  const definition = definitions[profile?.sourceHeroId];
  return !!definition && profile.universe === definition[0] && profile.name === definition[1]
    && (!profile.effect || profile.effect === definition[3]);
}

export function supportsTrackedProjectileVisualWave6(profile) {
  return supportsNativeSuperWave6(profile) && profile.effect === 'damage' && profile.delivery === 'projectile'
    && ['devil_may_cry_lady', 'skullgirls_parasoul'].includes(profile.sourceHeroId);
}

export function sampleNativeSuperMotionWave6({ heroId, universe, phase, progress, impactProgress = 0.5, height = 72 }) {
  if (phase !== 'super' || definitions[heroId]?.[0] !== universe) return { x: 0, y: 0 };
  const p = clamp(progress), impact = Math.max(0.05, Math.min(0.9, finite(impactProgress, 0.5)));
  const approach = p < impact ? Math.sin(p / impact * Math.PI / 2) : Math.max(0, 1 - (p - impact) / (1 - impact));
  const distance = { sonic_hedgehog: 0.65, devil_may_cry_nero: 0.32, skullgirls_big_band: 0.45,
    skullgirls_beowulf: 0.3, snake: 0.2, raiden: 0.38 }[heroId] || 0;
  const size = Math.max(1, Math.min(1000, finite(height, 72)));
  const lift = heroId === 'skullgirls_beowulf' && p < impact ? -Math.sin(p / impact * Math.PI) * size * 0.65 : 0;
  return { x: size * distance * approach, y: lift };
}

// Existing action/summon clocks supply every value. These helpers never move a
// combatant, create a projectile, apply damage or advance a timer.
export function getNativeSuperVisualStateWave6({ actor, profile, action, target, height = 72, applyMotion = true, projectileVisual = null, contactVisual = null }) {
  if (!supportsNativeSuperWave6(profile) || !actor || !action || actor.universe !== profile.universe
    || (actor.sourceHeroId || actor.sourceId || actor.id) !== profile.sourceHeroId) return null;
  const definition = definitions[profile.sourceHeroId], kind = definition[2];
  const duration = Math.max(0.01, finite(action.duration, 1.1));
  const elapsed = Math.max(0, finite(action.elapsed, 0));
  const hitAt = Math.max(0.001, Math.min(duration, finite(action.hitAt, duration * 0.5)));
  const progress = clamp(elapsed / duration), impactProgress = Math.max(0.01, Math.min(0.95, hitAt / duration));
  const facing = action.facing < 0 ? -1 : 1;
  height = Math.max(1, Math.min(1000, finite(height, 72)));
  const range = Math.max(1, Math.min(10000, finite(profile.range, definition[4])));
  const ground = { x: finite(actor.x, 0), y: finite(actor.y, 0) };
  const motion = applyMotion ? sampleNativeSuperMotionWave6({ heroId: profile.sourceHeroId, universe: profile.universe,
    phase: 'super', progress, impactProgress, height }) : { x: 0, y: 0 };
  const tx = finite(target?.x, ground.x + facing * Math.min(range, 240)), ty = finite(target?.y, ground.y);
  const forward = (tx - ground.x) * facing;
  const contactControlled = contactVisual !== null;
  const confirmedContact = contactVisual?.confirmed === true && Number.isFinite(contactVisual.x) && Number.isFinite(contactVisual.y);
  const targetPoint = confirmedContact ? { x: contactVisual.x, y: contactVisual.y }
    : kind === 'codec-support' ? { ...ground }
      : { x: ground.x + facing * (forward > 0 ? Math.min(range, forward) : range), y: ty };
  const tracked = supportsTrackedProjectileVisualWave6(profile) && ['launch', 'flight', 'impact'].includes(projectileVisual?.phase)
    ? { phase: projectileVisual.phase, x: finite(projectileVisual.x, ground.x), y: finite(projectileVisual.y, ground.y),
      travelProgress: clamp(projectileVisual.travelProgress), elapsed: Math.max(0, finite(projectileVisual.elapsed, 0)),
      duration: Math.max(0.001, finite(projectileVisual.duration, 0.24)) } : null;
  return { family: 'native-wave6', heroId: profile.sourceHeroId, name: profile.name, kind, progress, impactProgress,
    release: elapsed >= hitAt, releaseProgress: clamp((progress - impactProgress) / (1 - impactProgress)),
    facing, height, range, color: profile.color || '#cbeaff', ground, motion,
    origin: { x: ground.x + (height * 0.22 + motion.x) * facing, y: ground.y - height * 0.48 + motion.y },
    target: targetPoint, contactEligible: contactControlled ? confirmedContact
      : !contactKinds.has(kind) || !!target && forward >= 0 && forward <= range && Math.abs(ty - ground.y) <= 96,
    ...(contactControlled ? { contactVisual: confirmedContact ? { confirmed: true, ...targetPoint } : { confirmed: false } } : {}),
    ...(tracked ? { projectileVisual: tracked } : {}), gameplayEffect: 'none', source1to1Verified: false };
}

export function drawNativeSuperVisualsWave6(ctx, state) {
  if (!state) return false;
  const { kind, origin, ground, target, height, facing, progress: p, release, releaseProgress: q } = state;
  const scale = height / 72, charge = clamp(p / state.impactProgress);
  const center = { x: target.x, y: target.y - height * 0.42 };
  const line = (x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
  const ring = (x, y, r, squash = 1) => { ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.01, r), Math.max(0.01, r * squash), 0, 0, Math.PI * 2); ctx.stroke(); };
  const rocket = (x, y) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(facing, 1); ctx.fillStyle = '#777e83'; ctx.fillRect(-9 * scale, -2 * scale, 16 * scale, 4 * scale);
    ctx.fillStyle = '#e6ad5e'; ctx.beginPath(); ctx.moveTo(7 * scale, -3 * scale); ctx.lineTo(12 * scale, 0); ctx.lineTo(7 * scale, 3 * scale); ctx.fill();
    ctx.strokeStyle = '#ffc05a'; line(-9 * scale, 0, -17 * scale, 0); ctx.restore();
  };
  const explosion = (x, y, progress) => {
    ctx.strokeStyle = '#ffbd6f'; ctx.lineWidth = 3 * scale * (1 - progress); ring(x, y, (7 + 23 * progress) * scale);
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; line(x + Math.cos(a) * 6 * scale, y + Math.sin(a) * 6 * scale,
      x + Math.cos(a) * (12 + progress * 16) * scale, y + Math.sin(a) * (12 + progress * 16) * scale); }
  };
  const bullet = (x, y) => { ctx.strokeStyle = '#ffdb9b'; ctx.lineWidth = 2 * scale; line(x - facing * 12 * scale, y, x + facing * 4 * scale, y); };
  ctx.save(); ctx.strokeStyle = state.color; ctx.fillStyle = state.color; ctx.lineWidth = 2 * scale;
  if (state.projectileVisual) {
    const visual = state.projectileVisual;
    if (visual.phase === 'launch') {
      if (!release) ring(origin.x, origin.y, (2 + charge * 3) * scale, 0.7);
    } else if (visual.phase === 'flight') {
      if (kind === 'kalina-ann') rocket(visual.x, visual.y); else bullet(visual.x, visual.y);
    } else {
      const fade = clamp(visual.elapsed / visual.duration); ctx.globalAlpha *= 1 - fade;
      explosion(visual.x, visual.y, fade);
    }
  } else if (kind === 'codec-support') {
    // Technical information stays at Otacon. No hostile reticle or medical cue.
    const x = ground.x + facing * height * 0.18, y = ground.y - height * 0.4;
    ctx.strokeStyle = '#83c9bd'; ctx.lineWidth = scale;
    ctx.strokeRect(x - 10 * scale, y - 7 * scale, 20 * scale, 14 * scale);
    for (let i = 0; i < 3; i++) line(x - 7 * scale, y + (i - 1) * 4 * scale,
      x + (3 + Math.sin(p * 9 + i) * 3) * scale, y + (i - 1) * 4 * scale);
    ring(x, y, (15 + charge * 8) * scale, 0.6);
  } else if (kind === 'cyclone-laser') {
    const muzzle = { x: origin.x + facing * height * 0.18, y: origin.y + height * 0.04 };
    if (!release) ring(muzzle.x, muzzle.y, (3 + 6 * charge) * scale);
    else if (q < 0.8) { ctx.lineWidth = (11 - q * 9) * scale; line(muzzle.x, muzzle.y, center.x, center.y);
      ctx.strokeStyle = '#fff9dc'; ctx.lineWidth = 2 * scale; line(muzzle.x, muzzle.y, center.x, center.y);
      if (state.contactEligible) ring(center.x, center.y, (7 + 12 * q) * scale); }
  } else if (kind === 'kalina-ann' || kind === 'inferno-brigade') {
    const travel = clamp((charge - 0.35) / 0.65);
    if (!release) {
      if (kind === 'kalina-ann') rocket(origin.x + (center.x - origin.x) * travel, origin.y + (center.y - origin.y) * travel);
      else bullet(origin.x + (center.x - origin.x) * travel, origin.y + (center.y - origin.y) * travel);
    } else if (q < 0.8 && state.contactEligible) explosion(center.x, center.y, q);
  } else if (kind === 'thunder-arrow') {
    if (!release) { ctx.strokeStyle = '#f6bc71'; ring(ground.x, ground.y - height * 0.35, (9 + charge * 5) * scale, 1.3); }
    else if (q < 0.75 && state.contactEligible) {
      ctx.strokeStyle = '#ffdb84';
      for (let i = 0; i < 3; i++) { const x = center.x + (i - 1) * 12 * scale; ctx.beginPath(); ctx.moveTo(x, center.y - height * 0.65);
        for (let j = 1; j <= 5; j++) ctx.lineTo(x + ((j % 2) * 2 - 1) * 4 * scale, center.y - height * 0.65 + j * height * 0.13); ctx.stroke(); }
      ring(center.x, center.y, (9 + q * 16) * scale, 0.4);
    }
  } else if (kind === 'hermit-hamon') {
    ctx.strokeStyle = '#b77ae1'; ctx.beginPath(); ctx.moveTo(origin.x, origin.y);
    const reach = release && state.contactEligible ? center.x : origin.x + facing * height * 0.55 * charge;
    const endY = release && state.contactEligible ? center.y : origin.y - height * 0.12;
    for (let i = 1; i <= 12; i++) { const t = i / 12; ctx.lineTo(origin.x + (reach - origin.x) * t, origin.y + (endY - origin.y) * t + Math.sin(t * 16 + p * 9) * 4 * scale); }
    ctx.stroke(); if (release && state.contactEligible && q < 0.6) { ctx.strokeStyle = '#ffdf89'; ring(center.x, center.y, (7 + q * 12) * scale); }
  } else if (kind === 'judgement' || kind === 'showdown' || kind === 'zandatsu') {
    const count = kind === 'judgement' ? 4 : kind === 'showdown' ? 3 : 2;
    ctx.strokeStyle = kind === 'judgement' ? '#ff7761' : '#a7e7ff';
    if (release && state.contactEligible && q < 0.75) for (let i = 0; i < count; i++) {
      const offset = (i - (count - 1) / 2) * 8 * scale;
      line(center.x - facing * 24 * scale, center.y - 17 * scale + offset, center.x + facing * 19 * scale, center.y + 17 * scale - offset);
    } else if (!release) ring(origin.x, origin.y, (3 + charge * 5) * scale, 1.5);
  } else {
    // Bodies, Stands, chairs and instruments come from native atlas poses.
    // These marks add only speed, brass glints or the single contact accent.
    if (['light-speed', 'super-sonic-jazz', 'moonsault'].includes(kind) && p < 0.8) {
      for (let i = 0; i < 3; i++) line(origin.x - facing * (14 + i * 5) * scale, origin.y + (i - 1) * 6 * scale,
        origin.x - facing * (3 + i * 2) * scale, origin.y + (i - 1) * 6 * scale);
    }
    if (release && state.contactEligible && q < 0.65) {
      const barrage = kind === 'ora-ora' || kind === 'muda-muda';
      if (barrage) for (let i = 0; i < 3; i++) { const offset = (i - 1) * 8 * scale;
        line(center.x - facing * (18 + i * 2) * scale, center.y + offset, center.x, center.y + offset); }
      ring(center.x, center.y, (5 + 14 * q) * scale, kind === 'moonsault' ? 0.55 : 1);
    }
  }
  ctx.restore(); return true;
}
