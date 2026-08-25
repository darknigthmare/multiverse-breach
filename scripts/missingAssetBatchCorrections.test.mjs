import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const batchRoot = path.join(root, 'docs', 'openai-generation-prompts-2026-08-25');
const mainBatchPath = path.join(batchRoot, 'asset-batch-500-wave-2.json');
const sha256 = value => createHash('sha256').update(value).digest('hex');
const identityFor = entry => `${entry.kind}:${entry.id}`;

const mainBatch = JSON.parse(await readFile(mainBatchPath, 'utf8'));
const mainJobsByIdentity = new Map(mainBatch.jobs.map(job => [identityFor(job), job]));
const correctionFiles = (await readdir(batchRoot))
  .filter(name => /^asset-batch-500-wave-2-corrections-.+\.json$/u.test(name))
  .sort();

test('wave 2 correction manifests are ordered, prompt-bound subsets of the 500 jobs', async () => {
  assert.ok(correctionFiles.length >= 2, 'Expected the QA correction manifests');
  const identities = new Set();
  let corrections = 0;
  let overrides = 0;
  for (const fileName of correctionFiles) {
    const correction = JSON.parse(await readFile(path.join(batchRoot, fileName), 'utf8'));
    assert.match(correction.batchId, /^assets-missing-500-wave-2-corrections-[a-z0-9-]+-2026-08-25$/u);
    assert.ok(Array.isArray(correction.jobs) && correction.jobs.length > 0, `${fileName}: empty jobs`);
    for (const job of correction.jobs) {
      const identity = identityFor(job);
      const mainJob = mainJobsByIdentity.get(identity);
      assert.ok(mainJob, `${fileName}: correction is outside main batch: ${identity}`);
      assert.equal(job.sequence, mainJob.sequence, `${identity}: sequence drift`);
      assert.equal(job.output, mainJob.output, `${identity}: output drift`);
      assert.equal(
        job.sourcePromptSha256,
        mainJob.sourcePromptSha256,
        `${identity}: source prompt hash drift`
      );
      if (identities.has(identity)) overrides += 1;
      identities.add(identity);
      const promptFile = path.resolve(root, ...job.promptFile.split('/'));
      assert.ok(promptFile.startsWith(`${batchRoot}${path.sep}`), `${identity}: prompt escapes batch root`);
      const prompt = await readFile(promptFile, 'utf8');
      assert.equal(prompt, job.generationPrompt, `${identity}: prompt file is not verbatim`);
      assert.equal(sha256(Buffer.from(prompt, 'utf8')), job.generationPromptSha256, `${identity}: prompt hash drift`);
      assert.match(prompt, /transparent alpha/iu, `${identity}: alpha lock missing`);
      assert.match(prompt, /no (?:text|readable text)|Branding lock/iu, `${identity}: text lock missing`);
      assert.match(
        prompt,
        /no[^\n]{0,80}\b(?:blood|gore)\b|\bnon-gory\b|positive safety lock:[^\n]*(?:wholesome|age appropriate)/iu,
        `${identity}: safety lock missing`
      );
      assert.match(prompt, /(?:canonical|correction|reference-locked)/iu, `${identity}: correction anchor missing`);
      if (job.kind === 'hero') {
        assert.match(prompt, /4 columns x 4 rows/iu, `${identity}: strict 4x4 lock missing`);
        assert.match(prompt, /sixteen/iu, `${identity}: sixteen-cell lock missing`);
      } else if (job.kind === 'item') {
        assert.match(prompt, /512 x 512|512x512/iu, `${identity}: item size lock missing`);
      } else {
        assert.fail(`${identity}: unexpected correction kind`);
      }
      corrections += 1;
    }
  }
  assert.equal(corrections, identities.size + overrides);
});
