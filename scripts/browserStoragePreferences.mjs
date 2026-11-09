import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve, relative, sep, extname } from 'node:path';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  args: process.env.PLAYWRIGHT_CHROMIUM_ARGS ? JSON.parse(process.env.PLAYWRIGHT_CHROMIUM_ARGS) : []
});
const results = [];
try {
  const root = resolve(process.env.PLAYWRIGHT_FIXTURE_DIR || '.tmp/gamedev-display');
  for (const denied of [false, true]) {
    const context = await browser.newContext();
    const errors = [];
    try {
      // A sandbox with scripts but no same-origin permission produces the real
      // browser SecurityError. No storage getter is replaced or mocked here.
      await context.route('**/*', async route => {
        const url = new URL(route.request().url());
        if (url.origin !== 'http://multiverse.test') { await route.abort(); return; }
        if (url.pathname === '/storage-host') {
          await route.fulfill({ contentType: 'text/html', body: `<!doctype html><html><body>
            <iframe title="Preference controls" ${denied ? 'sandbox="allow-scripts"' : ''}
              src="/scripts/fixtures/gamedev-storage.html" style="width:100%;height:1000px;border:0"></iframe>
            </body></html>` });
          return;
        }
        const path = resolve(root, '.' + url.pathname);
        const fromRoot = relative(root, path);
        if (fromRoot === '..' || fromRoot.startsWith('..' + sep)) {
          await route.fulfill({ status: 403, body: 'Outside fixture' }); return;
        }
        try {
          await route.fulfill({
            body: await readFile(path), headers: { 'Access-Control-Allow-Origin': '*' },
            contentType: { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }[extname(path)] || 'application/octet-stream'
          });
        } catch { await route.fulfill({ status: 404, body: 'Fixture resource missing' }); }
      });
      const page = await context.newPage();
      page.setDefaultTimeout(15000);
      page.on('pageerror', error => errors.push(error.message));
      await page.goto('http://multiverse.test/storage-host');
      const frame = page.frameLocator('iframe');
      const settings = frame.getByTestId('storage-settings');
      await settings.waitFor();
      const child = page.frames().find(candidate => candidate !== page.mainFrame());
      const storageError = await child.evaluate(() => {
        try { void window.localStorage; return null; } catch (error) { return error.name; }
      });
      assert.equal(storageError, denied ? 'SecurityError' : null);
      assert.equal(await settings.getAttribute('data-audio-started'), 'false');
      const volume = frame.getByLabel('Volume musique');
      await volume.focus(); await volume.press('Home');
      for (let step = 0; step < 3; step++) await volume.press('ArrowRight');
      await frame.locator('button.global-audio-control[aria-pressed="false"]').click();
      await frame.locator('button.global-audio-control[aria-pressed="true"]').waitFor();
      await frame.getByRole('button', { name: 'JOUEUR 1 / GAUCHE: Q', exact: true }).click();
      await page.keyboard.press('a');
      await frame.getByRole('button', { name: 'JOUEUR 1 / GAUCHE: A', exact: true }).waitFor();
      assert.equal(await settings.getAttribute('data-music-volume'), '0.3');
      assert.equal(await settings.getAttribute('data-muted'), 'true');
      assert.equal(await settings.getAttribute('data-left-a'), '-1');
      assert.equal(await settings.getAttribute('data-left-q'), '0');
      assert.equal(await settings.getAttribute('data-audio-started'), 'false');
      if (!denied) {
        // Normal persistence must still survive a fresh module/React mount.
        await page.reload();
        await frame.getByRole('button', { name: 'JOUEUR 1 / GAUCHE: A', exact: true }).waitFor();
        await frame.locator('button.global-audio-control[aria-pressed="true"]').waitFor();
        assert.equal(await settings.getAttribute('data-music-volume'), '0.3');
      }
      await frame.getByRole('button', { name: 'RÉINITIALISER', exact: true }).click();
      await frame.getByRole('button', { name: 'JOUEUR 1 / GAUCHE: Q', exact: true }).waitFor();
      assert.equal(await settings.getAttribute('data-left-a'), '0');
      assert.equal(await settings.getAttribute('data-left-q'), '-1');
      assert.deepEqual(errors, []);
      results.push({ storage: denied ? 'native SecurityError' : 'available', preferences: 'passed', reloadPersistence: !denied, pageErrors: errors });
    } finally { await context.close(); }
  }
  console.log(JSON.stringify({ browser: browser.version(), results }, null, 2));
} finally { await browser.close(); }
