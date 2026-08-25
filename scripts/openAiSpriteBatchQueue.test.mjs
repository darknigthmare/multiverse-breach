import assert from 'node:assert/strict';
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  exportInstallBatch,
  getQueueStatus,
  ingestGeneratedResult,
  initializeQueue,
  listPendingJobs,
  parseQueueArguments,
  queueGenerationRetry,
  recordGenerationFailure
} from './openAiSpriteBatchQueue.mjs';

const ONE_PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+vCDiWQAAAABJRU5ErkJggg==',
  'base64'
);

const fixedNow = iso => () => new Date(iso);

async function createFixture(context, jobCount = 6) {
  const repositoryRoot = await mkdtemp(path.join(os.tmpdir(), 'openai-sprite-queue-'));
  context.after(() => rm(repositoryRoot, {
    recursive: true,
    force: true,
    maxRetries: 8,
    retryDelay: 50
  }));
  const promptRoot = path.join(repositoryRoot, 'docs', 'prompts');
  await mkdir(promptRoot, { recursive: true });
  const jobs = [];
  for (let sequence = 1; sequence <= jobCount; sequence += 1) {
    const id = `job-${sequence}`;
    const generationPrompt = `Exact generation prompt ${sequence}`;
    const promptFile = `docs/prompts/${String(sequence).padStart(3, '0')}-${id}.txt`;
    await writeFile(path.join(repositoryRoot, promptFile), generationPrompt, 'utf8');
    jobs.push({
      sequence,
      id,
      name: `Job ${sequence}`,
      universe: `Universe ${sequence}`,
      output: `/sprites/generated/items/universe-${sequence}/${id}.png`,
      promptFile,
      generationPrompt,
      sourcePromptSha256: String(sequence).padStart(64, '0'),
      referenceUrl: `https://example.test/${sequence}`,
      visualAnchor: `Anchor ${sequence}`
    });
  }
  const batchPath = path.join(repositoryRoot, 'docs', 'item-batch.json');
  await writeFile(batchPath, `${JSON.stringify({
    schemaVersion: 1,
    batchId: `items-test-${jobCount}`,
    kind: 'item',
    jobs
  }, null, 2)}\n`, 'utf8');
  return {
    repositoryRoot,
    batchPath,
    queueBase: path.join(repositoryRoot, 'tmp', 'openai-sprite-batches')
  };
}

async function writeSource(fixture, name = 'imagegen-source.png') {
  const sourceRoot = path.join(fixture.repositoryRoot, 'external-imagegen-results');
  await mkdir(sourceRoot, { recursive: true });
  const source = path.join(sourceRoot, name);
  await writeFile(source, ONE_PIXEL_PNG);
  return source;
}

test('init creates the deterministic queue and resume preserves existing work', async context => {
  const fixture = await createFixture(context, 3);
  const first = await initializeQueue({
    ...fixture,
    now: fixedNow('2026-08-24T10:00:00.000Z')
  });
  assert.equal(first.resumed, false);
  assert.equal(first.jobs, 3);
  assert.equal(
    first.queueRoot,
    path.join(fixture.queueBase, 'items-test-3')
  );
  await access(path.join(first.queueRoot, 'queue.json'));
  await access(path.join(first.queueRoot, 'jobs', '001-job-1'));

  const marker = path.join(first.queueRoot, 'jobs', '001-job-1', 'preserve-me.txt');
  await writeFile(marker, 'already generated', 'utf8');
  const resumed = await initializeQueue({
    ...fixture,
    now: fixedNow('2026-08-24T11:00:00.000Z')
  });
  assert.equal(resumed.resumed, true);
  assert.equal(resumed.createdAt, '2026-08-24T10:00:00.000Z');
  assert.equal(await readFile(marker, 'utf8'), 'already generated');
});

test('pending selection is stable across one-based shards, ranges and limits', async context => {
  const fixture = await createFixture(context, 9);
  await initializeQueue(fixture);
  const selected = await listPendingJobs({
    ...fixture,
    shard: '2/3',
    from: 2,
    to: 8
  });
  assert.deepEqual(selected.jobs.map(job => job.sequence), [2, 5, 8]);
  assert.equal(selected.counts.pending, 3);
  assert.equal(selected.counts.returned, 3);

  await recordGenerationFailure({
    ...fixture,
    sequence: 2,
    error: 'temporary ImageGen failure'
  });
  const resumedShard = await listPendingJobs({
    ...fixture,
    shardIndex: 1,
    shardCount: 3,
    from: 2,
    to: 8,
    limit: 1
  });
  assert.deepEqual(resumedShard.jobs.map(job => job.sequence), [5]);
  assert.equal(resumedShard.counts.failed, 1);
  assert.equal(resumedShard.counts.pending, 2);
  assert.equal(resumedShard.counts.returned, 1);
});

