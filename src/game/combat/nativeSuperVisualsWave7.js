import { getSummonAnimationAssets } from './summonAnimationCatalog.js';

const clamp = value => Math.max(0, Math.min(1, Number(value) || 0));
const finite = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const definitions = {
  ragna: ['BlazBlue', 'Carnage Scissors', 'carnage', 'damage', 170],
  jin: ['BlazBlue', 'Touga Hyoujin', 'ice', 'damage', 640],
  noel: ['BlazBlue', 'Thor', 'thor', 'damage', 640],
  rachel_bb: ['BlazBlue', 'Baden-Baden Lily', 'lightning', 'damage', 640],
  hazama_bb: ['BlazBlue', 'Eternal Coils of the Dragon Serpent', 'chains', 'damage', 720],
  luke: ['Star Wars', 'Enchaînement au sabre de Luke', 'green-saber', 'damage', 170],
  vader: ['Star Wars', 'Enchaînement au sabre de Vader', 'red-saber', 'damage', 170],
  han_solo: ['Star Wars', 'Tir précis au DL-44', 'blaster', 'damage', 640],
  leia_organa: ['Star Wars', 'Tir au blaster de Leia', 'blaster', 'damage', 640],
  obi_wan: ['Star Wars', 'Soresu — défense au sabre', 'soresu', 'guard', 1],
  may_gg: ['Guilty Gear', 'Great Yamada Attack', 'yamada', 'damage', 640],
  dizzy_gg: ['Guilty Gear', 'Gamma Ray de Dizzy', 'gamma', 'damage', 680],
  millia_gg: ['Guilty Gear', 'Winger', 'winger', 'damage', 170],
  axl_gg: ['Guilty Gear', 'Sickle Storm', 'sickle', 'damage', 170],
  baiken_gg: ['Guilty Gear', 'Tsurane Sanzu-watashi', 'sanzu', 'damage', 170],
  kenshin_himura: ['Rurouni Kenshin', 'Amakakeru Ryū no Hirameki', 'amakakeru', 'damage', 195],
  sanosuke_sagara: ['Rurouni Kenshin', 'Futae no Kiwami', 'futae', 'damage', 145],
  kaoru_kamiya: ['Rurouni Kenshin', 'Bokken du Kamiya Kasshin-ryū', 'kamiya-kasshin', 'damage', 170]
};
const trackedIds = new Set(['noel', 'han_solo', 'leia_organa', 'may_gg']);
const contactKinds = new Set(['carnage', 'green-saber', 'red-saber', 'winger', 'sickle', 'sanzu', 'amakakeru', 'futae', 'kamiya-kasshin']);
const yamadaKey = 'Guilty Gear::Yamada::Great Yamada Attack';
const entityImages = new Map();

export function supportsNativeSuperWave7(profile) {
  const definition = definitions[profile?.sourceHeroId];
  return !!definition && profile.universe === definition[0] && profile.name === definition[1]
    && (!profile.effect || profile.effect === definition[3]);
}
export const supportsTrackedProjectileVisualWave7 = profile => supportsNativeSuperWave7(profile)
  && profile.effect === 'damage' && profile.delivery === 'projectile' && trackedIds.has(profile.sourceHeroId);

const yamadaAsset = () => getSummonAnimationAssets().find(entry => entry.key === yamadaKey && entry.kind === 'summon');
const imageFor = asset => {
  if (!asset || typeof Image === 'undefined') return null;
  if (!entityImages.has(asset.sheet)) {
    const image = new Image(); image.src = asset.sheet; entityImages.set(asset.sheet, image);
  }
  return entityImages.get(asset.sheet);
};
export function preloadNativeSuperAssetsWave7(actors = []) {
  if (actors.some(actor => (actor.sourceHeroId || actor.sourceId || actor.id) === 'may_gg' && actor.universe === 'Guilty Gear')) imageFor(yamadaAsset());
}

export function sampleNativeSuperMotionWave7({ heroId, universe, phase, progress, impactProgress = 0.5, height = 72 }) {
  if (phase !== 'super' || definitions[heroId]?.[0] !== universe) return { x: 0, y: 0 };
  const p = clamp(progress), impact = Math.max(0.05, Math.min(0.9, finite(impactProgress, 0.5)));
  const approach = p < impact ? Math.sin(p / impact * Math.PI / 2) : Math.max(0, 1 - (p - impact) / (1 - impact));
  const size = Math.max(1, Math.min(1000, finite(height, 72)));
  const reach = { ragna: 0.36, luke: 0.2, vader: 0.16, millia_gg: 0.3, axl_gg: 0.24, baiken_gg: 0.25, kenshin_himura: 0.4, sanosuke_sagara: 0.3 }[heroId] || 0;
  const lift = ['noel', 'millia_gg'].includes(heroId) && p < impact ? -Math.sin(p / impact * Math.PI) * size * 0.45 : 0;
  return { x: size * reach * approach, y: lift };
}

