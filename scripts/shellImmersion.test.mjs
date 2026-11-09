import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchesCollectionCard, buildCollectionUniverseSummaries } from '../src/components/collection/collectionView.js';
import { activateModal } from '../src/components/collection/modalIsolation.js';
import { getCardArtPresentation } from '../src/components/cards/cardArtPresentation.js';
import { MIRELLE_COMPLETE_SPRITES } from '../src/game/spriteAssets.js';

const definitions = [
  { id: 'mirelle', universe: 'Nexus', rarityId: 'rare', kind: 'hero', canonStatus: 'nexus-variant', searchText: 'Mirelle Suture Nexus guérisseuse' },
  { id: 'bastion', universe: 'Nexus', rarityId: 'epic', kind: 'hero', canonStatus: 'nexus-variant', searchText: 'Bastion Nexus' },
  { id: 'blade', universe: 'Halo', rarityId: 'rare', kind: 'equipment', canonStatus: 'canon', searchText: 'Épée Halo' },
  { id: 'ship', universe: 'Stargate', rarityId: 'anomaly', kind: 'archive', canonStatus: 'canon', searchText: 'Vaisseau Stargate' }
];
const cards = { mirelle: { favorite: true }, blade: { favorite: false } };

test('Owned in the library excludes empty universes without changing completion totals', () => {
  const result = buildCollectionUniverseSummaries(definitions, cards, { ownedOnly: true });
  assert.deepEqual(result.filter(item => item.matching).map(item => item.universe), ['Nexus', 'Halo']);
  const nexus = result.find(item => item.universe === 'Nexus');
  assert.equal(nexus.total, 2);
  assert.equal(nexus.owned, 1);
  assert.equal(nexus.matching, 1);
  assert.equal(result.find(item => item.universe === 'Stargate').matching, 0);
});

test('every library filter has the same results as entering each binder', () => {
  const scenarios = [
    {}, { ownedOnly: true }, { favoritesOnly: true }, { rarity: 'rare' },
    { kind: 'equipment' }, { canonStatus: 'canon' }, { query: 'GUERISSEUSE' },
    { query: 'epee', rarity: 'rare', ownedOnly: true }, { favoritesOnly: true, canonStatus: 'canon' }
  ];
  for (const filters of scenarios) {
    const summaries = buildCollectionUniverseSummaries(definitions, cards, filters);
    for (const summary of summaries) {
      const inBinder = definitions.filter(definition => matchesCollectionCard(definition, cards, { ...filters, selectedUniverse: summary.universe }));
      assert.equal(summary.matching, inBinder.length, `${summary.universe} / ${JSON.stringify(filters)}`);
    }
  }
  assert.equal(buildCollectionUniverseSummaries(definitions, cards, { query: 'guérisseuse' }).find(item => item.matching)?.universe, 'Nexus');
});

test('filtering preserves collection entries and the full source catalogue', () => {
  const before = JSON.stringify({ definitions, cards });
  buildCollectionUniverseSummaries(definitions, cards, { ownedOnly: true, favoritesOnly: true });
  assert.equal(JSON.stringify({ definitions, cards }), before);
});

test('Mirelle presents one pose from the registered 4 by 10 collection sheet', () => {
  const art = { image: MIRELLE_COMPLETE_SPRITES.nexusCollection, source: 'project-sprite' };
  const preview = getCardArtPresentation(art);
  assert.equal(preview.sheet, art.image, 'original sheet stays available for provenance');
  assert.equal(preview.style.backgroundSize, '400% 1000%');
  assert.equal(preview.style.backgroundPosition, '0% 0%');
  assert.equal(art.columns, undefined, 'presentation never mutates catalogue metadata');
});

test('portraits stay whole and explicit cosmetic atlases use their authored row', () => {
  const portrait = getCardArtPresentation({ image: '/portraits/hero.png', source: 'project-portrait' });
  assert.equal(portrait.sheet, null);
  assert.equal(portrait.style, null);
  const cosmetic = getCardArtPresentation({ sheet: '/effects.png', columns: 4, rows: 3, row: 1 });
  assert.equal(cosmetic.style.backgroundSize, '400% 300%');
  assert.equal(cosmetic.style.backgroundPosition, '0% 50%');
  assert.equal(getCardArtPresentation({}).src, null);
});

