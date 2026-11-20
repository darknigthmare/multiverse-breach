import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';

const leads = {
  neris_vale: ['Nom véritable', 'mnemonic-sonar'],
  kael_venn: ['Remboursement total', 'refunded-seconds'],
  eira_solenne: ['Lumière partagée', 'shared-photosphere'],
  nyra_vale: ['Accès Racine Nadir', 'nadir-lattice'],
  thaleia_naxos: ['Chemin hors du Labyrinthe', 'labyrinth-thread'],
  rei_kagetsu: ['Calendrier des Cent Esprits', 'ofuda-calendar'],
  lin_yue: ['Carte des Neuf Cieux', 'nine-heavens-chart'],
  seyra_tal: ['Résonance des Cinq Peuples', 'five-mass-concordance'],
  eira_hrafnsdottir: ['Dernière Ligne de Midgard', 'midgard-shield-line'],
  lyra_hexwind: ['Sept Lois, Une Exception', 'seven-laws-circuit'],
  mercy_ash: ['Amnistie des Sans-Contrat', 'amnesty-chain'],
  elise_varenne: ['Quatre Capitales, Un Signal', 'four-capitals-signal'],
  elara_voss: ['Mutinerie des Cieux', 'sky-mutiny'],
  bram_quill: ['Théorème d’Éther Libre', 'free-aether'],
  merek_flint: ['Surcharge de la Grande Chaudière', 'boiler-overload'],
  seraphine_meridius: ['Treizième Coup', 'thirteenth-chime'],
  lio_ferrante: ['Réglage du Monde', 'world-adjustment'],
  brother_ors: ['Dernière Sonnerie', 'last-peal'],
  mara_veylan: ['Ordre Zéro Radio', 'radio-order-zero'],
  anton_rook: ['Déraillement Contrôlé', 'controlled-derailment'],
  ilya_cross: ['Ciel sans Drapeau', 'flagless-sky'],
  ysara_flint: ['Tous Pavillons Abattus', 'fallen-flags'],
  milo_quill: ['Mer Réécrite à l’Encre', 'ink-sea'],
  brann_crow: ['Révolte du Pont Inférieur', 'lower-deck-revolt'],
  mara_ell: ['Traduction sans Soumission', 'unbowed-translation'],
  jonas_mire: ['Lumière jusqu’au Fond', 'greywake-beacon'],
  oona_vell: ['Carte du Rivage qui n’Existe Pas', 'absent-shore'],
  aelwen_starbough: ['Pluie sur les Sept Royaumes', 'seven-kingdoms-rain'],
  brokk_embervein: ['Enclume des Sept Serments', 'seven-oaths-anvil'],
  goruk_ash_tusk: ['Aucun Peuple ne Sera l’Ennemi', 'free-clans']
};
let vite, EngineFighter, HEROES_DB, PRESENTATION_PHASES, samplePresentationScript, resolveOriginalFighterPresentation;
let resolvePresentationScript, getHeroSpriteSheetSrc, drawPixelSprite;
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
  ({ PRESENTATION_PHASES, resolvePresentationScript, samplePresentationScript } = await vite.ssrLoadModule('/src/game/combat/presentationCatalog.js'));
  ({ resolveOriginalFighterPresentation } = await vite.ssrLoadModule('/src/game/combat/originalFighterPresentations.js'));
  ({ getHeroSpriteSheetSrc } = await vite.ssrLoadModule('/src/game/spriteAssets.js'));
  ({ drawPixelSprite } = await vite.ssrLoadModule('/src/game/renderer.js'));
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
      assert.equal(script.nameLocalized.fr, script.name);
      assert.ok(script.nameLocalized.en.length > 0);
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

function withImageTrace(draw, unavailable = new Set()) {
  const prior = globalThis.Image;
  class FixtureImage {
    complete = true;
    naturalWidth = 1024;
    naturalHeight = 1024;
    set src(path) {
      this.currentSrc = new URL(path, 'https://fixture.invalid').href;
      if (unavailable.has(path)) {
        this.naturalWidth = 0;
        this.onerror?.();
      }
    }
    get src() { return this.currentSrc; }
  }
  globalThis.Image = FixtureImage;
  const operations = [];
  let x = 0, flip = 1;
  const ctx = new Proxy({ globalAlpha: 1,
    translate(value) { x = value; },
    scale(value) { flip = Math.sign(value); },
    drawImage(image, ...args) { operations.push([new URL(image.src).pathname, ...args, { x, flip }]); }
  }, { get(target, key) { return target[key] ?? noop; } });
  try { draw(ctx); } finally { globalThis.Image = prior; }
  return operations;
}

