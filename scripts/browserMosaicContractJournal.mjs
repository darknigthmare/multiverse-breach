import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, relative, resolve, sep } from 'node:path';
import { DISPLAY_PREFERENCES_KEY } from '../src/game/displayPreferences.js';
import { AUDIO_PREFERENCES_KEY } from '../src/game/audioPreferences.js';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const fixture = resolve(process.env.PLAYWRIGHT_FIXTURE_DIR || '.tmp/mosaic-contract-journal');
const evidence = resolve(process.env.PLAYWRIGHT_EVIDENCE_DIR || '.tmp/mosaic-contract-journal-evidence');
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'], executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
const results = [];
const frames = page => page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))));
const focused = async locator => {
  const element = await locator.elementHandle();
  try { await locator.page().waitForFunction(node => node === document.activeElement, element); }
  finally { await element.dispose(); }
};
const ids = root => root.locator('[data-city-contract-result]').evaluateAll(nodes => nodes.map(node => node.dataset.cityContractResult));
const snapshot = page => page.evaluate(() => ({ progress: window.__contractJournalQA.state.progress, calls: window.__contractJournalQA.calls, source: window.__contractJournalQA.source }));
const fonts = root => root.locator('.mosaic-contract-kicker, .mosaic-contract-heading h3, .mosaic-contract-reader h4, .mosaic-contract-reader > label > span, .mosaic-contract-reader select, [data-city-contract-objective], .mosaic-contract-request blockquote p')
  .evaluateAll(nodes => nodes.map(node => ({ text: node.textContent.slice(0, 90), size: parseFloat(getComputedStyle(node).fontSize) })));

async function inspectLayout(root, viewport) {
  const data = await root.evaluate(node => {
    const visible = element => element.checkVisibility({ visibilityProperty: true, opacityProperty: true });
    const containers = [node, ...node.querySelectorAll('.mosaic-contract-heading, .mosaic-contract-workspace, .mosaic-contract-directory, .mosaic-contract-directory-content, .mosaic-contract-list, .mosaic-contract-reader, .mosaic-contract-objective, .mosaic-contract-evidence, .mosaic-contract-request, .mosaic-contract-memory, .mosaic-contract-on-location, .mosaic-contract-previous, .mosaic-resident-conversation-content, .mosaic-resident-conversation-toolbar, .mosaic-dialogue-quest, .mosaic-dialogue-background, .mosaic-dialogue-record, .mosaic-dialogue-topics, .mosaic-dialogue-next, .mosaic-dialogue-actions, blockquote')]
      .filter(visible).map(element => ({ name: element.className, width: element.clientWidth, scrollWidth: element.scrollWidth }));
    const controls = [...node.querySelectorAll('button, input, select, summary')].filter(visible).map(element => {
      const rect = element.getBoundingClientRect();
      return { name: element.getAttribute('aria-label') || element.textContent.slice(0, 80), left: rect.left, right: rect.right, width: rect.width, height: rect.height,
        clientWidth: element.clientWidth, scrollWidth: element.scrollWidth };
    });
    return { containers, controls };
  });
  for (const item of data.containers) assert.ok(item.scrollWidth <= item.width + 1, `Horizontal container overflow: ${JSON.stringify(item)}`);
  for (const item of data.controls) {
    assert.ok(item.width >= 43.99 && item.height >= 43.99, `Control smaller than 44px: ${JSON.stringify(item)}`);
    assert.ok(item.left >= 31 && item.right <= viewport.width - 31, `Control escaped the 32px safe area: ${JSON.stringify(item)}`);
    assert.ok(item.scrollWidth <= item.clientWidth + 1, `Control text clipped: ${JSON.stringify(item)}`);
  }
  return data;
}

