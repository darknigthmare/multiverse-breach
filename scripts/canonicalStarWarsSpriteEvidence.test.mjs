import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { buildEditionSpriteAudit,EDITION_IDS,REVIEW_COLUMNS,EXACT_SOURCE_ART_BLOCKERS } from './auditCanonicalStarWarsSprites.mjs';
import { QUARANTINED_CANON_SPRITES, getQuarantinedCanonSprite } from '../src/game/canonicalSpriteQuarantine.js';
import { SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_EXPANSIONS, SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_OVERRIDES } from '../src/game/solarOppositesSirenStarWarsPack.js';
import { createServer } from './fixtures/ssrTestServer.mjs';
import { getHeroCompleteSpritePack, getHeroMeleeAnimationFrame, getHeroMeleeSpriteSheetSrcs, getHeroSpriteSheetSources } from '../src/game/spriteAssets.js';

test('seven edition-specific PNG sources exist and have different file fingerprints',()=>{
  const {rows}=buildEditionSpriteAudit();
  assert.equal(rows.length,7);
  assert.deepEqual(rows.map(x=>x.actorId),EDITION_IDS);
  assert.equal(new Set(rows.map(x=>x.fileSha256)).size,7);
  assert.equal(new Set(rows.map(x=>x.spritePath)).size,7);
  for(const row of rows) {
    assert.ok(row.byteSize>32000,row.actorId);
    assert.ok(row.pngWidth>=128&&row.pngHeight>=128,row.actorId);
    assert.ok(Number.isInteger(row.frameWidth)&&Number.isInteger(row.frameHeight),'4x4 renderer crop must use whole pixels: '+row.actorId);
    assert.ok(row.frameWidth>=32&&row.frameHeight>=32,row.actorId);
    const known=EXACT_SOURCE_ART_BLOCKERS[row.actorId];
    const locked=known?.sha256===row.fileSha256 ? known : null;
    assert.equal(row.silhouetteReview,locked?.silhouetteReview || 'PENDING_HUMAN_SOURCE_COMPARISON');
    assert.equal(row.weaponReview,locked?.weaponReview || 'PENDING_HUMAN_SOURCE_COMPARISON');
    assert.equal(row.animationReview,locked?.animationReview || 'PENDING_PLAYABLE_CAPTURE');
    assert.ok(!/CERTIFIED|APPROVED_1A1/i.test(row.weaponReview+row.silhouetteReview));
  }
});

test('source-locked sprite inspection CSV must reproduce directly from the same PNGs and actor data',()=>{
  const {rows,csv}=buildEditionSpriteAudit();
  const snapshot=readFileSync(new URL('../docs/excel/star-wars-edition-sprite-review-2026-11-01.csv',import.meta.url),'utf8');
  assert.equal(snapshot,csv);
  assert.equal(csv.trimEnd().split('\n').length,8);
  assert.equal(REVIEW_COLUMNS.length,23);
  assert.equal(rows.find(x=>x.actorId==='darth_maul').prosthetics,'Mandalorian-Issue Humanoid Cybernetic Legs');
  assert.ok(!rows.find(x=>x.actorId==='darth_maul').equipment.includes('Cybernetic Legs'));
  assert.equal(rows.find(x=>x.actorId==='darth_revan').sourceKind,'501ST_COSTUME_REFERENCE');
  assert.equal(rows.find(x=>x.actorId==='ahsoka').sourceKind,'STARWARS_OFFICIAL');
});

