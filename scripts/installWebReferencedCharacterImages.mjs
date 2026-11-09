import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { normalizeReferencedCharacterPng, inspectReferencedCharacterPng } from './installReferencedCharacterImages.mjs';

const defaultRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const digest = /^[a-f0-9]{64}$/u;
const outputs = /^\/sprites\/generated\/(heroes|bosses)\/[a-z0-9-]+\/[a-z0-9-]+\.png$/u;
const manifests = /^docs\/audits\/[a-z0-9-]+\.json$/u;
const label = value => typeof value === 'string' && value.trim() && value.length <= 240
  && Array.from(value).every(character => character.codePointAt(0) >= 32 && character.codePointAt(0) !== 127);
const webUrl = value => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && !!url.hostname
      && !['localhost', '127.0.0.1', '::1', '[::1]'].includes(url.hostname);
  } catch { return false; }
};
const regularFile = async file => {
  const resolved = path.resolve(file);
  const segments = resolved.split(path.sep).filter(Boolean);
  let current = path.parse(resolved).root;
  for (const segment of segments) {
    current = path.join(current, segment);
    if ((await fs.lstat(current)).isSymbolicLink()) throw new Error('Input paths cannot contain symlinks.');
  }
  if (!(await fs.stat(resolved)).isFile()) throw new Error('Expected a regular input file.');
  return resolved;
};
const readInput = async (input, base, kind) => {
  if (!input || typeof input.path !== 'string' || !digest.test(input.sha256 || '')
    || input.path.split(/[\\/]/u).includes('..')) throw new Error(`Invalid ${kind} input.`);
  let file;
  let bytes;
  try {
    file = await regularFile(path.resolve(base, input.path));
    bytes = await fs.readFile(file);
  } catch { throw new Error(`${kind} input unavailable or unsafe.`); }
  if (!bytes.length || hash(bytes) !== input.sha256) throw new Error(`${kind} SHA-256 mismatch.`);
  return { file, bytes, sha256: input.sha256 };
};
const parseJson = (bytes, kind) => {
  try { return JSON.parse(bytes.toString('utf8')); }
  catch { throw new Error(`Invalid ${kind} JSON.`); }
};
const newDestination = async (root, relative) => {
  if (path.isAbsolute(relative) || relative.split('/').some(part => !part || part === '.' || part === '..')) throw new Error('Invalid destination.');
  await regularDirectory(root);
  let current = root;
  const segments = relative.split('/');
  for (let index = 0; index < segments.length; index += 1) {
    current = path.join(current, segments[index]);
    try {
      const stat = await fs.lstat(current);
      if (stat.isSymbolicLink()) throw new Error('Destination paths cannot contain symlinks.');
      if (index === segments.length - 1) throw new Error(`Refusing to overwrite ${relative}.`);
      if (!stat.isDirectory()) throw new Error('Destination parent must be a directory.');
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  return current;
};
const regularDirectory = async root => {
  let current = path.parse(root).root;
  for (const segment of root.split(path.sep).filter(Boolean)) {
    current = path.join(current, segment);
    const stat = await fs.lstat(current);
    if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error('Repository root cannot contain symlinks.');
  }
};
const checkPublicPrivacy = document => {
  const text = JSON.stringify(document);
  if (/"(?:prompt|generationPrompt|generationId|proofFile|currentLocalReferencePaths|path)"\s*:/u.test(text)
    || /(?:\/workspace\/|\/tmp\/|file:\/\/)/u.test(text)) throw new Error('Public manifest contains private fields or paths.');
};

// Web reference bytes remain private: the public record contains their actual
// URL and digest, rather than pretending they are shipped repository assets.
export const installWebReferencedCharacterImages = async ({ root = defaultRoot, manifestPath, publicManifestPath, hooks = {} } = {}) => {
  root = path.resolve(root);
  if (!manifests.test(publicManifestPath || '')) throw new Error('Expected a new manifest under docs/audits/.');
  let planFile;
  let planBytes;
  try {
    planFile = await regularFile(path.resolve(manifestPath));
    planBytes = await fs.readFile(planFile);
  } catch { throw new Error('Installation plan unavailable or unsafe.'); }
  const plan = parseJson(planBytes, 'installation plan');
  if (plan.schemaVersion !== 1 || !Array.isArray(plan.jobs) || !plan.jobs.length) throw new Error('Expected a nonempty schemaVersion 1 plan.');
  const destinationManifest = await newDestination(root, publicManifestPath);
  const identities = new Set();
  const paths = new Set();
  const prepared = [];
  for (const job of plan.jobs) {
    const expectedDirectory = job.kind === 'hero' ? 'heroes' : ['enemy', 'boss', 'worldBoss', 'escort'].includes(job.kind) ? 'bosses' : null;
    if (!expectedDirectory || !/^[a-z0-9_:-]+$/u.test(job.id || '') || !label(job.name) || !label(job.universe)
      || !outputs.test(job.output || '') || job.output.split('/')[3] !== expectedDirectory
      || job.provider !== 'OpenAI' || job.interface !== 'built-in image_gen'
      || job.canonicalFidelityApproved !== false || job.visualReview?.status !== 'close-to-reference'
      || !Array.isArray(job.references) || !job.references.length) throw new Error('Invalid reviewed image job.');
    const identity = `${job.kind}:${job.id}`;
    if (identities.has(identity) || paths.has(job.output)) throw new Error('Duplicate identity or output.');
    identities.add(identity); paths.add(job.output);
    const destination = await newDestination(root, `public${job.output}`);
    const source = await readInput(job.source, path.dirname(planFile), 'source image');
    const proof = await readInput(job.generationEvidence, path.dirname(planFile), 'generation evidence');
    const peer = await readInput(job.peerEvidence, path.dirname(planFile), 'peer review');
    const normalized = await normalizeReferencedCharacterPng(source.bytes, { componentLayout: job.componentLayout === true });
    const imageHash = hash(normalized.buffer);
    const review = parseJson(peer.bytes, 'peer review');
    if (review.accepted !== true || review.sourceSha256 !== source.sha256 || review.imageSha256 !== imageHash
      || review.canonicalFidelityApproved !== false) throw new Error('Peer review must match the exact source and packed image.');
    const references = [];
    for (const reference of job.references) {
      if (!webUrl(reference.url) || !webUrl(reference.finalUrl) || reference.httpStatus !== 200
        || reference.viewed !== true || !label(reference.incarnation)
        || !Number.isFinite(Date.parse(reference.downloadedAt))) throw new Error('Reference must be a downloaded and viewed HTTPS body image.');
      const actual = await readInput(reference, path.dirname(planFile), 'web reference');
      const metadata = await sharp(actual.bytes, { animated: false, failOn: 'error' }).metadata();
      if (!['png', 'jpeg', 'webp', 'gif'].includes(metadata.format) || !metadata.width || !metadata.height) throw new Error('Web reference must decode as a raster image.');
      await sharp(actual.bytes, { animated: false, failOn: 'error' }).raw().toBuffer();
      references.push({ url: reference.url, finalUrl: reference.finalUrl, httpStatus: 200,
        downloadedAt: reference.downloadedAt, sha256: actual.sha256, bytes: actual.bytes.length,
        format: metadata.format, width: metadata.width, height: metadata.height,
        incarnation: reference.incarnation, viewed: true, publiclyRedistributed: false });
    }
    if (JSON.stringify(review.referenceSha256s) !== JSON.stringify(references.map(reference => reference.sha256))) throw new Error('Peer review references do not match.');
    const generation = parseJson(proof.bytes, 'generation evidence');
    if (generation.schemaVersion !== 1 || generation.provider !== 'OpenAI' || generation.interface !== 'built-in image_gen'
      || generation.sourceSha256 !== source.sha256
      || JSON.stringify(generation.referenceSha256s) !== JSON.stringify(references.map(reference => reference.sha256))) throw new Error('Generation evidence must match the source and reference digests.');
    const notes = job.visualReview.notes || [];
    if (!Array.isArray(notes) || notes.some(note => !label(note))) throw new Error('Invalid public review notes.');
    const record = { kind: job.kind, id: job.id, name: job.name, universe: job.universe, output: job.output,
      source: { provider: 'OpenAI', interface: 'built-in image_gen', assertion: 'private generation evidence recorded' },
      sourceImage: { sha256: source.sha256, bytes: source.bytes.length, ...normalized.source },
      references, image: { sha256: imageHash, bytes: normalized.buffer.length, width: 1024, height: 1024, channels: 4, format: 'png' },
      privateEvidence: { generationSha256: proof.sha256, peerReviewSha256: peer.sha256, publiclyAvailable: false },
      processing: normalized.processing, fileAvailable: true,
      visualReview: { status: 'close-to-reference', notes, canonicalFidelityApproved: false }, canonicalFidelityApproved: false };
    prepared.push({ destination, buffer: normalized.buffer, record });
  }
  const publicDocument = { schemaVersion: 1, scope: 'Generated PNG sheets compared with downloaded web body references.',
    policy: { canonicalFidelityApproved: false, referenceImagesRedistributed: false, privatePromptsAndIdentifiersPublished: false,
      normalization: 'format packing only; no synthesized, duplicated or recolored poses' }, entries: prepared.map(item => item.record) };
  checkPublicPrivacy(publicDocument);
  const created = [];
  const writeNew = async (file, bytes) => {
    await fs.mkdir(path.dirname(file), { recursive: true });
    const handle = await fs.open(file, 'wx');
    const stat = await handle.stat();
    created.push({ file, dev: stat.dev, ino: stat.ino });
    try { await handle.writeFile(bytes); await handle.sync(); } finally { await handle.close(); }
  };
  try {
    for (const [index, asset] of prepared.entries()) {
      await newDestination(root, `public${asset.record.output}`);
      await writeNew(asset.destination, asset.buffer);
      await hooks.afterAssetWrite?.(index, asset);
    }
    await newDestination(root, publicManifestPath);
    await writeNew(destinationManifest, Buffer.from(`${JSON.stringify(publicDocument, null, 2)}\n`));
    await hooks.beforeFinalAudit?.();
    await auditWebReferencedCharacterImages({ root, manifestPath: publicManifestPath });
  } catch (error) {
    for (const item of created.reverse()) {
      // A changed parent or replaced inode is no longer our created file.
      // Leave it alone rather than following a hook's symlink outside root.
      try {
        await regularFile(item.file);
        const stat = await fs.lstat(item.file);
        if (stat.dev === item.dev && stat.ino === item.ino) await fs.unlink(item.file);
      } catch { /* Missing or unsafe paths cannot be removed during rollback. */ }
    }
    throw error;
  }
  return { installed: prepared.length, publicManifestPath, canonicalFidelityApproved: false };
};

export const auditWebReferencedCharacterImages = async ({ root = defaultRoot, manifestPath } = {}) => {
  root = path.resolve(root);
  if (!manifests.test(manifestPath || '')) throw new Error('Invalid manifest path.');
  const document = parseJson(await fs.readFile(await regularFile(path.join(root, manifestPath))), 'public manifest');
  if (document.schemaVersion !== 1 || !Array.isArray(document.entries) || !document.entries.length) throw new Error('Invalid public manifest.');
  checkPublicPrivacy(document);
  if (document.policy?.canonicalFidelityApproved !== false || document.policy?.referenceImagesRedistributed !== false
    || document.policy?.privatePromptsAndIdentifiersPublished !== false) throw new Error('Invalid public provenance policy.');
  const seen = new Set();
  for (const entry of document.entries) {
    const expectedDirectory = entry.kind === 'hero' ? 'heroes' : ['enemy', 'boss', 'worldBoss', 'escort'].includes(entry.kind) ? 'bosses' : null;
    if (!outputs.test(entry.output || '') || seen.has(entry.output) || entry.canonicalFidelityApproved !== false
      || !expectedDirectory || entry.output.split('/')[3] !== expectedDirectory
      || !/^[a-z0-9_:-]+$/u.test(entry.id || '') || !label(entry.name) || !label(entry.universe)
      || entry.visualReview?.canonicalFidelityApproved !== false || entry.visualReview?.status !== 'close-to-reference'
      || !digest.test(entry.sourceImage?.sha256 || '') || !digest.test(entry.image?.sha256 || '')
      || !digest.test(entry.privateEvidence?.generationSha256 || '') || !digest.test(entry.privateEvidence?.peerReviewSha256 || '')
      || entry.privateEvidence?.publiclyAvailable !== false || entry.source?.provider !== 'OpenAI'
      || entry.source?.interface !== 'built-in image_gen' || entry.image?.width !== 1024 || entry.image?.height !== 1024
      || entry.image?.channels !== 4 || entry.image?.format !== 'png' || entry.sourceImage?.format !== 'png'
      || entry.sourceImage?.channels !== 4 || !(entry.sourceImage?.bytes > 0) || entry.fileAvailable !== true
      || ![entry.sourceImage?.width, entry.sourceImage?.height].every(size => Number.isInteger(size) && size >= 64 && size <= 4096)
      || !Array.isArray(entry.references) || !entry.references.length) throw new Error('Invalid public image record.');
    seen.add(entry.output);
    for (const reference of entry.references) {
      if (!webUrl(reference.url) || !webUrl(reference.finalUrl) || !digest.test(reference.sha256 || '')
        || reference.httpStatus !== 200 || reference.viewed !== true || reference.publiclyRedistributed !== false
        || !label(reference.incarnation) || !Number.isFinite(Date.parse(reference.downloadedAt))
        || !(reference.bytes > 0) || !(reference.width > 0) || !(reference.height > 0)
        || !['png', 'jpeg', 'webp', 'gif'].includes(reference.format)) throw new Error('Invalid recorded web reference.');
    }
    const bytes = await fs.readFile(await regularFile(path.join(root, 'public', entry.output.slice(1))));
    if (hash(bytes) !== entry.image.sha256 || bytes.length !== entry.image.bytes) throw new Error('Installed image digest or length differs.');
    const geometry = await inspectReferencedCharacterPng(bytes);
    if (geometry.minimumGuard !== entry.processing?.minimumGuard
      || JSON.stringify(geometry.visiblePixelsByCell) !== JSON.stringify(entry.processing?.visiblePixelsByCell)
      || JSON.stringify(geometry.visibleFootBaselinesByCell) !== JSON.stringify(entry.processing?.visibleFootBaselinesByCell)
      || entry.processing?.nonemptyCells !== 16 || entry.processing?.sourceFringePixels !== 4
      || entry.processing?.alphaBoundsThreshold !== 12 || !(entry.processing?.sourceVisiblePixels > 0)
      || entry.processing?.sourceVisiblePixels !== entry.processing?.assignedVisiblePixels) throw new Error('Installed image geometry differs.');
  }
  return { verified: document.entries.length, referenceEvidence: 'private downloaded bytes; public URL/digest record', canonicalFidelityApproved: false };
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const main = async () => {
    const args = process.argv.slice(2);
    const options = {};
    for (let index = 0; index < args.length; index += 2) {
      const key = { '--root': 'root', '--manifest': 'manifestPath', '--public-manifest': 'publicManifestPath', '--audit': 'auditPath' }[args[index]];
      if (!key || !args[index + 1] || args[index + 1].startsWith('--')) throw new Error('Unknown or incomplete argument.');
      options[key] = args[index + 1];
    }
    if (options.auditPath && options.publicManifestPath) throw new Error('Choose installation or audit.');
    console.log(JSON.stringify(options.auditPath
      ? await auditWebReferencedCharacterImages({ root: options.root, manifestPath: options.auditPath })
      : await installWebReferencedCharacterImages(options)));
  };
  main().catch(() => { console.error('Web-referenced character image installation or audit failed.'); process.exitCode = 1; });
}
