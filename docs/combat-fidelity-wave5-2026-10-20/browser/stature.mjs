import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  const page = await browser.newPage({ viewport: { width: 1850, height: 950 } });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:5188/', { waitUntil: 'networkidle' });
  const result = await page.evaluate(async () => {
    const { drawPixelSprite, preloadSpriteSheetSrcs } = await import('/src/game/renderer.js');
    const { getCharacterAnimationAssets } = await import('/src/game/combat/characterAnimationCatalog.js');
    const { HEROES_DB } = await import('/src/game/heroes.js');
    const assets = getCharacterAnimationAssets().filter(asset => ['doom_marine_classic', 'doomslayer', 'leon', 'arca_bastion'].includes(asset.heroId));
    preloadSpriteSheetSrcs(assets.map(asset => asset.sheet));
    await Promise.all(assets.map(asset => new Promise((resolve, reject) => { const image = new Image(); image.onload = resolve; image.onerror = reject; image.src = asset.sheet; })));
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    document.getElementById('root').style.display = 'none';
    const canvas = document.body.appendChild(document.createElement('canvas')); canvas.width = 1800; canvas.height = 900;
    const ctx = canvas.getContext('2d'); ctx.fillStyle = '#101825'; ctx.fillRect(0, 0, 1800, 900);
    const original = ctx.drawImage.bind(ctx), calls = [];
    ctx.drawImage = (image, ...args) => { calls.push({ sheet: new URL(image.src).pathname, args, facing: Math.sign(ctx.getTransform().a) }); return original(image, ...args); };
    const comparisons = [];
    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i], source = HEROES_DB.find(hero => hero.id === asset.heroId);
      const row = asset.normalization.rows[asset.phases.super.row], review = row.statureReview;
      if (!review) throw new Error(asset.heroId + ': missing measured super correction');
      const x = 230 + i * 420;
      for (const [phase, col, y] of [[review.referencePhase, review.referenceColumn, 350], ['super', review.sourceComparableColumn, 800]]) {
        const actor = { ...source, state: 'idle', presentationPhase: phase, presentationProgress: [0.01, 0.3, 0.6, 0.99][col], presentationImpactProgress: 0.5 };
        const before = JSON.stringify(actor);
        drawPixelSprite(ctx, x, y, actor, 1000, 1, 256, 'melee');
        if (JSON.stringify(actor) !== before) throw new Error('render changed actor');
        ctx.strokeStyle = '#4d697b'; ctx.beginPath(); ctx.moveTo(x - 150, y); ctx.lineTo(x + 150, y); ctx.stroke();
        ctx.font = '15px sans-serif'; ctx.fillStyle = '#e8f4ff'; ctx.fillText(`${asset.heroId} · ${phase}`, x - 140, y + 35);
      }
      comparisons.push({ heroId: asset.heroId, renderScale: row.renderScale, expectedBodyHeight: review.referenceBodyHeight * review.nativeComparableBodyHeight / review.nativeReferenceBodyHeight, displayedBodyHeight: review.normalizedBodyHeight * calls.at(-1).args[7] / 256 });
    }
    return { comparisons, actualDraws: calls.length };
  });
  assert.equal(result.comparisons.length, 4); assert.equal(result.actualDraws, 8);
  for (const entry of result.comparisons) assert.ok(Math.abs(entry.expectedBodyHeight - entry.displayedBodyHeight) <= 2);
  assert.deepEqual(errors, []);
  await page.screenshot({ path: '/workspace/multiverse-breach/docs/combat-fidelity-wave5-2026-10-20/browser/stature.png', fullPage: true });
  console.log(JSON.stringify({ ...result, errors }));
} finally { await browser.close(); }
