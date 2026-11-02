import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { extinctionEnemyLabel, formatRaceObjective, sceneJournalPreview } from '../src/game/scenePresentation.js';
import { EngineRace } from '../src/game/engineRace.js';

for (const [type, fr, en] of [
  ['podium', 'Finir dans le podium', 'Finish on the podium'],
  ['beatRival', 'Battre le rival cible: Loom-07', 'Beat the target rival: Loom-07'],
  ['collectFragments', 'Recuperer les fragments: 2/4', 'Collect fragments: 2/4'],
  ['closePortals', 'Fermer les portails: 2/4', 'Close the portals: 2/4'],
  ['timeLimit', 'Sceller avant surcharge: 10s', 'Seal before overload: 10s']
]) test(`race objective ${type}: both languages, immutable state`, () => {
  const objective = Object.freeze({type, label:'old french label', collected:2, required:4, seconds:92, rivalName:'Loom-07'});
  assert.equal(formatRaceObjective(objective, 82, 'fr'), fr);
  assert.equal(formatRaceObjective(objective, 82, 'en'), en);
});
test('race objective tolerates absent/custom objectives and clamps expired countdown', () => {
  assert.equal(formatRaceObjective(null,0,'en'), 'Free race');
  assert.equal(formatRaceObjective({type:'custom',label:'Custom rule'},0,'en'),'Custom rule');
  assert.equal(formatRaceObjective({type:'timeLimit',seconds:10},22,'en'),'Seal before overload: 0s');
});
test('race engine changes presentation without resetting time, position or objective progress', () => {
  const race = Object.create(EngineRace.prototype);
  Object.assign(race, {lang:'fr',time:10,player:{x:40,y:50},objective:{type:'collectFragments',collected:2,required:4}});
  const state = structuredClone({time:race.time,player:race.player,objective:race.objective});
  assert.equal(race.getObjectiveStatus(),'Recuperer les fragments: 2/4');
  race.lang='en';
  assert.equal(race.getObjectiveStatus(),'Collect fragments: 2/4');
  assert.deepEqual({time:race.time,player:race.player,objective:race.objective},state);
});
test('all six Extinction names are localized without changing the gameplay IDs', () => {
  const kinds=['Traqueur','Sniper','Briseur','Essaim','Champion de Trame','Drone Protecteur'];
  assert.deepEqual(kinds.map(k=>extinctionEnemyLabel(k,'en')),['Stalker','Sniper','Breaker','Swarm','Thread Champion','Shield Drone']);
  assert.equal(extinctionEnemyLabel('unknown','en'),'unknown');
  assert.equal(extinctionEnemyLabel('Champion de Trame','fr'),'Champion de Trame');
});
test('journal preview preserves short text and makes truncation explicit', () => {
  assert.equal(sceneJournalPreview('  Ancre\n stable  '),'Ancre stable');
  assert.equal(sceneJournalPreview(null),'');
  const full='Mirelle donne une transmission longue '.repeat(10);
  const short=sceneJournalPreview(full);
  assert.ok(short.endsWith('…'));
  assert.ok(Array.from(short).length<=88);
  assert.equal(full,'Mirelle donne une transmission longue '.repeat(10));
  assert.equal(sceneJournalPreview('🪐'.repeat(30),16),'🪐'.repeat(15)+'…');
});
test('all city service exits snapshot position and release commands before navigation', () => {
  const source=readFileSync(new URL('../src/components/HubScreen.jsx',import.meta.url),'utf8');
  const start=source.indexOf('  const openCityService = useCallback(');
  const end=source.indexOf('\n  const interactWithNearby',start);
  const code=source.slice(start,end);
  assert.ok(code.indexOf('snapshotMosaicLocation')<code.indexOf('callback(destination)'));
  assert.ok(code.includes('sceneInputsRef.current.clear()') && code.includes('state.keys = {}'));
  assert.match(source,/openCityService\(onOpenMissions, zone.universe\)/);
  assert.match(source,/openCityService\(onOpenCodex, zone.universe\)/);
  assert.match(source,/openCityService\(onOpenService, zone.action\)/);
});
test('journal full text and explicit 60-second Infestation brief remain present', () => {
  const source=readFileSync(new URL('../src/components/HubScreen.jsx',import.meta.url),'utf8');
  assert.match(source, /ref=\{journalRef\}[\s\S]*?<span>\{hubLog\}<\/span>/);
  assert.match(source, /onClick=\{openJournal\}/);
  assert.match(source, /Infestation: survive the swarms for 60 seconds/);
});
