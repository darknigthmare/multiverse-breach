import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';
import { createPlayerHero } from '../src/game/playerHero.js';
import { getCharacterAnimationFrame } from '../src/game/combat/characterAnimationCatalog.js';

let vite;
let EngineFighter;
let EngineSmash;
let heroes;
let resolveCombatAbility;
let resolvePresentationScript;
let samplePresentationScript;
let sampleCatastropheMotion;
let getCatastropheBeamGeometry;
const noop = () => {};
const dummy = { id: 'dummy', name: 'Dummy', universe: 'Test', weaponType: 'melee', stats: { hp: 250, atk: 18, def: 8, spd: 7 }, simple: { name: 'Training strike', type: 'melee', dmg: 1 }, special: { name: 'Training technique', type: 'melee', dmg: 2 } };
const advance = (engine, seconds) => {
  for (let time = 0; time < seconds; time += 1 / 60) engine.update(1 / 60);
};
const makeEngine = (player, cpu = dummy) => {
  const engine = new EngineFighter(960, 540, [player], [cpu], { add: noop }, noop, noop, { opponentControl: 'p2' });
  engine.countdown = 0;
  return engine;
};
const find = id => {
  const hero = heroes.find(entry => entry.id === id);
  assert.ok(hero, id);
  return hero;
};

before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js?authored-basics'));
  ({ EngineSmash } = await vite.ssrLoadModule('/src/game/engineSmash.js?catastrophe-visual-review'));
  ({ HEROES_DB: heroes } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ resolveCombatAbility } = await vite.ssrLoadModule('/src/game/combatIdentity.js'));
  ({ resolvePresentationScript, samplePresentationScript, sampleCatastropheMotion, getCatastropheBeamGeometry } = await vite.ssrLoadModule('/src/game/combat/presentationCatalog.js'));
});
after(async () => { await vite?.close(); });

for (const side of ['player', 'cpu']) {
  test(`Fighter ${side} civilian light/heavy actions preserve support effects without damage`, () => {
    const civilian = find('hannah_28dl');
    const engine = side === 'player' ? makeEngine(civilian) : makeEngine(dummy, civilian);
    const caster = engine.getActive(side);
    const opponent = engine.getOpponent(side);
    caster.x = 420;
    opponent.x = 490;
    caster.meter = 100;
    const hp = opponent.currentHp;
    assert.equal(engine.triggerSideAction(side, 'light'), true);
    assert.equal(caster.action.identity.sourceAbility.slot, 'simple');
    assert.equal(caster.action.effect, 'buff');
    advance(engine, 0.7);
    assert.ok(caster.superBuffSeconds > 0);
    assert.equal(opponent.currentHp, hp);
    assert.equal(engine.stats[side].damage, 0);
    assert.equal(engine.triggerSideAction(side, 'heavy'), true);
    assert.equal(caster.action.identity.sourceAbility.slot, 'secondary');
    assert.equal(caster.action.effect, 'guard');
    advance(engine, 0.7);
    assert.ok(caster.superGuardSeconds > 0);
    assert.equal(opponent.currentHp, hp);
    assert.equal(engine.triggerSideAction(side, 'special'), false, 'heavy and charged secondary share their source cooldown');
    assert.equal(caster.meter, 100, 'a rejected command must not consume meter');
    advance(engine, 6.1);
    assert.equal(engine.triggerSideAction(side, 'special'), true);
    assert.equal(caster.action.effect, 'guard');
  });
}

test('authored simple firearms travel to their target and stop at the actual source range', () => {
  const shooter = find('hicks_aliens');
  const profile = resolveCombatAbility(shooter, 'simple');
  assert.equal(profile.delivery, 'projectile');
  for (const distance of [profile.range - 30, profile.range + 1]) {
    const engine = makeEngine(shooter);
    const attacker = engine.getActive('player');
    const target = engine.getActive('cpu');
    attacker.x = 200;
    target.x = attacker.x + distance;
    const hp = target.currentHp;
    assert.equal(engine.triggerPlayerAction('light'), true);
    advance(engine, 0.25);
    assert.equal(target.currentHp, hp, 'a distant target cannot receive instant melee damage');
    assert.equal(engine.projectiles.length, 1);
    advance(engine, 1.3);
    assert.equal(target.currentHp < hp, distance < profile.range);
    assert.equal(engine.projectiles.length, 0);
  }
});

