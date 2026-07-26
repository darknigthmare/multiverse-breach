import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EQUIP_ITEMS_DB, EVENT_ITEMS_DB, HEROES_DB } from '../game/heroes';
import sound from '../game/soundEngine';
import { drawPixelSprite, getOpenAiBackdropSrc } from '../game/renderer';
import { getTranslation } from '../game/translation';
import { LORE_DB } from '../game/lore';
import { SKIN_CATALOG } from '../game/narrativeSystems';
import { BOOSTER_CARD_COUNT, createBoosterRewards } from '../game/portalBoosterEngine';
import {
  BOOSTER_ROTATION_WINDOW_MS,
  getPortalBoosterArt,
  getPortalBoosterRotation,
  MULTIVERSE_CONVERGENCE_BOOSTER_ART
} from '../game/portalBoosterCatalog';

const PORTAL_RARITIES = {
  common: { id: 'common', label: { fr: 'Stable', en: 'Stable' }, color: '#9fb6bb', weight: 58, duplicateRefund: 12 },
  rare: { id: 'rare', label: { fr: 'Rare', en: 'Rare' }, color: '#3498db', weight: 28, duplicateRefund: 20 },
  epic: { id: 'epic', label: { fr: 'Epique', en: 'Epic' }, color: '#9b59b6', weight: 11, duplicateRefund: 32 },
  anomaly: { id: 'anomaly', label: { fr: 'Anomalie', en: 'Anomaly' }, color: '#ffb000', weight: 3, duplicateRefund: 50 }
};

const CORE_ANOMALY_IDS = new Set(['masterchief', 'predator', 'pyramidhead', 'neo', 'doomslayer', 'vader', 'rick', 'jigsaw', 'yugi']);
const CORE_EPIC_IDS = new Set(['marcus', 'ripley', 'freeman', 'snake', 'solbadguy', 'ragna', 'shepard', 'luke', 'isaac', 'taichi', 'motoko']);
const NEXUS_UNIVERSE = 'Nexus de Convergence';
const BOOSTER_COST = 100;
const PITY_LIMIT = 6;
const HERO_BY_ID = new Map(HEROES_DB.map(hero => [hero.id, hero]));
const COLLECTIBLE_SKINS = Object.values(SKIN_CATALOG)
  .filter(skin => skin.id !== 'default' && skin.heroId && HERO_BY_ID.has(skin.heroId));

const MEDIA_PORTAL_PROFILES = {
  game: { mode: 'RPG', shape: 'arena', color: '#58a6ff', label: { fr: 'JEU', en: 'GAME' } },
  movie: { mode: 'Smash', shape: 'cinema', color: '#ff5b6e', label: { fr: 'FILM', en: 'MOVIE' } },
  series: { mode: 'Tactics', shape: 'iris', color: '#39c5bb', label: { fr: 'SERIE', en: 'SERIES' } },
  manga: { mode: 'Tactics', shape: 'card', color: '#b27cff', label: { fr: 'MANGA', en: 'MANGA' } },
  music: { mode: 'Smash', shape: 'speaker', color: '#f1c40f', label: { fr: 'MUSIQUE', en: 'MUSIC' } },
  other: { mode: 'RPG', shape: 'omniverse', color: '#9b59b6', label: { fr: 'TRAME', en: 'THREAD' } }
};

const REWARD_KIND_LABELS = {
  hero: { fr: 'PERSONNAGE', en: 'CHARACTER' },
  equipment: { fr: 'EQUIPEMENT', en: 'EQUIPMENT' },
  event: { fr: 'PROTOCOLE', en: 'PROTOCOL' },
  skin: { fr: 'APPARENCE', en: 'APPEARANCE' },
  archive: { fr: 'ARCHIVE DE SCENE', en: 'STAGE ARCHIVE' },
  hud: { fr: 'THEME HUD', en: 'HUD THEME' }
};

const REWARD_KIND_GLYPHS = {
  hero: 'A',
  equipment: 'E',
  event: 'P',
  skin: 'S',
  archive: 'Ω',
  hud: 'H'
};

const REWARD_KIND_ORDER = ['hero', 'equipment', 'event', 'skin', 'archive', 'hud'];
const REWARD_MANIFEST_LIMIT = 12;

const OPENING_STATUS = {
  sealed: {
    fr: 'Booster scelle. Decoupe de securite prete.',
    en: 'Booster sealed. Safety cut ready.'
  },
  charging: {
    fr: 'La Trame charge le guide de coupe.',
    en: 'The Thread is charging the cutting guide.'
  },
  cutting: {
    fr: 'Decoupe de la soudure superieure.',
    en: 'Cutting the upper seal.'
  },
  opening: {
    fr: 'Ouverture du sachet. Cinq signatures detectees.',
    en: 'Opening wrapper. Five signatures detected.'
  },
  revealing: {
    fr: 'Booster ouvert. Retourne les cinq cartes.',
    en: 'Booster opened. Flip all five cards.'
  },
  complete: {
    fr: 'Les cinq cartes sont stabilisees et sauvegardees.',
    en: 'All five cards are stabilized and saved.'
  }
};

const getLocalizedText = (value, lang) => {
  if (typeof value === 'string') return value;
  return value?.[lang] || value?.fr || value?.en || '';
};

const appendUnique = (items = [], additions = []) => {
  const next = [...items];
  additions.forEach(item => {
    if (!next.includes(item)) next.push(item);
  });
  return next;
};

const appendUniqueObjects = (items = [], additions = []) => {
  const next = [...items];
  const knownIds = new Set(next.map(item => item.id));
  additions.forEach(item => {
    if (!knownIds.has(item.id)) {
      next.push(item);
      knownIds.add(item.id);
    }
  });
  return next;
};

