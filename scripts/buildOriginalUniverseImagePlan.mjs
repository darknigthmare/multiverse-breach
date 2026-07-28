import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = path.resolve(SCRIPT_DIRECTORY, '..');
const DEFAULT_SOURCE = path.join(REPOSITORY_ROOT, 'src', 'game', 'originalUniversesManifest.json');
const DEFAULT_OUTPUT = path.join(
  REPOSITORY_ROOT,
  'docs',
  'original-universes',
  'openai-image-v2-plan.json'
);
const DEFAULT_REMEDIATION = path.join(
  REPOSITORY_ROOT,
  'docs',
  'original-universes',
  'cultural-remediation-v3.json'
);
const SAFE_SEGMENT = /^[a-z0-9][a-z0-9_-]*$/i;
const EXPECTED_WORLD_COUNT = 20;
const EXPECTED_PER_WORLD = Object.freeze({
  booster: 1,
  backdrop: 1,
  stage: 3,
  hero: 3,
  enemy: 5,
  boss: 3,
  worldBoss: 1,
  gear: 3,
  battleItem: 5
});
const EXPECTED_TOTALS = Object.freeze(
  Object.fromEntries(
    Object.entries(EXPECTED_PER_WORLD).map(([kind, count]) => [
      kind,
      count * EXPECTED_WORLD_COUNT
    ])
  )
);
const EXPECTED_JOB_COUNT = Object.values(EXPECTED_TOTALS)
  .reduce((total, count) => total + count, 0);

function parseArguments(argv) {
  const options = {
    source: DEFAULT_SOURCE,
    out: DEFAULT_OUTPUT,
    remediation: DEFAULT_REMEDIATION,
    check: false,
    help: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--source') {
      options.source = path.resolve(REPOSITORY_ROOT, argv[index + 1] || '');
      index += 1;
    } else if (argument === '--out') {
      options.out = path.resolve(REPOSITORY_ROOT, argv[index + 1] || '');
      index += 1;
    } else if (argument === '--remediation') {
      options.remediation = path.resolve(REPOSITORY_ROOT, argv[index + 1] || '');
      index += 1;
    } else if (argument === '--check') {
      options.check = true;
    } else if (argument === '--help' || argument === '-h') {
      options.help = true;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  return options;
}

function printHelp() {
  console.log([
    'Usage: node scripts/buildOriginalUniverseImagePlan.mjs [options]',
    '',
    'Options:',
    '  --source <file>  Original-universe source manifest',
    '  --out <file>     Deterministic OpenAI Image plan destination',
    '  --remediation <file>  Reviewed per-asset cultural guardrails',
    '  --check          Verify that the saved plan exactly matches the source',
    '  --help           Show this help'
  ].join('\n'));
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function quote(value) {
  return JSON.stringify(String(value));
}

function cleanString(value, label) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label} must be a non-empty string.`);
  }
  return value.replace(/\s+/g, ' ').trim();
}

function requireArray(value, label, expectedLength) {
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array.`);
  }
  if (Number.isInteger(expectedLength) && value.length !== expectedLength) {
    throw new Error(`${label} must contain exactly ${expectedLength} entries; found ${value.length}.`);
  }
  return value;
}

function safeSegment(value, label) {
  const segment = cleanString(value, label);
  if (!SAFE_SEGMENT.test(segment)) {
    throw new Error(`${label} is not a safe path segment: ${JSON.stringify(value)}.`);
  }
  return segment;
}

function slugify(value, label) {
  const slug = cleanString(value, label)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return safeSegment(slug, label);
}

function localized(value, pointer, label) {
  if (typeof value === 'string' && value.trim()) {
    return { value: cleanString(value, label), pointer };
  }
  if (value && typeof value === 'object') {
    for (const language of ['fr', 'en']) {
      if (typeof value[language] === 'string' && value[language].trim()) {
        return {
          value: cleanString(value[language], `${label}.${language}`),
          pointer: `${pointer}/${language}`
        };
      }
    }
  }
  throw new Error(`${label} must contain localized text.`);
}

function scalarFact(value, pointer, label) {
  if (value === undefined || value === null || value === '') {
    throw new Error(`${label} is required.`);
  }
  return {
    value: typeof value === 'string'
      ? cleanString(value, label)
      : JSON.stringify(value),
    pointer
  };
}

