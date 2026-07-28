const ORIGINAL_CONTENT_NOTICE = Object.freeze({
  en: 'Entirely original content created for Multiverse Breach.',
  fr: 'Contenu entièrement original créé pour Multiverse Breach.'
});

const ORIGINAL_UNIVERSE_IMAGE_ROOT = '/images/oc-worlds/v2';
const ORIGINAL_UNIVERSE_BOOSTER_ROOT = '/boosters/original-worlds/v2';
const ORIGINAL_UNIVERSE_IMAGE_CONTRACT = Object.freeze({
  version: 'v2',
  format: 'PNG',
  provider: 'OpenAI',
  interface: 'built-in image_gen',
  model: 'built-in/imagegen',
  planId: 'multiverse-breach-original-universes-openai-image-v2'
});

const UNLOCKABLE_KINDS = Object.freeze([
  'kart',
  'battleMusic',
  'stageMusic',
  'fieldSuper',
  'npcAssist',
  'koEffect',
  'portalEffect',
  'introPose',
  'victoryPose',
  'profileBanner',
  'profileTitle'
]);

const ITEM_ARCHETYPES = Object.freeze([
  ['consumable', 'Ration de terrain', 'Field Ration'],
  ['alternateWeapon', 'Arme de relève', 'Alternate Weapon'],
  ['armor', 'Armure de faction', 'Faction Armor'],
  ['accessory', 'Insigne d’ancrage', 'Anchor Insignia'],
  ['material', 'Matériau local', 'Local Material'],
  ['quest', 'Preuve de quête', 'Quest Evidence'],
  ['cursed', 'Relique instable', 'Unstable Relic'],
  ['healing', 'Soin spécialisé', 'Specialized Healing'],
  ['recipe', 'Recette d’artisanat', 'Crafting Recipe'],
  ['upgrade', 'Module d’amélioration', 'Upgrade Module'],
  ['set', 'Pièce d’ensemble', 'Set Piece'],
  ['legendary', 'Légendaire héroïque', 'Heroic Legendary']
]);

const asText = (value, fallback = '') => (
  typeof value === 'string'
    ? value
    : value?.fr || value?.en || fallback
);

const localized = (fr, en = fr) => Object.freeze({ fr, en });

const slugify = (value) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '_')
  .replace(/^_+|_+$/g, '');

const hashValue = (value) => String(value).split('').reduce(
  (total, char) => ((total * 33) + char.charCodeAt(0)) >>> 0,
  5381
);

const offset = (seed, index, spread = 80) => (
  ((seed >>> (index % 16)) % (spread * 2 + 1)) - spread
);

const point = (x, y, extra = {}) => Object.freeze({ x, y, ...extra });

function makeCommonStageGeometry(world, stage, stageIndex) {
  const seed = hashValue(`${world.key}:${stage.id}`);
  const items = world.battleItems || [];
  const enemies = world.enemies || [];
  const mission = world.narrativeArc?.missions?.[stageIndex];
  const nextMission = world.narrativeArc?.missions?.[Math.min(stageIndex + 1, 2)];

  return Object.freeze({
    coordinateSystem: stage.mode === 'Tactics' ? 'grid-cell' : 'world-pixel',
    cameraBounds: Object.freeze({
      left: -1080 + offset(seed, 1, 60),
      right: 1080 + offset(seed, 2, 60),
      top: -720,
      bottom: 690,
      zoomMin: 0.72,
      zoomMax: 1.18
    }),
    heroSpawns: Object.freeze([
      point(-460 + offset(seed, 3), 250, { slot: 0 }),
      point(-350 + offset(seed, 4), 315, { slot: 1 }),
      point(-250 + offset(seed, 5), 380, { slot: 2 })
    ]),
    enemySpawns: Object.freeze(enemies.map((enemy, index) => point(
      270 + index * 115 + offset(seed, index + 6, 42),
      245 + (index % 2) * 105,
      { slot: index, enemy: enemy.name }
    ))),
    bossSpawn: point(650 + offset(seed, 12, 55), 285, { boss: stage.boss }),
    lightCover: Object.freeze([
      point(-120 + offset(seed, 13), 315, { id: `${stage.id}:light:1`, hp: 70 }),
      point(245 + offset(seed, 14), 280, { id: `${stage.id}:light:2`, hp: 70 })
    ]),
    heavyCover: Object.freeze([
      point(65 + offset(seed, 15), 345, { id: `${stage.id}:heavy:1`, hp: 180 })
    ]),
    destructibles: Object.freeze([
      point(-45 + offset(seed, 16), 210, {
        id: `${stage.id}:destructible:1`,
        hp: 95,
        explosionRadius: 130,
        damage: 26
      }),
      point(430 + offset(seed, 17), 360, {
        id: `${stage.id}:destructible:2`,
        hp: 120,
        dropItemId: items[stageIndex % Math.max(1, items.length)]?.id || null
      })
    ]),
    deathZones: Object.freeze([
      Object.freeze({ id: `${stage.id}:death:floor`, x: -1200, y: 760, width: 2400, height: 220 })
    ]),
    checkpoints: Object.freeze([
      point(-610, 365, { id: `${stage.id}:checkpoint:start`, phase: 0 }),
      point(80, 330, { id: `${stage.id}:checkpoint:mid`, phase: 1 })
    ]),
    itemPlacements: Object.freeze(items.slice(0, 3).map((item, index) => point(
      -180 + index * 280 + offset(seed, 18 + index, 35),
      175 + (index % 2) * 95,
      { itemId: item.id, respawnSeconds: item.tier === 'pickup' ? 24 : null }
    ))),
    phaseTransitions: Object.freeze([
      Object.freeze({
        id: `${stage.id}:phase:opening`,
        trigger: 'encounter-start',
        objective: asText(mission, stage.objectiveType)
      }),
      Object.freeze({
        id: `${stage.id}:phase:escalation`,
        trigger: 'enemies-remaining<=2',
        objective: asText(nextMission, stage.objectiveType),
        cameraTarget: 'bossSpawn'
      }),
      Object.freeze({
        id: `${stage.id}:phase:finale`,
        trigger: 'boss-hp<=34%',
        objective: `Resolve ${stage.objectiveType}`,
        lockCheckpoint: true
      })
    ]),
    traps: Object.freeze([
      Object.freeze({
        id: `${stage.id}:trap:1`,
        x: 120 + offset(seed, 22, 130),
        y: 400,
        telegraphMs: 900,
        activeMs: 2200,
        cooldownMs: 6800,
        damage: 18 + stageIndex * 4,
        behavior: `${stage.objectiveType}:pulse`
      })
    ])
  });
}

