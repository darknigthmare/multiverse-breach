import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { calculateSquadReadiness, proposeRelicAssignment, proposeSquad, scoreRelicPriority } from '../src/game/squadPreparation.js';
import { evaluateMissionAccess } from '../src/game/missions/missionAccessRules.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const hero = (id, universe = 'Alpha', category = 'marine') => ({ id, name: id, universe, category });
const heroes = [hero('player_anchor', 'Nexus'), hero('a'), hero('b'), hero('c', 'Beta', 'hacker'), hero('d', 'Gamma', 'hacker'), hero('e', 'Delta', 'slayer')];
const fixture = (roster = heroes, changes = {}) => ({
  heroes: roster, ownedHeroIds: roster.map(entry => entry.id), currentTeam: ['player_anchor', 'a', 'c'],
  preparationById: new Map(roster.map((entry, index) => [entry.id, { ...entry, level: 1 + (index % 3), factionIds: [], hasRelic: false, hasEvent: false }])),
  preparationContext: { synergies: [{ category: 'marine' }, { category: 'hacker' }, { category: 'slayer' }], factionRules: [] },
  random: () => 0.25,
  ...changes
});
const assertLegal = (result, options) => {
  assert.equal(result.valid, true, JSON.stringify(result));
  assert.equal(new Set(result.team).size, result.team.length);
  assert.ok(result.team.length <= 3);
  assert.ok(result.team.every(id => options.ownedHeroIds.includes(id)));
  assert.ok(evaluateMissionAccess(options.stage, { ...options, heroDb: options.heroes, activeTeam: result.team }).allowed);
};
let vite;
let SquadProposalPanel;

before(async () => {
  vite = await createServer({ root, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ default: SquadProposalPanel } = await vite.ssrLoadModule('/src/components/SquadProposalPanel.jsx?squad-preparation-tests'));
});
after(async () => { await vite?.close(); });

test('readiness is exactly the pre-existing displayed ARCA formula, including faction eligibility', () => {
  const context = {
    synergies: [{ category: 'marine' }, { category: 'hacker' }],
    factionRules: [{ id: 'nexus', base: true, minMembers: 2 }, { id: 'mission', base: false, minMembers: 2 }],
    missionFactionIds: ['mission']
  };
  for (let seed = 0; seed < 64; seed++) {
    const entries = Array.from({ length: seed % 4 }, (_, index) => ({
      category: (seed + index) % 3 ? 'marine' : 'hacker', level: (seed + index) % 9 + 1,
      factionIds: (seed + index) % 2 ? ['nexus'] : [], factionEligible: (seed + index) % 7 !== 0,
      hasRelic: Boolean((seed + index) % 2), hasEvent: Boolean((seed + index) % 3)
    }));
    const deployedCategories = entries.reduce((acc, item) => ({ ...acc, [item.category]: (acc[item.category] || 0) + 1 }), {});
    const deployedSynergies = context.synergies.filter(rule => (deployedCategories[rule.category] || 0) >= 2);
    const factionEligible = entries.filter(entry => entry.factionEligible !== false);
    const deployedFactionSynergies = context.factionRules.filter(rule => (rule.base
      ? factionEligible.filter(entry => entry.factionIds.includes(rule.id)).length
      : context.missionFactionIds.includes(rule.id) ? factionEligible.length : 0) >= rule.minMembers);
    const averageTeamLevel = entries.length ? entries.reduce((sum, entry) => sum + entry.level, 0) / entries.length : 0;
    const equippedRelicCount = entries.filter(entry => entry.hasRelic).length;
    const equippedEventCount = entries.filter(entry => entry.hasEvent).length;
    // Frozen reference to the display formula before extraction: no new model.
    const expected = Math.min(100, Math.round(
      (entries.length / 3) * 38
      + Math.min(22, averageTeamLevel * 4)
      + deployedSynergies.length * 12
      + deployedFactionSynergies.length * 8
      + equippedRelicCount * 5
      + equippedEventCount * 3
    ));
    assert.equal(calculateSquadReadiness(entries, context).score, expected);
  }
  assert.doesNotThrow(() => calculateSquadReadiness([{ category: 'marine' }], context));
  assert.equal(calculateSquadReadiness([]).score, 0);
});

