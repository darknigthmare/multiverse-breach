import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'vite';
import { createFighterHeldInputs, synchronizeFighterControlOwners as syncOwners } from '../src/game/fighterControlOwnership.js';
let vite, Fighter;
const source = readFileSync(new URL('../src/components/FighterMode.jsx', import.meta.url), 'utf8');
function section(start, end) {
  const first = source.indexOf(start), last = source.indexOf(end, first);
  assert.ok(first >= 0 && last > first, `Missing component route: ${start}`);
  return source.slice(first, last);
}
// Execute the actual component callbacks with their real engine and closure
// dependencies. No fake trigger method or duplicate implementation of tagging.
const bindRoutes = new Function('engine', 'engineRef', 'inputRef', 'inputOwnersRef', 'heldInputsRef',
  'sessionPausedRef', 'document', 'opponentControl', 'synchronizeFighterControlOwners',
  section('const CONTROL_KEYS = ', 'const DIFFICULTIES = ')
  + section('const clearInputs = () => {', 'const onVisibilityChange = () => {')
  + section('const triggerTag = (index', 'const playerSnapshot = ')
  + '\nreturn { keyboard: onKeyDown, keyUp: onKeyUp, button: triggerTag };');
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineFighter: Fighter } = await vite.ssrLoadModule('/src/game/engineFighter.js'));
});
after(async () => { await vite?.close(); });
const actor = id => ({ id, name: id, universe: 'QA', stats: { hp: 300, atk: 10, def: 1, spd: 10 }, simple: { name: 'Strike', dmg: 1 } });
function fixture(side = 'player', slot = 1, opponentControl = 'p2') {
  const e = new Fighter(900, 500, [0, 1, 2].map(n => actor(`p${n}`)),
    [0, 1, 2].map(n => actor(`c${n}`)), { add() {} }, () => {}, () => {}, { opponentControl });
  e.countdown = 0;
  if (slot === 0) {
    assert.equal(e.requestTag(side, 1), true);
    for (let i = 0; i < 400 && !e.canTag(side, slot); i++) e.update(1 / 60);
  }
  assert.equal(e.canTag(side, slot), true);
  const buffer = { current: { player: {}, cpu: {} } }, owners = { current: null };
  const heldInputsRef = { current: createFighterHeldInputs() };
  const paused = { current: false }, doc = { hidden: false };
  syncOwners(e, buffer, owners, heldInputsRef.current);
  const routes = bindRoutes(e, { current: e }, buffer, owners, heldInputsRef, paused, doc, opponentControl, syncOwners);
  return { e, buffer, routes, paused, doc };
}

function keyboardEvent(key, target = { tagName: 'DIV' }) {
  return { key, target, repeat: false, defaultPrevented: false, preventCount: 0,
    preventDefault() { this.defaultPrevented = true; this.preventCount++; } };
}