function makeModeLayout(world, stage, stageIndex, common) {
  const seed = hashValue(`${stage.id}:layout`);

  if (stage.mode === 'Tactics') {
    return Object.freeze({
      type: 'tactics-grid',
      grid: Object.freeze({ columns: 12, rows: 9, tileSize: 72 }),
      heroSpawnCells: Object.freeze([[1, 3], [1, 4], [1, 5]]),
      enemySpawnCells: Object.freeze([[9, 2], [10, 3], [9, 5], [10, 6], [8, 4]]),
      bossSpawnCell: Object.freeze([10, 4]),
      objectiveCells: Object.freeze([
        [5 + (seed % 2), 2],
        [6, 4],
        [5, 6]
      ]),
      blockedCells: Object.freeze([[3, 1], [3, 7], [8, 1], [8, 7]]),
      elevationCells: Object.freeze([
        Object.freeze({ x: 4, y: 2, level: 1 }),
        Object.freeze({ x: 7, y: 6, level: 2 })
      ]),
      common
    });
  }

  if (stage.mode === 'Smash') {
    return Object.freeze({
      type: 'smash-arena',
      blastBounds: Object.freeze({ left: -1120, right: 1120, top: -780, bottom: 760 }),
      platforms: Object.freeze([
        Object.freeze({ id: `${stage.id}:platform:main`, x: -650, y: 430, width: 1300, height: 42, oneWay: false }),
        Object.freeze({ id: `${stage.id}:platform:left`, x: -510, y: 220, width: 330, height: 28, oneWay: true }),
        Object.freeze({ id: `${stage.id}:platform:right`, x: 180, y: 210, width: 360, height: 28, oneWay: true }),
        Object.freeze({
          id: `${stage.id}:platform:moving`,
          x: -120,
          y: 30,
          width: 260,
          height: 24,
          oneWay: true,
          motion: Object.freeze({ axis: seed % 2 ? 'x' : 'y', distance: 210, periodMs: 5200 })
        })
      ]),
      ledgeGrab: true,
      stockCount: 3,
      common
    });
  }

  return Object.freeze({
    type: 'rpg-arena',
    lanes: Object.freeze([
      Object.freeze({ id: 'front', y: 385, damageModifier: 1.08 }),
      Object.freeze({ id: 'middle', y: 285, damageModifier: 1 }),
      Object.freeze({ id: 'rear', y: 185, damageModifier: 0.92 })
    ]),
    turnAnchors: Object.freeze([
      point(-420, 330, { team: 'hero', slot: 0 }),
      point(-320, 245, { team: 'hero', slot: 1 }),
      point(-220, 160, { team: 'hero', slot: 2 }),
      point(330, 245, { team: 'enemy', slot: 0 }),
      point(480, 330, { team: 'enemy', slot: 1 })
    ]),
    atbSpeedScale: 1 + (stageIndex * 0.05),
    common
  });
}

export function buildStageProduction(world, stage, stageIndex) {
  const common = makeCommonStageGeometry(world, stage, stageIndex);
  return Object.freeze({
    id: stage.id,
    stageKey: stage.stageKey || stage.id,
    layoutVersion: 2,
    setting: stage.setting,
    objectiveType: stage.objectiveType,
    layout: makeModeLayout(world, stage, stageIndex, common),
    runtimeRules: Object.freeze({
      win: `${stage.objectiveType}:complete`,
      loss: 'all-heroes-ko',
      checkpointPolicy: stage.mode === 'RPG' ? 'phase' : 'encounter',
      itemPolicy: 'manifest-world-only',
      friendlyFire: false
    })
  });
}

