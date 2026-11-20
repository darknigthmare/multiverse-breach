import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { createServer } from 'vite';
import { BRIAR_QUEEN } from '../../../../src/game/originalBriarQueenGuard.js';

const require = createRequire(import.meta.url);
const playwrightPath = process.env.PLAYWRIGHT_MODULE_PATH || '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright';
const chromiumPath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || '/usr/bin/chromium';
const { chromium } = require(playwrightPath);
const root = fileURLToPath(new URL('../../../../', import.meta.url));
const fixture = '/docs/assets/p0-p1-p2-continuation-12-2026-11-20/motion/harness.jsx';
const document = `<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><div id="root"></div><script type="module" src="${fixture}"></script></html>`;
const server = await createServer({
  root, configFile: false, plugins: [react(), {
    name: 'briar-queen-motion-fixture',
    configureServer(vite) {
      vite.middlewares.use(async (request, response, next) => {
        if (request.url !== '/') return next();
        response.setHeader('content-type', 'text/html');
        response.end(await vite.transformIndexHtml('/', document));
      });
    }
  }], cacheDir: join(tmpdir(), 'pass12-motion-vite'), define: { __MULTIVERSE_BUILD__: '{}' },
  optimizeDeps: { entries: [fileURLToPath(new URL('harness.jsx', import.meta.url))] },
  server: { host: '127.0.0.1', port: 0, watch: null, hmr: false }, logLevel: 'error'
});