const formatRotationCountdown = (remainingMs, lang) => {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const unit = lang === 'fr' ? 'rotation' : 'rotation';
  return `${unit} ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
};

const getUniversePortalProfile = (universe, heroes) => {
  const mediaType = LORE_DB[universe]?.mediaType || 'other';
  const profile = MEDIA_PORTAL_PROFILES[mediaType] || MEDIA_PORTAL_PROFILES.other;
  const heroColor = heroes.find(hero => hero.primaryColor)?.primaryColor;
  return { ...profile, mediaType, color: heroColor || profile.color };
};

const normalizePackSearch = (value) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase();

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

const getEquipmentRarity = (item) => {
  const cost = Number(item?.cost || 0);
  if (cost >= 125) return PORTAL_RARITIES.epic;
  if (cost >= 85) return PORTAL_RARITIES.rare;
  return PORTAL_RARITIES.common;
};

const getRewardDetail = (reward, lang) => {
  if (reward.kind === 'hero') {
    return `HP ${reward.data.hero.stats?.hp || 0} / ATK ${reward.data.hero.stats?.atk || 0}`;
  }
  if (reward.kind === 'equipment') {
    const boost = Object.entries(reward.data.item.boost || {})
      .map(([stat, value]) => `${stat.toUpperCase()} +${value}`)
      .join(' / ');
    return boost || (lang === 'fr' ? 'Relique equipable' : 'Equippable relic');
  }
  if (reward.kind === 'event') {
    return lang === 'fr' ? 'Objet evenementiel equipable' : 'Equippable event item';
  }
  if (reward.kind === 'skin') {
    return `${lang === 'fr' ? 'Pour' : 'For'} ${reward.data.hero.name}`;
  }
  if (reward.kind === 'archive') {
    return `${reward.data.mode} / ${lang === 'fr' ? 'collection visuelle' : 'visual collection'}`;
  }
  return lang === 'fr' ? 'Fond du controle Nexus' : 'Nexus control backdrop';
};

const makeBoosterCandidates = ({
  banner,
  visibleHeroes,
  disabledGearIds
}) => {
  const scopedHeroes = banner.id === 'multi'
    ? visibleHeroes
    : visibleHeroes.filter(hero => banner.match(hero));
  const scopedHeroIds = new Set(scopedHeroes.map(hero => hero.id));
  const universes = [...new Set(scopedHeroes.map(hero => hero.universe || NEXUS_UNIVERSE))];
  const universeSet = new Set(universes);
  const candidates = [];

  scopedHeroes.forEach(hero => {
    candidates.push({
      id: `hero:${hero.id}`,
      rewardId: hero.id,
      kind: 'hero',
      name: hero.name,
      universe: hero.universe,
      color: hero.primaryColor || banner.color,
      rarity: getHeroRarity(hero),
      data: { hero }
    });
  });

  EQUIP_ITEMS_DB.forEach(item => {
    if (!universeSet.has(item.universe) || disabledGearIds.has(item.id)) return;
    candidates.push({
      id: `equipment:${item.id}`,
      rewardId: item.id,
      kind: 'equipment',
      name: item.name,
      universe: item.universe,
      color: banner.color,
      rarity: getEquipmentRarity(item),
      data: { item }
    });
  });

  universes.forEach(universe => {
    const eventItem = EVENT_ITEMS_DB[universe];
    if (!eventItem || disabledGearIds.has(eventItem.id)) return;
    candidates.push({
      id: `event:${eventItem.id}`,
      rewardId: eventItem.id,
      kind: 'event',
      name: eventItem.name,
      universe,
      color: banner.color,
      rarity: PORTAL_RARITIES.epic,
      data: { item: { ...eventItem, universe } }
    });
  });

  COLLECTIBLE_SKINS.forEach(skin => {
    if (!scopedHeroIds.has(skin.heroId)) return;
    const hero = HERO_BY_ID.get(skin.heroId);
    candidates.push({
      id: `skin:${skin.id}`,
      rewardId: skin.id,
      kind: 'skin',
      name: skin.name,
      universe: hero.universe,
      color: skin.colors?.primaryColor || hero.primaryColor || banner.color,
      rarity: PORTAL_RARITIES.epic,
      data: { skin, hero: { ...hero, ...(skin.colors || {}) } }
    });
  });

  universes.forEach(universe => {
    const universeHeroes = scopedHeroes.filter(hero => hero.universe === universe);
    const profile = getUniversePortalProfile(universe, universeHeroes);
    const image = getOpenAiBackdropSrc(universe, profile.mode)
      || '/images/missions/fusion-rifts.webp';
    const archiveId = `archive:${universe}:${profile.mode}`;
    const hudId = `hud:${universe}`;

    candidates.push({
      id: archiveId,
      rewardId: archiveId,
      kind: 'archive',
      name: {
        fr: `Archive ${universe}`,
        en: `${universe} Archive`
      },
      universe,
      color: profile.color,
      rarity: PORTAL_RARITIES.rare,
      data: { image, mode: profile.mode }
    });
    candidates.push({
      id: hudId,
      rewardId: hudId,
      kind: 'hud',
      name: {
        fr: `HUD ${universe}`,
        en: `${universe} HUD`
      },
      universe,
      color: profile.color,
      rarity: PORTAL_RARITIES.epic,
      data: { image, mode: profile.mode }
    });
  });

  return candidates;
};

function RewardArtwork({ reward }) {
  if (reward.kind === 'hero' || reward.kind === 'skin') {
    const hero = reward.data.hero;
    return (
      <canvas
        className="booster-reward-sprite"
        width="92"
        height="92"
        aria-hidden="true"
        ref={(canvas) => {
          if (!canvas) return;
          const context = canvas.getContext('2d');
          context.clearRect(0, 0, canvas.width, canvas.height);
          drawPixelSprite(context, 46, 62, hero, 0, 1.3);
        }}
      />
    );
  }

  if (reward.kind === 'archive' || reward.kind === 'hud') {
    return (
      <span
        className="booster-reward-landscape"
        aria-hidden="true"
        style={{ backgroundImage: `url(${reward.data.image})` }}
      />
    );
  }

  return (
    <span className={`booster-reward-glyph booster-reward-glyph-${reward.kind}`} aria-hidden="true">
      {REWARD_KIND_GLYPHS[reward.kind]}
    </span>
  );
}

function BoosterRewardCard({ reward, lang, revealed, onReveal }) {
  const rewardName = getLocalizedText(reward.name, lang);
  const rarityLabel = getLocalizedText(reward.rarity.label, lang);
  const typeLabel = REWARD_KIND_LABELS[reward.kind]?.[lang] || reward.kind;
  const resultLabel = reward.wasDuplicate
    ? (lang === 'fr' ? `Echo converti, ${reward.shardsReturned} Fragments` : `Echo converted, ${reward.shardsReturned} Shards`)
    : (lang === 'fr' ? 'Nouveau deblocage' : 'New unlock');

  return (
    <button
      type="button"
      className={`booster-reward-card ${revealed ? 'revealed' : ''}`}
      style={{ '--rarity-color': reward.rarity.color }}
      onClick={onReveal}
      aria-pressed={revealed}
      aria-label={revealed
        ? `${rewardName}, ${typeLabel}, ${rarityLabel}, ${resultLabel}`
        : `${lang === 'fr' ? 'Retourner la carte' : 'Flip card'} ${reward.cardIndex + 1}`}
      data-reward-card={reward.cardIndex}
      data-card-type={reward.kind}
    >
      <span className="booster-reward-card-inner">
        <span className="booster-reward-card-back" aria-hidden={revealed}>
          <span className="booster-card-rift-mark">MB</span>
          <small>{reward.cardIndex + 1}/{BOOSTER_CARD_COUNT}</small>
        </span>
        <span className="booster-reward-card-front" aria-hidden={!revealed}>
          <span className="booster-reward-type">{typeLabel}</span>
          <RewardArtwork reward={reward} />
          <strong>{rewardName}</strong>
          <span className="booster-reward-universe">{reward.universe}</span>
          <small>{getRewardDetail(reward, lang)}</small>
          <span className="booster-reward-rarity">{rarityLabel}</span>
          <span className={reward.wasDuplicate ? 'booster-reward-duplicate' : 'booster-reward-new'}>
            {reward.wasDuplicate
              ? `ECHO +${reward.shardsReturned}`
              : (lang === 'fr' ? 'NOUVEAU' : 'NEW')}
          </span>
        </span>
      </span>
    </button>
  );
}

export default function PortalScreen({
  lang,
  breachShards,
  setBreachShards,
  portalStats,
  setPortalStats,
  portalCollection = {},
  setPortalCollection,
  unlockedHeroes,
  setUnlockedHeroes,
  inventory = [],
  setInventory,
  hiddenUniverses = [],
  disabledAssets = {},
  completedStages = [],
  onBack
}) {
  const [activeBanner, setActiveBanner] = useState('nexus');
  const [packQuery, setPackQuery] = useState('');
  const [showAllPacks, setShowAllPacks] = useState(false);
  const [artPreviewOpen, setArtPreviewOpen] = useState(false);
  const [openingPhase, setOpeningPhase] = useState('sealed');
  const [boosterRewards, setBoosterRewards] = useState([]);
  const [revealedCards, setRevealedCards] = useState([]);
  const [boosterRefund, setBoosterRefund] = useState(0);
  const [rotationNow, setRotationNow] = useState(() => Date.now());
  const timersRef = useRef([]);
  const openingGuardRef = useRef(false);
  const completionScheduledRef = useRef(false);
  const previewTriggerRef = useRef(null);
  const previewCloseRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setRotationNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setArtPreviewOpen(false);
  }, [activeBanner]);

  useEffect(() => {
    if (!artPreviewOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handlePreviewKeyDown = event => {
      if (event.key === 'Escape') {
        setArtPreviewOpen(false);
        window.requestAnimationFrame(() => previewTriggerRef.current?.focus());
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handlePreviewKeyDown);
    previewCloseRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handlePreviewKeyDown);
    };
  }, [artPreviewOpen]);

  const clearOpeningTimers = () => {
    timersRef.current.forEach(timer => window.clearTimeout(timer));
    timersRef.current = [];
  };

  useEffect(() => () => clearOpeningTimers(), []);

  const scheduleOpeningStep = (callback, delay) => {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
  };

  const hiddenUniverseSet = useMemo(
    () => new Set(hiddenUniverses || []),
    [hiddenUniverses]
  );
  const disabledHeroSet = useMemo(
    () => new Set(disabledAssets?.heroes || []),
    [disabledAssets]
  );
  const disabledGearSet = useMemo(
    () => new Set(disabledAssets?.gear || []),
    [disabledAssets]
  );
  const visibleHeroes = useMemo(
    () => HEROES_DB.filter(hero => (
      !hiddenUniverseSet.has(hero.universe)
      && !disabledHeroSet.has(hero.id)
    )),
    [hiddenUniverseSet, disabledHeroSet]
  );
  const heroesByUniverse = useMemo(() => {
    const groups = new Map();
    visibleHeroes.forEach(hero => {
      const universe = hero.universe || NEXUS_UNIVERSE;
      if (!groups.has(universe)) groups.set(universe, []);
      groups.get(universe).push(hero);
    });
    return groups;
  }, [visibleHeroes]);
  const nexusHeroes = heroesByUniverse.get(NEXUS_UNIVERSE) || [];

  const universePortalBanners = useMemo(
    () => Array.from(heroesByUniverse.entries())
      .filter(([universe, heroes]) => universe !== NEXUS_UNIVERSE && heroes.length > 0)
      .sort(([universeA], [universeB]) => universeA.localeCompare(universeB, lang))
      .map(([universe, heroes]) => {
        const profile = getUniversePortalProfile(universe, heroes);
        const names = heroes.slice(0, 3).map(hero => hero.name).join(', ');
        const remaining = Math.max(0, heroes.length - 3);
        const rosterLine = remaining > 0 ? `${names} +${remaining}` : names;
        return {
          id: `universe:${universe}`,
          scope: 'universe',
          universe,
          mode: profile.mode,
          shape: profile.shape,
          color: profile.color,
          mediaType: profile.mediaType,
          mediaLabel: profile.label,
          label: { fr: `Booster ${universe}`, en: `${universe} Booster` },
          desc: {
            fr: `${heroes.length} signature(s), reliques et archives de Trame.`,
            en: `${heroes.length} signature(s), relics and Thread archives.`
          },
          meta: {
            fr: `Synchronisation exacte: les cinq cartes restent dans ${universe}.`,
            en: `Exact synchronization: all five cards stay inside ${universe}.`
          },
          searchText: `${universe} ${profile.mediaType} ${rosterLine}`,
          match: hero => hero.universe === universe
        };
      }),
    [heroesByUniverse, lang]
  );

  const nexusBanner = useMemo(() => ({
    id: 'nexus',
    scope: 'core',
    universe: NEXUS_UNIVERSE,
    mode: 'RPG',
    shape: 'omniverse',
    color: '#39c5bb',
    mediaLabel: { fr: 'SOCLE', en: 'CORE' },
    label: { fr: 'Booster Nexus OC', en: 'OC Nexus Booster' },
    desc: {
      fr: `${nexusHeroes.length} personnage(s) originaux et reliques A.R.C.A.`,
      en: `${nexusHeroes.length} original characters and A.R.C.A. relics.`
    },
    meta: {
      fr: 'Booster permanent du socle original. Chaque ouverture contient cinq cartes.',
      en: 'Permanent original-core booster. Every opening contains five cards.'
    },
    searchText: `${NEXUS_UNIVERSE} OC A.R.C.A.`,
    match: hero => hero.universe === NEXUS_UNIVERSE
  }), [nexusHeroes.length]);
  const multiverseBanner = useMemo(() => ({
    id: 'multi',
    scope: 'core',
    universe: NEXUS_UNIVERSE,
    mode: 'RPG',
    shape: 'omniverse',
    color: '#9b59b6',
    mediaLabel: { fr: 'SPECTRE', en: 'SPECTRUM' },
    label: { fr: 'Booster Multivers Permanent', en: 'Permanent Multiverse Booster' },
    desc: {
      fr: `${universePortalBanners.length} Trame(s) melangees dans un booster fixe.`,
      en: `${universePortalBanners.length} Thread(s) mixed inside one permanent booster.`
    },
    meta: {
      fr: 'Pack fixe de convergence: les cinq cartes peuvent provenir de plusieurs univers.',
      en: 'Fixed convergence pack: its five cards may come from several universes.'
    },
    searchText: `multivers permanent convergence ${universePortalBanners.map(banner => banner.universe).join(' ')}`,
    match: () => true
  }), [universePortalBanners]);
  const illustratedPortalBanners = useMemo(
    () => universePortalBanners.filter(banner => getPortalBoosterArt(banner.universe)),
    [universePortalBanners]
  );
  const rotationUniverseNames = useMemo(
    () => illustratedPortalBanners.map(banner => banner.universe),
    [illustratedPortalBanners]
  );
  const rotationCycle = Math.floor(rotationNow / BOOSTER_ROTATION_WINDOW_MS);
  const rotationSchedule = useMemo(
    () => getPortalBoosterRotation(
      rotationUniverseNames,
      rotationCycle * BOOSTER_ROTATION_WINDOW_MS
    ),
    [rotationCycle, rotationUniverseNames]
  );
  const rotationUniverseSet = useMemo(
    () => new Set(rotationSchedule.universes),
    [rotationSchedule.universes]
  );
  const rotationPortalBanners = useMemo(
    () => illustratedPortalBanners.filter(banner => rotationUniverseSet.has(banner.universe)),
    [illustratedPortalBanners, rotationUniverseSet]
  );
  const permanentPortalBanners = useMemo(() => ([
    nexusBanner,
    ...(completedStages.length >= 6 && universePortalBanners.length > 0 ? [multiverseBanner] : [])
  ]), [completedStages.length, multiverseBanner, nexusBanner, universePortalBanners.length]);
  const availablePortalBanners = useMemo(
    () => [...permanentPortalBanners, ...rotationPortalBanners],
    [permanentPortalBanners, rotationPortalBanners]
  );
  const catalogPortalBanners = useMemo(
    () => [...permanentPortalBanners, ...illustratedPortalBanners],
    [illustratedPortalBanners, permanentPortalBanners]
  );
  const availableBannerIds = useMemo(
    () => new Set(availablePortalBanners.map(banner => banner.id)),
    [availablePortalBanners]
  );
  const visibleBannerIds = availablePortalBanners.map(banner => banner.id).join('|');

  useEffect(() => {
    if (visibleBannerIds.split('|').includes(activeBanner)) return;
    clearOpeningTimers();
    openingGuardRef.current = false;
    setActiveBanner('nexus');
    setOpeningPhase('sealed');
    setBoosterRewards([]);
    setRevealedCards([]);
  }, [activeBanner, visibleBannerIds]);

  const activeBannerData = useMemo(
    () => availablePortalBanners.find(item => item.id === activeBanner) || nexusBanner,
    [activeBanner, availablePortalBanners, nexusBanner]
  );
  const activeBannerHeroes = visibleHeroes.filter(hero => activeBannerData.match(hero));
  const activeOwnedCount = activeBannerHeroes.filter(hero => unlockedHeroes.includes(hero.id)).length;
  const activeMissingCount = Math.max(0, activeBannerHeroes.length - activeOwnedCount);
  const activeBackdrop = activeBannerData.id === 'multi'
    ? '/images/missions/fusion-rifts.webp'
    : getOpenAiBackdropSrc(activeBannerData.universe, activeBannerData.mode);
  const activeBoosterArt = activeBannerData.id === 'multi'
    ? MULTIVERSE_CONVERGENCE_BOOSTER_ART
    : getPortalBoosterArt(activeBannerData.universe);
  const boosterVisual = activeBoosterArt
    || activeBackdrop
    || '/backgrounds/multiverse-breach-title-arca-v1.png';
  const duplicateStreak = portalStats?.duplicateStreak || 0;
  const pityReady = duplicateStreak >= PITY_LIMIT;
  const normalizedPackQuery = normalizePackSearch(packQuery.trim());
  const browsedPortalBanners = showAllPacks || normalizedPackQuery
    ? catalogPortalBanners
    : availablePortalBanners;
  const filteredPortalBanners = browsedPortalBanners.filter(banner => (
    !normalizedPackQuery
    || normalizePackSearch(`${banner.label[lang]} ${banner.desc[lang]} ${banner.searchText || ''}`)
      .includes(normalizedPackQuery)
  ));
  const displayedPortalBanners = filteredPortalBanners;
  const rotationCountdown = formatRotationCountdown(
    rotationSchedule.nextRotationAt - rotationNow,
    lang
  );
  const activeRewardCandidates = useMemo(
    () => makeBoosterCandidates({
      banner: activeBannerData,
      visibleHeroes,
      disabledGearIds: disabledGearSet
    }),
    [activeBannerData, visibleHeroes, disabledGearSet]
  );
  const rewardKindCounts = activeRewardCandidates.reduce((counts, reward) => ({
    ...counts,
    [reward.kind]: (counts[reward.kind] || 0) + 1
  }), {});
  const rewardManifestGroups = useMemo(
    () => REWARD_KIND_ORDER.map(kind => ({
      kind,
      rewards: activeRewardCandidates.filter(reward => reward.kind === kind)
    })),
    [activeRewardCandidates]
  );
  const openingLocked = ['charging', 'cutting', 'opening'].includes(openingPhase);
  const cardsVisible = ['revealing', 'complete'].includes(openingPhase);
  const canOpenBooster = openingPhase === 'sealed'
    && breachShards >= BOOSTER_COST
    && activeRewardCandidates.length > 0;
  const revealedCount = revealedCards.length;
  const portalBackground = activeBackdrop
    ? `linear-gradient(180deg, rgba(4,2,10,0.5), rgba(4,2,10,0.94)), url(${activeBackdrop})`
    : 'linear-gradient(180deg, rgba(4,2,10,0.62), rgba(4,2,10,0.94)), url(/images/missions/fusion-rifts.webp)';

  const isCandidateOwned = (candidate) => {
    if (candidate.kind === 'hero') return unlockedHeroes.includes(candidate.rewardId);
    if (['equipment', 'event', 'skin'].includes(candidate.kind)) {
      return inventory.includes(candidate.rewardId);
    }
    if (candidate.kind === 'archive') {
      return (portalCollection.archives || []).some(item => item.id === candidate.rewardId);
    }
    if (candidate.kind === 'hud') {
      return (portalCollection.hudThemes || []).some(item => item.id === candidate.rewardId);
    }
    return false;
  };

  const applyBoosterTransaction = (rewards) => {
    const newHeroIds = rewards
      .filter(reward => reward.kind === 'hero' && !reward.wasDuplicate)
      .map(reward => reward.rewardId);
    const newInventoryIds = rewards
      .filter(reward => ['equipment', 'event', 'skin'].includes(reward.kind) && !reward.wasDuplicate)
      .map(reward => reward.rewardId);
    const newArchives = rewards
      .filter(reward => reward.kind === 'archive' && !reward.wasDuplicate)
      .map(reward => ({
        id: reward.rewardId,
        name: reward.name,
        universe: reward.universe,
        image: reward.data.image,
        mode: reward.data.mode,
        color: reward.color
      }));
    const newHudThemes = rewards
      .filter(reward => reward.kind === 'hud' && !reward.wasDuplicate)
      .map(reward => ({
        id: reward.rewardId,
        name: reward.name,
        universe: reward.universe,
        image: reward.data.image,
        mode: reward.data.mode,
        color: reward.color
      }));
    const totalRefund = rewards.reduce((sum, reward) => sum + reward.shardsReturned, 0);

    setBreachShards(previous => previous - BOOSTER_COST + totalRefund);
    if (newHeroIds.length > 0) setUnlockedHeroes(previous => appendUnique(previous, newHeroIds));
    if (newInventoryIds.length > 0) setInventory(previous => appendUnique(previous, newInventoryIds));
    if (newArchives.length > 0 || newHudThemes.length > 0) {
      setPortalCollection(previous => ({
        ...previous,
        archives: appendUniqueObjects(previous?.archives || [], newArchives),
        hudThemes: appendUniqueObjects(previous?.hudThemes || [], newHudThemes)
      }));
    }

    const historyEntries = rewards.map(reward => ({
      rewardId: reward.rewardId,
      kind: reward.kind,
      name: getLocalizedText(reward.name, lang),
      universe: reward.universe,
      rarity: reward.rarity.id,
      rarityLabel: getLocalizedText(reward.rarity.label, lang),
      rarityColor: reward.rarity.color,
      pack: activeBannerData.label[lang],
      duplicate: reward.wasDuplicate,
      shardsReturned: reward.shardsReturned,
      at: new Date().toISOString()
    }));
    const heroRewards = rewards.filter(reward => reward.kind === 'hero');
    const hasNewHero = heroRewards.some(reward => !reward.wasDuplicate);
    const duplicateHeroes = heroRewards.filter(reward => reward.wasDuplicate).length;

    setPortalStats(previous => ({
      ...previous,
      pulls: (previous?.pulls || 0) + rewards.length,
      packsOpened: (previous?.packsOpened || 0) + 1,
      duplicateStreak: hasNewHero
        ? 0
        : (previous?.duplicateStreak || 0) + Math.max(1, duplicateHeroes),
      lastPull: historyEntries[historyEntries.length - 1],
      history: [
        ...historyEntries.slice().reverse(),
        ...(previous?.history || [])
      ].slice(0, 30)
    }));
    setBoosterRefund(totalRefund);
    if (newHeroIds.length > 0 || newInventoryIds.length > 0 || newArchives.length > 0 || newHudThemes.length > 0) {
      sound.playSfx('levelup');
    } else if (totalRefund > 0) {
      sound.playSfx('coin');
    }
  };

  const handleOpenBooster = () => {
    if (!canOpenBooster || openingGuardRef.current) return;
    openingGuardRef.current = true;
    completionScheduledRef.current = false;
    clearOpeningTimers();

    const ownedCandidateIds = activeRewardCandidates
      .filter(isCandidateOwned)
      .map(candidate => candidate.id);
    const rewards = createBoosterRewards({
      candidates: activeRewardCandidates,
      ownedIds: ownedCandidateIds,
      pityReady,
      preferUniverseSpread: activeBannerData.id === 'multi'
    });
    if (rewards.length !== BOOSTER_CARD_COUNT) {
      openingGuardRef.current = false;
      return;
    }

    setBoosterRewards(rewards);
    setRevealedCards([]);
    setOpeningPhase('charging');
    sound.playSfx('portal');
    applyBoosterTransaction(rewards);

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      scheduleOpeningStep(() => setOpeningPhase('revealing'), 80);
      return;
    }
    scheduleOpeningStep(() => {
      setOpeningPhase('cutting');
      sound.playSfx('laser');
      sound.playSfx('slash');
    }, 450);
    scheduleOpeningStep(() => setOpeningPhase('opening'), 1250);
    scheduleOpeningStep(() => {
      setOpeningPhase('revealing');
      sound.playSfx('portal');
    }, 2050);
  };

  const resetBooster = () => {
    clearOpeningTimers();
    openingGuardRef.current = false;
    completionScheduledRef.current = false;
    setOpeningPhase('sealed');
    setBoosterRewards([]);
    setRevealedCards([]);
    setBoosterRefund(0);
  };

  const revealCard = (cardIndex) => {
    setRevealedCards(previous => {
      if (previous.includes(cardIndex)) return previous;
      const next = [...previous, cardIndex];
      sound.playSfx('click');
      if (next.length === boosterRewards.length && !completionScheduledRef.current) {
        completionScheduledRef.current = true;
        scheduleOpeningStep(() => {
          setOpeningPhase('complete');
          sound.playSfx('levelup');
        }, 420);
      }
      return next;
    });
  };

  const revealAllCards = () => {
    boosterRewards.forEach((reward, index) => {
      if (revealedCards.includes(reward.cardIndex)) return;
      scheduleOpeningStep(() => revealCard(reward.cardIndex), index * 150);
    });
  };

  const handleSelectBanner = (bannerId) => {
    if (openingLocked || !availableBannerIds.has(bannerId) || bannerId === activeBannerData.id) return;
    resetBooster();
    setActiveBanner(bannerId);
    sound.playSfx('click');
  };

  const activateHudTheme = (themeId) => {
    setPortalCollection(previous => ({
      ...previous,
      activeHudTheme: themeId
    }));
    sound.playSfx('click');
  };

  const closeArtPreview = () => {
    setArtPreviewOpen(false);
    window.requestAnimationFrame(() => previewTriggerRef.current?.focus());
  };

  return (
    <div
      className="portal-container booster-portal"
      data-pack-id={activeBannerData.id}
      data-booster-phase={openingPhase}
      style={{
        '--portal-color': activeBannerData.color,
        backgroundImage: portalBackground
      }}
    >
      <div className="portal-command-bar">
        <button
          type="button"
          onClick={onBack}
          disabled={openingLocked}
          className={`btn-retro ${openingLocked ? 'btn-disabled' : ''}`}
          title={openingLocked
            ? (lang === 'fr' ? 'La decoupe doit se terminer avant le retour au hub.' : 'The cut must finish before returning to the hub.')
            : (lang === 'fr' ? 'Retourne au hub. Les cartes deja obtenues sont sauvegardees.' : 'Return to the hub. Obtained cards are saved.')}
        >
          {getTranslation(lang, 'backToHub')}
        </button>
        <div className="portal-shard-counter">
          {getTranslation(lang, 'shards')}: <strong>{breachShards}</strong>
        </div>
      </div>

      <h1 className="cyber-title booster-portal-title">{getTranslation(lang, 'btnPortal')}</h1>
      <p className="booster-portal-lead">
        {lang === 'fr'
          ? 'Chaque booster renferme exactement 5 cartes, dont au moins une Rare. Personnages, equipements, protocoles, apparences, archives de scene et themes HUD sont de vrais deblocages sauvegardes.'
          : 'Every booster contains exactly 5 cards, including at least one Rare. Characters, equipment, protocols, appearances, stage archives and HUD themes are real saved unlocks.'}
      </p>

      <section className="booster-catalog-panel" aria-labelledby="booster-catalog-title">
        <div className="booster-catalog-toolbar">
          <div>
            <div id="booster-catalog-title" className="booster-section-kicker">
              {getTranslation(lang, 'bannerSelect')}
            </div>
            <div className="booster-catalog-count">
              {lang === 'fr'
                ? `${rotationPortalBanners.length} temporaires / ${permanentPortalBanners.length} permanent(s) / ${illustratedPortalBanners.length} visuels integres`
                : `${rotationPortalBanners.length} temporary / ${permanentPortalBanners.length} permanent / ${illustratedPortalBanners.length} integrated visuals`}
            </div>
          </div>
          <div className="booster-pack-search">
            <input
              type="search"
              value={packQuery}
              onChange={event => setPackQuery(event.target.value)}
              placeholder={lang === 'fr' ? 'Rechercher univers ou heros...' : 'Search universe or hero...'}
              aria-label={lang === 'fr' ? 'Rechercher un booster actif' : 'Search an active booster'}
            />
            {packQuery && (
              <button
                type="button"
                className="btn-retro"
                onClick={() => setPackQuery('')}
                aria-label={lang === 'fr' ? 'Effacer la recherche' : 'Clear search'}
              >
                X
              </button>
            )}
          </div>
        </div>

        <div className="booster-rotation-strip" data-rotation-cycle={rotationSchedule.cycle}>
          <div>
            <span>{lang === 'fr' ? 'ROTATION TEMPORAIRE' : 'TEMPORARY ROTATION'}</span>
            <strong>{rotationCountdown}</strong>
          </div>
          <p>
            {lang === 'fr'
              ? 'Les offres illustrees changent chaque jour. Le booster Multivers reste fixe et melange toutes les Trames actives.'
              : 'Illustrated offers change daily. The Multiverse booster stays fixed and mixes every active Thread.'}
          </p>
          <em>{lang === 'fr' ? 'BOOSTERS PERMANENTS' : 'PERMANENT BOOSTERS'}: {permanentPortalBanners.length}</em>
        </div>

        <div className="booster-catalog-grid">
          {displayedPortalBanners.map(banner => {
            const bannerHeroes = visibleHeroes.filter(hero => banner.match(hero));
            const owned = bannerHeroes.filter(hero => unlockedHeroes.includes(hero.id)).length;
            const isActive = activeBannerData.id === banner.id;
            const isAvailable = availableBannerIds.has(banner.id);
            const isPermanent = banner.scope === 'core';
            const packArt = banner.id === 'multi'
              ? MULTIVERSE_CONVERGENCE_BOOSTER_ART
              : getPortalBoosterArt(banner.universe);
            const packImage = packArt
              || getOpenAiBackdropSrc(banner.universe, banner.mode)
              || '/images/missions/fusion-rifts.webp';
            const packScope = banner.id === 'multi'
              ? (lang === 'fr' ? 'MELANGE FIXE' : 'FIXED MIX')
              : banner.scope === 'universe'
                ? (lang === 'fr' ? 'TRAME EXACTE' : 'EXACT THREAD')
                : (lang === 'fr' ? 'SOCLE' : 'CORE');
            return (
              <button
                key={banner.id}
                type="button"
                onClick={() => handleSelectBanner(banner.id)}
                disabled={openingLocked || !isAvailable}
                className={`portal-booster ${packArt ? 'has-pack-art' : 'generated-pack-art'} ${isActive ? 'selected' : ''} ${!isAvailable ? 'unavailable' : ''}`}
                aria-pressed={isActive}
                title={!isAvailable
                  ? (lang === 'fr' ? 'Apercu uniquement: hors rotation actuelle.' : 'Preview only: outside the current rotation.')
                  : undefined}
                style={{
                  '--pack-color': banner.color,
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.93)), url(${packImage})`
                }}
              >
                <span className="portal-booster-kicker">
                  {banner.mode} / {banner.mediaLabel?.[lang] || (lang === 'fr' ? 'TRAME' : 'THREAD')}
                </span>
                <span className="portal-booster-title">{banner.label[lang]}</span>
                <span className="portal-booster-desc">{banner.desc[lang]}</span>
                <span className="portal-booster-meta">
                  {owned}/{bannerHeroes.length} - {packScope}
                </span>
                <span className={`portal-booster-art-badge ${isPermanent ? 'permanent' : isAvailable ? 'active' : 'inactive'}`}>
                  {isPermanent
                    ? (lang === 'fr' ? 'PERMANENT' : 'PERMANENT')
                    : isAvailable
                      ? (lang === 'fr' ? 'ROTATION ACTIVE' : 'ACTIVE ROTATION')
                      : (lang === 'fr' ? 'HORS ROTATION' : 'OFF ROTATION')}
                </span>
              </button>
            );
          })}
        </div>

        {filteredPortalBanners.length === 0 && (
          <div className="booster-empty-state">
            {lang === 'fr'
              ? 'Aucun booster actif ne correspond. Reactive la Trame dans Regulation A.R.C.A. ou efface la recherche.'
              : 'No active booster matches. Reactivate the Thread in A.R.C.A. Regulation or clear the search.'}
          </div>
        )}
        {!normalizedPackQuery && illustratedPortalBanners.length > rotationPortalBanners.length && (
          <div className="booster-catalog-more">
            <button
              type="button"
              className="btn-retro"
              onClick={() => setShowAllPacks(current => !current)}
            >
              {showAllPacks
                ? (lang === 'fr' ? 'REVENIR A LA ROTATION ACTUELLE' : 'BACK TO CURRENT ROTATION')
                : (lang === 'fr'
                    ? `APERÇU DES ${illustratedPortalBanners.length} BOOSTERS INTEGRES`
                    : `PREVIEW ALL ${illustratedPortalBanners.length} INTEGRATED BOOSTERS`)}
            </button>
          </div>
        )}
      </section>

      <section className="portal-focus-panel booster-focus-panel">
        <div className="portal-focus-info">
          <div className="portal-focus-kicker">
            {activeBannerData.mode} / {activeBannerData.universe}
          </div>
          <h2>{activeBannerData.label[lang]}</h2>
          <p>{activeBannerData.meta[lang]}</p>
          <div className="portal-focus-stats">
            <span>{activeOwnedCount}/{activeBannerHeroes.length} {lang === 'fr' ? 'persos' : 'characters'}</span>
            <span>{activeMissingCount} {lang === 'fr' ? 'signatures absentes' : 'missing signatures'}</span>
            <span>{activeRewardCandidates.length} {lang === 'fr' ? 'cartes possibles' : 'possible cards'}</span>
          </div>
          <div className="booster-pool-types">
            {Object.entries(rewardKindCounts).map(([kind, count]) => (
              <span key={kind}>
                {REWARD_KIND_LABELS[kind]?.[lang] || kind} <strong>{count}</strong>
              </span>
            ))}
          </div>
          <details className="booster-reward-manifest">
            <summary>
              {lang === 'fr' ? 'VOIR LE CONTENU POSSIBLE' : 'VIEW POSSIBLE CONTENT'}
            </summary>
            <div className="booster-reward-manifest-grid">
              {rewardManifestGroups.map(({ kind, rewards }) => {
                const remainingCount = Math.max(0, rewards.length - REWARD_MANIFEST_LIMIT);
                return (
                  <section className="booster-reward-manifest-group" key={kind}>
                    <h3>
                      <span>{REWARD_KIND_LABELS[kind]?.[lang] || kind}</span>
                      <strong>{rewards.length}</strong>
                    </h3>
                    {rewards.length > 0 ? (
                      <ul>
                        {rewards.slice(0, REWARD_MANIFEST_LIMIT).map(reward => (
                          <li key={reward.id} title={getLocalizedText(reward.name, lang)}>
                            {getLocalizedText(reward.name, lang)}
                          </li>
                        ))}
                        {remainingCount > 0 && (
                          <li className="booster-reward-manifest-more">
                            +{remainingCount} {lang === 'fr' ? 'autres' : 'others'}
                          </li>
                        )}
                      </ul>
                    ) : (
                      <p>{lang === 'fr' ? 'Aucun contenu' : 'No content'}</p>
                    )}
                  </section>
                );
              })}
            </div>
          </details>
          <div className="portal-rate-grid">
            {Object.values(PORTAL_RARITIES).map(rarity => (
              <span key={rarity.id} style={{ '--rarity-color': rarity.color }}>
                {rarity.label[lang]} / {rarity.weight}
              </span>
            ))}
          </div>
          <div className="portal-focus-rate booster-guarantee">
            {lang === 'fr'
              ? 'GARANTIES: 5 cartes / 1 personnage / 1 Rare ou mieux.'
              : 'GUARANTEES: 5 cards / 1 character / 1 Rare or better.'}
          </div>
          <div className={`portal-focus-rate booster-pity ${pityReady ? 'ready' : ''}`}>
            {pityReady
              ? (lang === 'fr' ? 'Compas Nexus actif: le personnage garanti cherche une signature absente.' : 'Nexus compass active: guaranteed character seeks a missing signature.')
              : (lang === 'fr'
                  ? `Compas Nexus dans ${PITY_LIMIT - duplicateStreak} echo(s) de personnage.`
                  : `Nexus compass in ${PITY_LIMIT - duplicateStreak} character echo(es).`)}
          </div>
          <p className="booster-progression-note">
            {lang === 'fr'
              ? 'Les missions et les modes restent lies a la progression de jeu: ils ne sont jamais verrouilles derriere le hasard.'
              : 'Missions and modes remain tied to gameplay progression: they are never locked behind randomness.'}
          </p>
        </div>

        <div
          className={`booster-universe-stage phase-${openingPhase}`}
          data-booster-phase={openingPhase}
          style={{ '--portal-color': activeBannerData.color }}
        >
          <div
            className={`portal-vortex booster-stage-vortex portal-shape-${activeBannerData.shape}`}
            style={{
              '--portal-image': activeBackdrop ? `url(${activeBackdrop})` : 'none',
              '--portal-color': activeBannerData.color
            }}
            aria-hidden="true"
          >
            <span className="portal-energy portal-energy-back" />
            <span className="portal-energy portal-energy-front" />
            <span className="portal-fracture" />
            <span className="portal-core" />
          </div>

          {!cardsVisible && (
            <button
              type="button"
              className={`breach-booster-pack ${activeBoosterArt ? 'uses-real-art' : 'uses-generated-art'}`}
              onClick={handleOpenBooster}
              disabled={!canOpenBooster}
              aria-label={lang === 'fr'
                ? `Ouvrir ${activeBannerData.label.fr}, cinq cartes pour ${BOOSTER_COST} Fragments`
                : `Open ${activeBannerData.label.en}, five cards for ${BOOSTER_COST} Shards`}
            >
              <span
                className="breach-booster-body"
                style={{ backgroundImage: `url(${boosterVisual})` }}
                aria-hidden="true"
              />
              <span
                className="breach-booster-cap"
                style={{ backgroundImage: `url(${boosterVisual})` }}
                aria-hidden="true"
              />
              <span className="breach-booster-cut-guide" aria-hidden="true">
                <i />
              </span>
              {!activeBoosterArt && (
                <span className="breach-booster-fallback-brand" aria-hidden="true">
                  <small>MULTIVERSE BREACH</small>
                  <strong>{activeBannerData.universe}</strong>
                  <span>5 CARDS / 1 RARE</span>
                </span>
              )}
            </button>
          )}

          {!cardsVisible && activeBoosterArt && openingPhase === 'sealed' && (
            <button
              ref={previewTriggerRef}
              type="button"
              className="booster-art-preview-trigger"
              onClick={() => {
                setArtPreviewOpen(true);
                sound.playSfx('click');
              }}
            >
              <span aria-hidden="true">⛶</span>
              {lang === 'fr' ? 'VOIR LE BOOSTER EN GRAND' : 'VIEW FULL BOOSTER'}
            </button>
          )}

          {cardsVisible && (
            <div className="booster-card-reveal-area" aria-live="polite">
              <div className="booster-reveal-heading">
                <span>{revealedCount}/{BOOSTER_CARD_COUNT}</span>
                <strong>{lang === 'fr' ? 'CARTES STABILISEES' : 'STABILIZED CARDS'}</strong>
              </div>
              <div className="booster-reward-grid">
                {boosterRewards.map(reward => (
                  <BoosterRewardCard
                    key={`${reward.id}-${reward.cardIndex}`}
                    reward={reward}
                    lang={lang}
                    revealed={revealedCards.includes(reward.cardIndex)}
                    onReveal={() => revealCard(reward.cardIndex)}
                  />
                ))}
              </div>
              {boosterRefund > 0 && (
                <div className="booster-refund-line">
                  {lang === 'fr'
                    ? `Echos convertis automatiquement: +${boosterRefund} Fragments.`
                    : `Echoes automatically converted: +${boosterRefund} Shards.`}
                </div>
              )}
            </div>
          )}

          <div className="booster-opening-status" role="status" aria-live="polite">
            <span className="booster-status-dot" />
            {OPENING_STATUS[openingPhase][lang]}
          </div>
        </div>
      </section>

      <div className="booster-action-row">
        {openingPhase === 'sealed' && (
          <button
            type="button"
            onClick={handleOpenBooster}
            disabled={!canOpenBooster}
            className={`btn-retro booster-open-button ${!canOpenBooster ? 'btn-disabled' : ''}`}
          >
            {lang === 'fr'
              ? `OUVRIR LE BOOSTER — ${BOOSTER_COST} FRAGMENTS`
              : `OPEN BOOSTER — ${BOOSTER_COST} SHARDS`}
          </button>
        )}
        {openingPhase === 'revealing' && revealedCount < BOOSTER_CARD_COUNT && (
          <button type="button" onClick={revealAllCards} className="btn-retro booster-reveal-all">
            {lang === 'fr' ? 'TOUT REVELER' : 'REVEAL ALL'}
          </button>
        )}
        {openingPhase === 'complete' && (
          <button type="button" onClick={resetBooster} className="btn-retro booster-open-button">
            {lang === 'fr' ? 'BOOSTER SUIVANT' : 'NEXT BOOSTER'}
          </button>
        )}
      </div>

      {((portalCollection.hudThemes || []).length > 0 || (portalCollection.archives || []).length > 0) && (
        <section className="booster-collection-panel" aria-labelledby="portal-collection-title">
          <div className="booster-collection-header">
            <div>
              <div id="portal-collection-title" className="booster-section-kicker">
                {lang === 'fr' ? 'COLLECTION DE TRAME' : 'THREAD COLLECTION'}
              </div>
              <p>
                {(portalCollection.hudThemes || []).length} HUD / {(portalCollection.archives || []).length} {lang === 'fr' ? 'archives' : 'archives'}
              </p>
            </div>
            <button
              type="button"
              className={`btn-retro ${!portalCollection.activeHudTheme ? 'selected' : ''}`}
              onClick={() => activateHudTheme(null)}
            >
              {lang === 'fr' ? 'HUD NEXUS' : 'NEXUS HUD'}
            </button>
          </div>

          {(portalCollection.hudThemes || []).length > 0 && (
            <div className="booster-theme-grid">
              {(portalCollection.hudThemes || []).map(theme => (
                <button
                  key={theme.id}
                  type="button"
                  className={portalCollection.activeHudTheme === theme.id ? 'selected' : ''}
                  onClick={() => activateHudTheme(theme.id)}
                  style={{
                    '--theme-color': theme.color,
                    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.88)), url(${theme.image})`
                  }}
                  aria-pressed={portalCollection.activeHudTheme === theme.id}
                >
                  <span>{lang === 'fr' ? 'THEME HUD' : 'HUD THEME'}</span>
                  <strong>{theme.universe}</strong>
                </button>
              ))}
            </div>
          )}

          {(portalCollection.archives || []).length > 0 && (
            <div className="booster-archive-grid">
              {(portalCollection.archives || []).slice(-12).reverse().map(archive => (
                <article
                  key={archive.id}
                  style={{
                    '--archive-color': archive.color,
                    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.9)), url(${archive.image})`
                  }}
                >
                  <span>{archive.mode}</span>
                  <strong>{archive.universe}</strong>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {(portalStats?.history || []).length > 0 && (
        <section className="booster-history-panel" aria-labelledby="booster-history-title">
          <div id="booster-history-title" className="booster-section-kicker">
            {lang === 'fr' ? 'HISTORIQUE DE FAILLE' : 'RIFT HISTORY'} / {portalStats?.packsOpened || 0} {lang === 'fr' ? 'boosters' : 'boosters'}
          </div>
          <div className="booster-history-grid">
            {(portalStats?.history || []).slice(0, 10).map((entry, index) => (
              <article key={`${entry.rewardId || entry.heroId}-${entry.at}-${index}`}>
                <span style={{ color: entry.rarityColor || '#9fb6bb' }}>
                  {REWARD_KIND_LABELS[entry.kind]?.[lang] || (lang === 'fr' ? 'PERSONNAGE' : 'CHARACTER')}
                </span>
                <strong>{entry.name}</strong>
                <small>{entry.universe} / {entry.pack || entry.banner}</small>
                <em className={entry.duplicate ? 'duplicate' : 'new'}>
                  {entry.duplicate
                    ? `ECHO +${entry.shardsReturned || 0}`
                    : (lang === 'fr' ? 'NOUVEAU' : 'NEW')}
                </em>
              </article>
            ))}
          </div>
        </section>
      )}

      {artPreviewOpen && activeBoosterArt && (
        <div
          className="booster-art-lightbox"
          onMouseDown={event => {
            if (event.target === event.currentTarget) closeArtPreview();
          }}
        >
          <section
            className="booster-art-preview-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booster-art-preview-title"
          >
            <header>
              <div>
                <span>{lang === 'fr' ? 'PACK SELECTIONNE' : 'SELECTED PACK'}</span>
                <strong id="booster-art-preview-title">{activeBannerData.label[lang]}</strong>
              </div>
              <button
                ref={previewCloseRef}
                type="button"
                className="booster-art-preview-close"
                onClick={closeArtPreview}
                aria-label={lang === 'fr' ? 'Fermer l apercu du booster' : 'Close booster preview'}
              >
                ×
              </button>
            </header>
            <div className="booster-art-preview-frame">
              <img
                src={activeBoosterArt}
                alt={lang === 'fr'
                  ? `${activeBannerData.label.fr}, emballage complet`
                  : `${activeBannerData.label.en}, complete wrapper`}
                draggable="false"
              />
            </div>
            <small>
              {lang === 'fr'
                ? 'Apercu integral sans recadrage. L ouverture du booster reste une action separee.'
                : 'Complete uncropped preview. Opening the booster remains a separate action.'}
            </small>
          </section>
        </div>
      )}
    </div>
  );
}

PortalScreen.makeBoosterCandidates = makeBoosterCandidates;
