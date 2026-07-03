import React, { useState } from 'react';
import { HEROES_DB } from '../game/heroes';
import sound from '../game/soundEngine';
import { drawPixelSprite, getOpenAiBackdropSrc } from '../game/renderer';
import { getTranslation } from '../game/translation';
import { LORE_DB } from '../game/lore';
import { getCharacterPlaque } from '../game/characterPlaques';
import { EXPANDED_FACTION_UNIVERSES } from '../game/expandedUniverses';

export default function PortalScreen({ lang, breachShards, setBreachShards, unlockedHeroes, setUnlockedHeroes, hiddenUniverses = [], disabledAssets = {}, onBack }) {
  const [summoning, setSummoning] = useState(false);
  const [summonedHero, setSummonedHero] = useState(null);
  const [summonedBatch, setSummonedBatch] = useState(null);
  const [summonResult, setSummonResult] = useState(null);
  const [showCard, setShowCard] = useState(false);
  
  // New Banner selection state
  const [activeBanner, setActiveBanner] = useState('multi');

  const cost = 50;
  const portalBanners = [
    { id: 'multi', color: '#9b59b6', label: { fr: 'Portail Multivers', en: 'Multiverse Portal' }, desc: { fr: 'Tous les heros, taux standards.', en: 'All heroes, standard rates.' }, match: () => true },
    { id: 'scifi', color: '#3498db', label: { fr: 'Faille Sci-Fi', en: 'Sci-Fi Rift' }, desc: { fr: 'Halo, Mass Effect, Portal, Stargate, Gears.', en: 'Halo, Mass Effect, Portal, Stargate, Gears.' }, match: h => ['Halo', 'Gears of War', 'Mass Effect', 'Stargate', 'Portal', 'Half-Life', 'Star Wars', 'Le Cinquième Element', ...EXPANDED_FACTION_UNIVERSES.sciFi].includes(h.universe) },
    { id: 'xeno_yautja', color: '#8adbe6', label: { fr: 'Faille Xeno-Yautja', en: 'Xeno-Yautja Rift' }, desc: { fr: 'Alien, Predator, Prometheus, AVP.', en: 'Alien, Predator, Prometheus, AVP.' }, match: h => /Alien|Predator|Prometheus|Prey/.test(h.universe) },
    { id: 'horror', color: '#e74c3c', label: { fr: 'Faille Horreur', en: 'Horror Rift' }, desc: { fr: 'Resident Evil, Silent Hill, Chucky, Saw, Hellraiser.', en: 'Resident Evil, Silent Hill, Chucky, Saw, Hellraiser.' }, match: h => h.category === 'horror' || ['Resident Evil', 'Silent Hill', 'Chucky', 'Hellraiser', 'Saw', 'Slender Man', 'Scary Movie', 'Dead Space', 'Hazbin Hotel', 'Rob Zombie', ...EXPANDED_FACTION_UNIVERSES.horror].includes(h.universe) },
    { id: 'cyber', color: '#39ffcc', label: { fr: 'Faille Cyber', en: 'Cyber Rift' }, desc: { fr: 'Matrix, Ghost in the Shell, Digital Circus, Digimon.', en: 'Matrix, Ghost in the Shell, Digital Circus, Digimon.' }, match: h => ['The Matrix', 'Ghost in the Shell', 'Digital Circus', 'Digimon', 'Daft Punk', 'Oliver Tree', ...EXPANDED_FACTION_UNIVERSES.cyber].includes(h.universe) },
    { id: 'arena', color: '#e67e22', label: { fr: 'Faille Duel & Arene', en: 'Duel & Arena Rift' }, desc: { fr: 'Metal Gear, Payday, Yu-Gi-Oh, Guilty Gear, BlazBlue, Unreal.', en: 'Metal Gear, Payday, Yu-Gi-Oh, Guilty Gear, BlazBlue, Unreal.' }, match: h => ['Metal Gear', 'Payday', 'Yu-Gi-Oh', 'Guilty Gear', 'BlazBlue', 'Unreal'].includes(h.universe) },
    { id: 'arcade', color: '#e67e22', label: { fr: 'Faille Arcade', en: 'Arcade Rift' }, desc: { fr: 'Combattants, tacticiens et arènes.', en: 'Fighters, tacticians, and arenas.' }, match: h => h.category === 'slayer' || h.category === 'tactical' || ['Vocaloid', 'Unreal'].includes(h.universe) },
    { id: 'arcane', color: '#d9b86b', label: { fr: 'Faille Arcane', en: 'Arcane Rift' }, desc: { fr: 'Discworld, Kaamelott, Dungeon Meshi, Noob, magie.', en: 'Discworld, Kaamelott, Dungeon Meshi, Noob, magic.' }, match: h => ['Discworld', 'Kaamelott', 'Dungeon Meshi', 'Noob', 'Harry Potter', 'Negima', 'Rosario + Vampire', ...EXPANDED_FACTION_UNIVERSES.arcane].includes(h.universe) },
    { id: 'manga', color: '#9b59b6', label: { fr: 'Faille Manga & Web', en: 'Manga & Web Rift' }, desc: { fr: 'Univers manga, web et animation.', en: 'Manga, web, and animation worlds.' }, match: h => LORE_DB[h.universe]?.mediaType === 'manga' },
    { id: 'music', color: '#f1c40f', label: { fr: 'Faille Musique', en: 'Music Rift' }, desc: { fr: 'Rammstein, SOAD, Rob Zombie, Daft Punk, Oliver Tree, Vocaloid.', en: 'Rammstein, SOAD, Rob Zombie, Daft Punk, Oliver Tree, Vocaloid.' }, match: h => LORE_DB[h.universe]?.mediaType === 'music' || h.universe === 'Vocaloid' },
    { id: 'movie', color: '#ff5b6e', label: { fr: 'Faille Films & Series', en: 'Movies & TV Rift' }, desc: { fr: 'Cinema/series hors focus specialise.', en: 'Movie and TV worlds outside specialized focus.' }, match: h => ['movie', 'series'].includes(LORE_DB[h.universe]?.mediaType) }
  ];

  const bannerVisuals = {
    multi: { universe: 'Matrix', mode: 'RPG', shape: 'omniverse', focusRate: 1, meta: { fr: 'Pool complet - ideal pour remplir la collection.', en: 'Full pool - best for filling the collection.' } },
    scifi: { universe: 'Stargate', mode: 'RPG', shape: 'iris', focusRate: 0.7, meta: { fr: 'Marines sci-fi: PV, defense et reliques de front.', en: 'Sci-fi Marines: HP, defense, and frontline relics.' } },
    xeno_yautja: { universe: 'Alien', mode: 'Smash', shape: 'hive', focusRate: 0.7, meta: { fr: 'Traque, acide et plasma pour equipes agressives.', en: 'Hunt, acid, and plasma for aggressive teams.' } },
    horror: { universe: 'Silent Hill', mode: 'RPG', shape: 'sigil', focusRate: 0.7, meta: { fr: 'Controle, survie et pression de boss.', en: 'Control, survival, and boss pressure.' } },
    cyber: { universe: 'The Matrix', mode: 'Tactics', shape: 'code', focusRate: 0.7, meta: { fr: 'Vitesse, glitches et tempo ATB.', en: 'Speed, glitches, and ATB tempo.' } },
    arena: { universe: 'Yu-Gi-Oh', mode: 'Tactics', shape: 'duel', focusRate: 0.7, meta: { fr: 'Tactique, burst et reliques de precision.', en: 'Tactics, burst, and precision relics.' } },
    arcade: { universe: 'Unreal', mode: 'Smash', shape: 'arena', focusRate: 0.7, meta: { fr: 'Complete les synergies Slayer/Tactique.', en: 'Completes Slayer/Tactical synergies.' } },
    arcane: { universe: 'Harry Potter', mode: 'RPG', shape: 'rune', focusRate: 0.7, meta: { fr: 'Defense, magie et anomalies de controle.', en: 'Defense, magic, and control anomalies.' } },
    manga: { universe: 'Yu-Gi-Oh', mode: 'Tactics', shape: 'card', focusRate: 0.7, meta: { fr: 'Pool large pour archetypes hybrides.', en: 'Wide pool for hybrid archetypes.' } },
    music: { universe: 'Vocaloid', mode: 'Smash', shape: 'speaker', focusRate: 0.7, meta: { fr: 'Tempo, vitesse et buffs d equipe.', en: 'Tempo, speed, and squad buffs.' } },
    movie: { universe: 'Star Wars', mode: 'Smash', shape: 'cinema', focusRate: 0.7, meta: { fr: 'Signature flexible pour collections de films.', en: 'Flexible signature for movie collections.' } }
  };

  const baseActiveBanner = portalBanners.find(item => item.id === activeBanner) || portalBanners[0];
  const activeBannerData = { ...baseActiveBanner, ...(bannerVisuals[baseActiveBanner.id] || bannerVisuals.multi) };
  const hiddenUniverseSet = new Set(hiddenUniverses);
  const disabledHeroSet = new Set(disabledAssets.heroes || []);
  const visibleHeroes = HEROES_DB.filter(hero => !hiddenUniverseSet.has(hero.universe) && !disabledHeroSet.has(hero.id));
  const summonableHeroes = visibleHeroes;
  const activeBannerHeroes = summonableHeroes.filter(hero => activeBannerData.match(hero));
  const activeOwnedCount = activeBannerHeroes.filter(hero => unlockedHeroes.includes(hero.id)).length;
  const activeMissingCount = Math.max(0, activeBannerHeroes.length - activeOwnedCount);
  const activeBackdrop = getOpenAiBackdropSrc(activeBannerData.universe, activeBannerData.mode);

  const pickHero = (ownedIds, options = {}) => {
    const banner = activeBannerData;
    const bannerPool = summonableHeroes.filter(hero => banner.match(hero));
    const otherPool = summonableHeroes.filter(hero => !banner.match(hero));
    let targetPool = summonableHeroes;

    if (options.forceBanner && activeBanner !== 'multi' && bannerPool.length > 0) {
      targetPool = bannerPool;
    } else if (activeBanner !== 'multi' && Math.random() < banner.focusRate) {
      targetPool = bannerPool.length > 0 ? bannerPool : summonableHeroes;
    } else if (activeBanner !== 'multi') {
      targetPool = otherPool.length > 0 ? otherPool : summonableHeroes;
    }

    const lockedInPool = targetPool.filter(hero => !ownedIds.includes(hero.id));
    return lockedInPool.length > 0
      ? lockedInPool[Math.floor(Math.random() * lockedInPool.length)]
      : targetPool[Math.floor(Math.random() * targetPool.length)];
  };

  const handleSummon = () => {
    if (breachShards < cost || summoning || activeBannerHeroes.length === 0) return;

    setBreachShards(prev => prev - cost);
    setSummoning(true);
    setSummonedHero(null);
    setSummonedBatch(null);
    setSummonResult(null);
    setShowCard(false);
    
    sound.playSfx('portal');

    setTimeout(() => {
      const hero = pickHero(unlockedHeroes);
      const wasDuplicate = unlockedHeroes.includes(hero.id);

      setSummonedHero(hero);
      setSummonResult({ wasDuplicate, shardsReturned: wasDuplicate ? 25 : 0 });
      setSummoning(false);
      setShowCard(true);

      // Add to unlocked roster
      if (!wasDuplicate) {
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
    if (breachShards < tenCost || summoning || activeBannerHeroes.length === 0) return;

    setBreachShards(prev => prev - tenCost);
    setSummoning(true);
    setSummonedHero(null);
    setSummonedBatch(null);
    setSummonResult(null);
    setShowCard(false);

    sound.playSfx('portal');

    setTimeout(() => {
      const batch = [];
      const newUnlocked = [...unlockedHeroes];
      let shardsReturned = 0;

      for (let i = 0; i < 10; i++) {
        const hero = pickHero(newUnlocked, { forceBanner: i === 0 });
        const wasDuplicate = newUnlocked.includes(hero.id);
        batch.push({ hero, wasDuplicate });

        if (!wasDuplicate) {
          newUnlocked.push(hero.id);
        } else {
          shardsReturned += 25;
        }
      }

      setUnlockedHeroes(newUnlocked);
      setSummonResult({ shardsReturned });
      if (shardsReturned > 0) {
        setBreachShards(prev => prev + shardsReturned);
      }

      setSummonedBatch(batch);
      setSummoning(false);
      setShowCard(true);
      sound.playSfx('levelup');
    }, 2500);
  };

  const isDuplicate = Boolean(summonResult?.wasDuplicate);
  const summonedPlaque = summonedHero ? getCharacterPlaque(summonedHero) : null;
  const focusPercent = Math.round((activeBannerData.focusRate || 1) * 100);
  const bannerRateLine = activeBannerData.id === 'multi'
    ? (lang === 'fr' ? 'Tous les heros ont le meme poids de faille.' : 'All heroes share the same rift weight.')
    : (lang === 'fr' ? `${focusPercent}% de chance de viser ce booster. Invocation x10: premiere carte focus garantie.` : `${focusPercent}% chance to target this booster. x10 summon: first card guaranteed focus.`);
  const portalBackground = activeBackdrop
    ? `linear-gradient(180deg, rgba(4,2,10,0.55), rgba(4,2,10,0.92)), url(${activeBackdrop})`
    : `radial-gradient(circle, ${activeBannerData.color}22 0%, #050209 72%)`;

  return (
    <div className="portal-container" style={{
      padding: '30px 40px',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundImage: portalBackground,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
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
        {lang === 'fr'
          ? 'Injecte 50 Fragments dans une faille pour stabiliser une signature heroique compatible avec le Nexus.'
          : 'Inject 50 Shards into a rift to stabilize a heroic signature compatible with the Nexus.'}
      </p>

      {/* Banner Selectors */}
      <div style={{ width: '100%', maxWidth: '1060px', marginBottom: '25px', padding: '15px', background: 'rgba(5,4,12,0.72)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', backdropFilter: 'blur(6px)' }}>
        <div style={{ fontSize: '11px', color: '#ffea00', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {getTranslation(lang, 'bannerSelect')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
          {portalBanners.map(banner => {
            const visual = bannerVisuals[banner.id] || bannerVisuals.multi;
            const pack = { ...banner, ...visual };
            const bannerHeroes = summonableHeroes.filter(hero => banner.match(hero));
            const owned = bannerHeroes.filter(hero => unlockedHeroes.includes(hero.id)).length;
            const isActive = activeBanner === banner.id;
            const packImage = getOpenAiBackdropSrc(pack.universe, pack.mode);
            return (
              <button
                key={banner.id}
                onClick={() => { setActiveBanner(banner.id); sound.playSfx('click'); }}
                className={`portal-booster ${isActive ? 'selected' : ''}`}
                style={{
                  '--pack-color': banner.color,
                  backgroundImage: packImage ? `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.86)), url(${packImage})` : undefined
                }}
              >
                <span className="portal-booster-kicker">{pack.mode}</span>
                <span className="portal-booster-title">{banner.label[lang]}</span>
                <span className="portal-booster-desc">{banner.desc[lang]}</span>
                <span className="portal-booster-meta">
                  {owned}/{bannerHeroes.length} - {banner.id === 'multi' ? 'ALL' : `${Math.round(pack.focusRate * 100)}%`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="portal-focus-panel" style={{ '--portal-color': activeBannerData.color }}>
        <div className="portal-focus-info">
          <div className="portal-focus-kicker">{activeBannerData.mode} / {activeBannerData.universe}</div>
          <h2>{activeBannerData.label[lang]}</h2>
          <p>{activeBannerData.meta[lang]}</p>
          <div className="portal-focus-stats">
            <span>{activeOwnedCount}/{activeBannerHeroes.length}</span>
            <span>{activeMissingCount} {lang === 'fr' ? 'manquants' : 'missing'}</span>
            <span>{activeBannerData.id === 'multi' ? 'FULL POOL' : `${focusPercent}% FOCUS`}</span>
          </div>
          <div className="portal-focus-rate">{bannerRateLine}</div>
        </div>

        {/* Portal Swirl Animation / Card Reveal */}
        <div className="portal-core-stage">
        {summoning && (
          <div
            className={`portal-vortex summoning portal-shape-${activeBannerData.shape}`}
            style={{
              '--portal-image': activeBackdrop ? `url(${activeBackdrop})` : 'none',
              '--portal-color': activeBannerData.color
            }}
          >
            <span className="portal-energy portal-energy-back" />
            <span className="portal-energy portal-energy-front" />
            <span className="portal-fracture" />
            <span className="portal-core" />
          </div>
        )}

        {!summoning && !showCard && (
          <div
            className={`portal-vortex idle portal-shape-${activeBannerData.shape}`}
            data-label={activeBannerData.label[lang]}
            style={{
              '--portal-image': activeBackdrop ? `url(${activeBackdrop})` : 'none',
              '--portal-color': activeBannerData.color,
              cursor: breachShards >= cost && activeBannerHeroes.length > 0 ? 'pointer' : 'default',
              opacity: breachShards >= cost && activeBannerHeroes.length > 0 ? 1 : 0.58
            }}
            onClick={handleSummon}
          >
            <span className="portal-energy portal-energy-back" />
            <span className="portal-energy portal-energy-front" />
            <span className="portal-fracture" />
            <span className="portal-core" />
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
            {summonedPlaque && (
              <div style={{ margin: '0 0 10px 0', fontSize: '10px', lineHeight: 1.35, color: '#bbb' }}>
                <div style={{ color: summonedHero.primaryColor, fontWeight: 'bold', letterSpacing: '0.08em' }}>
                  {summonedPlaque.clearance} / {summonedPlaque.rank[lang]}
                </div>
                <div>{summonedPlaque.role[lang]}</div>
              </div>
            )}

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
            {summonedPlaque && (
              <div style={{ textAlign: 'left', fontSize: '10px', color: '#aaa', lineHeight: 1.35, borderTop: '1px solid #222', paddingTop: '8px' }}>
                {summonedPlaque.doctrine[lang]}
              </div>
            )}

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
              {summonedBatch.map((entry, idx) => {
                const hero = entry.hero || entry;
                const plaque = getCharacterPlaque(hero);
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
                      {plaque.clearance}
                    </div>
                    <div style={{ fontSize: '8px', color: entry.wasDuplicate ? '#ffeb3b' : '#2ecc71', marginTop: '2px' }}>
                      {entry.wasDuplicate ? (lang === 'fr' ? 'DOUBLE +25' : 'DUPLICATE +25') : (lang === 'fr' ? 'NOUVEAU' : 'NEW')}
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
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
        {!summoning && (
          <>
            <button
              onClick={handleSummon}
              disabled={breachShards < cost || activeBannerHeroes.length === 0}
              className={`btn-retro ${breachShards < cost || activeBannerHeroes.length === 0 ? 'btn-disabled' : ''}`}
              style={{ fontSize: '13px', padding: '10px 20px', borderColor: activeBannerData.color, color: '#fff', background: `${activeBannerData.color}26` }}
            >
              {getTranslation(lang, 'costLabel')}
            </button>
            <button
              onClick={handleSummonTen}
              disabled={breachShards < 450 || activeBannerHeroes.length === 0}
              className={`btn-retro ${breachShards < 450 || activeBannerHeroes.length === 0 ? 'btn-disabled' : ''}`}
              style={{ fontSize: '13px', padding: '10px 20px', borderColor: '#ffea00', color: '#fff', background: 'rgba(255, 234, 0, 0.15)' }}
            >
              {getTranslation(lang, 'btnSummonTen')} {activeBannerData.id !== 'multi' ? (lang === 'fr' ? '+ FOCUS' : '+ FOCUS') : ''}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
