import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, relative, resolve, sep } from 'node:path';
import { DISPLAY_PREFERENCES_KEY } from '../src/game/displayPreferences.js';
import { AUDIO_PREFERENCES_KEY } from '../src/game/audioPreferences.js';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const fixture = resolve(process.env.PLAYWRIGHT_FIXTURE_DIR || '.tmp/portal-dense-catalogs');
const evidence = resolve(process.env.PLAYWRIGHT_EVIDENCE_DIR || '.tmp/portal-dense-catalogs-evidence');
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'], executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
const results = [];
const syntheticArt = '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="960"><rect width="640" height="960" fill="#14313c"/><path d="M320 150 520 480 320 810 120 480Z" fill="#47ad9c"/><circle cx="320" cy="480" r="90" fill="#e2c581"/></svg>';
const frames = page => page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))));
const focused = async locator => {
  const element = await locator.elementHandle();
  try { await locator.page().waitForFunction(node => document.activeElement === node, element); }
  finally { await element.dispose(); }
};
const stateOf = page => page.evaluate(() => window.__portalCatalogQA.state);
const pagingOf = async root => {
  const text = await root.locator('[data-pagination-position="top"] .portal-catalog-range').textContent();
  const match = text.match(/(\d+)–(\d+) \/ (\d+) · Page (\d+) \/ (\d+)/u);
  assert.ok(match, `Missing readable page range: ${text}`);
  return Object.fromEntries(['start', 'end', 'total', 'page', 'pageCount'].map((key, index) => [key, Number(match[index + 1])]));
};
const fontsOf = (root, surface) => root.locator(surface === 'portal'
  ? '.archive-drawer-header h2, .archive-drawer-header button, .booster-section-kicker, .booster-catalog-count, .booster-pack-search input, .portal-catalog-scope label, .portal-catalog-scope select, .portal-catalog-scope p, .booster-rotation-strip span, .booster-rotation-strip strong, .booster-rotation-strip p, .booster-rotation-strip em, .portal-catalog-group > summary, .portal-catalog-range, .portal-page-size, .portal-page-size select, .portal-catalog-page-buttons button, .portal-booster-kicker, .portal-booster-title, .portal-booster-desc, .portal-booster-meta, .portal-booster-art-badge, .portal-booster-preview-label'
  : '#booster-dossier-title, .booster-art-preview-close, .booster-dossier-content h2, .booster-dossier-content h3, .booster-dossier-content h4, .booster-dossier-content p, .booster-dossier-content small, .booster-dossier-content input, .booster-dossier-content select, .booster-dossier-content button, .portal-focus-stats span, .portal-rate-grid span')
  .evaluateAll(nodes => nodes.filter(node => node.getClientRects().length).map(node => ({ text: node.textContent.slice(0, 80), size: Number.parseFloat(getComputedStyle(node).fontSize) })));
