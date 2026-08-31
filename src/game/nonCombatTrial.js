export const NON_COMBAT_TRIAL_TYPES = Object.freeze([
  'break-object',
  'hit-targets',
  'collect',
  'switches',
  'rescue',
  'survive',
  'escape',
  'evidence',
  'escape-evidence'
]);

const TYPE_ALIASES = Object.freeze({
  break: 'break-object',
  destroy: 'break-object',
  'break-object': 'break-object',
  targets: 'hit-targets',
  target: 'hit-targets',
  shoot: 'hit-targets',
  shooting: 'hit-targets',
  'hit-targets': 'hit-targets',
  collect: 'collect',
  collection: 'collect',
  switches: 'switches',
  switch: 'switches',
  activate: 'switches',
  rescue: 'rescue',
  cure: 'rescue',
  pacify: 'rescue',
  survive: 'survive',
  survival: 'survive',
  protect: 'survive',
  escape: 'escape',
  extraction: 'escape',
  evidence: 'evidence',
  investigation: 'evidence',
  expose: 'evidence',
  'escape/evidence': 'escape-evidence',
  'evidence/escape': 'escape-evidence',
  'escape-evidence': 'escape-evidence'
});

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

// Kept local to avoid renderer -> expandedUniverses -> nonCombatTrial cycles.
// Trial actors only need a readable neutral avatar, not combat animation data.
const drawTrialHero = (ctx, hero, animTime) => {
  const bounce = hero.state === 'run' ? Math.sin(animTime * 0.32) * 2 : 0;
  const actionReach = hero.state === 'attack' || hero.state === 'special' ? 12 : 3;
  ctx.save();
  ctx.translate(hero.x, hero.y + bounce);
  ctx.scale(hero.facing || 1, 1);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(-18, 7, 36, 5);
  ctx.fillStyle = hero.secondaryColor || '#f4f7ff';
  ctx.fillRect(-7, -52, 14, 14);
  ctx.fillStyle = hero.primaryColor || hero.color || '#39c5bb';
  ctx.fillRect(-10, -37, 20, 27);
  ctx.fillRect(-8, -10, 6, 17);
  ctx.fillRect(2, -10, 6, 17);
  ctx.fillRect(7, -34, actionReach, 6);
  if (hero.guardHeld) {
    ctx.strokeStyle = '#39c5bb';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(3, -27, 24, -Math.PI * 0.55, Math.PI * 0.55);
    ctx.stroke();
  }
  ctx.restore();
};

const slugify = value => String(value || 'trial')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'trial';

const normalizeSearchText = value => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase();

const isObject = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const localize = (value, fallbackFr = '', fallbackEn = fallbackFr) => {
  if (typeof value === 'string' && value.trim()) {
    return Object.freeze({ fr: value.trim(), en: value.trim() });
  }

  const source = isObject(value) ? value : {};
  const fr = String(source.fr || source.en || fallbackFr || fallbackEn || '').trim();
  const en = String(source.en || source.fr || fallbackEn || fallbackFr || '').trim();
  return Object.freeze({ fr, en });
};

const positiveInteger = (value, fallback, min = 1, max = 60 * 60 * 10) => {
  const numeric = Math.round(Number(value));
  return Number.isFinite(numeric) ? clamp(numeric, min, max) : fallback;
};

const readNested = (source, key) => source?.[key] ?? source?.metadata?.[key];

const normalizeType = value => TYPE_ALIASES[normalizeSearchText(value).trim()] || null;

const inferTypeFromText = value => {
  const text = normalizeSearchText(value);
  const has = (...terms) => terms.some(term => text.includes(term));
  // Medical verbs must not match inside "secure", "secured" or "procure".
  const hasCureVerb = /\b(?:cure|cures|cured|curing)\b/.test(text);

  if (has('escape/evidence', 'evidence/escape')) return 'escape-evidence';
  if (hasCureVerb || has('rescue', 'sauver', 'liberer', 'free ', 'guerir', 'antidote', 'pacify', 'apaiser', 'retrouver la famille', 'find the family')) return 'rescue';
  if (has('evidence', 'preuve', 'indice', 'clue', 'confess', 'aveu', 'expose', 'demaquer', 'identify', 'identifier', 'deduction', 'enquete', 'negotiate')) return 'evidence';
  if (has('voiture', 'vehicle', 'vehicule', 'break ', 'briser', 'casser', 'frapper objet', 'destroy prop')) return 'break-object';
  if (has('collect', 'recuperer', 'rassembler', 'gather', 'pages')) return 'collect';
  if (has('switch', 'interrupteur', 'relay', 'relais', 'activate', 'activer', 'disable', 'desactiver', 'disarm', 'desamorcer', 'sabot')) return 'switches';
  if (has('escape', 'exit', 'sortie', 'evac', 'extract', 'fuir', 'atteindre la sortie', 'collapse', 'catch', 'attraper', 'arrest', 'chase', 'poursuivre', 'course', 'race')) return 'escape';
  if (has('target', 'cible', 'shoot', 'tirer', 'stand de tir')) return 'hit-targets';
  if (has('survive', 'survivre', 'protect', 'proteger', 'until morning', 'jusqu a', 'siege', 'countdown')) return 'survive';
  return 'hit-targets';
};

const isThreatNonCombat = threat => {
  if (!isObject(threat)) return false;
  if (readNested(threat, 'nonCombat') === true) return true;
  const marker = [
    readNested(threat, 'entityType'),
    readNested(threat, 'victoryCondition'),
    readNested(threat, 'trialType')
  ].join(' ');
  return /trial|event|system|network|rescue|dialogue|investigation|evidence|survival|escape|objective/i.test(marker);
};

const looksFrench = value => {
  const text = normalizeSearchText(value);
  return /\b(le|la|les|un|une|des|puis|avant|sans|avec|dans|sur|jusqu|recuperer|activer|sauver|sortie|preuve)\b/.test(text);
};

