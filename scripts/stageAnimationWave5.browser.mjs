// Start Vite, then run this optional desktop-runtime Chromium check.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  const page = await browser.newPage({ viewport: { width: 1260, height: 900 }, deviceScaleFactor: 1 });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(process.env.STAGE_ANIMATION_REVIEW_URL || 'http://127.0.0.1:5188/', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    const { STAGE_ANIMATION_WAVE_5 } = await import('/src/game/melee/stageAnimationCatalogWave5.js');
    const { getStageAnimationProfile, renderStageAnimation } = await import('/src/game/melee/stageAnimationCatalog.js');
    const draw = (stage, time, { width = 600, height = 300, reducedMotion = false, mirrored = false } = {}) => {
      const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (mirrored) { ctx.translate(width, 0); ctx.scale(-1, 1); }
      const transform = [...ctx.getTransform().toFloat64Array()], before = JSON.stringify(stage);
      if (!renderStageAnimation(ctx, { stage, width, height, elapsedSeconds: time, reducedMotion })) throw new Error('No mechanism: ' + stage.name);
      if (JSON.stringify(transform) !== JSON.stringify([...ctx.getTransform().toFloat64Array()])) throw new Error('Leaked canvas transform: ' + stage.name);
      if (before !== JSON.stringify(stage)) throw new Error('Stage mutation: ' + stage.name);
      const pixels = ctx.getImageData(0, 0, width, height).data;
      const firstExcludedRow = Math.ceil(height * 0.615), lastExcludedTopRow = Math.floor(height * 0.065);
      for (let y = 0; y < height; y++) {
        if (y >= lastExcludedTopRow && y < firstExcludedRow) continue;
        for (let x = 0; x < width; x++) if (pixels[(y * width + x) * 4 + 3]) throw new Error('Native clipping failure: ' + stage.name + '/' + width + 'x' + height + '/' + y);
      }
      return { canvas, pixels };
    };
    const equal = (left, right) => left.length === right.length && left.every((value, i) => value === right[i]);
    const rows = [];
    document.body.innerHTML = '';
    document.body.style.cssText = 'margin:0;padding:12px;background:#10151b;color:#d7dee5;font:12px system-ui;display:grid;grid-template-columns:repeat(3,1fr);gap:8px';
    let viewportChecks = 0;
    for (const p of STAGE_ANIMATION_WAVE_5) {
      const stage = { universe: p.universes[0], name: p.sourceScene, mode: 'Combat', actors: [{ hp: 83, state: 'idle' }] };
      if (getStageAnimationProfile(stage)?.id !== p.id) throw new Error('Wrong concrete scene resolution: ' + p.id);
      const time = p.periodSeconds * 0.23, first = draw(stage, 0), later = draw(stage, time);
      if (equal(first.pixels, later.pixels)) throw new Error('No real changed pixels: ' + p.id);
      if (!equal(later.pixels, draw(stage, time).pixels)) throw new Error('Paused frame drift: ' + p.id);
      if (!equal(draw(stage, 4, { reducedMotion: true }).pixels, draw(stage, 400, { reducedMotion: true }).pixels)) throw new Error('Reduced-motion drift: ' + p.id);
      if (!equal(draw({ ...stage, reducedMotion: true }, 4).pixels, draw({ ...stage, reducedMotion: true }, 400).pixels)) throw new Error('Stage reduced-motion drift: ' + p.id);
      const mirror = draw(stage, time, { mirrored: true });
      let alphaDifference = 0, alphaVolume = 0;
      for (let y = 0; y < 300; y++) for (let x = 0; x < 600; x++) {
        const a = later.pixels[(y * 600 + x) * 4 + 3], b = mirror.pixels[(y * 600 + 599 - x) * 4 + 3];
        alphaDifference += Math.abs(a - b); alphaVolume += a + b;
      }
      const mirrorAlphaErrorRatio = alphaDifference / Math.max(1, alphaVolume);
      if (!alphaVolume || mirrorAlphaErrorRatio > 0.12) throw new Error('Native mirror reflection mismatch: ' + p.id + ' ratio=' + mirrorAlphaErrorRatio);
      for (const [width, height] of [[360, 780], [1920, 480], [512, 512]]) { draw(stage, time, { width, height }); viewportChecks++; }
      for (const key of ['disableStageAnimations', 'disableStageAtmosphere']) {
        const canvas = document.createElement('canvas'); canvas.width = 600; canvas.height = 300;
        const ctx = canvas.getContext('2d');
        if (renderStageAnimation(ctx, { stage: { ...stage, [key]: true }, width: 600, height: 300, elapsedSeconds: time })) throw new Error('Disabled layer rendered: ' + p.id);
        if (ctx.getImageData(0, 0, 600, 300).data.some(Boolean)) throw new Error('Disabled layer painted pixels: ' + p.id);
      }
      const card = document.createElement('section'); card.style.cssText = 'min-width:0;border:1px solid #303943;background:#071018';
      const label = document.createElement('div'); label.textContent = p.id; label.style.cssText = 'padding:8px;white-space:nowrap;font-size:10px';
      const canvas = document.createElement('canvas'); canvas.width = 600; canvas.height = 300; canvas.style.cssText = 'display:block;width:100%;height:auto';
      const ctx = canvas.getContext('2d'); ctx.fillStyle = '#071018'; ctx.fillRect(0, 0, 600, 300); ctx.drawImage(later.canvas, 0, 0);
      ctx.strokeStyle = '#2e3944'; ctx.beginPath(); ctx.moveTo(0, 300 * 0.615); ctx.lineTo(600, 300 * 0.615); ctx.stroke();
      card.append(label, canvas); document.body.append(card);
      rows.push({ id: p.id, universe: stage.universe, changedChannels: later.pixels.filter((value, i) => value !== first.pixels[i]).length, pausedTimeStable: true, reducedMotionFrozen: true, stageReducedMotionFrozen: true, mirroredTransformPreserved: true, mirrorAlphaErrorRatio, viewportChecks: 3, combatLaneClear: true, stageStateUnchanged: true, disableFlagsPassed: 2 });
    }
    return { mechanisms: rows.length, universes: new Set(rows.map(r => r.universe)).size, additionalViewportChecks: viewportChecks, newOfficialFrames: 0, newEffectAtlasFrames: 0, bitmapRegionComposites: 0, source1to1Validated: 0, rows };
  });
  assert.equal(result.mechanisms, 24);
  assert.equal(result.universes, 12);
  assert.equal(result.additionalViewportChecks, 72);
  assert.deepEqual(pageErrors, []);
  const directory = '../docs/combat-fidelity-wave5-2026-10-20/';
  writeFileSync(new URL(directory + 'stage-browser.json', import.meta.url), JSON.stringify({ date: '2026-10-20', browser: 'local Chromium', ...result, pageErrors }, null, 2) + '\n');
  await page.screenshot({ path: new URL(directory + 'stage-browser.png', import.meta.url).pathname, fullPage: true });
  console.log(JSON.stringify({ mechanisms: result.mechanisms, universes: result.universes, additionalViewportChecks: result.additionalViewportChecks, worstMirrorAlphaErrorRatio: Math.max(...result.rows.map(row => row.mirrorAlphaErrorRatio)), pageErrors }));
} finally {
  await browser.close();
}
