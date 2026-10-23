import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const output = 'docs/combat-fidelity-wave7-2026-10-20/browser';
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
const errors = [], consoleErrors = [], failedRequests = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
try {
  await page.goto('http://127.0.0.1:5188/', { waitUntil: 'networkidle' });
  const result = await page.evaluate(async () => {
    const compiled = await (await fetch('/src/components/GameCanvas.jsx')).text();
    const rendererUrl = compiled.match(/from "(\/src\/game\/renderer\.js[^"]*)"/)[1];
    const rendererSource = await (await fetch(rendererUrl)).text();
    const spriteAssetsUrl = rendererSource.match(/from "(\/src\/game\/spriteAssets\.js[^"]*)"/)[1];
    const { drawPixelSprite, preloadSpriteSheetSrcs } = await import(rendererUrl);
    const { getHeroSpriteSheetSrc, getSpriteSheetLayout } = await import(spriteAssetsUrl);
    const { HEROES_DB } = await import('/src/game/heroes.js');
    const readRegistry = async name => (await (await fetch('/src/game/combat/' + name + '.generated.json')).json()).entries;
    const newRegistries = await Promise.all(['characterSpriteCorrectionsWave7PartA', 'characterSpriteCorrectionsWave7PartB', 'characterSpriteCorrectionsWave7PartC'].map(readRegistry));
    const wave6Registries = await Promise.all(['characterSpriteCorrectionsWave6PartA', 'characterSpriteCorrectionsWave6PartB', 'characterSpriteCorrectionsWave6PartC'].map(readRegistry));
    const preWave6Registries = await Promise.all(['characterSpriteCorrections', 'characterSpriteCorrectionsWave2', 'characterSpriteCorrectionsWave4', 'characterSpriteCorrectionsWave5'].map(readRegistry));
    const oldRegistries = [...wave6Registries, ...preWave6Registries];
    const newEntries = newRegistries.flat(), oldEntries = oldRegistries.flat();
    if (newEntries.length !== 14 || oldEntries.length !== 13) throw new Error('Expected fourteen Wave7 bases and thirteen prior corrected bases');
    if (newEntries.some(entry => entry.heroId === 'leia_organa')) throw new Error('Leia base is missing and must not be invented');
    const cases = [...newEntries.map(entry => ({ entry, calibrated: true, wave7: true })), ...wave6Registries.flat().map(entry => ({ entry, calibrated: true, wave7: false })), ...preWave6Registries.flat().map(entry => ({ entry, calibrated: false, wave7: false }))];
    preloadSpriteSheetSrcs(cases.map(({ entry }) => entry.sheet));
    await Promise.all(cases.map(({ entry }) => new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => image.naturalWidth === 1024 && image.naturalHeight === 1024 ? resolve() : reject(new Error(entry.heroId + ': invalid base dimensions'));
      image.onerror = () => reject(new Error(entry.heroId + ': base image failed to load'));
      image.src = entry.sheet;
    })));
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const canvas = document.createElement('canvas'); canvas.width = 1120; canvas.height = cases.length * 4 * 150;
    const ctx = canvas.getContext('2d'), original = ctx.drawImage.bind(ctx), calls = [], trace = [];
    ctx.fillStyle = '#10141c'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage = function (image, ...args) {
      const matrix = ctx.getTransform();
      calls.push({ sheet: new URL(image.src).pathname, source: args.slice(0, 4), destination: args.slice(4), matrix: { a: matrix.a, b: matrix.b, c: matrix.c, d: matrix.d, e: matrix.e, f: matrix.f } });
      return original(image, ...args);
    };
    const states = ['idle', 'run', 'attack', 'hit'], targetHeight = 80;
    const equal = (actual, expected, reason) => { if (Math.abs(actual - expected) > 1e-8) throw new Error(reason + ': ' + actual + ' versus ' + expected); };
    for (const [heroIndex, { entry, calibrated, wave7 }] of cases.entries()) {
      const source = HEROES_DB.find(hero => hero.id === entry.heroId);
      if (!source || source.universe !== entry.universe) throw new Error(entry.heroId + ': crossed roster identity');
      const layout = getSpriteSheetLayout(entry.sheet);
      if (calibrated && layout.baseline !== 244) throw new Error(entry.heroId + ': calibrated W6/W7 baseline was not registered');
      if (!calibrated && (layout.baseline !== undefined || layout.renderScaleByRow !== undefined)) throw new Error(entry.heroId + ': legacy geometry unexpectedly migrated');
      for (const [stateIndex, state] of states.entries()) {
        const row = entry.states[state].row;
        const registryRow = entry.normalization.rows.find((item, index) => (item.row ?? index) === row);
        const rowScale = calibrated ? Math.max(0.5, Math.min(3, Number(registryRow.renderScale) || 1)) : 1;
        const baseline = calibrated ? 244 : 256 - 24;
        const scale = targetHeight / 256 * rowScale;
        const line = heroIndex * 4 + stateIndex;
        ctx.fillStyle = '#bce6d8'; ctx.font = '9px monospace'; ctx.fillText(entry.heroId + ' / ' + state, 3, line * 150 + 12);
        ctx.strokeStyle = '#464e5d'; ctx.beginPath(); ctx.moveTo(120, line * 150 + 132); ctx.lineTo(1110, line * 150 + 132); ctx.stroke();
        for (const [side, facing] of [1, -1].entries()) for (let column = 0; column < 4; column++) {
          const x = 144 + (side * 4 + column) * 128, y = line * 150 + 132;
          const actor = { ...source, id: side === 0 ? source.id : 'base-p2-' + source.id, sourceHeroId: source.id, state, currentHp: 105, x, y, vx: 2, vy: 0, facing };
          if (getHeroSpriteSheetSrc(actor, 'rpg') !== entry.sheet) throw new Error(entry.heroId + ': corrected runtime base is not selected');
          const before = JSON.stringify(actor), count = calls.length;
          // Natural coarse-sheet clock: each ten animation units advances one
          // column. No presentationFrame override or direct drawImage shortcut.
          drawPixelSprite(ctx, x, y, actor, column * 10 + 0.1, facing, targetHeight, 'rpg');
          if (calls.length !== count + 1) throw new Error(entry.heroId + ': base branch did not draw exactly one real sprite');
          const draw = calls.at(-1);
          if (draw.sheet !== entry.sheet || draw.source[0] !== column * 256 || draw.source[1] !== row * 256 || draw.source[2] !== 256 || draw.source[3] !== 256) throw new Error(entry.heroId + ': wrong real base cell');
          equal(draw.destination[0], -128 * scale, 'horizontal centering');
          equal(draw.destination[1], -baseline * scale, calibrated ? 'calibrated W6/W7 baseline244' : 'legacy sourceH-24 geometry');
          equal(draw.destination[2], 256 * scale, 'row scale width');
          equal(draw.destination[3], 256 * scale, 'row scale height');
          equal(draw.matrix.a, facing, 'P1/P2 facing'); equal(draw.matrix.d, 1, 'physical vertical axis');
          equal(draw.matrix.e, x, 'world horizontal anchor'); equal(draw.matrix.f, y, 'world vertical anchor');
          const projectedBaseline = draw.matrix.f + draw.destination[1] + baseline / 256 * draw.destination[3];
          equal(projectedBaseline, y, 'projected feet baseline stays at actor y');
          if (JSON.stringify(actor) !== before) throw new Error(entry.heroId + ': render mutated combat actor');
          trace.push({ heroId: entry.heroId, calibrated, wave7, state, row, column, player: side === 0 ? 'P1' : 'P2', facing, rowScale, baseline, projectedBaseline, draw });
        }
      }
    }
    return { newCharacters: newEntries.length, newStates: newEntries.length * 4, newFrameDraws: trace.filter(item => item.wave7).length, legacyCharacters: oldEntries.length, legacyFrameDraws: trace.filter(item => !item.wave7).length, totalFrameDraws: calls.length, immutableActors: trace.length, rendererUrl, spriteAssetsUrl, appliedCalibratedRowScales: [...new Set(trace.filter(item => item.calibrated).map(item => item.rowScale))].sort((a, b) => a - b), legacyBaseline: 232, calibratedBaseline: 244, preWave6Characters: 7, preWave6FrameDraws: trace.filter(item => !item.calibrated).length, calibratedCharacters: 20, missingNewBaseHeroIds: ['leia_organa'], legacyGeometryUnchanged: true, trace, capture: canvas.toDataURL('image/png') };
  });
  assert.equal(result.newCharacters, 14); assert.equal(result.newFrameDraws, 448); assert.equal(result.legacyCharacters, 13); assert.equal(result.legacyFrameDraws, 416); assert.equal(result.totalFrameDraws, 864); assert.equal(result.immutableActors, 864);
  assert.deepEqual(errors, []);
  assert.ok(failedRequests.every(request => request.url.startsWith('https://fonts.googleapis.com/') && request.error === 'net::ERR_TUNNEL_CONNECTION_FAILED'));
  assert.equal(consoleErrors.length, failedRequests.length);
  await fs.writeFile(output + '/base-corrections-trace.json', JSON.stringify(result.trace, null, 2) + '\n');
  await fs.writeFile(output + '/base-corrections.png', Buffer.from(result.capture.split(',')[1], 'base64'));
  const { trace: _trace, capture: _capture, ...summary } = result;
  const report = { passed: true, ...summary, errors, consoleErrors, failedRequests, screenshot: output + '/base-corrections.png' };
  await fs.writeFile(output + '/base-corrections.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
} catch (error) {
  await fs.writeFile(output + '/base-corrections-failure.json', JSON.stringify({ error: error.message, stack: error.stack, errors, consoleErrors, failedRequests }, null, 2) + '\n');
  throw error;
} finally { await browser.close(); }