function uniquePointers(references) {
  return [...new Set(references.map(reference => reference.pointer))];
}

function worldContext(world, worldPointer) {
  const universe = scalarFact(world.universe, `${worldPointer}/universe`, `${world.key}.universe`);
  const origin = localized(
    world.lore?.origin,
    `${worldPointer}/lore/origin`,
    `${world.key}.lore.origin`
  );
  const breach = localized(
    world.lore?.breach,
    `${worldPointer}/lore/breach`,
    `${world.key}.lore.breach`
  );
  const conflict = localized(
    world.lore?.coreConflict,
    `${worldPointer}/lore/coreConflict`,
    `${world.key}.lore.coreConflict`
  );
  const motif = scalarFact(
    world.visual?.motif,
    `${worldPointer}/visual/motif`,
    `${world.key}.visual.motif`
  );
  const colors = scalarFact(
    world.visual?.colors,
    `${worldPointer}/visual/colors`,
    `${world.key}.visual.colors`
  );
  const sensitivity = requireArray(
    world.sensitivityNotes ?? [],
    `${world.key}.sensitivityNotes`
  ).map((note, noteIndex) => scalarFact(
    note,
    `${worldPointer}/sensitivityNotes/${noteIndex}`,
    `${world.key}.sensitivityNotes[${noteIndex}]`
  ));

  return {
    universe,
    origin,
    breach,
    conflict,
    motif,
    colors,
    sensitivity,
    references: [universe, origin, breach, conflict, motif, colors, ...sensitivity]
  };
}

function modeComposition(mode) {
  if (mode === 'Smash') {
    return 'wide side-on arena view at a playable 2.5D angle; clearly separated main floor, platforms, ledges, traversal routes and lore-supported hazards; readable silhouettes and open combat space';
  }
  if (mode === 'Tactics') {
    return 'elevated three-quarter tactical view; terrain naturally divided into readable movement cells, cover lanes, elevation choices and objective space; no UI grid or interface';
  }
  return 'three-quarter RPG battle-arena view; readable foreground deployment zone, opposing combat zone, boss focal point and traversal depth; no interface';
}

function assetPresentation(kind, entity = {}) {
  if (kind === 'booster') {
    return {
      assetType: 'vertical 2:3 collectible booster artwork',
      composition: 'one centered sealed foil packet, completely visible from top seam to bottom seam, with a single lore-faithful emblematic scene and controlled negative space; no loose cards',
      subject: 'the universe conflict distilled into one representative environmental scene, with the three canonical heroes used only as small, readable action silhouettes'
    };
  }
  if (kind === 'backdrop') {
    return {
      assetType: 'landscape 16:9 universe backdrop',
      composition: 'wide cinematic establishing view with distinct foreground, middle distance and horizon; room for game overlays at the outer edges without drawing any interface',
      subject: 'the canonical world at its most representative location, showing architecture, terrain, atmosphere and conflict supported by the quoted lore'
    };
  }
  if (kind === 'stage') {
    return {
      assetType: `landscape 16:9 ${entity.mode} gameplay stage`,
      composition: modeComposition(entity.mode),
      subject: 'the exact canonical mission location, objective, boss presence and environmental conditions quoted below'
    };
  }
  if (kind === 'hero') {
    return {
      assetType: 'portrait 3:4 playable hero artwork',
      composition: 'single full-body character in a dynamic three-quarter gameplay pose, feet and weapon fully visible, strong readable silhouette, simple lore-faithful environmental depth behind the subject',
      subject: 'the exact canonical hero, role, equipment and colors quoted below; visually communicate the lore role rather than adding unsupported costume symbolism'
    };
  }
  if (kind === 'enemy') {
    return {
      assetType: 'portrait 3:4 standard-enemy artwork',
      composition: 'single full-body enemy in an actionable three-quarter combat pose, complete silhouette and weapon visible, scale appropriate for a recurring gameplay unit',
      subject: 'the exact canonical enemy archetype, combat behavior, weapon and palette quoted below'
    };
  }
  if (kind === 'boss') {
    return {
      assetType: 'portrait 3:4 boss artwork',
      composition: 'single full-body boss in a commanding three-quarter combat pose, complete silhouette visible, dramatic scale cues and a readable telegraph of the canonical special ability',
      subject: 'the exact canonical boss, role, special ability, weapon and palette quoted below'
    };
  }
  if (kind === 'worldBoss') {
    return {
      assetType: 'portrait 3:4 world-boss artwork',
      composition: 'one monumental world boss viewed from a slightly low three-quarter gameplay angle, complete defining silhouette visible, with environmental scale references and its power readable at thumbnail size',
      subject: 'the exact canonical world boss, role, special ability, weapon and palette quoted below'
    };
  }
  return {
    assetType: 'square 1:1 inventory item artwork',
    composition: 'one isolated item centered at a clean three-quarter inventory angle, fully visible with generous padding, crisp silhouette and a restrained lore-faithful pedestal or atmospheric background',
    subject: kind === 'gear'
      ? 'the exact canonical equipment, material function, stat emphasis and description quoted below'
      : 'the exact canonical battle item, tier, tactical role, effect and description quoted below'
  };
}

