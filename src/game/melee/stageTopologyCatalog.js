export const STAGE_TOPOLOGY_IDS = Object.freeze({
  flat: 'FLAT',
  twoPlatform: 'TWO_PLATFORM',
  threePlatform: 'THREE_PLATFORM',
  mobilePlatform: 'MOBILE_PLATFORM',
  noPlatformLevel: 'NO_PLATFORM_LEVEL',
  transformingEvent: 'TRANSFORMING_EVENT'
});

export const STAGE_VARIANTS = Object.freeze({
  lore: 'lore',
  competitive: 'competitive'
});

export const STAGE_EVENT_INTENSITIES = Object.freeze({
  off: 'off',
  light: 'light',
  full: 'full'
});

const topology = (id, name, description, dynamic = false) => Object.freeze({
  id,
  name: Object.freeze(name),
  description: Object.freeze(description),
  dynamic
});

export const STAGE_TOPOLOGY_CATALOG = Object.freeze({
  [STAGE_TOPOLOGY_IDS.flat]: topology(
    STAGE_TOPOLOGY_IDS.flat,
    { fr: 'Ligne principale', en: 'Main Line' },
    { fr: 'Grande surface lisible sans plateforme supplementaire.', en: 'One readable main surface with no extra platform.' }
  ),
  [STAGE_TOPOLOGY_IDS.twoPlatform]: topology(
    STAGE_TOPOLOGY_IDS.twoPlatform,
    { fr: 'Deux plateformes', en: 'Two Platforms' },
    { fr: 'Deux appuis lateraux ou une ligne haute et une basse.', en: 'Two side supports or one high and one low line.' }
  ),
  [STAGE_TOPOLOGY_IDS.threePlatform]: topology(
    STAGE_TOPOLOGY_IDS.threePlatform,
    { fr: 'Trois plateformes', en: 'Three Platforms' },
    { fr: 'Trois hauteurs originales autour de la ligne principale.', en: 'Three original heights around the main line.' }
  ),
  [STAGE_TOPOLOGY_IDS.mobilePlatform]: topology(
    STAGE_TOPOLOGY_IDS.mobilePlatform,
    { fr: 'Plateformes mobiles', en: 'Mobile Platforms' },
    { fr: 'Une a trois plateformes suivent des rails bornes.', en: 'One to three platforms follow bounded rails.' },
    true
  ),
  [STAGE_TOPOLOGY_IDS.noPlatformLevel]: topology(
    STAGE_TOPOLOGY_IDS.noPlatformLevel,
    { fr: 'Lieu jouable', en: 'Playable Location' },
    { fr: 'Les surfaces suivent le decor au lieu de dalles flottantes.', en: 'Surfaces follow the location instead of floating slabs.' }
  ),
  [STAGE_TOPOLOGY_IDS.transformingEvent]: topology(
    STAGE_TOPOLOGY_IDS.transformingEvent,
    { fr: 'Transformation annoncee', en: 'Telegraphed Transformation' },
    { fr: 'Deux ou trois layouts precalcules alternent apres avertissement.', en: 'Two or three precomputed layouts alternate after a warning.' },
    true
  )
});

const ARENA_TOPOLOGY_MAP = Object.freeze({
  training_flat: STAGE_TOPOLOGY_IDS.flat,
  triplat_duel: STAGE_TOPOLOGY_IDS.threePlatform,
  vertical_tower: STAGE_TOPOLOGY_IDS.threePlatform,
  split_pit: STAGE_TOPOLOGY_IDS.twoPlatform,
  asym_hunt: STAGE_TOPOLOGY_IDS.threePlatform,
  boss_coliseum: STAGE_TOPOLOGY_IDS.flat,
  oc_authorless_finale: STAGE_TOPOLOGY_IDS.transformingEvent,
  concert_stage: STAGE_TOPOLOGY_IDS.mobilePlatform,
  containment_lab: STAGE_TOPOLOGY_IDS.noPlatformLevel,
  hive_corridor: STAGE_TOPOLOGY_IDS.noPlatformLevel,
  city_rooftops: STAGE_TOPOLOGY_IDS.noPlatformLevel,
  absurd_party: STAGE_TOPOLOGY_IDS.transformingEvent,
  arcane_ruins: STAGE_TOPOLOGY_IDS.threePlatform,
  war_front: STAGE_TOPOLOGY_IDS.twoPlatform,
  artifact_bastion: STAGE_TOPOLOGY_IDS.twoPlatform,
  artifact_sweep: STAGE_TOPOLOGY_IDS.threePlatform,
  portal_lockdown: STAGE_TOPOLOGY_IDS.threePlatform,
  boss_overload: STAGE_TOPOLOGY_IDS.flat
});

