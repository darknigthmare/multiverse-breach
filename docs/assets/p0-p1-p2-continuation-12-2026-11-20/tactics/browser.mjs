import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const fixture = '/docs/assets/p0-p1-p2-continuation-12-2026-11-20/tactics/harness.jsx';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH
  || '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const document = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><div id="root"></div><script type="module" src="${fixture}"></script></html>`;
const server = await createServer({ root, configFile: false, plugins: [react(), {
  name: 'dead-calm-fixture', configureServer(vite) {
    vite.middlewares.use(async (request, response, next) => {
      if (request.url !== '/') return next();
      response.setHeader('content-type', 'text/html');
      response.end(await vite.transformIndexHtml('/', document));
    });
  }
}], cacheDir: path.join(os.tmpdir(), 'mvb-pass12-dead-calm-vite'), define: { __MULTIVERSE_BUILD__: '{}' },
optimizeDeps: { entries: [fileURLToPath(new URL('harness.jsx', import.meta.url))] },
server: { host: '127.0.0.1', port: 0, watch: null, hmr: false }, logLevel: 'error' });
await server.listen();
let browser, page;
const moves = [], errors = [], missingAssets = new Set();
const field = 'crownless_dead_calm_graveyard_tactics';
const viewport = { width: 1280, height: 900 };
const read = () => page.evaluate(() => {
  const { engine: e } = window.__deadCalm;
  const { escortUnit: ship } = e;
  const actor = e.heroes[0];
  return { serial: e.turnSerial, side: e.activeUnitType, hero: actor.gridX, ship: ship.gridX, shipZ: ship.gridZ,
    support: actor.surfaceId, result: e.battleResult, objective: e.objectiveProgress };
});
try {
  browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || '/usr/bin/chromium',
    headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--disk-cache-size=1'] });
  page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
  page.setDefaultTimeout(15000);
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() === 404) missingAssets.add(new URL(response.url()).pathname); });
  await page.goto(server.resolvedUrls.local[0], { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.getByRole('tab', { name: 'ARENA' }).click();
  const terrain = page.getByRole('combobox', { name: 'TACTICAL TERRAIN', exact: true });
  assert.equal(await terrain.inputValue(), 'auto');
  await terrain.selectOption(field);
  await page.getByRole('tab', { name: 'RULES' }).click();
  await page.getByRole('button', { name: /LAUNCH TACTICS/ }).click();
  await page.waitForFunction(field => window.__deadCalm?.engine?.battlefield.id === field, field);
  assert.equal(await page.evaluate(() => window.__deadCalm.engine.escortIdentity.renderKind), 'lantern-ship');
  await page.getByRole('button', { name: 'BRIEFING', exact: true }).click();
  await page.getByRole('dialog', { name: 'Mission briefing' })
    .getByText(/Lantern ship.*The Crownless Sea.*Original mission vessel/).waitFor();
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !window.__deadCalm.engine.paused);
  const canvas = page.locator('canvas').first();
  const inspector = page.locator('.combat-terrain-overlay');
  if (await inspector.evaluate(element => element.open)) await inspector.locator('summary').click();
  let screenshot;
  for (let turn = 0; turn < 35; turn++) {
    const view = await read();
    if (view.result) break;
    if (view.side === 'hero' && view.hero !== view.ship) {
      assert.equal(view.ship, view.hero + 1);
      const goal = `${field}:ground:${view.ship}:5`;
      const cost = await page.evaluate(id => window.__deadCalm.engine.movementRange.find(cell => cell.surfaceId === id)?.cost, goal);
      assert.ok(cost);
      await canvas.focus();
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction(id => window.__deadCalm.engine.getTerrainViewState().selectedSurfaceId === id, goal);
      await page.keyboard.press('Enter');
      await page.waitForFunction(id => window.__deadCalm.engine.heroes[0].surfaceId === id && !window.__deadCalm.engine.heroes[0].terrainMotion, goal);
      assert.equal(await page.evaluate(() => window.__deadCalm.engine.movementSpent), cost);
      moves.push({ surfaceId: goal, cost });
    }
    if (!screenshot && view.ship === 4 && view.side === 'hero') screenshot = await page.screenshot({ type: 'jpeg', quality: 75 });
    await page.getByRole('button', { name: /END TURN/ }).click();
    await page.waitForFunction(serial => {
      const e = window.__deadCalm.engine;
      return !e.escortUnit.terrainMotion && (e.turnSerial > serial || e.gameOver);
    }, view.serial);
  }
  const result = await read();
  assert.deepEqual([result.ship, result.shipZ, result.objective, result.result], [11, -1, 1, 'victory']);
  assert.equal(moves.reduce((total, entry) => total + entry.cost, 0), 11);
  assert.ok(screenshot);
  assert.deepEqual(errors, []);
  await page.evaluate(() => window.__deadCalm.unmount());
  await page.waitForFunction(() => window.__deadCalm.engine.disposed && window.__deadCalm.engine.timers.size === 0);
  await fs.writeFile(new URL('dead-calm-1280.jpg', import.meta.url), screenshot);
  const report = { passed: true, viewport, launch: 'explicit Tactics field from Custom Battle', briefing: 'Lantern ship',
    engine: field, moves, result, disposed: true, pageErrors: errors, missingCheckoutAssets: [...missingAssets], capture: 'dead-calm-1280.jpg' };
  await fs.writeFile(new URL('browser.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
} catch (error) {
  const diagnostic = await read().catch(() => null);
  console.error(JSON.stringify({ error: error.message, diagnostic, moves, errors, missingAssets: [...missingAssets] }));
  throw error;
} finally {
  await browser?.close();
  await server.close();
}
