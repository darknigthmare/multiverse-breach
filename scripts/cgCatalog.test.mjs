import assert from 'node:assert/strict';
import test from 'node:test';
import { CG_BY_ID, CG_CATALOG, getCgDefinition } from '../src/game/cg/cgCatalog.js';
import {
  CG_PRODUCTION_FILE_BASENAMES,
  buildCgPaths,
  buildCharacterSoloCgPaths,
  createCgDefinition,
  filterCgCatalogByRegulation,
  isCgUnlocked,
  resolveCgMedia,
  validateCgDefinition
} from '../src/game/cg/cgSchema.js';

const EXPECTED_TYPES_BY_HERO = Object.freeze({
  player_anchor: Object.freeze([
    'characterSolo', 'weaponSolo', 'decorSolo', 'coherentScene', 'actionScene',
    'introPose', 'victoryPose', 'defeatPose', 'goofy', 'alignmentSwap',
    'zombieVersion', 'firstStep'
  ]),
  masterchief: Object.freeze([
    'characterSolo', 'weaponSolo', 'decorSolo', 'coherentScene', 'actionScene',
    'introPose', 'victoryPose', 'defeatPose', 'goofy', 'alignmentSwap',
    'iconicOutfitSwap', 'zombieVersion', 'firstStep'
  ]),
  arbiter: Object.freeze([
    'characterSolo', 'weaponSolo', 'decorSolo', 'coherentScene', 'actionScene',
    'introPose', 'victoryPose', 'defeatPose', 'goofy', 'alignmentSwap',
    'iconicOutfitSwap', 'zombieVersion', 'futureExperienced'
  ]),
  wesker: Object.freeze([
    'characterSolo', 'weaponSolo', 'decorSolo', 'coherentScene', 'actionScene',
    'introPose', 'victoryPose', 'defeatPose', 'beachFamily', 'maidService', 'goofy',
    'alignmentSwap', 'genderSwap', 'zombieVersion', 'firstStep'
  ]),
  jill: Object.freeze([
    'characterSolo', 'weaponSolo', 'decorSolo', 'coherentScene', 'actionScene',
    'introPose', 'victoryPose', 'defeatPose', 'beachFamily', 'maidService', 'goofy',
    'alignmentSwap', 'genderSwap', 'zombieVersion', 'futureExperienced'
  ]),
  leon: Object.freeze([
    'characterSolo', 'weaponSolo', 'decorSolo', 'coherentScene', 'actionScene',
    'introPose', 'victoryPose', 'defeatPose', 'beachFamily', 'maidService', 'goofy',
    'alignmentSwap', 'genderSwap', 'zombieVersion', 'futureExperienced'
  ])
});

const BASE_CONTINUITIES = Object.freeze({
  player_anchor: 'project-canon',
  masterchief: 'halo-infinite-gen3',
  arbiter: 'halo-2-anniversary-classic',
  wesker: 'resident-evil-5-human',
  jill: 'resident-evil-1-hd-stars',
  leon: 'resident-evil-2-1998'
});

test('CG production contains the exact approved CG01-CG15 applicability matrix', () => {
  assert.equal(CG_CATALOG.length, 83);
  assert.equal(Object.keys(CG_BY_ID).length, 83);
  assert.ok(Object.isFrozen(CG_CATALOG));
  assert.ok(Object.isFrozen(CG_BY_ID));

  for (const [heroId, expectedTypes] of Object.entries(EXPECTED_TYPES_BY_HERO)) {
    const records = CG_CATALOG.filter((definition) => definition.characterId === heroId);
    assert.deepEqual(records.map(({ type }) => type), expectedTypes, `${heroId} applicability`);
  }
});

test('A.R.C.A. regulation hides reserved universes and disabled heroes without mutation', () => {
  const withoutHalo = filterCgCatalogByRegulation(CG_CATALOG, { hiddenUniverses: ['Halo'] });
  assert.equal(withoutHalo.length, 57);
  assert.equal(withoutHalo.some(({ universeKey }) => universeKey === 'halo'), false);

  const haloOnly = filterCgCatalogByRegulation(CG_CATALOG, {
    hiddenUniverses: ['Resident Evil'],
    disabledHeroes: ['player_anchor']
  });
  assert.equal(haloOnly.length, 26);
  assert.deepEqual([...new Set(haloOnly.map(({ characterId }) => characterId))].sort(), ['arbiter', 'masterchief']);

  const withoutJill = filterCgCatalogByRegulation(CG_CATALOG, { disabledHeroes: ['jill'] });
  assert.equal(withoutJill.length, 68);
  assert.equal(CG_CATALOG.length, 83);
});

