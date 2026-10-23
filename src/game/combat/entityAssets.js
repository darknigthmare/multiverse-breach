import registry from './entityAssets.generated.json' with { type: 'json' };

// An exact universe/entity/action triple prevents a similarly named creature
// or deployment in another continuity from borrowing this artwork.
const keyFor = (universe, entityName, actionName) => [universe, entityName, actionName].join('::');
const assets = new Map();
for (const entry of registry.entries) {
  const key = keyFor(entry.universe, entry.entityName, entry.actionName);
  if (assets.has(key)) throw new Error(`Duplicate combat entity artwork: ${key}`);
  assets.set(key, Object.freeze({ ...entry }));
}

export function resolveCombatEntityAsset(descriptor) {
  if (!descriptor?.universe || !descriptor.entityName || !descriptor.action?.name) return null;
  const asset = assets.get(keyFor(descriptor.universe, descriptor.entityName, descriptor.action.name));
  return asset?.sheet && asset.frames === 4 && asset.columns === 4 && asset.rows === 1 ? asset : null;
}

export function attachCombatEntityAsset(descriptor) {
  const asset = resolveCombatEntityAsset(descriptor);
  if (!asset) return descriptor;
  return {
    ...descriptor,
    entityRender: { kind: 'sprite-sheet', entityName: descriptor.entityName, assetMissing: false, asset },
    provenance: {
      ...descriptor.provenance,
      entityAssetMissing: false,
      entityAssetId: asset.id,
      entityAssetSource: 'OpenAI image_gen',
      visualFidelity: 'generated-pixel-art-adaptation',
      visualValidation: 'not-certified-1:1'
    }
  };
}

// Poses advance on simulation ticks, so pausing freezes both art and damage.
// This is a four-pose cinematic, not a claim of source-game animation frames.
export function getCombatEntityFrame({ tick = 0, impactTick = 99, durationTicks = 192 } = {}) {
  const arrivalEnd = Math.max(1, Math.round(impactTick * 0.6));
  const exitStart = Math.min(durationTicks - 12, impactTick + 18);
  if (tick < arrivalEnd) return { index: 0, phase: 'arrival' };
  if (tick < impactTick) return { index: 1, phase: 'preparation' };
  if (tick <= exitStart) return { index: 2, phase: 'impact' };
  return { index: 3, phase: 'return' };
}
