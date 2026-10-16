import { after, afterEach, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
let vite, EngineRpg, EngineSmash, install, catalog, heroes, events;
const engines = [];
const foe = { id: 'signature-foe', name: 'Signature fixture', universe: 'Nexus de Convergence', hp: 5000, atk: 1, spd: 1, def: 0, color: '#777' };
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js'));
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js'));
  ({ installSignatureDirector: install } = await vite.ssrLoadModule('/src/game/signatureDirector.js'));
  catalog = await vite.ssrLoadModule('/src/game/signatureCatalog.js');
  ({ HEROES_DB: heroes, EVENT_ITEMS_DB: events } = await vite.ssrLoadModule('/src/game/heroes.js'));
});
afterEach(() => engines.splice(0).forEach(e => e.dispose()));
after(async () => { await vite?.close(); });
const make = (id = 'cloud_ff7', mode = 'RPG', extra = {}) => {
  const template = heroes.find(h => h.id === id);
  assert.ok(template, id);
  const stage = { universe: 'Nexus de Convergence', mode, customBattle: { singleRoster: true, opponentControl: 'p2' }, ...extra };
  const e = new (mode === 'RPG' ? EngineRpg : EngineSmash)(760, 420, [template], { customRoster: [foe], monsters: [foe], bosses: [] }, { add() {} }, () => {}, () => {}, stage);
  e.syncPreMatchFromServer?.(3000); e.completeMeleeIntros?.();
  const actor = e.heroes[0]; actor.state = 'idle'; actor.atb = 100; actor.specialCharge = 100; actor.action = null;
  install(e, { mode }); engines.push(e); return e;
};
const ticks = (e, n) => { for (let i = 0; i < n; i++) e.update({}, {}, { preMatchDeltaMs: 1000 / 60, stageDeltaMs: 1000 / 60 }); };
const ff = () => events['Final Fantasy VII'];

