import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const hashCalls = calls => createHash('sha256').update(JSON.stringify(calls)).digest('hex');
const springfieldId = 'w11-springfield-cooling-tower-vapor';
const modes = new Set(['Combat', 'Melee', 'RPG', 'Tactics']);
const samples = Object.freeze({
  at0: Object.freeze({ seconds: 0,
    historical: 'a90b1f1017a78432e096b676680b43e59b9950564dc6d0f36ebb663b095663fa',
    node22: '13e00cc9278173a0a7d678186c23a7255b5e84fb023984e75c9f695ee4f60f2d' }),
  at23: Object.freeze({ seconds: 5.75,
    historical: '0b33f189eefd2f80b177f000994c55b134b5c6760a89419f046b52fe770efdb7',
    node22: '1c8a816b9d8eade8b6198142051f28bb589bdc811b88ba96f6c4f17d504b9e72' })
});

// Same-source Node22/24 comparison found only this cubic-Bezier coordinate:
// (1 - 11 / 20) ** 3 differs by one ULP in their V8 Math.pow implementations.
// The raw hashes, complete context and original historical hash all stay pinned.
// No other coordinate, sample, scene, command or order may change.
export function assertHistoricalStageDrawTrace({ id, stage, timeKey, elapsedSeconds, calls, expectedSha256 }) {
  const actual = hashCalls(calls);
  if (actual === expectedSha256) return;
  assert.equal(id, springfieldId, id + ': historical draw changed');
  assert.equal(stage.universe, 'The Simpsons');
  assert.equal(stage.name, 'Springfield Nuclear Power Plant — early TV empty cooling tower');
  assert.ok(modes.has(stage.mode), 'Only the four frozen stage modes have a compatible trace');
  const sample = samples[timeKey];
  assert.ok(sample, 'Only the frozen at0 and at23 samples have a compatible trace');
  assert.equal(elapsedSeconds, sample.seconds, 'The frozen simulation time must match');
  assert.equal(expectedSha256, sample.historical, 'The original historical hash must stay unchanged');
  assert.equal(actual, sample.node22, 'The complete raw draw must match the known Node22 trace');
  assert.deepEqual(calls[24], ['lineTo', 482.41648200000003, 177.8660725]);
  const historicalCalls = calls.map((call, index) => index === 24
    ? ['lineTo', 482.41648200000003, 177.86607249999997] : call);
  assert.equal(hashCalls(historicalCalls), expectedSha256, 'Only the documented one-ULP Y coordinate may differ');
}
