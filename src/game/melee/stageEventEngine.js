import {
  STAGE_EVENT_INTENSITIES,
  STAGE_TOPOLOGY_IDS,
  STAGE_VARIANTS,
  normalizeStageEventIntensity,
  normalizeStageVariant,
  resolveStageTopologyProfile
} from './stageTopologyCatalog.js';

export const STAGE_EVENT_PHASES = Object.freeze({
  disabled: 'disabled',
  idle: 'idle',
  telegraph: 'telegraph',
  active: 'active',
  cooldown: 'cooldown'
});

export const PRE_MATCH_STATES = Object.freeze({
  locked: 'PRE_MATCH_LOCK',
  active: 'MATCH_ACTIVE'
});

export const PRE_MATCH_LOCK_DURATION_MS = 3000;
export const STAGE_EVENT_RUNTIME_SNAPSHOT_VERSION = 1;
const FIXED_STEP_MS = 1000 / 60;

const freezeDefinition = definition => Object.freeze({
  ...definition,
  safeZones: Object.freeze([...(definition.safeZones || [])]),
  counterplay: Object.freeze({ ...(definition.counterplay || {}) })
});

export const STAGE_EVENT_DEFINITIONS = Object.freeze({
  'hive-pressure': Object.freeze([
    freezeDefinition({
      id: 'predalien-inner-jaw',
      universe: 'Alien',
      telegraphMs: 1400,
      activeMs: 520,
      cooldownMs: 6800,
      maxOccurrences: 2,
      trigger: 'timer',
      effect: 'damage',
      damageRatio: 0.055,
      knockback: 4.5,
      safeZones: ['outside-target-third'],
      warningVfx: 'hive-target',
      warningSfx: 'shield',
      deterministicSeed: 'alien-hive-pressure-v1',
      counterplay: {
        fr: 'Quitter le tiers marque avant la frappe de machoire interne.',
        en: 'Leave the marked third before the inner-jaw strike.'
      },
      competitiveAllowed: false
    })
  ]),
  'office-tempo': Object.freeze([
    freezeDefinition({
      id: 'office-gossip-tempo',
      universe: 'Camera Cafe',
      telegraphMs: 1100,
      activeMs: 2400,
      cooldownMs: 5600,
      maxOccurrences: 3,
      trigger: 'timer',
      effect: 'assist',
      assistKind: 'office-tempo',
      enemySlowRatio: 0.72,
      heroCharge: 8,
      safeZones: ['all-stage'],
      warningVfx: 'arca-comms',
      warningSfx: 'portal',
      deterministicSeed: 'camera-cafe-office-tempo-v1',
      counterplay: {
        fr: 'Profiter de la distraction sans poursuivre sous les rails mobiles.',
        en: 'Use the distraction without chasing beneath the mobile rails.'
      },
      competitiveAllowed: false
    })
  ]),
  'kaiju-incursion': Object.freeze([
    freezeDefinition({
      id: 'godzilla-signature-anomaly',
      universe: 'Godzilla The Animated Series',
      telegraphMs: 2100,
      activeMs: 900,
      cooldownMs: 8200,
      maxOccurrences: 2,
      trigger: 'timer',
      effect: 'assist',
      damageRatio: 0.045,
      heroSpeedMs: 2100,
      safeZones: ['hero-side'],
      warningVfx: 'kaiju-signal',
      warningSfx: 'portal',
      deterministicSeed: 'godzilla-signature-anomaly-v1',
      counterplay: {
        fr: 'Rester du cote A.R.C.A. pendant que Godzilla ouvre l anomalie.',
        en: 'Stay on the A.R.C.A. side while Godzilla opens the anomaly.'
      },
      competitiveAllowed: false
    })
  ]),
  'arca-field': Object.freeze([
    freezeDefinition({
      id: 'arca-weather-shift',
      universe: 'Nexus de Convergence',
      telegraphMs: 1200,
      activeMs: 1800,
      cooldownMs: 7200,
      maxOccurrences: 2,
      trigger: 'timer',
      effect: 'weather',
      safeZones: ['all-stage'],
      warningVfx: 'weather-signal',
      warningSfx: 'portal',
      deterministicSeed: 'arca-weather-shift-v1',
      counterplay: {
        fr: 'Evenement visuel: aucune zone de combat ne devient dangereuse.',
        en: 'Visual event: no combat area becomes dangerous.'
      },
      competitiveAllowed: false
    })
  ]),
  'layout-shift': Object.freeze([
    freezeDefinition({
      id: 'telegraphed-layout-shift',
      universe: 'Nexus de Convergence',
      telegraphMs: 1800,
      activeMs: 420,
      cooldownMs: 7600,
      maxOccurrences: 2,
      trigger: 'timer',
      effect: 'layout',
      safeZones: ['main-line'],
      warningVfx: 'layout-grid',
      warningSfx: 'shield',
      deterministicSeed: 'arca-layout-shift-v1',
      counterplay: {
        fr: 'Rejoindre la ligne principale avant la reconfiguration annoncee.',
        en: 'Reach the main line before the announced reconfiguration.'
      },
      competitiveAllowed: false
    })
  ])
});

