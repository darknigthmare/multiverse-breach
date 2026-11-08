import test from 'node:test';
import assert from 'node:assert/strict';
import { HEROES_DB } from '../src/game/heroes.js';
import { createPlayerHero } from '../src/game/playerHero.js';
import { getExtinctionFighterProfile } from '../src/game/extinctionFighterProfiles.js';
import { createExtinctionProtocolState, activateExtinctionProtocol, tickExtinctionProtocols } from '../src/game/extinctionSignatures.js';
import { drawExtinctionSchematic, getExtinctionHandPlacement } from '../src/game/extinctionContent.js';
import { getExtinctionSchematicView, getExtinctionSchematicPlacement } from '../src/game/extinctionSchematicView.js';
import { getExtinctionViewLayout } from '../src/game/extinctionViewLayout.js';

const heroes = [createPlayerHero(), ...HEROES_DB];
const representatives = {
  player_anchor: 'contact', arca_tessera: 'projectile', masterchief: 'ballistic',
  ripley: 'cone', survivor: 'beam', doomslayer: 'scatter', rick_dc: 'control',
  siren_head: 'focus', hw_wheelchair_guy: 'movement'
};
const make = (id = 'player_anchor') => {
  const profile = getExtinctionFighterProfile(heroes.find(hero => hero.id === id));
  return { phase: 'running', heroId: id, runId: 'schematic-test', t: 100, hp: 75, maxHp: 100,
    px: 0, py: 0, angle: 0, vx: 0, vy: 0, turnVel: 0, ammo: 24, maxAmmo: 24,
    weapon: { type: 'pistol', ammo: 24, maxAmmo: 24, resource: profile.resource.kind },
    protocols: createExtinctionProtocolState(profile.signature, 'schematic-test'),
    enemies: [{ id: 'target', kind: 'Traqueur', wx: 0, wy: 2, hp: 500, maxHp: 500, size: 1 }] };
};
const tick = (state, count) => { for (let i = 0; i < count; i++) { state.t++; tickExtinctionProtocols(state); } };

/** Record transformed coordinates; no rasterizer or replacement gameplay. */
function context() {
  const points = [], operations = [], stack = [];
  let matrix = { x: 0, y: 0, scale: 1 };
  const point = (x, y) => {
    assert.ok(Number.isFinite(x) && Number.isFinite(y));
    points.push([matrix.x + x * matrix.scale, matrix.y + y * matrix.scale]);
  };
  const methods = {
    save() { stack.push({ ...matrix }); },
    restore() { assert.ok(stack.length); matrix = stack.pop(); },
    translate(x, y) { point(x, y); matrix.x += x * matrix.scale; matrix.y += y * matrix.scale; },
    scale(x, y) { assert.equal(x, y); assert.ok(Number.isFinite(x)); matrix.scale *= x; },
    moveTo: point, lineTo: point,
    bezierCurveTo(...args) { for (let i = 0; i < args.length; i += 2) point(args[i], args[i + 1]); },
    arc(x, y, r, start, end) {
      assert.ok(Number.isFinite(r) && r > 0);
      for (let i = 0; i <= 64; i++) { const angle = start + (end - start) * i / 64; point(x + Math.cos(angle) * r, y + Math.sin(angle) * r); }
    },
    beginPath() {}, closePath() {}, stroke() {}, fill() {},
    fillRect() { assert.fail('An abstract delivery must not fall back to the old gun rectangle'); }
  };
  const ctx = new Proxy({}, {
    set() { return true; },
    get(_, key) {
      assert.ok(methods[key], `Unexpected Canvas operation ${String(key)}`);
      return (...args) => { operations.push([key, ...args]); methods[key](...args); };
    }
  });
  return { ctx, points, operations, stack };
}

