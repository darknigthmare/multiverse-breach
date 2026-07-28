import originalUniversesManifest from './originalUniversesManifest.json' with { type: 'json' };
import {
  ORIGINAL_CONTENT_NOTICE,
  completeOriginalUniverseProduction
} from './originalUniverseProduction.js';

const PRIMARY_STAGE_RUNTIME_ID = 60000;

const deepHydrateLocalization = (value) => {
  if (Array.isArray(value)) return value.map(deepHydrateLocalization);
  if (!value || typeof value !== 'object') return value;

  const hydrated = Object.fromEntries(
    Object.entries(value).map(([key, child]) => [key, deepHydrateLocalization(child)])
  );
  if (Object.hasOwn(hydrated, 'fr') && !Object.hasOwn(hydrated, 'en')) {
    hydrated.en = hydrated.fr;
  }
  return hydrated;
};

const asText = (value, locale = 'fr', fallback = '') => (
  typeof value === 'string'
    ? value
    : value?.[locale] || value?.fr || value?.en || fallback
);

const correctNarrativeOrder = (world) => {
  const missions = [...(world.narrativeArc?.missions || [])];
  // The draft inverted the Forum and Vestal Fire prose. Keep every line while
  // aligning each mission with the stage it actually describes.
  if (world.key === 'imperium_aeternum' && missions.length === 3) {
    [missions[0], missions[1]] = [missions[1], missions[0]];
  }

  return {
    ...world.narrativeArc,
    stageIds: world.stages.map(stage => stage.id),
    missions: missions.map((mission, index) => ({
      ...mission,
      stageId: world.stages[index]?.id
    }))
  };
};

const threatIdByName = (world) => new Map([
  ...world.bosses.map(boss => [boss.name, boss.id]),
  [world.worldBoss.name, world.worldBoss.id]
]);

const makeResolvedCandidatePool = (world) => {
  const archive = world.customUnlockables.find(item => item.kind === 'archive');
  const standardHud = world.customUnlockables.find(item => (
    item.kind === 'hud' && item.id !== world.booster.chaseRewardId
  ));
  const anomaly = world.customUnlockables.find(item => item.id === world.booster.chaseRewardId);
  const event = world.battleItems.find(item => item.tier === 'ultimate') || world.battleItems.at(-1);
  const automatic = Object.values(world.universeUnlockables);
  const candidates = [
    ...world.heroes.map((hero, index) => ({
      id: hero.id,
      kind: 'hero',
      rarityId: index === 1 ? 'epic' : 'rare',
      data: hero
    })),
    ...world.gear.map((gear, index) => ({
      id: gear.id,
      kind: 'equipment',
      rarityId: ['common', 'rare', 'epic'][index],
      data: gear
    })),
    {
      id: event.id,
      kind: 'event',
      rarityId: 'epic',
      data: event
    },
    ...world.skins.map((skin, index) => ({
      id: skin.id,
      kind: 'skin',
      rarityId: index === 2 ? 'epic' : 'rare',
      data: skin
    })),
    {
      id: archive.id,
      kind: 'archive',
      rarityId: 'epic',
      data: archive
    },
    {
      id: standardHud.id,
      kind: 'hud',
      rarityId: 'epic',
      data: standardHud
    },
    ...automatic.map(item => ({
      id: item.id,
      kind: item.kind,
      rarityId: item.rarityId,
      data: item
    })),
    {
      id: anomaly.id,
      kind: anomaly.kind,
      rarityId: 'anomaly',
      data: anomaly
    }
  ];

  return Object.freeze(candidates.map(candidate => Object.freeze({
    ...candidate,
    universe: world.universe,
    sourceType: 'original',
    originalContent: true
  })));
};

const makeWorldBooster = (world, candidatePool) => Object.freeze({
  ...world.booster,
  art: world.audiovisual.boosterArt,
  backdrop: world.audiovisual.backdrop,
  universe: world.universe,
  mode: world.mode,
  shape: world.faction,
  color: world.booster.color || world.visual?.colors?.accent,
  priceTier: 'targeted',
  mediaLabel: {
    fr: 'UNIVERS ORIGINAL',
    en: 'ORIGINAL UNIVERSE'
  },
  desc: {
    fr: `${world.title.fr} : trois héros, trois stages et un arc narratif complet.`,
    en: `${world.title.en}: three heroes, three stages, and one complete narrative arc.`
  },
  meta: {
    fr: `Pool résolu de ${candidatePool.length} cartes, limité à la Trame ${world.universe}.`,
    en: `Resolved ${candidatePool.length}-card pool restricted to the ${world.universe} Thread.`
  },
  searchText: [
    world.universe,
    world.title.fr,
    world.title.en,
    world.faction,
    ...world.heroes.map(hero => hero.name)
  ].join(' '),
  candidatePool,
  contentOrigin: 'oc',
  originalContent: true,
  originalContentNotice: ORIGINAL_CONTENT_NOTICE
});

