import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { autoComposeMissionTeam, evaluateMissionAccess } from '../src/game/missions/missionAccessRules.js';
import { resolveTacticsEscort } from '../src/game/tacticsEscort.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let vite;
let projectCharacterArcStage;
let resolveMissionHeroLevelRequirement;
let CHARACTER_NARRATIVE_ARCS;
let HEROES_DB;
let getStageLoreDescription;
let EngineTactics;
let stage;
let heroDb;
const context = () => ({
  heroDb,
  ownedHeroIds: heroDb.map(hero => hero.id),
  activeTeam: ['saturnin_duck', 'chell'],
  baseAccess: true
});

before(async () => {
  vite = await createServer({ root, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ projectCharacterArcStage, resolveMissionHeroLevelRequirement } = await vite.ssrLoadModule('/src/game/characterArcStage.js?saturnin-contract-tests'));
  ({ CHARACTER_NARRATIVE_ARCS } = await vite.ssrLoadModule('/src/game/narrativeSystems.js'));
  ({ HEROES_DB } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ getStageLoreDescription } = await vite.ssrLoadModule('/src/game/loreDescriptions.js'));
  ({ EngineTactics } = await vite.ssrLoadModule('/src/game/engineTactics.js'));
  const arc = CHARACTER_NARRATIVE_ARCS.find(item => item.stageId === 10654);
  assert.ok(arc, 'Saturnin personal arc 10654 must exist');
  stage = projectCharacterArcStage(arc);
  heroDb = HEROES_DB.filter(hero => ['saturnin_duck', 'police_dog_saturnin', 'professor_popof', 'chell'].includes(hero.id));
  assert.equal(heroDb.length, 4, 'Use the four real roster identities, never synthetic companions');
});
after(async () => { await vite?.close(); });

test('Hub projects 10654 with its preserved identity and rewards and an explicit Saturnin escort', () => {
  assert.equal(stage.id, 10654);
  assert.equal(stage.characterArc.id, 'saturnin_duck_personal_thread');
  assert.equal(stage.characterArc.heroId, 'saturnin_duck');
  assert.deepEqual(stage.characterArc.unlock, { type: 'level', value: 4 });
  assert.equal(stage.rewardItemId, 'char_auto_saturnin_duck_nexus');
  assert.deepEqual([stage.goldPrize, stage.shardPrize, stage.tokenPrize], [150, 60, 2]);
  assert.equal(stage.mode, 'Tactics');
  assert.equal(stage.bossName, null);
  assert.deepEqual(stage.characterArc.finalePolicy, {
    policy: 'nonCombatFinal',
    objective: {
      fr: 'Escorter Saturnin vivant jusqu’à la zone d’extraction',
      en: 'Escort Saturnin alive to the extraction zone'
    }
  });
  assert.equal(stage.tacticsBattlefieldId, 'nexus_escort_route');
  const escort = resolveTacticsEscort(stage);
  assert.equal(escort.sourceHeroId, 'saturnin_duck');
  assert.equal(escort.provisional, false);
  assert.equal(stage.requiredTeam.type, 'sources');
  assert.deepEqual(stage.requiredTeam.sourceUniverses, ['Les Aventures de Saturnin']);
  assert.deepEqual(stage.requiredTeam.excludedHeroIds, ['saturnin_duck']);
  assert.equal(resolveMissionHeroLevelRequirement(stage), 1);
  assert.equal(resolveMissionHeroLevelRequirement({
    characterArc: { heroId: 'chell', unlock: { type: 'level', value: 4 } },
    requiredTeam: { type: 'character', heroId: 'chell' }
  }), 4);
});

test('first clear rejects a second Saturnin and composes an existing eligible companion', () => {
  const result = evaluateMissionAccess(stage, context());
  assert.equal(result.allowed, false);
  assert.equal(result.reasons[0].code, 'heroReservedForMission');
  assert.match(result.message.fr, /cible protégée/);
  const composition = autoComposeMissionTeam(stage, context());
  assert.equal(composition.composed, true);
  assert.ok(!composition.team.includes('saturnin_duck'));
  assert.ok(composition.team.some(id => ['police_dog_saturnin', 'professor_popof'].includes(id)));
  assert.ok(composition.team.every(id => context().ownedHeroIds.includes(id)));
  assert.equal(evaluateMissionAccess(stage, { ...context(), activeTeam: composition.team }).allowed, true);
});

test('missing ownership or eligibility never invents or grants a replacement companion', () => {
  for (const constraint of [
    { ownedHeroIds: ['saturnin_duck'] },
    { eligibleHeroIds: ['saturnin_duck'] }
  ]) {
    const unavailable = { ...context(), activeTeam: ['saturnin_duck'], ...constraint };
    const result = autoComposeMissionTeam(stage, unavailable);
    assert.equal(result.composed, false);
    assert.deepEqual(result.team, []);
    assert.equal(evaluateMissionAccess(stage, unavailable).allowed, false);
  }
  const popofOnly = { ...context(), activeTeam: ['chell'], eligibleHeroIds: ['professor_popof', 'chell'] };
  assert.deepEqual(autoComposeMissionTeam(stage, popofOnly).team, ['professor_popof', 'chell']);
});

