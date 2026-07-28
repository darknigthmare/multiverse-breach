import assert from 'node:assert/strict';
import test from 'node:test';

import {
  OC_DLC_PACKS,
  OC_DLC_STAGE_IDS,
  isOcDlcMissionUnlocked
} from '../src/game/ocDlcPacks.js';

const EXPECTED_STAGE_IDS = Array.from({ length: 9 }, (_, index) => 47_001 + index);

const assertText = (value, label) => {
  assert.equal(typeof value, 'string', `${label} must be a string`);
  assert.ok(value.trim().length > 0, `${label} must not be empty`);
};

const assertLocalized = (value, label) => {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value), `${label} must be localized`);
  assertText(value.en, `${label}.en`);
  assertText(value.fr, `${label}.fr`);
};

const assertStandalone = (entry, label) => {
  assert.equal(entry.standalone, true, `${label} must be standalone`);
  assert.equal(entry.campaignDependency, null, `${label} must not depend on the main campaign`);
};

test('catalog exposes exactly three standalone, non-numbered OC acts', () => {
  assert.equal(OC_DLC_PACKS.length, 3);
  assert.equal(new Set(OC_DLC_PACKS.map(pack => pack.id)).size, 3);
  assert.equal(new Set(OC_DLC_PACKS.map(pack => pack.universe)).size, 3);
  assert.equal(new Set(OC_DLC_PACKS.map(pack => pack.universeKey)).size, 3);

  OC_DLC_PACKS.forEach(pack => {
    assertStandalone(pack, pack.id);
    assert.equal(pack.numberedAct, false, `${pack.id} must remain a non-numbered act`);
    assert.deepEqual(pack.requiredCampaignStageIds, [], `${pack.id} must not require campaign stages`);
    assert.equal(pack.contentPackId, pack.id);
    assert.equal(pack.contentOrigin, 'oc');
    assert.equal(pack.originalContent, true);
    assertLocalized(pack.title, `${pack.id}.title`);
    assertLocalized(pack.actLabel, `${pack.id}.actLabel`);
    assertLocalized(pack.desc, `${pack.id}.desc`);
    assertLocalized(pack.theme, `${pack.id}.theme`);
    assert.doesNotMatch(pack.actLabel.en, /\bact\s+(?:\d+|[ivxlcdm]+)\b/i);
    assert.doesNotMatch(pack.actLabel.fr, /\bacte\s+(?:\d+|[ivxlcdm]+)\b/i);
  });
});

test('catalog owns the unique stage range 47001 through 47009', () => {
  const missionIds = OC_DLC_PACKS.flatMap(pack => pack.missions.map(mission => mission.id));

  assert.deepEqual([...OC_DLC_STAGE_IDS].sort((a, b) => a - b), EXPECTED_STAGE_IDS);
  assert.deepEqual([...missionIds].sort((a, b) => a - b), EXPECTED_STAGE_IDS);
  assert.equal(new Set(missionIds).size, EXPECTED_STAGE_IDS.length);
});

test('every pack contains the complete localized content contract', () => {
  OC_DLC_PACKS.forEach(pack => {
    assert.equal(pack.heroes.length, 3, `${pack.id}: expected 3 heroes`);
    assert.equal(pack.monsters.length, 3, `${pack.id}: expected 3 monsters`);
    assert.equal(pack.bosses.length, 3, `${pack.id}: expected 3 bosses`);
    assert.ok(pack.worldBoss && typeof pack.worldBoss === 'object', `${pack.id}: expected 1 world boss`);
    assert.equal(pack.gear.length, 3, `${pack.id}: expected 3 gear items`);
    assert.ok(Array.isArray(pack.event), `${pack.id}: expected 1 event item`);
    assert.equal(pack.missions.length, 3, `${pack.id}: expected 3 missions`);

    pack.heroes.forEach(hero => {
      assertText(hero.id, `${pack.id}.hero.id`);
      assertText(hero.name, `${hero.id}.name`);
      assertLocalized(hero.loreLocalized, `${hero.id}.lore`);
      assert.equal(hero.skills.length, 3, `${hero.id}: expected 3 skills`);
      hero.skills.forEach(skill => {
        assertText(skill.id, `${hero.id}.skill.id`);
        assertLocalized(skill.name, `${skill.id}.name`);
        assertLocalized(skill.desc, `${skill.id}.desc`);
      });
    });

    [...pack.monsters, ...pack.bosses, pack.worldBoss].forEach(threat => {
      assertText(threat.id, `${pack.id}.threat.id`);
      assertLocalized(threat.nameLocalized, `${threat.id}.name`);
      assertLocalized(threat.loreLocalized, `${threat.id}.lore`);
    });

    pack.gear.forEach((gear, index) => {
      assert.equal(gear.length, 5, `${pack.id}.gear[${index}] has an invalid tuple`);
      assertText(gear[0], `${pack.id}.gear[${index}].id`);
      assertText(gear[1], `${gear[0]}.name.en`);
      assertText(gear[2], `${gear[0]}.name.fr`);
      assertLocalized(gear[4]?.desc, `${gear[0]}.desc`);
    });

    assert.equal(pack.event.length, 6, `${pack.id}.event has an invalid tuple`);
    assertText(pack.event[0], `${pack.id}.event.id`);
    assertText(pack.event[1], `${pack.event[0]}.name.en`);
    assertText(pack.event[2], `${pack.event[0]}.name.fr`);
    assertText(pack.event[3], `${pack.event[0]}.desc.en`);
    assertText(pack.event[4], `${pack.event[0]}.desc.fr`);
    assertText(pack.event[5]?.summonIcon, `${pack.event[0]}.summonIcon`);
    assertText(pack.event[5]?.summonIconPrompt, `${pack.event[0]}.summonIconPrompt`);

    pack.missions.forEach(mission => {
      assertStandalone(mission, `${pack.id}.mission.${mission.id}`);
      assert.equal(mission.stageId, mission.id);
      assert.equal(mission.contentOrigin, 'oc');
      assert.equal(mission.originalContent, true);
      assertLocalized(mission.name, `${mission.id}.name`);
      assertLocalized(mission.bossNameLocalized, `${mission.id}.bossName`);
      assertLocalized(mission.intro, `${mission.id}.intro`);
      assertLocalized(mission.outro, `${mission.id}.outro`);
      assertLocalized(mission.objective, `${mission.id}.objective`);
      assertLocalized(mission.stakes, `${mission.id}.stakes`);
      assertLocalized(mission.consequence, `${mission.id}.consequence`);
      assertLocalized(mission.reward, `${mission.id}.reward`);
      assertLocalized(mission.rewardItemName, `${mission.id}.rewardItemName`);
      assert.ok(mission.storyBeat && typeof mission.storyBeat === 'object', `${mission.id}: missing storyBeat`);
      assert.deepEqual(mission.storyBeat.intro, mission.intro);
      assert.deepEqual(mission.storyBeat.outro, mission.outro);
      assert.deepEqual(mission.storyBeat.scenes, mission.scenes);
      assert.ok(mission.scenes.length >= 3, `${mission.id}: expected at least 3 complete scenes`);

      mission.scenes.forEach(scene => {
        assertText(scene.id, `${mission.id}.scene.id`);
        assertText(scene.speaker, `${scene.id}.speaker`);
        assertLocalized(scene.text, `${scene.id}.text`);
        assertLocalized(scene.direction, `${scene.id}.direction`);
      });
    });
  });
});

