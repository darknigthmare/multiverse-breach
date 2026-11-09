import assert from 'node:assert/strict';
import test from 'node:test';
import { createPredator1987SourceSceneStage, createPredator2SourceSceneStage } from '../DLC/Predator/data/sourceSceneStages.js';
import { createSourceSceneStages as createPreySourceSceneStage } from '../DLC/Prey/data/sourceSceneStages.js';
import { SOURCE_SCENE_STAGES, resolveSourceScene } from '../src/game/sourceSceneStages.js';

const factories = [
  [createPredator1987SourceSceneStage, 50104, 'Predator', 'dutch'],
  [createPredator2SourceSceneStage, 50105, 'Predator', 'harrigan_predator'],
  [createPreySourceSceneStage, 50106, 'Prey', 'naru_prey']
];
const builders = {
  base: (id, sourceSceneId, universe, heroId) => ({ id, sourceSceneId, universe, requiredTeam: { heroId }, injectedBase: true }),
  command: (id, x, y, fr, en, requires = [], extra = {}) => ({ id, cell: { x, y }, requires, ...extra, injectedCommand: true }),
  commonAdaptation: { fr: 'FR shared adaptation.', en: 'EN shared adaptation.' }
};

for (const [factory, id, universe, heroId] of factories) {
  test(`${id}: DLC factory composes shared builders and keeps the exact legacy actor`, () => {
    const stage = factory(builders);
    assert.deepEqual([stage.id, stage.universe, stage.requiredTeam.heroId], [id, universe, heroId]);
    assert.deepEqual(stage.sceneLead, { id: heroId, universe });
    assert.equal(stage.injectedBase, true);
    assert.ok(stage.commands.length > 0 && stage.commands.every(command => command.injectedCommand));
    for (const language of ['fr', 'en']) assert.ok(stage.briefing[language].adaptation.startsWith(builders.commonAdaptation[language]));
    const second = factory(builders);
    stage.field.props[0].label = 'changed only in this invocation';
    stage.commands[0].requires.push('changed-only-here');
    assert.notEqual(second.field.props[0].label, stage.field.props[0].label);
    assert.deepEqual(second.commands[0].requires, []);
  });
}

test('the aggregate exposes six distinct native source scenes without replacing the three existing DLC identities', () => {
  assert.deepEqual(SOURCE_SCENE_STAGES.map(stage => [stage.id, stage.universe, stage.sceneLead.id]), [
    [50101, 'Aliens', 'ripley_aliens'], [50102, 'Alien', 'ripley'], [50103, 'Half-Life', 'freeman'],
    [50104, 'Predator', 'dutch'], [50105, 'Predator', 'harrigan_predator'], [50106, 'Prey', 'naru_prey']
  ]);
  for (const stage of SOURCE_SCENE_STAGES) {
    assert.equal(resolveSourceScene(stage), stage);
    assert.equal(stage.visualReviewStatus, 'pending');
    assert.equal(resolveSourceScene({ ...stage, customBattle: true }), null);
  }
});