const makeActionableThreatObjective = (threat, trialType) => {
  const defaults = defaultObjective[trialType] || defaultObjective['hit-targets'];
  const authored = readNested(threat, 'objectiveText') ?? readNested(threat, 'objective');
  let fr = String(readNested(threat, 'objectiveFr') || '').trim();
  let en = String(readNested(threat, 'objectiveEn') || '').trim();

  if (isObject(authored)) {
    fr = String(authored.fr || fr).trim();
    en = String(authored.en || en).trim();
  } else if (typeof authored === 'string' && authored.trim()) {
    if (looksFrench(authored)) fr = authored.trim();
    else en = authored.trim();
  }

  return Object.freeze({
    fr: fr || defaults.fr,
    en: en || defaults.en
  });
};

/**
 * Convert an authored non-combat threat into the same policy shape used by
 * lore finales. Combat fields are deliberately not copied: the stage resolver
 * receives an objective, never a disguised fighter.
 */
export const makeNonCombatPolicyFromThreat = (universe, threat) => {
  if (!isThreatNonCombat(threat)) return null;

  const entityType = String(readNested(threat, 'entityType') || 'non-combat-objective');
  const victoryCondition = String(readNested(threat, 'victoryCondition') || readNested(threat, 'objective') || 'complete-objective');
  const authoredObjective = readNested(threat, 'objectiveText') ?? readNested(threat, 'objective');
  const trialType = normalizeType(readNested(threat, 'trialType')) || inferTypeFromText([
    entityType,
    victoryCondition,
    isObject(authoredObjective) ? authoredObjective.fr : authoredObjective,
    isObject(authoredObjective) ? authoredObjective.en : ''
  ].join(' '));
  const objective = makeActionableThreatObjective(threat, trialType);
  const authoredTrial = isObject(readNested(threat, 'nonCombatTrial'))
    ? readNested(threat, 'nonCombatTrial')
    : {};

  return Object.freeze({
    type: 'policy',
    policy: 'nonCombatFinal',
    source: 'non-combat-threat',
    universe: String(universe || threat.universe || 'Nexus'),
    legacyWorldBossId: threat.id ? String(threat.id) : null,
    name: String(threat.name || universe || 'Trial'),
    nonCombat: true,
    trialType,
    objective,
    victoryCondition,
    entityType,
    visualAnchor: String(readNested(threat, 'visualAnchor') || ''),
    nonCombatTrial: Object.freeze({ ...authoredTrial, type: trialType })
  });
};

const sanitizeCustomObject = (source, index) => {
  const kind = String(source?.kind || 'objective');
  const position = isObject(source?.position) ? source.position : {};
  const integrity = Number.isFinite(Number(source?.integrity))
    ? positiveInteger(source.integrity, 1)
    : null;
  const maxIntegrity = integrity === null
    ? null
    : positiveInteger(source.maxIntegrity, integrity);
  const requiredProgress = positiveInteger(source?.requiredProgress, 1);

  return Object.freeze({
    id: String(source?.id || `objective-${index + 1}`),
    kind,
    label: localize(source?.label, `Objectif ${index + 1}`, `Objective ${index + 1}`),
    position: Object.freeze({
      x: clamp(Number(position.x ?? source?.x ?? 0.2 + index * 0.12) || 0, 0.05, 0.95),
      y: clamp(Number(position.y ?? source?.y ?? 0.76) || 0, 0.1, 0.92)
    }),
    ...(integrity === null
      ? { progress: clamp(Number(source?.progress) || 0, 0, requiredProgress), requiredProgress }
      : { integrity: clamp(integrity, 0, maxIntegrity), maxIntegrity }),
    order: positiveInteger(source?.order, index + 1),
    ...(source?.requiresGuard === true ? { requiresGuard: true } : {}),
    gatedBy: source?.gatedBy ? String(source.gatedBy) : null
  });
};

const evenlySpacedObjects = (count, makeObject, y = 0.76) => Object.freeze(
  Array.from({ length: count }, (_, index) => makeObject(index, {
    x: count === 1 ? 0.72 : 0.18 + (0.68 * index / Math.max(1, count - 1)),
    y
  }))
);