function buildPrompt({
  assetId,
  kind,
  entity,
  context,
  entityFacts
}) {
  const presentation = assetPresentation(kind, entity);
  const factText = entityFacts
    .map(fact => `${fact.label}=${quote(fact.reference.value)}`)
    .join('; ');

  return [
    'Use case: stylized-concept',
    `Asset type: ${presentation.assetType} for Multiverse Breach`,
    `Asset ID (metadata only, never render it): ${quote(assetId)}`,
    `Primary request: create exactly one original raster game asset for the canonical universe ${quote(context.universe.value)}.`,
    `Current world lore (verbatim from the project manifest; obey it visually, do not render it as copy): origin=${quote(context.origin.value)}; breach=${quote(context.breach.value)}; core conflict=${quote(context.conflict.value)}.`,
    `Current visual canon (verbatim): motif=${quote(context.motif.value)}; palette=${quote(context.colors.value)}.`,
    `Current sensitivity notes (verbatim project constraints): ${context.sensitivity.length > 0 ? context.sensitivity.map(note => quote(note.value)).join('; ') : 'none recorded for this original world'}. Respect every recorded note as a binding visual constraint. A note requesting specialist review is a caution to avoid unsupported depictions, not a claim that human consultation has occurred.`,
    `Current asset facts (verbatim): ${factText}.`,
    `Subject: ${presentation.subject}.`,
    'Style/medium: polished, detailed 32-bit-era pixel art; deliberate pixel clusters, crisp edges, rich material texture, selective anti-aliasing, modern production lighting while remaining unmistakably pixel art; original project artwork, not vector art and not a placeholder.',
    `Composition/framing: ${presentation.composition}.`,
    'Lore fidelity: treat every quoted project fact as binding; add only connective visual detail that does not contradict the current lore; preserve the entity identity, function, hierarchy and established world palette.',
    'Constraints: one image and one coherent composition only; wholly original design; no copied official key art or licensed character design; no franchise insignia; no logos; no typography; no letters or numbers; no caption; no UI; no signature; no watermark.',
    'Avoid: text, logos, watermark, collage, contact sheet, split panels, multiple variants, photorealism, smooth vector shapes, generic genre shorthand that conflicts with the quoted lore, unrelated crossover elements.'
  ].join('\n');
}

function entityReference(label, reference) {
  return { label, reference };
}

function localizedEntityReference(label, value, pointer, fieldLabel) {
  return entityReference(label, localized(value, pointer, fieldLabel));
}

function scalarEntityReference(label, value, pointer, fieldLabel) {
  return entityReference(label, scalarFact(value, pointer, fieldLabel));
}

