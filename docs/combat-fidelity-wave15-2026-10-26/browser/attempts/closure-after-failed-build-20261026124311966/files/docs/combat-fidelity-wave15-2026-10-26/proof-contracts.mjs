// Pure expectations bound to the frozen cohort and actual production profiles.
// A proof's own counters are never used as its expected coverage.
import assert from 'node:assert/strict';
import { HEROES_DB } from '../../src/game/heroes.js';
import { resolveCombatAbility, resolveUniverseSummon } from '../../src/game/combatIdentity.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE15 } from '../../src/game/combat/combatSourceDefinitionsWave15.js';
import { expected, json, prefix, sorted } from './closure-support.mjs';

export const rpgPairs = Object.freeze([
  ['hexen_parias', 'hexen_baratus'], ['quake_franchise_bitterman', 'quake_franchise_ranger'],
  ['medievil_kiya', 'sir_daniel_fortesque'], ['blaze_sor', 'axel_sor'],
  ['vortigaunt_ally', 'dog_hl2'], ['zach_hammond', 'kendra_daniels']
]);

export function proofExpectations() {
  const plan = json(prefix + 'batch-plan-before.json');
  const ids = Object.values(plan.parts).flat();
  assert.equal(ids.length, expected.characters); assert.equal(new Set(ids).size, expected.characters);
  for (const group of Object.values(plan.parts)) assert.equal(group.length, expected.charactersPerAgent);
  assert.deepEqual(sorted(Object.keys(COMBAT_SOURCE_DEFINITIONS_WAVE15)), sorted(ids));
  const roster = new Map(HEROES_DB.map(hero => [hero.id, hero]));
  const projectileIds = ids.filter(id => {
    const source = COMBAT_SOURCE_DEFINITIONS_WAVE15[id], action = resolveCombatAbility(roster.get(id), 'special');
    assert.equal(action.effect, source.effect, id); assert.equal(action.delivery, source.delivery, id);
    return action.effect === 'damage' && action.delivery === 'projectile';
  });
  const rpg = rpgPairs.map(([caller, performer]) => {
    assert.ok(ids.includes(caller), caller + ': proof caller must be in W15');
    const entity = resolveUniverseSummon(roster.get(caller));
    assert.equal(entity.kind, 'reinforcement'); assert.equal(entity.performer.id, performer, caller);
    assert.equal(entity.universe, roster.get(caller).universe);
    assert.equal(entity.performer.universe, entity.universe); assert.notEqual(caller, performer);
    return { caller, performer, effect: entity.action.rpgProfile?.effect || entity.action.targeting?.effect };
  });
  assert.equal(rpg.filter(row => row.effect === 'damage').length, 5);
  assert.equal(rpg.filter(row => row.effect === 'buff').length, 1);
  return { ids, projectileIds, engineFixtures: ids.length * 6, tacticsFixtures: ids.length * 2,
    projectileFlights: projectileIds.length * 2, rpg,
    rpgFlows: rpg.length * 2, rpgOffense: 10, rpgBuff: 2, rpgGuard: 0, rpgSupport: 2 };
}

export function assertRpgRows(rows, expectations, { gameCanvas = false } = {}) {
  assert.equal(rows.length, expectations.rpgFlows);
  const keys = rows.map(row => {
    const identity = gameCanvas ? row.identity : row;
    const pair = expectations.rpg.find(pair => pair.caller === identity.caller);
    assert.ok(pair, 'Unexpected RPG caller: ' + identity.caller);
    assert.equal(gameCanvas ? identity.performerHeroId : identity.partner, pair.performer);
    assert.equal(identity.effect, pair.effect); assert.ok(['player', 'enemy'].includes(identity.side));
    return identity.caller + ':' + identity.side;
  });
  assert.deepEqual(sorted(keys), sorted(expectations.rpg.flatMap(pair => ['player', 'enemy'].map(side => pair.caller + ':' + side))));
}

export function assertNativeFixtureRows(value, expectations) {
  const keys = value.results.map(row => `${row.id}:${row.mode}:${row.side}`);
  assert.deepEqual(sorted(keys), sorted(expectations.ids.flatMap(id => ['rpg', 'melee', 'fighter']
    .flatMap(mode => ['player', 'opponent'].map(side => `${id}:${mode}:${side}`)))));
  const tactics = value.tacticsCases.map(row => `${row.id}:${row.side}`);
  assert.deepEqual(sorted(tactics), sorted(expectations.ids.flatMap(id => ['player', 'opponent'].map(side => `${id}:${side}`))));
  const projectiles = value.projectileCases.map(row => `${row.id}:${row.side}`);
  assert.deepEqual(sorted(projectiles), sorted(expectations.projectileIds.flatMap(id => ['player', 'opponent'].map(side => `${id}:${side}`))));
  let feedbackCases=0;
  for(const row of value.results){
    const expectedFeedback=expectations.projectileIds.includes(row.id)&&['rpg','melee'].includes(row.mode);
    if(!expectedFeedback){assert.equal(row.preReleaseFeedback,null);continue;}
    const feedback=row.preReleaseFeedback;assert.ok(feedback);
    assert.equal(feedback.feedbackCommands,0);assert.equal(feedback.renderReadOnly,true);
    assert.ok(Number.isFinite(feedback.elapsed)&&feedback.elapsed>=0&&Number.isFinite(feedback.hitAt)&&feedback.elapsed<feedback.hitAt);
    if(row.bodyKind==='native32')assert.equal(feedback.nativeColumn,1);
    else{assert.equal(row.bodyKind,'legacy-fallback');assert.equal(feedback.nativeColumn,null);}
    feedbackCases++;
  }
  assert.equal(feedbackCases,expectations.projectileIds.length*4);
}

