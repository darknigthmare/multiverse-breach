import registry from './summonAnimationsWave16.generated.json' with { type: 'json' };
import { RPG_SUMMON_SPECS_WAVE16 } from './rosterReinforcementsWave16.js';
import { projectNativeSummonEffectOriginWave15 } from './rosterSummonChoreographyWave15.js';
import { sampleSummonAnimationFrame } from './summonAnimationState.js';

const assets = new Map(registry.entries.map(entry => [entry.id, entry]));
const specs = new Map(RPG_SUMMON_SPECS_WAVE16.map(entry => [entry.id, entry]));
// drawCosmeticAtlasFrame rounds its local translate before drawing the cell.
// Match those actual canvas coordinates for new W16 anatomy only.
const nativeLocalY = (asset, anchor, size) => Math.round(size / 2 - (asset.normalization?.baseline || 244) / asset.frameHeight * size)
  - size / 2 + anchor.y / asset.frameHeight * size;
export const FOX_DEVIL_NATIVE_ID_WAVE16 = 'fox_devil-wave16';
export const ROSTER_SUMMON_CHOREOGRAPHIES_WAVE16 = Object.freeze(RPG_SUMMON_SPECS_WAVE16.map((entry, index) => {
  const asset = assets.get(entry.id), output = asset?.normalization?.bodyCalibration?.outputBodyHeight;
  const scale = output > 0 ? entry.bodyHeight / output : 1;
  return Object.freeze({ id: entry.id + '-native', universe: entry.universe, entityName: entry.entityName,
    actionName: entry.actionName, sourceReference: entry.sourceWork + '. ' + entry.adaptationNote,
    path: entry.nativeRole === 'bite' ? 'fox-devil-bite' : entry.nativeRole === 'melee' ? 'roster-wave16-contact' : 'roster-cover-fire',
    arrival: .30 + index * .009, travelTicks: 21 + index % 4, holdTicks: 28 + index % 4,
    scale, maxSize: 132, offsetX: 82 + index * 2,
    preparation: `roster-wave16-${entry.slug}-ready`, attack: `roster-wave16-${entry.slug}-${entry.nativeRole}`,
    recovery: 'roster-ground-return', muzzle: Object.freeze([0, -.45]),
    ...(['melee', 'bite'].includes(entry.nativeRole) ? { nativeEntityId: entry.id,
      contactAnchor: asset?.effectAnchors?.attack?.[2] || null,
      ...(entry.nativeRole === 'bite' ? { mouthAnchor: asset?.effectAnchors?.attack?.[2] || null } : {}),
      nativeFrameWidth: asset?.frameWidth || 512, nativeFrameHeight: asset?.frameHeight || 256,
      nativeBaseline: asset?.normalization?.baseline || 244 } : {}),
    fidelity: 'authored-native-source-motion-adaptation', source1to1Verified: false });
}));

export const usesConfirmedSummonContactWave16 = asset => specs.has(asset?.id) && specs.get(asset.id).nativeRole !== 'support';
export function getWave16NativeSummonAsset(universe, entityName, actionName) {
  return registry.entries.find(entry => entry.universe === universe && entry.entityName === entityName && entry.actionName === actionName) || null;
}
export function getFoxDevilNativeFrameWave16({ phase = 'attack', column = 2 } = {}) {
  const asset = assets.get(FOX_DEVIL_NATIVE_ID_WAVE16), row = asset?.phases?.[phase]?.row;
  if (!asset || !Number.isInteger(row) || !Number.isInteger(column) || column < 0 || column > 3) return null;
  return { asset, frame: { assetId: asset.id, key: asset.key, phase, row, col: column, index: row * 4 + column,
    sheet: asset.sheet, visualOnly: true, source1to1Verified: false }, mouthAnchor: asset.effectAnchors?.[phase]?.[column] || null };
}
export function projectFoxDevilMouthWave16({ phase = 'attack', column = 2, x, y, facing = 1, size, rotation = 0 } = {}) {
  const native = getFoxDevilNativeFrameWave16({ phase, column }), anchor = native?.mouthAnchor;
  if (!anchor || ![x, y, size, rotation].every(Number.isFinite) || !(size > 0)) return null;
  const asset = native.asset, side = facing < 0 ? -1 : 1;
  const dx = (anchor.x - asset.frameWidth / 2) / asset.frameHeight * size * side;
  const dy = nativeLocalY(asset, anchor, size);
  return { x: x + dx * Math.cos(rotation) - dy * Math.sin(rotation),
    y: y + dx * Math.sin(rotation) + dy * Math.cos(rotation), anchor, phase, column,
    nativeEntityId: asset.id, measuredNativeMouth: true };
}
export function projectNativeSummonEffectOriginWave16(choreography, asset, frame) {
  const projected = projectNativeSummonEffectOriginWave15(choreography, asset, frame);
  if (!projected || !specs.has(asset?.id)) return projected;
  const anchor = asset.effectAnchors?.[frame?.phase]?.[frame?.col];
  return { ...projected, ...(anchor ? { origin: projectPoint(asset, anchor, projected.performer) } : {}),
    nativeMuzzleActive: !!anchor && frame?.phase === 'attack' && frame?.col === 2 && ['gun', 'hand'].includes(specs.get(asset.id).nativeRole),
    nativeMouthActive: !!anchor && specs.get(asset.id).nativeRole === 'bite' };
}

