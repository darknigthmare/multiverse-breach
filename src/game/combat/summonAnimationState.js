const clamp = n => Math.max(0, Math.min(1, Number(n) || 0));

// Sampling the existing summon clock never advances it or applies an impact.
// Native attack poses 0/1 prepare the strike; pose2 starts on impactTick.
export function sampleSummonAnimationFrame(scene, asset, choreography) {
  if (!scene || !asset || !choreography) return null;
  const duration = Math.max(30, Number(scene.durationTicks) || 192);
  const impact = Math.max(1, Math.min(duration - 12, Number(scene.impactTick) || 99));
  const tick = Math.max(0, Math.min(duration, Number(scene.tick) || 0));
  const arrivalEnd = Math.max(1, Math.min(impact - 1, choreography.arrivalEndTick));
  const returnStart = Math.min(duration - 1, Math.max(impact + 1, choreography.returnStartTick));
  const lead = Math.max(1, Math.min(Number(scene.choreography?.travelTicks) || 30, (impact - arrivalEnd) / 2));
  const attackStart = Math.max(arrivalEnd + 1, impact - lead);
  let phase, progress, col;
  if (tick < arrivalEnd) {
    phase = 'arrival'; progress = clamp(tick / arrivalEnd);
  } else if (tick < attackStart) {
    phase = 'preparation'; progress = clamp((tick - arrivalEnd) / Math.max(1, attackStart - arrivalEnd));
  } else if (tick <= returnStart) {
    phase = 'attack';
    progress = clamp((tick - attackStart) / Math.max(1, returnStart - attackStart));
    col = tick < impact ? tick < attackStart + (impact - attackStart) * 0.55 ? 0 : 1
      : tick < impact + (returnStart - impact) * 0.65 ? 2 : 3;
  } else {
    phase = 'recovery'; progress = clamp((tick - returnStart) / Math.max(1, duration - returnStart));
  }
  const spec = asset.phases?.[phase];
  if (!spec || !Number.isInteger(spec.row) || spec.row < 0 || spec.row >= asset.rows) return null;
  col ??= Math.min(3, Math.floor(progress * 4));
  return { assetId: asset.id, key: asset.key, phase, progress, row: spec.row, col, index: spec.row * 4 + col,
    sheet: asset.sheet, arrivalEndTick: arrivalEnd, attackStartTick: attackStart, impactTick: impact,
    returnStartTick: returnStart, visualOnly: true, source1to1Verified: false };
}