test('mission sequence is strict and independent from every other campaign', () => {
  const unrelatedCampaignCompletions = [8_801, 8_802, 40_000, 90_000];

  OC_DLC_PACKS.forEach(pack => {
    pack.missions.forEach((mission, index) => {
      const expectedPreviousId = index === 0 ? null : pack.missions[index - 1].id;
      const otherPackStageIds = OC_DLC_PACKS
        .filter(candidate => candidate.id !== pack.id)
        .flatMap(candidate => candidate.missions.map(entry => entry.id));

      assert.equal(mission.previousStageId, expectedPreviousId);
      if (index === 0) {
        assert.equal(isOcDlcMissionUnlocked(mission, []), true);
        assert.equal(isOcDlcMissionUnlocked(mission, unrelatedCampaignCompletions), true);
      } else {
        assert.equal(isOcDlcMissionUnlocked(mission, []), false);
        assert.equal(isOcDlcMissionUnlocked(mission, unrelatedCampaignCompletions), false);
        assert.equal(isOcDlcMissionUnlocked(mission, otherPackStageIds), false);
        assert.equal(isOcDlcMissionUnlocked(mission, [expectedPreviousId]), true);
        if (index > 1) {
          assert.equal(isOcDlcMissionUnlocked(mission, [pack.missions[0].id]), false);
        }
      }
    });
  });
});

test('all content IDs are unique and contentPackId ownership is coherent', () => {
  const allIds = [];
  const rememberId = (id, label) => {
    assert.ok(typeof id === 'string' || Number.isInteger(id), `${label} has an invalid ID`);
    allIds.push({ id: String(id), label });
  };

  OC_DLC_PACKS.forEach(pack => {
    const assertOwner = (entry, label) => {
      assert.equal(entry.contentPackId, pack.id, `${label} belongs to the wrong content pack`);
    };

    rememberId(pack.id, 'pack');
    pack.heroes.forEach(hero => {
      rememberId(hero.id, 'hero');
      assertOwner(hero, hero.id);
      hero.skills.forEach(skill => rememberId(skill.id, 'skill'));
    });
    [...pack.monsters, ...pack.bosses, pack.worldBoss].forEach(threat => {
      rememberId(threat.id, 'threat');
      assertOwner(threat, threat.id);
    });
    pack.gear.forEach(gear => {
      rememberId(gear[0], 'gear');
      assertOwner(gear[4], gear[0]);
    });
    rememberId(pack.event[0], 'event');
    assertOwner(pack.event[5], pack.event[0]);

    const gearIds = new Set(pack.gear.map(gear => gear[0]));
    pack.missions.forEach((mission, index) => {
      rememberId(mission.id, 'mission');
      assertOwner(mission, String(mission.id));
      assert.ok(gearIds.has(mission.rewardItemId), `${mission.id}: rewardItemId is outside its pack`);
      assert.equal(mission.eventRewardId, index === pack.missions.length - 1 ? pack.event[0] : null);
      mission.scenes.forEach(scene => rememberId(scene.id, 'scene'));
    });
  });

  const duplicates = allIds.filter((entry, index) => (
    allIds.findIndex(candidate => candidate.id === entry.id) !== index
  ));
  assert.deepEqual(duplicates, []);
});
