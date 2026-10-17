import { createSignatureSpiritSwarm, SPIRIT_RULES } from './signatureSpiritSwarm.js';
import { createSignatureReturningDiscs } from './signatureReturningDisc.js';
import { createSignatureMedicSupport } from './signatureMedicSupport.js';
import { prepareSourceSignature, resolveSourceSignature } from './signatureSourceKits.js';
import { getSmashAbilityProfile, getSmashAbilityTargets } from './smashAbilityProfiles.js';
import { calculateRpgDamage, getRpgActionProfile, resolveRpgTargets, rpgUnitId } from './rpgTargeting.js';
import { absorbBattleItemDamage } from './battleItemShield.js';
import { getCombatEventDamageMultiplier } from './combatEventBuffs.js';
import { applyCombatHealing, getCombatHealingAmount } from './combatHealing.js';

const alive = actor => actor && Number.isFinite(actor.currentHp) && actor.currentHp > 0 && actor.state !== 'dead';
const finitePosition = actor => Number.isFinite(actor?.x) && Number.isFinite(actor?.y);
export const SOURCE_ENEMY_CHARGE_TICKS = 900;
export const SOURCE_ENEMY_RECOVERY_TICKS = 180;

/** Source actions reserve resources once; every impact uses the engine's real
 * damage/healing rules. The director owns all pause and interruption semantics. */
