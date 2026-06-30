import React, { useState, useEffect } from 'react';
import sound from './game/soundEngine';
import HubScreen from './components/HubScreen';
import PortalScreen from './components/PortalScreen';
import GameCanvas from './components/GameCanvas';
import AudioControl from './components/AudioControl';
import { getTranslation } from './game/translation';
import { EQUIP_ITEMS_DB } from './game/heroes';

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
    setCurrentScreen('battle');
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
    setCurrentScreen('hub');
    setActiveStage(null);
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

      {currentScreen === 'portal' && (
        <PortalScreen
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
