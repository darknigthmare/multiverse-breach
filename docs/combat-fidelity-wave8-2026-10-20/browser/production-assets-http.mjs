// Read-only production proof. Run after the integration owner confirms BUILD EXIT0:
// node docs/combat-fidelity-wave8-2026-10-20/browser/production-assets-http.mjs --after-build-exit-0
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const DIRECTORY = 'docs/combat-fidelity-wave8-2026-10-20/browser';
const AUDIT = 'docs/combat-fidelity-wave8-2026-10-20/current.json';
const HISTORICAL = 'docs/combat-fidelity-wave7-2026-10-20/validation.json';
const HISTORICAL_AUDIT = 'docs/combat-fidelity-wave7-2026-10-20/current.json';
const HISTORICAL_HTTP = 'docs/combat-fidelity-wave7-2026-10-20/browser/production-assets-http.json';
const BASE_URL = process.env.PRODUCTION_BASE_URL || 'http://127.0.0.1:5191';
// Only the frozen prior-wave baseline is fixed. The delivered W8 counts come from current.json.
const HISTORICAL_EXPECTED = { registries: 45, images: 179 };
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const read = relative => fs.readFile(path.resolve(ROOT, relative));
const writeJson = async (relative, value) => fs.writeFile(path.resolve(ROOT, DIRECTORY, relative), `${JSON.stringify(value, null, 2)}\n`);
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function checkPng(bytes, expected, label) {
  assert.ok(bytes.subarray(0, 8).equals(signature), `${label}: PNG signature`);
  assert.equal(bytes.readUInt32BE(16), expected.width, `${label}: width`);
  assert.equal(bytes.readUInt32BE(20), expected.height, `${label}: height`);
  assert.ok([4, 6].includes(bytes[25]), `${label}: alpha channel`);
  assert.equal(sha256(bytes), expected.sha256, `${label}: SHA256`);
}

async function chunks(values, size, run) {
  const results = [];
  for (let start = 0; start < values.length; start += size) {
    const settled = await Promise.allSettled(values.slice(start, start + size).map(run));
    const rejected = settled.filter(result => result.status === 'rejected');
    if (rejected.length) throw new AggregateError(rejected.map(result => result.reason), 'Asset verification failed');
    results.push(...settled.map(result => result.value));
  }
  return results;
}

