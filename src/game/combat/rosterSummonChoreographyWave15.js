import { projectNativeSummonEffectOriginWave14 } from './rosterSummonChoreographyWave14.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE15 as sources } from './combatSourceDefinitionsWave15.js';
import registry from './summonAnimationsWave15.generated.json' with { type: 'json' };
const performers = [
  ['hexen_baratus-wave15', 'hexen_baratus', 'Baratus', 'melee'],
  ['quake_franchise_ranger-wave15', 'quake_franchise_ranger', 'Ranger', 'melee'],
  ['sir_daniel_fortesque-wave15', 'sir_daniel_fortesque', 'Sir Daniel Fortesque', 'melee'],
  ['axel_sor-wave15', 'axel_sor', 'Axel Stone', 'melee'],
  ['dog_hl2-wave15', 'dog_hl2', 'Dog', 'melee'],
  ['kendra_daniels-wave15', 'kendra_daniels', 'Kendra Daniels', 'support']
];
const assets = new Map(registry.entries.map(entry => [entry.id, entry]));
export const ROSTER_SUMMON_CHOREOGRAPHIES_WAVE15 = Object.freeze(performers.map(([id, heroId, entityName, role], index) => {
  const source = sources[heroId], calibration = assets.get(id)?.normalization?.bodyCalibration;
  // Compensate only the uniform atlas packing scale. Standing body heights keep
  // the explicit relative source stature (Dog stays larger than human partners).
  const scale = calibration?.outputBodyHeight > 0 ? source.bodyHeight / calibration.outputBodyHeight : 1;
  return Object.freeze({ id: id + '-native', universe: source.universe, entityName, actionName: source.actionName,
    sourceReference: source.sourceWork + '. Same-universe gameplay reinforcement with sixteen separate native drawings. Bounded mechanics, not official frames or a certified alliance.',
    path: role === 'melee' ? 'roster-blade-rush' : 'roster-cover-fire',
    arrival: .30 + index * .009, travelTicks: 21 + index % 4, holdTicks: 28 + index % 4,
    scale, maxSize: 132, offsetX: 82 + index * 2,
    preparation: `roster-wave15-${heroId}-ready`, attack: `roster-wave15-${heroId}-${role}`,
    recovery: 'roster-ground-return', muzzle: Object.freeze([0, -.45]),
    ...(role === 'melee' ? { contactDistance: 48 } : {}), fidelity: 'authored-native-roster-motion-adaptation' });
}));
const ids = new Set(performers.map(([id]) => id));
const offensive = new Set(performers.filter(([, , , role]) => role === 'melee').map(([id]) => id));
export const usesConfirmedSummonContactWave15 = asset => offensive.has(asset?.id);
export function projectNativeSummonEffectOriginWave15(choreography, asset, frame) {
  const projected = projectNativeSummonEffectOriginWave14(choreography, asset, frame);
  if (!projected || !ids.has(asset?.id)) return projected;
  return { ...projected, nativeMuzzleActive: false };
}
export function drawRosterSummonCueWave15(ctx, state, cue) {
  if (!cue?.kind?.startsWith('roster-wave15-')) return false;
  // Five native contact gestures and Kendra's actual pad communication. A
  // source pose owns anatomy/equipment; only accepted impact feedback is drawn.
  if (cue.stage !== 'contact' || cue.kind.endsWith('-support')) return true;
  ctx.strokeStyle = '#ffe0a1'; ctx.lineWidth = 2;
  for (const target of state.targets) {
    ctx.beginPath(); ctx.ellipse(target.x, target.centerY, 7 + state.attackProgress * 20,
      5 + state.attackProgress * 15, 0, 0, Math.PI * 2); ctx.stroke();
  }
  return true;
}