const inspectLayout = async (root, viewport, surface) => {
  const geometry = await root.evaluate(node => {
    const areas = [node, ...node.querySelectorAll('header, .archive-drawer-content, .portal-catalog-scope, .portal-catalog-group, .booster-catalog-grid, .portal-catalog-pager, .booster-dossier-content, .booster-dossier-intro, .booster-dossier-filters, .booster-reward-manifest-grid')]
      .filter(area => area.getClientRects().length)
      .map(area => ({ name: area.className || area.tagName, width: area.clientWidth, scrollWidth: area.scrollWidth, height: area.clientHeight }));
    const controls = [...node.querySelectorAll('button, input, select, summary')].filter(control => control.getClientRects().length)
      .map(control => { const r = control.getBoundingClientRect(); return { name: control.getAttribute('aria-label') || control.textContent.slice(0, 80), x: r.x, right: r.right, width: r.width, height: r.height }; });
    const close = node.querySelector('.archive-drawer-header button, .booster-art-preview-close').getBoundingClientRect();
    return { areas, controls, close: { top: close.top, bottom: close.bottom } };
  });
  for (const area of geometry.areas) assert.ok(area.scrollWidth <= area.width + 1, `Horizontal clipping: ${JSON.stringify(area)}`);
  for (const control of geometry.controls) {
    assert.ok(control.width >= 43 && control.height >= 43, `Small target: ${JSON.stringify(control)}`);
    assert.ok(control.x >= 31 && control.right <= viewport.width - 31, `Control escaped 32px safe area: ${JSON.stringify(control)}`);
  }
  const reading = geometry.areas.find(area => area.name === (surface === 'portal' ? 'archive-drawer-content' : 'booster-dossier-content'));
  assert.ok(reading?.height >= 120, `Reading area collapsed: ${JSON.stringify(reading)}`);
  assert.ok(geometry.close.top >= 31 && geometry.close.bottom <= viewport.height - 31, `Close control escaped vertical safe area: ${JSON.stringify(geometry.close)}`);
  return geometry;
};
const assertWrappedText = async locator => {
  const metrics = await locator.evaluate(node => {
    const bounds = node.getBoundingClientRect();
    const range = document.createRange(); range.selectNodeContents(node);
    return { width: bounds.width, height: bounds.height, lines: [...range.getClientRects()].map(r => ({ left: r.left - bounds.left, right: r.right - bounds.left, top: r.top - bounds.top, bottom: r.bottom - bounds.top })) };
  });
  assert.ok(metrics.lines.length, 'No rendered title');
  for (const line of metrics.lines) assert.ok(line.left >= -1 && line.right <= metrics.width + 1 && line.top >= -1 && line.bottom <= metrics.height + 1, `Clipped long title: ${JSON.stringify(metrics)}`);
  return metrics;
};
const changeTextScale = async (page, fr) => {
  await page.locator('.game-system-trigger').click();
  await page.getByLabel(fr ? 'Taille du texte' : 'Text size').focus();
  await page.keyboard.press('End');
  await page.waitForFunction(() => getComputedStyle(document.documentElement).fontSize === '24px');
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'detached' });
  await page.waitForFunction(() => !document.getElementById('root').inert);
};

