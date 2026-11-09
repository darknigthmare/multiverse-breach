import fs from 'node:fs/promises';
import path from 'node:path';
import { registerHooks } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const defaultRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const heroContexts = ['auto', 'rpg', 'tactics', 'melee', 'nexus', 'collection', 'hud', 'fps', 'kart'];
const imageExtension = /\.(?:png|webp|jpe?g|gif|svg)$/iu;
const unique = values => [...new Set(values.filter(value => typeof value === 'string' && value))];
export const CHARACTER_PNG_BASELINE = Object.freeze({
  auditDate: '2026-10-02',
  scope: 'Runtime character-image availability before this PNG production wave; independent of visual fidelity.',
  missingUniqueOutputs: 1705,
  countsByKind: Object.freeze({ hero: 0, enemy: 910, boss: 795 }),
  ordinaryBossMissing: 571,
  worldBossMissing: 224,
  finalBossMissing: 0
});

// Several existing game modules use the extensionless imports understood by Vite.
// Keep this compatibility confined to those modules when running the inventory in Node.
registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (error.code === 'ERR_MODULE_NOT_FOUND'
        && specifier.startsWith('.')
        && !path.extname(specifier)
        && context.parentURL?.includes('/src/game/')) {
        return nextResolve(`${specifier}.js`, context);
      }
      throw error;
    }
  }
});

const readJson = async (file, fallback) => {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw error;
  }
};

