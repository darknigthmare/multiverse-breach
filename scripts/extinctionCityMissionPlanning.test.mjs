import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { buildMissionPlanning } from './extinction-city/missionPlanning.mjs';
import { buildCatalog } from './extinction-city/catalog.mjs';
import { HEROES_DB } from '../src/game/heroes.js';
import { createPlayerHero } from '../src/game/playerHero.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { MOSAIC_CHARACTER_MISSIONS } from '../src/game/mosaicCharacterMissions.js';

const revision = '4ca3b2b87f4b7234612f11fc5c17ba205d36d340';
const catalog = buildMissionPlanning(revision);
const source = buildCatalog(revision, []);
const characterById = new Map(catalog.characters.map(row => [row.id, row]));
const plansFor = id => catalog.missions.filter(row => row.characterId === id);

test('exactly two distinct plans cover every resolved identity including the player', () => {
  const ids = [createPlayerHero(), ...HEROES_DB].map(hero => hero.id);
  assert.deepEqual(catalog.characters.map(row => row.id), ids);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(catalog.counts.characters, source.counts.heroes);
  assert.equal(catalog.counts.missions, source.counts.heroes * 2);
  assert.equal(new Set(catalog.missions.map(row => row.id)).size, catalog.missions.length);
  for (const id of ids) {
    const plans = plansFor(id);
    assert.deepEqual(plans.map(row => row.strand), ['universe', 'multiverse'], id);
    assert.notEqual(plans[0].title, plans[1].title, id);
    assert.notEqual(plans[0].objectives[1].action, plans[1].objectives[1].action, id);
    assert.notEqual(plans[0].objectives[1].obstacle, plans[1].objectives[1].obstacle, id);
  }
});

test('each plan has an incident, a concrete obstacle, return condition and editable production tracking', () => {
  const policyIds = new Set(catalog.commonPolicies.map(row => row.id));
  for (const plan of catalog.missions) {
    assert.equal(plan.sourceCharacterId, plan.characterId);
    assert.equal(plan.universe, characterById.get(plan.characterId).universe);
    assert.ok(policyIds.has(plan.commonPolicyId));
    assert.ok(plan.premise && plan.location && plan.sourceBindings.length, plan.id);
    assert.deepEqual(plan.objectives.map(row => row.id), ['briefing', 'activity', 'return']);
    for (const objective of plan.objectives) assert.ok(objective.action && objective.obstacle && objective.success, plan.id);
    assert.ok(plan.mechanics.length > 0);
    for (const field of catalog.editableTrackingFields) assert.ok(Object.hasOwn(plan, field), `${plan.id}/${field}`);
  }
});

test('all noncombatants and all peaceful finales retain peaceful objectives without inherited weapons', () => {
  const peacefulHeroes = catalog.characters.filter(row => row.nonCombat);
  assert.equal(peacefulHeroes.length, source.counts.nonCombat);
  assert.equal(peacefulHeroes.length, 101);
  for (const plan of catalog.missions) {
    const person = characterById.get(plan.characterId);
    assert.equal(plan.killRequired, false);
    assert.equal(plan.hostileResidentAllowed, false);
    if (!person.nonCombat && person.finalePolicy !== 'nonCombatFinal') continue;
    assert.equal(plan.combatPolicy, 'peaceful_objectives_only', plan.id);
    assert.ok(!plan.sourceBindings.some(ref => /\]\.(simple|secondary|special|defense|equipment\/weapon)$/.test(ref)), plan.id);
  }
  const tenenbaum = characterById.get('bioshock_rapture_tenenbaum');
  assert.equal(tenenbaum.rawWeaponType, 'gun');
  assert.equal(tenenbaum.sourceObjective, HEROES_DB.find(row => row.id === tenenbaum.id).objective);
  assert.equal(tenenbaum.sourceObjectiveLanguage, 'en');
  assert.match(plansFor(tenenbaum.id)[0].objectives[1].action, /Little Sisters/);
});

test('finale policies are complete source records instead of invented bosses', () => {
  const expected = Object.entries(ENEMIES_DB).filter(([, row]) => row.finalePolicy).map(([universe]) => universe).sort();
  assert.deepEqual(catalog.finalePolicies.map(row => row.universe).sort(), expected);
  assert.equal(catalog.finalePolicies.length, source.counts.finalePolicies);
  const mikuPlans = plansFor('miku');
  assert.ok(mikuPlans.every(row => row.combatPolicy === 'peaceful_objectives_only'));
  assert.match(mikuPlans[0].objectives[1].action, /public|musiciens/);
  assert.ok(mikuPlans.every(row => !row.sourceBindings.some(ref => ref.includes('HEROES_DB[miku].special'))));
});