const makeObjects = (type, options) => {
  if (Array.isArray(options.objects) && options.objects.length) {
    return Object.freeze(options.objects.map(sanitizeCustomObject));
  }

  const count = positiveInteger(options.targetCount, type === 'collect' || type === 'evidence' ? 5 : 4, 1, 12);
  const progressObject = (index, position, kind, fr, en, extra = {}) => Object.freeze({
    id: `${kind}-${index + 1}`,
    kind,
    label: localize(null, `${fr} ${index + 1}`, `${en} ${index + 1}`),
    position: Object.freeze(position),
    progress: 0,
    requiredProgress: positiveInteger(extra.requiredProgress, 1),
    order: index + 1,
    gatedBy: extra.gatedBy || null
  });

  switch (type) {
    case 'break-object': {
      const integrity = positiveInteger(options.integrity, 12, 2, 200);
      return Object.freeze([Object.freeze({
        id: String(options.objectId || 'breakable-object'),
        kind: 'breakable-object',
        label: localize(options.objectLabel, 'Objet d’épreuve', 'Trial object'),
        position: Object.freeze({ x: 0.72, y: 0.76 }),
        integrity,
        maxIntegrity: integrity,
        order: 1,
        gatedBy: null
      })]);
    }
    case 'hit-targets':
      return evenlySpacedObjects(count, (index, position) => progressObject(index, {
        x: position.x,
        y: 0.45 + (index % 2) * 0.2
      }, 'target', 'Cible', 'Target'));
    case 'collect':
      return evenlySpacedObjects(count, (index, position) => progressObject(index, {
        x: position.x,
        y: 0.66 + (index % 2) * 0.1
      }, 'collectible', 'Objet', 'Item'));
    case 'switches':
      return evenlySpacedObjects(count, (index, position) => progressObject(index, position, 'switch', 'Relais', 'Relay'));
    case 'rescue': {
      const mechanisms = evenlySpacedObjects(Math.max(2, count - 1), (index, position) => progressObject(
        index,
        position,
        'rescue-mechanism',
        'Mécanisme',
        'Mechanism'
      ));
      return Object.freeze([...mechanisms, progressObject(
        mechanisms.length,
        { x: 0.88, y: 0.7 },
        'rescue-target',
        'Personne à sauver',
        'Rescue target',
        { gatedBy: 'all-mechanisms' }
      )]);
    }
    case 'survive':
      return Object.freeze([
        progressObject(0, { x: 0.3, y: 0.76 }, 'safety-zone', 'Zone sûre', 'Safe zone', { requiredProgress: options.durationFrames }),
        progressObject(1, { x: 0.72, y: 0.76 }, 'safety-zone', 'Zone sûre', 'Safe zone', { requiredProgress: options.durationFrames })
      ]);
    case 'escape':
      return evenlySpacedObjects(count, (index, position) => progressObject(index, position, 'checkpoint', 'Étape', 'Checkpoint'));
    case 'evidence': {
      const evidence = evenlySpacedObjects(count, (index, position) => progressObject(index, {
        x: position.x,
        y: 0.66 + (index % 2) * 0.1
      }, 'evidence', 'Preuve', 'Evidence'));
      return Object.freeze([...evidence, progressObject(
        evidence.length,
        { x: 0.9, y: 0.76 },
        'submission',
        'Validation',
        'Submit',
        { gatedBy: 'all-evidence' }
      )]);
    }
    case 'escape-evidence': {
      const evidenceCount = Math.max(2, count - 1);
      const evidence = evenlySpacedObjects(evidenceCount, (index, position) => progressObject(index, {
        x: position.x,
        y: 0.66 + (index % 2) * 0.1
      }, 'evidence', 'Preuve', 'Evidence'));
      return Object.freeze([...evidence, progressObject(
        evidence.length,
        { x: 0.9, y: 0.76 },
        'extraction',
        'Extraction',
        'Extraction',
        { gatedBy: 'all-evidence' }
      )]);
    }
    default:
      return Object.freeze([]);
  }
};

const defaultObjective = Object.freeze({
  'break-object': Object.freeze({ fr: 'Briser l’objet d’épreuve avant la fin du temps.', en: 'Break the trial object before time expires.' }),
  'hit-targets': Object.freeze({ fr: 'Toucher toutes les cibles.', en: 'Hit every target.' }),
  collect: Object.freeze({ fr: 'Récupérer tous les objets.', en: 'Collect every item.' }),
  switches: Object.freeze({ fr: 'Activer tous les mécanismes.', en: 'Activate every mechanism.' }),
  rescue: Object.freeze({ fr: 'Désactiver les mécanismes puis effectuer le sauvetage.', en: 'Disable the mechanisms, then complete the rescue.' }),
  survive: Object.freeze({ fr: 'Tenir dans les zones sûres jusqu’à la fin du compte à rebours.', en: 'Hold the safe zones until the countdown ends.' }),
  escape: Object.freeze({ fr: 'Franchir les étapes dans l’ordre et atteindre la sortie.', en: 'Clear the checkpoints in order and reach the exit.' }),
  evidence: Object.freeze({ fr: 'Rassembler puis valider toutes les preuves.', en: 'Gather, then submit all evidence.' }),
  'escape-evidence': Object.freeze({ fr: 'Rassembler les preuves puis rejoindre l’extraction.', en: 'Gather the evidence, then reach extraction.' })
});

/**
 * Pure stage-level resolver. It turns policy/threat wording plus optional
 * authored overrides into one deterministic trial specification.
 */
export const inferNonCombatTrial = (policy, context = {}) => {
  const contextualTrial = context.nonCombatTrial || context.trial || context.stage?.nonCombatTrial;
  const authoredTrial = contextualTrial || policy?.nonCombatTrial || {};
  const policyMarker = String(policy?.policy || '');
  const explicitlyNonCombat = policy?.nonCombat === true
    || Boolean(contextualTrial)
    || policyMarker === 'nonCombatFinal'
    || policyMarker === 'stageSetpiece'
    || policy?.source === 'non-combat-threat';

  if (!policy && !contextualTrial) return null;
  if (!explicitlyNonCombat && policy?.nonCombat === false) return null;
  if (!explicitlyNonCombat && !isThreatNonCombat(policy)) return null;

  const objectiveSource = authoredTrial.objective || context.objective || policy?.objective;
  const objective = localize(
    objectiveSource,
    policy?.objective?.fr || policy?.objectiveFr || '',
    policy?.objective?.en || policy?.objectiveEn || ''
  );
  const type = normalizeType(
    authoredTrial.type || authoredTrial.trialType || context.trialType || policy?.trialType
  ) || inferTypeFromText([
    policyMarker,
    policy?.entityType,
    policy?.victoryCondition,
    objective.fr,
    objective.en,
    policy?.reason?.fr,
    policy?.reason?.en
  ].join(' '));
  const durationFrames = positiveInteger(
    authoredTrial.durationFrames ?? context.durationFrames,
    type === 'survive' ? 900 : 1,
    1,
    60 * 60 * 10
  );
  const timeLimitFrames = positiveInteger(
    authoredTrial.timeLimitFrames ?? context.timeLimitFrames,
    type === 'survive' ? durationFrames + 60 : 1800,
    durationFrames,
    60 * 60 * 10
  );
  const requiredParticipationRatio = clamp(
    Number(authoredTrial.requiredParticipationRatio ?? context.requiredParticipationRatio) || 0.7,
    0.5,
    1
  );
  const defaultZoneInterval = durationFrames <= 120 ? durationFrames + 1 : 180;
  const activeZoneIntervalFrames = positiveInteger(
    authoredTrial.activeZoneIntervalFrames ?? context.activeZoneIntervalFrames,
    defaultZoneInterval,
    1,
    Math.max(1, durationFrames)
  );
  const options = {
    ...authoredTrial,
    type,
    durationFrames,
    targetCount: authoredTrial.targetCount ?? context.targetCount,
    integrity: authoredTrial.integrity ?? context.integrity,
    objectId: authoredTrial.objectId,
    objectLabel: authoredTrial.objectLabel,
    objects: authoredTrial.objects
  };
  const objects = makeObjects(type, options);
  const requiredProgress = objects.reduce((total, object) => (
    total + (object.maxIntegrity ?? object.requiredProgress ?? 1)
  ), 0);
  const universe = String(context.universe || policy?.universe || context.stage?.universe || 'Nexus');
  const title = localize(
    authoredTrial.title || context.sourceName || policy?.name,
    `Épreuve — ${universe}`,
    `${universe} Trial`
  );

  return Object.freeze({
    id: String(authoredTrial.id || context.sourceId || policy?.legacyWorldBossId || `${slugify(universe)}-${type}`),
    type,
    universe,
    title,
    objective: objective.fr || objective.en ? objective : defaultObjective[type],
    timeLimitFrames,
    durationFrames,
    requiredParticipationRatio,
    activeZoneIntervalFrames,
    mistakeLimit: positiveInteger(authoredTrial.mistakeLimit ?? context.mistakeLimit, 8, 1, 50),
    requiredProgress,
    objects,
    visualAnchor: String(authoredTrial.visualAnchor || policy?.visualAnchor || ''),
    source: String(policy?.source || 'stage-authored-trial'),
    ...(authoredTrial.orderedObjects === true ? { orderedObjects: true } : {}),
    ...(authoredTrial.forbidAttacks === true ? { forbidAttacks: true } : {})
  });
};

