/**
 * Asset identity audit for the seven currently enabled Star Wars source-locked
 * actors. A PNG signature, 4×4 crop and checksum cannot certify a 1:1 costume.
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_EXPANSIONS as expansions,
  SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_OVERRIDES as overrides,
  SOLAR_OPPOSITES_SIREN_STAR_WARS_SPRITES as sprites
} from '../src/game/solarOppositesSirenStarWarsPack.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const EDITION_IDS = Object.freeze([
  'ahsoka_padawan','ahsoka','ahsoka_adult','aayla_secura',
  'darth_maul','darth_revan','darth_talon'
]);
export const REVIEW_COLUMNS = Object.freeze([
  'actorId','character','incarnation','spritePath','fileSha256','byteSize',
  'pngWidth','pngHeight','bitDepth','colorType','gridColumns','gridRows',
  'frameWidth','frameHeight','equipment','prosthetics','sourceUrl',
  'sourceKind','silhouetteReview','weaponReview','animationReview','visualReferenceUrl','observedDefect'
]);
/** Exact-byte visual findings from GitHub artifact 13103845643. A replaced PNG
 * returns to PENDING, never to certified, until reviewed separately.
 */
export const EXACT_SOURCE_ART_BLOCKERS = Object.freeze({
  "ahsoka_padawan": {
    "sha256": "1a7f3488717f94d3789982e6acb1f7e961f9298c4b065cbdd3f8af89c9448b3c",
    "silhouetteReview": "BLOCKED_FANTASY_MAGE_NOT_EARLY_PADAWAN",
    "weaponReview": "BLOCKED_GREEN_LIGHTSABER_ABSENT",
    "animationReview": "BLOCKED_REPLACE_SHEET_FIRST",
    "observedDefect": "The 16 cells show brown-robed fantasy magic props (staff, sphere, book), but no green lightsaber or early Padawan fighting sheet"
  },
  "ahsoka": {
    "sha256": "d5c49fd412868d187aca84241af1a191ffa55337a248982f2e79edd0daff22f3",
    "silhouetteReview": "BLOCKED_FANTASY_ROBES_NOT_SIEGE_UNIFORM",
    "weaponReview": "BLOCKED_TWIN_BLUE_LIGHTSABERS_ABSENT",
    "animationReview": "BLOCKED_REPLACE_SHEET_FIRST",
    "observedDefect": "The 16 cells show blue fantasy robes and a staff/book; the two blue Siege of Mandalore sabers are absent"
  },
  "darth_revan": {
    "sha256": "78200992ef619c3e7d16907db20496df67b018c1fb99697bcf75dce3ea43169c",
    "silhouetteReview": "PENDING_KOTOR_I_MASK_DETAIL_COMPARISON",
    "weaponReview": "BLOCKED_RED_AND_PURPLE_PAIR_IN_KOTOR_I",
    "animationReview": "BLOCKED_REPLACE_DUAL_WEAPON_FRAMES",
    "observedDefect": "The existing 4x4 sheet visibly equips simultaneous purple and red sabers throughout a KOTOR I one-red-saber edition"
  }
});
export const EXTRA_VISUAL_SOURCES = Object.freeze({
  ahsoka_adult:'https://www.starwars.com/news/star-wars-rebels-costume-and-lightsaber-color-guide-for-ahsoka-tano'
});
const pngSignature = Buffer.from([137,80,78,71,13,10,26,10]);
const actors = [...(expansions['Star Wars'] || []), ...Object.values(overrides)];
const csvCell = value => '"'+String(value ?? '').replaceAll('"','""')+'"';

