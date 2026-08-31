import assert from 'node:assert/strict';
import test from 'node:test';
import { createLocalSaveGuard } from '../src/game/localSaveGuard.js';

const makeStorage = initial => {
  const values = new Map(initial === undefined ? [] : [['save', initial]]);
  return {
    failRead: false,
    failWrite: false,
    writes: 0,
    getItem(key) {
      if (this.failRead) throw new Error('SecurityError');
      return values.get(key) ?? null;
    },
    setItem(key, raw) {
      this.writes++;
      if (this.failWrite) throw new Error('QuotaExceededError');
      values.set(key, String(raw));
    },
    removeItem(key) { values.delete(key); }
  };
};

test('two guards cannot sequentially overwrite a save from a stale baseline', () => {
  const storage = makeStorage('{"coins":100}');
  const first = createLocalSaveGuard(storage, 'save');
  const stale = createLocalSaveGuard(storage, 'save');
  assert.deepEqual(first.write({ coins: 80 }), { saved: true });
  assert.deepEqual(stale.check(), { ok: false, reason: 'save-conflict' });
  assert.deepEqual(stale.write({ coins: 95 }), { saved: false, reason: 'save-conflict' });
  assert.equal(storage.getItem('save'), '{"coins":80}');
  assert.equal(storage.writes, 1);
});

test('check never silently adopts a newer save; rebase must explicitly accept it', () => {
  const storage = makeStorage('{"coins":100}');
  const guard = createLocalSaveGuard(storage, 'save');
  storage.setItem('save', '{"coins":60}');
  assert.deepEqual(guard.check(), { ok: false, reason: 'save-conflict' });
  assert.deepEqual(guard.check(), { ok: false, reason: 'save-conflict' });
  assert.deepEqual(guard.write({ coins: 60 }), { saved: false, reason: 'save-conflict' });
  assert.deepEqual(guard.rebase(), { ok: true });
  assert.deepEqual(guard.write({ coins: 40 }), { saved: true });
  assert.equal(storage.getItem('save'), '{"coins":40}');
});

test('quota failure does not advance baseline and a later write can retry', () => {
  const storage = makeStorage('{"coins":100}');
  const guard = createLocalSaveGuard(storage, 'save');
  storage.failWrite = true;
  assert.deepEqual(guard.write({ coins: 80 }), { saved: false, reason: 'persistence-failed' });
  assert.equal(storage.getItem('save'), '{"coins":100}');
  assert.deepEqual(guard.check(), { ok: true });
  storage.failWrite = false;
  assert.deepEqual(guard.write({ coins: 80 }), { saved: true });
  assert.deepEqual(guard.check(), { ok: true });
});

test('raw baseline is opaque even when corrupt or differently formatted JSON', () => {
  const storage = makeStorage('corrupt { json');
  const guard = createLocalSaveGuard(storage, 'save');
  assert.deepEqual(guard.check(), { ok: true });
  assert.deepEqual(guard.write({ repaired: true }), { saved: true });
  storage.setItem('save', '{ "repaired": true }');
  assert.deepEqual(guard.check(), { ok: false, reason: 'save-conflict' });
});

test('identical writes are successful no-ops, including while storage quota is exhausted', () => {
  const storage = makeStorage();
  const guard = createLocalSaveGuard(storage, 'save');
  assert.deepEqual(guard.write({ coins: 100 }), { saved: true });
  storage.failWrite = true;
  assert.deepEqual(guard.write({ coins: 100 }), { saved: true });
  assert.deepEqual(guard.write({ coins: 100 }), { saved: true });
  assert.equal(storage.writes, 1);
  assert.deepEqual(guard.check(), { ok: true });
});

test('storage removal is a conflicting raw change until an explicit rebase', () => {
  const storage = makeStorage('{"coins":100}');
  const guard = createLocalSaveGuard(storage, 'save');
  storage.removeItem('save');
  assert.deepEqual(guard.write({ coins: 80 }), { saved: false, reason: 'save-conflict' });
  assert.deepEqual(guard.rebase(), { ok: true });
  assert.deepEqual(guard.write({ coins: 0 }), { saved: true });
});

test('construction and checks fail closed without throwing when storage cannot be read', () => {
  const storage = makeStorage('{"coins":100}');
  storage.failRead = true;
  const guard = createLocalSaveGuard(storage, 'save');
  assert.deepEqual(guard.check(), { ok: false, reason: 'persistence-failed' });
  assert.deepEqual(guard.write({ coins: 80 }), { saved: false, reason: 'persistence-failed' });
  storage.failRead = false;
  assert.deepEqual(guard.check(), { ok: false, reason: 'persistence-failed' });
  assert.deepEqual(guard.rebase(), { ok: true });
  assert.deepEqual(guard.write({ coins: 80 }), { saved: true });
  assert.deepEqual(createLocalSaveGuard(null, 'save').write({}), { saved: false, reason: 'persistence-failed' });
});

test('transient read and rebase failures preserve the previous accepted baseline', () => {
  const storage = makeStorage('{"coins":100}');
  const guard = createLocalSaveGuard(storage, 'save');
  storage.failRead = true;
  assert.deepEqual(guard.check(), { ok: false, reason: 'persistence-failed' });
  assert.deepEqual(guard.rebase(), { ok: false, reason: 'persistence-failed' });
  assert.deepEqual(guard.write({ coins: 80 }), { saved: false, reason: 'persistence-failed' });
  storage.failRead = false;
  assert.deepEqual(guard.check(), { ok: true });
  assert.equal(storage.writes, 0);
});

test('serialization errors never escape or advance the save baseline', () => {
  const storage = makeStorage('{"coins":100}');
  const guard = createLocalSaveGuard(storage, 'save');
  const circular = {};
  circular.self = circular;
  for (const payload of [circular, { big: 1n }, undefined, () => {}, Symbol('save')]) {
    assert.deepEqual(guard.write(payload), { saved: false, reason: 'persistence-failed' });
    assert.deepEqual(guard.check(), { ok: true });
  }
  assert.equal(storage.writes, 0);
  assert.deepEqual(guard.write({ coins: 80 }), { saved: true });
});

test('a toJSON side effect cannot overwrite a storage change during serialization', () => {
  const storage = makeStorage('{"coins":100}');
  const guard = createLocalSaveGuard(storage, 'save');
  const payload = {
    toJSON() {
      storage.setItem('save', '{"coins":20}');
      return { coins: 80 };
    }
  };
  assert.deepEqual(guard.write(payload), { saved: false, reason: 'save-conflict' });
  assert.equal(storage.getItem('save'), '{"coins":20}');
  assert.deepEqual(guard.check(), { ok: false, reason: 'save-conflict' });
});