function prepareRemediation(remediation, remediationPath, remediationText) {
  if (remediation?.schemaVersion !== 1) {
    throw new Error('cultural remediation schemaVersion must be 1.');
  }
  if (remediation?.humanSpecialistConsultation !== false) {
    throw new Error(
      'cultural remediation must truthfully record that no human specialist consultation occurred.'
    );
  }
  const sources = remediation?.sources;
  if (!sources || typeof sources !== 'object' || Array.isArray(sources)) {
    throw new Error('cultural remediation sources must be an object.');
  }
  const entries = requireArray(remediation?.assets, 'cultural remediation assets');
  const byAssetId = new Map();
  for (const [index, entry] of entries.entries()) {
    const label = `cultural remediation assets[${index}]`;
    const assetId = cleanString(entry?.assetId, `${label}.assetId`);
    const reason = cleanString(entry?.reason, `${label}.reason`);
    const promptAddendum = cleanString(
      entry?.promptAddendum,
      `${label}.promptAddendum`
    );
    const sourceKeys = requireArray(entry?.sourceKeys, `${label}.sourceKeys`);
    if (sourceKeys.length === 0) {
      throw new Error(`${label}.sourceKeys must not be empty.`);
    }
    for (const sourceKey of sourceKeys) {
      const normalizedKey = cleanString(sourceKey, `${label}.sourceKeys`);
      if (typeof sources[normalizedKey] !== 'string' || !sources[normalizedKey].trim()) {
        throw new Error(`${label} references unknown source key: ${normalizedKey}.`);
      }
    }
    if (byAssetId.has(assetId)) {
      throw new Error(`Duplicate cultural remediation asset id: ${assetId}.`);
    }
    byAssetId.set(assetId, {
      reason,
      promptAddendum,
      sourceKeys
    });
  }
  return {
    byAssetId,
    metadata: {
      file: path.relative(REPOSITORY_ROOT, remediationPath).split(path.sep).join('/'),
      sha256: sha256(remediationText),
      schemaVersion: remediation.schemaVersion,
      reviewDate: remediation.reviewDate,
      reviewType: remediation.reviewType,
      humanSpecialistConsultation: remediation.humanSpecialistConsultation,
      assets: entries.length
    }
  };
}

