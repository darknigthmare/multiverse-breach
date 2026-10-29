import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { register } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HEROES_DB } from '../src/game/heroes.js';
import {
  CLOUD_MEADOW_CHARACTERS,
  CLOUD_MEADOW_REFERENCES,
  CLOUD_MEADOW_INITIAL_REFERENCE_ID,
  CLOUD_MEADOW_REVIEW_PATH,
  CLOUD_MEADOW_SCALE_GROUPS,
  CLOUD_MEADOW_STATIC_LAYOUT,
  CLOUD_MEADOW_UNIVERSE,
  getCloudMeadowCharacter,
  getCloudMeadowReference,
  filterCloudMeadowCharacters,
  getCloudMeadowSpriteLayout,
  getCloudMeadowSpriteSrc
} from '../src/game/cloudMeadowCharacters.js';
import {
  getHeroSpriteSheetSrc,
  getSpriteFrameForLayout,
  getSpriteSheetLayout
} from '../src/game/spriteAssets.js';
import { inspectCloudMeadowImage, validateCloudMeadowAssociations } from './buildCloudMeadowReview.mjs';

register('./cloudMeadowTestLoader.mjs', import.meta.url);
const [{ drawPixelSprite, drawCombatantBust }, { default: CloudMeadowGallery }] = await Promise.all([
  import('../src/game/renderer.js'),
  import('../src/components/CloudMeadowGallery.jsx')
]);

const initialIds = [
  'cloud_meadow_eve', 'cloud_meadow_evan',
  'cloud_meadow_dragon_female', 'cloud_meadow_dragon_male'
];
const additionalIds = [
  'jaero', 'kiram', 'yonten', 'brontide', 'garst', 'camellia', 'goldra', 'kreyton', 'fio', 'kaleida',
  'dark_armored_knight', 'bronze_armored_warrior', 'harpy_egg_keeper', 'masked_egg_keeper',
  'teacup_spirit', 'chain_anchor_warrior', 'golden_slime', 'pink_haired_gunner', 'halo_mage',
  'golden_barmaid', 'mantis_warrior', 'crystal_mage', 'diving_suit', 'lamia_female', 'coral_mermaid',
  'cat_female', 'crab', 'cyclops_female', 'centaur_female', 'lamia_male', 'wolf_female', 'holstaur_male', 'harpy_male'
].map(id => `cloud_meadow_${id}`);

test('reference identities remain separate artwork records without invented gameplay or certification', () => {
  assert.deepEqual(CLOUD_MEADOW_CHARACTERS.map(character => character.id), [...initialIds, ...additionalIds]);
  assert.equal(CLOUD_MEADOW_CHARACTERS.length, 37);
  assert.equal(new Set(CLOUD_MEADOW_CHARACTERS.map(character => character.src)).size, CLOUD_MEADOW_CHARACTERS.length);
  assert.equal(HEROES_DB.filter(hero => hero.universe === CLOUD_MEADOW_UNIVERSE).length, 0);
  for (const character of CLOUD_MEADOW_CHARACTERS) {
    assert.equal(getCloudMeadowCharacter(character.id), character);
    assert.equal(character.animationFrames, 1);
    assert.equal(character.canonicalFidelityApproved, false);
    const fromDescription = character.fidelityStatus === 'description-based-adaptation';
    assert.equal(character.provenance, fromDescription ? 'generated-from-reference-description' : 'generated-from-user-reference');
    assert.equal(character.generationMode, fromDescription ? 'text-description' : 'reference-image');
    assert.ok(['reference-based-generated', 'adapted-coverage', 'description-based-adaptation'].includes(character.fidelityStatus));
    assert.ok(character.fidelityNote.fr);
    assert.ok(character.fidelityNote.en);
    assert.ok(Object.isFrozen(character));
    for (const field of ['stats', 'simple', 'secondary', 'defense', 'special', 'unlocked', 'playable']) {
      assert.equal(Object.hasOwn(character, field), false, `${character.id}: ${field}`);
    }
  }
  const femaleDragon = getCloudMeadowCharacter('cloud_meadow_dragon_female');
  assert.ok(femaleDragon.traits.includes('no-wings'));
  assert.ok(femaleDragon.src.endsWith('/dragon-female-adapted.png'));
  assert.equal(femaleDragon.fidelityStatus, 'adapted-coverage');
  assert.match(femaleDragon.fidelityNote.fr, /buste et le bassin/);
  assert.match(femaleDragon.fidelityNote.en, /not a 1:1 reproduction/);
  assert.ok(getCloudMeadowCharacter('cloud_meadow_dragon_male').traits.includes('long-u-shaped-hollow-tip-tail'));
  const descriptions = CLOUD_MEADOW_CHARACTERS.filter(character => character.fidelityStatus === 'description-based-adaptation');
  assert.equal(descriptions.length, 8);
  assert.ok(descriptions.every(character => character.referenceId === 'monsters_20261029'));
  assert.ok(descriptions.every(character => character.src.endsWith('-adapted.png')));
  assert.deepEqual(CLOUD_MEADOW_CHARACTERS.filter(character => character.fidelityStatus === 'adapted-coverage').map(character => character.id), [
    'cloud_meadow_dragon_female', 'cloud_meadow_kreyton', 'cloud_meadow_kaleida',
    'cloud_meadow_teacup_spirit', 'cloud_meadow_golden_slime', 'cloud_meadow_pink_haired_gunner',
    'cloud_meadow_halo_mage', 'cloud_meadow_lamia_female', 'cloud_meadow_coral_mermaid'
  ]);
});