export const P5_STAGE_PILOTS = Object.freeze({
  Alien: Object.freeze({
    universe: 'Alien',
    competitiveTopologyId: STAGE_TOPOLOGY_IDS.flat,
    loreTopologyId: STAGE_TOPOLOGY_IDS.twoPlatform,
    eventProfileId: 'hive-pressure'
  }),
  'Camera Cafe': Object.freeze({
    universe: 'Camera Cafe',
    competitiveTopologyId: STAGE_TOPOLOGY_IDS.twoPlatform,
    loreTopologyId: STAGE_TOPOLOGY_IDS.mobilePlatform,
    eventProfileId: 'office-tempo'
  }),
  'Godzilla The Animated Series': Object.freeze({
    universe: 'Godzilla The Animated Series',
    competitiveTopologyId: STAGE_TOPOLOGY_IDS.threePlatform,
    loreTopologyId: STAGE_TOPOLOGY_IDS.threePlatform,
    eventProfileId: 'kaiju-incursion'
  })
});

const normalizeEnum = (value, allowed, fallback) => {
  const normalized = String(value || '').trim();
  return allowed.includes(normalized) ? normalized : fallback;
};

export const normalizeStageTopologyId = value => normalizeEnum(
  String(value || '').toUpperCase(),
  Object.values(STAGE_TOPOLOGY_IDS),
  null
);

export const normalizeStageVariant = value => normalizeEnum(
  String(value || '').toLowerCase(),
  Object.values(STAGE_VARIANTS),
  STAGE_VARIANTS.lore
);

export const normalizeStageEventIntensity = value => normalizeEnum(
  String(value || '').toLowerCase(),
  Object.values(STAGE_EVENT_INTENSITIES),
  STAGE_EVENT_INTENSITIES.full
);

const stageSearchText = stage => [
  stage?.universe,
  stage?.name,
  stage?.description,
  stage?.tags?.join?.(' ')
].filter(Boolean).join(' ').toLowerCase();

const inferTopologyFromStage = stage => {
  const text = stageSearchText(stage);
  if (/godzilla|kaiju|titan|coloss|invasion|tripod|scarab/.test(text)) return STAGE_TOPOLOGY_IDS.flat;
  if (/music|concert|rhythm|meme|ado|band|sound|stage/.test(text)) return STAGE_TOPOLOGY_IDS.mobilePlatform;
  if (/comedy|absurd|parody|party|gag|toy/.test(text)) return STAGE_TOPOLOGY_IDS.transformingEvent;
  if (/arcane|magic|fantasy|wizard|witch|castle|dungeon/.test(text)) return STAGE_TOPOLOGY_IDS.threePlatform;
  if (/marine|military|soldier|war|front|covenant/.test(text)) return STAGE_TOPOLOGY_IDS.twoPlatform;
  if (/lab|horror|alien|hive|corridor|train|bridge|street|roof|route|race/.test(text)) return STAGE_TOPOLOGY_IDS.noPlatformLevel;
  return STAGE_TOPOLOGY_IDS.flat;
};

export const resolveStageTopologyProfile = (stage = {}, arenaId = null) => {
  const explicitTopologyId = normalizeStageTopologyId(
    stage.meleeTopologyId || stage.stageTopologyId || stage.customBattle?.stageTopologyId
  );
  const pilot = P5_STAGE_PILOTS[stage.universe] || null;
  const variant = normalizeStageVariant(
    stage.meleeStageVariant || stage.stageVariant || stage.customBattle?.stageVariant
  );
  const topologyId = explicitTopologyId
    || (variant === STAGE_VARIANTS.competitive
      ? pilot?.competitiveTopologyId
      : pilot?.loreTopologyId)
    || ARENA_TOPOLOGY_MAP[arenaId]
    || inferTopologyFromStage(stage);
  const requestedIntensity = normalizeStageEventIntensity(
    stage.meleeEventIntensity || stage.stageEventIntensity || stage.customBattle?.stageEventIntensity
  );
  const eventsSuppressed = Boolean(stage.disableStageEvents || stage.disableHazards);
  const eventIntensity = variant === STAGE_VARIANTS.competitive || eventsSuppressed
    ? STAGE_EVENT_INTENSITIES.off
    : requestedIntensity;

  return Object.freeze({
    topologyId,
    topology: STAGE_TOPOLOGY_CATALOG[topologyId],
    variant,
    requestedIntensity,
    eventIntensity,
    eventsEnabled: eventIntensity !== STAGE_EVENT_INTENSITIES.off,
    eventProfileId: pilot?.eventProfileId || 'arca-field',
    explicitTopology: Boolean(explicitTopologyId || pilot)
  });
};

