import registry from './sourceProtectionEntitiesWave16.generated.json' with { type: 'json' };
import { sampleProtectionEntityVisualWave16 } from './protectionEntityRuntimeWave16.js';
import { drawSourceNativeAtlasWave16, preloadSourceNativeSheetsWave16 } from './sourceNativeRendererWave16.js';
const idOf = actor => actor?.battleId || actor?.runtimeId || actor?.id;
export const getSourceProtectionEntityAssetsWave16 = () => registry.entries;
export function getSourceProtectionEntityFrameWave16(actor, height = 72) {
  const state = actor?.sourceProtectionEntityWave16, frame = sampleProtectionEntityVisualWave16(state);
  if (!frame || state.awaitingCasterRecovery || actor.currentHp <= 0 || frame.ownerRuntimeId !== idOf(actor)) return null;
  const asset = registry.entries.find(asset => asset.id === frame.assetId && asset.sourceHeroId === 'cuphead_ms_chalice'
    && asset.universe === 'Cuphead' && asset.kind === 'protection-entity' && asset.frames === 16
    && asset.columns === 4 && asset.rows === 4 && asset.frameWidth === 256 && asset.frameHeight === 256);
  if (!asset || asset.phases?.[frame.phase]?.row !== frame.row || !Number.isFinite(height) || height <= 0) return null;
  // The existing native cast's complete Pal is48px tall in a256px cell.
  // Match that visible height using the new measured97px body, not padding.
  const packedBodyHeight = Number(asset.normalization?.bodyCalibration?.outputBodyHeight) || 97;
  const facing = actor.facing < 0 ? -1 : 1, size = height * 48 / packedBodyHeight;
  return { ...frame, asset, size, facing, x: actor.x + facing * height * .38, y: actor.y - height * .42,
    visualOnly: true, source1to1Verified: false, extraProtectionCharges: 0 };
}
export function preloadSourceProtectionEntityAssetsWave16(actors = []) {
  if (actors.some(actor => (actor.sourceHeroId || actor.sourceId || actor.id) === 'cuphead_ms_chalice'
    && actor.universe === 'Cuphead')) preloadSourceNativeSheetsWave16(registry.entries.map(asset => asset.sheet));
}
export function drawSourceProtectionEntityWave16(ctx, actor, height = 72) {
  const frame = getSourceProtectionEntityFrameWave16(actor, height);
  if (!frame) return false;
  const { asset, size } = frame;
  ctx.save(); ctx.translate(frame.x, frame.y);
  const drawn = drawSourceNativeAtlasWave16(ctx, { ...asset, row: frame.row }, frame.col,
    0, size / 2 - (asset.normalization?.baseline || 244) / asset.frameHeight * size,
    size, size, { facing: frame.facing, glowColor: '#fff1a7', glowBlur: 0 });
  ctx.restore(); return drawn;
}
