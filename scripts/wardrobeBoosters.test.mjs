import { OFFICIAL_COSTUMES_R10 } from '../src/game/wardrobeOfficialR10.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { HEROES_DB } from '../src/game/heroes.js';
import { PERMANENT_OC_BOOSTERS, ORIGINAL_WORLD_BOOSTERS } from '../src/game/portalBoosterCatalog.js';
import { getOfficialCostumes, getOriginalCostumes, applyActorAppearance } from '../src/game/wardrobe.js';
import { createBoosterRewards, advanceBoosterHeroStreak } from '../src/game/portalBoosterEngine.js';
import { capDuplicateRefunds } from '../src/game/portalBoosterEconomy.js';
import { sanitizeSaveCore } from '../src/game/saveValidation.js';
import { appendOpeningHistory, normalizePortalHistory } from '../src/game/cards/cardCollectionEngine.js';
import { getWardrobeUnlockCatalogue, getWardrobeUnlockById, getWardrobeBoosterPool,
  getWardrobeBoosterProgress, drawWardrobeBoosterBonus, grantWardrobeBoosterBonus,
  getWardrobeOwnership, makeWardrobeBonusHistory, getWardrobeBoosterRoutes } from '../src/game/wardrobeBoosterRewards.js';

const all = getWardrobeUnlockCatalogue();
const universes = [...new Set(all.map(x => x.universe))];
const poolFor = (universe, extra = {}) => getWardrobeBoosterPool({
  banner: { id: `universe:${universe}`, universe }, visibleUniverses: universes, ...extra
});
const allPool = getWardrobeBoosterPool({ banner: { id: 'multi' }, visibleUniverses: universes });
const leon = HEROES_DB.find(h => h.id === 'leon' && h.universe === 'Resident Evil');
const alien = poolFor('Alien');
const pending = drawWardrobeBoosterBonus({ pool: alien, rng: () => 0 });

