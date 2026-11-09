import { createHash } from 'node:crypto';
import { lstat, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const countKeys = { hero: 'heroes', enemy: 'enemies', boss: 'bosses', trial: 'trials', item: 'items', finale: 'finales', stage: 'stages' };
const statusPolicy = {
  available: 'Recorded file availability; independent of visual fidelity.',
  verifiedOpenAi: 'Catalog prompt, recorded generation prompt, provider, generation identifier and installed image hash match the latest provenance record. This is not approval of visual fidelity.',
  visualReview: 'Changed hero sprite records require an independent incarnation and reference-image review. No 1:1 fidelity approval is issued by reconciliation.'
};

export const sha256 = value => createHash('sha256').update(value).digest('hex');
const keyOf = entry => `${entry.kind}:${entry.id}`;
const normalized = value => JSON.stringify(value);

export const verifyHeroSpriteProof = ({ entry, catalog, record, image }) => {
  const problems = [];
  if (!catalog || keyOf(catalog) !== keyOf(entry) || catalog.output !== entry.output) problems.push('catalog-identity-mismatch');
  if (!record || keyOf(record) !== keyOf(entry) || record.output !== entry.output) problems.push('record-identity-mismatch');
  if (!Buffer.isBuffer(image) || image.length < 26) problems.push('missing-image');
  if (problems.length) return { verified: false, problems };

  const catalogHash = typeof catalog.prompt === 'string' ? sha256(catalog.prompt) : null;
  if (!catalogHash || catalogHash !== (record.catalogPromptSha256 || record.promptSha256)) problems.push('catalog-prompt-hash-mismatch');
  if (record.catalogPrompt != null && sha256(record.catalogPrompt) !== record.catalogPromptSha256) problems.push('recorded-catalog-prompt-hash-mismatch');
  if (record.prompt != null && sha256(record.prompt) !== record.promptSha256) problems.push('recorded-prompt-hash-mismatch');
  if (record.schemaVersion >= 2) {
    if (typeof record.generationPrompt !== 'string' || !record.generationPrompt.trim()) problems.push('missing-generation-prompt');
    else if (sha256(record.generationPrompt) !== record.generationPromptSha256) problems.push('generation-prompt-hash-mismatch');
  }
  if (record.generation?.provider !== 'OpenAI' || record.generation?.interface !== 'built-in image_gen') problems.push('unsupported-generation-provider');
  const generationId = String(record.generation?.generationId || '');
  if (!/^exec-[a-z0-9-]+$/iu.test(generationId)
    && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(generationId)) problems.push('invalid-generation-identifier');
  if (sha256(image) !== record.image?.sha256) problems.push('installed-image-hash-mismatch');
  if (!image.subarray(0, 8).equals(pngSignature)) problems.push('invalid-png');
  else {
    const width = image.readUInt32BE(16);
    const height = image.readUInt32BE(20);
    const expectedWidth = entry.frame.width * entry.frame.columns;
    const expectedHeight = entry.frame.height * entry.frame.rows.length;
    if (width !== expectedWidth || height !== expectedHeight || image[25] !== 6) problems.push('invalid-sprite-sheet-geometry');
    if (width !== record.image?.width || height !== record.image?.height || record.image?.channels !== 4) problems.push('recorded-image-geometry-mismatch');
  }
  return { verified: problems.length === 0, problems };
};

const recount = (entries, predicate) => {
  const counts = Object.fromEntries(Object.values(countKeys).map(key => [key, 0]));
  counts.total = 0;
  for (const entry of entries) {
    if (!countKeys[entry.kind]) throw new Error(`Unknown sprite kind: ${entry.kind}`);
    if (!predicate(entry)) continue;
    counts[countKeys[entry.kind]] += 1;
    counts.total += 1;
  }
  return counts;
};

export const reconcileHeroSpriteManifest = async ({ manifest, catalog, ledger, readAsset, reconciledAt = new Date().toISOString() }) => {
  const catalogByKey = new Map(catalog.map(entry => [keyOf(entry), entry]));
  // Ledger order is append-only. A newer record supersedes an older record;
  // a failed latest proof must never fall back to a formerly valid image.
  const ledgerByKey = new Map(ledger.map(entry => [keyOf(entry), entry]));
  const changes = [];
  const failures = [];
  const entries = [];
  let verifiedHeroes = 0;
  let heroesWithoutLedger = 0;
  for (const entry of manifest.entries) {
    const record = ledgerByKey.get(keyOf(entry));
    if (entry.kind !== 'hero' || !record) {
      if (entry.kind === 'hero') heroesWithoutLedger += 1;
      entries.push(entry);
      continue;
    }
    let image;
    try { image = await readAsset(entry.output); } catch { image = null; }
    const proof = verifyHeroSpriteProof({ entry, catalog: catalogByKey.get(keyOf(entry)), record, image });
    if (!proof.verified) {
      failures.push({ id: entry.id, output: entry.output, problems: proof.problems });
      entries.push(entry);
      continue;
    }
    verifiedHeroes += 1;
    const next = {
      ...entry,
      available: true,
      source: 'openai',
      provenanceStatus: 'verified-openai',
      generationId: record.generation.generationId,
      outputSha256: record.image.sha256
    };
    const metadataChanged = normalized(next) !== normalized(entry);
    if (metadataChanged) {
      next.visualReviewStatus = 'pending';
      changes.push({
        id: entry.id,
        output: entry.output,
        wasAvailable: entry.available,
        priorProvenanceStatus: entry.provenanceStatus,
        priorGenerationId: entry.generationId || null,
        generationId: next.generationId,
        outputSha256: next.outputSha256,
        visualReviewStatus: 'pending',
        visualFidelityApproved: false
      });
    }
    entries.push(metadataChanged ? next : entry);
  }
  const updated = {
    ...manifest,
    counts: recount(entries, () => true),
    availableCounts: recount(entries, entry => entry.available === true),
    verifiedOpenAiCounts: recount(entries, entry => entry.provenanceStatus === 'verified-openai'),
    missingCounts: recount(entries, entry => entry.available !== true),
    entries,
    assetStatusPolicy: statusPolicy
  };
  if (changes.length) updated.availabilityReconciledAt = reconciledAt;
  return { manifest: updated, changes, failures, verifiedHeroes, heroesWithoutLedger };
};

const main = async () => {
  const args = process.argv.slice(2);
  if (args.some(arg => !['--check', '--write'].includes(arg)) || args.length !== 1) throw new Error('Specify exactly --check or --write.');
  const write = args[0] === '--write';
  const directory = path.join(root, 'public/sprites/generated');
  const manifestPath = path.join(directory, 'sprite-manifest.json');
  const catalogPath = path.join(directory, 'openai-sprite-prompts.jsonl');
  const ledgerPath = path.join(directory, 'openai-asset-ledger.jsonl');
  const [manifestSource, catalogSource, ledgerSource] = await Promise.all([manifestPath, catalogPath, ledgerPath].map(file => readFile(file, 'utf8')));
  const jsonl = source => source.split(/\r?\n/u).filter(Boolean).map(line => JSON.parse(line));
  const current = JSON.parse(manifestSource);
  const result = await reconcileHeroSpriteManifest({
    manifest: current,
    catalog: jsonl(catalogSource),
    ledger: jsonl(ledgerSource),
    readAsset: async output => {
      if (!/^\/sprites\/generated\/heroes\/[a-z0-9-]+\/[a-z0-9-]+\.png$/u.test(output)) throw new Error('Noncanonical hero asset path.');
      const file = path.join(root, 'public', output);
      const stat = await lstat(file);
      if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('Expected a regular hero PNG.');
      return readFile(file);
    }
  });
  const changed = normalized(current) !== normalized(result.manifest);
  const report = {
    scope: 'hero sprite availability and provenance; visual fidelity is not approved',
    mode: args[0].slice(2),
    status: result.failures.length ? 'invalid-proof' : changed && !write ? 'diverged' : 'converged',
    verifiedHeroes: result.verifiedHeroes,
    heroesWithoutLedger: result.heroesWithoutLedger,
    restoredAvailability: result.changes.filter(entry => !entry.wasAvailable).length,
    refreshedExistingProvenance: result.changes.filter(entry => entry.wasAvailable).length,
    priorAvailableCounts: current.availableCounts,
    availableCounts: result.manifest.availableCounts,
    verifiedOpenAiCounts: result.manifest.verifiedOpenAiCounts,
    missingCounts: result.manifest.missingCounts,
    failures: result.failures
  };
  if (write && changed && !result.failures.length) {
    const auditPath = path.join(root, 'docs/audits/hero-sprite-manifest-reconciliation-2026-10-01.json');
    await writeFile(auditPath, `${JSON.stringify({
      ...report,
      reconciledAt: result.manifest.availabilityReconciledAt,
      inputSha256: { manifest: sha256(manifestSource), catalog: sha256(catalogSource), ledger: sha256(ledgerSource) },
      changes: result.changes
    }, null, 2)}\n`);
    await writeFile(manifestPath, `${JSON.stringify(result.manifest, null, 2)}\n`);
    report.auditPath = path.relative(root, auditPath);
  }
  console.log(JSON.stringify(report, null, 2));
  if (result.failures.length || (!write && changed)) process.exitCode = 1;
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
