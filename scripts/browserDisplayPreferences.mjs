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
const scaleCases = [];
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
  page.setDefaultTimeout(15000);
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

  // Observe the pixels drawn by the fixture, not a second copy of the layout
  // formula. A wide viewport keeps both shapes below their responsive caps.
  const renderedHudMetrics = async () => page.evaluate(() => {
    const canvas = document.querySelector('[data-testid="scene-hud"]');
    const rect = canvas.getBoundingClientRect();
    const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    const bounds = {
      map: { minX: Infinity, minY: Infinity, maxX: -1, maxY: -1 },
      radar: { minX: Infinity, minY: Infinity, maxX: -1, maxY: -1 }
    };
    const near = (actual, expected) => Math.abs(actual - expected) < 8;
    for (let pixel = 0; pixel < data.length; pixel += 4) {
      if (data[pixel + 3] < 128) continue;
      const r = data[pixel];
      const g = data[pixel + 1];
      const b = data[pixel + 2];
      const box = near(r, 57) && near(g, 197) && near(b, 187) ? bounds.map
        : near(r, 255) && near(g, 212) && near(b, 105) ? bounds.radar : null;
      if (!box) continue;
      const x = (pixel / 4) % canvas.width;
      const y = Math.floor(pixel / 4 / canvas.width);
      box.minX = Math.min(box.minX, x);
      box.maxX = Math.max(box.maxX, x);
      box.minY = Math.min(box.minY, y);
      box.maxY = Math.max(box.maxY, y);
    }
    return Object.fromEntries(Object.entries(bounds).map(([name, box]) => [name,
      box.maxX < 0 ? null : {
        width: (box.maxX - box.minX + 1) * rect.width / canvas.width,
        height: (box.maxY - box.minY + 1) * rect.height / canvas.height,
        right: rect.width - (box.maxX + 1) * rect.width / canvas.width
      }
    ]));
  });

  await page.setViewportSize({ width: 1366, height: 768 });
  await margin.focus();
  await margin.press('End');
  await expectMargin(32);
  for (const choice of [
    { value: 0.9, keys: ['Home'] },
    { value: 1, keys: ['Home', 'ArrowRight', 'ArrowRight'] },
    { value: 1.4, keys: ['End'] }
  ]) {
    await hudScale.focus();
    for (const key of choice.keys) await hudScale.press(key);
    assert.equal(Number(await hudScale.inputValue()), choice.value);
    const previousFrame = Number(await page.getByTestId('scene-hud').getAttribute('data-presentation-frame'));
    await page.waitForFunction(previous => Number(document.querySelector('[data-testid="scene-hud"]')?.dataset.presentationFrame) > previous, previousFrame);
    const metrics = await renderedHudMetrics();
    for (const name of ['map', 'radar']) {
      assert.ok(metrics[name], `${name} must have visible pixels at HUD scale ${choice.value}`);
      assert.ok(Math.abs(metrics[name].right - 32) <= 1, `${name} rendered margin must stay 32 px: ${JSON.stringify(metrics[name])}`);
      if (scaleCases.length) {
        const baseline = scaleCases[0];
        for (const dimension of ['width', 'height']) {
          const expected = baseline.metrics[name][dimension] * choice.value / baseline.hudScale;
          assert.ok(Math.abs(metrics[name][dimension] - expected) <= 2,
            `${name} rendered ${dimension} must follow HUD scale ${choice.value}: expected ${expected}, got ${metrics[name][dimension]}`);
        }
      }
    }
    scaleCases.push({ hudScale: choice.value, metrics });
    await expectMargin(32);
  }

  for (const viewport of [{ width: 1366, height: 768 }, { width: 360, height: 800 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    await margin.focus();
    await margin.press('Home');
    await expectMargin(0);
    for (let step = 0; step < 3; step++) await margin.press('ArrowRight');
    await expectMargin(6);
    await margin.press('End');
    await expectMargin(32);
    assert.equal(Number(await hudScale.inputValue()), 1.4);
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
  console.log(JSON.stringify({ browser: browser.version(), cases, scaleCases, liveLocalAndSystemMotion: 'passed', defaultMarginRestored: 12, pageErrors: errors }, null, 2));
} finally {
  await browser.close();
}
