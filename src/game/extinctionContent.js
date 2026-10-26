/** Extinction presentation only. Never grants ownership or changes combat stats. */
import { getHeroCompleteSpritePack, getSpriteSheetLayout } from './spriteAssets.js';

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
    layout: { ...layout, rowByState: { ...layout.rowByState, ...(hero.id === 'arca_mirelle' ? {reload: 6} : {}) } },
    status: 'BOUND_PARTIAL', reason: 'source-layout-not-art-approval' };
}

/** Only the starting loadout has an authored binding. Loot guns are distinct. */
export function getExtinctionHandFrame(profile, state = {}) {
  if (!profile?.src || !profile.layout || (state.weapon?.type && state.weapon.type !== 'pistol')) return null;
  const layout = profile.layout;
  const phase = state.muzzle > 0 ? 'attack' : state.reloadPulse > 0 ? 'reload'
    : Math.hypot(state.vx || 0, state.vy || 0) > 0.01 ? 'run' : 'idle';
  const row = layout.rowByState?.[phase] ?? layout.rowByState?.idle ?? 0;
  return { phase, row: Math.max(0, Math.min(layout.rows - 1, row)),
    col: Math.floor(Math.max(0, Number(state.t) || 0) / 12) % layout.columns,
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