test('continuous authored defense uses its actual reduction instead of the legacy universal block', () => {
  const civilian = find('hannah_28dl');
  const defense = resolveCombatAbility(civilian, 'defense');
  const damage = [];
  for (const guarding of [false, true]) {
    const engine = makeEngine(civilian);
    const defender = engine.getActive('player');
    const attacker = engine.getActive('cpu');
    defender.x = 420;
    attacker.x = 490;
    engine.setInput({ guard: guarding });
    engine.updateControlledSide('player', 1 / 60);
    const hp = defender.currentHp;
    engine.applyHit(attacker, defender, { type: 'light', base: 20, guardDamage: 5, knockback: 0 });
    damage.push(hp - defender.currentHp);
  }
  assert.ok(Math.abs(damage[1] / damage[0] - (1 - defense.guardReduce)) < 0.01);
});

test('native presentations take priority while legacy Naruto retains its explicit charge and release frames', () => {
  for (const id of ['goku_dbz', 'naruto_uzumaki_young']) {
    const actor = find(id);
    const script = resolvePresentationScript(actor, 'fatality');
    const charge = samplePresentationScript(script, script.duration * 0.3);
    const release = samplePresentationScript(script, script.duration * 0.7);
    const nativeCharge = getCharacterAnimationFrame(actor, { phase: 'fatality', progress: 0.3 });
    const nativeRelease = getCharacterAnimationFrame(actor, { phase: 'fatality', progress: 0.7 });
    assert.equal(charge.asset.row, nativeCharge?.row ?? 2);
    assert.equal(charge.asset.col, nativeCharge?.col ?? 2);
    assert.equal(release.asset.row, nativeRelease?.row ?? 2);
    assert.equal(release.asset.col, nativeRelease?.col ?? 3);
    if (nativeCharge) assert.equal(charge.asset.sheet, nativeCharge.asset.sheet);
    assert.equal(charge.asset.actorId, id);
    assert.equal(script.provenance.canonicalSequence, false);
    assert.deepEqual(samplePresentationScript(script, script.duration * 0.3), charge, 'sampling is deterministic');
  }
});

test('Player Anchor consumes its existing dedicated phase sheets, and support fallbacks never swing', () => {
  const anchor = createPlayerHero({ name: 'Test Anchor' });
  for (const [phase, row] of [['intro', 0], ['victory', 1], ['defeat', 2]]) {
    const script = resolvePresentationScript(anchor, phase);
    const sample = samplePresentationScript(script, 0.3);
    assert.equal(sample.asset.kind, 'melee-manifest');
    assert.equal(sample.asset.row, row);
    assert.equal(sample.asset.dedicatedPhaseAsset, true);
    assert.match(sample.asset.sheet, /m5-intro-outro/);
  }
  const healer = find('aerith_ff7');
  const script = resolvePresentationScript(healer, 'fatality');
  const sample = samplePresentationScript(script, 1.2);
  assert.equal(sample.effect.kind, 'gospel');
  assert.equal(sample.asset.kind, 'native-generated-character-animation');
  assert.equal(sample.asset.row, 4, 'Aerith must use her native blessing presentation');
  const rebecca = resolvePresentationScript(find('rebecca_chambers'), 'fatality');
  const rebeccaSample = samplePresentationScript(rebecca, 1.2);
  assert.equal(rebeccaSample.asset.kind, 'native-generated-character-animation');
  assert.equal(rebeccaSample.asset.row, 4, 'Rebecca must now use her native medical presentation');
  assert.equal(rebeccaSample.poseState, 'support');
  const fallback = { ...rebecca, actor: { ...dummy, id: 'support-fallback-without-native' } };
  assert.equal(samplePresentationScript(fallback, 1.2).poseState, 'idle', 'a healer without a native presentation must not substitute a weapon swing');
});

