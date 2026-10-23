import { COMBAT_SOURCE_DEFINITIONS_WAVE11 } from './combatSourceDefinitionsWave11.js';
import { getCharacterAnimationFrame } from './characterAnimationCatalog.js';
import partA from './nativeSuperAnchorsWave11PartA.generated.json' with { type: 'json' };
import partB from './nativeSuperAnchorsWave11PartB.generated.json' with { type: 'json' };
import partC from './nativeSuperAnchorsWave11PartC.generated.json' with { type: 'json' };
import partD from './nativeSuperAnchorsWave11PartD.generated.json' with { type: 'json' };

const anchors = { ...partA, ...partB, ...partC, ...partD };
const unit = value => Math.max(0, Math.min(1, Number(value) || 0));
const number = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const definitions = Object.fromEntries(Object.entries(COMBAT_SOURCE_DEFINITIONS_WAVE11).map(([id, e]) => [id, [e.universe, e.name, e.kind, e.effect, e.delivery]]));
export const supportsNativeSuperWave11 = profile => {
  const entry = definitions[profile?.sourceHeroId];
  return !!entry && profile.universe === entry[0] && profile.name === entry[1]
    && profile.effect === entry[3] && profile.delivery === entry[4];
};
export const supportsTrackedProjectileVisualWave11 = profile => supportsNativeSuperWave11(profile)
  && profile.effect === 'damage' && profile.delivery === 'projectile';

// No movement is inferred from a military role or from a power's name. The
// selected native poses contain the bracing, recoil and casting gestures.
export const sampleNativeSuperMotionWave11 = () => ({ x: 0, y: 0 });

