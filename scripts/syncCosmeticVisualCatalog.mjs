import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  existsSync,
  readFileSync,
  readdirSync,
  writeFileSync
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');

export const DEFAULT_COSMETIC_UNIVERSE_ROOT = path.join(
  projectRoot,
  'public',
  'visuals',
  'cosmetics',
  'openai',
  'universes'
);

export const GENERATED_COSMETIC_CATALOG_PATH = path.join(
  projectRoot,
  'src',
  'game',
  'cosmeticVisualPackCatalog.generated.js'
);

export const DEFAULT_COSMETIC_VISUAL_QA_PATH = path.join(
  projectRoot,
  'docs',
  'rift-dossiers',
  'references',
  'universe-cosmetics-visual-qa.json'
);

export const REQUIRED_COSMETIC_WEBPS = Object.freeze({
  hudTheme: Object.freeze({ file: 'hud-theme.webp', width: 1024, heights: [256, 512] }),
  profileTitle: Object.freeze({ file: 'profile-title.webp', width: 1024, heights: [256] }),
  profileBanner: Object.freeze({ file: 'profile-banner.webp', width: 1024, heights: [256] }),
  portalEffect: Object.freeze({ file: 'portal-effects-atlas.webp', width: 1024, heights: [256] }),
  koEffect: Object.freeze({ file: 'ko-effects-atlas.webp', width: 1024, heights: [256] }),
  introPose: Object.freeze({ file: 'intro-poses-atlas.webp', width: 1024, heights: [256] }),
  victoryPose: Object.freeze({ file: 'victory-poses-atlas.webp', width: 1024, heights: [256] })
});

const PILOT_P3_PORTAL_SLUGS = new Set([
  '28-days-later',
  'a-nightmare-on-elm-street',
  'ado',
  'aegea-war-of-the-moirai'
]);

const dossierFile = 'reference-dossier.json';
const p3PortalFile = 'portal-effects-atlas-p3.webp';

export const computeCosmeticPackSha256 = (packDirectory, portalFile) => {
  const fingerprintFiles = [
    ...Object.values(REQUIRED_COSMETIC_WEBPS).map(({ file }) => file),
    ...(portalFile !== REQUIRED_COSMETIC_WEBPS.portalEffect.file ? [portalFile] : [])
  ];
  const hash = createHash('sha256');
  for (const file of fingerprintFiles) {
    hash.update(file, 'utf8');
    hash.update(Buffer.from([0]));
    hash.update(readFileSync(path.join(packDirectory, file)));
    hash.update(Buffer.from([0]));
  }
  return hash.digest('hex');
};

export const readCosmeticVisualQaAcceptances = (
  qaPath = DEFAULT_COSMETIC_VISUAL_QA_PATH
) => {
  let registry;
  try {
    registry = JSON.parse(readFileSync(qaPath, 'utf8'));
  } catch (error) {
    throw new Error(`invalid cosmetic visual QA registry: ${error.message}`, { cause: error });
  }
  assert.equal(registry.schemaVersion, 1, 'cosmetic visual QA schemaVersion must be 1');
  assert.ok(Array.isArray(registry.acceptedPacks), 'cosmetic visual QA acceptedPacks must be an array');
  const acceptances = registry.acceptedPacks.map((entry, index) => {
    const label = `cosmetic visual QA acceptedPacks[${index}]`;
    assert.equal(typeof entry?.universe, 'string', `${label}.universe must be a string`);
    assert.equal(typeof entry?.slug, 'string', `${label}.slug must be a string`);
    assert.match(entry?.packSha256 ?? '', /^[a-f0-9]{64}$/, `${label}.packSha256 must be SHA-256`);
    return {
      universe: entry.universe.trim(),
      slug: entry.slug.trim(),
      packSha256: entry.packSha256
    };
  });
  assert.equal(
    new Set(acceptances.map(({ universe }) => universe)).size,
    acceptances.length,
    'cosmetic visual QA universe values must be unique'
  );
  assert.equal(
    new Set(acceptances.map(({ slug }) => slug)).size,
    acceptances.length,
    'cosmetic visual QA slug values must be unique'
  );
  return acceptances;
};

