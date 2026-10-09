import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import sharp from 'sharp';
import {
  installWebReferencedCharacterImages,
  auditWebReferencedCharacterImages
} from './installWebReferencedCharacterImages.mjs';
import { normalizeReferencedCharacterPng } from './installReferencedCharacterImages.mjs';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const output = '/sprites/generated/heroes/web-installer-test/first.png';
const secondOutput = '/sprites/generated/heroes/web-installer-test/second.png';
const publicManifestPath = 'docs/audits/web-installer-test.json';
const exists = async file => {
  try { await fs.lstat(file); return true; } catch (error) { if (error.code === 'ENOENT') return false; throw error; }
};
const publicFile = (root, url) => path.join(root, 'public', url.slice(1));
const listFiles = async directory => {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(file));
    else files.push(file);
  }
  return files;
};

// This is synthetic test data, never product artwork. Distinct small RGBA
// blocks make packing and transaction assertions independent of real assets.
let fixturePixels;
const fixtureRaster = async () => {
  fixturePixels ??= (async () => {
    const width = 256;
    const pixels = Buffer.alloc(width * width * 4);
    for (let cell = 0; cell < 16; cell += 1) {
      for (let y = 20; y < 44; y += 1) for (let x = 20; x < 32; x += 1) {
        const index = ((Math.floor(cell / 4) * 64 + y) * width + cell % 4 * 64 + x) * 4;
        pixels[index] = 40 + cell * 10;
        pixels[index + 1] = 50 + cell * 7;
        pixels[index + 2] = 90;
        pixels[index + 3] = 255;
      }
    }
    const source = await sharp(pixels, { raw: { width, height: width, channels: 4 } }).png().toBuffer();
    const normalized = await normalizeReferencedCharacterPng(source);
    return { source, normalized };
  })();
  return fixturePixels;
};

const fixture = async t => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'web-reference-image-test-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const root = path.join(directory, 'repo');
  const privateDir = path.join(directory, 'private');
  await fs.mkdir(root);
  await fs.mkdir(privateDir);
  const { source, normalized } = await fixtureRaster();
  const sourcePath = path.join(privateDir, 'source.png');
  const referencePath = path.join(privateDir, 'downloaded-body.png');
  const generationPath = path.join(privateDir, 'generation-evidence.json');
  const peerPath = path.join(privateDir, 'peer-review.json');
  const manifestPath = path.join(privateDir, 'plan.json');
  await fs.writeFile(sourcePath, source);
  await fs.writeFile(referencePath, source);
  const generation = {
    schemaVersion: 1, provider: 'OpenAI', interface: 'built-in image_gen',
    sourceSha256: hash(source), referenceSha256s: [hash(source)],
    generationId: 'TEST_PRIVATE_GENERATION_ID', prompt: 'TEST_PRIVATE_PROMPT_NOT_FOR_PUBLICATION'
  };
  const peer = {
    accepted: true, sourceSha256: hash(source), imageSha256: hash(normalized.buffer),
    referenceSha256s: [hash(source)], canonicalFidelityApproved: false
  };
  const generationBytes = Buffer.from(JSON.stringify(generation));
  const peerBytes = Buffer.from(JSON.stringify(peer));
  await fs.writeFile(generationPath, generationBytes);
  await fs.writeFile(peerPath, peerBytes);
  const job = {
    kind: 'hero', id: 'first', name: 'First Fixture', universe: 'Web Installer Test', output,
    source: { path: 'source.png', sha256: hash(source) },
    generationEvidence: { path: 'generation-evidence.json', sha256: hash(generationBytes) },
    peerEvidence: { path: 'peer-review.json', sha256: hash(peerBytes) },
    provider: 'OpenAI', interface: 'built-in image_gen', canonicalFidelityApproved: false,
    references: [{ path: 'downloaded-body.png', sha256: hash(source),
      url: 'https://example.com/canonical-body.png', finalUrl: 'https://images.example.com/body.png',
      httpStatus: 200, downloadedAt: '2026-10-02T12:00:00.000Z', viewed: true,
      incarnation: 'Synthetic installer fixture; not a canonical character' }],
    visualReview: { status: 'close-to-reference', notes: ['Synthetic transaction-test fixture only.'] }
  };
  const writePlan = async jobs => fs.writeFile(manifestPath, JSON.stringify({ schemaVersion: 1, jobs }));
  const writePeer = async review => {
    const bytes = Buffer.from(JSON.stringify(review));
    await fs.writeFile(peerPath, bytes);
    job.peerEvidence.sha256 = hash(bytes);
  };
  const writeGeneration = async evidence => {
    const bytes = Buffer.from(JSON.stringify(evidence));
    await fs.writeFile(generationPath, bytes);
    job.generationEvidence.sha256 = hash(bytes);
  };
  await writePlan([job]);
  const options = { root, manifestPath, publicManifestPath };
  const assertNoPublicWrites = async () => {
    assert.equal(await exists(publicFile(root, output)), false);
    assert.equal(await exists(publicFile(root, secondOutput)), false);
    assert.equal(await exists(path.join(root, publicManifestPath)), false);
  };
  return { root, privateDir, directory, source, normalized, sourcePath, referencePath,
    generationPath, generation, peerPath, peer, manifestPath, job, writePlan, writePeer,
    writeGeneration, options, assertNoPublicWrites };
};

