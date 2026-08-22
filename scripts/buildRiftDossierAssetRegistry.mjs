import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const catalogPath = path.join(projectRoot, 'docs/rift-dossiers/catalog.json');
const registryPath = path.join(projectRoot, 'src/game/riftDossierAssets.json');
const riftLedgerPath = path.join(
  projectRoot,
  'public/images/rift-dossiers/openai/openai-prompts.jsonl'
);
const originalUniverseLedgerDirectory = path.join(
  projectRoot,
  'docs/original-universes/openai-image-v2-ledger/entries'
);

const sha256 = value => createHash('sha256').update(value).digest('hex');
const fileSha256 = filePath => sha256(readFileSync(filePath));
const groupBy = (items, keyForItem) => {
  const grouped = new Map();
  items.forEach((item) => {
    const key = keyForItem(item);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(item);
  });
  return grouped;
};

const riftLedgerEntries = existsSync(riftLedgerPath)
  ? readFileSync(riftLedgerPath, 'utf8')
    .split(/\r?\n/u)
    .filter(Boolean)
    .map(line => JSON.parse(line))
  : [];
const riftLedgerByOutput = groupBy(riftLedgerEntries, entry => entry.output);

const originalUniverseLedgerEntries = existsSync(originalUniverseLedgerDirectory)
  ? readdirSync(originalUniverseLedgerDirectory)
    .filter(fileName => fileName.endsWith('.json'))
    .map(fileName => JSON.parse(readFileSync(
      path.join(originalUniverseLedgerDirectory, fileName),
      'utf8'
    )))
  : [];
const originalUniverseLedgerByOutput = groupBy(
  originalUniverseLedgerEntries,
  entry => entry.destination
);

const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
assert.equal(catalog.schemaVersion, 1, 'Unsupported rift-dossier catalog schema');
assert.equal(
  catalog.total,
  Object.values(catalog.comptesParFamille || {})
    .reduce((total, count) => total + count, 0),
  'Rift-dossier catalog total must match its declared family counts'
);
assert.equal(catalog.entrees.length, catalog.total, 'Catalog total is inconsistent');

const entries = catalog.entrees.map((entry) => {
  const publicFile = path.join(
    projectRoot,
    'public',
    entry.cheminCibleDedie.replace(/^\//, '')
  );
  const fileExists = existsSync(publicFile);
  const imageSha256 = fileExists ? fileSha256(publicFile) : null;
  const isOriginalUniverseStage = entry.cheminCibleDedie.startsWith('/images/oc-worlds/v2/');
  const provenanceMatches = isOriginalUniverseStage
    ? (() => {
      const ledgerMatches = originalUniverseLedgerByOutput.get(entry.cheminCibleDedie) || [];
      return ledgerMatches.length === 1
        && ledgerMatches[0].category === 'stage'
        && ledgerMatches[0].generation?.provider === 'OpenAI'
        && ledgerMatches[0].generation?.interface === 'built-in image_gen'
        && ledgerMatches[0].image?.sha256 === imageSha256;
    })()
    : (() => {
      const ledgerMatches = riftLedgerByOutput.get(entry.cheminCibleDedie) || [];
      return ledgerMatches.length === 1
        && String(ledgerMatches[0].missionId) === String(entry.id)
        && ledgerMatches[0].kind === 'rift-dossier-thumbnail'
        && ledgerMatches[0].generation?.provider === 'OpenAI'
        && ledgerMatches[0].generation?.interface === 'built-in image_gen'
        && ledgerMatches[0].generation?.promptSha256 === sha256(entry.promptOpenAI)
        && ledgerMatches[0].image?.sha256 === imageSha256;
    })();

  return {
    stageId: entry.id,
    assetPath: entry.cheminCibleDedie,
    status: fileExists && provenanceMatches ? 'available' : 'pending'
  };
});

assert.equal(
  new Set(entries.map(entry => String(entry.stageId))).size,
  entries.length,
  'Registry stage IDs must be unique'
);
assert.equal(
  new Set(entries.map(entry => entry.assetPath)).size,
  entries.length,
  'Registry asset paths must be unique'
);
const availableImageHashes = entries
  .filter(entry => entry.status === 'available')
  .map(entry => fileSha256(path.join(
    projectRoot,
    'public',
    entry.assetPath.replace(/^\//, '')
  )));
assert.equal(
  new Set(availableImageHashes).size,
  availableImageHashes.length,
  'Every available rift dossier must have a distinct bitmap'
);

const registry = {
  schemaVersion: 1,
  source: 'openai',
  assetRoot: '/images/rift-dossiers/openai/',
  entries
};
const serialized = `${JSON.stringify(registry, null, 2)}\n`;
const checkOnly = process.argv.includes('--check');

if (checkOnly) {
  assert.equal(existsSync(registryPath), true, 'Missing generated rift-dossier registry');
  assert.equal(
    readFileSync(registryPath, 'utf8'),
    serialized,
    'Generated rift-dossier registry is stale'
  );
} else {
  writeFileSync(registryPath, serialized, 'utf8');
}

const available = entries.filter(entry => entry.status === 'available').length;
const pending = entries.length - available;
console.log(
  `Rift dossier registry ${checkOnly ? 'validated' : 'generated'}: `
  + `${entries.length} declared, ${available} available, ${pending} pending`
);