test('relic proposal retains old priority but never touches reserve, inventory, or caller state', () => {
  const item = (id, atk) => ({ id, boost: { atk } });
  const options = {
    team: ['player_anchor', 'a', 'b'], equippedGear: { player_anchor: 'weak', a: 'medium', reserve: 'protected' },
    inventoryIds: ['weak', 'medium', 'free', 'upgraded_plus', 'protected', 'free'],
    items: [item('weak', 1), item('medium', 5), item('free', 10), item('upgraded_plus', 20), item('protected', 200)]
  };
  const original = structuredClone(options);
  const result = proposeRelicAssignment(options);
  assert.equal(result.after.reserve, 'protected');
  assert.equal(result.after.player_anchor, 'upgraded_plus');
  assert.equal(result.after.a, 'medium');
  assert.equal(result.after.b, 'free');
  assert.equal(new Set(options.team.map(id => result.after[id])).size, 3);
  assert.deepEqual(options, original);
  assert.deepEqual(result.before, original.equippedGear);
  assert.equal(scoreRelicPriority({ boost: { atk: 10, spd: 5, def: 3, hp: 20 } }), 26);
});

test('relic locks, unknown references, partial inventory and equal scores do not strip current gear', () => {
  const options = {
    team: ['a', 'b', 'c'], equippedGear: { a: 'locked', b: 'unknown', c: 'existing', reserve: 'reserve' },
    inventoryIds: ['locked', 'unknown', 'existing', 'new', 'reserve'], lockedHeroIds: ['a'],
    items: [{ id: 'locked', boost: { atk: 1 } }, { id: 'existing', boost: { atk: 10 } }, { id: 'new', boost: { atk: 10 } }, { id: 'reserve', boost: { atk: 100 } }]
  };
  assert.deepEqual(proposeRelicAssignment(options).after, options.equippedGear);
  const partial = { team: ['a', 'b'], equippedGear: { b: 'existing', reserve: 'gone' }, inventoryIds: ['existing'], items: options.items };
  const result = proposeRelicAssignment(partial);
  assert.equal(result.after.b, 'existing');
  assert.equal(result.after.reserve, 'gone');
  assert.equal(result.changes.length, 0);
});

test('random proposals are unique, owned, eligible and keep the Anchor when legal', async () => {
  const roster = [...heroes, { ...hero('npc'), playable: false }, hero('unowned'), hero('ineligible')];
  const options = fixture(roster, { ownedHeroIds: [...heroes.map(entry => entry.id), 'npc', 'ineligible', 'a'], eligibleHeroIds: [...heroes.map(entry => entry.id), 'npc', 'unowned'] });
  const originalTeam = [...options.currentTeam];
  const result = await proposeSquad(options);
  assertLegal(result, options);
  assert.ok(result.team.includes('player_anchor'));
  assert.deepEqual(options.currentTeam, originalTeam);
  assert.deepEqual((await proposeSquad(options)).team, result.team, 'injected RNG must be deterministic');
});

test('universe preparation needs only two owned same-world partners around the Anchor', async () => {
  for (const changes of [{ currentTeam: ['player_anchor'] }, { currentTeam: [], lockedHeroIds: ['player_anchor'] }]) {
    const options = fixture(heroes, { ...changes, ownedHeroIds: ['player_anchor', 'a', 'b'], universe: ' alpha ' });
    const result = await proposeSquad(options);
    assertLegal(result, options);
    assert.deepEqual(new Set(result.team), new Set(['player_anchor', 'a', 'b']));
    assert.equal(result.anchorPreserved, true);
  }
});

test('universe insufficiency explains the missing partner count without falling back to foreign heroes', async () => {
  const options = fixture(heroes, { ownedHeroIds: ['player_anchor', 'a', 'c'], universe: 'Alpha' });
  const result = await proposeSquad(options);
  assert.equal(result.valid, false);
  assert.equal(result.reason, 'universe-incomplete');
  assert.equal(result.count, 1);
  assert.equal(result.required, 2);
  const noAnchor = await proposeSquad({ ...options, currentTeam: ['a', 'c'] });
  assert.equal(noAnchor.required, 3);
});