test('installs exact packed PNG and records truthful web digests without redistributing references or private evidence', async t => {
  const f = await fixture(t);
  const privateBefore = new Map(await Promise.all((await listFiles(f.privateDir)).map(async file => [file, hash(await fs.readFile(file))])));
  const result = await installWebReferencedCharacterImages(f.options);
  assert.deepEqual(result, { installed: 1, publicManifestPath, canonicalFidelityApproved: false });
  assert.equal(hash(await fs.readFile(publicFile(f.root, output))), hash(f.normalized.buffer));
  const manifest = JSON.parse(await fs.readFile(path.join(f.root, publicManifestPath), 'utf8'));
  assert.equal(manifest.entries.length, 1);
  const entry = manifest.entries[0];
  assert.equal(entry.sourceImage.sha256, hash(f.source));
  assert.equal(entry.image.sha256, hash(f.normalized.buffer));
  assert.equal(entry.references[0].sha256, hash(f.source));
  assert.equal(entry.references[0].bytes, f.source.length);
  assert.equal(entry.references[0].width, 256);
  assert.equal(entry.references[0].height, 256);
  assert.equal(entry.references[0].format, 'png');
  assert.equal(entry.references[0].publiclyRedistributed, false);
  assert.equal(entry.canonicalFidelityApproved, false);
  assert.equal(manifest.policy.referenceImagesRedistributed, false);
  assert.equal(entry.privateEvidence.generationSha256, f.job.generationEvidence.sha256);
  assert.equal(entry.privateEvidence.peerReviewSha256, f.job.peerEvidence.sha256);
  const serialized = JSON.stringify(manifest);
  for (const privateValue of [f.privateDir, f.sourcePath, f.generationPath, f.peerPath, f.generation.prompt, f.generation.generationId]) assert.equal(serialized.includes(privateValue), false);
  assert.deepEqual((await listFiles(f.root)).sort(), [publicFile(f.root, output), path.join(f.root, publicManifestPath)].sort());
  for (const [file, digest] of privateBefore) assert.equal(hash(await fs.readFile(file)), digest);
  assert.equal((await auditWebReferencedCharacterImages({ root: f.root, manifestPath: publicManifestPath })).verified, 1);
});

