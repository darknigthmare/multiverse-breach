import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { register } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HEROES_DB } from '../src/game/heroes.js';
import {
  CLOUD_MEADOW_CHARACTERS,
  CLOUD_MEADOW_REVIEW_PATH,
  CLOUD_MEADOW_STATIC_LAYOUT,
  CLOUD_MEADOW_UNIVERSE,
  getCloudMeadowCharacter,
  getCloudMeadowSpriteLayout,
  getCloudMeadowSpriteSrc
} from '../src/game/cloudMeadowCharacters.js';
import {
  getHeroSpriteSheetSrc,
  getSpriteFrameForLayout,
  getSpriteSheetLayout
} from '../src/game/spriteAssets.js';

register('./cloudMeadowTestLoader.mjs', import.meta.url);
const [{ drawPixelSprite, drawCombatantBust }, { default: CloudMeadowGallery }] = await Promise.all([
  import('../src/game/renderer.js'),
  import('../src/components/CloudMeadowGallery.jsx')
]);

const expectedIds = [
  'cloud_meadow_eve', 'cloud_meadow_evan',
  'cloud_meadow_dragon_female', 'cloud_meadow_dragon_male'
];

test('the four reference identities remain artwork records without invented gameplay or certification', () => {
  assert.deepEqual(CLOUD_MEADOW_CHARACTERS.map(character => character.id), expectedIds);
  assert.equal(new Set(CLOUD_MEADOW_CHARACTERS.map(character => character.src)).size, 4);
  assert.equal(HEROES_DB.filter(hero => hero.universe === CLOUD_MEADOW_UNIVERSE).length, 0);
  for (const character of CLOUD_MEADOW_CHARACTERS) {
    assert.equal(getCloudMeadowCharacter(character.id), character);
    assert.equal(character.animationFrames, 1);
    assert.equal(character.canonicalFidelityApproved, false);
    assert.equal(character.provenance, 'generated-from-user-reference');
    assert.equal(character.fidelityStatus, character.id === 'cloud_meadow_dragon_female' ? 'adapted-coverage' : 'reference-based-generated');
    assert.ok(character.fidelityNote.fr);
    assert.ok(character.fidelityNote.en);
    assert.ok(Object.isFrozen(character));
    for (const field of ['stats', 'simple', 'secondary', 'defense', 'special', 'unlocked', 'playable']) {
      assert.equal(Object.hasOwn(character, field), false, `${character.id}: ${field}`);
    }
  }
  assert.ok(CLOUD_MEADOW_CHARACTERS[2].traits.includes('no-wings'));
  assert.ok(CLOUD_MEADOW_CHARACTERS[2].src.endsWith('/dragon-female-adapted.png'));
  assert.match(CLOUD_MEADOW_CHARACTERS[2].fidelityNote.fr, /buste et le bassin/);
  assert.match(CLOUD_MEADOW_CHARACTERS[2].fidelityNote.en, /not a 1:1 reproduction/);
  assert.ok(CLOUD_MEADOW_CHARACTERS[3].traits.includes('long-u-shaped-hollow-tip-tail'));
});

test('source resolution requires the exact registered ID and universe in every rendering context', () => {
  for (const character of CLOUD_MEADOW_CHARACTERS) {
    for (const context of ['auto', 'rpg', 'tactics', 'melee', 'nexus', 'collection', 'hud', 'fps', 'kart']) {
      assert.equal(getHeroSpriteSheetSrc(character, context), character.src);
    }
    assert.equal(getCloudMeadowSpriteSrc({ ...character, universe: 'Another universe' }), '');
    assert.equal(getCloudMeadowSpriteSrc({ ...character, id: 'unregistered' }), '');
    assert.notEqual(getHeroSpriteSheetSrc({ ...character, universe: 'Another universe' }), character.src);
  }
  for (const invalid of ['__proto__', 'constructor', 'missing', {}, null, 4]) {
    assert.equal(getCloudMeadowCharacter(invalid), null);
  }
});

