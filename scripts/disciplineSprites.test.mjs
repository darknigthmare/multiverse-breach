import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { HEROES_DB } from '../src/game/heroes.js';
import { sanitizeSaveCore } from '../src/game/saveValidation.js';
import { applyActorAppearance, wardrobeSelectionStatus } from '../src/game/wardrobe.js';
import {
  DISCIPLINE_COSTUME_BASE,
  DISCIPLINE_HERO_BINDINGS,
  DISCIPLINE_SPRITE_REGISTRY,
  DISCIPLINE_STATIC_LAYOUT,
  DISCIPLINE_UNIVERSE,
  createDisciplineSpriteRegistry,
  disciplineCostumeId,
  getDisciplineCostumes,
  getDisciplineSpriteLayout,
  getDisciplineSpriteSources,
  resolveDisciplineCostume
} from '../src/game/disciplineSprites.js';
import {
  getHeroSpriteSheetSources,
  getHeroSpriteSheetSrc,
  getSpriteFrameForLayout,
  getSpriteSheetLayout
} from '../src/game/spriteAssets.js';

const actors = HEROES_DB.filter(hero => hero.universe === DISCIPLINE_UNIVERSE);
const saori = actors.find(hero => hero.id === 'discipline_saori_otokawa');
const originalSource = actor => `/sprites/generated/heroes/discipline-the-record-of-a-crusade/${actor.id.replaceAll('_', '-')}.png`;
const fixtureRow = (costumeId, extra = {}) => ({
  characterId: 'saori', characterName: 'Saori Otokawa', costumeId,
  label: { fr: costumeId, en: costumeId }, src: `${DISCIPLINE_COSTUME_BASE}test-${costumeId}.png`,
  category: 'uniform', provenance: 'reference', available: true, isDefault: false, ...extra
});

test('catalogue binds only the three existing exact identities and preserves their origin sheets', () => {
  assert.equal(actors.length, 3);
  assert.deepEqual(Object.keys(DISCIPLINE_HERO_BINDINGS).sort(), actors.map(actor => actor.id).sort());
  for (const actor of actors) {
    assert.ok(getDisciplineCostumes(actor).length, actor.id);
    assert.equal(actor.nonCombat, true);
    assert.equal(getHeroSpriteSheetSrc(actor), originalSource(actor));
    assert.deepEqual(getHeroSpriteSheetSources(actor), [originalSource(actor)]);
  }
  assert.equal(getDisciplineCostumes({ ...saori, id: 'unregistered', name: saori.name }).length, 0);
  assert.equal(getDisciplineCostumes({ ...saori, universe: 'Another universe' }).length, 0);
});

test('every registered PNG remains one entire frame in every animation state and URL form', () => {
  assert.ok(DISCIPLINE_SPRITE_REGISTRY.entries.length > 0);
  for (const entry of DISCIPLINE_SPRITE_REGISTRY.entries) {
    for (const src of [entry.src, `${entry.src}?v=2#preview`, `https://game.example${entry.src}?v=2`]) {
      const layout = getSpriteSheetLayout(src);
      assert.equal(layout.columns, 1, src);
      assert.equal(layout.rows, 1, src);
      for (const state of ['idle', 'run', 'attack', 'defense', 'support', 'special', 'hit', 'dead', 'jump', 'fall', 'unknown']) {
        for (const time of [0, 15, 999]) {
          assert.deepEqual(getSpriteFrameForLayout(state, time, layout), { row: 0, col: 0, trim: null });
        }
      }
    }
  }
  assert.equal(getSpriteSheetLayout('/sprites/generated/heroes/other/existing.png').columns, 4);
});

