import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, relative, resolve, sep } from 'node:path';
import { DISPLAY_PREFERENCES_KEY } from '../src/game/displayPreferences.js';
import { AUDIO_PREFERENCES_KEY } from '../src/game/audioPreferences.js';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const fixture = resolve(process.env.PLAYWRIGHT_FIXTURE_DIR || '.tmp/universe-archive');
const evidence = resolve(process.env.PLAYWRIGHT_EVIDENCE_DIR || '.tmp/universe-archive-evidence');
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'], executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
const results = [];
const syntheticArt = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#14313c"/><text x="50" y="55" text-anchor="middle" fill="#90e3cf">QA</text></svg>';
const frames = page => page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))));
const focused = async locator => {
  const handle = await locator.elementHandle();
  try { await locator.page().waitForFunction(node => document.activeElement === node, handle); }
  finally { await handle.dispose(); }
};
const entryIds = group => group.locator('[data-archive-entry]').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-archive-entry')));
const wardrobeCategoryState = wardrobe => wardrobe.locator('.character-wardrobe__sections button').evaluateAll(nodes => nodes.map(node => {
  const style = getComputedStyle(node);
  return { name: node.textContent.trim().replace(/\s+/gu, ' '), pressed: node.getAttribute('aria-pressed'),
    hovered: node.matches(':hover'), focused: document.activeElement === node, focusVisible: node.matches(':focus-visible'),
    background: style.backgroundColor, border: style.borderColor, outline: style.outline };
}));
const fonts = root => root.locator('.universe-archive-header strong, [data-archive-close], #universe-archive-title, .universe-archive-intro p, .universe-archive-lore > summary, .universe-archive-counts dt, .universe-archive-counts dd, [role="tab"], .universe-archive-catalog h3, .universe-archive-filters label > span, .universe-archive-filters input, .universe-archive-filters select, .universe-archive-clear, .universe-archive-pages p, .universe-archive-pages button, .universe-archive-entries article b, .universe-archive-illustration-status')
  .evaluateAll(nodes => nodes.filter(node => node.getClientRects().length).map(node => ({ text: node.textContent.slice(0, 60), size: parseFloat(getComputedStyle(node).fontSize) })));
const inspectLayout = async (root, viewport, record, key) => {
  const layout = await root.evaluate(node => {
    const areas = [node, ...node.querySelectorAll('.universe-archive-header, .universe-archive-scroll, .universe-archive-intro, .universe-archive-lore, .universe-archive-counts, .universe-archive-tabs, .universe-archive-columns, .universe-archive-catalog, .universe-archive-filters, .universe-archive-pages, .universe-archive-entries, .universe-archive-illustration-placeholder, [data-archive-entry]')]
      .filter(area => area.getClientRects().length).map(area => ({ name: area.getAttribute('data-archive-entry') || area.className, width: area.clientWidth, scrollWidth: area.scrollWidth, height: area.clientHeight, scrollHeight: area.scrollHeight }));
    const controls = [...node.querySelectorAll('button, input, select, summary')].filter(control => control.getClientRects().length).map(control => {
      const r = control.getBoundingClientRect();
      return { name: control.getAttribute('aria-label') || control.textContent.slice(0, 60), left: r.left, right: r.right, width: r.width, height: r.height };
    });
    const r = node.querySelector('[data-archive-close]').getBoundingClientRect();
    return { areas, controls, close: { top: r.top, bottom: r.bottom } };
  });
  record[key] = layout;
  for (const area of layout.areas) assert.ok(area.scrollWidth <= area.width + 1, `Horizontal overflow: ${JSON.stringify(area)}`);
  for (const area of layout.areas.filter(area => area.name === 'universe-archive-illustration-placeholder')) assert.ok(area.scrollHeight <= area.height + 1, `Missing illustration placeholder overflowed vertically: ${JSON.stringify(area)}`);
  for (const control of layout.controls) {
    assert.ok(control.width >= 43 && control.height >= 43, `Small target: ${JSON.stringify(control)}`);
    assert.ok(control.left >= 31 && control.right <= viewport.width - 31, `Control escaped the 32px safe area: ${JSON.stringify(control)}`);
  }
  assert.ok(layout.areas.find(area => area.name === 'universe-archive-scroll')?.height >= 120, 'Fixed header consumed the reading area');
  assert.ok(layout.close.top >= 31 && layout.close.bottom <= viewport.height - 31, 'Close control escaped the vertical safe area');
};
const catalogues = [
  ['signatures', 'heroes', 'qa-hero-61', 61], ['signatures', 'enemies', 'qa-enemy-61', 61],
  ['items', 'relics', 'qa-relic-61', 61], ['items', 'battle-items', 'qa-battle-61', 61], ['items', 'world-items', 'qa-world-61', 61],
  ['missions', 'missions', 'qa-mission-61', 61], ['missions', 'arcs', 'qa-arc-61', 62], ['missions', 'collections', 'qa-collection-61', 61]
];