test('a presentation crops the assigned body sheet and grid only', () => {
  const actor = hero('thaleia_naxos');
  const source = getHeroSpriteSheetSrc(actor, 'melee');
  const other = getHeroSpriteSheetSrc(hero('rei_kagetsu'), 'melee');
  const crop = (sheet, rows) => withImageTrace(ctx => drawPixelSprite(ctx, 100, 150, {
    ...actor, state: 'run', stateElapsed: 0, presentationFrame: { sheet, columns: 4, rows, row: 3, col: 2 }
  }, 0, 1, 96, 'melee'))[0].slice(0, 5);
  assert.deepEqual(crop(source, 4), [source, 512, 768, 256, 256]);
  assert.deepEqual(crop(other, 4), [source, 0, 256, 256, 256], 'a pose from another outfit used its row on this body');
  assert.deepEqual(crop(source, 8), [source, 0, 256, 256, 256], 'a conflicting grid still reduced to a valid-looking crop');
});

test('a missing phase sheet keeps the runtime body ID rather than its source alias', () => {
  const base = hero('arca_bastion');
  const variant = { ...base, id: 'arca_bastion_qa_variant', sourceHeroId: base.id };
  const variantSheet = getHeroSpriteSheetSrc(variant, 'melee');
  const baseSheet = getHeroSpriteSheetSrc(base, 'melee');
  assert.notEqual(variantSheet, baseSheet);
  const script = resolvePresentationScript(variant, 'intro');
  assert.equal(script.actor.id, variant.id);
  const phaseAsset = samplePresentationScript(script, 0).asset;
  assert.equal(phaseAsset.kind, 'native-generated-character-animation');
  const fighter = new EngineFighter(960, 540, [variant], [hero('eira_solenne')],
    { add: noop }, noop, noop, { opponentControl: 'p2' });
  const drawn = withImageTrace(ctx => fighter.drawCharacterPresentation(ctx, 0), new Set([phaseAsset.sheet]));
  assert.ok(drawn.some(row => row[0] === variantSheet));
  assert.ok(drawn.every(row => row[0] !== baseSheet));
  assert.equal(fighter.getActive('player').id, variant.id);
  fighter.dispose();
});

test('living timeout exits turn outward on both roster bodies and preserve HP', () => {
  const ids = ['sten_ulfsson', 'orin_vale'];
  const engine = new EngineFighter(960, 540, [hero(ids[0])], [hero(ids[1])],
    { add: noop }, noop, noop, { opponentControl: 'p2', roundsToWin: 1 });
  advance(engine, 5.4);
  assert.equal(engine.getSnapshot().phase, 'running');
  engine.timer = .001;
  advance(engine, .02);
  assert.equal(engine.getSnapshot().phase, 'victory');
  advance(engine, engine.presentation.remaining + .02);
  assert.equal(engine.getSnapshot().phase, 'outro');
  advance(engine, .7);
  assert.ok(engine.presentation.entries.every(e => e.actorPhase === 'outro' && !e.script));
  const images = withImageTrace(ctx => engine.drawCharacterPresentation(ctx, 0));
  const bodies = ids.map(id => images.find(row => row[0] === getHeroSpriteSheetSrc(hero(id), 'melee'))?.at(-1));
  assert.equal(bodies[0].flip, -1);
  assert.equal(bodies[1].flip, 1);
  assert.ok(bodies[0].x < engine.width * .25);
  assert.ok(bodies[1].x > engine.width * .75);
  assert.deepEqual(engine.roundHistory.map(round => round.timeout), [true]);
  assert.equal(engine.getActive('player').currentHp, engine.getActive('player').maxHp);
  assert.equal(engine.getActive('cpu').currentHp, engine.getActive('cpu').maxHp);
  engine.dispose();
});

test('an early finish holds the last sample of a looping Ancre exit, and aerial exits face the path', () => {
  const anchor = resolvePresentationScript({ id: 'player_anchor', universe: 'Nexus de Convergence' }, 'outro');
  const terminal = samplePresentationScript(anchor, anchor.duration);
  assert.equal(terminal.asset.kind, 'melee-manifest');
  assert.equal(terminal.progress, 1);
  assert.deepEqual(samplePresentationScript(anchor, anchor.duration * 1.25), terminal);
  const aerial = resolvePresentationScript(hero('yuffie_ff7'), 'outro');
  const retreat = samplePresentationScript(aerial, aerial.duration * .85);
  assert.ok(retreat.x < 0 && retreat.y < 0);
  assert.equal(retreat.facing, -1);
});
