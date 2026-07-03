import React, { useState } from 'react';
import { HEROES_DB } from '../game/heroes';
import sound from '../game/soundEngine';
import { drawPixelSprite, getOpenAiBackdropSrc } from '../game/renderer';
import { getTranslation } from '../game/translation';
import { LORE_DB } from '../game/lore';
import { getCharacterPlaque } from '../game/characterPlaques';
import { EXPANDED_FACTION_UNIVERSES } from '../game/expandedUniverses';

const PORTAL_RARITIES = {
  common: { id: 'common', label: { fr: 'Stable', en: 'Stable' }, color: '#9fb6bb', weight: 58, duplicateRefund: 18 },
  rare: { id: 'rare', label: { fr: 'Rare', en: 'Rare' }, color: '#3498db', weight: 28, duplicateRefund: 25 },
  epic: { id: 'epic', label: { fr: 'Epique', en: 'Epic' }, color: '#9b59b6', weight: 11, duplicateRefund: 35 },
  anomaly: { id: 'anomaly', label: { fr: 'Anomalie', en: 'Anomaly' }, color: '#ffb000', weight: 3, duplicateRefund: 55 }
};

const CORE_ANOMALY_IDS = new Set(['masterchief', 'predator', 'pyramidhead', 'neo', 'doomslayer', 'vader', 'rick', 'jigsaw', 'yugi']);
const CORE_EPIC_IDS = new Set(['marcus', 'ripley', 'freeman', 'snake', 'solbadguy', 'ragna', 'shepard', 'luke', 'isaac', 'taichi', 'motoko']);

const getHeroRarity = (hero) => {
  if (!hero) return PORTAL_RARITIES.common;
  if (CORE_ANOMALY_IDS.has(hero.id)) return PORTAL_RARITIES.anomaly;
  if (CORE_EPIC_IDS.has(hero.id)) return PORTAL_RARITIES.epic;
  const stats = hero.stats || {};
  const powerScore = (stats.hp || 0) * 0.08
    + (stats.atk || 0) * 3.5
    + (stats.def || 0) * 3
    + (stats.spd || 0) * 4
    + (hero.special?.dmg || 0) * 7;
  if (powerScore >= 158) return PORTAL_RARITIES.anomaly;
  if (powerScore >= 142) return PORTAL_RARITIES.epic;
  if (powerScore >= 124) return PORTAL_RARITIES.rare;
  return PORTAL_RARITIES.common;
};

const getWeightedHero = (pool) => {
  if (!pool.length) return null;
  const weighted = pool.map(hero => ({ hero, weight: getHeroRarity(hero).weight }));
  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * total;
  for (const entry of weighted) {
    roll -= entry.weight;
    if (roll <= 0) return entry.hero;
  }
  return weighted[weighted.length - 1].hero;
};

const getPoolRateSummary = (pool, lang) => {
  if (!pool.length) return [];
  const weightByRarity = Object.values(PORTAL_RARITIES).reduce((acc, rarity) => ({ ...acc, [rarity.id]: 0 }), {});
  pool.forEach(hero => {
    const rarity = getHeroRarity(hero);
    weightByRarity[rarity.id] += rarity.weight;
  });
  const total = Object.values(weightByRarity).reduce((sum, value) => sum + value, 0) || 1;
  return Object.values(PORTAL_RARITIES)
    .filter(rarity => weightByRarity[rarity.id] > 0)
    .map(rarity => {
      const percent = (weightByRarity[rarity.id] / total) * 100;
      const displayPercent = percent < 1 ? percent.toFixed(1) : Math.round(percent);
      return {
        ...rarity,
        percent,
        text: `${rarity.label[lang]} ${displayPercent}%`
      };
    });
};