test('all 1,811 eligible identities resolve their actual primary delivery, without manufacturing art', () => {
  const counts = {}, before = JSON.stringify(heroes);
  for (const hero of heroes) {
    const profile = getExtinctionFighterProfile(hero);
    if (!profile.eligible) continue;
    const view = getExtinctionSchematicView(make(hero.id));
    assert.equal(view.ownerId, hero.id); assert.equal(view.source, 'personal');
    assert.equal(view.kind, profile.signature.actions.simple.kind, hero.id);
    assert.equal(view.color, profile.signature.actions.simple.color, hero.id);
    assert.notEqual(view.style, 'neutral', hero.id);
    assert.equal(view.artwork, false); assert.equal(view.morphologyInferred, false);
    counts[view.style] = (counts[view.style] || 0) + 1;
  }
  assert.deepEqual(counts, { contact: 817, projectile: 337, ballistic: 577, cone: 2,
    beam: 8, scatter: 5, control: 19, focus: 43, movement: 3 });
  assert.equal(JSON.stringify(heroes), before);
});

test('foreign owners, stale runs and absent profiles cannot lend a personal silhouette or colour', () => {
  for (const corrupt of [state => { state.heroId = 'other'; }, state => { state.protocols.ownerId = 'other'; },
    state => { state.protocols.profile = { ...state.protocols.profile, heroId: 'other' }; },
    state => { state.runId = 'new-run'; }, state => { delete state.runId; },
    state => { delete state.protocols; }]) {
    const state = make('doomslayer'); activateExtinctionProtocol(state, 'simple'); corrupt(state);
    const view = getExtinctionSchematicView(state, '#abcdef');
    assert.equal(view.source, 'unbound'); assert.equal(view.ownerId, ''); assert.equal(view.style, 'neutral');
    assert.equal(view.color, '#abcdef'); assert.equal(view.phase, 'idle'); assert.equal(view.activation, 0);
  }
  for (const [type, style] of Object.entries({ shotgun: 'scatter', rocket: 'launcher', plasma: 'plasma' })) {
    const state = make('player_anchor'); state.weapon = { type, color: '#456789', ammo: 3, maxAmmo: 6 };
    const view = getExtinctionSchematicView(state);
    assert.equal(view.source, 'pickup'); assert.equal(view.style, style); assert.equal(view.ownerId, '');
    assert.equal(view.color, '#456789'); assert.equal(view.resourceFraction, 0.5);
  }
  for (const type of ['unknown', 'constructor', '__proto__']) {
    const state = make(); state.weapon.type = type;
    assert.equal(getExtinctionSchematicView(state).source, 'unbound');
    assert.equal(getExtinctionSchematicView(state).style, 'neutral');
  }
});

test('real primary activations and cooldown ticks drive attack, recovery and ready states', () => {
  for (const [id, style] of Object.entries(representatives)) {
    const state = make(id), before = structuredClone(state);
    assert.equal(getExtinctionSchematicView(state).phase, 'idle', id);
    assert.equal(activateExtinctionProtocol(state, 'simple').activated, true, id);
    const active = getExtinctionSchematicView(state);
    assert.equal(active.style, style); assert.equal(active.phase, 'attack'); assert.equal(active.activation, 1);
    assert.equal(active.cooldown, state.protocols.profile.actions.simple.cooldown);
    tick(state, 8);
    const recovering = getExtinctionSchematicView(state);
    assert.equal(recovering.phase, 'recovery'); assert.equal(recovering.activation, 0);
    assert.ok(recovering.readyFraction > 0 && recovering.readyFraction < 1);
    tick(state, state.protocols.cooldowns.simple);
    assert.equal(getExtinctionSchematicView(state).phase, 'idle', id);
    assert.equal(getExtinctionSchematicView(state).readyFraction, 1);
    assert.equal(state.runId, before.runId);
  }
  const state = make('player_anchor');
  assert.equal(activateExtinctionProtocol(state, 'secondary').activated, true);
  assert.ok(state.muzzle > 0, 'secondary beam has its real world VFX');
  assert.equal(getExtinctionSchematicView(state).style, 'contact');
  assert.equal(getExtinctionSchematicView(state).phase, 'idle', 'secondary beam cannot fire the held contact diagram');
});