export function projectNativeSuperAnchorWave11(actor, progress, impactProgress, height) {
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
export function getNativeSuperVisualStateWave11({ actor, profile, action, target, height = 72, projectileVisual = null, contactVisual = null }) {
  if (!supportsNativeSuperWave11(profile) || !actor || !action || actor.universe !== profile.universe
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
  const anchor = projectNativeSuperAnchorWave11({ ...actor, action: { ...action, facing } }, progress, impactProgress, height);
  const origin = anchor ? { x: anchor.x, y: anchor.y } : { x: ground.x, y: ground.y - height * 0.45 };
  const tracked = supportsTrackedProjectileVisualWave11(profile) && ['launch', 'flight', 'impact'].includes(projectileVisual?.phase)
    ? { phase: projectileVisual.phase, x: number(projectileVisual.x, origin.x), y: number(projectileVisual.y, origin.y),
      travelProgress: unit(projectileVisual.travelProgress), elapsed: Math.max(0, number(projectileVisual.elapsed, 0)),
      duration: Math.max(0.001, number(projectileVisual.duration, 0.24)) } : null;
  return { family: 'native-wave11', heroId: profile.sourceHeroId, name: profile.name, kind: definition[2], effect: definition[3],
    supportive, delivery: definition[4], progress, impactProgress, release: elapsed >= hitAt, releaseProgress: unit((elapsed - hitAt) / Math.max(0.001, duration - hitAt)),
    facing, height, range, color: profile.color || '#d2e6ff', ground, motion: { x: 0, y: 0 }, origin, target: point,
    nativeMuzzleActive: !!anchor, nativeAnchor: anchor,
    contactEligible: !supportive && (contactVisual !== null ? confirmed : !!target && forward >= 0 && forward <= range && Math.abs(ty - ground.y) <= 96),
    ...(contactVisual !== null ? { contactVisual: confirmed ? { confirmed: true, ...point } : { confirmed: false } } : {}),
    ...(tracked ? { projectileVisual: tracked } : {}), gameplayEffect: 'none', source1to1Verified: false };
}

export function drawNativeSuperVisualsWave11(ctx, state) {
  if (!state) return false;
  const { kind, ground, origin, target, height: h, facing, progress: p, release, releaseProgress: q } = state;
  const s = h / 72, center = { x: target.x, y: target.y - h * 0.42 };
  const line = (a, b) => { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); };
  const ring = (x, y, radius, flatten = 1) => { ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.01, radius), Math.max(0.01, radius * flatten), 0, 0, Math.PI * 2); ctx.stroke(); };
  ctx.save(); ctx.globalAlpha *= 0.82; ctx.lineWidth = 2 * s; ctx.strokeStyle = state.color;
  const contact = () => { if (release && state.contactEligible) ring(center.x, center.y, (5 + 17 * q) * s); };
  if (state.supportive) {
    // A small ground UI marker accompanies actual native gestures. It creates
    // no magical links, equipment, vehicle, shields or physiological powers.
    ctx.globalAlpha *= release ? 1 - q * 0.6 : 0.3 + p;
    ctx.strokeStyle = kind === 'maintenance' ? '#8fc2cf' : '#bbd3a0';
    ring(ground.x, ground.y - 2 * s, (11 + p * 5) * s, 0.23);
  } else if (state.delivery === 'melee') {
    // The native stake, fist, bantos and physical sword poses do the action.
    // Canvas supplies only feedback for a hit accepted by the engine.
    contact();
  } else if (state.delivery === 'beam') {
    if (release && state.nativeMuzzleActive && state.contactEligible) {
      ctx.strokeStyle = '#ee975f'; ctx.lineWidth = 2.4 * s;
      line(origin, center);
      const dx = center.x - origin.x, dy = center.y - origin.y;
      ctx.strokeStyle = '#96b8ff'; ctx.lineWidth = 1.2 * s;
      ctx.beginPath(); ctx.moveTo(origin.x, origin.y);
      for (let i = 1; i <= 12; i++) {
        const t = i / 12;
        ctx.lineTo(origin.x + dx * t, origin.y + dy * t + Math.sin(t * Math.PI * 8 + p * 15) * Math.sin(t * Math.PI) * 3 * s);
      }
      ctx.stroke();
    }
    contact();
  } else if (state.projectileVisual) {
    const v = state.projectileVisual;
    if (v.phase === 'launch' && state.nativeMuzzleActive && p <= state.impactProgress + 0.1) ring(origin.x, origin.y, (2 + p * 3) * s);
    else if (v.phase === 'flight') {
      ctx.strokeStyle = ['combine-energy', 'pulse-rifle'].includes(kind) ? '#9cdcff'
        : ['wand-stun', 'energy-pistol'].includes(kind) ? '#ff786c' : kind === 'staff-plasma' ? '#ffb24f' : kind.startsWith('laser-') ? '#f87264' : '#ffe3a6';
      if (kind === 'combine-energy') ring(v.x, v.y, 6 * s);
      else line({ x: v.x - facing * 6 * s, y: v.y }, { x: v.x + facing * 5 * s, y: v.y });
    } else if (v.phase === 'impact') ring(v.x, v.y, (4 + 17 * unit(v.elapsed / v.duration)) * s);
  } else {
    // RPG/Melee accepted contact occurs at hitAt; cosmetic travel arrives then.
    // No new stream leaves a lowered barrel after the impact or during recovery.
    if (state.delivery === 'projectile' && !release && state.nativeMuzzleActive) {
      const flight = unit((p / state.impactProgress - 0.55) / 0.45);
      if (flight > 0) {
        const x = origin.x + (center.x - origin.x) * flight, y = origin.y + (center.y - origin.y) * flight;
        ctx.strokeStyle = ['wand-stun', 'energy-pistol'].includes(kind) ? '#ff786c' : kind === 'staff-plasma' ? '#ffb24f' : kind.startsWith('laser-') ? '#f87264' : kind === 'combine-energy' ? '#9cdcff' : '#ffe3a6';
        if (kind === 'combine-energy') ring(x, y, 6 * s);
        else line({ x: x - facing * 6 * s, y }, { x: x + facing * 4 * s, y });
      }
    }
    contact();
  }
  ctx.restore(); return true;
}
