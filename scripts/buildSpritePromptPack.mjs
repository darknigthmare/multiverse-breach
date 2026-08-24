import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import {
  applySpriteCatalogContracts,
  LEGACY_SPRITE_ID_ALIASES
} from './spriteCatalogContracts.mjs';

const root = process.cwd();
const tmpDir = process.env.MULTIVERSE_SPRITE_TMP_DIR || path.join(root, '.sprite-prompt-tmp');
const sourceDir = path.join(root, 'src', 'game');
const outDir = path.join(root, 'public', 'sprites', 'generated');
const outJsonl = path.join(outDir, 'openai-sprite-prompts.jsonl');
const outManifest = path.join(outDir, 'sprite-manifest.json');
const provenanceLedgerPath = path.join(outDir, 'openai-asset-ledger.jsonl');
const outStageRegistry = path.join(sourceDir, 'generatedStageAssets.json');
const featuredPromptUniverses = new Set([
  'Tomba',
  'Woodruff',
  'Hellraiser',
  'A Nightmare on Elm Street',
  'The Ring',
  'The Grudge'
]);

const slugify = (value) => String(value || 'unknown')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'unknown';

const rewriteImports = (source) => source
  .replaceAll("from './expandedUniverses'", "from './expandedUniverses.js'")
  .replaceAll("from './ocDlcPacks'", "from './ocDlcPacks.js'")
  .replaceAll("from './originalUniverseProduction'", "from './originalUniverseProduction.js'")
  .replaceAll("from './originalUniverseWave'", "from './originalUniverseWave.js'")
  .replaceAll("from './requestedUniverseWave'", "from './requestedUniverseWave.js'")
  .replaceAll("from './canonRosterWave'", "from './canonRosterWave.js'")
  .replaceAll("from './canonRosterWavePartA'", "from './canonRosterWavePartA.js'")
  .replaceAll("from './canonRosterWavePartB'", "from './canonRosterWavePartB.js'")
  .replaceAll("from './canonRosterWavePartC'", "from './canonRosterWavePartC.js'")
  .replaceAll("from './canonRosterWavePartD'", "from './canonRosterWavePartD.js'")
  .replaceAll("from './canonRosterWavePartE'", "from './canonRosterWavePartE.js'")
  .replaceAll("from './canonRosterWavePartF'", "from './canonRosterWavePartF.js'")
  .replaceAll("from './nonCombatTrial'", "from './nonCombatTrial.js'")
  .replaceAll("from './featuredUniversePacks'", "from './featuredUniversePacks.js'")
  .replaceAll("from './loreBossOverrides'", "from './loreBossOverrides.js'")
  .replaceAll("from './loreEnemyOverrides'", "from './loreEnemyOverrides.js'")
  .replaceAll("from './loreItemOverrides'", "from './loreItemOverrides.js'")
  .replaceAll("from './loreWorldBossOverrides'", "from './loreWorldBossOverrides.js'")
  .replaceAll("from './stageLoreProfiles'", "from './stageLoreProfiles.js'")
  .replaceAll("from './loreAccuratePacks'", "from './loreAccuratePacks.js'")
  .replaceAll("from './solarOppositesSirenStarWarsPack'", "from './solarOppositesSirenStarWarsPack.js'")
  .replaceAll("from './lore'", "from './lore.js'")
  .replaceAll("from './heroes'", "from './heroes.js'")
  .replaceAll("from './enemies'", "from './enemies.js'");