test('each available catalogue file is an installed RGBA PNG with nonzero dimensions', () => {
  for (const entry of DISCIPLINE_SPRITE_REGISTRY.entries.filter(row => row.available)) {
    const file = readFileSync(new URL(`../public${entry.src}`, import.meta.url));
    assert.equal(file.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', entry.src);
    assert.equal(file[25], 6, `${entry.src}: expected RGBA PNG`);
    assert.ok(file.readUInt32BE(16) > 0 && file.readUInt32BE(20) > 0, entry.src);
  }
});

test('selection preserves gameplay fields and never promotes generated artwork to official canon', () => {
  for (const actor of actors) {
    const before = structuredClone(actor);
    for (const costume of getDisciplineCostumes(actor)) {
      const changed = applyActorAppearance(actor, costume.id);
      assert.equal(changed.disciplineSpriteId, costume.id);
      assert.equal(getHeroSpriteSheetSrc(changed), costume.src);
      assert.equal(changed.activeSkin.canonical, false);
      assert.equal(changed.activeSkin.provenance, costume.provenance);
      const { activeSkin, disciplineSpriteId, ...unchanged } = changed;
      assert.deepEqual(unchanged, actor);
      for (const key of ['stats', 'simple', 'secondary', 'defense', 'special']) assert.equal(changed[key], actor[key]);
      assert.equal(wardrobeSelectionStatus(actor, costume.id), 'GENERATED_STATIC_COSTUME');
    }
    assert.deepEqual(actor, before);
  }
});

test('a saved costume cannot leak across actors, universes or a source-locked scene', () => {
  const selected = getDisciplineCostumes(saori)[0].id;
  for (const actor of [actors.find(actor => actor !== saori), { ...saori, universe: 'Halo' }, { ...saori, id: 'saori-copy' }]) {
    assert.equal(resolveDisciplineCostume(actor, selected), null);
    assert.equal(applyActorAppearance(actor, selected), actor);
  }
  assert.equal(applyActorAppearance(saori, selected, {}, { sourceLocked: true }), saori);
  assert.equal(getHeroSpriteSheetSrc(applyActorAppearance(saori, selected, {}, { sourceLocked: true })), originalSource(saori));
  for (const invalid of ['discipline-sprite-v1:saori:missing', '__proto__', 'constructor', {}, [], 42]) {
    assert.equal(applyActorAppearance(saori, invalid), saori);
    assert.equal(getHeroSpriteSheetSrc(applyActorAppearance(saori, invalid)), originalSource(saori));
  }
});

test('existing save normalization preserves the selected costume without inventory or actor grants', () => {
  const selected = getDisciplineCostumes(saori)[0].id;
  const saved = sanitizeSaveCore({
    unlockedHeroes: [saori.id], activeTeam: [saori.id], inventory: ['existing-item'], heroSkins: { [saori.id]: selected }
  }, { knownHeroIds: HEROES_DB.map(actor => actor.id) });
  assert.equal(saved.heroSkins[saori.id], selected);
  assert.deepEqual(saved.inventory, ['existing-item']);
  assert.equal(getHeroSpriteSheetSrc(applyActorAppearance(saori, saved.heroSkins[saori.id])), getDisciplineCostumes(saori)[0].src);
});

test('fallback stays on the same identity and skips unavailable entries', () => {
  const catalogue = [
    fixtureRow('uniform', { isDefault: true }),
    fixtureRow('civilian', { category: 'civilian', provenance: 'adapted' }),
    fixtureRow('pending', { available: false })
  ];
  const registry = createDisciplineSpriteRegistry(catalogue);
  assert.equal(getDisciplineCostumes(saori, registry).length, 2);
  assert.equal(resolveDisciplineCostume(saori, disciplineCostumeId('saori', 'pending'), registry), null);
  assert.equal(getDisciplineSpriteLayout(catalogue[2].src, registry), DISCIPLINE_STATIC_LAYOUT);
  assert.deepEqual(getDisciplineSpriteSources({ ...saori, disciplineSpriteId: disciplineCostumeId('saori', 'civilian') }, registry), [catalogue[1].src, catalogue[0].src]);
  assert.deepEqual(getDisciplineSpriteSources({ ...saori, disciplineSpriteId: disciplineCostumeId('saori', 'uniform') }, registry), [catalogue[0].src]);
  assert.deepEqual(getDisciplineSpriteSources({ ...saori, disciplineSpriteId: 'bad' }, registry), []);
});

test('a corrected variant keeps its original costume before the character default in the fallback chain', () => {
  const originalId = disciplineCostumeId('saori', 'civilian');
  const revisedId = disciplineCostumeId('saori', 'civilian-reference-v2');
  const catalogue = [
    fixtureRow('uniform', { isDefault: true }),
    fixtureRow('civilian', { category: 'civilian' }),
    fixtureRow('civilian-reference-v2', { category: 'civilian', variantOf: originalId })
  ];
  const registry = createDisciplineSpriteRegistry(catalogue);
  assert.deepEqual(getDisciplineSpriteSources({ ...saori, disciplineSpriteId: revisedId }, registry), catalogue.slice().reverse().map(row => row.src));
  assert.deepEqual(getDisciplineSpriteSources({ ...saori, disciplineSpriteId: originalId }, registry), [catalogue[1].src, catalogue[0].src]);
  const unavailable = createDisciplineSpriteRegistry(catalogue.map(row => row.costumeId === 'civilian' ? { ...row, available: false } : row));
  assert.deepEqual(getDisciplineSpriteSources({ ...saori, disciplineSpriteId: revisedId }, unavailable), [catalogue[2].src, catalogue[0].src]);
});

test('variant links cannot replace defaults or point to a missing or different character', () => {
  const original = fixtureRow('uniform', { isDefault: true });
  const revised = fixtureRow('uniform-reference-v2', { variantOf: disciplineCostumeId('saori', 'uniform') });
  assert.throws(() => createDisciplineSpriteRegistry([revised]), /variant origin/);
  assert.throws(() => createDisciplineSpriteRegistry([original, { ...revised, variantOf: disciplineCostumeId('saori', 'uniform-reference-v2') }]), /variant origin/);
  assert.throws(() => createDisciplineSpriteRegistry([{ ...original, isDefault: false }, { ...revised, isDefault: true }]), /variant origin/);
  assert.throws(() => createDisciplineSpriteRegistry([original, { ...revised, characterId: 'ruri' }]), /variant origin/);
});

test('independent OVA outfits keep style references separate from costume ancestry and fallback', () => {
  const outfits = DISCIPLINE_SPRITE_REGISTRY.entries.filter(row => row.newOutfit && row.sourceMedium === 'anime_ova');
  const manifest = JSON.parse(readFileSync(new URL('../docs/discipline-sprites/manifest.json', import.meta.url), 'utf8'));
  assert.ok(outfits.length, 'Approved OVA outfits must be installed');
  for (const outfit of outfits) {
    assert.equal(outfit.provenance, 'reference');
    if (outfit.newCharacter) {
      assert.equal(Object.values(DISCIPLINE_HERO_BINDINGS).includes(outfit.characterId), false,
        'Anonymous artwork must not create a playable hero binding');
    } else {
      assert.equal(outfit.isDefault, false);
    }
    assert.equal(outfit.variantOf, undefined, 'An OVA outfit must not be linked as a correction of a JGSDF costume');
    const style = outfit.styleSourceId && DISCIPLINE_SPRITE_REGISTRY.byId[outfit.styleSourceId];
    if (outfit.styleSourceId !== undefined) {
      assert.ok(style, outfit.id);
      if (!outfit.newCharacter) assert.equal(style.characterId, outfit.characterId);
      assert.notEqual(style.src, outfit.src);
    } else {
      // A direct model-sheet study has no previous sprite as a style source.
      // Require traceable source evidence instead of inventing costume ancestry.
      assert.equal(outfit.paletteStatus, 'source-monochrome', outfit.id);
      assert.ok(Array.isArray(outfit.sourceEvidenceIds) && outfit.sourceEvidenceIds.length, outfit.id);
      const asset = manifest.assets.find(row => row.id === `${outfit.characterId}:${outfit.costumeId}`);
      assert.ok(asset, outfit.id);
      assert.equal(asset.canonicalPaletteCertified, false, outfit.id);
      assert.equal(asset.proportionReview.fullBodyOneToOneCertified, false, outfit.id);
      const evidenceIds = new Set(asset.referenceEvidence.map(row => row.id));
      for (const evidenceId of outfit.sourceEvidenceIds) assert.ok(evidenceIds.has(evidenceId), evidenceId);
    }
    const actor = actors.find(candidate => DISCIPLINE_HERO_BINDINGS[candidate.id] === outfit.characterId);
    if (!actor) continue;
    const sources = getDisciplineSpriteSources(applyActorAppearance(actor, outfit.id));
    assert.equal(sources[0], outfit.src);
    if (style) assert.equal(sources.includes(style.src), false, 'Style references must not change the selected outfit fallback');
  }
});

test('catalogue rejects ambiguous identities, conflicting defaults and unclassified adaptations', () => {
  assert.throws(() => createDisciplineSpriteRegistry([fixtureRow('one'), fixtureRow('one')]), /Duplicate Discipline costume/);
  assert.throws(() => createDisciplineSpriteRegistry([fixtureRow('one', { isDefault: true }), fixtureRow('two', { isDefault: true })]), /Duplicate Discipline default/);
  assert.throws(() => createDisciplineSpriteRegistry([fixtureRow('one'), fixtureRow('two', { src: fixtureRow('one').src })]), /Duplicate Discipline costume PNG/);
  for (const src of ['https://example.com/costume.png', '/unknown.png', `${DISCIPLINE_COSTUME_BASE}../other.png`]) {
    assert.throws(() => createDisciplineSpriteRegistry([fixtureRow('one', { src })]), /Invalid Discipline costume PNG path/);
  }
  assert.throws(() => createDisciplineSpriteRegistry([fixtureRow('one', { provenance: 'official' })]), /provenance/);
  assert.throws(() => createDisciplineSpriteRegistry([fixtureRow('one', { available: undefined })]), /flags must be explicit/);
});

let vite;
const originalImage = globalThis.Image;
let moduleSerial = 0;
before(async () => {
  vite = await createServer({ configFile: false, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true, hmr: false, watch: null } });
});
after(async () => {
  if (originalImage === undefined) delete globalThis.Image;
  else globalThis.Image = originalImage;
  await vite?.close();
});

