import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  existsSync,
  readFileSync,
  statSync,
  writeFileSync
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const catalogPath = path.join(projectRoot, 'docs/rift-dossiers/catalog.json');
const ledgerPath = path.join(
  projectRoot,
  'public/images/rift-dossiers/openai/openai-prompts.jsonl'
);
const apply = process.argv.includes('--apply');

const sha256 = value => createHash('sha256').update(value).digest('hex');
const readPngDimensions = file => {
  assert.equal(
    file.subarray(0, 8).toString('hex'),
    '89504e470d0a1a0a',
    'Campaign source must retain a valid PNG signature'
  );
  return {
    width: file.readUInt32BE(16),
    height: file.readUInt32BE(20)
  };
};

assert.equal(existsSync(catalogPath), true, 'Missing rift-dossier catalog');
assert.equal(existsSync(ledgerPath), true, 'Missing rift-dossier provenance ledger');

const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
const campaignEntries = catalog.entrees.filter(entry => entry.famille === 'campagne-oc');
assert.equal(campaignEntries.length, 12, 'Expected exactly 12 campaign dossier entries');

const originalText = readFileSync(ledgerPath, 'utf8');
const hadTrailingNewline = originalText.endsWith('\n');
const ledgerEntries = originalText
  .split(/\r?\n/u)
  .filter(Boolean)
  .map(line => JSON.parse(line));
const migratedImageHashes = [];
let migratedCount = 0;

for (const campaign of campaignEntries) {
  const matchingIndexes = ledgerEntries
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => entry.output === campaign.cheminCibleDedie);
  assert.equal(
    matchingIndexes.length,
    1,
    `${campaign.id}: expected exactly one provenance entry for ${campaign.cheminCibleDedie}`
  );

  const { entry: currentEntry, index } = matchingIndexes[0];
  const imagePath = path.join(
    projectRoot,
    'public',
    campaign.cheminCibleDedie.replace(/^\//u, '')
  );
  assert.equal(existsSync(imagePath), true, `${campaign.id}: campaign PNG is missing`);
  const imageFile = readFileSync(imagePath);
  const dimensions = readPngDimensions(imageFile);
  const imageHash = sha256(imageFile);
  const imageStats = statSync(imagePath);
  migratedImageHashes.push(imageHash);

  if (currentEntry.kind === 'rift-dossier-thumbnail') {
    assert.equal(currentEntry.missionId, campaign.id, `${campaign.id}: mission drift`);
    assert.equal(currentEntry.prompt, campaign.promptOpenAI, `${campaign.id}: prompt drift`);
    assert.equal(
      currentEntry.generation?.promptSha256,
      sha256(campaign.promptOpenAI),
      `${campaign.id}: prompt hash drift`
    );
    assert.equal(currentEntry.image?.sha256, imageHash, `${campaign.id}: image hash drift`);
    assert.equal(
      currentEntry.generation?.provider,
      'OpenAI',
      `${campaign.id}: provider drift`
    );
    assert.equal(
      currentEntry.generation?.interface,
      'built-in image_gen',
      `${campaign.id}: interface drift`
    );
    continue;
  }

  assert.equal(apply, true, `${campaign.id}: legacy campaign provenance still requires --apply`);
  assert.equal(currentEntry.kind, 'rift-dossier-art', `${campaign.id}: unexpected legacy kind`);
  assert.equal(currentEntry.source, 'openai', `${campaign.id}: legacy provider is not OpenAI`);
  assert.equal(currentEntry.missionId, campaign.id, `${campaign.id}: legacy mission drift`);
  assert.equal(currentEntry.prompt, campaign.promptOpenAI, `${campaign.id}: legacy prompt drift`);
  assert.equal(currentEntry.width, dimensions.width, `${campaign.id}: legacy width drift`);
  assert.equal(currentEntry.height, dimensions.height, `${campaign.id}: legacy height drift`);

  ledgerEntries[index] = {
    schemaVersion: 1,
    kind: 'rift-dossier-thumbnail',
    assetId: path.basename(campaign.cheminCibleDedie, '.png'),
    output: campaign.cheminCibleDedie,
    sourceImage: {
      fileName: path.basename(imagePath),
      format: 'PNG',
      width: dimensions.width,
      height: dimensions.height,
      sha256: imageHash
    },
    generation: {
      provider: 'OpenAI',
      interface: 'built-in image_gen',
      model: 'built-in/imagegen',
      generatedAt: imageStats.mtime.toISOString(),
      promptSha256: sha256(campaign.promptOpenAI)
    },
    processing: {
      pipeline: 'scripts/migrateLegacyCampaignRiftProvenance.mjs',
      backend: 'direct-original-openai-png',
      fit: 'none'
    },
    image: {
      format: 'PNG',
      width: dimensions.width,
      height: dimensions.height,
      bytes: imageFile.byteLength,
      sha256: imageHash
    },
    installedAt: imageStats.mtime.toISOString(),
    missionId: campaign.id,
    prompt: campaign.promptOpenAI,
    migration: {
      fromKind: currentEntry.kind,
      fromSource: currentEntry.source,
      pixelDataChanged: false
    }
  };
  migratedCount += 1;
}

assert.equal(
  new Set(migratedImageHashes).size,
  campaignEntries.length,
  'Campaign dossier bitmaps must remain distinct'
);

if (apply && migratedCount > 0) {
  const serialized = ledgerEntries.map(entry => JSON.stringify(entry)).join('\n')
    + (hadTrailingNewline ? '\n' : '');
  writeFileSync(ledgerPath, serialized, 'utf8');
}

console.log(JSON.stringify({
  checked: campaignEntries.length,
  migrated: migratedCount,
  mode: apply ? 'apply' : 'check',
  distinctBitmaps: new Set(migratedImageHashes).size
}));
