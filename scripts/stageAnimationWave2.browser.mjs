// Optional local Chromium review. Uses the desktop runtime's Playwright rather
// than adding a production dependency. Start Vite before running this script.
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
    const { STAGE_ANIMATION_WAVE_2 } = await import('/src/game/melee/stageAnimationCatalogWave2.js');
    const { getStageAnimationProfile, renderStageAnimation } = await import('/src/game/melee/stageAnimationCatalog.js');
    const width = 600, height = 300;
    const paths = [...new Set(STAGE_ANIMATION_WAVE_2.flatMap(p => Object.values(p.localBackdrops || {}).map(spec => spec.path)))];
    const images = new Map();
    await Promise.all(paths.map(path => new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => { images.set(path, image); resolve(); };
      image.onerror = () => reject(new Error('Missing local stage backdrop: ' + path));
      image.src = path;
    })));
    const profiles = STAGE_ANIMATION_WAVE_2.map(p => ({
      definition: p,
      stage: { universe: p.universes[0], name: p.sourceScene, mode: Object.keys(p.localBackdrops || {})[0] || 'Combat' }
    }));
    for (const { stage } of profiles) renderStageAnimation(document.createElement('canvas').getContext('2d'), { stage, width, height });
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const nativeDraw = (stage, time, reducedMotion = false, mirrored = false) => {
      const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (mirrored) { ctx.translate(width, 0); ctx.scale(-1, 1); }
      const originalTransform = [...ctx.getTransform().toFloat64Array()];
      const originalStage = JSON.stringify(stage);
      if (!renderStageAnimation(ctx, { stage, width, height, elapsedSeconds: time, reducedMotion })) throw new Error('No rendered mechanism: ' + stage.name);
      if (JSON.stringify([...ctx.getTransform().toFloat64Array()]) !== JSON.stringify(originalTransform)) throw new Error('Canvas transform leaked: ' + stage.name);
      if (JSON.stringify(stage) !== originalStage) throw new Error('Stage state mutated: ' + stage.name);
      return { canvas, pixels: ctx.getImageData(0, 0, width, height).data };
    };
    const equal = (left, right) => left.length === right.length && left.every((value, i) => value === right[i]);
    const rows = [];
    document.body.innerHTML = '';
    document.body.style.cssText = 'margin:0;padding:12px;background:#10151b;color:#d7dee5;font:12px system-ui;display:grid;grid-template-columns:repeat(3,1fr);gap:8px';
    for (const { definition, stage } of profiles) {
      const first = nativeDraw(stage, 0), later = nativeDraw(stage, definition.periodSeconds * 0.23);
      if (equal(first.pixels, later.pixels)) throw new Error('No changed native pixels: ' + definition.id);
      if (!equal(later.pixels, nativeDraw(stage, definition.periodSeconds * 0.23).pixels)) throw new Error('Paused frame drift: ' + definition.id);
      if (!equal(nativeDraw(stage, 8, true).pixels, nativeDraw(stage, 80, true).pixels)) throw new Error('Reduced-motion drift: ' + definition.id);
      const mirrored = nativeDraw(stage, definition.periodSeconds * 0.23, false, true);
      for (const sample of [later, mirrored]) for (let y = Math.ceil(height * 0.615); y < height; y++) {
        for (let x = 0; x < width; x++) if (sample.pixels[(y * width + x) * 4 + 3]) throw new Error('Decor painted over combat lane: ' + definition.id);
      }
      const disabled = document.createElement('canvas'); disabled.width = width; disabled.height = height;
      if (renderStageAnimation(disabled.getContext('2d'), { stage: { ...stage, disableStageAnimations: true }, width, height, elapsedSeconds: 9 })) throw new Error('Disabled stage animated: ' + definition.id);
      const card = document.createElement('section'); card.style.cssText = 'min-width:0;border:1px solid #303943;background:#071018';
      const label = document.createElement('div'); label.textContent = definition.id; label.style.cssText = 'padding:8px;white-space:nowrap;font-size:10px';
      const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height; canvas.style.cssText = 'display:block;width:100%;height:auto';
      const ctx = canvas.getContext('2d'); ctx.fillStyle = '#071018'; ctx.fillRect(0, 0, width, height);
      const image = images.get(getStageAnimationProfile(stage).activeLocalBackdrop?.path);
      if (image) {
        const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
        const sw = width / scale, sh = height / scale;
        ctx.drawImage(image, (image.naturalWidth - sw) / 2, (image.naturalHeight - sh) / 2, sw, sh, 0, 0, width, height);
      }
      ctx.drawImage(later.canvas, 0, 0);
      ctx.strokeStyle = '#2e3944'; ctx.beginPath(); ctx.moveTo(0, height * 0.615); ctx.lineTo(width, height * 0.615); ctx.stroke();
      card.append(label, canvas); document.body.append(card);
      rows.push({ id: definition.id, universe: stage.universe, mode: stage.mode, changedPixels: later.pixels.filter((value, i) => value !== first.pixels[i]).length, reducedMotionFrozen: true, pausedTimeStable: true, mirroredTransformPreserved: true, combatLaneClear: true });
    }
    let stillBackdropModes = 0;
    for (const p of STAGE_ANIMATION_WAVE_2) for (const mode of Object.keys(p.localBackdrops || {})) {
      const stage = { universe: p.universes[0], name: p.sourceScene, mode };
      const calls = [], canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
      const native = ctx.drawImage.bind(ctx);
      ctx.drawImage = (image, ...args) => { calls.push([new URL(image.src).pathname, ...args]); native(image, ...args); };
      renderStageAnimation(ctx, { stage, width, height, elapsedSeconds: 2 });
      await new Promise(resolve => requestAnimationFrame(resolve));
      calls.length = 0; renderStageAnimation(ctx, { stage, width, height, elapsedSeconds: 2 });
      if (!calls.some(call => call[0] === p.localBackdrops[mode].path && call.length === 9)) throw new Error('Actual still region was not composited: ' + p.id + '/' + mode);
      stillBackdropModes++;
    }
    return { mechanisms: rows.length, newUniverses: new Set(rows.map(row => row.universe)).size, stillBackdropModes, newEffectAtlasFrames: 0, official1to1Validated: 0, rows };
  });
  assert.equal(result.mechanisms, 24);
  assert.equal(result.newUniverses, 12);
  assert.equal(result.stillBackdropModes, 5);
  assert.deepEqual(pageErrors, []);
  const output = { date: '2026-10-18', browser: 'local Chromium', ...result, pageErrors };
  writeFileSync(new URL('../docs/audits/stage-animation-wave2-browser-2026-10-18.json', import.meta.url), JSON.stringify(output, null, 2) + '\n');
  await page.screenshot({ path: new URL('../docs/audits/stage-animation-wave2-browser-2026-10-18.png', import.meta.url).pathname, fullPage: true });
  console.log(JSON.stringify({ mechanisms: result.mechanisms, newUniverses: result.newUniverses, stillBackdropModes: result.stillBackdropModes, rowsChecked: result.rows.length, pageErrors }));
} finally {
  await browser.close();
}
