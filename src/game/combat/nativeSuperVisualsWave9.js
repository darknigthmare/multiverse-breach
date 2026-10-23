import { getCharacterAnimationFrame } from './characterAnimationCatalog.js';
import partA from './nativeSuperAnchorsWave9PartA.generated.json' with { type: 'json' };
import partB from './nativeSuperAnchorsWave9PartB.generated.json' with { type: 'json' };
import partC from './nativeSuperAnchorsWave9PartC.generated.json' with { type: 'json' };
import partD from './nativeSuperAnchorsWave9PartD.generated.json' with { type: 'json' };

const anchors = { ...partA, ...partB, ...partC, ...partD };
const unit = value => Math.max(0, Math.min(1, Number(value) || 0));
const number = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const definitions = {
  marcus: ['Gears of War', 'Hammer of Dawn', 'orbital', 'damage'],
  dom: ['Gears of War', 'Salve de Gnasher de Dom', 'shotgun', 'damage'],
  cole: ['Gears of War', 'Assaut au Lancer de Cole', 'rifle', 'damage'],
  baird: ['Gears of War', 'Maintenance du matériel COG', 'maintenance', 'guard'],
  hoffman_cog: ['Gears of War', 'Ordre de mise en défense de Hoffman', 'command', 'guard'],
  shepard: ['Mass Effect', 'Concussive Shot', 'concussive', 'damage'],
  garrus: ['Mass Effect', 'Concussive Shot', 'concussive', 'damage'],
  liara: ['Mass Effect', 'Singularity', 'singularity', 'damage'],
  tali: ['Mass Effect', 'Drone de combat de Tali', 'drone', 'damage'],
  wrex: ['Mass Effect', 'Barrière biotique de Wrex', 'personal-barrier', 'guard'],
  motoko: ['Ghost in the Shell', 'Salve au pistolet-mitrailleur de Motoko', 'smg', 'damage'],
  batou: ['Ghost in the Shell', 'Rafale d’appui de Batou', 'rifle', 'damage'],
  togusa: ['Ghost in the Shell', 'Tir de précision au Mateba', 'revolver', 'damage'],
  aramaki: ['Ghost in the Shell', "Autorisation d'opération de la Section 9", 'command', 'buff'],
  saito_gits: ['Ghost in the Shell', 'Œil de faucon — tir de précision', 'sniper', 'damage'],
  chris_redfield: ['Resident Evil', 'Satellite Laser', 'orbital', 'damage'],
  claire_redfield: ['Resident Evil', 'GM 79 Flame Round', 'incendiary', 'damage'],
  ada_wong: ['Resident Evil', 'Explosive Crossbow', 'crossbow', 'damage'],
  barry_burton: ['Resident Evil', 'Barry Magnum', 'magnum', 'damage'],
  carlos_oliveira: ['Resident Evil', 'Rafale du CQBR de Carlos', 'rifle', 'damage']
};
export const supportsNativeSuperWave9 = profile => {
  const entry = definitions[profile?.sourceHeroId];
  return !!entry && profile.universe === entry[0] && profile.name === entry[1]
    && (!profile.effect || profile.effect === entry[3]);
};
export const supportsTrackedProjectileVisualWave9 = profile => supportsNativeSuperWave9(profile)
  && profile.effect === 'damage' && profile.delivery === 'projectile';

// No movement is inferred from a military role or from a power's name. The
// selected native poses contain the bracing, recoil and casting gestures.
export const sampleNativeSuperMotionWave9 = () => ({ x: 0, y: 0 });

export function projectNativeSuperAnchorWave9(actor, progress, impactProgress, height) {
  const phase = actor?.presentationPhase === 'fatality' ? 'fatality' : 'super';
  const frame = getCharacterAnimationFrame(actor, { phase, progress, impactProgress });
  const id = actor?.sourceHeroId || actor?.sourceId || actor?.id;
  if (!frame) return null;
  const column = Number.isInteger(actor.presentationFrame?.col)
    ? Math.max(0, Math.min(3, actor.presentationFrame.col)) : frame.col;
  const anchor = anchors[id]?.[phase]?.[column];
  if (!anchor || !Number.isFinite(anchor.x) || !Number.isFinite(anchor.y)) return null;
  const renderScale = Math.max(0.1, Math.min(5, Number(frame.asset.normalization?.rows?.[frame.row]?.renderScale) || 1));
  const scale = height / frame.asset.frameHeight * renderScale;
  const facing = actor.action?.facing < 0 || (!actor.action && actor.facing < 0) ? -1 : 1;
  return { x: number(actor.x, 0) + (anchor.x - frame.asset.frameWidth / 2) * scale * facing,
    y: number(actor.y, 0) + (anchor.y - (frame.asset.normalization?.baseline || 244)) * scale,
    phase, col: column, nativePoint: { ...anchor }, renderScale };
}

