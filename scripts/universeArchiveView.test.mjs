import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { canInspectUniverseArchive, getArchiveNeighbour, normalizeArchiveLivingWorld } from '../src/game/universeArchiveView.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let vite;
let UniverseArchiveDialog;
let OcCampaignChronicle;
let LORE_DB;
let OC_CAMPAIGN;
let OC_CAMPAIGN_CHAPTERS;
let OC_CAMPAIGN_MISSIONS;

before(async () => {
  vite = await createServer({ root, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ default: UniverseArchiveDialog } = await vite.ssrLoadModule('/src/components/UniverseArchiveDialog.jsx?archive-tests'));
  ({ OcCampaignChronicle } = await vite.ssrLoadModule('/src/components/HubScreen.jsx?archive-tests'));
  ({ LORE_DB } = await vite.ssrLoadModule('/src/game/lore.js'));
  ({ OC_CAMPAIGN, OC_CAMPAIGN_CHAPTERS, OC_CAMPAIGN_MISSIONS } = await vite.ssrLoadModule('/src/game/ocCampaign.js'));
});
after(async () => { await vite?.close(); });

test('a visible universe dossier can be consulted without unlocking its missions', () => {
  const lore = { Nexus: {}, Alien: {} };
  const visible = universe => universe !== 'Alien';
  assert.equal(canInspectUniverseArchive('Nexus', lore, visible), true);
  assert.equal(canInspectUniverseArchive('Alien', lore, visible), false);
  for (const id of [null, undefined, '', 'missing', '__proto__', 'toString']) {
    assert.equal(canInspectUniverseArchive(id, lore, visible), false);
  }
  assert.equal(canInspectUniverseArchive('Nexus', null), false);
  assert.deepEqual(lore, { Nexus: {}, Alien: {} }, 'dossier inspection must not mutate game content');
});

test('previous/next dossier navigation respects its filtered catalogue and bounds', () => {
  const worlds = ['Nexus', 'Alien', 'Stargate'];
  assert.equal(getArchiveNeighbour(worlds, 'Alien', -1), 'Nexus');
  assert.equal(getArchiveNeighbour(worlds, 'Alien', 1), 'Stargate');
  assert.equal(getArchiveNeighbour(worlds, 'Nexus', -1), null);
  assert.equal(getArchiveNeighbour(worlds, 'Stargate', 1), null);
  assert.equal(getArchiveNeighbour(worlds, 'hidden', 1), null);
  assert.equal(getArchiveNeighbour([], 'Nexus', 1), null);
  assert.equal(getArchiveNeighbour(null, 'Nexus', 1), null);
  assert.equal(getArchiveNeighbour(worlds, 'Alien', 0), null);
});

test('incomplete optional living worlds normalize safely without inventing lore', () => {
  const source = {
    title: 'Unmodified source text',
    population: { inhabitants: ['One', null], supportNpcs: [null, { id: 'npc', name: 'Keeper' }] },
    society: { economy: null },
    locations: null,
    heroRelationships: [null, { id: 'bond', bond: 'Source bond without bonus' }]
  };
  const original = structuredClone(source);
  const result = normalizeArchiveLivingWorld(source);
  assert.deepEqual(source, original);
  assert.equal(result.title, source.title);
  assert.deepEqual(result.population.inhabitants, ['One']);
  assert.deepEqual(result.population.leaders, []);
  assert.deepEqual(result.population.supportNpcs, [{ id: 'npc', name: 'Keeper' }]);
  assert.deepEqual(result.locations, []);
  assert.deepEqual(result.society.economy.exports, []);
  assert.deepEqual(result.society.economy.imports, []);
  assert.deepEqual(result.ecology.threats, []);
  assert.equal(result.society.economy.currency, undefined);
  assert.equal(result.heroRelationships[0].gameplayBonus, undefined);
  for (const value of [null, undefined, false, 'missing', []]) assert.equal(normalizeArchiveLivingWorld(value), null);
});

test('all registered living worlds support every optional array read used by the dossier', () => {
  for (const [universe, lore] of Object.entries(LORE_DB)) {
    assert.equal(canInspectUniverseArchive(universe, LORE_DB), true);
    const world = normalizeArchiveLivingWorld(lore.livingWorld);
    if (!world) continue;
    for (const key of ['locations', 'dialogues', 'heroRelationships', 'sideQuests', 'randomEvents', 'codexEntries']) {
      assert.ok(Array.isArray(world[key]), `${universe}.${key}`);
      assert.ok(world[key].every(entry => entry != null));
    }
    for (const [section, keys] of [
      ['population', ['inhabitants', 'leaders', 'supportNpcs', 'neutralCreatures']],
      ['society', ['minorFactions', 'beliefs', 'professions', 'resources', 'food', 'vehicles']],
      ['ecology', ['flora', 'fauna', 'threats']]
    ]) for (const key of keys) assert.ok(Array.isArray(world[section][key]), `${universe}.${section}.${key}`);
    assert.ok(Array.isArray(world.society.economy.exports));
    assert.ok(Array.isArray(world.society.economy.imports));
  }
});

