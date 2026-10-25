// Start Vite, then run this optional desktop-runtime Chromium check.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const startedAt = new Date().toISOString();
const root = new URL('../../../', import.meta.url);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const baseline = JSON.parse(readFileSync(new URL('docs/combat-fidelity-wave12-2026-10-23/baseline.json', root)));
const oldSource = execFileSync('git', ['show', 'HEAD:src/game/melee/stageAnimationCatalog.js'], { cwd: root });
assert.equal(digest(oldSource), baseline.inputHashes['src/game/melee/stageAnimationCatalog.js']);
const oldModulePath = new URL('stage-animation-before.mjs', import.meta.url);
writeFileSync(oldModulePath, oldSource.toString().replace(/from '(\.\/[^']+)'/g, (_match, value) => "from '/src/game/melee/" + value.slice(2) + "'"));
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  const page = await browser.newPage({ viewport: { width: 1260, height: 900 }, deviceScaleFactor: 1 });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(process.env.STAGE_ANIMATION_REVIEW_URL || 'http://127.0.0.1:5188/', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    const { STAGE_ANIMATION_WAVE_12 } = await import('/src/game/melee/stageAnimationCatalogWave12.js');
    const { getStageAnimationProfile, renderStageAnimation } = await import('/src/game/melee/stageAnimationCatalog.js');
    const draw = (stage, time, { width = 600, height = 300, reducedMotion = false, mirrored = false } = {}) => {
      const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (mirrored) { ctx.translate(width, 0); ctx.scale(-1, 1); }
      ctx.globalAlpha = 0.73; ctx.globalCompositeOperation = 'source-over'; ctx.lineWidth = 2; ctx.strokeStyle = '#aabbcc'; ctx.fillStyle = '#ccbbaa';
      const canvasState = () => ({ transform: [...ctx.getTransform().toFloat64Array()], alpha: ctx.globalAlpha, composite: ctx.globalCompositeOperation, lineWidth: ctx.lineWidth, strokeStyle: ctx.strokeStyle, fillStyle: ctx.fillStyle });
      const savedCanvas = JSON.stringify(canvasState());
      const transform = [...ctx.getTransform().toFloat64Array()], before = JSON.stringify(stage);
      if (!renderStageAnimation(ctx, { stage, width, height, elapsedSeconds: time, reducedMotion })) throw new Error('No mechanism: ' + stage.name);
      if (JSON.stringify(transform) !== JSON.stringify([...ctx.getTransform().toFloat64Array()])) throw new Error('Leaked canvas transform: ' + stage.name);
      if (JSON.stringify(canvasState()) !== savedCanvas) throw new Error('Leaked canvas styles: ' + stage.name);
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
    let viewportChecks = 0, modeRenderChecks = 0;
    for (const p of STAGE_ANIMATION_WAVE_12) {
      const stage = { universe: p.universes[0], name: p.sourceScene, mode: 'Combat', actors: [{ id: 'qa-player', hp: 83, state: 'idle', x: 110, y: 240, z: 2, inventory: ['unchanged'] }], terrain: [{ x: 2, y: 3, z: 0, material: 'stone', walkable: true }, { x: 2, y: 3, z: 3, layerId: 'bridge', material: 'wood' }], events: [] };
      if (getStageAnimationProfile(stage)?.id !== p.id) throw new Error('Wrong concrete scene resolution: ' + p.id);
      const time = p.periodSeconds * 0.23, first = draw(stage, 0), later = draw(stage, time);
      for (const mode of ['Combat', 'Melee', 'RPG', 'Tactics']) {
        const modeStage = { ...stage, mode };
        if (getStageAnimationProfile(modeStage)?.id !== p.id) throw new Error('Mode changed precise scene: ' + p.id + '/' + mode);
        if (!equal(later.pixels, draw(modeStage, time).pixels)) throw new Error('Mode-specific draw drift: ' + p.id + '/' + mode);
        modeRenderChecks++;
      }
      if (!later.pixels.some((value, i) => i % 4 !== 3 && value > 60)) throw new Error('Missing source-specific stroke color: ' + p.id);
      if (equal(first.pixels, later.pixels)) throw new Error('No real changed pixels: ' + p.id);
      if (!equal(first.pixels, draw(stage, p.periodSeconds).pixels)) throw new Error('Incomplete repeating cycle: ' + p.id);
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
      rows.push({ id: p.id, universe: stage.universe, changedChannels: later.pixels.filter((value, i) => value !== first.pixels[i]).length, pausedTimeStable: true, reducedMotionFrozen: true, stageReducedMotionFrozen: true, mirroredTransformPreserved: true, mirrorAlphaErrorRatio, viewportChecks: 3, combatLaneClear: true, stageStateUnchanged: true, actorsAndTerrainUnchanged: true, fullCycleRepeats: true, canvasStylesPreserved: true, disableFlagsPassed: 2 });
    }
    return { mechanisms: rows.length, universes: new Set(rows.map(r => r.universe)).size, additionalViewportChecks: viewportChecks, modeRenderChecks, newOfficialFrames: 0, newEffectAtlasFrames: 0, bitmapRegionComposites: 0, source1to1Validated: 0, rows };
  });
  const historical = await page.evaluate(async () => {
    const current = await import('/src/game/melee/stageAnimationCatalog.js');
    const before = await import('/docs/combat-fidelity-wave12-2026-10-23/browser/stage-animation-before.mjs');
    const profiles = before.STAGE_ANIMATION_PROFILES;
    if (profiles.length !== 401) throw new Error('Expected committed401 historical profiles');
    const NativeImage = window.Image, images = [];
    window.Image = class extends NativeImage { constructor(...args) { super(...args); images.push(this); } };
    const makeStage = p => ({ universe: p.universes[0], name: p.sourceScene, mode: 'Combat', actors: [{ hp: 79 }], terrain: [{ x: 1, y: 1, z: 2, type: 'stone' }] });
    const draw = (library, stage, time) => {
      const canvas = document.createElement('canvas'); canvas.width = 320; canvas.height = 160;
      const original = JSON.stringify(stage);
      const rendered = library.renderStageAnimation(canvas.getContext('2d'), { stage, width: 320, height: 160, elapsedSeconds: time });
      if (JSON.stringify(stage) !== original) throw new Error('Historical stage mutation');
      return { rendered, pixels: canvas.getContext('2d').getImageData(0, 0, 320, 160).data };
    };
    try {
      for (const p of profiles) { const stage = makeStage(p); draw(before, stage, 0); draw(current, stage, 0); }
      const imageLoads = await Promise.all(images.map(async image => { try { await image.decode(); return { path: new URL(image.src).pathname, decoded: true }; } catch { return { path: new URL(image.src).pathname, decoded: false }; } }));
      const signatures = [], sha256 = async bytes => [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(n => n.toString(16).padStart(2, '0')).join('');
      for (const p of profiles) {
        const stage = makeStage(p);
        if (before.getStageAnimationProfile(stage)?.id !== current.getStageAnimationProfile(stage)?.id) throw new Error('Historical scene selection changed: ' + p.id);
        for (const time of [0, 3.7]) {
          const old = draw(before, stage, time), now = draw(current, stage, time);
          if (old.rendered !== now.rendered) throw new Error('Historical render availability changed: ' + p.id);
          if (old.pixels.some((value, i) => value !== now.pixels[i])) throw new Error('Historical browser pixels changed: ' + p.id + '/' + time);
          signatures.push({ id: p.id, time, sha256: await sha256(now.pixels), equalToCommittedBefore: true });
        }
      }
      return { historicalDefinitions: profiles.length, preservedCanvasSignatures: signatures.length, historicalBackdropAndAtlasImageLoads: imageLoads, failedImageLoads: imageLoads.filter(r => !r.decoded), signatures };
    } finally { window.Image = NativeImage; }
  });
  assert.equal(historical.historicalDefinitions, 401);
  assert.equal(historical.preservedCanvasSignatures, 802);
  assert.deepEqual(historical.failedImageLoads, []);
  result.historicalComparison = historical;
  assert.equal(result.mechanisms, 14);
  assert.equal(result.universes, 7);
  assert.equal(result.additionalViewportChecks, 42);
  assert.equal(result.modeRenderChecks, 56);
  assert.deepEqual(pageErrors, []);
  const directory = '../';
  writeFileSync(new URL(directory + 'stage-browser.json', import.meta.url), JSON.stringify({ date: '2026-10-23', passed: true, startedAt, finishedAt: new Date().toISOString(), browser: 'local Chromium', sourceFidelity: 'Documented architectural studies; no official frame reproduction or source1:1 certification', historicalSourceSha256: digest(oldSource), ...result, pageErrors }, null, 2) + '\n');
  await page.screenshot({ path: new URL(directory + 'stage-browser.png', import.meta.url).pathname, fullPage: true });
  for(let panel=0;panel<2;panel++){
    await page.evaluate(p=>{[...document.querySelectorAll('section')].forEach((node,i)=>{node.style.display=i>=p*7&&i<(p+1)*7?'':'none';});},panel);
    await page.screenshot({path:new URL(directory+'stage-browser-panel-'+(panel+1)+'.png',import.meta.url).pathname,fullPage:true});
  }
  console.log(JSON.stringify({ mechanisms: result.mechanisms, universes: result.universes, additionalViewportChecks: result.additionalViewportChecks, modeRenderChecks: result.modeRenderChecks, worstMirrorAlphaErrorRatio: Math.max(...result.rows.map(row => row.mirrorAlphaErrorRatio)), pageErrors }));
} finally {
  await browser.close();
}
