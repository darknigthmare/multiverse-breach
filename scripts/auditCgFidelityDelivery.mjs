import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { HEROES_DB } from '../src/game/heroes.js';
import { CG_CATALOG } from '../src/game/cg/cgCatalog.js';
import { CG_GALLERY_CATALOG, CG_ROSTER_CATALOG } from '../src/game/cg/cgRosterCatalog.js';
import { createCgRevisionRegistry, resolveCgVersions, resolveCurrentCgMedia } from '../src/game/cg/cgRevisions.js';

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const OUTPUT = 'docs/cg/fidelity-delivery-2026-10-18.json';
const MANIFEST = 'public/cg/cg-manifest.json';
const REVISIONS = 'src/game/cg/cgRevisions.generated.json';
const ROSTER = 'src/game/cg/cgRosterArtwork.generated.json';
// Captured before this delivery. These pins prevent a rebuilt manifest from
// silently accepting overwritten historical assets or altered pilot identities.
const BASELINE_MANIFEST_SHA256 = 'd1432abdcaa07edfb654cfd1ef7b2f837a7ec35c6f05da57f2103f11fd236bee';
const BASELINE_CATALOG_SHA256 = '9a707ea834b5ab9c67f91a818ce0a242d117044c28cf47fedd9dbfff7ce4a30d';
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const read = name => readFile(path.join(ROOT, name));
const readJson = async name => JSON.parse(await read(name));
const safePublicCgPath = assetPath => {
  assert.equal(typeof assetPath, 'string');
  assert.match(assetPath, /^\/cg\/[a-z0-9/.-]+\.(png|webp)$/);
  assert.equal(assetPath.includes('..'), false, `CG asset traversal: ${assetPath}`);
  return path.join(ROOT, 'public', assetPath.replace(/^\//, ''));
};

function assertNoPrivateRuntimePaths(value, location) {
  if (typeof value === 'string') {
    assert.equal(/(?:^|[\s"'(])(?:\.?tmp\/|\.tmp\/|\/tmp\/|\/mnt\/data\/|\/workspace\/|\/home\/|sediment:\/\/|file:\/\/)/i.test(value), false, `Private native path in runtime metadata: ${location}`);
    return;
  }
  if (Array.isArray(value)) value.forEach((entry, index) => assertNoPrivateRuntimePaths(entry, `${location}[${index}]`));
  else if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      assert.equal(/^(privateProvenancePath|nativeSourcePath|sourcePaths|referenced_image_paths)$/.test(key), false, `Private-only runtime field: ${location}.${key}`);
      assertNoPrivateRuntimePaths(nested, `${location}.${key}`);
    }
  }
}

export async function auditCgFidelityDelivery() {
  const manifestBytes = await read(MANIFEST);
  const catalogBytes = await read('src/game/cg/cgCatalog.js');
  const manifest = JSON.parse(manifestBytes);
  assert.equal(sha256(manifestBytes), BASELINE_MANIFEST_SHA256, 'The historical 83-CG manifest was modified.');
  assert.equal(sha256(catalogBytes), BASELINE_CATALOG_SHA256, 'The historical CG catalog source was modified.');
  assert.equal(manifest.entries.length, 83);
  assert.equal(manifest.total, 83);
  assert.deepEqual(manifest.entries.map(entry => entry.id), CG_CATALOG.map(entry => entry.id));

  const [revisionManifest, rosterManifest] = await Promise.all([readJson(REVISIONS), readJson(ROSTER)]);
  const registry = createCgRevisionRegistry(revisionManifest, CG_GALLERY_CATALOG);
  assert.equal(rosterManifest.schemaVersion, 1);
  assert.equal(rosterManifest.entries.length, CG_ROSTER_CATALOG.length);
  assert.equal(new Set(CG_GALLERY_CATALOG.map(entry => entry.id)).size, CG_GALLERY_CATALOG.length);
  assertNoPrivateRuntimePaths(revisionManifest, REVISIONS);
  assertNoPrivateRuntimePaths(rosterManifest, ROSTER);
  assertNoPrivateRuntimePaths(CG_GALLERY_CATALOG, 'CG_GALLERY_CATALOG');

  const inspected = new Map();
  const pathOwners = new Map();
  const hashOwners = new Map();
  const backgroundOwners = new Map();
  const baseline = [];
  const additions = [];
  const revisions = [];
  const inspection = async (assetPath, variant, owner, expected = null) => {
    assert.equal(pathOwners.has(assetPath), false, `Registered CG assets must have separate paths: ${assetPath}`);
    pathOwners.set(assetPath, owner);
    const bytes = await readFile(safePublicCgPath(assetPath));
    assert.ok(bytes.length > 0, `Empty CG file: ${assetPath}`);
    const metadata = await sharp(bytes, { failOn: 'error' }).metadata();
    const actual = { path: assetPath, sha256: sha256(bytes), bytes: bytes.length, width: metadata.width, height: metadata.height, format: metadata.format, channels: metadata.channels };
    assert.equal(metadata.hasAlpha, false, `${assetPath}: no alpha`);
    assert.equal(metadata.channels, 3, `${assetPath}: RGB`);
    assert.equal(metadata.width * 4, metadata.height * 3, `${assetPath}: exact 3:4 ratio`);
    if (variant === 'source') {
      assert.equal(metadata.format, 'png');
      assert.ok(metadata.width >= 1000 && metadata.height >= 1300);
    } else {
      assert.equal(metadata.format, 'webp');
      assert.equal(metadata.width, variant === 'master' ? 1536 : 384);
      assert.equal(metadata.height, variant === 'master' ? 2048 : 512);
    }
    if (expected) {
      for (const field of ['path', 'sha256', 'bytes', 'width', 'height', 'format']) assert.equal(actual[field], expected[field], `${assetPath}: ${field} differs from the registered evidence`);
    }
    assert.equal(hashOwners.has(actual.sha256), false, `${assetPath}: bytes duplicate another delivered file (${hashOwners.get(actual.sha256)})`);
    hashOwners.set(actual.sha256, assetPath);
    inspected.set(assetPath, actual);
    return actual;
  };
  const registerBackground = (backgroundId, cgId) => {
    assert.match(backgroundId, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${cgId}: backgroundId is required`);
    assert.ok(!backgroundOwners.has(backgroundId) || backgroundOwners.get(backgroundId) === cgId, `${backgroundId}: shared by different CG identities`);
    backgroundOwners.set(backgroundId, cgId);
  };
  const inspectThree = async (paths, owner, evidence = null) => {
    const assets = {};
    for (const variant of ['source', 'master', 'thumbnail']) assets[variant] = await inspection(paths[variant], variant, owner, evidence?.[variant]);
    return assets;
  };

  for (const entry of manifest.entries) {
    baseline.push({ id: entry.id, assets: await inspectThree(Object.fromEntries(Object.entries(entry.assets).map(([variant, asset]) => [variant, asset.path])), entry.id, entry.assets) });
  }
  assert.equal(inspected.size, 249, 'Exactly 249 historical files must remain unchanged.');
  const baselineAssetSetSha256 = sha256(Buffer.from(JSON.stringify(baseline)));

  const heroIds = new Set(['player_anchor', ...HEROES_DB.map(hero => hero.id)]);
  const newPoseDescriptions = new Map();
  for (const entry of rosterManifest.entries) {
    assert.ok(heroIds.has(entry.characterId), `${entry.id}: unknown playable hero`);
    assert.equal(entry.unlock.heroId, entry.characterId);
    assert.equal(entry.source, 'openai');
    assert.equal(entry.generationMode, 'openai-imagegen-built-in');
    registerBackground(entry.backgroundId, entry.id);
    assert.ok(entry.promptFile && entry.referenceReviewFile, `${entry.id}: prompt and reference review evidence required`);
    await Promise.all([read(entry.promptFile), read(entry.referenceReviewFile)]);
    const poseDescription = entry.poseBrief || entry.poseDescription || null;
    if (poseDescription) {
      const otherPoses = newPoseDescriptions.get(entry.characterId) || new Set();
      assert.equal(otherPoses.has(poseDescription), false, `${entry.id}: same written pose as another CG for this character`);
      otherPoses.add(poseDescription);
      newPoseDescriptions.set(entry.characterId, otherPoses);
    }
    const assets = await inspectThree(Object.fromEntries(Object.entries(entry.assets).map(([variant, asset]) => [variant, asset.path])), entry.id, entry.assets);
    additions.push({ id: entry.id, characterId: entry.characterId, type: entry.type, backgroundId: entry.backgroundId, poseId: entry.poseId || null, poseDescription, visualReviewStatus: entry.visualReview?.status || 'not-recorded', canonicalFidelityApproved: entry.visualReview?.canonicalFidelityApproved === true, assets });
  }
  const definitionById = new Map(CG_GALLERY_CATALOG.map(entry => [entry.id, entry]));
  for (const revision of revisionManifest.revisions) {
    const definition = definitionById.get(revision.cgId);
    assert.ok(definition);
    registerBackground(revision.backgroundId, revision.cgId);
    const assets = await inspectThree({ source: revision.sourcePath, master: revision.imagePath, thumbnail: revision.thumbnailPath }, `${revision.cgId}/${revision.revisionId}`);
    revisions.push({ cgId: revision.cgId, revisionId: revision.revisionId, characterId: definition.characterId, type: definition.type, backgroundId: revision.backgroundId, poseId: revision.poseId || null, poseDescription: revision.poseBrief || revision.poseDescription || null, assets });
  }

  const currentGallery = [];
  const latestCorrectionIds = new Set();
  for (const definition of CG_GALLERY_CATALOG) {
    const locked = resolveCurrentCgMedia(definition, { unlockedHeroes: [] }, registry);
    assert.deepEqual(locked, { imagePath: null, thumbnailPath: null }, `${definition.id}: locked media must stay absent`);
    assert.deepEqual(resolveCgVersions(definition, { unlockedHeroes: [] }, registry), []);
    const versions = resolveCgVersions(definition, { unlockedHeroes: [definition.characterId] }, registry);
    assert.equal(versions.length, 1 + (registry[definition.id]?.length || 0));
    assert.equal(versions[0].isCurrent, true);
    const current = versions[0];
    const currentRevision = revisions.find(entry => entry.cgId === definition.id && entry.revisionId === current.revisionId);
    const roster = additions.find(entry => entry.id === definition.id);
    if (currentRevision) latestCorrectionIds.add(definition.id);
    const assets = {
      source: inspected.get(current.sourcePath),
      master: inspected.get(current.imagePath),
      thumbnail: inspected.get(current.thumbnailPath)
    };
    assert.ok(Object.values(assets).every(Boolean), `${definition.id}: current media must reference inspected registered files`);
    currentGallery.push({ cgId: definition.id, characterId: definition.characterId, type: definition.type, revisionId: current.revisionId, origin: currentRevision ? 'current-correction' : roster ? 'new-roster' : 'unchanged-pilot', backgroundId: currentRevision?.backgroundId || roster?.backgroundId || null, poseId: currentRevision?.poseId || roster?.poseId || null, poseDescription: currentRevision?.poseDescription || roster?.poseDescription || null, assets });
  }
  const latestCorrections = currentGallery.filter(entry => entry.origin === 'current-correction');
  const currentNewFiles = [...latestCorrections, ...currentGallery.filter(entry => entry.origin === 'new-roster')].flatMap(entry => Object.values(entry.assets));
  assert.equal(new Set(currentNewFiles.map(asset => asset.path)).size, currentNewFiles.length);
  const currentPosesByHero = new Map();
  for (const entry of currentGallery.filter(entry => entry.origin !== 'unchanged-pilot' && entry.poseDescription)) {
    const descriptions = currentPosesByHero.get(entry.characterId) || new Set();
    assert.equal(descriptions.has(entry.poseDescription), false, `${entry.cgId}: same written pose as another current CG for this character`);
    descriptions.add(entry.poseDescription);
    currentPosesByHero.set(entry.characterId, descriptions);
  }
  const missingPoseDescriptions = [...latestCorrections, ...currentGallery.filter(entry => entry.origin === 'new-roster')].filter(entry => !entry.poseDescription).map(entry => entry.cgId);
  return {
    schemaVersion: 1,
    date: '2026-10-18',
    generator: 'scripts/auditCgFidelityDelivery.mjs',
    scope: 'Only the published baseline and explicitly registered roster/revision deliveries. Current counts select the latest revision of each CG; unregistered trials are never counted.',
    baselineProof: { hashCGbaseline: BASELINE_MANIFEST_SHA256, manifestPath: MANIFEST, catalogSourceSha256: BASELINE_CATALOG_SHA256, baselineAssetSetSha256, originalCgIds: baseline.map(entry => entry.id), originalCgCount: 83, originalFileCount: 249, allOriginalFilesMatchPinnedManifest: true },
    summary: {
      originalCgCount: 83,
      originalFilesPreserved: 249,
      newRosterCgCount: additions.length,
      newRosterFileCount: additions.length * 3,
      registeredRevisionCount: revisions.length,
      registeredRevisionFileCount: revisions.length * 3,
      latestCorrectedCgCount: latestCorrectionIds.size,
      latestCorrectionFileCount: latestCorrectionIds.size * 3,
      currentAdditionalImages: currentNewFiles.length / 3,
      currentAdditionalFiles: currentNewFiles.length,
      retainedIntermediateRevisionVariants: revisions.length - latestCorrectionIds.size,
      currentGalleryCgCount: currentGallery.length,
      currentGalleryFileCount: currentGallery.length * 3,
      totalRegisteredFileCount: inspected.size,
      distinctRegisteredFileHashes: hashOwners.size,
      distinctDeliveredBackgroundIds: backgroundOwners.size,
      unregisteredExperimentFilesCounted: 0,
      privateRuntimePathsFound: 0,
      currentAdditionalCgWithoutWrittenPose: missingPoseDescriptions.length
    },
    limits: {
      canonicalFidelityCertifiedByThisAudit: false,
      distinctPosesCertifiedByHashes: false,
      distinctBackgroundsCertifiedByIdentifiers: false,
      explanation: 'Hashes establish file preservation and byte uniqueness only. Written pose/background metadata must still be compared visually with the image and source. No 1:1 fidelity approval is inferred.',
      originalUncorrectedBackgroundsVisuallyAudited: false,
      missingPoseDescriptions
    },
    currentGallery,
    registeredRevisions: revisions,
    newRoster: additions,
    baseline
  };
}

async function main() {
  const valueAfter = flag => {
    const index = process.argv.indexOf(flag);
    if (index < 0) return null;
    assert.ok(process.argv[index + 1] && !process.argv[index + 1].startsWith('--'), `Missing value after ${flag}`);
    return process.argv[index + 1];
  };
  const output = valueAfter('--output') || OUTPUT;
  assert.match(output, /^docs\/cg\/[a-zA-Z0-9_.-]+\.json$/, 'Write audit reports inside docs/cg only');
  const report = await auditCgFidelityDelivery();
  const date = valueAfter('--date');
  if (date) {
    assert.match(date, /^\d{4}-\d{2}-\d{2}$/);
    report.date = date;
  }
  if (process.argv.includes('--write')) await writeFile(path.join(ROOT, output), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ ...report.summary, hashCGbaseline: report.baselineProof.hashCGbaseline, reportWritten: process.argv.includes('--write') }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
