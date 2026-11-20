import assert from 'node:assert/strict';
import { register } from 'node:module';
import test from 'node:test';
import { getHeroById } from '../src/game/heroes.js';

register('./sourceSceneTestLoader.mjs', import.meta.url);
const { EngineFighter } = await import('../src/game/engineFighter.js');
const { samplePresentationScript, PRESENTATION_PHASES } = await import('../src/game/combat/presentationCatalog.js');
const { resolveHistoricalIconicP0DuelPresentation } = await import('../src/game/combat/historicalIconicP0DuelPresentations.js');
const { getHeroSpriteSheetSources, getSpriteSheetLayout } = await import('../src/game/spriteAssets.js');

const actors = ['lilo_pelekai', 'jack_sparrow_potc', 'roger_rabbit'].map(getHeroById);
const dummy = { id: 'training', name: 'Training', universe: 'Test', weaponType: 'melee',
  stats: { hp: 250, atk: 18, def: 8, spd: 7 }, simple: { name: 'Training strike', type: 'melee', dmg: 1 } };
const observe = (player, opponent) => {
  const particles = [];
  const completions = [];
  const engine = new EngineFighter(960, 540, [player], [opponent], { add: (...args) => particles.push(args) },
    () => {}, result => completions.push(result), { opponentControl: 'p2' });
  return { engine, particles, completions };
};
const until = (engine, condition, description) => {
  for (let i = 0; i < 800 && !condition(); i++) engine.update(1 / 60);
  assert.ok(condition(), description);
};

for (const actor of actors) {
  test(`${actor.id} uses only its inspected cells through seven phases and holds a safe pose with reduced motion`, () => {
    const names = new Set();
    for (const phase of PRESENTATION_PHASES) {
      const script = resolveHistoricalIconicP0DuelPresentation({ ...actor, runtimeId: `cpu-0-${actor.id}` }, phase);
      assert.ok(script, phase);
      assert.equal(script.provenance.dedicatedPhaseArtwork, false);
      assert.equal(script.provenance.fullSource1to1Verified, false);
      assert.equal(script.sourceAsset.baseline, 244);
      const layout = getSpriteSheetLayout(script.sourceAsset.sheet);
      assert.equal(script.nameLocalized.fr, script.name);
      assert.notEqual(script.nameLocalized.en, script.name);
      names.add(script.name);
      for (const beat of script.beats) {
        const sample = samplePresentationScript(script, (beat.at + 1e-6) * script.duration);
        assert.equal(sample.asset.sheet, script.sourceAsset.sheet);
        assert.equal(sample.asset.kind, 'reviewed-legacy-cell');
        assert.equal(sample.asset.row, layout.rowByState[beat.state]);
        assert.equal(sample.asset.col, layout.columnsByRow[sample.asset.row][beat.frame]);
        assert.deepEqual(sample.asset.trim, layout.trimByRow?.[sample.asset.row] || null);
      }
      const reduced = time => samplePresentationScript(script, time, { reducedMotion: true });
      assert.deepEqual(reduced(0), reduced(4));
      assert.equal(reduced(1).x, 0);
      assert.equal(reduced(1).y, 0);
      assert.equal(reduced(1).opacity, 1);
      assert.equal(reduced(1).effect.active, false);
    }
    assert.equal(names.size, 7);
  });
}

test('the exact incarnation, props and source namespace gate the reviewed Duel presentations', () => {
  for (const actor of actors) {
    for (const altered of [{ ...actor, incarnation: 'Another version' }, { ...actor, universe: 'Other universe' },
      { ...actor, sourceHeroId: actor.id, sourceId: 'other-source' }, { ...actor, equipment: [] }]) {
      assert.equal(resolveHistoricalIconicP0DuelPresentation(altered, 'intro'), null);
    }
    assert.equal(resolveHistoricalIconicP0DuelPresentation(actor, 'unlisted'), null);
  }
  assert.equal(resolveHistoricalIconicP0DuelPresentation(getHeroById('stitch_626'), 'intro'), null);
});