test('an existing PNG or manifest is never overwritten, even with a valid plan', async t => {
  for (const target of ['png', 'manifest']) {
    const f = await fixture(t);
    const existing = target === 'png' ? publicFile(f.root, output) : path.join(f.root, publicManifestPath);
    const original = Buffer.from('PREEXISTING_PUBLIC_CONTENT');
    await fs.mkdir(path.dirname(existing), { recursive: true });
    await fs.writeFile(existing, original);
    await assert.rejects(installWebReferencedCharacterImages(f.options), /overwrite/i);
    assert.deepEqual(await fs.readFile(existing), original);
    const absent = target === 'png' ? path.join(f.root, publicManifestPath) : publicFile(f.root, output);
    assert.equal(await exists(absent), false);
  }
});

test('validating every job precedes all public writes, including later invalid jobs', async t => {
  const f = await fixture(t);
  const second = { ...structuredClone(f.job), id: 'second', output: secondOutput, source: { ...f.job.source, sha256: '0'.repeat(64) } };
  await f.writePlan([f.job, second]);
  await assert.rejects(installWebReferencedCharacterImages(f.options), /source image.*mismatch/i);
  await f.assertNoPublicWrites();
});

test('duplicate identities and duplicate destinations fail before installing any member', async t => {
  for (const duplicate of ['identity', 'output']) {
    const f = await fixture(t);
    const second = { ...structuredClone(f.job), id: duplicate === 'identity' ? f.job.id : 'second', output: duplicate === 'output' ? output : secondOutput };
    await f.writePlan([f.job, second]);
    await assert.rejects(installWebReferencedCharacterImages(f.options), /duplicate/i);
    await f.assertNoPublicWrites();
  }
});

test('source, generation evidence, peer evidence and downloaded reference bytes must match their SHA256', async t => {
  for (const field of ['source', 'generationEvidence', 'peerEvidence', 'references']) {
    const f = await fixture(t);
    const declaration = field === 'references' ? f.job.references[0] : f.job[field];
    declaration.sha256 = '0'.repeat(64);
    await f.writePlan([f.job]);
    await assert.rejects(installWebReferencedCharacterImages(f.options), /SHA-256 mismatch/i);
    await f.assertNoPublicWrites();
  }
});

test('peer acceptance is bound to the exact native image, packed image and ordered reference digests', async t => {
  for (const mutation of [
    review => { review.accepted = false; },
    review => { review.sourceSha256 = '0'.repeat(64); },
    review => { review.imageSha256 = '0'.repeat(64); },
    review => { review.referenceSha256s = ['0'.repeat(64)]; },
    review => { review.canonicalFidelityApproved = true; }
  ]) {
    const f = await fixture(t);
    const review = structuredClone(f.peer);
    mutation(review);
    await f.writePeer(review);
    await f.writePlan([f.job]);
    await assert.rejects(installWebReferencedCharacterImages(f.options), /peer review/i);
    await f.assertNoPublicWrites();
  }
});

test('generation evidence binds the declared tool, native image and exact ordered web references', async t => {
  for (const mutation of [
    evidence => { evidence.schemaVersion = 2; },
    evidence => { evidence.provider = 'CSS'; },
    evidence => { evidence.interface = 'bash'; },
    evidence => { evidence.sourceSha256 = '0'.repeat(64); },
    evidence => { evidence.referenceSha256s = ['0'.repeat(64)]; },
    evidence => { delete evidence.referenceSha256s; }
  ]) {
    const f = await fixture(t);
    const evidence = structuredClone(f.generation);
    mutation(evidence);
    await f.writeGeneration(evidence);
    await f.writePlan([f.job]);
    await assert.rejects(installWebReferencedCharacterImages(f.options), /generation evidence|source.*evidence|reference.*evidence/i);
    await f.assertNoPublicWrites();
  }
});