export const readWebpDimensions = (source, label = 'WebP') => {
  assert.ok(source.length >= 12, `${label}: file is too small`);
  assert.equal(source.toString('ascii', 0, 4), 'RIFF', `${label}: missing RIFF`);
  assert.equal(source.toString('ascii', 8, 12), 'WEBP', `${label}: missing WEBP`);

  let offset = 12;
  while (offset + 8 <= source.length) {
    const type = source.toString('ascii', offset, offset + 4);
    const length = source.readUInt32LE(offset + 4);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    assert.ok(dataEnd <= source.length, `${label}: malformed ${type} chunk`);

    if (type === 'VP8X') {
      assert.ok(length >= 10, `${label}: malformed VP8X header`);
      return {
        width: 1 + source.readUIntLE(dataStart + 4, 3),
        height: 1 + source.readUIntLE(dataStart + 7, 3)
      };
    }
    if (type === 'VP8 ') {
      assert.ok(length >= 10, `${label}: malformed VP8 header`);
      assert.ok(
        source.subarray(dataStart + 3, dataStart + 6).equals(Buffer.from([0x9d, 0x01, 0x2a])),
        `${label}: malformed VP8 frame`
      );
      return {
        width: source.readUInt16LE(dataStart + 6) & 0x3fff,
        height: source.readUInt16LE(dataStart + 8) & 0x3fff
      };
    }
    if (type === 'VP8L') {
      assert.ok(length >= 5, `${label}: malformed VP8L header`);
      assert.equal(source[dataStart], 0x2f, `${label}: malformed VP8L frame`);
      const bits = source.readUInt32LE(dataStart + 1);
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >>> 14) & 0x3fff) + 1
      };
    }
    offset = dataEnd + (length % 2);
  }

  throw new Error(`${label}: image dimensions were not found`);
};

