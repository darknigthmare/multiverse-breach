// A measured crop reuses pixels from an already counted native source cell.
// It never adds a pose, another actor, collision, damage or a painted creature.
import nativeC from './characterAnimationsWave17PartC.generated.json' with { type: 'json' };
import anchorsC from './nativeSuperAnchorsWave17PartC.generated.json' with { type: 'json' };

let drawRegion = null;
export const registerNativeProjectileRegionRendererWave17 = renderer => { drawRegion = renderer; };
export function drawNativeProjectileRegionWave17(ctx, region, x, y, scale, facing) {
  const atlas = nativeC.entries.find(entry => entry.heroId === 'joe_gomamon' && entry.universe === 'Digimon');
  const measured = anchorsC.joe_gomamon?.projectileRegion, rect = region?.rect;
  if (!atlas || !measured || region?.reviewed !== true || region.newDrawing !== false
    || region.kind !== 'actual-native-fish-group' || region.fishCount !== 3
    || region.coordinateSpace !== 'atlas' || region.phase !== 'super' || region.row !== 7
    || region.column !== 2 || region.col !== 2 || atlas.phases?.super?.row !== 7
    || atlas.frameWidth !== 256 || atlas.frameHeight !== 256 || atlas.columns !== 4 || atlas.rows !== 8
    || atlas.frames !== 32 || atlas.width !== 1024 || atlas.height !== 2048
    || region.sheet !== atlas.sheet || region.atlasSha256 !== atlas.sha256
    || !/^[a-f0-9]{64}$/.test(region.atlasSha256) || measured.reviewed !== true
    || measured.sheet !== atlas.sheet || measured.atlasSha256 !== atlas.sha256
    || !['kind', 'fishCount', 'phase', 'row', 'column', 'col', 'coordinateSpace', 'newDrawing'].every(key => measured[key] === region[key])
    || !rect || !measured.rect || !['left', 'top', 'width', 'height'].every(key => Number.isInteger(rect[key]) && rect[key] === measured.rect[key])
    || rect.width <= 0 || rect.height <= 0 || rect.left < 512 || rect.top < 1792
    || rect.left + rect.width > 768 || rect.top + rect.height > 2048
    || ![x, y, scale].every(Number.isFinite) || scale <= 0 || ![1, -1].includes(facing)) return false;
  return drawRegion?.(ctx, region, x, y, scale, facing) ?? false;
}