const loadRenderer = async failingSources => {
  const loaded = [];
  globalThis.Image = class {
    set src(value) {
      this.currentSrc = value;
      this.complete = true;
      this.naturalWidth = failingSources.has(value) ? 0 : 1254;
      this.naturalHeight = failingSources.has(value) ? 0 : 1254;
      loaded.push(value);
      if (failingSources.has(value)) queueMicrotask(() => this.onerror?.());
    }
    get src() { return this.currentSrc; }
  };
  return { ...(await vite.ssrLoadModule(`/src/game/renderer.js?discipline-test=${++moduleSerial}`)), loaded };
};
const canvas = () => {
  const calls = [];
  const ctx = new Proxy({ canvas: { isConnected: true } }, {
    get(target, key) { return key in target ? target[key] : (...args) => { calls.push([key, ...args]); }; }
  });
  return { ctx, calls };
};

test('actual renderer draws the full static PNG and keeps horizontal facing', async () => {
  const costume = getDisciplineCostumes(saori)[0];
  const actor = applyActorAppearance(saori, costume.id);
  const { drawPixelSprite } = await loadRenderer(new Set());
  const { ctx, calls } = canvas();
  drawPixelSprite(ctx, 80, 120, { ...actor, state: 'attack' }, 130, -1, 72, 'rpg');
  const draw = calls.find(call => call[0] === 'drawImage');
  assert.ok(draw);
  assert.equal(draw[1].src, costume.src);
  assert.deepEqual(draw.slice(2, 6), [0, 0, 1254, 1254]);
  assert.ok(calls.some(call => call[0] === 'scale' && call[1] === -1 && call[2] === 1));
});