test('multiple distinct web references are bound in their reviewed order rather than accepted as an unordered set', async t => {
  for (const reversed of [null, 'peer', 'generation']) {
    const f = await fixture(t);
    const other = await sharp(f.source).extract({ left: 20, top: 20, width: 12, height: 24 }).png().toBuffer();
    await fs.writeFile(path.join(f.privateDir, 'other-body.png'), other);
    const digests = [hash(f.source), hash(other)];
    assert.notEqual(digests[0], digests[1]);
    f.job.references.push({ ...structuredClone(f.job.references[0]), path: 'other-body.png', sha256: digests[1],
      url: 'https://example.com/other-body.png', finalUrl: 'https://images.example.com/other-body.png' });
    await f.writePeer({ ...f.peer, referenceSha256s: reversed === 'peer' ? [...digests].reverse() : digests });
    await f.writeGeneration({ ...f.generation, referenceSha256s: reversed === 'generation' ? [...digests].reverse() : digests });
    await f.writePlan([f.job]);
    if (reversed) {
      await assert.rejects(installWebReferencedCharacterImages(f.options), /references|reference digests/i);
      await f.assertNoPublicWrites();
    } else {
      await installWebReferencedCharacterImages(f.options);
      const manifest = JSON.parse(await fs.readFile(path.join(f.root, publicManifestPath), 'utf8'));
      assert.deepEqual(manifest.entries[0].references.map(reference => reference.sha256), digests);
      assert.equal(manifest.entries[0].references[1].width, 12);
      assert.equal(manifest.entries[0].references[1].height, 24);
    }
  }
});

test('a declared reference must be HTTPS, fetched with 200, viewed, dated and incarnation-labelled', async t => {
  for (const mutation of [
    reference => { reference.url = 'http://example.com/body.png'; },
    reference => { reference.finalUrl = 'https://user:password@example.com/body.png'; },
    reference => { reference.finalUrl = 'https://localhost/body.png'; },
    reference => { reference.httpStatus = 404; },
    reference => { reference.viewed = false; },
    reference => { reference.downloadedAt = 'unparsed'; },
    reference => { reference.incarnation = ''; }
  ]) {
    const f = await fixture(t);
    mutation(f.job.references[0]);
    await f.writePlan([f.job]);
    await assert.rejects(installWebReferencedCharacterImages(f.options), /downloaded.*viewed.*HTTPS/i);
    await f.assertNoPublicWrites();
  }
});

test('HTML masquerading as a downloaded image cannot enter the reference record', async t => {
  const f = await fixture(t);
  const html = Buffer.from('<!doctype html><html>ACCESS DENIED; this is not a body image</html>');
  await fs.writeFile(f.referencePath, html);
  f.job.references[0].sha256 = hash(html);
  await f.writePeer({ ...f.peer, referenceSha256s: [hash(html)] });
  await f.writePlan([f.job]);
  await assert.rejects(installWebReferencedCharacterImages(f.options), /raster|image|format|decode/i);
  await f.assertNoPublicWrites();
});

test('a truncated PNG with readable dimensions must still fail full reference-pixel decoding', async t => {
  const f = await fixture(t);
  const truncated = f.source.subarray(0, 80);
  const metadata = await sharp(truncated, { failOn: 'error' }).metadata();
  assert.equal(metadata.format, 'png');
  assert.equal(metadata.width, 256);
  await assert.rejects(sharp(truncated, { failOn: 'error' }).raw().toBuffer());
  await fs.writeFile(f.referencePath, truncated);
  f.job.references[0].sha256 = hash(truncated);
  await f.writePeer({ ...f.peer, referenceSha256s: [hash(truncated)] });
  await f.writePlan([f.job]);
  await assert.rejects(installWebReferencedCharacterImages(f.options), /raster|image|PNG|decode|corrupt/i);
  await f.assertNoPublicWrites();
});

test('an invalid declared provider, review or kind/output association is rejected before installation', async t => {
  for (const mutation of [
    job => { job.provider = 'CSS'; },
    job => { job.interface = 'bash'; },
    job => { job.canonicalFidelityApproved = true; },
    job => { job.visualReview.status = 'pending'; },
    job => { job.kind = 'enemy'; },
    job => { job.kind = 'unknown'; }
  ]) {
    const f = await fixture(t);
    mutation(f.job);
    await f.writePlan([f.job]);
    await assert.rejects(installWebReferencedCharacterImages(f.options), /reviewed image job/i);
    await f.assertNoPublicWrites();
  }
});