test('scripted finishers draw distinct action shapes and never change battle state', () => {
  const callsFor = id => {
    const actor = find(id);
    const engine = makeEngine(actor);
    const script = resolvePresentationScript(actor, 'fatality');
    const sample = samplePresentationScript(script, script.duration * 0.65);
    const calls = [];
    const ctx = new Proxy({}, {
      get(target, name) { return target[name] ?? ((...args) => calls.push([name, ...args])); },
      set(target, name, value) { target[name] = value; return true; }
    });
    ctx.globalAlpha = 1;
    const hp = engine.getActive('cpu').currentHp;
    engine.drawScriptedPresentationEffect(ctx, sample, { color: '#9bdcff' }, 480, 350, 1);
    assert.equal(engine.getActive('cpu').currentHp, hp);
    assert.equal(engine.stats.player.damage, 0);
    assert.equal(engine.finished, false);
    return calls;
  };
  const beam = callsFor('goku_dbz');
  const orb = callsFor('naruto_uzumaki_young');
  const sword = callsFor('cloud_ff7');
  assert.ok(beam.some(([method, , , width]) => method === 'fillRect' && width > 200));
  assert.ok(orb.filter(([method]) => method === 'ellipse').length >= 4);
  assert.equal(orb.some(([method]) => method === 'fillRect'), false);
  assert.ok(sword.some(([method]) => method === 'lineTo'));
  assert.equal(sword.some(([method]) => method === 'arc'), false);
});

const recordedCanvas = () => {
  const calls = [];
  const ctx = new Proxy({ globalAlpha: 1 }, {
    get(target, name) { return target[name] ?? ((...args) => calls.push([name, ...args])); },
    set(target, name, value) { target[name] = value; return true; }
  });
  return { ctx, calls };
};
const assertDescendingRay = (calls, facing) => {
  const segments = calls.flatMap((call, index) => call[0] === 'moveTo' && calls[index + 1]?.[0] === 'lineTo' ? [[call, calls[index + 1]]] : []);
  assert.ok(segments.length >= 2, 'the colored beam and its core have real line geometry');
  for (const [start, end] of segments) {
    assert.ok(end[2] > start[2] + 100, 'the cannon beam descends from the airborne muzzle to the ground');
    assert.ok((end[1] - start[1]) * facing > 200, 'the ray travels forward in either player direction');
  }
  assert.equal(calls.some(([method]) => method === 'fillRect'), false, 'Catastrophe does not use the old horizontal beam rectangle');
};

test('Barret Catastrophe holds an airborne firing position before landing, with mirrored downward ray geometry', () => {
  const script = resolvePresentationScript(find('barret_ff7'), 'fatality');
  const launch = samplePresentationScript(script, 0);
  const hover = samplePresentationScript(script, script.duration * 0.3);
  const fire = samplePresentationScript(script, script.duration * 0.65);
  const land = samplePresentationScript(script, script.duration);
  assert.equal(launch.y, 0);
  assert.ok(hover.y < -100);
  assert.equal(hover.y, fire.y, 'the cannon fires while Barret remains at hover height');
  assert.equal(hover.x, fire.x, 'Catastrophe does not reuse a forward melee dive');
  assert.equal(land.y, 0);
  assert.equal(script.provenance.canonicalSequence, false);
  const engine = makeEngine(find('barret_ff7'));
  for (const facing of [1, -1]) {
    const geometry = getCatastropheBeamGeometry({ x: 480, feetY: 350 + fire.y, groundY: 350, facing, reach: 320, progress: fire.progress });
    assert.equal(geometry.target.y, 344);
    const { ctx, calls } = recordedCanvas();
    engine.drawScriptedPresentationEffect(ctx, fire, { color: '#ffbf55' }, 480, 350 + fire.y, facing);
    assertDescendingRay(calls, facing);
  }
});