const copyRuntimeModules = async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
  await fs.mkdir(tmpDir, { recursive: true });
  const files = ['featuredUniversePacks.js', 'requestedUniverseWave.js', 'canonRosterWave.js', 'canonRosterWavePartA.js', 'canonRosterWavePartB.js', 'canonRosterWavePartC.js', 'canonRosterWavePartD.js', 'canonRosterWavePartE.js', 'canonRosterWavePartF.js', 'nonCombatTrial.js', 'loreBossOverrides.js', 'loreEnemyOverrides.js', 'loreItemOverrides.js', 'loreWorldBossOverrides.js', 'stageLoreProfiles.js', 'ocDlcPacks.js', 'originalUniversesManifest.json', 'originalUniverseProduction.js', 'originalUniverseWave.js', 'gearShopVisualContractsFirst40.js', 'gearShopVisualContractsRemaining47.js', 'gearShopVisualContracts.js', 'expandedUniverses.js', 'loreAccuratePacks.js', 'solarOppositesSirenStarWarsPack.js', 'heroes.js', 'enemies.js', 'lore.js', 'battleItems.js', 'spriteAssets.js', 'melee/meleeAnimationManifest.js', 'melee/meleeStateMachine.js'];
  files.push('canonRosterPackFactory.js', ...'GHIJKLM'.split('').map(part => `canonRosterWavePart${part}.js`));
  await Promise.all(files.map(async (file) => {
    const raw = await fs.readFile(path.join(sourceDir, file), 'utf8');
    const destination = path.join(tmpDir, file);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.writeFile(destination, rewriteImports(raw), 'utf8');
  }));
};

const buildPrompt = ({ kind, name, universe, role, weapon, color, special }) => [
  'Use case: stylized-concept',
  'Asset type: transparent game sprite sheet for a 2D canvas battle game',
  `Primary request: create a detailed pixel-art animation sheet for ${name}, ${kind} from ${universe}.`,
  'Style/medium: highly detailed dark fantasy pixel art, matching the provided vendor reference: ornate pixel texture, hand-painted highlights, crisp dark outline, strong readable silhouette.',
  'Composition/framing: exact 4 columns x 4 rows sprite sheet, equal cells, full body, three-quarter side battle angle facing right, centered in every cell.',
  'Animation rows: row 1 idle breathing, row 2 walk/run cycle, row 3 attack using the signature weapon or power, row 4 hit/recoil.',
  `Lore lock: preserve the recognizable silhouette, outfit, equipment, colors, and attitude of ${name}.`,
  `Combat identity: ${role || 'fighter'} using ${weapon || 'signature weapon or power'}${special ? `; special motif: ${special}` : ''}.`,
  `Palette anchor: ${color || 'lore-accurate colors'}; add fine highlights only where they fit the character.`,
  'Background: perfectly flat solid #00ff00 chroma key, no floor, no cast shadow, no text, no watermark.',
  'Constraints: one character only, no extra characters, no UI labels, no cropped body, consistent proportions across all 16 frames.'
].join('\n');

const getSpritePromptMetadata = (subject = {}) => ({
  referenceUrl: subject.referenceUrl,
  visualAnchor: subject.visualAnchor,
  canonStatus: subject.canonStatus,
  spritePrompt: subject.spritePrompt
});

const appendSpritePromptMetadata = (prompt, subject = {}) => [
  prompt,
  subject.canonStatus ? `Canon status: ${subject.canonStatus}.` : null,
  subject.referenceUrl ? `Reference source: ${subject.referenceUrl}` : null,
  subject.visualAnchor ? `Verified visual anchor: ${subject.visualAnchor}` : null
].filter(Boolean).join('\n');

const fileExists = async (relativeOutput) => {
  const localPath = path.join(root, 'public', relativeOutput.replace(/^\/+/, ''));
  try {
    const stat = await fs.stat(localPath);
    return stat.isFile() && stat.size > 0;
  } catch {
    return false;
  }
};

const sha256 = value => createHash('sha256').update(value).digest('hex');

