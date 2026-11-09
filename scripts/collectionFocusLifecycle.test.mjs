import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import { parseAst } from 'rolldown/parseAst';
import { activateModal } from '../src/components/collection/modalIsolation.js';

// Execute the production effect/handlers rather than a copy of the focus logic.
// The DOM and frame scheduler are controlled here; Chromium covers the complete
// React tree, native keyboard input, painting and layout in browserCollectionAlbum.
const source = readFileSync(new URL('../src/components/collection/CollectionHome.jsx', import.meta.url), 'utf8');
const component = parseAst(source, { lang: 'jsx' }).body.find(node => node.type === 'ExportDefaultDeclaration').declaration;
const focusEffect = component.body.body.find(node => node.type === 'ExpressionStatement'
  && node.expression.type === 'CallExpression' && node.expression.callee.name === 'useEffect').expression.arguments[0];
const handlers = Object.fromEntries(component.body.body.flatMap(node => node.type === 'VariableDeclaration' ? node.declarations : [])
  .filter(node => ['openBinder', 'returnToLibrary', 'openCard', 'closeCard'].includes(node.id.name))
  .map(node => [node.id.name, node.init]));

function fixture() {
  const doc = { activeElement: null, addEventListener() {}, removeEventListener() {} };
  const element = (id, parent = null) => {
    const node = { id, parentElement: parent, ownerDocument: doc, children: [], tagName: 'DIV', style: {},
      inert: false, hidden: false, isConnected: true, disabled: false, dataset: {}, scrolls: 0,
      closest(selector) {
        for (let cursor = this; cursor; cursor = cursor.parentElement) {
          if (selector === '[inert]' && cursor.inert || selector === '[hidden]' && cursor.hidden) return cursor;
        }
        return null;
      },
      focus() { if (this.isConnected && !this.disabled && !this.closest('[inert]') && !this.closest('[hidden]')) doc.activeElement = this; },
      scrollIntoView() { this.scrolls += 1; },
      querySelectorAll() { return this.children.filter(child => child.isConnected && child.dataset.cardId); },
      querySelector(selector) { return this.children.find(child => child.isConnected && `#${child.id}` === selector) || null; }
    };
    parent?.children.push(node);
    return node;
  };
  doc.body = element('body'); doc.body.style.overflow = 'auto'; doc.activeElement = doc.body;
  element('app', doc.body);
  const overlay = element('album-overlay', doc.body), dialog = element('album', overlay);
  const library = element('library-panel', dialog), binder = element('binder-panel', dialog);
  const libraryTab = element('library-tab', dialog), tile = element('Nexus de Convergence', library);
  const back = element('return-to-library', binder), heading = element('tcg-binder-title', binder);
  element('tcg-milestones-title', binder);
  const card = element('card', binder); card.dataset.cardId = 'qa-album-0-25';
  const frames = new Map(); let nextFrame = 0, cleanup, detail;
  const state = { view: 'binder', selectedCardId: null, selectedUniverse: 'Nexus de Convergence' };
  const env = {
    pendingFocus: { current: null }, libraryOrigin: { current: 'Nexus de Convergence' }, cardOrigin: { current: null },
    libraryTileRefs: { current: new Map([['Nexus de Convergence', tile]]) }, tabRefs: { current: { library: libraryTab } },
    panelRef: { current: binder }, cards: { [card.dataset.cardId]: { seen: true } },
    setView: value => { state.view = value; }, setSelectedUniverse: value => { state.selectedUniverse = value; },
    setSelectedCardId: value => { state.selectedCardId = value; },
    onUpdateCard: () => assert.fail('Focus navigation must not update collection data'),
    requestAnimationFrame: callback => { frames.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame: id => { frames.delete(id); }
  };
  const context = vm.createContext(env);
  const execute = node => vm.runInContext(`(${source.slice(node.start, node.end)})`, context);
  const effect = execute(focusEffect);
  const actions = Object.fromEntries(Object.entries(handlers).map(([name, node]) => [name, execute(node)]));
  back.onClick = actions.returnToLibrary;
  card.onClick = () => actions.openCard(card.dataset.cardId);
  library.hidden = true;
  activateModal({ overlay, dialog });
  const detach = node => {
    node.isConnected = false;
    if (doc.activeElement === node) doc.activeElement = doc.body;
    for (const child of node.children) detach(child);
    if (node.parentElement) node.parentElement.children = node.parentElement.children.filter(child => child !== node);
  };
  const commit = () => {
    cleanup?.();
    // The real modal lifecycle restores its trigger during unmount cleanup,
    // before the parent's new passive effect schedules any additional frame.
    if (detail && !state.selectedCardId) { detach(detail.overlay); detail.close(); detail = null; }
    library.hidden = state.view !== 'library'; binder.hidden = state.view !== 'binder';
    if (doc.activeElement.closest('[hidden]')) doc.activeElement = doc.body;
    env.panelRef.current = state.view === 'library' ? library : binder;
    if (!detail && state.selectedCardId) {
      const childOverlay = element('card-overlay', doc.body), childDialog = element('card-record', childOverlay);
      const close = element('close-record', childDialog);
      detail = { overlay: childOverlay, close: activateModal({ overlay: childOverlay, dialog: childDialog, initialFocus: close }) };
    }
    cleanup = effect();
  };
  const flush = () => { for (const [id, callback] of [...frames]) { frames.delete(id); callback(); } };
  const enter = () => doc.activeElement.onClick?.();
  const closeRecord = ({ removeCard = false } = {}) => {
    card.focus(); enter(); commit();
    if (removeCard) detach(card);
    actions.closeCard(); commit();
  };
  return { doc, state, env, actions, card, back, tile, binder, heading, frames, commit, flush, enter, closeRecord };
}

test('closing a card then immediately returning cannot reopen the card from a late restoration frame', () => {
  const f = fixture(); f.closeRecord();
  assert.equal(f.doc.activeElement, f.card, 'the actual modal cleanup already restores the card');
  f.back.focus(); f.flush(); f.enter(); f.commit(); f.flush();
  assert.equal(f.state.selectedCardId, null, 'Enter on the return control must not reopen the previous card');
  assert.equal(f.state.view, 'library');
  assert.equal(f.doc.activeElement, f.tile);
});

test('an old fallback frame cannot consume a library request made before its view commits', () => {
  const f = fixture(); f.closeRecord({ removeCard: true });
  f.back.focus(); f.enter();
  const nextRequest = f.env.pendingFocus.current;
  f.flush();
  assert.equal(f.env.pendingFocus.current, nextRequest, 'the uncommitted destination belongs to the next effect');
  f.commit(); f.flush();
  assert.equal(f.doc.activeElement, f.tile);
});

test('a delayed fallback never steals focus that the player moved to another control', () => {
  const f = fixture(); f.closeRecord({ removeCard: true });
  f.back.focus(); f.flush();
  assert.equal(f.doc.activeElement, f.back);
});

test('two pending requests for the same destination remain independently owned', () => {
  const f = fixture();
  f.actions.openBinder('First universe'); f.commit();
  const oldFrame = [...f.frames.values()][0];
  assert.equal(typeof oldFrame, 'function');
  f.actions.openBinder('Second universe');
  const nextRequest = f.env.pendingFocus.current;
  oldFrame();
  assert.equal(f.env.pendingFocus.current, nextRequest, 'same destination must not make the older request own the newer one');
  f.commit(); f.flush();
  assert.equal(f.doc.activeElement, f.binder);
  assert.equal(f.state.selectedUniverse, 'Second universe');
});

test('a cancelled callback replay cannot clear or focus a newer request of the same destination', () => {
  const f = fixture();
  f.actions.openBinder('First universe'); f.commit();
  const cancelledFrame = [...f.frames.values()][0];
  f.actions.openBinder('Second universe'); f.commit();
  const nextRequest = f.env.pendingFocus.current, active = f.doc.activeElement;
  cancelledFrame();
  assert.equal(f.env.pendingFocus.current, nextRequest);
  assert.equal(f.doc.activeElement, active);
  f.flush();
  assert.equal(f.doc.activeElement, f.binder);
});

test('removing the original card still restores the binder heading when the player has not moved focus', () => {
  const f = fixture(); f.closeRecord({ removeCard: true }); f.flush();
  assert.equal(f.doc.activeElement, f.heading);
  assert.equal(f.env.pendingFocus.current, null);
});

test('a pending restoration cannot target a newly inert, hidden or detached destination', () => {
  for (const invalidate of [f => { f.binder.inert = true; }, f => { f.binder.hidden = true; }, f => { f.heading.isConnected = false; }]) {
    const f = fixture(); f.closeRecord({ removeCard: true });
    invalidate(f); f.flush();
    assert.notEqual(f.doc.activeElement, f.heading);
  }
});