function buildPlan(manifest, sourcePath, sourceText, remediationData) {
  const universes = requireArray(
    manifest?.universes,
    'manifest.universes',
    EXPECTED_WORLD_COUNT
  );
  const jobs = [];
  const assetIds = new Set();
  const destinations = new Set();
  const promptHashes = new Set();
  const consumedRemediation = new Set();
  const counts = Object.fromEntries(Object.keys(EXPECTED_PER_WORLD).map(kind => [kind, 0]));

  function addJob({
    world,
    worldIndex,
    kind,
    localId,
    destination,
    entity = {},
    facts
  }) {
    const assetId = `oc-v2:${world.key}:${kind}:${localId}`;
    if (assetIds.has(assetId)) {
      throw new Error(`Duplicate asset id: ${assetId}.`);
    }
    if (destinations.has(destination.toLowerCase())) {
      throw new Error(`Duplicate destination: ${destination}.`);
    }
    if (!destination.startsWith('/') || !destination.endsWith('.png')) {
      throw new Error(`Destination must be an absolute public PNG path: ${destination}.`);
    }

    const worldPointer = `/universes/${worldIndex}`;
    const context = worldContext(world, worldPointer);
    let prompt = buildPrompt({
      assetId,
      kind,
      entity,
      context,
      entityFacts: facts
    });
    const culturalRemediation = remediationData.byAssetId.get(assetId) || null;
    if (culturalRemediation) {
      prompt = `${prompt}\n${culturalRemediation.promptAddendum}`;
      consumedRemediation.add(assetId);
    }
    const promptSha256 = sha256(prompt);
    if (promptHashes.has(promptSha256)) {
      throw new Error(`Duplicate prompt generated for ${assetId}.`);
    }

    assetIds.add(assetId);
    destinations.add(destination.toLowerCase());
    promptHashes.add(promptSha256);
    counts[kind] += 1;
    jobs.push({
      assetId,
      worldKey: world.key,
      universe: context.universe.value,
      category: kind,
      entityName: facts[0]?.reference.value || context.universe.value,
      destination,
      repositoryPath: `public${destination}`,
      aspectRatio: assetPresentation(kind, entity).assetType.match(/\b\d+:\d+\b/)?.[0] || null,
      format: 'PNG',
      generator: 'OpenAI built-in image_gen',
      model: 'built-in/imagegen',
      promptSha256,
      culturalRemediation: culturalRemediation
        ? {
            reason: culturalRemediation.reason,
            sourceKeys: culturalRemediation.sourceKeys
          }
        : null,
      loreReferences: uniquePointers([
        ...context.references,
        ...facts.map(fact => fact.reference)
      ]),
      prompt
    });
  }

  for (const [worldIndex, world] of universes.entries()) {
    if (!world || typeof world !== 'object') {
      throw new Error(`manifest.universes[${worldIndex}] must be an object.`);
    }
    if (world.sourceType !== 'original' || world.isOriginal !== true) {
      throw new Error(`manifest.universes[${worldIndex}] is not marked as original.`);
    }

    const worldPointer = `/universes/${worldIndex}`;
    const worldKey = safeSegment(world.key, `${worldPointer}/key`);
    const imageRoot = `/images/oc-worlds/v2/${worldKey}`;
    const boosterLabel = localized(
      world.booster?.label,
      `${worldPointer}/booster/label`,
      `${worldKey}.booster.label`
    );
    const heroNames = requireArray(world.heroes, `${worldKey}.heroes`, EXPECTED_PER_WORLD.hero)
      .map((hero, heroIndex) => cleanString(hero.name, `${worldKey}.heroes[${heroIndex}].name`))
      .join(', ');
    const stageNames = requireArray(world.stages, `${worldKey}.stages`, EXPECTED_PER_WORLD.stage)
      .map((stage, stageIndex) => localized(
        stage.name,
        `${worldPointer}/stages/${stageIndex}/name`,
        `${worldKey}.stages[${stageIndex}].name`
      ).value)
      .join(', ');

    addJob({
      world,
      worldIndex,
      kind: 'booster',
      localId: 'booster',
      destination: `/boosters/original-worlds/v2/${worldKey}.png`,
      facts: [
        scalarEntityReference('booster id', world.booster?.id, `${worldPointer}/booster/id`, `${worldKey}.booster.id`),
        entityReference('booster label', boosterLabel),
        scalarEntityReference('canonical heroes', heroNames, `${worldPointer}/heroes`, `${worldKey}.heroes`),
        scalarEntityReference('canonical stages', stageNames, `${worldPointer}/stages`, `${worldKey}.stages`),
        scalarEntityReference('chase reward', world.booster?.chaseRewardId, `${worldPointer}/booster/chaseRewardId`, `${worldKey}.booster.chaseRewardId`)
      ]
    });

    addJob({
      world,
      worldIndex,
      kind: 'backdrop',
      localId: 'backdrop',
      destination: `${imageRoot}/backdrop.png`,
      facts: [
        scalarEntityReference('universe', world.universe, `${worldPointer}/universe`, `${worldKey}.universe`),
        scalarEntityReference('canonical stages', stageNames, `${worldPointer}/stages`, `${worldKey}.stages`),
        scalarEntityReference('subgenre tags', world.subgenreTags, `${worldPointer}/subgenreTags`, `${worldKey}.subgenreTags`)
      ]
    });

    for (const [stageIndex, stage] of world.stages.entries()) {
      const stagePointer = `${worldPointer}/stages/${stageIndex}`;
      const stageId = safeSegment(stage.id, `${stagePointer}/id`);
      addJob({
        world,
        worldIndex,
        kind: 'stage',
        localId: stageId,
        destination: `${imageRoot}/stages/${stageId}.png`,
        entity: stage,
        facts: [
          localizedEntityReference('stage name', stage.name, `${stagePointer}/name`, `${worldKey}.stages[${stageIndex}].name`),
          localizedEntityReference('setting', stage.setting, `${stagePointer}/setting`, `${worldKey}.stages[${stageIndex}].setting`),
          scalarEntityReference('game mode', stage.mode, `${stagePointer}/mode`, `${worldKey}.stages[${stageIndex}].mode`),
          scalarEntityReference('objective', stage.objectiveType, `${stagePointer}/objectiveType`, `${worldKey}.stages[${stageIndex}].objectiveType`),
          scalarEntityReference('boss', stage.boss, `${stagePointer}/boss`, `${worldKey}.stages[${stageIndex}].boss`),
          scalarEntityReference('difficulty', stage.difficulty, `${stagePointer}/difficulty`, `${worldKey}.stages[${stageIndex}].difficulty`)
        ]
      });
    }

    for (const [heroIndex, hero] of world.heroes.entries()) {
      const heroPointer = `${worldPointer}/heroes/${heroIndex}`;
      const heroId = safeSegment(hero.id, `${heroPointer}/id`);
      addJob({
        world,
        worldIndex,
        kind: 'hero',
        localId: heroId,
        destination: `${imageRoot}/heroes/${heroId}.png`,
        entity: hero,
        facts: [
          scalarEntityReference('hero name', hero.name, `${heroPointer}/name`, `${worldKey}.heroes[${heroIndex}].name`),
          scalarEntityReference('lore role', hero.loreRole, `${heroPointer}/loreRole`, `${worldKey}.heroes[${heroIndex}].loreRole`),
          scalarEntityReference('combat role', hero.combatRole, `${heroPointer}/combatRole`, `${worldKey}.heroes[${heroIndex}].combatRole`),
          scalarEntityReference('category', hero.category, `${heroPointer}/category`, `${worldKey}.heroes[${heroIndex}].category`),
          scalarEntityReference('weapon type', hero.weaponType, `${heroPointer}/weaponType`, `${worldKey}.heroes[${heroIndex}].weaponType`),
          scalarEntityReference('primary color', hero.primaryColor, `${heroPointer}/primaryColor`, `${worldKey}.heroes[${heroIndex}].primaryColor`),
          scalarEntityReference('secondary color', hero.secondaryColor, `${heroPointer}/secondaryColor`, `${worldKey}.heroes[${heroIndex}].secondaryColor`)
        ]
      });
    }

    const threatGroups = [
      {
        kind: 'enemy',
        entries: requireArray(world.enemies, `${worldKey}.enemies`, EXPECTED_PER_WORLD.enemy),
        descriptionField: 'signature'
      },
      {
        kind: 'boss',
        entries: requireArray(world.bosses, `${worldKey}.bosses`, EXPECTED_PER_WORLD.boss),
        descriptionField: 'special'
      },
      {
        kind: 'worldBoss',
        entries: [world.worldBoss],
        descriptionField: 'special'
      }
    ];

    for (const group of threatGroups) {
      for (const [threatIndex, threat] of group.entries.entries()) {
        if (!threat || typeof threat !== 'object') {
          throw new Error(`${worldKey}.${group.kind}[${threatIndex}] must be an object.`);
        }
        const collectionName = group.kind === 'worldBoss'
          ? 'worldBoss'
          : `${group.kind === 'enemy' ? 'enemies' : 'bosses'}/${threatIndex}`;
        const threatPointer = `${worldPointer}/${collectionName}`;
        const threatId = slugify(threat.name, `${threatPointer}/name`);
        addJob({
          world,
          worldIndex,
          kind: group.kind,
          localId: threatId,
          destination: `${imageRoot}/threats/${threatId}.png`,
          entity: threat,
          facts: [
            scalarEntityReference('threat name', threat.name, `${threatPointer}/name`, `${worldKey}.${group.kind}[${threatIndex}].name`),
            scalarEntityReference('combat role', threat.combatRole, `${threatPointer}/combatRole`, `${worldKey}.${group.kind}[${threatIndex}].combatRole`),
            localizedEntityReference(
              group.descriptionField === 'signature' ? 'signature behavior' : 'special ability',
              threat[group.descriptionField],
              `${threatPointer}/${group.descriptionField}`,
              `${worldKey}.${group.kind}[${threatIndex}].${group.descriptionField}`
            ),
            scalarEntityReference('weapon', threat.weapon, `${threatPointer}/weapon`, `${worldKey}.${group.kind}[${threatIndex}].weapon`),
            scalarEntityReference('canonical color', threat.color, `${threatPointer}/color`, `${worldKey}.${group.kind}[${threatIndex}].color`)
          ]
        });
      }
    }

    const itemGroups = [
      {
        kind: 'gear',
        entries: requireArray(world.gear, `${worldKey}.gear`, EXPECTED_PER_WORLD.gear)
      },
      {
        kind: 'battleItem',
        entries: requireArray(world.battleItems, `${worldKey}.battleItems`, EXPECTED_PER_WORLD.battleItem)
      }
    ];

    for (const group of itemGroups) {
      for (const [itemIndex, item] of group.entries.entries()) {
        const collectionName = group.kind === 'gear' ? 'gear' : 'battleItems';
        const itemPointer = `${worldPointer}/${collectionName}/${itemIndex}`;
        const itemId = safeSegment(item.id, `${itemPointer}/id`);
        const commonFacts = [
          localizedEntityReference('item name', item.name, `${itemPointer}/name`, `${worldKey}.${collectionName}[${itemIndex}].name`),
          localizedEntityReference('description', item.desc, `${itemPointer}/desc`, `${worldKey}.${collectionName}[${itemIndex}].desc`)
        ];
        const specificFacts = group.kind === 'gear'
          ? [
              scalarEntityReference('stat boost', item.boost, `${itemPointer}/boost`, `${worldKey}.${collectionName}[${itemIndex}].boost`)
            ]
          : [
              scalarEntityReference('tier', item.tier, `${itemPointer}/tier`, `${worldKey}.${collectionName}[${itemIndex}].tier`),
              scalarEntityReference('tactical role', item.role, `${itemPointer}/role`, `${worldKey}.${collectionName}[${itemIndex}].role`),
              scalarEntityReference('effect', item.effect, `${itemPointer}/effect`, `${worldKey}.${collectionName}[${itemIndex}].effect`),
              scalarEntityReference('canonical color', item.color, `${itemPointer}/color`, `${worldKey}.${collectionName}[${itemIndex}].color`)
            ];
        addJob({
          world,
          worldIndex,
          kind: group.kind,
          localId: itemId,
          destination: `${imageRoot}/items/${itemId}.png`,
          entity: item,
          facts: [...commonFacts, ...specificFacts]
        });
      }
    }
  }

  if (jobs.length !== EXPECTED_JOB_COUNT) {
    throw new Error(`Expected exactly ${EXPECTED_JOB_COUNT} jobs; generated ${jobs.length}.`);
  }
  for (const [kind, expected] of Object.entries(EXPECTED_TOTALS)) {
    if (counts[kind] !== expected) {
      throw new Error(`Expected ${expected} ${kind} jobs; generated ${counts[kind]}.`);
    }
  }
  if (consumedRemediation.size !== remediationData.byAssetId.size) {
    const unknown = [...remediationData.byAssetId.keys()]
      .filter(assetId => !consumedRemediation.has(assetId));
    throw new Error(
      `Cultural remediation references unknown plan jobs: ${unknown.join(', ')}.`
    );
  }

  return {
    schemaVersion: 1,
    planId: 'multiverse-breach-original-universes-openai-image-v2',
    deterministic: true,
    generator: {
      provider: 'OpenAI',
      interface: 'built-in image_gen',
      model: 'built-in/imagegen',
      execution: 'one built-in image_gen call per distinct job'
    },
    source: {
      manifest: path.relative(REPOSITORY_ROOT, sourcePath).split(path.sep).join('/'),
      manifestSha256: sha256(sourceText),
      manifestSchemaVersion: manifest.schemaVersion,
      manifestGeneratedAt: manifest.generatedAt
    },
    culturalRemediation: remediationData.metadata,
    destinationConvention: {
      booster: '/boosters/original-worlds/v2/<worldKey>.png',
      assets: '/images/oc-worlds/v2/<worldKey>/{backdrop.png,stages/<stageId>.png,heroes/<heroId>.png,threats/<slugName>.png,items/<itemId>.png}'
    },
    counts: {
      worlds: universes.length,
      jobs: jobs.length,
      distinctPrompts: promptHashes.size,
      distinctDestinations: destinations.size,
      byCategory: counts
    },
    jobs
  };
}

async function writePlan(outputPath, plan) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(plan, null, 2)}\n`, 'utf8');
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const sourceText = await readFile(options.source, 'utf8');
  const manifest = JSON.parse(sourceText);
  const remediationText = await readFile(options.remediation, 'utf8');
  const remediation = JSON.parse(remediationText);
  const remediationData = prepareRemediation(
    remediation,
    options.remediation,
    remediationText
  );
  const plan = buildPlan(
    manifest,
    options.source,
    sourceText,
    remediationData
  );
  const serializedPlan = `${JSON.stringify(plan, null, 2)}\n`;

  if (options.check) {
    const existingPlan = await readFile(options.out, 'utf8');
    if (existingPlan !== serializedPlan) {
      throw new Error(
        `${path.relative(REPOSITORY_ROOT, options.out)} is stale; run the builder without --check.`
      );
    }
  } else {
    await writePlan(options.out, plan);
  }

  console.log(JSON.stringify({
    mode: options.check ? 'check' : 'write',
    output: path.relative(REPOSITORY_ROOT, options.out).split(path.sep).join('/'),
    ...plan.counts
  }, null, 2));
}

main().catch(error => {
  console.error(`[original-universe-image-plan] ${error.message}`);
  process.exitCode = 1;
});