// Simulation owns targets, costs, collision and time. This pure projection
// receives accepted contact from the engines; it cannot create a hit or enemy.
export function getNativeSuperVisualStateWave9({ actor, profile, action, target, height = 72, projectileVisual = null, contactVisual = null }) {
  if (!supportsNativeSuperWave9(profile) || !actor || !action || actor.universe !== profile.universe
    || (actor.sourceHeroId || actor.sourceId || actor.id) !== profile.sourceHeroId) return null;
  const definition = definitions[profile.sourceHeroId], supportive = definition[3] !== 'damage';
  const duration = Math.max(0.01, number(action.duration, 1.1));
  const elapsed = Math.max(0, number(action.elapsed, 0));
  const hitAt = Math.max(0.001, Math.min(duration, number(action.hitAt, duration * 0.5)));
  const progress = unit(elapsed / duration), impactProgress = Math.max(0.01, Math.min(0.95, hitAt / duration));
  const facing = action.facing < 0 ? -1 : 1;
  height = Math.max(1, Math.min(1000, number(height, 72)));
  const range = Math.max(1, Math.min(10000, number(profile.range, 640)));
  const ground = { x: number(actor.x, 0), y: number(actor.y, 0) };
  const tx = number(target?.x, ground.x + facing * Math.min(range, 240)), ty = number(target?.y, ground.y);
  const forward = (tx - ground.x) * facing;
  const confirmed = !supportive && contactVisual?.confirmed === true && Number.isFinite(contactVisual.x) && Number.isFinite(contactVisual.y);
  const point = supportive ? { ...ground } : confirmed ? { x: contactVisual.x, y: contactVisual.y }
    : { x: ground.x + facing * (forward > 0 ? Math.min(range, forward) : range), y: ty };
  const anchor = projectNativeSuperAnchorWave9({ ...actor, action: { ...action, facing } }, progress, impactProgress, height);
  const origin = anchor ? { x: anchor.x, y: anchor.y } : { x: ground.x, y: ground.y - height * 0.45 };
  const tracked = supportsTrackedProjectileVisualWave9(profile) && ['launch', 'flight', 'impact'].includes(projectileVisual?.phase)
    ? { phase: projectileVisual.phase, x: number(projectileVisual.x, origin.x), y: number(projectileVisual.y, origin.y),
      travelProgress: unit(projectileVisual.travelProgress), elapsed: Math.max(0, number(projectileVisual.elapsed, 0)),
      duration: Math.max(0.001, number(projectileVisual.duration, 0.24)) } : null;
  return { family: 'native-wave9', heroId: profile.sourceHeroId, name: profile.name, kind: definition[2], effect: definition[3],
    supportive, progress, impactProgress, release: elapsed >= hitAt, releaseProgress: unit((elapsed - hitAt) / Math.max(0.001, duration - hitAt)),
    facing, height, range, color: profile.color || '#d2e6ff', ground, motion: { x: 0, y: 0 }, origin, target: point,
    nativeMuzzleActive: !!anchor, nativeAnchor: anchor,
    contactEligible: !supportive && (contactVisual !== null ? confirmed : !!target && forward >= 0 && forward <= range && Math.abs(ty - ground.y) <= 96),
    ...(contactVisual !== null ? { contactVisual: confirmed ? { confirmed: true, ...point } : { confirmed: false } } : {}),
    ...(tracked ? { projectileVisual: tracked } : {}), gameplayEffect: 'none', source1to1Verified: false };
}