test('every CG satisfies mandatory schema, provenance, age and consent gates', () => {
  const mandatoryFields = [
    'canonStatus', 'continuityId', 'contentRating', 'ageStatus', 'consentStatus',
    'characterReferenceId', 'promptId', 'promptSummary', 'publishedAt', 'source',
    'rightsClass', 'sourceRefs', 'credits', 'unlock'
  ];

  for (const definition of CG_CATALOG) {
    assert.deepEqual(validateCgDefinition(definition), { valid: true, errors: [] });
    for (const field of mandatoryFields) assert.ok(definition[field], `${definition.id}: missing ${field}`);
    assert.ok(EXPECTED_TYPES_BY_HERO[definition.characterId].includes(definition.type));
    assert.equal(definition.source, 'openai');
    assert.ok(['family', 'teen'].includes(definition.contentRating));
    assert.match(definition.publishedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(['project-original', 'unofficial-fan-art'].includes(definition.rightsClass));
    assert.ok(definition.sourceRefs.length > 0);
    assert.ok(Object.isFrozen(definition));
    assert.ok(Object.isFrozen(definition.sourceRefs));
    assert.ok(Object.isFrozen(definition.unlock));

    if (definition.family === 'Fan Art') {
      assert.equal(definition.canonStatus, 'fan-art');
      assert.notEqual(definition.ageStatus, 'not-required');
      assert.notEqual(definition.consentStatus, 'not-required');
      assert.equal(definition.contentRating, 'family');
    }
    if (definition.family === 'What If') assert.equal(definition.canonStatus, 'what-if');
    if (['beachFamily', 'maidService'].includes(definition.type)) {
      assert.equal(definition.ageStatus, 'adult-confirmed');
      assert.equal(definition.consentStatus, 'no-romance');
    }
  }
});

test('catalog identities, prompts and asset paths are unique and variants cite exact CG01', () => {
  for (const property of ['id', 'promptId', 'imagePath', 'thumbnailPath']) {
    const values = CG_CATALOG.map((definition) => definition[property]);
    assert.equal(new Set(values).size, CG_CATALOG.length, `${property} must be unique`);
  }

  for (const definition of CG_CATALOG.filter(({ type }) => type !== 'characterSolo')) {
    assert.ok(
      definition.sourceRefs.includes(
        `/cg/${definition.universeKey}/${definition.characterKey}/character-solo-openai-v1.png`
      ),
      `${definition.id} must cite its exact CG01 PNG`
    );
  }

  for (const heroId of Object.keys(EXPECTED_TYPES_BY_HERO)) {
    const base = CG_CATALOG.filter(({ characterId, family }) => characterId === heroId && ['Canon', 'Nexus'].includes(family));
    assert.equal(new Set(base.map(({ characterReferenceId }) => characterReferenceId)).size, 1);
  }

  for (const definition of CG_CATALOG) assert.strictEqual(getCgDefinition(definition.id), definition);
  assert.equal(getCgDefinition('cg:missing'), null);
});

test('all released asset families follow the immutable OpenAI production path contract', () => {
  for (const definition of CG_CATALOG) {
    const basename = CG_PRODUCTION_FILE_BASENAMES[definition.type];
    const base = `/cg/${definition.universeKey}/${definition.characterKey}/${basename}`;
    assert.equal(definition.imagePath, `${base}.webp`);
    assert.equal(definition.thumbnailPath, `${base}-thumb.webp`);
    assert.deepEqual(
      buildCgPaths({
        universeKey: definition.universeKey,
        characterKey: definition.characterKey,
        type: definition.type
      }),
      { imagePath: `${base}.webp`, thumbnailPath: `${base}-thumb.webp` }
    );
  }

  assert.deepEqual(buildCharacterSoloCgPaths({ universeKey: 'halo', characterKey: 'arbiter' }), {
    imagePath: '/cg/halo/arbiter/character-solo-openai-v1.webp',
    thumbnailPath: '/cg/halo/arbiter/character-solo-openai-v1-thumb.webp'
  });
  assert.throws(
    () => buildCgPaths({ universeKey: '../halo', characterKey: 'arbiter', type: 'weaponSolo' }),
    /kebab-case/
  );
  assert.throws(
    () => buildCgPaths({ universeKey: 'halo', characterKey: 'arbiter', type: 'furryHuman' }),
    /does not publish/
  );
});

test('family tabs distinguish Canon, Nexus, Fan Art and What If without false canon claims', () => {
  const expectedCounts = { Canon: 42, Nexus: 6, 'Fan Art': 12, 'What If': 23 };
  for (const [family, count] of Object.entries(expectedCounts)) {
    assert.equal(CG_CATALOG.filter((definition) => definition.family === family).length, count);
  }

  for (const definition of CG_CATALOG) {
    const baseContinuity = BASE_CONTINUITIES[definition.characterId];
    if (definition.type === 'actionScene') {
      assert.equal(definition.family, 'Nexus');
      if (definition.characterId === 'player_anchor') {
        assert.equal(definition.continuityId, baseContinuity);
        assert.equal(definition.canonStatus, 'project-canon');
      } else {
        assert.equal(definition.continuityId, `${baseContinuity}+nexus`);
        assert.equal(definition.canonStatus, 'nexus-variant');
      }
    } else if (definition.family === 'Canon') {
      assert.equal(definition.continuityId, baseContinuity);
    }

    if (definition.characterId === 'player_anchor') {
      assert.equal(definition.rightsClass, 'project-original');
    } else {
      assert.equal(definition.rightsClass, 'unofficial-fan-art');
      assert.match(definition.credits.fr, /non officiel/i);
    }
  }
});

test('only unlockedHeroes ownership unlocks every CG tied to that hero', () => {
  for (const definition of CG_CATALOG) {
    assert.deepEqual(Object.keys(definition.unlock).sort(), ['heroId', 'type']);
    assert.equal(isCgUnlocked(definition, { unlockedHeroes: [] }), false);
    assert.equal(isCgUnlocked(definition, { unlockedHeroes: [definition.characterId] }), true);
    assert.equal(isCgUnlocked(definition, {
      unlockedHeroes: [],
      inventory: [definition.characterId],
      heroSkins: [definition.characterId],
      equippedSkin: definition.characterId
    }), false);
  }
});

test('locked media returns null paths so the UI makes no image request', () => {
  const leonAction = CG_CATALOG.find(({ characterId, type }) => characterId === 'leon' && type === 'actionScene');
  assert.deepEqual(resolveCgMedia(leonAction, { unlockedHeroes: [], inventory: ['leon'] }), {
    imagePath: null,
    thumbnailPath: null
  });
  assert.deepEqual(resolveCgMedia(leonAction, { unlockedHeroes: ['leon'] }), {
    imagePath: '/cg/resident-evil/leon/action-scene-openai-v1.webp',
    thumbnailPath: '/cg/resident-evil/leon/action-scene-openai-v1-thumb.webp'
  });
});

test('schema rejects unsafe fan-service, false family status and non-contract paths', () => {
  const leonBeach = CG_CATALOG.find(({ characterId, type }) => characterId === 'leon' && type === 'beachFamily');
  assert.throws(() => createCgDefinition({ ...leonBeach, ageStatus: 'unknown-family-safe-only' }), /adult-confirmed/);
  assert.throws(() => createCgDefinition({ ...leonBeach, consentStatus: 'not-required' }), /validated ageStatus and consentStatus/);
  assert.throws(() => createCgDefinition({ ...leonBeach, canonStatus: 'canon-inspired' }), /Fan Art CG/);

  const leon = CG_CATALOG.find(({ characterId, type }) => characterId === 'leon' && type === 'characterSolo');
  assert.throws(() => createCgDefinition({
    ...leon,
    unlock: { type: 'heroOwned', heroId: 'leon', skinId: 'rpd' }
  }), /Unsupported unlock field/);
  assert.throws(() => createCgDefinition({ ...leon, publishedAt: '01/08/2026' }), /YYYY-MM-DD/);
  assert.throws(() => createCgDefinition({
    ...leon,
    imagePath: '/cg/resident-evil/leon/official.png'
  }), /immutable OpenAI production path contract/);
});