const cloneRuntimeObject = (object, width, height) => ({
  ...object,
  label: { ...object.label },
  position: { ...object.position },
  x: object.position.x * width,
  y: object.position.y * height,
  progress: Number(object.progress) || 0,
  ...(Number.isFinite(object.integrity)
    ? { integrity: object.integrity, maxIntegrity: object.maxIntegrity }
    : {}),
  completed: Number.isFinite(object.integrity)
    ? object.integrity <= 0
    : Number(object.progress) >= Number(object.requiredProgress),
  pulse: 0
});

const runtimeHero = (hero, index, width, groundY) => {
  const maximum = Number(hero.maxHp || hero.stats?.hp || hero.currentHp) || 1;
  return {
    ...hero,
    x: clamp(Number(hero.x) || 74 + index * 34, 30, width - 30),
    y: groundY,
    vx: 0,
    vy: 0,
    facing: 1,
    state: 'idle',
    stateTimer: 0,
    isLeader: index === 0,
    currentHp: Number(hero.currentHp) || maximum,
    maxHp: maximum,
    specialCharge: Number(hero.specialCharge) || 0,
    jumpHeld: false,
    guardHeld: false,
    trialCharge: 0
  };
};

/**
 * Canvas trial engine with the public surface GameCanvas already expects from
 * its Smash engine. There is intentionally no opponent roster or combat event.
 */
export class EngineNonCombatTrial {
  constructor(width, height, heroes, policy, particles, playSfx, onComplete, stage = {}) {
    this.width = width;
    this.height = height;
    this.stage = stage;
    this.drawTrialHero = typeof stage.drawTrialHero === 'function'
      ? stage.drawTrialHero
      : drawTrialHero;
    this.policy = policy;
    this.particles = particles;
    this.playSfx = typeof playSfx === 'function' ? playSfx : () => {};
    this.onComplete = typeof onComplete === 'function' ? onComplete : () => {};
    this.trial = inferNonCombatTrial(policy, {
      stage,
      universe: stage.universe || policy?.universe,
      nonCombatTrial: stage.nonCombatTrial
    }) || inferNonCombatTrial({
      policy: 'nonCombatFinal',
      universe: stage.universe || 'Nexus',
      objective: null,
      nonCombat: true
    });
    this.groundY = height - 46;
    this.heroes = (Array.isArray(heroes) ? heroes : []).map((hero, index) => runtimeHero(
      hero,
      index,
      width,
      this.groundY
    ));
    this.enemies = [];
    this.objects = this.trial.objects.map(object => cloneRuntimeObject(object, width, height));
    this.activeHeroId = this.heroes[0]?.id || null;
    this.activeOpponentId = null;
    this.elapsedFrames = 0;
    this.objectiveProgress = 0;
    this.objectiveTarget = this.trial.requiredProgress;
    this.safetyProgress = 100;
    this.participationFrames = 0;
    this.requiredParticipationFrames = Math.ceil(
      this.trial.durationFrames * this.trial.requiredParticipationRatio
    );
    this.activeZoneIndex = 0;
    this.mistakes = 0;
    this.interactions = 0;
    this.successfulInteractions = 0;
    this.feedback = localize(null, 'Repère l objectif actif puis approche-toi.', 'Locate the active objective, then move closer.');
    this.feedbackFrames = 0;
    this.gameOver = false;
    this.completionReported = false;
    this.paused = false;
    this.disposed = false;
    this.autoBattle = false;
    this.itemTriggers = 0;
    this.updateObjectiveProgress();
  }

  getActiveHero() {
    return this.heroes.find(hero => hero.id === this.activeHeroId) || this.heroes[0] || null;
  }

  getActiveOpponent() {
    return null;
  }

  setActiveHero(id) {
    if (this.gameOver || this.paused) return false;
    const next = this.heroes.find(hero => hero.id === id);
    if (!next) return false;
    this.heroes.forEach(hero => { hero.isLeader = false; });
    next.isLeader = true;
    this.activeHeroId = next.id;
    this.playSfx('jump');
    return true;
  }

  setPaused(value) {
    this.paused = Boolean(value);
  }

  dispose() {
    this.disposed = true;
    this.paused = true;
  }

  isMatchInputLocked() {
    return this.paused || this.gameOver;
  }

  clearMeleeInputState(side = 'player') {
    if (side !== 'player') return false;
    const hero = this.getActiveHero();
    if (!hero) return false;
    hero.jumpHeld = false;
    hero.guardHeld = false;
    hero.trialCharge = 0;
    return true;
  }

