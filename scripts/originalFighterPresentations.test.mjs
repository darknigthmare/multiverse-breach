import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';

const leads = {
  neris_vale: ['Nom véritable', 'mnemonic-sonar'],
  kael_venn: ['Remboursement total', 'refunded-seconds'],
  eira_solenne: ['Lumière partagée', 'shared-photosphere'],
  nyra_vale: ['Accès Racine Nadir', 'nadir-lattice']
};
let vite, EngineFighter, HEROES_DB, PRESENTATION_PHASES, samplePresentationScript, resolveOriginalFighterPresentation;
const noop = () => {};
const hero = id => HEROES_DB.find(actor => actor.id === id);
const advance = (engine, seconds) => {
  for (let frames = 0; frames < Math.ceil(seconds * 60); frames++) engine.update(1 / 60);
};
const duel = (left, right, onComplete = noop) => new EngineFighter(
  1040, 520, [hero(left)], [hero(right)], { add: noop }, noop, onComplete, { opponentControl: 'p2' }
);

before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js'));
  ({ HEROES_DB } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ PRESENTATION_PHASES, samplePresentationScript } = await vite.ssrLoadModule('/src/game/combat/presentationCatalog.js'));
  ({ resolveOriginalFighterPresentation } = await vite.ssrLoadModule('/src/game/combat/originalFighterPresentations.js'));
});
after(async () => { await vite?.close(); });

for (const [id, [finale, effect]] of Object.entries(leads)) {
  test(`${id} has seven duel scripts tied to the inspected body and real original concept`, () => {
    const actor = hero(id);
    for (const phase of PRESENTATION_PHASES) {
      const script = resolveOriginalFighterPresentation(actor, phase);
      assert.equal(script.heroId, id);
      assert.equal(script.phase, phase);
      assert.equal(script.provenance.dedicatedPhaseArtwork, false);
      for (const beat of script.beats) {
        const sample = samplePresentationScript(script, beat.at * script.duration + 1e-6);
        assert.equal(sample.asset.sheet, script.sourceAsset.sheet);
        assert.equal(sample.asset.actorId, id);
        assert.equal(sample.poseState, beat.state);
        assert.equal(sample.asset.row, { idle: 0, run: 1, attack: 2, hit: 3 }[beat.state]);
        assert.equal(sample.asset.col, beat.frame);
      }
    }
    const final = resolveOriginalFighterPresentation(actor, 'fatality');
    assert.equal(final.name, finale);
    assert.equal(final.effect.kind, effect);
    for (const replacement of [
      { id: `${actor.id}_variant`, sourceHeroId: actor.id }, { universe: 'Nexus de Convergence' },
      { originalContent: false }, { weaponType: 'unapproved' }, { sourceId: 'different' },
      { sourceHeroId: 'different' }, actor.contentPackId ? { contentPackId: 'different' } : { sourceType: 'different' }
    ]) assert.equal(resolveOriginalFighterPresentation({ ...actor, ...replacement }, 'intro'), null);
  });
}

test('original duel goes from intro to first round, final loss and KO outro without extra contacts or rewards', () => {
  const completed = [];
  const engine = duel('neris_vale', 'kael_venn', (...args) => completed.push(args));
  const snapshot = () => engine.getSnapshot();
  const scene = () => snapshot().presentation;
  const player = () => engine.getActive('player');
  const cpu = () => engine.getActive('cpu');
  const knockOutPlayer = () => {
    player().currentHp = 1;
    engine.applyHit(cpu(), player(), { type: 'heavy', base: 999, guardDamage: 20, knockback: 200 });
    advance(engine, 1.05);
  };
  const nextScene = () => advance(engine, scene().remaining + .02);

  assert.deepEqual(scene().entries.map(entry => entry.script.name), ['Relevé de la carte abyssale', 'Kael arrive entre deux secondes']);
  assert.equal(engine.triggerSideAction('cpu', 'light'), false);
  assert.equal(engine.timer, 99);
  advance(engine, 5.1);
  knockOutPlayer();
  assert.equal(scene().phase, 'roundResult');
  assert.deepEqual(scene().entries.map(entry => entry.actorPhase), ['roundDefeat', 'roundVictory']);
  assert.equal(completed.length, 0);
  assert.deepEqual(engine.getSummary().rewards, { gold: 0, shards: 0, seasonXp: 0 });
  nextScene();
  assert.equal(snapshot().roundNumber, 2);
  assert.equal(player().currentHp, player().maxHp);
  advance(engine, 3.3);
  knockOutPlayer();
  assert.equal(scene().phase, 'fatality');
  assert.equal(scene().entries[0].script.name, 'Remboursement total');
  assert.equal(scene().entries[0].identity.name, 'Remboursement total');
  assert.equal(scene().entries[0].identity.description, 'Méridien Creux');
  assert.equal(scene().entries[0].side, 'cpu');
  const matchDamage = engine.stats.cpu.damage;
  nextScene();
  assert.equal(scene().phase, 'victory');
  assert.deepEqual(scene().entries.map(entry => entry.actorPhase), ['defeat', 'victory']);
  nextScene();
  assert.equal(scene().phase, 'outro');
  assert.equal(scene().entries[0].script.sample.progress, 1);
  assert.equal(scene().entries[0].script.sample.asset.row, 3);
  assert.equal(scene().entries[0].script.sample.asset.col, 2);
  assert.equal(scene().entries[1].actorPhase, 'outro');
  assert.equal(player().currentHp, 0);
  assert.equal(engine.stats.cpu.damage, matchDamage);
  assert.equal(engine.projectiles.length, 0);
  nextScene();
  advance(engine, 2);
  assert.equal(completed.length, 1);
  engine.dispose();
  assert.equal(scene(), null);
});

test('the real draw entry point honors reduced motion for original overlays and keeps the actor captions', () => {
  const engine = duel('eira_solenne', 'nyra_vale');
  advance(engine, 1.46);
  const draw = reducedMotion => {
    const strokes = [];
    const labels = [];
    const ctx = new Proxy({
      globalAlpha: 1,
      stroke() { strokes.push(this.strokeStyle); },
      fillText(text) { labels.push(text); },
      createLinearGradient() { return { addColorStop: noop }; },
      createRadialGradient() { return { addColorStop: noop }; }
    }, { get(target, key) { return target[key] ?? noop; } });
    engine.draw(ctx, 60, { reducedMotion });
    return { labels, strokes };
  };
  const normal = draw(false);
  const reduced = draw(true);
  assert.ok(normal.strokes.includes('#b1e2a0'));
  assert.ok(normal.strokes.includes('#ff57db'));
  assert.ok(!reduced.strokes.includes('#b1e2a0'));
  assert.ok(!reduced.strokes.includes('#ff57db'));
  assert.deepEqual(reduced.labels, normal.labels);
  assert.ok(normal.labels.includes('Eira veille sur la photosphère'));
  assert.ok(normal.labels.includes('Nyra ouvre une liaison Ghostline'));
  engine.dispose();
});
