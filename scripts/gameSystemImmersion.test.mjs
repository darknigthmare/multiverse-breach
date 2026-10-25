import assert from 'node:assert/strict';
import test from 'node:test';
import { createBattleCompletionGate } from '../src/game/battleCompletionGate.js';
import { createGameDialogQueue } from '../src/game/gameDialogQueue.js';
import { applyDisplayPreferences, DEFAULT_DISPLAY_PREFERENCES, DISPLAY_PREFERENCES_KEY, normalizeDisplayPreferences, readDisplayPreferences, saveDisplayPreferences } from '../src/game/displayPreferences.js';

test('campaign progression accepts one outcome per launch and rejects stale callbacks after relaunch', () => {
  const gate = createBattleCompletionGate();
  const first = gate.begin();
  assert.equal(gate.claim(first, 'unknown'), false);
  assert.equal(gate.claim(first, 'victory'), true);
  assert.equal(gate.claim(first, 'victory'), false);
  assert.equal(gate.claim(first, 'quit'), false);
  const replay = gate.begin();
  assert.equal(gate.claim(first, 'defeat'), false);
  assert.equal(gate.claim(replay, 'defeat'), true);
  const abandoned = gate.begin();
  gate.invalidate();
  assert.equal(gate.claim(abandoned, 'victory'), false);
});

test('modal decisions are serialized; a stale confirm cannot authorize the next decision', async () => {
  const shown = [];
  const queue = createGameDialogQueue(dialog => shown.push(dialog));
  const first = queue.request({ kind: 'confirm', title: 'Reset' });
  const second = queue.request({ kind: 'input', title: 'Import' });
  const firstId = shown[0].id;
  assert.equal(shown.length, 1);
  assert.equal(queue.settle(firstId, null), true);
  assert.equal(await first, null);
  assert.equal(shown[1].title, 'Import');
  assert.equal(queue.settle(firstId, true), false);
  assert.equal(queue.settle(shown[1].id, 'player-save'), true);
  assert.equal(await second, 'player-save');
  assert.equal(shown.at(-1), null);
});

test('unmount cancels pending decisions without confirming destructive actions', async () => {
  const queue = createGameDialogQueue(() => {});
  const decisions = [queue.request({ kind: 'confirm' }), queue.request({ kind: 'input' })];
  queue.cancelAll();
  assert.deepEqual(await Promise.all(decisions), [null, null]);
});

test('invalid or unavailable display preferences use a readable bounded default', () => {
  assert.deepEqual(normalizeDisplayPreferences(null), DEFAULT_DISPLAY_PREFERENCES);
  assert.deepEqual(readDisplayPreferences({ getItem: () => '{invalid' }), DEFAULT_DISPLAY_PREFERENCES);
  assert.deepEqual(readDisplayPreferences({ getItem: () => { throw new Error('denied'); } }), DEFAULT_DISPLAY_PREFERENCES);
  const options = normalizeDisplayPreferences({ textScale: 99, hudScale: -4, safeArea: Infinity, contrast: 'unknown', motion: 'unknown' });
  assert.deepEqual(options, { version: 1, textScale: 1.5, hudScale: .9, safeArea: 12, contrast: 'standard', motion: 'system' });
});

test('display choices persist separately from the save and round-trip without altering progression', () => {
  const values = new Map([['multiverse_breach_save_v2', 'untouched']]);
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  const chosen = { textScale: 1.3, hudScale: 1.2, safeArea: 20, contrast: 'high', motion: 'reduced' };
  assert.equal(saveDisplayPreferences(chosen, storage).ok, true);
  assert.equal(values.get('multiverse_breach_save_v2'), 'untouched');
  assert.equal(values.size, 2);
  assert.ok(values.has(DISPLAY_PREFERENCES_KEY));
  assert.deepEqual(readDisplayPreferences(storage), { version: 1, ...chosen });
  const properties = new Map();
  const root = { style: { setProperty: (key, value) => properties.set(key, value) }, dataset: {} };
  applyDisplayPreferences(chosen, root);
  assert.equal(properties.get('--game-safe-area'), '20px');
  assert.equal(properties.get('--game-text-scale'), '1.3');
  assert.equal(root.dataset.gameContrast, 'high');
  assert.equal(root.dataset.gameMotion, 'reduced');
  assert.equal(saveDisplayPreferences(chosen, null).ok, false);
});