test('DLC-only checkout audits the same seven archived PNGs without public mirrors or changing review findings', () => {
  const fixture = mkdtempSync(path.join(tmpdir(), 'star-wars-source-evidence-'));
  try {
    const manifest = JSON.parse(readFileSync(new URL('../DLC/StarWars/manifest.json', import.meta.url)));
    const inventory = JSON.parse(readFileSync(new URL('../DLC/StarWars/assets.json', import.meta.url)));
    const urls = new Set(buildEditionSpriteAudit().rows.map(row => row.spritePath));
    inventory.assets = inventory.assets.filter(asset => urls.has(asset.publicPath));
    assert.equal(inventory.assets.length, 7);
    mkdirSync(path.join(fixture, 'DLC/StarWars'), { recursive: true });
    writeFileSync(path.join(fixture, 'DLC/StarWars/manifest.json'), JSON.stringify(manifest));
    writeFileSync(path.join(fixture, 'DLC/StarWars/assets.json'), JSON.stringify(inventory));
    for (const asset of inventory.assets) {
      const target = path.join(fixture, asset.sourcePath);
      mkdirSync(path.dirname(target), { recursive: true });
      copyFileSync(new URL(`../${asset.sourcePath}`, import.meta.url), target);
    }
    const actual = buildEditionSpriteAudit({ projectRoot: fixture });
    assert.deepEqual(actual, buildEditionSpriteAudit());
    assert.equal(actual.rows.filter(row => row.weaponReview.startsWith('BLOCKED_')).length, 3);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('known incorrect pictures are blocked by exact file SHA until replacement',()=>{
  const {rows}=buildEditionSpriteAudit();
  const byId=Object.fromEntries(rows.map(x=>[x.actorId,x]));
  for(const id of ['ahsoka_padawan','ahsoka','darth_revan']){
    const current=byId[id],saved=EXACT_SOURCE_ART_BLOCKERS[id];
    assert.equal(current.fileSha256,saved.sha256);
    assert.match(current.weaponReview,/^BLOCKED_/);
    assert.match(current.animationReview,/^BLOCKED_/);
    assert.ok(current.observedDefect.length>45);
  }
  assert.equal(byId.ahsoka_adult.visualReferenceUrl,'https://www.starwars.com/news/star-wars-rebels-costume-and-lightsaber-color-guide-for-ahsoka-tano');
  for(const id of ['ahsoka_adult','aayla_secura','darth_maul','darth_talon']){
    assert.equal(byId[id].weaponReview,'PENDING_HUMAN_SOURCE_COMPARISON');
  }
});

test('confirmed wrong Star Wars actor art is quarantined by exact source incarnation without deleting its PNG', () => {
  const rows=Object.fromEntries(buildEditionSpriteAudit().rows.map(row=>[row.actorId,row]));
  const actors=[
    ...SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_EXPANSIONS['Star Wars'],
    ...Object.values(SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_OVERRIDES)
  ];
  assert.deepEqual(Object.keys(QUARANTINED_CANON_SPRITES).sort(),
    ['ahsoka','ahsoka_padawan','darth_revan'].sort());
  for(const [id,record] of Object.entries(QUARANTINED_CANON_SPRITES)) {
    const sourceActor=actors.find(actor=>actor.id===id);
    assert.ok(sourceActor,id);
    // Pack templates intentionally omit the universe; heroes.js adds it
    // when installing the actor in the live roster.
    const hero={...sourceActor,universe:'Star Wars'};
    assert.equal(hero.incarnation,record.incarnation,id+' incarnation must match');
    assert.equal(record.universe,'Star Wars');
    assert.equal(record.asset,rows[id].spritePath,'archive must keep original PNG path');
    assert.equal(record.sha256,EXACT_SOURCE_ART_BLOCKERS[id].sha256,
      'quarantine must correspond to a reviewed and fingerprinted wrong sheet');
    assert.equal(getQuarantinedCanonSprite(hero),record);
    assert.equal(getQuarantinedCanonSprite({...hero,universe:'Other'}),null);
    assert.equal(getQuarantinedCanonSprite({...hero,incarnation:'another version'}),null,
      'an alternate incarnation cannot inherit the visual rejection');
    assert.equal(getQuarantinedCanonSprite({...hero,sourceLockedArtApproved:true}),record,
      'unreviewed costume flags must never override the source-art review gate');
  }
  for(const id of EDITION_IDS.filter(id=>!QUARANTINED_CANON_SPRITES[id])) {
    const sourceActor=actors.find(actor=>actor.id===id);
    assert.ok(sourceActor,id);
    assert.equal(getQuarantinedCanonSprite({...sourceActor,universe:'Star Wars'}),null,
      'unreviewed is not the same as a proven inaccurate bitmap');
  }
});

test('quarantine blocks every playable source even with cosmetic and production candidates while keeping other incarnations available', () => {
  for (const [id, record] of Object.entries(QUARANTINED_CANON_SPRITES)) {
    const hero = { id, universe: record.universe, incarnation: record.incarnation,
      activeSkin: 'sourceLockedArtApproved', sourceLockedArtApproved: true,
      portrait: record.asset, spriteSource: record.asset,
      production: { sprite: record.asset }, heroVariants: [{ src: record.asset }] };
    for (const context of ['auto', 'rpg', 'melee', 'tactics', 'collection', 'hud', 'fps', 'kart']) {
      assert.deepEqual(getHeroSpriteSheetSources(hero, context), [], `${id}: ${context}`);
    }
    assert.equal(getHeroCompleteSpritePack(hero), null);
    assert.equal(getHeroMeleeAnimationFrame(hero), null);
    assert.deepEqual(getHeroMeleeSpriteSheetSrcs(hero), []);
    assert.ok(getHeroSpriteSheetSources({ ...hero, incarnation: 'another version' }).length,
      'another incarnation keeps the normal source resolver');
    assert.ok(getHeroSpriteSheetSources({ ...hero, universe: 'Other' }).length);
    assert.equal(record.asset, QUARANTINED_CANON_SPRITES[id].asset, 'archival URL is retained');
  }
});

test('real roster, Kart and Canvas renderers keep quarantined actors playable without requesting their PNGs', async () => {
  const server = await createServer({ configFile: false, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  const originalImage = globalThis.Image;
  const requested = [];
  globalThis.Image = class { set src(value) { requested.push(value); } };
  try {
    const { HEROES_DB } = await server.ssrLoadModule('/src/game/heroes.js');
    const { drawPixelSprite, drawCombatantBust } = await server.ssrLoadModule('/src/game/renderer.js');
    const { getKartForHero } = await server.ssrLoadModule('/src/game/kart/kartRoster.js');
    const { getExtinctionViewmodel } = await server.ssrLoadModule('/src/game/extinctionContent.js');
    for (const id of Object.keys(QUARANTINED_CANON_SPRITES)) {
      const hero = HEROES_DB.find(actor => actor.id === id);
      assert.ok(getQuarantinedCanonSprite(hero), `${id}: actual DLC incarnation is quarantined`);
      const before = JSON.stringify(hero);
      assert.deepEqual([...getKartForHero(id).driverSprite.sources], [], `${id}: no driver billboard`);
      assert.equal(getExtinctionViewmodel(hero).src, '', `${id}: no invented first-person image`);
      const bladeCount = id === 'ahsoka' ? 2 : 1;
      for (const context of ['rpg', 'melee', 'tactics', 'collection', 'fps', 'kart']) {
        const calls = [];
        const ctx = new Proxy({ canvas: { isConnected: true } }, {
          get(target, key) {
            if (key in target) return target[key];
            return (...args) => calls.push({ method: key, args, fillStyle: target.fillStyle, shadowBlur: target.shadowBlur });
          }
        });
        drawPixelSprite(ctx, 50, 70, { ...hero, state: 'attack' }, 0, 1, 72, context);
        assert.equal(calls.filter(call => call.method === 'fillRect' && call.fillStyle === hero.weaponColor && call.shadowBlur === 6).length,
          bladeCount, `${id}/${context}: correct procedural saber count`);
        assert.ok(calls.some(call => call.method === 'fillText' && call.args[0] === 'ART PENDING'));
        drawCombatantBust(ctx, 0, 0, 60, 72, hero);
      }
      assert.equal(JSON.stringify(hero), before, 'rendering cannot change gameplay/source data');
    }
    assert.deepEqual(requested, [], 'no quarantined PNG is requested by the real renderers');
  } finally {
    if (originalImage === undefined) delete globalThis.Image;
    else globalThis.Image = originalImage;
    await server.close();
  }
});


test('mission, codex and fighter portraits suppress rejected art but archival sprite paths remain indexed', () => {
  const hub=readFileSync(new URL('../src/components/HubScreen.jsx',import.meta.url),'utf8');
  const fighter=readFileSync(new URL('../src/components/FighterMode.jsx',import.meta.url),'utf8');
  const archive=readFileSync(new URL('../src/components/UniverseArchiveReader.jsx',import.meta.url),'utf8');
  assert.match(hub,/const artBlocked = Boolean\(getQuarantinedCanonSprite\(hero\)\)/);
  assert.match(hub,/const src = hero && !artBlocked \? getHeroSpriteSheetSrc\(hero, 'melee'\) : ''/);
  assert.match(archive,/const rejectedSourceArt = getQuarantinedCanonSprite\(hero\)/);
  assert.match(archive,/backgroundImage: spriteSrc \? `url\(/);
  assert.match(archive,/ART À REFAIRE/);
  assert.match(fighter,/const artBlocked = Boolean\(getQuarantinedCanonSprite\(hero\)\)/);
  assert.match(fighter,/const src = artBlocked \? '' : getHeroSpriteSheetSrc\(hero, 'melee'\)/);
  assert.match(fighter,/if \(!src\) \{\s+setLoaded\(false\);/);
  assert.match(fighter,/artBlocked \? 'ART' : initials/);
  assert.match(hub,/const getHeroSpriteInfo = useCallback/,'archive and administrative asset inspector are preserved');
  assert.match(hub,/reviewRejected: Boolean\(rejectedSourceArt\)/);
  assert.match(hub,/spriteInfo\.reviewRejected \? 'OLD' : 'IA'/);
  assert.match(hub,/administrator review only/,'known-bad source art remains visible for protected archive review');
});
