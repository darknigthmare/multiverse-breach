import registry from './characterActionAnimationsWave16PartC.generated.json' with { type: 'json' };
import { getSourceHitSequenceWave16 } from './combatHitSequenceWave16.js';

const HERO = 'kirito_sao', UNIVERSE = 'Sword Art Online';
const ASSET = 'kirito-starburst-stream-wave16';
const BLADES = new Set(['elucidator', 'dark-repulser']);
const finite = value => typeof value === 'number' && Number.isFinite(value);
const equalTime = (a, b) => finite(a) && Math.abs(a - b) < 1e-8;
const sha = value => typeof value === 'string' && /^[a-f\d]{64}$/i.test(value);
const localPoint = point => point && finite(point.x) && finite(point.y)
  && point.x >= 0 && point.x < 256 && point.y >= 0 && point.y < 256;
const sourcePoint = point => point && finite(point.x) && finite(point.y) && point.x >= 0 && point.y >= 0;
const measured = point => localPoint(point?.point) && sourcePoint(point.sourcePoint)
  && Number.isInteger(point.sourceVisibleNeighborhood9x9) && point.sourceVisibleNeighborhood9x9 > 0
  && point.sourceVisibleNeighborhood9x9 <= 81 && Number.isInteger(point.packedVisibleNeighborhood9x9)
  && point.packedVisibleNeighborhood9x9 > 0 && point.packedVisibleNeighborhood9x9 <= 81;

function acceptedAsset(entry) {
  if (entry?.id !== ASSET || entry.heroId !== HERO || entry.universe !== UNIVERSE
    || entry.frames !== 16 || entry.columns !== 4 || entry.rows !== 4
    || entry.frameWidth !== 256 || entry.frameHeight !== 256 || entry.width !== 1024 || entry.height !== 1024
    || typeof entry.sheet !== 'string' || !entry.sheet || !sha(entry.sha256) || !sha(entry.sourceImageSha256)
    || entry.normalization?.baseline !== 244 || !Array.isArray(entry.normalization.rows)
    || entry.normalization.rows.length !== 4
    || !Array.from({ length: 4 }, (_, index) => entry.normalization.rows[index])
      .every(row => finite(row?.renderScale) && row.renderScale > 0)
    || !Array.isArray(entry.contactAnchors) || entry.contactAnchors.length !== 16
    || entry.contactAnchors.filter(Boolean).length !== 16) return false;
  const sequence = entry.sequence;
  if (sequence?.hitCount !== 16 || !equalTime(sequence.firstAt, .8) || !equalTime(sequence.lastAt, 3.05)
    || !equalTime(sequence.duration, 3.5) || !equalTime(sequence.releaseWindow, .09)) return false;
  return entry.contactAnchors.every((anchor, index) => anchor.index === index
    && anchor.row === Math.floor(index / 4) && anchor.col === index % 4 && anchor.visuallyReviewed === true
    && BLADES.has(anchor.blade) && measured(anchor) && measured(anchor.otherBlade)
    && BLADES.has(anchor.otherBlade.name) && anchor.otherBlade.name !== anchor.blade);
}

// An explicit registry is useful to asset loaders and geometry verification.
// An empty or incomplete registry produces no fallback contact coordinates.
export function createSourceBladeProjectorWave16(nativeRegistry) {
  return function projectSourceBladeContact(actor, profile, elapsed, height = 72) {
    const id = actor?.sourceHeroId || actor?.sourceId || actor?.id;
    const sequence = getSourceHitSequenceWave16(profile);
    if (id !== HERO || actor.universe !== UNIVERSE || profile?.sourceHeroId !== HERO
      || profile.universe !== UNIVERSE || profile.name !== 'Starburst Stream'
      || profile.effect !== 'damage' || profile.delivery !== 'melee' || sequence?.kind !== 'starburst-stream'
      || !equalTime(sequence.firstAt, .8) || !equalTime(sequence.lastAt, 3.05)
      || !equalTime(sequence.duration, 3.5) || !equalTime(sequence.releaseWindow, .09)
      || !finite(actor.x) || !finite(actor.y) || !finite(elapsed) || !finite(height) || height <= 0
      || elapsed < .8 || elapsed >= 3.14) return null;
    const asset = Array.isArray(nativeRegistry?.entries) ? nativeRegistry.entries.find(acceptedAsset) : null;
    if (!asset) return null;
    // The epsilon only stabilizes floating-point contact-clock boundaries; it
    // never advances the active interval or enlarges a physical hurtbox.
    const index = Math.min(15, Math.floor((elapsed - .8 + 1e-7) / .15));
    const anchor = asset.contactAnchors[index], row = anchor.row, col = anchor.col;
    const renderScale = asset.normalization.rows[row].renderScale;
    const scale = height / asset.frameHeight * renderScale, baseline = asset.normalization.baseline;
    const selectedFacing = finite(actor.action?.facing) ? actor.action.facing : actor.facing;
    const facing = selectedFacing < 0 ? -1 : 1;
    const project = point => ({ x: actor.x + (point.x - asset.frameWidth / 2) * scale * facing,
      y: actor.y + (point.y - baseline) * scale });
    const point = project(anchor.point), other = project(anchor.otherBlade.point);
    return {
      kind: 'source-blade-contact-wave16', sourceHeroId: HERO, universe: UNIVERSE,
      x: point.x, y: point.y, point, blade: anchor.blade, index, row, col,
      nativePoint: { ...anchor.point }, sourcePoint: { ...anchor.sourcePoint },
      otherBlade: { name: anchor.otherBlade.name, x: other.x, y: other.y, point: other,
        nativePoint: { ...anchor.otherBlade.point }, sourcePoint: { ...anchor.otherBlade.sourcePoint } },
      assetId: asset.id, sheet: asset.sheet, sheetSha256: asset.sha256,
      sourceImageSha256: asset.sourceImageSha256,
      frame: { index, row, col, sx: col * 256, sy: row * 256, sw: 256, sh: 256 },
      cell: { row, col, width: 256, height: 256 },
      renderScale, scale, baseline, height, facing,
      contactGeometry: 'measured-primary-blade-tip', visuallyReviewed: true,
      gameplayEffect: 'none', source1to1Verified: false
    };
  };
}

export const projectSourceBladeContactWave16 = createSourceBladeProjectorWave16(registry);

function bounds(rect) {
  if (!rect) return null;
  if ([rect.left, rect.top, rect.right, rect.bottom].every(finite)) {
    return rect.right > rect.left && rect.bottom > rect.top
      ? { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom } : null;
  }
  const width = rect.width ?? rect.w, height = rect.height ?? rect.h;
  if (![rect.x, rect.y, width, height].every(finite) || width <= 0 || height <= 0) return null;
  const right = rect.x + width, bottom = rect.y + height;
  return finite(right) && finite(bottom) ? { left: rect.x, top: rect.y, right, bottom } : null;
}

// Only the selected physical blade tip is measured. No hilt has been measured,
// so neither a blade segment nor a line between the two swords is invented.
// The engine supplies its actual rectangle and owns all hit/HP/movement logic.
export function intersectsSourceBladeHurtboxWave16(projected, hurtbox) {
  if (projected?.kind !== 'source-blade-contact-wave16' || projected.sourceHeroId !== HERO
    || projected.universe !== UNIVERSE || projected.visuallyReviewed !== true
    || !finite(projected.x) || !finite(projected.y)) return false;
  const rect = bounds(hurtbox);
  return !!rect && projected.x >= rect.left && projected.x <= rect.right
    && projected.y >= rect.top && projected.y <= rect.bottom;
}