// All clocks, collisions, positions and damage belong to the existing engines.
// This projection supplies accents and the genuine Yamada projectile artwork.
export function getNativeSuperVisualStateWave7({ actor, profile, action, target, height = 72, applyMotion = true, projectileVisual = null, contactVisual = null }) {
  if (!supportsNativeSuperWave7(profile) || !actor || !action || actor.universe !== profile.universe
    || (actor.sourceHeroId || actor.sourceId || actor.id) !== profile.sourceHeroId) return null;
  const definition = definitions[profile.sourceHeroId];
  const duration = Math.max(0.01, finite(action.duration, 1.1)), elapsed = Math.max(0, finite(action.elapsed, 0));
  const hitAt = Math.max(0.001, Math.min(duration, finite(action.hitAt, duration * 0.5)));
  const progress = clamp(elapsed / duration), impactProgress = Math.max(0.01, Math.min(0.95, hitAt / duration));
  const facing = action.facing < 0 ? -1 : 1;
  height = Math.max(1, Math.min(1000, finite(height, 72)));
  const range = Math.max(1, Math.min(10000, finite(profile.range, definition[4])));
  const ground = { x: finite(actor.x, 0), y: finite(actor.y, 0) };
  const motion = applyMotion ? sampleNativeSuperMotionWave7({ heroId: profile.sourceHeroId, universe: profile.universe, phase: 'super', progress, impactProgress, height }) : { x: 0, y: 0 };
  const tx = finite(target?.x, ground.x + facing * Math.min(range, 240)), ty = finite(target?.y, ground.y);
  const forward = (tx - ground.x) * facing;
  const confirmed = contactVisual?.confirmed === true && Number.isFinite(contactVisual.x) && Number.isFinite(contactVisual.y);
  const point = confirmed ? { x: contactVisual.x, y: contactVisual.y }
    : definition[2] === 'soresu' ? { ...ground }
      : { x: ground.x + facing * (forward > 0 ? Math.min(range, forward) : range), y: ty };
  const tracked = supportsTrackedProjectileVisualWave7(profile) && ['launch', 'flight', 'impact'].includes(projectileVisual?.phase)
    ? { phase: projectileVisual.phase, x: finite(projectileVisual.x, ground.x), y: finite(projectileVisual.y, ground.y),
      travelProgress: clamp(projectileVisual.travelProgress), elapsed: Math.max(0, finite(projectileVisual.elapsed, 0)), duration: Math.max(0.001, finite(projectileVisual.duration, 0.24)) } : null;
  return { family: 'native-wave7', heroId: profile.sourceHeroId, name: profile.name, kind: definition[2], progress, impactProgress,
    release: elapsed >= hitAt, releaseProgress: clamp((progress - impactProgress) / (1 - impactProgress)),
    facing, height, range, color: profile.color || '#d0e7ff', ground, motion,
    origin: { x: ground.x + (height * 0.22 + motion.x) * facing, y: ground.y - height * 0.48 + motion.y }, target: point,
    contactEligible: contactVisual !== null ? confirmed : !contactKinds.has(definition[2]) || !!target && forward >= 0 && forward <= range && Math.abs(ty - ground.y) <= 96,
    ...(contactVisual !== null ? { contactVisual: confirmed ? { confirmed: true, ...point } : { confirmed: false } } : {}),
    ...(tracked ? { projectileVisual: tracked } : {}), gameplayEffect: 'none', source1to1Verified: false };
}

function drawYamada(ctx, state, x, y, phase, column) {
  const asset = yamadaAsset(), image = imageFor(asset);
  if (!image?.complete || !image.naturalWidth) return false;
  const size = state.height * 1.65;
  ctx.save(); ctx.translate(x, y); ctx.scale(state.facing, 1); ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, Math.max(0, Math.min(3, column)) * 256, asset.phases[phase].row * 256, 256, 256, -size / 2, -size / 2, size, size);
  ctx.restore(); return true;
}