test('all 19,895 registered costume entitlements have stable unique ids; no effects/research included', () => {
  assert.equal(all.length, 19895+OFFICIAL_COSTUMES_R10.length); assert.equal(new Set(all.map(x => x.id)).size, all.length);
  assert.equal(new Set(all.map(x => x.actorKey)).size, 4936);
  assert.equal(all.filter(x => x.origin === 'OFFICIAL').length, 91+OFFICIAL_COSTUMES_R10.length);
  assert.ok(all.every(x => !x.id.includes(':research-') && x.nature !== 'procedural-effect'));
});
test('all entries have a permanent route without unlocking campaign actors', () => {
  assert.equal(allPool.length, all.length);
  for (const row of all) assert.ok(row.routes.includes('multi'));
  assert.ok(allPool.some(x => x.actorId === 'player_anchor'));
  assert.ok(allPool.some(x => x.actorId === 'arca_tessera'));
});
test('entry registry and descriptors are immutable and cached', () => {
  assert.equal(getWardrobeUnlockCatalogue(), all); assert.ok(Object.isFrozen(all));
  for (const row of all) assert.ok(Object.isFrozen(row) && Object.isFrozen(row.routes));
  assert.equal(getWardrobeUnlockById('__proto__'), null);
});
for (const universe of universes.filter(x => x !== 'Nexus de Convergence')) {
  test(`exact universe routing: ${universe}`, () => {
    const pool = poolFor(universe);
    assert.ok(pool.length > 0); assert.ok(pool.every(row => row.universe === universe));
    assert.equal(pool.length, all.filter(row => row.universe === universe).length);
  });
}
for (const banner of PERMANENT_OC_BOOSTERS) test(`chapter cast preserved: ${banner.id}`, () => {
  const pool = getWardrobeBoosterPool({ banner, visibleUniverses: universes });
  assert.ok(pool.length); assert.ok(pool.every(x => x.universe === banner.universe && banner.heroIds.includes(x.actorId) && x.actorKind === 'hero'));
});
for (const banner of ORIGINAL_WORLD_BOOSTERS) test(`authored original-world booster: ${banner.id}`, () => {
  const pool = getWardrobeBoosterPool({ banner, visibleUniverses: universes });
  assert.ok(pool.length); assert.ok(pool.every(x => x.universe === banner.universe));
});
test('Alien, Aliens and AVP never share a targeted costume pool', () => {
  assert.ok(alien.length); assert.ok(alien.every(x => x.universe === 'Alien'));
  assert.ok(!alien.some(x => x.actorId === 'ripley_aliens'));
});
test('Commando collection is not routed to the Commando film universe', () => {
  const leonCommando = all.find(x => x.actorId === 'leon' && x.collection === 'commando');
  assert.ok(leonCommando); assert.equal(leonCommando.universe, 'Resident Evil');
  assert.ok(!poolFor('Commando').includes(leonCommando));
});
test('Naked Snake and Raiden body variants keep their wearer', () => {
  const snake = HEROES_DB.find(h => h.id === 'snake');
  for (const row of getOfficialCostumes(snake)) assert.ok(!row.sourceWork.includes('Revengeance'));
  assert.ok(all.filter(x => x.actorId === 'raiden_mgr' && x.origin === 'OFFICIAL').length >= 5);
});
test('unbound Sheva Moira Natalia research never enters a draw', () => {
  assert.ok(!all.some(x => ['sheva', 'moira', 'natalia'].includes(x.actorId)));
});
test('unknown/mismatched banner fails closed', () => {
  for (const banner of [null, {}, {id:'unknown',universe:'Alien'}, {id:'universe:Alien',universe:'Aliens'},
    {...PERMANENT_OC_BOOSTERS[0],universe:'Halo'}]) assert.equal(getWardrobeBoosterPool({banner,visibleUniverses:universes}).length,0);
});
test('unknown actor has no invented route', () => assert.deepEqual(getWardrobeBoosterRoutes({}), []));
test('no explicit visible universe means no rewards', () => assert.equal(getWardrobeBoosterPool({banner:{id:'multi'}}).length,0));
test('hidden universes are excluded even from broad booster', () => {
  const pool = getWardrobeBoosterPool({banner:{id:'multi'},visibleUniverses:universes,hiddenUniverses:['Alien','Halo']});
  assert.ok(pool.every(x => !['Alien','Halo'].includes(x.universe)));
});
test('disabled heroes exclude their costume entitlements', () => {
  const pool = poolFor('Resident Evil',{disabledAssets:{heroes:['leon']}});
  assert.ok(!pool.some(x => x.actorId==='leon')); assert.ok(pool.some(x=>x.actorId==='jill'));
});
test('enemy administrator keys exclude adversary cosmetics', () => {
  const row=alien.find(x=>x.actorKind!=='hero');assert.ok(row);
  const pool=poolFor('Alien',{disabledAssets:{enemies:[`${row.universe}::${row.actorName}`]}});
  assert.ok(!pool.some(x=>x.actorKey===row.actorKey));
});
test('every missing costume is selectable with its equal-probability interval', () => {
  for(let i=0;i<alien.length;i++)assert.equal(drawWardrobeBoosterBonus({pool:alien,rng:()=> (i+.5)/alien.length}),alien[i]);
});
test('duplicate suppression progresses to completion without duplicates/refunds', () => {
  let owned=[];
  for(let i=0;i<alien.length;i++){
    const bonus=drawWardrobeBoosterBonus({pool:alien,inventory:owned,rng:()=>0});
    assert.ok(bonus && !owned.includes(bonus.id));owned=grantWardrobeBoosterBonus(owned,bonus,alien);
  }
  assert.equal(owned.length,alien.length);assert.equal(drawWardrobeBoosterBonus({pool:alien,inventory:owned}),null);
  assert.equal(getWardrobeBoosterProgress(alien,owned).probabilityPerMissing,0);
});
test('progress is deduplicated ownership with correct conditional odds', () => {
  const p=getWardrobeBoosterProgress(alien,[alien[0].id,alien[0].id,'unknown']);
  assert.equal(p.unlocked,1);assert.equal(p.remaining,alien.length-1);assert.equal(p.probabilityPerMissing,1/(alien.length-1));
});
test('one remaining entry has certainty; zero remaining consumes no rng', () => {
  assert.equal(drawWardrobeBoosterBonus({pool:alien,inventory:alien.slice(1).map(x=>x.id),rng:()=>.99}),alien[0]);
  assert.equal(drawWardrobeBoosterBonus({pool:[],rng:()=>{throw Error('must not roll');}}),null);
});
test('random boundaries and malformed values are explicit', () => {
  assert.equal(drawWardrobeBoosterBonus({pool:alien,rng:()=>1}),alien.at(-1));
  assert.equal(drawWardrobeBoosterBonus({pool:alien,rng:()=>-1}),alien[0]);
  for(const v of [NaN,Infinity]) assert.throws(()=>drawWardrobeBoosterBonus({pool:alien,rng:()=>v}));
  assert.throws(()=>drawWardrobeBoosterBonus({pool:alien,rng:null}));
});
test('copied/forged rewards cannot enter draw or grant', () => {
  const forged={...pending,universe:'Halo'};
  assert.equal(drawWardrobeBoosterBonus({pool:[forged]}),null);
  const inv=['existing'];assert.equal(grantWardrobeBoosterBonus(inv,forged,alien),inv);
  assert.equal(grantWardrobeBoosterBonus(inv,pending,poolFor('Halo')),inv);
});
test('grant is immutable and idempotent; equipment copies and future ids preserved', () => {
  const inv=Object.freeze(['equipment_a','equipment_a','future:thing']);
  const next=grantWardrobeBoosterBonus(inv,pending,alien);
  assert.deepEqual(next.slice(0,3),inv);assert.equal(next.length,4);
  assert.equal(grantWardrobeBoosterBonus(next,pending,alien),next);
});
test('known rights survive save normalization / JSON roundtrip without actor or stat grant', () => {
  const source={gold:7,breachShards:91,unlockedHeroes:['leon'],activeTeam:['leon'],inventory:[pending.id],heroSkins:{leon:'default'}};
  const out=sanitizeSaveCore(JSON.parse(JSON.stringify(source)),{knownHeroIds:HEROES_DB.map(h=>h.id)});
  assert.ok(out.inventory.includes(pending.id));assert.ok(!out.unlockedHeroes.includes('ripley'));
  assert.equal(out.breachShards,91);assert.equal(out.gold,7);assert.equal(out.heroSkins.leon,'default');
});
test('owned pending official and original costumes stay non-equippable', () => {
  for(const item of [...getOfficialCostumes(leon),...getOriginalCostumes(leon)]){
    assert.equal(getWardrobeOwnership(item,[item.id]),'UNLOCKED_ARTWORK_PENDING');
    assert.equal(getWardrobeOwnership(item,[]),'LOCKED');
    assert.equal(applyActorAppearance(leon,item.id,{}, {inventory:[item.id]}),leon);
  }
});
test('history stores bonus at zero price, exact universe and stable entitlement id', () => {
  const entry=makeWardrobeBonusHistory(pending,{id:'universe:Alien',label:{fr:'Alien'}},'fr','2026-10-24T19:00:00Z');
  const normalized=normalizePortalHistory(appendOpeningHistory({pulls:5,packsOpened:1},[entry]));
  assert.equal(normalized.pulls,5);assert.equal(normalized.packsOpened,1);assert.equal(normalized.history[0].rewardId,pending.id);
  assert.equal(normalized.history[0].pricePaid,0);assert.equal(normalized.history[0].universe,'Alien');
});
test('bonus does not dilute or replace base five-card probabilities or pity', () => {
  const cards=[{id:'hero',kind:'hero',universe:'Alien',rarity:{id:'rare',weight:28,duplicateRefund:20}},
    {id:'equipment',kind:'equipment',universe:'Alien',rarity:{id:'common',weight:58,duplicateRefund:12}}];
  const base=createBoosterRewards({candidates:cards,rng:()=>.42});
  const original=JSON.stringify(base);
  drawWardrobeBoosterBonus({pool:alien,rng:()=>.42});
  assert.equal(base.length,5);assert.equal(JSON.stringify(base),original);
  assert.equal(advanceBoosterHeroStreak(0,base),advanceBoosterHeroStreak(0,base));
  assert.equal(capDuplicateRefunds(base,0).reduce((s,r)=>s+r.shardsReturned,0),0);
});
test('PortalScreen integration draws only after accepted five-card opening and commits inventory once', () => {
  const source=fs.readFileSync(new URL('../src/components/PortalScreen.jsx',import.meta.url),'utf8');
  assert.ok(source.includes('if (!canOpenBooster || openingGuardRef.current) return;'));
  assert.ok(source.indexOf('if (rewards.length !== BOOSTER_CARD_COUNT)')<source.indexOf('const outfitBonus = drawWardrobeBoosterBonus'));
  assert.ok(source.includes('applyBoosterTransaction(rewardsWithCards, pricePaid, freeCreditSetId, outfitBonus)'));
  assert.ok(source.includes('setInventory(previous => grantWardrobeBoosterBonus('));
  assert.ok(source.includes('rewards.length'));
  assert.ok(!source.includes('rewards.push(outfitBonus)'));
});
test('Hub passes actual inventory to both hero and adversary wardrobes', () => {
  const source=fs.readFileSync(new URL('../src/components/HubScreen.jsx',import.meta.url),'utf8');
  assert.ok(source.includes('actor={selectedHero} lang={lang} inventory={inventory}'));
  assert.ok(source.includes('lang={lang} inventory={inventory} readOnly'));
});