const loadProvenanceLedger = async () => {
  try {
    const raw = await fs.readFile(provenanceLedgerPath, 'utf8');
    return raw.split(/\r?\n/u).filter(Boolean).map(line => JSON.parse(line));
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
};

const verifyProvenanceRecord = async (item, record) => {
  if (!record || record.output !== item.output) return false;
  const catalogPromptSha256 = sha256(Buffer.from(item.prompt, 'utf8'));
  if ((record.catalogPromptSha256 || record.promptSha256) !== catalogPromptSha256) return false;
  if (record.generation?.provider !== 'OpenAI' || record.generation?.interface !== 'built-in image_gen') return false;
  const generationId = String(record.generation?.generationId || '');
  const isNativeImageGenerationId = /^exec-[a-z0-9-]+$/iu.test(generationId)
    || /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(generationId);
  if (!isNativeImageGenerationId) return false;
  try {
    const output = await fs.readFile(path.join(root, 'public', item.output.replace(/^\/+/, '')));
    return sha256(output) === record.image?.sha256;
  } catch {
    return false;
  }
};

const main = async () => {
  await copyRuntimeModules();
  const [
    { HEROES_DB, EQUIP_ITEMS_DB, EVENT_ITEMS_DB },
    { ENEMIES_DB, FINAL_GAME_BOSS },
    { BATTLE_ITEM_CATALOG },
    { LORE_WORLD_BOSS_POLICIES },
    { STAGE_LORE_PROFILES, STAGE_ARC_LORE_PROFILES },
    { getItemSpriteSrc }
  ] = await Promise.all([
    import(pathToFileURL(path.join(tmpDir, 'heroes.js')).href),
    import(pathToFileURL(path.join(tmpDir, 'enemies.js')).href),
    import(pathToFileURL(path.join(tmpDir, 'battleItems.js')).href),
    import(pathToFileURL(path.join(tmpDir, 'loreWorldBossOverrides.js')).href),
    import(pathToFileURL(path.join(tmpDir, 'stageLoreProfiles.js')).href),
    import(pathToFileURL(path.join(tmpDir, 'spriteAssets.js')).href)
  ]);

  const heroEntries = HEROES_DB.map(hero => {
    const universeSlug = slugify(hero.universe);
    const file = `heroes/${universeSlug}/${slugify(hero.id)}.png`;
    return {
      kind: 'hero',
      id: hero.id,
      name: hero.name,
      universe: hero.universe,
      output: `/sprites/generated/${file}`,
      frame: { width: 256, height: 256, columns: 4, rows: ['idle', 'run', 'attack', 'hit'] },
      ...getSpritePromptMetadata(hero),
      prompt: appendSpritePromptMetadata(hero.spritePrompt || buildPrompt({
        kind: 'hero',
        name: hero.name,
        universe: hero.universe,
        role: hero.category,
        weapon: hero.weaponType || hero.simple?.name,
        color: `${hero.primaryColor}${hero.secondaryColor ? ` and ${hero.secondaryColor}` : ''}`,
        special: hero.special?.name
      }), hero)
    };
  });
  if (!heroEntries.some(entry => entry.id === 'player_anchor')) {
    heroEntries.push({
      kind: 'hero',
      id: 'player_anchor',
      name: 'A.R.C.A. Anchor',
      universe: 'Nexus de Convergence',
      output: '/sprites/generated/heroes/nexus-de-convergence/player-anchor.png',
      frame: { width: 256, height: 256, columns: 4, rows: ['idle', 'run', 'attack', 'hit'] },
      visualAnchor: 'A neutral androgynous Anchor in dark A.R.C.A. tactical armor, carrying a cyan anchor gauntlet with restrained yellow signal accents.',
      prompt: [
        buildPrompt({
          kind: 'hero',
          name: 'A.R.C.A. Anchor',
          universe: 'Nexus de Convergence',
          role: 'customizable tactical anchor',
          weapon: 'cyan anchor gauntlet',
          color: 'dark charcoal, archive white, cyan and restrained signal yellow',
          special: 'stabilizing prismatic anchor pulse'
        }),
        'Identity constraint: keep the face neutral and non-specific so the sprite can represent any player profile; use an entirely original design with no franchise resemblance.'
      ].join('\n')
    });
  }

  const bossEntries = [];
  Object.entries(ENEMIES_DB).forEach(([universe, data]) => {
    (data.monsters || []).filter(Boolean).forEach((enemy) => {
      const universeSlug = slugify(universe);
      const file = `bosses/${universeSlug}/${slugify(enemy.name)}.png`;
      bossEntries.push({
        kind: 'enemy',
        id: slugify(`${universe}-${enemy.name}`),
        name: enemy.name,
        universe,
        output: enemy.spriteSource || `/sprites/generated/${file}`,
        frame: { width: 256, height: 256, columns: 4, rows: ['idle', 'run', 'attack', 'hit'] },
        ...getSpritePromptMetadata(enemy),
        prompt: appendSpritePromptMetadata(enemy.spritePrompt || buildPrompt({
          kind: 'enemy',
          name: enemy.name,
          universe,
          role: 'standard enemy',
          weapon: enemy.weapon,
          color: enemy.color,
          special: enemy.special
        }), enemy)
      });
    });
    [...(data.bosses || []), data.worldBoss].filter(Boolean).forEach((boss) => {
      const universeSlug = slugify(universe);
      const file = `bosses/${universeSlug}/${slugify(boss.name)}.png`;
      bossEntries.push({
        kind: 'boss',
        id: slugify(`${universe}-${boss.name}`),
        name: boss.name,
        universe,
        output: boss.spriteSource || `/sprites/generated/${file}`,
        frame: { width: 256, height: 256, columns: 4, rows: ['idle', 'run', 'attack', 'hit'] },
        ...getSpritePromptMetadata(boss),
        prompt: appendSpritePromptMetadata(boss.spritePrompt || buildPrompt({
          kind: 'boss',
          name: boss.name,
          universe,
          role: 'boss',
          weapon: boss.weapon,
          color: boss.color,
          special: boss.special
        }), boss)
      });
    });
    (data.trials || []).filter(Boolean).forEach((trial) => {
      const universeSlug = slugify(universe);
      const file = `bosses/${universeSlug}/${slugify(trial.name)}.png`;
      const basePrompt = trial.spritePrompt || [
        'Use case: stylized-concept',
        'Asset type: non-combat objective state sheet for a 2D canvas trial stage',
        `Primary request: create an original fan-made pixel-art objective sheet for ${trial.name} from ${universe}.`,
        `Objective identity: ${trial.policy?.objective?.en || trial.policy?.objective?.fr || 'resolve the stage objective without defeating a character'}.`,
        `Verified visual anchor: ${trial.visualAnchor || trial.policy?.visualAnchor || 'lore-faithful stage mechanisms and props'}.`,
        'Constraints: do not depict the subject as a hostile fighter, do not add a health bar, attack pose, gore, copied official asset or actor likeness.'
      ].join('\n');
      const prompt = [
        basePrompt,
        'Delivery layout lock: exact 4 columns x 4 rows, equal 256x256 cells on a 1024x1024 sheet; rows show untouched, active, nearly resolved and completed objective animation states, with four distinct animation frames per row.',
        'Background lock: perfectly flat solid #00ff00 chroma key in every cell, no floor, no cast shadow, no text and no watermark.'
      ].join('\n');
      bossEntries.push({
        kind: 'trial',
        id: slugify(`${universe}-${trial.id || trial.name}-trial`),
        name: trial.name,
        universe,
        output: trial.output || trial.spriteSource || `/sprites/generated/${file}`,
        frame: { width: 256, height: 256, columns: 4, rows: ['untouched', 'active', 'resolving', 'complete'] },
        ...getSpritePromptMetadata(trial),
        referenceUrls: trial.referenceUrls,
        prompt: appendSpritePromptMetadata(prompt, trial)
      });
    });
  });

  bossEntries.push({
    kind: 'boss',
    id: 'final-breach-singularity-core',
    name: FINAL_GAME_BOSS.name,
    universe: 'Matrix',
    output: `/sprites/generated/bosses/matrix/${slugify(FINAL_GAME_BOSS.name)}.png`,
    frame: { width: 256, height: 256, columns: 4, rows: ['idle', 'run', 'attack', 'hit'] },
    prompt: buildPrompt({
      kind: 'boss',
      name: FINAL_GAME_BOSS.name,
      universe: 'Matrix',
      role: 'final boss',
      weapon: FINAL_GAME_BOSS.weapon,
      color: FINAL_GAME_BOSS.color,
      special: FINAL_GAME_BOSS.special
    })
  });

  const itemSource = [
    ...EQUIP_ITEMS_DB,
    ...Object.entries(EVENT_ITEMS_DB).map(([universe, item]) => ({ ...item, universe: item.universe || universe })),
    ...BATTLE_ITEM_CATALOG
  ];
  const seenItemOutputs = new Set();
  const itemEntryCandidates = itemSource.flatMap((item) => {
    if (!item?.id) return [];
    const universe = item.universe || 'unknown';
    const universeSlug = slugify(universe);
    const file = `items/${universeSlug}/${slugify(item.id)}.png`;
    const output = getItemSpriteSrc(item) || `/sprites/generated/${file}`;
    if (seenItemOutputs.has(output)) return [];
    seenItemOutputs.add(output);
    return [{
      kind: 'item',
      id: item.id,
      name: item.name?.en || item.name?.fr || item.id,
      universe,
      output,
      frame: { width: 512, height: 512, columns: 1, rows: ['icon'] },
      referenceUrl: item.referenceUrl,
      visualAnchor: item.visualAnchor,
      curatedPrompt: Boolean(item.iconPrompt),
      prompt: item.iconPrompt || [
        'Use case: stylized-concept',
        'Asset type: transparent game item icon for a 2D canvas battle game',
        `Primary request: create a detailed pixel-art item icon for ${item.name?.en || item.id} from ${universe}.`,
        item.visualAnchor ? `Reference-locked visual anchor: ${item.visualAnchor}` : null,
        item.canonStatus ? `Canon status: ${item.canonStatus}.` : null,
        item.referenceUrl ? `Reference source: ${item.referenceUrl}` : null,
        'Style/medium: highly detailed 32-bit pixel art faithful to the source medium, with crisp outline and a silhouette readable at small UI size.',
        'Composition/framing: centered single item icon, generous padding, three-quarter top angle, no character.',
        'Background: perfectly flat solid #00ff00 chroma key, no floor, no cast shadow, no text, no watermark.',
        'Constraints: one item only, no UI labels, no readable logos unless explicitly part of the item lore, consistent icon scale.'
      ].filter(Boolean).join('\n')
    }];
  });

  const itemEntries = (await Promise.all(itemEntryCandidates.map(async (entry) => (
    entry.curatedPrompt
      || featuredPromptUniverses.has(entry.universe)
      || entry.referenceUrl
      || entry.visualAnchor
      || await fileExists(entry.output) ? entry : null
  )))).filter(Boolean);

  const finaleEntries = Object.values(LORE_WORLD_BOSS_POLICIES).map((policy) => ({
    kind: 'finale',
    id: slugify(`${policy.universe}-${policy.policy}`),
    name: policy.objective.en,
    universe: policy.universe,
    output: policy.output,
    frame: { type: 'layered-finale-kit', policy: policy.policy },
    referenceUrls: policy.referenceUrls,
    visualAnchor: policy.visualAnchor,
    prompt: policy.assetPrompt
  }));

  const stageProfiles = [
    ...Object.values(STAGE_LORE_PROFILES),
    ...Object.values(STAGE_ARC_LORE_PROFILES)
  ];
  const stageEntries = stageProfiles.flatMap((profile) => (
    Object.entries(profile.modes).map(([mode, spec]) => ({
      kind: 'stage',
      id: slugify(`${profile.key}-${mode}`),
      name: profile.canonicalName,
      universe: profile.universes?.join(' x ') || profile.key,
      output: spec.assetPath,
      frame: { type: 'environment', mode, camera: spec.camera },
      referenceUrls: profile.referenceUrls,
      visualAnchor: profile.visualAnchor,
      priority: profile.priority,
      auditStatus: profile.auditStatus,
      generationBlocked: profile.generationBlocked,
      profileKey: profile.key,
      companionOutputs: [
        spec.backdropPath,
        spec.platformTexturePath,
        spec.tileTexturePath
      ].filter(Boolean),
      prompt: spec.prompt
    }))
  ));

  const all = applySpriteCatalogContracts([
    ...heroEntries, ...bossEntries, ...itemEntries, ...finaleEntries, ...stageEntries
  ], { strict: true });
  const provenanceLedger = await loadProvenanceLedger();
  const provenanceByAsset = new Map(provenanceLedger.map(record => [`${record.kind}:${record.id}`, record]));
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(outJsonl, all.map(entry => JSON.stringify(entry)).join('\n') + '\n', 'utf8');
  const manifestEntries = await Promise.all(all.map(async (item) => {
    const entry = { ...item };
    delete entry.prompt;
    delete entry.curatedPrompt;
    entry.available = await fileExists(entry.output);
    entry.source = entry.available ? 'openai' : null;
    const provenanceRecord = provenanceByAsset.get(`${item.kind}:${item.id}`);
    const verifiedOpenAi = entry.available && await verifyProvenanceRecord(item, provenanceRecord);
    entry.provenanceStatus = verifiedOpenAi
      ? 'verified-openai'
      : entry.available
        ? 'legacy-openai-declared'
        : 'missing';
    if (verifiedOpenAi) {
      entry.generationId = provenanceRecord.generation.generationId;
      entry.outputSha256 = provenanceRecord.image.sha256;
    }
    return entry;
  }));

  const stageRegistryEntries = await Promise.all(stageProfiles.map(async (profile) => {
    const modes = await Promise.all(Object.entries(profile.modes).map(async ([mode, spec]) => {
      const assetPath = await fileExists(spec.assetPath) ? spec.assetPath : null;
      const backdropPath = spec.backdropPath && await fileExists(spec.backdropPath) ? spec.backdropPath : null;
      const platformTexturePath = spec.platformTexturePath && await fileExists(spec.platformTexturePath)
        ? spec.platformTexturePath
        : null;
      const tileTexturePath = spec.tileTexturePath && await fileExists(spec.tileTexturePath)
        ? spec.tileTexturePath
        : null;
      if (!assetPath && !backdropPath && !platformTexturePath && !tileTexturePath) return null;
      return [mode, {
        assetPath,
        backdropPath,
        platformTexturePath,
        tileTexturePath
      }];
    }));
    const availableModes = Object.fromEntries(modes.filter(Boolean));
    return Object.keys(availableModes).length > 0 ? [profile.key, availableModes] : null;
  }));
  const stageRegistryByProfile = Object.fromEntries(stageRegistryEntries.filter(Boolean));
  const stageRegistryModes = Object.values(stageRegistryByProfile).flatMap(profile => Object.values(profile));
  await fs.writeFile(outStageRegistry, JSON.stringify({
    counts: {
      profiles: Object.keys(stageRegistryByProfile).length,
      backdrops: stageRegistryModes.filter(mode => mode.assetPath).length,
      companions: stageRegistryModes.reduce((sum, mode) => (
        sum + Number(Boolean(mode.backdropPath))
        + Number(Boolean(mode.platformTexturePath))
        + Number(Boolean(mode.tileTexturePath))
      ), 0)
    },
    byProfile: stageRegistryByProfile
  }, null, 2), 'utf8');

  await fs.writeFile(outManifest, JSON.stringify({
    generatedAt: new Date().toISOString(),
    identityAliases: LEGACY_SPRITE_ID_ALIASES,
    sheet: { width: 1024, height: 1024, frameWidth: 256, frameHeight: 256, columns: 4, rows: ['idle', 'run', 'attack', 'hit'] },
    counts: {
      heroes: heroEntries.length,
      enemies: bossEntries.filter(entry => entry.kind === 'enemy').length,
      bosses: bossEntries.filter(entry => entry.kind === 'boss').length,
      trials: bossEntries.filter(entry => entry.kind === 'trial').length,
      items: itemEntries.length,
      finales: finaleEntries.length,
      stages: stageEntries.length,
      total: all.length
    },
    availableCounts: {
      heroes: manifestEntries.filter(entry => entry.kind === 'hero' && entry.available).length,
      enemies: manifestEntries.filter(entry => entry.kind === 'enemy' && entry.available).length,
      bosses: manifestEntries.filter(entry => entry.kind === 'boss' && entry.available).length,
      trials: manifestEntries.filter(entry => entry.kind === 'trial' && entry.available).length,
      items: manifestEntries.filter(entry => entry.kind === 'item' && entry.available).length,
      finales: manifestEntries.filter(entry => entry.kind === 'finale' && entry.available).length,
      stages: manifestEntries.filter(entry => entry.kind === 'stage' && entry.available).length,
      total: manifestEntries.filter(entry => entry.available).length
    },
    verifiedOpenAiCounts: {
      heroes: manifestEntries.filter(entry => entry.kind === 'hero' && entry.provenanceStatus === 'verified-openai').length,
      enemies: manifestEntries.filter(entry => entry.kind === 'enemy' && entry.provenanceStatus === 'verified-openai').length,
      bosses: manifestEntries.filter(entry => entry.kind === 'boss' && entry.provenanceStatus === 'verified-openai').length,
      trials: manifestEntries.filter(entry => entry.kind === 'trial' && entry.provenanceStatus === 'verified-openai').length,
      items: manifestEntries.filter(entry => entry.kind === 'item' && entry.provenanceStatus === 'verified-openai').length,
      finales: manifestEntries.filter(entry => entry.kind === 'finale' && entry.provenanceStatus === 'verified-openai').length,
      stages: manifestEntries.filter(entry => entry.kind === 'stage' && entry.provenanceStatus === 'verified-openai').length,
      total: manifestEntries.filter(entry => entry.provenanceStatus === 'verified-openai').length
    },
    missingCounts: {
      heroes: heroEntries.length - manifestEntries.filter(entry => entry.kind === 'hero' && entry.available).length,
      enemies: bossEntries.filter(entry => entry.kind === 'enemy').length - manifestEntries.filter(entry => entry.kind === 'enemy' && entry.available).length,
      bosses: bossEntries.filter(entry => entry.kind === 'boss').length - manifestEntries.filter(entry => entry.kind === 'boss' && entry.available).length,
      trials: bossEntries.filter(entry => entry.kind === 'trial').length - manifestEntries.filter(entry => entry.kind === 'trial' && entry.available).length,
      items: itemEntries.length - manifestEntries.filter(entry => entry.kind === 'item' && entry.available).length,
      finales: finaleEntries.length - manifestEntries.filter(entry => entry.kind === 'finale' && entry.available).length,
      stages: stageEntries.length - manifestEntries.filter(entry => entry.kind === 'stage' && entry.available).length,
      total: all.length - manifestEntries.filter(entry => entry.available).length
    },
    entries: manifestEntries
  }, null, 2), 'utf8');
  await fs.rm(tmpDir, { recursive: true, force: true });
  const enemyCount = bossEntries.filter(entry => entry.kind === 'enemy').length;
  const bossCount = bossEntries.filter(entry => entry.kind === 'boss').length;
  const trialCount = bossEntries.filter(entry => entry.kind === 'trial').length;
  console.log(`Wrote ${all.length} asset prompts (${heroEntries.length} heroes, ${enemyCount} enemies, ${bossCount} bosses, ${trialCount} trials, ${itemEntries.length} items, ${finaleEntries.length} finales, ${stageEntries.length} stages).`);
  console.log(outJsonl);
  console.log(outManifest);
  console.log(outStageRegistry);
};

main().catch(async (error) => {
  await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  console.error(error);
  process.exit(1);
});
