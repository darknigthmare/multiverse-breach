import React, { useEffect, useRef, useState } from 'react';
import { EngineSmash } from '../game/engineSmash';
import { EngineRpg } from '../game/engineRpg';
import { EngineTactics } from '../game/engineTactics';
import { ParticleSystem, drawUniverseBackground, drawSynergyOverlay } from '../game/renderer';
import sound from '../game/soundEngine';
import { HEROES_DB, EVENT_ITEMS_DB, EQUIP_ITEMS_DB } from '../game/heroes';
import { getMonstersForUniverse, getBossesForUniverse, getWorldBossForUniverse, getFinalGameBoss } from '../game/enemies';
import { getTranslation } from '../game/translation';

export default function GameCanvas({ lang, activeTeam, stage, heroLevels, equippedGear, equippedEventItems, heroTalents, completedStages, onBattleEnd }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const keysPressed = useRef({});
  
  const [activeHeroId, setActiveHeroId] = useState(activeTeam[0]);
  const [teamState, setTeamState] = useState([]);
  const [bossState, setBossState] = useState(null);
  const [activePhase, setActivePhase] = useState('move'); // tactics
  const [selectedAction, setSelectedAction] = useState('simple'); // tactics
  const [autoBattle, setAutoBattle] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // 1 | 2
  const [battleCompleted, setBattleCompleted] = useState(false);
  const [battleResult, setBattleResult] = useState(null);
  
  const [activeSynergies, setActiveSynergies] = useState([]);
  
  const autoBattleRef = useRef(autoBattle);
  autoBattleRef.current = autoBattle;
  const speedMultiplierRef = useRef(speedMultiplier);
  speedMultiplierRef.current = speedMultiplier;
  
  // Track if active Event Item has been activated this fight
  const [eventItemUsed, setEventItemUsed] = useState(false);

  const UNIVERSE_TO_STAGE_ID = {
    'Gears of War': 1, 'Halo': 2, 'Alien': 3, 'Predator': 4, 'Resident Evil': 5,
    'Silent Hill': 6, 'Dino Crisis': 7, 'The Matrix': 8, 'Stargate': 9, 'Half-Life': 10,
    'Portal': 11, 'Metal Gear': 12, 'Payday': 13, 'Vocaloid': 14, 'Yu-Gi-Oh': 15,
    'Guilty Gear': 16, 'BlazBlue': 17, 'Slender Man': 18, 'Chucky': 19, 'Hellraiser': 20,
    'Mass Effect': 21, 'Fallout': 22, 'Doom': 23, 'Unreal': 24, 'Harry Potter': 25,
    'Star Wars': 26, 'Le Cinquième Element': 27, 'Scary Movie': 28, 'Dead Space': 29,
    'Rick & Morty': 30, 'Digital Circus': 31, 'Digimon': 32, 'Saw': 33, 'Rosario + Vampire': 34,
    'Negima': 35, 'Ghost in the Shell': 36, 'Mad Max': 37
  };

  // Map hero stats
  const getHeroStats = (hero) => {
    const lvl = heroLevels[hero.id] || 1;
    const multiplier = 1 + (lvl - 1) * 0.1;
    let stats = {
      hp: Math.round(hero.stats.hp * multiplier),
      atk: Math.round(hero.stats.atk * multiplier),
      def: Math.round(hero.stats.def * multiplier),
      spd: Math.round(hero.stats.spd * (1 + (lvl - 1) * 0.03))
    };

    // 1. Universe completion passive stat bonus (+5% all stats)
    const ustageId = UNIVERSE_TO_STAGE_ID[hero.universe];
    if (ustageId && completedStages && completedStages.includes(ustageId)) {
      stats.hp = Math.round(stats.hp * 1.05);
      stats.atk = Math.round(stats.atk * 1.05);
      stats.def = Math.round(stats.def * 1.05);
      stats.spd = Math.round(stats.spd * 1.05);
    }

    // 2. Deployed Synergy multipliers
    const squadCats = activeTeam.map(id => HEROES_DB.find(h => h.id === id)?.category || '');
    const activeCatsCount = squadCats.reduce((acc, c) => {
      acc[c] = (acc[c] || 0) + 1;
      return acc;
    }, {});
    const synergyActive = activeCatsCount[hero.category] >= 2;
    if (synergyActive) {
      if (hero.category === 'marine') stats.hp = Math.round(stats.hp * 1.25);
      if (hero.category === 'slayer') stats.atk = Math.round(stats.atk * 1.20);
      if (hero.category === 'horror') stats.spd = Math.round(stats.spd * 1.15);
      if (hero.category === 'hacker') stats.spd = Math.round(stats.spd * 1.20);
      if (hero.category === 'tactical') stats.def = Math.round(stats.def * 1.20);
    }

    // 3. Talent Mod boosts
    if (heroTalents && heroTalents[hero.id]) {
      const talent = heroTalents[hero.id];
      if (talent === 'incendiary') stats.atk = Math.round(stats.atk * 1.10);
      if (talent === 'vanguard') stats.def = Math.round(stats.def * 1.15);
      if (talent === 'survival_instinct') stats.hp = Math.round(stats.hp * 1.20);
      if (talent === 'critical_edge') stats.atk = Math.round(stats.atk * 1.20);
      if (talent === 'hyper_velocity') stats.spd = Math.round(stats.spd * 1.15);
      if (talent === 'atb_overdrive') stats.spd = Math.round(stats.spd * 1.20);
      if (talent === 'guardian_plates') stats.hp = Math.round(stats.hp * 1.20);
    }

    // 4. Add equipped gear boosts
    const gearId = equippedGear[hero.id];
    if (gearId) {
      const isUpgraded = gearId.endsWith('_plus');
      const baseGearId = isUpgraded ? gearId.replace('_plus', '') : gearId;
      const gear = EQUIP_ITEMS_DB.find(it => it.id === baseGearId);
      if (gear && gear.boost) {
        const factor = isUpgraded ? 2 : 1;
        if (gear.boost.hp) stats.hp += gear.boost.hp * factor;
        if (gear.boost.atk) stats.atk += gear.boost.atk * factor;
        if (gear.boost.def) stats.def += gear.boost.def * factor;
        if (gear.boost.spd) stats.spd += gear.boost.spd * factor;
      }
    }
    return stats;
  };

  const getEnemiesData = () => {
    if (stage.id === 38) {
      // Final Boss Stage
      return {
        monsters: getMonstersForUniverse('Matrix'),
        bosses: getBossesForUniverse('Matrix'),
        worldBoss: getFinalGameBoss()
      };
    }
    return {
      monsters: getMonstersForUniverse(stage.universe),
      bosses: getBossesForUniverse(stage.universe),
      worldBoss: getWorldBossForUniverse(stage.universe)
    };
  };

  useEffect(() => {
    sound.playBgm('battle');

    const enemies = getEnemiesData();
    const squadHeroes = activeTeam.map(id => {
      const base = HEROES_DB.find(h => h.id === id);
      const scaledStats = getHeroStats(base);
      return {
        ...base,
        stats: scaledStats,
        talent: heroTalents[id] || null
      };
    });
    const activeCategoriesCount = squadHeroes.reduce((acc, h) => {
      acc[h.category] = (acc[h.category] || 0) + 1;
      return acc;
    }, {});
    const activeSyns = ['marine', 'slayer', 'horror', 'hacker', 'tactical'].filter(cat => (activeCategoriesCount[cat] || 0) >= 2);
    setActiveSynergies(activeSyns);
    if (activeSyns.length > 0) {
      sound.playSfx('levelup');
    }
    const particles = new ParticleSystem();
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;

    const handleBattleComplete = (result) => {
      setBattleCompleted(true);
      setBattleResult(result);
      sound.stopBgm();
      if (result === 'victory') {
        sound.playSfx('victory');
      } else {
        sound.playSfx('defeat');
      }
    };

    // Load correct mode engine
    if (stage.mode === 'Smash') {
      engineRef.current = new EngineSmash(width, height, squadHeroes, enemies, particles, (type) => sound.playSfx(type), handleBattleComplete);
    } else if (stage.mode === 'RPG') {
      engineRef.current = new EngineRpg(width, height, squadHeroes, enemies, particles, (type) => sound.playSfx(type), handleBattleComplete);
      engineRef.current.isFinalBoss = (stage.id === 38);
    } else if (stage.mode === 'Tactics') {
      engineRef.current = new EngineTactics(width, height, squadHeroes, enemies, particles, (type) => sound.playSfx(type), handleBattleComplete);
      engineRef.current.isFinalBoss = (stage.id === 38);
    }

    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
      if (stage.mode === 'Smash' && engineRef.current) {
        const activeH = engineRef.current.getActiveHero();
        if (e.key === 'j' || e.key === 'J') engineRef.current.triggerAbility(activeH, 'simple');
        if (e.key === 'k' || e.key === 'K') engineRef.current.triggerAbility(activeH, 'secondary');
        if (e.key === 'l' || e.key === 'L') engineRef.current.triggerAbility(activeH, 'defense');
        if (e.key === 'i' || e.key === 'I') engineRef.current.triggerAbility(activeH, 'special');
        
        if (e.key === '1') engineRef.current.setActiveHero(activeTeam[0]);
        if (e.key === '2' && activeTeam[1]) engineRef.current.setActiveHero(activeTeam[1]);
        if (e.key === '3' && activeTeam[2]) engineRef.current.setActiveHero(activeTeam[2]);
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animTime = 0;
    let frameId;

    const tick = () => {
      const ctx = canvas.getContext('2d');
      const usingOpenAiBackdrop = drawUniverseBackground(ctx, stage.universe, width, height, stage.mode);

      // Cyber grid lines
      if (!usingOpenAiBackdrop) {
        ctx.strokeStyle = 'rgba(57, 197, 187, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0); ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y); ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      const engine = engineRef.current;
      if (engine) {
        engine.autoBattle = autoBattleRef.current;
        const loops = speedMultiplierRef.current;
        for (let l = 0; l < loops; l++) {
          engine.update(keysPressed.current);
        }
        particles.update();

        engine.draw(ctx, animTime);
        particles.draw(ctx);
        drawSynergyOverlay(ctx, activeSynergies, width, height, animTime);

        setTeamState([...engine.heroes]);
        if (engine.enemies.length > 0) {
          // Find active boss/worldBoss
          const boss = engine.enemies.find(e => e.isBoss && e.currentHp > 0);
          if (boss) setBossState({ ...boss });
        }

        if (stage.mode === 'Smash') {
          setActiveHeroId(engine.activeHeroId);
        } else if (stage.mode === 'RPG') {
          setActiveHeroId(engine.selectedHeroId);
        } else if (stage.mode === 'Tactics') {
          setActiveHeroId(engine.activeUnit?.id || '');
          setActivePhase(engine.actionPhase);
          setSelectedAction(engine.selectedAction);
        }
      }

      animTime++;
      frameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(frameId);
      sound.stopBgm();
    };
  }, [stage, activeTeam]);

  const handleCanvasClick = (e) => {
    if (stage.mode !== 'Tactics' || !engineRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const engine = engineRef.current;
    const gridC = Math.floor((clickX - engine.gridStartX) / engine.cellW);
    const gridR = Math.floor((clickY - engine.gridStartY) / engine.cellH);

    if (gridC >= 0 && gridC < engine.cols && gridR >= 0 && gridR < engine.rows) {
      engine.handleCellClick(gridC, gridR);
    }
  };

  const handleActiveHeroAbility = (type) => {
    if (!engineRef.current || battleCompleted) return;
    const engine = engineRef.current;

    if (stage.mode === 'Smash') {
      const activeH = engine.getActiveHero();
      engine.triggerAbility(activeH, type);
    } else if (stage.mode === 'RPG') {
      const activeH = engine.getSelectedHero();
      engine.triggerAbility(activeH, type);
    } else if (stage.mode === 'Tactics') {
      engine.selectedAction = type;
      engine.calculateAttackRange();
      setSelectedAction(type);
    }
  };

  // Trigger Combat Event Item
  const handleActivateEventItem = () => {
    if (!engineRef.current || eventItemUsed || battleCompleted) return;

    const activeHero = HEROES_DB.find(h => h.id === activeHeroId);
    if (!activeHero) return;

    const eventId = equippedEventItems[activeHero.id];
    if (!eventId) return;

    const eventDetails = EVENT_ITEMS_DB[activeHero.universe];
    if (!eventDetails) return;

    // Trigger effect in engine
    engineRef.current.triggerCombatEvent(eventDetails.effect);
    setEventItemUsed(true);
  };

  const swapActiveHero = (id) => {
    if (!engineRef.current) return;
    if (stage.mode === 'Smash') {
      engineRef.current.setActiveHero(id);
    } else if (stage.mode === 'RPG') {
      engineRef.current.selectHero(id);
    }
  };

  const activeHeroObj = teamState.find(h => h.id === activeHeroId) || teamState[0];

  const toggleAuto = () => {
    const nextVal = !autoBattle;
    setAutoBattle(nextVal);
    if (engineRef.current) {
      engineRef.current.autoBattle = nextVal;
      if (nextVal && stage.mode === 'Tactics' && engineRef.current.activeUnitType === 'hero' && engineRef.current.actionPhase === 'move') {
        engineRef.current.runHeroAI();
      }
    }
  };

  // Check if active hero has an event item equipped
  const activeHeroStatic = HEROES_DB.find(h => h.id === activeHeroId);
  const equippedEventId = activeHeroStatic ? equippedEventItems[activeHeroStatic.id] : null;
  const equippedEvent = activeHeroStatic ? EVENT_ITEMS_DB[activeHeroStatic.universe] : null;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#04020a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: '#fff',
      padding: '20px 40px',
      fontFamily: '"Share Tech Mono", monospace',
      boxSizing: 'border-box',
      width: '100%'
    }}>
      {/* Top Bar */}
      <div style={{
        width: '100%',
        maxWidth: '720px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#ff4500' }}>
            BREACH ZONE: {stage.name}
          </h2>
          <span style={{ fontSize: '11px', color: '#aaa' }}>
            Universe: {stage.universe} ({stage.mode.toUpperCase()})
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {(stage.mode === 'RPG' || stage.mode === 'Tactics') && (
            <button
              onClick={toggleAuto}
              className="btn-retro"
              style={{
                borderColor: autoBattle ? '#2ecc71' : '#444',
                color: autoBattle ? '#2ecc71' : '#aaa',
                fontSize: '11px',
                padding: '6px 12px',
                background: autoBattle ? 'rgba(46, 204, 113, 0.15)' : 'rgba(0,0,0,0.3)'
              }}
            >
              🤖 {getTranslation(lang, 'btnAutoBattle')}
            </button>
          )}

          <button
            onClick={() => {
              sound.playSfx('click');
              setSpeedMultiplier(prev => (prev === 1 ? 2 : 1));
            }}
            className="btn-retro"
            style={{
              borderColor: speedMultiplier === 2 ? '#ffeb3b' : '#444',
              color: speedMultiplier === 2 ? '#ffeb3b' : '#aaa',
              fontSize: '11px',
              padding: '6px 12px',
              background: speedMultiplier === 2 ? 'rgba(255, 235, 59, 0.15)' : 'rgba(0,0,0,0.3)'
            }}
          >
            {getTranslation(lang, 'btnSpeedUp')}
          </button>

          <button onClick={() => onBattleEnd('quit')} className="btn-retro" style={{ borderColor: '#e74c3c', color: '#e74c3c', fontSize: '11px', padding: '6px 12px' }}>
            {getTranslation(lang, 'retreat')}
          </button>
        </div>
      </div>

      {/* Boss Health Bar Display */}
      {bossState && bossState.currentHp > 0 && (
        <div style={{ width: '100%', maxWidth: '720px', marginBottom: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#e74c3c', marginBottom: '4px', textTransform: 'uppercase' }}>
            {getTranslation(lang, 'bossWarning', { name: bossState.name })}
          </div>
          <div style={{ height: '12px', background: 'rgba(0,0,0,0.6)', border: '1px solid #e74c3c', borderRadius: '4px', position: 'relative' }}>
            <div style={{
              height: '100%',
              width: `${(bossState.currentHp / bossState.maxHp) * 100}%`,
              background: 'linear-gradient(to right, #e74c3c, #ff3333)',
              boxShadow: '0 0 10px #e74c3c',
              transition: 'width 0.15s ease-out'
            }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '9px', fontWeight: 'bold' }}>
              {bossState.currentHp} / {bossState.maxHp} HP
            </div>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div style={{
        position: 'relative',
        border: '3px solid #39c5bb',
        boxShadow: '0 0 20px rgba(57, 197, 187, 0.4)',
        borderRadius: '8px',
        overflow: 'hidden',
        background: '#020005',
        marginBottom: '15px'
      }}>
        <div className="crt-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 5 }} />

        <canvas
          ref={canvasRef}
          width="700"
          height="320"
          onClick={handleCanvasClick}
          style={{ display: 'block', cursor: stage.mode === 'Tactics' ? 'crosshair' : 'default' }}
        />

        {/* Victory/Defeat Overlay */}
        {battleCompleted && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10
          }}>
            <h1 className="cyber-title" style={{
              fontSize: '44px',
              color: battleResult === 'victory' ? '#2ecc71' : '#e74c3c',
              textShadow: battleResult === 'victory' ? '0 0 20px #2ecc71' : '0 0 20px #e74c3c',
              marginBottom: '20px'
            }}>
              {battleResult === 'victory' ? getTranslation(lang, 'victory') : getTranslation(lang, 'defeat')}
            </h1>
            <p style={{ fontSize: '15px', color: '#ccc', marginBottom: '30px' }}>
              {battleResult === 'victory'
                ? getTranslation(lang, 'victoryMsg', { gold: stage.goldPrize, shards: stage.shardPrize, tokens: (stage.id === 38 ? 20 : 5) })
                : getTranslation(lang, 'defeatMsg')}
            </p>
            <button
              onClick={() => onBattleEnd(battleResult)}
              className="btn-retro"
              style={{
                fontSize: '16px',
                padding: '10px 26px',
                background: battleResult === 'victory' ? '#2ecc71' : '#e74c3c',
                color: '#fff',
                borderColor: '#fff'
              }}
            >
              {getTranslation(lang, 'returnToHub')}
            </button>
          </div>
        )}
      </div>

      {/* Control Panel / Actions Dashboard */}
      <div style={{
        width: '100%',
        maxWidth: '720px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 2fr',
        gap: '20px',
        background: 'rgba(20, 15, 30, 0.75)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '6px',
        padding: '16px',
        boxSizing: 'border-box'
      }}>
        {/* Squad List */}
        <div style={{ borderRight: '1px solid #333', paddingRight: '15px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '8px' }}>{getTranslation(lang, 'teamSquad')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {teamState.map((h) => {
              const isSelected = h.id === activeHeroId;
              const isDead = h.currentHp <= 0;
              return (
                <div
                  key={h.id}
                  onClick={() => !isDead && swapActiveHero(h.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: isSelected ? 'rgba(57, 197, 187, 0.15)' : 'rgba(0,0,0,0.3)',
                    border: isSelected ? '1px solid #39c5bb' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '4px',
                    cursor: isDead ? 'default' : 'pointer',
                    opacity: isDead ? 0.4 : 1
                  }}
                >
                  <span style={{ fontWeight: 'bold', fontSize: '13px' }}>
                    {h.name.split(' ')[0]} {isSelected && '◀'}
                  </span>
                  <span style={{ fontSize: '11px', color: isDead ? '#e74c3c' : '#2ecc71' }}>
                    {isDead ? 'KO' : `${h.currentHp}/${h.stats.hp} HP`}
                  </span>
                </div>
              );
            })}
          </div>

          {stage.mode === 'RPG' && (
            <button
              onClick={toggleAuto}
              className="btn-retro"
              style={{
                marginTop: '12px',
                width: '100%',
                fontSize: '11px',
                padding: '6px',
                borderColor: autoBattle ? '#2ecc71' : '#ff4500',
                color: autoBattle ? '#2ecc71' : '#ff4500'
              }}
            >
              {getTranslation(lang, 'autoBattle')}: {autoBattle ? 'ON' : 'OFF'}
            </button>
          )}

          {/* Active Event Item triggering button */}
          {equippedEventId && equippedEvent && (
            <button
              onClick={handleActivateEventItem}
              disabled={eventItemUsed || battleCompleted}
              className="btn-retro"
              style={{
                marginTop: '10px',
                width: '100%',
                fontSize: '10px',
                padding: '8px',
                borderColor: eventItemUsed ? '#444' : '#ff4500',
                background: eventItemUsed ? 'transparent' : 'rgba(255, 69, 0, 0.12)',
                color: eventItemUsed ? '#555' : '#ff8c00',
                boxShadow: eventItemUsed ? 'none' : '0 0 10px rgba(255, 69, 0, 0.25)',
                fontWeight: 'bold',
                cursor: eventItemUsed ? 'not-allowed' : 'pointer'
              }}
            >
              🌟 {eventItemUsed ? getTranslation(lang, 'eventUsed') : equippedEvent.name[lang].toUpperCase()}
            </button>
          )}
        </div>

        {/* Action Panel */}
        <div>
          {activeHeroObj ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold', color: activeHeroObj.primaryColor }}>
                  {activeHeroObj.name.toUpperCase()} ACTIONS
                </span>
                {stage.mode === 'Tactics' && (
                  <span style={{ fontSize: '9px', color: '#ffb300' }}>
                    {selectedAction === 'defense' ? getTranslation(lang, 'tacticsAction') : getTranslation(lang, 'tacticsMove')}
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  onClick={() => handleActiveHeroAbility('simple')}
                  disabled={activeHeroObj.currentHp <= 0 || (stage.mode === 'RPG' && activeHeroObj.atb < 100)}
                  className={`btn-action ${selectedAction === 'simple' && stage.mode === 'Tactics' ? 'selected' : ''}`}
                >
                  ⚔️ {activeHeroObj.simple.name}
                  <div style={{ fontSize: '8px', color: '#ccc', marginTop: '2px' }}>Basic Action</div>
                </button>

                <button
                  onClick={() => handleActiveHeroAbility('secondary')}
                  disabled={activeHeroObj.currentHp <= 0 || activeHeroObj.cooldown > 0 || (stage.mode === 'RPG' && activeHeroObj.atb < 100)}
                  className={`btn-action ${selectedAction === 'secondary' && stage.mode === 'Tactics' ? 'selected' : ''}`}
                >
                  ⚡ {activeHeroObj.secondary.name}
                  <div style={{ fontSize: '8px', color: '#ccc', marginTop: '2px' }}>
                    {activeHeroObj.cooldown > 0 ? `COOLDOWN (${Math.ceil(activeHeroObj.cooldown/60)}s)` : 'Skill Action'}
                  </div>
                </button>

                <button
                  onClick={() => handleActiveHeroAbility('defense')}
                  disabled={activeHeroObj.currentHp <= 0 || (stage.mode === 'RPG' && activeHeroObj.atb < 100)}
                  className={`btn-action ${selectedAction === 'defense' && stage.mode === 'Tactics' ? 'selected' : ''}`}
                >
                  🛡️ {activeHeroObj.defense.name}
                  <div style={{ fontSize: '8px', color: '#ccc', marginTop: '2px' }}>Shield Defense</div>
                </button>

                <button
                  onClick={() => handleActiveHeroAbility('special')}
                  disabled={activeHeroObj.currentHp <= 0 || activeHeroObj.specialCharge < 100 || (stage.mode === 'RPG' && activeHeroObj.atb < 100)}
                  className="btn-special"
                  style={{
                    boxShadow: activeHeroObj.specialCharge >= 100 ? `0 0 15px ${activeHeroObj.primaryColor}` : 'none',
                    borderColor: activeHeroObj.specialCharge >= 100 ? '#fff' : '#444',
                    background: activeHeroObj.specialCharge >= 100 ? activeHeroObj.primaryColor : 'rgba(0,0,0,0.4)',
                    color: '#fff'
                  }}
                >
                  🔥 {activeHeroObj.special.name.toUpperCase()}
                  <div style={{ fontSize: '8px', color: '#fff', marginTop: '2px' }}>
                    {activeHeroObj.specialCharge < 100 ? `SPECIAL CHARGE: ${Math.round(activeHeroObj.specialCharge)}%` : 'READY!'}
                  </div>
                </button>

                {stage.mode === 'Tactics' && (
                  <button
                    onClick={() => {
                      if (engineRef.current) {
                        engineRef.current.endActiveTurn();
                        sound.play('confirm');
                      }
                    }}
                    className="btn-retro"
                    style={{
                      gridColumn: 'span 2',
                      padding: '8px 12px',
                      background: '#c0392b',
                      borderColor: '#ff4d4d',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      textShadow: '0 0 5px #ff4d4d',
                      marginTop: '4px'
                    }}
                  >
                    ⏭️ {lang === 'fr' ? 'FINIR LE TOUR' : 'END TURN'}
                  </button>
                )}
              </div>

              {stage.mode === 'Smash' && (
                <div style={{ fontSize: '9px', color: '#aaa', marginTop: '12px', textAlign: 'center' }}>
                  Move with <strong>W/A/S/D</strong>. Press <strong>J/K/L/I</strong> or click buttons. Swap heroes with <strong>1/2/3</strong>.
                </div>
              )}
              {stage.mode === 'Tactics' && (
                <div style={{ fontSize: '9px', color: '#aaa', marginTop: '12px', textAlign: 'center' }}>
                  Click highighted <span style={{ color: '#2ecc71' }}>green</span> cells to Move, select skill, then click target in <span style={{ color: '#e74c3c' }}>red</span> cells to target.
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', color: '#777', padding: '30px' }}>NO HERO SELECTABLE</div>
          )}
        </div>
      </div>
    </div>
  );
}