export function assertRpgControlSupportRows(value) {
  assert.equal(value.actualGameCanvasFlows,6);assert.equal(value.controlFlows,4);assert.equal(value.healingBurstFlows,2);assert.equal(value.rows.length,6);
  const cases=[['borderlands_2_maya_phaselock','special','control',2.4],['borderlands_2_maya_phaselock','secondary','control',1.2],['evolve_val','special','heal',0]];
  assert.deepEqual(sorted(value.rows.map(row=>`${row.item.heroId}:${row.item.slot}:${row.item.side}`)),
    sorted(cases.flatMap(([id,slot])=>['player','enemy'].map(side=>`${id}:${slot}:${side}`))));
  for(const row of value.rows){
    const [id,slot,kind,duration]=cases.find(([id,slot])=>id===row.item.heroId&&slot===row.item.slot);
    assert.equal(row.configured.actor.id,id);assert.equal(row.item.kind,kind);assert.equal(row.item.duration,duration);
    assert.equal(row.preview.effect,kind);assert.equal(row.preview.range,kind==='control'?480:220);
    assert.equal(row.preview.valid,true);assert.deepEqual([row.preview.atb,row.preview.charge,row.preview.cooldown],[100,100,0]);
    assert.equal(row.pauseStable,true);assert.equal(row.renderReadOnly,true);assert.equal(row.events.length,1);assert.equal(row.events[0].effect,kind);
    assert.equal(row.bodyEvidence.realPngDraw,true);
    if(value.finalProductionFreezeClaimed){
      const native=slot==='special',part=id==='evolve_val'?'C':'B';
      const registry=json(`src/game/combat/${native?'characterAnimations':'characterSpriteCorrections'}Wave15Part${part}.generated.json`);
      const asset=registry.entries.find(entry=>entry.heroId===id);assert.ok(asset,id);
      assert.equal(row.bodyEvidence.actorSheet,asset.sheet);assert.equal(row.bodyEvidence.kind,native?'native32':'base16');
      assert.equal(row.bodyEvidence.sourceCell.length,4);const [sx,sy,sw,sh]=row.bodyEvidence.sourceCell;
      assert.equal(sw,asset.frameWidth);assert.equal(sh,asset.frameHeight);assert.equal(sx%sw,0);assert.equal(sy%sh,0);
      assert.ok(sx>=0&&sx<asset.width&&sy>=0&&sy<asset.height);
      if(native){assert.equal(sx,asset.frameWidth*2);assert.equal(sy,asset.phases.super.row*asset.frameHeight);}
    }
    assert.equal(row.atImpact.atb,0);assert.equal(row.atImpact.charge,slot==='special'?0:100);
    if(slot==='secondary')assert.ok(row.atImpact.cooldown>0&&row.atImpact.cooldown<=480);
    assert.deepEqual(row.atImpact.targets.map(unit=>unit.hp),row.enemyHp);assert.deepEqual(row.settled.targets,row.enemyHp);
    assert.deepEqual(row.settled.allies,row.atImpact.allies.map(unit=>unit.hp),'A settled effect must not replay');
    if(kind==='control'){
      assert.equal(row.preview.targets.length,1);assert.ok(row.preview.estimates.every(estimate=>estimate.amount===0));
      assert.ok(row.atImpact.targets[0].controlTicks>0&&row.atImpact.targets[0].controlTicks<=duration*60);
      assert.equal(row.controlExpired,true);assert.deepEqual(row.atImpact.allies.map(unit=>unit.hp),row.allyHp);
      assert.ok(row.atImpact.allies.every(unit=>unit.guard===0&&unit.buff===0));
    }else{
      assert.deepEqual(row.configured.allies.map(unit=>unit.id),['evolve_val','evolve_markov','evolve_maggie']);
      assert.equal(row.preview.targets.length,2);
      assert.ok(row.atImpact.allies[0].hp>row.allyHp[0]);assert.ok(row.atImpact.allies[1].hp>row.allyHp[1]);assert.equal(row.atImpact.allies[2].hp,row.allyHp[2]);
      const distance=unit=>Math.hypot(unit.x-row.configured.actor.x,unit.y-row.configured.actor.y);
      assert.ok(distance(row.configured.allies[1])<=220);assert.ok(distance(row.configured.allies[2])>220);
    }
  }
  assert.equal(value.artifacts.filter(row=>row.path.endsWith('.png')).length,12);
}
