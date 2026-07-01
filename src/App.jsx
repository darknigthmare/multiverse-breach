import React, { useState, useEffect } from 'react';
import sound from './game/soundEngine';
import HubScreen from './components/HubScreen';
import PortalScreen from './components/PortalScreen';
import GameCanvas from './components/GameCanvas';
import AudioControl from './components/AudioControl';
import { getTranslation } from './game/translation';
import { EQUIP_ITEMS_DB } from './game/heroes';
import { getOpenAiBackdropSrc } from './game/renderer';

function MissionNarrativeScreen({ lang, stage, result, onContinue }) {
  const isOutro = Boolean(result);
  const victory = result === 'victory';
  const backdrop = getOpenAiBackdropSrc(stage.universe, stage.mode);
  const modifierName = stage.modifier?.name?.[lang] || stage.modifier?.id || (lang === 'fr' ? 'Anomalie inconnue' : 'Unknown anomaly');
  const modifierDesc = stage.modifier?.desc?.[lang] || '';
  const rarity = stage.lootRarity?.label || 'Common';
  const title = isOutro
    ? victory
      ? (lang === 'fr' ? 'BRECHE STABILISEE' : 'BREACH STABILIZED')
      : (lang === 'fr' ? 'REPLI TACTIQUE' : 'TACTICAL RETREAT')
    : (lang === 'fr' ? 'SEQUENCE NARRATIVE' : 'NARRATIVE SEQUENCE');
  const modeLine = stage.mode === 'RPG'
    ? (lang === 'fr' ? 'L escouade avance en formation RPG, comme une confrontation de boss cinematique.' : 'The squad advances in RPG formation, like a cinematic boss confrontation.')
    : stage.mode === 'Tactics'
      ? (lang === 'fr' ? 'Le champ se decoupe en lignes tactiques: chaque case devient une decision de survie.' : 'The field splits into tactical lanes: every tile becomes a survival decision.')
      : (lang === 'fr' ? 'La breche explose en arene rapide, proche d un combat crossover de super-heros.' : 'The breach bursts into a fast arena, close to a superhero crossover battle.');
  const introText = lang === 'fr'
    ? `La faille ${stage.universe} s ouvre sur ${stage.name}. Les archives du Nexus detectent ${stage.bossName}, lie au pattern "${modifierName}". ${modeLine} Objectif: verrouiller les coordonnees avant que la Singularity absorbe ce lore.`
    : `The ${stage.universe} breach opens over ${stage.name}. Nexus archives detect ${stage.bossName}, tied to the "${modifierName}" pattern. ${modeLine} Objective: lock the coordinates before the Singularity absorbs this lore.`;
  const outroText = victory
    ? (lang === 'fr'
      ? `${stage.universe} est stabilise. Les donnees de ${stage.bossName} rejoignent le codex, la rarete ${rarity} est indexee et les recompenses sont transferees au hub.`
      : `${stage.universe} is stabilized. ${stage.bossName} data enters the codex, ${rarity} rarity is indexed, and rewards are transferred to the hub.`)
    : (lang === 'fr'
      ? `La breche ${stage.universe} reste active. L escouade conserve les donnees de contact, mais ${stage.bossName} garde le controle local du signal.`
      : `The ${stage.universe} breach remains active. The squad keeps contact data, but ${stage.bossName} still controls the local signal.`);

  return (
    <div className="narrative-screen">
      <div className="narrative-backdrop" style={{ backgroundImage: `linear-gradient(90deg, rgba(2,1,8,0.35), rgba(2,1,8,0.82)), url(${backdrop || ''})` }}>
        <div className="narrative-rift" />
        <div className="narrative-scanline" />
        <div className="narrative-copy">
          <div className="narrative-kicker">{title}</div>
          <h1>{stage.universe}</h1>
          <h2>{stage.name}</h2>
          <p>{isOutro ? outroText : introText}</p>
          <div className="narrative-tags">
            <span>{stage.mode}</span>
            <span>{modifierName}</span>
            <span>{stage.bossName}</span>
          </div>
          {modifierDesc && <div className="narrative-intel">{modifierDesc}</div>}
          <button onClick={onContinue} className="btn-retro narrative-button">
            {isOutro
              ? (lang === 'fr' ? 'RETOUR AU HUB' : 'RETURN TO HUB')
              : (lang === 'fr' ? 'LANCER LA MISSION' : 'LAUNCH MISSION')}
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [lang, setLang] = useState('fr'); // FR default as requested, EN toggle
  const [currentScreen, setCurrentScreen] = useState('intro');
  const [gold, setGold] = useState(200);
  const [breachShards, setBreachShards] = useState(150); // enough for 3 portal pulls
  const [eventTokens, setEventTokens] = useState(10); // starting tokens for event shop
  const [unlockedHeroes, setUnlockedHeroes] = useState(['freeman', 'masterchief', 'leon']);
  const [heroLevels, setHeroLevels] = useState({ freeman: 1, masterchief: 1, leon: 1 });
  const [activeTeam, setActiveTeam] = useState(['freeman', 'masterchief', 'leon']);
  const [completedStages, setCompletedStages] = useState([]);
  const [activeStage, setActiveStage] = useState(null);
  const [lastBattleResult, setLastBattleResult] = useState(null);
  const [heroTalents, setHeroTalents] = useState({}); // heroId -> talentId

  // Inventory & Equipment
  const [inventory, setInventory] = useState([
    'cog_armor', 'green_herb', 'hev_battery' // starting gear
  ]);
  const [equippedGear, setEquippedGear] = useState({
    freeman: 'hev_battery',
    masterchief: null,
    leon: 'green_herb'
  });
  // Equipped Event Items (1 slot per hero)
  const [equippedEventItems, setEquippedEventItems] = useState({
    freeman: 'evt_hl_snarks', // starting events unlocked automatically for starting characters
    masterchief: 'evt_halo_warthog',
    leon: 'evt_re_cure'
  });

  // Play ambient music
  useEffect(() => {
    sound.init();
    if (currentScreen === 'intro' || currentScreen === 'hub') {
      sound.playBgm('hub');
    }
    return () => {
      sound.stopBgm();
    };
  }, [currentScreen]);

  const startOperation = () => {
    sound.playSfx('levelup');
    setCurrentScreen('hub');
  };

  const handleLaunchStage = (stage) => {
    sound.playSfx('special');
    setActiveStage(stage);
    setLastBattleResult(null);
    setCurrentScreen('missionIntro');
  };

  const handleBattleEnd = (result) => {
    if (result === 'victory' && activeStage) {
      // Award rewards
      setGold(prev => prev + activeStage.goldPrize);
      setBreachShards(prev => prev + activeStage.shardPrize);
      
      const tokenReward = activeStage.tokenPrize || 0;
      if (tokenReward > 0) {
        setEventTokens(prev => prev + tokenReward);
      }

      if (!activeStage.isSurvival && !completedStages.includes(activeStage.id)) {
        setCompletedStages(prev => [...prev, activeStage.id]);
      }

      // Check if they dropped a random relic/item from the stage's universe
      const universeGear = EQUIP_ITEMS_DB.filter(item => item.universe === activeStage.universe);
      const rarityDropBonus = {
        common: 0,
        rare: 0.12,
        epic: 0.22,
        legendary: 0.32,
        anomaly: 0.42
      };
      const rarityId = activeStage.lootRarity?.id || 'common';
      if (universeGear.length > 0 && Math.random() < 0.6 + (rarityDropBonus[rarityId] || 0)) {
        const drop = universeGear[Math.floor(Math.random() * universeGear.length)];
        const dropId = ['legendary', 'anomaly'].includes(rarityId) ? `${drop.id}_plus` : drop.id;
        setInventory(prev => {
          if (rarityId === 'common' && prev.includes(drop.id)) return prev;
          return [...prev, dropId];
        });
      }
    }
    setLastBattleResult(result);
    setCurrentScreen('missionOutro');
  };

  const closeMissionOutro = () => {
    setCurrentScreen('hub');
    setActiveStage(null);
    setLastBattleResult(null);
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'fr' : 'en';
    setLang(nextLang);
    sound.playSfx('coin');
  };

  return (
    <>
      {/* Global Mute/Audio Button */}
      <AudioControl />

      {/* Floating Language Switcher in bottom right */}
      <button
        onClick={toggleLanguage}
        style={{
          position: 'fixed',
          bottom: '15px',
          right: '15px',
          zIndex: 100,
          background: 'rgba(20, 20, 30, 0.75)',
          border: '1px solid #ff4500',
          borderRadius: '4px',
          color: '#ff4500',
          padding: '8px 12px',
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '14px',
          cursor: 'pointer',
          boxShadow: '0 0 10px rgba(255, 69, 0, 0.3)',
          backdropFilter: 'blur(4px)'
        }}
      >
        🌐 {lang.toUpperCase()}
      </button>

      {/* Screen Router */}
      {currentScreen === 'intro' && (
        <div className="intro-container" style={{
          minHeight: '100vh',
          background: 'radial-gradient(circle, #100826 0%, #020006 100%)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          textAlign: 'center',
          fontFamily: '"Share Tech Mono", monospace'
        }}>
          <div className="intro-portal" style={{
            position: 'absolute',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            border: '2px dotted rgba(57, 197, 187, 0.15)',
            boxShadow: '0 0 40px rgba(155, 89, 182, 0.1)',
            zIndex: 0,
            animation: 'spin 10s linear infinite'
          }} />

          <div style={{ zIndex: 1, maxWidth: '650px', padding: '30px' }}>
            <h1 className="cyber-title" style={{
              fontSize: '40px',
              marginBottom: '10px',
              textShadow: '0 0 15px #39c5bb',
              lineHeight: '1.2'
            }}>
              {getTranslation(lang, 'title')}
            </h1>
            <h3 style={{ color: '#ff4500', letterSpacing: '3px', marginBottom: '30px', fontSize: '13px' }}>
              {getTranslation(lang, 'subtitle')}
            </h3>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(57, 197, 187, 0.2)',
              borderRadius: '6px',
              padding: '24px',
              textAlign: 'justify',
              lineHeight: '22px',
              fontSize: '14px',
              color: '#ccc',
              marginBottom: '40px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
            }}>
              <p style={{ marginTop: 0 }}>
                {getTranslation(lang, 'introText1')}
              </p>
              <p style={{ marginBottom: 0 }}>
                {getTranslation(lang, 'introText2')}
              </p>
            </div>

            <button
              onClick={startOperation}
              className="btn-retro"
              style={{
                fontSize: '18px',
                padding: '12px 36px',
                background: '#39c5bb',
                color: '#111',
                boxShadow: '0 0 20px rgba(57,197,187,0.5)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {getTranslation(lang, 'initButton')}
            </button>
          </div>
        </div>
      )}

      {currentScreen === 'hub' && (
        <HubScreen
          lang={lang}
          gold={gold}
          setGold={setGold}
          breachShards={breachShards}
          setBreachShards={setBreachShards}
          eventTokens={eventTokens}
          setEventTokens={setEventTokens}
          unlockedHeroes={unlockedHeroes}
          heroLevels={heroLevels}
          setHeroLevels={setHeroLevels}
          activeTeam={activeTeam}
          setActiveTeam={setActiveTeam}
          completedStages={completedStages}
          inventory={inventory}
          setInventory={setInventory}
          equippedGear={equippedGear}
          setEquippedGear={setEquippedGear}
          equippedEventItems={equippedEventItems}
          setEquippedEventItems={setEquippedEventItems}
          heroTalents={heroTalents}
          setHeroTalents={setHeroTalents}
          onLaunchStage={handleLaunchStage}
          onGoToPortal={() => { sound.playSfx('click'); setCurrentScreen('portal'); }}
        />
      )}

      {currentScreen === 'missionIntro' && activeStage && (
        <MissionNarrativeScreen
          lang={lang}
          stage={activeStage}
          onContinue={() => {
            sound.playSfx('special');
            setCurrentScreen('battle');
          }}
        />
      )}

      {currentScreen === 'battle' && activeStage && (
        <GameCanvas
          lang={lang}
          activeTeam={activeTeam}
          stage={activeStage}
          heroLevels={heroLevels}
          equippedGear={equippedGear}
          equippedEventItems={equippedEventItems}
          heroTalents={heroTalents}
          completedStages={completedStages}
          onBattleEnd={handleBattleEnd}
        />
      )}

      {currentScreen === 'missionOutro' && activeStage && (
        <MissionNarrativeScreen
          lang={lang}
          stage={activeStage}
          result={lastBattleResult}
          onContinue={closeMissionOutro}
        />
      )}

      {currentScreen === 'portal' && (
        <PortalScreen
          lang={lang}
          breachShards={breachShards}
          setBreachShards={setBreachShards}
          unlockedHeroes={unlockedHeroes}
          setUnlockedHeroes={setUnlockedHeroes}
          onBack={() => { sound.playSfx('click'); setCurrentScreen('hub'); }}
        />
      )}
    </>
  );
}

export default App;