test('Barret super lifts the rendered body and fires downward at its real impact time without moving gameplay coordinates', () => {
  for (const side of ['player', 'cpu']) {
    const barret = find('barret_ff7');
    const engine = side === 'player' ? makeEngine(barret) : makeEngine(dummy, barret);
    const fighter = engine.getActive(side);
    fighter.meter = 100;
    assert.equal(engine.triggerSideAction(side, 'super'), true);
    fighter.action.elapsed = fighter.action.hitAt + 0.04;
    const before = JSON.stringify({ teams: engine.teams, stats: engine.stats, projectiles: engine.projectiles });
    const visual = engine.getCatastropheSuperVisual(fighter);
    assert.ok(visual.feetY < fighter.y - 70);
    assert.equal(visual.geometry.firing, true);
    assert.ok(Math.abs(sampleCatastropheMotion(fighter.action.hitAt / fighter.action.duration, fighter.action.hitAt / fighter.action.duration).progress - 0.5) < 1e-9);
    engine.drawArena = noop;
    engine.drawHud = noop;
    engine.drawAnnouncement = noop;
    engine.introPoseTimer = 0;
    const { ctx, calls } = recordedCanvas();
    engine.draw(ctx, engine.elapsed * 60);
    assertDescendingRay(calls.filter(([method]) => ['moveTo', 'lineTo'].includes(method)), fighter.action.facing);
    assert.ok(calls.some(([method, x, y]) => method === 'translate' && x === visual.x && y === visual.feetY), 'the sprite itself uses the airborne render coordinates');
    assert.equal(JSON.stringify({ teams: engine.teams, stats: engine.stats, projectiles: engine.projectiles }), before);
  }
});

test('Barret finale keeps its beam cosmetic after the match is confirmed and completes once', () => {
  const completed = [];
  const engine = new EngineFighter(960, 540, [find('barret_ff7')], [dummy], { add: noop }, noop, (...args) => completed.push(args), { opponentControl: 'p2', roundsToWin: 1 });
  engine.countdown = 0;
  engine.getActive('player').meter = 100;
  assert.equal(engine.triggerPlayerAction('super'), true);
  engine.endRound('victory');
  assert.equal(engine.getActive('player').action, null);
  assert.equal(engine.presentation.phase, 'fatality');
  engine.presentation.remaining = engine.presentation.duration * 0.35;
  const before = JSON.stringify({ teams: engine.teams, stats: engine.stats, projectiles: engine.projectiles, rounds: engine.roundHistory });
  const { ctx, calls } = recordedCanvas();
  engine.drawCharacterPresentation(ctx, engine.elapsed * 60);
  assertDescendingRay(calls.filter(([method]) => ['moveTo', 'lineTo'].includes(method)), 1);
  engine.drawCharacterPresentation(recordedCanvas().ctx, 999999);
  assert.equal(JSON.stringify({ teams: engine.teams, stats: engine.stats, projectiles: engine.projectiles, rounds: engine.roundHistory }), before);
  assert.equal(completed.length, 0);
  advance(engine, 10);
  assert.equal(completed.length, 1);
  assert.equal(engine.stats.player.damage, 0);
  assert.equal(engine.getActive('cpu').currentHp, engine.getActive('cpu').maxHp);
});