function makeTalentTree(hero) {
  const skillNames = [
    hero.simple?.name,
    hero.secondary?.name,
    hero.defense?.name,
    hero.special?.name
  ].filter(Boolean);
  const branchNames = ['Maîtrise', 'Survie', 'Résonance'];

  return Object.freeze(branchNames.map((branch, branchIndex) => Object.freeze({
    id: `${hero.id}:talent:${slugify(branch)}`,
    name: localized(`${branch} — ${skillNames[branchIndex] || hero.name}`),
    nodes: Object.freeze([0, 1, 2].map((nodeIndex) => Object.freeze({
      id: `${hero.id}:talent:${branchIndex + 1}:${nodeIndex + 1}`,
      rank: nodeIndex + 1,
      cost: nodeIndex + 1,
      unlockLevel: 2 + branchIndex * 2 + nodeIndex * 3,
      effect: Object.freeze({
        damagePercent: branchIndex === 0 ? 4 + nodeIndex * 3 : 0,
        guardPercent: branchIndex === 1 ? 5 + nodeIndex * 4 : 0,
        cooldownPercent: branchIndex === 2 ? 3 + nodeIndex * 3 : 0
      })
    })))
  })));
}

export function buildHeroProduction(world, hero, heroIndex) {
  const color = hero.primaryColor || world.visual?.colors?.accent || '#39c5bb';
  const simple = hero.simple?.name || `${hero.name} Strike`;
  const secondary = hero.secondary?.name || `${hero.name} Technique`;
  const defense = hero.defense?.name || `${hero.name} Guard`;
  const special = hero.special?.name || `${hero.name} Origin Burst`;

  return Object.freeze({
    passive: Object.freeze({
      id: `${hero.id}:passive`,
      name: localized(`Instinct — ${hero.combatRole || hero.name}`),
      trigger: heroIndex === 0 ? 'perfect-dodge' : heroIndex === 1 ? 'guard-break' : 'ally-hp<=35%',
      effect: Object.freeze({ charge: 10 + heroIndex * 3, durationMs: 4200, powerPercent: 8 + heroIndex * 2 })
    }),
    talentTree: makeTalentTree(hero),
    allyAi: Object.freeze({
      role: hero.combatRole,
      preferredRange: hero.category === 'slayer' ? 95 : hero.category === 'marine' ? 360 : 260,
      targetPriority: heroIndex === 0 ? 'controller' : heroIndex === 1 ? 'lowest-hp' : 'ally-threat',
      retreatHpRatio: 0.24 + heroIndex * 0.04,
      specialUse: 'boss-vulnerable-or-three-targets',
      revivePriority: heroIndex === 2 ? 1 : 0.55
    }),
    modeKits: Object.freeze({
      Smash: Object.freeze({
        groundCombo: Object.freeze([
          Object.freeze({ input: 'neutral', move: simple, frameStart: 5, frameEnd: 11, damage: 4.5 }),
          Object.freeze({ input: 'neutral', move: `${simple} II`, frameStart: 13, frameEnd: 19, damage: 5.5 }),
          Object.freeze({ input: 'neutral', move: secondary, frameStart: 22, frameEnd: 32, damage: 9.5 })
        ]),
        aerials: Object.freeze([
          Object.freeze({ input: 'air-neutral', move: `${simple} aérien`, damage: 7, knockback: 210 }),
          Object.freeze({ input: 'air-down', move: `${secondary} plongeant`, damage: 9, knockback: 285 })
        ]),
        grabs: Object.freeze([
          Object.freeze({ input: 'grab-forward', move: `${hero.name} projection`, damage: 6, knockback: 250 }),
          Object.freeze({ input: 'grab-down', move: `${hero.name} verrou`, damage: 4, stunMs: 650 })
        ]),
        directionalDodges: Object.freeze(['left', 'right', 'up', 'down'].map((direction, index) => Object.freeze({
          direction,
          invulnerableFrames: Object.freeze([3 + index % 2, 10 + index % 2]),
          distance: direction === 'up' || direction === 'down' ? 105 : 165
        }))),
        chargedVariants: Object.freeze([
          Object.freeze({ move: secondary, chargeMs: 850, damageMultiplier: 1.55 }),
          Object.freeze({ move: special, chargeMs: 1450, damageMultiplier: 1.85 })
        ])
      }),
      RPG: Object.freeze({
        commands: Object.freeze([
          Object.freeze({ move: simple, atbCost: 35 }),
          Object.freeze({ move: secondary, atbCost: 65, cooldownTurns: 2 }),
          Object.freeze({ move: defense, atbCost: 45, durationTurns: 1 }),
          Object.freeze({ move: special, atbCost: 100, requiresLimit: true })
        ]),
        formationPreference: heroIndex === 1 ? 'front' : heroIndex === 2 ? 'rear' : 'middle'
      }),
      Tactics: Object.freeze({
        actionPoints: 2,
        movePoints: 5 + Math.min(2, hero.stats?.spd || 0) % 3,
        attackRange: hero.category === 'slayer' ? 1 : hero.category === 'marine' ? 5 : 4,
        overwatch: hero.category === 'marine' || hero.category === 'tactical',
        zoneSkill: special,
        reaction: defense
      })
    }),
    hitboxes: Object.freeze({
      simple: Object.freeze({ x: 28, y: 18, width: 58, height: 42, activeFrames: Object.freeze([5, 11]) }),
      secondary: Object.freeze({ x: 34, y: 10, width: 88, height: 64, activeFrames: Object.freeze([12, 24]) }),
      special: Object.freeze({ x: -165, y: -165, width: 330, height: 330, activeFrames: Object.freeze([31, 58]) }),
      hurtbox: Object.freeze({ x: -18, y: -62, width: 36, height: 62 })
    }),
    animations: Object.freeze({
      RPG: Object.freeze(['idle', 'command', 'cast', 'guard', 'hit', 'ko', 'victory']),
      Tactics: Object.freeze(['idle-grid', 'move-grid', 'attack-grid', 'reaction-grid', 'ko-grid']),
      Smash: Object.freeze(['idle', 'run', 'jump', 'fall', 'jab-1', 'jab-2', 'aerial', 'grab', 'dodge', 'special', 'ko']),
      FPS: Object.freeze(['hands-idle', 'weapon-fire', 'weapon-reload', 'ability', 'hit-overlay']),
      Kart: Object.freeze(['driver-idle', 'steer-left', 'steer-right', 'boost', 'hit', 'victory'])
    }),
    audiovisual: Object.freeze({
      portrait: `${ORIGINAL_UNIVERSE_IMAGE_ROOT}/${world.key}/heroes/${hero.id}.png`,
      palette: Object.freeze([color, hero.secondaryColor || color, hero.weaponColor || color]),
      voiceCuePrefix: `oc.${world.key}.${hero.id}`,
      vfxCuePrefix: `oc.${world.key}.${hero.id}.vfx`
    })
  });
}

