/** Extinction presentation only. Never grants ownership or changes combat stats. */
import { getHeroCompleteSpritePack, getSpriteSheetLayout } from './spriteAssets.js';

// The separators in these two authored PNGs are not an equal 4×10 grid.
// Bounds exclude their visible grid lines, retain the actual row height, and
// apply only to first-person hands. No other use of either atlas is changed.
const AUTHORED_HAND_CELLS = Object.freeze({
  arthur_kaamelott: {
    width: 792, height: 1980,
    columns: [[2, 197], [200, 394], [397, 592], [595, 790]],
    rows: [[2, 201], [204, 403], [406, 606]]
  },
  serj_tankian: {
    width: 796, height: 1990,
    columns: [[2, 198], [201, 394], [397, 591], [594, 790]],
    rows: [[2, 202], [205, 406], [409, 610]]
  }
});

export const isExtinctionCombatant = hero => Boolean(hero?.id)
  && hero.nonCombat !== true && hero.category !== 'trial' && hero.cat !== 'trial';

export function getExtinctionRoster(heroes = [], unlockedIds = []) {
  const owned = new Set(Array.isArray(unlockedIds) ? unlockedIds : []);
  const seen = new Set();
  return (Array.isArray(heroes) ? heroes : []).filter(hero => {
    if (!isExtinctionCombatant(hero) || !owned.has(hero.id) || seen.has(hero.id)) return false;
    seen.add(hero.id);
    return true;
  });
}

/** A universal / side-view sheet is NOT a first-person hand asset. */
export function getExtinctionViewmodel(hero) {
  const pack = getHeroCompleteSpritePack(hero) || [];
  const hands = pack.find(sheet => sheet.id === 'fpsHands' || sheet.id === 'fps');
  // A base costume cannot be certified for a different costume. Keep it in the
  // inventory but do not silently display it as an authored variant.
  if (!isExtinctionCombatant(hero) || !hands?.src || hero?.activeSkin) {
    return { id: 'schematic', heroId: hero?.id || '', src: '', projectile: '', layout: null,
      status: 'PLACEHOLDER', reason: hero?.activeSkin ? 'costume-not-bound' : 'no-first-person-sheet' };
  }
  const layout = getSpriteSheetLayout(hands.src);
  return { id: hero.id, heroId: hero.id, src: hands.src,
    projectile: pack.find(sheet => sheet.id === 'fpsProjectile')?.src || '',
    layout: { ...layout, rowByState: { ...layout.rowByState, ...(hero.id === 'arca_mirelle' ? {reload: 6} : {}) },
      ...(AUTHORED_HAND_CELLS[hero.id] ? { authoredCells: AUTHORED_HAND_CELLS[hero.id] } : {}) },
    status: 'BOUND_PARTIAL', reason: 'source-layout-not-art-approval' };
}

/** Only the starting loadout has an authored binding. Loot guns are distinct. */
export function getExtinctionHandFrame(profile, state = {}) {
  if (!profile?.src || !profile.layout || (state.weapon?.type && state.weapon.type !== 'pistol')) return null;
  const layout = profile.layout;
  const phase = state.muzzle > 0 ? 'attack' : state.reloadPulse > 0 ? 'reload'
    : Math.hypot(state.vx || 0, state.vy || 0) > 0.01 ? 'run' : 'idle';
  const row = layout.rowByState?.[phase] ?? layout.rowByState?.idle ?? 0;
  const col = Math.floor(Math.max(0, Number(state.t) || 0) / 12) % layout.columns;
  const authored = layout.authoredCells;
  const x = authored?.columns[col], y = authored?.rows[row];
  return { phase, row: Math.max(0, Math.min(layout.rows - 1, row)),
    col,
    ...(x && y ? { sourceCell: { x: x[0], y: y[0], w: x[1] - x[0], h: y[1] - y[0], width: authored.width, height: authored.height } } : {}),
    trim: layout.trimByState?.[phase] || {}, columns: layout.columns, rows: layout.rows };
}

/** Explicit neutral schematic for a missing asset or a different pickup weapon.
 * Not a canonical hand model. Geometry contains no anatomy/character identity.
 */
