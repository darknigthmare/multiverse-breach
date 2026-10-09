import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';
import { getHeroById } from '../src/game/heroes.js';
import { getHeroSpriteSheetSrc } from '../src/game/spriteAssets.js';
import {
  ALIENS_RESCUE_NEWT_SPRITE_HERO_ID,
  drawAliensRescueEncounter,
  getAliensRescueNewtSpriteView
} from '../src/game/canonAliensRescueEncounterPresentation.js';

let vite;
let drawPixelSprite;
let EngineSmash;
const originalImage = globalThis.Image;
const loadedImages = [];
before(async () => {
  vite = await createServer({ configFile: false, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true, hmr: false, watch: null } });
  ({ drawPixelSprite } = await vite.ssrLoadModule('/src/game/renderer.js'));
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js'));
  globalThis.Image = class {
    set src(value) {
      const file = readFileSync(new URL(`../public${value}`, import.meta.url));
      assert.equal(file.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
      this.currentSrc = value;
      this.naturalWidth = file.readUInt32BE(16);
      this.naturalHeight = file.readUInt32BE(20);
      this.complete = true;
      loadedImages.push(value);
    }
    get src() { return this.currentSrc; }
  };
});
after(async () => {
  if (originalImage === undefined) delete globalThis.Image;
  else globalThis.Image = originalImage;
  await vite?.close();
});

const makeRuntime = () => ({
  id: 'aliens-1986-newt-rescue', phase: 'rescue', rescued: false, carrierId: null, complete: false,
  rescuePoint: { x: 643.2, y: 421.2, radius: 42 },
  exitPoint: { x: 115.2, y: 421.2, radius: 42 }
});
const canvas = () => {
  const calls = [];
  const ctx = new Proxy({}, { get(target, property) {
    if (property in target) return target[property];
    return (...args) => { calls.push([property, ...args]); };
  } });
  return { ctx, calls };
};

test('Newt uses the exact existing Aliens identity without certifying its artwork or adding combat fields', () => {
  const runtime = makeRuntime();
  const before = structuredClone(runtime);
  const source = getHeroById('newt_hadley');
  const sourceBefore = structuredClone(source);
  const view = getAliensRescueNewtSpriteView(runtime);
  assert.equal(ALIENS_RESCUE_NEWT_SPRITE_HERO_ID, 'newt_hadley');
  assert.equal(view.hero.id, 'newt_hadley');
  assert.equal(view.hero.universe, 'Aliens');
  assert.equal(view.hero.name, 'Newt');
  assert.notEqual(view.hero.id, 'newt_aliens');
  assert.equal(view.canonicalFidelityApproved, false);
  assert.match(view.visualReviewStatus, /pending/);
  assert.equal(view.state, 'idle');
  assert.equal(view.x, runtime.rescuePoint.x);
  assert.equal(view.y, runtime.rescuePoint.y);
  assert.deepEqual(runtime, before);
  assert.deepEqual(source, sourceBefore);
  assert.deepEqual(Object.keys(runtime.rescuePoint).sort(), ['radius', 'x', 'y']);
});

test('actual renderer draws Newt PNG at the nest while preserving the objective circle and labels', () => {
  const runtime = makeRuntime();
  const { ctx, calls } = canvas();
  drawAliensRescueEncounter(ctx, runtime, [], 0, 960, 540, 'fr', drawPixelSprite);
  const draw = calls.find(call => call[0] === 'drawImage');
  assert.ok(draw, 'Newt must be drawn through the actual character renderer');
  assert.equal(draw[1].currentSrc, '/sprites/generated/heroes/aliens/newt-hadley.png');
  assert.equal(draw[1].naturalWidth, 1024);
  assert.equal(draw[1].naturalHeight, 1024);
  assert.ok(loadedImages.includes(getHeroSpriteSheetSrc(getHeroById('newt_hadley'))));
  assert.deepEqual(draw.slice(2, 6), [0, 0, 256, 256]);
  assert.equal(draw.at(-1), 42);
  assert.ok(calls.some(call => call[0] === 'translate' && call[1] === runtime.rescuePoint.x && call[2] === runtime.rescuePoint.y));
  assert.ok(calls.some(call => call[0] === 'arc'));
  assert.ok(calls.some(call => call[0] === 'fillText' && call[1] === 'NEWT'));
  assert.ok(calls.some(call => call[0] === 'fillText' && call[1] === 'LIBERER'));
  assert.ok(calls.some(call => call[0] === 'fillText' && call[1] === 'EVACUATION'));
  assert.equal(calls[0][0], 'save');
  assert.equal(calls.at(-1)[0], 'restore');
});