async function inventory() {
  const [auditBytes, historicalBytes, historicalAuditBytes, historicalHttpBytes] = await Promise.all([
    read(AUDIT), read(HISTORICAL), read(HISTORICAL_AUDIT), read(HISTORICAL_HTTP)
  ]);
  const audit = JSON.parse(auditBytes), historicalAudit = JSON.parse(historicalAuditBytes), historicalHttp = JSON.parse(historicalHttpBytes);
  const managed = audit.assetInventory;
  assert.ok(managed, 'Final managed audit must expose assetInventory');
  assert.ok(Array.isArray(managed.registries) && Array.isArray(managed.sheets));
  assert.equal(managed.registryFiles, managed.registries.length);
  assert.equal(new Set(managed.registries).size, managed.registries.length);
  assert.equal(managed.deliveredUniquePngFiles, managed.sheets.length);
  assert.equal(new Set(managed.sheets).size, managed.sheets.length);
  assert.ok(managed.registries.length > HISTORICAL_EXPECTED.registries, 'The final W8 inventory must include the delivered new registry files');
  assert.ok(managed.sheets.length > HISTORICAL_EXPECTED.images, 'The final W8 inventory must include delivered new images');
  assert.equal(historicalHttp.passed, true);
  assert.equal(historicalHttp.registryCount, HISTORICAL_EXPECTED.registries);
  assert.equal(historicalHttp.uniquePngCount, HISTORICAL_EXPECTED.images);
  assert.equal(historicalHttp.auditSha256, sha256(historicalAuditBytes), 'Historical W7 audit changed after its production proof');
  assert.deepEqual(historicalHttp.registries.map(registry => registry.file).sort(),
    [...historicalAudit.assetInventory.registries].sort(), 'W7 proof must cover every prior registry');
  const previousRegistries = new Map(historicalHttp.registries.map(registry => [registry.file, registry]));
  assert.equal(previousRegistries.size, HISTORICAL_EXPECTED.registries);
  const assets = new Map(), registries = [];
  for (const file of managed.registries) {
    assert.ok(file.startsWith('src/game/') && file.endsWith('.generated.json'), file);
    const bytes = await read(file), record = JSON.parse(bytes);
    const entries = (record.entries || []).filter(entry => typeof entry.sheet === 'string');
    assert.ok(entries.length, `${file}: no managed sheet entries`);
    const digest = sha256(bytes), historicalRegistry = previousRegistries.get(file);
    if (historicalRegistry) {
      assert.equal(digest, historicalRegistry.sha256, `${file}: prior W7 registry metadata changed`);
      assert.equal(entries.length, historicalRegistry.sheetEntries, `${file}: prior W7 entries changed`);
    }
    registries.push({ file, sha256: digest, sheetEntries: entries.length, historical: !!historicalRegistry });
    for (const entry of entries) {
      assert.ok(entry.sheet.startsWith('/sprites/') && entry.sheet.endsWith('.png') && !entry.sheet.includes('..'), entry.sheet);
      const asset = { sheet: entry.sheet, width: entry.width ?? entry.dimensions?.width,
        height: entry.height ?? entry.dimensions?.height, sha256: entry.sha256, registries: [file] };
      assert.ok(Number.isInteger(asset.width) && asset.width > 0 && Number.isInteger(asset.height) && asset.height > 0, entry.sheet);
      assert.match(asset.sha256 || '', /^[0-9a-f]{64}$/);
      const prior = assets.get(asset.sheet);
      if (prior) {
        assert.equal(asset.sha256, prior.sha256, `${asset.sheet}: conflicting registry hash`);
        assert.equal(asset.width, prior.width, `${asset.sheet}: conflicting registry width`);
        assert.equal(asset.height, prior.height, `${asset.sheet}: conflicting registry height`);
        prior.registries.push(file);
      } else assets.set(asset.sheet, asset);
    }
  }
  assert.equal(assets.size, managed.deliveredUniquePngFiles);
  for (const old of previousRegistries.keys()) assert.ok(registries.some(registry => registry.file === old && registry.historical), `Historical registry absent: ${old}`);
  assert.deepEqual([...assets.keys()].sort(), [...managed.sheets].sort(), 'Audit must not silently omit an invalid registry entry');
  const historical = JSON.parse(historicalBytes).distAssets;
  assert.equal(historical.length, HISTORICAL_EXPECTED.images);
  assert.equal(new Set(historical.map(asset => asset.sheet)).size, HISTORICAL_EXPECTED.images);
  for (const old of historical) {
    const current = assets.get(old.sheet);
    assert.ok(current, `Historical image absent: ${old.sheet}`);
    assert.equal(current.sha256, old.sha256, `Historical image modified: ${old.sheet}`);
    assert.equal(current.width, old.width, old.sheet); assert.equal(current.height, old.height, old.sheet);
  }
  return { auditSha256: sha256(auditBytes), historicalManifestSha256: sha256(historicalBytes),
    historicalAuditSha256: sha256(historicalAuditBytes), historicalHttpSha256: sha256(historicalHttpBytes),
    historicalRegistries: [...previousRegistries.values()],
    registries, assets: [...assets.values()].sort((a, b) => a.sheet.localeCompare(b.sheet)), historical };
}