  getObjectiveText(lang = 'fr') {
    const locale = lang === 'fr' ? 'fr' : 'en';
    const objective = this.trial.objective[locale] || this.trial.objective.fr || this.trial.objective.en;
    const progress = Math.round(this.getProgressRatio() * 100);
    const remaining = Math.max(0, Math.ceil((this.trial.timeLimitFrames - this.elapsedFrames) / 60));
    return locale === 'fr'
      ? `${objective} Progression ${progress} %, ${remaining} s restantes, erreurs ${this.mistakes}/${this.trial.mistakeLimit}.`
      : `${objective} Progress ${progress}%, ${remaining}s remaining, mistakes ${this.mistakes}/${this.trial.mistakeLimit}.`;
  }

  setFeedback(fr, en = fr, frames = 120) {
    this.feedback = localize(null, fr, en);
    this.feedbackFrames = Math.max(1, frames);
  }

  isObjectLocked(object) {
    if (!object || object.completed) return false;
    if (this.trial.orderedObjects) {
      const expected = this.objects.filter(item => !item.completed)
        .sort((left, right) => left.order - right.order)[0];
      if (expected !== object) return true;
    }
    if (object.gatedBy === 'all-evidence') {
      return this.objects.some(item => item.kind === 'evidence' && !item.completed);
    }
    if (object.gatedBy === 'all-mechanisms') {
      return this.objects.some(item => item.kind === 'rescue-mechanism' && !item.completed);
    }
    if (object.gatedBy) {
      const prerequisite = this.objects.find(item => item.id === object.gatedBy);
      if (!prerequisite?.completed) return true;
    }
    if (object.kind === 'checkpoint') {
      const expected = this.objects
        .filter(item => item.kind === 'checkpoint' && !item.completed)
        .sort((left, right) => left.order - right.order)[0];
      return expected !== object;
    }
    return false;
  }

  getInteractionHint(lang = 'fr') {
    const locale = lang === 'fr' ? 'fr' : 'en';
    if (this.gameOver) {
      return locale === 'fr' ? 'Épreuve terminée.' : 'Trial complete.';
    }
    const hero = this.getActiveHero();
    if (!hero) return locale === 'fr' ? 'Aucune Ancre active.' : 'No active Anchor.';
    const ranged = this.trial.type === 'hit-targets';
    const active = this.getActiveTrialObject(hero, ranged ? 260 : 96, ranged);
    if (active) {
      const label = active.label[locale] || active.label.fr || active.label.en;
      if (active.requiresGuard) {
        return locale === 'fr' ? `DÉPLACE-TOI DISCRÈTEMENT · MAINTIENS GARDE · ${label}` : `MOVE QUIETLY · HOLD GUARD · ${label}`;
      }
      if (['collectible', 'evidence', 'checkpoint', 'extraction'].includes(active.kind)) {
        return locale === 'fr' ? `APPROCHE-TOI · ${label}` : `MOVE CLOSER · ${label}`;
      }
      if (active.kind === 'safety-zone') {
        return locale === 'fr' ? `RESTE DANS LA ZONE · ${label}` : `HOLD THE ZONE · ${label}`;
      }
      return ranged
        ? (locale === 'fr' ? `VISE ET TIRE · ${label}` : `AIM AND FIRE · ${label}`)
        : (locale === 'fr' ? `INTERAGIS / ATTAQUE · ${label}` : `INTERACT / ATTACK · ${label}`);
    }
    const next = this.objects
      .filter(object => !object.completed && !this.isObjectLocked(object))
      .sort((left, right) => Math.abs(left.x - hero.x) - Math.abs(right.x - hero.x))[0];
    if (!next) return locale === 'fr' ? 'Objectif en validation.' : 'Objective validating.';
    const label = next.label[locale] || next.label.fr || next.label.en;
    return locale === 'fr' ? `REJOINS · ${label}` : `REACH · ${label}`;
  }

  getActiveTrialObject(hero = this.getActiveHero(), range = 72, ranged = false) {
    if (!hero) return null;
    const candidates = this.objects.filter(object => {
      if (object.completed) return false;
      if (this.isObjectLocked(object)) return false;
      const dx = object.x - hero.x;
      const dy = object.y - hero.y;
      if (Math.abs(dy) > (ranged ? this.height : 120)) return false;
      if (ranged && Math.sign(dx || hero.facing) !== hero.facing) return false;
      return Math.hypot(dx, dy) <= range;
    });
    return candidates.sort((left, right) => (
      Math.hypot(left.x - hero.x, left.y - hero.y) - Math.hypot(right.x - hero.x, right.y - hero.y)
    ))[0] || null;
  }

  applyObjectProgress(object, amount = 1) {
    if (!object || object.completed || this.gameOver) return false;
    if (this.isObjectLocked(object)) return false;
    if (object.requiresGuard && !this.getActiveHero()?.guardHeld) {
      if (this.lastDetectionFrame === undefined || this.elapsedFrames - this.lastDetectionFrame >= 60) {
        this.lastDetectionFrame = this.elapsedFrames;
        this.mistakes++;
        this.setFeedback('Repéré : maintiens Garde pour te déplacer discrètement.', 'Detected: hold Guard to move quietly.');
        if (this.mistakes >= this.trial.mistakeLimit) this.complete('defeat');
      }
      return false;
    }
    this.interactions++;

    if (Number.isFinite(object.integrity)) {
      object.integrity = Math.max(0, object.integrity - Math.max(1, amount));
      object.completed = object.integrity <= 0;
    } else {
      object.progress = Math.min(object.requiredProgress, object.progress + Math.max(1, amount));
      object.completed = object.progress >= object.requiredProgress;
    }

    object.pulse = 12;
    this.successfulInteractions++;
    this.setFeedback(
      object.completed ? `${object.label.fr} validé.` : `${object.label.fr}: progression enregistrée.`,
      object.completed ? `${object.label.en} cleared.` : `${object.label.en}: progress registered.`
    );
    this.playSfx(object.completed ? 'confirm' : 'hit');
    this.particles?.add?.(object.x, object.y - 14, 0, -1, object.completed ? '#39c5bb' : '#ffea00', 4, 24, 'spark');
    this.updateObjectiveProgress();
    this.checkCompletion();
    return true;
  }

