import test from 'node:test';
import assert from 'node:assert/strict';
import { createCombatDialogLifecycle } from '../src/game/combatDialogLifecycle.js';

const fixture = () => {
  const calls = [];
  const opener = { isConnected: true, inert: false, closest() { return this.inert ? {} : null; }, focus() { calls.push('opener.focus'); } };
  const closeButton = { focus() { calls.push('close.focus'); doc.activeElement = this; } };
  const doc = { activeElement: opener };
  const dialog = {
    open: false, modal: false, ownerDocument: doc,
    show() { assert.equal(this.open, false); this.open = true; this.modal = false; calls.push('show'); },
    showModal() { assert.equal(this.open, false); this.open = true; this.modal = true; calls.push('showModal'); },
    close() { this.open = false; this.modal = false; calls.push('close'); },
    querySelector() { return closeButton; }
  };
  return { calls, opener, doc, dialog, controller: createCombatDialogLifecycle(dialog) };
};

test('live commands can become a paused native modal without InvalidStateError', () => {
  const f = fixture();
  f.controller.sync(true, false);
  f.controller.sync(true, true);
  assert.deepEqual(f.calls, ['show', 'close.focus', 'close', 'showModal', 'close.focus']);
  assert.equal(f.dialog.modal, true);
});

test('returning from paused settings to live commands releases the native modal', () => {
  const f = fixture();
  f.controller.sync(true, true);
  f.controller.sync(true, false);
  assert.equal(f.dialog.open, true);
  assert.equal(f.dialog.modal, false);
  assert.deepEqual(f.calls, ['showModal', 'close.focus', 'close', 'show', 'close.focus']);
});

test('changing panel modality preserves the original invoker for closing', () => {
  const f = fixture();
  f.controller.sync(true, false);
  f.controller.sync(true, true);
  f.controller.sync(false, true);
  assert.equal(f.calls.at(-1), 'opener.focus');
  assert.equal(f.calls.filter(x => x === 'opener.focus').length, 1);
});

test('unchanged open panel does not steal focus from its controls', () => {
  const f = fixture();
  f.controller.sync(true, false);
  const control = {}; f.doc.activeElement = control;
  f.controller.sync(true, false);
  assert.equal(f.doc.activeElement, control);
  assert.deepEqual(f.calls, ['show', 'close.focus']);
});

test('closing an already closed panel is a no-op', () => {
  const f = fixture();
  f.controller.sync(false);
  f.controller.dispose();
  assert.deepEqual(f.calls, []);
});

test('unmount releases a modal and restores focus once', () => {
  const f = fixture();
  f.controller.sync(true, true);
  f.controller.dispose(); f.controller.dispose();
  assert.equal(f.dialog.open, false);
  assert.equal(f.calls.filter(x => x === 'opener.focus').length, 1);
});

test('unmount never focuses a removed invoker or one isolated by another modal', () => {
  for (const property of ['isConnected', 'inert']) {
    const f = fixture();
    f.controller.sync(true, true);
    f.opener[property] = property === 'inert';
    f.controller.dispose();
    assert.equal(f.calls.includes('opener.focus'), false);
  }
});

test('reopening after close captures a new invoker', () => {
  const f = fixture();
  f.controller.sync(true, true); f.controller.sync(false);
  f.doc.activeElement = { isConnected: true, focus: () => f.calls.push('new.focus') };
  f.controller.sync(true, false); f.controller.sync(false);
  assert.equal(f.calls.at(-1), 'new.focus');
});

test('React strict replay can dispose and recreate the native dialog controller', () => {
  const f = fixture();
  f.controller.sync(true, true); f.controller.dispose();
  f.doc.activeElement = f.opener;
  const replay = createCombatDialogLifecycle(f.dialog);
  replay.sync(true, true);
  assert.equal(f.dialog.open, true);
  replay.dispose();
  assert.equal(f.calls.filter(x => x === 'showModal').length, 2);
});
