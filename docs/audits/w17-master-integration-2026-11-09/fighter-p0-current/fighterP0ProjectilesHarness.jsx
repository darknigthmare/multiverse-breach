// Isolated, prepared geometry; real FighterMode, inputs, simulation and renderer.
// Every observer delegates unchanged. This fixture makes no native-art claim.
import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import FighterMode from '../../src/components/FighterMode.jsx';
import { EngineFighter } from '../../src/game/engineFighter.js';
import { HEROES_DB } from '../../src/game/heroes.js';
import '../../src/index.css';
import './combatHarness.css';

const query = new URLSearchParams(location.search);
const heroId = query.get('actor');
const side = query.get('side') === 'cpu' ? 'cpu' : 'player';
if (!['raven_tt', 'starfire_tt'].includes(heroId)) throw Error('Choose a current P0 projectile identity');
const ids = [heroId, 'tifa_ff7', 'cloud_ff7', 'barret_ff7'];
const heroes = ids.map(id => {
  const actor = HEROES_DB.find(hero => hero.id === id);
  if (!actor) throw Error(`Missing actual roster identity: ${id}`);
  return actor;
});
const config = {
  autoStart: true, opponentControl: 'p2', difficulty: 'standard',
  playerTeamIds: side === 'player' ? ids.slice(0, 2) : ids.slice(2),
  opponentTeamIds: side === 'cpu' ? ids.slice(0, 2) : ids.slice(2)
};
const levels = {}, collection = {}, hidden = [], disabled = {};
const audit = {
  heroId, side, engine: null, engines: [], prepared: false, spawns: [], paints: [], hits: [],
  particleTypes: [], keyEvents: [], results: [], exits: [], source1to1Verified: false, nativeArtClaimed: false
};
window.__fighterP0Projectiles = audit;
window.addEventListener('keydown', event => {
  if (['f', 'p'].includes(event.key.toLowerCase())) audit.keyEvents.push({
    key: event.key.toLowerCase(), code: event.code, repeat: event.repeat, trusted: event.isTrusted
  });
});
const projectiles = new WeakMap();
const identity = actor => actor.runtimeId || actor.id;
const hp = engine => Object.fromEntries(['player', 'cpu'].flatMap(camp =>
  engine.getTeam(camp).fighters.map(actor => [identity(actor), actor.currentHp])));

const originalSetPaused = EngineFighter.prototype.setPaused;
EngineFighter.prototype.setPaused = function (...args) {
  audit.engine = this;
  if (!audit.engines.includes(this)) audit.engines.push(this);
  return originalSetPaused.apply(this, args);
};
const originalSpawn = EngineFighter.prototype.spawnProjectile;
EngineFighter.prototype.spawnProjectile = function (actor, action) {
  const existing = new Set(this.projectiles);
  const result = originalSpawn.call(this, actor, action);
  if (this === audit.engine && audit.prepared) for (const projectile of this.projectiles) {
    if (existing.has(projectile)) continue;
    const record = {
      side: projectile.side, owner: identity(actor), sourceHeroId: actor.sourceHeroId || actor.sourceId || actor.id,
      kind: projectile.canonParticleType, x: projectile.x, y: projectile.y,
      vx: projectile.vx, maxRange: projectile.maxRange, radius: projectile.radius,
      canonSourceAbility: action.canonSourceAbility, authoredAbility: action.authoredAbility,
      name: action.identity?.name, delivery: action.identity?.delivery, shape: action.identity?.shape,
      maxTargets: action.identity?.maxTargets, identityAuthored: action.identity?.provenance?.identityAuthored,
      feedback: action.canonSourceFeedback, elapsed: this.elapsed
    };
    projectiles.set(projectile, record);
    audit.spawns.push(record);
  }
  return result;
};
const originalDraw = EngineFighter.prototype.drawProjectile;
EngineFighter.prototype.drawProjectile = function (ctx, projectile) {
  const record = projectiles.get(projectile);
  if (this !== audit.engine || !audit.prepared || !record) return originalDraw.call(this, ctx, projectile);
  const originalEllipse = ctx.ellipse;
  ctx.ellipse = function (x, y, radiusX, radiusY, ...rest) {
    audit.paints.push({
      kind: projectile.canonParticleType, x, y, radiusX, radiusY, color: ctx.fillStyle,
      projectileX: projectile.x, projectileY: projectile.y,
      travelFromMuzzle: Math.abs(projectile.x - record.x), elapsed: audit.engine.elapsed
    });
    return originalEllipse.call(this, x, y, radiusX, radiusY, ...rest);
  };
  try { return originalDraw.call(this, ctx, projectile); }
  finally { ctx.ellipse = originalEllipse; }
};
const originalHit = EngineFighter.prototype.applyHit;
EngineFighter.prototype.applyHit = function (actor, target, action, ...args) {
  const damage = originalHit.call(this, actor, target, action, ...args);
  if (this === audit.engine && audit.prepared && damage > 0) audit.hits.push({
    owner: identity(actor), target: identity(target), side: actor.side, damage,
    canonSourceAbility: action.canonSourceAbility, delivery: action.delivery, elapsed: this.elapsed
  });
  return damage;
};