export function buildEnemyProduction(world, enemy, enemyIndex) {
  const enemyId = `${world.key}:${slugify(enemy.name)}`;
  const signature = asText(enemy.signature, enemy.name);
  const role = enemy.combatRole || 'skirmisher';

  return Object.freeze({
    id: enemyId,
    detectionDistance: 420 + enemyIndex * 55,
    leashDistance: 820 + enemyIndex * 40,
    targetPriorities: Object.freeze(
      role === 'assassin'
        ? ['highest-special', 'lowest-hp', 'nearest']
        : role === 'support'
          ? ['damaged-ally', 'controller', 'nearest']
          : ['nearest', 'lowest-guard', 'objective-holder']
    ),
    cooldownsMs: Object.freeze({ primary: 1700 + enemyIndex * 120, signature: 6200 - enemyIndex * 180, dodge: 4100 }),
    telegraph: Object.freeze({ text: signature, anticipationMs: 650 + enemyIndex * 90, color: enemy.color }),
    resistances: Object.freeze(role === 'tank' ? ['stagger', 'knockback'] : role === 'controller' ? ['glitch', 'silence'] : ['minor-stagger']),
    weaknesses: Object.freeze(role === 'tank' ? ['armor-break'] : role === 'assassin' ? ['reveal', 'area-control'] : ['interrupt']),
    groupBehavior: Object.freeze({
      formation: role === 'support' ? 'rear-link' : role === 'swarm' ? 'surround' : 'wedge',
      assistRadius: 260 + enemyIndex * 25,
      fallbackWhenAlone: role === 'assassin' ? 'cloak-and-reengage' : 'guard-objective'
    }),
    stateMachine: Object.freeze({
      initial: 'patrol',
      states: Object.freeze({
        patrol: Object.freeze({ on: Object.freeze({ 'target-detected': 'engage', 'ally-alert': 'investigate' }) }),
        investigate: Object.freeze({ timeoutMs: 2600, on: Object.freeze({ 'target-visible': 'engage', timeout: 'patrol' }) }),
        engage: Object.freeze({ action: 'role-primary', on: Object.freeze({ 'signature-ready': 'telegraph', 'hp<=25%': 'desperate' }) }),
        telegraph: Object.freeze({ action: signature, on: Object.freeze({ complete: 'recover', interrupted: 'staggered' }) }),
        recover: Object.freeze({ timeoutMs: 900, on: Object.freeze({ timeout: 'engage' }) }),
        staggered: Object.freeze({ timeoutMs: 1200, on: Object.freeze({ timeout: 'engage' }) }),
        desperate: Object.freeze({ action: `${role}:desperate`, on: Object.freeze({ 'target-lost': 'guard-objective' }) }),
        'guard-objective': Object.freeze({ action: 'hold-position', on: Object.freeze({ 'target-visible': 'engage' }) })
      })
    }),
    modeResponses: Object.freeze({
      RPG: Object.freeze({ initiative: 30 + (enemy.spd || 4) * 6, actionRule: `${role}:turn` }),
      Tactics: Object.freeze({ actionPoints: role === 'swarm' ? 3 : 2, preferredCover: role === 'tank' ? 'heavy' : 'light' }),
      Smash: Object.freeze({ recoveryPriority: role === 'assassin' ? 'ledge-deny' : 'center-stage', launchResistance: enemy.def || 4 })
    }),
    difficultyVariants: Object.freeze({
      Medium: Object.freeze({ hp: 1, damage: 1, cooldown: 1 }),
      Hard: Object.freeze({ hp: 1.18, damage: 1.12, cooldown: 0.92 }),
      'Very Hard': Object.freeze({ hp: 1.38, damage: 1.24, cooldown: 0.84 }),
      Expert: Object.freeze({ hp: 1.62, damage: 1.38, cooldown: 0.76, extraBehavior: 'coordinated-signature' })
    })
  });
}

