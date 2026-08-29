import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

// Le moteur Race precharge ses bitmaps dans le navigateur. Un stub suffit
// pour tester la simulation et le rendu vectoriel sous Node.
globalThis.Image = class ImageStub {
  constructor() {
    this.complete = false;
    this.naturalWidth = 0;
    this.naturalHeight = 0;
    this.src = '';
  }
};

const [{ resolveFighterTagEntry }, { EngineRace }] = await Promise.all([
  import('../src/game/fighterTagPlacement.js'),
  import('../src/game/engineRace.js')
]);

const makeCanvasContext = () => {
  const state = { textAlign: 'right', textBaseline: 'alphabetic', globalAlpha: 1 };
  const stack = [];
  const calls = { fill: 0, fillText: [] };
  const methods = {
    save() {
      stack.push({ ...state });
    },
    restore() {
      Object.assign(state, stack.pop() || {});
    },
    fill() {
      calls.fill += 1;
    },
    fillText(text, x, y) {
      calls.fillText.push({ text, x, y, align: state.textAlign });
    },
    createLinearGradient() {
      return { addColorStop() {} };
    },
    createRadialGradient() {
      return { addColorStop() {} };
    }
  };
  const noop = () => {};
  const ctx = new Proxy(methods, {
    get(target, key) {
      if (key === '__calls') return calls;
      if (key in state) return state[key];
      if (key in target) return target[key];
      return noop;
    },
    set(_target, key, value) {
      state[key] = value;
      return true;
    }
  });
  return ctx;
};

test('Fighter fait entrer un tag derriere le partenaire sur les camps initiaux', () => {
  const entry = resolveFighterTagEntry({
    activeX: 260,
    opponentX: 700,
    side: 'player',
    width: 960
  });
  assert.deepEqual(entry, { x: 204, vx: 150, facing: 1 });
});

test('Fighter fait entrer un tag derriere le partenaire et face au rival apres croisement', () => {
  const entry = resolveFighterTagEntry({
    activeX: 700,
    opponentX: 390,
    side: 'player',
    width: 960
  });
  assert.deepEqual(entry, { x: 756, vx: -150, facing: -1 });
});

test('Race applique enfin la penalite hors-piste propre au circuit', () => {
  const onTrack = new EngineRace(960, 540);
  const offTrack = new EngineRace(960, 540);
  [onTrack, offTrack].forEach(engine => {
    engine.countdown = 0;
    engine.raceState = 'running';
    engine.setInput({});
    engine.player.speed = 200;
  });

  onTrack.player.x = 480;
  onTrack.player.y = 100;
  onTrack.player.angle = onTrack.getClosestRoadPoint(480, 100).angle;
  offTrack.player.x = 36;
  offTrack.player.y = 36;
  onTrack.updateKart(onTrack.player, 1 / 30);
  offTrack.updateKart(offTrack.player, 1 / 30);

  assert.ok(offTrack.getKartRoadAnchor(offTrack.player).factor < 0.34);
  assert.ok(
    offTrack.player.speed < onTrack.player.speed * 0.92,
    `hors-piste=${offTrack.player.speed.toFixed(2)}, piste=${onTrack.player.speed.toFixed(2)}`
  );
});

test('Race verrouille le bas de la route sous le kart et courbe vers l horizon', () => {
  const engine = new EngineRace(960, 540);
  engine.player.angle = 0;
  engine.player.waypoint = 4;
  const horizonOffset = engine.getRoadCurveOffset(0);
  const kartOffset = engine.getRoadCurveOffset(1);

  assert.ok(Math.abs(horizonOffset) > 20);
  assert.ok(Math.abs(kartOffset) < 1e-8);
});

test('Race dessine toujours une chaussee continue et aligne le HUD a gauche', () => {
  const engine = new EngineRace(960, 540);
  const roadContext = makeCanvasContext();
  engine.drawRearRoad(roadContext);
  assert.ok(roadContext.__calls.fill >= 18, 'la perspective de secours doit couvrir toute la profondeur');

  const hudContext = makeCanvasContext();
  engine.drawHud(hudContext);
  const title = hudContext.__calls.fillText.find(call => String(call.text).startsWith('A.R.C.A. RACE'));
  assert.ok(title);
  assert.equal(title.align, 'left');
  assert.equal(title.x, 64);
  assert.equal(hudContext.textAlign, 'right', 'le HUD doit restaurer l etat du contexte');
});

test('Race expose un vrai frein tactile sans turbo gratuit et une sortie de resultat', async () => {
  const [component, fighterEngine, styles] = await Promise.all([
    readFile(new URL('../src/components/RaceMode.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/game/engineFighter.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/index.css', import.meta.url), 'utf8')
  ]);

  assert.doesNotMatch(component, /triggerBoost|keysRef\.current\.shift/);
  assert.match(component, /pulseVirtualKey\('down'\)/);
  assert.match(component, /CHANGER DE CIRCUIT/);
  assert.match(component, /disabled=\{!snapshot\.item/);
  assert.match(fighterEngine, /this\.groundY = Math\.round\(height \* 0\.82\)/);
  assert.match(fighterEngine, /next\.y = this\.groundY/);
  assert.match(fighterEngine, /this\.timer = 99/);
  assert.match(styles, /\.race-mode-canvas\s*\{[^}]*min-height:\s*0;/s);
  assert.match(styles, /\.fighter-mode-canvas\s*\{[^}]*min-height:\s*0;/s);
});