audit.prepare = () => {
  const engine = audit.engine;
  if (!engine || engine.disposed || !engine.paused) throw Error('Prepare only a paused QA match');
  engine.countdown = 0;
  engine.hitStop = 0;
  engine.clearInputs();
  engine.projectiles.length = 0;
  for (const camp of ['player', 'cpu']) for (const actor of engine.getTeam(camp).fighters) Object.assign(actor, {
    state: 'idle', action: null, meter: 100, hitstun: 0, guardBreak: 0, invulnerable: 0,
    guarding: false, crouching: false, vx: 0, vy: 0, y: engine.groundY, currentHp: actor.maxHp,
    comboWindow: 0, comboStep: 0,
    // Inactive reserves lie inside the flight corridor: collision must still
    // select the actual active opponent, never a bench actor.
    x: 480
  });
  const actor = engine.getActive(side), target = engine.getOpponent(side);
  actor.x = side === 'player' ? 160 : 800;
  target.x = side === 'player' ? 700 : 260;
  actor.facing = side === 'player' ? 1 : -1;
  target.facing = -actor.facing;
  const originalParticle = engine.particles.add;
  engine.particles.add = function (...args) {
    if (audit.prepared) audit.particleTypes.push(args[7] || 'spark');
    return originalParticle.apply(this, args);
  };
  audit.initial = {
    actor: identity(actor), target: identity(target), actorX: actor.x, targetX: target.x,
    gap: Math.abs(target.x - actor.x), hp: hp(engine), storage: JSON.stringify(Object.entries(localStorage))
  };
  audit.prepared = true;
};
audit.snapshot = () => ({
  paused: audit.engine.paused, hp: hp(audit.engine), spawns: audit.spawns, paints: audit.paints,
  hits: audit.hits, particleTypes: audit.particleTypes,
  keyEvents: audit.keyEvents,
  projectiles: audit.engine.projectiles.map(projectile => ({ x: projectile.x, y: projectile.y, kind: projectile.canonParticleType })),
  results: audit.results, exits: audit.exits,
  liveEngines: audit.engines.filter(engine => !engine.disposed).length,
  storage: JSON.stringify(Object.entries(localStorage))
});

export default function Harness() {
  const [paused, setPaused] = useState(true);
  const [prepared, setPrepared] = useState(false);
  return <>
    <header className="combat-qa-toolbar">
      <p>{heroId} · {side} · prepared 540px gap · actual F/P controls · procedural feedback, artwork unverified</p>
      <button id="qa-prepare" disabled={prepared} onClick={() => { audit.prepare(); setPrepared(true); }}>Prepare</button>
      <button id="qa-pause" disabled={!prepared} onClick={() => setPaused(value => !value)}>{paused ? 'Resume' : 'Pause'}</button>
    </header>
    <FighterMode lang="en" heroes={heroes} unlockedHeroes={ids} activeTeam={config.playerTeamIds}
      heroLevels={levels} portalCollection={collection} hiddenUniverses={hidden} disabledAssets={disabled}
      customConfig={config} sessionPaused={paused} onMatchComplete={value => audit.results.push(value)}
      onSessionEnd={value => audit.exits.push(value)} />
  </>;
}
createRoot(document.getElementById('root')).render(<StrictMode><Harness /></StrictMode>);
