import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { extname, relative, resolve, sep } from 'node:path';
import { DISPLAY_PREFERENCES_KEY } from '../src/game/displayPreferences.js';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const arg = (name, fallback) => { const index = process.argv.indexOf(name); return index < 0 ? fallback : process.argv[index + 1]; };
const evidence = resolve(arg('--evidence', '/tmp/menu-accessibility-evidence'));
const fixture = process.env.PLAYWRIGHT_FIXTURE_DIR && resolve(process.env.PLAYWRIGHT_FIXTURE_DIR);
const origin = fixture ? 'http://multiverse.test' : arg('--url', 'http://127.0.0.1:4173');
const browser = await chromium.launch({ headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  args: process.env.PLAYWRIGHT_CHROMIUM_ARGS ? JSON.parse(process.env.PLAYWRIGHT_CHROMIUM_ARGS) : []
});
const results = [];
await mkdir(evidence, { recursive: true });
const bounds = element => { const r = element.getBoundingClientRect(); return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, width: r.width, height: r.height }; };
const within = (a, b) => a.x >= b.x - 1 && a.y >= b.y - 1 && a.right <= b.right + 1 && a.bottom <= b.bottom + 1;
const overlaps = (a, b) => a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y;
const expectFocused = async locator => assert.equal(await locator.evaluate(element => element === document.activeElement), true);
const checkFocusIn = async locator => assert.equal(await locator.evaluate(element => element.contains(document.activeElement)), true);
const measureFonts = (scope, selectors) => Promise.all(selectors.map(selector => scope.locator(selector).first().evaluate(element => parseFloat(getComputedStyle(element).fontSize))));
const assertTextScale = (base, enlarged) => base.forEach((size, index) => assert.ok(Math.abs(enlarged[index] / size - 1.5) < .01, `text did not follow the 150% preference: ${size}px -> ${enlarged[index]}px`));
const checkDialogBounds = async (dialog, viewport, scrollSelectors) => {
  const safe = { x: 32, y: 32, right: viewport.width - 32, bottom: viewport.height - 32 };
  const geometry = await dialog.evaluate(bounds);
  assert.ok(within(geometry, safe), 'dialog escaped the chosen 32px safe area');
  const close = await dialog.locator('header button').evaluate(bounds);
  assert.ok(within(close, geometry) && close.width >= 44 && close.height >= 44, 'dialog close control is clipped or too small');
  for (const selector of scrollSelectors) {
    const element = dialog.locator(selector);
    assert.equal(await element.evaluate(node => node.scrollWidth <= node.clientWidth + 1), true, `${selector} requires horizontal scrolling`);
  }
  return geometry;
};
const checkReadableText = async (textLocator, scrollArea) => {
  const area = await scrollArea.evaluate(bounds);
  const proof = await textLocator.evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    const lines = [...range.getClientRects()].filter(rect => rect.width && rect.height).map(rect => ({
      x: rect.x, y: rect.y, right: rect.right, bottom: rect.bottom,
      unobscured: element.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2))
    }));
    return { text: element.textContent, lines, viewport: { x: 0, y: 0, right: innerWidth, bottom: innerHeight } };
  });
  assert.ok(proof.text.trim() && proof.lines.length, 'guide instructions have no rendered text');
  assert.ok(proof.lines.every(line => within(line, area) && within(line, proof.viewport) && line.unobscured), 'some guide instruction lines are clipped or covered');
  return { text: proof.text, lines: proof.lines, area };
};

