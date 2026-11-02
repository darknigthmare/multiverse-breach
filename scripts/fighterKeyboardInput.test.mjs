import assert from 'node:assert/strict';
import { before, after, afterEach, test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createServer } from 'vite';
import { createFighterHeldInputs, synchronizeFighterControlOwners } from '../src/game/fighterControlOwnership.js';
import { createHeldControlInput } from '../src/game/heldControlInput.js';

const source = readFileSync(new URL('../src/components/FighterMode.jsx', import.meta.url), 'utf8');
const section = (start, end) => {
  const first = source.indexOf(start), last = source.indexOf(end, first + start.length);
  assert.ok(first >= 0 && last > first, `Missing real FighterMode route: ${start}`);
  return source.slice(first, last);
};
const prelude = section('const CONTROL_KEYS = ', 'const DIFFICULTIES = ');
const handlers = section('    const clearInputs = () => {', '    window.addEventListener(')
  + section('  const startMatch = () => {', '  const rerollOpponents = () => {')
  + section('  const setHeldInput = ', '  const playerSnapshot = ');
const simulation = section('        synchronizeFighterControlOwners(engine, inputRef, inputOwnersRef', '        const ctx = ');
const pauseEffect = source.match(/useEffect\(\(\) => \{\s*(sessionPausedRef\.current = sessionPaused;[\s\S]*?)\}, \[sessionPaused\]\);/)?.[1];
assert.ok(pauseEffect, 'Missing real FighterMode pause effect');
const event = (key, code, extra = {}) => ({
  key, code, repeat: false, defaultPrevented: false,
  target: { tagName: 'CANVAS', closest: () => null },
  preventDefault() { this.defaultPrevented = true; },
  stopPropagation() { this.propagationStopped = true; },
  ...extra
});

let vite, Fighter;
const engines = [];
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineFighter: Fighter } = await vite.ssrLoadModule('/src/game/engineFighter.js'));
});
afterEach(() => engines.splice(0).forEach(engine => engine.dispose()));
after(async () => { await vite?.close(); });
const hero = id => ({ id, name: id, universe: 'QA', stats: { hp: 300, atk: 10, def: 1, spd: 10 }, simple: { name: 'Strike', dmg: 1 } });

// These are the real component callbacks, simulation handoff and engine. Only
// React setters, rendering and sound are inert; the input mapping is not copied.
function fixture(opponentControl = 'cpu') {
  const playerHeroes = [hero('p0'), hero('p1')], opponentHeroes = [hero('c0'), hero('c1')];
  const engine = new Fighter(900, 500, playerHeroes, opponentHeroes, { add() {} }, () => {}, () => {}, { opponentControl });
  engines.push(engine);
  engine.countdown = 0;
  const noop = () => {}, simulationClock = { reset: noop };
  const env = {
    engine, engineRef: { current: engine }, opponentControl, playerHeroes, opponentHeroes,
    inputRef: { current: { player: {}, cpu: {} } }, inputOwnersRef: { current: null },
    heldInputsRef: { current: createFighterHeldInputs() }, synchronizeFighterControlOwners,
    sessionPausedRef: { current: false }, sessionPaused: false, externalSessionPaused: false,
    document: { hidden: false, removeEventListener: noop }, window: { removeEventListener: noop },
    canvasRef: { current: {} }, simulationClock, simulationClockRef: { current: simulationClock },
    COMBAT_STEP_MS: 1000 / 60, steps: 1, particles: { update: noop },
    emptySnapshot: {}, setSummary: noop, setSnapshot: noop, setActiveDrawer: noop,
    setRuntimeError: noop, setMatchNonce: noop, setMatchStarted: noop,
    onSessionStart: noop, onSessionEndRef: { current: noop },
    sessionExitRequestRef: { current: 0 }, sessionExitRequest: 1,
    summary: null, customConfig: null, onExit: noop,
    sound: { playSfx: noop, stopBgm: noop }, active: true,
    cancelAnimationFrame: noop, animationId: 1, console: { error: noop }, error: new Error('fixture render failure')
  };
  synchronizeFighterControlOwners(engine, env.inputRef, env.inputOwnersRef, env.heldInputsRef.current);
  const evaluate = body => new Function(...Object.keys(env), `${prelude}\n${handlers}\n${body}`)(...Object.values(env));
  const routes = evaluate('return { down: onKeyDown, up: onKeyUp, clear: clearInputs, visibility: onVisibilityChange, touch: setHeldInput, tag: triggerTag, restart: startMatch, lobby: returnToLobby };');
  return { ...routes, env, engine, evaluate, step: () => evaluate(simulation),
    controls: side => env.inputRef.current[side],
    held: () => env.heldInputsRef.current.snapshot() };
}

