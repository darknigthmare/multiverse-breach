import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { OC_CAMPAIGN_MISSIONS, OC_CAMPAIGN_CHAPTERS, OC_ORIGIN_LOCKS } from '../src/game/ocCampaign.js';
import { getOcCampaignResumeTarget, getOcCampaignUiProgress } from '../src/game/ocCampaignUiProgress.js';

const missionIds = OC_CAMPAIGN_MISSIONS.map(mission => mission.id);

test('franchise victories and consulted scenes cannot unlock OC acts', () => {
  const view = getOcCampaignUiProgress([1, 2, 3, 6, 12, 20, 90000, 99999]);
  assert.equal(view.progress.completedCount, 0);
  assert.deepEqual(view.acts.filter(act => act.unlocked).map(entry => entry.act.id), ['prologue']);
  assert.equal(view.completedChapterCount, 0);
  assert.equal(view.conclusionStatus, 'locked');
  const resume = getOcCampaignResumeTarget({ completedStages: [], viewedScenes: ['8801:0', '8801:1'], endingId: 'seal' });
  assert.equal(resume.kind, 'mission');
  assert.equal(resume.stage.id, 8801);
});

test('each canonical prefix opens exactly the same next operation regardless of unrelated victories', () => {
  for (let count = 0; count < missionIds.length; count++) {
    const completedStages = [...missionIds.slice(0, count), 1, 2, 3, 4, 9999];
    const resume = getOcCampaignResumeTarget({ completedStages });
    assert.equal(resume.kind, 'mission');
    assert.equal(resume.stage.id, missionIds[count]);
    assert.equal(completedStages.includes(resume.stage.id), false);
    const view = getOcCampaignUiProgress(completedStages);
    assert.equal(view.acts.find(entry => entry.act.id === resume.stage.actId).unlocked, true);
  }
});

test('six Origin Locks open Act V but do not complete the campaign', () => {
  const completed = OC_ORIGIN_LOCKS.map(lock => lock.missionId);
  const view = getOcCampaignUiProgress(completed);
  assert.equal(view.progress.lockIds.length, OC_ORIGIN_LOCKS.length);
  assert.equal(view.progress.completedCount, 6);
  assert.equal(view.progress.missionsComplete, false);
  assert.equal(view.progress.complete, false);
  const actV = view.acts.find(entry => entry.act.id === 'primordial');
  assert.equal(actV.unlocked, true);
  assert.equal(actV.completedCount, 0);
  assert.equal(actV.complete, false);
  assert.equal(getOcCampaignResumeTarget({ completedStages: completed }).stage.id, 8807);
});

test('all operations and chapters without a chosen ending remain awaiting conclusion', () => {
  const view = getOcCampaignUiProgress(missionIds);
  assert.equal(view.progress.percent, 100);
  assert.equal(view.progress.missionsComplete, true);
  assert.equal(view.progress.complete, false);
  assert.equal(view.completedChapterCount, OC_CAMPAIGN_CHAPTERS.length);
  assert.equal(view.conclusionStatus, 'choice-required');
  const actV = view.acts.find(entry => entry.act.id === 'primordial');
  assert.equal(actV.missionsComplete, true);
  assert.equal(actV.awaitingEnding, true);
  assert.equal(actV.complete, false);
  const resume = getOcCampaignResumeTarget({ completedStages: missionIds });
  assert.equal(resume.kind, 'ending-choice');
  assert.equal(resume.stage.id, 8812);
});

test('only a valid ending plus all canonical operations marks the final act complete', () => {
  for (const endingId of ['seal', 'converge', 'break', 'surrender']) {
    const view = getOcCampaignUiProgress(missionIds, endingId);
    assert.equal(view.progress.complete, true);
    assert.equal(view.conclusionStatus, 'recorded');
    assert.ok(view.acts.every(entry => entry.complete));
    assert.equal(getOcCampaignResumeTarget({ completedStages: missionIds, endingId }).kind, 'ending-replay');
  }
  assert.equal(getOcCampaignUiProgress(missionIds, 'invalid-ending').progress.complete, false);
  assert.equal(getOcCampaignUiProgress(missionIds.slice(0, 6), 'seal').progress.complete, false);
});

test('non-contiguous legacy clears do not skip missing operations or unlock a future act', () => {
  const completed = [8801, 8806, 8807, 8812];
  assert.equal(getOcCampaignResumeTarget({ completedStages: completed }).stage.id, 8802);
  assert.equal(getOcCampaignUiProgress(completed).acts.find(entry => entry.act.id === 'primordial').unlocked, false);
});

test('missing or disabled canonical stage is blocked without a fallback to DLC or a later operation', () => {
  const stages = [...OC_CAMPAIGN_MISSIONS.slice(1), { id: 1, universe: 'Franchise' }];
  assert.equal(getOcCampaignResumeTarget({ stages }).kind, 'blocked');
  assert.equal(getOcCampaignResumeTarget({ stages }).stage, null);
  const blocked = getOcCampaignResumeTarget({ isStageAvailable: stage => stage.id !== 8801 });
  assert.equal(blocked.kind, 'blocked');
  assert.equal(blocked.stage, null);
});

test('resume returns the exact runtime projection and normalizes string save IDs without mutation', () => {
  const runtime = OC_CAMPAIGN_MISSIONS.map(mission => ({ ...mission, runtimeMarker: true }));
  const completedStages = ['8801', '8802', '8802', '1'];
  const original = [...completedStages];
  const result = getOcCampaignResumeTarget({ completedStages, stages: runtime });
  assert.equal(result.stage, runtime.find(mission => mission.id === 8803));
  assert.deepEqual(completedStages, original);
  assert.equal(result.progress.completedCount, 2);
});

test('Hub uses one canonical projection while historical timeline is explicitly separate', () => {
  const source = readFileSync(new URL('../src/components/HubScreen.jsx', import.meta.url), 'utf8');
  assert.match(source, /RECOMPENSE DE CHAPITRE/);
  assert.doesNotMatch(source, /RECOMPENSE D ACTE/);
  assert.match(source, /campaignUi\.acts\.map/);
  assert.match(source, /ocCampaignUi\.acts\.map/);
  assert.doesNotMatch(source, /completedStages\.length >= Math\.max\(0, index \* 3\)/);
  assert.match(source, /Chronologie annexe du reseau — hors progression OC/);
  assert.match(source, /data-campaign-resume-stage=\{resumeTarget\.stage\?\.id\}/);
  assert.match(source, /onOpenBriefing\?\.\(resumeTarget\.stage\)/);
});