const prepareDefinition = (rawWorld) => {
  const hydrated = deepHydrateLocalization(rawWorld);
  const worldWithArc = {
    ...hydrated,
    narrativeArc: correctNarrativeOrder(hydrated)
  };
  const produced = completeOriginalUniverseProduction(worldWithArc);
  const bossIds = threatIdByName(produced);
  const stages = Object.freeze(produced.stages.map(stage => Object.freeze({
    ...stage,
    bossId: bossIds.get(stage.boss),
    runtimeStageId: PRIMARY_STAGE_RUNTIME_ID
      + originalUniversesManifest.universes.findIndex(world => world.key === produced.key) * 10
      + produced.stages.findIndex(candidate => candidate.id === stage.id)
  })));
  const definitionWithStages = {
    ...produced,
    stages,
    narrativeArc: Object.freeze({
      ...produced.narrativeArc,
      stageIds: Object.freeze(stages.map(stage => stage.id)),
      runtimeStageIds: Object.freeze(stages.map(stage => stage.runtimeStageId))
    })
  };
  const candidatePool = makeResolvedCandidatePool(definitionWithStages);
  const booster = makeWorldBooster(definitionWithStages, candidatePool);

  return Object.freeze({
    ...definitionWithStages,
    booster,
    boosterPoolPlan: Object.freeze({
      ...definitionWithStages.boosterPoolPlan,
      resolvedCandidateIds: Object.freeze(candidatePool.map(candidate => candidate.id)),
      resolvedRarityDistribution: Object.freeze(
        candidatePool.reduce((counts, candidate) => ({
          ...counts,
          [candidate.rarityId]: (counts[candidate.rarityId] || 0) + 1
        }), {})
      )
    })
  });
};

export const ORIGINAL_UNIVERSE_MANIFEST = Object.freeze(
  deepHydrateLocalization(originalUniversesManifest)
);

export const ORIGINAL_UNIVERSE_DEFINITIONS = Object.freeze(
  ORIGINAL_UNIVERSE_MANIFEST.universes.map(prepareDefinition)
);

export const ORIGINAL_CAMPAIGN_UNIVERSES = Object.freeze(
  ORIGINAL_UNIVERSE_DEFINITIONS.map(world => world.universe)
);

export const ORIGINAL_WORLD_KEYS = ORIGINAL_CAMPAIGN_UNIVERSES;

export const ORIGINAL_WORLD_WAVES = Object.freeze(
  ORIGINAL_UNIVERSE_MANIFEST.recommendedWaveBoosters.map(wave => Object.freeze({
    ...wave,
    universes: Object.freeze([...wave.universes]),
    sourceType: 'original',
    originalContent: true
  }))
);

export const ORIGINAL_WORLD_BOOSTERS = Object.freeze(
  ORIGINAL_UNIVERSE_DEFINITIONS.map(world => world.booster)
);

export const ORIGINAL_WORLD_CUSTOM_UNLOCKABLES = Object.freeze(Object.fromEntries(
  ORIGINAL_UNIVERSE_DEFINITIONS.map(world => [
    world.universe,
    Object.freeze([
      ...world.customUnlockables,
      ...Object.values(world.universeUnlockables)
    ])
  ])
));

export const ORIGINAL_WORLD_ITEM_CATALOG = Object.freeze(
  ORIGINAL_UNIVERSE_DEFINITIONS.flatMap(world => world.worldItems)
);

const makeRuntimeHero = (hero) => Object.freeze({
  ...hero,
  cat: hero.category,
  color: hero.primaryColor,
  weapon: hero.weaponType,
  sourceType: 'original',
  originalContent: true,
  originalContentNotice: ORIGINAL_CONTENT_NOTICE
});

const makeRuntimeGear = (world, gear) => Object.freeze([
  gear.id,
  gear.name.en,
  gear.name.fr,
  gear.boost,
  Object.freeze({
    ...gear,
    icon: world.audiovisual.itemIcons[gear.id],
    iconPrompt: `Entirely original ${world.title.en} inventory icon. No text or logo.`,
    visualAnchor: gear.desc,
    audit: 'original-oc',
    contentPackId: `original-world:${world.key}`,
    contentOrigin: 'oc',
    originalContent: true,
    originalContentNotice: ORIGINAL_CONTENT_NOTICE
  })
]);