test('movement aliases stay held until the last physical key is released', () => {
  for (const [first, second, control] of [
    [['q', 'KeyQ'], ['ArrowLeft', 'ArrowLeft'], 'left'],
    [['a', 'KeyA'], ['ArrowLeft', 'ArrowLeft'], 'left'],
    [['q', 'KeyQ'], ['a', 'KeyA'], 'left'],
    [['d', 'KeyD'], ['ArrowRight', 'ArrowRight'], 'right'],
    [['s', 'KeyS'], ['ArrowDown', 'ArrowDown'], 'down']
  ]) for (const reverse of [false, true]) {
    const f = fixture();
    f.down(event(...first)); f.down(event(...second));
    f.up(event(...(reverse ? second : first)));
    f.step();
    assert.equal(f.controls('player')[control], true);
    assert.equal(f.engine.inputs.player[control], true);
    f.up(event(...(reverse ? first : second)));
    f.step();
    assert.deepEqual(f.controls('player'), {});
    assert.equal(f.engine.inputs.player[control], false);
  }
});

test('guard aliases and the two Shift keys retain independent physical owners', () => {
  for (const [first, second] of [
    [['e', 'KeyE'], ['i', 'KeyI']],
    [['e', 'KeyE'], ['Shift', 'ShiftLeft']],
    [['Shift', 'ShiftLeft'], ['Shift', 'ShiftRight']]
  ]) for (const reverse of [false, true]) {
    const f = fixture();
    f.down(event(...first)); f.down(event(...second)); f.step();
    assert.equal(f.engine.getActive('player').guarding, true);
    f.up(event(...(reverse ? second : first))); f.step();
    assert.equal(f.engine.getActive('player').guarding, true);
    f.up(event(...(reverse ? first : second))); f.step();
    assert.equal(f.engine.getActive('player').guarding, false);
  }
});

test('keyup releases the recorded action after character, case or focus changes', () => {
  for (const releasedKey of ['Q', 'a', 'Unidentified']) {
    const f = fixture();
    f.down(event('q', 'KeyA')); // AZERTY character wins over physical key name.
    f.down(event('e', 'KeyE'));
    assert.deepEqual(f.controls('player'), { left: true, guard: true });
    const release = event(releasedKey, 'KeyA', { defaultPrevented: true, target: { tagName: 'INPUT' } });
    f.up(release); f.step();
    assert.deepEqual(f.controls('player'), { guard: true });
    assert.equal(f.engine.inputs.player.left, false);
    assert.equal(f.engine.getActive('player').guarding, true);
  }
});

test('events without code keep case-insensitive keys and separate modifier locations', () => {
  const f = fixture();
  f.down(event('Q')); f.up(event('q'));
  assert.deepEqual(f.controls('player'), {});
  f.down(event('Shift', undefined, { location: 1 }));
  f.down(event('Shift', undefined, { location: 2 }));
  f.up(event('Shift', undefined, { location: 1 })); f.step();
  assert.equal(f.engine.getActive('player').guarding, true);
  f.up(event('Shift', undefined, { location: 2 })); f.step();
  assert.equal(f.engine.getActive('player').guarding, false);
});