test('ingest preserves the original, copies exact PNG bytes, resumes idempotently and exports', async context => {
  const fixture = await createFixture(context, 2);
  await initializeQueue(fixture);
  const source = await writeSource(fixture);
  const generationId = 'exec-12345678-1234-4234-9234-123456789abc';
  const original = await readFile(source);

  const ingested = await ingestGeneratedResult({
    ...fixture,
    sequence: 1,
    source,
    generationId,
    now: fixedNow('2026-08-24T12:00:00.000Z')
  });
  assert.equal(ingested.resumed, false);
  assert.equal(ingested.result.status, 'complete');
  assert.equal(ingested.result.attempts, 1);
  assert.equal(ingested.result.generationId, generationId);
  assert.equal((await readFile(source)).equals(original), true, 'the ImageGen original must stay untouched');
  assert.equal(
    (await readFile(ingested.result.source.rawPath)).equals(original),
    true,
    'the queued raw PNG must be an exact byte copy'
  );
  assert.match(ingested.result.promptSha256, /^[a-f0-9]{64}$/u);
  assert.match(ingested.result.source.sha256, /^[a-f0-9]{64}$/u);

  const resumed = await ingestGeneratedResult({
    ...fixture,
    sequence: 1,
    source,
    generationId,
    now: fixedNow('2026-08-24T13:00:00.000Z')
  });
  assert.equal(resumed.resumed, true);
  assert.equal(resumed.result.attempts, 1);

  const exported = await exportInstallBatch({
    ...fixture,
    now: fixedNow('2026-08-24T14:00:00.000Z')
  });
  const installBatch = JSON.parse(await readFile(exported.output, 'utf8'));
  assert.deepEqual(installBatch.counts, { total: 2, complete: 1, remaining: 1 });
  assert.equal(installBatch.jobs.length, 1);
  assert.equal(installBatch.jobs[0].output, '/sprites/generated/items/universe-1/job-1.png');
  assert.equal(installBatch.jobs[0].source, ingested.result.source.rawPath);
  assert.equal(installBatch.jobs[0].generationId, generationId);
  assert.equal(installBatch.jobs[0].replace, false);

  await assert.rejects(
    () => ingestGeneratedResult({
      ...fixture,
      sequence: 2,
      source,
      generationId: 'not-an-exec-id'
    }),
    /generationId must match exec-\*/
  );
});

test('fail, status, explicit retry and successful second attempt remain auditable', async context => {
  const fixture = await createFixture(context, 1);
  await initializeQueue(fixture);
  const failed = await recordGenerationFailure({
    ...fixture,
    sequence: 1,
    error: 'worker timed out',
    now: fixedNow('2026-08-24T15:00:00.000Z')
  });
  assert.equal(failed.result.status, 'failed');
  assert.equal(failed.result.attempts, 1);

  const blocked = await getQueueStatus(fixture);
  assert.equal(blocked.phase, 'blocked-on-failures');
  assert.deepEqual(blocked.counts, {
    total: 1,
    pending: 0,
    failed: 1,
    complete: 0,
    invalid: 0,
    attempts: 1,
    retries: 0,
    rawBytes: 0
  });

  const retry = await queueGenerationRetry({
    ...fixture,
    sequence: 1,
    reason: 'worker available again',
    now: fixedNow('2026-08-24T15:05:00.000Z')
  });
  assert.equal(retry.result.status, 'pending');
  assert.equal(retry.result.retryCount, 1);
  assert.deepEqual((await listPendingJobs(fixture)).jobs.map(job => job.sequence), [1]);

  const source = await writeSource(fixture, 'retry-source.png');
  const completed = await ingestGeneratedResult({
    ...fixture,
    sequence: 1,
    source,
    generationId: 'exec-aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee',
    now: fixedNow('2026-08-24T15:10:00.000Z')
  });
  assert.equal(completed.result.attempts, 2);
  assert.equal(completed.result.retryCount, 1);
  assert.deepEqual(
    completed.result.history.map(entry => entry.event),
    ['failed', 'retry-queued', 'completed']
  );

  const status = await getQueueStatus(fixture);
  assert.equal(status.phase, 'complete');
  assert.equal(status.counts.complete, 1);
  assert.equal(status.counts.pending, 0);
  assert.equal(status.counts.attempts, 2);
  assert.equal(status.counts.retries, 1);
});

test('CLI argument parser accepts the deterministic queue commands', () => {
  assert.deepEqual(
    parseQueueArguments([
      'pending',
      '--batch', 'docs/batch.json',
      '--shard', '3/20',
      '--from=101',
      '--to', '300',
      '--limit', '10'
    ]),
    {
      command: 'pending',
      batch: 'docs/batch.json',
      shard: '3/20',
      from: '101',
      to: '300',
      limit: '10',
      batchPath: 'docs/batch.json'
    }
  );
});
