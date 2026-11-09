// Explicit direct-fire Fighter adaptations of EXISTING source signatures.
// No roster unlocks, new powers, ballistic travel, homing, ammunition or 1:1 claim.
// Missiles, thrown discs, summoned agents and support effects remain separate.
import { resolveSourceSignature, prepareSourceSignature } from './signatureSourceKits.js';

export const FIGHTER_RANGED_SIGNATURE_KEYS = Object.freeze([
  'barret_ff7', 'yuffie_ff7', 'quistis_ff8',
  'seifer_ff8', 'laguna_ff8', 'irvine_ff8', 'Final Fantasy VII::Sweeper Machine',
  'goku_dbz', 'vegeta_dbz', 'piccolo_dbz', 'Dragon Ball Z::Perfect Cell',
  'vortigaunt_ally', 'Half-Life::Vortigaunt Shock Trooper',
  'Half-Life::Combine Overwatch Soldier', 'Half-Life::Combine Gunship',
  'Half-Life::Combine Strider Heavy',
  'quake_franchise_ranger', 'Quake::Strogg Gladiator',
  'Doom::Spider Mastermind Mother', 'Doom::Spider Mastermind Core',
  'team_fortress_2_scout', 'Team Fortress 2::Robot Scout', 'Team Fortress 2::Robot Heavy',
  'Star Wars::Count Dooku Sith Lord', 'Star Wars::Emperor Palpatine',
  'linda_058', 'Halo::Jackal Sniper', 'hicks_aliens', 'hudson_aliens', 'vasquez_aliens'
]);
const keys = new Set(FIGHTER_RANGED_SIGNATURE_KEYS);

export function getFighterRangedDefinition(actor) {
  if (actor?.fighterAttacks?.super || actor?.special?.fighterProfile) return null;
  const d = resolveSourceSignature(actor);
  if (!d || !keys.has(d.key) || d.kind !== 'personal' || d.effect !== 'damage'
    || d.delivery !== 'ranged' || d.projectile || d.summonAgent || d.protection
    || !Number.isFinite(d.range) || d.range <= 0
    || !Number.isInteger(d.hits) || d.hits < 1 || d.hits > 32
    || !Number.isFinite(d.hitGapTicks) || d.hitGapTicks <= 0) return null;
  const min = d.minRange ?? 0;
  return Number.isFinite(min) && min >= 0 && min < d.range ? d : null;
}

export function prepareFighterRanged(actor) {
  return getFighterRangedDefinition(actor) ? prepareSourceSignature(actor) : null;
}