test('canonical exact trio takes precedence over Anchor and excludes every foreign identity', async () => {
  const options = fixture(heroes, { stage: { requiredTeam: { type: 'exact', heroIds: ['a', 'b', 'c'] } } });
  const result = await proposeSquad(options);
  assertLegal(result, options);
  assert.deepEqual(new Set(result.team), new Set(['a', 'b', 'c']));
  assert.equal(result.anchorPreserved, false);
  assert.equal((await proposeSquad({ ...options, ownedHeroIds: ['player_anchor', 'a', 'b'] })).valid, false);
});

test('required character and explicit locked heroes remain present', async () => {
  const options = fixture(heroes, { lockedHeroIds: ['b'], stage: { requiredTeam: { type: 'character', heroId: 'd' } } });
  const result = await proposeSquad(options);
  assertLegal(result, options);
  assert.deepEqual(new Set(result.team), new Set(['player_anchor', 'b', 'd']));
});

test('mission universe allowAnchor and minCount determine Anchor compatibility faithfully', async () => {
  const roster = [...heroes, hero('third')];
  for (const allowAnchor of [true, false]) {
    const options = fixture(roster, { universe: 'alpha', stage: { requiredTeam: { type: 'universe', universe: ' ALPHA ', minCount: 2, allowAnchor } } });
    const result = await proposeSquad(options);
    assertLegal(result, options);
    assert.equal(result.team.includes('player_anchor'), allowAnchor);
  }
  const options = fixture(roster, { stage: { requiredTeam: { type: 'universe', universe: 'Alpha', minCount: 3, allowAnchor: true } } });
  const result = await proposeSquad(options);
  assertLegal(result, options);
  assert.equal(result.team.includes('player_anchor'), false);
});

test('three source universes do not preserve the Anchor at the cost of an impossible mission', async () => {
  const options = fixture(heroes, { stage: { sourceUniverses: ['alpha', 'BETA', 'Gamma'], allowAnchor: true } });
  const result = await proposeSquad(options);
  assertLegal(result, options);
  assert.equal(result.team.includes('player_anchor'), false);
  assert.equal(new Set(result.team.map(id => heroes.find(entry => entry.id === id).universe)).size, 3);
});

test('two source universes plus a locked foreign hero do not overfill three slots with the Anchor', async () => {
  const options = fixture(heroes, { lockedHeroIds: ['e'], stage: { sourceUniverses: ['Alpha', 'Beta'] } });
  const result = await proposeSquad(options);
  assertLegal(result, options);
  assert.ok(result.team.includes('e'));
  assert.equal(result.team.includes('player_anchor'), false);
});

test('completed narrative arc replays permit the existing free-team policy', async () => {
  const options = fixture(heroes, { ownedHeroIds: ['player_anchor', 'd', 'e'], completedArcIds: ['arc'], stage: { arcId: 'arc', requiredTeam: { type: 'exact', heroIds: ['a', 'b', 'c'] } } });
  const result = await proposeSquad(options);
  assertLegal(result, options);
  assert.ok(result.team.includes('player_anchor'));
});

test('exact optimizer matches exhaustive enumeration below 100 with strict equivalence reduction', async () => {
  const roster = Array.from({ length: 13 }, (_, index) => hero('h' + index, ['Alpha', 'Beta', 'Gamma'][index % 3], index < 6 ? 'marine' : 'hacker'));
  for (const stage of [null, { sourceUniverses: ['Alpha', 'Beta', 'Gamma'] }]) {
    const options = fixture(roster, { currentTeam: [], mode: 'optimize', stage });
    options.preparationById = new Map(roster.map((entry, index) => [entry.id, { ...entry, level: index < 6 ? 1 : index % 4 + 1, factionIds: index % 2 ? ['nexus'] : [], hasRelic: index === 8, hasEvent: index === 9 }]));
    options.preparationContext.factionRules = [{ id: 'nexus', base: true, minMembers: 2 }];
    let maximum = -1;
    for (let a = 0; a < roster.length - 2; a++) for (let b = a + 1; b < roster.length - 1; b++) for (let c = b + 1; c < roster.length; c++) {
      const ids = [roster[a].id, roster[b].id, roster[c].id];
      if (evaluateMissionAccess(stage, { ...options, heroDb: roster, activeTeam: ids }).allowed) {
        maximum = Math.max(maximum, calculateSquadReadiness(ids.map(id => options.preparationById.get(id)), options.preparationContext).score);
      }
    }
    const result = await proposeSquad(options);
    assertLegal(result, options);
    assert.ok(maximum < 100, 'fixture must force exhaustive search rather than early bound');
    assert.equal(result.readiness.score, maximum);
    assert.equal(result.exact, true);
  }
});

