import path from 'node:path';
import {
  assertCatalogContract,
  assertInstallBatchProvenance,
  loadGenerationCatalog,
  requiredSha256
} from './generatedBitmapBatchContracts.mjs';
import { loadInstallBatch } from './mergeGeneratedBitmapInstallBatches.mjs';

export const EXACT_BATCH_COUNT = 500;

const identityFor = job => `${job.kind}:${job.id}`;

export async function loadExactInstallBatchContract({
  batchPath,
  installBatchPath,
  cwd = process.cwd(),
  expectedCount = EXACT_BATCH_COUNT
}) {
  const catalog = await loadGenerationCatalog(batchPath, { cwd, expectedCount });
  const installBatch = await loadInstallBatch(installBatchPath, { cwd });
  await assertInstallBatchProvenance(installBatch);
  const installCatalogSha256 = requiredSha256(
    installBatch.promptCatalogSha256,
    `${installBatch.path}: promptCatalogSha256`
  );
  if (installCatalogSha256 !== catalog.promptCatalogSha256) {
    throw new Error(`${installBatch.path}: promptCatalogSha256 differs from generation catalog`);
  }
  if (installBatch.jobs.length !== expectedCount) {
    throw new Error(
      `${installBatch.path}: expected exactly ${expectedCount} install jobs, `
      + `found ${installBatch.jobs.length}`
    );
  }

  const jobsByIdentity = new Map();
  const generationIds = new Map();
  for (let index = 0; index < installBatch.jobs.length; index += 1) {
    const job = installBatch.jobs[index];
    const identity = identityFor(job);
    const expectedSequence = index + 1;
    if (job.sequence !== expectedSequence) {
      throw new Error(
        `${installBatch.path}: jobs must be ordered by contiguous sequence 1..${expectedCount}; `
        + `jobs[${index}] is sequence ${job.sequence}`
      );
    }
    assertCatalogContract(job, catalog, installBatch.path);
    const priorGenerationOwner = generationIds.get(job.generationId);
    if (priorGenerationOwner) {
      throw new Error(
        `${installBatch.path}: duplicate generationId ${job.generationId}: `
        + `${priorGenerationOwner} and ${identity}`
      );
    }
    generationIds.set(job.generationId, identity);
    jobsByIdentity.set(identity, job);
  }

  for (const identity of catalog.jobsByIdentity.keys()) {
    if (!jobsByIdentity.has(identity)) {
      throw new Error(`${installBatch.path}: missing catalog identity ${identity}`);
    }
  }

  return {
    catalog,
    installBatch,
    jobsByIdentity,
    generationIds
  };
}

export const resolveInstallPromptFile = (job, installBatchPath) => (
  path.resolve(path.dirname(installBatchPath), job.generationPromptFile)
);
