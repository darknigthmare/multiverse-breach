import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { buildEditionSpriteAudit,EDITION_IDS,REVIEW_COLUMNS,EXACT_SOURCE_ART_BLOCKERS } from './auditCanonicalStarWarsSprites.mjs';
import { QUARANTINED_CANON_SPRITES, getQuarantinedCanonSprite } from '../src/game/canonicalSpriteQuarantine.js';
import { SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_EXPANSIONS, SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_OVERRIDES } from '../src/game/solarOppositesSirenStarWarsPack.js';

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

test('core Canvas rendering quarantines known bad actor art but retains the procedural weapon and archival assets', () => {
  const renderer=readFileSync(new URL('../src/game/renderer.js',import.meta.url),'utf8');
  const assets=readFileSync(new URL('../src/game/spriteAssets.js',import.meta.url),'utf8');
  assert.match(renderer,/getQuarantinedCanonSprite\(character\)/);
  assert.match(renderer,/quarantinedArt \? 'missing' : drawGeneratedSpriteSheet/);
  assert.match(renderer,/if \(context === 'melee' && !quarantinedArt\)/);
  assert.match(renderer,/getQuarantinedCanonSprite\(entity\)/);
  assert.match(renderer,/drawQuarantinedCombatantBust/);
  assert.match(renderer,/drawWeapon\(ctx, armX \+ 12, armY, weaponType, weaponColor, animTime\)/);
  assert.match(renderer,/ART PENDING/);
  assert.match(assets,/getHeroSpriteSheetSources/);
  assert.match(renderer,/drawFallbackEnergyBlades\(ctx, type, color\)/);
});
