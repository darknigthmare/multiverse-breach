import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from './fixtures/ssrTestServer.mjs';
import { getCityContractJournal, getCityContractStory, cityContractStatusLabel } from '../src/game/mosaicContractJournal.js';
import { MOSAIC_CHARACTER_MISSIONS, MOSAIC_CHARACTER_MISSION_LEGACY, getMosaicCharacterMissionObjective,
  getMosaicCharacterMissionStep, startMosaicCharacterMission, restartMosaicCharacterMission } from '../src/game/mosaicCharacterMissions.js';
import { journalCases, journalHeroes, journalProgress, followupCase, journalRecord } from './fixtures/mosaicContractJournalData.mjs';

let vite, Journal, ResidentDialogue;
before(async () => {
  vite = await createServer({ root: fileURLToPath(new URL('../', import.meta.url)), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ default: Journal } = await vite.ssrLoadModule('/src/components/MosaicCharacterMissions.jsx'));
  ({ default: ResidentDialogue } = await vite.ssrLoadModule('/src/components/MosaicResidentDialogue.jsx'));
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
  assert.match(html, /Une mission reste en cours ailleurs/);
  assert.equal(resultIds(html).length, 0);
  assert.equal(JSON.stringify(progress), before);
});

for (const lang of ['fr', 'en']) {
  test(`${lang}: a resident can open their requested page while another adventure stays tracked`, () => {
    const data = props(), before = JSON.stringify(data);
    const html = render({ ...data, lang, initialMissionId: 'qa-case-61' });
    assert.match(html, /data-city-contract-reader="qa-case-61"/);
    assert.match(html, /data-city-contract-status="available"/);
    assert.match(html, /data-city-contract-tracked/);
    assert.match(html, /data-city-contract-accept/);
    assert.equal(data.progress.activeId, 'qa-case-3');
    assert.equal(JSON.stringify(data), before, 'opening a page must not accept it or change the followed adventure');
    assert.match(render({ ...data, initialMissionId: 'absent-dlc-case' }), /data-city-contract-reader="qa-case-3"/,
      'an unavailable requested page safely falls back to the retained active entry');
  });
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
    progress.records[followupCase.id] = { ...progress.records[followupCase.id], ...journalRecord(followupCase, index + 1) };
    const html = render({ progress, lang });
    assert.match(html, /class="mosaic-contract-origin"/);
    assert.match(html, /data-city-contract-status="active"/);
    assert.ok(html.includes(effective.finding[lang].replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;')));
  });
}

test('status copy names incompatible records explicitly instead of promising a new mission', () => {
  assert.equal(cityContractStatusLabel('unavailable', 'en'), 'Unavailable');
  assert.equal(cityContractStatusLabel('locked', 'fr'), 'À débloquer');
});

test('requests, places and named objects are searchable without indexing editorial source metadata', () => {
  const mission = { ...journalCases[0], request: { fr: 'Retrouve mon écharpe.', en: 'Find my scarf.' },
    location: { fr: 'Le vieux clocher', en: 'The old bell tower' }, sourceRefs: ['unpublished-editorial-reference'],
    steps: journalCases[0].steps.map((step, index) => index ? step : { ...step, operation: { kind: 'recover', propName: { fr: 'Écharpe vermillon', en: 'Vermilion scarf' } } }) };
  for (const query of ['echarpe', 'old bell tower', 'vermilion scarf']) assert.equal(view({ missions: [mission], query }).total, 1);
  assert.equal(view({ missions: [mission], query: 'unpublished-editorial-reference' }).total, 0);
  assert.equal(view({ missions: [mission], heroes: [] }).entries[0].heroName, 'Un habitant');
});

