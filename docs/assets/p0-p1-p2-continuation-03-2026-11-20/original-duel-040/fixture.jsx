import { createRoot } from 'react-dom/client';
import FighterMode from '../../../../src/components/FighterMode.jsx';
import { EngineFighter } from '../../../../src/game/engineFighter.js';
import { HEROES_DB } from '../../../../src/game/heroes.js';
import { ParticleSystem } from '../../../../src/game/renderer.js';
import '../../../../src/index.css';

const host = document.getElementById('fixture-root');
const params = new URLSearchParams(location.search);
const ids = params.get('pair') === 'b' ? ['eira_solenne', 'nyra_vale'] : ['neris_vale', 'kael_venn'];
const heroes = ids.map(id => HEROES_DB.find(actor => actor.id === id));
const trace = window.duelTrace = { draws: [], labels: [], strokes: [] };
const { drawImage, fillText, stroke } = CanvasRenderingContext2D.prototype;
CanvasRenderingContext2D.prototype.drawImage = function drawImageWithTrace(source, ...args) {
  const path = source instanceof HTMLImageElement ? new URL(source.currentSrc || source.src).pathname : null;
  if (path?.startsWith('/sprites/generated/heroes/') && args.length === 8) {
    trace.draws.push({ path, crop: args.slice(0, 4) });
  }
  return drawImage.call(this, source, ...args);
};
CanvasRenderingContext2D.prototype.fillText = function fillTextWithTrace(label, ...args) {
  trace.labels.push(label);
  return fillText.call(this, label, ...args);
};
CanvasRenderingContext2D.prototype.stroke = function strokeWithTrace(...args) {
  if (['#78f0e2', '#ffc573', '#b1e2a0', '#ff57db'].includes(this.strokeStyle)) trace.strokes.push(this.strokeStyle);
  return stroke.call(this, ...args);
};

if (params.has('ui')) {
  createRoot(host).render(<FighterMode heroes={heroes} unlockedHeroes={ids} activeTeam={[ids[0]]}
    customConfig={{ playerTeamIds: [ids[0]], opponentTeamIds: [ids[1]], opponentControl: 'p2' }} />);
} else {
  const canvas = document.createElement('canvas');
  canvas.id = 'fixture-canvas';
  canvas.width = 1040;
  canvas.height = 520;
  host.append(canvas);
  const ctx = canvas.getContext('2d');
  const completed = [];
  const particles = new ParticleSystem();
  const engine = new EngineFighter(1040, 520, [heroes[0]], [heroes[1]], particles, () => {},
    (...args) => completed.push(args), { opponentControl: 'p2', universe: heroes[0].universe });
  const advance = seconds => {
    for (let frame = 0; frame < Math.ceil(seconds * 60); frame++) engine.update(1 / 60);
  };
  window.duelFixture = {
    advance,
    knockOut(side) {
      const target = engine.getActive(side);
      target.currentHp = 1;
      engine.applyHit(engine.getActive(side === 'cpu' ? 'player' : 'cpu'), target,
        { type: 'heavy', base: 999, guardDamage: 20, knockback: 200 });
      advance(1.05);
    },
    draw(reducedMotion = false) {
      trace.draws.length = 0;
      trace.labels.length = 0;
      trace.strokes.length = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      engine.draw(ctx, engine.elapsed * 60, { reducedMotion });
      return engine.getSnapshot();
    },
    nextScene() { advance(engine.getSnapshot().presentation.remaining + .02); },
    stop() {
      engine.dispose();
      return { completed: completed.length, presentation: engine.getSnapshot().presentation };
    }
  };
  window.duelFixture.draw();
}