const hashSeed = value => {
  const text = String(value ?? 'multiverse-breach-stage');
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0 || 0x9E3779B9;
};

const nextRandom = runtime => {
  let state = runtime.rngState >>> 0;
  state ^= state << 13;
  state ^= state >>> 17;
  state ^= state << 5;
  runtime.rngState = state >>> 0 || 0xA341316C;
  return runtime.rngState / 4294967296;
};

const makeTargeting = (runtime, definition) => {
  if (definition.effect !== 'damage') {
    return { targetThird: null, targetZone: null, safeZones: [...definition.safeZones] };
  }
  const targetingRuntime = {
    rngState: hashSeed(`${runtime.seedHash}|${definition.deterministicSeed}|${runtime.occurrence}`)
  };
  const targetThird = Math.min(2, Math.floor(nextRandom(targetingRuntime) * 3));
  const left = targetThird / 3;
  const right = (targetThird + 1) / 3;
  const safeZones = [];
  if (left > 0) safeZones.push({ x1: 0, x2: left });
  if (right < 1) safeZones.push({ x1: right, x2: 1 });
  return {
    targetThird,
    targetZone: { x1: left, x2: right },
    safeZones
  };
};

export const validateStageEventDefinition = definition => {
  const errors = [];
  const allowedTriggers = ['timer', 'hpThreshold', 'stockThreshold', 'manualSequence'];
  const allowedEffects = ['damage', 'knockback', 'layout', 'platformPath', 'background', 'hazard', 'assist', 'weather'];
  if (!definition?.id) errors.push('id');
  if (!definition?.universe) errors.push('universe');
  if (!Number.isFinite(definition?.telegraphMs) || definition.telegraphMs < 1000 || definition.telegraphMs > 2500) errors.push('telegraphMs');
  if (!Number.isFinite(definition?.activeMs) || definition.activeMs <= 0) errors.push('activeMs');
  if (!Number.isFinite(definition?.cooldownMs) || definition.cooldownMs < 0) errors.push('cooldownMs');
  if (!Number.isInteger(definition?.maxOccurrences) || definition.maxOccurrences < 1) errors.push('maxOccurrences');
  if (!allowedTriggers.includes(definition?.trigger)) errors.push('trigger');
  if (!allowedEffects.includes(definition?.effect)) errors.push('effect');
  if (!Array.isArray(definition?.safeZones) || !definition.safeZones.length) errors.push('safeZones');
  if (!definition?.warningVfx) errors.push('warningVfx');
  if (!definition?.warningSfx) errors.push('warningSfx');
  if (!definition?.counterplay?.fr || !definition?.counterplay?.en) errors.push('counterplay');
  if (typeof definition?.competitiveAllowed !== 'boolean') errors.push('competitiveAllowed');
  if (!definition?.deterministicSeed) errors.push('deterministicSeed');
  return errors;
};