try {
  for (const viewport of [{ width: 390, height: 844 }, { width: 844, height: 390 }, { width: 1365, height: 900 }]) for (const lang of ['fr', 'en']) for (const surface of ['menus', 'guide']) {
    const name = `${surface}-${viewport.width}x${viewport.height}-${lang}`;
    const fr = lang === 'fr';
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce', hasTouch: viewport.width < 600 });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    const errors = [], missing = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) missing.push(`${response.status()} ${response.url()}`); });
    await context.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, route => route.abort());
    if (fixture) await context.route('http://multiverse.test/**', async route => {
      const path = resolve(fixture, '.' + new URL(route.request().url()).pathname);
      const rel = relative(fixture, path);
      if (rel === '..' || rel.startsWith('..' + sep)) return route.fulfill({ status: 403, body: 'Outside fixture' });
      try { await route.fulfill({ body: await readFile(path), contentType: ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' })[extname(path)] || 'application/octet-stream' }); }
      catch { await route.fulfill({ status: 404, body: 'Fixture resource missing' }); }
    });
    await page.addInitScript(({ key }) => localStorage.setItem(key, JSON.stringify({ version: 1, textScale: 1.5, hudScale: 1.4, safeArea: 32, contrast: 'high', motion: 'reduced' })), { key: DISPLAY_PREFERENCES_KEY });
    const record = { name, viewport, lang, surface, textScale: 1.5, hudScale: 1.4, safeArea: 32, status: 'running' };
    results.push(record);
    try {
      await page.goto(`${origin}/scripts/fixtures/menu-accessibility.html?surface=${surface}&lang=${lang}`);
      if (surface === 'menus') {
        const terminal = page.locator('.immersive-drawer');
        const trigger = page.getByTestId('open-terminal');
        await trigger.click();
        await terminal.waitFor();
        assert.equal(await page.locator('#root').evaluate(element => element.inert), true);
        await expectFocused(terminal.locator('header button'));
        const textSize = page.getByLabel(fr ? 'Taille du texte' : 'Text size');
        await textSize.focus();
        await page.keyboard.press('Home');
        assert.equal(await textSize.inputValue(), '1');
        await page.waitForFunction(() => getComputedStyle(document.documentElement).fontSize === '16px');
        const preview = page.locator('.arca-preview-dialog');
        const previewFontSelectors = ['h2', '.arca-preview-kicker', '.arca-preview-close'];
        const lab = page.locator('.portal-lab');
        const labFontSelectors = ['.portal-lab__header h2', '.portal-lab__header p', '.portal-lab__search input', '.portal-lab__inspection-heading h3', '.portal-lab__metadata dd'];
        await page.getByTestId('open-preview').click();
        await preview.waitFor();
        const previewBaseFonts = await measureFonts(preview, previewFontSelectors);
        await page.keyboard.press('Escape');
        await preview.waitFor({ state: 'detached' });
        await page.getByTestId('open-lab').click();
        await lab.waitFor();
        const labBaseFonts = await measureFonts(lab, labFontSelectors);
        await page.keyboard.press('Escape');
        await lab.waitFor({ state: 'detached' });
        await textSize.focus();
        await page.keyboard.press('End');
        assert.equal(await textSize.inputValue(), '1.5');
        await page.waitForFunction(() => getComputedStyle(document.documentElement).fontSize === '24px');

        await page.getByTestId('open-preview').click();
        await preview.waitFor();
        assert.equal(await terminal.locator('..').evaluate(element => element.inert), true);
        const closePreview = preview.locator('button');
        const previewContent = preview.getByRole('document', { name: fr ? 'Images de la prévisualisation' : 'Preview images' });
        await expectFocused(closePreview);
        await page.keyboard.press('Tab'); await expectFocused(previewContent);
        await page.keyboard.press('Tab'); await expectFocused(closePreview);
        await page.keyboard.press('Shift+Tab'); await expectFocused(previewContent);
        await page.keyboard.press('Shift+Tab'); await expectFocused(closePreview);
        const previewLargeFonts = await measureFonts(preview, previewFontSelectors);
        assertTextScale(previewBaseFonts, previewLargeFonts);
        const previewBounds = await checkDialogBounds(preview, viewport, ['.arca-preview-content']);
        await preview.locator('img').evaluate(image => image.decode());
        await page.screenshot({ path: resolve(evidence, `${name}-preview.png`) });
        await page.keyboard.press('Escape');
        await preview.waitFor({ state: 'detached' });
        assert.equal(await terminal.locator('..').evaluate(element => element.inert), false);
        assert.equal(await page.locator('#root').evaluate(element => element.inert), true);
        await expectFocused(page.getByTestId('open-preview'));
        assert.deepEqual(await page.evaluate(() => ({ preview: window.__menuQA.previewsClosed, terminal: window.__menuQA.terminalsClosed })), { preview: 2, terminal: 0 });

        await page.getByTestId('open-gallery').click();
        await preview.waitFor();
        assert.equal(await preview.locator('figure').count(), 9);
        await preview.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
        const galleryBounds = await checkDialogBounds(preview, viewport, ['.arca-preview-content']);
        assert.ok(await previewContent.evaluate(element => element.clientHeight >= 48 && element.scrollHeight > element.clientHeight), 'gallery does not retain a usable scrolling region');
        await previewContent.focus();
        await page.keyboard.press('End');
        await page.waitForFunction(() => { const content = document.querySelector('.arca-preview-content'); return content.scrollTop > 0 && content.scrollTop + content.clientHeight >= content.scrollHeight - 2; });
        const finalSheet = await preview.locator('figure').last().evaluate(bounds);
        const galleryContentBounds = await previewContent.evaluate(bounds);
        assert.ok(finalSheet.bottom <= galleryContentBounds.bottom + 1 && finalSheet.bottom > galleryContentBounds.y, 'the final sheet cannot be reached with the keyboard');
        await page.screenshot({ path: resolve(evidence, `${name}-gallery.png`) });
        await page.keyboard.press('Escape');
        await preview.waitFor({ state: 'detached' });
        await expectFocused(page.getByTestId('open-gallery'));

        await page.getByTestId('open-lab').click();
        await lab.waitFor();
        assert.equal(await terminal.locator('..').evaluate(element => element.inert), true);
        await checkFocusIn(lab);
        await page.keyboard.press('Shift+Tab'); await checkFocusIn(lab);
        await page.keyboard.press('Tab'); await checkFocusIn(lab);
        const labLargeFonts = await measureFonts(lab, labFontSelectors);
        assertTextScale(labBaseFonts, labLargeFonts);
        const labBounds = await checkDialogBounds(lab, viewport, ['.portal-lab__workspace', '.portal-lab__sidebar', '.portal-lab__inspection']);
        assert.equal(await lab.locator('.portal-lab__header p').isVisible(), true, 'the portal explanation disappeared on mobile');
        const longUniverse = fr ? 'Trame de contrôle — Archives des expéditions de la Cité-Mosaïque' : 'Control Thread — Archives of the Mosaic City expeditions';
        await lab.locator('input[type="search"]').fill(longUniverse);
        const universe = lab.getByRole('button', { name: `${longUniverse} PRODUCTION`, exact: true });
        await universe.click();
        assert.equal(await lab.locator('.portal-lab__inspection-heading h3').textContent(), longUniverse);
        const label = universe.locator('span');
        assert.equal(await label.evaluate(element => {
          const range = document.createRange(); range.selectNodeContents(element);
          const area = element.getBoundingClientRect();
          return [...range.getClientRects()].every(rect => rect.x >= area.x - 1 && rect.right <= area.right + 1 && rect.bottom <= area.bottom + 1);
        }), true, 'long universe name was clipped in the catalogue');
        await checkDialogBounds(lab, viewport, ['.portal-lab__workspace', '.portal-lab__sidebar', '.portal-lab__inspection']);
        const dossier = lab.getByRole('main', { name: fr ? 'Dossier du portail sélectionné' : 'Selected portal dossier' });
        await dossier.focus();
        await expectFocused(dossier);
        await page.screenshot({ path: resolve(evidence, `${name}-lab-dossier.png`) });
        await lab.locator('input[type="search"]').fill('no-such-thread-in-this-catalogue');
        await lab.locator('.portal-lab__empty').waitFor({ state: 'visible' });
        assert.equal(await lab.locator('.portal-lab__empty').isVisible(), true);
        await page.screenshot({ path: resolve(evidence, `${name}-lab.png`) });
        await page.keyboard.press('Escape');
        await lab.waitFor({ state: 'detached' });
        await expectFocused(page.getByTestId('open-lab'));
        assert.equal(await page.evaluate(() => window.__menuQA.labsClosed), 2);
        assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
        await page.keyboard.press('Escape');
        await terminal.waitFor({ state: 'detached' });
        await expectFocused(trigger);
        assert.equal(await page.locator('#root').evaluate(element => element.inert), false);
        assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');

        await trigger.click(); await page.getByTestId('open-preview').click();
        await preview.waitFor();
        // Explicit owner teardown, not a synthetic replacement for player input.
        await page.evaluate(() => window.__menuQA.closeAll());
        assert.equal(await page.locator('[role="dialog"]').count(), 0);
        assert.equal(await page.locator('#root').evaluate(element => element.inert), false);
        assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');
        await expectFocused(trigger);
        record.bounds = { preview: previewBounds, gallery: galleryBounds, lab: labBounds };
        record.fonts = { previewBaseFonts, previewLargeFonts, labBaseFonts, labLargeFonts };
        record.checks = ['native Tab/Shift+Tab', 'one-layer Escape', 'nested inert ownership', 'focus return', 'simultaneous teardown', 'native text slider changes modal copy size', '32px safe area and reachable close controls', 'long catalogue names and full mobile explanations', 'keyboard scrolling through all gallery sheets'];
      } else {
        const guide = page.locator('.mosaic-city-guide--collapsible');
        const toggle = guide.locator('.mosaic-city-guide-toggle');
        const terminalTrigger = page.getByTestId('guide-terminal-trigger');
        const compact = viewport.height <= 560;
        await guide.waitFor();
        const initialExpanded = viewport.height > 560 && viewport.width > 600;
        assert.equal(await toggle.getAttribute('aria-expanded'), compact ? null : String(initialExpanded));
        assert.equal(await toggle.getAttribute('aria-haspopup'), compact ? 'dialog' : null);
        const expectedBody = await guide.locator('.mosaic-city-guide-content p').textContent();
        if (initialExpanded) await toggle.click();
        const controls = await page.locator('.mosaic-world-controls').evaluate(bounds);
        const location = await page.locator('.mosaic-location').evaluate(bounds);
        const center = await page.getByTestId('world-center').evaluate(bounds);
        const screen = { x: 0, y: 0, right: viewport.width, bottom: viewport.height };
        const collapsed = await guide.evaluate(bounds);
        assert.ok(within(collapsed, screen) && !overlaps(collapsed, controls));
        assert.equal(overlaps(collapsed, location), false, 'collapsed guide covers the three-line location');
        if (viewport.height <= 560) assert.equal(overlaps(collapsed, center), false, 'collapsed guide covers the scene centre');
        let expanded = null;
        const textProofs = [];
        if (compact) {
          assert.equal(await guide.getByRole('region').count(), 0, 'short view offers an unusable inline reader');
          assert.ok((await toggle.textContent()).includes(fr ? 'Lire dans le terminal' : 'Read in terminal'));
          textProofs.push({ surface: 'compact-title', ...await checkReadableText(toggle.locator('strong'), toggle) });
          textProofs.push({ surface: 'compact-action', ...await checkReadableText(toggle.locator('.mosaic-city-guide-toggle-label'), toggle) });
          await toggle.focus();
        } else {
          await toggle.focus(); await page.keyboard.press('Enter');
          assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
          expanded = await guide.evaluate(bounds);
          assert.ok(within(expanded, screen) && !overlaps(expanded, controls), 'expanded guide overlaps movement controls');
          assert.equal(overlaps(expanded, location), false, 'expanded guide covers the three-line location');
          const inlineReader = guide.getByRole('region', { name: fr ? 'Instructions du guide' : 'Guide instructions' });
          textProofs.push({ surface: 'inline', ...await checkReadableText(inlineReader.locator('p'), inlineReader) });
          await inlineReader.focus();
        }
        await page.evaluate(() => { window.__menuQA.inputEvents = []; });
        const cityCommands = ['w', 'a', 's', 'd', 'z', 'q', 'e', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        for (const key of cityCommands) await page.keyboard.press(key);
        await page.keyboard.press('Escape');
        const inputEvents = await page.evaluate(() => window.__menuQA.inputEvents);
        assert.deepEqual(inputEvents.filter(event => event.type === 'keydown').map(event => event.key), ['escape'], 'reading the guide leaked a City command or swallowed global pause');
        for (const key of cityCommands) assert.ok(inputEvents.some(event => event.type === 'keyup' && event.key === key.toLowerCase()), `held ${key} could not be released globally`);
        await page.screenshot({ path: resolve(evidence, `${name}-${compact ? 'compact' : 'expanded'}.png`) });
        const readGuide = compact ? toggle : guide.getByRole('button', { name: fr ? 'Lire dans le terminal' : 'Read in terminal', exact: true });
        await readGuide.focus(); await page.keyboard.press('Enter');
        const terminal = page.getByRole('dialog', { name: fr ? 'Guide complet de la Cité' : 'Complete City guide' });
        await terminal.waitFor();
        assert.equal(await terminal.locator('p').textContent(), expectedBody, 'terminal lost part of the guide instructions');
        textProofs.push({ surface: 'terminal', ...await checkReadableText(terminal.locator('p'), terminal.locator('.immersive-drawer-content')) });
        assert.equal(await page.evaluate(() => window.__menuQA.pauses), 0, 'folding or reading the guide must not pause its progression');
        await page.screenshot({ path: resolve(evidence, `${name}-terminal.png`) });
        await page.keyboard.press('Escape');
        await terminal.waitFor({ state: 'detached' });
        await expectFocused(terminalTrigger);

        // The stable terminal owns return focus even when pausing removes the guide.
        await readGuide.focus(); await page.keyboard.press('Enter');
        await terminal.waitFor();
        const guideStateButton = page.getByTestId('terminal-guide-state');
        await guideStateButton.focus();
        assert.ok(within(await guideStateButton.evaluate(bounds), screen), 'Pause guide is outside the viewport');
        await page.keyboard.press('Enter');
        await guide.waitFor({ state: 'detached' });
        assert.equal(await guideStateButton.textContent(), fr ? 'REPRENDRE LE GUIDE' : 'RESUME GUIDE');
        await expectFocused(guideStateButton);
        assert.equal(await terminal.isVisible(), true, 'pausing the guide closed its instructions');
        await page.keyboard.press('Escape');
        await terminal.waitFor({ state: 'detached' });
        await expectFocused(terminalTrigger);
        await page.keyboard.press('Enter');
        await terminal.waitFor();
        await guideStateButton.focus(); await page.keyboard.press('Enter');
        await terminal.waitFor({ state: 'detached' });
        await guide.waitFor();
        await expectFocused(terminalTrigger);
        assert.deepEqual(await page.evaluate(() => ({ pauses: window.__menuQA.pauses, resumes: window.__menuQA.resumes })), { pauses: 1, resumes: 1 });

        // Portrait and landscape both match SHORT_VIEWPORT: the independent
        // height transition must still replace the reader and rescue its focus.
        await page.setViewportSize({ width: 390, height: 844 });
        await page.waitForFunction(() => document.querySelector('.mosaic-city-guide-toggle')?.getAttribute('aria-expanded') === 'false');
        await toggle.click();
        await guide.getByRole('button', { name: 'Pause guide', exact: true }).focus();
        await page.setViewportSize({ width: 844, height: 390 });
        await page.waitForFunction(() => document.querySelector('.mosaic-city-guide-toggle')?.getAttribute('aria-haspopup') === 'dialog');
        await expectFocused(toggle);
        assert.equal(await toggle.getAttribute('aria-expanded'), null);
        assert.equal(await guide.getByRole('region').count(), 0);
        assert.deepEqual(await page.evaluate(() => ({ pauses: window.__menuQA.pauses, resumes: window.__menuQA.resumes })), { pauses: 1, resumes: 1 }, 'rotation changed guide progression');
        await page.screenshot({ path: resolve(evidence, `${name}-rotated.png`) });
        record.bounds = { collapsed, expanded, controls, center, location };
        record.mode = compact ? 'terminal-shortcut' : 'collapsible-reader';
        record.textProofs = textProofs;
        record.checks = ['enlarged HUD and text', 'keyboard expand/collapse or direct terminal access on short screens', 'controls and scene clearance', 'City command isolation with keyup and Escape preserved', 'every instruction line rendered inside its reader and unobscured', 'pause and resume guide from terminal', 'stable return focus after guide removal', 'portrait-to-landscape focus return', 'reading and rotation preserve guide progression'];
      }
      assert.deepEqual(errors, []);
      assert.deepEqual(missing, []);
      record.pageErrors = errors; record.missingResources = missing; record.status = 'passed';
    } catch (error) {
      record.status = 'failed'; record.error = error.message; record.pageErrors = errors; record.missingResources = missing;
      await page.screenshot({ path: resolve(evidence, `${name}-failure.png`) }).catch(() => {});
      throw error;
    } finally { await context.close(); }
  }
} finally {
  const report = { browser: browser.version(), limits: ['Isolated UI fixture, no gameplay, cloud or physical-device validation', 'Preview images and the long catalogue label are synthetic; portal atlas is the existing Nexus fallback', 'External Google Fonts are deliberately blocked'], results };
  await writeFile(resolve(evidence, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}