test('universe dialog SSR has one labeled internal dialog and preserves supplied content', () => {
  const html = renderToStaticMarkup(React.createElement(UniverseArchiveDialog, { universe: 'Nexus', cleared: false, onClose() {} },
    React.createElement('h2', { id: 'universe-archive-title' }, 'Nexus dossier'),
    React.createElement('button', { 'data-archive-close': true }, 'Fermer'),
    React.createElement('p', {}, 'Exact source content')));
  assert.equal((html.match(/role="dialog"/g) || []).length, 1);
  assert.match(html, /aria-modal="true"/);
  assert.match(html, /aria-labelledby="universe-archive-title"/);
  assert.match(html, /data-universe-archive="Nexus"/);
  assert.match(html, /Exact source content/);
});

test('OC chronicle initially renders only acts, with explicit section controls and live progress', () => {
  const html = renderToStaticMarkup(React.createElement(OcCampaignChronicle, {
    lang: 'fr', completedStages: [], currentChapter: OC_CAMPAIGN_CHAPTERS[0], isStageUnlocked: () => true, onOpenBriefing() {}
  }));
  assert.equal((html.match(/data-chronicle-section=/g) || []).length, 1);
  assert.match(html, /data-chronicle-section="acts"/);
  assert.doesNotMatch(html, /data-chronicle-section="(?:locks|dossier)"/);
  assert.match(html, /ACTES/);
  assert.match(html, /VERROUS/);
  assert.match(html, /CHAPITRE ET DOSSIER/);
  assert.match(html, /aria-pressed="true"/);
  assert.ok(html.includes(OC_CAMPAIGN.title.fr));
  assert.ok(html.includes(`0/${OC_CAMPAIGN_MISSIONS.length} operations stabilisees`));
});

test('OC chronicle resolves a missing current chapter from the canonical campaign without crashing', () => {
  const html = renderToStaticMarkup(React.createElement(OcCampaignChronicle, {
    lang: 'en', completedStages: [], currentChapter: null, isStageUnlocked: () => false, onOpenBriefing() {}
  }));
  assert.match(html, /data-chronicle-section="acts"/);
  assert.ok(html.includes(OC_CAMPAIGN.title.en));
});

test('Codex and collection use one modal with live counts and no stale encrypted duplicate dossier', () => {
  const source = readFileSync(path.join(root, 'src/components/HubScreen.jsx'), 'utf8');
  assert.equal((source.match(/<UniverseArchiveDialog /g) || []).length, 1);
  assert.match(source, /data-universe-open=\{universe\} aria-haspopup="dialog" onClick=\{\(\) => openUniverseArchive\(universe\)\}/);
  assert.match(source, /openUniverseArchive\(universe\); sound\.playSfx\('coin'\)/);
  assert.match(source, /codexUniverseKeys\.length\} univers affichés/);
  assert.match(source, /selectedUniverseArchive\.worldItems\.length\} objets/);
  assert.doesNotMatch(source, /const encryptString/);
  assert.doesNotMatch(source, /\b(?:522|525)\s+univers/);
  for (const section of ['acts', 'locks', 'dossier']) assert.ok(source.includes(`chronicleSection === '${section}' && (`));
  for (const section of ['signatures', 'items', 'world', 'missions']) assert.ok(source.includes(`universeArchiveSection === '${section}' &&`));
  assert.match(source, /plaque\?\.origin/);
  assert.match(source, /Adaptation Breach/);
});

test('OC chronicle resume after six locks targets Act V and not a completed mission', () => {
  const html = renderToStaticMarkup(React.createElement(OcCampaignChronicle, {
    lang: 'fr', completedStages: OC_CAMPAIGN_MISSIONS.slice(0, 6).map(mission => mission.id), currentChapter: null, isStageUnlocked: () => true, onOpenBriefing() {}
  }));
  assert.match(html, /data-campaign-resume-stage="8807"/);
  assert.match(html, /CONTINUER LA CAMPAGNE/);
  assert.match(html, /Conclusion non atteinte/);
});

test('OC chronicle distinguishes twelve operations from a chosen ending', () => {
  const props = { lang: 'fr', completedStages: OC_CAMPAIGN_MISSIONS.map(mission => mission.id), currentChapter: null, isStageUnlocked: () => true, onOpenBriefing() {}, onReplayEnding() {} };
  const pending = renderToStaticMarkup(React.createElement(OcCampaignChronicle, props));
  assert.match(pending, /data-campaign-resume-stage="8812"/);
  assert.match(pending, /CHOISIR UNE CONCLUSION/);
  assert.match(pending, /CONCLUSION A CHOISIR/);
  const complete = renderToStaticMarkup(React.createElement(OcCampaignChronicle, { ...props, campaignProgress: { endingId: 'seal' } }));
  assert.match(complete, /REJOUER LA CONCLUSION/);
  assert.match(complete, /Conclusion inscrite/);
  assert.doesNotMatch(complete, /CONCLUSION A CHOISIR/);
});