test('destinations and private input paths reject traversal rather than escaping the repository or evidence directory', async t => {
  for (const mutation of [
    f => { f.job.output = '/sprites/generated/heroes/../outside.png'; },
    f => { f.options.publicManifestPath = '../outside.json'; },
    f => { f.job.source.path = '../source.png'; },
    f => { f.job.references[0].path = '../downloaded-body.png'; }
  ]) {
    const f = await fixture(t);
    mutation(f);
    await f.writePlan([f.job]);
    await assert.rejects(installWebReferencedCharacterImages(f.options), /manifest|reviewed|input|destination/i);
    await f.assertNoPublicWrites();
  }
});

test('input-file and input-ancestor symlinks cannot substitute unreviewed outside evidence', async t => {
  for (const location of ['leaf', 'ancestor']) {
    const f = await fixture(t);
    if (location === 'leaf') {
      const linked = path.join(f.privateDir, 'linked-source.png');
      await fs.symlink(f.sourcePath, linked);
      f.job.source.path = 'linked-source.png';
    } else {
      await fs.symlink(f.privateDir, path.join(f.directory, 'linked-private'), 'dir');
      f.job.source.path = path.join(f.directory, 'linked-private', 'source.png');
    }
    await f.writePlan([f.job]);
    await assert.rejects(installWebReferencedCharacterImages(f.options), /symlink|unsafe/i);
    await f.assertNoPublicWrites();
  }
});

test('a symlink in the repository root or an output ancestor is rejected without outside writes', async t => {
  for (const location of ['root', 'parent']) {
    const f = await fixture(t);
    const outside = path.join(f.directory, 'outside');
    await fs.mkdir(outside);
    if (location === 'root') {
      const linkedRoot = path.join(f.directory, 'linked-repo');
      await fs.symlink(f.root, linkedRoot, 'dir');
      f.options.root = linkedRoot;
    } else {
      await fs.mkdir(path.join(f.root, 'public'));
      await fs.symlink(outside, path.join(f.root, 'public', 'sprites'), 'dir');
    }
    await assert.rejects(installWebReferencedCharacterImages(f.options), /symlink/i);
    assert.deepEqual(await listFiles(outside), []);
    await f.assertNoPublicWrites();
  }
});

test('failure after writing a batch member rolls back owned PNGs and never publishes a partial manifest', async t => {
  const f = await fixture(t);
  const second = { ...structuredClone(f.job), id: 'second', output: secondOutput };
  await f.writePlan([f.job, second]);
  await assert.rejects(installWebReferencedCharacterImages({ ...f.options, hooks: {
    afterAssetWrite(index) { if (index === 1) throw new Error('INJECTED_BATCH_FAILURE'); }
  } }), /INJECTED_BATCH_FAILURE/);
  await f.assertNoPublicWrites();
});

test('a concurrently appearing later output is preserved while this transaction removes only its own earlier writes', async t => {
  const f = await fixture(t);
  const second = { ...structuredClone(f.job), id: 'second', output: secondOutput };
  await f.writePlan([f.job, second]);
  const concurrent = Buffer.from('CONCURRENT_FILE_NOT_OWNED_BY_INSTALLER');
  await assert.rejects(installWebReferencedCharacterImages({ ...f.options, hooks: {
    async afterAssetWrite(index) { if (index === 0) await fs.writeFile(publicFile(f.root, secondOutput), concurrent, { flag: 'wx' }); }
  } }), /overwrite|exist/i);
  assert.deepEqual(await fs.readFile(publicFile(f.root, secondOutput)), concurrent);
  assert.equal(await exists(publicFile(f.root, output)), false);
  assert.equal(await exists(path.join(f.root, publicManifestPath)), false);
});