test('100 is an explicit upper bound and a legal current maximum is retained without search', async () => {
  const options = fixture(heroes, { mode: 'optimize', currentTeam: ['player_anchor', 'a', 'b'] });
  options.preparationById.forEach(entry => Object.assign(entry, { level: 10, hasRelic: true, hasEvent: true, factionIds: ['nexus'] }));
  options.preparationContext.factionRules = [{ id: 'nexus', base: true, minMembers: 2 }];
  const result = await proposeSquad(options);
  assert.equal(result.readiness.score, 100);
  assert.equal(result.checked, 0);
  assert.deepEqual(result.team, options.currentTeam);
});

test('optimizer cancellation never yields a partial optimum as a confirmable proposal', async () => {
  const result = await proposeSquad(fixture(heroes, { mode: 'optimize', isCancelled: () => true }));
  assert.equal(result.valid, false);
  assert.equal(result.reason, 'cancelled');
  assert.equal(result.team, undefined);
});

test('small owned rosters remain unique legal partial teams outside universe requests', async () => {
  const options = fixture(heroes, { ownedHeroIds: ['player_anchor', 'a'], currentTeam: ['player_anchor'] });
  const result = await proposeSquad(options);
  assertLegal(result, options);
  assert.equal(result.partial, true);
  assert.equal(result.team.length, 2);
});

test('proposal panel shows before/after and stale previews cannot be confirmed', () => {
  const proposal = {
    kind: 'gear', team: ['a'], before: { a: 'old' }, after: { a: 'new' }, changed: true,
    beforeReadiness: { score: 50 }, afterReadiness: { score: 55 },
    beforeStats: { hp: 10, atk: 5, def: 3, spd: 1 }, afterStats: { hp: 20, atk: 10, def: 3, spd: 1 }
  };
  const props = { proposal, heroes: [{ id: 'a', name: { fr: 'Héros', en: 'Hero' } }], lang: 'fr', getGearDisplay: id => ({ name: { fr: id } }), onConfirm() {}, onCancel() {} };
  const valid = renderToStaticMarkup(React.createElement(SquadProposalPanel, { ...props, valid: true }));
  assert.match(valid, /<td>old<\/td>/);
  assert.match(valid, /<td>new<\/td>/);
  assert.match(valid, /Héros/);
  assert.match(valid, /pas une probabilité de victoire/);
  assert.match(valid, /ANNULER SANS MODIFIER/);
  assert.doesNotMatch(valid, /disabled=""/);
  const stale = renderToStaticMarkup(React.createElement(SquadProposalPanel, { ...props, valid: false }));
  assert.match(stale, /disabled=""[^>]*>CONFIRMER/);
  assert.match(stale, /La collection ou l’équipe a changé/);
});

test('Hub shares readiness, gates mutations behind confirmation and compiles all proposal controls', async () => {
  const hub = readFileSync(path.join(root, 'src/components/HubScreen.jsx'), 'utf8');
  const preview = hub.slice(hub.indexOf('const previewRelicAssignment ='), hub.indexOf('const toggleActiveHero ='));
  const cancel = hub.slice(hub.indexOf('const cancelSquadProposal ='), hub.indexOf('const confirmSquadProposal ='));
  assert.doesNotMatch(preview + cancel, /set(?:EquippedGear|ActiveTeam|Inventory|Gold|Shards)\(/);
  assert.match(hub, /if \(!squadProposalValid \|\| !squadProposal\?\.changed\) return/);
  assert.match(hub, /const squadReadinessReport = getReadinessForTeam\(activeTeam\)/);
  assert.match(hub, /return calculateSquadReadiness\(teamIds\.map/);
  assert.doesNotMatch(hub, /autoEquipRelics/);
  assert.match(hub, /initialTab = 'missions'/);
  assert.match(hub, /<AnchorCustomizationPanel lang=\{lang\} portalCollection=\{portalCollection\} setPortalCollection=\{setPortalCollection\}/);
  const transformed = await vite.transformRequest('/src/components/HubScreen.jsx');
  assert.ok(transformed?.code.includes('SquadProposalPanel'));
});
