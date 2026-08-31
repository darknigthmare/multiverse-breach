import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const sha256 = value => createHash('sha256').update(value).digest('hex');
export const WAVE6_PROMPT_CORRECTIONS_PATH = 'docs/rift-dossiers/references/wave6-production-prompts.json';

// Authored corrections are explicit source data. This never selects new identities,
// alters installed proofs, approves a review, generates a raster, or installs it.
export function applyWave6ProductionPromptOverrides(entries, { root, document, identities } = {}) {
  const data = document ?? JSON.parse(readFileSync(path.join(root, WAVE6_PROMPT_CORRECTIONS_PATH), 'utf8'));
  assert.equal(data.schemaVersion, 1, 'Wave6 prompt corrections schema must be 1');
  assert.equal(data.batchId, 'assets-rift-dossier-pending-500-wave-6-2026-08-31', 'Wave6 prompt corrections batch mismatch');
  assert.ok(Array.isArray(data.corrections), 'Wave6 prompt corrections must be an array');
  const jobs = identities ?? JSON.parse(readFileSync(path.join(root, 'docs/openai-generation-prompts-2026-08-31/asset-batch-500-wave-6-rift-dossiers.json'), 'utf8')).jobs;
  const fixedJobs = new Map(jobs.map(job => [Number(job.id), job]));
  const byId = new Map(entries.map(entry => [entry.id, entry]));
  const seen = new Set();
  const plans = data.corrections.map(record => {
    assert.ok(Number.isInteger(record.id) && !seen.has(record.id), 'Wave6 duplicate or invalid correction identity');
    seen.add(record.id);
    const fixed = fixedJobs.get(record.id);
    assert.ok(fixed, `Wave6 correction is outside the frozen selection ${record.id}`);
    assert.equal(record.family, fixed.family, `Wave6 frozen family drift ${record.id}`);
    assert.equal(record.mode, fixed.mode, `Wave6 frozen mode drift ${record.id}`);
    assert.equal(record.output, fixed.output, `Wave6 frozen output drift ${record.id}`);
    const entry = byId.get(record.id);
    assert.ok(entry, `Wave6 unknown correction identity ${record.id}`);
    assert.equal(entry.famille, record.family, `Wave6 family drift ${record.id}`);
    assert.equal(entry.mode, record.mode, `Wave6 mode drift ${record.id}`);
    assert.equal(entry.cheminCibleDedie, record.output, `Wave6 output drift ${record.id}`);
    assert.match(record.priorPromptSha256, /^[a-f0-9]{64}$/u, 'Wave6 prior prompt SHA-256 required');
    assert.equal(sha256(entry.promptOpenAI), record.priorPromptSha256, `Wave6 source prompt drift ${record.id}`);
    assert.ok(typeof record.prompt === 'string' && record.prompt.length >= 400 && record.prompt.includes(entry.nom.en), `Wave6 incomplete prompt ${record.id}`);
    assert.ok(typeof record.reason === 'string' && record.reason.trim().length >= 20, 'Wave6 correction reason required');
    assert.ok(Array.isArray(record.visualAnchors) && record.visualAnchors.length > 0 && record.visualAnchors.every(anchor => typeof anchor === 'string' && anchor.trim()), 'Wave6 explicit visual anchors required');
    assert.ok(Array.isArray(record.sources) && record.sources.length > 0, 'Wave6 correction sources required');
    for (const source of record.sources) {
      assert.ok(['official-url', 'reference-url', 'project-canon'].includes(source.kind) && typeof source.reference === 'string' && source.reference.trim() && typeof source.notes === 'string' && source.notes.trim(), 'Wave6 source evidence incomplete');
      if (source.kind === 'official-url' || source.kind === 'reference-url') assert.equal(new URL(source.reference).protocol, 'https:', 'Wave6 public reference must use HTTPS');
    }
    const referenceUrls = [...new Set(record.sources.filter(source => source.kind === 'official-url' || source.kind === 'reference-url').map(source => source.reference))];
    assert.ok(referenceUrls.length > 0 || record.prompt.includes('Project-runtime lore anchors (not independently researched):'), 'Wave6 runtime-only provenance must remain disclosed');
    return { entry, record, referenceUrls };
  });
  // Full validation precedes mutation, so one invalid correction cannot partially apply.
  for (const { entry, record, referenceUrls } of plans) {
    entry.promptOpenAI = record.prompt;
    entry.ancragesVisuels = [...record.visualAnchors];
    entry.referenceUrls = referenceUrls;
    entry.politiqueReferences = !referenceUrls.length ? 'project-runtime-lore'
      : record.sources.some(source => source.kind === 'reference-url') ? 'public-crosschecked' : 'authoritative-public';
    entry.promptProductionCorrection = {
      batchId: data.batchId,
      priorPromptSha256: record.priorPromptSha256,
      promptSha256: sha256(record.prompt),
      reason: record.reason,
      sources: record.sources.map(source => ({ ...source }))
    };
  }
  return entries;
}
