import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { listAssetSourceEntries, listGitAssetSources, projectAssetPath } from './dlcAssetPaths.mjs';
import { collectCommonUiAssetReferences } from './dlcCommonUiAssets.mjs';

// In a checkout, inventory paths come from its Git index even when files are
// absent in a sparse checkout. Source exports without usable Git metadata use
// the materialized public tree and must still match the committed inventories.
// Neither mode reads asset bytes or validates LFS hydration/provenance.
const REPO_ROOT = fileURLToPath(new URL('../', import.meta.url));
const CLASSIFICATION_SCOPE = 'Organizational affiliation from directory names and explicit source references; not proof of exclusive usage or artwork validity.';
const sorted = values => [...values].sort();
const slugify = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const assertRelativePath = path => {
  if (typeof path !== 'string' || !path || /[\\:]/.test(path)
    || [...path].some(character => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)
    || path.split('/').some(part => !part || part === '.' || part === '..')) {
    throw new Error(`Expected a canonical repository path: ${JSON.stringify(path)}`);
  }
};

export const listTrackedPublicPaths = root => listGitAssetSources(root)
  .map(sourcePath => `public${projectAssetPath(sourcePath).publicPath}`);

export const readDlcPackManifests = root => readdirSync(resolve(root, 'DLC'), { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => {
    const directory = `DLC/${entry.name}`;
    const manifest = JSON.parse(readFileSync(resolve(root, directory, 'manifest.json'), 'utf8'));
    if (manifest.schemaVersion !== 1 || manifest.directory !== directory || !manifest.id || !manifest.universe
      || !['runtime', 'artwork-only'].includes(manifest.registration) || manifest.assetManifest !== 'assets.json' || !Array.isArray(manifest.modules)) {
      throw new Error(`Invalid DLC manifest: ${directory}/manifest.json`);
    }
    assertRelativePath(directory);
    for (const module of manifest.modules) assertRelativePath(module.path);
    return manifest;
  })
  .sort((a, b) => a.directory < b.directory ? -1 : a.directory > b.directory ? 1 : 0);

const readSource = (root, path) => readFileSync(resolve(root, path), 'utf8');

// These two existing registries contain static object literals. Read only their
// declarations, and fail on unsupported syntax rather than execute game code or
// silently infer an alias from a similar name.
const staticObjectBody = (source, name) => {
  const marker = `export const ${name} = {`;
  const start = source.indexOf(marker);
  const end = source.indexOf('\n};', start);
  if (start < 0 || end < 0) throw new Error(`Expected static ${name} declaration`);
  return source.slice(start + marker.length, end);
};

const staticString = token => {
  if (token.startsWith('"')) return JSON.parse(token);
  if (!token.startsWith("'")) return token;
  const inner = token.slice(1, -1);
  if (/\\[^'\\]/.test(inner)) throw new Error(`Unsupported string escape in ${token}`);
  return inner.replace(/\\(['\\])/g, '$1');
};

export const collectAssetReferences = (root, packs) => {
  const references = new Map();
  const add = (publicPath, universe, basis) => {
    if (!publicPath.startsWith('/') || publicPath.includes('${')) return;
    const entries = references.get(publicPath) || [];
    if (!entries.some(entry => entry.universe === universe && entry.basis === basis)) entries.push({ universe, basis });
    references.set(publicPath, entries);
  };

  for (const { publicPath, sourcePath } of collectCommonUiAssetReferences({ root })) {
    add(publicPath, 'Nexus de Convergence', sourcePath + '#common-ui');
  }

  const boosterSource = 'src/game/portalBoosterCatalog.js';
  const boosterMap = JSON.parse(`{${staticObjectBody(readSource(root, boosterSource), 'BOOSTER_ART_BY_UNIVERSE')}\n}`);
  for (const [universe, publicPath] of Object.entries(boosterMap)) add(publicPath, universe, `${boosterSource}#BOOSTER_ART_BY_UNIVERSE`);

  const rendererSource = 'src/game/renderer.js';
  const renderer = readSource(root, rendererSource);
  const rendererImports = new Map([...renderer.matchAll(/import \* as (\w+) from ['"]\.\.\/\.\.\/(DLC\/[^'"]+)['"]/g)].map(match => [match[1], match[2]]));
  const declaredModules = new Map(packs.flatMap(pack => pack.modules.map(module => [`${pack.directory}/${module.path}`, pack.universe])));
  for (const line of staticObjectBody(renderer, 'OPENAI_BACKDROPS').split('\n')) {
    if (!line.trim() || /^\s*(?:RPG|Tactics|Smash):\s*\{\s*$/.test(line) || /^\s*},?\s*$/.test(line)) continue;
    const pair = line.match(/^\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|[A-Za-z_$][\w$]*):\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")\s*,?\s*$/);
    if (!pair) {
      const delegated = line.match(/^\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|[A-Za-z_$][\w$]*):\s*(\w+)\.createOpenaiBackdrops(?:Rpg|Tactics|Smash)\(\)\s*,?\s*$/);
      if (!delegated || declaredModules.get(rendererImports.get(delegated[2])) !== staticString(delegated[1])) {
        throw new Error(`Unsupported or undeclared DLC OPENAI_BACKDROPS entry: ${line.trim()}`);
      }
      // The imported DLC source is inspected below, with its manifest's universe.
      continue;
    }
    add(staticString(pair[2]), staticString(pair[1]), `${rendererSource}#OPENAI_BACKDROPS`);
  }

  const textureSource = 'src/game/recentUniverseTextureAssets.js';
  const textureTemplates = [...readSource(root, textureSource).matchAll(/(?:src|tacticsSrc):\s*`(\/textures\/recent-universes\/[^`]+)`/g)].map(match => match[1]);
  if (textureTemplates.length !== 2 || textureTemplates.some(template => !template.includes('${entry.key}') || template.replace('${entry.key}', '').includes('${'))) {
    throw new Error('Expected the two explicit recent-universe texture slots');
  }

  for (const pack of packs) {
    for (const module of pack.modules) {
      const sourcePath = `${pack.directory}/${module.path}`;
      const source = readSource(root, sourcePath);
      for (const match of source.matchAll(/(['"])(\/(?:sprites|cg|backgrounds|boosters|textures|reviews|images|visuals|audio)\/[^'"\r\n]+)\1/g)) {
        add(match[2], pack.universe, sourcePath);
      }
      if (module.runtimeAdapter === 'src/game/requestedUniverseWave.js') {
        const keys = [...source.matchAll(/^\s*key:\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")\s*,\s*$/gm)];
        if (keys.length !== 1) throw new Error(`Expected one texture key in ${sourcePath}`);
        const key = staticString(keys[0][1]);
        for (const template of textureTemplates) add(template.replace('${entry.key}', key), pack.universe, `${sourcePath};${textureSource}`);
      }
    }
  }
  return references;
};

const directoryUniverseSlug = path => path.match(/^public\/(?:sprites\/generated\/(?:heroes|bosses|items)|cg|kart|backgrounds\/lore-stages|reviews)\/([^/]+)\//)?.[1];

const historicalDirectoryReason = new Map([
  ['alien-1979', 'historical-directory-without-current-universe-alias'],
  ['hellraiser-alternate', 'historical-directory-without-current-universe-alias'],
  ['buckhead', 'historical-bucket-guitar-echo-identity-not-buckethead'],
  ['matrix', 'global-final-boss-directory-not-the-matrix-dlc']
]);

export const buildDlcAssetInventory = ({ packs, publicPaths, sourcePaths = new Map(), references = new Map(), campaignUniverses = [] }) => {
  if (!packs.length || !publicPaths.length) throw new Error('DLC manifests and tracked public paths must be non-empty');
  if (new Set(publicPaths).size !== publicPaths.length) throw new Error('Duplicate public paths in Git index');
  if (new Set(packs.map(pack => pack.universe)).size !== packs.length || new Set(packs.map(pack => pack.id)).size !== packs.length) {
    throw new Error('Duplicate DLC universe or id');
  }
  const packByUniverse = new Map(packs.map(pack => [pack.universe, pack]));
  const packByDirectory = new Map(packs.map(pack => [pack.directory, pack]));
  const universeBySlug = new Map();
  for (const universe of ['Nexus de Convergence', ...campaignUniverses, ...packByUniverse.keys()]) {
    const slug = slugify(universe);
    if (universeBySlug.has(slug)) throw new Error(`Ambiguous universe directory slug: ${slug}`);
    universeBySlug.set(slug, universe);
  }
  const campaign = new Set(campaignUniverses);
  const manifests = new Map(packs.map(pack => [pack.directory, {
    schemaVersion: 1,
    universe: pack.universe,
    classificationScope: CLASSIFICATION_SCOPE,
    assets: [],
    sharedDependencies: []
  }]));
  const shared = [];
  const reasonCounts = {};

  for (const logicalPath of sorted(publicPaths)) {
    assertRelativePath(logicalPath);
    if (!logicalPath.startsWith('public/')) throw new Error(`Expected public/ path: ${logicalPath}`);
    const publicPath = logicalPath.slice('public'.length);
    const sourcePath = sourcePaths.get(logicalPath) || logicalPath;
    assertRelativePath(sourcePath);
    if (projectAssetPath(sourcePath)?.publicPath !== publicPath) throw new Error(`Invalid asset publication mapping: ${sourcePath} -> ${publicPath}`);
    const ownerDirectory = sourcePath.match(/^(DLC\/[A-Za-z0-9]+)\/assets\//)?.[1];
    const physicalOwner = ownerDirectory ? packByDirectory.get(ownerDirectory) : null;
    if (ownerDirectory && !physicalOwner) throw new Error(`Unknown DLC asset owner: ${sourcePath}`);
    const evidence = references.get(publicPath) || [];
    const slug = directoryUniverseSlug(logicalPath);
    const directoryUniverse = universeBySlug.get(slug);
    const affiliatedUniverses = new Set(evidence.map(entry => entry.universe));
    if (directoryUniverse) affiliatedUniverses.add(directoryUniverse);
    if (physicalOwner) affiliatedUniverses.add(physicalOwner.universe);
    const universe = affiliatedUniverses.size === 1 ? [...affiliatedUniverses][0] : null;
    const pack = packByUniverse.get(universe);
    const historicalReason = historicalDirectoryReason.get(slug);
    const basis = sorted(new Set(evidence.map(entry => entry.basis)));
    if (directoryUniverse) basis.push(`exact-universe-directory:${slug}`);
    if (physicalOwner) basis.push(`canonical-dlc-directory:${physicalOwner.directory}`);

    if (physicalOwner && (pack !== physicalOwner || historicalReason)) {
      throw new Error(`DLC source has shared or ambiguous ownership; keep it in public/: ${sourcePath}`);
    }

    if (pack && !historicalReason) {
      manifests.get(pack.directory).assets.push({
        publicPath,
        sourcePath,
        classificationConfidence: evidence.length || physicalOwner ? 'high' : 'medium',
        basis
      });
      continue;
    }

    const reason = historicalReason || (affiliatedUniverses.size > 1 ? 'multiple-universe-references'
      : universe === 'Nexus de Convergence' ? 'base-game'
        : campaign.has(universe) ? 'original-campaign'
          : universe ? 'unregistered-runtime-key' : 'shared-or-unclassified');
    reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
    shared.push({ publicPath, sourcePath, reason, ...(basis.length ? { basis } : {}),
      ...(affiliatedUniverses.size ? { referencedBy: sorted(affiliatedUniverses) } : {}) });
    for (const dependencyUniverse of affiliatedUniverses) {
      const dependentPack = packByUniverse.get(dependencyUniverse);
      if (dependentPack) manifests.get(dependentPack.directory).sharedDependencies.push(publicPath);
    }
  }

  return {
    manifests,
    sharedManifest: {
      schemaVersion: 1,
      classificationScope: CLASSIFICATION_SCOPE,
      sharedDependencyCoverage: 'Explicit static references, common UI literals and directory affiliations only; dynamic UI and common engine dependencies are not exhaustively inferred.',
      distribution: {
        dlcManifests: packs.length,
        trackedPublicPaths: publicPaths.length,
        assignedToDlc: publicPaths.length - shared.length,
        unclaimedByDlc: shared.length,
        unclaimedReasons: Object.fromEntries(sorted(Object.keys(reasonCounts)).map(reason => [reason, reasonCounts[reason]]))
      },
      assets: shared
    }
  };
};

const IGNORE_BEGIN = '# BEGIN GENERATED DLC PUBLICATION';
const IGNORE_END = '# END GENERATED DLC PUBLICATION';

export const renderDlcPublicationIgnore = (current, publicPaths) => {
  const paths = sorted(new Set(publicPaths));
  for (const path of paths) {
    if (!path.startsWith('/')) throw new Error(`Expected absolute public URL: ${path}`);
    assertRelativePath(`public${path}`);
  }
  const start = current.indexOf(IGNORE_BEGIN);
  const end = current.indexOf(IGNORE_END);
  if ((start < 0) !== (end < 0) || (start >= 0 && (end < start || current.indexOf(IGNORE_BEGIN, start + IGNORE_BEGIN.length) >= 0 || current.indexOf(IGNORE_END, end + IGNORE_END.length) >= 0))) {
    throw new Error('Malformed generated DLC publication ignore block');
  }
  if (start < 0 && paths.length === 0) return current;
  const block = [IGNORE_BEGIN,
    '# Generated public copies; canonical resources are tracked in DLC/<Universe>/assets/.',
    ...paths.map(path => `/public${path}`.replace(/[[\]*?!#]/g, '\\$&')),
    IGNORE_END].join('\n');
  if (start < 0) return `${current.replace(/\n*$/, '')}${current ? '\n\n' : ''}${block}\n`;
  return current.slice(0, start) + block + current.slice(end + IGNORE_END.length);
};

export const runDlcAssetManifestBuild = ({ root = REPO_ROOT, write = false } = {}) => {
  const packs = readDlcPackManifests(root);
  const campaignManifest = JSON.parse(readSource(root, 'src/game/originalUniversesManifest.json'));
  const { entries, inputSource } = listAssetSourceEntries(root);
  const publicPaths = entries.map(entry => `public${entry.publicPath}`);
  const sourcePaths = new Map(entries.map(entry => [`public${entry.publicPath}`, entry.sourcePath]));
  const inventory = buildDlcAssetInventory({
    packs,
    publicPaths,
    sourcePaths,
    references: collectAssetReferences(root, packs),
    campaignUniverses: campaignManifest.universes.map(entry => entry.universe)
  });
  const outputs = [...inventory.manifests].map(([directory, manifest]) => [`${directory}/assets.json`, `${JSON.stringify(manifest, null, 2)}\n`]);
  outputs.push(['DLC/shared-assets.json', `${JSON.stringify(inventory.sharedManifest, null, 2)}\n`]);
  const publishedPaths = entries.filter(entry => entry.sourcePath.startsWith('DLC/')).map(entry => entry.publicPath);
  for (const path of ['.gitignore', '.vercelignore']) {
    let current = '';
    try { current = readSource(root, path); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    const expected = renderDlcPublicationIgnore(current, publishedPaths);
    if (current || expected) outputs.push([path, expected]);
  }
  const stale = [];
  for (const [path, expected] of outputs) {
    let current;
    try { current = readSource(root, path); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (current === expected) continue;
    if (write) writeFileSync(resolve(root, path), expected);
    else stale.push(path);
  }
  if (stale.length) throw new Error(`${stale.length} DLC asset inventories or publication ignores are missing or stale. Stage canonical asset changes, then run node scripts/buildDlcAssetManifests.mjs --write.\n${stale.slice(0, 10).join('\n')}`);
  return { ...inventory.sharedManifest.distribution, inputSource };
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.length !== 1 || !['--write', '--check'].includes(args[0])) {
    console.error('Usage: node scripts/buildDlcAssetManifests.mjs --write|--check');
    process.exitCode = 1;
  } else {
    try {
      const distribution = runDlcAssetManifestBuild({ write: args[0] === '--write' });
      console.log(JSON.stringify({ mode: args[0].slice(2), ...distribution }, null, 2));
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}