test('a manifest race cannot overwrite another publisher and rolls back the transaction PNG', async t => {
  const f = await fixture(t);
  const concurrent = Buffer.from('CONCURRENT_MANIFEST_NOT_OWNED_BY_INSTALLER');
  await assert.rejects(installWebReferencedCharacterImages({ ...f.options, hooks: {
    async afterAssetWrite() {
      const file = path.join(f.root, publicManifestPath);
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, concurrent, { flag: 'wx' });
    }
  } }), /overwrite|exist/i);
  assert.deepEqual(await fs.readFile(path.join(f.root, publicManifestPath)), concurrent);
  assert.equal(await exists(publicFile(f.root, output)), false);
});

test('post-write image tampering is caught by the final audit and rolls back the owned manifest and image', async t => {
  const f = await fixture(t);
  await assert.rejects(installWebReferencedCharacterImages({ ...f.options, hooks: {
    async beforeFinalAudit() { await fs.writeFile(publicFile(f.root, output), Buffer.from('CORRUPTED_PACKED_IMAGE')); }
  } }), /digest|length|SHA|PNG/i);
  await f.assertNoPublicWrites();
});

test('rollback cannot follow a swapped parent symlink to delete an outside pre-existing image', async t => {
  const f = await fixture(t);
  const outside = path.join(f.directory, 'outside');
  await fs.mkdir(outside);
  const victim = path.join(outside, 'first.png');
  const original = Buffer.from('OUTSIDE_PREEXISTING_FILE_MUST_SURVIVE');
  await fs.writeFile(victim, original);
  await assert.rejects(installWebReferencedCharacterImages({ ...f.options, hooks: {
    async beforeFinalAudit() {
      const parent = path.dirname(publicFile(f.root, output));
      await fs.rename(parent, path.join(f.privateDir, 'moved-original-output-directory'));
      await fs.symlink(outside, parent, 'dir');
    }
  } }), /symlink|rollback/i);
  assert.equal(await exists(victim), true, 'rollback deleted an outside file through a parent symlink');
  assert.deepEqual(await fs.readFile(victim), original);
});

test('rollback preserves a foreign replacement at an owned pathname instead of deleting its new inode', async t => {
  const f = await fixture(t);
  const foreign = Buffer.from('FOREIGN_REPLACEMENT_MUST_SURVIVE');
  await assert.rejects(installWebReferencedCharacterImages({ ...f.options, hooks: {
    async afterAssetWrite(_index, asset) {
      await fs.rename(asset.destination, path.join(f.privateDir, 'moved-owned-image.png'));
      await fs.writeFile(asset.destination, foreign, { flag: 'wx' });
      throw new Error('INJECTED_BATCH_FAILURE');
    }
  } }), /INJECTED_BATCH_FAILURE|rollback/i);
  assert.equal(await exists(publicFile(f.root, output)), true, 'rollback deleted a foreign replacement');
  assert.deepEqual(await fs.readFile(publicFile(f.root, output)), foreign);
});

test('invalid private JSON and missing private inputs produce generic errors without private bytes or locations', async t => {
  for (const target of ['plan', 'missing-plan', 'peer', 'generation', 'source']) {
    const f = await fixture(t);
    const marker = 'TEST_PRIVATE_PARSE_CONTENT_NOT_FOR_ERROR_OUTPUT';
    if (target === 'plan') await fs.writeFile(f.manifestPath, marker);
    else if (target === 'missing-plan') await fs.rm(f.manifestPath);
    else if (target === 'peer' || target === 'generation') {
      const bytes = Buffer.from(marker);
      const peer = target === 'peer';
      await fs.writeFile(peer ? f.peerPath : f.generationPath, bytes);
      f.job[peer ? 'peerEvidence' : 'generationEvidence'].sha256 = hash(bytes);
      await f.writePlan([f.job]);
    } else await fs.rm(f.sourcePath);
    let error;
    try { await installWebReferencedCharacterImages(f.options); } catch (caught) { error = caught; }
    assert.ok(error, `${target} unexpectedly succeeded`);
    assert.equal(error.message.includes(marker), false, `${target} leaked private JSON content`);
    assert.equal(error.message.includes(f.privateDir), false, `${target} leaked a private path`);
    await f.assertNoPublicWrites();
  }
});