export function drawNativeSuperVisualsWave9(ctx, state) {
  if (!state) return false;
  const { kind, ground, origin, target, height: h, facing, progress: p, release, releaseProgress: q } = state;
  const s = h / 72, center = { x: target.x, y: target.y - h * 0.42 };
  const line = (a, b) => { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); };
  const ring = (x, y, radius, flatten = 1) => { ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.01, radius), Math.max(0.01, radius * flatten), 0, 0, Math.PI * 2); ctx.stroke(); };
  const contact = () => { if (release && state.contactEligible) ring(center.x, center.y, (5 + 17 * q) * s, kind === 'incendiary' ? 0.65 : 1); };
  ctx.save(); ctx.globalAlpha *= 0.82; ctx.lineWidth = 2 * s; ctx.strokeStyle = state.color;
  if (state.supportive) {
    // These local UI accents do not invent equipment or grant biology. In
    // particular Wrex's native Barrier remains centred on Wrex himself.
    ctx.globalAlpha *= release ? 1 - q * 0.6 : 0.3 + p;
    if (kind === 'personal-barrier') {
      ctx.strokeStyle = '#92b4ff';
      const angle = facing < 0 ? Math.PI : 0;
      ctx.beginPath(); ctx.arc(ground.x, ground.y - h * 0.43, h * 0.46, angle - Math.PI * 0.77, angle + Math.PI * 0.77); ctx.stroke();
    } else {
      // A ground marker shows a support order. No magical beam links a
      // commander or engineer to allies, and no biological healing is drawn.
      ctx.strokeStyle = kind === 'maintenance' ? '#8fc2cf' : '#bbd3a0';
      ring(ground.x, ground.y - 2 * s, (11 + p * 5) * s, 0.23);
    }
  } else if (kind === 'orbital') {
    // The thin handheld guide is distinct from the external damaging column.
    if (state.nativeMuzzleActive && !release) {
      ctx.globalAlpha *= 0.35; ctx.lineWidth = 0.7 * s; line(origin, center);
      ring(center.x, center.y, 8 * s, 0.65);
    }
    if (release && state.contactEligible) {
      ctx.strokeStyle = kind === 'orbital' && state.heroId === 'marcus' ? '#edc785' : '#e5f0b6';
      ctx.lineWidth = (8 - q * 5) * s;
      line({ x: center.x, y: Math.min(ground.y - h * 4, center.y - h * 3) }, center);
      contact();
    }
  } else if (kind === 'singularity') {
    // The localized biotic field is source-appropriate energy, not a new
    // creature or projectile body. No additional damage ticks are created.
    ctx.strokeStyle = '#889eff';
    if (!release) {
      ctx.globalAlpha *= 0.4; ring(center.x, center.y, (5 + p / state.impactProgress * 9) * s);
    } else if (state.contactEligible) {
      for (let i = 0; i < 3; i++) ring(center.x, center.y, (8 + i * 5 + q * 4) * s, 0.65 + i * 0.12);
    }
  } else if (state.projectileVisual) {
    const v = state.projectileVisual;
    if (v.phase === 'launch' && state.nativeMuzzleActive && p <= state.impactProgress + 0.1) ring(origin.x, origin.y, (2 + p * 3) * s);
    else if (v.phase === 'flight') {
      ctx.strokeStyle = kind === 'concussive' || kind === 'drone' ? '#a8d9ff' : '#ffe3a6';
      line({ x: v.x - facing * 6 * s, y: v.y }, { x: v.x + facing * 5 * s, y: v.y });
    } else if (v.phase === 'impact') ring(v.x, v.y, (4 + 17 * unit(v.elapsed / v.duration)) * s);
  } else {
    // Smash/RPG deliver these actions at hitAt. Cosmetic travel arrives at
    // that exact instant and never continues from the gun after the impact.
    if (!release && state.nativeMuzzleActive) {
      const flight = unit((p / state.impactProgress - 0.55) / 0.45);
      if (flight > 0) {
        const x = origin.x + (center.x - origin.x) * flight, y = origin.y + (center.y - origin.y) * flight;
        ctx.strokeStyle = kind === 'concussive' || kind === 'drone' ? '#a8d9ff' : kind === 'incendiary' ? '#ffbd69' : '#ffe3a6';
        line({ x: x - facing * 6 * s, y }, { x: x + facing * 4 * s, y });
      }
    }
    contact();
  }
  ctx.restore(); return true;
}
