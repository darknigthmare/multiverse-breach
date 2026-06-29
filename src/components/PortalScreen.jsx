import React, { useState } from 'react';
import { HEROES_DB } from '../game/heroes';
import sound from '../game/soundEngine';
import { drawPixelSprite } from '../game/renderer';
import { getTranslation } from '../game/translation';
import { LORE_DB } from '../game/lore';

export default function PortalScreen({ lang, breachShards, setBreachShards, unlockedHeroes, setUnlockedHeroes, onBack }) {
  const [summoning, setSummoning] = useState(false);
  const [summonedHero, setSummonedHero] = useState(null);
  const [summonedBatch, setSummonedBatch] = useState(null);
  const [showCard, setShowCard] = useState(false);
  
  // New Banner selection state
  const [activeBanner, setActiveBanner] = useState('multi'); // 'multi' | 'scifi' | 'horror' | 'arcade'

  const cost = 50;

  const handleSummon = () => {
    if (breachShards < cost || summoning) return;

    setBreachShards(prev => prev - cost);
    setSummoning(true);
    setSummonedHero(null);
    setSummonedBatch(null);
    setShowCard(false);
    
    sound.playSfx('portal');

    setTimeout(() => {
      // Pick a hero based on active banner weights (60% chance for banner categories, 40% for others)
      let pool = HEROES_DB;
      const isBannerWeighted = activeBanner !== 'multi';
      
      let bannerCategory = '';
      if (activeBanner === 'scifi') bannerCategory = 'marine';
      if (activeBanner === 'horror') bannerCategory = 'horror';
      if (activeBanner === 'arcade') bannerCategory = 'slayer'; // slayer or hacker

      const bannerPool = HEROES_DB.filter(h => {
        if (activeBanner === 'scifi') return h.category === 'marine' || h.id === 'chell' || h.id === 'freeman';
        if (activeBanner === 'horror') return h.category === 'horror' || h.id === 'pyramidhead';
        if (activeBanner === 'arcade') return h.category === 'slayer' || h.category === 'tactical' || h.id === 'miku';
        if (activeBanner === 'manga') return LORE_DB[h.universe]?.mediaType === 'manga';
        return true;
      });

      const otherPool = HEROES_DB.filter(h => !bannerPool.includes(h));

      let targetPool = pool;
      if (isBannerWeighted && Math.random() < 0.6) {
        targetPool = bannerPool.length > 0 ? bannerPool : pool;
      } else if (isBannerWeighted) {
        targetPool = otherPool.length > 0 ? otherPool : pool;
      }

      // Try to get a locked hero from target pool, otherwise any hero from target pool
      const lockedInPool = targetPool.filter(h => !unlockedHeroes.includes(h.id));
      let hero;
      if (lockedInPool.length > 0) {
        hero = lockedInPool[Math.floor(Math.random() * lockedInPool.length)];
      } else {
        hero = targetPool[Math.floor(Math.random() * targetPool.length)];
      }

      setSummonedHero(hero);
      setSummoning(false);
      setShowCard(true);

      // Add to unlocked roster
      if (!unlockedHeroes.includes(hero.id)) {
        setUnlockedHeroes(prev => [...prev, hero.id]);
        sound.playSfx('levelup');
      } else {
        // compensate duplicate with +25 shards rebate
        setBreachShards(prev => prev + 25);
        sound.playSfx('coin');
      }
    }, 2500);
  };

  const handleSummonTen = () => {
    const tenCost = 450;
    if (breachShards < tenCost || summoning) return;

    setBreachShards(prev => prev - tenCost);
    setSummoning(true);
    setSummonedHero(null);
    setSummonedBatch(null);
    setShowCard(false);

    sound.playSfx('portal');

    setTimeout(() => {
      let pool = HEROES_DB;
      const isBannerWeighted = activeBanner !== 'multi';
      
      let bannerPool = HEROES_DB.filter(h => {
        if (activeBanner === 'scifi') return h.category === 'marine' || h.id === 'chell' || h.id === 'freeman';
        if (activeBanner === 'horror') return h.category === 'horror' || h.id === 'pyramidhead';
        if (activeBanner === 'arcade') return h.category === 'slayer' || h.category === 'tactical' || h.id === 'miku';
        if (activeBanner === 'manga') return LORE_DB[h.universe]?.mediaType === 'manga';
        return true;
      });
      const otherPool = HEROES_DB.filter(h => !bannerPool.includes(h));

      const batch = [];
      const newUnlocked = [...unlockedHeroes];
      let shardsReturned = 0;

      for (let i = 0; i < 10; i++) {
        let targetPool = pool;
        if (isBannerWeighted && Math.random() < 0.6) {
          targetPool = bannerPool.length > 0 ? bannerPool : pool;
        } else if (isBannerWeighted) {
          targetPool = otherPool.length > 0 ? otherPool : pool;
        }

        const lockedInPool = targetPool.filter(h => !newUnlocked.includes(h.id));
        let hero;
        if (lockedInPool.length > 0) {
          hero = lockedInPool[Math.floor(Math.random() * lockedInPool.length)];
        } else {
          hero = targetPool[Math.floor(Math.random() * targetPool.length)];
        }

        batch.push(hero);

        if (!newUnlocked.includes(hero.id)) {
          newUnlocked.push(hero.id);
        } else {
          shardsReturned += 25;
        }
      }

      setUnlockedHeroes(newUnlocked);
      if (shardsReturned > 0) {
        setBreachShards(prev => prev + shardsReturned);
      }

      setSummonedBatch(batch);
      setSummoning(false);
      setShowCard(true);
      sound.playSfx('levelup');
    }, 2500);
  };

  const isDuplicate = summonedHero && unlockedHeroes.includes(summonedHero.id);

  return (
    <div className="portal-container" style={{
      padding: '30px 40px',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'radial-gradient(circle, #1a0f30 0%, #050209 100%)',
      fontFamily: '"Share Tech Mono", monospace',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Top Header Controls */}
      <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button onClick={onBack} className="btn-retro">{getTranslation(lang, 'backToHub')}</button>
        <div style={{
          padding: '8px 16px',
          background: 'rgba(155, 89, 182, 0.15)',
          border: '1px solid #9b59b6',
          borderRadius: '4px',
          color: '#9b59b6',
          boxShadow: '0 0 10px rgba(155, 89, 182, 0.2)'
        }}>
          🌀 {getTranslation(lang, 'shards')}: <span style={{ fontWeight: 'bold' }}>{breachShards}</span>
        </div>
      </div>

      <h1 className="cyber-title" style={{ fontSize: '28px', marginBottom: '8px', textShadow: '0 0 12px #9b59b6' }}>
        {getTranslation(lang, 'btnPortal')}
      </h1>
      <p style={{ color: '#ccc', textAlign: 'center', fontSize: '13px', margin: '0 0 25px 0', maxWidth: '600px' }}>
        Tear open the dimensional fabric using 50 Shards to pull a hero from another universe!
      </p>

      {/* Banner Selectors */}
      <div style={{ width: '100%', maxWidth: '800px', marginBottom: '25px', padding: '15px', background: 'rgba(255,255,255,0.02)', border: '1px solid #222' }}>
        <div style={{ fontSize: '11px', color: '#ffea00', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {getTranslation(lang, 'bannerSelect')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '8px' }}>
          <button
            onClick={() => { setActiveBanner('multi'); sound.playSfx('click'); }}
            className={`btn-retro ${activeBanner === 'multi' ? 'active-tab' : ''}`}
            style={{ fontSize: '11px', padding: '6px', borderColor: activeBanner === 'multi' ? '#9b59b6' : '#444' }}
          >
            {getTranslation(lang, 'portal_multi')}
          </button>
          <button
            onClick={() => { setActiveBanner('scifi'); sound.playSfx('click'); }}
            className={`btn-retro ${activeBanner === 'scifi' ? 'active-tab' : ''}`}
            style={{ fontSize: '11px', padding: '6px', borderColor: activeBanner === 'scifi' ? '#3498db' : '#444' }}
          >
            🚀 {getTranslation(lang, 'portal_scifi')}
          </button>
          <button
            onClick={() => { setActiveBanner('horror'); sound.playSfx('click'); }}
            className={`btn-retro ${activeBanner === 'horror' ? 'active-tab' : ''}`}
            style={{ fontSize: '11px', padding: '6px', borderColor: activeBanner === 'horror' ? '#e74c3c' : '#444' }}
          >
            💀 {getTranslation(lang, 'portal_horror')}
          </button>
          <button
            onClick={() => { setActiveBanner('arcade'); sound.playSfx('click'); }}
            className={`btn-retro ${activeBanner === 'arcade' ? 'active-tab' : ''}`}
            style={{ fontSize: '11px', padding: '6px', borderColor: activeBanner === 'arcade' ? '#e67e22' : '#444' }}
          >
            👾 {getTranslation(lang, 'portal_arcade')}
          </button>
          <button
            onClick={() => { setActiveBanner('manga'); sound.playSfx('click'); }}
            className={`btn-retro ${activeBanner === 'manga' ? 'active-tab' : ''}`}
            style={{ fontSize: '11px', padding: '6px', borderColor: activeBanner === 'manga' ? '#9b59b6' : '#444' }}
          >
            📚 {getTranslation(lang, 'portal_manga')}
          </button>
        </div>
      </div>

      {/* Portal Swirl Animation / Card Reveal */}
      <div style={{
        position: 'relative',
        width: '240px',
        height: '240px',
        margin: '10px 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {summoning && (
          <div className="portal-vortex" style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '4px dashed #9b59b6',
            boxShadow: '0 0 35px #9b59b6, inset 0 0 35px #9b59b6',
            animation: 'spin 1.2s linear infinite'
          }} />
        )}

        {!summoning && !showCard && (
          <div style={{
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'rgba(155, 89, 182, 0.12)',
            border: '2px dashed #9b59b6',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: breachShards >= cost ? 'pointer' : 'default',
            boxShadow: breachShards >= cost ? '0 0 25px rgba(155, 89, 182, 0.4)' : 'none',
            transition: 'all 0.3s ease'
          }}
          onClick={handleSummon}
          >
            <span style={{ fontSize: '48px', animation: 'bounce 2s infinite' }}>🌀</span>
          </div>
        )}

        {/* Revealed Hero Card */}
        {showCard && summonedHero && (
          <div className="reveal-card-animation" style={{
            width: '270px',
            background: 'rgba(12, 8, 22, 0.95)',
            border: `3px solid ${summonedHero.primaryColor}`,
            boxShadow: `0 0 25px ${summonedHero.primaryColor}`,
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            zIndex: 10
          }}>
            <div style={{ fontSize: '10px', color: '#ffeb3b', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {isDuplicate ? getTranslation(lang, 'duplicateCard') : getTranslation(lang, 'newHeroRecruited')}
            </div>
            
            <h2 style={{ margin: '8px 0 3px 0', fontSize: '20px', color: '#fff' }}>{summonedHero.name}</h2>
            <div style={{
              display: 'inline-block',
              padding: '2px 8px',
              background: summonedHero.primaryColor,
              color: '#fff',
              fontSize: '10px',
              borderRadius: '2px',
              marginBottom: '10px'
            }}>
              {summonedHero.universe}
            </div>

            {/* Micro canvas previewing character sprite */}
            <div style={{
              margin: '5px auto',
              background: '#040208',
              border: '1px solid #222',
              height: '70px',
              width: '70px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <canvas id="previewCanvas" width="70" height="70" ref={(el) => {
                if (!el) return;
                const ctx = el.getContext('2d');
                ctx.clearRect(0, 0, 70, 70);
                drawPixelSprite(ctx, 35, 46, summonedHero, 0, 1);
              }} />
            </div>

            <div style={{ textAlign: 'left', fontSize: '11px', margin: '10px 0', borderTop: '1px solid #222', paddingTop: '8px', lineHeight: '18px' }}>
              <div>HP: <span style={{ color: '#2ecc71', float: 'right' }}>{summonedHero.stats.hp}</span></div>
              <div>ATTACK: <span style={{ color: '#e74c3c', float: 'right' }}>{summonedHero.stats.atk}</span></div>
              <div>DEFENSE: <span style={{ color: '#3498db', float: 'right' }}>{summonedHero.stats.def}</span></div>
              <div>SPEED: <span style={{ color: '#f1c40f', float: 'right' }}>{summonedHero.stats.spd}</span></div>
            </div>

            {isDuplicate && (
              <div style={{ color: '#ffeb3b', fontSize: '10px', marginTop: '6px' }}>
                {getTranslation(lang, 'duplicateRebate')}
              </div>
            )}
          </div>
        )}
        {/* Revealed Batch x10 Card */}
        {showCard && summonedBatch && (
          <div className="reveal-card-animation" style={{
            width: '100%',
            maxWidth: '650px',
            background: 'rgba(12, 8, 22, 0.95)',
            border: '3px solid #9b59b6',
            boxShadow: '0 0 25px #9b59b6',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            zIndex: 10
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#ffeb3b', letterSpacing: '2px', textShadow: '0 0 8px #ffeb3b' }}>
              {lang === 'fr' ? 'RÉSULTATS DE L\'INVOCATION x10' : 'SUMMON x10 BATCH RESULTS'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
              {summonedBatch.map((hero, idx) => {
                return (
                  <div key={idx} style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: `1px solid ${hero.primaryColor}`,
                    borderRadius: '4px',
                    padding: '8px',
                    textAlign: 'center',
                    boxShadow: `inset 0 0 8px rgba(255,255,255,0.01)`
                  }}>
                    <div style={{ fontWeight: 'bold', fontSize: '10px', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {hero.name}
                    </div>
                    <div style={{ fontSize: '8px', color: '#888', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {hero.universe}
                    </div>
                    <div style={{
                      margin: '6px auto 0 auto',
                      background: '#040208',
                      height: '40px',
                      width: '40px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      border: '1px solid #222'
                    }}>
                      <canvas id={`previewBatchCanvas_${idx}`} width="40" height="40" ref={(el) => {
                        if (!el) return;
                        const ctx = el.getContext('2d');
                        ctx.clearRect(0, 0, 40, 40);
                        drawPixelSprite(ctx, 20, 27, hero, 0, 0.7);
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ color: '#ffea00', fontSize: '11px', marginTop: '15px' }}>
              {lang === 'fr' 
                ? 'Les héros doublons ont été convertis en +25 Fragments chacun !' 
                : 'Any duplicate heroes pulled automatically returned +25 Shards rebate!'}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
        {!summoning && (
          <>
            <button
              onClick={handleSummon}
              disabled={breachShards < cost}
              className={`btn-retro ${breachShards < cost ? 'btn-disabled' : ''}`}
              style={{ fontSize: '13px', padding: '10px 20px', borderColor: '#9b59b6', color: '#fff', background: 'rgba(155, 89, 182, 0.15)' }}
            >
              {getTranslation(lang, 'costLabel')}
            </button>
            <button
              onClick={handleSummonTen}
              disabled={breachShards < 450}
              className={`btn-retro ${breachShards < 450 ? 'btn-disabled' : ''}`}
              style={{ fontSize: '13px', padding: '10px 20px', borderColor: '#ffea00', color: '#fff', background: 'rgba(255, 234, 0, 0.15)' }}
            >
              {getTranslation(lang, 'btnSummonTen')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
