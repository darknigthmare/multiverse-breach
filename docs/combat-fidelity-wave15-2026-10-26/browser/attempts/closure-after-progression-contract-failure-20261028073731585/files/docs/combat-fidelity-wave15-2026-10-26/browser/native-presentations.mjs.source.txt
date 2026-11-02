import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import {
  repositoryRoot, waveDirectory, previousWaveBaseline, wave15Assets,
  snapshotPresentationInputs, finishPresentationIntegrity, hashPresentationArtifacts, writeJson
} from './presentation-input-integrity.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const preliminary = process.argv.includes('--preliminary');
assert.ok(preliminary || process.argv.includes('--after-production-freeze'), 'Use --preliminary or wait for the final production freeze');
const startedAt = new Date().toISOString(), stamp = startedAt.replace(/[^0-9]/g, '');
const attempt = `${waveDirectory}/browser/attempts/native-${preliminary ? 'preliminary' : 'final'}-${stamp}`;
const [baseline, delivery] = await Promise.all([previousWaveBaseline(), wave15Assets('native', { preliminary })]);
const harnessPath = waveDirectory + '/browser/native-presentations.mjs';
const options = { preliminary, extraFiles: [harnessPath, waveDirectory + '/browser/presentation-input-integrity.mjs', delivery.planPath, ...delivery.provenancePaths] };
const before = await snapshotPresentationInputs(options);
await writeJson(attempt + '/native-presentations-inputs-before.json', before);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
const errors = [], consoleErrors = [], failedRequests = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
let result = null, failure = null, browserClosedAt = null;
try {
  await page.goto(process.env.PRESENTATION_REVIEW_URL || 'http://127.0.0.1:5188/', { waitUntil: 'domcontentloaded' });
  result = await page.evaluate(async ({ historical, delivered, parts, refusals, oldFallbacks }) => {
    const compiled = await (await fetch('/src/components/GameCanvas.jsx')).text();
    const rendererUrl = compiled.match(/from ["'](\/src\/game\/renderer\.js[^"']*)["']/)?.[1];
    if (!rendererUrl) throw new Error('Actual GameCanvas renderer URL not found');
    const rendererSource = await (await fetch(rendererUrl)).text();
    const catalogUrl = rendererSource.match(/from ["'](\/src\/game\/combat\/characterAnimationCatalog\.js[^"']*)["']/)?.[1];
    const spritesUrl = rendererSource.match(/from ["'](\/src\/game\/spriteAssets\.js[^"']*)["']/)?.[1];
    const { drawPixelSprite, preloadSpriteSheetSrcs } = await import(rendererUrl);
    const { getCharacterAnimationAssets, getCharacterAnimationFrame, resolveCharacterAnimationAsset } = await import(catalogUrl);
    const { getHeroSpriteSheetSrc, getSpriteSheetLayout } = await import(spritesUrl);
    const { HEROES_DB } = await import('/src/game/heroes.js');
    const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
      ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
    const identical = (actual, expected) => JSON.stringify(canonical(actual)) === JSON.stringify(canonical(expected));
    const assets = getCharacterAnimationAssets(), newIds = new Set(delivered.map(entry => entry.heroId));
    const expected = new Map([...historical, ...delivered].map(entry => [entry.heroId || entry.id, { ...entry, heroId: entry.heroId || entry.id }]));
    if (assets.length !== expected.size) throw new Error(`Runtime union has ${assets.length}, expected ${expected.size} actual registered atlases`);
    for (const asset of assets) if (!identical(asset, expected.get(asset.heroId))) throw new Error(asset.heroId + ': old/new native metadata changed or not actually imported');
    const assetSnapshot = JSON.stringify(assets), rosterSnapshot = JSON.stringify(HEROES_DB);
    const images = new Map();
    async function load(sheet, width, height) {
      const image = new Image(); image.src = sheet; await image.decode();
      if (width && (image.naturalWidth !== width || image.naturalHeight !== height)) throw new Error(sheet + ': HTTP image dimensions');
      images.set(sheet, image);
    }
    preloadSpriteSheetSrcs(assets.map(asset => asset.sheet));
    await Promise.all(assets.map(asset => load(asset.sheet, asset.width, asset.height)));
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const canvas = document.createElement('canvas'); canvas.width = 1120; canvas.height = 1680;
    const ctx = canvas.getContext('2d'), original = ctx.drawImage.bind(ctx), calls = [], trace = [], captures = [];
    let activeCase = null;
    ctx.drawImage = function (image, ...args) {
      const matrix = ctx.getTransform();
      calls.push({ case: activeCase, sheet: new URL(image.src).pathname,
        sx: args[0], sy: args[1], sw: args[2], sh: args[3], facing: Math.sign(matrix.a), destination: args.slice(4),
        transform: { a: matrix.a, d: matrix.d, e: matrix.e, f: matrix.f } });
      return original(image, ...args);
    };
    const phases = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
    const partial = { beast_boy_tt: ['fatality', 'super'], janine_gb: ['intro', 'outro', 'roundVictory', 'roundDefeat', 'victory', 'defeat'] };
    const near = (actual, expected, reason) => { if (Math.abs(actual - expected) > 1e-8) throw new Error(reason + ': ' + actual + ' versus ' + expected); };
    let fixedProgressFrames = 0, rejectedCrossedIdentities = 0;
    for (const asset of assets) {
      const ownPhases = Object.keys(asset.phases);
      if (!identical(ownPhases, partial[asset.heroId] || phases)) throw new Error(asset.heroId + ': wrong exposed phase set');
      const source = HEROES_DB.find(hero => hero.id === asset.heroId);
      if (!source || source.universe !== asset.universe) throw new Error(asset.heroId + ': roster identity');
      if (resolveCharacterAnimationAsset({ ...source, universe: '__foreign__' }) !== null
        || resolveCharacterAnimationAsset({ ...source, sourceHeroId: '__unknown__' }) !== null) throw new Error(asset.heroId + ': crossed identity accepted');
      rejectedCrossedIdentities += 2;
      canvas.height = ownPhases.length * 210;
      ctx.fillStyle = '#10141c'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#d9f2ed'; ctx.font = '10px monospace'; ctx.fillText(asset.heroId, 3, 12);
      for (const [phaseIndex, phase] of ownPhases.entries()) for (const [side, facing] of [1, -1].entries()) for (let col = 0; col < 4; col++) {
        activeCase = { heroId: asset.heroId, phase, col, facing, player: side === 0 ? 'P1' : 'P2' };
        ctx.fillStyle = '#bce6d8'; ctx.fillText(phase, 3, phaseIndex * 210 + 28);
        const actor = { ...source, id: side === 0 ? source.id : 'presentation-p2-' + source.id, sourceHeroId: source.id,
          currentHp: 105, x: 140, y: 180, vx: 0, vy: 0, facing, presentationPhase: phase,
          presentationProgress: (asset.heroId === 'vincent_ff7' && phase === 'fatality' ? [.01, .075, .15, .225] : [.01, .3, .6, .99])[col],
          presentationImpactProgress: .5, state: phase === 'super' ? 'special' : 'idle' };
        const actorBefore = JSON.stringify(actor), count = calls.length;
        drawPixelSprite(ctx, 140 + (side * 4 + col) * 128, phaseIndex * 210 + 196, actor, 1000, facing, 72, 'melee');
        const draw = calls.at(-1);
        if (calls.length !== count + 1 || draw.sheet !== asset.sheet || draw.sx !== col * 256
          || draw.sy !== asset.phases[phase].row * 256 || draw.sw !== 256 || draw.sh !== 256 || draw.facing !== facing) throw new Error(asset.heroId + ': wrong actual native draw ' + JSON.stringify(activeCase));
        const rowScale = Math.max(.5, Math.min(3, Number(asset.normalization?.rows?.[asset.phases[phase].row]?.renderScale) || 1));
        const baseline = Number(asset.normalization?.baseline) || 244, scale = 72 / 256 * rowScale;
        near(baseline, 244, 'native feet baseline'); near(draw.destination[0], -128 * scale, 'center');
        near(draw.destination[1], -baseline * scale, 'baseline'); near(draw.destination[2], 256 * scale, 'width'); near(draw.destination[3], 256 * scale, 'height');
        near(draw.transform.d, 1, 'vertical axis');
        const projectedBaseline = draw.transform.f + draw.destination[1] + baseline / 256 * draw.destination[3];
        near(projectedBaseline, draw.transform.f, 'feet at cosmetic pivot');
        Object.assign(draw, { rowScale, baseline, projectedBaseline });
        const a = getCharacterAnimationFrame(actor, { elapsedSeconds: 0 }), b = getCharacterAnimationFrame(actor, { elapsedSeconds: 1000 });
        if (a.col !== col || b.col !== col || a.row !== b.row) throw new Error(asset.heroId + ': authoritative phase clock drift');
        fixedProgressFrames++;
        if (actorBefore !== JSON.stringify(actor)) throw new Error(asset.heroId + ': drawing mutated the combat actor');
        trace.push(draw);
      }
      if (newIds.has(asset.heroId)) captures.push({ heroId: asset.heroId, part: parts[asset.heroId], image: canvas.toDataURL('image/png') });
    }
    const historicalFallbackTrace = [];
    const fallbackSheets = [...new Set(oldFallbacks.map(draw => draw.sheet))];
    preloadSpriteSheetSrcs(fallbackSheets);
    await Promise.all(fallbackSheets.map(sheet => load(sheet)));
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    for (const old of oldFallbacks) {
      const { heroId, phase, col, facing } = old.case;
      const source = HEROES_DB.find(hero => hero.id === heroId);
      const reusedSupport = heroId === 'janine_gb' || heroId === 'morty';
      const actor = { ...source, id: facing === 1 ? heroId : 'historical-reused-p2-' + heroId,
        sourceHeroId: heroId, currentHp: 100, x: 140, y: 180, vx: 0, vy: 0, facing,
        presentationPhase: phase, presentationProgress: [.01, .3, .6, .99][col], state: reusedSupport ? 'support' : 'idle',
        ...(reusedSupport ? { stateElapsed: (col * 10 + .1) / 60 } : {}) };
      if (getCharacterAnimationFrame(actor) !== null || getHeroSpriteSheetSrc(actor, 'rpg') !== old.sheet) throw new Error(heroId + ': old excluded phase lost its registered fallback');
      const layout = getSpriteSheetLayout(old.sheet);
      if (heroId === 'janine_gb' && (layout.adaptedPresentationFallback !== true || layout.countedAsDedicatedBase16 !== false || layout.countedAsDedicatedSuperOrFinale !== false)) throw new Error('Janine historical reuse limitations were lost');
      if (heroId === 'morty' && (layout.adaptedLegacyFallback !== true || layout.fixedColumn !== 0 || layout.countedAsDedicatedBase16 !== false || layout.countedAsDedicatedSuperOrFinale !== false)) throw new Error('Morty historical refusal/reuse limitations were lost');
      const actorBefore = JSON.stringify(actor), count = calls.length;
      activeCase = { ...old.case };
      const x = heroId === 'morty' ? 140 + ((facing === 1 ? 0 : 1) * 4 + col) * 128 : 140;
      const y = heroId === 'morty' ? phases.indexOf(phase) * 210 + 196 : 196;
      drawPixelSprite(ctx, x, y, actor, 1000, facing, 72, 'melee');
      if (calls.length !== count + 1 || actorBefore !== JSON.stringify(actor)) throw new Error(heroId + ': historical fallback draw/immutability');
      historicalFallbackTrace.push(calls.at(-1));
    }
    const refusedTrace = [], refusedCaptures = [];
    for (const refusal of refusals) {
      const id = refusal.heroId;
      const source = HEROES_DB.find(hero => hero.id === id), sheet = getHeroSpriteSheetSrc(source, 'rpg');
      if (!source || resolveCharacterAnimationAsset(source) !== null || newIds.has(id)) throw new Error(id + ': refused native identity was published');
      if (sheet !== refusal.referenceAsset) throw new Error(id + ': refusal did not retain the independently frozen pre-edit sheet');
      preloadSpriteSheetSrcs([sheet]); await load(sheet);
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      canvas.height = 1680; ctx.fillStyle = '#10141c'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (const [phaseIndex, phase] of phases.entries()) for (const [side, facing] of [1, -1].entries()) for (let col = 0; col < 4; col++) {
        const actor = { ...source, id: 'refused-presentation-' + id + '-' + side, sourceHeroId: id,
          currentHp: 105, x: 140, y: 180, vx: 0, vy: 0, facing, presentationPhase: phase,
          presentationProgress: [.01, .3, .6, .99][col], state: 'idle' };
        if (getCharacterAnimationFrame(actor) !== null) throw new Error(id + ': refused phase exposed as native');
        const actorBefore = JSON.stringify(actor), count = calls.length;
        activeCase = { heroId: id, phase, col, facing, player: side === 0 ? 'P1' : 'P2', fallback: true, countedAsNewPose: false };
        drawPixelSprite(ctx, 140 + (side * 4 + col) * 128, phaseIndex * 210 + 196, actor, 1000, facing, 72, 'melee');
        const draw = calls.at(-1);
        if (calls.length !== count + 1 || draw.sheet !== sheet || draw.facing !== facing) throw new Error(id + ': retained fallback draw failed');
        if (JSON.stringify(actor) !== actorBefore) throw new Error(id + ': fallback draw mutated combat');
        refusedTrace.push(draw);
      }
      refusedCaptures.push({ heroId: id, sheet, image: canvas.toDataURL('image/png') });
    }
    if (JSON.stringify(assets) !== assetSnapshot || JSON.stringify(HEROES_DB) !== rosterSnapshot) throw new Error('Renderer mutated the registry or roster');
    return { characters: assets.length, full32Count: assets.filter(asset => Object.keys(asset.phases).length === 8).length,
      partialCount: assets.filter(asset => Object.keys(asset.phases).length < 8).length,
      partialPoses: assets.filter(asset => Object.keys(asset.phases).length < 8).reduce((sum, asset) => sum + asset.frames, 0),
      partialDetails: assets.filter(asset => Object.keys(asset.phases).length < 8).map(asset => ({ heroId: asset.heroId, poses: asset.frames, phases: Object.keys(asset.phases) })),
      phases: assets.reduce((sum, asset) => sum + Object.keys(asset.phases).length, 0), geometryChecks: trace.length,
      loadedImages: images.size, actualFrameDraws: trace.length, realDrawImageCalls: calls.length,
      fixedProgressFrames, rejectedCrossedIdentities, immutableActors: trace.length + refusedTrace.length,
      historicalFallbackFrameDraws: historicalFallbackTrace.length,
      immutableAssetRegistry: true, rendererUrl, catalogUrl, trace, captures, refusedTrace, refusedCaptures, historicalFallbackTrace };
  }, { historical: baseline.native, delivered: delivery.entries.map(({ browserReviewPart: _part, ...entry }) => entry),
    parts: Object.fromEntries(delivery.entries.map(entry => [entry.heroId, entry.browserReviewPart])), refusals: delivery.refusals,
    oldFallbacks: baseline.historicalFallbackTrace });
  const key = draw => [draw.case.heroId, draw.case.phase, draw.case.col, draw.case.facing].join('::');
  const old = new Map(baseline.nativeTrace.map(draw => [key(draw), draw]));
  let unchanged = 0;
  for (const draw of result.trace) {
    if (!old.has(key(draw))) continue;
    for (const field of ['sheet', 'sx', 'sy', 'sw', 'sh', 'facing', 'destination', 'transform', 'rowScale', 'baseline', 'projectedBaseline']) assert.deepEqual(draw[field], old.get(key(draw))[field], key(draw) + ': W14 geometry ' + field);
    unchanged++;
  }
  assert.equal(unchanged, baseline.nativeTrace.length); assert.equal(unchanged, 19648);
  assert.equal(result.historicalFallbackTrace.length, 128);
  for (const [index, draw] of result.historicalFallbackTrace.entries()) {
    const old = baseline.historicalFallbackTrace[index];
    for (const field of ['sheet', 'sx', 'sy', 'sw', 'sh', 'facing', 'destination', 'transform']) assert.deepEqual(draw[field], old[field], key(draw) + ': W14 fallback actual geometry ' + field);
  }
  assert.equal(result.actualFrameDraws - unchanged, delivery.entries.length * 64);
  assert.equal(result.characters, 308 + delivery.entries.length); assert.equal(result.partialCount, 2);
  assert.equal(result.fixedProgressFrames, result.actualFrameDraws);
  assert.deepEqual(errors, []);
  assert.ok(failedRequests.every(request => request.url.startsWith('https://fonts.googleapis.com/') && request.error === 'net::ERR_TUNNEL_CONNECTION_FAILED'));
  assert.equal(consoleErrors.length, failedRequests.length);
  result.historicalDrawGeometryUnchanged = unchanged;
  result.historicalFallbackDrawGeometryUnchanged = result.historicalFallbackTrace.length;
} catch (error) { failure = error.stack || String(error); }
finally { await browser.close(); browserClosedAt = new Date().toISOString(); }