test('Leo heals another living ally and never himself through either command and either player side', () => {
  for (const side of ['player', 'cpu']) for (const command of ['heavy', 'super']) for (const withAlly of [false, true]) {
    const team = [find('leo_charmed'), ...(withAlly ? [{ ...dummy, id: 'living_ally' }] : [])];
    const engine = new EngineFighter(960, 540, side === 'player' ? team : [dummy], side === 'cpu' ? team : [dummy], { add: noop }, noop, noop, { opponentControl: 'p2' });
    engine.countdown = 0;
    const caster = engine.getActive(side);
    const ally = engine.getTeam(side).fighters[1];
    const enemy = engine.getOpponent(side);
    caster.currentHp = caster.maxHp * 0.1;
    caster.meter = 100;
    if (ally) ally.currentHp = ally.maxHp * 0.6;
    const before = { caster: caster.currentHp, ally: ally?.currentHp, enemy: enemy.currentHp };
    assert.equal(engine.triggerSideAction(side, command), true);
    assert.equal(caster.action.excludeSelf, true);
    advance(engine, 0.8);
    assert.equal(caster.currentHp, before.caster, `${side}/${command}: the wounded caster is excluded even when alone`);
    if (ally) assert.ok(ally.currentHp > before.ally, `${side}/${command}: an eligible ally receives the heal`);
    assert.equal(enemy.currentHp, before.enemy);
  }
});

test('Mei Zhen secondary commands buff living allies without damage and share a six-second cooldown for both sides', () => {
  for (const side of ['player', 'cpu']) for (const command of ['heavy', 'special']) {
    const team = [find('mei_zhen'), { ...dummy, id: 'ancestor_guided_ally' }];
    const engine = new EngineFighter(960, 540, side === 'player' ? team : [dummy], side === 'cpu' ? team : [dummy], { add: noop }, noop, noop, { opponentControl: 'p2' });
    engine.countdown = 0;
    const caster = engine.getActive(side);
    const ally = engine.getTeam(side).fighters[1];
    const enemy = engine.getOpponent(side);
    caster.x = 420;
    enemy.x = 490;
    caster.meter = 100;
    const hp = [caster.currentHp, ally.currentHp, enemy.currentHp];
    const alternate = command === 'heavy' ? 'special' : 'heavy';
    assert.equal(engine.triggerSideAction(side, command), true);
    assert.equal(caster.action.identity.name, 'Pas de l’Ancêtre');
    assert.equal(caster.action.identity.sourceAbility.slot, 'secondary');
    assert.equal(caster.action.effect, 'buff');
    assert.equal(caster.action.base, 0);
    assert.equal(caster.action.cooldown, 6);
    assert.equal(caster.abilityCooldowns.secondary, 6);
    advance(engine, 0.7);
    assert.equal(caster.action, null, 'the rejected alternate command must be blocked by cooldown rather than an unfinished animation');
    for (const member of [caster, ally]) {
      assert.ok(member.superBuffSeconds > 0);
      assert.equal(member.superBuffMultiplier, 1.12);
    }
    assert.deepEqual([caster.currentHp, ally.currentHp, enemy.currentHp], hp);
    assert.equal(engine.stats[side].damage, 0);
    assert.equal(engine.projectiles.length, 0);
    const meter = caster.meter;
    assert.equal(engine.triggerSideAction(side, alternate), false);
    assert.equal(caster.meter, meter, 'a shared-cooldown rejection cannot consume special meter');
    advance(engine, 4.9);
    assert.equal(engine.triggerSideAction(side, alternate), false, 'the source cooldown lasts six seconds');
    advance(engine, 0.6);
    assert.equal(engine.triggerSideAction(side, alternate), true);
    assert.equal(caster.action.effect, 'buff');
    assert.equal(caster.abilityCooldowns.secondary, 6);
    advance(engine, 0.7);
    assert.deepEqual([caster.currentHp, ally.currentHp, enemy.currentHp], hp);
    assert.equal(engine.stats[side].damage, 0);
    engine.dispose();
  }
});