test('the real two-round Duel progresses from intro and input-locked round poses to the cosmetic finale', () => {
  const [lilo, , roger] = actors;
  const { engine, completions } = observe(lilo, roger);
  try {
    const snapshot = () => engine.getSnapshot();
    assert.equal(snapshot().phase, 'intro');
    assert.equal(engine.triggerSideAction('player', 'light'), false);
    assert.deepEqual(snapshot().presentation.entries.map(entry => [entry.fighterId, entry.script?.provenance.kind]),
      [[lilo.id, 'historical-iconic-duel-presentation'], [roger.id, 'historical-iconic-duel-presentation']]);
    let hitCount = 0;
    for (let round = 1; round <= 2; round++) {
      until(engine, () => snapshot().phase === 'running', `round ${round} is playable`);
      const actor = engine.getActive('player');
      const target = engine.getActive('cpu');
      actor.x = 260;
      target.x = 456;
      target.currentHp = 1;
      assert.equal(engine.triggerSideAction('player', 'light'), true);
      assert.equal(actor.action.identity.name, 'Camera Flash Distraction');
      until(engine, () => engine.roundHistory.length === round, `round ${round} ends by input`);
      assert.equal(target.currentHp, 0);
      hitCount++;
      if (round === 1) {
        assert.equal(snapshot().phase, 'roundResult');
        assert.deepEqual(snapshot().presentation.entries.map(entry => [entry.actorPhase, entry.script.name]),
          [['roundVictory', 'Lilo reprend confiance'], ['roundDefeat', 'Roger se redresse']]);
        assert.equal(engine.triggerSideAction('cpu', 'heavy'), false);
      }
    }
    assert.equal(hitCount, 2);
    assert.deepEqual(engine.roundWins, { player: 2, cpu: 0 });
    assert.equal(snapshot().phase, 'fatality');
    const finale = engine.presentation.entries[0].script;
    assert.equal(samplePresentationScript(finale, finale.duration * .5).effect.kind, 'iconic-camera-shutter');
    until(engine, () => snapshot().phase === 'victory', 'finale reaches victory');
    assert.deepEqual(snapshot().presentation.entries.map(entry => entry.actorPhase), ['victory', 'defeat']);
    until(engine, () => snapshot().phase === 'outro', 'victory reaches outro');
    assert.deepEqual(snapshot().presentation.entries.map(entry => entry.actorPhase), ['outro', 'defeat']);
    until(engine, () => completions.length === 1, 'normal completion reports once');
    for (let step = 0; step < 90; step++) engine.update(1 / 60);
    assert.deepEqual(completions, ['victory']);
    assert.equal(engine.getActive('cpu').currentHp, 0);
  } finally { engine.dispose(); }
});

for (const [side, command, name] of [['player', 'light', 'Experiment 626 Claw Swipe'], ['cpu', 'heavy', 'Alien Strength Pounce']]) {
  test(`Duel ${side} uses Stitch’s ${name} only at an accepted physical impact`, () => {
    const source = getHeroById('stitch_626');
    for (const distance of [64, 84]) {
      const { engine, particles } = side === 'player' ? observe(source, dummy) : observe(dummy, source);
      try {
        engine.countdown = 0;
        const actor = engine.getActive(side);
        const target = engine.getOpponent(side);
        actor.x = side === 'player' ? 220 : 740;
        target.x = actor.x + (side === 'player' ? distance : -distance);
        const oldHp = target.currentHp;
        assert.deepEqual(getHeroSpriteSheetSources(actor, 'melee'), []);
        assert.equal(engine.triggerSideAction(side, command), true);
        assert.equal(actor.action.identity?.name, name);
        assert.equal(actor.action.delivery, 'melee');
        assert.equal(actor.action.range, 70);
        assert.equal(actor.action.canonSourceAbility, true);
        assert.equal(engine.getSnapshot().presentation, null);
        const hitAt = actor.action.hitAt;
        for (let step = 0; step < Math.floor(hitAt * 30); step++) engine.update(1 / 60);
        assert.equal(target.currentHp, oldHp);
        assert.equal(particles.length, 0);
        until(engine, () => !actor.action, 'action fully resolves');
        assert.equal(target.currentHp < oldHp, distance === 64);
        assert.equal(particles.filter(row => row[7] === 'spark' && row[2] === 0 && row[3] === 0).length, Number(distance === 64));
        assert.equal(engine.projectiles.length, 0);
        assert.equal(particles.some(row => row[7] === 'laser_line'), false);
      } finally { engine.dispose(); }
    }
  });
}