test('ammunition, reload and pickup recoil read the actual held resource', () => {
  const shotgun = make('doomslayer'); shotgun.ammo = 1; shotgun.weapon.ammo = 1;
  activateExtinctionProtocol(shotgun, 'simple');
  assert.equal(getExtinctionSchematicView(shotgun).phase, 'attack', 'last round still has recoil');
  tick(shotgun, 20);
  assert.equal(getExtinctionSchematicView(shotgun).phase, 'empty');
  shotgun.weapon.ammo = 6; shotgun.reloadPulse = 36;
  assert.equal(getExtinctionSchematicView(shotgun).phase, 'reload');
  assert.equal(getExtinctionSchematicView(shotgun).readyFraction, 0);
  shotgun.reloadPulse = 18;
  assert.equal(getExtinctionSchematicView(shotgun).readyFraction, 0.5);
  const contact = make('player_anchor'); contact.ammo = 0; contact.weapon.ammo = 0; contact.reloadPulse = 36;
  assert.equal(getExtinctionSchematicView(contact).phase, 'idle', 'contact never invents ammunition/reload');
  const pickup = make('player_anchor'); pickup.weapon = { type: 'rocket', ammo: 2, maxAmmo: 4, fireRate: 2 };
  pickup.lastFireTime = 100; pickup.muzzle = 36;
  assert.equal(getExtinctionSchematicView(pickup).phase, 'attack');
  pickup.t = 120;
  assert.equal(getExtinctionSchematicView(pickup).phase, 'recovery');
  pickup.t = 136; pickup.muzzle = 0;
  assert.equal(getExtinctionSchematicView(pickup).phase, 'idle');
  delete pickup.lastFireTime; pickup.muzzle = 12;
  assert.equal(getExtinctionSchematicView(pickup).phase, 'idle', 'a secondary muzzle without a held-weapon shot is not recoil');
});

test('every primary delivery has different geometry even with one colour, and pause rendering is pure', () => {
  const geometries = [];
  for (const id of Object.keys(representatives)) {
    const state = make(id), snapshot = structuredClone(state), drawing = context();
    drawExtinctionSchematic(drawing.ctx, state, 840, 430, '#ffffff');
    geometries.push(JSON.stringify(drawing.operations));
    assert.deepEqual(state, snapshot); assert.equal(drawing.stack.length, 0);
    state.paused = true;
    const paused = context(); drawExtinctionSchematic(paused.ctx, state, 840, 430, '#ffffff');
    assert.deepEqual(paused.operations, drawing.operations, `${id} must not use a wall-clock animation`);
  }
  assert.equal(new Set(geometries).size, 9, 'geometry must distinguish delivery, not only palette');
});

test('all diagram states fit the lower envelope on portrait, landscape, ultrawide and small canvases', () => {
  const states = Object.keys(representatives).map(make);
  for (const type of ['shotgun', 'rocket', 'plasma', 'unknown']) {
    const state = make(); state.weapon = { type, ammo: 6, maxAmmo: 6 }; states.push(state);
  }
  for (const state of states) for (const phase of ['idle', 'attack', 'reload', 'empty']) {
    const prepared = structuredClone(state);
    if (phase === 'attack') { prepared.protocols.activeSlot = 'simple'; prepared.protocols.activeFrames = 20; prepared.lastFireTime = 100; prepared.muzzle = 36; }
    if (phase === 'reload') prepared.reloadPulse = 36;
    if (phase === 'empty') prepared.weapon.ammo = 0;
    for (const [width, height] of [[840, 430], [390, 260], [280, 160], [1920, 1080], [100, 4096], [4096, 64]]) {
      prepared.turnVel = -1e20; prepared.vx = 1e20;
      const drawing = context(), { placement } = drawExtinctionSchematic(drawing.ctx, prepared, width, height);
      assert.ok(placement.y > height * 0.5, 'central reticle stays clear');
      assert.ok(placement.x >= 0 && placement.x + placement.w <= width);
      assert.ok(placement.y >= 0 && placement.y + placement.h <= height);
      for (const [x, y] of drawing.points) assert.ok(x >= 0 && x <= width && y >= 0 && y <= height,
        `${prepared.heroId}/${phase} escaped ${width}×${height}: ${x},${y}`);
      assert.equal(drawing.stack.length, 0);
    }
  }
  for (const [width, height] of [[0, 430], [840, -1], [NaN, 430], [840, Infinity]]) {
    assert.equal(getExtinctionSchematicPlacement(width, height), null);
    const drawing = context(); assert.equal(drawExtinctionSchematic(drawing.ctx, make(), width, height), null);
    assert.equal(drawing.operations.length, 0);
  }
});

