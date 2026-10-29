import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve, relative, sep, extname } from 'node:path';

// Use the normal Vite server, or serve a compiled fixture through Playwright
// routing when listening sockets are unavailable. Both paths run the same UI.
// Playwright/Chromium remain optional QA tools, outside shipped dependencies.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  args: process.env.PLAYWRIGHT_CHROMIUM_ARGS ? JSON.parse(process.env.PLAYWRIGHT_CHROMIUM_ARGS) : []
});
const errors = [];
const cases = [];
try {
  const context = await browser.newContext({ reducedMotion: 'no-preference' });
  const fixtureDirectory = process.env.PLAYWRIGHT_FIXTURE_DIR;
  if (fixtureDirectory) {
    const root = resolve(fixtureDirectory);
    await context.route('http://multiverse.test/**', async route => {
      const path = resolve(root, '.' + new URL(route.request().url()).pathname);
      const fromRoot = relative(root, path);
      if (fromRoot === '..' || fromRoot.startsWith('..' + sep)) {
        await route.fulfill({ status: 403, body: 'Outside fixture' });
        return;
      }
      try {
        const contentType = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }[extname(path)] || 'application/octet-stream';
        await route.fulfill({ body: await readFile(path), contentType });
      } catch {
        await route.fulfill({ status: 404, body: 'Fixture resource missing' });
      }
    });
  }
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  const origin = fixtureDirectory ? 'http://multiverse.test' : process.argv[2] || 'http://127.0.0.1:5188';
  await page.goto(new URL('/scripts/fixtures/gamedev-display.html', origin).href);
  const margin = page.getByLabel(/Marge du HUD/);
  const hudScale = page.getByLabel(/Taille du HUD/);
  const reduced = page.getByRole('checkbox', { name: /Réduire les animations/ });
  const expectMargin = async value => {
    await page.waitForFunction(expected => {
      const canvas = document.querySelector('[data-testid="scene-hud"]');
      return canvas && Math.abs(Number(canvas.dataset.mapRight) - expected) < 0.01
        && Math.abs(Number(canvas.dataset.radarRight) - expected) < 0.01;
    }, value);
  };
  const expectReduced = async value => {
    await page.waitForFunction(expected => document.querySelector('[data-testid="scene-hud"]')?.dataset.reducedMotion === String(expected), value);
  };

  for (const viewport of [{ width: 1366, height: 768 }, { width: 360, height: 800 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    await margin.focus();
    await margin.press('Home');
    await expectMargin(0);
    for (let step = 0; step < 3; step++) await margin.press('ArrowRight');
    await expectMargin(6);
    await margin.press('End');
    await expectMargin(32);
    await hudScale.focus();
    await hudScale.press('End');
    await expectMargin(32);
    cases.push({ viewport, margins: [0, 6, 32], hudScale: 1.4 });
  }

  await reduced.check();
  await expectReduced(true);
  await reduced.uncheck();
  await expectReduced(false);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expectReduced(true);
  await reduced.check();
  await reduced.uncheck();
  await expectReduced(true);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expectReduced(false);
  await page.getByRole('button', { name: 'Réglages d’affichage par défaut' }).click();
  await expectMargin(12);
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ browser: browser.version(), cases, liveLocalAndSystemMotion: 'passed', defaultMarginRestored: 12, pageErrors: errors }, null, 2));
} finally {
  await browser.close();
}
