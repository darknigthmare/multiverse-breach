import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } });
  const pageErrors = [], consoleErrors = [], failedRequests = [];
  page.on('pageerror', e => pageErrors.push(e.message));
  page.on('console', e => { if (e.type() === 'error') consoleErrors.push(e.text()); });
  page.on('requestfailed', r => failedRequests.push({ url: r.url(), error: r.failure()?.errorText }));
  await page.goto('http://127.0.0.1:5188/', { waitUntil: 'networkidle' });
  const result = await page.evaluate(async () => {
    const compiled = await (await fetch('/src/components/GameCanvas.jsx')).text();
    const rendererUrl = compiled.match(/from "(\/src\/game\/renderer\.js[^"]*)"/)[1];
    const { drawPixelSprite, preloadSpriteSheetSrcs } = await import(rendererUrl);
    const { HEROES_DB } = await import('/src/game/heroes.js');
    const { MELEE_STATES } = await import('/src/game/melee/meleeStateMachine.js');
    const { getMeleeAnimationManifest, getMeleeAnimationSheetSources } = await import('/src/game/melee/meleeAnimationManifest.js');
    const { getHeroMeleeAnimationFrame } = await import('/src/game/spriteAssets.js');
    const source = HEROES_DB.find(h => h.id === 'goku_dbz'), manifest = getMeleeAnimationManifest(source.id);
    if (!manifest || MELEE_STATES.length !== 45) throw new Error('Incomplete real Goku manifest');
    const sources = getMeleeAnimationSheetSources(source.id);
    preloadSpriteSheetSrcs(sources);
    await Promise.all(sources.map(src => new Promise((resolve, reject) => { const i = new Image(); i.onload = resolve; i.onerror = reject; i.src = src; })));
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const canvas = document.createElement('canvas'); canvas.width = 1120; canvas.height = 45 * 126;
    const ctx = canvas.getContext('2d'), original = ctx.drawImage.bind(ctx), calls = [], trace = [];
    ctx.fillStyle = '#10141c'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage = function (image, ...args) { const m = ctx.getTransform(); calls.push({ sheet: new URL(image.src).pathname, args, m: { a: m.a, b: m.b, c: m.c, d: m.d, e: m.e, f: m.f } }); return original(image, ...args); };
    for (const [row, state] of MELEE_STATES.entries()) {
      ctx.fillStyle = '#bce6d8'; ctx.font = '10px monospace'; ctx.fillText(state, 2, row * 126 + 12);
      for (const [side, facing] of [1, -1].entries()) for (let column = 0; column < 4; column++) {
        const actor = { ...source, id: 'goku-p2', sourceHeroId: source.id, state, stateElapsed: (column + .01) / manifest.animations[state].fps };
        const before = JSON.stringify(actor), n = calls.length, expected = getHeroMeleeAnimationFrame(actor, actor.stateElapsed * 1000);
        drawPixelSprite(ctx, 160 + (side * 4 + column) * 128, row * 126 + 104, actor, 1000, facing, 72, 'melee');
        const actual = calls.at(-1);
        if (calls.length !== n + 1 || actual.sheet !== expected.animation.sheet || actual.args[0] !== expected.col * 256 || actual.args[1] !== expected.row * 256 || actual.args[2] !== 256 || actual.args[3] !== 256 || Math.sign(actual.m.a) !== facing) throw new Error(JSON.stringify({ state, column, facing, actual, expected }));
        if (JSON.stringify(actor) !== before) throw new Error('Render mutated core actor');
        trace.push({ kind: 'core', state, column, facing, actual });
      }
    }
    const coreFrameDraws = calls.length, coreImage = canvas.toDataURL('image/png');
    canvas.width = 900; canvas.height = 600;
    ctx.fillStyle = '#10141c'; ctx.fillRect(0, 0, 900, 600); ctx.strokeStyle = '#f0c86c'; ctx.beginPath(); ctx.moveTo(250, 200); ctx.lineTo(650, 200); ctx.stroke();
    for (const side of ['left', 'right']) for (let column = 0; column < 4; column++) {
      const actor = { ...source, state: 'ledgeHang', stateElapsed: (column + .01) / manifest.animations.ledgeHang.fps, x: side === 'left' ? 243 : 657, y: 226, facing: side === 'left' ? -1 : 1, ledge: { side, platform: { x1: 250, x2: 650, y: 200 } } };
      const before = JSON.stringify(actor), frame = getHeroMeleeAnimationFrame(actor, actor.stateElapsed * 1000);
      drawPixelSprite(ctx, actor.x, actor.y, actor, 1000, actor.facing, 72, 'melee');
      const c = calls.at(-1), px = c.args[4] + frame.anchor.x * c.args[6], py = c.args[5] + frame.anchor.y * c.args[7];
      const wx = c.m.a * px + c.m.c * py + c.m.e, wy = c.m.b * px + c.m.d * py + c.m.f;
      if (Math.abs(wx - (side === 'left' ? 250 : 650)) > 1e-8 || Math.abs(wy - 200) > 1e-8) throw new Error('Native hand misses actual ledge');
      if (JSON.stringify(actor) !== before) throw new Error('Grip render moved physical actor');
      trace.push({ kind: 'grip', side, column, handWorld: { x: wx, y: wy }, actual: c });
    }
    return { character: source.id, states: 45, distinctCorePoses: 180, coreFrameDraws, gripFrameDraws: calls.length - coreFrameDraws, physicsUnchanged: true, rendererUrl, sources, trace, coreImage, gripImage: canvas.toDataURL('image/png') };
  });
  assert.equal(result.coreFrameDraws, 360); assert.equal(result.gripFrameDraws, 8); assert.deepEqual(pageErrors, []);
  assert.ok(failedRequests.every(r => r.url.startsWith('https://fonts.googleapis.com/') && r.error === 'net::ERR_TUNNEL_CONNECTION_FAILED'));
  assert.equal(consoleErrors.length, failedRequests.length);
  await fs.writeFile('/tmp/goku-wave4-core.png', Buffer.from(result.coreImage.split(',')[1], 'base64'));
  await fs.writeFile('/tmp/goku-wave4-grips.png', Buffer.from(result.gripImage.split(',')[1], 'base64'));
  await fs.writeFile('/tmp/goku-wave4-core-trace.json', JSON.stringify(result.trace, null, 2));
  const { coreImage: _coreImage, gripImage: _gripImage, trace: _trace, ...summary } = result;
  const report = { passed: true, ...summary, pageErrors, consoleErrors, failedRequests, coreCapture: '/tmp/goku-wave4-core.png', gripCapture: '/tmp/goku-wave4-grips.png' };
  await fs.writeFile('/tmp/goku-wave4-core-result.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
} finally { await browser.close(); }
