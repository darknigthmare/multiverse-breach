import { projectNativeSummonEffectOriginWave12 } from './rosterSummonChoreographyWave12.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE13 as sources } from './combatSourceDefinitionsWave13.js';

const performers = [
  ['alien-ripley-wave13', 'ripley', 'Ellen Ripley', 'shot'],
  ['alien-hicks-wave13', 'hicks', 'Corporal Hicks', 'shot'],
  ['portal-atlas-wave13', 'atlas', 'Atlas', 'support'],
  ['discworld-vimes-wave13', 'vimes_dw', 'Sam Vimes', 'melee'],
  ['metalgear-meryl-wave13', 'meryl_mgs', 'Meryl Silverburgh', 'shot'],
  ['lastofus-joel-wave13', 'joel_tlou', 'Joel', 'shot']
];
export const ROSTER_SUMMON_CHOREOGRAPHIES_WAVE13 = Object.freeze(performers.map(([id, heroId, entityName, role], index) => Object.freeze({
  id: id + '-native', universe: sources[heroId].universe, entityName,
  actionName: sources[heroId].name,
  sourceReference: sources[heroId].sourceWork + '. Real same-universe roster reinforcement with sixteen newly drawn native poses. Bounded engine adaptation, not certified source frames.',
  path: role === 'melee' ? 'roster-blade-rush' : 'roster-cover-fire',
  arrival: .30 + index * .009, travelTicks: 21 + index % 4, holdTicks: 28 + index % 4,
  scale: 1, maxSize: role === 'support' ? 112 : 132, offsetX: 82 + index * 2,
  preparation: `roster-wave13-${heroId}-ready`, attack: `roster-wave13-${heroId}-${role}`,
  recovery: 'roster-ground-return', muzzle: Object.freeze([0, -.45]),
  ...(role === 'melee' ? { contactDistance: 48 } : {}),
  fidelity: 'authored-native-roster-motion-adaptation'
})));
const ids = new Set(performers.map(([id]) => id));
const offensive = new Set(performers.filter(([, , , role]) => role !== 'support').map(([id]) => id));
export const usesConfirmedSummonContactWave13 = asset => offensive.has(asset?.id);
export function projectNativeSummonEffectOriginWave13(choreography, asset, frame) {
  const projected = projectNativeSummonEffectOriginWave12(choreography, asset, frame);
  if (!projected || !ids.has(asset?.id)) return projected;
  return { ...projected, nativeMuzzleActive: !!asset.effectAnchors?.[frame?.phase]?.[frame?.col] };
}
export function drawRosterSummonCueWave13(ctx, state, cue) {
  if (!cue?.kind?.startsWith('roster-wave13-')) return false;
  // The native body supplies every gesture, blade and robot limb. Support
  // coordination has no offensive cue, laser, aura or replacement portal.
  if (cue.stage === 'preparation' || cue.kind.endsWith('-support')) return true;
  ctx.strokeStyle = '#ffe0a1'; ctx.lineWidth = 2;
  if (cue.stage === 'travel' && cue.kind.endsWith('-shot') && state.nativeMuzzleActive) {
    const progress = Math.max(0, Math.min(1, cue.progress));
    const center = { x: state.target.x, y: state.target.y - state.height * .095 };
    const x = state.origin.x + (center.x - state.origin.x) * progress;
    const y = state.origin.y + (center.y - state.origin.y) * progress;
    ctx.beginPath(); ctx.moveTo(x - state.side * 6, y); ctx.lineTo(x, y); ctx.stroke();
  } else if (cue.stage === 'contact') {
    for (const target of state.targets) {
      ctx.beginPath(); ctx.ellipse(target.x, target.centerY, 7 + state.attackProgress * 20,
        5 + state.attackProgress * 15, 0, 0, Math.PI * 2); ctx.stroke();
    }
  }
  return true;
}
