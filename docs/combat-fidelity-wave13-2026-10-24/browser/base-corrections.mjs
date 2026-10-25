import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import {
  repositoryRoot, waveDirectory, previousWaveBaseline, wave13Assets,
  snapshotPresentationInputs, finishPresentationIntegrity, hashPresentationArtifacts, writeJson
} from './presentation-input-integrity.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const preliminary = process.argv.includes('--preliminary');
assert.ok(preliminary || process.argv.includes('--after-production-freeze'), 'Use --preliminary or wait for the final production freeze');
const startedAt = new Date().toISOString(), stamp = startedAt.replace(/[^0-9]/g, '');
const attempt = `${waveDirectory}/browser/attempts/base-${preliminary ? 'preliminary' : 'final'}-${stamp}`;
const [baseline, delivery] = await Promise.all([previousWaveBaseline(), wave13Assets('base', { preliminary })]);
const harnessPath = waveDirectory + '/browser/base-corrections.mjs';
const options = { preliminary, extraFiles: [harnessPath, waveDirectory + '/browser/presentation-input-integrity.mjs', delivery.planPath, ...delivery.provenancePaths] };
const before = await snapshotPresentationInputs(options);
await writeJson(attempt + '/base-corrections-inputs-before.json', before);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
const errors = [], consoleErrors = [], failedRequests = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
let result = null, failure = null, browserClosedAt = null;
try {
  await page.goto(process.env.PRESENTATION_REVIEW_URL || 'http://127.0.0.1:5188/', { waitUntil: 'domcontentloaded' });
  result = await page.evaluate(async ({ historical, delivered, calibratedById, parts, refusals }) => {
    const source = await (await fetch('/src/components/GameCanvas.jsx')).text();
    const rendererUrl = source.match(/from ["'](\/src\/game\/renderer\.js[^"']*)["']/)?.[1];
    if (!rendererUrl) throw new Error('Actual GameCanvas renderer URL missing');
    const rendererSource = await (await fetch(rendererUrl)).text();
    const spritesUrl = rendererSource.match(/from ["'](\/src\/game\/spriteAssets\.js[^"']*)["']/)?.[1];
    const { drawPixelSprite, preloadSpriteSheetSrcs } = await import(rendererUrl);
    const { getHeroSpriteSheetSrc, getSpriteSheetLayout, getSpriteFrameForLayout, getSpriteStateResolution } = await import(spritesUrl);
    const { HEROES_DB } = await import('/src/game/heroes.js');
    const entries = [...historical, ...delivered], newIds = new Set(delivered.map(entry => entry.heroId));
    const rosterSnapshot = JSON.stringify(HEROES_DB), entrySnapshot = JSON.stringify(entries), loaded = new Set();
    async function load(sheet, width, height) {
      const image = new Image(); image.src = sheet; await image.decode();
      if (width && (image.naturalWidth !== width || image.naturalHeight !== height)) throw new Error(sheet + ': base HTTP dimensions');
      loaded.add(sheet);
    }
    preloadSpriteSheetSrcs(entries.map(entry => entry.sheet));
    await Promise.all(entries.map(entry => load(entry.sheet, 1024, 1024)));
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const canvas = document.createElement('canvas'); canvas.width = 1120; canvas.height = 600;
    const ctx = canvas.getContext('2d'), original = ctx.drawImage.bind(ctx), calls = [], trace = [], captures = [];
    ctx.drawImage = function (image, ...args) {
      const matrix = ctx.getTransform();
      calls.push({ sheet: new URL(image.src).pathname, source: args.slice(0, 4), destination: args.slice(4),
        matrix: { a: matrix.a, b: matrix.b, c: matrix.c, d: matrix.d, e: matrix.e, f: matrix.f } });
      return original(image, ...args);
    };
    const states = ['idle', 'run', 'attack', 'hit'], height = 80;
    const near = (actual, expected, reason) => { if (Math.abs(actual - expected) > 1e-8) throw new Error(reason + ': ' + actual + ' versus ' + expected); };
    for (const entry of entries) {
      const source = HEROES_DB.find(hero => hero.id === entry.heroId);
      if (!source || source.universe !== entry.universe) throw new Error(entry.heroId + ': base roster identity');
      const calibrated = newIds.has(entry.heroId) || calibratedById[entry.heroId] === true;
      const layout = getSpriteSheetLayout(entry.sheet), layoutBefore = JSON.stringify(layout);
      if (calibrated && layout.baseline !== 244) throw new Error(entry.heroId + ': calibrated layout baseline not actually registered');
      if (!calibrated && (layout.baseline !== undefined || layout.renderScaleByRow !== undefined)) throw new Error(entry.heroId + ': legacy drawing geometry changed');
      ctx.fillStyle = '#10141c'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (const [stateIndex, state] of states.entries()) {
        const row = entry.states[state].row;
        const normalization = entry.normalization.rows.find((item, index) => (item.row ?? index) === row);
        const rowScale = calibrated ? Math.max(.5, Math.min(3, Number(normalization.renderScale) || 1)) : 1;
        const baseline = calibrated ? 244 : 232, scale = height / 256 * rowScale;
        ctx.fillStyle = '#bce6d8'; ctx.font = '9px monospace'; ctx.fillText(entry.heroId + ' / ' + state, 3, stateIndex * 150 + 12);
        ctx.strokeStyle = '#464e5d'; ctx.beginPath(); ctx.moveTo(120, stateIndex * 150 + 132); ctx.lineTo(1110, stateIndex * 150 + 132); ctx.stroke();
        for (const [side, facing] of [1, -1].entries()) for (let column = 0; column < 4; column++) {
          const x = 144 + (side * 4 + column) * 128, y = stateIndex * 150 + 132;
          const actor = { ...source, id: side === 0 ? source.id : 'base-p2-' + source.id, sourceHeroId: source.id,
            state, currentHp: 105, x, y, vx: 2, vy: 0, facing };
          if (getHeroSpriteSheetSrc(actor, 'rpg') !== entry.sheet) throw new Error(entry.heroId + ': actual runtime did not select the delivered base');
          const actorBefore = JSON.stringify(actor), count = calls.length;
          drawPixelSprite(ctx, x, y, actor, column * 10 + .1, facing, height, 'rpg');
          const draw = calls.at(-1);
          if (calls.length !== count + 1 || draw.sheet !== entry.sheet || draw.source[0] !== column * 256
            || draw.source[1] !== row * 256 || draw.source[2] !== 256 || draw.source[3] !== 256) throw new Error(entry.heroId + ': wrong actual base cell ' + state + '/' + column + '/' + facing);
          near(draw.destination[0], -128 * scale, 'horizontal anchor'); near(draw.destination[1], -baseline * scale, 'base baseline');
          near(draw.destination[2], 256 * scale, 'width'); near(draw.destination[3], 256 * scale, 'height');
          near(draw.matrix.a, facing, 'P1/P2 facing'); near(draw.matrix.d, 1, 'vertical axis');
          near(draw.matrix.e, x, 'physical x'); near(draw.matrix.f, y, 'physical y');
          const projectedBaseline = draw.matrix.f + draw.destination[1] + baseline / 256 * draw.destination[3];
          near(projectedBaseline, y, 'feet remain at actor y');
          if (JSON.stringify(actor) !== actorBefore) throw new Error(entry.heroId + ': rendering mutated actor');
          trace.push({ heroId: entry.heroId, calibrated, wave13: newIds.has(entry.heroId), state, row, column,
            player: side === 0 ? 'P1' : 'P2', facing, rowScale, baseline, projectedBaseline, draw });
        }
      }
      if (newIds.has(entry.heroId)) captures.push({ heroId: entry.heroId, part: parts[entry.heroId], image: canvas.toDataURL('image/png') });
      if (JSON.stringify(layout) !== layoutBefore) throw new Error(entry.heroId + ': base layout mutated');
    }
    const refusedTrace = [], refusedCaptures = [], reusedStates = ['idle', 'run', 'attack', 'support', 'special', 'defense', 'hit', 'dead'];
    for (const refusal of refusals) {
      const id = refusal.heroId, source = HEROES_DB.find(hero => hero.id === id), sheet = getHeroSpriteSheetSrc(source, 'rpg');
      if (sheet !== refusal.referenceAsset || newIds.has(id)) throw new Error(id + ': did not retain its independently frozen original fallback');
      const layout = getSpriteSheetLayout(sheet), layoutBefore = JSON.stringify(layout);
      preloadSpriteSheetSrcs([sheet]); await load(sheet);
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      canvas.height = reusedStates.length * 150; ctx.fillStyle = '#10141c'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (const sourceTag of ['sourceHeroId', 'sourceId']) for (const [stateIndex, state] of reusedStates.entries()) for (const [side, facing] of [1, -1].entries()) for (let column = 0; column < 4; column++) {
        const x = 144 + (side * 4 + column) * 128, y = stateIndex * 150 + 132;
        const actor = { ...source, id: 'refused-base-' + id + '-' + sourceTag + '-' + side, [sourceTag]: id, state,
          currentHp: 105, x, y, vx: 0, vy: 0, facing };
        if (getHeroSpriteSheetSrc(actor, 'rpg') !== sheet || getHeroSpriteSheetSrc({ ...actor, universe: '__foreign__' }, 'rpg') === sheet) throw new Error(id + ': fallback lost strict identity ' + sourceTag);
        const expected = getSpriteFrameForLayout(state, column * 10 + .1, layout);
        const actorBefore = JSON.stringify(actor), count = calls.length;
        drawPixelSprite(ctx, x, y, actor, column * 10 + .1, facing, height, 'rpg');
        const draw = calls.at(-1);
        if (calls.length !== count + 1 || draw.sheet !== sheet || draw.source[0] !== expected.col * 256
          || draw.source[1] !== expected.row * 256 || draw.source[2] !== 256 || draw.source[3] !== 256) throw new Error(id + ': fallback differs from its declared source cell');
        const baseline = layout.baseline ?? 232, rowScale = Number(layout.renderScaleByRow?.[expected.row]) || 1, scale = height / 256 * rowScale;
        near(draw.destination[0], -128 * scale, 'fallback horizontal anchor'); near(draw.destination[1], -baseline * scale, 'fallback baseline');
        near(draw.destination[2], 256 * scale, 'fallback width'); near(draw.destination[3], 256 * scale, 'fallback height'); near(draw.matrix.a, facing, 'fallback facing');
        if (JSON.stringify(actor) !== actorBefore) throw new Error(id + ': reused pose mutated combat');
        refusedTrace.push({ heroId: id, state, column, sourceTag, facing, row: expected.row, actualColumn: expected.col,
          countedAsDedicatedBase16: false, countedAsNewPose: false, sourceResolution: getSpriteStateResolution(state, layout), draw });
      }
      refusedCaptures.push({ heroId: id, sheet, image: canvas.toDataURL('image/png') });
      if (JSON.stringify(layout) !== layoutBefore) throw new Error(id + ': reused source layout mutated');
      canvas.height = 600;
    }
    if (JSON.stringify(HEROES_DB) !== rosterSnapshot || JSON.stringify(entries) !== entrySnapshot) throw new Error('Base renderer mutated the roster or metadata');
    return { characters: entries.length, actualFrameDraws: trace.length, realDrawImageCalls: calls.length,
      loadedImages: loaded.size, immutableActors: trace.length + refusedTrace.length, rendererUrl, spriteAssetsUrl: spritesUrl,
      trace, captures, refusedTrace, refusedCaptures };
  }, { historical: baseline.bases, delivered: delivery.entries.map(({ browserReviewPart: _part, ...entry }) => entry),
    calibratedById: Object.fromEntries(baseline.baseTrace.map(entry => [entry.heroId, entry.calibrated])),
    parts: Object.fromEntries(delivery.entries.map(entry => [entry.heroId, entry.browserReviewPart])), refusals: delivery.refusals });
  const key = item => [item.heroId, item.state, item.column, item.facing].join('::');
  const old = new Map(baseline.baseTrace.map(item => [key(item), item]));
  let unchanged = 0;
  for (const item of result.trace) {
    if (!old.has(key(item))) continue;
    const original = old.get(key(item));
    for (const field of ['calibrated', 'row', 'rowScale', 'baseline', 'projectedBaseline']) assert.deepEqual(item[field], original[field], key(item) + ': W12 ' + field);
    // Historical traces are JSON: Canvas's mirrored -0 axis is recorded as 0.
    // Compare the same serialized representation, retaining every numeric value.
    const serializedDraw = JSON.parse(JSON.stringify(item.draw));
    for (const field of ['sheet', 'source', 'destination', 'matrix']) assert.deepEqual(serializedDraw[field], original.draw[field], key(item) + ': W12 actual geometry ' + field);
    unchanged++;
  }
  assert.equal(unchanged, baseline.baseTrace.length); assert.equal(unchanged, 5728);
  assert.equal(result.actualFrameDraws - unchanged, delivery.entries.length * 32);
  assert.equal(result.characters, 179 + delivery.entries.length);
  assert.deepEqual(errors, []);
  assert.ok(failedRequests.every(request => request.url.startsWith('https://fonts.googleapis.com/') && request.error === 'net::ERR_TUNNEL_CONNECTION_FAILED'));
  assert.equal(consoleErrors.length, failedRequests.length);
  result.historicalDrawGeometryUnchanged = unchanged;
} catch (error) { failure = error.stack || String(error); }
finally { await browser.close(); browserClosedAt = new Date().toISOString(); }

