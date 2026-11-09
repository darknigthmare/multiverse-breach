import { createServer } from 'vite';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { snapshotPresentationInputs, finishPresentationIntegrity, hashPresentationArtifacts, waveDirectory, writeJson, readBytes, sha } from './presentation-input-integrity.mjs';
import { WAVE_17_PARTS } from '../../../src/game/combat/cohortWave17.js';
const startedAt = new Date().toISOString(), preliminary = process.argv.includes('--preliminary');
assert.ok(preliminary || process.argv.includes('--after-production-freeze'));
const selectedParts = process.argv.find(arg => arg.startsWith('--parts='))?.slice(8).split(',');
assert.ok(preliminary || !selectedParts, 'A final execution must cover all three complete cohorts');
if (selectedParts) assert.ok(selectedParts.length > 0 && new Set(selectedParts).size === selectedParts.length && selectedParts.every(part => WAVE_17_PARTS[part]));
const selectedIds = (selectedParts || ['A', 'B', 'C']).flatMap(part => WAVE_17_PARTS[part]);
const harness = waveDirectory + '/browser/native-super-runtime.browser.mjs';
const runtimeSource = waveDirectory + '/browser/runtime-cases.js';
const before = await snapshotPresentationInputs({ preliminary, extraFiles: [harness, runtimeSource] });
const require = createRequire(import.meta.url), { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const errors = [], requests = []; let result, isolated, browserClosedAt;
if (preliminary) {
 isolated = await createServer({ logLevel: 'silent', cacheDir: '/tmp/w17-native-runtime-vite-cache',
  plugins: [{ name: 'wave17-native-static-review-inputs', configResolved(config) {
   config.server.watch = null; config.server.hmr = false;
  } }], server: { host: '127.0.0.1', port: 5192,
  strictPort: true, hmr: false, watch: null } });
 await isolated.listen();
}
try {
 const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
 await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ status: 200, contentType: 'text/css', body: '/* Runtime proof labels use local monospace; external font is excluded. */' }));
 page.on('pageerror', error => errors.push(error.message)); page.on('requestfailed', request => requests.push({ url: request.url(), error: request.failure()?.errorText }));
 await page.goto(preliminary ? 'http://127.0.0.1:5192/' : process.env.BROWSER_BASE_URL || 'http://127.0.0.1:5188/', { waitUntil: 'networkidle' });
 result = await page.evaluate(async ids => {
  const { runWave17RuntimeCases } = await import('/docs/combat-fidelity-wave17-2026-11-02/browser/runtime-cases.js');
  return runWave17RuntimeCases({ ids });
 }, selectedIds);
} finally { await browser.close(); browserClosedAt = new Date().toISOString(); assert.equal(browser.isConnected(), false); await isolated?.close(); }
const integrity = await finishPresentationIntegrity(before, { preliminary, extraFiles: [harness, runtimeSource] });
const stem = preliminary ? 'native-super-preliminary' : 'native-super';
const artifactPath = waveDirectory + '/browser/' + stem + '-contact-sheet.png';
await fs.writeFile(artifactPath, Buffer.from(result.contactSheet.split(',')[1], 'base64')); delete result.contactSheet;
delete result.protectionCompanionContactSheet;
const tracePath = waveDirectory + '/browser/' + stem + '-trace.json'; await writeJson(tracePath, result.sourceDraws); delete result.sourceDraws;
const report = { date: '2026-11-02', startedAt, finishedAt: new Date().toISOString(), preliminary,
 allBrowserWindowsClosed: true, browserClosedAt,
 harness, harnessSha256: sha(await readBytes(harness)), runtimeSource, runtimeSourceSha256: sha(await readBytes(runtimeSource)),
 partial: selectedIds.length !== 120 || result.results.some(row => row.bodyKind === 'fallback') || !integrity.stable,
 passed: result.results.length === selectedIds.length * 6 && result.failures.length === 0 && errors.length === 0 && requests.length === 0,
 actualAuthoritativeFixtures: result.results.length, expectedCases: selectedIds.length * 6, selectedParts: selectedParts || ['A', 'B', 'C'], ...result, errors, failedRequests: requests,
 committedCastCases: result.results.filter(row => row.committed).length,
 conditionallyUnavailableCases: result.results.filter(row => row.bodyKind === 'native-conditionally-unavailable').map(row => ({ id: row.id, mode: row.mode, side: row.side, committed: row.committed, reason: row.reason })),
 externalFontExcluded: true, proofLabelFont: 'local monospace',
 artifacts: await hashPresentationArtifacts([artifactPath, tracePath]), before, ...integrity, source1to1Verified: false };
await writeJson(waveDirectory + '/browser/' + stem + '-runtime.json', report);
console.log(JSON.stringify({ passed: report.passed, cases: result.results.length, failures: result.failures, errors, requests }, null, 2));
assert.equal(report.passed, true);
if (!preliminary) assert.equal(report.partial, false, 'Final720 requires all actual native deliveries and unchanged frozen inputs');