export const getStageEventDefinitions = profile => {
  if (!profile?.eventsEnabled || profile.variant === STAGE_VARIANTS.competitive) return [];
  const baseDefinitions = STAGE_EVENT_DEFINITIONS[profile.eventProfileId]
    || STAGE_EVENT_DEFINITIONS['arca-field'];
  const definitions = profile.topologyId === STAGE_TOPOLOGY_IDS.transformingEvent
    ? [...baseDefinitions, ...STAGE_EVENT_DEFINITIONS['layout-shift']]
    : [...baseDefinitions];
  if (profile.eventIntensity !== STAGE_EVENT_INTENSITIES.light) return definitions;
  if (profile.topologyId === STAGE_TOPOLOGY_IDS.transformingEvent) {
    return definitions.filter(definition => definition.effect === 'layout').slice(0, 1);
  }
  return definitions.slice(0, 1);
};

const createEventSnapshot = runtime => ({
  eventId: runtime.activeDefinition?.id || null,
  phase: runtime.phase,
  occurrence: runtime.occurrence,
  phaseElapsedMs: runtime.phaseElapsedMs,
  targetThird: runtime.targeting?.targetThird ?? null,
  targetZone: runtime.targeting?.targetZone || null,
  safeZones: runtime.targeting?.safeZones || [],
  counterplay: runtime.activeDefinition?.counterplay || null,
  warningVfx: runtime.activeDefinition?.warningVfx || null,
  warningSfx: runtime.activeDefinition?.warningSfx || null,
  effect: runtime.activeDefinition?.effect || null,
  intensity: runtime.intensity,
  layoutIndex: runtime.layoutIndex
});

const chooseDefinition = runtime => {
  const available = runtime.definitions.filter(definition => (
    (runtime.occurrences[definition.id] || 0) < definition.maxOccurrences
  ));
  if (!available.length) return null;
  const index = Math.floor(nextRandom(runtime) * available.length);
  return available[Math.min(available.length - 1, index)];
};

const beginTelegraph = (runtime, emissions) => {
  const definition = chooseDefinition(runtime);
  if (!definition) {
    runtime.phase = STAGE_EVENT_PHASES.disabled;
    runtime.activeDefinition = null;
    runtime.phaseElapsedMs = 0;
    return;
  }
  runtime.activeDefinition = definition;
  runtime.occurrence = (runtime.occurrences[definition.id] || 0) + 1;
  runtime.occurrences[definition.id] = runtime.occurrence;
  runtime.targeting = makeTargeting(runtime, definition);
  runtime.phase = STAGE_EVENT_PHASES.telegraph;
  runtime.phaseElapsedMs = 0;
  const snapshot = createEventSnapshot(runtime);
  runtime.sequence.push({ type: 'telegraph', atMs: runtime.elapsedMs, ...snapshot });
  emissions.push({ type: 'telegraph', definition, snapshot });
};

const transitionPhase = (runtime, emissions) => {
  const definition = runtime.activeDefinition;
  if (runtime.phase === STAGE_EVENT_PHASES.idle) {
    beginTelegraph(runtime, emissions);
    return;
  }
  if (runtime.phase === STAGE_EVENT_PHASES.telegraph) {
    runtime.phase = STAGE_EVENT_PHASES.active;
    runtime.phaseElapsedMs = 0;
    if (definition.effect === 'layout') runtime.layoutIndex = (runtime.layoutIndex + 1) % 3;
    const snapshot = createEventSnapshot(runtime);
    runtime.sequence.push({ type: 'activate', atMs: runtime.elapsedMs, ...snapshot });
    emissions.push({ type: 'activate', definition, snapshot });
    return;
  }
  if (runtime.phase === STAGE_EVENT_PHASES.active) {
    runtime.phase = STAGE_EVENT_PHASES.cooldown;
    runtime.phaseElapsedMs = 0;
    emissions.push({ type: 'complete', definition, snapshot: createEventSnapshot(runtime) });
    return;
  }
  if (runtime.phase === STAGE_EVENT_PHASES.cooldown) {
    runtime.phase = STAGE_EVENT_PHASES.idle;
    runtime.phaseElapsedMs = 0;
    runtime.activeDefinition = null;
    runtime.targeting = null;
  }
};