test('measured HUD regions keep real paths and personal sheet bounds clear at every aspect and display scale', () => {
  const cases = [
    { size: [390, 844], hud: [[12, 565, 366, 71], [12, 644, 366, 188], [12, 68, 235, 104]] },
    { size: [1280, 900], hud: [[48, 809, 459, 79], [531, 702, 700, 186], [48, 68, 480, 92]] },
    { size: [844, 390], hud: [[12, 300, 307, 78], [327, 238, 505, 140], [12, 68, 440, 78]] },
    // Larger display preferences and a second primary row (KIT / MARK).
    { size: [390, 844], safeArea: 32, hud: [[32, 437, 326, 111], [32, 556, 326, 256], [32, 88, 196, 170]] },
    { size: [844, 390], safeArea: 32, hud: [[32, 256, 287, 102], [327, 170, 485, 188], [32, 88, 432, 65]] }
  ];
  const intersects = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  for (const { size: [cssW, cssH], hud, safeArea = 12 } of cases) {
    // A translated canvas catches accidental treatment of viewport CSS pixels
    // as local canvas coordinates, not just width/height scaling mistakes.
    const canvas = { left: 37, top: 23, width: cssW, height: cssH };
    const width = Math.round(430 * cssW / cssH), height = 430;
    const dom = hud.map(([left, top, w, h]) => ({ left: left + canvas.left, top: top + canvas.top, width: w, height: h }));
    const layout = getExtinctionViewLayout(canvas, width, height, dom, null, safeArea);
    const toCss = box => ({ x: box.x * cssW / width, y: box.y * cssH / height,
      w: box.w * cssW / width, h: box.h * cssH / height });
    const blockers = hud.map(([x, y, w, h]) => ({ x, y, w, h }));
    blockers.push(toCss({ x: width / 2 - 18, y: height / 2 - 18, w: 36, h: 36 }));
    const assertFree = box => {
      const css = toCss(box);
      assert.ok(css.h >= 64 && css.w >= 48, `useful view lost at ${cssW}×${cssH}: ${JSON.stringify(css)}`);
      assert.ok(css.x >= safeArea - 1e-6 && css.x + css.w <= cssW - safeArea + 1e-6
        && css.y >= safeArea - 1e-6 && css.y + css.h <= cssH - safeArea + 1e-6);
      for (const obstacle of blockers) assert.equal(intersects(css, obstacle), false, `${JSON.stringify(css)} overlaps ${JSON.stringify(obstacle)}`);
    };
    for (const id of Object.keys(representatives)) for (const turnVel of [-1e6, 0, 1e6]) {
      const state = make(id); state.turnVel = turnVel; state.protocols.activeSlot = 'simple'; state.protocols.activeFrames = 20;
      const before = structuredClone(state), drawing = context();
      const result = drawExtinctionSchematic(drawing.ctx, state, width, height, '#39c5bb', layout);
      assert.ok(result); assertFree(result.placement);
      for (const [x, y] of drawing.points) {
        const pixel = toCss({ x, y, w: 0.01, h: 0.01 });
        for (const obstacle of blockers) assert.equal(intersects(pixel, obstacle), false, 'actual transformed path enters HUD or reticle');
      }
      assert.deepEqual(state, before);
    }
    for (const source of [{ w: 256, h: 153.6 }, { w: 194, h: 199 }, { w: 193, h: 201 }]) {
      const box = getExtinctionHandPlacement(source, width, height, { vx: 100, turnVel: -100 }, layout);
      assert.ok(box); assertFree(box); assert.ok(Math.abs(box.w / box.h - source.w / source.h) < 1e-9);
    }
  }
  const old = getExtinctionSchematicPlacement(Math.round(430 * 390 / 844), 430);
  assert.ok(old.y * 844 / 430 > 644, 'the recorded mobile regression must be covered by this test');
});