test('Melee Barret renders an airborne body and a descending committed beam for P1 and P2 without physical mutation', () => {
  for (const side of ['player', 'cpu']) {
    const barret = find('barret_ff7');
    const opponents = side === 'player' ? [dummy] : [barret];
    const engine = new EngineSmash(960, 540, side === 'player' ? [barret] : [dummy], { monsters: opponents, bosses: [], customRoster: opponents }, { add: noop }, noop, noop,
      { universe: barret.universe, mode: 'Smash', disableHazards: true, customBattle: { opponentControl: 'p2', singleRoster: true } });
    engine.syncPreMatchFromServer(3000);
    const actor = side === 'player' ? engine.heroes[0] : engine.enemies[0];
    const target = side === 'player' ? engine.enemies[0] : engine.heroes[0];
    const facing = side === 'player' ? 1 : -1;
    actor.x = side === 'player' ? 250 : 650;
    actor.facing = facing;
    actor.specialCharge = 100;
    target.x = actor.x + facing * 230;
    [actor, target].forEach(unit => { unit.y = engine.groundY; unit.vx = 0; unit.vy = 0; unit.state = 'idle'; });
    assert.equal(engine.triggerMeleeAction(side, 'Special'), true);
    const action = actor.action;
    assert.equal(action.superProfile.sourceHeroId, 'barret_ff7');
    assert.equal(action.superProfile.delivery, 'beam');
    assert.equal(engine.getMeleeVisualActor(actor).y, actor.y, 'takeoff begins at the real feet position');
    action.elapsed = action.hitAt + 0.03;
    const hovered = engine.getMeleeVisualActor(actor);
    assert.notEqual(hovered, actor);
    assert.equal(hovered.y, actor.y - 64);
    assert.equal(hovered.x, actor.x);
    assert.equal(hovered.facing, facing);
    action.impactPoint = { x: target.x, y: target.y - 30 };
    const before = JSON.stringify({ heroes: engine.heroes, enemies: engine.enemies, projectiles: engine.projectiles });
    const { ctx, calls } = recordedCanvas();
    engine.drawMeleeSuper(ctx, actor);
    const startIndex = calls.findIndex(([method]) => method === 'moveTo');
    const start = calls[startIndex];
    const end = calls[startIndex + 1];
    assert.deepEqual(start, ['moveTo', hovered.x + facing * 12, hovered.y - 30]);
    assert.deepEqual(end, ['lineTo', target.x, target.y - 30]);
    assert.ok(end[2] - start[2] >= 64, 'the muzzle is above the real impact point');
    assert.ok((end[1] - start[1]) * facing > 200, 'the beam mirrors toward the committed facing');
    assert.equal(JSON.stringify({ heroes: engine.heroes, enemies: engine.enemies, projectiles: engine.projectiles }), before);

    // A nearby platform is still within the normal hurtbox test. Keeping its
    // recorded impact while lowering the muzzle used to turn the beam upward.
    target.y = actor.y - 35;
    assert.ok(engine.getMeleeSuperTargets(actor, action.superProfile, facing).includes(target));
    action.impactPoint = { x: target.x, y: target.y - 30 };
    const raised = recordedCanvas();
    engine.drawMeleeSuper(raised.ctx, actor);
    const raisedStartIndex = raised.calls.findIndex(([method]) => method === 'moveTo');
    assert.ok(raised.calls[raisedStartIndex + 1][2] > raised.calls[raisedStartIndex][2], 'the beam still descends to the elevated target during hover');
    for (const progress of [0.8, 0.95, 1]) {
      action.elapsed = action.duration * progress;
      const landingBefore = JSON.stringify({ actor, target });
      const landing = recordedCanvas();
      engine.drawMeleeSuper(landing.ctx, actor);
      assert.equal(landing.calls.some(([method]) => ['moveTo', 'lineTo', 'arc'].includes(method)), false, 'no beam or charge may persist into the landing, including its first frame');
      assert.equal(JSON.stringify({ actor, target }), landingBefore);
    }
    action.elapsed = action.duration;
    assert.equal(engine.getMeleeVisualActor(actor).y, actor.y, 'landing restores only the visual offset');
    actor.action = null;
    assert.equal(engine.getMeleeVisualActor(actor), actor, 'an interrupted super cannot leave the visual actor floating');
    const cancelled = recordedCanvas();
    engine.drawMeleeSuper(cancelled.ctx, actor);
    assert.equal(cancelled.calls.length, 0);
    engine.dispose?.();
  }
});
