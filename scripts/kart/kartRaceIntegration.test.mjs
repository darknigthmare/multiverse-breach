import test from 'node:test';
import assert from 'node:assert/strict';
import { EngineRace, RACE_TRACKS } from '../../src/game/engineRace.js';
import { getKartForHero } from '../../src/game/kart/kartRoster.js';
import { getKartUniverseTrackId } from '../../src/game/kart/kartTracks.js';

globalThis.Image = class { complete = false; naturalWidth = 0; };

test('chosen character survives racing, restart, garage and the result', () => {
  const pilot = getKartForHero('masterchief');
  const engine = new EngineRace(960, 540, () => {}, getKartUniverseTrackId('Halo'), {}, null, pilot);
  assert.equal(engine.player.name, 'Master Chief');
  assert.equal(engine.player.kartSpec.heroId, 'masterchief');
  engine.updateGarage({ engine: 2 });
  engine.reset();
  assert.equal(engine.player.kartSpec, pilot);
  assert.equal(engine.getRaceSummary().pilot, 'Master Chief');
  assert.deepEqual(engine.opponents.map(kart => kart.kartSpec.heroId), ['arca_bastion', 'arca_loom', 'arca_sable']);
});

for (const universe of ['Nexus de Convergence', 'Halo', 'Alien']) {
  test(`assisted player really finishes three laps once on ${universe}`, () => {
    const results = [];
    const trackId = getKartUniverseTrackId(universe);
    const engine = new EngineRace(960, 540, result => results.push(result), trackId);
    engine.setInput({ autoAccel: true });
    for (let tick = 0; tick < 9000 && !engine.finished; tick += 1) engine.update(1 / 60);
    assert.equal(engine.player.lap, 3);
    assert.equal(engine.finished, true);
    assert.equal(results.length, 1);
    assert.equal(results[0].trackId, trackId);
    assert.ok(results[0].time > 10);
    for (let tick = 0; tick < 120; tick += 1) engine.update(1 / 60);
    assert.equal(results.length, 1);
  });
}

test('WebGL rendering cannot advance race time or issue a reward', () => {
  let calls = 0, disposed = 0, rewards = 0;
  const engine = new EngineRace(960, 540, () => rewards++);
  engine.renderer3D = { draw: race => { assert.equal(race, engine); calls++; }, dispose: () => disposed++ };
  engine.draw3DOverlay = () => {};
  for (let frame = 0; frame < 120; frame++) engine.draw({ clearRect() {} }, 1 / 60);
  assert.equal(calls, 120);
  assert.equal(engine.time, 0);
  assert.equal(rewards, 0);
  engine.dispose(); engine.dispose();
  assert.equal(disposed, 1);
  assert.equal(engine.renderer3D, null);
});

test('pacific source worlds cannot fire offensive items through an injected slot', () => {
  const track = Object.values(RACE_TRACKS).find(track => track.raceRules?.contactItems === false);
  assert.ok(track);
  const engine = new EngineRace(960, 540, () => {}, track.id);
  engine.countdown = 0;
  for (const item of ['projectile', 'trap', 'pulse', 'mirror']) {
    engine.player.item = item;
    assert.equal(engine.useKartItem(engine.player), false);
  }
  assert.equal(engine.projectiles.length, 0);
  assert.equal(engine.track.hazards.length, 0);
  engine.player.item = 'boost';
  assert.notEqual(engine.useKartItem(engine.player), false);
  assert.ok(engine.player.boost > 0);
});
