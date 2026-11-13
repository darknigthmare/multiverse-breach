import { EngineFighter } from '../../src/game/engineFighter.js';
import { EngineSmash } from '../../src/game/engineSmash.js';
import { getHeroById } from '../../src/game/heroes.js';
import { resolvePresentationScript, samplePresentationScript } from '../../src/game/combat/presentationCatalog.js';

const canvas = document.getElementById('qa-canvas');
const context = canvas.getContext('2d');
const query = new URLSearchParams(location.search);
const side = query.get('side') === 'cpu' ? 'cpu' : 'player';
const noop = () => {};
const particles = { add: noop };
const sourceRevan = getHeroById('darth_revan');
const revan = query.get('variant') === 'invalid-composite'
  ? { ...sourceRevan, id: 'combat:revan:2', sourceHeroId: 'darth_revan' } : sourceRevan;
const other = getHeroById('han_solo');
const audit = { engine: null, mode: null, completed: [], engines: [] };
window.__revanPresentation = audit;
audit.snapshot = () => {
  const e = audit.engine;
  if (audit.mode === 'Fighter') return {
    mode: audit.mode, side, snapshot: e.getSnapshot(), completed: audit.completed.length,
    hp: ['player', 'cpu'].map(camp => e.getActive(camp).currentHp),
    meter: ['player', 'cpu'].map(camp => e.getActive(camp).meter), disposed: e.disposed
  };
  const actor = side === 'player' ? e.heroes[0] : e.enemies[0];
  const view = e.getMeleeVisualActor(actor);
  return { mode: audit.mode, side, phase: actor.state, stateElapsed: actor.stateElapsed,
    actor: { id: actor.id, sourceHeroId: actor.sourceHeroId, x: actor.x, y: actor.y, currentHp: actor.currentHp },
    view: { x: view.x, y: view.y, state: view.state, presentationPhase: view.presentationPhase, presentationFrame: view.presentationFrame },
    script: actor.meleePresentation?.presentationScript ? {
      id: actor.meleePresentation.presentationScript.id,
      sample: samplePresentationScript(actor.meleePresentation.presentationScript, actor.stateElapsed)
    } : null, disposed: e.disposed, completed: audit.completed.length };
};
audit.draw = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  audit.engine.draw(context, audit.mode === 'Fighter' ? audit.engine.elapsed * 60 : 0);
  const snapshot = audit.snapshot();
  document.getElementById('qa-status').textContent = `${audit.mode} · ${snapshot.snapshot?.phase || snapshot.phase} · ${audit.engine.paused ? 'pause' : 'simulation'} · ${audit.completed.length} retour(s) de résultat`;
  return snapshot;
};
audit.advance = (frames = 1) => {
  for (let i = 0; i < frames; i++) {
    if (audit.mode === 'Fighter') audit.engine.update(1 / 60);
    else audit.engine.update({}, {}, { stageDeltaMs: 1000 / 60 });
  }
  return audit.draw();
};
audit.pause = value => { audit.engine.setPaused(value); return audit.draw(); };
audit.finish = (winner = side) => {
  const e = audit.engine;
  const result = winner === 'player' ? 'victory' : 'defeat';
  if (audit.mode === 'Fighter') {
    e.countdown = 0;
    e.getActive(winner === 'player' ? 'cpu' : 'player').currentHp = 0;
    e.endRound(result);
  } else {
    e.completeMeleeIntros();
    e.finishLocalVersus(result);
  }
  return audit.draw();
};
audit.sample = (phase, progress) => {
  const script = resolvePresentationScript(revan, phase);
  return script ? samplePresentationScript(script, progress * script.duration) : null;
};
audit.boot = (mode = 'Fighter') => {
  audit.engine?.dispose();
  audit.mode = mode;
  audit.completed = [];
  const heroes = [side === 'player' ? revan : other];
  const opponents = [side === 'cpu' ? revan : other];
  audit.engine = mode === 'Fighter'
    ? new EngineFighter(960, 540, heroes, opponents, particles, noop,
      (...args) => audit.completed.push(args), { opponentControl: 'p2', roundsToWin: 1 })
    : new EngineSmash(960, 540, heroes, { customRoster: opponents }, particles, noop,
      (...args) => audit.completed.push(args), { universe: 'Nexus de Convergence', mode: 'Smash',
        disableHazards: true, forceBaseArena: true, customBattle: { singleRoster: true, opponentControl: 'p2' } });
  audit.engines.push(audit.engine);
  return audit.draw();
};
document.getElementById('qa-fighter').onclick = () => audit.boot('Fighter');
document.getElementById('qa-smash').onclick = () => audit.boot('Smash');
document.getElementById('qa-step').onclick = () => audit.advance(15);
document.getElementById('qa-pause').onclick = () => audit.pause(!audit.engine.paused);
document.getElementById('qa-result').onclick = () => audit.finish();
document.getElementById('qa-dispose').onclick = () => { audit.engine.dispose(); audit.draw(); };
window.addEventListener('pagehide', () => audit.engine.dispose());
audit.boot(query.get('mode') === 'Smash' ? 'Smash' : 'Fighter');