function modalFixture() {
  const handlers = new Set();
  const doc = { activeElement: null, addEventListener: (_, fn) => handlers.add(fn), removeEventListener: (_, fn) => handlers.delete(fn) };
  function element(parent = null) {
    const node = {
      ownerDocument: doc, parentElement: parent, children: [], inert: false, tagName: 'DIV', isConnected: true,
      style: {}, tabIndex: 0, getClientRects: () => [{}], querySelectorAll: () => [],
      closest() { let cursor = this; while (cursor) { if (cursor.inert) return cursor; cursor = cursor.parentElement; } return null; },
      focus() { doc.activeElement = this; }
    };
    parent?.children.push(node);
    return node;
  }
  doc.body = element(); doc.body.style.overflow = 'auto';
  const app = element(doc.body), trigger = element(app), hidden = element(doc.body);
  hidden.inert = true; trigger.focus();
  const dispatch = key => { const event = { key, prevented: false, preventDefault() { this.prevented = true; }, stopPropagation() {} }; for (const fn of handlers) fn(event); return event; };
  return { doc, app, trigger, hidden, element, dispatch, handlers };
}

test('modal Escape dismisses once, isolates the game and restores prior focus and scroll', () => {
  const f = modalFixture();
  const overlay = f.element(f.doc.body), dialog = f.element(overlay), close = f.element(dialog);
  let dismissals = 0;
  const cleanup = activateModal({ overlay, dialog, initialFocus: close, onClose: () => dismissals++ });
  assert.equal(f.app.inert, true);
  assert.equal(f.doc.activeElement, close);
  assert.equal(f.doc.body.style.overflow, 'hidden');
  assert.equal(f.dispatch('Escape').prevented, true);
  assert.equal(dismissals, 1);
  cleanup();
  assert.equal(f.app.inert, false);
  assert.equal(f.hidden.inert, true, 'pre-existing inert state survives');
  assert.equal(f.doc.activeElement, f.trigger);
  assert.equal(f.doc.body.style.overflow, 'auto');
  assert.equal(f.handlers.size, 0);
});

test('a card dialog suspends its album and closing it restores the selected card focus', () => {
  const f = modalFixture();
  const album = f.element(f.doc.body), albumDialog = f.element(album), card = f.element(albumDialog);
  let albumCloses = 0, cardCloses = 0;
  const closeAlbum = activateModal({ overlay: album, dialog: albumDialog, onClose: () => albumCloses++ });
  card.focus();
  const overlay = f.element(f.doc.body), dialog = f.element(overlay);
  const closeCard = activateModal({ overlay, dialog, onClose: () => cardCloses++ });
  assert.equal(album.inert, true);
  f.dispatch('Escape');
  assert.equal(albumCloses, 0);
  assert.equal(cardCloses, 1);
  closeCard();
  assert.equal(album.inert, false);
  assert.equal(f.doc.activeElement, card);
  assert.equal(f.app.inert, true);
  closeAlbum();
  assert.equal(f.app.inert, false);
  assert.equal(f.doc.activeElement, f.trigger);
});

test('simultaneously closing a catalogue and its dossier cannot leave the game inert', () => {
  const f = modalFixture();
  const outer = f.element(f.doc.body), outerDialog = f.element(outer);
  const closeOuter = activateModal({ overlay: outer, dialog: outerDialog });
  const inner = f.element(f.doc.body), innerDialog = f.element(inner);
  const closeInner = activateModal({ overlay: inner, dialog: innerDialog });
  closeOuter();
  assert.equal(f.app.inert, true, 'child still owns an isolation lock');
  outer.isConnected = false; outerDialog.isConnected = false;
  closeInner();
  assert.equal(f.app.inert, false);
  assert.equal(f.doc.body.style.overflow, 'auto');
  assert.equal(f.doc.activeElement, f.trigger);
});