export function buildBossProduction(world, boss, bossIndex, isWorldBoss = false) {
  const bossId = `${world.key}:${slugify(boss.name)}`;
  const phaseCount = isWorldBoss ? 4 : 3;
  const enemies = world.enemies || [];
  const special = asText(boss.special, boss.name);

  return Object.freeze({
    id: bossId,
    isWorldBoss,
    entryCinematic: Object.freeze({
      durationMs: isWorldBoss ? 6200 : 3800,
      shots: Object.freeze([
        Object.freeze({ atMs: 0, camera: 'stage-wide', cue: `oc.${bossId}.arrival` }),
        Object.freeze({ atMs: 900, camera: 'boss-close', subtitle: special }),
        Object.freeze({ atMs: isWorldBoss ? 4600 : 2600, camera: 'hero-reaction', cue: `oc.${bossId}.challenge` })
      ])
    }),
    phases: Object.freeze(Array.from({ length: phaseCount }, (_, phaseIndex) => {
      const threshold = Number((1 - phaseIndex / phaseCount).toFixed(2));
      const summon = enemies[(bossIndex + phaseIndex) % Math.max(1, enemies.length)]?.name || null;
      return Object.freeze({
        id: `${bossId}:phase:${phaseIndex + 1}`,
        hpThreshold: threshold,
        attackOrder: Object.freeze([
          `${special} — ouverture ${phaseIndex + 1}`,
          `${boss.name} pression ${phaseIndex + 1}`,
          `${world.narrativeArc?.id || world.key} rupture ${phaseIndex + 1}`
        ]),
        vulnerabilityWindow: Object.freeze({
          trigger: phaseIndex % 2 ? 'signature-interrupted' : 'attack-chain-complete',
          durationMs: Math.max(1800, 3600 - phaseIndex * 420),
          damageMultiplier: Number((1.18 + phaseIndex * 0.12).toFixed(2))
        }),
        summon: phaseIndex === 0 ? null : Object.freeze({ enemy: summon, count: Math.min(3, phaseIndex + 1) }),
        transition: Object.freeze({
          invulnerableMs: 900,
          camera: 'boss-close',
          arenaMutation: `${world.visual?.motif || 'breach'}:${phaseIndex + 1}`
        })
      });
    })),
    rage: Object.freeze({
      hpThreshold: 0.18,
      damageMultiplier: isWorldBoss ? 1.55 : 1.35,
      speedMultiplier: 1.18,
      disablesCheckpoint: true
    }),
    performanceRewards: Object.freeze([
      Object.freeze({ condition: 'no-hero-ko', rewardId: `archive:${bossId}:flawless` }),
      Object.freeze({ condition: 'interrupt-all-signatures', rewardId: `title:${bossId}:breaker` }),
      Object.freeze({ condition: 'expert-clear', rewardId: `skin:${bossId}:authorless` })
    ]),
    modeAdaptations: Object.freeze({
      RPG: Object.freeze({ phaseOnTurnBoundary: true, breakGauge: 100 + bossIndex * 15 }),
      Tactics: Object.freeze({ footprint: isWorldBoss ? [3, 3] : [2, 2], reactionAttacks: 1 + bossIndex % 2 }),
      Smash: Object.freeze({ stockPhases: phaseCount, superArmorFrames: 12 + bossIndex * 3 })
    })
  });
}

export function buildWorldItemCatalog(world) {
  const stageNames = world.stages.map(stage => asText(stage.name, stage.id));
  const heroNames = world.heroes.map(hero => hero.name);
  const bossNames = world.bosses.map(boss => boss.name);

  return Object.freeze(ITEM_ARCHETYPES.map(([type, frType, enType], index) => {
    const subject = [
      stageNames[index % stageNames.length],
      heroNames[index % heroNames.length],
      bossNames[index % bossNames.length]
    ][index % 3];
    return Object.freeze({
      id: `${world.key}:world-item:${type}`,
      universe: world.universe,
      sourceType: 'original',
      type,
      rarityId: index === ITEM_ARCHETYPES.length - 1 ? 'anomaly' : index >= 8 ? 'epic' : index >= 3 ? 'rare' : 'common',
      name: localized(`${frType} — ${subject}`, `${subject} ${enType}`),
      desc: localized(
        `${frType} propre à ${world.title.fr}, lié à ${subject} et à son économie locale.`,
        `${enType} native to ${world.title.en}, tied to ${subject} and its local economy.`
      ),
      acquisition: index < 3 ? 'merchant' : index < 6 ? 'exploration' : index < 9 ? 'crafting' : 'arc-reward',
      upgradePath: Object.freeze([1, 2, 3].map(rank => Object.freeze({
        rank,
        materialId: `${world.key}:material:${(index + rank) % 4}`,
        cost: 60 * rank + index * 8
      }))),
      heroExclusiveId: type === 'legendary' ? world.heroes[0]?.id : null
    });
  }));
}

