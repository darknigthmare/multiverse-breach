import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:5188/', { waitUntil: 'networkidle' });
  const result = await page.evaluate(async () => {
    const { drawPixelSprite, preloadSpriteSheetSrcs } = await import('/src/game/renderer.js');
    const { HEROES_DB } = await import('/src/game/heroes.js');
    const { getCharacterAnimationAssets } = await import('/src/game/combat/characterAnimationCatalog.js');
    const registry = { entries: getCharacterAnimationAssets() };
    preloadSpriteSheetSrcs(registry.entries.map(asset => asset.sheet));
    await Promise.all(registry.entries.map(asset => new Promise((resolve, reject) => {
      const image = new Image(); image.onload = () => image.naturalWidth === 1024 && image.naturalHeight === 2048 ? resolve() : reject(new Error(asset.heroId + ': dimensions'));
      image.onerror = () => reject(new Error(asset.heroId + ': HTTP failure')); image.src = asset.sheet;
    })));
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const canvas = document.createElement('canvas'); canvas.width = 600; canvas.height = 400;
    const ctx = canvas.getContext('2d'), original = ctx.drawImage.bind(ctx), calls = [];
    ctx.drawImage = function (image, ...args) {
      calls.push({ sheet: new URL(image.src).pathname, sx: args[0], sy: args[1], sw: args[2], sh: args[3], facing: Math.sign(ctx.getTransform().a) });
      return original(image, ...args);
    };
    const phases = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
    for (const asset of registry.entries) {
      const source = HEROES_DB.find(hero => hero.id === asset.heroId);
      if (!source || source.universe !== asset.universe) throw new Error(asset.heroId + ': roster identity');
      for (const phase of phases) for (const facing of [1, -1]) for (let col = 0; col < 4; col++) {
        const actor = { ...source, presentationPhase: phase, presentationProgress: (asset.heroId === 'vincent_ff7' && phase === 'fatality' ? [0.01,0.075,0.15,0.225] : [0.01, 0.3, 0.6, 0.99])[col], presentationImpactProgress: 0.5, state: phase === 'super' ? 'special' : 'idle' };
        const before = JSON.stringify(actor), count = calls.length;
        drawPixelSprite(ctx, 300, 300, actor, 1000, facing, 180, 'melee');
        const actual = calls.at(-1);
        if (calls.length !== count + 1 || actual.sheet !== asset.sheet || actual.sx !== col * 256 || actual.sy !== asset.phases[phase].row * 256 || actual.sw !== 256 || actual.sh !== 256 || actual.facing !== facing) throw new Error(asset.heroId + ': native phase ' + phase + '/' + col + '/' + facing + ' actual=' + JSON.stringify(actual) + ' count=' + (calls.length-count));
        if (before !== JSON.stringify(actor)) throw new Error(asset.heroId + ': render changed combat state');
      }
    }
    return { characters: registry.entries.length, phases: registry.entries.length * phases.length, actualFrameDraws: calls.length };
  });
  assert.deepEqual(result, { characters: 50, phases: 400, actualFrameDraws: 3200 });
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ ...result, errors }));
} finally { await browser.close(); }