test('director is per instance and installation is idempotent', () => {
  const e = make(); const update = e.update; assert.equal(install(e, { mode: 'RPG' }), e.signatureDirector); assert.equal(e.update, update);
  assert.notEqual(make().signatureDirector, e.signatureDirector);
});
test('trials and unsupported modes do not receive combat capabilities', () => {
  for (const mode of ['Trial', 'Tactics', 'Race', 'FPS']) assert.equal(install({}, { mode }), null);
  assert.equal(install({ stage: { nonCombatTrial: {} } }, { mode: 'RPG' }), null);
});
test('every curated event keeps the exact equipped-item identity, effect and origin', () => {
  for (const [id, definition] of Object.entries(catalog.SIGNATURE_INVOCATIONS)) {
    const event = events[definition.universe]; assert.equal(event.id, id); assert.equal(event.effect, definition.effect);
    for (const actorId of definition.actors) {
      const actor = actorId === 'player_anchor' ? { id: actorId, universe: definition.universe } : heroes.find(h => h.id === actorId);
      assert.ok(actor, actorId); assert.ok(catalog.resolveSignatureInvocation(event, actor), actorId);
    }
    assert.equal(Object.isFrozen(definition.actors), true);
  }
});
test('names alone, enemy names and wrong universes never grant a summon', () => {
  const e = make(); const actor = e.heroes[0];
  for (const wrong of [{ ...actor, universe: 'Halo' }, { ...actor, id: 'other', name: 'Cloud Strife' }, { ...actor, nonCombat: true }]) {
    assert.equal(catalog.resolveSignatureInvocation(ff(), wrong), null);
  }
  assert.equal(catalog.resolveSignatureInvocation({ ...ff(), effect: 'unknown' }, actor), null);
});
for (const bad of [0, 99, NaN, Infinity, '100']) test(`RPG summon rejects ATB ${String(bad)} without consuming item`, () => {
  const e = make(); const actor = e.heroes[0];actor.atb = bad;
  assert.equal(e.signatureDirector.triggerInvocation(ff(), actor), false);
  actor.atb = 100; assert.equal(e.signatureDirector.eventReadiness(ff(), actor).ready, true);
});
for (const flag of ['paused', 'gameOver', 'disposed']) test(`RPG summon rejects ${flag}`, () => {
  const e = make();e[flag] = true;
  assert.equal(e.signatureDirector.triggerInvocation(ff(), e.heroes[0]), false);
  assert.equal(e.heroes[0].atb, 100);
});
test('items-disabled fight cannot invoke an equipped artifact', () => {
  const e = make('cloud_ff7', 'RPG', { disableItems: true });
  assert.equal(e.signatureDirector.triggerInvocation(ff(), e.heroes[0]), false);
});
test('thirteen Knights contacts dispatch separately and spend ATB once', () => {
  const e = make(); const actor = e.heroes[0]; const original = e.applyDamage; const contacts = [];
  e.applyDamage = (...args) => { contacts.push(args);return original(...args); };
  assert.equal(e.signatureDirector.triggerInvocation(ff(), actor), true);
  assert.equal(actor.atb, 0);
  assert.equal(e.signatureDirector.triggerInvocation(ff(), actor), false);
  const enemyATB = e.enemies[0].atb; ticks(e, 59); assert.equal(contacts.length, 0);
  ticks(e, 1); assert.equal(contacts.length, 1);
  ticks(e, 120); assert.equal(contacts.length, 13);
  assert.equal(contacts.reduce((sum, c) => sum + c[2], 0), 260);
  assert.equal(e.enemies[0].atb, enemyATB, 'normal ATB advanced inside summon');
  ticks(e, 24); assert.equal(e.signatureDirector.busy, false); assert.equal(actor.actionPending, false);
  actor.atb = 100; assert.equal(e.signatureDirector.eventReadiness(ff(), actor).reason, 'spent');
});
test('pause and resume use simulation ticks, not wall-clock timers', async () => {
  const e = make();e.signatureDirector.triggerInvocation(ff(), e.heroes[0]);ticks(e, 10);
  e.paused = true;const state = e.signatureDirector.snapshot();ticks(e, 1000);
  await new Promise(resolve => setTimeout(resolve, 5));assert.deepEqual(e.signatureDirector.snapshot(), state);
  e.paused = false;ticks(e, 1);assert.equal(e.signatureDirector.snapshot().tick, 11);
});
test('caster KO cancels immediately and resurrection does not restart the summon', () => {
  const e = make();const a = e.heroes[0];e.signatureDirector.triggerInvocation(ff(), a);ticks(e, 65);
  e.applyDamage(e.enemies[0], a, 100000);assert.equal(e.signatureDirector.busy, false);
  a.currentHp = a.maxHp;a.state = 'idle';const hp = e.enemies[0].currentHp;ticks(e, 200);
  assert.equal(e.enemies[0].currentHp, hp);
});
for (const afterImpact of [false, true]) test(`removal and cancellation clean their lock (after impact ${afterImpact})`, () => {
  const e = make();const a=e.heroes[0];e.signatureDirector.triggerInvocation(ff(),a);ticks(e,afterImpact ? 65 : 3);
  e.heroes=[];ticks(e,1);assert.equal(e.signatureDirector.busy,false);assert.equal(a.actionPending,false);assert.notEqual(a.state,'signature');
});
test('new targets cannot receive an already confirmed invocation', () => {
  const e=make();e.signatureDirector.triggerInvocation(ff(),e.heroes[0]);const old=e.enemies[0];
  e.enemies=[{...old, id:'new',battleId:'new'}];const hp=e.enemies[0].currentHp;ticks(e,205);assert.equal(e.enemies[0].currentHp,hp);
});
test('real RAAM encounter remains immune to every invocation contact', async () => {
  const { CANON_PRIORITY_STAGES } = await vite.ssrLoadModule('/src/game/canonPriorityStages.js');
  const { ENEMIES_DB } = await vite.ssrLoadModule('/src/game/enemies.js');
  const { resolveStageEnemyData } = await vite.ssrLoadModule('/src/game/stageEnemyResolver.js');
  const stage = CANON_PRIORITY_STAGES.lightmassTrain;
  const data = resolveStageEnemyData({ stage, ...ENEMIES_DB['Gears of War'] });
  const e = new EngineRpg(760,420,[heroes.find(h=>h.id==='cloud_ff7')],data,{add(){}},()=>{},()=>{},stage);
  engines.push(e);e.wave=2;e.spawnWave();e.enemyGlobalRecovery=99999;e.heroes[0].atb=100;
  install(e,{mode:'RPG'});const target=e.enemies.find(x=>x.name==='General RAAM');assert.ok(target);
  const hp=target.currentHp;e.signatureDirector.triggerInvocation(ff(),e.heroes[0]);ticks(e,204);
  assert.equal(target.currentHp,hp);
});
test('protective companion cube grants a shield, not HP or resurrection', () => {
  const e=make('chell');const a=e.heroes[0];a.currentHp-=20;const hp=a.currentHp;
  assert.equal(e.signatureDirector.triggerInvocation(events.Portal,a),true);ticks(e,84);
  assert.equal(a.currentHp,hp);assert.ok(a.battleItemShield>0);
});
test('native RPG summon preserves source effect, cooldown and scheduled damage', () => {
  const e=make('arca_bastion');const a=e.heroes[0];const action=a.secondary;
  assert.equal(action.type,'summon');const context=e.getActionContext(a,'secondary','player');
  assert.equal(e.executeRpgAction(context,[a.battleId]),true);assert.equal(a.atb,0);assert.ok(e.signatureDirector.busy);
  ticks(e,100);assert.equal(a.secondary,action);assert.ok(a.rpgGuardTicks>0);assert.ok(a.cooldown>0);assert.equal(a.actionPending,false);
});
test('native RPG enemy summon keeps its own side and source action', () => {
  const e=make();const a=e.enemies[0];a.secondary={name:'Fixture summon',type:'summon',dmg:2,cd:4};a.atb=100;
  const context=e.getActionContext(a,'secondary','enemy');const hp=e.heroes[0].currentHp;
  assert.equal(e.executeRpgAction(context,[e.heroes[0].battleId]),true);ticks(e,100);assert.ok(e.heroes[0].currentHp<hp);
  assert.ok(a.cooldown>0);assert.equal(e.enemyActionLock,false);
});
test('native melee super reserves meter and preserves the source spatial profile', () => {
  const e=make('liquid_snake','Smash');const a=e.heroes[0];const target=e.enemies[0];a.x=200;a.y=250;a.facing=1;target.x=240;target.y=250;
  const hp=target.currentHp;assert.equal(e.triggerAbility(a,'special'),true);assert.equal(a.specialCharge,0);assert.ok(e.signatureDirector.busy);
  assert.equal(e.triggerAbility(a,'special'),false);ticks(e,41);assert.equal(target.currentHp,hp);ticks(e,1);assert.ok(target.currentHp<hp);
  assert.equal(a.specialCharge,0);
});
test('native melee super without a target does not spend meter', () => {
  const e=make('liquid_snake','Smash');e.heroes[0].x=20;e.enemies[0].x=700;
  assert.equal(e.triggerAbility(e.heroes[0],'special'),false);assert.equal(e.heroes[0].specialCharge,100);
});
test('native melee super cannot survive caster death and revival', () => {
  const e=make('liquid_snake','Smash');const a=e.heroes[0],b=e.enemies[0];a.x=200;a.y=250;a.facing=1;b.x=240;b.y=250;
  assert.equal(e.triggerAbility(a,'special'),true);e.applyDamage(b,a,100000);a.currentHp=a.maxHp;a.state='idle';
  assert.equal(e.signatureDirector.busy,false);
});
test('native summon changed while casting is interrupted without executing replacement', () => {
  const e=make('arca_bastion');const a=e.heroes[0];e.executeRpgAction(e.getActionContext(a,'secondary'),[a.battleId]);
  a.secondary={name:'Replacement',type:'bullet',dmg:1000};ticks(e,45);assert.equal(e.signatureDirector.busy,false);assert.equal(a.actionPending,false);
});
test('dispose clears scene and item tracking without modifying source definitions', () => {
  const e=make();e.signatureDirector.triggerInvocation(ff(),e.heroes[0]);e.dispose();assert.equal(e.signatureDirector.busy,false);
  assert.equal(catalog.SIGNATURE_INVOCATIONS.evt_knights_of_the_round.hits,13);
});