async function main() {
  assert.ok(process.argv.includes('--after-build-exit-0'), 'Wait for the integration owner BUILD EXIT0 signal, then pass --after-build-exit-0');
  const proofPath = path.resolve(ROOT, DIRECTORY, 'production-assets-http.json');
  assert.equal(await fs.access(proofPath).then(() => true, () => false), false, 'A final production HTTP proof already exists; frozen evidence must not be overwritten');
  const snapshot = await inventory();
  const localAndHttp = await chunks(snapshot.assets, 8, async asset => {
    const publicPath = `public${asset.sheet}`, distPath = `dist${asset.sheet}`;
    const [publicBytes, distBytes] = await Promise.all([read(publicPath), read(distPath)]);
    checkPng(publicBytes, asset, publicPath); checkPng(distBytes, asset, distPath);
    assert.equal(Buffer.compare(publicBytes, distBytes), 0, `${asset.sheet}: public/dist bytes differ`);
    // A full libvips decode catches truncated/corrupt image data beyond the IHDR.
    const decoded = await sharp(distBytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(decoded.info.width, asset.width); assert.equal(decoded.info.height, asset.height);
    assert.equal(decoded.info.channels, 4); assert.equal(decoded.data.length, asset.width * asset.height * 4);
    const url = new URL(asset.sheet, BASE_URL).href;
    const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(20000) });
    assert.equal(response.status, 200, url);
    assert.match(response.headers.get('content-type') || '', /^image\/png\b/i, url);
    const httpBytes = Buffer.from(await response.arrayBuffer()); checkPng(httpBytes, asset, url);
    assert.equal(Buffer.compare(httpBytes, distBytes), 0, `${asset.sheet}: HTTP/dist bytes differ`);
    return { ...asset, bytes: distBytes.length, publicSha256: sha256(publicBytes), distSha256: sha256(distBytes),
      httpSha256: sha256(httpBytes), httpStatus: response.status, contentType: response.headers.get('content-type'),
      localFullDecode: true, historical: snapshot.historical.some(old => old.sheet === asset.sheet) };
  });
  const require = createRequire(import.meta.url);
  const { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  let decoded, pageErrors;
  try {
    const page = await browser.newPage(); pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    decoded = await page.evaluate(async assets => {
      const results = [];
      for (let start = 0; start < assets.length; start += 8) {
        const batch = await Promise.all(assets.slice(start, start + 8).map(async asset => {
          const response = await fetch(asset.sheet, { cache: 'no-store' });
          if (response.status !== 200) throw new Error(`${asset.sheet}: status${response.status}`);
          const bytes = await response.arrayBuffer();
          const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))]
            .map(value => value.toString(16).padStart(2, '0')).join('');
          if (digest !== asset.sha256) throw new Error(`${asset.sheet}: browser HTTP hash mismatch`);
          const objectUrl = URL.createObjectURL(new Blob([bytes], { type: 'image/png' }));
          try {
            const image = new Image(); image.src = objectUrl; await image.decode();
            if (image.naturalWidth !== asset.width || image.naturalHeight !== asset.height) throw new Error(`${asset.sheet}: decoded dimensions mismatch`);
            return { sheet: asset.sheet, sha256: digest, width: image.naturalWidth, height: image.naturalHeight, decoded: true };
          } finally { URL.revokeObjectURL(objectUrl); }
        }));
        results.push(...batch);
      }
      return results;
    }, snapshot.assets);
    assert.equal(decoded.length, snapshot.assets.length); assert.deepEqual(pageErrors, []);
  } finally { await browser.close(); }
  // The final audit and registry inputs must remain the same throughout the proof.
  assert.equal(sha256(await read(AUDIT)), snapshot.auditSha256);
  assert.equal(sha256(await read(HISTORICAL)), snapshot.historicalManifestSha256);
  assert.equal(sha256(await read(HISTORICAL_AUDIT)), snapshot.historicalAuditSha256);
  assert.equal(sha256(await read(HISTORICAL_HTTP)), snapshot.historicalHttpSha256);
  for (const registry of snapshot.registries) assert.equal(sha256(await read(registry.file)), registry.sha256, registry.file);
  const report = { date: '2026-10-20', passed: true, buildExit0SignalRequired: true, baseUrl: BASE_URL,
    audit: AUDIT, auditSha256: snapshot.auditSha256, registries: snapshot.registries,
    registryCount: snapshot.registries.length, uniquePngCount: localAndHttp.length,
    historicalManifest: HISTORICAL, historicalManifestSha256: snapshot.historicalManifestSha256,
    historicalImagesPreserved: HISTORICAL_EXPECTED.images, newManagedImages: snapshot.assets.length - HISTORICAL_EXPECTED.images,
    historicalAudit: HISTORICAL_AUDIT, historicalAuditSha256: snapshot.historicalAuditSha256,
    historicalRegistryProof: HISTORICAL_HTTP, historicalRegistryProofSha256: snapshot.historicalHttpSha256,
    historicalRegistryCount: snapshot.historicalRegistries.length, historicalRegistryMetadataBytesUnchanged: true,
    historicalRegistries: snapshot.historicalRegistries, inventoryCountSource: `${AUDIT}#assetInventory`,
    publicDistHttpBytesIdentical: true, localFullDecodeCount: localAndHttp.length, browserDecodeCount: decoded.length,
    browserHttpHashesMatch: true, pageErrors, assets: localAndHttp, browserImages: decoded, source1to1Verified: false };
  await writeJson('production-assets-http.json', report);
  await fs.writeFile(path.resolve(ROOT, DIRECTORY, 'production-assets-http.md'),
    `# Production PNG distribution\n\nPassed: ${report.uniquePngCount} PNGs from ${report.registryCount} managed registries. Public files, dist files, Node HTTP responses and browser HTTP responses have the declared SHA256 and dimensions. All ${report.uniquePngCount} images fully decode in libvips and Chromium.\n\nAll ${report.historicalImagesPreserved} previous-wave PNG hashes/dimensions and all ${report.historicalRegistryCount} complete prior registry metadata files are unchanged; ${report.newManagedImages} managed PNGs are new. Browser page errors:0. This validates distribution and decoding, not source-frame1:1 fidelity.\n`);
  console.log(JSON.stringify({ passed: true, registryCount: report.registryCount, uniquePngCount: report.uniquePngCount,
    historicalImagesPreserved: report.historicalImagesPreserved, browserDecodeCount: report.browserDecodeCount,
    historicalRegistryCount: report.historicalRegistryCount, historicalRegistryMetadataBytesUnchanged: true,
    publicDistHttpBytesIdentical: true, pageErrors }));
}

if (!process.argv.includes('--after-build-exit-0')) {
  console.error('Wait for the integration owner BUILD EXIT0 signal, then pass --after-build-exit-0. No proof or network request has been made.');
  process.exitCode = 2;
} else {
  try { await main(); }
  catch (error) {
    await writeJson(`production-assets-http.failure-${Date.now()}.json`, { date: '2026-10-20', passed: false,
      error: error.message, errors: error.errors?.map(cause => cause.message), stack: error.stack });
    throw error;
  }
}