for (const control of ['cpu', 'p2']) {
  test(`${control}: real key handlers preserve button Space and Enter activation`, () => {
    const { e, routes, buffer } = fixture('player', 1, control);
    try {
      for (const tagName of ['BUTTON', 'SPAN']) for (const key of [' ', 'Enter']) {
        const target = { tagName, closest: selector => selector === 'button' ? { tagName: 'BUTTON' } : null };
        const down = keyboardEvent(key, target), up = keyboardEvent(key, target);
        const before = JSON.stringify({ player: e.getActive('player'), cpu: e.getActive('cpu'), inputs: buffer.current });
        routes.keyboard(down); routes.keyUp(up);
        assert.equal(down.preventCount, 0, `${key}: keydown must keep native activation`);
        assert.equal(up.preventCount, 0, `${key}: keyup must keep native activation`);
        assert.equal(JSON.stringify({ player: e.getActive('player'), cpu: e.getActive('cpu'), inputs: buffer.current }), before);
      }
    } finally { e.dispose(); }
  });

  test(`${control}: paused or hidden keyboard arrows remain available to menus`, () => {
    const { e, routes, buffer, paused, doc } = fixture('player', 1, control);
    try {
      for (const reason of ['shell pause', 'hidden page']) {
        paused.current = reason === 'shell pause'; doc.hidden = reason === 'hidden page';
        const before = JSON.stringify({ player: e.getActive('player'), cpu: e.getActive('cpu'), inputs: buffer.current });
        for (const key of ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']) {
          const event = keyboardEvent(key, { tagName: 'BUTTON', closest: () => null });
          routes.keyboard(event);
          assert.equal(event.preventCount, 0, `${reason}: ${key} must reach menu navigation`);
        }
        assert.equal(JSON.stringify({ player: e.getActive('player'), cpu: e.getActive('cpu'), inputs: buffer.current }), before);
      }
    } finally { e.dispose(); }
  });

  test(`${control}: key release clears a held command after focus moves into a field or paused menu`, () => {
    const { e, routes, buffer, paused } = fixture('player', 1, control);
    const side = control === 'p2' ? 'cpu' : 'player';
    try {
      for (const target of [
        { tagName: 'INPUT' }, { tagName: 'TEXTAREA' }, { tagName: 'SELECT' },
        { tagName: 'DIV', isContentEditable: true },
        { tagName: 'BUTTON', closest: () => ({}) }
      ]) {
        paused.current = false;
        routes.keyboard(keyboardEvent('ArrowLeft'));
        assert.equal(buffer.current[side].left, true);
        e.setSideInput(side, buffer.current[side]);
        paused.current = true;
        const release = keyboardEvent('ArrowLeft', target);
        routes.keyUp(release);
        assert.equal(release.preventCount, 0, `${target.tagName}: keyup must remain native`);
        assert.equal(Boolean(buffer.current[side].left), false, `${target.tagName}: stale movement must be released`);
        e.setSideInput(side, buffer.current[side]);
        assert.equal(e.inputs[side].left, false);
      }
    } finally { e.dispose(); }
  });

  test(`${control}: actual gameplay keys work again after leaving a menu`, () => {
    const { e, routes, buffer, paused } = fixture('player', 1, control);
    try {
      paused.current = true;
      const menuKey = keyboardEvent('f'); routes.keyboard(menuKey);
      assert.equal(menuKey.preventCount, 0); assert.equal(e.getActive('player').action, null);
      paused.current = false;
      const move = keyboardEvent('d'); routes.keyboard(move);
      assert.equal(move.preventCount, 1); assert.equal(buffer.current.player.right, true);
      routes.keyUp(keyboardEvent('d')); assert.equal(Boolean(buffer.current.player.right), false);
      const attack = keyboardEvent('f'); routes.keyboard(attack);
      assert.equal(attack.preventCount, 1); assert.equal(e.getActive('player').state, 'attack');
      assert.ok(e.getActive('player').action);
    } finally { e.dispose(); }
  });
}
function invoke(routes, route, side, slot) {
  if (route === 'button') routes.button(slot, side);
  else routes.keyboard({ key: String((side === 'player' ? 1 : 7) + slot), repeat: false,
    target: { tagName: 'DIV' }, preventDefault() {} });
}
for (const route of ['keyboard', 'button']) for (const side of ['player', 'cpu']) {
  for (const slot of [0, 1, 2]) test(`${route} ${side}: real screen callback selects slot ${slot + 1}`, () => {
    const { e, buffer, routes } = fixture(side, slot);
    try {
      const other = side === 'player' ? 'cpu' : 'player';
      const target = e.getTeam(side).fighters[slot], opponent = e.getActive(other);
      const tags = e.stats[side].tags;
      buffer.current[side] = { guard: true }; buffer.current[other] = { left: true };
      invoke(routes, route, side, slot);
      assert.equal(e.getActive(side), target); assert.equal(e.getActive(other), opponent);
      assert.equal(e.stats[side].tags, tags + 1); assert.equal(e.getTeam(side).tagCooldown, 5.5);
      assert.deepEqual(buffer.current[side], {}); assert.deepEqual(buffer.current[other], { left: true });
    } finally { e.dispose(); }
  });
  test(`${route} ${side}: pause, hidden page and native hit-stop refuse tags`, () => {
    for (const reason of ['shell', 'hidden', 'impact']) {
      const { e, routes, paused, doc } = fixture(side, 1);
      try {
        if (reason === 'shell') paused.current = true;
        if (reason === 'hidden') doc.hidden = true;
        if (reason === 'impact') e.hitStop = 0.1;
        const old = e.getActive(side), tags = e.stats[side].tags;
        invoke(routes, route, side, 1);
        assert.equal(e.getActive(side), old); assert.equal(e.stats[side].tags, tags);
        assert.equal(e.getTeam(side).tagCooldown, 0);
      } finally { e.dispose(); }
    }
  });
}