const readCatalogMetadata = async file => {
  let raw;
  try {
    raw = await fs.readFile(file, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return new Map();
    throw error;
  }
  const metadata = new Map();
  for (const line of raw.split(/\r?\n/u).filter(Boolean)) {
    const entry = JSON.parse(line);
    // Deliberately do not export historical prompts or generation identifiers.
    metadata.set(entry.output, {
      referenceUrl: entry.referenceUrl || null,
      referenceUrls: entry.referenceUrls || [],
      referenceImages: entry.referenceImages || [],
      visualAnchor: entry.visualAnchor || null,
      incarnation: entry.incarnation || null,
      canonStatus: entry.canonStatus || null
    });
  }
  return metadata;
};

const publicOutput = (value, root) => {
  if (typeof value !== 'string' || !value || /^(?:[a-z]+:|\/\/)/iu.test(value)) return null;
  const publicRoot = path.join(root, 'public');
  let relative = value;
  if (value.startsWith(`${publicRoot}${path.sep}`)) relative = path.relative(publicRoot, value);
  else if (value.startsWith('public/')) relative = value.slice('public/'.length);
  else relative = value.replace(/^\/+/, '');
  const resolved = path.resolve(publicRoot, relative);
  if (resolved !== publicRoot && !resolved.startsWith(`${publicRoot}${path.sep}`)) return null;
  return `/${path.relative(publicRoot, resolved).split(path.sep).join('/')}`;
};

const referenceStrings = subject => unique([
  subject.referenceUrl,
  ...(Array.isArray(subject.referenceUrls) ? subject.referenceUrls : []),
  ...(Array.isArray(subject.additionalReferences) ? subject.additionalReferences : [])
]);

/**
 * Inventory the missing character images requested by the actual runtime.
 * Existing files and candidate aliases are availability evidence only: every
 * generated image subject remains pending an independent visual review.
 */
export const buildMissingCharacterImageInventory = async ({ root = defaultRoot } = {}) => {
  root = path.resolve(root);
  const game = path.join(root, 'src', 'game');
  const [heroesModule, enemiesModule, sprites, manifest, references, catalogMetadata, originalManifest] = await Promise.all([
    import(pathToFileURL(path.join(game, 'heroes.js')).href),
    import(pathToFileURL(path.join(game, 'enemies.js')).href),
    import(pathToFileURL(path.join(game, 'spriteAssets.js')).href),
    readJson(path.join(root, 'public/sprites/generated/sprite-manifest.json'), { entries: [] }),
    readJson(path.join(root, 'public/sprites/generated/sprite-reference-sources.json'), { entries: [] }),
    readCatalogMetadata(path.join(root, 'public/sprites/generated/openai-sprite-prompts.jsonl')),
    readJson(path.join(game, 'originalUniversesManifest.json'), { universes: [] })
  ]);
  const { HEROES_DB } = heroesModule;
  const { ENEMIES_DB, FINAL_GAME_BOSS } = enemiesModule;
  const { getHeroSpriteSheetSrc, getHeroCompleteSpritePack, getEnemySpriteSheetSrc, slugifyAsset } = sprites;
  const existence = new Map();
  const materialized = output => {
    if (!existence.has(output)) {
      existence.set(output, (async () => {
        const normalized = publicOutput(output, root);
        if (!normalized) return false;
        const file = path.join(root, 'public', normalized.slice(1));
        try {
          const stat = await fs.stat(file);
          if (!stat.isFile() || !stat.size) return false;
          const handle = await fs.open(file, 'r');
          try {
            const buffer = Buffer.alloc(Math.min(128, stat.size));
            await handle.read(buffer, 0, buffer.length, 0);
            return !buffer.toString('utf8').startsWith('version https://git-lfs.github.com/spec/v1');
          } finally {
            await handle.close();
          }
        } catch (error) {
          if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return false;
          throw error;
        }
      })());
    }
    return existence.get(output);
  };
  const catalogByOutput = new Map((manifest.entries || []).map(entry => [entry.output, entry]));
  const referencesByOutput = new Map((references.entries || []).map(entry => [entry.output, entry]));
  const originalUniverses = new Map((originalManifest.universes || [])
    .filter(universe => universe.sourceType === 'original' && universe.isOriginal === true)
    .map(universe => [universe.universe, universe]));
  const candidateHeroes = new Map();
  for (const hero of (manifest.entries || []).filter(entry => entry.kind === 'hero')) {
    if (!await materialized(hero.output)) continue;
    const key = JSON.stringify([hero.universe, hero.name]);
    const candidates = candidateHeroes.get(key) || [];
    candidates.push(hero);
    candidateHeroes.set(key, candidates);
  }

  const declarations = [];
  for (const hero of HEROES_DB) {
    const outputs = new Map();
    for (const context of heroContexts) {
      const output = getHeroSpriteSheetSrc(hero, context);
      if (!output) continue;
      const contexts = outputs.get(output) || [];
      contexts.push(context);
      outputs.set(output, contexts);
    }
    for (const pack of getHeroCompleteSpritePack(hero) || []) {
      const contexts = outputs.get(pack.src) || [];
      contexts.push(`complete-pack:${pack.id}`);
      outputs.set(pack.src, contexts);
    }
    for (const [output, contexts] of outputs) {
      declarations.push({ subject: hero, kind: 'hero', runtimeKind: 'hero', output, contexts });
    }
  }
  for (const [universe, roster] of Object.entries(ENEMIES_DB)) {
    for (const [runtimeKind, subjects] of [
      ['enemy', roster.monsters || []],
      ['boss', roster.bosses || []],
      ['worldBoss', roster.worldBoss ? [roster.worldBoss] : []]
    ]) {
      for (const subject of subjects) {
        const resolved = { ...subject, universe };
        declarations.push({
          subject: resolved,
          kind: runtimeKind === 'enemy' ? 'enemy' : 'boss',
          runtimeKind,
          output: getEnemySpriteSheetSrc(resolved),
          contexts: ['combat', 'archive']
        });
      }
    }
  }
  // This is the exact context injected by GameCanvas.scaleEnemy for its final
  // mission. Resolving the unadorned template would invent an /unknown/ absence.
  if (FINAL_GAME_BOSS) {
    const subject = { ...FINAL_GAME_BOSS, universe: 'Matrix' };
    declarations.push({ subject, kind: 'boss', runtimeKind: 'finalBoss', output: getEnemySpriteSheetSrc(subject), contexts: ['combat'] });
  }

  const missing = new Map();
  const runtimeCounts = {};
  for (const declaration of declarations) {
    const { subject, kind, runtimeKind, output, contexts } = declaration;
    const counts = runtimeCounts[runtimeKind] ||= { declarations: 0, uniqueOutputs: new Set(), missingOutputs: new Set() };
    counts.declarations++;
    counts.uniqueOutputs.add(output);
    if (await materialized(output)) continue;
    counts.missingOutputs.add(output);
    const catalog = catalogByOutput.get(output) || {};
    const ownerId = subject.id || catalog.id || slugifyAsset(`${subject.universe}-${subject.name}`);
    if (missing.has(output)) {
      missing.get(output).owners.push({ kind, runtimeKind, id: ownerId, name: subject.name, universe: subject.universe, contexts });
      continue;
    }
    const metadata = catalogMetadata.get(output) || {};
    // Enemy templates do not all inherit an originalContent flag. The authored
    // universe manifest establishes their origin without inferring it from names.
    const originalUniverse = originalUniverses.get(subject.universe);
    const sourceCandidates = (candidateHeroes.get(JSON.stringify([subject.universe, subject.name])) || []).map(candidate => ({
      kind: 'hero',
      id: candidate.id,
      name: candidate.name,
      universe: candidate.universe,
      output: candidate.output,
      status: 'existing-asset-candidate',
      match: 'exact-name-and-universe',
      visualReviewStatus: 'pending',
      canonicalFidelityApproved: false
    }));
    const sourceReference = referencesByOutput.get(output);
    const candidateReferences = sourceCandidates.map(candidate => referencesByOutput.get(candidate.output)).filter(Boolean);
    const referenceRecords = [sourceReference, ...candidateReferences].filter(Boolean);
    const localReferenceValues = unique([
      subject.portrait,
      subject.spriteSource,
      ...(subject.referenceImages || []),
      ...(subject.localReferencePaths || []),
      ...referenceRecords.flatMap(reference => reference.referenceImages || []),
      ...sourceCandidates.map(candidate => candidate.output)
    ]);
    const existingPublicReferences = [];
    for (const value of localReferenceValues) {
      const normalized = publicOutput(value, root);
      if (!normalized || !imageExtension.test(normalized) || !await materialized(normalized)) continue;
      if (existingPublicReferences.some(reference => reference.output === normalized)) continue;
      existingPublicReferences.push({
        output: normalized,
        status: 'existing-asset-candidate',
        visualReviewStatus: 'pending',
        canonicalFidelityApproved: false,
        role: sourceCandidates.some(candidate => candidate.output === normalized) ? 'exact-name-and-universe-hero-candidate' : 'declared-local-image-reference'
      });
    }
    const referenceUrls = unique([
      ...referenceStrings(subject),
      metadata.referenceUrl,
      ...(metadata.referenceUrls || []),
      ...(sourceReference?.referencePages || [])
    ]);
    missing.set(output, {
      kind,
      runtimeKind,
      id: ownerId,
      catalogId: catalog.id || null,
      name: subject.name,
      universe: subject.universe,
      output,
      contexts,
      weapon: subject.weapon || subject.weaponType || null,
      weaponType: subject.weaponType || null,
      color: subject.color || subject.primaryColor || null,
      primaryColor: subject.primaryColor || subject.color || null,
      secondaryColor: subject.secondaryColor || null,
      weaponColor: subject.weaponColor || null,
      type: subject.entityType || subject.type || subject.category || null,
      entityType: subject.entityType || null,
      role: subject.role || subject.combatRole || subject.category || null,
      incarnation: subject.incarnation || subject.continuity || subject.continuityScope || metadata.incarnation || null,
      equipment: subject.equipment || [],
      source: subject.source || subject.sourceType || originalUniverse?.sourceType || null,
      sourceType: originalUniverse?.sourceType || subject.sourceType || null,
      isOriginal: Boolean(originalUniverse) || subject.isOriginal === true || subject.originalContent === true,
      originalUniverseKey: originalUniverse?.key || null,
      originalStatusSource: originalUniverse ? 'src/game/originalUniversesManifest.json' : null,
      contentOrigin: subject.contentOrigin || null,
      originalContent: Boolean(originalUniverse) || subject.originalContent === true,
      canonStatus: subject.canonStatus || metadata.canonStatus || null,
      referenceUrl: subject.referenceUrl || metadata.referenceUrl || referenceUrls[0] || null,
      referenceUrls,
      referenceImages: unique([...(subject.referenceImages || []), ...(metadata.referenceImages || []), ...(sourceReference?.referenceImages || [])]),
      visualAnchor: subject.visualAnchor || metadata.visualAnchor || null,
      portrait: subject.portrait || null,
      depictionRule: subject.depictionRule || subject.adaptationRule || null,
      sourceCandidate: sourceCandidates[0] || null,
      sourceCandidates,
      existingPublicReferences,
      visualReviewStatus: 'pending',
      canonicalFidelityApproved: false,
      owners: [{ kind, runtimeKind, id: ownerId, name: subject.name, universe: subject.universe, contexts }]
    });
  }
  const entries = [...missing.values()];
  const countsByKind = {};
  for (const entry of entries) countsByKind[entry.kind] = (countsByKind[entry.kind] || 0) + 1;
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    baseline: CHARACTER_PNG_BASELINE,
    policy: {
      scope: 'Missing character images resolved from the current runtime databases and sprite resolver functions.',
      referenceAvailability: 'Recorded URLs and present local images are candidates; their content and incarnation are not automatically approved.',
      sourceCandidateMatching: 'Exact character name and universe only; no fuzzy identity substitution.',
      visualReviewStatus: 'pending',
      canonicalFidelityApproved: false,
      rasterAssetsModified: false,
      originalUniverseIdentity: 'Exact runtime universe match to an authored originalUniversesManifest entry with sourceType original and isOriginal true; no visual fidelity approval follows.',
      productionFormat: 'PNG character sheets; this inventory does not generate images or CSS.',
      finalBossContext: 'Matrix, as injected by GameCanvas for finalGameBoss missions.'
    },
    summary: {
      heroes: HEROES_DB.length,
      baselineMissingUniqueOutputs: CHARACTER_PNG_BASELINE.missingUniqueOutputs,
      actualMissingUniqueOutputs: entries.length,
      missingUniqueOutputs: entries.length,
      countsByKind: { hero: 0, enemy: 0, boss: 0, ...countsByKind },
      runtime: Object.fromEntries(Object.entries(runtimeCounts).map(([kind, counts]) => [kind, {
        declarations: counts.declarations,
        uniqueOutputs: counts.uniqueOutputs.size,
        missingOutputs: counts.missingOutputs.size
      }])),
      exactExistingHeroCandidates: entries.filter(entry => entry.sourceCandidate).length,
      entriesWithExistingPublicReferences: entries.filter(entry => entry.existingPublicReferences.length).length,
      entriesWithRecordedSourceUrls: entries.filter(entry => entry.referenceUrls.length).length,
      entriesWithVisualAnchor: entries.filter(entry => entry.visualAnchor).length,
      originalUniverseMissingOutputs: entries.filter(entry => entry.originalStatusSource).length,
      visualReviewPending: entries.length
    },
    entries
  };
};

