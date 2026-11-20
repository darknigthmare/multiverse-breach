import { link, lstat, mkdir, mkdtemp, rm, unlink, writeFile } from 'node:fs/promises';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { assertDistributionDirectory, inspectDistributionPath, listDistributionFiles, readDistributionFile } from './dlcDistributionFilesystem.mjs';
import {
  auditDlcAssetBatchExport, DLC_ASSET_BATCH_EXPORT_RECEIPT, parseDlcAssetBatchExportReceipt, verifyDlcAssetBatchBytes,
} from './exportDlcAssetBatch.mjs';

const JOURNAL = '.dlc-batches';
const STATE = 'state.json';
const HASH = /^[a-f0-9]{64}$/;
const COMMIT = /^[a-f0-9]{40}$/;
const matches = (value, pattern) => typeof value === 'string' && pattern.test(value);
const jsonBytes = value => Buffer.from(JSON.stringify(value) + '\n');
const isWorkDirectory = entry => entry.isDirectory() && /^work-[a-zA-Z0-9]{6}$/.test(entry.name);
const within = (root, candidate) => {
  const relative = path.relative(root, candidate);
  return !relative || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith('..' + path.sep));
};

function stateFor({ sourceRevision, planSha256, runnerSha256, profile }) {
  return { schemaVersion: 1, kind: 'dlc-asset-batch-assembly', sourceRevision, planSha256, runnerSha256, profile };
}

async function ensureDirectory(directory) {
  try { await mkdir(directory); }
  catch (error) { if (error.code !== 'EEXIST') throw error; }
  return assertDistributionDirectory(directory);
}

async function ensureParent(root, file) {
  let directory = root;
  for (const segment of file.split('/').slice(0, -1)) directory = await ensureDirectory(path.join(directory, segment));
}

/** Publish a verified ordinary file without replacing an existing one. */
async function place(temporary, destination) {
  try { await link(temporary, destination); return true; }
  catch (error) { if (error.code !== 'EEXIST') throw error; return false; }
}

async function placeControl(work, journal, name, bytes) {
  const temporary = path.join(work, 'control');
  await writeFile(temporary, bytes, { flag: 'wx' });
  try { return await place(temporary, path.join(journal, name)); }
  finally { await unlink(temporary); }
}

async function writeControl(work, journal, name, bytes) {
  await placeControl(work, journal, name, bytes);
  if (!bytes.equals(readDistributionFile(journal, name))) throw new Error('Assembly journal differs: ' + name);
}

function readJournal(root) {
  const journal = inspectDistributionPath(root, JOURNAL, { directory: true });
  const state = JSON.parse(readDistributionFile(journal, STATE));
  if (state?.schemaVersion !== 1 || state.kind !== 'dlc-asset-batch-assembly' || !matches(state.sourceRevision, COMMIT)
    || !matches(state.planSha256, HASH) || !matches(state.runnerSha256, HASH)) throw new Error('Invalid assembly state.');
  const allowed = new Set([STATE]);
  const batchEntries = new Map();
  const sources = new Map();
  const publicPaths = new Set();
  const files = readdirSync(journal, { withFileTypes: true });
  let nextIntent;
  for (let number = 0; ; number++) {
    const name = `intent-${String(number).padStart(5, '0')}.json`;
    if (!inspectDistributionPath(journal, name, { optional: true })) { nextIntent = name; break; }
    const { receipt, receiptSha256 } = parseDlcAssetBatchExportReceipt(readDistributionFile(journal, name));
    const id = receipt.batchId;
    const doneFile = `batch-${id}.done`;
    allowed.add(name);
    allowed.add(doneFile);
    if (batchEntries.has(id) || !jsonBytes(stateFor(receipt)).equals(jsonBytes(state))) throw new Error('Batch differs from assembly identity: ' + id);
    const done = inspectDistributionPath(journal, doneFile, { optional: true }) !== null;
    if (done && readDistributionFile(journal, doneFile).toString() !== receiptSha256 + '\n') throw new Error('Batch completion marker differs from receipt: ' + id);
    batchEntries.set(id, { receiptSha256, done });
    for (const asset of receipt.assets) {
      if (sources.has(asset.sourcePath) || publicPaths.has(asset.publicPath)) throw new Error('Batch media collide: ' + asset.publicPath);
      sources.set(asset.sourcePath, { asset, done });
      publicPaths.add(asset.publicPath);
    }
  }
  for (const file of files) {
    if (!allowed.has(file.name) && !isWorkDirectory(file)) throw new Error('Unexpected file in assembly journal: ' + file.name);
  }
  return { state, batchEntries, sources, publicPaths, nextIntent };
}

/** Read the local assembly and verify all installed files against its retained receipts. */
export async function auditDlcAssetBatchAssembly({ directory, expectedPlanSha256 } = {}) {
  directory = assertDistributionDirectory(directory);
  const { state, batchEntries, sources } = readJournal(directory);
  if (expectedPlanSha256 !== undefined && state.planSha256 !== expectedPlanSha256) throw new Error('Assembly plan hash differs from the pinned hash.');
  const files = listDistributionFiles({ root: directory, ignore: file => file === JOURNAL });
  if (files.some(file => !sources.has(file))) throw new Error('Assembly contains files absent from its batch receipts.');
  let bytes = 0;
  const present = new Set(files);
  for (const [sourcePath, { asset, done }] of sources) {
    if (present.has(sourcePath)) {
      await verifyDlcAssetBatchBytes(inspectDistributionPath(directory, sourcePath), asset);
      bytes += asset.bytes;
    } else if (done) throw new Error('Completed assembly batch file is missing: ' + sourcePath);
  }
  const pendingBatches = [...batchEntries].filter(([, row]) => !row.done).map(([id]) => id).sort();
  return { sourceRevision: state.sourceRevision, planSha256: state.planSha256, appliedBatches: batchEntries.size - pendingBatches.length,
    pendingBatches, presentAssets: present.size, payloadBytes: bytes };
}

