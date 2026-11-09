import test from 'node:test';
import assert from 'node:assert/strict';
import { HEROES_DB } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { createPlayerHero } from '../src/game/playerHero.js';
import { getOfficialCostumes, getOriginalCostumes, getWardrobeEffects, wardrobeActorKey, applyActorAppearance } from '../src/game/wardrobe.js';
import { OFFICIAL_COSTUME_EXTENSION, SIGNATURE_DESIGN_EXTENSION } from '../src/game/wardrobeExpansion.js';
import { assertUniqueWardrobeEntries } from '../src/game/wardrobeProduction.js';
import { CANONICAL_CAPTURE_NPC_WAVE17, getSourceCaptureEnemyAssetsWave17 } from '../src/game/combat/sourceCaptureEnemyCatalogWave17.js';
const actors=[createPlayerHero(),...HEROES_DB];
for(const [universe,r] of Object.entries(ENEMIES_DB))for(const a of [...r.monsters||[],...r.bosses||[],...r.worldBoss?[r.worldBoss]:[]])actors.push({...a,universe:a.universe||universe});
const byKey=new Map(actors.map(a=>[wardrobeActorKey(a),a]));
test('the 4936 upstream actors remain unique alongside the exact W17 canonical kitten',()=>{
 const additionKey=wardrobeActorKey(CANONICAL_CAPTURE_NPC_WAVE17);
 const previous=actors.filter(actor=>wardrobeActorKey(actor)!==additionKey);
 assert.equal(previous.length,4936);
 assert.equal(new Set(previous.map(wardrobeActorKey)).size,4936);
 const additions=actors.filter(actor=>wardrobeActorKey(actor)===additionKey);
 assert.equal(additions.length,1);
 assert.deepEqual({id:additions[0].id,universe:additions[0].universe,sourceEnemyId:additions[0].sourceEnemyId},
  {id:'tail_concerto_red_vest_kitten',universe:'Tail Concerto',sourceEnemyId:'tail_concerto_red_vest_kitten'});
 assert.equal(getSourceCaptureEnemyAssetsWave17().find(asset=>asset.sourceEnemyId===additions[0].sourceEnemyId)?.id,'tail-concerto-kitten-wave17');
 assert.equal(actors.length,previous.length+1);assert.equal(byKey.size,actors.length);
});
test('every new official binding is an actual exact runtime actor',()=>{
 for(const row of OFFICIAL_COSTUME_EXTENSION)for(const id of row.actorIds)assert.ok(byKey.has(wardrobeActorKey({id,universe:row.universe})),`${row.universe}/${id}`);
});
test('all 36 additional bespoke briefs have actual exact actors',()=>{
 assert.equal(SIGNATURE_DESIGN_EXTENSION.length,36);
 for(const row of SIGNATURE_DESIGN_EXTENSION)assert.ok(byKey.has(wardrobeActorKey(row)),`${row.universe}/${row.id}`);
});
test('no duplicate global catalogue IDs and one commando brief per actor',()=>{
 const entries=[];
 for(const a of actors){const original=getOriginalCostumes(a);assert.equal(original.filter(c=>c.collection==='commando').length,1);entries.push(...original,...getOfficialCostumes(a),...getWardrobeEffects(a));}
 assertUniqueWardrobeEntries(entries);
});
test('all pending costume selections preserve actors by identity',()=>{
 for(const a of actors)for(const c of [...getOfficialCostumes(a),...getOriginalCostumes(a)])assert.equal(applyActorAppearance(a,c.id),a);
});
test('all actors keep their nonvisual fields when selecting any ground effect',()=>{
 for(const a of actors){const before=JSON.stringify(a);for(const e of getWardrobeEffects(a)){const {activeSkin,wardrobeEffect,...b}=applyActorAppearance(a,e.id);assert.ok(activeSkin);assert.equal(wardrobeEffect,e.id);assert.equal(JSON.stringify(b),before);}assert.equal(JSON.stringify(a),before);}
});