try {
  for (const viewport of [{ width: 390, height: 844 }, { width: 844, height: 390 }, { width: 1365, height: 900 }]) for (const lang of ['fr', 'en']) {
    const fr = lang === 'fr';
    const name = `${lang}-${viewport.width}x${viewport.height}`;
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [], missing = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) missing.push(`${response.status()} ${response.url()}`); });
    await context.route('https://multiverse.test/**', async route => {
      const pathname = new URL(route.request().url()).pathname;
      if (/\.(webp|png|jpe?g|gif|svg)$/iu.test(pathname)) return route.fulfill({ contentType: 'image/svg+xml', body: syntheticArt });
      const file = resolve(fixture, '.' + pathname);
      const rel = relative(fixture, file);
      if (rel === '..' || rel.startsWith('..' + sep)) return route.fulfill({ status: 403, body: 'Outside fixture' });
      try { await route.fulfill({ body: await readFile(file), contentType: ({ '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' })[extname(file)] || 'application/octet-stream' }); }
      catch { await route.fulfill({ status: 404, body: 'Missing fixture resource' }); }
    });
    await context.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//u, route => route.abort());
    await page.addInitScript(({ displayKey, audioKey }) => {
      localStorage.setItem(displayKey, JSON.stringify({ version: 1, textScale: 1, hudScale: 1.4, safeArea: 32, contrast: 'high', motion: 'reduced' }));
      localStorage.setItem(audioKey, JSON.stringify({ musicVolume: 0, sfxVolume: 0, muted: true }));
    }, { displayKey: DISPLAY_PREFERENCES_KEY, audioKey: AUDIO_PREFERENCES_KEY });
    const record = { name, viewport, lang, status: 'running', limitations: 'Actual UniverseArchiveReader, catalogues, modal lifecycle and display settings. Synthetic dense records (61 per group, 62 arcs), parent progression and media. No production lore verification, reward mutation, screen-reader session or artwork acceptance is claimed.' };
    results.push(record);
    try {
      await page.goto(`https://multiverse.test/scripts/fixtures/universe-archive.html?lang=${lang}`);
      await page.waitForFunction(() => window.__archiveQA.state && getComputedStyle(document.documentElement).fontSize === '16px');
      const original = await page.evaluate(() => ({ progress: window.__archiveQA.state.progress, source: window.__archiveQA.state.source }));
      const trigger = page.getByTestId('open-archive');
      const root = page.locator('.universe-archive-reader');
      const close = root.locator('[data-archive-close]');
      await trigger.focus(); await page.keyboard.press('Enter'); await root.waitFor(); await focused(close); await frames(page);
      assert.equal(await page.locator('#root').evaluate(node => node.inert), true);
      const before = await fonts(root);
      await page.keyboard.press('Escape'); await root.waitFor({ state: 'detached' }); await focused(trigger);
      await page.locator('.game-system-trigger').click();
      await page.getByLabel(fr ? 'Taille du texte' : 'Text size').focus();
      await page.keyboard.press('End');
      await page.waitForFunction(() => getComputedStyle(document.documentElement).fontSize === '24px');
      await page.keyboard.press('Escape'); await page.getByRole('dialog').waitFor({ state: 'detached' });
      await page.waitForFunction(() => !document.getElementById('root').inert);
      await trigger.focus(); await page.keyboard.press('Enter'); await root.waitFor(); await focused(close); await frames(page);
      const after = await fonts(root);
      assert.equal(before.length, after.length);
      before.forEach((font, index) => assert.ok(Math.abs(after[index].size / font.size - 1.5) < .01, `Text scale ignored: ${font.text}: ${font.size} → ${after[index].size}`));
      record.fonts = { before, after };
      await inspectLayout(root, viewport, record, 'overviewLayout');
      await page.screenshot({ path: resolve(evidence, `${name}-overview.png`), fullPage: false });

      // Focus wraps inside the reader; the original trigger stays inert.
      await close.focus(); await page.keyboard.press('Shift+Tab');
      const last = root.locator('[data-archive-catalog="enemies"] [data-archive-pagination="bottom"] button').last();
      await focused(last); await page.keyboard.press('Tab'); await focused(close);
      const signatures = root.locator('#universe-archive-tab-signatures');
      await signatures.focus(); await page.keyboard.press('End');
      await focused(root.locator('#universe-archive-tab-missions'));
      assert.equal(await root.locator('[data-archive-section="missions"]').count(), 1);
      await page.keyboard.press('Home'); await focused(signatures);
      await page.keyboard.press('ArrowLeft'); await focused(root.locator('#universe-archive-tab-missions'));
      await page.keyboard.press('ArrowRight'); await focused(signatures);

      record.catalogues = [];
      for (const [chapter, id, target, total] of catalogues) {
        await root.locator(`#universe-archive-tab-${chapter}`).click();
        const group = root.locator(`[data-archive-catalog="${id}"]`);
        const search = group.getByRole('searchbox');
        const size = group.getByRole('combobox');
        const lastPage = group.locator('[data-archive-pagination="top"]').getByRole('button', { name: fr ? 'Dernière page' : 'Last page', exact: true });
        assert.equal((await entryIds(group)).length, 24);
        await lastPage.click(); await focused(group.locator('h3'));
        await page.keyboard.press('Tab'); await focused(search);
        assert.equal((await entryIds(group)).length, total - 48);
        assert.ok((await entryIds(group)).includes(target));
        await search.fill(target);
        assert.deepEqual(await entryIds(group), [target]);
        await focused(search);
        await search.fill('zz-absent-record');
        assert.deepEqual(await entryIds(group), []);
        assert.ok((await group.locator('.universe-archive-empty').textContent()).includes(fr ? 'Aucun résultat' : 'No results'));
        await group.locator('.universe-archive-clear').click(); await focused(search);
        assert.equal((await entryIds(group)).length, 24);
        await size.focus(); await size.selectOption('12'); await focused(size);
        assert.equal((await entryIds(group)).length, 12);
        await lastPage.click(); await focused(group.locator('h3'));
        assert.equal((await entryIds(group)).length, total - 60);
        await size.focus(); await size.selectOption('48'); await focused(size);
        assert.equal((await entryIds(group)).length, 48);
        await search.fill(target);
        assert.deepEqual(await entryIds(group), [target]);
        record.catalogues.push({ id, total, target, pageSizes: [12, 24, 48], reachable: true, searchAndRecovery: true });
        if (['heroes', 'world-items', 'missions'].includes(id)) {
          await group.locator('h3').scrollIntoViewIfNeeded();
          await inspectLayout(root, viewport, record, `${id}Layout`);
          await page.screenshot({ path: resolve(evidence, `${name}-${id}.png`), fullPage: false });
          await group.locator('[data-archive-entry]').first().scrollIntoViewIfNeeded();
          await page.screenshot({ path: resolve(evidence, `${name}-${id}-entry.png`), fullPage: false });
        }
      }
      assert.ok((await root.locator('[data-archive-catalog="missions"]').textContent()).includes(fr ? 'Lecture du registre' : 'Read the ledger'));
      // A query for derived/source lore must work beyond the original 24 DOM nodes.
      await root.locator('#universe-archive-tab-signatures').click();
      const heroSearch = root.locator('[data-archive-catalog="heroes"]').getByRole('searchbox');
      assert.equal(await heroSearch.inputValue(), 'qa-hero-61');
      await heroSearch.fill(fr ? 'témoignage memoire-zenith' : 'account zenith-memory');
      assert.deepEqual(await entryIds(root.locator('[data-archive-catalog="heroes"]')), ['qa-hero-61']);

      const wardrobe = root.locator('[data-archive-catalog="enemies"] .character-wardrobe');
      await wardrobe.locator(':scope > summary').click();
      const effectsCategory = wardrobe.getByRole('button', { name: fr ? 'Effets disponibles' : 'Available effects' });
      const officialCategory = wardrobe.getByRole('button', { name: fr ? 'Officiels' : 'Official' });
      await effectsCategory.click();
      record.wardrobeSelection = { afterClick: await wardrobeCategoryState(wardrobe) };
      assert.equal(await wardrobe.getByText(fr ? 'Consultation uniquement — pas de sélection de skin ennemi' : 'Read only — no enemy skin selection', { exact: true }).count(), 3);
      assert.equal(await wardrobe.getByRole('button', { name: fr ? 'Équiper l’effet' : 'Equip effect', exact: true }).count(), 0);
      assert.equal(await effectsCategory.getAttribute('aria-pressed'), 'true', 'Visible effects must own the selected category');
      assert.equal(await officialCategory.getAttribute('aria-pressed'), 'false', 'Official category must be unselected while effects are visible');
      assert.equal((await effectsCategory.locator('span').textContent()).trim(), '3', 'Effects category count must match its three read-only cards');
      // Capture the committed selection independently of the pointer hover and
      // retain both DOM/style receipts if painting disagrees with the contents.
      await page.mouse.move(viewport.width - 1, viewport.height - 1); await frames(page);
      record.wardrobeSelection.afterPaint = await wardrobeCategoryState(wardrobe);
      assert.deepEqual(record.wardrobeSelection.afterPaint.map(category => category.pressed), record.wardrobeSelection.afterClick.map(category => category.pressed));
      const selectedCategories = record.wardrobeSelection.afterPaint.filter(category => category.pressed === 'true');
      assert.equal(selectedCategories.length, 1, 'Wardrobe must have exactly one selected category');
      assert.ok(record.wardrobeSelection.afterPaint.every(category => !category.hovered), 'Wardrobe capture still contains a hover state');
      assert.ok(record.wardrobeSelection.afterPaint.filter(category => category.pressed !== 'true').every(category => category.background !== selectedCategories[0].background), 'Selected wardrobe category has no distinct background');
      record.wardrobeFonts = await wardrobe.locator('h5, .character-wardrobe__badge, .character-wardrobe__muted').evaluateAll(nodes => nodes.filter(node => node.getClientRects().length).map(node => parseFloat(getComputedStyle(node).fontSize)));
      assert.ok(record.wardrobeFonts.every(size => size >= 19.1), 'Expanded wardrobe text must follow the 150% reading size');
      await inspectLayout(root, viewport, record, 'wardrobeLayout');
      await page.screenshot({ path: resolve(evidence, `${name}-wardrobe.png`), fullPage: false });
      await wardrobe.locator(':scope > summary').click();

      await root.locator('#universe-archive-tab-items').click();
      await root.locator('[data-archive-neighbour="1"]').click(); await focused(root.locator('#universe-archive-title'));
      assert.equal(await root.locator('[data-archive-section="items"]').count(), 1);
      assert.equal(await root.locator('[data-archive-entry]').count(), 0);
      assert.equal(await root.locator('[data-archive-catalog="relics"]').getByRole('searchbox').inputValue(), '');
      assert.equal(await root.locator('[data-archive-neighbour="1"]').isDisabled(), true);
      await root.locator('[data-archive-neighbour="-1"]').click(); await focused(root.locator('#universe-archive-title'));
      const restoredRelics = root.locator('[data-archive-catalog="relics"]');
      assert.equal(await restoredRelics.getByRole('searchbox').inputValue(), 'qa-relic-61');
      assert.equal(await restoredRelics.getByRole('combobox').inputValue(), '48');
      assert.deepEqual(await entryIds(restoredRelics), ['qa-relic-61']);
      await root.locator('#universe-archive-tab-world').click();
      const world = root.locator('[data-archive-section="world"]');
      await world.getByText(fr ? 'Dernière notice du monde vivant.' : 'Last living-world record.', { exact: true }).scrollIntoViewIfNeeded();
      await inspectLayout(root, viewport, record, 'worldLayout');
      await page.screenshot({ path: resolve(evidence, `${name}-world.png`), fullPage: false });
      await root.locator('[data-archive-neighbour="1"]').click(); await focused(root.locator('#universe-archive-title'));
      assert.equal(await root.locator('[data-archive-section="signatures"]').count(), 1, 'Missing living-world chapter must fall back');
      await root.locator('[data-archive-neighbour="-1"]').click(); await focused(root.locator('#universe-archive-title'));
      await root.locator('.universe-archive-lore > summary').click();
      assert.equal(await root.locator('.universe-archive-lore').evaluate(node => node.open), true);
      const lore = await root.locator('.universe-archive-lore').evaluate(node => ({ height: node.clientHeight, scrollHeight: node.scrollHeight, overflow: getComputedStyle(node).overflowY }));
      assert.ok(lore.scrollHeight <= lore.height + 1 && lore.overflow !== 'auto', 'Lore must share the main reading scroll');
      await inspectLayout(root, viewport, record, 'loreLayout');
      await page.keyboard.press('Escape'); await root.waitFor({ state: 'detached' }); await frames(page); await focused(trigger);
      assert.equal(await page.locator('#root').evaluate(node => node.inert), false);
      assert.equal(await page.evaluate(() => document.body.style.overflow), '');
      assert.deepEqual(await page.evaluate(() => ({ progress: window.__archiveQA.state.progress, source: window.__archiveQA.state.source })), original);
      assert.deepEqual(errors, []); assert.deepEqual(missing, []);
      record.status = 'passed';
    } catch (error) {
      record.status = 'failed'; record.error = error.stack || String(error);
      await page.screenshot({ path: resolve(evidence, `${name}-failure.png`), fullPage: false }).catch(() => {});
    } finally {
      record.pageErrors = errors; record.missing = missing;
      await writeFile(resolve(evidence, 'results.json'), JSON.stringify(results, null, 2));
      await context.close();
    }
    console.log(`${name}: ${record.status}${record.error ? ` — ${record.error.split('\n')[0]}` : ''}`);
  }
} finally { await browser.close(); }
assert.equal(results.filter(result => result.status === 'passed').length, 6, 'All six archive language/viewport cases must pass');
