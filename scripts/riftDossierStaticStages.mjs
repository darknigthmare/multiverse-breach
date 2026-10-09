import assert from 'node:assert/strict';
import { CANON_PRIORITY_STAGES } from '../src/game/canonPriorityStages.js';

const decode = value => value.replace(/\\(['\\])/g, '$1');

// Read only the static registry. Shared references resolve to the same objects
// used by the Hub; source text is never evaluated as JavaScript.
export const readStaticStages = (hubSource, sharedStages = CANON_PRIORITY_STAGES) => {
  const registryStart = hubSource.indexOf('const STAGES = [');
  const registryEnd = hubSource.indexOf('];', registryStart);
  assert.ok(registryStart >= 0 && registryEnd > registryStart, 'Unable to locate the static STAGES registry');
  const registrySource = hubSource.slice(registryStart, registryEnd + 2);
  const stagePattern = /\{\s*id:\s*(\d+),\s*name:\s*'((?:\\.|[^'\\])*)',\s*universe:\s*'((?:\\.|[^'\\])*)',\s*mode:\s*'((?:\\.|[^'\\])*)',[^\r\n]*?bossName:\s*'((?:\\.|[^'\\])*)'/g;
  const stages = [];
  for (const match of registrySource.matchAll(stagePattern)) {
    const id = Number(match[1]);
    if (id < 1 || id > 38) continue;
    stages.push({ id, name: decode(match[2]), universe: decode(match[3]), mode: decode(match[4]), bossName: decode(match[5]) });
  }
  for (const match of registrySource.matchAll(/\bCANON_PRIORITY_STAGES\.([A-Za-z_$][\w$]*)/g)) {
    const stage = Object.hasOwn(sharedStages, match[1]) ? sharedStages[match[1]] : null;
    assert.ok(stage, `Unknown shared static stage ${match[1]}`);
    stages.push({ ...stage });
  }
  const tutorial = registrySource.match(/\{\s*id:\s*90000,\s*name:\s*'((?:\\.|[^'\\])*)',[\s\S]*?universe:\s*'((?:\\.|[^'\\])*)',\s*mode:\s*'((?:\\.|[^'\\])*)',[\s\S]*?bossName:\s*'((?:\\.|[^'\\])*)'/);
  assert.ok(tutorial, 'Static tutorial stage 90000 is missing');
  stages.push({ id: 90000, name: decode(tutorial[1]), universe: decode(tutorial[2]), mode: decode(tutorial[3]), bossName: decode(tutorial[4]) });
  stages.sort((left, right) => left.id - right.id);
  assert.equal(stages.length, 39, 'Static stage count drifted');
  assert.deepEqual(stages.map(stage => stage.id), [...Array.from({ length: 38 }, (_, index) => index + 1), 90000], 'Static stages must cover IDs 1 through 38 and tutorial 90000 exactly once');
  return stages;
};