let integrity = null;
try { integrity = await finishPresentationIntegrity(before, options); } catch (error) { failure ||= error.stack || String(error); }
await writeJson(attempt + '/base-corrections-inputs-after.json', integrity?.after || null);
if (failure) {
  await writeJson(attempt + '/base-corrections-failure.json', { passed: false, preliminary, startedAt, browserClosedAt, finishedAt: new Date().toISOString(), failure, errors, consoleErrors, failedRequests, productionInputsStableDuringRun: integrity?.stable ?? false });
  console.error(JSON.stringify({ passed: false, attempt, failure })); process.exitCode = 1;
} else {
  const captures = [], refusedCaptures = [];
  for (const [items, target, prefix] of [[result.captures, captures, 'base-corrections'], [result.refusedCaptures, refusedCaptures, 'refused-base-fallback']]) {
    for (const item of items) {
      const relative = attempt + '/' + prefix + '-' + item.heroId + '.png';
      await fs.writeFile(repositoryRoot + '/' + relative, Buffer.from(item.image.split(',')[1], 'base64'));
      const { image: _image, ...metadata } = item; target.push({ ...metadata, path: relative });
    }
  }
  const tracePath = attempt + '/base-corrections-trace.json';
  await writeJson(tracePath, result.trace); await writeJson(attempt + '/refused-base-fallback-trace.json', result.refusedTrace);
  const artifacts = await hashPresentationArtifacts([...captures.map(item => item.path), ...refusedCaptures.map(item => item.path), tracePath,
    attempt + '/base-corrections-inputs-before.json', attempt + '/base-corrections-inputs-after.json', attempt + '/refused-base-fallback-trace.json']);
  const { trace: _trace, captures: _captures, refusedTrace: _refusedTrace, refusedCaptures: _refusedCaptures, ...summary } = result;
  const report = { passed: true, preliminary, startedAt, browserClosedAt, finishedAt: new Date().toISOString(), allBrowserWindowsClosed: true,
    harness: harnessPath, harnessSha256: before.hashes[harnessPath], source1to1Verified: false, ...summary,
    newCharacters: delivery.entries.length, newFrameDraws: delivery.entries.length * 32,
    newStates: delivery.entries.length * 4, legacyCharacters: baseline.bases.length,
    legacyFrameDraws: baseline.baseTrace.length, totalFrameDraws: result.actualFrameDraws,
    historicalAssetRecordsUnchanged: baseline.bases.length, historicalRegistryHashesPreserved: baseline.registries.length,
    historicalPngHashesPreserved: baseline.pngs.length, historicalAudit: baseline.auditPath, historicalAuditSha256: baseline.auditSha256,
    productionInputsUnchanged: integrity.stable, productionInputsStableDuringRun: integrity.stable,
    productionInputCount: integrity.productionInputCount, productionInputSha256: before.sha256,
    productionFreezePath: before.productionFreezePath, productionFreezeSha256: before.productionFreezeSha256,
    productionFreezeFileCount: before.productionFreezeFileCount,
    actualDeliveredIds: delivery.entries.map(entry => entry.heroId), missingNativeHeroIds: delivery.missingIds,
    pendingIds: delivery.pendingIds, initialRefusalIds: delivery.initialRefusalIds, sourceRejectedIds: delivery.sourceRejectedIds,
    refusals: delivery.refusals, errors, consoleErrors, failedRequests, captures, refusedCaptures, artifacts, attempt };
  await writeJson(attempt + '/base-corrections.json', report);
  if (!preliminary) {
    await fs.copyFile(repositoryRoot + '/' + tracePath, repositoryRoot + '/' + waveDirectory + '/browser/base-corrections-trace.json');
    await writeJson(waveDirectory + '/browser/base-corrections.json', report);
  }
  console.log(JSON.stringify({ passed: true, preliminary, newCharacters: report.newCharacters, actualFrameDraws: report.actualFrameDraws,
    historicalDrawGeometryUnchanged: report.historicalDrawGeometryUnchanged, stable: integrity.stable, captures: captures.length, refused: delivery.refusedIds, attempt }));
}
