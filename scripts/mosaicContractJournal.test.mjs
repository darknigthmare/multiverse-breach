import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from './fixtures/ssrTestServer.mjs';
import { getCityContractJournal, cityContractStatusLabel } from '../src/game/mosaicContractJournal.js';
import { getMosaicCharacterMissionObjective, getMosaicCharacterMissionStep, startMosaicCharacterMission } from '../src/game/mosaicCharacterMissions.js';
import { journalCases, journalHeroes, journalProgress, followupCase, journalRecord } from './fixtures/mosaicContractJournalData.mjs';

let vite, Journal;
before(async () => {
  vite = await createServer({ root: fileURLToPath(new URL('../', import.meta.url)), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ default: Journal } = await vite.ssrLoadModule('/src/components/MosaicCharacterMissions.jsx'));
});
after(async () => { await vite?.close(); });
const props = () => ({ missions: journalCases, heroes: journalHeroes, progress: journalProgress(), lang: 'fr' });
const view = changes => getCityContractJournal({ ...props(), ...changes });
const render = changes => renderToStaticMarkup(React.createElement(Journal, { ...props(),
  onAccept() { throw new Error('Reading accepted a contract'); }, onApproach() { throw new Error('Reading triggered movement'); },
  onResolve() { throw new Error('Reading chose an ending'); }, ...changes }));
const resultIds = html => [...html.matchAll(/data-city-contract-result="([^"]+)"/g)].map(match => match[1]);

test('journal separates playable progress, submitted cases, prerequisites and retained incompatible records', () => {
  const result = view();
  assert.deepEqual(result.counts, { all: 63, available: 58, 'in-progress': 2, completed: 1, locked: 1, unavailable: 1 });
  assert.equal(result.items.length, 12);
  assert.deepEqual(view({ status: 'in-progress' }).items.map(item => item.mission.id), ['qa-case-2', 'qa-case-3']);
  assert.deepEqual(view({ status: 'locked' }).items.map(item => item.mission.id), [followupCase.id]);
  assert.deepEqual(view({ status: 'unavailable' }).items.map(item => item.mission.id), ['qa-case-4']);
  assert.equal(view({ status: 'invalid-filter' }).status, 'all');
});

test('every source case remains reachable; malformed pages clamp without mutating input or checkpoints', () => {
  const data = props(), before = JSON.stringify(data), ids = [];
  for (let page = 1; page <= 6; page += 1) ids.push(...getCityContractJournal({ ...data, page }).items.map(item => item.mission.id));
  assert.deepEqual(ids, journalCases.map(item => item.id));
  assert.equal(view({ page: -3 }).page, 1);
  assert.equal(view({ page: Infinity }).page, 1);
  assert.equal(view({ page: 999 }).page, 6);
  assert.equal(JSON.stringify(data), before);
});

test('accent-insensitive search applies to the whole source and both languages before pagination', () => {
  for (const query of ['zenith', 'zenith memoire', 'final witness', 'Relevé 61', 'qa-resident-61']) {
    const result = view({ query, page: 12 });
    assert.deepEqual(result.items.map(item => item.mission.id), ['qa-case-61'], query);
    assert.equal(result.page, 1);
  }
  assert.equal(view({ query: 'no-such-contract' }).total, 0);
  assert.equal(view({ query: 'zenith', status: 'completed' }).total, 0);
});

test('empty or removed district content preserves external records without fabricating local entries', () => {
  const progress = journalProgress();
  const before = JSON.stringify(progress);
  const result = view({ missions: [], progress });
  assert.equal(result.total, 0);
  assert.equal(result.pageCount, 1);
  assert.equal(result.counts.all, 0);
  const html = render({ missions: [], progress });
  assert.match(html, /Un contrat est suivi dans un autre quartier/);
  assert.equal(resultIds(html).length, 0);
  assert.equal(JSON.stringify(progress), before);
});

for (const lang of ['fr', 'en']) {
  test(`${lang}: actual journal renders a bounded directory, direct selector, independent tracked objective and folded evidence`, () => {
    const data = props(), before = JSON.stringify(data);
    const html = render({ ...data, lang });
    assert.equal(resultIds(html).length, 12);
    assert.equal((html.match(/<select /g) || []).length, 1);
    assert.equal((html.match(/<option /g) || []).length, journalCases.length);
    assert.match(html, /data-city-contract-reader="qa-case-3"/);
    assert.match(html, /data-city-contract-tracked/);
    assert.match(html, /data-city-contract-status="active"/);
    assert.match(html, /data-step="resolution"/);
    assert.equal((html.match(/data-city-contract-choice=/g) || []).length, 3);
    assert.match(html, /<details class="mosaic-contract-evidence">/);
    assert.ok(html.includes(lang === 'fr' ? 'Constat synthétique enregistré 3.' : 'Recorded synthetic finding 3.'));
    assert.equal(JSON.stringify(data), before);
  });
  test(`${lang}: a locked follow-up explains its prerequisite and provides only a read action`, () => {
    const progress = { ...journalProgress(), activeId: null, lastMissionId: followupCase.id };
    const html = render({ progress, lang });
    assert.match(html, /data-city-contract-status="locked"/);
    assert.match(html, /data-step="locked"/);
    assert.match(html, /data-city-contract-prerequisite/);
    assert.doesNotMatch(html, /data-city-contract-accept|data-city-contract-approach|data-city-contract-choice=/);
    assert.ok(html.includes(getMosaicCharacterMissionObjective(progress, followupCase, lang).text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;')));
  });
  test(`${lang}: a second chapter shows the recorded first decision and the effective branch evidence`, () => {
    let progress = journalProgress({ prerequisiteComplete: true });
    progress = startMosaicCharacterMission(progress, followupCase, lang).progress;
    const index = followupCase.steps.findIndex(step => step.byOriginChoice);
    assert.ok(index >= 0, 'Fixture uses an actual branch from the original Anchor case');
    const effective = getMosaicCharacterMissionStep(progress, followupCase, index);
    progress.records[followupCase.id] = { ...journalRecord(followupCase, index + 1), originChoiceId: progress.records[followupCase.id].originChoiceId };
    const html = render({ progress, lang });
    assert.match(html, /class="mosaic-contract-origin"/);
    assert.match(html, /data-city-contract-status="active"/);
    assert.ok(html.includes(effective.finding[lang].replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;')));
  });
}

test('status copy names incompatible records explicitly instead of promising a new mission', () => {
  assert.equal(cityContractStatusLabel('unavailable', 'en'), 'Needs review');
  assert.equal(cityContractStatusLabel('locked', 'fr'), 'À débloquer');
});