test('the view follows the identified living carrier and renders only idle or run poses', () => {
  const runtime = { ...makeRuntime(), rescued: true, phase: 'escape', carrierId: 'carrier-2' };
  const decoy = { id: 'hero-1', currentHp: 100, x: 20, y: 50, facing: 1 };
  const carrier = { id: 'hero-2', battleId: 'carrier-2', currentHp: 100, x: 400, y: 420, facing: -1, vx: -2.6, state: 'attack' };
  const heroes = [decoy, carrier];
  const before = structuredClone({ runtime, heroes });
  const view = getAliensRescueNewtSpriteView(runtime, heroes);
  assert.equal(view.x, 422);
  assert.equal(view.y, 420);
  assert.equal(view.facing, -1);
  assert.equal(view.state, 'run');
  assert.equal(view.hero.state, 'run');
  const { ctx, calls } = canvas();
  drawAliensRescueEncounter(ctx, runtime, heroes, 0, 960, 540, 'en', drawPixelSprite);
  const draw = calls.find(call => call[0] === 'drawImage');
  assert.ok(draw);
  assert.deepEqual(draw.slice(2, 6), [0, 256, 256, 256]);
  assert.ok(calls.some(call => call[0] === 'scale' && call[1] === -1));
  assert.ok(calls.some(call => call[0] === 'fillText' && call[1] === 'NEWT WITH YOU'));
  assert.ok(!calls.some(call => call[0] === 'fillText' && call[1] === 'NEWT'));
  assert.deepEqual({ runtime, heroes }, before);
  assert.equal(getAliensRescueNewtSpriteView({ ...runtime, complete: true }, heroes).state, 'idle');
});

test('absent or dead carriers and other rescue scenarios receive no Aliens body substitution', () => {
  const runtime = { ...makeRuntime(), rescued: true, carrierId: 'carrier-2' };
  assert.equal(getAliensRescueNewtSpriteView(runtime, []), null);
  assert.equal(getAliensRescueNewtSpriteView(runtime, [{ id: 'carrier-2', currentHp: 0 }]), null);
  for (const candidate of [null, {}, { ...makeRuntime(), id: 'other-rescue' }]) assert.equal(getAliensRescueNewtSpriteView(candidate, []), null);
  const { ctx, calls } = canvas();
  drawAliensRescueEncounter(ctx, { ...makeRuntime(), id: 'other-rescue' }, [], 0, 960, 540, 'fr', drawPixelSprite);
  assert.ok(!calls.some(call => call[0] === 'drawImage'));
});

test('the actual Smash draw renders the Newt PNG without creating a squad combatant', () => {
  const runtime = makeRuntime();
  const before = structuredClone(runtime);
  const { ctx, calls } = canvas();
  // Isolate this presentation from arena and combatant drawing while executing
  // the real EngineSmash.draw method and its real renderer dependency.
  const view = {
    width: 960, height: 540, platforms: [], enemies: [], heroes: [],
    nihilanthEncounter: null,
    aliensRescueEncounter: runtime,
    isFixedCustomRoster: true, singleRoster: true, fixedRosterOpponentCount: 0,
    arena: { theme: { accent: '#e6be7b' }, label: { fr: 'Ruche' } },
    drawArena() {}, drawHazards() {}, drawStageEvent() {}, drawPreMatchOverlay() {}
  };
  EngineSmash.prototype.draw.call(view, ctx, 0, 'fr');
  const images = calls.filter(call => call[0] === 'drawImage');
  assert.equal(images.length, 1);
  assert.equal(images[0][1].currentSrc, '/sprites/generated/heroes/aliens/newt-hadley.png');
  assert.deepEqual(view.heroes, []);
  assert.deepEqual(view.enemies, []);
  assert.deepEqual(runtime, before);
});
