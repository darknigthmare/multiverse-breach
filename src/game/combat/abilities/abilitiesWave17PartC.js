import { hit, shot, buff, guard, defend } from './rules.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE17_PART_C as SOURCES } from '../combatSourceDefinitionsWave17PartC.js';

// Damage belongs to the complete visible partner, never the human caller.
const PHYSICAL_BASIC = new Set(['taichi', 'matt', 'izzy', 'sora_biyomon', 'mimi_palmon', 'kari_gatomon', 'mai_ygo', 'momo_ayase', 'oken_dandadan', 'aira_dandadan', 'judy_hopps']);
const PROJECTILE_BASIC = new Set(['kaiba', 'joey', 'pegasus_ygo', 'atem', 'korvo_solar']);
const support = (source, name) => source.effect === 'guard'
  ? guard(name, { targetSide: 'self', shape: 'single', range: 1, duration: 1.2, reduce: 0.25 })
  : buff(name, { targetSide: 'self', shape: 'single', range: 1, duration: 1.8, buffMultiplier: 1.08 });
const action = (source, name, strength, simple = false) => {
  if (simple && source.id === 'tk_patamon') return buff(name, { targetSide: 'self', shape: 'single', range: 1, duration: 1.5, buffMultiplier: 1.06 });
  if (simple && PHYSICAL_BASIC.has(source.id)) return hit(name, strength, { range: source.partner ? 155 : 115 });
  if (simple && PROJECTILE_BASIC.has(source.id)) return shot(name, strength, { range: 530 });
  if (source.effect !== 'damage') return support(source, name);
  return source.delivery === 'projectile' ? shot(name, strength, { range: 580 }) : hit(name, strength, { range: 160 });
};
export const ABILITIES_WAVE17_PART_C = Object.freeze(Object.fromEntries(Object.entries(SOURCES).map(([id, source]) => [id, {
  sourceHeroId: id, universe: source.universe, sourceWork: source.sourceWork,
  sourceReference: source.sourceReference + ' ' + source.weapon,
  identityBasis: 'canonical-role', canonicalVerified: false, networkVerified: false,
  source1to1Verified: false, gameplayAdaptation: true,
  priorSourceReference: source.priorAuthored?.sourceReference || null,
  ...(id === 'mai_ygo' ? { coherenceCorrection: 'One physically present Harpie Lady replaces the prior unseen Harpie Lady Sisters secondary.' } : {}),
  simple: { ...action(source, source.simpleName, 1.15, true), animationDuration: 0.6, hitAt: 0.3 },
  secondary: { ...action(source, source.secondaryName, 1.75), animationDuration: 0.65, hitAt: 0.3, cd: 6 },
  defense: defend(source.defenseName, 0.4), defenseName: source.defenseName,
  special: { ...action(source, source.actionName, 4.2), animationDuration: 1.1, hitAt: 0.46, meterCost: 100,
    ...(id === 'oken_dandadan' ? { targeting: { ...action(source, source.actionName, 4.2).targeting, sourceOkarunAllOutWave17: true, maxAllOutUses: 2 } } : {}) },
  sourcePartner: source.partner, sourceEmitter: source.contactAnchorRole
}])));