export default function PortalScreen({ lang, breachShards, setBreachShards, portalStats, setPortalStats, unlockedHeroes, setUnlockedHeroes, hiddenUniverses = [], disabledAssets = {}, onBack }) {
  const [summoning, setSummoning] = useState(false);
  const [summonedHero, setSummonedHero] = useState(null);
  const [summonedBatch, setSummonedBatch] = useState(null);
  const [summonResult, setSummonResult] = useState(null);
  const [showCard, setShowCard] = useState(false);
  
  // New Banner selection state
  const [activeBanner, setActiveBanner] = useState('nexus');

  const cost = 50;
  const portalBanners = [
    { id: 'nexus', color: '#39c5bb', label: { fr: 'Portail Nexus OC', en: 'OC Nexus Portal' }, desc: { fr: 'Personnages originaux du jeu de base.', en: 'Original base-game characters.' }, match: h => h.universe === 'Nexus de Convergence' },
    { id: 'multi', color: '#9b59b6', label: { fr: 'Portail Multivers', en: 'Multiverse Portal' }, desc: { fr: 'Toutes les signatures heroiques detectables.', en: 'All detectable heroic signatures.' }, match: () => true },
    { id: 'scifi', color: '#3498db', label: { fr: 'Faille Sci-Fi', en: 'Sci-Fi Rift' }, desc: { fr: 'Halo, Mass Effect, Portal, Stargate, Gears.', en: 'Halo, Mass Effect, Portal, Stargate, Gears.' }, match: h => ['Halo', 'Gears of War', 'Mass Effect', 'Stargate', 'Portal', 'Half-Life', 'Star Wars', 'Le Cinquième Element', ...EXPANDED_FACTION_UNIVERSES.sciFi].includes(h.universe) },
    { id: 'xeno_yautja', color: '#8adbe6', label: { fr: 'Faille Xeno-Yautja', en: 'Xeno-Yautja Rift' }, desc: { fr: 'Alien, Predator, Prometheus, AVP.', en: 'Alien, Predator, Prometheus, AVP.' }, match: h => /Alien|Predator|Prometheus|Prey/.test(h.universe) },
    { id: 'horror', color: '#e74c3c', label: { fr: 'Faille Horreur', en: 'Horror Rift' }, desc: { fr: 'Resident Evil, Silent Hill, Chucky, Saw, Hellraiser.', en: 'Resident Evil, Silent Hill, Chucky, Saw, Hellraiser.' }, match: h => h.category === 'horror' || ['Resident Evil', 'Silent Hill', 'Chucky', 'Hellraiser', 'Saw', 'Slender Man', 'Scary Movie', 'Dead Space', 'Hazbin Hotel', 'Rob Zombie', ...EXPANDED_FACTION_UNIVERSES.horror].includes(h.universe) },
    { id: 'cyber', color: '#39ffcc', label: { fr: 'Faille Cyber', en: 'Cyber Rift' }, desc: { fr: 'Matrix, Ghost in the Shell, Digital Circus, Digimon.', en: 'Matrix, Ghost in the Shell, Digital Circus, Digimon.' }, match: h => ['The Matrix', 'Ghost in the Shell', 'Digital Circus', 'Digimon', 'Daft Punk', 'Oliver Tree', ...EXPANDED_FACTION_UNIVERSES.cyber].includes(h.universe) },
    { id: 'arena', color: '#e67e22', label: { fr: 'Faille Duel & Arene', en: 'Duel & Arena Rift' }, desc: { fr: 'Metal Gear, Payday, Yu-Gi-Oh, Guilty Gear, BlazBlue, Unreal.', en: 'Metal Gear, Payday, Yu-Gi-Oh, Guilty Gear, BlazBlue, Unreal.' }, match: h => ['Metal Gear', 'Payday', 'Yu-Gi-Oh', 'Guilty Gear', 'BlazBlue', 'Unreal'].includes(h.universe) },
    { id: 'arcade', color: '#e67e22', label: { fr: 'Faille Arcade', en: 'Arcade Rift' }, desc: { fr: 'Combattants, tacticiens et arènes.', en: 'Fighters, tacticians, and arenas.' }, match: h => h.category === 'slayer' || h.category === 'tactical' || ['Vocaloid', 'Unreal'].includes(h.universe) },
    { id: 'arcane', color: '#d9b86b', label: { fr: 'Faille Arcane', en: 'Arcane Rift' }, desc: { fr: 'Discworld, Kaamelott, Dungeon Meshi, Noob, magie.', en: 'Discworld, Kaamelott, Dungeon Meshi, Noob, magic.' }, match: h => ['Discworld', 'Kaamelott', 'Dungeon Meshi', 'Noob', 'Harry Potter', 'Negima', 'Rosario + Vampire', ...EXPANDED_FACTION_UNIVERSES.arcane].includes(h.universe) },
    { id: 'manga', color: '#9b59b6', label: { fr: 'Faille Manga & Web', en: 'Manga & Web Rift' }, desc: { fr: 'Univers manga, web et animation.', en: 'Manga, web, and animation worlds.' }, match: h => LORE_DB[h.universe]?.mediaType === 'manga' },
    { id: 'music', color: '#f1c40f', label: { fr: 'Faille Musique', en: 'Music Rift' }, desc: { fr: 'Rammstein, SOAD, Rob Zombie, Daft Punk, Oliver Tree, Vocaloid.', en: 'Rammstein, SOAD, Rob Zombie, Daft Punk, Oliver Tree, Vocaloid.' }, match: h => LORE_DB[h.universe]?.mediaType === 'music' || h.universe === 'Vocaloid' },
    { id: 'movie', color: '#ff5b6e', label: { fr: 'Faille Films & Series', en: 'Movies & TV Rift' }, desc: { fr: 'Archives ecran hors cercle specialise.', en: 'Screen archives outside specialized circles.' }, match: h => ['movie', 'series'].includes(LORE_DB[h.universe]?.mediaType) }
  ];

  const bannerVisuals = {
    nexus: { universe: 'Nexus de Convergence', mode: 'RPG', shape: 'omniverse', focusRate: 1, meta: { fr: 'Bassin OC: A.R.C.A. recrute des Ancres et agents natifs du Nexus.', en: 'OC pool: A.R.C.A. recruits Anchors and native Nexus agents.' } },
    multi: { universe: 'Matrix', mode: 'RPG', shape: 'omniverse', focusRate: 1, meta: { fr: 'Spectre complet: A.R.C.A. ouvre toutes les familles de Trames detectables.', en: 'Complete spectrum: A.R.C.A. opens every detectable Thread family.' } },
    scifi: { universe: 'Stargate', mode: 'RPG', shape: 'iris', focusRate: 0.7, meta: { fr: 'Signatures de front: blindage, commandement et lignes de defense.', en: 'Frontline signatures: armor, command, and defensive lines.' } },
    xeno_yautja: { universe: 'Alien', mode: 'Smash', shape: 'hive', focusRate: 0.7, meta: { fr: 'Traques primitives: acide, plasma et rites de chasse.', en: 'Primal hunts: acid, plasma, and hunting rites.' } },
    horror: { universe: 'Silent Hill', mode: 'RPG', shape: 'sigil', focusRate: 0.7, meta: { fr: 'Signaux de peur: survie, controle et resistance aux noyaux hostiles.', en: 'Fear signals: survival, control, and resistance against hostile cores.' } },
    cyber: { universe: 'The Matrix', mode: 'Tactics', shape: 'code', focusRate: 0.7, meta: { fr: 'Trames codees: initiative, interruptions et permissions volees.', en: 'Coded Threads: initiative, interrupts, and stolen permissions.' } },
    arena: { universe: 'Yu-Gi-Oh', mode: 'Tactics', shape: 'duel', focusRate: 0.7, meta: { fr: 'Lois de duel: precision, contrat et frappe ritualisee.', en: 'Duel laws: precision, contract, and ritualized strikes.' } },
    arcade: { universe: 'Unreal', mode: 'Smash', shape: 'arena', focusRate: 0.7, meta: { fr: 'Arenes rapides: signatures de choc et cellules tactiques.', en: 'Fast arenas: impact signatures and tactical cells.' } },
    arcane: { universe: 'Harry Potter', mode: 'RPG', shape: 'rune', focusRate: 0.7, meta: { fr: 'Runes convergentes: defense, magie et controle des anomalies.', en: 'Converging runes: defense, magic, and anomaly control.' } },
    manga: { universe: 'Yu-Gi-Oh', mode: 'Tactics', shape: 'card', focusRate: 0.7, meta: { fr: 'Trames hybrides: transformations, rivalites et lois d arc.', en: 'Hybrid Threads: transformations, rivalries, and arc laws.' } },
    music: { universe: 'Vocaloid', mode: 'Smash', shape: 'speaker', focusRate: 0.7, meta: { fr: 'Resonances de scene: tempo, vitesse et choeurs d escouade.', en: 'Stage resonances: tempo, speed, and squad choruses.' } },
    movie: { universe: 'Star Wars', mode: 'Smash', shape: 'cinema', focusRate: 0.7, meta: { fr: 'Trames ecran: signatures souples pour archives cinema et series.', en: 'Screen Threads: flexible signatures for film and series archives.' } }
  };

  const hiddenUniverseSet = new Set(hiddenUniverses);
  const disabledHeroSet = new Set(disabledAssets.heroes || []);
  const visibleHeroes = HEROES_DB.filter(hero => !hiddenUniverseSet.has(hero.universe) && !disabledHeroSet.has(hero.id));
  const summonableHeroes = visibleHeroes;
  const visiblePortalBanners = portalBanners.filter(banner => (
    banner.id === 'nexus'
    || banner.id === 'multi'
    || summonableHeroes.some(hero => banner.match(hero) && hero.universe !== 'Nexus de Convergence')
  ));
  const baseActiveBanner = visiblePortalBanners.find(item => item.id === activeBanner)
    || visiblePortalBanners.find(item => item.id === 'nexus')
    || visiblePortalBanners[0]
    || portalBanners[0];
  const activeBannerData = { ...baseActiveBanner, ...(bannerVisuals[baseActiveBanner.id] || bannerVisuals.multi) };
  const activeBannerHeroes = summonableHeroes.filter(hero => activeBannerData.match(hero));
  const activeOwnedCount = activeBannerHeroes.filter(hero => unlockedHeroes.includes(hero.id)).length;
  const activeMissingCount = Math.max(0, activeBannerHeroes.length - activeOwnedCount);
  const activeRateSummary = getPoolRateSummary(activeBannerHeroes, lang);
  const activeBackdrop = getOpenAiBackdropSrc(activeBannerData.universe, activeBannerData.mode);
  const pityLimit = 6;
  const duplicateStreak = portalStats?.duplicateStreak || 0;
  const pityReady = duplicateStreak >= pityLimit;

  const pushPortalHistory = (entries) => {
    const normalized = entries.map(entry => ({
      heroId: entry.hero.id,
      name: entry.hero.name,
      universe: entry.hero.universe,
      rarity: entry.rarity.id,
      rarityLabel: entry.rarity.label[lang],
      rarityColor: entry.rarity.color,
      banner: activeBannerData.id,
      duplicate: entry.wasDuplicate,
      shardsReturned: entry.shardsReturned || 0,
      at: new Date().toISOString()
    }));
    const lastEntry = normalized[normalized.length - 1];
    setPortalStats(prev => ({
      pulls: (prev?.pulls || 0) + normalized.length,
      duplicateStreak: normalized.reduce(
        (streak, entry) => entry.duplicate ? streak + 1 : 0,
        prev?.duplicateStreak || 0
      ),
      lastPull: lastEntry,
      history: [...normalized.reverse(), ...(prev?.history || [])].slice(0, 20)
    }));
  };

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
    if (options.forceNew && lockedInPool.length > 0) {
      return getWeightedHero(lockedInPool);
    }
    return lockedInPool.length > 0
      ? getWeightedHero(lockedInPool)
      : getWeightedHero(targetPool);
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
      const hero = pickHero(unlockedHeroes, { forceNew: pityReady });
      const rarity = getHeroRarity(hero);
      const wasDuplicate = unlockedHeroes.includes(hero.id);
      const shardsReturned = wasDuplicate ? rarity.duplicateRefund : 0;

      setSummonedHero(hero);
      setSummonResult({ wasDuplicate, rarity, shardsReturned });
      setSummoning(false);
      setShowCard(true);

      // Add to unlocked roster
      if (!wasDuplicate) {
        setUnlockedHeroes(prev => [...prev, hero.id]);
        sound.playSfx('levelup');
      } else {
        setBreachShards(prev => prev + shardsReturned);
        sound.playSfx('coin');
      }
      pushPortalHistory([{ hero, rarity, wasDuplicate, shardsReturned }]);
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
        const hero = pickHero(newUnlocked, { forceBanner: i === 0, forceNew: pityReady && i === 0 });
        const rarity = getHeroRarity(hero);
        const wasDuplicate = newUnlocked.includes(hero.id);
        const refund = wasDuplicate ? rarity.duplicateRefund : 0;
        batch.push({ hero, rarity, wasDuplicate, shardsReturned: refund });

        if (!wasDuplicate) {
          newUnlocked.push(hero.id);
        } else {
          shardsReturned += refund;
        }
      }

      setUnlockedHeroes(newUnlocked);
      setSummonResult({ shardsReturned });
      if (shardsReturned > 0) {
        setBreachShards(prev => prev + shardsReturned);
      }

      setSummonedBatch(batch);
      pushPortalHistory(batch);
      setSummoning(false);
      setShowCard(true);
      sound.playSfx('levelup');
    }, 2500);
  };

  const isDuplicate = Boolean(summonResult?.wasDuplicate);
  const summonedPlaque = summonedHero ? getCharacterPlaque(summonedHero) : null;
  const summonedRarity = summonedHero ? (summonResult?.rarity || getHeroRarity(summonedHero)) : null;
  const focusPercent = Math.round((activeBannerData.focusRate || 1) * 100);
  const bannerRateLine = activeBannerData.id === 'multi'
    ? (lang === 'fr' ? 'Tous les heros ont le meme poids de faille.' : 'All heroes share the same rift weight.')
    : (lang === 'fr' ? `Poids de faille ${focusPercent}: le booster attire cette famille de Trames. Appel x10: premiere carte harmonisee.` : `Rift weight ${focusPercent}: the booster attracts this Thread family. x10 call: first card harmonized.`);
  const pityLine = pityReady
    ? (lang === 'fr' ? 'Compas Nexus actif: le prochain appel cherche une signature absente.' : 'Nexus compass active: next call seeks a missing signature.')
    : (lang === 'fr' ? `Compas Nexus dans ${pityLimit - duplicateStreak} echo(s) deja scelle(s).` : `Nexus compass in ${pityLimit - duplicateStreak} already-sealed echo(es).`);
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
        <button onClick={onBack} className="btn-retro" title={lang === 'fr' ? 'Retourne au hub sans depenser de fragments.' : 'Return to the hub without spending shards.'}>{getTranslation(lang, 'backToHub')}</button>
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
          {visiblePortalBanners.map(banner => {
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
                title={lang === 'fr'
                  ? `Selectionne cette banniere. Elle change les heros possibles et les chances de focus: ${owned}/${bannerHeroes.length} deja obtenus.`
                  : `Select this banner. It changes possible heroes and focus odds: ${owned}/${bannerHeroes.length} already owned.`}
                style={{
                  '--pack-color': banner.color,
                  backgroundImage: packImage ? `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.86)), url(${packImage})` : undefined
                }}
              >
                <span className="portal-booster-kicker">{pack.mode}</span>
                <span className="portal-booster-title">{banner.label[lang]}</span>
                <span className="portal-booster-desc">{banner.desc[lang]}</span>
                <span className="portal-booster-meta">
                  {owned}/{bannerHeroes.length} - {banner.id === 'multi' ? (lang === 'fr' ? 'SPECTRE' : 'SPECTRUM') : `${Math.round(pack.focusRate * 100)} POIDS`}
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
            <span>{activeMissingCount} {lang === 'fr' ? 'signatures absentes' : 'absent signatures'}</span>
            <span>{activeBannerData.id === 'multi' ? (lang === 'fr' ? 'SPECTRE COMPLET' : 'FULL SPECTRUM') : `${focusPercent} POIDS DE FAILLE`}</span>
          </div>
          <div className="portal-rate-grid">
            {activeRateSummary.map(rarity => (
              <span key={rarity.id} style={{ '--rarity-color': rarity.color }}>
                {rarity.text}
              </span>
            ))}
          </div>
          <div className="portal-focus-rate">{bannerRateLine}</div>
          <div className="portal-focus-rate" style={{ marginTop: '6px', color: pityReady ? '#2ecc71' : '#ffea00' }}>
            {pityLine}
          </div>
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
            {summonedRarity && (
              <div className="portal-rarity-badge" style={{ '--rarity-color': summonedRarity.color }}>
                {summonedRarity.label[lang]} / +{summonedRarity.duplicateRefund}
              </div>
            )}
            
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
                {summonedPlaque.protocol && (
                  <div style={{ marginTop: '6px', color: '#9fd8ff' }}>
                    {summonedPlaque.protocol[lang]}
                  </div>
                )}
              </div>
            )}

            {isDuplicate && (
              <div style={{ color: '#ffeb3b', fontSize: '10px', marginTop: '6px' }}>
                {lang === 'fr'
                  ? `Echo deja scelle: ${summonResult?.shardsReturned || 0} Fragments rendus.`
                  : `Already sealed echo: ${summonResult?.shardsReturned || 0} Shards returned.`}
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
              {lang === 'fr' ? 'RESULTATS DE L INVOCATION x10' : 'SUMMON x10 BATCH RESULTS'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
              {summonedBatch.map((entry, idx) => {
                const hero = entry.hero || entry;
                const plaque = getCharacterPlaque(hero);
                const rarity = entry.rarity || getHeroRarity(hero);
                return (
                  <div key={idx} style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: `1px solid ${rarity.color}`,
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
                    <div style={{ fontSize: '8px', color: rarity.color, marginTop: '2px', fontWeight: 'bold' }}>
                      {rarity.label[lang]}
                    </div>
                    <div style={{ fontSize: '8px', color: entry.wasDuplicate ? '#ffeb3b' : '#2ecc71', marginTop: '2px' }}>
                      {entry.wasDuplicate ? `ECHO +${entry.shardsReturned || rarity.duplicateRefund}` : (lang === 'fr' ? 'NOUVEAU' : 'NEW')}
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
                ? `Les echos deja scelles ont ete convertis selon leur rarete: +${summonResult?.shardsReturned || 0} Fragments rendus.`
                : `Already sealed echoes converted by rarity: +${summonResult?.shardsReturned || 0} Shards returned.`}
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
              title={lang === 'fr'
                ? `Depense ${cost} Fragments pour obtenir 1 heros de la banniere active. Les doublons rendent des fragments.`
                : `Spend ${cost} Shards to obtain 1 hero from the active banner. Duplicates refund shards.`}
              style={{ fontSize: '13px', padding: '10px 20px', borderColor: activeBannerData.color, color: '#fff', background: `${activeBannerData.color}26` }}
            >
              {getTranslation(lang, 'costLabel')}
            </button>
            <button
              onClick={handleSummonTen}
              disabled={breachShards < 450 || activeBannerHeroes.length === 0}
              className={`btn-retro ${breachShards < 450 || activeBannerHeroes.length === 0 ? 'btn-disabled' : ''}`}
              title={lang === 'fr'
                ? 'Depense 450 Fragments pour 10 tirages. Utile pour completer plus vite une banniere.'
                : 'Spend 450 Shards for 10 pulls. Useful to complete a banner faster.'}
              style={{ fontSize: '13px', padding: '10px 20px', borderColor: '#ffea00', color: '#fff', background: 'rgba(255, 234, 0, 0.15)' }}
            >
              {getTranslation(lang, 'btnSummonTen')} {activeBannerData.id !== 'multi' ? (lang === 'fr' ? '+ HARMONIE' : '+ HARMONY') : ''}
            </button>
          </>
        )}
      </div>

      {(portalStats?.history || []).length > 0 && (
        <div className="portal-focus-panel" style={{ '--portal-color': activeBannerData.color, marginTop: '18px', maxWidth: '1060px', width: '100%', gridTemplateColumns: '1fr' }}>
          <div className="portal-focus-info">
            <div className="portal-focus-kicker">
              {lang === 'fr' ? 'Historique de faille' : 'Rift history'} / {portalStats?.pulls || 0} {lang === 'fr' ? 'appels' : 'calls'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '8px', marginTop: '10px' }}>
              {(portalStats?.history || []).slice(0, 8).map((entry, idx) => (
                <div key={`${entry.heroId}-${entry.at}-${idx}`} style={{
                  padding: '8px',
                  border: `1px solid ${entry.duplicate ? 'rgba(255,234,0,0.35)' : 'rgba(46,204,113,0.35)'}`,
                  background: entry.duplicate ? 'rgba(255,234,0,0.06)' : 'rgba(46,204,113,0.06)',
                  borderRadius: '4px'
                }}>
                  <strong style={{ display: 'block', color: '#fff', fontSize: '11px' }}>{entry.name}</strong>
                  <span style={{ display: 'block', color: entry.rarityColor || '#aaa', fontSize: '9px', marginTop: '3px' }}>
                    {entry.rarityLabel || entry.rarity || 'Stable'} / {entry.universe} / {entry.banner}
                  </span>
                  <span style={{ display: 'block', color: entry.duplicate ? '#ffea00' : '#2ecc71', fontSize: '9px', marginTop: '3px' }}>
                    {entry.duplicate ? (lang === 'fr' ? `Echo scelle converti +${entry.shardsReturned || 0}` : `Sealed echo converted +${entry.shardsReturned || 0}`) : (lang === 'fr' ? 'Nouvelle signature' : 'New signature')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
