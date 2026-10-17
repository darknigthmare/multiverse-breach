import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { getProgressKeys, getNextProgressRolloverDelay, migrateProgressCalendar } from '../src/game/progressCalendar.js';
import { sanitizeSaveCore } from '../src/game/saveValidation.js';
import { readLocalSaveSnapshot, backupLocalSave, getSaveBackupKey } from '../src/game/saveRecovery.js';
import { createLocalSaveGuard } from '../src/game/localSaveGuard.js';
import { createCloudOperationEpoch } from '../src/game/cloudOperationEpoch.js';
import { readStorageValue, removeStorageValue } from '../src/game/safeStorage.js';

for (const [date, week] of [['2026-01-03T00:00:00.000Z','2026-W1'], ['2026-01-03T00:00:00.001Z','2026-W1'], ['2020-12-31T23:59:59Z','2020-W53'], ['2021-01-01T12:00:00Z','2020-W53'], ['2021-01-04T00:00:00Z','2021-W1'], ['2026-10-18T23:59:59Z','2026-W42'], ['2026-10-19T00:00:00Z','2026-W43']]) {
  test(`${date} belongs to ISO week ${week}`, () => assert.equal(getProgressKeys(new Date(date)).weekKey, week));
}
test('calendar does not depend on host timezone or DST', () => {
  const script = `import {getProgressKeys} from './src/game/progressCalendar.js'; console.log(JSON.stringify(['2026-10-16T00:30:00+02:00','2026-03-29T01:59:59+01:00','2026-10-25T02:00:00+01:00'].map(d=>getProgressKeys(new Date(d)))))`;
  const results = ['UTC','Europe/Paris','Pacific/Kiritimati','America/Los_Angeles'].map(TZ => execFileSync(process.execPath, ['--input-type=module','-e',script], { env: { ...process.env, TZ }, cwd: new URL('..', import.meta.url), encoding: 'utf8' }));
  results.forEach(result => assert.equal(result, results[0]));
  assert.equal(JSON.parse(results[0])[0].dayKey, '2026-10-15');
});
test('rollover delay crosses UTC midnight, not local midnight', () => {
  assert.equal(getNextProgressRolloverDelay(new Date('2026-10-16T23:59:59.000Z')), 1025);
  assert.equal(getNextProgressRolloverDelay(new Date('2026-10-16T00:00:00Z')), 86400025);
});
test('invalid calendar dates are rejected', () => assert.throws(() => getProgressKeys(new Date('invalid')), TypeError));
test('calendar migration preserves existing claims and is idempotent', () => {
  const original = { dayKey:'2026-10-16', weekKey:'2026-W42', lastSeenDay:'2026-10-16', claimedDaily:['a'], claimedWeekly:['b'], dailyWins:3, weeklyWins:9 };
  const migrated = migrateProgressCalendar(original,new Date('2026-10-16T12:00:00Z'));
  assert.deepEqual(migrated.claimedDaily,['a']); assert.deepEqual(migrated.claimedWeekly,['b']);
  assert.equal(migrated.weeklyWins,9); assert.equal(migrateProgressCalendar(migrated),migrated);
  assert.equal(original.calendarVersion,undefined);
});
test('legacy Sunday week rollover keeps its rewards claimed after upgrade', () => {
  const migrated = migrateProgressCalendar({weekKey:'2026-W2',claimedWeekly:['claimed']}, new Date('2026-01-04T12:00:00Z'));
  assert.equal(migrated.weekKey,'2026-W1'); assert.deepEqual(migrated.claimedWeekly,['claimed']);
});
const makeStorage = initial => { const map=new Map(Object.entries(initial)); return {getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,value),removeItem:key=>map.delete(key)}; };
for (const raw of ['{broken', 'null', '[]', '42', '"not a save"']) {
  test(`corrupt root ${raw} stays intact and autosave can be quarantined`, () => {
    const disk=makeStorage({save:raw}); const snapshot=readLocalSaveSnapshot('save', x=>x,{gold:0},disk);
    assert.equal(snapshot.issue,'invalid-save'); assert.equal(snapshot.raw,raw);
    const guard=createLocalSaveGuard(disk,'save'); guard.block(snapshot.issue);
    assert.equal(guard.write({gold:0}).saved,false); assert.equal(disk.getItem('save'),raw);
  });
}
test('migration stores exact previous bytes before writing normalized data', () => {
  const disk=makeStorage({save:'{ "gold": 4 }'});
  const snapshot=readLocalSaveSnapshot('save', value=>({...value,saveVersion:9}),{},disk);
  assert.equal(snapshot.issue,null); assert.equal(disk.getItem(getSaveBackupKey('save')),'{ "gold": 4 }');
  assert.equal(disk.getItem('save'),'{ "gold": 4 }');
});
test('backup quota failure does not erase the original save', () => {
  const disk=makeStorage({save:'{"gold":4}'});disk.setItem=()=>{throw new Error('Quota');};
  const snapshot=readLocalSaveSnapshot('save', value=>({...value,saveVersion:9}),{},disk);
  assert.equal(snapshot.issue,'backup-failed'); assert.equal(disk.getItem('save'),' {"gold":4}'.trim());
});
test('storage failure is distinct from no save', () => {
  assert.equal(readLocalSaveSnapshot('save',x=>x,{},null).issue,'persistence-failed');
  assert.equal(readLocalSaveSnapshot('save',x=>x,{},makeStorage({})).issue,null);
  assert.equal(readStorageValue('save',null).ok,false);
  assert.equal(removeStorageValue('save',null).ok,false);
});
test('explicit backup can preserve malformed bytes before a user-authorized replacement', () => {
  const disk=makeStorage({save:'{broken'}); assert.equal(backupLocalSave('save',disk).ok,true);
  assert.equal(disk.getItem(getSaveBackupKey('save')),'{broken');
  const guard=createLocalSaveGuard(disk,'save');guard.block('invalid-save');guard.rebase();
  assert.equal(guard.write({gold:10}).saved,true);
});
test('save normalization repairs malformed numeric and collection fields without losing copies', () => {
  const raw={gold:'24',breachShards:Infinity,eventTokens:-4, unlockedHeroes:['a','a','future'],activeTeam:['a','a','unknown'], inventory:['potion','potion',null,4],heroLevels:{a:'3',bad:NaN},portalStats:{history:'broken'},activityProgress:{dailyWins:Infinity,claimedDaily:'broken'},completedStages:[1,'2',null,NaN]};
  const result=sanitizeSaveCore(raw,{knownHeroIds:['a']});
  assert.equal(result.gold,24);assert.equal(result.breachShards,0);assert.equal(result.eventTokens,0);
  assert.deepEqual(result.inventory,['potion','potion']);assert.deepEqual(result.activeTeam,['player_anchor','a']);
  assert.ok(result.unlockedHeroes.includes('future'));assert.equal(result.heroLevels.a,3);assert.equal(result.heroLevels.bad,1);
  assert.deepEqual(result.completedStages,[1,'2']);assert.deepEqual(result.portalStats.history,[]);
  assert.equal(raw.heroLevels.a,'3');
});
test('normalization preserves the established squad slot order', () => {
  const result=sanitizeSaveCore({unlockedHeroes:['a','player_anchor'],activeTeam:['a','player_anchor']},{knownHeroIds:['a']});
  assert.deepEqual(result.activeTeam,['a','player_anchor']);
});
for (const value of [null,[],42,'save']) test(`invalid save root ${JSON.stringify(value)} rejected`,()=>assert.throws(()=>sanitizeSaveCore(value),TypeError));
test('scope invalidation makes pending UI actions obsolete without affecting new actions',()=>{
  const scope=createCloudOperationEpoch();const old=scope.capture();scope.invalidate();const fresh=scope.capture();assert.equal(old(),false);assert.equal(fresh(),true);
});


