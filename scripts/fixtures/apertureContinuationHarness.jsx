// Isolated QA entry. It uses the actual production Canvas/engine/renderers.
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import GameCanvas from '../../src/components/GameCanvas.jsx';
import { EngineTactics } from '../../src/game/engineTactics.js';
import { TACTICS_APERTURE_BATTLEFIELD } from '../../src/game/tacticsApertureBattlefield.js';
import { getHeroById } from '../../src/game/heroes.js';
import { ENEMIES_DB } from '../../src/game/enemies.js';
import { drawPixelSprite, drawCombatantBust } from '../../src/game/renderer.js';
import '../../src/index.css';
import './combatHarness.css';
const audit = { engine: null, results: [], drawCalls: [], field: TACTICS_APERTURE_BATTLEFIELD };
window.__apertureAudit = audit;
const update = EngineTactics.prototype.update;
EngineTactics.prototype.update = function (...args) { audit.engine = this; return update.apply(this, args); };
const params = new URLSearchParams(location.search);
const activeTeam = ['cloud_ff7'];
const doom = ENEMIES_DB.Doom;
const source = [...doom.monsters, ...doom.bosses, doom.worldBoss].find(a => a?.name === 'Leaping Pinky Demon');
const opponents = [{ ...source, universe: 'Doom', hp: 20000, maxHp: 20000, atk: 0, spd: 1, def: 0 }];
const stage = { id: 'qa-aperture-sector', name: 'Aperture maintenance shaft', universe: 'Portal',
  mode: 'Tactics', difficulty: 'Custom', tacticsBattlefieldId: TACTICS_APERTURE_BATTLEFIELD.id,
  disableHazards: true, customBattle: { singleRoster: true, opponentControl: 'p2',
    enemyData: { customRoster: opponents, monsters: opponents, bosses: [], worldBoss: null } } };
function Harness() {
  const [mounted, setMounted] = useState(true), [paused, setPaused] = useState(false);
  return <><header className="combat-qa-toolbar"><p>Real Tactics sector, isolated synthetic opponents.</p>
    <button id="qa-pause" onClick={() => setPaused(v => !v)}>Pause / Resume</button>
    <button id="qa-unmount" onClick={() => setMounted(false)}>QA unmount</button></header>
    {mounted && <GameCanvas lang={params.get('lang') === 'en' ? 'en' : 'fr'} playerProfile={{ name: 'Terrain QA' }}
      activeTeam={activeTeam} stage={stage} heroLevels={{}} equippedGear={{}} equippedEventItems={{}}
      heroTalents={{}} heroSkins={{}} completedStages={[]} sessionPaused={paused}
      onBattleEnd={(...args) => audit.results.push(args)} />}</>;
}
if (params.get('view') === 'batman') {
  const canvas = document.createElement('canvas'); canvas.width = 480; canvas.height = 240;
  document.getElementById('root').append(canvas);
  const ctx = canvas.getContext('2d'), original = ctx.drawImage.bind(ctx), texts = [];
  const fillText = ctx.fillText.bind(ctx);
  ctx.drawImage = (image, ...args) => { audit.drawCalls.push(image?.src); return original(image, ...args); };
  ctx.fillText = (text, ...args) => { texts.push(text); return fillText(text, ...args); };
  ctx.fillStyle = '#16212e'; ctx.fillRect(0, 0, 480, 240);
  const actor = getHeroById('batman_tdk');
  for (const [i, state] of ['idle', 'run', 'attack', 'hit'].entries()) {
    drawPixelSprite(ctx, 80 + i * 105, 135, { ...actor, state }, 0, 1, 72);
  }
  drawCombatantBust(ctx, 205, 165, 64, 64, actor, 'hero');
  audit.batman = { texts, ready: true };
} else createRoot(document.getElementById('root')).render(<Harness />);