const sha256 = value => createHash('sha256').update(value).digest('hex');
const exactHash = sha256(await readFile(join(root, 'public', BRIAR_QUEEN.sheet)));
const native = [0, 0, 1024, 1024];
const cuts = [[80, 386, 245, 298], [582, 32, 284, 264], [709, 394, 243, 269]];
const viewport = { width: 1280, height: 800 };
await server.listen();
let browser;
try {
  browser = await chromium.launch({ executablePath: chromiumPath, headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disk-cache-size=1', '--media-cache-size=1'] });
  const context = await browser.newContext({ viewport, reducedMotion: 'no-preference' });
  const local = server.resolvedUrls.local[0];
  await context.route('**/*', route => route.request().url().startsWith(local) ? route.continue() : route.abort());
  await context.addInitScript(sheet => {
    window.briarDraws = [];
    const nativeDraw = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (image, ...args) {
      if (image instanceof HTMLImageElement && this.canvas.classList.contains('combat-stage-canvas')
        && new URL(image.currentSrc || image.src).pathname === sheet) {
        const matrix = this.getTransform();
        window.briarDraws.push({ rect: args.slice(0, 4), matrix: [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f] });
        if (window.briarDraws.length > 32) window.briarDraws.shift();
      }
      return nativeDraw.call(this, image, ...args);
    };
  }, BRIAR_QUEEN.sheet);
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  const errors = [], httpErrors = [], imageResponses = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    const path = new URL(response.url()).pathname;
    if (response.status() >= 400 && path !== '/favicon.ico') httpErrors.push([path, response.status()]);
    if (path === BRIAR_QUEEN.sheet) imageResponses.push(response);
  });
  await page.goto(local, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() => window.briarMotion?.engine?.enemies?.length === 3 && window.briarDraws.length > 0);
  const identity = await page.evaluate(() => {
    const { engine } = window.briarMotion;
    window.briarMotion.manual = true;
    const [source, ally, excluded] = engine.enemies;
    excluded.currentHp = 0;
    excluded.state = 'dead';
    const ctx = document.querySelector('canvas.combat-stage-canvas').getContext('2d');
    window.briarProbe = {
      snapshot(count = 0) {
        window.briarMotion.step(count);
        window.briarDraws.length = 0;
        engine.draw(ctx, 0, 'fr');
        const draws = window.briarDraws;
        const origin = draws.length ? new DOMMatrix(draws[0].matrix).inverse() : null;
        const matrices = draws.slice(1).map(draw => {
          const relative = origin.multiply(new DOMMatrix(draw.matrix));
          return [relative.a, relative.b, relative.c, relative.d, relative.e, relative.f].map(n => Number(n.toFixed(7)));
        });
        return { rects: draws.map(draw => draw.rect), matrices, guardTicks: engine.enemies.map(entity => entity.rpgGuardTicks || 0),
          applied: source.rpgBriarGuardApplied === true, pending: source.actionPending === true,
          hp: [...engine.heroes, ...engine.enemies].map(entity => entity.currentHp) };
      },
      charge() { source.atb = source.specialCharge = 100; },
      targets() {
        const { abilityName, effect, previewTargetIds } = engine.getTargetingState() || {};
        return { abilityName, effect, previewTargetIds, resources: [source.atb, source.specialCharge] };
      }
    };
    return { id: source.id, universe: source.universe, stage: engine.stage.stageKey,
      guardedIds: [source.battleId, ally.battleId], excludedId: excluded.battleId };
  });
  assert.equal(identity.id, BRIAR_QUEEN.id);
  assert.equal(identity.universe, BRIAR_QUEEN.universe);
  const png = await Promise.all(imageResponses.map(async response => [response.status(), sha256(await response.body())]));
  assert.deepEqual(png, [[200, exactHash]]);
  const snapshot = count => page.evaluate(ticks => window.briarProbe.snapshot(ticks), count);
  const rest = await snapshot(0);
  await page.evaluate(() => window.briarProbe.charge());
  await page.keyboard.press('7');
  await page.keyboard.press('i');
  const confirm = page.getByRole('button', { name: 'Confirmer les cibles', exact: true });
  await confirm.waitFor({ state: 'visible' });
  const targeting = await page.evaluate(() => window.briarProbe.targets());
  assert.deepEqual(targeting, { abilityName: 'Forêt défensive', effect: 'guard', previewTargetIds: identity.guardedIds, resources: [100, 100] });
  await confirm.click();
  await confirm.waitFor({ state: 'hidden' });
  const spent = await page.evaluate(() => window.briarProbe.targets().resources);
  assert.deepEqual(spent, [0, 0]);
  const preparation = await snapshot(12);
  const beforeImpact = await snapshot(5);
  const applied = await snapshot(1);
  assert.deepEqual(rest.rects, [native]);
  for (const phase of [preparation, beforeImpact, applied]) {
    assert.deepEqual(phase.hp, rest.hp);
    assert.deepEqual(phase.rects, [native, ...cuts]);
  }
  assert.ok(beforeImpact.pending && !beforeImpact.applied && !applied.pending && applied.applied);
  assert.deepEqual(beforeImpact.guardTicks, [0, 0, 0]);
  assert.ok(applied.guardTicks[0] > 0 && applied.guardTicks[0] === applied.guardTicks[1] && applied.guardTicks[2] === 0);
  assert.notDeepEqual(preparation.matrices, beforeImpact.matrices);
  assert.notDeepEqual(applied.matrices, beforeImpact.matrices);
  await page.locator('canvas.combat-stage-canvas').screenshot({ path: fileURLToPath(new URL('foret-defensive.jpg', import.meta.url)), type: 'jpeg', quality: 76 });
  const reducedMotion = [applied.rects.length];
  await page.evaluate(() => window.briarMotion.setMotion('reduced'));
  reducedMotion.push((await snapshot(0)).rects.length);
  await page.evaluate(() => window.briarMotion.setMotion('system'));
  reducedMotion.push((await snapshot(0)).rects.length);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  reducedMotion.push((await snapshot(0)).rects.length);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  reducedMotion.push((await snapshot(0)).rects.length);
  assert.deepEqual(reducedMotion, [4, 1, 4, 1, 4]);
  assert.deepEqual(await snapshot(0), applied);
  const folding = await snapshot(applied.guardTicks[0] - 18);
  const expired = await snapshot(18);
  assert.deepEqual(folding.guardTicks, [18, 18, 0]);
  assert.deepEqual(folding.rects, [native, ...cuts]);
  assert.notDeepEqual(folding.matrices, applied.matrices);
  assert.deepEqual(expired.guardTicks, [0, 0, 0]);
  assert.deepEqual(expired.rects, [native]);
  assert.deepEqual(expired.hp, rest.hp);
  await page.locator('#qa-unmount').evaluate(button => button.click());
  await page.waitForFunction(() => window.briarMotion.engine.disposed && window.briarMotion.engine.timers.size === 0);
  assert.deepEqual(errors, []);
  const report = { chromium: browser.version(), viewport, identity, sprite: { path: BRIAR_QUEEN.sheet, sha256: exactHash, status: png[0][0] },
    input: ['7', 'i', 'Confirmer les cibles'], targeting, spent, appliedTick: 18, reducedMotion,
    phases: { rest, preparation, beforeImpact, applied, folding, expired }, disposed: true, pageErrors: errors, httpErrors };
  await writeFile(new URL('browser.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
  console.log(`Chromium ${report.chromium} · ${viewport.width}×${viewport.height} · ${targeting.abilityName} · tick ${report.appliedTick}`);
} finally {
  await browser?.close();
  await server.close();
}