const makeRuntimeStage = (world, stage, stageIndex) => Object.freeze({
  id: stage.runtimeStageId,
  contentStageId: stage.id,
  stageKey: stage.stageKey || stage.id,
  name: asText(stage.name, 'fr', stage.id),
  displayName: stage.name,
  mode: stage.mode,
  difficulty: stage.difficulty,
  bossName: stage.boss,
  bossNameLocalized: world.bosses.find(boss => boss.id === stage.bossId)?.nameLocalized
    || { fr: stage.boss, en: stage.boss },
  bossId: stage.bossId,
  objectiveType: stage.objectiveType,
  objective: world.narrativeArc.missions[stageIndex],
  setting: stage.setting,
  production: stage.production,
  stageArt: stage.stageArt,
  sourceUniverses: stage.sourceUniverses,
  previousStageId: stageIndex > 0 ? world.stages[stageIndex - 1].runtimeStageId : null,
  requiredCampaignStageIds: stageIndex > 0 ? [world.stages[stageIndex - 1].runtimeStageId] : [],
  contentPackId: `original-world:${world.key}`,
  contentOrigin: 'oc',
  originalContent: true,
  originalContentNotice: ORIGINAL_CONTENT_NOTICE,
  standalone: true,
  numberedAct: false,
  campaignDependency: 'originalCampaign',
  goldPrize: 145 + stageIndex * 35,
  shardPrize: 42 + stageIndex * 9,
  tokenPrize: stageIndex === 2 ? 2 : 1
});

export const ORIGINAL_UNIVERSE_WAVE = Object.freeze(
  ORIGINAL_UNIVERSE_DEFINITIONS.map(world => {
    const runtimeStages = world.stages.map((stage, index) => makeRuntimeStage(world, stage, index));
    const ultimate = world.battleItems.find(item => item.tier === 'ultimate') || world.battleItems.at(-1);
    return Object.freeze({
      key: world.key,
      universe: world.universe,
      mediaType: world.mediaType,
      sourceType: 'original',
      isOriginal: true,
      originalContent: true,
      originalContentNotice: ORIGINAL_CONTENT_NOTICE,
      contentPackId: `original-world:${world.key}`,
      contentOrigin: 'oc',
      campaignDependency: 'originalCampaign',
      faction: world.faction,
      preferredMode: world.mode,
      campaignDifficulty: world.difficulty,
      mode: runtimeStages[0].mode,
      difficulty: runtimeStages[0].difficulty,
      title: world.title,
      desc: {
        fr: `${world.lore.origin.fr} ${world.lore.breach.fr}`,
        en: `${world.lore.origin.en} ${world.lore.breach.en}`
      },
      theme: world.lore.coreConflict.en,
      stageId: runtimeStages[0].id,
      stageName: runtimeStages[0].name,
      displayName: runtimeStages[0].displayName,
      bossName: runtimeStages[0].bossName,
      bossId: runtimeStages[0].bossId,
      hero: makeRuntimeHero(world.heroes[0]),
      allies: world.heroes.slice(1).map(makeRuntimeHero),
      monsters: world.enemies,
      bosses: world.bosses,
      worldBoss: world.worldBoss,
      gear: world.gear.map(gear => makeRuntimeGear(world, gear)),
      event: Object.freeze([
        ultimate.id,
        ultimate.name.en,
        ultimate.name.fr,
        ultimate.desc.en,
        ultimate.desc.fr,
        Object.freeze({
          ...ultimate,
          icon: world.audiovisual.itemIcons[ultimate.id],
          iconPrompt: `Entirely original ${world.title.en} event icon. No text or logo.`,
          visualAnchor: ultimate.desc,
          audit: 'original-oc',
          contentPackId: `original-world:${world.key}`,
          contentOrigin: 'oc',
          originalContent: true,
          originalContentNotice: ORIGINAL_CONTENT_NOTICE
        })
      ]),
      decor: {
        sky: world.visual.colors.sky,
        floor: world.visual.colors.floor,
        grid: world.visual.colors.grid,
        motif: world.visual.motif,
        accent: world.visual.colors.accent
      },
      stageVariants: runtimeStages.slice(1),
      ...runtimeStages[0],
      narrativeArc: world.narrativeArc,
      battleItems: world.battleItems,
      skins: world.skins,
      customUnlockables: world.customUnlockables,
      universeUnlockables: world.universeUnlockables,
      booster: world.booster,
      worldItems: world.worldItems,
      livingWorld: world.livingWorld,
      audiovisual: world.audiovisual,
      sensitivityNotes: world.sensitivityNotes
    });
  })
);

export const getOriginalUniverseDefinition = (universeOrKey) => (
  ORIGINAL_UNIVERSE_DEFINITIONS.find(world => (
    world.universe === universeOrKey || world.key === universeOrKey
  )) || null
);

export const getOriginalWorldBooster = (boosterId) => (
  ORIGINAL_WORLD_BOOSTERS.find(booster => booster.id === boosterId) || null
);
