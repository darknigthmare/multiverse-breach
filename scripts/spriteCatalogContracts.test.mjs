import assert from 'node:assert/strict';
import test from 'node:test';

import {
  applySpriteCatalogContracts,
  LEGACY_SPRITE_ID_ALIASES,
  resolveSpriteCatalogIdentity
} from './spriteCatalogContracts.mjs';

const entry = (kind, id, output) => ({ kind, id, output });

test('declared playable/encounter visual aliases remain explicit and stable', () => {
  const result = applySpriteCatalogContracts([
    entry('hero', 'tiffany', '/sprites/generated/heroes/chucky/tiffany.png'),
    entry('boss', 'chucky-tiffany-doll-bride', '/sprites/generated/heroes/chucky/tiffany.png'),
    entry('hero', 'the_priest_2022', '/sprites/generated/heroes/hellraiser/the-priest-2022.png'),
    entry('boss', 'hellraiser-the-priest-2022', '/sprites/generated/heroes/hellraiser/the-priest-2022.png')
  ]);

  assert.equal(result[1].outputAliasOf, 'hero:tiffany');
  assert.equal(result[3].outputAliasOf, 'hero:the_priest_2022');
  assert.match(result[1].outputAliasReason, /playable and encounter-capable/);
});

test('duplicate identities and undeclared output owners fail the build contract', () => {
  assert.throws(() => applySpriteCatalogContracts([
    entry('boss', 'same-id', '/one.png'),
    entry('boss', 'same-id', '/one.png')
  ]), /Duplicate sprite identities: boss:same-id/);

  assert.throws(() => applySpriteCatalogContracts([
    entry('enemy', 'first', '/shared.png'),
    entry('boss', 'second', '/shared.png')
  ]), /Undeclared sprite output owners/);
});

test('legacy lower-role identities resolve to their authoritative owner', () => {
  const expectedAliases = {
    'boss:the-simpsons-mr-burns-nuclear-scheme': 'trial:the-simpsons-legacy-simpsons-boss-mr-burns-nuclear-scheme-trial',
    'enemy:stargate-universe-drone-command-ship': 'boss:stargate-universe-drone-command-ship',
    'enemy:roger-rabbit-smart-ass': 'boss:roger-rabbit-smart-ass',
    'enemy:ecco-the-dolphin-vortex-drone': 'boss:ecco-the-dolphin-vortex-drone',
    'enemy:cthulhu-shoggoth': 'boss:cthulhu-shoggoth'
  };

  assert.deepEqual(LEGACY_SPRITE_ID_ALIASES, expectedAliases);
  for (const [legacy, canonical] of Object.entries(expectedAliases)) {
    assert.equal(resolveSpriteCatalogIdentity(legacy), canonical);
  }
  assert.equal(resolveSpriteCatalogIdentity('hero:unchanged'), 'hero:unchanged');
});
