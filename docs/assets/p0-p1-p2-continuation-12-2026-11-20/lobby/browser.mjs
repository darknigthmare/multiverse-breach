import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { createServer } from 'vite';
import { getContainedCanvasViewport } from '../../../../src/game/combatViewport.js';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const fixture = '/docs/assets/p0-p1-p2-continuation-12-2026-11-20/lobby/harness.jsx';
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><div id="root"></div><script type="module" src="${fixture}"></script></html>`;
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const server = await createServer({
  root, configFile: false, define: { __MULTIVERSE_BUILD__: '{}' }, logLevel: 'error',
  cacheDir: path.join(tmpdir(), 'mvb-pass12-lobby-vite-cache'),
  optimizeDeps: { entries: [fixture.slice(1)] },
  server: { host: '127.0.0.1', port: 0, hmr: false, watch: null },
  plugins: [react(), {
    name: 'custom-resume-fixture', configureServer(vite) {
      vite.middlewares.use(async (request, response, next) => {
        if (request.url !== '/') return next();
        response.setHeader('content-type', 'text/html');
        response.end(await vite.transformIndexHtml('/', html));
      });
    }
  }]
});
await server.listen();
let browser;
try {
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--disk-cache-size=1'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(server.resolvedUrls.local[0], { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.getByRole('tab', { name: 'RULES' }).click();
  const launch = page.getByRole('button', { name: /LAUNCH TACTICS/ });
  await launch.click();
  await page.waitForFunction(() => window.__customResume.engine?.activeUnit);
  for (let index = 0; index < 4 && await page.evaluate(() => window.__customResume.engine.activeUnitType !== 'hero'); index++) {
    const turn = await page.evaluate(() => window.__customResume.engine.turnSerial);
    await page.getByRole('button', { name: /END TURN/ }).click();
    await page.waitForFunction(previous => window.__customResume.engine.turnSerial > previous, turn);
  }
  await page.waitForFunction(() => window.__customResume.engine.activeUnitType === 'hero');
  await page.locator('.combat-terrain-overlay > summary').click();
  const surface = 'iron_ashline_radio_ridge_tactics:ground:1:5';
  const point = await page.evaluate(id => {
    const terrain = window.__customResume.engine.verticalTerrain;
    const cell = terrain.surface(id);
    return terrain.project(cell.x + 0.5, cell.y + 0.5, cell.z);
  }, surface);
  const canvas = page.locator('canvas').first();
  const box = await canvas.boundingBox();
  const size = await canvas.evaluate(node => ({ width: node.width, height: node.height }));
  const painted = getContainedCanvasViewport({ left: box.x, top: box.y, width: box.width, height: box.height }, size.width, size.height);
  await page.mouse.click(painted.left + point.x * painted.scale, painted.top + point.y * painted.scale);
  await page.waitForFunction(id => window.__customResume.engine.getTerrainViewState().selectedSurfaceId === id, surface);
  await page.keyboard.press('Enter');
  await page.waitForFunction(id => {
    const { heroes, movementSpent } = window.__customResume.engine;
    return heroes[0].surfaceId === id && !heroes[0].terrainMotion && movementSpent === 1;
  }, surface);
  const before = await page.evaluate(() => {
    const probe = window.__customResume;
    probe.original = probe.engine;
    probe.snapshot = () => ({ turn: probe.engine.turnSerial, spent: probe.engine.movementSpent,
      surface: probe.engine.heroes[0].surfaceId, sameInstance: probe.engine === probe.original,
      disposed: probe.original.disposed });
    return probe.snapshot();
  });
  await page.getByRole('button', { name: 'Pause combat' }).click();
  await page.waitForFunction(() => window.__customResume.original.paused);
  await page.getByRole('button', { name: 'Refresh collection' }).click();
  await page.waitForTimeout(250);
  const during = await page.evaluate(() => window.__customResume.snapshot());
  assert.deepEqual(during, before);
  await page.getByRole('button', { name: 'Resume session' }).click();
  await page.waitForFunction(() => !window.__customResume.engine.paused);
  const after = await page.evaluate(() => window.__customResume.snapshot());
  assert.deepEqual(after, before);
  await page.getByRole('button', { name: 'Leave session' }).click();
  await launch.waitFor();
  await page.waitForFunction(() => document.activeElement?.textContent.includes('LAUNCH TACTICS'));
  const lifecycle = await page.evaluate(() => ({ starts: window.__customResume.starts, reports: window.__customResume.reports,
    disposed: window.__customResume.original.disposed, timers: window.__customResume.original.timers.size }));
  assert.deepEqual(lifecycle, { starts: 1, reports: [{ reason: 'abandoned' }], disposed: true, timers: 0 });
  assert.deepEqual(pageErrors, []);
  const receipt = { passed: true, browser: browser.version(), viewport: { width: 1280, height: 900 },
    before, during, after, lifecycle, returnedFocus: 'Launch Tactics', pageErrors };
  await writeFile(new URL('./actual-battle.json', import.meta.url), `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(JSON.stringify(receipt));
} finally {
  await browser?.close();
  await server.close();
}