export function buildLivingWorld(world) {
  const title = world.title.fr;
  const stageNames = world.stages.map(stage => asText(stage.name, stage.id));
  const heroNames = world.heroes.map(hero => hero.name);
  const enemyNames = world.enemies.map(enemy => enemy.name);
  const conflict = asText(world.lore?.coreConflict, asText(world.lore?.breach, title));

  return Object.freeze({
    locations: Object.freeze([
      ...world.stages.map((stage, index) => Object.freeze({
        id: `${world.key}:location:${stage.stageKey || stage.id}`,
        name: stage.name,
        type: index === 0 ? 'city' : index === 1 ? 'region' : 'sanctum',
        dailyUse: asText(stage.setting),
        connectedTo: stageNames[(index + 1) % stageNames.length]
      })),
      Object.freeze({
        id: `${world.key}:location:anchor_village`,
        name: localized(`Relais des Ancres de ${title}`, `${world.title.en} Anchor Relay`),
        type: 'village',
        dailyUse: `Refuge civil, atelier, marché et point de dialogue relié à ${stageNames[0]}.`
      })
    ]),
    population: Object.freeze({
      inhabitants: Object.freeze(heroNames),
      neutralCreatures: Object.freeze([
        `${title} — familier des routes`,
        `${title} — veilleur pacifique`,
        `${title} — bête de bât`
      ]),
      supportNpcs: Object.freeze([
        Object.freeze({ id: `${world.key}:npc:merchant`, role: 'merchant', name: `Intendant de ${stageNames[0]}` }),
        Object.freeze({ id: `${world.key}:npc:healer`, role: 'healer', name: `Soigneur du Relais ${title}` }),
        Object.freeze({ id: `${world.key}:npc:archivist`, role: 'archivist', name: `Témoin de ${stageNames[2]}` })
      ]),
      leaders: Object.freeze([heroNames[0], world.bosses[0]?.name].filter(Boolean))
    }),
    society: Object.freeze({
      minorFactions: Object.freeze([
        `${title} — Ligue des Routes`,
        `${title} — Cercle des Artisans`,
        `${title} — Veilleurs du Seuil`
      ]),
      beliefs: Object.freeze([
        `Mémoire rituelle de ${stageNames[0]}`,
        `Serment de protection lié à ${world.narrativeArc?.id}`
      ]),
      professions: Object.freeze(['guide de Trame', 'artisan local', 'soigneur', 'messager', 'gardien de seuil']),
      resources: Object.freeze([
        `${world.visual?.motif || 'Trame'} raffiné`,
        `fragment de ${stageNames[1]}`,
        `sceau de ${heroNames[0]}`
      ]),
      economy: Object.freeze({
        currency: `marque de ${title}`,
        exports: Object.freeze(['outils spécialisés', 'archives de Trame']),
        imports: Object.freeze(['stabilisateurs A.R.C.A.', 'soins du Nexus'])
      }),
      architecture: `${asText(world.lore?.origin, title)} Architecture quotidienne adaptée au motif ${world.visual?.motif}.`,
      food: Object.freeze([`ration de ${stageNames[0]}`, `infusion de ${title}`, `pain du Relais des Ancres`]),
      vehicles: Object.freeze([`coursier de ${title}`, `transport de ${stageNames[1]}`])
    }),
    ecology: Object.freeze({
      flora: Object.freeze([`${title} — plante de seuil`, `${title} — mousse de faille`, `${title} — arbre-témoin`]),
      fauna: Object.freeze([`${title} — porteur`, `${title} — prédateur nocturne`, `${title} — pollinisateur`]),
      threats: Object.freeze(enemyNames)
    }),
    dialogues: Object.freeze(world.heroes.map((hero, index) => Object.freeze({
      id: `${world.key}:dialogue:${hero.id}:relay`,
      speaker: hero.name,
      location: stageNames[index % stageNames.length],
      line: `${hero.loreRole || hero.combatRole} Ici, notre priorité reste : ${conflict}`
    }))),
    sideQuests: Object.freeze(world.stages.map((stage, index) => Object.freeze({
      id: `${world.key}:sidequest:${index + 1}`,
      title: localized(`Les oubliés de ${asText(stage.name)}`),
      giver: heroNames[index % heroNames.length],
      objective: `Résoudre un incident ${stage.objectiveType} sans déstabiliser ${asText(stage.setting)}.`,
      rewardItemId: `${world.key}:world-item:${ITEM_ARCHETYPES[(index + 3) % ITEM_ARCHETYPES.length][0]}`
    }))),
    randomEvents: Object.freeze([
      Object.freeze({ id: `${world.key}:event:merchant`, chance: 0.22, effect: 'temporary-merchant-discount' }),
      Object.freeze({ id: `${world.key}:event:breach`, chance: 0.18, effect: 'enemy-patrol-plus-rare-material' }),
      Object.freeze({ id: `${world.key}:event:refugees`, chance: 0.16, effect: 'escort-civilians-to-anchor-relay' }),
      Object.freeze({ id: `${world.key}:event:festival`, chance: 0.1, effect: 'world-lore-dialogue-and-cosmetic-token' })
    ]),
    codexEntries: Object.freeze([
      Object.freeze({ id: `${world.key}:codex:origin`, title: localized(`Origine — ${title}`), body: world.lore?.origin }),
      Object.freeze({ id: `${world.key}:codex:breach`, title: localized(`Brèche — ${title}`), body: world.lore?.breach }),
      Object.freeze({ id: `${world.key}:codex:conflict`, title: localized(`Conflit — ${title}`), body: world.lore?.coreConflict }),
      Object.freeze({ id: `${world.key}:codex:society`, title: localized(`Vie quotidienne — ${title}`), body: localized(`Les habitants organisent leurs routes, métiers et rites autour de ${stageNames.join(', ')}.`) })
    ]),
    heroRelationships: Object.freeze(world.heroes.flatMap((hero, heroIndex) => (
      world.heroes.slice(heroIndex + 1).map(other => Object.freeze({
        id: `${world.key}:relationship:${hero.id}:${other.id}`,
        heroes: Object.freeze([hero.id, other.id]),
        bond: `${hero.combatRole} complète ${other.combatRole}`,
        gameplayBonus: Object.freeze({ assistChargePercent: 6 + heroIndex * 2 })
      }))
    )))
  });
}

