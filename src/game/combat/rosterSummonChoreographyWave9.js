import { projectNativeSummonEffectOrigin } from './rosterSummonChoreographyWave8.js';

export const ROSTER_SUMMON_CHOREOGRAPHIES_WAVE9 = [
  { id: 'gears-dom-native', universe: 'Gears of War', entityName: 'Dom Santiago', actionName: 'Salve de Gnasher de Dom',
    sourceReference: 'Gears of War 2 (2008): Dom in original COG armor steps into cover, shoulders his Gnasher and fires physical ammunition. Maria is a story motivation, not a damaging summon.',
    path: 'roster-cover-fire', arrival: 0.34, travelTicks: 20, holdTicks: 28, scale: 1, maxSize: 132, offsetX: 90,
    preparation: 'roster-wave9-gnasher-ready', attack: 'roster-wave9-gnasher-shot', recovery: 'roster-ground-return', muzzle: [0.35, -0.45] },
  { id: 'mass-effect-garrus-native', universe: 'Mass Effect', entityName: 'Garrus Vakarian', actionName: 'Concussive Shot',
    sourceReference: 'Mass Effect 2 (2010), recruited Garrus: scarred turian, blue armor and left visor. Concussive Shot leaves his own held rifle, never his eye or a biotic hand.',
    path: 'roster-cover-fire', arrival: 0.31, travelTicks: 22, holdTicks: 30, scale: 1, maxSize: 132, offsetX: 88,
    preparation: 'roster-wave9-concussive-ready', attack: 'roster-wave9-concussive-shot', recovery: 'roster-ground-return', muzzle: [0.4, -0.5] },
  { id: 'ghost-in-the-shell-batou-native', universe: 'Ghost in the Shell', entityName: 'Batou', actionName: 'Rafale d’appui de Batou',
    sourceReference: 'Ghost in the Shell: Stand Alone Complex (2002), season1: white-haired Batou in beige field jacket supports Section9 with a physical firearm. His cybernetic eyes remain sensors.',
    path: 'roster-cover-fire', arrival: 0.36, travelTicks: 24, holdTicks: 29, scale: 1, maxSize: 132, offsetX: 92,
    preparation: 'roster-wave9-rifle-ready', attack: 'roster-wave9-rifle-shot', recovery: 'roster-ground-return', muzzle: [0.36, -0.47] },
  { id: 'resident-evil-leon-native', universe: 'Resident Evil', entityName: 'Leon S. Kennedy', actionName: 'Special Rocket Launcher',
    sourceReference: 'Resident Evil 4 (2005), original agent version: Leon in brown shearling jacket braces the physical Special Rocket Launcher used in the Saddler encounter, fires once and lowers the empty tube.',
    path: 'roster-cover-fire', arrival: 0.33, travelTicks: 27, holdTicks: 28, scale: 1, maxSize: 132, offsetX: 96,
    preparation: 'roster-wave9-launcher-ready', attack: 'roster-wave9-rocket-shot', recovery: 'roster-ground-return', muzzle: [0.45, -0.48] }
].map(entry => Object.freeze({ ...entry, fidelity: 'authored-native-roster-motion-adaptation', muzzle: Object.freeze(entry.muzzle) }));

const ids = new Set(['gears-dom', 'mass-effect-garrus', 'ghost-in-the-shell-batou', 'resident-evil-leon']);
export const usesConfirmedSummonContactWave9 = asset => ids.has(asset?.id);
export function projectNativeSummonEffectOriginWave9(choreography, asset, frame) {
  const projected = projectNativeSummonEffectOrigin(choreography, asset, frame);
  if (!ids.has(asset?.id)) return projected;
  return { ...projected, nativeMuzzleActive: !!asset.effectAnchors?.[frame?.phase]?.[frame?.col] };
}

// The real RPG summon applies its effect exactly once at impactTick. This
// cosmetic travel ends there. No new ballistic stream starts after contact.
export function drawRosterSummonCueWave9(ctx, state, cue) {
  if (!cue.kind.startsWith('roster-wave9-')) return false;
  if (cue.stage === 'preparation') return true;
  const color = cue.kind.includes('concussive') ? '#acd6fa' : '#ffe0a1';
  ctx.strokeStyle = color; ctx.lineWidth = cue.kind.includes('rocket') ? 3 : 2;
  const line = (a, b) => { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); };
  if (cue.stage === 'travel' && state.nativeMuzzleActive !== false) {
    const progress = Math.max(0, Math.min(1, cue.progress));
    const center = { x: state.target.x, y: state.target.y - state.height * 0.095 };
    const x = state.origin.x + (center.x - state.origin.x) * progress;
    const y = state.origin.y + (center.y - state.origin.y) * progress;
    line({ x: x - state.side * (cue.kind.includes('rocket') ? 12 : 6), y }, { x, y });
  } else if (cue.stage === 'contact') {
    for (const target of state.targets) {
      ctx.beginPath(); ctx.ellipse(target.x, target.centerY, 7 + state.attackProgress * 20,
        5 + state.attackProgress * 15, 0, 0, Math.PI * 2); ctx.stroke();
    }
  }
  return true;
}