let integrity = null;
try { integrity = await finishPresentationIntegrity(before, options); } catch (error) { failure ||= error.stack || String(error); }
await writeJson(attempt + '/native-presentations-inputs-after.json', integrity?.after || null);
if (failure) {
  await writeJson(attempt + '/native-presentations-failure.json', { passed: false, preliminary, startedAt, browserClosedAt, finishedAt: new Date().toISOString(), failure, errors, consoleErrors, failedRequests, productionInputsStableDuringRun: integrity?.stable ?? false });
  console.error(JSON.stringify({ passed: false, attempt, failure })); process.exitCode = 1;
} else {
  const captures = [], refusedCaptures = [];
  for (const [items, target, prefix] of [[result.captures, captures, 'native-presentations'], [result.refusedCaptures, refusedCaptures, 'refused-native-fallback']]) {
    for (const item of items) {
      const relative = attempt + '/' + prefix + '-' + item.heroId + '.png';
      await fs.writeFile(repositoryRoot + '/' + relative, Buffer.from(item.image.split(',')[1], 'base64'));
      const { image: _image, ...metadata } = item; target.push({ ...metadata, path: relative });
    }
  }
  const tracePath = attempt + '/native-presentations-trace.json';
  await writeJson(tracePath, result.trace); await writeJson(attempt + '/refused-native-fallback-trace.json', result.refusedTrace);
  await writeJson(attempt + '/historical-partial-fallback-trace.json', result.historicalFallbackTrace);
  const artifacts = await hashPresentationArtifacts([...captures.map(item => item.path), ...refusedCaptures.map(item => item.path), tracePath,
    attempt + '/native-presentations-inputs-before.json', attempt + '/native-presentations-inputs-after.json', attempt + '/refused-native-fallback-trace.json', attempt + '/historical-partial-fallback-trace.json']);
  const { trace: _trace, captures: _captures, refusedTrace: _refusedTrace, refusedCaptures: _refusedCaptures, historicalFallbackTrace: _historicalFallbackTrace, ...summary } = result;
  const report = { passed: true, preliminary, startedAt, browserClosedAt, finishedAt: new Date().toISOString(), allBrowserWindowsClosed: true,
    harness: harnessPath, harnessSha256: before.hashes[harnessPath], source1to1Verified: false, ...summary,
    newCharacters: delivery.entries.length, newFrameDraws: delivery.entries.length * 64,
    historicalAssetRecordsUnchanged: baseline.native.length, historicalRegistryHashesPreserved: baseline.registries.length,
    historicalPngHashesPreserved: baseline.pngs.length, historicalAudit: baseline.auditPath, historicalAuditSha256: baseline.auditSha256,
    productionInputsUnchanged: integrity.stable, productionInputsStableDuringRun: integrity.stable,
    productionInputCount: integrity.productionInputCount, productionInputSha256: before.sha256,
    productionFreezePath: before.productionFreezePath, productionFreezeSha256: before.productionFreezeSha256,
    productionFreezeFileCount: before.productionFreezeFileCount,
    actualDeliveredIds: delivery.entries.map(entry => entry.heroId), missingNativeHeroIds: delivery.missingIds,
    pendingIds: delivery.pendingIds, initialRefusalIds: delivery.initialRefusalIds, sourceRejectedIds: delivery.sourceRejectedIds,
    refusals: delivery.refusals, errors, consoleErrors, failedRequests, captures, refusedCaptures, artifacts, attempt };
  await writeJson(attempt + '/native-presentations.json', report);
  if (!preliminary) {
    await fs.copyFile(repositoryRoot + '/' + tracePath, repositoryRoot + '/' + waveDirectory + '/browser/native-presentations-trace.json');
    await writeJson(waveDirectory + '/browser/native-presentations.json', report);
  }
  console.log(JSON.stringify({ passed: true, preliminary, newCharacters: report.newCharacters, actualFrameDraws: report.actualFrameDraws,
    historicalDrawGeometryUnchanged: report.historicalDrawGeometryUnchanged, stable: integrity.stable, captures: captures.length, refused: delivery.refusedIds, attempt }));
}