test('enemy and boss occurrence keys match the inventory and never become possessions', () => {
  const expected = [...source.tables.Ennemis_FPS.rows, ...source.tables.Boss_FPS.rows].map(row => row[0]).sort();
  assert.deepEqual(catalog.encounters.map(row => row.id).sort(), expected);
  assert.equal(catalog.counts.enemyOccurrences, source.counts.enemies);
  assert.equal(catalog.counts.bossOccurrences, source.counts.bosses);
  assert.ok(catalog.encounters.every(row => row.possessable === false && row.killRequired === false));
  assert.ok(catalog.encounters.every(row => !row.finalePolicy || row.finalePolicy !== 'nonCombatFinal' || row.combatPolicy === 'peaceful_objectives_only'));
});

test('variants remain separate catalog rows without extra protagonists or exclusive abilities', () => {
  for (const id of ['unreal_1998_gina', 'unreal_1998_dante', 'unreal_1998_kurgan']) {
    const hero = HEROES_DB.find(row => row.id === id);
    const person = characterById.get(id);
    assert.deepEqual(person.sameProtagonistAs, hero.sameProtagonistAs);
    assert.equal(person.uniqueAbility, false);
    assert.ok(plansFor(id).every(row => row.acceptanceCriteria.some(rule => rule.includes('seconde personne'))));
  }
  assert.match(plansFor('unreal_1998_gina')[1].objectives[1].action, /même rôle de Prisoner 849/);
});

test('the player enters a concrete scene without being asked to meet themselves', () => {
  const player = characterById.get('player_anchor');
  assert.equal(player.isPlayer, true);
  for (const plan of plansFor(player.id)) {
    assert.match(plan.objectives[0].action, /Rejoindre le halo|Aller à la dernière lampe/);
    assert.ok(!plan.objectives[0].action.includes(`Rencontrer ${player.name}`));
    assert.equal(plan.prerequisites.characterOwnedOrAuthorizedResident, false);
  }
});

test('priority proposals use individual source context without transporting equipment across incarnations', () => {
  assert.equal(catalog.counts.individuallyDesignedCharacters, 22);
  assert.equal(catalog.counts.individuallyDesignedMissions, 44);
  const chief = plansFor('masterchief')[0];
  assert.match(chief.location, /Installation 04/);
  assert.match(chief.objectives[1].action, /fusil d’assaut/);
  assert.match(chief.objectives[1].action, /bouclier MJOLNIR/);
  assert.ok(!chief.objectives[1].action.includes('Bubble Shield'));
  const harry = plansFor('harry')[0];
  assert.match(harry.location, /cinquième année/);
  assert.ok(!harry.location.includes('Astronomy Tower'));
  assert.match(harry.objectives[1].action, /Expelliarmus/);
  const ripley = plansFor('ripley')[0];
  assert.match(ripley.location, /Nostromo/);
  assert.ok(!/M41A|power loader|Newt/.test(ripley.objectives[1].action));
  assert.match(plansFor('ripley_aliens')[0].objectives[1].action, /M41A/);
  assert.match(characterById.get('arthur_kaamelott').planningNotes, /gun contredit/);
});

test('generic source abilities stay explicitly unreviewed instead of becoming canon', () => {
  const baird = characterById.get('baird');
  assert.ok(baird.sourceGaps.includes('generic_ability_names'));
  assert.ok(plansFor('baird').every(row => row.readiness === 'source_research_required'));
  assert.ok(plansFor('baird').every(row => row.designKind === 'research_scaffold'));
  assert.ok(catalog.characters.every(row => row.externalReferencesChecked === false));
  assert.ok(catalog.missions.every(row => row.canonStatus.endsWith('_review_required')));
  for (const person of catalog.characters.filter(row => row.genericActions && !row.nonCombat)) {
    assert.ok(person.sourceGaps.includes('generic_ability_names'), person.id);
  }
});