export function drawNativeSuperVisualsWave7(ctx, state) {
  if (!state) return false;
  const { kind, origin, target, ground, height: h, facing, progress: p, release, releaseProgress: q } = state;
  const scale = h / 72, center = { x: target.x, y: target.y - h * 0.42 };
  const line = (x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
  const ring = (x, y, r, flat = 1) => { ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.01, r), Math.max(0.01, r * flat), 0, 0, Math.PI * 2); ctx.stroke(); };
  const impact = (color = state.color) => {
    if (!release || !state.contactEligible) return;
    ctx.strokeStyle = color; ctx.lineWidth = Math.max(0.5, 3 * scale * (1 - q)); ring(center.x, center.y, (7 + 20 * q) * scale);
  };
  ctx.save(); ctx.globalAlpha *= 0.85; ctx.lineWidth = 2 * scale; ctx.strokeStyle = state.color;
  if (kind === 'soresu') {
    // Saber deflection is a local guard accent, never a remote hit or heal.
    ctx.strokeStyle = '#8bcaff'; ctx.globalAlpha *= release ? 1 - q * 0.55 : 0.3 + p;
    ctx.beginPath(); ctx.arc(ground.x, ground.y - h * 0.42, h * 0.43, -Math.PI * 0.72, Math.PI * 0.72); ctx.stroke();
  } else if (state.projectileVisual) {
    const v = state.projectileVisual;
    if (v.phase === 'launch') {
      // Windup has no released projectile. Accent the local muzzle/call only.
      ctx.globalAlpha *= 0.4;
      ctx.strokeStyle = kind === 'yamada' ? '#8fe9fa' : kind === 'thor' ? '#ffd38a' : '#ff806b';
      ring(origin.x, origin.y, (3 + p * 5) * scale, kind === 'yamada' ? 0.45 : 1);
    } else if (kind === 'yamada') drawYamada(ctx, state, v.x, v.y, v.phase === 'impact' ? 'attack' : 'preparation', v.phase === 'impact' ? 2 : Math.min(3, Math.floor(v.travelProgress * 4)));
    else {
      ctx.strokeStyle = kind === 'thor' ? '#ffd38a' : '#ff806b'; ctx.lineWidth = (kind === 'thor' ? 5 : 3) * scale;
      line(v.x - facing * 11 * scale, v.y, v.x + facing * 9 * scale, v.y);
      if (kind === 'thor') { ctx.lineWidth = 1.5 * scale; line(v.x - facing * 18 * scale, v.y - 3 * scale, v.x - facing * 7 * scale, v.y - 3 * scale); }
    }
    if (v.phase === 'impact') { ctx.strokeStyle = kind === 'yamada' ? '#8fe9fa' : state.color; ring(v.x, v.y, (7 + 20 * clamp(v.elapsed / v.duration)) * scale); }
  } else if (kind === 'yamada') {
    const travel = Math.min(1, p / state.impactProgress);
    const x = ground.x + (target.x - ground.x) * travel;
    const y = ground.y - h * 0.43 - Math.sin(travel * Math.PI) * h * 0.45;
    const phase = !release ? p < state.impactProgress * 0.5 ? 'arrival' : 'preparation' : 'attack';
    const column = release ? state.contactEligible ? 2 : 3 : Math.min(3, Math.floor(travel * 4));
    drawYamada(ctx, state, x, y, phase, column); impact('#91e6f5');
  } else if (contactKinds.has(kind)) {
    // Native pixels carry swords, hair and fists. These are bounded light trails.
    ctx.strokeStyle = kind === 'green-saber' ? '#71ed92' : kind === 'red-saber' ? '#ff7777' : state.color;
    if (!release) {
      ctx.globalAlpha *= 0.25 + p * 0.5; line(origin.x - facing * 17 * scale, origin.y + 12 * scale, origin.x + facing * 17 * scale, origin.y - 13 * scale);
    } else if (state.contactEligible) {
      for (let i = 0; i < (kind === 'futae' ? 2 : 3); i++) line(center.x - facing * (15 + i * 4) * scale, center.y + (12 - i * 9) * scale, center.x + facing * 18 * scale, center.y - (10 - i * 8) * scale);
      impact();
    }
  } else if (kind === 'ice' || kind === 'gamma') {
    ctx.strokeStyle = kind === 'ice' ? '#a4e9ff' : '#b8baff';
    if (release) { ctx.lineWidth = (kind === 'ice' ? 4 : 7) * scale * (1 - q * 0.7); line(origin.x, origin.y, center.x, center.y); impact(); }
    else { ctx.globalAlpha *= 0.45; ring(origin.x, origin.y, (5 + p * 10) * scale); }
  } else if (kind === 'lightning') {
    if (release && state.contactEligible) {
      ctx.strokeStyle = '#ffe8a1'; const x = center.x;
      ctx.beginPath(); ctx.moveTo(x - 8 * scale, center.y - h * 0.55); ctx.lineTo(x + 3 * scale, center.y - h * 0.2); ctx.lineTo(x - 4 * scale, center.y); ctx.lineTo(x + 8 * scale, center.y + h * 0.3); ctx.stroke(); impact('#ffe8a1');
    } else if (!release) ring(origin.x, origin.y, 8 * scale, 0.5);
  } else if (kind === 'chains') {
    if (release && state.contactEligible) {
      ctx.strokeStyle = '#75c997';
      for (let i = 0; i < 8; i++) { const t = i / 7; ring(origin.x + (center.x - origin.x) * t, origin.y + (center.y - origin.y) * t + Math.sin(t * Math.PI * 2) * h * 0.12, 4 * scale, 0.55); }
      impact('#75c997');
    } else if (!release) ring(origin.x, origin.y, 9 * scale, 0.5);
  } else if (kind === 'thor' || kind === 'blaster') {
    ctx.strokeStyle = kind === 'thor' ? '#ffd38a' : '#ff806b';
    const travel = Math.min(1, p / state.impactProgress);
    const x = origin.x + (center.x - origin.x) * travel, y = origin.y + (center.y - origin.y) * travel;
    if (!release) line(x - facing * 8 * scale, y, x + facing * 5 * scale, y);
    impact();
  }
  ctx.restore(); return true;
}