test('unknown and prototype-like event IDs are harmless', () => {
  const a = make().heroes[0];
  for (const id of ['__proto__', 'constructor', '', 'unregistered']) assert.equal(catalog.resolveSignatureInvocation({ id }, a), null);
  assert.equal(catalog.resolveSignatureInvocation(null, a), null);
});
test('ordinary Nexus artifact keeps the original effect and does not acquire a replacement summon', () => {
  const e = make('arca_bastion'); const event = events['Nexus de Convergence'];
  assert.equal(e.signatureDirector.eventReadiness(event,e.heroes[0]).supported,false);
  assert.equal(e.triggerCombatEvent(event.effect),true);assert.equal(e.heroes[0].state,'defense');
});
test('global item and targeting inputs are locked during an invocation', () => {
  const e=make();e.signatureDirector.triggerInvocation(ff(),e.heroes[0]);
  assert.equal(e.triggerCombatEvent('hammer_strike'),false);assert.equal(e.beginTargeting(e.enemies[0],'simple','enemy'),false);
  assert.equal(e.triggerEnemyAbility(e.enemies[0],'special'),false);
});
test('P2 can use its profiled super without spending the P1 meter', () => {
  const e=make('liquid_snake','Smash');const template=heroes.find(h=>h.id==='liquid_snake');
  const opponent=e.enemies[0];Object.assign(opponent,{...template,id:opponent.id,sourceId:'liquid_snake',specialCharge:100,state:'idle',action:null,currentHp:300,maxHp:300});
  e.heroes[0].x=200;e.heroes[0].y=250;opponent.x=240;opponent.y=250;opponent.facing=-1;
  assert.equal(e.signatureDirector.superReadiness(opponent).ready,true);
  assert.equal(e.triggerOpponentAbility('special'),true);assert.equal(opponent.specialCharge,0);assert.equal(e.heroes[0].specialCharge,100);
  const hp=e.heroes[0].currentHp;ticks(e,42);assert.ok(e.heroes[0].currentHp<hp);
});
test('unprofiled legacy supers are not reported as source-profiled', () => {
  const e=make('cloud_ff7','Smash');assert.equal(e.signatureDirector.superReadiness(e.heroes[0]).supported,false);
});
test('repeated updates after disposal cannot advance a melee fight', () => {
  const e=make('liquid_snake','Smash');e.dispose();const before=e.enemies[0].currentHp;ticks(e,200);assert.equal(e.enemies[0].currentHp,before);
});