test('Nexus backlog retains its 24 design proposals and explicitly links implemented adaptations', () => {
  const extensions = catalog.missions.filter(row => row.relatedRuntimeMissionId);
  assert.equal(extensions.length, 24);
  assert.equal(new Set(extensions.map(row => row.relatedRuntimeMissionId)).size, 24);
  const runtime = new Map(catalog.runtimeMissions.map(row => [row.id, row]));
  for (const plan of extensions) {
    const related = runtime.get(plan.relatedRuntimeMissionId);
    assert.equal(related.characterId, plan.characterId);
    assert.notEqual(plan.title, related.title, plan.id);
    assert.match(plan.premise, /^Prolongement proposé/);
    if (plan.runtimeMissionId) {
      const integrated = runtime.get(plan.runtimeMissionId);
      assert.equal(plan.implementationStatus, 'runtime_adaptation');
      assert.equal(integrated.characterId, plan.characterId);
      assert.equal(integrated.requiresMissionId, related.id);
      assert.equal(plan.runtimeValidation, 'not_certified_by_catalog');
      assert.ok(plan.runtimeScope && plan.runtimeScope.includes('reste à développer'));
      assert.ok(plan.sourceBindings.includes(`${integrated.contentFile}#${integrated.id}`));
    } else assert.equal(plan.implementationStatus, 'planned');
    assert.equal(plan.designKind, 'individual_proposal');
    assert.ok(plan.sourceBindings.includes(`src/game/mosaicCharacterStories.js#${related.id}`));
    assert.ok(!plan.objectives.some(step => /clôture|dossier|mandat|relevé aux Archives/i.test(step.action)), plan.id);
  }
  for (const plan of catalog.missions) {
    const generic = plan.designKind !== 'individual_proposal';
    assert.equal(plan.diegeticReviewStatus === 'diegetic_rewrite_required', generic, plan.id);
    assert.equal(plan.nextAction.includes('Réécriture diégétique requise'), generic, plan.id);
  }
});

test('runtime adaptations remain distinct from proposal IDs and do not auto-complete manual tracking', () => {
  const expectedLinks = new Map([
    ['city-plan-v1::arca_mirelle::multiverse', 'city-mirelle-night-watch-v1'],
    ['city-plan-v1::arca_quillon::multiverse', 'city-quillon-refuge-pump-v1'],
    ['city-plan-v1::arca_nadir::universe', 'city-nadir-buried-probe-v1'],
    ['city-plan-v1::arca_tessera::universe', 'city-tessera-chosen-window-v1'],
  ]);
  assert.equal(catalog.counts.implementedMissions, expectedLinks.size);
  assert.equal(catalog.counts.runtimeLinkedProposals, expectedLinks.size);
  assert.equal(catalog.counts.remainingUnlinkedProposals, catalog.missions.length - expectedLinks.size);
  for (const plan of catalog.missions) {
    assert.equal(plan.runtimeMissionId, expectedLinks.get(plan.id) || null, plan.id);
    assert.equal(plan.implementationStatus, expectedLinks.has(plan.id) ? 'runtime_adaptation' : 'planned', plan.id);
    assert.equal(plan.planningStatus, 'to_design', plan.id);
    assert.equal(plan.owner, '', plan.id);
    assert.equal(plan.targetMilestone, '', plan.id);
  }
  assert.deepEqual(catalog.runtimeMissions.map(row => row.id), MOSAIC_CHARACTER_MISSIONS.map(row => row.id));
  const runtimeIds = new Set(catalog.runtimeMissions.map(row => row.id));
  assert.ok(catalog.missions.every(row => !runtimeIds.has(row.id)));
  for (const row of catalog.runtimeMissions) {
    assert.ok(characterById.get(row.characterId).runtimeMissions.includes(row.id));
    assert.equal(row.browserValidation, 'not_certified_by_catalog');
    assert.ok(row.request && row.location && row.premise, row.id);
    assert.equal(row.sourceFile, row.contentFile);
    assert.ok(row.systemSourceFiles.includes('src/game/mosaicMissionOperations.js'));
    const source = MOSAIC_CHARACTER_MISSIONS.find(item => item.id === row.id);
    assert.deepEqual(row.sourceRefs, source.sourceRefs || []);
    const checkOperation = (exported, original) => {
      if (!original.operation) return;
      assert.deepEqual(exported.operation, Object.fromEntries(Object.entries(original.operation).map(([key, value]) =>
        [key, typeof value === 'string' ? value : value.fr || value.en])));
      assert.ok(['repair', 'scan', 'recover', 'secure', 'beacon', 'route'].includes(exported.operation.kind));
    };
    row.steps.forEach((step, index) => {
      const original = source.steps[index];
      checkOperation(step, original);
      for (const field of ['byOriginChoice', 'byChoice']) {
        for (const [id, route] of Object.entries(step[field] || {})) checkOperation(route, original[field][id]);
      }
    });
    if (row.requiresMissionId) {
      const previous = catalog.runtimeMissions.find(item => item.id === row.requiresMissionId);
      assert.equal(row.chapter, previous.chapter + 1);
      assert.equal(row.sourceFile, source.contentFile);
      assert.ok(row.systemSourceFiles.includes('src/game/mosaicCharacterFollowups.js'));
      assert.equal(previous.characterId, row.characterId);
      const origin = row.steps.find(step => step.byOriginChoice);
      const intervention = row.steps.find(step => step.byChoice);
      assert.deepEqual(Object.keys(origin.byOriginChoice), previous.steps.find(step => step.choices).choices.filter(item => item.valid).map(item => item.id));
      assert.deepEqual(Object.keys(intervention.byChoice), row.steps.find(step => step.choices).choices.filter(item => item.valid).map(item => item.id));
      for (const branch of [...Object.values(origin.byOriginChoice), ...Object.values(intervention.byChoice)]) {
        assert.ok(branch.text.length > 15 && branch.finding.length > 25);
        assert.ok(Number.isFinite(branch.x) && Number.isFinite(branch.y));
      }
    }
  }
});

