import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'vite';
import { synchronizeFighterControlOwners as syncOwners } from '../src/game/fighterControlOwnership.js';
let vite, Fighter;
const source = readFileSync(new URL('../src/components/FighterMode.jsx', import.meta.url), 'utf8');
function section(start, end) {
  const first = source.indexOf(start), last = source.indexOf(end, first);
  assert.ok(first >= 0 && last > first, `Missing component route: ${start}`);
  return source.slice(first, last);
}
// Execute the actual component callbacks with their real engine and closure
// dependencies. No fake trigger method or duplicate implementation of tagging.
const bindRoutes = new Function('engine', 'engineRef', 'inputRef', 'inputOwnersRef',
  'sessionPausedRef', 'document', 'opponentControl', 'synchronizeFighterControlOwners',
  section('const CONTROL_KEYS = ', 'const DIFFICULTIES = ')
  + section('const clearInputs = () => {', 'const onKeyUp = event => {')
  + section('const triggerTag = (index', 'const playerSnapshot = ')
  + '\nreturn { keyboard: onKeyDown, button: triggerTag };');
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineFighter: Fighter } = await vite.ssrLoadModule('/src/game/engineFighter.js'));
});
after(async () => { await vite?.close(); });
const actor = id => ({ id, name: id, universe: 'QA', stats: { hp: 300, atk: 10, def: 1, spd: 10 }, simple: { name: 'Strike', dmg: 1 } });
function fixture(side, slot) {
  const e = new Fighter(900, 500, [0, 1, 2].map(n => actor(`p${n}`)),
    [0, 1, 2].map(n => actor(`c${n}`)), { add() {} }, () => {}, () => {}, { opponentControl: 'p2' });
  e.countdown = 0;
  if (slot === 0) {
    assert.equal(e.requestTag(side, 1), true);
    for (let i = 0; i < 400 && !e.canTag(side, slot); i++) e.update(1 / 60);
  }
  assert.equal(e.canTag(side, slot), true);
  const buffer = { current: { player: {}, cpu: {} } }, owners = { current: null };
  const paused = { current: false }, doc = { hidden: false };
  syncOwners(e, buffer, owners);
  const routes = bindRoutes(e, { current: e }, buffer, owners, paused, doc, 'p2', syncOwners);
  return { e, buffer, routes, paused, doc };
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