test('a midnight defeat/result resets every daily field before setting the new day', async () => {
  const { rollProgressCalendar } = await import('../src/game/progressCalendar.js');
  const progress = { ...getProgressKeys(new Date('2026-10-16T23:59:59Z')),
    claimedDaily: ['reward-1'], claimedWeekly: ['week-reward'], itemActivations: 4,
    dailyWins: 2, dailyModeWins: { RPG: 2 }, weeklyWins: 7, weeklyItemActivations: 9,
    weeklyModeWins: { RPG: 7 }, lifetimeWins: 35, lastSeenDay: '2026-10-16' };
  const next = rollProgressCalendar(progress, getProgressKeys(new Date('2026-10-17T00:00:00Z')));
  assert.deepEqual(next.claimedDaily, []);
  assert.equal(next.dailyWins, 0);
  assert.equal(next.itemActivations, 0);
  assert.deepEqual(next.dailyModeWins, {});
  assert.deepEqual(next.claimedWeekly, ['week-reward']);
  assert.equal(next.weeklyWins, 7);
  assert.equal(next.lifetimeWins, 35);
  assert.equal(next.lastSeenDay, '2026-10-16', 'only the login routine changes the login day');
  assert.equal(progress.dailyWins, 2, 'immutable');
  assert.equal(rollProgressCalendar(next, getProgressKeys(new Date('2026-10-17T12:00:00Z'))), next);
});

test('Monday reset clears weekly claims, counters and modes together', async () => {
  const { rollProgressCalendar } = await import('../src/game/progressCalendar.js');
  const result = rollProgressCalendar({ ...getProgressKeys(new Date('2026-10-18T23:59:59Z')),
    claimedWeekly: ['weekly'], weeklyWins: 9, weeklyItemActivations: 3, weeklyModeWins: { Fighter: 9 } },
    getProgressKeys(new Date('2026-10-19T00:00:00Z')));
  assert.deepEqual(result.claimedWeekly, []);
  assert.equal(result.weeklyWins, 0);
  assert.equal(result.weeklyItemActivations, 0);
  assert.deepEqual(result.weeklyModeWins, {});
});
