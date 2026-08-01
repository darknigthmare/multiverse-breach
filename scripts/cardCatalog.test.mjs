import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createCardCatalogFromPortalCandidates
} from '../src/game/cards/cardCatalog.js';
import { createCardSetCatalog } from '../src/game/cards/cardSetCatalog.js';
import { ORIGINAL_WORLD_BOOSTERS } from '../src/game/portalBoosterCatalog.js';

const rarity = (id) => ({ id, weight: id === 'common' ? 58 : 28 });

test('portal candidates become separate card, art and unlockable catalogs', () => {
  const portalVisual = Object.freeze({
    sheet: '/visuals/cosmetics/openai/portal-effects-atlas-v1.png',
    columns: 4,
    rows: 4,
    frames: 4,
    source: 'openai'
  });
  const candidates = [
    {
      id: 'hero:shared',
      rewardId: 'shared',
      kind: 'hero',
      name: 'Shared A',
      universe: 'Thread A',
      rarity: rarity('common'),
      data: { hero: { id: 'shared', portrait: '/images/thread-a/shared.png' } }
    },
    {
      id: 'hero:shared',
      rewardId: 'shared',
      kind: 'hero',
      name: 'Shared B',
      universe: 'Thread B',
      rarity: rarity('rare'),
      data: { hero: { id: 'shared', portrait: '/images/thread-b/shared.png' } }
    },
    {
      id: 'equipment:blade',
      rewardId: 'blade',
      kind: 'equipment',
      universe: 'Thread A',
      rarity: rarity('rare'),
      data: { item: { id: 'blade', universe: 'Thread A', icon: '/sprites/items/blade.png' } }
    },
    {
      id: 'portal-effect:Thread A',
      rewardId: 'portal-effect:Thread A',
      kind: 'portalEffect',
      universe: 'Thread A',
      rarityId: 'epic',
      data: {
        unlockable: {
          id: 'portal-effect:Thread A',
          visual: portalVisual
        }
      }
    }
  ];

  const catalog = createCardCatalogFromPortalCandidates(candidates);

  assert.equal(catalog.definitions.length, 4);
  assert.equal(new Set(catalog.definitions.map((card) => card.id)).size, 4);
  assert.notEqual(catalog.definitions[0].id, catalog.definitions[1].id);
  assert.match(catalog.definitions[0].id, /^card:Thread%20A:hero:shared$/);
  assert.match(catalog.definitions[1].id, /^card:Thread%20B:hero:shared$/);
  assert.equal(catalog.definitions[0].rarityId, 'stable');
  assert.equal(catalog.definitions[1].rarityId, 'rare');
  assert.ok(!('art' in catalog.definitions[0]));
  assert.ok(!('unlockable' in catalog.definitions[3]));
  assert.equal(catalog.artById[catalog.definitions[0].artId].family, 'portrait');
  assert.equal(catalog.artById[catalog.definitions[2].artId].family, 'item');
  assert.equal(catalog.artById[catalog.definitions[3].artId].sheet, portalVisual.sheet);
  assert.equal(
    catalog.unlockablesById[catalog.definitions[3].unlockableId].value.visual,
    portalVisual
  );

  const sets = createCardSetCatalog(catalog);
  assert.equal(sets.definitions.length, 2);
  assert.deepEqual(
    sets.definitions.map((setDefinition) => setDefinition.universe).sort(),
    ['Thread A', 'Thread B']
  );
  assert.ok(sets.definitions.every((setDefinition) => !('coverArt' in setDefinition)));
});

test('a true card identity collision is diagnosed without inventing a suffix', () => {
  const candidate = {
    id: 'hero:same',
    rewardId: 'same',
    kind: 'hero',
    universe: 'One Thread',
    rarity: rarity('common'),
    data: { hero: { id: 'same', portrait: '/images/same.png' } }
  };
  const catalog = createCardCatalogFromPortalCandidates([
    candidate,
    { ...candidate, data: { hero: { id: 'same', portrait: '/images/other.png' } } }
  ]);

  assert.equal(catalog.definitions.length, 1);
  assert.equal(catalog.definitions[0].id.includes('-2'), false);
  assert.ok(catalog.diagnostics.some((diagnostic) => diagnostic.code === 'card-id-collision'));
});

test('Neon Requiem custom archive and HUD rewards receive universe-aware card definitions', () => {
  const neonPack = ORIGINAL_WORLD_BOOSTERS.find(pack => pack.universe === 'Neon Requiem');
  assert.ok(neonPack);

  const rewardIds = [
    'archive:neon_requiem:neon_omnia_cathedral',
    'hud:neon_ghostline_root'
  ];
  const candidates = neonPack.candidatePool
    .filter(candidate => rewardIds.includes(candidate.id))
    .map(candidate => ({
      id: candidate.id,
      rewardId: candidate.id,
      kind: candidate.kind,
      name: candidate.data.name || candidate.id,
      universe: neonPack.universe,
      color: candidate.data.color || neonPack.color,
      rarity: rarity(candidate.rarityId),
      data: {
        ...(candidate.data.data || {}),
        image: candidate.data.data?.image || neonPack.backdrop,
        mode: candidate.data.data?.mode || neonPack.mode
      }
    }));

  assert.equal(candidates.length, rewardIds.length);
  const catalog = createCardCatalogFromPortalCandidates(candidates);
  const definitionsByRewardId = new Map(
    catalog.definitions.map(definition => [definition.rewardId, definition])
  );

  rewardIds.forEach(rewardId => {
    const definition = definitionsByRewardId.get(rewardId);
    assert.ok(definition, `missing card definition for ${rewardId}`);
    assert.equal(definition.universe, 'Neon Requiem');
    assert.match(definition.id, /^card:Neon%20Requiem:/);
    assert.equal(catalog.artById[definition.artId].image, neonPack.backdrop);
  });
});