test('two-player directions and guards never release the other camp', () => {
  const f = fixture('p2');
  f.down(event('q', 'KeyQ')); f.down(event('ArrowLeft', 'ArrowLeft'));
  f.down(event('e', 'KeyE')); f.down(event('u', 'KeyU'));
  f.up(event('q', 'KeyQ')); f.up(event('e', 'KeyE')); f.step();
  assert.deepEqual(f.controls('player'), {});
  assert.deepEqual(f.controls('cpu'), { left: true, guard: true });
  assert.equal(f.engine.getActive('cpu').guarding, true);
  f.up(event('ArrowLeft', 'ArrowLeft')); f.up(event('u', 'KeyU')); f.step();
  assert.deepEqual(f.controls('cpu'), {});
  assert.equal(f.engine.getActive('cpu').guarding, false);
});

test('keyboard and existing touch holds release independently on both camps', () => {
  for (const side of ['player', 'cpu']) {
    const f = fixture('p2'), key = side === 'player' ? ['q', 'KeyQ'] : ['ArrowLeft', 'ArrowLeft'];
    f.touch('left', true, side); f.down(event(...key));
    f.up(event(...key)); f.step();
    assert.equal(f.engine.inputs[side].left, true, 'touch survives keyboard release');
    f.down(event(...key)); f.touch('left', false, side); f.step();
    assert.equal(f.engine.inputs[side].left, true, 'keyboard survives touch release');
    f.up(event(...key)); f.step();
    assert.equal(f.engine.inputs[side].left, false);
  }
});

test('each camp retains direction and guard until its final touch source releases', () => {
  for (const side of ['player', 'cpu']) for (const control of ['left', 'right', 'down', 'guard']) {
    const f = fixture('p2');
    f.touch(control, true, side, 'pointer:1'); f.touch(control, true, side, 'pointer:2');
    f.touch(control, false, side, 'pointer:2'); f.step();
    assert.equal(f.engine.inputs[side][control], true, `${side} ${control}`);
    f.touch(control, false, side, 'pointer:1'); f.step();
    assert.equal(f.engine.inputs[side][control], false, `${side} ${control}`);
  }
});

test('held UI controls, gameplay keys and the other player release independently', () => {
  const f = fixture('p2');
  const button = createHeldControlInput({ sourcePrefix: 'p1-guard', onInput: (source, phase) => f.touch('guard', phase === 'down', 'player', source) });
  button.onKeyDown(event(' ', 'Space')); button.onKeyDown(event('Enter', 'Enter'));
  f.down(event('e', 'KeyE')); f.touch('guard', true, 'cpu', 'p2-pointer');
  button.onKeyUp(event('Enter', 'Enter')); f.up(event('e', 'KeyE')); f.step();
  assert.equal(f.engine.getActive('player').guarding, true);
  button.onBlur(); f.step();
  assert.equal(f.engine.getActive('player').guarding, false);
  assert.equal(f.engine.getActive('cpu').guarding, true);
});

test('a fresh UI pointer works after tag without restoring the old pointer owner', () => {
  for (const side of ['player', 'cpu']) {
    const f = fixture('p2');
    const button = createHeldControlInput({ sourcePrefix: 'guard', onInput: (source, phase) => f.touch('guard', phase === 'down', side, source) });
    const pointer = id => ({ ...event('', ''), pointerId: id, button: 0, currentTarget: {} });
    button.onPointerDown(pointer(1));
    const departed = f.engine.getActive(side);
    f.tag(1, side);
    assert.notEqual(f.engine.getActive(side), departed);
    assert.deepEqual(f.controls(side), {});
    button.onPointerDown(pointer(2)); button.onPointerUp(pointer(1)); f.step();
    assert.equal(f.engine.inputs[side].guard, true);
    button.onPointerUp(pointer(2)); f.step();
    assert.equal(f.engine.inputs[side].guard, false);
  }
});

