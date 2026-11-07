import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, relative, sep, extname } from 'node:path';
import { DISPLAY_PREFERENCES_KEY } from '../src/game/displayPreferences.js';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const fixture = resolve(process.env.PLAYWRIGHT_FIXTURE_DIR || '.tmp/cg-viewer');
const evidence = resolve(process.env.PLAYWRIGHT_EVIDENCE_DIR || '.tmp/cg-viewer-evidence');
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'], executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
const results = [];
try {
  for (const viewport of [{ width: 390, height: 844 }, { width: 844, height: 390 }, { width: 1365, height: 900 }]) {
    for (const lang of ['fr', 'en']) {
      const name = `${viewport.width}x${viewport.height}-${lang}`;
      const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
      const page = await context.newPage(); page.setDefaultTimeout(10000);
      const errors = [], missing = [], record = { name, viewport, lang, status: 'running' };
      results.push(record);
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => { if (response.status() >= 400) missing.push(response.url()); });
      await context.route('http://multiverse.test/**', async route => {
        const file = resolve(fixture, '.' + new URL(route.request().url()).pathname), rel = relative(fixture, file);
        if (rel === '..' || rel.startsWith('..' + sep)) return route.fulfill({ status: 403, body: 'Outside fixture' });
        try { await route.fulfill({ body: await readFile(file), contentType: ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' })[extname(file)] || 'application/octet-stream' }); }
        catch { await route.fulfill({ status: 404, body: 'Missing fixture resource' }); }
      });
      await context.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, route => route.abort());
      await page.addInitScript(key => {
        localStorage.setItem(key, JSON.stringify({ version: 1, textScale: 1.5, hudScale: 1.4, safeArea: 32, contrast: 'high', motion: 'reduced' }));
        if (!localStorage.getItem('multiverse-breach-cg-gallery-favorites-v1')) {
          localStorage.setItem('multiverse-breach-cg-gallery-favorites-v1', JSON.stringify(['qa-base', 'qa-absent-dlc']));
        }
      }, DISPLAY_PREFERENCES_KEY);
      try {
        await page.goto(`http://multiverse.test/scripts/fixtures/cg-viewer.html?lang=${lang}`);
        await page.waitForFunction(() => document.querySelector('.cg-gallery__stage-open'));
        assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('multiverse-breach-cg-gallery-favorites-v1'))), ['qa-base', 'qa-absent-dlc']);
        const trigger = page.locator('.cg-gallery__stage-open');
        assert.equal(await page.locator('[data-cg-unlocked="false"] img').count(), 0, 'locked art stays undisclosed');
        await trigger.click();
        const dialog = page.getByRole('dialog'), reset = page.getByRole('button', { name: lang === 'fr' ? 'Réinitialiser le zoom' : 'Reset zoom', exact: true });
        await dialog.waitFor();
        assert.equal(await page.locator('#root').evaluate(node => node.inert), true);
        await page.waitForFunction(() => [...document.querySelectorAll('.cg-lightbox img')].every(img => img.complete && img.naturalWidth > 0));
        const expected = await page.evaluate(() => window.__cgViewerQA);
        assert.equal(await page.locator('.cg-lightbox__viewport > img').getAttribute('src'), expected.revised);
        await reset.focus(); await page.keyboard.press('Equal');
        assert.equal(await reset.innerText(), '125%');
        await page.keyboard.press('Control+Equal');
        assert.equal(await reset.innerText(), '125%', 'browser zoom shortcut must not change artwork zoom');
        await page.keyboard.press('Control+0');
        await page.keyboard.press('0'); assert.equal(await reset.innerText(), '100%');
        const zoomIn = page.getByRole('button', { name: lang === 'fr' ? 'Augmenter le zoom' : 'Zoom in', exact: true });
        for (let i = 0; i < 8; i++) await zoomIn.click();
        assert.equal(await reset.innerText(), '300%');
        const imageViewport = page.locator('.cg-lightbox__viewport');
        await imageViewport.focus(); await page.keyboard.press('ArrowDown');
        await page.waitForFunction(() => document.querySelector('.cg-lightbox__viewport').scrollTop > 0);
        if (viewport.width === 390) {
          await page.keyboard.press('ArrowRight');
          await page.waitForFunction(() => document.querySelector('.cg-lightbox__viewport').scrollLeft > 0);
        }
        record.singleImageScroll = await imageViewport.evaluate(node => ({ left: node.scrollLeft, top: node.scrollTop, width: node.clientWidth, scrollWidth: node.scrollWidth, height: node.clientHeight, scrollHeight: node.scrollHeight }));
        await page.screenshot({ path: resolve(evidence, `${name}-single-zoom.png`) });
        await reset.click();
        const version = page.locator('.cg-lightbox__version-select select');
        await version.selectOption('catalog-original');
        assert.equal(await page.locator('.cg-lightbox__viewport > img').getAttribute('src'), expected.original);
        await page.getByRole('button', { name: lang === 'fr' ? 'COMPARER À LA VARIANTE ANTÉRIEURE' : 'COMPARE TO PREVIOUS VARIANT', exact: true }).click();
        assert.deepEqual(await page.locator('.cg-lightbox__comparison img').evaluateAll(nodes => nodes.map(n => n.src)), [expected.revised, expected.original]);
        await page.locator('.cg-lightbox__filmstrip').getByRole('button', { name: 'QA Variant', exact: true }).click();
        assert.equal(await reset.innerText(), '100%');
        await page.getByRole('button', { name: lang === 'fr' ? 'COMPARER À CG01' : 'COMPARE TO CG01', exact: true }).click();
        assert.deepEqual(await page.locator('.cg-lightbox__comparison img').evaluateAll(nodes => nodes.map(n => n.src)), [expected.revised, expected.variant]);
        for (let i = 0; i < 8; i++) await zoomIn.click();
        assert.equal(await reset.innerText(), '300%'); assert.equal(await zoomIn.isDisabled(), true);
        const figure = page.locator('.cg-lightbox__comparison figure').first();
        await figure.focus(); await page.keyboard.press('ArrowRight');
        await page.waitForFunction(() => document.querySelector('.cg-lightbox__comparison figure').scrollLeft > 0);
        record.imageScroll = await figure.evaluate(node => ({ left: node.scrollLeft, width: node.clientWidth, scrollWidth: node.scrollWidth }));
        await reset.click();
        record.bounds = await page.locator('.cg-lightbox__panel').evaluate(node => { const r = node.getBoundingClientRect(); return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: node.clientWidth, scrollWidth: node.scrollWidth }; });
        assert.ok(record.bounds.left >= 31 && record.bounds.top >= 31 && record.bounds.right <= viewport.width - 31 && record.bounds.bottom <= viewport.height - 31);
        assert.ok(record.bounds.scrollWidth <= record.bounds.width + 1);
        record.viewportHeight = await page.locator('.cg-lightbox__viewport').evaluate(node => node.getBoundingClientRect().height);
        assert.ok(record.viewportHeight >= 44, 'viewer keeps a usable artwork area below the controls');
        const size = await reset.evaluate(node => parseFloat(getComputedStyle(node).fontSize));
        await page.evaluate(() => document.documentElement.style.setProperty('--game-text-scale', '1'));
        const normalSize = await reset.evaluate(node => parseFloat(getComputedStyle(node).fontSize));
        await page.evaluate(() => document.documentElement.style.setProperty('--game-text-scale', '1.5'));
        assert.ok(Math.abs(size / normalSize - 1.5) < 0.01); record.fontScale = size / normalSize;
        record.controls = await page.locator('.cg-lightbox__controls button').evaluateAll(nodes => nodes.map(node => ({ height: node.getBoundingClientRect().height, width: node.getBoundingClientRect().width })));
        assert.ok(record.controls.every(box => box.height >= 44 && box.width >= 44));
        await page.screenshot({ path: resolve(evidence, `${name}-comparison.png`) });
        const fullscreen = page.locator('[data-cg-fullscreen]');
        if (viewport.width === 1365 && lang === 'fr') {
          await fullscreen.click();
          await page.waitForFunction(() => document.fullscreenElement === document.querySelector('.cg-lightbox'));
          assert.equal(await fullscreen.getAttribute('aria-pressed'), 'true');
          await fullscreen.click(); await page.waitForFunction(() => !document.fullscreenElement);
          assert.equal(await fullscreen.getAttribute('aria-pressed'), 'false');
          await fullscreen.click();
          await page.waitForFunction(() => Boolean(document.fullscreenElement));
          await page.getByRole('button', { name: 'FERMER', exact: true }).click();
          await page.waitForFunction(() => !document.fullscreenElement && !document.querySelector('.cg-lightbox'));
          assert.equal(await trigger.evaluate(node => node === document.activeElement), true);
          assert.equal(await page.locator('#root').evaluate(node => node.inert), false);
          await trigger.click(); await dialog.waitFor();
          record.nativeFullscreen = 'entered-exited-and-closed-while-active';
        }
        await dialog.evaluate(node => { node.requestFullscreen = () => Promise.reject(new Error('QA denied fullscreen')); });
        await fullscreen.click();
        await page.locator('.cg-fullscreen-message').waitFor();
        assert.equal(await fullscreen.getAttribute('aria-pressed'), 'false');
        assert.equal(await dialog.isVisible(), true); record.deniedFullscreen = 'viewer-retained';
        record.deniedViewportHeight = await imageViewport.evaluate(node => node.getBoundingClientRect().height);
        assert.ok(record.deniedViewportHeight >= 44, 'fullscreen refusal keeps a usable artwork area');
        await page.screenshot({ path: resolve(evidence, `${name}-fullscreen-refused.png`) });
        await page.keyboard.press('Escape');
        assert.equal(await dialog.count(), 0);
        assert.equal(await trigger.evaluate(node => node === document.activeElement), true);
        assert.equal(await page.locator('#root').evaluate(node => node.inert), false);
        await page.locator('.cg-gallery-card[data-cg-type="characterSolo"][data-cg-unlocked="true"] .cg-gallery-card__favorite').click();
        await page.waitForFunction(() => JSON.stringify(JSON.parse(localStorage.getItem('multiverse-breach-cg-gallery-favorites-v1'))) === JSON.stringify(['qa-absent-dlc']));
        await page.goto(`http://multiverse.test/scripts/fixtures/cg-viewer.html?lang=${lang}&restored=1`);
        const restored = page.getByRole('button', { name: lang === 'fr' ? 'Retirer QA Restored des favoris' : 'Remove QA Restored from favorites', exact: true });
        await restored.waitFor();
        assert.equal(await restored.getAttribute('aria-pressed'), 'true');
        record.absentDlcFavourite = 'retained-and-restored-after-visible-favourite-change';
        assert.deepEqual(errors, []); assert.deepEqual(missing, []);
        record.status = 'passed';
      } catch (error) {
        record.status = 'failed'; record.error = error.message;
        await page.screenshot({ path: resolve(evidence, `${name}-failed.png`) });
      } finally { await context.close(); }
    }
  }
} finally {
  await writeFile(resolve(evidence, 'report.json'), JSON.stringify({ browser: browser.version(), scope: 'Real gallery, synthetic labelled artwork; zoom, version comparison, fullscreen and keyboard access', results }, null, 2));
  await browser.close();
}
assert.equal(results.filter(result => result.status === 'passed').length, 6,
  results.filter(result => result.status !== 'passed').map(result => `${result.name}: ${result.error}`).join('\n'));
console.log(JSON.stringify({ passed: results.filter(r => r.status === 'passed').length, total: results.length }));