export function buildUniverseUnlockables(world) {
  const stage = world.stages[2] || world.stages[0];
  const hero = world.heroes[0];
  const ally = world.heroes[1] || hero;
  const boss = world.worldBoss;
  const motif = world.visual?.motif || world.key;
  const color = world.visual?.colors?.accent || world.booster?.color || '#39c5bb';
  const universe = world.universe;
  const stageName = asText(stage?.name, universe);
  const specialName = hero?.special?.name || hero?.name || universe;
  const bossSpecial = asText(boss?.special, boss?.name || universe);
  const rarityPattern = Object.freeze([
    'common', 'common', 'common', 'common', 'common',
    'rare', 'rare', 'rare', 'rare',
    'epic', 'epic'
  ]);
  const names = {
    kart: localized(`Coursier du seuil — ${stageName}`, `${stageName} Threshold Runner`),
    battleMusic: localized(`Insurrection — ${specialName}`, `Insurrection — ${specialName}`),
    stageMusic: localized(`Veille de ${stageName}`, `${stageName} Vigil`),
    fieldSuper: localized(specialName, specialName),
    npcAssist: localized(`Renfort — ${ally?.name}`, `Assist — ${ally?.name}`),
    koEffect: localized(`K.-O. — ${bossSpecial}`, `K.O. — ${bossSpecial}`),
    portalEffect: localized(`Portail ${motif} — ${stageName}`, `${stageName} ${motif} Portal`),
    introPose: localized(`Entrée — ${hero?.simple?.name || hero?.name}`, `Entrance — ${hero?.simple?.name || hero?.name}`),
    victoryPose: localized(`Victoire — ${hero?.defense?.name || hero?.name}`, `Victory — ${hero?.defense?.name || hero?.name}`),
    profileBanner: localized(`Bannière — ${world.title.fr}`, `${world.title.en} Banner`),
    profileTitle: localized(`Ancre de ${world.title.fr}`, `${world.title.en} Anchor`)
  };

  return Object.freeze(Object.fromEntries(UNLOCKABLE_KINDS.map((kind, index) => {
    const kebabKind = kind.replace(/[A-Z]/g, char => `-${char.toLowerCase()}`);
    const id = `${kebabKind}:${universe}`;
    const animation = Object.freeze({
      key: `oc.${world.key}.unlockable.${kind}`,
      durationMs: 900 + index * 85,
      easing: index % 2 ? 'ease-out' : 'ease-in-out',
      motif
    });
    return [kind, Object.freeze({
      id,
      kind,
      universe,
      color,
      rarityId: rarityPattern[index],
      name: names[kind],
      desc: kind === 'kart'
        ? localized(
            `Chassis cosmetique original de ${world.title.fr}, conçu autour de ${stageName}. Les performances restent gérées par le garage.`,
            `Original cosmetic ${world.title.en} chassis designed around ${stageName}. Performance remains governed by garage upgrades.`
          )
        : localized(
            `Récompense originale de ${world.title.fr}, conçue autour de ${stageName} et de ${world.narrativeArc?.title?.fr}.`,
            `Original ${world.title.en} reward designed around ${stageName} and its universe arc.`
          ),
      animation,
      visual: Object.freeze({ motif, color, stageKey: stage?.stageKey || stage?.id }),
      data: Object.freeze({
        sourceArc: world.narrativeArc?.id,
        heroId: hero?.id,
        allyId: ally?.id,
        boss: boss?.name,
        stageKey: stage?.stageKey || stage?.id
      })
    })];
  })));
}

