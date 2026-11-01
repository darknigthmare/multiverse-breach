import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { buildEditionSpriteAudit,EDITION_IDS,REVIEW_COLUMNS } from './auditCanonicalStarWarsSprites.mjs';

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
    assert.equal(row.silhouetteReview,'PENDING_HUMAN_SOURCE_COMPARISON');
    assert.equal(row.weaponReview,'PENDING_HUMAN_SOURCE_COMPARISON');
    assert.equal(row.animationReview,'PENDING_PLAYABLE_CAPTURE');
  }
});

test('source-locked sprite inspection CSV must reproduce directly from the same PNGs and actor data',()=>{
  const {rows,csv}=buildEditionSpriteAudit();
  const snapshot=readFileSync(new URL('../docs/excel/star-wars-edition-sprite-review-2026-11-01.csv',import.meta.url),'utf8');
  assert.equal(snapshot,csv);
  assert.equal(csv.trimEnd().split('\n').length,8);
  assert.equal(REVIEW_COLUMNS.length,21);
  assert.equal(rows.find(x=>x.actorId==='darth_maul').prosthetics,'Mandalorian-Issue Humanoid Cybernetic Legs');
  assert.ok(!rows.find(x=>x.actorId==='darth_maul').equipment.includes('Cybernetic Legs'));
  assert.equal(rows.find(x=>x.actorId==='darth_revan').sourceKind,'501ST_COSTUME_REFERENCE');
  assert.equal(rows.find(x=>x.actorId==='ahsoka').sourceKind,'STARWARS_OFFICIAL');
});