const readCompletePack = (universeRoot, directoryEntry) => {
  const slug = directoryEntry.name;
  const packDirectory = path.join(universeRoot, slug);
  const fileNames = new Set(
    readdirSync(packDirectory, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
  );
  const requiredFiles = [
    dossierFile,
    ...Object.values(REQUIRED_COSMETIC_WEBPS).map(({ file }) => file)
  ];
  if (requiredFiles.some((file) => !fileNames.has(file))) return null;

  const dossierPath = path.join(packDirectory, dossierFile);
  let dossier;
  try {
    dossier = JSON.parse(readFileSync(dossierPath, 'utf8'));
  } catch (error) {
    throw new Error(`${slug}: invalid ${dossierFile}: ${error.message}`, { cause: error });
  }
  const universe = typeof dossier.universeKey === 'string'
    ? dossier.universeKey.trim()
    : '';
  assert.ok(universe, `${slug}: dossier universeKey is required`);

  let hudHeight;
  for (const [kind, contract] of Object.entries(REQUIRED_COSMETIC_WEBPS)) {
    const imagePath = path.join(packDirectory, contract.file);
    const dimensions = readWebpDimensions(readFileSync(imagePath), `${slug}:${kind}`);
    assert.equal(dimensions.width, contract.width, `${slug}:${kind}: incorrect width`);
    assert.ok(
      contract.heights.includes(dimensions.height),
      `${slug}:${kind}: incorrect height ${dimensions.height}`
    );
    if (kind === 'hudTheme') hudHeight = dimensions.height;
  }

  const portalFile = PILOT_P3_PORTAL_SLUGS.has(slug)
    && fileNames.has(p3PortalFile)
    ? p3PortalFile
    : REQUIRED_COSMETIC_WEBPS.portalEffect.file;
  if (portalFile === p3PortalFile) {
    const dimensions = readWebpDimensions(
      readFileSync(path.join(packDirectory, portalFile)),
      `${slug}:portalEffectP3`
    );
    assert.deepEqual(dimensions, { width: 1024, height: 256 });
  }

  return {
    universe,
    slug,
    hudHeight,
    portalFile,
    packSha256: computeCosmeticPackSha256(packDirectory, portalFile)
  };
};

export const collectCompleteUniverseCosmeticPackCandidates = (
  universeRoot = DEFAULT_COSMETIC_UNIVERSE_ROOT
) => {
  if (!existsSync(universeRoot)) return [];
  const packs = readdirSync(universeRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => readCompletePack(universeRoot, entry))
    .filter(Boolean)
    .sort((left, right) => (
      left.universe < right.universe ? -1 : left.universe > right.universe ? 1 : 0
    ));
  const universeKeys = packs.map(({ universe }) => universe);
  assert.equal(
    new Set(universeKeys).size,
    universeKeys.length,
    'cosmetic dossiers must expose unique universeKey values'
  );
  return packs;
};

export const collectCompleteUniverseCosmeticPacks = (
  universeRoot = DEFAULT_COSMETIC_UNIVERSE_ROOT,
  acceptances = readCosmeticVisualQaAcceptances()
) => {
  const candidates = collectCompleteUniverseCosmeticPackCandidates(universeRoot);
  const candidateByUniverse = new Map(candidates.map((pack) => [pack.universe, pack]));
  const acceptedUniverses = new Set();
  for (const acceptance of acceptances) {
    const candidate = candidateByUniverse.get(acceptance.universe);
    assert.ok(candidate, `${acceptance.universe}: visually accepted pack is missing or incomplete`);
    assert.equal(
      candidate.slug,
      acceptance.slug,
      `${acceptance.universe}: visually accepted slug no longer matches`
    );
    assert.equal(
      candidate.packSha256,
      acceptance.packSha256,
      `${acceptance.universe}: visually accepted asset fingerprint is stale; repeat manual visual QA`
    );
    acceptedUniverses.add(acceptance.universe);
  }
  return candidates.filter(({ universe }) => acceptedUniverses.has(universe));
};

export const renderCosmeticVisualCatalog = (packs) => {
  const entries = packs.map((pack) => [
    '  Object.freeze({',
    `    universe: ${JSON.stringify(pack.universe)},`,
    `    slug: ${JSON.stringify(pack.slug)},`,
    `    hudHeight: ${pack.hudHeight},`,
    `    portalFile: ${JSON.stringify(pack.portalFile)},`,
    `    packSha256: ${JSON.stringify(pack.packSha256)}`,
    '  })'
  ].join('\n')).join(',\n');
  return [
    '// Generated by scripts/syncCosmeticVisualCatalog.mjs. Do not edit by hand.',
    'export const GENERATED_UNIVERSE_COSMETIC_PACK_CATALOG = Object.freeze([',
    entries,
    ']);',
    ''
  ].join('\n');
};

const run = () => {
  const unknownArguments = process.argv.slice(2).filter((argument) => argument !== '--check');
  assert.deepEqual(unknownArguments, [], `unknown arguments: ${unknownArguments.join(', ')}`);
  const checkOnly = process.argv.includes('--check');
  const packs = collectCompleteUniverseCosmeticPacks();
  const rendered = renderCosmeticVisualCatalog(packs);
  if (checkOnly) {
    const current = existsSync(GENERATED_COSMETIC_CATALOG_PATH)
      ? readFileSync(GENERATED_COSMETIC_CATALOG_PATH, 'utf8')
      : '';
    assert.equal(
      current,
      rendered,
      'generated cosmetic catalog is stale; run npm run cosmetics:sync'
    );
  } else {
    writeFileSync(GENERATED_COSMETIC_CATALOG_PATH, rendered, 'utf8');
  }
  console.log(`${checkOnly ? 'Checked' : 'Synchronized'} ${packs.length} visually accepted cosmetic packs.`);
};

const isMain = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) run();