const getPhaseDuration = runtime => {
  if (runtime.phase === STAGE_EVENT_PHASES.idle) return runtime.nextDelayMs;
  if (runtime.phase === STAGE_EVENT_PHASES.telegraph) return runtime.activeDefinition.telegraphMs;
  if (runtime.phase === STAGE_EVENT_PHASES.active) return runtime.activeDefinition.activeMs;
  if (runtime.phase === STAGE_EVENT_PHASES.cooldown) {
    const intensityScale = runtime.intensity === STAGE_EVENT_INTENSITIES.light ? 1.45 : 1;
    return runtime.activeDefinition.cooldownMs * intensityScale;
  }
  return Infinity;
};

export const createStageEventRuntime = ({ stage = {}, arena = {}, profile = null, seed = null } = {}) => {
  const resolvedProfile = profile || resolveStageTopologyProfile(stage, arena.id);
  const definitions = getStageEventDefinitions(resolvedProfile);
  const deterministicSeed = seed
    ?? stage.deterministicSeed
    ?? stage.stageEventSeed
    ?? `${stage.id || stage.name || 'stage'}|${stage.universe || 'Nexus'}|${resolvedProfile.eventProfileId}`;
  const seedHash = hashSeed(deterministicSeed);
  const runtime = {
    seed: deterministicSeed,
    seedHash,
    rngState: seedHash,
    profile: resolvedProfile,
    definitions,
    intensity: resolvedProfile.eventIntensity,
    phase: definitions.length ? STAGE_EVENT_PHASES.idle : STAGE_EVENT_PHASES.disabled,
    elapsedMs: 0,
    phaseElapsedMs: 0,
    nextDelayMs: 2400,
    activeDefinition: null,
    targeting: null,
    occurrence: 0,
    occurrences: {},
    sequence: [],
    layoutIndex: 0,
    networkRevision: -1,
    networkServerTick: null
  };
  runtime.nextDelayMs += Math.floor(nextRandom(runtime) * 1400);
  return runtime;
};

export const tickStageEventRuntime = (runtime, deltaMs = FIXED_STEP_MS) => {
  const emissions = [];
  if (!runtime || runtime.phase === STAGE_EVENT_PHASES.disabled) return emissions;
  let remaining = Math.max(0, Number(deltaMs) || 0);
  while (remaining > 0 && runtime.phase !== STAGE_EVENT_PHASES.disabled) {
    const duration = getPhaseDuration(runtime);
    const untilBoundary = Math.max(0, duration - runtime.phaseElapsedMs);
    const step = Math.min(remaining, untilBoundary);
    runtime.elapsedMs += step;
    runtime.phaseElapsedMs += step;
    remaining -= step;
    if (runtime.phaseElapsedMs + 0.0001 >= duration) {
      transitionPhase(runtime, emissions);
      if (runtime.phase === STAGE_EVENT_PHASES.idle) {
        runtime.nextDelayMs = 900 + Math.floor(nextRandom(runtime) * 1000);
      }
      if (step === 0 && remaining === 0) break;
    }
  }
  return emissions;
};

export const getStageEventSnapshot = runtime => ({
  ...createEventSnapshot(runtime || {}),
  seed: runtime?.seed ?? null,
  elapsedMs: runtime?.elapsedMs || 0,
  occurrences: { ...(runtime?.occurrences || {}) },
  sequenceLength: runtime?.sequence?.length || 0,
  networkRevision: runtime?.networkRevision ?? -1,
  networkServerTick: runtime?.networkServerTick ?? null
});

const cloneSerializable = value => (
  value == null ? value : JSON.parse(JSON.stringify(value))
);

export const serializeStageEventRuntime = (runtime, { serverTick = null, revision = null } = {}) => {
  if (!runtime) return null;
  const resolvedRevision = Number.isInteger(revision)
    ? revision
    : Math.max(0, Number(runtime.networkRevision) || 0);
  return {
    version: STAGE_EVENT_RUNTIME_SNAPSHOT_VERSION,
    revision: resolvedRevision,
    serverTick: Number.isFinite(serverTick) ? serverTick : runtime.networkServerTick,
    seed: runtime.seed,
    rngState: runtime.rngState >>> 0,
    phase: runtime.phase,
    elapsedMs: runtime.elapsedMs,
    phaseElapsedMs: runtime.phaseElapsedMs,
    nextDelayMs: runtime.nextDelayMs,
    activeEventId: runtime.activeDefinition?.id || null,
    targeting: cloneSerializable(runtime.targeting),
    occurrence: runtime.occurrence,
    occurrences: { ...runtime.occurrences },
    sequence: cloneSerializable(runtime.sequence),
    layoutIndex: runtime.layoutIndex
  };
};