try {
  for (const viewport of [{ width: 390, height: 844 }, { width: 844, height: 390 }, { width: 1365, height: 900 }]) for (const lang of ['fr', 'en']) for (const surface of ['portal', 'dossier']) {
    const name = `${surface}-${viewport.width}x${viewport.height}-${lang}`;
    const fr = lang === 'fr';
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.setDefaultTimeout(30000);
    const errors = [], missing = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) missing.push(`${response.status()} ${response.url()}`); });
    await context.route('https://multiverse.test/**', async route => {
      const pathname = new URL(route.request().url()).pathname;
      // Production content/code are real. Only media bytes are replaced, visibly
      // synthetic; this recipe makes no artwork/asset-completeness assertion.
      if (/\.(webp|png|jpe?g|gif|svg)$/iu.test(pathname)) return route.fulfill({ contentType: 'image/svg+xml', body: syntheticArt });
      const file = resolve(fixture, '.' + pathname);
      const rel = relative(fixture, file);
      if (rel === '..' || rel.startsWith('..' + sep)) return route.fulfill({ status: 403, body: 'Outside fixture' });
      try { await route.fulfill({ body: await readFile(file), contentType: ({ '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' })[extname(file)] || 'application/octet-stream' }); }
      catch { await route.fulfill({ status: 404, body: 'Missing fixture resource' }); }
    });
    await context.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//u, route => route.abort());
    await page.addInitScript(({ displayKey, audioKey }) => {
      Date.now = () => Date.parse('2026-11-08T00:00:00.000Z');
      localStorage.setItem(displayKey, JSON.stringify({ version: 1, textScale: 1, hudScale: 1.4, safeArea: 32, contrast: 'high', motion: 'reduced' }));
      localStorage.setItem(audioKey, JSON.stringify({ musicVolume: 0, sfxVolume: 0, muted: true }));
    }, { displayKey: DISPLAY_PREFERENCES_KEY, audioKey: AUDIO_PREFERENCES_KEY });
    const record = { name, viewport, lang, surface, status: 'running', limitations: 'Actual portal/catalogue/dossier/preferences and actual production booster data; synthetic media, parent save and standalone 53-card catalogue. Rotation persistence deliberately deferred/failed. No actual purchase, production reward delivery, cloud, screen-reader or artwork validation.' };
    results.push(record);
    try {
      await page.goto(`https://multiverse.test/scripts/fixtures/portal-dense-catalogs.html?lang=${lang}&surface=${surface}`);
      await page.waitForFunction(() => window.__portalCatalogQA.state && getComputedStyle(document.documentElement).fontSize === '16px');
      const trigger = surface === 'portal' ? page.locator('[data-open-booster-catalog]') : page.getByTestId('open-dense-dossier');
      const root = page.locator(surface === 'portal' ? '.portal-catalog-drawer .archive-drawer' : '.booster-dossier-dialog');
      const close = root.locator(surface === 'portal' ? '.archive-drawer-header button' : '.booster-art-preview-close');
      await trigger.focus(); await page.keyboard.press('Enter'); await root.waitFor(); await focused(close); await frames(page);
      const initialState = await stateOf(page);
      const before = await fontsOf(root, surface);
      await page.keyboard.press('Escape'); await root.waitFor({ state: 'detached' }); await focused(trigger);
      await changeTextScale(page, fr);
      await trigger.focus(); await page.keyboard.press('Enter'); await root.waitFor(); await focused(close); await frames(page);
      const after = await fontsOf(root, surface);
      assert.equal(before.length, after.length, 'Font samples changed without content changes');
      before.forEach((font, index) => assert.ok(Math.abs(after[index].size / font.size - 1.5) < .01, `Text scale ignored: ${font.text}: ${font.size} → ${after[index].size}`));
      record.fonts = { before, after };
      record.layout = await inspectLayout(root, viewport, surface);
      await page.screenshot({ path: resolve(evidence, `${name}-overview.png`), fullPage: false });

      if (surface === 'portal') {
        const scope = root.getByRole('combobox', { name: fr ? 'Afficher' : 'Show', exact: true });
        await scope.selectOption('all');
        const group = root.locator('[data-booster-group="franchise"]');
        await group.locator('summary').click();
        await page.waitForFunction(() => document.querySelector('[data-booster-group="franchise"]').open);
        const firstPage = await pagingOf(group);
        assert.ok(firstPage.total > 24, 'Production franchise catalogue must exercise more than two pages');
        assert.equal(await group.locator('[data-preview-booster]').count(), 12);
        const topPager = group.locator('[data-pagination-position="top"]');
        await topPager.getByRole('button', { name: fr ? 'Dernière page' : 'Last page', exact: true }).click();
        await focused(group.locator('summary'));
        if (await group.locator('.portal-booster.unavailable').count() === 0) {
          await topPager.getByRole('button', { name: fr ? 'Page précédente' : 'Previous page', exact: true }).click();
          await focused(group.locator('summary'));
        }
        const savedPage = await pagingOf(group);
        const offRotation = group.locator('.portal-booster.unavailable').last();
        const offId = await offRotation.getAttribute('data-preview-booster');
        await offRotation.focus(); await page.keyboard.press('Enter');
        const dossier = page.locator('.booster-dossier-dialog');
        await dossier.waitFor(); await focused(dossier.locator('.booster-art-preview-close'));
        assert.equal(await root.evaluate(node => Boolean(node.closest('[inert]'))), true, 'Nested dossier must isolate the booster catalogue');
        assert.equal(await dossier.locator('[data-select-previewed-booster]').isDisabled(), true, 'Off-rotation preview cannot select or buy');
        assert.ok((await dossier.textContent()).includes(fr ? 'GARANTIES : 5 cartes' : 'GUARANTEES: 5 cards'));
        assert.ok((await dossier.textContent()).includes('70 %') || (await dossier.textContent()).includes('70%'));
        await page.keyboard.press('Shift+Tab'); await focused(dossier.locator('.booster-dossier-back-to-overview'));
        await page.keyboard.press('Tab'); await focused(dossier.locator('.booster-art-preview-close'));
        record.nestedLayout = await inspectLayout(dossier, viewport, 'dossier');
        await page.screenshot({ path: resolve(evidence, `${name}-preview.png`), fullPage: false });
        await page.keyboard.press('Escape'); await dossier.waitFor({ state: 'detached' }); await focused(offRotation);
        assert.deepEqual(await pagingOf(group), savedPage, 'Closing a dossier must retain its source page');

        const query = root.getByRole('searchbox');
        const universe = offId.replace(/^universe:/u, '');
        await query.fill(universe);
        await page.waitForFunction(id => Boolean(document.querySelector(`[data-preview-booster="${CSS.escape(id)}"]`)), offId);
        assert.equal(await scope.isDisabled(), true, 'Global search explains and locks its all-catalogue scope');
        assert.equal(await pagingOf(group).then(value => value.page), 1, 'Search resets a stale page');
        const searchPreview = group.locator('[data-preview-booster]').filter({ hasText: universe }).first();
        await searchPreview.focus(); await page.keyboard.press('Enter'); await dossier.waitFor();
        await page.keyboard.press('Escape'); await dossier.waitFor({ state: 'detached' }); await focused(searchPreview);
        assert.equal(await query.inputValue(), universe, 'Dossier close preserves the search');
        await root.getByRole('button', { name: fr ? 'Effacer la recherche' : 'Clear search', exact: true }).click();
        await focused(query); assert.equal(await query.inputValue(), '');

        const permanent = root.locator('[data-booster-group="original"] [data-preview-booster]:not(.selected):not(.unavailable)').first();
        const selectedId = await permanent.getAttribute('data-preview-booster');
        await permanent.focus(); await page.keyboard.press('Enter'); await dossier.waitFor();
        await dossier.locator('[data-select-previewed-booster]').click();
        await dossier.waitFor({ state: 'detached' }); await root.waitFor({ state: 'detached' }); await focused(trigger);
        assert.equal(await page.locator('.portal-game-screen').getAttribute('data-pack-id'), selectedId);
        assert.deepEqual(await stateOf(page), initialState, 'Preview, search, pagination and selection must not debit or rewrite progression');

        await trigger.click(); await root.waitFor();
        assert.equal(await scope.inputValue(), 'all', 'Catalogue scope persists across selection');
        const rotate = root.getByRole('button', { name: fr ? 'RENOUVELER LA ROTATION…' : 'REFRESH ROTATION…', exact: true });
        await rotate.focus(); await page.keyboard.press('Enter');
        assert.equal(await page.evaluate(() => window.__portalCatalogQA.rotationRequests.length), 0, 'Opening confirmation must not persist a transaction');
        const confirmation = root.getByRole('group', { name: fr ? 'Confirmer le renouvellement payant' : 'Confirm paid rotation refresh', exact: true });
        await focused(confirmation.getByRole('button').first());
        const cancel = root.getByRole('button', { name: fr ? 'ANNULER SANS FRAIS' : 'CANCEL AT NO COST', exact: true });
        await cancel.click(); await focused(rotate); await page.keyboard.press('Enter');
        await focused(confirmation.getByRole('button').first());
        await confirmation.getByRole('button').first().click();
        await page.waitForFunction(() => window.__portalCatalogQA.rotationRequests.length === 1);
        assert.equal(await confirmation.getByRole('button').first().isDisabled(), true);
        await page.keyboard.press('Enter');
        assert.equal(await page.evaluate(() => window.__portalCatalogQA.rotationRequests.length), 1, 'Repeated input while saving must not duplicate the transaction');
        await page.evaluate(() => window.__portalCatalogQA.finishRotation({ applied: false, reason: 'persistence-failed' }));
        await confirmation.getByRole('button').first().waitFor();
        await page.waitForFunction(() => !document.querySelector('[data-personal-rotation-controls] [role="group"] button').disabled);
        await focused(confirmation.getByRole('button').first());
        await confirmation.getByRole('button').first().click();
        await page.waitForFunction(() => window.__portalCatalogQA.rotationRequests.length === 2);
        const requests = await page.evaluate(() => window.__portalCatalogQA.rotationRequests);
        assert.equal(requests[0].requestId, requests[1].requestId, 'Retry after failed persistence must keep the original idempotency key');
        await page.evaluate(() => window.__portalCatalogQA.finishRotation({ applied: false, reason: 'persistence-failed' }));
        await page.waitForFunction(() => !document.querySelector('[data-personal-rotation-controls] [role="group"] button').disabled);
        await focused(confirmation.getByRole('button').first());
        await cancel.click(); await focused(rotate);
        assert.deepEqual(await stateOf(page), initialState, 'Cancelled/failed rotation must not change the fixture save');
        record.productionCatalogue = { firstPage, savedPage, offId, selectedId, rotationRequests: requests.length, retryKeptRequest: true };
        await page.keyboard.press('Escape'); await root.waitFor({ state: 'detached' }); await focused(trigger);
      } else {
        const rewards = root.locator('.booster-dossier-rewards');
        const heading = rewards.locator('h3');
        const cards = rewards.locator('[data-dossier-card]');
        const topPager = rewards.locator('[data-pagination-position="top"]');
        const ids = [];
        let pages = 0;
        while (true) {
          ids.push(...await cards.evaluateAll(nodes => nodes.map(node => node.dataset.dossierCard)));
          pages += 1;
          const next = topPager.getByRole('button', { name: fr ? 'Page suivante' : 'Next page', exact: true });
          if (await next.isDisabled()) break;
          await next.click(); await focused(heading);
        }
        assert.equal(pages, 5); assert.equal(ids.length, 53); assert.equal(new Set(ids).size, 53);
        assert.deepEqual([...ids].sort(), await page.evaluate(() => window.__portalCatalogQA.candidates.map(card => card.id).sort()));
        const title = cards.locator('h4').filter({ hasText: fr ? 'Éclaireuse des bibliothèques' : 'Pathfinder of the Mosaic City' });
        record.longTitle = await assertWrappedText(title);
        await page.screenshot({ path: resolve(evidence, `${name}-last-page.png`), fullPage: false });
        const query = rewards.getByRole('searchbox');
        const kind = rewards.getByRole('combobox', { name: fr ? 'Type de carte' : 'Card type', exact: true });
        await query.fill(fr ? 'eclaireuse' : 'pathfinder');
        assert.deepEqual(await cards.evaluateAll(nodes => nodes.map(node => node.dataset.dossierCard)), ['qa-dossier-53']);
        assert.equal((await pagingOf(rewards)).page, 1);
        await kind.selectOption('event');
        assert.equal(await cards.count(), 0); assert.equal((await pagingOf(rewards)).total, 0);
        assert.equal(await topPager.getByRole('button', { name: fr ? 'Page suivante' : 'Next page', exact: true }).isDisabled(), true);
        await kind.selectOption('equipment'); assert.equal(await cards.count(), 1);
        await query.fill(''); await kind.selectOption('hero');
        assert.equal((await pagingOf(rewards)).total, 18);
        const pageSize = topPager.getByRole('combobox');
        await pageSize.selectOption('24'); assert.equal(await cards.count(), 18);
        await kind.selectOption('all'); assert.equal(await cards.count(), 24);
        await topPager.getByRole('button', { name: fr ? 'Dernière page' : 'Last page', exact: true }).click(); await focused(heading);
        assert.equal(await cards.count(), 5);
        await pageSize.selectOption('48'); assert.equal(await cards.count(), 48);
        assert.equal((await pagingOf(rewards)).page, 1);
        record.filteredLayout = await inspectLayout(root, viewport, 'dossier');
        assert.deepEqual(await stateOf(page), initialState);
        assert.deepEqual(await page.evaluate(() => window.__portalCatalogQA.selected), [], 'Browsing never selects a booster');
        await root.locator('.booster-dossier-back-to-overview').click(); await focused(root.locator('#booster-dossier-overview-title'));
        await root.locator('[data-select-previewed-booster]').click(); await root.waitFor({ state: 'detached' }); await focused(trigger);
        assert.deepEqual(await page.evaluate(() => window.__portalCatalogQA.selected), ['qa:reading-room']);
        assert.deepEqual(await stateOf(page), initialState);
        record.completeCatalogue = { cards: ids.length, uniqueCards: new Set(ids).size, pages, pageSizes: [12, 24, 48], searchBeyondFirstPage: true };
      }
      assert.deepEqual(errors, [], 'Unexpected JavaScript error');
      assert.deepEqual(missing, [], 'Missing non-media fixture resource');
      record.status = 'passed'; record.errors = errors; record.missingResources = missing;
      console.log(`${name}: passed`);
    } catch (error) {
      record.status = 'failed'; record.error = error.stack || String(error); record.errors = errors; record.missingResources = missing;
      await page.screenshot({ path: resolve(evidence, `${name}-failure.png`), fullPage: false }).catch(() => {});
      throw error;
    } finally {
      await context.close();
      await writeFile(resolve(evidence, 'results.json'), JSON.stringify({ recipe: 'portal-dense-catalogs-v1', results }, null, 2) + '\n');
    }
  }
} finally { await browser.close(); }
console.log(`Portal dense catalogues: ${results.length}/${results.length} passed; evidence: ${evidence}`);
