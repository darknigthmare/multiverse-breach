import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { getHeroById } from '../src/game/heroes.js';
import { resolveCombatHeroSpriteActor } from '../src/game/combatIdentity.js';
import {
  getHeroSpriteSheetSrc, getSpriteFrameForLayout, getSpriteSheetLayout, getSpriteStateResolution
} from '../src/game/spriteAssets.js';

const sources = [
  {
    id: 'jack_sparrow_potc', universe: 'Pirates of the Caribbean', pack: 'PiratesOfTheCaribbean',
    incarnation: 'Pirates of the Caribbean: The Curse of the Black Pearl (2003) - Captain Jack Sparrow',
    sheet: '/sprites/generated/heroes/pirates-of-the-caribbean/jack-sparrow-potc.png',
    sha256: '1e19f5ca5d8fa6775bc6e918dc685c4225e37c56dfa0125a10ecfe150c1325de',
    idle: [2, 3], attackRow: 3, attacks: [1, 3], hit: [1, 3]
  },
  {
    id: 'roger_rabbit', universe: 'Roger Rabbit', pack: 'RogerRabbit',
    incarnation: 'Who Framed Roger Rabbit (1988) - Roger, Maroon Cartoon Studio toon',
    sheet: '/sprites/generated/heroes/roger-rabbit/roger-rabbit.png',
    sha256: '23a6d65d3eb7d3b003b87e93bc04aecefac91f5623b3b583612a0a01c4972c2b',
    idle: [1, 3], attackRow: 0, attacks: [1, 3], hit: [1]
  }
];

for (const source of sources) {
  test(`${source.id} selects the inspected atlas for both the roster actor and a custom opponent`, () => {
    const actor = getHeroById(source.id);
    assert.equal(actor.incarnation, source.incarnation);
    const opponent = resolveCombatHeroSpriteActor({ id: `p2:${source.id}:0`, sourceId: source.id, universe: source.universe });
    assert.equal(opponent.incarnation, source.incarnation);
    assert.equal(resolveCombatHeroSpriteActor({ ...opponent, universe: 'Nexus de Convergence' }), null);
    for (const view of [actor, opponent]) {
      for (const context of ['rpg', 'tactics', 'melee', 'auto']) assert.equal(getHeroSpriteSheetSrc(view, context), source.sheet);
    }
    const png = readFileSync(new URL(`../DLC/${source.pack}/assets${source.sheet}`, import.meta.url));
    assert.equal(createHash('sha256').update(png).digest('hex'), source.sha256);
    assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20), png[25]], [1024, 1024, 6]);
  });

  test(`${source.id} reuses safe cells in all combat states and exposes provisional binding metadata`, () => {
    const layout = getSpriteSheetLayout(source.sheet);
    assert.equal(layout.baseline, 244);
    const verify = (state, row, columns, trim) => {
      const used = new Set();
      for (const time of [0, 10, 20, 30, 40, 81, 120, 140]) {
        const frame = getSpriteFrameForLayout(state, time, layout);
        assert.equal(frame.row, row, state);
        assert.deepEqual(frame.trim, trim, state);
        used.add(frame.col);
      }
      assert.deepEqual([...used], columns, state);
    };
    for (const state of ['idle', 'intro', 'victory', 'roundVictory']) verify(state, 0, source.idle, null);
    for (const state of ['run', 'walk', 'jumpRise', 'outro']) verify(state, 1, [0, 1], { top: 20 });
    for (const state of ['attack', 'attackLight1', 'aerialForward', 'special', 'chargeRelease']) {
      verify(state, source.attackRow, source.attacks, null);
    }
    for (const state of ['hit', 'hitStun', 'dead', 'defeat', 'roundDefeat']) verify(state, 3, source.hit, null);
    for (const state of ['attack', 'special', 'defense']) {
      const provenance = getSpriteStateResolution(state, layout);
      assert.equal(provenance.binding, 'adapted-existing-pose');
      assert.equal(provenance.dedicated, false);
      assert.equal(provenance.canonicalAnimationVerified, false);
    }
  });
}