/** Apply or resume a transferred batch without rereading Git or LFS. */
export async function applyDlcAssetBatch({ directory, out, expectedReceiptSha256 } = {}) {
  if (!matches(expectedReceiptSha256, HASH)) throw new Error('The original batch receipt SHA-256 is required.');
  if (typeof out !== 'string' || !out.trim()) throw new Error('An explicit assembly destination is required.');
  directory = assertDistributionDirectory(directory);
  const destination = path.resolve(out);
  if (within(directory, destination) || within(destination, directory)) throw new Error('Assembly and batch directories must not overlap.');
  assertDistributionDirectory(path.dirname(destination));
  const raw = readDistributionFile(directory, DLC_ASSET_BATCH_EXPORT_RECEIPT);
  const { receipt } = parseDlcAssetBatchExportReceipt(raw, expectedReceiptSha256);
  await auditDlcAssetBatchExport({ directory, expectedReceiptSha256 });
  await ensureDirectory(destination);
  const existingJournal = inspectDistributionPath(destination, JOURNAL, { directory: true, optional: true });
  const unowned = readdirSync(destination).some(name => name !== JOURNAL)
    || (existingJournal && readdirSync(existingJournal, { withFileTypes: true }).some(entry => !isWorkDirectory(entry)));
  if (unowned && !inspectDistributionPath(destination, `${JOURNAL}/${STATE}`, { optional: true })) {
    throw new Error('Assembly destination contains files without a journal.');
  }
  const journal = await ensureDirectory(path.join(destination, JOURNAL));
  const work = await mkdtemp(path.join(journal, 'work-'));
  const originalWork = await lstat(work);
  try {
    await writeControl(work, journal, STATE, jsonBytes(stateFor(receipt)));
    let previous;
    for (;;) {
      const { batchEntries, sources, publicPaths, nextIntent } = readJournal(destination);
      previous = batchEntries.get(receipt.batchId);
      if (previous) {
        if (previous.receiptSha256 !== expectedReceiptSha256) throw new Error('Assembly already records a different receipt for batch ' + receipt.batchId);
        break;
      }
      if (receipt.assets.some(asset => sources.has(asset.sourcePath) || publicPaths.has(asset.publicPath))) {
        throw new Error('New batch media collide with an assembly receipt.');
      }
      // The next journal slot acts as an exclusive append. Losing a concurrent
      // append means rereading all intents before putting any asset on disk.
      if (await placeControl(work, journal, nextIntent, raw)) break;
    }
    let copiedAssets = 0;
    const temporary = path.join(work, 'payload');
    for (const asset of receipt.assets) {
      let installed = inspectDistributionPath(destination, asset.sourcePath, { optional: true });
      if (!installed) {
        if (previous?.done) throw new Error('Completed assembly batch file is missing: ' + asset.sourcePath);
        await ensureParent(destination, asset.sourcePath);
        await verifyDlcAssetBatchBytes(inspectDistributionPath(directory, asset.sourcePath), asset, temporary);
        if (await place(temporary, path.join(destination, asset.sourcePath))) copiedAssets++;
        await unlink(temporary);
        installed = inspectDistributionPath(destination, asset.sourcePath);
      }
      await verifyDlcAssetBatchBytes(installed, asset);
    }
    await writeControl(work, journal, `batch-${receipt.batchId}.done`, Buffer.from(expectedReceiptSha256 + '\n'));
    return { out: destination, batchId: receipt.batchId, planSha256: receipt.planSha256, receiptSha256: expectedReceiptSha256,
      copiedAssets, reusedAssets: receipt.assets.length - copiedAssets, payloadBytes: receipt.payloadBytes };
  } finally {
    const current = await lstat(work).catch(() => null);
    if (current?.isDirectory() && originalWork.ino === current.ino && originalWork.dev === current.dev) {
      await rm(work, { recursive: true, force: true });
    }
  }
}

const usage = `Usage: node scripts/applyDlcAssetBatch.mjs --batch DIRECTORY --receipt-sha256 SHA256 --out ASSEMBLY_DIRECTORY
       node scripts/applyDlcAssetBatch.mjs --check ASSEMBLY_DIRECTORY [--expected-plan-sha256 SHA256]`;

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const { values: options } = parseArgs({ options: { batch: { type: 'string' }, 'receipt-sha256': { type: 'string' },
      out: { type: 'string' }, check: { type: 'string' }, 'expected-plan-sha256': { type: 'string' }, help: { type: 'boolean' } } });
    if (options.help) console.log(usage);
    else if (options.check && Object.keys(options).every(key => ['check', 'expected-plan-sha256'].includes(key))) {
      console.log(JSON.stringify(await auditDlcAssetBatchAssembly({ directory: options.check, expectedPlanSha256: options['expected-plan-sha256'] })));
    } else if (options.batch && options.out && options['receipt-sha256'] && !options.check && !options['expected-plan-sha256']) {
      console.log(JSON.stringify(await applyDlcAssetBatch({ directory: options.batch, out: options.out, expectedReceiptSha256: options['receipt-sha256'] })));
    } else throw new Error(usage);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
