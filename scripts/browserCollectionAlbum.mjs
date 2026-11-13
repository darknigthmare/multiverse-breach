import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, relative, resolve, sep } from 'node:path';
import { DISPLAY_PREFERENCES_KEY } from '../src/game/displayPreferences.js';
import { AUDIO_PREFERENCES_KEY } from '../src/game/audioPreferences.js';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const fixture = resolve(process.env.PLAYWRIGHT_FIXTURE_DIR || '.tmp/collection-album');
const evidence = resolve(process.env.PLAYWRIGHT_EVIDENCE_DIR || '.tmp/collection-album-evidence');
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'], executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
const results = [];
const focused = async locator => {
  const element = await locator.elementHandle();
  try { await locator.page().waitForFunction(node => document.activeElement === node, element); }
  finally { await element.dispose(); }
};
const settledFrame = page => page.evaluate(() => new Promise(resolveFrame => requestAnimationFrame(() => requestAnimationFrame(resolveFrame))));
const fontsOf = root => root.locator('#tcg-album-title, .tcg-album-header > div > span, .tcg-close-button, .tcg-album-stats span, .tcg-album-stats strong, .tcg-album-tabs button, .tcg-filter-drawer > summary, .tcg-album-toolbar input[type="search"], .tcg-album-toolbar select, #tcg-library-title, .tcg-universe-tile strong').evaluateAll(nodes => nodes.map(node => ({
  text: node.textContent.slice(0, 60), size: parseFloat(getComputedStyle(node).fontSize)
})));
const filtersOf = root => root.evaluate(node => ({
  query: node.querySelector('input[type="search"]').value,
  selects: [...node.querySelectorAll('.tcg-album-toolbar select')].map(select => select.value),
  checks: [...node.querySelectorAll('.tcg-album-toolbar input[type="checkbox"]')].map(input => input.checked),
  open: node.querySelector('.tcg-filter-drawer').open
}));
const collectionOf = page => page.evaluate(() => window.__collectionAlbumQA.collection);
const inspectLayout = async (root, viewport, detail = false) => {
  const geometry = await root.evaluate(node => {
    const rect = node.getBoundingClientRect();
    const areas = [node, ...node.querySelectorAll('.tcg-album-header, .tcg-album-workspace, .tcg-album-content, .tcg-album-toolbar, .tcg-album-tabs, .tcg-universe-grid, .tcg-card-grid, .tcg-milestone-list, .tcg-opening-history, .tcg-card-detail-layout, .tcg-card-detail-copy')]
      .filter(area => area.getClientRects().length)
      .map(area => ({ name: area.className, width: area.clientWidth, scrollWidth: area.scrollWidth, height: area.clientHeight }));
    const controls = [...node.querySelectorAll('button, input:not([type="checkbox"]), select, summary, .tcg-toggle')]
      .filter(control => control.getClientRects().length && !control.closest('[hidden]'))
      .map(control => { const r = control.getBoundingClientRect(); return { label: control.getAttribute('aria-label') || control.textContent.slice(0, 80), x: r.x, right: r.right, width: r.width, height: r.height }; });
    return { x: rect.x, y: rect.y, right: rect.right, bottom: rect.bottom, areas, controls };
  });
  for (const area of geometry.areas) assert.ok(area.scrollWidth <= area.width + 1, `${area.name} requires horizontal scrolling: ${JSON.stringify(area)}`);
  for (const control of geometry.controls) {
    assert.ok(control.width >= 43 && control.height >= 43, `small control ${JSON.stringify(control)}`);
    assert.ok(control.x >= 31 && control.right <= viewport.width - 31, `control escaped 32px safe area ${JSON.stringify(control)}`);
  }
  if (detail) {
    assert.ok(geometry.x >= 31 && geometry.y >= 31 && geometry.right <= viewport.width - 31 && geometry.bottom <= viewport.height - 31, `card record escaped safe area ${JSON.stringify(geometry)}`);
  } else {
    const workspace = geometry.areas.find(area => area.name === 'tcg-album-workspace');
    assert.ok(workspace.height >= 120, `album reading surface collapsed: ${workspace.height}`);
  }
  return geometry;
};
const assertWrappedText = async locator => {
  const geometry = await locator.evaluate(node => {
    const range = document.createRange(); range.selectNodeContents(node);
    const bounds = node.getBoundingClientRect();
    return { text: node.textContent, left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom,
      lines: [...range.getClientRects()].map(rect => ({ left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom })) };
  });
  assert.ok(geometry.lines.length > 0, 'long card title has no rendered text');
  for (const line of geometry.lines) assert.ok(line.left >= geometry.left - 1 && line.right <= geometry.right + 1 && line.top >= geometry.top - 1 && line.bottom <= geometry.bottom + 1, `clipped title ${JSON.stringify(geometry)}`);
  return geometry;
};