  interact(hero, amount = 1, range = 72, ranged = false) {
    const object = this.getActiveTrialObject(hero, range, ranged);
    if (!object) {
      this.interactions++;
      this.mistakes++;
      this.setFeedback(
        `Hors portée ou mauvais ordre · erreur ${this.mistakes}/${this.trial.mistakeLimit}.`,
        `Out of range or wrong order · mistake ${this.mistakes}/${this.trial.mistakeLimit}.`
      );
      if (this.mistakes >= this.trial.mistakeLimit) this.complete('defeat');
      return false;
    }
    return this.applyObjectProgress(object, amount);
  }

  triggerMeleeAction(side = 'player', actionName = 'AttackLight') {
    if (side !== 'player' || this.gameOver || this.paused) return false;
    const hero = this.getActiveHero();
    if (!hero) return false;

    const normalizedAction = normalizeSearchText(actionName).replace(/[^a-z]/g, '');
    if (normalizedAction === 'jump') {
      if (hero.y < this.groundY - 1) return false;
      hero.vy = -6.8;
      hero.state = 'jump';
      this.playSfx('jump');
      return true;
    }
    if (this.trial.forbidAttacks) return false;
    if (normalizedAction === 'special') return this.triggerAbility(hero, 'special');
    if (normalizedAction !== 'attacklight' && normalizedAction !== 'ledgeattack') return false;

    hero.state = 'attack';
    hero.stateTimer = 10;
    return this.interact(hero, 1, 76, false);
  }

  triggerAbility(actorOrSide, type = 'simple') {
    if (this.gameOver || this.paused) return false;
    const hero = typeof actorOrSide === 'object' && this.heroes.includes(actorOrSide)
      ? actorOrSide
      : this.getActiveHero();
    if (!hero) return false;

    if (this.trial.forbidAttacks && type !== 'defense') return false;
    hero.state = type === 'defense' ? 'defense' : type === 'special' ? 'special' : 'attack';
    hero.stateTimer = type === 'special' ? 18 : 10;
    if (type === 'defense') {
      hero.guardHeld = true;
      return true;
    }
    const force = type === 'special' ? 3 : type === 'secondary' ? 2 : 1;
    const targetRanges = { simple: 160, secondary: 220, special: 260 };
    const physicalRanges = { simple: 76, secondary: 92, special: 110 };
    const ranges = this.trial.type === 'hit-targets' ? targetRanges : physicalRanges;
    const range = ranges[type] || ranges.simple;
    return this.interact(hero, force, range, true);
  }

  beginChargedMeleeAttack(side = 'player') {
    if (side !== 'player' || this.gameOver || this.paused) return false;
    if (this.trial.forbidAttacks) return false;
    const hero = this.getActiveHero();
    if (!hero) return false;
    hero.trialCharge = Math.max(1, hero.trialCharge);
    hero.state = 'attack';
    return true;
  }

  releaseChargedMeleeAttack(side = 'player') {
    if (side !== 'player' || this.gameOver || this.paused) return false;
    if (this.trial.forbidAttacks) return false;
    const hero = this.getActiveHero();
    if (!hero || hero.trialCharge <= 0) return false;
    const force = clamp(1 + Math.floor(hero.trialCharge / 20), 2, 5);
    hero.trialCharge = 0;
    hero.state = 'attack';
    hero.stateTimer = 14;
    return this.interact(hero, force, 96, false);
  }

  setMeleeShield(side = 'player', held = false) {
    if (side !== 'player' || this.gameOver || this.paused) return false;
    const hero = this.getActiveHero();
    if (!hero) return false;
    hero.guardHeld = Boolean(held);
    hero.state = held ? 'defense' : 'idle';
    return true;
  }

  triggerCombatEvent() {
    return false;
  }

  updateHero(hero, held = {}) {
    const move = (held.right ? 1 : 0) - (held.left ? 1 : 0);
    hero.vx = move * 2.8;
    if (move) {
      hero.facing = Math.sign(move);
      if (hero.stateTimer <= 0) hero.state = 'run';
    } else if (hero.stateTimer <= 0 && hero.y >= this.groundY - 1) {
      hero.state = hero.guardHeld ? 'defense' : 'idle';
    }

    if (held.jump && !hero.jumpHeld && hero.y >= this.groundY - 1) {
      hero.vy = -6.8;
      hero.state = 'jump';
      this.playSfx('jump');
    }
    hero.jumpHeld = Boolean(held.jump);
    hero.guardHeld = Boolean(held.guard || hero.guardHeld);
    if (hero.trialCharge > 0) hero.trialCharge = Math.min(80, hero.trialCharge + 1);

    hero.x = clamp(hero.x + hero.vx, 24, this.width - 24);
    hero.vy += 0.32;
    hero.y = Math.min(this.groundY, hero.y + hero.vy);
    if (hero.y >= this.groundY) hero.vy = 0;
    if (hero.stateTimer > 0) hero.stateTimer--;
  }

  updateAutomaticInteractions(hero) {
    if (!hero) return;
    const automaticKinds = new Set(['collectible', 'evidence', 'checkpoint', 'extraction']);
    const object = this.getActiveTrialObject(hero, 50, false);
    if (object && automaticKinds.has(object.kind)) this.applyObjectProgress(object, 1);

    if (this.trial.type === 'survive') {
      const zones = this.objects.filter(item => item.kind === 'safety-zone');
      this.activeZoneIndex = zones.length
        ? Math.floor(Math.max(0, this.elapsedFrames - 1) / this.trial.activeZoneIntervalFrames) % zones.length
        : -1;
      zones.forEach((item, index) => { item.active = index === this.activeZoneIndex; });
      const activeZone = zones[this.activeZoneIndex];
      const participating = Boolean(activeZone && Math.abs(activeZone.x - hero.x) <= 82);
      if (participating) {
        activeZone.progress = Math.min(activeZone.requiredProgress, activeZone.progress + 1);
        activeZone.completed = activeZone.progress >= activeZone.requiredProgress;
        this.participationFrames++;
        this.safetyProgress = Math.min(100, this.safetyProgress + 0.18);
      } else {
        this.safetyProgress = Math.max(0, this.safetyProgress - (hero.guardHeld ? 0.18 : 0.35));
        if (this.elapsedFrames % 60 === 0) this.mistakes++;
      }
    }
  }