const main = async () => {
  const args = process.argv.slice(2);
  let root = defaultRoot;
  let output;
  let summaryOnly = false;
  for (let index = 0; index < args.length; index++) {
    const flag = args[index];
    if (flag === '--root' || flag === '--output') {
      const value = args[++index];
      if (!value || value.startsWith('--')) throw new Error(`A value is required for ${flag}`);
      if (flag === '--root') root = value;
      else output = value;
    } else if (flag === '--summary') summaryOnly = true;
    else if (flag === '--help') {
      console.log('Usage: node scripts/missingCharacterImageInventory.mjs [--root REPO] [--output INVENTORY.json] [--summary]');
      return;
    } else throw new Error(`Unknown argument: ${flag}`);
  }
  const inventory = await buildMissingCharacterImageInventory({ root });
  if (output) {
    const destination = path.resolve(output);
    if (path.extname(destination).toLowerCase() !== '.json') throw new Error('--output must name an inventory JSON file; raster assets are never written.');
    const protectedManifests = ['sprite-manifest.json', 'sprite-reference-sources.json'];
    if (protectedManifests.includes(path.basename(destination))) throw new Error('The inventory cannot replace a raster sprite manifest or source-reference registry.');
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.writeFile(destination, `${JSON.stringify(inventory)}\n`);
    console.log(JSON.stringify({ output: destination, ...inventory.summary }));
  } else console.log(JSON.stringify(summaryOnly ? { baseline: inventory.baseline, ...inventory.summary } : inventory));
};

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
