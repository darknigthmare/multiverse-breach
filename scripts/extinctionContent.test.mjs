import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { HEROES_DB } from '../src/game/heroes.js';
import { createPlayerHero } from '../src/game/playerHero.js';
import { getExtinctionRoster, isExtinctionCombatant, getExtinctionViewmodel, getExtinctionHandFrame, drawExtinctionSchematic } from '../src/game/extinctionContent.js';
const all = [createPlayerHero(), ...HEROES_DB];
test('all owned combatants stay selectable beyond forty, in source order', () => {
 const expected = all.filter(isExtinctionCombatant);
 assert.deepEqual(getExtinctionRoster(all, all.map(h=>h.id)),expected);
 assert.ok(expected.length > 40);
 assert.equal(getExtinctionRoster(all,[expected.at(-1).id])[0].id,expected.at(-1).id);
});
test('non-combat and trial identities remain excluded from FPS, not from source', () => {
 const excluded=all.filter(h=>h.nonCombat===true||h.category==='trial');
 assert.ok(excluded.length>0);assert.deepEqual(getExtinctionRoster(excluded,excluded.map(h=>h.id)),[]);
 assert.ok(HEROES_DB.includes(excluded[0]));
});
test('no implicit ownership fallback; malformed and duplicate records are safe', () => {
 assert.deepEqual(getExtinctionRoster(all,[]),[]);
 assert.deepEqual(getExtinctionRoster(null,null),[]);
 assert.deepEqual(getExtinctionRoster([null,{},all[0],all[0]],[all[0].id]),[all[0]]);
});
for(const id of ['arca_mirelle','serj_tankian','arthur_kaamelott']) {
 test(`FPS sheet is bound to its exact owner: ${id}`,()=>{
  const profile=getExtinctionViewmodel(all.find(h=>h.id===id));
  assert.equal(profile.id,id);assert.ok(profile.src.includes('fps'));
  const frame=getExtinctionHandFrame(profile,{muzzle:3,t:18,weapon:{type:'pistol'}});
  assert.equal(frame.row,profile.layout.rowByState.attack);assert.ok(frame.col<frame.columns);
 });
}
test('universal sheets and unknown costumes are never presented as FPS hands',()=>{
 for(const id of ['player_anchor','masterchief','arca_bastion','arca_nova']) assert.equal(getExtinctionViewmodel(all.find(h=>h.id===id)).src,'');
 assert.equal(getExtinctionViewmodel({...all.find(h=>h.id==='arca_mirelle'),activeSkin:{id:'test'}}).src,'');
});
test('Mirelle reload trims are bounded and other packs never invent a reload row',()=>{
 const mirelle=getExtinctionViewmodel({id:'arca_mirelle'});
 assert.equal(getExtinctionHandFrame(mirelle,{reloadPulse:3}).row,6);
 assert.equal(getExtinctionHandFrame(mirelle,{reloadPulse:3}).trim.top,40);
 const arthur=getExtinctionViewmodel({id:'arthur_kaamelott'});
 assert.equal(getExtinctionHandFrame(arthur,{reloadPulse:3}).row,0);
});
test('pickup weapons do not display the starting personal hand weapon',()=>{
 const p=getExtinctionViewmodel({id:'arca_mirelle'});
 for(const type of ['plasma','shotgun','rocket']) assert.equal(getExtinctionHandFrame(p,{weapon:{type}}),null);
 assert.equal(getExtinctionHandFrame({src:''},{}),null);
});
test('frame calculation and schematic rendering never mutate gameplay',()=>{
 const state={t:60,muzzle:2,weapon:{type:'rocket'},hp:90,ammo:5};const before=structuredClone(state);
 const ctx=new Proxy({},{get:()=>()=>{},set:()=>true});
 drawExtinctionSchematic(ctx,state,840,430);getExtinctionHandFrame(getExtinctionViewmodel({id:'arca_mirelle'}),state);
 assert.deepEqual(state,before);
});
test('component uses strict bindings, unlocked selection and explicit missing-art message',()=>{
 const source=readFileSync(new URL('../src/components/HubScreen.jsx',import.meta.url),'utf8').split('function ExtinctionRoyale(')[1];
 assert.match(source,/getExtinctionRoster\(safeHeroes, unlockedHeroes\)/);
 assert.doesNotMatch(source,/hands\.src = MIRELLE_COMPLETE_SPRITES/);
 assert.match(source,/getExtinctionHandFrame\(viewmodel, state\)/);
 assert.match(source,/disabled=\{!selectedHero\}/);
});

test('historical Bucket Guitar Echo pack is not aliased to Buckethead Persona',()=>{
 assert.equal(getExtinctionViewmodel(all.find(h=>h.id==='buckethead_avatar')).src,'');
 assert.ok(!all.some(h=>h.id==='bucket_guitar_echo'));
});
