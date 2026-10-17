import { createSourceSignatureRuntime } from './signatureSourceRuntime.js';
import { describeNativeSignature, isSignatureCombatant, resolveSignatureInvocation } from './signatureCatalog.js';
import { getSmashAbilityProfile, getSmashAbilityTargets } from './smashAbilityProfiles.js';
import { resolveRpgTargets, rpgUnitId } from './rpgTargeting.js';
import { grantBattleItemShield } from './battleItemShield.js';

const alive = actor => isSignatureCombatant(actor) && Number.isFinite(actor.currentHp) && actor.currentHp > 0 && actor.state !== 'dead';
const eligibleState = actor => alive(actor) && ['idle', 'run', 'defense'].includes(actor.state)
  && !actor.actionPending && !actor.action && !actor.charging && !actor.guarding && !actor.ledge;
const localName = (value, lang) => typeof value === 'string' ? value : value?.[lang] || value?.fr || value?.en || '';

/** Install per combat instance, never on a prototype or in saved data. */
export function installSignatureDirector(engine, { mode, disabled = false } = {}) {
  if (!engine || disabled || !['RPG', 'Smash'].includes(mode) || engine.stage?.nonCombatTrial) return null;
  if (engine.signatureDirector) return engine.signatureDirector;
  const usedEvents = new Set();
  let sequence = null, resolving = false, disposed = false, sequenceNumber = 0;
  const roster = () => [...(engine.heroes || []), ...(engine.enemies || [])];
  const sideOf = actor => engine.heroes?.includes(actor) ? 'player' : engine.enemies?.includes(actor) ? 'enemy' : null;
  const enemiesOf = actor => sideOf(actor) === 'player' ? (engine.getEncounterTargets?.() || engine.enemies || []) : engine.heroes || [];
  const blocked = () => disposed || engine.disposed || engine.paused || engine.gameOver || engine.isMatchInputLocked?.() || engine.getTargetingState?.();
  const eventReadiness = (event, actor) => {
    const definition = resolveSignatureInvocation(event, actor);
    if (!definition) return { supported: false, ready: false, reason: 'source-not-bound' };
    const targets = (definition.targetSide === 'ally' ? engine.heroes : enemiesOf(actor)).filter(alive);
    const reason = blocked() || sequence ? 'locked' : sideOf(actor) !== 'player' || !eligibleState(actor) ? 'actor-unavailable'
      : engine.stage?.disableItems ? 'items-disabled' : usedEvents.has(event.id) ? 'spent'
        : mode === 'RPG' && (!Number.isFinite(actor.atb) || actor.atb < 100) ? 'atb'
          : !targets.length ? 'no-target' : null;
    return { supported: true, ready: !reason, reason, definition, targets };
  };
  const close = reason => {
    const current = sequence;
    sequence = null;
    if (!current) return;
    // Never undo death/hit states or a native action that has already launched.
    if (current.lockHeld) {
      if (current.actor.state === 'signature') current.actor.state = current.previousState;
      current.actor.actionPending = false;
      current.lockHeld = false;
    }
    current.cancelled = reason || null;
  };
  const begin = (definition, actor, targets, commit, { native = false, action = null, validate = null, validateThroughSequence = false } = {}) => {
    if (blocked() || sequence || !sideOf(actor) || !eligibleState(actor)) return false;
    sequence = { serial: ++sequenceNumber, definition, actor, targets: [...targets], commit,
      native, action, validate, validateThroughSequence, tick: 0, hit: 0, committed: false, previousState: actor.state,
      side: sideOf(actor), lockHeld: true };
    actor.state = 'signature';
    actor.actionPending = true;
    engine.playSfx?.('portal');
    return true;
  };
  const source = createSourceSignatureRuntime(engine, { mode, begin, blocked, eligibleState, sideOf, enemiesOf, busy: () => !!sequence });
  const triggerInvocation = (event, actor) => {
    const state = eventReadiness(event, actor);
    if (!state.ready) return false;
    const d = state.definition;
    // Keep only positions at which a creature actually attacked. Its final blast
    // must not vanish simply because that prey died before the last contact.
    const lastImpactPositions = new Map();
    const started = begin(d, actor, state.targets, hit => {
      const currentTargets = d.targetSide === 'ally' ? engine.heroes : enemiesOf(actor);
      const valid = state.targets.filter(target => currentTargets.includes(target) && alive(target));
      if (d.shield) valid.forEach(target => grantBattleItemShield(target, d.shield));
      else valid.forEach(target => {
        if (!alive(actor)) return;
        if (Number.isFinite(target.x) && Number.isFinite(target.y)) {
          lastImpactPositions.set(target, { x: target.x, y: target.y });
        }
        // Go through the native damage dispatcher, including all boss locks.
        engine.applyDamage(actor, target, d.totalDamage / d.hits, ...(mode === 'Smash' ? [8] : []));
      });
      if (hit === d.hits && d.friendlyBlastRadius && !engine.gameOver) {
        engine.heroes.filter(alive).forEach(ally => {
          if ([...lastImpactPositions.values()].some(point => Math.hypot(point.x - ally.x, point.y - ally.y) <= d.friendlyBlastRadius)) {
            engine.applyDamage(actor, ally, d.friendlyBlastDamage, ...(mode === 'Smash' ? [5] : []));
          }
        });
      }
      engine.playSfx?.(d.shield ? 'shield' : 'hit');
    });
    if (started) {
      if (mode === 'RPG') actor.atb = 0;
      usedEvents.add(event.id);
    }
    return started;
  };
  const wrap = (key, replacement) => {
    if (typeof engine[key] !== 'function') return;
    const original = engine[key];
    engine[key] = (...args) => replacement(original, ...args);
  };
  if (mode === 'RPG') wrap('previewTargets', (original, ...args) => source.previewRpg(original.apply(engine, args)));
  const nativeMelee = (original, actor, abilityType, args, resolveActiveActor = null) => {
    if (resolving) return original.apply(engine, args);
    if (sequence || blocked()) return false;
    const sourceResult = source.triggerMelee(actor, abilityType, resolveActiveActor);
    if (sourceResult !== null) return sourceResult;
    const d = abilityType === 'special' && describeNativeSignature(actor);
    const profile = d && getSmashAbilityProfile(actor, abilityType);
    // Do not upgrade unprofiled legacy attacks into an invented full-screen super.
    if (!d || !profile) return original.apply(engine, args);
    const candidates = enemiesOf(actor);
    const targets = getSmashAbilityTargets(actor, candidates, profile);
    if (!targets.length || !Number.isFinite(actor.specialCharge) || actor.specialCharge < 100) return false;
    const started = begin(d, actor, targets, () => {
      actor.specialCharge = 100;
      // Original spatial rules, source ammunition and hit dispatcher remain authoritative.
      try { original.apply(engine, args); }
      finally { actor.specialCharge = 0; }
    }, { native: true, action: actor.special, validate: () => {
      if (actor.special !== d.action || (resolveActiveActor && resolveActiveActor() !== actor)) return false;
      const currentCandidates = enemiesOf(actor);
      if (!candidates.every(target => currentCandidates.includes(target))
        || !currentCandidates.every(target => candidates.includes(target))) return false;
      const currentProfile = getSmashAbilityProfile(actor, abilityType);
      const currentTargets = getSmashAbilityTargets(actor, currentCandidates, currentProfile);
      return targets.length === currentTargets.length && targets.every((target, index) => currentTargets[index] === target);
    } });
    if (started) actor.specialCharge = 0;
    return started;
  };
  if (mode === 'Smash') {
    wrap('triggerAbility', (original, actor, abilityType) => nativeMelee(original, actor, abilityType, [actor, abilityType]));
    wrap('triggerOpponentAbility', (original, abilityType) => engine.isLocalP2 ? nativeMelee(original, engine.getActiveOpponent?.(), abilityType, [abilityType], () => engine.getActiveOpponent?.()) : false);
  }
  if (mode === 'RPG') wrap('executeRpgAction', (original, context, selectedTargetIds) => {
    if (resolving) return original.call(engine, context, selectedTargetIds);
    if (sequence) return false;
    const sourceResult = source.triggerRpg(context, selectedTargetIds);
    if (sourceResult !== null) return sourceResult;
    const { actor, abilityType, side } = context || {};
    const d = describeNativeSignature(actor, abilityType);
    if (!d || !['summon', 'summon_aoe'].includes(d.action.type)) return original.call(engine, context, selectedTargetIds);
    if (!engine.canUseAction(actor, abilityType, side)) return false;
    const fresh = engine.getActionContext(actor, abilityType, side);
    const resolved = resolveRpgTargets({ ...fresh, selectedTargetIds });
    if (!resolved.valid) return false;
    const resources = { atb: actor.atb, cooldown: actor.cooldown, specialCharge: actor.specialCharge };
    const ids = [...(selectedTargetIds || [])];
    const started = begin(d, actor, resolved.targets, () => {
      Object.assign(actor, resources);
      const succeeded = original.call(engine, fresh, ids);
      // A stale target cannot turn cancellation into free resource restoration.
      if (succeeded !== true) {
        actor.atb = 0;
        if (abilityType === 'special') actor.specialCharge = 0;
      }
    }, { native: true, action: d.action, validate: () => actor[abilityType] === d.action
      && resolved.targets.every(target => roster().includes(target)) });
    if (started) { actor.atb = 0; if (abilityType === 'special') actor.specialCharge = 0; }
    return started;
  });
  // UI, gamepad, field items and source commands cannot mutate a frozen scene.
  for (const key of ['triggerCombatEvent', 'triggerMeleeAction', 'triggerEnemyAbility', 'beginTargeting',
    'beginChargedMeleeAttack', 'releaseChargedMeleeAttack', 'triggerPiratesCurseAction', 'triggerRaamEncounterAction',
    'setActiveHero', 'setActiveOpponent', 'selectHero', 'selectEnemy']) {
    wrap(key, (original, ...args) => sequence && !resolving ? false : original.apply(engine, args));
  }
  wrap('cancelActorActions', (original, actor, ...args) => {
    if (sequence?.actor === actor) close('caster-actions-cancelled');
    return original.call(engine, actor, ...args);
  });
  wrap('applyDamage', (original, ...args) => {
    const result = original.apply(engine, args);
    if (sequence && !alive(sequence.actor)) close('caster-ko');
    else if (sequence?.lockHeld && sequence.actor.state !== 'signature') close('caster-interrupted');
    return result;
  });
  const advance = () => {
    const current = sequence;
    if (!current) return false;
    if (disposed || engine.disposed || engine.gameOver || !alive(current.actor) || sideOf(current.actor) !== current.side
      || (current.lockHeld && current.actor.state !== 'signature')
      || ((!current.committed || current.validateThroughSequence) && current.validate && !current.validate())) {
      close('interrupted'); return true;
    }
    if (engine.paused || engine.isTargetingPaused?.()) return true;
    current.tick++;
    const d = current.definition;
    const impactAt = d.windupTicks + d.revealTicks;
    if (current.hit < d.hits && current.tick >= impactAt + current.hit * d.hitGapTicks) {
      current.hit++;
      current.committed = true;
      // Before the authoritative native executor runs, restore only our own lock.
      current.actor.state = current.previousState;
      current.actor.actionPending = false;
      current.lockHeld = false;
      resolving = true;
      try { current.commit(current.hit); }
      catch (error) { close('error'); throw error; }
      finally { resolving = false; }
      if (sequence === current && !current.native && alive(current.actor)) {
        if (current.actor.state === current.previousState && !current.actor.actionPending) {
          current.actor.state = 'signature'; current.actor.actionPending = true; current.lockHeld = true;
        } else close('caster-interrupted');
      }
    }
    const finished = current.tick >= impactAt + (d.hits - 1) * d.hitGapTicks + d.outroTicks;
    if (finished && sequence === current) close();
    // Native RPG actions use the existing delayed callback queue after the reveal.
    return !(current.native && current.committed);
  };
  wrap('update', (original, ...args) => {
    if (disposed || engine.disposed) return;
    source.prepareRoster();
    if (sequence && advance()) return;
    const result = original.apply(engine, args);
    source.prepareRoster();
    source.tickEnemyAI();
    return result;
  });
  if (typeof engine.dispose !== 'function') engine.dispose = () => { engine.disposed = true; };
  wrap('dispose', (original, ...args) => { close('disposed'); disposed = true; usedEvents.clear(); return original.apply(engine, args); });
  const director = {
    eventReadiness, triggerInvocation,
    superReadiness(actor) {
      if (mode === 'Smash' && source.definitionFor(actor)) return source.readiness(actor);
      const descriptor = mode === 'Smash' && describeNativeSignature(actor);
      const profile = descriptor && getSmashAbilityProfile(actor, 'special');
      if (!descriptor || !profile) return { supported: false, ready: false, reason: 'source-profile-missing' };
      const reason = blocked() || sequence ? 'locked' : !sideOf(actor) || !eligibleState(actor) ? 'actor-unavailable'
        : !Number.isFinite(actor.specialCharge) || actor.specialCharge < 100 ? 'charge'
          : !getSmashAbilityTargets(actor, enemiesOf(actor), profile).length ? 'no-target' : null;
      return { supported: true, ready: !reason, reason, name: descriptor.name.fr };
    },
    get busy() { return !!sequence; },
    get freezesWorld() { return !!sequence && !(sequence.native && sequence.committed); },
    snapshot(lang = 'fr') {
      if (!sequence) return null;
      const { serial, actor, definition: d, tick, hit, side } = sequence;
      return { serial, actorName: actor.name, actorId: rpgUnitId(actor), side, universe: d.universe,
        name: localName(d.name, lang), kind: d.kind, tick, hit, hits: d.hits,
        duration: d.windupTicks + d.revealTicks + (d.hits - 1) * d.hitGapTicks + d.outroTicks,
        phase: tick < d.windupTicks ? 'prepare' : tick < d.windupTicks + d.revealTicks ? 'reveal' : hit < d.hits ? 'impact' : 'return',
        color: d.color, icon: d.icon || null, fidelity: d.fidelity, style: d.style || null, summonName: d.summonName || null, windupTicks: d.windupTicks, revealTicks: d.revealTicks };
    },
    cancel() { close('cancelled'); }
  };
  engine.signatureDirector = director;
  return director;
}