test('saved corrected variants render whole and recover to the preserved costume of the same identity', async () => {
  const revised = DISCIPLINE_SPRITE_REGISTRY.entries.filter(row => row.variantOf);
  assert.ok(revised.length, 'Reviewed variants must be installed before this regression runs');
  let rendered = 0;
  for (const costume of revised) {
    const original = DISCIPLINE_SPRITE_REGISTRY.byId[costume.variantOf];
    assert.ok(original?.available, costume.id);
    assert.notEqual(original.src, costume.src, costume.id);
    const actor = actors.find(candidate => DISCIPLINE_HERO_BINDINGS[candidate.id] === costume.characterId);
    if (!actor) continue;
    const save = sanitizeSaveCore({ heroSkins: { [actor.id]: costume.id } }, { knownHeroIds: HEROES_DB.map(row => row.id) });
    const dressed = applyActorAppearance(actor, save.heroSkins[actor.id]);
    assert.equal(dressed.disciplineSpriteId, costume.id);
    assert.equal(resolveDisciplineCostume(actor, original.id), original, 'The old saved choice remains valid');
    for (const [failed, expected] of [[new Set(), costume.src], [new Set([costume.src]), original.src]]) {
      const { drawPixelSprite } = await loadRenderer(failed);
      const { ctx, calls } = canvas();
      drawPixelSprite(ctx, 80, 120, { ...dressed, state: 'idle' }, 0);
      await new Promise(resolve => setImmediate(resolve));
      const draw = calls.find(call => call[0] === 'drawImage');
      assert.ok(draw, costume.id);
      assert.equal(draw[1].src, expected, costume.id);
      assert.deepEqual(draw.slice(2, 6), [0, 0, 1254, 1254], costume.id);
      assert.equal(dressed.disciplineSpriteId, costume.id, 'A network error must not alter the saved choice');
    }
    rendered++;
  }
  assert.ok(rendered, 'At least one corrected variant belongs to a registered hero');
});