export function buildAudiovisualContract(world) {
  return Object.freeze({
    imageContract: ORIGINAL_UNIVERSE_IMAGE_CONTRACT,
    boosterArt: `${ORIGINAL_UNIVERSE_BOOSTER_ROOT}/${world.key}.png`,
    backdrop: `${ORIGINAL_UNIVERSE_IMAGE_ROOT}/${world.key}/backdrop.png`,
    stageCards: Object.freeze(Object.fromEntries(world.stages.map(stage => [
      stage.stageKey || stage.id,
      `${ORIGINAL_UNIVERSE_IMAGE_ROOT}/${world.key}/stages/${stage.stageKey || stage.id}.png`
    ]))),
    heroPortraits: Object.freeze(Object.fromEntries(world.heroes.map(hero => [
      hero.id,
      `${ORIGINAL_UNIVERSE_IMAGE_ROOT}/${world.key}/heroes/${hero.id}.png`
    ]))),
    threatPortraits: Object.freeze(Object.fromEntries([
      ...world.enemies,
      ...world.bosses,
      world.worldBoss
    ].map(threat => [
      threat.name,
      `${ORIGINAL_UNIVERSE_IMAGE_ROOT}/${world.key}/threats/${slugify(threat.name)}.png`
    ]))),
    itemIcons: Object.freeze(Object.fromEntries([
      ...world.gear,
      ...world.battleItems
    ].map(item => [
      item.id,
      `${ORIGINAL_UNIVERSE_IMAGE_ROOT}/${world.key}/items/${item.id}.png`
    ]))),
    vfx: Object.freeze({
      portal: `oc.${world.key}.vfx.portal`,
      ko: `oc.${world.key}.vfx.ko`,
      worldBoss: `oc.${world.key}.vfx.world-boss`
    }),
    music: Object.freeze({
      grid: Object.freeze({ cue: `oc.${world.key}.music.grid`, brief: `Original ambient theme for ${world.title.en}; motif ${world.visual?.motif}.` }),
      battle: Object.freeze({ cue: `oc.${world.key}.music.battle`, brief: `Original combat arrangement for ${world.title.en}; no franchise quotation.` }),
      boss: Object.freeze({ cue: `oc.${world.key}.music.boss`, brief: `Original multi-phase boss score for ${world.worldBoss?.name}.` })
    }),
    ambience: Object.freeze([
      `oc.${world.key}.ambience.settlement`,
      `oc.${world.key}.ambience.wilderness`,
      `oc.${world.key}.ambience.final-stage`
    ]),
    soundCues: Object.freeze({
      weapons: Object.freeze(world.heroes.map(hero => `oc.${world.key}.sfx.weapon.${hero.id}`)),
      bossCries: Object.freeze(world.bosses.map(boss => `oc.${world.key}.sfx.boss.${slugify(boss.name)}`)),
      ui: `oc.${world.key}.sfx.hud`
    })
  });
}

export function completeOriginalUniverseProduction(world) {
  const audiovisual = buildAudiovisualContract(world);
  const stages = Object.freeze(world.stages.map((stage, index) => Object.freeze({
    ...stage,
    production: buildStageProduction(world, stage, index),
    stageArt: audiovisual.stageCards[stage.stageKey || stage.id]
  })));
  const heroes = Object.freeze(world.heroes.map((hero, index) => Object.freeze({
    ...hero,
    production: buildHeroProduction(world, hero, index),
    portrait: audiovisual.heroPortraits[hero.id]
  })));
  const enemies = Object.freeze(world.enemies.map((enemy, index) => {
    const production = buildEnemyProduction(world, enemy, index);
    return Object.freeze({
      ...enemy,
      production,
      id: production.id,
      portrait: audiovisual.threatPortraits[enemy.name]
    });
  }));
  const bosses = Object.freeze(world.bosses.map((boss, index) => {
    const production = buildBossProduction(world, boss, index, false);
    return Object.freeze({
      ...boss,
      production,
      id: production.id,
      portrait: audiovisual.threatPortraits[boss.name]
    });
  }));
  const worldBossProduction = buildBossProduction(world, world.worldBoss, 0, true);
  const worldBoss = Object.freeze({
    ...world.worldBoss,
    production: worldBossProduction,
    id: worldBossProduction.id,
    portrait: audiovisual.threatPortraits[world.worldBoss.name]
  });
  const completedWorld = {
    ...world,
    sourceType: 'original',
    isOriginal: true,
    originalContent: true,
    originalContentNotice: ORIGINAL_CONTENT_NOTICE,
    stages,
    heroes,
    enemies,
    bosses,
    worldBoss,
    worldItems: buildWorldItemCatalog(world),
    livingWorld: buildLivingWorld(world),
    audiovisual
  };

  return Object.freeze({
    ...completedWorld,
    universeUnlockables: buildUniverseUnlockables(completedWorld)
  });
}

export {
  ORIGINAL_CONTENT_NOTICE,
  ORIGINAL_UNIVERSE_IMAGE_CONTRACT,
  UNLOCKABLE_KINDS
};