test('each selection uses its own source and the original scale never extends to unrelated sheets', async () => {
  const references = await Promise.all(CLOUD_MEADOW_REFERENCES.map(async reference => ({
    ...reference, image: await inspectCloudMeadowImage(reference.src, false)
  })));
  validateCloudMeadowAssociations(CLOUD_MEADOW_CHARACTERS, references, CLOUD_MEADOW_SCALE_GROUPS);
  assert.deepEqual(CLOUD_MEADOW_CHARACTERS.filter(character => character.scaleGroupId !== null).map(character => character.id), initialIds);
  for (const character of CLOUD_MEADOW_CHARACTERS) {
    assert.equal(character.referenceSrc, getCloudMeadowReference(character.referenceId).src);
    if (!initialIds.includes(character.id)) {
      assert.equal(character.referenceRelativeHeight, null);
      assert.equal(character.scaleGroupId, null);
    }
  }
  const first = CLOUD_MEADOW_CHARACTERS[0];
  const altered = changes => [{ ...first, ...changes }, ...CLOUD_MEADOW_CHARACTERS.slice(1)];
  assert.throws(() => validateCloudMeadowAssociations(altered({ referenceSrc: '/wrong.png' }), references, CLOUD_MEADOW_SCALE_GROUPS), /incorrect reference association/);
  assert.throws(() => validateCloudMeadowAssociations(altered({ referenceCrop: [880, 1200, 50, 50] }), references, CLOUD_MEADOW_SCALE_GROUPS), /crop outside/);
  assert.throws(() => validateCloudMeadowAssociations(altered({ scaleGroupId: 'another-sheet' }), references, CLOUD_MEADOW_SCALE_GROUPS), /crosses reference sheets/);
  assert.throws(() => validateCloudMeadowAssociations([first, first], references, CLOUD_MEADOW_SCALE_GROUPS), /duplicate character ID/);
});

test('source and name filters preserve distinct identities and expose an empty result', () => {
  assert.deepEqual(filterCloudMeadowCharacters({ referenceId: CLOUD_MEADOW_INITIAL_REFERENCE_ID }).map(character => character.id), initialIds);
  assert.deepEqual(filterCloudMeadowCharacters({ query: '  FEMALE DRAGON  ' }).map(character => character.id), ['cloud_meadow_dragon_female']);
  assert.deepEqual(filterCloudMeadowCharacters({ referenceId: 'unknown-sheet' }), []);
  assert.deepEqual(filterCloudMeadowCharacters({ query: 'not-a-cloud-meadow-character' }), []);
  assert.equal(getCloudMeadowReference('__proto__'), null);
  assert.equal(CLOUD_MEADOW_REFERENCES.length, 4);
  assert.deepEqual(['companions_20261029', 'npcs_20261029', 'monsters_20261029'].map(referenceId => filterCloudMeadowCharacters({ referenceId }).length), [10, 15, 8]);
  assert.notEqual(getCloudMeadowCharacter('cloud_meadow_lamia_female').src, getCloudMeadowCharacter('cloud_meadow_lamia_male').src);
  assert.notEqual(getCloudMeadowCharacter('cloud_meadow_lamia_female').referenceId, getCloudMeadowCharacter('cloud_meadow_lamia_male').referenceId);
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

test('the collection gallery exposes every named selection, source filters and a targeted comparison', () => {
  for (const lang of ['fr', 'en']) {
    const html = renderToStaticMarkup(React.createElement(CloudMeadowGallery, { lang }));
    assert.equal((html.match(/aria-pressed=/g) || []).length, CLOUD_MEADOW_CHARACTERS.length);
    assert.equal((html.match(/aria-pressed="true"/g) || []).length, 1);
    assert.ok(html.includes(`href="${CLOUD_MEADOW_REVIEW_PATH}#cloud_meadow_eve"`));
    assert.ok(html.includes('object-fit:contain'));
    for (const character of CLOUD_MEADOW_CHARACTERS) assert.ok(html.includes(character.displayName[lang]));
    for (const reference of CLOUD_MEADOW_REFERENCES) assert.ok(html.includes(`value="${reference.id}"`));
    assert.ok(html.includes('type="search"'));
    assert.ok(html.includes(CLOUD_MEADOW_CHARACTERS[0].src));
    assert.ok(html.includes(CLOUD_MEADOW_CHARACTERS[0].fidelityNote[lang]));
  }
});
