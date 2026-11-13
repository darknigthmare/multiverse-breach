import assert from 'node:assert/strict';
import test from 'node:test';
import { filterOcDlcLibraryEntries, getOcDlcLibraryEntries } from '../src/game/ocDlcLibraryView.js';

const pack = (id, universe, first) => ({ id, universe, title: { fr: 'Les heures empruntées', en: 'Borrowed hours' },
  missions: [{ id: first, previousStageId: null, name: { fr: 'La première porte', en: 'The first door' } },
    { id: first + 1, previousStageId: first, name: { fr: 'Le dernier seuil', en: 'The final threshold' } }] });
const packs = [pack('a', 'Méridien', 10), pack('b', 'Jardin', 20)];
const metadata = [...packs.map(item => ({ id: item.id, universe: item.universe, missionIds: item.missions.map(mission => mission.id) })),
  { id: 'future', universe: 'Absent', missionIds: [30, 31] }];
const canOpenMission = (mission, completed) => mission.previousStageId == null || completed.some(id => String(id) === String(mission.previousStageId));
const view = changes => getOcDlcLibraryEntries({ packs, metadata, canOpenMission, isInstalled: () => true, ...changes });

test('active, reserve and absent remain distinct while absent progress and preference survive', () => {
  const entries = view({ completedStages: ['30'], hiddenUniverses: ['Jardin', 'Absent'] });
  assert.deepEqual(entries.map(item => item.state), ['active', 'reserve', 'absent']);
  assert.equal(entries[2].completedCount, 1);
  assert.equal(entries[2].savedReserve, true);
  assert.equal(entries[2].targetMission, null);
  assert.equal(entries[2].targetUnlocked, false);
  const reduced = view({ isInstalled: () => false, completedStages: [10], hiddenUniverses: ['Méridien'] });
  assert.ok(reduced.every(item => item.state === 'absent' && !item.targetUnlocked));
  assert.equal(reduced[0].completedCount, 1);
});

test('next and final briefing keep authored order and prerequisites without changing completion', () => {
  const initial = view();
  assert.equal(initial[0].targetMission.id, 10);
  assert.equal(initial[0].targetUnlocked, true);
  const partial = view({ completedStages: ['10'] });
  assert.equal(partial[0].targetMission.id, 11);
  const complete = view({ completedStages: [11, '10'] });
  assert.equal(complete[0].complete, true);
  assert.equal(complete[0].targetMission.id, 11);
  assert.equal(complete[0].targetUnlocked, true);
  const reserve = view({ completedStages: [10, 11], hiddenUniverses: ['Méridien'] });
  assert.equal(reserve[0].complete, true);
  assert.equal(reserve[0].targetUnlocked, false);
});

test('a broken or unavailable prerequisite does not choose or unlock a later mission', () => {
  const entries = view({ canOpenMission: () => false });
  assert.equal(entries[0].targetMission, null);
  assert.equal(entries[0].targetUnlocked, false);
  assert.equal(entries[0].complete, false);
});

test('filtering searches both languages and mission names with accent-insensitive words', () => {
  const entries = view({ completedStages: [20, 21], hiddenUniverses: ['Jardin'] });
  assert.deepEqual(filterOcDlcLibraryEntries(entries, { query: 'MERIDIEN premiere' }), [entries[0]]);
  assert.deepEqual(filterOcDlcLibraryEntries(entries, { query: 'door meridien' }), [entries[0]]);
  assert.deepEqual(filterOcDlcLibraryEntries(entries, { status: 'reserve' }), [entries[1]]);
  assert.deepEqual(filterOcDlcLibraryEntries(entries, { status: 'completed' }), [entries[1]]);
  assert.deepEqual(filterOcDlcLibraryEntries(entries, { status: 'absent' }), [entries[2]]);
  assert.deepEqual(filterOcDlcLibraryEntries(entries, { query: 'not in any story' }), []);
});

test('a base edition keeps metadata-only dossiers and never invents content', () => {
  const entries = view({ packs: [], completedStages: [10, 30], hiddenUniverses: ['Méridien'] });
  assert.equal(entries.length, metadata.length);
  assert.ok(entries.every(entry => !entry.loaded && !entry.included && !entry.active && !entry.targetUnlocked));
  assert.deepEqual(entries.map(entry => entry.completedCount), [1, 0, 1]);
  assert.deepEqual(entries.map(entry => entry.savedReserve), [true, false, false]);
});

test('projection and searches preserve packs, progression, preferences and source order', () => {
  const input = { packs: structuredClone(packs), metadata: structuredClone(metadata), completedStages: ['11', 10], hiddenUniverses: ['Jardin'] };
  const before = structuredClone(input);
  const entries = view(input);
  filterOcDlcLibraryEntries(entries, { query: 'heures', status: 'completed' });
  assert.deepEqual(input, before);
  assert.deepEqual(entries.map(entry => entry.pack.id), ['a', 'b', 'future']);
  assert.equal(entries[0].pack, input.packs[0]);
});
