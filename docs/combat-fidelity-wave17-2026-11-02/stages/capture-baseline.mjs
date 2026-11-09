// Run once before any W17 scene definitions or catalog insertions.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { STAGE_ANIMATION_PROFILES, getStageAnimationProfile, renderStageAnimation } from '../../../src/game/melee/stageAnimationCatalog.js';
import { HEROES_DB } from '../../../src/game/heroes.js';

const directory = new URL('./', import.meta.url);
const output = new URL('baseline-before.json', directory);
assert.equal(fs.existsSync(output), false, 'Do not replace the real pre-production baseline');
assert.equal(STAGE_ANIMATION_PROFILES.length, 435);
const encode = value => JSON.stringify(value, (_, item) => item instanceof RegExp ? { source: item.source, flags: item.flags } : item);
const sha = value => createHash('sha256').update(value).digest('hex');
function trace(stage, elapsedSeconds) {
  const calls = [], ctx = new Proxy({}, {
    get(_, key) { return (...args) => calls.push([key, ...args]); },
    set(_, key, value) { calls.push([key, value]); return true; }
  });
  const rendered = renderStageAnimation(ctx, { stage, width: 1040, height: 460, elapsedSeconds });
  return { rendered, resolved: getStageAnimationProfile(stage)?.id || null, sha256: sha(encode(calls)) };
}
const universes = new Set(HEROES_DB.map(hero => hero.universe));
const configured = new Set(STAGE_ANIMATION_PROFILES.flatMap(profile => profile.universes));
const planPath = new URL('source-plan-before.json', directory), plan = JSON.parse(fs.readFileSync(planPath));
plan.createdAt = new Date().toISOString();
fs.writeFileSync(planPath, JSON.stringify(plan, null, 2) + '\n');
const baseline = {
  createdAt: new Date().toISOString(), publishedBaselineCommit: '9981b73deb3ee027c86877d7c15c6698e4f02191',
  sourcePlanSha256: sha(fs.readFileSync(planPath)), definitions: STAGE_ANIMATION_PROFILES.length,
  configuredUniverses: configured.size, configuredRosterUniverses: [...configured].filter(universe => universes.has(universe)).length,
  stageDefinitions: Object.fromEntries(STAGE_ANIMATION_PROFILES.map(profile => [profile.id, sha(encode(profile))])),
  stageTraces: STAGE_ANIMATION_PROFILES.flatMap(profile => ['Combat', 'Melee', 'RPG', 'Tactics'].map(mode => {
    const stage = { universe: profile.universes[0], name: profile.sourceScene, mode };
    return { id: profile.id, stage, at0: trace(stage, 0), at23: trace(stage, profile.periodSeconds * .23) };
  }))
};
fs.writeFileSync(output, JSON.stringify(baseline, null, 2) + '\n');
console.log(JSON.stringify({ definitions: baseline.definitions, configuredUniverses: baseline.configuredUniverses, configuredRosterUniverses: baseline.configuredRosterUniverses, traces: baseline.stageTraces.length, sourcePlanSha256: baseline.sourcePlanSha256 }));
