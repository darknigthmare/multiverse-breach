import assert from 'node:assert/strict';
import { getExtinctionViewmodel, getExtinctionHandFrame, getExtinctionHandSourceRect, getExtinctionHandPlacement } from '../src/game/extinctionContent.js';

/** Executable contract shared by progression audit and unit regression tests. */
export function verifyExtinctionViewmodelContract(resolve = getExtinctionViewmodel, frameFor = getExtinctionHandFrame, cropFor = getExtinctionHandSourceRect) {
  const profile = resolve({ id: 'arca_mirelle' });
  assert.equal(profile.heroId, 'arca_mirelle');
  assert.match(profile.src, /arca-mirelle-fps-hands\.png$/);
  assert.match(profile.projectile, /arca-mirelle-fps-projectile\.png$/);
  assert.equal(profile.layout.columns, 4); assert.equal(profile.layout.rows, 10);
  for (const state of [{t:0}, {t:36,muzzle:36}, {t:24,reloadPulse:4}, {t:12,vx:0.25}]) {
    const frame = frameFor(profile, state);
    const rect = cropFor(frame, 1024, 2560);
    assert.ok(rect && rect.x >= 0 && rect.y >= 0);
    assert.ok(rect.x + rect.w <= (frame.col + 1) * 256);
    assert.ok(rect.y + rect.h <= (frame.row + 1) * 256);
    const placement = getExtinctionHandPlacement(rect, 840, 430, state);
    assert.ok(Math.abs(placement.w / placement.h - rect.w / rect.h) < 1e-9);
    if (state.reloadPulse) {
      assert.equal(frame.row, 6); assert.equal(rect.y, 6 * 256 + 40);
      assert.equal(rect.h, 256 - 40 - 6);
    }
  }
  for (const type of ['rocket','plasma','shotgun']) assert.equal(frameFor(profile,{weapon:{type}}),null);
  for (const id of ['player_anchor','arca_bastion','buckethead_avatar']) assert.equal(resolve({id}).src,'');
  assert.equal(resolve({id:'arca_mirelle',activeSkin:{id:'unbound'}}).src,'');
  return true;
}