export const applyAuthoritativeStageEventSnapshot = (runtime, snapshot) => {
  if (!runtime || snapshot?.version !== STAGE_EVENT_RUNTIME_SNAPSHOT_VERSION) return false;
  if (!Number.isInteger(snapshot.revision) || snapshot.revision < runtime.networkRevision) return false;
  if (String(snapshot.seed) !== String(runtime.seed)) return false;
  if (!Object.values(STAGE_EVENT_PHASES).includes(snapshot.phase)) return false;
  const activeDefinition = snapshot.activeEventId
    ? runtime.definitions.find(definition => definition.id === snapshot.activeEventId)
    : null;
  if (snapshot.activeEventId && !activeDefinition) return false;
  const finiteFields = ['elapsedMs', 'phaseElapsedMs', 'nextDelayMs', 'occurrence', 'layoutIndex'];
  if (finiteFields.some(field => !Number.isFinite(snapshot[field]) || snapshot[field] < 0)) return false;
  if (!Number.isInteger(snapshot.rngState) || snapshot.rngState < 0) return false;

  runtime.rngState = snapshot.rngState >>> 0 || 0xA341316C;
  runtime.phase = snapshot.phase;
  runtime.elapsedMs = snapshot.elapsedMs;
  runtime.phaseElapsedMs = snapshot.phaseElapsedMs;
  runtime.nextDelayMs = snapshot.nextDelayMs;
  runtime.activeDefinition = activeDefinition;
  runtime.targeting = cloneSerializable(snapshot.targeting);
  runtime.occurrence = snapshot.occurrence;
  runtime.occurrences = { ...(snapshot.occurrences || {}) };
  runtime.sequence = cloneSerializable(snapshot.sequence || []);
  runtime.layoutIndex = Math.floor(snapshot.layoutIndex) % 3;
  runtime.networkRevision = snapshot.revision;
  runtime.networkServerTick = Number.isFinite(snapshot.serverTick) ? snapshot.serverTick : null;
  return true;
};

export const restoreStageEventRuntime = (snapshot, { stage = {}, arena = {}, profile = null } = {}) => {
  if (!snapshot) return null;
  const runtime = createStageEventRuntime({ stage, arena, profile, seed: snapshot.seed });
  return applyAuthoritativeStageEventSnapshot(runtime, snapshot) ? runtime : null;
};

const getStageTone = stage => {
  const text = [stage?.universe, stage?.name, stage?.description].filter(Boolean).join(' ').toLowerCase();
  if (/horror|alien|nightmare|ring|grudge|sinister|chucky|saw/.test(text)) return 'horror';
  if (/arcane|magic|fantasy|witch|wizard|dungeon/.test(text)) return 'arcane';
  if (/comedy|absurd|camera cafe|party|gag|parody/.test(text)) return 'comedy';
  return 'scifi';
};

const PRE_MATCH_MESSAGES = Object.freeze({
  horror: {
    fr: 'La peur a trouve une forme. Garde ton nom.',
    en: 'Fear has found a shape. Keep your name.'
  },
  scifi: {
    fr: 'Ligne d extraction ouverte. Stabilise la zone.',
    en: 'Extraction line open. Stabilize the zone.'
  },
  arcane: {
    fr: 'Les lois locales repondent. Ne romps pas le pacte.',
    en: 'Local laws are answering. Do not break the pact.'
  },
  comedy: {
    fr: 'A.R.C.A. n a pas compris le plan. Commence quand meme.',
    en: 'A.R.C.A. did not understand the plan. Start anyway.'
  }
});