test('actual renderer recovers from failed selected and default PNGs to the existing sheet', async () => {
  const costume = getDisciplineCostumes(saori).find(row => !row.isDefault);
  assert.ok(costume, 'Saori must have an alternate costume for the load-failure regression');
  const actor = applyActorAppearance(saori, costume.id);
  const sources = getHeroSpriteSheetSources(actor);
  assert.equal(sources[0], costume.src);
  assert.equal(sources.at(-1), originalSource(saori));
  const { drawPixelSprite, drawCombatantBust, loaded } = await loadRenderer(new Set(sources.slice(0, -1)));
  const { ctx, calls } = canvas();
  drawPixelSprite(ctx, 80, 120, { ...actor, state: 'idle' }, 0);
  await new Promise(resolve => setImmediate(resolve));
  const draw = calls.find(call => call[0] === 'drawImage');
  assert.ok(draw);
  assert.equal(draw[1].src, originalSource(saori));
  assert.deepEqual(loaded, sources);
  calls.length = 0;
  assert.equal(drawCombatantBust(ctx, 0, 0, 80, 80, actor), true);
  assert.equal(calls.find(call => call[0] === 'drawImage')[1].src, originalSource(saori));
  assert.equal(actor.disciplineSpriteId, costume.id, 'a network failure must not rewrite the saved selection');
});

test('a missing alternate uses the same character default as a full one-by-one frame', async () => {
  const costume = getDisciplineCostumes(saori).find(row => !row.isDefault);
  const actor = applyActorAppearance(saori, costume.id);
  const sources = getHeroSpriteSheetSources(actor);
  assert.equal(sources.length, 3);
  const { drawPixelSprite, loaded } = await loadRenderer(new Set([sources[0]]));
  const { ctx, calls } = canvas();
  drawPixelSprite(ctx, 80, 120, { ...actor, state: 'run' }, 80);
  await new Promise(resolve => setImmediate(resolve));
  const draw = calls.find(call => call[0] === 'drawImage');
  assert.ok(draw);
  assert.equal(draw[1].src, sources[1]);
  assert.deepEqual(draw.slice(2, 6), [0, 0, 1254, 1254]);
  assert.deepEqual(loaded, sources.slice(0, 2));
});

test('actual wardrobe displays delivered outfits with provenance and selection controls', async () => {
  const { WardrobeContents } = await vite.ssrLoadModule('/src/components/CharacterWardrobe.jsx');
  const costumes = getDisciplineCostumes(saori);
  const markup = renderToStaticMarkup(React.createElement(WardrobeContents, { actor: saori, lang: 'fr', onSelect() {} }));
  assert.match(markup, /Tenues disponibles/);
  assert.match(markup, /sprites statiques en pied/);
  assert.match(markup, /Équiper la tenue/);
  assert.equal((markup.match(/class="character-wardrobe__sprite"/g) || []).length, costumes.length);
  if (costumes.some(row => row.provenance === 'adapted')) assert.match(markup, /Adaptation identifiée/);
  assert.doesNotMatch(markup, /Source officielle — graphismes à produire/);
});