for (const side of ['player', 'cpu']) for (const route of ['keyboard tag', 'button tag', 'knockout']) {
  test(`${side}: ${route} drops every departing owner without affecting the other camp`, () => {
    const f = fixture('p2'), other = side === 'player' ? 'cpu' : 'player';
    const move = side === 'player' ? ['q', 'KeyQ'] : ['ArrowLeft', 'ArrowLeft'];
    const guard = side === 'player' ? ['e', 'KeyE'] : ['u', 'KeyU'];
    const otherMove = other === 'player' ? ['d', 'KeyD'] : ['ArrowRight', 'ArrowRight'];
    f.down(event(...move)); f.down(event(...guard)); f.touch('left', true, side);
    f.down(event(...otherMove)); f.step();
    const departed = f.engine.getActive(side);
    if (route === 'keyboard tag') f.down(event(side === 'player' ? '2' : '8', side === 'player' ? 'Digit2' : 'Digit8'));
    else if (route === 'button tag') f.tag(1, side);
    else {
      f.engine.applyHit(f.engine.getOpponent(side), departed, { type: 'super', base: 10000, knockback: 0, guardDamage: 0 });
      assert.equal(departed.currentHp, 0);
      for (let frame = 0; frame < 80 && f.engine.getActive(side) === departed; frame++) f.step();
    }
    assert.notEqual(f.engine.getActive(side), departed);
    assert.deepEqual(f.controls(side), {});
    assert.deepEqual(f.held()[side], {});
    assert.deepEqual(f.controls(other), { right: true });
    f.down(event(...move, { repeat: true }));
    f.down(event(...guard, { repeat: true }));
    assert.deepEqual(f.controls(side), {});
    // A new, unrelated command must not restore the old hidden owners.
    f.down(event(side === 'player' ? 's' : 'ArrowDown', side === 'player' ? 'KeyS' : 'ArrowDown'));
    f.up(event(...move)); f.up(event(...guard)); f.touch('left', false, side);
    assert.deepEqual(f.controls(side), { down: true });
    assert.deepEqual(f.controls(other), { right: true });
  });
}

test('a refused tag preserves held sources and the active fighter', () => {
  const f = fixture('p2');
  f.down(event('q', 'KeyQ')); f.down(event('e', 'KeyE'));
  const actor = f.engine.getActive('player');
  f.engine.hitStop = 0.1;
  f.down(event('2', 'Digit2'));
  assert.equal(f.engine.getActive('player'), actor);
  f.down(event('s', 'KeyS'));
  assert.deepEqual(f.controls('player'), { left: true, guard: true, down: true });
});

test('attacks remain one-shot after their first animation finishes', () => {
  for (const [mode, side, key, code] of [['cpu', 'player', 'j', 'KeyJ'], ['p2', 'player', 'f', 'KeyF'], ['p2', 'cpu', 'p', 'KeyP']]) {
    const f = fixture(mode), actor = f.engine.getActive(side);
    f.down(event(key, code));
    const firstAction = actor.action;
    assert.equal(firstAction?.type, 'light');
    f.engine.updateActions(1);
    assert.equal(actor.action, null);
    f.down(event(key, code, { repeat: true }));
    assert.equal(actor.action, null);
    assert.deepEqual(f.held(), { player: {}, cpu: {} });
    f.up(event(key, code)); f.down(event(key, code));
    assert.equal(actor.action?.type, 'light');
    assert.notEqual(actor.action, firstAction);
  }
});

test('forms, menus, consumed events, repeats and inactive sessions acquire no commands', () => {
  for (const block of ['INPUT', 'TEXTAREA', 'SELECT', 'editable', 'drawer', 'consumed', 'repeat', 'paused', 'hidden', 'finished', 'disposed']) {
    const f = fixture();
    const extra = {};
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(block)) extra.target = { tagName: block };
    if (block === 'editable') extra.target = { tagName: 'DIV', isContentEditable: true };
    if (block === 'drawer') extra.target = { tagName: 'BUTTON', closest: selector => selector === '[data-combat-drawer].is-paused' ? {} : null };
    if (block === 'consumed') extra.defaultPrevented = true;
    if (block === 'repeat') extra.repeat = true;
    if (block === 'paused') f.env.sessionPausedRef.current = true;
    if (block === 'hidden') f.env.document.hidden = true;
    if (block === 'finished') f.engine.finish('victory');
    if (block === 'disposed') f.engine.dispose();
    f.down(event('q', 'KeyQ', extra)); f.down(event('f', 'KeyF', extra));
    assert.deepEqual(f.held(), { player: {}, cpu: {} }, block);
    assert.equal(f.engine.getActive('player').action, null, block);
  }
});