export function buildEditionSpriteAudit({projectRoot=root}={}) {
  const shaSeen = new Set();
  const rows = EDITION_IDS.map(actorId => {
    const actor = actors.find(entry => entry.id===actorId);
    assert.ok(actor, 'Missing source-locked actor: '+actorId);
    const spritePath=sprites[actorId];
    assert.match(spritePath,/^\/sprites\/generated\/heroes\/star-wars\/[-a-z0-9]+\.png$/,actorId);
    assert.equal(spritePath.split('/').at(-1),actorId.replaceAll('_','-')+'.png');
    const filepath=path.join(projectRoot,'public',spritePath.slice(1));
    assert.ok(existsSync(filepath), 'Missing PNG: '+spritePath);
    const raw=readFileSync(filepath);
    assert.ok(raw.length>=33 && raw.subarray(0,8).equals(pngSignature),'Invalid PNG signature: '+spritePath);
    assert.equal(raw.readUInt32BE(8),13,'Unexpected IHDR length: '+spritePath);
    assert.equal(raw.toString('ascii',12,16),'IHDR','Missing IHDR: '+spritePath);
    const pngWidth=raw.readUInt32BE(16),pngHeight=raw.readUInt32BE(20);
    const bitDepth=raw[24],colorType=raw[25];
    assert.ok(pngWidth>=128&&pngWidth<=8192&&pngHeight>=128&&pngHeight<=8192,'Unsupported sprite dimensions: '+spritePath);
    const fileSha256=createHash('sha256').update(raw).digest('hex');
    assert.ok(!shaSeen.has(fileSha256),'Distinct editions share identical asset bytes: '+spritePath);
    shaSeen.add(fileSha256);
    const lock=EXACT_SOURCE_ART_BLOCKERS[actorId];
    const reviewed=lock?.sha256===fileSha256 ? lock : null;
    assert.match(actor.referenceUrl,/^https:\/\//,actorId);
    const sourceKind=actor.referenceUrl.includes('crls.501st.com')?'501ST_COSTUME_REFERENCE':'STARWARS_OFFICIAL';
    // Generic renderer uses a 4×4 grid when no special layout is registered.
    const gridColumns=4,gridRows=4;
    const frameWidth=pngWidth/gridColumns,frameHeight=pngHeight/gridRows;
    return {
      actorId,character:actor.name,incarnation:actor.incarnation,spritePath,
      fileSha256,byteSize:raw.length,pngWidth,pngHeight,bitDepth,colorType,
      gridColumns,gridRows,frameWidth,frameHeight,
      equipment:(actor.equipment||[]).join(' | '),
      prosthetics:(actor.bodyProsthetics||[]).join(' | '),
      sourceUrl:actor.referenceUrl,sourceKind,
      silhouetteReview:reviewed?.silhouetteReview || 'PENDING_HUMAN_SOURCE_COMPARISON',
      weaponReview:reviewed?.weaponReview || 'PENDING_HUMAN_SOURCE_COMPARISON',
      animationReview:reviewed?.animationReview || 'PENDING_PLAYABLE_CAPTURE',
      visualReferenceUrl:EXTRA_VISUAL_SOURCES[actorId] || actor.referenceUrl,
      observedDefect:reviewed?.observedDefect || ''
    };
  });
  const csv=[REVIEW_COLUMNS,...rows.map(row=>REVIEW_COLUMNS.map(column=>row[column]))]
    .map(row=>row.map(csvCell).join(',')).join('\n')+'\n';
  return {rows,csv};
}
const directlyInvoked=process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(directlyInvoked){
  const output=new URL('../docs/excel/star-wars-edition-sprite-review-2026-11-01.csv',import.meta.url);
  const {rows,csv}=buildEditionSpriteAudit();
  if(process.argv.includes('--write'))writeFileSync(output,csv);
  else if(process.argv.includes('--check')){
    assert.equal(readFileSync(output,'utf8'),csv,'Star Wars sprite audit is stale, run --write');
  } else throw Error('Use --write to create the review or --check to verify it');
  for(const row of rows) console.log(row.actorId+' '+row.pngWidth+'x'+row.pngHeight+' '+row.byteSize+' bytes '+row.fileSha256.slice(0,10)+' ('+row.weaponReview+')');
}