  updateAutoBattle(hero) {
    if (!this.autoBattle || !hero) return;
    const nearest = this.objects.filter(object => !object.completed)
      .sort((left, right) => Math.abs(left.x - hero.x) - Math.abs(right.x - hero.x))[0];
    if (nearest) hero.facing = nearest.x >= hero.x ? 1 : -1;
    const target = this.getActiveTrialObject(hero, this.width + this.height, true);
    if (!target) return;
    // Automated traversal obeys the same quiet-marker prerequisite as manual
    // play instead of repeatedly detecting an unguarded actor.
    if (target.requiresGuard) hero.guardHeld = true;
    const dx = target.x - hero.x;
    if (Math.abs(dx) > 36) {
      hero.vx = Math.sign(dx) * 2.6;
      hero.x = clamp(hero.x + hero.vx, 24, this.width - 24);
      hero.facing = Math.sign(dx);
    } else if (target.kind !== 'safety-zone' && this.elapsedFrames % 24 === 0) {
      this.applyObjectProgress(target, 1);
    }
  }

  update(held = {}) {
    if (this.disposed || this.paused || this.gameOver) return;
    const hero = this.getActiveHero();
    if (!hero) {
      this.complete('defeat');
      return;
    }

    this.elapsedFrames++;
    this.feedbackFrames = Math.max(0, this.feedbackFrames - 1);
    this.heroes.forEach(candidate => this.updateHero(candidate, candidate === hero ? held : {}));
    this.updateAutoBattle(hero);
    this.updateAutomaticInteractions(hero);
    this.objects.forEach(object => { object.pulse = Math.max(0, object.pulse - 1); });

    if (this.trial.type === 'survive') {
      this.objectiveProgress = Math.min(
        this.trial.durationFrames,
        Math.floor(this.participationFrames / this.trial.requiredParticipationRatio)
      );
      this.objectiveTarget = this.trial.durationFrames;
      if (this.safetyProgress <= 0) this.complete('defeat');
      else if (this.elapsedFrames >= this.trial.durationFrames) {
        this.complete(
          this.participationFrames >= this.requiredParticipationFrames ? 'victory' : 'defeat'
        );
      }
    } else {
      this.updateObjectiveProgress();
      this.checkCompletion();
    }

    if (!this.gameOver && this.elapsedFrames >= this.trial.timeLimitFrames) {
      this.complete('defeat');
    }
  }

  updateObjectiveProgress() {
    if (this.trial?.type === 'survive') return;
    this.objectiveProgress = this.objects.reduce((total, object) => {
      if (Number.isFinite(object.integrity)) return total + (object.maxIntegrity - object.integrity);
      return total + Math.min(object.requiredProgress, object.progress);
    }, 0);
    this.objectiveTarget = this.trial?.requiredProgress || 1;
  }

  checkCompletion() {
    if (!this.gameOver && this.objects.length > 0 && this.objects.every(object => object.completed)) {
      this.complete('victory');
    }
  }

  getProgressRatio() {
    return clamp(this.objectiveProgress / Math.max(1, this.objectiveTarget), 0, 1);
  }

  complete(result) {
    if (this.completionReported) return;
    if (result === 'victory' && this.trial.type === 'survive') {
      this.objects.filter(object => object.kind === 'safety-zone').forEach(object => { object.completed = true; });
    }
    this.gameOver = true;
    this.completionReported = true;
    this.setFeedback(
      result === 'victory' ? 'Épreuve validée.' : 'Épreuve échouée: relis la directive.',
      result === 'victory' ? 'Trial cleared.' : 'Trial failed: review the directive.',
      240
    );
    const summary = this.getTrialSummary(result);
    this.playSfx(result === 'victory' ? 'victory' : 'defeat');
    this.onComplete(result, summary);
  }

  getTrialSummary(result = this.gameOver ? 'defeat' : 'in-progress') {
    const progressPct = Math.round(this.getProgressRatio() * 100);
    const timeBonus = Math.max(0, this.trial.timeLimitFrames - this.elapsedFrames);
    const score = Math.max(0, progressPct * 10 + Math.round(timeBonus / 6) - this.mistakes * 50);
    const grade = result !== 'victory' ? 'D' : score >= 1200 ? 'S' : score >= 1000 ? 'A' : score >= 750 ? 'B' : 'C';
    return {
      mode: 'Trial',
      result,
      trialId: this.trial.id,
      trialType: this.trial.type,
      universe: this.trial.universe,
      objective: { ...this.trial.objective },
      progressPct,
      score,
      grade,
      elapsedFrames: this.elapsedFrames,
      timeLimitFrames: this.trial.timeLimitFrames,
      mistakes: this.mistakes,
      interactions: this.interactions,
      successfulInteractions: this.successfulInteractions,
      safetyProgress: Math.round(this.safetyProgress),
      participationFrames: this.participationFrames,
      requiredParticipationFrames: this.requiredParticipationFrames,
      activeZoneIndex: this.activeZoneIndex,
      objects: this.objects.map(object => ({
        id: object.id,
        kind: object.kind,
        completed: object.completed,
        ...(Number.isFinite(object.integrity)
          ? { integrity: object.integrity, maxIntegrity: object.maxIntegrity }
          : { progress: object.progress, requiredProgress: object.requiredProgress })
      }))
    };
  }