test('source provenance includes static dependencies with actual hashes, not just aggregator names', () => {
  const sources = new Map(catalog.sourceManifest.map(row => [row.file, row]));
  for (const file of ['DLC/Halo/data/heroes.js', 'DLC/Portal/data/loreDescriptions.js', 'src/game/canonRosterWavePartM.js',
    'DLC/Alien/data/sourceSceneStages.js',
    'src/game/canonP0SourceKits.js', 'src/game/mosaicCharacterMissions.js', 'src/game/mosaicCharacterFollowups.js',
    'src/game/mosaicCharacterStories.js', 'src/game/mosaicMissionOperations.js', 'src/game/mosaicCityDeliveries.js',
    'src/game/mosaicMissionCargo.js', 'src/game/ocCampaign.js', 'scripts/extinction-city/missionPlanning.mjs']) {
    const row = sources.get(file);
    assert.ok(row?.exists, file);
    assert.equal(row.sha256, createHash('sha256').update(readFileSync(file)).digest('hex'), file);
  }
  assert.ok(catalog.sourceManifest.every(row => row.exists && /^[a-f0-9]{64}$/.test(row.sha256)));
});

test('carried quest objects retain ordered transfers and a return to their actual resident', () => {
  const linked = catalog.runtimeMissions.filter(mission => mission.steps.some(step => step.cargo));
  assert.equal(linked.length, 4);
  const carriedIds = new Set();
  let transfers = 0;
  for (const mission of linked) {
    assert.ok(mission.systemSourceFiles.includes('src/game/mosaicMissionCargo.js'));
    const original = MOSAIC_CHARACTER_MISSIONS.find(item => item.id === mission.id);
    let held = null;
    for (const [index, step] of mission.steps.entries()) {
      const cargo = original.steps[index].cargo;
      if (!cargo) { assert.equal(step.cargo, undefined); continue; }
      assert.deepEqual(step.cargo, { ...cargo, label: cargo.label.fr });
      assert.equal(step.type, 'marker');
      assert.ok(step.operation, `${mission.id}/${step.id} lost its physical intervention`);
      assert.ok(Number.isFinite(step.x) && Number.isFinite(step.y));
      transfers++;
      if (cargo.action === 'take') {
        assert.equal(held, null, 'Two quest objects cannot occupy the single slot');
        held = cargo.id; carriedIds.add(cargo.id);
      } else { assert.equal(cargo.action, 'deliver'); assert.equal(held, cargo.id); held = null; }
    }
    assert.equal(held, null, 'A story must return or install its carried object before completion');
    const closing = mission.steps.at(-1);
    assert.equal(closing.id, 'report');
    assert.equal(closing.type, 'npc');
    assert.equal(closing.targetId, mission.characterId);
    assert.ok(closing.dialogue && closing.dialogue === original.steps.at(-1).dialogue.fr);
  }
  assert.equal(carriedIds.size, 5);
  assert.equal(transfers, 10);
});

test('generation is deterministic and rejects mutable or malformed source revisions', () => {
  assert.throws(() => buildMissionPlanning('main'), /immutable/);
  assert.throws(() => buildMissionPlanning(revision.toUpperCase()), /immutable/);
  const again = buildMissionPlanning(revision);
  assert.equal(again.dataSha256, catalog.dataSha256);
  const { dataSha256, ...data } = catalog;
  assert.equal(createHash('sha256').update(JSON.stringify(data)).digest('hex'), dataSha256);
});
