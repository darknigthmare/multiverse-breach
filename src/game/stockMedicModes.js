/** Explicit stock Medi Gun adapters. No other identity/weapon receives a kit.
 * Fighter has one active member per side, so its activation is self-only.
 * Tactics uses three Manhattan cells and line of sight. Both retain the
 * existing 100-point super economy and eight active seconds, not eight turns.
 */
import { resolveSourceSignature, prepareSourceSignature } from './signatureSourceKits.js';
import { createSignatureMedicSupport } from './signatureMedicSupport.js';
export const STOCK_MEDIC_TACTICS_RANGE = 3;
export function getStockMedicDefinition(actor, mode) {
  if (mode === 'Tactics' && (actor?.tacticsAttacks?.special || actor?.special?.tacticsProfile
    || actor?.special?.tactics || actor?.special?.attackProfile)) return null;
  if (mode === 'Fighter' && (actor?.fighterAttacks?.super || actor?.special?.fighterProfile)) return null;
  const d = resolveSourceSignature(actor);
  return d?.protection === 'stock-uber' ? d : null;
}
export function prepareStockMedic(actor, mode) {
  return getStockMedicDefinition(actor, mode) ? prepareSourceSignature(actor) : null;
}
export function getTacticsMedicDefinition(actor) {
  const d = getStockMedicDefinition(actor, 'Tactics');
  return d ? { ...d, range: STOCK_MEDIC_TACTICS_RANGE } : null;
}
export function createTacticsMedicSupport(engine) {
  return createSignatureMedicSupport(engine, 'Tactics', {
    reachable: (a, b, range) => engine.isInsideGrid(a.gridX, a.gridY)
      && engine.isInsideGrid(b.gridX, b.gridY)
      && Math.abs(a.gridX - b.gridX) + Math.abs(a.gridY - b.gridY) <= range
      && engine.hasLineOfSight(a, b, { requiresLineOfSight: true, blocksOnUnits: false, pierceObstacles: false })
  });
}
export function createFighterMedicSupport(engine) {
  // Full rosters recognize projectiles from a tagged-out combatant. Tagging
  // explicitly releases its caster link; reserve fighters never get a beam.
  return createSignatureMedicSupport({
    get heroes() { return engine.teams.player.fighters; },
    get enemies() { return engine.teams.cpu.fighters; },
    get disposed() { return engine.disposed; },
    get gameOver() { return engine.finished; },
    get paused() { return engine.paused; },
    isMatchInputLocked: () => engine.countdown > 0 || engine.hitStop > 0,
    playSfx: (...args) => engine.playSfx(...args)
  }, 'Fighter');
}
