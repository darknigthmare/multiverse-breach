// Observes real FighterMode inputs and Canvas presentation. Health and spacing
// are prepared only to reach two short, normal knockouts in this fixture.
import React from 'react';
import { createRoot } from 'react-dom/client';
import FighterMode from '../../../../src/components/FighterMode.jsx';
import { EngineFighter } from '../../../../src/game/engineFighter.js';
import { getHeroById } from '../../../../src/game/heroes.js';
import '../../../../src/index.css';

const scenario = new URLSearchParams(location.search).get('scenario');
const actorIds = scenario === 'stitch' ? ['roger_rabbit', 'stitch_626']
  : scenario === 'static' ? ['jack_sparrow_potc', 'lilo_pelekai'] : ['lilo_pelekai', 'roger_rabbit'];
const [playerId, opponentId] = actorIds;
const heroes = actorIds.map(getHeroById);
const customConfig = { autoStart: true, opponentControl: 'p2', difficulty: 'standard',
  playerTeamIds: [playerId], opponentTeamIds: [opponentId] };
const levels = {}, collection = {}, hidden = [], disabled = {};
const audit = window.__iconicDuel = { engine: null, phases: new Set(), draws: [], impacts: [], completions: [], inputs: [], shutter: [], pendingArtDraws: 0 };
const expectedImages = new Set(['/sprites/generated/heroes/lilo-stitch/lilo-pelekai.png',
  '/sprites/generated/heroes/pirates-of-the-caribbean/jack-sparrow-potc.png', '/sprites/generated/heroes/roger-rabbit/roger-rabbit.png']);

const draw = EngineFighter.prototype.drawCharacterPresentation;
EngineFighter.prototype.drawCharacterPresentation = function (ctx, time, options) {
  const phase = this.getCurrentPresentation();
  if (!phase) return draw.call(this, ctx, time, options);
  audit.phases.add(phase.phase);
  const drawImage = ctx.drawImage;
  const fillText = ctx.fillText;
  ctx.fillText = function (text, ...args) {
    if (text === 'ART PENDING') audit.pendingArtDraws++;
    return fillText.call(this, text, ...args);
  };
  ctx.drawImage = function (image, ...args) {
    const source = image.currentSrc || image.src;
    const route = source && new URL(source, location.href).pathname;
    if (expectedImages.has(route) && args.length === 8 && audit.draws.length < 3000) {
      const transform = this.getTransform();
      audit.draws.push({ phase: phase.phase, route, source: args.slice(0, 4), position: [transform.e, transform.f],
        destination: args.slice(4), facing: Math.sign(transform.a), reducedMotion: options?.reducedMotion === true });
    }
    return drawImage.call(this, image, ...args);
  };
  try { return draw.call(this, ctx, time, options); }
  finally { ctx.drawImage = drawImage; ctx.fillText = fillText; }
};
const effect = EngineFighter.prototype.drawScriptedPresentationEffect;
EngineFighter.prototype.drawScriptedPresentationEffect = function (ctx, sample, ...args) {
  if (sample.effect.active && sample.effect.kind === 'iconic-camera-shutter') audit.shutter.push(sample.progress);
  return effect.call(this, ctx, sample, ...args);
};
const update = EngineFighter.prototype.update;
EngineFighter.prototype.update = function (...args) {
  audit.engine = this;
  return update.apply(this, args);
};
const applyHit = EngineFighter.prototype.applyHit;
EngineFighter.prototype.applyHit = function (actor, target, action, ...args) {
  const damage = applyHit.call(this, actor, target, action, ...args);
  if (damage > 0) audit.impacts.push({ actor: actor.id, target: target.id, side: actor.side,
    name: action.identity?.name, range: action.range, delivery: action.delivery, damage, round: this.roundNumber });
  return damage;
};
const triggerSideAction = EngineFighter.prototype.triggerSideAction;
EngineFighter.prototype.triggerSideAction = function (side, kind, ...args) {
  const result = triggerSideAction.call(this, side, kind, ...args);
  const actor = this.getActive(side);
  const target = this.getOpponent(side);
  audit.lastCommand = { side, kind, result, fighter: actor.id, x: actor.x, target: target.id, targetX: target.x,
    targetInvulnerable: target.invulnerable, range: actor.action?.range, name: actor.action?.identity?.name };
  return result;
};
window.addEventListener('keydown', event => {
  if (event.code === 'KeyF') audit.inputs.push({ kind: 'key', trusted: event.isTrusted, code: event.code });
});
window.addEventListener('pointerup', event => {
  if (event.target.closest('button[title="P2 heavy attack [M]"]')) {
    audit.inputs.push({ kind: event.pointerType, trusted: event.isTrusted, button: 'P2 heavy attack [M]' });
  }
});
audit.prepare = (gap, targetHp) => {
  const engine = audit.engine;
  const player = engine.getActive('player'), cpu = engine.getActive('cpu');
  if (engine.countdown > 0 || engine.getCurrentPresentation() || engine.finished) throw new Error('Prepare only an active round');
  player.x = 255;
  cpu.x = player.x + gap;
  if (targetHp !== null) cpu.currentHp = targetHp;
};

createRoot(document.getElementById('root')).render(<FighterMode lang="en" heroes={heroes} unlockedHeroes={actorIds}
  activeTeam={customConfig.playerTeamIds} heroLevels={levels} portalCollection={collection} hiddenUniverses={hidden}
  disabledAssets={disabled} customConfig={customConfig} onMatchComplete={value => audit.completions.push(value)} />);