export function createSourceSignatureRuntime(engine, { mode, begin, blocked, eligibleState, sideOf, enemiesOf, busy }) {
  const prepared = new WeakSet();
  const support = createSignatureMedicSupport(engine, mode);
  let aiRecoveryTicks = 0;
  const candidates = actor => actor.special?.rpgProfile?.targetSide === 'ally'
    ? sideOf(actor) === 'player' ? engine.heroes : engine.enemies
    : enemiesOf(actor);
  const prepare = actor => {
    if (!actor || prepared.has(actor)) return;
    prepared.add(actor);
    const definition = prepareSourceSignature(actor);
    // Legacy enemies already have a native secondary fallback. Materialize that
    // SAME action for P2 presentation when special becomes an object: otherwise
    // the HUD uses the entire special object as the missing secondary's label.
    // Query the native profile instead of inventing a new skill/cooldown here.
    if (definition && mode === 'RPG' && sideOf(actor) === 'enemy' && !actor.secondary) {
      const fallback = getRpgActionProfile(actor, 'secondary', 'enemy', engine)?.action;
      if (fallback) actor.secondary = { ...fallback };
    }
  };
  const prepareRoster = () => [...(engine.heroes || []), ...(engine.enemies || [])].forEach(prepare);
  const definitionFor = actor => {
    const definition = resolveSourceSignature(actor);
    return definition && actor.special?.sourceSignatureKey === definition.key
      && Number.isFinite(actor.special.dmg) && actor.special.dmg >= 0 ? definition : null;
  };
  const flights = createSignatureReturningDiscs(engine, { sideOf, enemiesOf,
    validAction: (actor, action, key) => actor.special === action && definitionFor(actor)?.key === key });
  const spirits = createSignatureSpiritSwarm(engine, { mode, sideOf, enemiesOf,
    validAction: (actor, action, key) => actor.special === action && definitionFor(actor)?.key === key });
  const meleeTargets = actor => {
    const profile = getSmashAbilityProfile(actor, 'special');
    const definition = definitionFor(actor);
    if (!profile || !definition || !finitePosition(actor)) return [];
    // Filter a weapon's dead zone BEFORE nearest-target sorting and maxTargets.
    // Otherwise a close invalid target hides a farther valid railgun target.
    const minRange = Number.isFinite(definition.minRange) ? Math.max(0, definition.minRange) : 0;
    let eligible = candidates(actor).filter(target => alive(target) && finitePosition(target)
      && Math.hypot(target.x - actor.x, target.y - actor.y) >= minRange
      && (!definition.protection || support.canLink(actor, target, definition)));
    // Medic may protect himself alone; prefer one nearby teammate when present.
    // Removing self BEFORE maxTargets avoids self swallowing the patient slot.
    if (definition.protection && eligible.some(target => target !== actor)) eligible = eligible.filter(target => target !== actor);
    return getSmashAbilityTargets(actor, eligible, profile)
      .filter(target => definition.effect !== 'heal' || getCombatHealingAmount(target, target.maxHp * definition.healRatio) > 0);
  };
  const readiness = actor => {
    const definition = definitionFor(actor);
    if (!definition) return { supported: false, ready: false, reason: 'source-profile-missing' };
    const side = sideOf(actor);
    const targets = mode === 'Smash' ? meleeTargets(actor)
      : side ? engine.getActionContext(actor, 'special', side).eligibleTargets : [];
    const reason = blocked() || busy() ? 'locked' : definition.summonAgent && !spirits.canLaunch(actor) ? 'summon-active' : flights.has(actor) ? 'projectile-active' : definition.protection && support.active(actor) ? 'support-active'
      : definition.protection && actor.medigunType && actor.medigunType !== 'stock' ? 'wrong-medigun' : !side || !eligibleState(actor) ? 'actor-unavailable'
      : !Number.isFinite(actor.specialCharge) || actor.specialCharge < 100 ? 'charge'
        : mode === 'RPG' && !engine.canUseAction(actor, 'special', side) ? 'atb'
          : !targets.length ? 'no-target' : null;
    return { supported: true, ready: !reason, reason, name: definition.name, definition, targets };
  };
  const start = (actor, targets, resolveActiveActor = null) => {
    const ready = readiness(actor);
    if (!ready.ready || !Array.isArray(targets) || !targets.length) return false;
    const d = ready.definition;
    const action = actor.special;
    if (targets.some(target => !ready.targets.includes(target))) return false;
    if (d.summonAgent && (!finitePosition(actor) || targets.length > SPIRIT_RULES.maxTargets
      || new Set(targets).size !== targets.length || targets.some(target => !finitePosition(target)))) return false;
    // Fix the whole multi-hit plan before reserving the charge. A lost target
    // loses its scheduled contact: it is never replaced by a new combatant.
    const plan = Array.from({ length: d.hits }, (_, index) => {
      if (d.distribution === 'random') return [targets[Math.floor(Math.random() * targets.length)]];
      if (d.distribution === 'cycle') return [targets[index % targets.length]];
      return [...targets];
    });
    const attack = actor.stats?.atk ?? actor.atk;
    if (d.effect === 'damage' && (!Number.isFinite(attack) || attack <= 0 || action.dmg <= 0)) return false;
    const total = d.effect === 'damage' ? attack * action.dmg : 0;
    if (!Number.isFinite(total)) return false;
    const physicalDisc = mode === 'Smash' && d.projectile === 'returning-disc';
    const autonomous = d.summonAgent === 'wraithverge-spirit';
    const descriptor = { ...d, ...(autonomous ? { hits: 1, summonCount: d.hits } : {}),
      id: d.key, action, name: { fr: d.name, en: d.name },
      color: d.color || action.color || actor.secondaryColor || actor.color || '#39c5bb' };
    const started = begin(descriptor, actor, targets, hit => {
      if (autonomous) {
        // Release all four once; subsequent cinematic markers do not deal damage.
        if (hit === 1) spirits.launch(actor, targets, d, total);
        return;
      }
      if (physicalDisc) {
        if (meleeTargets(actor).includes(targets[0])) flights.launch(actor, targets[0], d, total);
        return;
      }
      const current = d.protection ? targets.filter(target => support.canLink(actor, target, d))
        : mode === 'Smash' ? meleeTargets(actor) : candidates(actor).filter(alive);
      if (d.protection) {
        const patient = targets[0];
        if (current.includes(patient)) support.grant(actor, patient, d);
        engine.playSfx?.('shield');
        return;
      }
      for (const target of plan[hit - 1]) {
        if (!alive(actor) || !current.includes(target)) continue;
        if (d.effect === 'heal') {
          const amount = applyCombatHealing(target, target.maxHp * d.healRatio);
          if (amount > 0) engine.particles?.add(target.x, target.y - 20, 0, -1, '#78edbb', 12, 35, 'text', `+${amount}`);
        } else {
          // Do not bypass shields, source locks, defense, lifedrain or damage
          // statistics. Intermediate hits do not push the victim out of range.
          engine.applyDamage(actor, target, total / d.hits, ...(mode === 'Smash' ? [hit === d.hits ? 8 : 0] : []));
        }
      }
      engine.playSfx?.(d.effect === 'heal' ? 'shield' : d.delivery === 'melee' ? 'slash' : 'shoot');
    }, { native: physicalDisc || autonomous, action, validateThroughSequence: true, validate: () => actor.special === action
      && definitionFor(actor) === d && (!resolveActiveActor || resolveActiveActor() === actor) });
    if (started) {
      actor.specialCharge = 0;
      if (mode === 'RPG') {
        actor.atb = 0;
        if (sideOf(actor) === 'enemy') {
          engine.selectedEnemyId = rpgUnitId(actor);
          engine.enemyGlobalRecovery = Math.max(engine.enemyGlobalRecovery || 0, actor.isBoss ? 85 : 110);
        }
      }
    }
    return started;
  };
  const triggerRpg = (context, selectedTargetIds) => {
    const { actor, abilityType, side } = context || {};
    if (abilityType !== 'special' || !definitionFor(actor)) return null;
    if (!engine.canUseAction(actor, abilityType, side) || side !== sideOf(actor)) return false;
    const fresh = engine.getActionContext(actor, abilityType, side);
    const resolved = resolveRpgTargets({ ...fresh, selectedTargetIds });
    return resolved.valid ? start(actor, resolved.targets) : false;
  };
  const triggerMelee = (actor, abilityType, resolveActiveActor = null) => {
    if (abilityType !== 'special' || !definitionFor(actor)) return null;
    return start(actor, meleeTargets(actor), resolveActiveActor);
  };
  const filterRpgContext = context => {
    const d = definitionFor(context?.actor);
    if (context?.abilityType !== 'special' || !d?.protection) return context;
    return { ...context, eligibleTargets: context.eligibleTargets.filter(target => support.canLink(context.actor, target, d)) };
  };
  const previewRpg = preview => {
    if (!preview) return preview;
    const roster = [...engine.heroes, ...engine.enemies];
    const actor = roster.find(unit => rpgUnitId(unit) === preview.actorId);
    if (preview.effect === 'damage') {
      const estimates = preview.estimates.map(estimate => {
        const target = roster.find(unit => rpgUnitId(unit) === estimate.id);
        // A Medic's own damaging attack will release only that Medic's link.
        return support.protects(target, actor) && sideOf(actor)
          ? { ...estimate, amount: 0, min: 0, max: 0, blockedByUber: true } : estimate;
      });
      preview = { ...preview, estimates, estimate: estimates };
    }
    if (preview.abilityType !== 'special') return preview;
    const d = definitionFor(actor);
    if (!d) return preview;
    const sourceProfile = { key: d.key, universe: d.universe, kind: d.kind,
      summonName: d.summonName || null, continuity: d.requiredContinuity || null,
      summonAgent: d.summonAgent || null,
      referenceUrl: d.referenceUrl, fidelity: d.fidelity, protectionTicks: d.durationTicks || null };
    const annotated = { ...preview, sourceProfile, sourceHits: d.hits, sourceDistribution: d.distribution };
    // Healing previews keep the native cap/rounding; both effects expose the
    // actual prepared action rather than the stale generic catalog label.
    if (d.effect !== 'damage') return annotated;
    const targets = candidates(actor).filter(unit => preview.previewTargetIds.includes(rpgUnitId(unit)));
    const estimates = preview.estimates.map(estimate => {
      const index = targets.findIndex(unit => rpgUnitId(unit) === estimate.id);
      if (index < 0 || estimate.blockedByUber || estimate.blockedByKryll || estimate.blockedByAztecCurse || estimate.blockedBySourceFinale) return estimate;
      const target = targets[index];
      const cyclicCount = Math.floor(d.hits / targets.length) + (index < d.hits % targets.length ? 1 : 0);
      const maxHits = d.distribution === 'cycle' ? cyclicCount : d.hits;
      const minHits = d.distribution === 'random' && targets.length > 1 ? 0 : maxHits;
      const nominalHits = d.distribution === 'random' ? Math.round(d.hits / targets.length) : maxHits;
      const damageFor = (hits, variance) => {
        const copy = { ...target, stats: target.stats ? { ...target.stats } : undefined };
        const buff = (actor.rpgBuffTicks > 0 ? actor.rpgBuffMultiplier : 1) * getCombatEventDamageMultiplier(actor);
        let total = 0;
        for (let hit = 0; hit < hits; hit++) {
          if (actor.talent === 'suppressing_fire') {
            if (copy.stats) copy.stats.def = Math.round((copy.stats.def || 0) * 0.8);
            else copy.def = Math.round((copy.def || 0) * 0.8);
          }
          total += absorbBattleItemDamage(copy, calculateRpgDamage(copy,
            (actor.stats?.atk ?? actor.atk) * actor.special.dmg * buff / d.hits, variance, false, actor));
        }
        return Math.min(target.currentHp, total);
      };
      return { ...estimate, amount: damageFor(nominalHits, 1), min: d.summonAgent ? 0 : damageFor(minHits, 0.9), max: damageFor(maxHits, 1.1) };
    });
    return { ...annotated, estimates, estimate: estimates };
  };
  const tickEnemyAI = () => {
    if (mode !== 'Smash' || engine.isLocalP2 || engine.paused || engine.gameOver || engine.disposed
      || engine.stage?.disableSignatureAI || blocked() || busy()) return;
    // No new powers for unidentified foes or scripted encounter controllers.
    // Charge uses simulation ticks, never setTimeout or wall-clock time.
    for (const actor of engine.enemies || []) {
      if (!definitionFor(actor) || !alive(actor) || support.active(actor)) continue;
      if (!Number.isFinite(actor.specialCharge)) continue;
      actor.specialCharge = Math.min(100, actor.specialCharge + 100 / SOURCE_ENEMY_CHARGE_TICKS);
    }
    if (aiRecoveryTicks > 0) { aiRecoveryTicks--;return; }
    const actor = (engine.enemies || []).find(unit => readiness(unit).ready);
    if (actor && triggerMelee(actor, 'special')) aiRecoveryTicks = SOURCE_ENEMY_RECOVERY_TICKS;
  };
  prepareRoster();
  return { prepareRoster, definitionFor, readiness, triggerRpg, triggerMelee, previewRpg, tickEnemyAI, support, filterRpgContext, flights, spirits };
}