test('every state selects the full single frame, including cache-busted and absolute image URLs', () => {
  for (const { src } of CLOUD_MEADOW_CHARACTERS) {
    for (const url of [src, `${src}?v=1#reference`, `https://game.example${src}?v=1`]) {
      const layout = getSpriteSheetLayout(url);
      assert.equal(layout, CLOUD_MEADOW_STATIC_LAYOUT);
      for (const state of ['idle', 'run', 'attack', 'defense', 'support', 'special', 'hit', 'dead', 'jump', 'fall', 'reload', 'unknown']) {
        for (const time of [0, 9, 10, 74, 9999]) {
          assert.deepEqual(getSpriteFrameForLayout(state, time, layout), { row: 0, col: 0, trim: null });
        }
      }
    }
  }
  for (const src of ['', null, '/sprites/generated/heroes/cloud-meadow/unregistered.png']) {
    assert.equal(getCloudMeadowSpriteLayout(src), null);
  }
  assert.equal(getSpriteSheetLayout('/sprites/generated/heroes/other/existing.png').columns, 4);
});

const originalImage = globalThis.Image;
before(() => {
  globalThis.Image = class {
    set src(value) {
      this.currentSrc = value;
      // A deliberately wide image catches accidental cover fitting and stretching.
      this.naturalWidth = 1400;
      this.naturalHeight = 700;
      this.complete = true;
    }
    get src() { return this.currentSrc; }
  };
});
after(() => {
  if (originalImage === undefined) delete globalThis.Image;
  else globalThis.Image = originalImage;
});

const makeCanvas = () => {
  const calls = [];
  const ctx = new Proxy({}, {
    get(target, key) {
      return key in target ? target[key] : (...args) => calls.push([key, ...args]);
    }
  });
  return { ctx, calls };
};

test('the actual character renderer uses the entire image and preserves its aspect ratio', () => {
  for (const character of CLOUD_MEADOW_CHARACTERS) {
    for (const state of ['idle', 'run', 'attack', 'hit', 'dead']) {
      const { ctx, calls } = makeCanvas();
      drawPixelSprite(ctx, 200, 150, { ...character, state }, 78, 1, 100, 'collection');
      const draw = calls.find(([method]) => method === 'drawImage');
      assert.ok(draw, `${character.id}: ${state}`);
      assert.equal(draw[1].currentSrc, character.src);
      assert.deepEqual(draw.slice(2, 6), [0, 0, 1400, 700]);
      assert.equal(draw.at(-2) / draw.at(-1), 2);
      assert.equal(draw.at(-1), 100);
    }
  }
});

test('Cloud Meadow portraits contain the full tail and body without changing legacy bust cropping', () => {
  for (const character of CLOUD_MEADOW_CHARACTERS) {
    const { ctx, calls } = makeCanvas();
    assert.equal(drawCombatantBust(ctx, 0, 0, 120, 100, character), true);
    const draw = calls.find(([method]) => method === 'drawImage');
    assert.deepEqual(draw.slice(2, 6), [0, 0, 1400, 700]);
    assert.ok(draw.at(-2) <= 120);
    assert.ok(draw.at(-1) <= 100);
    assert.equal(draw.at(-2) / draw.at(-1), 2);
  }
  const { ctx, calls } = makeCanvas();
  assert.equal(drawCombatantBust(ctx, 0, 0, 120, 100, { id: 'existing', universe: 'Other' }), true);
  const legacy = calls.find(([method]) => method === 'drawImage');
  assert.equal(legacy[4], 350);
  assert.equal(legacy[5], 175 * 0.68);
});

test('the collection gallery exposes four named selections and the detailed source comparison', () => {
  for (const lang of ['fr', 'en']) {
    const html = renderToStaticMarkup(React.createElement(CloudMeadowGallery, { lang }));
    assert.equal((html.match(/aria-pressed=/g) || []).length, 4);
    assert.equal((html.match(/aria-pressed="true"/g) || []).length, 1);
    assert.ok(html.includes(`href="${CLOUD_MEADOW_REVIEW_PATH}"`));
    assert.ok(html.includes('object-fit:contain'));
    for (const character of CLOUD_MEADOW_CHARACTERS) assert.ok(html.includes(character.displayName[lang]));
    assert.ok(html.includes(CLOUD_MEADOW_CHARACTERS[0].src));
    assert.ok(html.includes(CLOUD_MEADOW_CHARACTERS[0].fidelityNote[lang]));
  }
});
