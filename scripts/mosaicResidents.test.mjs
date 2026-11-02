import test from 'node:test';
import assert from 'node:assert/strict';
import { getMosaicResidentCatalog, getMosaicResidentView } from '../src/game/mosaicResidents.js';
const heroes=Array.from({length:57},(_,i)=>({id:`h${i}`,name:i===55?'Étoile oubliée':`Habitant ${i}`,universe:i%2?'A':'B',nonCombat:i===56}));
test('all owned residents retained including peaceful identities; no implicit unlock',()=>{
 assert.equal(getMosaicResidentCatalog(heroes,heroes.map(h=>h.id)).length,57);
 assert.equal(getMosaicResidentCatalog(heroes,['h56'])[0].nonCombat,true);
 assert.deepEqual(getMosaicResidentCatalog(heroes,[]),[]);assert.deepEqual(getMosaicResidentCatalog(null,null),[]);
 assert.equal(getMosaicResidentCatalog([null,{},heroes[0],heroes[0],{id:'player_anchor'}],['h0','player_anchor']).length,1);
});
test('local residents prioritized without losing other universes or mutating sources',()=>{
 const before=structuredClone(heroes);const residents=getMosaicResidentCatalog(heroes,heroes.map(h=>h.id),'A');
 assert.equal(residents[0].id,'h1');assert.equal(residents.length,57);assert.deepEqual(heroes,before);
});
test('every resident appears exactly once across bounded groups beyond 17',()=>{
 const ids=[];for(let group=0;group<4;group++){const v=getMosaicResidentView(heroes,{group});assert.ok(v.groupItems.length<=17);ids.push(...v.groupItems.map(h=>h.id));}
 assert.deepEqual(ids,heroes.map(h=>h.id));assert.equal(new Set(ids).size,57);
});
test('guide never duplicated in population, still searchable in directory',()=>{
 const v=getMosaicResidentView(heroes,{guideId:'h0'});assert.equal(v.total,57);assert.ok(!v.groupItems.some(h=>h.id==='h0'));assert.ok(v.items.some(e=>e.hero.id==='h0'));
});
test('accent-insensitive search finds tail identity and its actual world group',()=>{
 const v=getMosaicResidentView(heroes,{query:'etoile oubliee'});assert.equal(v.matching,1);assert.equal(v.items[0].hero.id,'h55');assert.equal(v.items[0].group,3);
 assert.ok(getMosaicResidentView(heroes,{group:v.items[0].group}).groupItems.some(h=>h.id==='h55'));
});
test('directory paging is bounded and independent of current world group',()=>{
 const v=getMosaicResidentView(heroes,{group:2,page:6});assert.equal(v.items.length,3);assert.equal(v.groupItems[0].id,'h34');
 const none=getMosaicResidentView(heroes,{query:'absent',page:100,group:Infinity});assert.equal(none.page,0);assert.equal(none.pageCount,1);assert.equal(none.items.length,0);assert.equal(none.group,0);
 assert.equal(getMosaicResidentView(heroes,{group:999}).group,3);
});