try {
  for (const viewport of [{ width: 390, height: 844 }, { width: 844, height: 390 }, { width: 1365, height: 900 }]) for (const lang of ['fr', 'en']) {
    const name = `${viewport.width}x${viewport.height}-${lang}`;
    const fr = lang === 'fr';
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    const errors = [], missing = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) missing.push(`${response.status()} ${response.url()}`); });
    await context.route('http://multiverse.test/**', async route => {
      const file = resolve(fixture, '.' + new URL(route.request().url()).pathname);
      const rel = relative(fixture, file);
      if (rel === '..' || rel.startsWith('..' + sep)) return route.fulfill({ status: 403, body: 'Outside fixture' });
      try { await route.fulfill({ body: await readFile(file), contentType: ({ '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' })[extname(file)] || 'application/octet-stream' }); }
      catch { await route.fulfill({ status: 404, body: 'Missing fixture resource' }); }
    });
    await context.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, route => route.abort());
    await page.addInitScript(({ displayKey, audioKey }) => {
      localStorage.setItem(displayKey, JSON.stringify({ version: 1, textScale: 1, hudScale: 1.4, safeArea: 32, contrast: 'high', motion: 'reduced' }));
      localStorage.setItem(audioKey, JSON.stringify({ musicVolume: 0, sfxVolume: 0, muted: true }));
    }, { displayKey: DISPLAY_PREFERENCES_KEY, audioKey: AUDIO_PREFERENCES_KEY });
    const record = { name, viewport, lang, status: 'running', catalogue: { cards: 132, universes: 25 }, limitations: 'Real album, binder, card record, filtering, preferences and milestone guard; synthetic catalogue, artwork and parent collection. No production reward delivery, purchase, cloud or artwork validation.' };
    results.push(record);
    try {
      await page.goto(`http://multiverse.test/scripts/fixtures/collection-album.html?lang=${lang}`);
      await page.waitForFunction(() => window.__collectionAlbumQA.collection && getComputedStyle(document.documentElement).fontSize === '16px');
      const initialCollection = await collectionOf(page);
      const openAlbum = page.getByTestId('open-album');
      const album = page.locator('.tcg-album');
      const closeAlbum = album.locator('.tcg-album-header > .tcg-close-button');
      await openAlbum.focus(); await page.keyboard.press('Enter'); await album.waitFor(); await focused(closeAlbum);
      await settledFrame(page);
      const before = await fontsOf(album);
      await page.keyboard.press('Escape'); await album.waitFor({ state: 'detached' }); await focused(openAlbum);
      await page.locator('.game-system-trigger').click();
      await page.getByLabel(fr ? 'Taille du texte' : 'Text size').focus(); await page.keyboard.press('End');
      await page.waitForFunction(() => getComputedStyle(document.documentElement).fontSize === '24px');
      await page.keyboard.press('Escape'); await page.getByRole('dialog').waitFor({ state: 'detached' });
      await page.waitForFunction(() => !document.getElementById('root').inert);
      await openAlbum.focus(); await page.keyboard.press('Enter'); await album.waitFor(); await focused(closeAlbum);
      await settledFrame(page);
      const after = await fontsOf(album);
      record.textScale = { before, after };
      assert.equal(before.length, after.length);
      before.forEach((font, index) => assert.ok(Math.abs(after[index].size / font.size - 1.5) < .01, `text scale ignored: ${font.text} ${font.size} -> ${after[index].size}`));
      record.libraryLayout = await inspectLayout(album, viewport);
      assert.equal(await album.locator('.tcg-universe-tile').count(), 26);
      await closeAlbum.focus(); await page.keyboard.press('Shift+Tab'); await focused(album.locator('.tcg-universe-tile').last());
      await page.keyboard.press('Tab'); await focused(closeAlbum);

      const tabs = album.getByRole('tab');
      const chooseView = async index => {
        await tabs.nth(index).focus(); await page.keyboard.press('Enter');
        await page.waitForFunction(selected => document.querySelectorAll('.tcg-album-tabs button')[selected].getAttribute('aria-selected') === 'true', index);
        assert.equal(await album.getByRole('tabpanel').count(), 1, 'inactive views stay hidden from the accessibility tree');
      };
      assert.equal(await tabs.count(), 3);
      assert.equal(await album.locator('[role="tab"][tabindex="0"]').count(), 1);
      assert.equal(await tabs.evaluateAll(nodes => nodes.every(node => {
        const panel = document.getElementById(node.getAttribute('aria-controls'));
        return panel?.getAttribute('role') === 'tabpanel' && panel.getAttribute('aria-labelledby') === node.id;
      })), true, 'every tab names its retained panel');
      await tabs.nth(0).focus();
      for (const [key, expected] of [['ArrowLeft', 2], ['ArrowRight', 0], ['End', 2], ['Home', 0], ['ArrowRight', 1], ['Home', 0]]) {
        await page.keyboard.press(key);
        await page.waitForFunction(index => document.querySelectorAll('.tcg-album-tabs button')[index].getAttribute('aria-selected') === 'true', expected);
        await focused(tabs.nth(expected));
      }
      const query = fr ? 'eclaireuse' : 'pathfinder';
      const search = album.getByRole('searchbox');
      const rarity = album.getByRole('combobox', { name: fr ? 'RARETE' : 'RARITY', exact: true });
      const kind = album.getByRole('combobox', { name: 'TYPE', exact: true });
      const canon = album.getByRole('combobox', { name: 'CANON', exact: true });
      const owned = album.getByRole('checkbox', { name: fr ? 'OBTENUES' : 'OWNED', exact: true });
      const favorites = album.getByRole('checkbox', { name: fr ? 'FAVORIS' : 'FAVORITES', exact: true });
      await search.fill(query); await rarity.selectOption('rare'); await kind.selectOption('archive'); await canon.selectOption('canon');
      await owned.check(); await favorites.check();
      await page.waitForFunction(() => document.querySelectorAll('.tcg-universe-tile').length === 2);
      assert.equal((await album.locator('.tcg-filter-drawer > summary span').textContent()).trim(), fr ? '1 cartes' : '1 cards');
      await album.locator('.tcg-filter-drawer > summary').click(); await settledFrame(page);
      const savedFilters = await filtersOf(album);
      assert.equal(savedFilters.open, false);
      await chooseView(2);
      assert.equal(await album.locator('.tcg-filter-drawer').count(), 0, 'card filters have no misleading scope in history');
      assert.equal(await album.locator('.tcg-opening-history li').count(), 100);
      await chooseView(0);
      assert.deepEqual(await filtersOf(album), savedFilters, 'remounting the filters after history retains every filter and disclosure state');
      await album.locator('.tcg-filter-drawer > summary').click();
      const nexusTile = album.locator('.tcg-universe-tile').filter({ hasText: 'Nexus de Convergence' });
      await nexusTile.focus(); await page.keyboard.press('Enter');
      await focused(album.getByRole('tabpanel'));
      assert.equal((await album.locator('#tcg-binder-title').textContent()).trim(), 'Nexus de Convergence');
      assert.equal((await album.locator('.tcg-milestones > div:first-child > strong').textContent()).trim(), '30/36', 'completion is based on the full set despite one matching card');
      assert.equal(await album.locator('.tcg-card-grid > .tcg-card').count(), 1);
      const firstMilestone = album.locator('.tcg-milestone-list button').first();
      await firstMilestone.focus(); await page.keyboard.press('Enter');
      await page.waitForFunction(() => window.__collectionAlbumQA.collection.setProgress['qa-album-set-0']?.claimedMilestones.includes(10));
      await focused(album.locator('#tcg-milestones-title'));
      assert.equal(await firstMilestone.isDisabled(), true);
      assert.equal(await album.locator('.tcg-milestone-list button').nth(4).isDisabled(), true, '90% remains locked');
      record.claims = await page.evaluate(() => window.__collectionAlbumQA.claims);
      assert.deepEqual(record.claims, [{ setId: 'qa-album-set-0', milestone: 10, claimed: true }]);

      await rarity.selectOption('all'); await kind.selectOption('all'); await canon.selectOption('all');
      await owned.uncheck(); await favorites.uncheck(); await search.fill('');
      await page.waitForFunction(() => document.querySelectorAll('.tcg-card-grid > .tcg-card').length === 12);
      const nextPage = album.locator('[data-pagination-position="top"]').getByRole('button', { name: fr ? 'PAGE SUIVANTE' : 'NEXT PAGE', exact: true });
      for (const pageNumber of [2, 3]) {
        await nextPage.focus(); await page.keyboard.press('Enter');
        await focused(album.locator('#tcg-binder-title'));
        assert.ok((await album.locator('.tcg-binder-range').textContent()).includes(`Page ${pageNumber}`));
      }
      assert.equal(await nextPage.isDisabled(), true);
      assert.equal(await album.locator('.tcg-card-grid > [data-card-owned="false"]').count(), 6);
      assert.equal(await album.locator('.tcg-card-grid > [data-card-owned="false"] img').count(), 0, 'unknown cards do not expose artwork');
      for (const viewIndex of [2, 1, 0, 1]) {
        await chooseView(viewIndex);
        if (viewIndex === 1) {
          assert.ok((await album.locator('.tcg-binder-range').textContent()).includes('Page 3'), 'view changes preserve the current binder page');
          assert.equal(await album.locator('.tcg-card-grid > .tcg-card').first().getAttribute('data-card-id'), 'qa-album-0-25');
        }
      }
      record.pageRestoredAfterViews = 3;
      const card = album.locator('.tcg-card-grid > [data-card-id="qa-album-0-25"]');
      await card.locator('.tcg-card-copy strong').scrollIntoViewIfNeeded();
      record.cardTitle = await assertWrappedText(card.locator('.tcg-card-copy strong'));
      record.binderLayout = await inspectLayout(album, viewport);
      await page.screenshot({ path: resolve(evidence, `${name}-binder.png`) });
      await card.focus(); await page.keyboard.press('Enter');
      const detail = page.locator('.tcg-card-detail');
      const detailClose = detail.locator('.tcg-card-detail-header > .tcg-close-button');
      const favoriteButton = detail.locator('.tcg-favorite-button');
      await detail.waitFor(); await focused(detailClose);
      assert.equal(await album.evaluate(node => Boolean(node.closest('[inert]'))), true);
      await page.waitForFunction(() => window.__collectionAlbumQA.collection.cards['qa-album-0-25'].seen === true);
      await page.keyboard.press('Shift+Tab'); await focused(favoriteButton);
      await page.keyboard.press('Tab'); await focused(detailClose);
      await detail.locator('.tcg-card-provenance > summary').focus(); await page.keyboard.press('Enter');
      await detail.locator('.tcg-card-detail-copy h2').scrollIntoViewIfNeeded();
      record.detailTitle = await assertWrappedText(detail.locator('.tcg-card-detail-copy h2'));
      record.detailLayout = await inspectLayout(detail, viewport, true);
      await page.screenshot({ path: resolve(evidence, `${name}-record.png`) });
      await page.keyboard.press('Escape'); await detail.waitFor({ state: 'detached' }); await focused(card);
      assert.equal(await album.isVisible(), true, 'closing the record leaves the album open');
      assert.deepEqual((await collectionOf(page)).cards['qa-album-0-25'], { ...initialCollection.cards['qa-album-0-25'], seen: true });

      // The favorite tile is deliberately removed behind its open modal. The
      // original focus target cannot be restored, so the binder must receive it.
      await search.fill(query); await favorites.check();
      await page.waitForFunction(() => document.querySelectorAll('.tcg-card-grid > .tcg-card').length === 1);
      assert.ok((await album.locator('.tcg-binder-range').textContent()).includes('Page 1'), 'changing filters resets the binder page');
      await card.focus(); await page.keyboard.press('Enter'); await detail.waitFor(); await focused(detailClose);
      await favoriteButton.focus(); await page.keyboard.press('Enter');
      await page.waitForFunction(() => window.__collectionAlbumQA.collection.cards['qa-album-0-25'].favorite === false);
      await page.keyboard.press('Escape'); await detail.waitFor({ state: 'detached' }); await focused(album.locator('#tcg-binder-title'));
      assert.equal(await album.locator('.tcg-card-grid > .tcg-card').count(), 0);
      assert.equal(await album.locator('.tcg-binder > .tcg-empty-state').isVisible(), true);
      record.missingTriggerFocus = await page.evaluate(() => document.activeElement.id);
      await favorites.uncheck(); await card.waitFor();
      await card.focus(); await page.keyboard.press('Enter'); await detail.waitFor(); await focused(detailClose);
      await favoriteButton.focus(); await page.keyboard.press('Enter');
      await page.waitForFunction(() => window.__collectionAlbumQA.collection.cards['qa-album-0-25'].favorite === true);
      await page.keyboard.press('Escape'); await detail.waitFor({ state: 'detached' }); await focused(card);
      await album.locator('.tcg-library-return').focus(); await page.keyboard.press('Enter'); await focused(nexusTile);
      assert.equal(await search.inputValue(), query, 'returning to the library preserves search');
      await chooseView(2);
      const historyRows = album.locator('.tcg-opening-history li');
      assert.equal(await historyRows.count(), 100);
      assert.equal((await historyRows.first().locator('strong').textContent()).trim(), 'Archive historique 1');
      assert.equal((await historyRows.last().locator('strong').textContent()).trim(), 'Archive historique 100');
      assert.ok((await historyRows.last().locator('small').textContent()).includes('Booster de vérification'));
      await album.locator('#tcg-history-title').scrollIntoViewIfNeeded();
      record.historyLayout = await inspectLayout(album, viewport);
      await page.screenshot({ path: resolve(evidence, `${name}-history.png`) });
      await page.keyboard.press('Escape'); await album.waitFor({ state: 'detached' }); await focused(openAlbum);

      const finalCollection = await collectionOf(page);
      assert.deepEqual(finalCollection, {
        ...initialCollection,
        cards: { ...initialCollection.cards, 'qa-album-0-25': { ...initialCollection.cards['qa-album-0-25'], seen: true } },
        setProgress: { 'qa-album-set-0': { claimedMilestones: [10] } }
      }, 'only the requested seen/favorite/milestone changes reach the parent collection');
      await openAlbum.focus(); await page.keyboard.press('Enter'); await album.waitFor(); await focused(closeAlbum);
      assert.deepEqual(await filtersOf(album), { query: '', selects: ['all', 'all', 'all'], checks: [false, false], open: true }, 'local view filters retain their existing reset on closing and reopening the album');
      await nexusTile.focus(); await page.keyboard.press('Enter'); await focused(album.getByRole('tabpanel'));
      assert.equal(await album.locator('.tcg-milestone-list button').first().isDisabled(), true, 'claimed milestone is restored from the parent after remount');
      assert.equal((await collectionOf(page)).cards['qa-album-0-25'].favorite, true);
      await page.keyboard.press('Escape'); await album.waitFor({ state: 'detached' }); await focused(openAlbum);
      record.updates = await page.evaluate(() => window.__collectionAlbumQA.updates);
      record.filtersRestoredAfterHistory = savedFilters;
      record.errors = errors; record.missing = missing;
      assert.deepEqual(errors, []); assert.deepEqual(missing, []);
      record.status = 'passed';
    } catch (error) {
      record.status = 'failed'; record.error = error.stack || error.message; record.errors = errors; record.missing = missing;
      await page.screenshot({ path: resolve(evidence, `${name}-failure.png`) }).catch(() => {});
    } finally { await context.close(); }
  }
} finally {
  await writeFile(resolve(evidence, 'results.json'), JSON.stringify({ browser: browser.version(), results }, null, 2));
  await browser.close();
}
const passed = results.filter(result => result.status === 'passed').length;
console.log(JSON.stringify({ passed, total: results.length, evidence, results: results.map(({ name, status, error }) => ({ name, status, error })) }, null, 2));
assert.equal(passed, 6, 'all six collection album journeys must pass');