test('native button Space remains available while canvas Space still jumps', () => {
  const f = fixture();
  const space = event(' ', 'Space', { target: { tagName: 'SPAN', closest: selector => selector === 'button' ? {} : null } });
  f.down(space); f.up(space);
  assert.equal(space.defaultPrevented, false);
  assert.equal(f.engine.getActive('player').vy, 0);
  f.down(event(' ', 'Space'));
  assert.ok(f.engine.getActive('player').vy < 0);
  assert.deepEqual(f.held(), { player: {}, cpu: {} });
});

const resets = [
  ['shell or controls-menu pause', f => { f.env.sessionPaused = true; f.evaluate(pauseEffect); }],
  ['window blur', f => f.clear()],
  ['hidden tab', f => { f.env.document.hidden = true; f.visibility(); }],
  ['restart', f => f.restart()],
  ['return to lobby', f => f.lobby()],
  ['confirmed exit', f => f.evaluate(section('    if (sessionExitRequestRef.current === sessionExitRequest) return;', '  }, [sessionExitRequest]);'))],
  ['new match setup', f => f.evaluate(section('    const canvas = canvasRef.current;', '    const cosmeticSpriteSheets = '))],
  ['render failure', f => f.evaluate(section("        console.error('Fighter render loop failed', error);", '      }\n    };'))],
  ['unmount', f => f.evaluate(section('    return () => {\n      active = false;', '  }, [matchNonce, matchStarted, matchReady]);'))()]
];
for (const [name, reset] of resets) test(`${name} clears sources; late releases cannot restore them`, () => {
  const f = fixture('p2');
  f.down(event('q', 'KeyQ')); f.down(event('e', 'KeyE'));
  f.down(event('ArrowLeft', 'ArrowLeft')); f.touch('guard', true, 'cpu');
  f.step(); reset(f);
  assert.deepEqual(f.held(), { player: {}, cpu: {} });
  assert.deepEqual(f.env.inputRef.current, { player: {}, cpu: {} });
  f.up(event('Q', 'KeyQ')); f.up(event('u', 'KeyE')); f.up(event('ArrowLeft', 'ArrowLeft'));
  assert.deepEqual(f.env.inputRef.current, { player: {}, cpu: {} });
});

test('resume stays neutral until a fresh press, without restoring pre-pause owners', () => {
  const f = fixture();
  f.down(event('q', 'KeyQ')); f.down(event('e', 'KeyE')); f.step();
  f.env.sessionPaused = true; f.evaluate(pauseEffect);
  assert.equal(f.engine.getActive('player').guarding, false);
  f.env.sessionPaused = false; f.evaluate(pauseEffect);
  f.down(event('q', 'KeyQ', { repeat: true })); f.step();
  assert.deepEqual(f.controls('player'), {});
  f.down(event('d', 'KeyD')); f.step();
  assert.deepEqual(f.controls('player'), { right: true });
  assert.equal(f.engine.inputs.player.left, false);
  assert.equal(f.engine.getActive('player').guarding, false);
});

test('a new engine clears physical owners and a disposed old engine cannot reclaim them', () => {
  const old = fixture('p2'), next = fixture('p2');
  old.down(event('q', 'KeyQ')); old.down(event('ArrowLeft', 'ArrowLeft')); old.engine.dispose();
  const { inputRef, inputOwnersRef, heldInputsRef } = old.env;
  synchronizeFighterControlOwners(next.engine, inputRef, inputOwnersRef, heldInputsRef.current);
  assert.deepEqual(heldInputsRef.current.snapshot(), { player: {}, cpu: {} });
  heldInputsRef.current.holdKey(event('d', 'KeyD'), 'player', 'right');
  inputRef.current = heldInputsRef.current.snapshot();
  synchronizeFighterControlOwners(old.engine, inputRef, inputOwnersRef, heldInputsRef.current);
  assert.deepEqual(inputRef.current, { player: { right: true }, cpu: {} });
  assert.equal(inputOwnersRef.current.engine, next.engine);
});
