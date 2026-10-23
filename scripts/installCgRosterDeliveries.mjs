import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { HEROES_DB } from '../src/game/heroes.js';
import { buildCgId, buildCgPaths, createCgDefinition } from '../src/game/cg/cgSchema.js';
import { ROSTER_CG_SLOTS } from './buildCgRosterProductionPlan.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const REGISTRY = 'src/game/cg/cgRosterArtwork.generated.json';
const readJson = async name => JSON.parse(await readFile(path.resolve(ROOT, name), 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const slotFor = entry => ROSTER_CG_SLOTS.find(slot => slot.types.includes(entry.type))?.slot;
const RUNTIME_FIELDS = new Set([
  'id', 'universeKey', 'universeName', 'characterKey', 'characterId', 'heroId',
  'characterName', 'title', 'type', 'slotNumber', 'family', 'rarity', 'canonStatus',
  'continuityId', 'contentRating', 'ageStatus', 'consentStatus', 'characterReferenceId',
  'promptId', 'promptSummary', 'publishedAt', 'source', 'rightsClass', 'sourceRefs',
  'credits', 'unlock', 'imagePath', 'thumbnailPath', 'generationMode', 'promptFile',
  'referenceReviewFile', 'backgroundId', 'backgroundDescription', 'background',
  'visualReview', 'assets', 'poseId', 'poseBrief', 'poseDescription', 'themeBrief',
  'themeSource', 'historicalCorrectionNote'
]);
const localEvidence = async name => {
  assert.equal(typeof name, 'string');
  const resolved = path.resolve(ROOT, name);
  assert.ok(resolved.startsWith(path.join(ROOT, 'docs', 'cg') + path.sep), `Evidence must be in docs/cg: ${name}`);
  await readFile(resolved);
};

// Merge explicit artist receipts only. Existing definitions and historical
// media never change implicitly, and no planned slot can enter the gallery.
export async function prepareCgRosterDeliveries(receipts) {
  const original = await readJson(REGISTRY);
  assert.equal(original.schemaVersion, 1);
  const merged = structuredClone(original);
  merged.scope = 'Delivered CG artwork and complete additional roster series; the immutable 83 pilot definitions remain in cgCatalog.js.';
  merged.applicability ||= [];
  const addedIds = [];
  for (const receipt of receipts) {
    assert.equal(receipt.schemaVersion, 1);
    assert.ok(Array.isArray(receipt.entries));
    for (const record of receipt.entries) {
      const entry = Object.fromEntries(Object.entries(record).filter(([field]) => RUNTIME_FIELDS.has(field)));
      assert.doesNotMatch(JSON.stringify(entry), /(?:\/workspace\/|\/tmp\/|\.tmp\/|file:\/\/)/, 'Runtime CG metadata must not expose private evidence paths');
      const previous = merged.entries.find(item => item.id === entry.id);
      if (previous) assert.deepEqual(entry, previous, `${entry.id}: modifying an existing CG requires a separate explicit revision`);
      else { merged.entries.push(entry); addedIds.push(entry.id); }
    }
    for (const record of receipt.applicability || []) {
      // Some artist receipts describe all fifteen slots; generated/existing
      // rows are reporting metadata, never additional delivery evidence.
      if (record.status !== 'not-applicable') {
        assert.ok(['generated', 'existing-preserved', 'needs-reference', 'blocked'].includes(record.status), 'Unknown applicability status');
        continue;
      }
      const cell = { ...record, characterId: record.characterId || record.heroId || receipt.characterId || receipt.heroId,
        slot: typeof record.slot === 'number' ? `CG${String(record.slot).padStart(2, '0')}` : record.slot };
      delete cell.heroId;
      assert.doesNotMatch(JSON.stringify(cell), /(?:\/workspace\/|\/tmp\/|\.tmp\/|file:\/\/)/, 'Runtime applicability must not expose private evidence paths');
      const previous = merged.applicability.find(item => item.characterId === cell.characterId && item.slot === cell.slot);
      if (previous) assert.deepEqual(cell, previous, 'Conflicting applicability decisions');
      else merged.applicability.push(cell);
    }
  }
  const heroes = new Set(['player_anchor', ...HEROES_DB.map(hero => hero.id)]);
  const slots = new Set();
  const backgrounds = new Set();
  const poses = new Set();
  const assets = new Set();
  const fingerprints = new Set();
  const baseline = await readJson('public/cg/cg-manifest.json');
  const historicalPaths = new Set(baseline.entries.flatMap(entry => Object.values(entry.assets).map(asset => asset.path)));
  for (const entry of merged.entries) {
    assert.ok(heroes.has(entry.characterId), `Unknown hero: ${entry.characterId}`);
    const definition = createCgDefinition({ ...entry, ...buildCgPaths(entry) });
    assert.equal(entry.id, buildCgId(entry));
    assert.equal(entry.generationMode, 'openai-imagegen-built-in');
    assert.equal(definition.unlock.heroId, entry.characterId);
    const slot = slotFor(entry);
    assert.ok(slot, `Unsupported roster slot: ${entry.type}`);
    const slotKey = `${entry.characterId}/${slot}`;
    assert.equal(slots.has(slotKey), false, `Conflicting selected alternatives: ${slotKey}`);
    slots.add(slotKey);
    assert.match(entry.backgroundId, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(backgrounds.has(entry.backgroundId), false, `Repeated background: ${entry.backgroundId}`);
    backgrounds.add(entry.backgroundId);
    const pose = entry.poseBrief || entry.poseDescription;
    assert.ok(pose?.length > 20, `${entry.id}: written pose or object/environment composition required`);
    const poseKey = `${entry.characterId}/${pose}`;
    assert.equal(poses.has(poseKey), false, `${entry.id}: repeated written pose`);
    poses.add(poseKey);
    await Promise.all([localEvidence(entry.promptFile), localEvidence(entry.referenceReviewFile)]);
    assert.ok(entry.visualReview?.status && entry.visualReview.canonicalFidelityApproved === false, `${entry.id}: record a visual review without inferring a 1:1 certification`);
    for (const field of ['location', 'foreground', 'midground', 'background', 'lighting']) assert.ok(entry.background?.[field]?.length > 15, `${entry.id}: describe ${field}`);
    assert.deepEqual(Object.keys(entry.assets).sort(), ['master', 'source', 'thumbnail']);
    const source = entry.assets.source.path;
    assert.equal(source, entry.assets.master.path.replace(/\.webp$/, '.png'));
    assert.equal(entry.assets.thumbnail.path, entry.assets.master.path.replace(/\.webp$/, '-thumb.webp'));
    for (const [kind, asset] of Object.entries(entry.assets)) {
      assert.ok(asset.path.startsWith(`/cg/${entry.universeKey}/${entry.characterKey}/`));
      assert.match(asset.path, /^\/[a-z0-9/.-]+$/);
      assert.equal(asset.path.includes('..'), false);
      assert.equal(historicalPaths.has(asset.path), false, `Historical asset reuse: ${asset.path}`);
      assert.equal(assets.has(asset.path), false, `Shared asset path: ${asset.path}`);
      assets.add(asset.path);
      const bytes = await readFile(path.join(ROOT, 'public', asset.path));
      const fingerprint = hash(bytes);
      assert.equal(fingerprint, asset.sha256, `${asset.path}: incorrect fingerprint`);
      assert.equal(fingerprints.has(fingerprint), false, `Repeated image bytes: ${asset.path}`);
      fingerprints.add(fingerprint);
      assert.equal(bytes.length, asset.bytes);
      const info = await sharp(bytes).metadata();
      assert.equal(info.channels, 3);
      assert.equal(info.hasAlpha, false);
      assert.equal(info.width, asset.width);
      assert.equal(info.height, asset.height);
      assert.equal(info.format, kind === 'source' ? 'png' : 'webp');
      if (kind === 'source') {
        assert.equal(info.width * 4, info.height * 3);
        assert.ok(info.width >= 1000 && info.height >= 1300);
      } else {
        assert.equal(info.width, kind === 'master' ? 1536 : 384);
        assert.equal(info.height, kind === 'master' ? 2048 : 512);
      }
    }
  }
  const notApplicable = new Set();
  for (const cell of merged.applicability) {
    const key = `${cell.characterId}/${cell.slot}`;
    assert.ok(heroes.has(cell.characterId));
    assert.ok(ROSTER_CG_SLOTS.some(slot => slot.slot === cell.slot));
    assert.equal(cell.status, 'not-applicable');
    assert.ok(cell.reason?.length > 20 && cell.sourceRefs?.length);
    assert.equal(slots.has(key), false, `${key}: cannot be both delivered and N/A`);
    assert.equal(notApplicable.has(key), false, `Repeated N/A: ${key}`);
    notApplicable.add(key);
  }
  return { merged, addedIds };
}

async function main() {
  const receiptNames = process.argv.slice(2).filter(arg => arg !== '--write');
  assert.ok(receiptNames.length, 'Pass one or more delivery receipt JSON files; use --write after successful inspection.');
  const receipts = await Promise.all(receiptNames.map(readJson));
  const { merged, addedIds } = await prepareCgRosterDeliveries(receipts);
  if (process.argv.includes('--write')) await writeFile(path.join(ROOT, REGISTRY), `${JSON.stringify(merged, null, 2)}\n`);
  console.log(JSON.stringify({ addedCg: addedIds.length, totalAdditionalCg: merged.entries.length, reviewedNotApplicable: merged.applicability.length, registryWritten: process.argv.includes('--write'), addedIds }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
