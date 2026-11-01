import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { buildEditionSpriteAudit,EDITION_IDS,REVIEW_COLUMNS,EXACT_SOURCE_ART_BLOCKERS } from './auditCanonicalStarWarsSprites.mjs';

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