test('public notes cannot leak private filesystem paths and no private evidence fields are serialized', async t => {
  const f = await fixture(t);
  f.job.visualReview.notes = [`Unreviewed private file /workspace/private/not-public.png`];
  await f.writePlan([f.job]);
  await assert.rejects(installWebReferencedCharacterImages(f.options), /private/i);
  await f.assertNoPublicWrites();
});

test('the standalone audit detects changed PNG bytes, symlinks and falsely certified public records', async t => {
  for (const tamper of ['image', 'symlink', 'canonical']) {
    const f = await fixture(t);
    await installWebReferencedCharacterImages(f.options);
    if (tamper === 'image') await fs.writeFile(publicFile(f.root, output), Buffer.from('TAMPER'));
    else if (tamper === 'symlink') {
      await fs.rm(publicFile(f.root, output));
      await fs.symlink(f.sourcePath, publicFile(f.root, output));
    } else {
      const file = path.join(f.root, publicManifestPath);
      const document = JSON.parse(await fs.readFile(file, 'utf8'));
      document.entries[0].canonicalFidelityApproved = true;
      await fs.writeFile(file, JSON.stringify(document));
    }
    await assert.rejects(auditWebReferencedCharacterImages({ root: f.root, manifestPath: publicManifestPath }), /digest|length|symlink|record/i);
  }
});

test('the audit rejects false public policy, provider and packed-image geometry assertions', async t => {
  const f = await fixture(t);
  await installWebReferencedCharacterImages(f.options);
  const file = path.join(f.root, publicManifestPath);
  const original = JSON.parse(await fs.readFile(file, 'utf8'));
  const tampering = [
    d => { d.policy.canonicalFidelityApproved = true; },
    d => { d.policy.referenceImagesRedistributed = true; },
    d => { d.policy.privatePromptsAndIdentifiersPublished = true; },
    d => { d.entries[0].source.provider = 'CSS'; },
    d => { d.entries[0].source.interface = 'bash'; },
    d => { d.entries[0].kind = 'unknown'; },
    d => { d.entries[0].kind = 'boss'; },
    d => { d.entries[0].id = null; },
    d => { d.entries[0].name = []; },
    d => { d.entries[0].universe = 'Malformed\nuniverse'; },
    d => { d.entries[0].image.width = 1; },
    d => { d.entries[0].image.height = 1; },
    d => { d.entries[0].image.channels = 3; },
    d => { d.entries[0].image.format = 'jpeg'; },
    d => { d.entries[0].sourceImage.width = 0; },
    d => { d.entries[0].sourceImage.height = 0; },
    d => { d.entries[0].sourceImage.width = 63; },
    d => { d.entries[0].sourceImage.height = 4097; },
    d => { d.entries[0].sourceImage.width = 256.5; },
    d => { d.entries[0].sourceImage.height = '256'; },
    d => { d.entries[0].processing.nonemptyCells = 1; },
    d => { d.entries[0].processing.sourceFringePixels = 0; },
    d => { d.entries[0].processing.alphaBoundsThreshold = 0; },
    d => { delete d.entries[0].processing.sourceVisiblePixels; delete d.entries[0].processing.assignedVisiblePixels; }
  ];
  for (const mutate of tampering) {
    const changed = structuredClone(original);
    mutate(changed);
    await fs.writeFile(file, JSON.stringify(changed));
    await assert.rejects(auditWebReferencedCharacterImages({ root: f.root, manifestPath: publicManifestPath }), /policy|provider|record|geometry|packing|source/i);
  }
});