test('replay frees other crew composition but not the protected identity or base unlock rules', () => {
  const replay = { ...context(), completedArcIds: [stage.characterArc.id] };
  assert.equal(evaluateMissionAccess(stage, replay).allowed, false);
  const free = evaluateMissionAccess(stage, { ...replay, activeTeam: ['chell'] });
  assert.equal(free.allowed, true);
  assert.equal(free.replayFree, true);
  const locked = evaluateMissionAccess(stage, { ...replay, activeTeam: ['chell'], baseAccess: false });
  assert.equal(locked.allowed, false);
  assert.equal(locked.reasons[0].code, 'baseAccessBlocked');
});

test('French and English briefings describe a disclosed rescue, not Mirror Strategy combat', () => {
  assert.match(stage.characterArc.intro.fr, /Adaptation originale.*Déployez.*éligible.*escortée.*l’équipe/);
  assert.match(stage.characterArc.intro.en, /Original project adaptation.*companions’ protection/);
  assert.match(stage.characterArc.missions[0].fr, /équipe.*déployer.*lui-même/);
  assert.match(stage.characterArc.missions[0].en, /Saturnin’s companions/);
  for (const lang of ['fr', 'en']) {
    const prose = getStageLoreDescription({ stage, lang });
    assert.match(prose, /extraction/);
    assert.doesNotMatch(prose, /Strategie Miroir|Mirror Strategy|Le Nexus force|The Nexus forces|null|undefined|�/);
  }
});

test('the same Hub projector preserves the fields and character deployment rules of other arcs', () => {
  for (const arc of CHARACTER_NARRATIVE_ARCS.filter(item => item.stageId !== 10654)) {
    const projected = projectCharacterArcStage(arc);
    assert.equal(projected.id, arc.stageId);
    assert.equal(projected.name, arc.title.en);
    assert.equal(projected.displayName, arc.title);
    assert.equal(projected.characterArc, arc);
    assert.equal(projected.mode, arc.mode);
    assert.equal(projected.difficulty, arc.difficulty);
    assert.equal(projected.bossName, arc.bossName);
    assert.equal(projected.rewardItemId, arc.rewardItemId);
    assert.equal(projected.rewardItemName, arc.reward);
    assert.deepEqual([projected.goldPrize, projected.shardPrize, projected.tokenPrize], [150, 60, 2]);
    assert.deepEqual(projected.requiredTeam, {
      ...(arc.requiredTeam || { type: 'character', heroId: arc.heroId, allowAnchor: arc.allowAnchor === true }),
      arcId: arc.id
    });
    assert.equal(projected.universe, arc.heroId === 'player_anchor' ? 'Nexus de Convergence' : HEROES_DB.find(hero => hero.id === arc.heroId).universe);
  }
});

test('the actual tactics engine has one Saturnin NPC and cannot replace extraction with a rout', () => {
  const companion = heroDb.find(hero => hero.id === 'police_dog_saturnin');
  const threat = { id: 'escort-fixture-threat', name: 'Fixture threat', hp: 100, atk: 1, def: 1, spd: 1 };
  const noop = () => {};
  const engine = new EngineTactics(960, 540, [companion], { monsters: [threat], bosses: [], customRoster: [threat] }, { add: noop }, noop, noop, { ...stage, customBattle: { opponentControl: 'p2', singleRoster: true } });
  try {
    assert.equal(engine.escortUnit.id, 'saturnin_duck');
    assert.ok(engine.heroes.every(hero => hero.id !== 'saturnin_duck'));
    assert.equal(engine.escortUnit.identity.provisional, false);
    engine.enemies.forEach(enemy => { enemy.currentHp = 0; });
    engine.updateTacticsObjective();
    assert.equal(engine.gameOver, false);
    assert.equal(engine.escortUnit.extracted, false);
    engine.escortUnit.currentHp = 0;
    engine.updateTacticsObjective();
    assert.equal(engine.battleResult, 'defeat');
  } finally { engine.dispose(); }
});

test('projection and deployment evaluation leave the authored arc and caller context unchanged', () => {
  const arc = stage.characterArc;
  const arcSnapshot = structuredClone(arc);
  const input = context();
  const inputSnapshot = structuredClone(input);
  const projected = projectCharacterArcStage(arc);
  autoComposeMissionTeam(projected, input);
  evaluateMissionAccess(projected, input);
  assert.deepEqual(arc, arcSnapshot);
  assert.deepEqual(input, inputSnapshot);
  assert.notEqual(projected.requiredTeam, arc.requiredTeam);
});
