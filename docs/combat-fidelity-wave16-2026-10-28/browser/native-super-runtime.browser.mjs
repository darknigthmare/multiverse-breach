import { createServer } from 'vite';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { snapshotPresentationInputs, finishPresentationIntegrity, hashPresentationArtifacts, waveDirectory, writeJson, readBytes, sha } from './presentation-input-integrity.mjs';
const startedAt = new Date().toISOString(), preliminary = process.argv.includes('--preliminary');
assert.ok(preliminary || process.argv.includes('--after-production-freeze'));
const harness = waveDirectory + '/browser/native-super-runtime.browser.mjs';
const runtimeSource = waveDirectory + '/browser/runtime-cases.js';
const before = await snapshotPresentationInputs({ preliminary, extraFiles: [harness, runtimeSource] });
const require = createRequire(import.meta.url), { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const errors = [], requests = []; let result, isolated, browserClosedAt;
if (preliminary) {
 isolated = await createServer({ logLevel: 'silent', server: { host: '127.0.0.1', port: 5192,
  strictPort: true, hmr: false, watch: { ignored: ['**/*'] } } });
 await isolated.listen();
}
try {
 const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
 await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ status: 200, contentType: 'text/css', body: '/* Runtime proof labels use local monospace; external font is excluded. */' }));
 page.on('pageerror', error => errors.push(error.message)); page.on('requestfailed', request => requests.push({ url: request.url(), error: request.failure()?.errorText }));
 await page.goto(preliminary ? 'http://127.0.0.1:5192/' : process.env.BROWSER_BASE_URL || 'http://127.0.0.1:5188/', { waitUntil: 'networkidle' });
 result = await page.evaluate(async () => {
  const { runWave16RuntimeCases } = await import('/docs/combat-fidelity-wave16-2026-10-28/browser/runtime-cases.js');
  return runWave16RuntimeCases();
 });
} finally { await browser.close(); browserClosedAt = new Date().toISOString(); assert.equal(browser.isConnected(), false); await isolated?.close(); }
const integrity = await finishPresentationIntegrity(before, { preliminary, extraFiles: [harness, runtimeSource] });
const stem = preliminary ? 'native-super-preliminary' : 'native-super';
const artifactPath = waveDirectory + '/browser/' + stem + '-contact-sheet.png';
await fs.writeFile(artifactPath, Buffer.from(result.contactSheet.split(',')[1], 'base64')); delete result.contactSheet;
const companionPath = waveDirectory + '/browser/' + stem + '-protection-companion-contact-sheet.png';
await fs.writeFile(companionPath, Buffer.from(result.protectionCompanionContactSheet.split(',')[1], 'base64'));delete result.protectionCompanionContactSheet;
const tracePath = waveDirectory + '/browser/' + stem + '-trace.json'; await writeJson(tracePath, result.sourceDraws); delete result.sourceDraws;
const report = { date: '2026-10-28', startedAt, finishedAt: new Date().toISOString(), preliminary,
 allBrowserWindowsClosed: true, browserClosedAt,
 harness, harnessSha256: sha(await readBytes(harness)), runtimeSource, runtimeSourceSha256: sha(await readBytes(runtimeSource)),
 partial: result.results.some(row => row.bodyKind === 'fallback') || !integrity.stable,
 passed: result.results.length === 720 && result.failures.length === 0 && errors.length === 0 && requests.length === 0,
 actualAuthoritativeFixtures: result.results.length, expectedCases: 720, ...result, errors, failedRequests: requests,
 companionBothFacingsByMode: Object.fromEntries(['fighter','rpg','melee'].map(mode => [mode, new Set(result.results.filter(row => row.mode === mode && row.sourceProtectionEntityProof).map(row => row.sourceProtectionEntityProof.facing)).size === 2])),
 externalFontExcluded: true, proofLabelFont: 'local monospace',
 artifacts: await hashPresentationArtifacts([artifactPath, tracePath, companionPath]), ...integrity, source1to1Verified: false };
await writeJson(waveDirectory + '/browser/' + stem + '-runtime.json', report);
console.log(JSON.stringify({ passed: report.passed, cases: result.results.length, failures: result.failures, errors, requests }, null, 2));
assert.equal(report.passed, true);
if (!preliminary) {
 assert.ok(Object.values(report.companionBothFacingsByMode).every(Boolean), 'Native companion must be rendered for both camps in each engine');
 assert.equal(report.partial, false, 'Final720 requires all actual native deliveries and stable frozen inputs');
 for (const row of report.results.filter(row => row.id === 'kirito_sao')) {
  assert.deepEqual([...new Set(row.sequence.native16DrawnIndices)].sort((a,b) => a-b), Array.from({ length: 16 }, (_, index) => index));
  assert.deepEqual([...new Set(row.sequence.native32DrawnColumns)].sort(), [0,1,2,3]);
 }
}