for (const lang of ['fr', 'en']) {
  test(`${lang}: a request is attributed, an on-site task is described, and only lived moments enter the journal`, () => {
    const mission = { ...journalCases[1], request: { fr: 'La lumière me manque. Peux-tu regarder au clocher ?', en: 'I miss that light. Could you look by the bell tower?' },
      location: { fr: 'Le vieux clocher', en: 'The old bell tower' },
      steps: journalCases[1].steps.map((step, index) => ({ ...step,
        dialogue: { fr: `Parole vécue ${index}`, en: `Spoken moment ${index}` },
        finding: { fr: `Découverte ${index}`, en: `Discovery ${index}` },
        ...(index === 1 ? { operation: { kind: 'repair', label: { fr: 'Réparer la lanterne', en: 'Repair the lantern' }, propName: { fr: 'La lanterne fêlée', en: 'The cracked lantern' } } } : {}) })) };
    const progress = { ...journalProgress(), activeId: mission.id };
    const before = JSON.stringify({ mission, progress });
    const objective = getMosaicCharacterMissionObjective(progress, mission, lang);
    const story = getCityContractStory({ mission, objective, progress, heroes: journalHeroes, lang });
    assert.equal(story.latest.id, mission.steps[0].id);
    assert.deepEqual(story.history.map(step => step.index), [0, 1]);
    const html = render({ missions: [mission], progress, lang });
    assert.match(html, /data-city-contract-request/);
    assert.ok(html.indexOf('data-city-contract-request') < html.indexOf('data-city-contract-objective'));
    assert.ok(html.includes(mission.request[lang]));
    assert.ok(html.includes(mission.location[lang]));
    assert.match(html, /data-city-contract-operation="repair"/);
    assert.match(html, /data-city-contract-approach/);
    assert.ok(html.includes(mission.steps[1].operation.label[lang]));
    assert.ok(html.includes(mission.steps[0].dialogue[lang]));
    assert.ok(!html.includes(mission.steps[1].dialogue[lang]), 'The next meeting has not happened');
    assert.ok(!html.includes(mission.steps[2].finding[lang]), 'Future discoveries stay unrevealed');
    assert.equal(JSON.stringify({ mission, progress }), before);
  });

  test(`${lang}: a quest reply renders with no archive topics`, () => {
    const line = lang === 'fr' ? 'On repart ensemble. Reste près de moi.' : 'We leave together. Stay close.';
    for (const [heroId, name] of [['masterchief', 'Master Chief'], ['ripley', 'Ellen Ripley'], ['arca_mirelle', 'Mirelle Suture']]) for (const phase of ['offer', 'active']) {
      const conversation = { heroId, name, topics: [], questExchange: { missionId: 'an-authored-mission', title: 'The way home', line, phase } };
      const html = renderToStaticMarkup(React.createElement(ResidentDialogue, { conversation, lang, onClose() {}, onAcceptMission() { throw new Error('Reading accepted an offer'); } }));
      assert.match(html, /data-dialogue-quest="an-authored-mission"/);
      assert.ok(html.includes(line));
      assert.ok(html.includes(`<cite>${name}</cite>`));
      assert.match(html, /data-dialogue-return/);
      assert.doesNotMatch(html, /data-dialogue-topic=|data-dialogue-record=|mosaic-dialogue-background/);
      assert.equal(html.includes('data-city-quest-offer='), phase === 'offer');
    }
  });

  test(`${lang}: the conversation names its place and reveals the next action only after acceptance`, () => {
    const location = { fr: 'Au pied de la verrière', en: 'Beneath the glass roof' };
    const nextAction = { fr: 'Rejoins le relais de suture.', en: 'Reach the suture relay.' };
    const conversation = { heroId: 'arca_mirelle', name: 'Mirelle Suture', topics: [],
      questExchange: { missionId: 'city-mirelle-suture-v1', title: 'A suture without erasure', line: 'Écoute ces deux voix.', phase: 'offer' } };
    const renderConversation = current => renderToStaticMarkup(React.createElement(ResidentDialogue, {
      conversation: current, lang, location, nextAction, headingId: 'the-resident', expandBackground: false,
      onClose() {}, onAcceptMission() { throw new Error('Reading accepted a request'); },
      onOpenJournal() { throw new Error('Reading opened the journal'); }
    }));
    const offer = renderConversation(conversation);
    assert.match(offer, /aria-labelledby="the-resident"/);
    assert.match(offer, /data-dialogue-location/);
    assert.ok(offer.includes(location[lang]));
    assert.match(offer, /data-dialogue-journal/);
    assert.doesNotMatch(offer, /data-dialogue-next/);
    assert.ok(!offer.includes(nextAction[lang]));
    const accepted = renderConversation({ ...conversation, questExchange: { ...conversation.questExchange, phase: 'active' } });
    assert.match(accepted, /data-dialogue-next/);
    assert.ok(accepted.includes(nextAction[lang]));
    assert.doesNotMatch(accepted, /data-city-quest-offer/);
    assert.doesNotMatch(accepted, /mosaic-character-missions|mosaic-evidence-ledger|data-reconnaissance-record/);
  });

  test(`${lang}: archives require an explicit opening and do not become attributed speech`, () => {
    const conversation = { heroId: 'arca_tessera', name: 'Tessera', topics: [
      { id: 'origin', label: lang === 'fr' ? 'Son parcours' : 'Their journey', body: 'An existing authored archive paragraph.' }
    ] };
    const html = renderToStaticMarkup(React.createElement(ResidentDialogue, { conversation, lang, expandBackground: false,
      onClose() {}, onOpenJournal() { throw new Error('Reading opened the journal'); } }));
    assert.match(html, /<details class="mosaic-dialogue-background">/);
    assert.ok(html.includes(lang === 'fr' ? 'Consulter les archives de' : 'Read the archives of'));
    assert.match(html, /data-dialogue-topic="origin"/);
    assert.ok(html.includes(conversation.topics[0].body));
    assert.doesNotMatch(html, /<blockquote|<cite|data-city-quest-offer|data-dialogue-next/);
  });

  test(`${lang}: an old visit retains its own words until an explicit replay starts the new adventure`, () => {
    const source = MOSAIC_CHARACTER_MISSIONS.find(mission => mission.id === 'city-chief-unsc-route-v1');
    const historical = MOSAIC_CHARACTER_MISSION_LEGACY.find(mission => mission.id === source.id);
    const mission = { ...source, districtId: 'universe-halo', anchorId: 'universe-halo-core' };
    const record = { ...journalRecord(mission, mission.steps.length, mission.steps.find(step => step.type === 'decision').choices.find(choice => choice.valid).id),
      oldPersonalNote: 'Keep exactly as saved' };
    const progress = { activeId: null, lastMissionId: mission.id, records: { [mission.id]: record } };
    const before = JSON.stringify(progress);
    const legacy = render({ missions: [mission], progress, lang, onReplay() { throw new Error('Reading restarted a story'); } });
    assert.match(legacy, /data-city-contract-legacy/);
    assert.match(legacy, /data-city-contract-replay/);
    assert.doesNotMatch(legacy, /data-city-contract-request/);
    assert.ok(legacy.includes(historical.title[lang]));
    assert.equal(JSON.stringify(progress), before);
    const restarted = restartMosaicCharacterMission(progress, mission, lang);
    assert.equal(restarted.changed, true);
    assert.deepEqual(restarted.progress.records[mission.id].previousStory, record);
    const fresh = render({ missions: [mission], progress: restarted.progress, lang });
    assert.match(fresh, /data-city-contract-request/);
    assert.doesNotMatch(fresh, /data-city-contract-legacy|data-city-contract-replay/);
    assert.ok(fresh.includes(source.title[lang]));
    assert.match(fresh, /<details class="mosaic-contract-previous" data-city-contract-previous="true">/);
    const firstVisit = fresh.slice(fresh.indexOf('data-city-contract-previous'));
    assert.ok(firstVisit.includes(historical.title[lang]));
    assert.ok(firstVisit.includes(historical.steps[0].text[lang]));
    const originalChoice = historical.steps.find(step => step.type === 'decision').choices.find(choice => choice.id === record.choiceId);
    assert.ok(firstVisit.includes(originalChoice.result[lang].replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;')));
    assert.ok(!firstVisit.includes(source.steps.find(step => step.operation).operation.completedText[lang]), 'The first visit invented the newly authored operation');
    assert.equal(JSON.stringify(progress), before);
  });
}

test('authored quest replies precede folded archives; archive text is never turned into an invented speech', () => {
  const archive = { id: 'origin', label: 'Origine', body: 'Un récit d’archive conservé tel quel.' };
  const conversation = { heroId: 'arca_bastion', name: 'Bastion Korr', topics: [archive],
    questExchange: { missionId: 'bastion-journey', title: 'Les voyageurs', line: 'Je reste avec eux jusqu’au lever du jour.' } };
  const renderDialogue = value => renderToStaticMarkup(React.createElement(ResidentDialogue, { conversation: value, lang: 'fr', onClose() {} }));
  const html = renderDialogue(conversation);
  assert.ok(html.indexOf('data-dialogue-quest') < html.indexOf('data-dialogue-topic'));
  assert.match(html, /<details class="mosaic-dialogue-background">/);
  assert.match(html, /data-dialogue-topic="origin"/);
  assert.match(html, /data-dialogue-record="origin"/);
  assert.equal((html.match(/<blockquote>/g) || []).length, 1);
  const backgroundOnly = renderDialogue({ ...conversation, questExchange: undefined });
  assert.match(backgroundOnly, /<details class="mosaic-dialogue-background" open="">/);
  assert.ok(backgroundOnly.includes(archive.body));
  assert.doesNotMatch(backgroundOnly, /<blockquote>|data-dialogue-quest/);
  assert.doesNotThrow(() => renderDialogue({ ...conversation, topics: undefined }));
});