async function authoredPresentation(page, { missionId, lang, viewport, name }) {
  await page.goto(`https://multiverse.test/scripts/fixtures/mosaic-contract-journal.html?lang=${lang}&story=${missionId}`);
  await page.waitForFunction(() => window.__contractJournalQA.state && window.__contractJournalQA.story);
  const story = await page.evaluate(() => window.__contractJournalQA.story);
  assert.ok(story.request && story.location && story.reply && story.heroName, `Missing authored narrative: ${missionId}`);
  const before = await snapshot(page);
  const trigger = page.getByTestId('open-contract-journal');
  await trigger.focus(); await page.keyboard.press('Enter');
  const root = page.locator('.mosaic-character-missions');
  await root.waitFor();
  assert.equal(await root.locator('[data-city-contract-reader]').getAttribute('data-city-contract-reader'), missionId);
  assert.ok((await root.locator('[data-city-contract-request]').textContent()).includes(story.request));
  assert.ok((await root.locator('[data-city-contract-request]').textContent()).includes(story.heroName));
  assert.ok((await root.locator('[data-city-contract-location]').textContent()).includes(story.location));
  assert.equal(await root.locator('[data-city-contract-memory]').count(), 0, 'An unread request invented a lived encounter');
  assert.doesNotMatch(await root.innerText(), /sourceRefs|DLC\/(Halo|Alien)|\bQA\s+\d|DOSSIER TRANSMIS|CASE SUBMITTED|Conclusion à inscrire|Conclusion to record/u);
  const result = { missionId, hero: story.heroName, request: story.request, location: story.location,
    scope: 'Actual authored text and components; prepared conversation, no City movement or on-site operation claim.',
    requestLayout: await inspectLayout(root, viewport) };
  await root.locator('[data-city-contract-request]').scrollIntoViewIfNeeded();
  await page.screenshot({ path: resolve(evidence, `${name}-${missionId}-request.png`) });
  await page.keyboard.press('Escape'); await root.waitFor({ state: 'detached' }); await focused(trigger);
  assert.deepEqual(await snapshot(page), before, 'Reading an authored request changed progress');

  const replyTrigger = page.getByTestId('open-authored-reply');
  await replyTrigger.focus(); await page.keyboard.press('Enter');
  const conversation = page.locator('.mosaic-resident-dialogue');
  const conversationModal = page.locator('[data-resident-conversation-modal]');
  await conversation.waitFor();
  await focused(conversation.locator('h3'));
  assert.equal(await page.getByRole('dialog').count(), 1, 'The encounter stacked two modal layers');
  assert.equal(await page.locator('.mosaic-character-missions, .mosaic-evidence-ledger, .mosaic-resident-directory, .mosaic-terminal-drawer').count(), 0,
    'An administrative panel remained under the conversation');
  assert.equal(await page.locator('#root').evaluate(node => node.inert), true);
  assert.equal(await conversation.locator('[data-dialogue-next]').count(), 0, 'An unaccepted request became a tracked next action');
  assert.equal(await conversation.locator('[data-dialogue-location]').innerText(), story.location);
  await conversation.locator('[data-dialogue-return]').focus(); await page.keyboard.press('Tab');
  await focused(conversationModal.locator('[data-dialogue-close]'));
  await page.keyboard.press('Shift+Tab'); await focused(conversation.locator('[data-dialogue-return]'));
  result.conversationLayout = await inspectLayout(conversationModal, viewport);
  result.conversationTypography = await conversation.locator('h3, [data-dialogue-quest] blockquote p, [data-dialogue-return]')
    .evaluateAll(nodes => nodes.map(node => ({ text: node.textContent, size: parseFloat(getComputedStyle(node).fontSize) })));
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).fontSize), '24px');
  assert.ok(result.conversationTypography.every(item => item.size >= 24), 'Conversation text did not follow 150% reading size');
  await conversation.locator('[data-dialogue-quest]').scrollIntoViewIfNeeded();
  await page.screenshot({ path: resolve(evidence, `${name}-${missionId}-conversation-offer.png`) });
  await page.keyboard.press('Escape'); await conversation.waitFor({ state: 'detached' }); await focused(replyTrigger);
  assert.deepEqual(await snapshot(page), before, 'Dismissing the encounter accepted its request');

  await replyTrigger.focus(); await page.keyboard.press('Enter'); await conversation.waitFor();
  await conversation.locator('[data-dialogue-journal]').focus(); await page.keyboard.press('Enter');
  await conversation.waitFor({ state: 'detached' }); await root.waitFor();
  assert.equal(await page.getByRole('dialog').count(), 1, 'Journal navigation left the encounter open');
  assert.deepEqual(await snapshot(page), before, 'Opening the journal from an offer changed progress');
  await page.keyboard.press('Escape'); await root.waitFor({ state: 'detached' }); await focused(replyTrigger);
  result.keyboardTrapAndEscape = true;
  result.explicitJournalReadOnly = true;

  if (missionId === 'city-mirelle-suture-v1') {
    await replyTrigger.focus(); await page.keyboard.press('Enter'); await conversation.waitFor();
    await page.mouse.click(1, 1); await conversation.waitFor({ state: 'detached' }); await focused(replyTrigger);
    assert.deepEqual(await snapshot(page), before, 'Closing from the backdrop accepted the request');
    result.backdropReturnsFocus = true;
  }
  await replyTrigger.focus(); await page.keyboard.press('Enter'); await conversation.waitFor();
  const speech = conversation.locator('[data-dialogue-quest]');
  assert.ok((await speech.textContent()).includes(story.request));
  const background = conversation.locator('.mosaic-dialogue-background');
  if (await background.count()) {
    assert.equal(await background.evaluate(node => node.open), false);
    await background.locator('summary').click();
    const topic = conversation.locator('[data-dialogue-topic]').last();
    const id = await topic.getAttribute('data-dialogue-topic');
    await topic.click();
    assert.equal(await conversation.locator('[data-dialogue-record]').getAttribute('data-dialogue-record'), id);
    assert.deepEqual(await snapshot(page), before, 'Reading background changed mission progress');
    await background.locator('summary').click();
    result.secondaryArchiveReadOnly = true;
  } else result.noArchiveTopicsRequired = true;
  await conversation.locator('[data-city-quest-offer]').focus(); await page.keyboard.press('Enter');
  await focused(conversation.locator('[data-dialogue-return]'));
  assert.equal(await conversation.locator('[data-city-quest-offer]').count(), 0);
  assert.ok((await speech.textContent()).includes(story.reply));
  assert.equal(await conversation.locator('[data-dialogue-next] p').innerText(), await page.evaluate(() => window.__contractJournalQA.state.nextAction));
  const accepted = await snapshot(page);
  assert.equal(accepted.progress.activeId, missionId);
  assert.deepEqual(accepted.progress.records[missionId].completedStepIds, [], 'Prepared presentation must not fabricate an in-world encounter');
  assert.deepEqual(accepted.calls, [{ type: 'offer', id: missionId }]);
  assert.deepEqual(accepted.source, before.source);
  result.acceptanceFocus = true;
  result.reply = story.reply;
  result.replyLayout = await inspectLayout(conversationModal, viewport);
  await speech.scrollIntoViewIfNeeded();
  await page.screenshot({ path: resolve(evidence, `${name}-${missionId}-reply.png`) });
  await conversation.locator('[data-dialogue-return]').focus(); await page.keyboard.press('Enter');
  await conversation.waitFor({ state: 'detached' }); await focused(replyTrigger);

  if (missionId === 'city-chief-unsc-route-v1') {
    await page.goto(`https://multiverse.test/scripts/fixtures/mosaic-contract-journal.html?lang=${lang}&story=${missionId}&visit=legacy`);
    await page.waitForFunction(() => window.__contractJournalQA.state?.progress.records[window.__contractJournalQA.story.id]?.completed);
    const previous = await snapshot(page);
    await page.getByTestId('open-contract-journal').click(); await root.waitFor();
    await root.locator('[data-city-contract-legacy]').waitFor({ state: 'visible' });
    assert.equal(await root.locator('[data-city-contract-request]').count(), 0);
    assert.equal(await root.locator('[data-city-contract-status]').getAttribute('data-city-contract-status'), 'completed');
    const previousTitle = await root.locator('.mosaic-contract-reader > h4').innerText();
    const previousConclusion = await root.locator('[data-city-contract-objective]').innerText();
    await root.locator('[data-city-contract-replay]').scrollIntoViewIfNeeded();
    await page.screenshot({ path: resolve(evidence, `${name}-legacy-visit.png`) });
    await root.locator('[data-city-contract-replay]').focus(); await page.keyboard.press('Enter');
    await focused(root.locator('[data-city-contract-objective]'));
    const restarted = await snapshot(page);
    assert.deepEqual(restarted.progress.records[missionId].previousStory, previous.progress.records[missionId]);
    assert.deepEqual(restarted.progress.records[missionId].completedStepIds, []);
    assert.deepEqual(restarted.progress.records[missionId].operationReceipts, {});
    assert.equal(restarted.progress.records[missionId].storyRevision, 2);
    assert.deepEqual(restarted.calls, [{ type: 'replay', id: missionId }]);
    assert.equal(await root.locator('[data-city-contract-legacy]').count(), 0);
    assert.ok((await root.locator('[data-city-contract-request]').textContent()).includes(story.request));
    result.replayLayout = await inspectLayout(root, viewport);
    await page.screenshot({ path: resolve(evidence, `${name}-replayed-visit.png`) });
    const firstVisit = root.locator('[data-city-contract-previous]');
    assert.equal(await firstVisit.evaluate(node => node.open), false);
    await firstVisit.locator('summary').focus(); await page.keyboard.press('Enter');
    await firstVisit.locator('h5').waitFor({ state: 'visible' });
    assert.equal(await firstVisit.locator('h5').innerText(), previousTitle);
    assert.ok((await firstVisit.innerText()).includes(previousConclusion));
    assert.equal(await firstVisit.locator('li').count(), previous.progress.records[missionId].completedStepIds.length);
    assert.deepEqual(await snapshot(page), restarted, 'Reading the first visit changed the current adventure');
    result.firstVisitLayout = await inspectLayout(root, viewport);
    result.explicitReplayPreservesFirstVisit = true;
    result.firstVisitStillReadable = true;
    await firstVisit.locator('h5').scrollIntoViewIfNeeded();
    await page.screenshot({ path: resolve(evidence, `${name}-first-visit.png`) });
    await page.keyboard.press('Escape'); await root.waitFor({ state: 'detached' });
  }
  return result;
}