const canonicalPlatform = (width, height, left, right, y, kind = 'soft', passThrough = kind !== 'main') => ({
  x1: Math.round(width * left),
  x2: Math.round(width * right),
  y: Math.round(height * y),
  kind,
  passThrough
});

export const createCanonicalTopologyPlatforms = (topologyId, width, height, layoutIndex = 0) => {
  const id = normalizeStageTopologyId(topologyId) || STAGE_TOPOLOGY_IDS.flat;
  const main = canonicalPlatform(width, height, 0.06, 0.94, 0.78, 'main', false);
  const layouts = {
    [STAGE_TOPOLOGY_IDS.flat]: [main],
    [STAGE_TOPOLOGY_IDS.twoPlatform]: [
      main,
      canonicalPlatform(width, height, 0.14, 0.35, 0.54),
      canonicalPlatform(width, height, 0.65, 0.86, 0.54)
    ],
    [STAGE_TOPOLOGY_IDS.threePlatform]: [
      main,
      canonicalPlatform(width, height, 0.12, 0.33, 0.56),
      canonicalPlatform(width, height, 0.67, 0.88, 0.56),
      canonicalPlatform(width, height, 0.39, 0.61, 0.38)
    ],
    [STAGE_TOPOLOGY_IDS.mobilePlatform]: [
      main,
      { ...canonicalPlatform(width, height, 0.13, 0.34, 0.54), motion: { axis: 'x', range: Math.round(width * 0.12), periodMs: 8200, phase: 0 } },
      { ...canonicalPlatform(width, height, 0.66, 0.87, 0.54), motion: { axis: 'y', range: Math.round(height * 0.12), periodMs: 6200, phase: Math.PI } }
    ],
    [STAGE_TOPOLOGY_IDS.noPlatformLevel]: [
      canonicalPlatform(width, height, 0.04, 0.38, 0.78, 'main', false),
      canonicalPlatform(width, height, 0.38, 0.68, 0.70, 'main', false),
      canonicalPlatform(width, height, 0.68, 0.96, 0.62, 'main', false)
    ],
    [STAGE_TOPOLOGY_IDS.transformingEvent]: [
      [
        main,
        canonicalPlatform(width, height, 0.13, 0.34, 0.55),
        canonicalPlatform(width, height, 0.66, 0.87, 0.55)
      ],
      [
        main,
        canonicalPlatform(width, height, 0.39, 0.61, 0.40),
        canonicalPlatform(width, height, 0.14, 0.32, 0.62),
        canonicalPlatform(width, height, 0.68, 0.86, 0.50)
      ],
      [
        main,
        canonicalPlatform(width, height, 0.18, 0.40, 0.45),
        canonicalPlatform(width, height, 0.60, 0.82, 0.45)
      ]
    ][Math.abs(Number(layoutIndex) || 0) % 3]
  };
  return layouts[id].map((entry, index) => ({
    ...entry,
    topologyPlatformId: `${id.toLowerCase()}-${index}`,
    baseX1: entry.x1,
    baseX2: entry.x2,
    baseY: entry.y
  }));
};

export const decoratePlatformsForTopology = (platforms = [], profile, width, height) => {
  const topologyId = profile?.topologyId || STAGE_TOPOLOGY_IDS.flat;
  const explicit = Boolean(profile?.explicitTopology);
  const source = explicit
    ? createCanonicalTopologyPlatforms(topologyId, width, height)
    : platforms;
  const decorated = source.map((entry, index) => ({
    ...entry,
    topologyPlatformId: entry.topologyPlatformId || `${topologyId.toLowerCase()}-${index}`,
    baseX1: Number.isFinite(entry.baseX1) ? entry.baseX1 : entry.x1,
    baseX2: Number.isFinite(entry.baseX2) ? entry.baseX2 : entry.x2,
    baseY: Number.isFinite(entry.baseY) ? entry.baseY : entry.y
  }));

  if (topologyId !== STAGE_TOPOLOGY_IDS.mobilePlatform) return decorated;
  let mobileIndex = 0;
  return decorated.map(entry => {
    if (entry.kind === 'main' || mobileIndex >= 3 || entry.motion) return entry;
    const motion = mobileIndex % 2 === 0
      ? { axis: 'x', range: Math.round(width * 0.08), periodMs: 6200 + mobileIndex * 600, phase: mobileIndex * Math.PI * 0.6 }
      : { axis: 'y', range: Math.round(height * 0.08), periodMs: 5200 + mobileIndex * 600, phase: mobileIndex * Math.PI * 0.6 };
    mobileIndex += 1;
    return { ...entry, motion };
  });
};
