// Execute the actual imported stage renderer in Chromium. These vector studies
// are checked separately from newly generated character artwork.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import {
  repositoryRoot, waveDirectory, sha, readBytes, writeJson,
  snapshotPresentationInputs, finishPresentationIntegrity, hashPresentationArtifacts
} from './presentation-input-integrity.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const preliminary = process.argv.includes('--preliminary');
assert.ok(preliminary || process.argv.includes('--after-production-freeze'));
const startedAt = new Date().toISOString();
const attempt = `${waveDirectory}/browser/attempts/stages-${preliminary ? 'preliminary' : 'final'}-${startedAt.replace(/[^0-9]/g, '')}`;
const harness = `${waveDirectory}/browser/stages-wave16.mjs`;
const options = { preliminary, extraFiles: [harness, `${waveDirectory}/browser/presentation-input-integrity.mjs`] };
const before = await snapshotPresentationInputs(options);
await writeJson(`${attempt}/inputs-before.json`, before);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: 1640, height: 1440 }, deviceScaleFactor: 1 });
const pageErrors = [], consoleErrors = [], failedRequests = [];
page.on('pageerror', error => pageErrors.push(error.message));
page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
let result, failure, browserClosedAt;
const captures = [];
try {
  await page.goto(process.env.PRESENTATION_REVIEW_URL || 'http://127.0.0.1:5188/', { waitUntil: 'domcontentloaded' });
  result = await page.evaluate(async () => {
    const { renderStageAnimation, getStageAnimationProfile } = await import('/src/game/melee/stageAnimationCatalog.js');
    const { STAGE_ANIMATION_WAVE_16: definitions } = await import('/src/game/melee/stageAnimationCatalogWave16.js');
    const hash = async bytes => [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(n => n.toString(16).padStart(2, '0')).join('');
    const holder = document.createElement('section'); holder.id = 'wave16-stage-proof';
    holder.style.cssText = 'position:absolute;inset:0;z-index:2147483647;background:#101720;color:#e2eced;padding:16px;font:14px monospace;';
    const rows = [];
    for (const [index, definition] of definitions.entries()) {
      const row = document.createElement('section'); row.dataset.stage = definition.id;
      row.style.cssText = 'height:276px;';
      const title = document.createElement('div'); title.textContent = definition.universes[0] + ' — ' + definition.sourceScene;
      title.style.cssText = 'height:26px;'; row.append(title);
      const stage = { universe: definition.universes[0], name: definition.sourceScene, mode: 'Melee' };
      const stageBefore = JSON.stringify(stage), frames = [];
      const render = async (elapsedSeconds, reducedMotion = false) => {
        const canvas = document.createElement('canvas'); canvas.width = 400; canvas.height = 240;
        const ctx = canvas.getContext('2d');
        const rendered = renderStageAnimation(ctx, { stage, elapsedSeconds, width: 400, height: 240, reducedMotion });
        const pixels = ctx.getImageData(0, 0, 400, 240).data;
        let visiblePixels = 0;
        for (let i = 3; i < pixels.length; i += 4) if (pixels[i] > 0) visiblePixels++;
        return { canvas, rendered, visiblePixels, sha256: await hash(pixels) };
      };
      for (const progress of [0, 0.23, 0.5, 0.77]) {
        const sample = await render(definition.periodSeconds * progress);
        if (!sample.rendered || sample.visiblePixels === 0) throw new Error(definition.id + ': actual renderer produced no visible geometry');
        sample.canvas.style.cssText = 'width:400px;height:240px;border:1px solid #273946;background:#172332;';
        row.append(sample.canvas); const { canvas: _canvas, ...frame } = sample; frames.push({ progress, ...frame });
      }
      if (frames[0].sha256 === frames[1].sha256) throw new Error(definition.id + ': geometry did not animate');
      if ((await render(definition.periodSeconds)).sha256 !== frames[0].sha256) throw new Error(definition.id + ': cycle is not closed');
      if ((await render(11, true)).sha256 !== frames[0].sha256 || (await render(77, true)).sha256 !== frames[0].sha256) throw new Error(definition.id + ': reduced motion does not hold time zero');
      for (const mode of ['Combat', 'Melee', 'RPG', 'Tactics']) if (getStageAnimationProfile({ ...stage, mode })?.id !== definition.id) throw new Error(definition.id + ': missing mode integration');
      if (getStageAnimationProfile({ ...stage, universe: 'Foreign proof universe' })?.animationWave === 15) throw new Error(definition.id + ': crossed universe');
      if (JSON.stringify(stage) !== stageBefore) throw new Error(definition.id + ': renderer mutated stage');
      holder.append(row); rows.push({ id: definition.id, universe: stage.universe, sourceWork: definition.sourceWork,
        frames, cyclic: true, reducedMotionStable: true, allFourModeSelections: true, stageImmutable: true, source1to1Verified: false, index });
    }
    document.body.replaceChildren(holder);
    return { rows, actualCanvasFrames: rows.reduce((sum, row) => sum + row.frames.length, 0),
      scope: 'Actual stage renderer and browser RGBA pixels, with all four mode selections. This canvas study does not claim a full playable battle or official source animation.' };
  });
  assert.equal(result.rows.length, 10); assert.equal(result.actualCanvasFrames, 40);
  assert.deepEqual(pageErrors, []);
  assert.ok(failedRequests.every(request => request.url.startsWith('https://fonts.googleapis.com/') && request.error === 'net::ERR_TUNNEL_CONNECTION_FAILED'));
  assert.equal(consoleErrors.length, failedRequests.length);
  for (const group of [0, 1]) {
    await page.evaluate(group => {
      document.querySelectorAll('#wave16-stage-proof>section').forEach((section, index) => { section.style.display = Math.floor(index / 5) === group ? '' : 'none'; });
    }, group);
    const path = `${attempt}/stage-studies-${group + 1}.png`;
    await page.locator('#wave16-stage-proof').screenshot({ path: `${repositoryRoot}/${path}` });
    captures.push(path);
  }
} catch (error) { failure = error.stack || String(error); }
finally { await browser.close(); browserClosedAt = new Date().toISOString(); }
let integrity;
try { integrity = await finishPresentationIntegrity(before, options); }
catch (error) { failure ||= error.stack || String(error); }
await writeJson(`${attempt}/inputs-after.json`, integrity?.after || null);
if (failure) {
  await writeJson(`${attempt}/failure.json`, { passed: false, preliminary, startedAt, browserClosedAt, failure, pageErrors, consoleErrors, failedRequests });
  console.error(JSON.stringify({ passed: false, failure, attempt })); process.exitCode = 1;
} else {
  const artifacts = await hashPresentationArtifacts([...captures, `${attempt}/inputs-before.json`, `${attempt}/inputs-after.json`]);
  const report = { passed: true, preliminary, startedAt, browserClosedAt, finishedAt: new Date().toISOString(), allBrowserWindowsClosed: true,
    harness, harnessSha256: sha(await readBytes(harness)), ...result, captures, artifacts, pageErrors, consoleErrors, failedRequests,
    productionInputsStableDuringRun: integrity.stable, productionInputSha256: before.sha256,
    productionFreezePath: before.productionFreezePath, productionFreezeSha256: before.productionFreezeSha256, source1to1Verified: false };
  await writeJson(`${attempt}/stages-wave16.json`, report);
  if (!preliminary) await writeJson(`${waveDirectory}/browser/stages-wave16.json`, report);
  console.log(JSON.stringify({ passed: true, preliminary, studies: result.rows.length, actualCanvasFrames: result.actualCanvasFrames, captures, stable: integrity.stable }));
}