export function drawExtinctionSchematic(ctx, state, width, height, color = '#39c5bb') {
  const type = state.weapon?.type || 'pistol';
  const w = type === 'rocket' ? 100 : type === 'shotgun' ? 68 : 52;
  const x = width / 2 - w / 2, y = height - 106 + (state.muzzle > 0 ? 7 : 0);
  ctx.save();
  ctx.fillStyle = '#17232c'; ctx.strokeStyle = color; ctx.lineWidth = 2;
  ctx.fillRect(x, y, w, 100); ctx.strokeRect(x, y, w, 100);
  ctx.fillStyle = color; ctx.fillRect(x + w * 0.22, y + 8, w * 0.56, 5);
  if (state.muzzle > 0) {
    ctx.globalAlpha = 0.65;
    ctx.beginPath(); ctx.arc(width / 2, y - 7, type === 'plasma' ? 18 : 11, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

/** Source pixels stay in one declared cell, including every trim edge.
 * Invalid/unloaded artwork uses the existing schematic, not a borrowed sheet.
 */
export function getExtinctionHandSourceRect(frame, width, height) {
  if (!frame || !Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null;
  const { columns, rows, col, row } = frame;
  if (![columns, rows].every(n => Number.isInteger(n) && n > 0)
      || !Number.isInteger(col) || col < 0 || col >= columns
      || !Number.isInteger(row) || row < 0 || row >= rows) return null;
  if (frame.sourceCell) {
    const cell = frame.sourceCell;
    if (![cell.x, cell.y, cell.w, cell.h, cell.width, cell.height].every(Number.isFinite)
        || cell.x < 0 || cell.y < 0 || cell.w <= 0 || cell.h <= 0 || cell.width <= 0 || cell.height <= 0
        || cell.x + cell.w > cell.width || cell.y + cell.h > cell.height
        || Math.abs(width / height - cell.width / cell.height) > 1e-9) return null;
    const scale = width / cell.width;
    return { x: cell.x * scale, y: cell.y * scale, w: cell.w * scale, h: cell.h * scale };
  }
  const cellW = width / columns, cellH = height / rows;
  if (cellW < 1 || cellH < 1) return null;
  const edge = n => Number.isFinite(n) ? Math.max(0, n) : 0;
  const trim = frame.trim || {};
  const left = Math.min(edge(trim.left), cellW - 1), top = Math.min(edge(trim.top), cellH - 1);
  const right = Math.min(edge(trim.right), cellW - left - 1), bottom = Math.min(edge(trim.bottom), cellH - top - 1);
  return { x: col * cellW + left, y: row * cellH + top, w: cellW - left - right, h: cellH - top - bottom };
}

/** Contain the source aspect inside the existing lower-screen envelope. */
export function getExtinctionHandPlacement(source, width, height, state = {}) {
  if (!source || ![source.w, source.h, width, height].every(n => Number.isFinite(n) && n > 0)) return null;
  const maxW = Math.min(300, width * 0.6), maxH = Math.min(188, height * 0.44);
  const scale = Math.min(maxW / source.w, maxH / source.h);
  const w = source.w * scale, h = source.h * scale;
  const finite = n => Number.isFinite(n) ? n : 0;
  const sway = Math.max(-maxW * 0.15, Math.min(maxW * 0.15, -finite(state.turnVel) * 430 + finite(state.vx) * 85));
  return { x: Math.max(0, Math.min(width - w, (width - w) / 2 + sway)), y: Math.max(0, height - h - Math.min(4, height * 0.02)), w, h };
}

/** Existing firing overlay only: aspect correction does not create ballistics. */
export function getExtinctionProjectilePlacement(sourceWidth, sourceHeight, width, height) {
  if (![sourceWidth, sourceHeight, width, height].every(n => Number.isFinite(n) && n > 0)) return null;
  const scale = Math.min(Math.min(410, width * 0.8) / sourceWidth, Math.min(146, height * 0.34) / sourceHeight);
  const w = sourceWidth * scale, h = sourceHeight * scale;
  return { x: (width - w) / 2, y: Math.max(0, Math.min(height - h, height / 2 - 94 + (146 - h) / 2)), w, h };
}
