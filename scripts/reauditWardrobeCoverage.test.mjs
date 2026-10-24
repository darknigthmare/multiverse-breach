import test from 'node:test';
import assert from 'node:assert/strict';
import { HEROES_DB } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { createPlayerHero } from '../src/game/playerHero.js';
import { getOfficialCostumes, getOriginalCostumes, getWardrobeEffects, wardrobeActorKey, applyActorAppearance } from '../src/game/wardrobe.js';
import { OFFICIAL_COSTUME_EXTENSION, SIGNATURE_DESIGN_EXTENSION } from '../src/game/wardrobeExpansion.js';
import { assertUniqueWardrobeEntries } from '../src/game/wardrobeProduction.js';
const actors=[createPlayerHero(),...HEROES_DB];
for(const [universe,r] of Object.entries(ENEMIES_DB))for(const a of [...r.monsters||[],...r.bosses||[],...r.worldBoss?[r.worldBoss]:[]])actors.push({...a,universe:a.universe||universe});
const byKey=new Map(actors.map(a=>[wardrobeActorKey(a),a]));
test('current runtime identity set remains 4936 unique actors',()=>{assert.equal(actors.length,4936);assert.equal(byKey.size,4936);});
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
