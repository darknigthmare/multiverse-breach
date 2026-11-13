import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from './fixtures/ssrTestServer.mjs';
import { denseArchive, emptyArchive, archiveProgress, archivePresentation } from './fixtures/universeArchiveData.mjs';

let vite, Reader, Catalog;
before(async () => {
  vite = await createServer({ root: fileURLToPath(new URL('../', import.meta.url)), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ default: Reader } = await vite.ssrLoadModule('/src/components/UniverseArchiveReader.jsx'));
  ({ default: Catalog } = await vite.ssrLoadModule('/src/components/UniverseArchiveCatalog.jsx'));
});
after(async () => { await vite?.close(); });
const read = (section = 'signatures', lang = 'fr', archive = denseArchive) => renderToStaticMarkup(React.createElement(Reader, { archive, lang, section, onSectionChange() {}, onClose() {}, onUniverseChange() {}, universes: [denseArchive.universe, emptyArchive.universe], ...archiveProgress, presentation: archivePresentation(lang) }));
const entries = html => [...html.matchAll(/data-archive-entry="([^"]+)"/g)].map(match => match[1]);

for (const lang of ['fr', 'en']) {
  test(`${lang}: reader provides one modal, roving chapters and bounded character/threat catalogues`, () => {
    const original = JSON.stringify({ archive: denseArchive, progress: archiveProgress });
    const html = read('signatures', lang);
    assert.equal((html.match(/role="dialog"/g) || []).length, 1);
    assert.equal((html.match(/role="tabpanel"/g) || []).length, 1);
    assert.equal((html.match(/role="tab"/g) || []).length, 4);
    assert.equal((html.match(/aria-selected="true"/g) || []).length, 1);
    assert.equal(entries(html).length, 48, 'Only the first 24 records of each source group are mounted');
    assert.ok(entries(html).includes('qa-hero-24'));
    assert.ok(!entries(html).includes('qa-hero-25'));
    assert.match(html, /Lv 8/);
    assert.match(html, /HP 102 ATK 22 DEF 12/);
    assert.ok(html.includes(lang === 'fr' ? 'Notice source numéro 2' : 'Source entry number 2'));
    assert.ok(html.includes(lang === 'fr' ? 'Vestiaire' : 'Wardrobe'));
    assert.equal((html.match(/class="universe-archive-illustration-status"/g) || []).length, 24, 'Missing illustrations keep a full readable status outside the thumbnail');
    assert.ok(html.includes(lang === 'fr' ? 'Personnages indexés' : 'Indexed characters'));
    assert.match(html, /24 \/ 61/);
    assert.equal(JSON.stringify({ archive: denseArchive, progress: archiveProgress }), original, 'Consultation must preserve source records, inventory and progression');
  });
  test(`${lang}: every item family keeps its source count, event item and bounded first page`, () => {
    const html = read('items', lang);
    assert.equal(entries(html).length, 72);
    assert.ok(entries(html).includes('qa-world-24'));
    assert.ok(entries(html).includes('qa-battle-24'));
    assert.ok(entries(html).includes('qa-relic-24'));
    assert.match(html, /data-archive-event-item="qa-event-item"/);
    assert.ok(html.includes(lang === 'fr' ? 'Mémoire de l’événement préservée.' : 'Preserved event memory.'));
    assert.match(html, /rare \/ QA catalogue \/ 3/);
  });
  test(`${lang}: mission, arc and collection dossiers retain their distinct text and progress`, () => {
    const html = read('missions', lang);
    assert.equal(entries(html).length, 72);
    assert.ok(entries(html).includes('qa-mission-24'));
    assert.ok(entries(html).includes('qa-arc-24'));
    assert.ok(entries(html).includes('qa-collection-24'));
    assert.ok(html.includes(lang === 'fr' ? 'Objectif documenté 2' : 'Recorded objective 2'));
    assert.ok(html.includes(lang === 'fr' ? 'Bonus préservé 2' : 'Preserved bonus 2'));
    assert.match(html, /3\/3/);
    assert.match(html, /24 \/ 62/);
  });
  test(`${lang}: living-world reading preserves all eight authoring areas and optional bonus`, () => {
    const html = read('world', lang);
    for (const value of ['QA Atrium','QA habitants','QA conseil','QA témoin','QA faune neutre','QA cercle','QA mémoire','QA scribes','QA papier','QA jetons','QA dossiers','QA encres','QA galeries','QA repas','QA chariot','QA mousse','QA oiseaux','QA orages','QA témoignage conservé.','QA entraide','+5% assist','QA lire le registre.','25% / QA passage ouvert.']) assert.ok(html.includes(value), `Lost living-world content: ${value}`);
    assert.ok(html.includes(lang === 'fr' ? 'Dernière notice du monde vivant.' : 'Last living-world record.'));
  });
}

test('an adjacent universe without a living world falls back to an available chapter', () => {
  const html = read('world', 'en', emptyArchive);
  assert.match(html, /data-archive-section="signatures"/);
  assert.equal((html.match(/role="tab"/g) || []).length, 3);
  assert.match(html, /No playable hero indexed/);
  assert.equal(entries(html).length, 0);
});

test('empty item and mission catalogues expose their absence instead of fabricating entries', () => {
  for (const section of ['items', 'missions']) {
    const html = read(section, 'en', emptyArchive);
    assert.equal(entries(html).length, 0);
    assert.equal((html.match(/No entries indexed in this catalogue/g) || []).length, 3);
    assert.doesNotMatch(html, /data-archive-event-item/);
  }
});

const renderCatalog = (view, source = denseArchive.worldItems) => renderToStaticMarkup(React.createElement(Catalog, { catalogId: 'world', title: 'Local objects', lang: 'en', entries: source, view, onViewChange() {} }, records => records.map(item => React.createElement('article', { key: item.id, 'data-archive-entry': item.id }, item.name.en))));
test('a localized description beyond the mounted page can be found, and no-match keeps an explicit recovery message', () => {
  const html = renderCatalog({ query: 'commerce local 61', page: 6, pageSize: 12 });
  assert.deepEqual(entries(html), ['qa-world-61']);
  assert.match(html, /1–1 \/ 1 · Page 1 \/ 1/);
  assert.match(html, /61 in total/);
  const missing = renderCatalog({ query: 'not-in-this-source' });
  assert.deepEqual(entries(missing), []);
  assert.match(missing, /No results. Change or clear the search./);
});
test('every source entry remains reachable with each page-size option without source mutation', () => {
  const original = JSON.stringify(denseArchive.worldItems);
  for (const pageSize of [12, 24, 48]) {
    const found = [];
    for (let page = 1; page <= Math.ceil(61 / pageSize); page += 1) found.push(...entries(renderCatalog({ pageSize, page })));
    assert.deepEqual(found, denseArchive.worldItems.map(item => item.id));
  }
  assert.equal(JSON.stringify(denseArchive.worldItems), original);
});
test('a stale page clamps to the current source and keeps its exact total', () => {
  const html = renderCatalog({ pageSize: 12, page: 6 }, denseArchive.worldItems.slice(0, 4));
  assert.deepEqual(entries(html), denseArchive.worldItems.slice(0, 4).map(item => item.id));
  assert.match(html, /1–4 \/ 4 · Page 1 \/ 1/);
});