export const createPreMatchLock = ({ stage = {}, serverElapsedMs = null } = {}) => {
  const training = stage.customBattle?.difficulty === 'training' || stage.difficulty === 'Training';
  const skipRequested = training && Boolean(
    stage.skipPreMatchInTraining || stage.customBattle?.skipPreMatchInTraining
  );
  const elapsedMs = skipRequested
    ? PRE_MATCH_LOCK_DURATION_MS
    : Math.max(0, Math.min(PRE_MATCH_LOCK_DURATION_MS, Number(serverElapsedMs) || 0));
  return {
    state: elapsedMs >= PRE_MATCH_LOCK_DURATION_MS ? PRE_MATCH_STATES.active : PRE_MATCH_STATES.locked,
    elapsedMs,
    durationMs: PRE_MATCH_LOCK_DURATION_MS,
    training,
    canSkip: training,
    serverSynchronized: Number.isFinite(serverElapsedMs),
    tone: getStageTone(stage),
    justUnlocked: false
  };
};

export const tickPreMatchLock = (lock, deltaMs = FIXED_STEP_MS, serverElapsedMs = null) => {
  if (!lock) return false;
  const serverAuthoritative = Number.isFinite(serverElapsedMs);
  if (lock.state === PRE_MATCH_STATES.active && !serverAuthoritative) return false;
  const previousState = lock.state;
  const previousElapsed = lock.elapsedMs;
  lock.elapsedMs = serverAuthoritative
    ? Math.max(0, Math.min(lock.durationMs, serverElapsedMs))
    : Math.min(lock.durationMs, previousElapsed + Math.max(0, Number(deltaMs) || 0));
  lock.serverSynchronized = lock.serverSynchronized || serverAuthoritative;
  lock.state = PRE_MATCH_STATES.locked;
  lock.justUnlocked = false;
  // 180 fixed 60 Hz ticks mathematically equal 3000 ms, but binary floating
  // point can leave the accumulator a few trillionths below the boundary.
  if (lock.durationMs - lock.elapsedMs <= 0.0001) {
    lock.elapsedMs = lock.durationMs;
    lock.state = PRE_MATCH_STATES.active;
    lock.justUnlocked = previousState === PRE_MATCH_STATES.locked;
  }
  return lock.state === PRE_MATCH_STATES.locked;
};

export const skipPreMatchLock = lock => {
  if (!lock?.canSkip || lock.state !== PRE_MATCH_STATES.locked) return false;
  lock.elapsedMs = lock.durationMs;
  lock.state = PRE_MATCH_STATES.active;
  lock.justUnlocked = true;
  return true;
};

export const getPreMatchSnapshot = (lock, stage = {}, lang = 'fr') => {
  const language = lang === 'en' ? 'en' : 'fr';
  const elapsedMs = Math.max(0, Number(lock?.elapsedMs) || 0);
  const locked = lock?.state === PRE_MATCH_STATES.locked;
  let cue = 'BREACH!';
  let cueId = 'breach';
  if (locked && elapsedMs < 1000) {
    cue = language === 'fr' ? 'COORDONNEES DE TRAME VERROUILLEES' : 'THREAD COORDINATES LOCKED';
    cueId = 'coordinates';
  } else if (locked && elapsedMs < 1700) {
    cue = '3';
    cueId = '3';
  } else if (locked && elapsedMs < 2400) {
    cue = '2';
    cueId = '2';
  } else if (locked) {
    cue = '1';
    cueId = '1';
  }
  const message = PRE_MATCH_MESSAGES[lock?.tone || getStageTone(stage)] || PRE_MATCH_MESSAGES.scifi;
  return {
    state: lock?.state || PRE_MATCH_STATES.active,
    locked,
    elapsedMs,
    remainingMs: Math.max(0, (lock?.durationMs || PRE_MATCH_LOCK_DURATION_MS) - elapsedMs),
    cue,
    cueId,
    message: message[language],
    source: stage.universe || 'Nexus de Convergence',
    canSkip: Boolean(lock?.canSkip && locked),
    serverSynchronized: Boolean(lock?.serverSynchronized)
  };
};

export const normalizeStageEventOptions = options => {
  const variant = normalizeStageVariant(options?.variant);
  const requestedIntensity = normalizeStageEventIntensity(options?.intensity);
  return {
    variant,
    requestedIntensity,
    intensity: variant === STAGE_VARIANTS.competitive
      ? STAGE_EVENT_INTENSITIES.off
      : requestedIntensity
  };
};