  drawObject(ctx, object, animTime, lang, { active = false, locked = false } = {}) {
    const locale = lang === 'fr' ? 'fr' : 'en';
    const pulse = object.pulse > 0 ? 1.12 : 1 + Math.sin(animTime * 0.08 + object.x) * 0.04;
    const color = locked
      ? '#66758a'
      : object.completed || object.active
        ? '#39c5bb'
        : object.kind === 'safety-zone'
          ? '#66758a'
          : '#ffea00';
    ctx.save();
    ctx.translate(object.x, object.y);
    ctx.scale(pulse, pulse);
    ctx.strokeStyle = color;
    ctx.fillStyle = object.completed ? 'rgba(57,197,187,0.28)' : 'rgba(12,18,28,0.82)';
    ctx.lineWidth = 3;

    if (active) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(-48, -68, 96, 88);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
    }

    if (object.kind === 'breakable-object') {
      ctx.fillRect(-38, -22, 76, 32);
      ctx.strokeRect(-38, -22, 76, 32);
      ctx.fillRect(-25, -34, 42, 14);
      ctx.strokeRect(-25, -34, 42, 14);
      ctx.beginPath();
      ctx.arc(-24, 12, 9, 0, Math.PI * 2);
      ctx.arc(24, 12, 9, 0, Math.PI * 2);
      ctx.stroke();
    } else if (object.kind === 'target') {
      ctx.beginPath();
      ctx.arc(0, -12, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -12, 7, 0, Math.PI * 2);
      ctx.stroke();
    } else if (object.kind === 'collectible' || object.kind === 'evidence') {
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-12, -12, 24, 24);
      ctx.strokeRect(-12, -12, 24, 24);
    } else if (object.kind === 'switch' || object.kind === 'rescue-mechanism') {
      ctx.fillRect(-16, -26, 32, 36);
      ctx.strokeRect(-16, -26, 32, 36);
      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.lineTo(object.completed ? 11 : -11, -22);
      ctx.stroke();
    } else if (object.kind === 'safety-zone') {
      ctx.fillRect(-72, 4, 144, 6);
      ctx.strokeRect(-72, 4, 144, 6);
      ctx.beginPath();
      ctx.arc(0, 4, 60, Math.PI, Math.PI * 2);
      ctx.stroke();
    } else if (object.kind === 'checkpoint' || object.kind === 'extraction') {
      ctx.strokeRect(-22, -58, 44, 68);
      ctx.fillRect(-5, -48, 10, 48);
    } else if (object.kind === 'rescue-target') {
      ctx.beginPath();
      ctx.arc(0, -36, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeRect(-12, -24, 24, 34);
    } else {
      ctx.fillRect(-24, -32, 48, 42);
      ctx.strokeRect(-24, -32, 48, 42);
    }
    ctx.restore();

    ctx.save();
    ctx.fillStyle = locked ? '#8a99a8' : object.completed ? '#39c5bb' : '#f4f7ff';
    ctx.font = 'bold 12px Share Tech Mono, monospace';
    ctx.textAlign = 'center';
    const stateLabel = locked
      ? `[${locale === 'fr' ? 'VERROU' : 'LOCK'}] `
      : active
        ? '▶ '
        : '';
    ctx.fillText(`${stateLabel}${object.label[locale] || object.label.fr || object.label.en}`, object.x, object.y + 31);
    ctx.restore();
  }

  draw(ctx, animTime = 0, lang = 'fr') {
    if (!ctx || this.disposed) return;
    ctx.save();
    ctx.fillStyle = 'rgba(5,10,18,0.35)';
    ctx.fillRect(0, this.groundY + 10, this.width, this.height - this.groundY);
    ctx.strokeStyle = 'rgba(57,197,187,0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, this.groundY + 10);
    ctx.lineTo(this.width, this.groundY + 10);
    ctx.stroke();
    ctx.restore();

    const hero = this.getActiveHero();
    const ranged = this.trial.type === 'hit-targets';
    const activeObject = this.getActiveTrialObject(hero, ranged ? 260 : 96, ranged);
    this.objects.forEach(object => this.drawObject(ctx, object, animTime, lang, {
      active: object === activeObject,
      locked: this.isObjectLocked(object)
    }));
    this.heroes.forEach(hero => this.drawTrialHero(ctx, hero, animTime));

    const progress = this.getProgressRatio();
    ctx.save();
    ctx.fillStyle = 'rgba(3,8,15,0.86)';
    ctx.fillRect(18, 16, Math.min(560, this.width - 36), 78);
    ctx.strokeStyle = '#39c5bb';
    ctx.strokeRect(18, 16, Math.min(560, this.width - 36), 78);
    ctx.fillStyle = '#f4f7ff';
    ctx.font = 'bold 11px Share Tech Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(this.trial.title[lang === 'fr' ? 'fr' : 'en'], 29, 35);
    const barWidth = Math.min(530, this.width - 66);
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fillRect(29, 45, barWidth, 10);
    ctx.fillStyle = this.gameOver ? '#39c5bb' : '#ffea00';
    ctx.fillRect(29, 45, barWidth * progress, 10);
    ctx.fillStyle = '#d8f7ff';
    ctx.font = 'bold 11px Share Tech Mono, monospace';
    const remaining = Math.max(0, Math.ceil((this.trial.timeLimitFrames - this.elapsedFrames) / 60));
    ctx.fillText(`${Math.round(progress * 100)}% · ${remaining}s · ${lang === 'fr' ? 'ERREURS' : 'MISTAKES'} ${this.mistakes}/${this.trial.mistakeLimit}`, 29, 72);
    ctx.fillStyle = this.feedbackFrames > 0 ? '#ffea00' : '#f4f7ff';
    const feedback = this.feedbackFrames > 0
      ? (this.feedback[lang === 'fr' ? 'fr' : 'en'] || this.feedback.fr || this.feedback.en)
      : this.getInteractionHint(lang);
    ctx.fillText(feedback, 29, 87, Math.max(120, Math.min(530, this.width - 66)));
    ctx.restore();
  }
}