try {
  for (const viewport of [{ width: 390, height: 844 }, { width: 844, height: 390 }, { width: 1365, height: 900 }]) for (const lang of ['fr', 'en']) {
    const fr = lang === 'fr', name = `${lang}-${viewport.width}x${viewport.height}`;
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage(), errors = [], missing = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) missing.push(`${response.status()} ${response.url()}`); });
    await context.route('https://multiverse.test/**', async route => {
      const pathname = new URL(route.request().url()).pathname;
      const file = resolve(fixture, '.' + pathname), rel = relative(fixture, file);
      if (rel === '..' || rel.startsWith('..' + sep)) return route.fulfill({ status: 403, body: 'Outside fixture' });
      try { await route.fulfill({ body: await readFile(file), contentType: ({ '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' })[extname(file)] || 'application/octet-stream' }); }
      catch { await route.fulfill({ status: 404, body: 'Missing fixture resource' }); }
    });
    await context.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//u, route => route.abort());
    await page.addInitScript(({ displayKey, audioKey }) => {
      if (!localStorage.getItem(displayKey)) localStorage.setItem(displayKey, JSON.stringify({ version: 1, textScale: 1, hudScale: 1.4, safeArea: 32, contrast: 'high', motion: 'reduced' }));
      localStorage.setItem(audioKey, JSON.stringify({ musicVolume: 0, sfxVolume: 0, muted: true }));
    }, { displayKey: DISPLAY_PREFERENCES_KEY, audioKey: AUDIO_PREFERENCES_KEY });
    const record = { name, viewport, lang, status: 'running', scope: 'Actual journal, modal isolation, display settings and mission rules. 61 synthetic cases plus two actual Anchor contracts; prepared progress, no City movement, account, or artwork claim.' };
    results.push(record);
    try {
      await page.goto(`https://multiverse.test/scripts/fixtures/mosaic-contract-journal.html?lang=${lang}`);
      await page.waitForFunction(() => window.__contractJournalQA.state && getComputedStyle(document.documentElement).fontSize === '16px');
      const original = await snapshot(page);
      const trigger = page.getByTestId('open-contract-journal');
      const root = page.locator('.mosaic-character-missions');
      const close = page.locator('.immersive-drawer > header button');
      const directory = root.locator('.mosaic-contract-directory');
      const reader = root.locator('.mosaic-contract-reader');
      const search = root.getByRole('searchbox');
      const select = root.locator('[data-city-contract-select]');
      const ensureDirectory = async () => {
        if (!await directory.evaluate(node => node.open)) await directory.locator(':scope > summary').click();
        await search.waitFor({ state: 'visible' });
      };
      await trigger.focus(); await page.keyboard.press('Enter'); await root.waitFor(); await focused(close); await frames(page);
      assert.equal(await page.locator('#root').evaluate(node => node.inert), true);
      assert.equal(await directory.evaluate(node => node.open), viewport.width >= 960);
      const beforeFonts = await fonts(root);
      await page.keyboard.press('Escape'); await root.waitFor({ state: 'detached' }); await focused(trigger);
      await page.locator('.game-system-trigger').click();
      await page.getByLabel(fr ? 'Taille du texte' : 'Text size').focus(); await page.keyboard.press('End');
      await page.waitForFunction(() => getComputedStyle(document.documentElement).fontSize === '24px');
      await page.keyboard.press('Escape'); await page.getByRole('dialog').waitFor({ state: 'detached' });
      await page.waitForFunction(() => !document.getElementById('root').inert);
      await trigger.focus(); await page.keyboard.press('Enter'); await root.waitFor(); await focused(close); await frames(page);
      const afterFonts = await fonts(root);
      assert.equal(beforeFonts.length, afterFonts.length);
      beforeFonts.forEach((item, index) => assert.ok(Math.abs(afterFonts[index].size / item.size - 1.5) < .01, `Text scale ignored: ${item.text}: ${item.size} → ${afterFonts[index].size}`));
      record.fonts = { before: beforeFonts, after: afterFonts };
      record.initialLayout = await inspectLayout(root, viewport);
      await page.screenshot({ path: resolve(evidence, `${name}-tracked.png`) });

      await ensureDirectory();
      assert.equal((await ids(root)).length, 12);
      await search.fill('zenith memoire');
      assert.deepEqual(await ids(root), ['qa-case-61']);
      assert.equal(await reader.getAttribute('data-city-contract-reader'), 'qa-case-3', 'Search replaced the case being read');
      await search.fill('zz-no-matching-contract');
      assert.deepEqual(await ids(root), []);
      await root.locator('[data-city-contract-empty]').waitFor({ state: 'visible' });
      assert.equal(await reader.getAttribute('data-city-contract-reader'), 'qa-case-3');
      await root.locator('.mosaic-contract-clear').click(); await focused(search);
      const pageIds = [...await ids(root)];
      for (let index = 1; index < 6; index += 1) {
        await root.getByRole('navigation', { name: fr ? 'Pages du carnet' : 'Journal pages' }).getByRole('button', { name: fr ? 'Suivant' : 'Next', exact: true }).click();
        await focused(directory.locator('h4'));
        await page.keyboard.press('Tab'); await focused(search);
        pageIds.push(...await ids(root));
      }
      assert.deepEqual(pageIds, original.source.map(item => item.id));
      record.allSourceCasesReached = pageIds.length;
      for (const [filter, expected] of [['in-progress', ['qa-case-2', 'qa-case-3']], ['completed', ['qa-case-1']], ['unavailable', ['qa-case-4']]]) {
        await root.locator(`[data-city-contract-filter="${filter}"]`).click();
        assert.deepEqual(await ids(root), expected);
        assert.equal(await reader.getAttribute('data-city-contract-reader'), 'qa-case-3');
      }
      const followupId = await page.evaluate(() => window.__contractJournalQA.followupId);
      const prerequisiteId = await page.evaluate(() => window.__contractJournalQA.prerequisiteId);
      await root.locator('[data-city-contract-filter="locked"]').click();
      assert.deepEqual(await ids(root), [followupId]);
      await root.locator(`[data-city-contract-result="${followupId}"]`).click();
      await focused(reader.locator('h4'));
      assert.equal(await root.locator('[data-city-contract-status]').getAttribute('data-city-contract-status'), 'locked');
      assert.equal(await root.locator('[data-city-contract-accept], [data-city-contract-approach], [data-city-contract-choice]').count(), 0);
      if (viewport.width < 960) assert.equal(await directory.evaluate(node => node.open), false, 'Small-screen selection did not fold the directory');
      await reader.scrollIntoViewIfNeeded();
      record.lockedLayout = await inspectLayout(root, viewport);
      await page.screenshot({ path: resolve(evidence, `${name}-locked.png`) });
      await root.locator('[data-city-contract-prerequisite]').click(); await focused(reader.locator('h4'));
      assert.equal(await reader.getAttribute('data-city-contract-reader'), prerequisiteId);
      assert.deepEqual(await snapshot(page), original, 'Reading, filtering or paging changed progress or invoked a game action');
      record.readOnlyNavigation = true;

      await root.locator('[data-city-contract-tracked]').click(); await focused(reader.locator('h4'));
      assert.equal(await reader.getAttribute('data-city-contract-reader'), 'qa-case-3');
      const beforeChoice = await snapshot(page);
      await root.locator('[data-city-contract-choice="replace-origin"]').click();
      await root.locator('[data-city-contract-feedback]').waitFor({ state: 'visible' });
      assert.deepEqual((await snapshot(page)).progress, beforeChoice.progress);
      await root.locator('[data-city-contract-choice="retain-origin"]').focus();
      await page.keyboard.press('Enter'); await focused(root.locator('[data-city-contract-objective]'));
      assert.equal(await root.locator('[data-city-contract-objective]').getAttribute('data-step'), 'report');
      assert.equal(await root.locator('[data-city-contract-choice]').count(), 0);
      const evidenceDisclosure = root.locator('.mosaic-contract-evidence');
      await evidenceDisclosure.locator('summary').click();
      assert.equal(await evidenceDisclosure.locator('li[data-complete="true"]').count(), 3);
      await evidenceDisclosure.getByText(fr ? 'Constat synthétique enregistré 3.' : 'Recorded synthetic finding 3.', { exact: true }).waitFor({ state: 'visible' });
      record.evidenceLayout = await inspectLayout(root, viewport);
      await page.screenshot({ path: resolve(evidence, `${name}-evidence.png`) });
      record.decisionFocus = true;

      await select.selectOption('qa-case-61');
      await root.locator('[data-city-contract-accept]').focus(); await page.keyboard.press('Enter');
      await focused(root.locator('[data-city-contract-objective]'));
      await page.waitForFunction(() => window.__contractJournalQA.state.progress.activeId === 'qa-case-61');
      assert.equal((await snapshot(page)).progress.activeId, 'qa-case-61');
      assert.deepEqual((await snapshot(page)).progress.records['qa-case-3'].completedStepIds, ['inspect-nexus_anchor_coil', 'inspect-arca_signal_lens', 'resolution']);
      await select.selectOption('qa-case-2');
      assert.equal(await root.locator('[data-city-contract-status]').getAttribute('data-city-contract-status'), 'paused');
      await root.locator('[data-city-contract-accept]').focus(); await page.keyboard.press('Enter');
      await focused(root.locator('[data-city-contract-objective]'));
      await page.waitForFunction(() => window.__contractJournalQA.state.progress.activeId === 'qa-case-2');
      assert.deepEqual((await snapshot(page)).progress.records['qa-case-2'].completedStepIds, ['inspect-nexus_anchor_coil']);
      record.acceptResumeFocus = true;
      await select.selectOption('qa-case-4');
      assert.equal(await root.locator('[data-city-contract-status]').getAttribute('data-city-contract-status'), 'unavailable');
      assert.equal(await root.locator('[data-city-contract-accept], [data-city-contract-approach]').count(), 0);
      const after = await snapshot(page);
      assert.equal(after.progress.records['qa-case-4'].futureField, 'preserved');
      assert.deepEqual(after.progress.records['absent-dlc-case'], original.progress.records['absent-dlc-case']);
      assert.deepEqual(after.source, original.source);
      assert.equal(after.calls.filter(item => item.type === 'accept').length, 2);
      assert.equal(after.calls.filter(item => item.type === 'resolve').length, 2);
      assert.equal(after.calls.filter(item => item.type === 'approach').length, 0);
      record.checkpointsPreserved = true;

      if (viewport.width >= 960) {
        await ensureDirectory(); await search.fill('signed'); await search.focus();
        await page.setViewportSize({ width: 390, height: 844 });
        await page.waitForFunction(() => !document.querySelector('.mosaic-contract-directory').open);
        await focused(directory.locator(':scope > summary'));
        await ensureDirectory();
        assert.equal(await search.inputValue(), 'signed');
        record.rotationLayout = await inspectLayout(root, { width: 390, height: 844 });
        await page.setViewportSize(viewport); await frames(page);
        record.rotationRetainsQueryAndFocus = true;
      }
      await close.focus(); await page.keyboard.press('Shift+Tab');
      const lastFocusInside = await page.evaluate(() => Boolean(document.querySelector('.immersive-drawer').contains(document.activeElement)));
      assert.equal(lastFocusInside, true);
      await page.keyboard.press('Escape'); await root.waitFor({ state: 'detached' }); await focused(trigger); await frames(page); await focused(trigger);
      record.authoredStories = [];
      for (const missionId of ['city-mirelle-suture-v1', 'city-chief-unsc-route-v1', 'city-ripley-narcissus-route-v1',
        ...(viewport.width >= 960 ? ['city-bastion-tenth-route-v1'] : [])]) {
        record.authoredStories.push(await authoredPresentation(page, { missionId, lang, viewport, name }));
      }
      assert.deepEqual(errors, []); assert.deepEqual(missing, []);
      record.status = 'passed';
    } catch (error) {
      record.status = 'failed'; record.error = error.stack || String(error); record.pageErrors = errors; record.missing = missing;
      await page.screenshot({ path: resolve(evidence, `${name}-failure.png`) }).catch(() => {});
    } finally {
      await writeFile(resolve(evidence, 'journal-browser.json'), JSON.stringify({ cases: results }, null, 2) + '\n');
      await context.close();
    }
  }
} finally { await browser.close(); }
console.log(JSON.stringify({ cases: results.map(({ name, status, error }) => ({ name, status, error })), evidence }, null, 2));
if (results.some(item => item.status !== 'passed')) process.exitCode = 1;