const unit = value => Math.max(0, Math.min(1, Number(value) || 0));
const ease = value => 1 - (1 - unit(value)) ** 3;
const lerp = (from, to, value) => from + (to - from) * value;
const projectPoint = (asset, anchor, performer) => {
  const angle = performer.rotation || 0;
  const dx = (anchor.x - asset.frameWidth / 2) / asset.frameHeight * performer.size * performer.facing;
  const dy = nativeLocalY(asset, anchor, performer.size);
  return { x: performer.x + dx * Math.cos(angle) - dy * Math.sin(angle),
    y: performer.y + dx * Math.sin(angle) + dy * Math.cos(angle) };
};

// Only the new W16 physical contact bodies use this pure placement hook.
// Simulation targets, accepted-hit snapshots, actor positions and HP are never changed.
export function projectSourceSummonChoreographyWave16(scene, state) {
  if (!scene?.descriptor || !state?.performer) return state;
  const asset = getWave16NativeSummonAsset(scene.descriptor.universe, scene.descriptor.entityName, scene.descriptor.action?.name);
  const spec = specs.get(asset?.id), contact = asset?.effectAnchors?.attack?.[2];
  if (spec?.id === 'bt_7274_tf2-wave16' && [state.width, state.height, state.performer.size].every(Number.isFinite)) {
    // The Titan retains its three-human stature even on the short GameCanvas
    // viewport. Move the complete sixteen-pose envelope onto the visible floor.
    const boxes = asset.normalization.rows.flatMap(row => row.frameBounds.map(frame => frame.output));
    const size = state.performer.size, side = state.performer.facing < 0 ? -1 : 1;
    const xs = boxes.flatMap(box => [box.left, box.left + box.width]).map(x => (x - asset.frameWidth / 2) / asset.frameHeight * size * side);
    const localTop = Math.round(size / 2 - asset.normalization.baseline / asset.frameHeight * size) - size / 2;
    const ys = boxes.flatMap(box => [box.top, box.top + box.height]).map(y => localTop + y / asset.frameHeight * size);
    const minX = 4 - Math.min(...xs), maxX = state.width - 4 - Math.max(...xs);
    const minY = 4 - Math.min(...ys), maxY = state.height - 4 - Math.max(...ys);
    if (minX <= maxX && minY <= maxY) return { ...state, performer: { ...state.performer,
      x: Math.max(minX, Math.min(maxX, state.performer.x)), y: Math.max(minY, Math.min(maxY, state.performer.y)) },
      sourceNativeEnvelope: { fit: true, sourceBodyHeight: spec.bodyHeight, minX, maxX, minY, maxY, preservesStature: true } };
  }
  if (!spec || !['melee', 'bite'].includes(spec.nativeRole) || !contact) return state;
  const original = scene.impacted && scene.visualContacts?.length ? scene.visualContacts[0] : scene.targets?.[0];
  if (!original || ![original.x, original.y, state.performer.size, state.width, state.height,
    state.caller?.x, state.caller?.y].every(Number.isFinite) || state.performer.size <= 0) return state;
  const side = state.side < 0 ? -1 : 1, height = state.height, width = state.width;
  const target = { x: original.x, y: original.y - height * .095 };
  const offset = projectPoint(asset, contact, { ...state.performer, x: 0, y: 0, facing: side });
  const destination = { x: target.x - offset.x, y: target.y - offset.y };
  const offsetX = Number(scene.choreography?.offsetX) || 82;
  const station = { x: Math.max(45, Math.min(width - 45, state.caller.x + side * offsetX)),
    y: Math.max(height * .65, Math.min(height * .88, state.caller.y)) };
  const arrivalX = lerp(state.caller.x, station.x, ease(state.arrivalProgress));
  const progress = ease(state.travelProgress), returning = ease(state.returnProgress);
  let x = lerp(station.x, destination.x, progress), y = lerp(station.y, destination.y, progress);
  if (state.tick < state.attackStartTick) { x = arrivalX; y = station.y; }
  if (returning > 0) { x = lerp(destination.x, station.x, returning); y = lerp(destination.y, station.y, returning); }
  const performer = { ...state.performer, x, y, facing: side };
  const frame = sampleSummonAnimationFrame(scene, asset, state);
  const current = asset.effectAnchors?.[frame?.phase]?.[frame?.col];
  const origin = projectPoint(asset, current || contact, performer);
  return { ...state, performer, origin,
    sourceNativeContact: { assetId: asset.id, role: spec.nativeRole, phase: frame?.phase, column: frame?.col,
      targetId: original.battleId || original.runtimeId || original.id, target,
      measuredAnchor: current || contact, accepted: scene.impacted === true && (scene.visualContacts?.length || 0) > 0,
      distanceToTarget: Math.hypot(origin.x - target.x, origin.y - target.y), visualOnly: true } };
}
export function drawRosterSummonCueWave16(ctx, state, cue) {
  if (!cue?.kind?.startsWith('roster-wave16-')) return false;
  // Source PNGs own every body, weapon and mouth. Feedback acknowledges only an accepted effect.
  if (cue.stage !== 'contact' || cue.kind.endsWith('-support') || cue.kind.endsWith('-bite')) return true;
  ctx.strokeStyle = cue.kind.endsWith('-hand') ? '#5cff43' : '#ffe0a1'; ctx.lineWidth = 2;
  for (const target of state.targets) {
    ctx.beginPath(); ctx.ellipse(target.x, target.centerY, 7 + state.attackProgress * 20,
      5 + state.attackProgress * 15, 0, 0, Math.PI * 2); ctx.stroke();
  }
  return true;
}
