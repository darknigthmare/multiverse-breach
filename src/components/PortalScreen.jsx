import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EQUIP_ITEMS_DB, EVENT_ITEMS_DB, HEROES_DB } from '../game/heroes';
import sound from '../game/soundEngine';
import { drawPixelSprite, getOpenAiBackdropSrc } from '../game/renderer';
import { getTranslation } from '../game/translation';
import { LORE_DB } from '../game/lore';
import { OC_DLC_UNIVERSE_KEYS } from '../game/ocDlcPacks';
import { SKIN_CATALOG } from '../game/narrativeSystems';
import {
  BOOSTER_CARD_COUNT,
  createBoosterRewards
} from '../game/portalBoosterEngine';
import { capDuplicateRefunds, getBoosterPrice } from '../game/portalBoosterEconomy';
import { buildBoosterCatalogGroups } from '../game/portalCatalogView';
import { getPersonalPortalRotation, ROTATION_REROLL_GOLD_COST } from '../game/portalRotationReroll';
import PortalBoosterDossier from './PortalBoosterDossier';
import { getOcBoosterContentUpdate } from '../game/ocBoosterContentUpdates';
import { resolvePortalBoosterEditorialWave } from '../game/portalBoosterEditorialWaves';
import { getUniverseUnlockables, getUnlockableById } from '../game/universeUnlockables';
import {
  OPENAI_COSMETIC_VISUALS,
  getCosmeticAtlasPreviewStyle,
  getUniverseCosmeticVisuals
} from '../game/cosmeticVisualAssets';
import {
  BOOSTER_ROTATION_WINDOW_MS,
  BOOSTER_ROTATION_SIZE,
  DEFAULT_OC_BOOSTER_ID,
  ORIGINAL_WORLD_BOOSTERS,
  PERMANENT_OC_BOOSTERS,
  getPortalBoosterArt,
  getPortalBoosterPackArt
} from '../game/portalBoosterCatalog';
import { createCardCatalogFromPortalCandidates } from '../game/cards/cardCatalog';
import { createCardSetCatalog } from '../game/cards/cardSetCatalog';
import { buildCardId, createCardDefinition } from '../game/cards/cardSchema';
import {
  addCardToCollection,
  addCardsToCollection,
  appendOpeningHistory,
  claimSetMilestone
} from '../game/cards/cardCollectionEngine';
import { migrateCardSaveWithDiagnostics } from '../game/cards/cardSaveMigration';
import PortalAtlas from './visuals/PortalAtlas';

const CollectionHome = React.lazy(() => import('./collection/CollectionHome'));
const PortalLab = React.lazy(() => import('./admin/PortalLab'));

const PORTAL_RARITIES = {
  common: { id: 'common', label: { fr: 'Stable', en: 'Stable' }, color: '#9fb6bb', weight: 58, duplicateRefund: 12 },
  rare: { id: 'rare', label: { fr: 'Rare', en: 'Rare' }, color: '#3498db', weight: 28, duplicateRefund: 20 },
  epic: { id: 'epic', label: { fr: 'Epique', en: 'Epic' }, color: '#9b59b6', weight: 11, duplicateRefund: 32 },
  anomaly: { id: 'anomaly', label: { fr: 'Anomalie', en: 'Anomaly' }, color: '#ffb000', weight: 3, duplicateRefund: 50 }
};

const CORE_ANOMALY_IDS = new Set(['masterchief', 'predator', 'pyramidhead', 'neo', 'doomslayer', 'vader', 'rick', 'jigsaw', 'yugi']);
const CORE_EPIC_IDS = new Set(['marcus', 'ripley', 'freeman', 'snake', 'solbadguy', 'ragna', 'shepard', 'luke', 'isaac', 'taichi', 'motoko']);
const NEXUS_UNIVERSE = 'Nexus de Convergence';
const PITY_LIMIT = 6;
const EMPTY_REWARD_ID_SET = new Set();
// P2 starts with two reviewed visual pilots. Other universes remain visibly
// marked DRAFT until their reference dossiers and palettes are approved.
const CARD_PILOT_PALETTES = Object.freeze({
  [NEXUS_UNIVERSE]: Object.freeze({
    palettePrimary: '#39c5bb',
    paletteSecondary: '#07131d',
    accent: '#ffcf5a',
    foilGradient: 'linear-gradient(125deg, #39c5bb, #7df9ff 42%, #ffcf5a 72%, #b27cff)'
  }),
  '28 Days Later': Object.freeze({
    palettePrimary: '#b83a2d',
    paletteSecondary: '#170d0a',
    accent: '#f4c768',
    foilGradient: 'linear-gradient(125deg, #5c1712, #b83a2d 38%, #f4c768 68%, #657169)'
  })
});
const PORTAL_ELIGIBLE_HEROES = HEROES_DB.filter(hero => !hero.campaignExclusive);
const HERO_BY_ID = new Map(PORTAL_ELIGIBLE_HEROES.map(hero => [hero.id, hero]));
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
  archive: { fr: 'STAGE CUSTOM', en: 'CUSTOM STAGE' },
  kart: { fr: 'KART', en: 'KART' },
  battleMusic: { fr: 'MUSIQUE DE COMBAT', en: 'BATTLE MUSIC' },
  stageMusic: { fr: 'MUSIQUE DE STAGE', en: 'STAGE MUSIC' },
  fieldSuper: { fr: 'SUPER DE TERRAIN', en: 'FIELD SUPER' },
  npcAssist: { fr: 'ASSIST PNJ', en: 'NPC ASSIST' },
  koEffect: { fr: 'EFFET DE K.-O.', en: 'K.O. EFFECT' },
  portalEffect: { fr: 'EFFET DE PORTAIL', en: 'PORTAL EFFECT' },
  introPose: { fr: 'POSE D INTRODUCTION', en: 'INTRODUCTION POSE' },
  victoryPose: { fr: 'POSE DE VICTOIRE', en: 'VICTORY POSE' },
  profileBanner: { fr: 'BANNIERE DE PROFIL', en: 'PROFILE BANNER' },
  profileTitle: { fr: 'TITRE DE PROFIL', en: 'PROFILE TITLE' },
  hud: { fr: 'THEME HUD', en: 'HUD THEME' }
};

const REWARD_KIND_GLYPHS = {
  hero: 'A',
  equipment: 'E',
  event: 'P',
  skin: 'S',
  archive: 'Ω',
  kart: 'K',
  battleMusic: 'B',
  stageMusic: 'M',
  fieldSuper: 'O',
  npcAssist: 'N',
  koEffect: 'X',
  portalEffect: 'P',
  introPose: 'I',
  victoryPose: 'V',
  profileBanner: 'B',
  profileTitle: 'T',
  hud: 'H'
};

const REWARD_KIND_ORDER = [
  'hero',
  'equipment',
  'kart',
  'event',
  'skin',
  'archive',
  'battleMusic',
  'stageMusic',
  'fieldSuper',
  'npcAssist',
  'koEffect',
  'portalEffect',
  'introPose',
  'victoryPose',
  'profileBanner',
  'profileTitle',
  'hud'
];
const PORTAL_COLLECTION_ID_KEYS = {
  kart: 'karts',
  battleMusic: 'battleMusic',
  stageMusic: 'stageMusic',
  fieldSuper: 'fieldSupers',
  npcAssist: 'npcAssists',
  koEffect: 'koEffects',
  portalEffect: 'portalEffects',
  introPose: 'introPoses',
  victoryPose: 'victoryPoses',
  profileBanner: 'profileBanners',
  profileTitle: 'profileTitles'
};
const CUSTOM_COSMETIC_KINDS = [
  'npcAssist',
  'koEffect',
  'portalEffect',
  'introPose',
  'victoryPose',
  'profileBanner',
  'profileTitle'
];
const ORIGINAL_BOOSTER_UNIVERSES = new Set([
  ...ORIGINAL_WORLD_BOOSTERS.map(pack => pack.universe),
  ...OC_DLC_UNIVERSE_KEYS
]);
const getUniverseHudFrame = (universe) => (
  getUniverseCosmeticVisuals(universe)?.hudTheme?.image || null
);

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

const getCardRewardKey = ({ universe, kind, rewardKind, rewardId }) => (
  `${String(universe || '')}\u0000${String(rewardKind || kind || '')}\u0000${String(rewardId || '')}`
);
const getLegacyRewardKey = ({ kind, rewardKind, rewardId }) => (
  `${String(rewardKind || kind || '')}\u0000${String(rewardId || '')}`
);

const getRewardIdentityCollisions = definitions => {
  const grouped = new Map();
  definitions.forEach(definition => {
    const key = `${definition.rewardKind}\u0000${definition.rewardId}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(definition);
  });
  return Array.from(grouped.entries())
    .filter(([, entries]) => entries.length > 1)
    .map(([key, entries]) => ({
      key,
      rewardKind: entries[0].rewardKind,
      rewardId: entries[0].rewardId,
      cardIds: entries.map(entry => entry.id),
      universes: [...new Set(entries.map(entry => entry.universe))]
    }));
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

const formatContentUpdateDate = (releasedAt, lang) => {
  const [year, month, day] = String(releasedAt || '').split('-');
  if (!year || !month || !day) return releasedAt;
  return lang === 'fr' ? `${day}/${month}/${year}` : `${year}-${month}-${day}`;
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
    return `${reward.data.mode} / ${lang === 'fr' ? 'stage custom jouable' : 'playable custom stage'}`;
  }
  if (reward.kind === 'kart') {
    const style = reward.data.unlockable.style || 'arca';
    return `${lang === 'fr' ? 'Chassis cosmetique' : 'Cosmetic chassis'} / ${style.toUpperCase()}`;
  }
  if (reward.kind === 'battleMusic') {
    return lang === 'fr'
      ? 'Arrangement procedural pour combat custom'
      : 'Procedural custom-battle arrangement';
  }
  if (reward.kind === 'stageMusic') {
    return lang === 'fr'
      ? 'Arrangement procedural pour stage custom'
      : 'Procedural custom-stage arrangement';
  }
  if (reward.kind === 'fieldSuper') {
    const effect = reward.data.unlockable.effect || {};
    return `${lang === 'fr' ? 'Impact terrain' : 'Field impact'} / DMG ${effect.damage || 0}`;
  }
  if (reward.kind === 'npcAssist') {
    const effect = reward.data.unlockable.effect || {};
    return `${lang === 'fr' ? 'Une fois par combat' : 'Once per battle'} / DMG ${effect.damage || 0}`;
  }
  if (['koEffect', 'portalEffect'].includes(reward.kind)) {
    return lang === 'fr' ? 'Effet OpenAI anime equipable' : 'Equippable animated OpenAI effect';
  }
  if (['introPose', 'victoryPose'].includes(reward.kind)) {
    return lang === 'fr' ? 'Sprite OpenAI anime equipable' : 'Equippable animated OpenAI sprite';
  }
  if (reward.kind === 'profileBanner') {
    return lang === 'fr' ? 'Cadre OpenAI du Dossier d Ancre' : 'OpenAI Anchor-record frame';
  }
  if (reward.kind === 'profileTitle') {
    return lang === 'fr' ? 'Plaque OpenAI publique equipable' : 'Equippable public OpenAI plate';
  }
  if (reward.kind === 'hud') {
    return lang === 'fr'
      ? 'Cadre HUD OpenAI compose avec la Trame'
      : 'OpenAI HUD frame composed with the Thread';
  }
  return lang === 'fr' ? 'Fond du controle Nexus' : 'Nexus control backdrop';
};

const finalizeBoosterCandidates = (baseCandidates, banner) => {
  const contentUpdate = getOcBoosterContentUpdate(banner.id);
  const candidates = [
    ...baseCandidates,
    ...(contentUpdate?.cards || []).map(card => ({
      ...card,
      rarity: PORTAL_RARITIES[card.rarityId] || PORTAL_RARITIES.common,
      contentUpdateId: contentUpdate.id,
      contentUpdateVersion: contentUpdate.version,
      isContentUpdate: true
    }))
  ];
  const rewardKinds = banner.rewardKinds ? new Set(banner.rewardKinds) : null;

  return candidates
    .filter(candidate => !rewardKinds || rewardKinds.has(candidate.kind))
    .map(candidate => (
      candidate.id === banner.chaseRewardId
        ? { ...candidate, rarity: PORTAL_RARITIES.anomaly }
        : candidate
    ));
};

const makeBoosterCandidates = ({
  banner,
  visibleHeroes,
  disabledGearIds
}) => {
  if (Array.isArray(banner.candidatePool) && banner.candidatePool.length > 0) {
    const candidates = banner.candidatePool.map(candidate => {
      const entity = candidate.data;
      const rarity = PORTAL_RARITIES[candidate.rarityId] || PORTAL_RARITIES.common;
      const hero = candidate.kind === 'hero'
        ? (HERO_BY_ID.get(entity.id) || entity)
        : candidate.kind === 'skin'
          ? HERO_BY_ID.get(entity.heroId)
          : null;
      const item = candidate.kind === 'equipment'
        ? (EQUIP_ITEMS_DB.find(entry => entry.id === entity.id) || entity)
        : candidate.kind === 'event'
          ? (EVENT_ITEMS_DB[banner.universe] || entity)
          : null;
      const unlockable = ![
        'hero', 'equipment', 'event', 'skin', 'archive', 'hud'
      ].includes(candidate.kind)
        ? (getUnlockableById(candidate.kind, candidate.id) || entity)
        : null;
      const landscapeData = ['archive', 'hud'].includes(candidate.kind)
        ? {
            ...(entity.data || {}),
            image: entity.data?.image || banner.backdrop,
            mode: entity.data?.mode || banner.mode
          }
        : null;

      return {
        id: candidate.kind === 'hero'
          ? `hero:${encodeURIComponent(banner.universe)}:${encodeURIComponent(candidate.id)}`
          : candidate.id,
        rewardId: candidate.id,
        kind: candidate.kind,
        name: entity.name || candidate.id,
        universe: banner.universe,
        color: entity.color || entity.colors?.primaryColor || banner.color,
        rarity,
        data: candidate.kind === 'hero'
          ? { hero }
          : candidate.kind === 'equipment' || candidate.kind === 'event'
            ? { item }
            : candidate.kind === 'skin'
              ? { skin: entity, hero: { ...hero, ...(entity.colors || {}) } }
              : landscapeData
                ? landscapeData
                : { unlockable }
      };
    });
    return finalizeBoosterCandidates(candidates, banner);
  }

  const scopedHeroes = banner.id === 'multi'
    ? visibleHeroes
    : visibleHeroes.filter(hero => banner.match(hero));
  const scopedHeroIds = new Set(scopedHeroes.map(hero => hero.id));
  const universes = [...new Set(scopedHeroes.map(hero => hero.universe || NEXUS_UNIVERSE))];
  const universeSet = new Set(universes);
  const candidates = [];

  scopedHeroes.forEach(hero => {
    candidates.push({
      id: `hero:${encodeURIComponent(hero.universe)}:${encodeURIComponent(hero.id)}`,
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
        fr: `Stage custom ${universe}`,
        en: `${universe} Custom Stage`
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
      data: {
        image,
        frame: getUniverseHudFrame(universe)
          || OPENAI_COSMETIC_VISUALS.hudTheme.image,
        mode: profile.mode
      }
    });
  });

  universes.forEach(universe => {
    const unlockables = getUniverseUnlockables(universe);
    if (!unlockables) return;

    [
      [unlockables.kart, PORTAL_RARITIES.common],
      [unlockables.battleMusic, PORTAL_RARITIES.rare],
      [unlockables.stageMusic, PORTAL_RARITIES.rare],
      [unlockables.fieldSuper, PORTAL_RARITIES.anomaly],
      [unlockables.npcAssist, PORTAL_RARITIES.epic],
      [unlockables.koEffect, PORTAL_RARITIES.rare],
      [unlockables.portalEffect, PORTAL_RARITIES.epic],
      [unlockables.introPose, PORTAL_RARITIES.rare],
      [unlockables.victoryPose, PORTAL_RARITIES.rare],
      [unlockables.profileBanner, PORTAL_RARITIES.rare],
      [unlockables.profileTitle, PORTAL_RARITIES.epic]
    ].forEach(([unlockable, rarity]) => {
      if (!unlockable) return;
      candidates.push({
        id: unlockable.id,
        rewardId: unlockable.id,
        kind: unlockable.kind,
        name: unlockable.name,
        universe,
        color: unlockable.color || banner.color,
        rarity,
        data: { unlockable }
      });
    });
  });

  return finalizeBoosterCandidates(candidates, banner);
};

function RewardArtwork({ reward, lang }) {
  if (reward.kind === 'hero' || reward.kind === 'skin') {
    const hero = reward.data.hero;
    if (hero.originalContent && hero.portrait) {
      return (
        <img
          className="booster-reward-sprite"
          src={hero.portrait}
          alt=""
          aria-hidden="true"
        />
      );
    }
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
    const hudFrame = reward.kind === 'hud'
      ? (
          getUniverseHudFrame(reward.universe)
          || reward.data.frame
          || OPENAI_COSMETIC_VISUALS.hudTheme.image
        )
      : null;
    return (
      <span
        className="booster-reward-landscape"
        aria-hidden="true"
        style={{
          backgroundImage: hudFrame
            ? `url(${hudFrame}), linear-gradient(180deg, transparent, rgba(0,0,0,.72)), url(${reward.data.image})`
            : `linear-gradient(180deg, transparent, rgba(0,0,0,.72)), url(${reward.data.image})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: hudFrame ? '100% 100%, cover, cover' : 'cover, cover'
        }}
      />
    );
  }

  const unlockable = reward.data?.unlockable;
  if (reward.kind === 'profileBanner') {
    const backdrop = getOpenAiBackdropSrc(reward.universe, 'Combat')
      || '/images/missions/fusion-rifts.webp';
    return (
      <span
        className="booster-reward-landscape booster-reward-profile-banner"
        aria-hidden="true"
        style={{
          backgroundImage: `url(${unlockable?.visual?.image || OPENAI_COSMETIC_VISUALS.profileBanner.image}), linear-gradient(135deg, ${reward.color}22, rgba(0,0,0,.66)), url(${backdrop})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%, cover, cover'
        }}
      />
    );
  }

  if (reward.kind === 'profileTitle') {
    return (
      <span
        className="booster-reward-profile-title"
        aria-hidden="true"
        style={{
          '--profile-title-color': reward.color,
          backgroundImage: `url(${unlockable?.visual?.image || OPENAI_COSMETIC_VISUALS.profileTitle.image})`
        }}
      >
        <span>{getLocalizedText(reward.name, lang)}</span>
      </span>
    );
  }

  if (['koEffect', 'portalEffect', 'introPose', 'victoryPose'].includes(reward.kind)) {
    const atlas = unlockable?.animation || unlockable?.visual;
    return (
      <span
        className="booster-reward-cosmetic-atlas"
        aria-hidden="true"
        style={{
          '--cosmetic-preview-color': reward.color,
          ...getCosmeticAtlasPreviewStyle(atlas)
        }}
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
          <RewardArtwork reward={reward} lang={lang} />
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
  gold = 0,
  onRerollRotation = null,
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
  collectionOnly = false,
  onOpenAnchorProfile,
  onBack
}) {
  const [activeBanner, setActiveBanner] = useState(DEFAULT_OC_BOOSTER_ID);
  const [packQuery, setPackQuery] = useState('');
  const [showAllPacks, setShowAllPacks] = useState(false);
  const [openPackGroups, setOpenPackGroups] = useState({ original: true, franchise: false });
  const [dossierBannerId, setDossierBannerId] = useState(null);
  const [rotationConfirmation, setRotationConfirmation] = useState(null);
  const [rotationPending, setRotationPending] = useState(false);
  const [rotationMessage, setRotationMessage] = useState(null);
  const rotationPendingRef = useRef(false);
  const [artPreviewOpen, setArtPreviewOpen] = useState(false);
  const [openingPhase, setOpeningPhase] = useState('sealed');
  const [boosterRewards, setBoosterRewards] = useState([]);
  const [revealedCards, setRevealedCards] = useState([]);
  const [boosterRefund, setBoosterRefund] = useState(0);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [portalLabOpen, setPortalLabOpen] = useState(false);
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
    () => PORTAL_ELIGIBLE_HEROES.filter(hero => (
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
  const universePortalBanners = useMemo(
    () => Array.from(heroesByUniverse.entries())
      .filter(([universe, heroes]) => universe !== NEXUS_UNIVERSE && heroes.length > 0)
      .sort(([universeA], [universeB]) => universeA.localeCompare(universeB, lang))
      .map(([universe, heroes]) => {
        const profile = getUniversePortalProfile(universe, heroes);
        const names = heroes.slice(0, 3).map(hero => hero.name).join(', ');
        const remaining = Math.max(0, heroes.length - 3);
        const rosterLine = remaining > 0 ? `${names} +${remaining}` : names;
        const originalWorldPack = ORIGINAL_WORLD_BOOSTERS.find(
          pack => pack.universe === universe
        );
        if (originalWorldPack) {
          return {
            ...originalWorldPack,
            scope: 'universe',
            match: hero => hero.universe === universe
          };
        }
        return {
          id: `universe:${universe}`,
          scope: 'universe',
          priceTier: 'targeted',
          contentUpdate: getOcBoosterContentUpdate(`universe:${universe}`),
          universe,
          mode: profile.mode,
          shape: profile.shape,
          color: profile.color,
          mediaType: profile.mediaType,
          mediaLabel: profile.label,
          label: { fr: `Booster ${universe}`, en: `${universe} Booster` },
          desc: {
            fr: `${heroes.length} signature(s), reliques et stages custom de Trame.`,
            en: `${heroes.length} signature(s), relics and custom Thread stages.`
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

  const ocPermanentBanners = useMemo(
    () => PERMANENT_OC_BOOSTERS.map(pack => {
      const featuredHeroIds = new Set(pack.heroIds);
      return {
        ...pack,
        scope: 'core',
        match: hero => featuredHeroIds.has(hero.id)
      };
    }),
    []
  );
  const defaultOcBanner = ocPermanentBanners[0];
  const multiverseBanner = useMemo(() => ({
    id: 'multi',
    scope: 'core',
    priceTier: 'broad',
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
  const catalogRewardCandidates = useMemo(() => {
    const baseCandidates = makeBoosterCandidates({
      banner: multiverseBanner,
      visibleHeroes: PORTAL_ELIGIBLE_HEROES,
      disabledGearIds: EMPTY_REWARD_ID_SET
    });
    const originalWorldCandidates = ORIGINAL_WORLD_BOOSTERS.flatMap(pack => (
      makeBoosterCandidates({
        banner: pack,
        visibleHeroes: PORTAL_ELIGIBLE_HEROES,
        disabledGearIds: EMPTY_REWARD_ID_SET
      })
    ));
    const ocUpdateCandidates = ocPermanentBanners.flatMap(pack => (
      getOcBoosterContentUpdate(pack.id)?.cards || []
    ));
    const uniqueCandidates = new Map();
    [...baseCandidates, ...originalWorldCandidates, ...ocUpdateCandidates].forEach(candidate => {
      const key = getCardRewardKey(candidate);
      if (!uniqueCandidates.has(key)) uniqueCandidates.set(key, candidate);
    });
    return Array.from(uniqueCandidates.values());
  }, [multiverseBanner, ocPermanentBanners]);
  const cardCatalog = useMemo(
    () => createCardCatalogFromPortalCandidates(catalogRewardCandidates),
    [catalogRewardCandidates]
  );
  const cardSetCatalog = useMemo(
    () => createCardSetCatalog(cardCatalog, {
      pageSize: 12,
      releaseDate: '2026-07-31',
      paletteByUniverse: CARD_PILOT_PALETTES
    }),
    [cardCatalog]
  );
  const completionCardDefinitions = useMemo(() => cardSetCatalog.definitions.map(setDefinition => {
    const sourceCardId = setDefinition.chaseCardIds?.[0] || setDefinition.cardIds?.at(-1);
    const sourceCard = sourceCardId ? cardCatalog.cardsById[sourceCardId] : null;
    const logicalDefinition = createCardDefinition({
      id: buildCardId({
        universe: setDefinition.universe,
        kind: 'completion',
        rewardId: setDefinition.id
      }),
      setId: setDefinition.id,
      number: setDefinition.cardIds.length + 1,
      universe: setDefinition.universe,
      kind: 'whatIf',
      rewardKind: 'completion',
      rewardId: setDefinition.id,
      canonStatus: 'nexus-variant',
      rarityId: 'anomaly',
      dropWeight: 0,
      color: setDefinition.palette?.accent || sourceCard?.color || '#ffb000',
      tags: ['completion', 'master-frame'],
      name: {
        fr: `Anomalie de completion - ${setDefinition.universe}`,
        en: `${setDefinition.universe} Completion Anomaly`
      },
      lore: {
        fr: 'Signature hors serie accordee apres stabilisation complete du set.',
        en: 'Out-of-series signature awarded after complete set stabilization.'
      },
      artId: sourceCard?.artId || null
    });
    const visualTheme = setDefinition.palette || null;
    return {
      ...logicalDefinition,
      art: logicalDefinition.artId ? cardCatalog.artById[logicalDefinition.artId] || null : null,
      visualTheme,
      visualStatus: visualTheme ? 'pilot' : 'draft',
      completionReward: true
    };
  }), [cardCatalog, cardSetCatalog]);
  const collectionDefinitions = useMemo(() => {
    const baseDefinitions = cardCatalog.definitions.map(definition => {
      const visualTheme = cardSetCatalog.setsById[definition.setId]?.palette || null;
      return {
        ...definition,
        art: definition.artId ? cardCatalog.artById[definition.artId] || null : null,
        visualTheme,
        visualStatus: visualTheme ? 'pilot' : 'draft'
      };
    });
    return [
      ...baseDefinitions,
      ...completionCardDefinitions.filter(definition => portalCollection.cards?.[definition.id])
    ];
  }, [cardCatalog, cardSetCatalog, completionCardDefinitions, portalCollection.cards]);
  const cardDefinitionByReward = useMemo(
    () => new Map(cardCatalog.definitions.map(definition => [
      getCardRewardKey(definition),
      definition
    ])),
    [cardCatalog]
  );
  const collectionDiagnostics = useMemo(() => ({
    collisions: cardCatalog.diagnostics.filter(diagnostic => diagnostic.code === 'card-id-collision'),
    rewardIdentityCollisions: getRewardIdentityCollisions(cardCatalog.definitions)
  }), [cardCatalog]);
  const ambiguousLegacyRewardKeys = useMemo(
    () => new Set(collectionDiagnostics.rewardIdentityCollisions.map(getLegacyRewardKey)),
    [collectionDiagnostics]
  );

  // The catalog is required for a safe retroactive import: a legacy bare id
  // is migrated only when it resolves to one continuity, and the operation is
  // idempotent on every later portal visit.
  useEffect(() => {
    if (cardCatalog.definitions.length === 0) return;
    setPortalCollection(previous => {
      const migration = migrateCardSaveWithDiagnostics({
        saveVersion: 9,
        unlockedHeroes,
        inventory,
        portalStats,
        portalCollection: previous
      }, { cardDefinitions: cardCatalog.definitions });
      return migration.migratedCardIds.length > 0
        ? migration.save.portalCollection
        : previous;
    });
  }, [cardCatalog, inventory, portalStats, setPortalCollection, unlockedHeroes]);
  const illustratedPortalBanners = useMemo(
    () => universePortalBanners.filter(banner => getPortalBoosterArt(banner.universe)),
    [universePortalBanners]
  );
  const rotationUniverseNames = useMemo(
    () => illustratedPortalBanners.map(banner => banner.universe),
    [illustratedPortalBanners]
  );
  const rotationCycle = Math.floor(rotationNow / BOOSTER_ROTATION_WINDOW_MS);
  const personalRotation = portalStats?.personalRotation;
  const rotationSchedule = useMemo(
    () => getPersonalPortalRotation(
      rotationUniverseNames,
      rotationCycle * BOOSTER_ROTATION_WINDOW_MS,
      { personalRotation }
    ),
    [rotationCycle, rotationUniverseNames, personalRotation]
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
    ...ocPermanentBanners,
    ...(completedStages.length >= 6 && universePortalBanners.length > 0 ? [multiverseBanner] : [])
  ]), [completedStages.length, multiverseBanner, ocPermanentBanners, universePortalBanners.length]);
  const availablePortalBanners = useMemo(
    () => [...permanentPortalBanners, ...rotationPortalBanners],
    [permanentPortalBanners, rotationPortalBanners]
  );
  const catalogPortalBanners = useMemo(
    () => [...permanentPortalBanners, ...illustratedPortalBanners],
    [illustratedPortalBanners, permanentPortalBanners]
  );
  const portalLabUniverseNames = useMemo(() => Array.from(new Set([
    NEXUS_UNIVERSE,
    ...universePortalBanners.map(banner => banner.universe)
  ])), [universePortalBanners]);
  const availableBannerIds = useMemo(
    () => new Set(availablePortalBanners.map(banner => banner.id)),
    [availablePortalBanners]
  );
  const visibleBannerIds = availablePortalBanners.map(banner => banner.id).join('|');

  useEffect(() => {
    if (visibleBannerIds.split('|').includes(activeBanner)) return;
    clearOpeningTimers();
    openingGuardRef.current = false;
    setActiveBanner(DEFAULT_OC_BOOSTER_ID);
    setOpeningPhase('sealed');
    setBoosterRewards([]);
    setRevealedCards([]);
  }, [activeBanner, visibleBannerIds]);

  const activeBannerData = useMemo(
    () => availablePortalBanners.find(item => item.id === activeBanner) || defaultOcBanner,
    [activeBanner, availablePortalBanners, defaultOcBanner]
  );
  const activeBannerHeroes = visibleHeroes.filter(hero => activeBannerData.match(hero));
  const activeOwnedCount = activeBannerHeroes.filter(hero => unlockedHeroes.includes(hero.id)).length;
  const activeMissingCount = Math.max(0, activeBannerHeroes.length - activeOwnedCount);
  const activeBackdrop = activeBannerData.backdrop
    || (activeBannerData.id === 'multi'
      ? '/images/missions/fusion-rifts.webp'
      : getOpenAiBackdropSrc(activeBannerData.universe, activeBannerData.mode));
  const activeBoosterArt = getPortalBoosterPackArt(activeBannerData.id)
    || getPortalBoosterArt(activeBannerData.universe);
  const activeBoosterPrice = getBoosterPrice(activeBannerData);
  const activeCardSet = cardSetCatalog.definitions.find(
    setDefinition => setDefinition.universe === activeBannerData.universe
  ) || null;
  const activeFreeBoosterCredits = activeBannerData.id === 'multi' || !activeCardSet
    ? 0
    : Math.max(0, Number(portalCollection.freeBoosterCredits?.[activeCardSet.id]) || 0);
  const boosterVisual = activeBoosterArt
    || activeBackdrop
    || '/backgrounds/multiverse-breach-title-arca-v1.png';
  const duplicateStreak = portalStats?.duplicateStreak || 0;
  const pityReady = duplicateStreak >= PITY_LIMIT;
  const normalizedPackQuery = normalizePackSearch(packQuery.trim());
  const browsedPortalBanners = showAllPacks || normalizedPackQuery
    ? catalogPortalBanners
    : availablePortalBanners;
  const catalogGroups = useMemo(() => buildBoosterCatalogGroups({
    banners: browsedPortalBanners,
    heroes: visibleHeroes,
    originalUniverses: ORIGINAL_BOOSTER_UNIVERSES,
    query: packQuery
  }), [browsedPortalBanners, packQuery, visibleHeroes]);
  const filteredPortalBanners = catalogGroups.flatMap(group => group.banners);
  const dossierBanner = useMemo(() => catalogPortalBanners.find(banner => banner.id === dossierBannerId) || null, [catalogPortalBanners, dossierBannerId]);
  const dossierCandidates = useMemo(() => dossierBanner ? makeBoosterCandidates({
    banner: dossierBanner,
    visibleHeroes,
    disabledGearIds: disabledGearSet
  }) : [], [dossierBanner, visibleHeroes, disabledGearSet]);
  const closeDossier = useCallback(() => setDossierBannerId(null), []);
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
  const activeContentUpdate = useMemo(
    () => resolvePortalBoosterEditorialWave({
      packId: activeBannerData.id,
      universe: activeBannerData.universe,
      candidates: activeRewardCandidates,
      authoredUpdate: getOcBoosterContentUpdate(activeBannerData.id)
    }),
    [activeBannerData.id, activeBannerData.universe, activeRewardCandidates]
  );
  const rewardKindCounts = activeRewardCandidates.reduce((counts, reward) => ({
    ...counts,
    [reward.kind]: (counts[reward.kind] || 0) + 1
  }), {});
  const openingLocked = ['charging', 'cutting', 'opening'].includes(openingPhase);
  const cardsVisible = ['revealing', 'complete'].includes(openingPhase);
  const canOpenBooster = openingPhase === 'sealed'
    && (activeFreeBoosterCredits > 0 || breachShards >= activeBoosterPrice)
    && activeRewardCandidates.length > 0;
  const revealedCount = revealedCards.length;
  const rawBoosterRefund = boosterRewards.reduce(
    (total, reward) => total + (reward.rawShardsReturned || 0),
    0
  );
  const portalBackground = activeBackdrop
    ? `linear-gradient(180deg, rgba(4,2,10,0.5), rgba(4,2,10,0.94)), url(${activeBackdrop})`
    : 'linear-gradient(180deg, rgba(4,2,10,0.62), rgba(4,2,10,0.94)), url(/images/missions/fusion-rifts.webp)';
  const portalCollectionCounts = [
    { kind: 'archive', count: (portalCollection.archives || []).length },
    { kind: 'hud', count: (portalCollection.hudThemes || []).length },
    { kind: 'kart', count: (portalCollection.karts || []).length },
    { kind: 'battleMusic', count: (portalCollection.battleMusic || []).length },
    { kind: 'stageMusic', count: (portalCollection.stageMusic || []).length },
    { kind: 'fieldSuper', count: (portalCollection.fieldSupers || []).length },
    ...CUSTOM_COSMETIC_KINDS.map(kind => ({
      kind,
      count: (portalCollection[PORTAL_COLLECTION_ID_KEYS[kind]] || []).length
    }))
  ];
  const portalCollectionTotal = portalCollectionCounts.reduce(
    (total, entry) => total + entry.count,
    0
  );
  const collectionOwnedCount = cardCatalog.definitions.reduce(
    (total, definition) => total + Number((portalCollection.cards?.[definition.id]?.copies || 0) > 0),
    0
  );

  const isCandidateOwned = (candidate) => {
    const cardDefinition = cardDefinitionByReward.get(getCardRewardKey(candidate));
    if ((portalCollection.cards?.[cardDefinition?.id]?.copies || 0) > 0) return true;
    if (ambiguousLegacyRewardKeys.has(getLegacyRewardKey(candidate))) return false;
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
    const collectionKey = PORTAL_COLLECTION_ID_KEYS[candidate.kind];
    if (collectionKey) {
      return (portalCollection[collectionKey] || []).includes(candidate.rewardId);
    }
    return false;
  };

  const applyBoosterTransaction = (rewards, pricePaid, freeCreditSetId = null) => {
    const obtainedAt = new Date().toISOString();
    const cardDefinitions = rewards
      .map(reward => reward.cardDefinition)
      .filter(Boolean);
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
        frame: getUniverseHudFrame(reward.universe)
          || reward.data.frame
          || OPENAI_COSMETIC_VISUALS.hudTheme.image,
        mode: reward.data.mode,
        color: reward.color
      }));
    const newKartIds = rewards
      .filter(reward => reward.kind === 'kart' && !reward.wasDuplicate)
      .map(reward => reward.rewardId);
    const newBattleMusicIds = rewards
      .filter(reward => reward.kind === 'battleMusic' && !reward.wasDuplicate)
      .map(reward => reward.rewardId);
    const newStageMusicIds = rewards
      .filter(reward => reward.kind === 'stageMusic' && !reward.wasDuplicate)
      .map(reward => reward.rewardId);
    const newFieldSuperIds = rewards
      .filter(reward => reward.kind === 'fieldSuper' && !reward.wasDuplicate)
      .map(reward => reward.rewardId);
    const newCustomCosmeticIds = Object.fromEntries(
      CUSTOM_COSMETIC_KINDS.map(kind => [
        kind,
        rewards
          .filter(reward => reward.kind === kind && !reward.wasDuplicate)
          .map(reward => reward.rewardId)
      ])
    );
    const rawRefund = rewards.reduce(
      (sum, reward) => sum + (reward.rawShardsReturned || 0),
      0
    );
    const totalRefund = rewards.reduce((sum, reward) => sum + reward.shardsReturned, 0);
    const netCost = pricePaid - totalRefund;
    const hasNewPortalCollectionIds = (
      newKartIds.length > 0
      || newBattleMusicIds.length > 0
      || newStageMusicIds.length > 0
      || newFieldSuperIds.length > 0
      || Object.values(newCustomCosmeticIds).some(ids => ids.length > 0)
    );

    setBreachShards(previous => previous - pricePaid + totalRefund);
    if (newHeroIds.length > 0) setUnlockedHeroes(previous => appendUnique(previous, newHeroIds));
    if (newInventoryIds.length > 0) setInventory(previous => appendUnique(previous, newInventoryIds));
    setPortalCollection(previous => {
      const freeBoosterCredits = { ...(previous?.freeBoosterCredits || {}) };
      if (freeCreditSetId) {
        freeBoosterCredits[freeCreditSetId] = Math.max(
          0,
          (Number(freeBoosterCredits[freeCreditSetId]) || 0) - 1
        );
      }
      const withRuntimeRewards = {
        ...previous,
        freeBoosterCredits,
        archives: appendUniqueObjects(previous?.archives || [], newArchives),
        hudThemes: appendUniqueObjects(previous?.hudThemes || [], newHudThemes),
        karts: appendUnique(previous?.karts || [], newKartIds),
        battleMusic: appendUnique(previous?.battleMusic || [], newBattleMusicIds),
        stageMusic: appendUnique(previous?.stageMusic || [], newStageMusicIds),
        fieldSupers: appendUnique(previous?.fieldSupers || [], newFieldSuperIds),
        ...Object.fromEntries(
          CUSTOM_COSMETIC_KINDS.map(kind => {
            const collectionKey = PORTAL_COLLECTION_ID_KEYS[kind];
            return [
              collectionKey,
              appendUnique(previous?.[collectionKey] || [], newCustomCosmeticIds[kind])
            ];
          })
        )
      };
      return addCardsToCollection(withRuntimeRewards, cardDefinitions, {
        duplicateMode: previous?.duplicateMode,
        obtainedAt
      }).portalCollection;
    });

    const historyEntries = rewards.map(reward => ({
      rewardId: reward.rewardId,
      cardId: reward.cardDefinition?.id,
      kind: reward.kind,
      name: getLocalizedText(reward.name, lang),
      universe: reward.universe,
      rarity: reward.rarity.id,
      rarityLabel: getLocalizedText(reward.rarity.label, lang),
      rarityColor: reward.rarity.color,
      pack: activeBannerData.label[lang],
      packId: activeBannerData.id,
      pricePaid,
      duplicate: reward.wasDuplicate,
      rawShardsReturned: reward.rawShardsReturned || 0,
      shardsReturned: reward.shardsReturned,
      netCost,
      at: obtainedAt
    }));
    const heroRewards = rewards.filter(reward => reward.kind === 'hero');
    const hasNewHero = heroRewards.some(reward => !reward.wasDuplicate);
    const duplicateHeroes = heroRewards.filter(reward => reward.wasDuplicate).length;

    setPortalStats(previous => appendOpeningHistory({
      ...(previous || {}),
      pulls: (previous?.pulls || 0) + rewards.length,
      packsOpened: (previous?.packsOpened || 0) + 1,
      duplicateStreak: hasNewHero
        ? 0
        : (previous?.duplicateStreak || 0) + Math.max(1, duplicateHeroes),
      fragmentsSpent: (previous?.fragmentsSpent || 0) + pricePaid,
      fragmentsRefunded: (previous?.fragmentsRefunded || 0) + totalRefund,
      lastPackEconomy: {
        packId: activeBannerData.id,
        pricePaid,
        rawRefund,
        refundAwarded: totalRefund,
        netCost,
        at: obtainedAt
      },
      lastPull: historyEntries[historyEntries.length - 1]
    }, historyEntries.slice().reverse()));
    setBoosterRefund(totalRefund);
    if (
      newHeroIds.length > 0
      || newInventoryIds.length > 0
      || newArchives.length > 0
      || newHudThemes.length > 0
      || hasNewPortalCollectionIds
    ) {
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
    const freeCreditSetId = activeFreeBoosterCredits > 0 ? activeCardSet?.id : null;
    const pricePaid = freeCreditSetId ? 0 : activeBoosterPrice;
    const rewards = capDuplicateRefunds(
      createBoosterRewards({
        candidates: activeRewardCandidates,
        ownedIds: ownedCandidateIds,
        pityReady,
        preferUniverseSpread: activeBannerData.id === 'multi',
        guaranteeNonHeroRare: activeBannerData.guaranteeNonHeroRare
      }),
      pricePaid
    );
    if (rewards.length !== BOOSTER_CARD_COUNT) {
      openingGuardRef.current = false;
      return;
    }
    const rewardsWithCards = rewards.map(reward => ({
      ...reward,
      cardDefinition: cardDefinitionByReward.get(getCardRewardKey(reward)) || null
    }));
    setBoosterRewards(rewardsWithCards);
    setRevealedCards([]);
    setOpeningPhase('charging');
    sound.playSfx('portal');
    applyBoosterTransaction(rewardsWithCards, pricePaid, freeCreditSetId);

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

  const canRerollRotation = typeof onRerollRotation === 'function'
    && rotationUniverseNames.length > BOOSTER_ROTATION_SIZE
    && gold >= ROTATION_REROLL_GOLD_COST
    && openingPhase === 'sealed'
    && !rotationPending;

  const requestRotationReroll = () => {
    if (!canRerollRotation || rotationPendingRef.current) return;
    setRotationMessage(null);
    setRotationConfirmation({
      requestId: crypto.randomUUID(),
      universes: [...rotationUniverseNames],
      expectedCycle: rotationSchedule.cycle
    });
  };

  const confirmRotationReroll = async () => {
    if (!rotationConfirmation || !canRerollRotation || rotationPendingRef.current) return;
    rotationPendingRef.current = true;
    setRotationPending(true);
    try {
      // The parent persists the idempotent transaction before confirming debit.
      // Keep this request ID on failure so retrying cannot charge a second time.
      const result = await onRerollRotation(rotationConfirmation);
      setRotationMessage(result?.applied ? 'applied' : result?.reason || 'persistence-failed');
      if (result?.applied || result?.reason === 'already-applied') setRotationConfirmation(null);
    } catch {
      setRotationMessage('persistence-failed');
    } finally {
      rotationPendingRef.current = false;
      setRotationPending(false);
    }
  };

  const rotationMessages = {
    applied: { fr: 'Rotation renouvelée et sauvegardée. Les permanents restent inchangés.', en: 'Rotation refreshed and saved. Permanent boosters are unchanged.' },
    'already-applied': { fr: 'Ce renouvellement est déjà enregistré. Aucun second débit.', en: 'This refresh is already recorded. No second charge.' },
    'invalid-request': { fr: 'Demande invalide. Annule puis ouvre une nouvelle confirmation.', en: 'Invalid request. Cancel and open another confirmation.' },
    'insufficient-gold': { fr: 'Or insuffisant. Aucun renouvellement appliqué.', en: 'Not enough gold. No refresh applied.' },
    'not-enough-universes': { fr: 'Pas assez de Trames disponibles pour une autre sélection.', en: 'Not enough available Threads for another selection.' },
    'stale-cycle': { fr: 'La rotation a changé. Annule puis demande une nouvelle confirmation.', en: 'The rotation changed. Cancel and request a new confirmation.' },
    busy: { fr: 'Une transaction est déjà en cours. Attends sa confirmation.', en: 'A transaction is already in progress. Wait for confirmation.' },
    'save-conflict': { fr: 'La sauvegarde a changé ailleurs. Annule puis synchronise ton archive avant une nouvelle confirmation.', en: 'The save changed elsewhere. Cancel and sync your archive before another confirmation.' },
    'persistence-failed': { fr: 'Sauvegarde non confirmée. Réessaie cette confirmation sans créer une nouvelle demande.', en: 'Save not confirmed. Retry this confirmation without creating another request.' }
  };

  const equippedCustomCosmetics = Object.fromEntries(
    CUSTOM_COSMETIC_KINDS.map(kind => [
      kind,
      getUnlockableById(kind, portalCollection.customLoadout?.[kind])
    ])
  );
  const equippedPortalAtlas = equippedCustomCosmetics.portalEffect?.visual;
  const equippedPortalRows = Math.max(1, Number(equippedPortalAtlas?.rows) || 1);
  const equippedPortalRow = Math.max(
    0,
    Math.min(equippedPortalRows - 1, Number(equippedPortalAtlas?.row) || 0)
  );

  const closeArtPreview = () => {
    setArtPreviewOpen(false);
    window.requestAnimationFrame(() => previewTriggerRef.current?.focus());
  };

  const updateCollectionCard = (cardId, patch) => {
    setPortalCollection(previous => {
      const entry = previous?.cards?.[cardId];
      if (!entry) return previous;
      return {
        ...previous,
        cards: {
          ...previous.cards,
          [cardId]: { ...entry, ...patch }
        }
      };
    });
  };

  const handleClaimSetMilestone = (setDefinition, rewardDescriptor) => {
    const milestone = Number(rewardDescriptor.milestone);
    const claim = claimSetMilestone({
      portalCollection,
      setDefinition,
      milestone
    });
    if (!claim.claimed) return;

    const unlockables = getUniverseUnlockables(setDefinition.universe);
    let nextCollection = claim.portalCollection;
    if (milestone === 10) {
      nextCollection = {
        ...nextCollection,
        freeBoosterCredits: {
          ...(nextCollection.freeBoosterCredits || {}),
          [setDefinition.id]: (Number(nextCollection.freeBoosterCredits?.[setDefinition.id]) || 0)
            + Math.max(1, Number(rewardDescriptor.amount) || 1)
        }
      };
    }
    if (milestone === 25 && unlockables?.profileTitle) {
      nextCollection = {
        ...nextCollection,
        profileTitles: appendUnique(nextCollection.profileTitles || [], [unlockables.profileTitle.id])
      };
    }
    if (milestone === 50 && unlockables?.profileBanner) {
      nextCollection = {
        ...nextCollection,
        profileBanners: appendUnique(nextCollection.profileBanners || [], [unlockables.profileBanner.id])
      };
    }
    if (milestone === 75) {
      const effect = unlockables?.portalEffect || unlockables?.koEffect;
      if (effect) {
        const collectionKey = PORTAL_COLLECTION_ID_KEYS[effect.kind];
        nextCollection = {
          ...nextCollection,
          [collectionKey]: appendUnique(nextCollection[collectionKey] || [], [effect.id])
        };
      }
    }
    if (milestone === 90) {
      const hudDefinition = cardCatalog.definitions.find(definition => (
        definition.universe === setDefinition.universe && definition.rewardKind === 'hud'
      ));
      const hudArt = hudDefinition?.artId ? cardCatalog.artById[hudDefinition.artId] : null;
      if (hudDefinition) {
        const hudTheme = {
          id: hudDefinition.rewardId,
          name: hudDefinition.name,
          universe: hudDefinition.universe,
          image: hudArt?.backdrop || hudArt?.image,
          frame: hudArt?.image || OPENAI_COSMETIC_VISUALS.hudTheme.image,
          mode: 'RPG',
          color: hudDefinition.color
        };
        nextCollection = {
          ...nextCollection,
          hudThemes: appendUniqueObjects(nextCollection.hudThemes || [], [hudTheme])
        };
      }
    }
    if (milestone === 100) {
      const completionDefinition = completionCardDefinitions.find(definition => (
        definition.setId === setDefinition.id
      ));
      if (completionDefinition) {
        nextCollection = addCardToCollection(nextCollection, completionDefinition, {
          duplicateMode: nextCollection.duplicateMode
        }).portalCollection;
        const completionEntry = nextCollection.cards?.[completionDefinition.id];
        nextCollection = {
          ...nextCollection,
          cards: {
            ...nextCollection.cards,
            [completionDefinition.id]: {
              ...completionEntry,
              finishesOwned: appendUnique(completionEntry?.finishesOwned || [], ['animated'])
            }
          },
          masterFrames: appendUnique(nextCollection.masterFrames || [], [setDefinition.id])
        };
      }
    }
    setPortalCollection(nextCollection);
    sound.playSfx('levelup');
  };

  if (collectionOnly) {
    return (
      <main className="title-collection-route" data-title-collection="true">
        <React.Suspense fallback={(
          <div className="tcg-album-overlay" role="status">
            <div className="tcg-empty-state">
              {lang === 'fr' ? 'Indexation de la collection...' : 'Indexing collection...'}
            </div>
          </div>
        )}>
          <CollectionHome
            lang={lang}
            definitions={collectionDefinitions}
            sets={cardSetCatalog.definitions}
            cards={portalCollection.cards || {}}
            setProgress={portalCollection.setProgress || {}}
            history={portalStats?.history || []}
            diagnostics={collectionDiagnostics}
            onClose={onBack}
            onUpdateCard={updateCollectionCard}
            onClaimMilestone={handleClaimSetMilestone}
          />
        </React.Suspense>
      </main>
    );
  }

  return (
    <div
      className="portal-container booster-portal"
      inert={Boolean(dossierBanner)}
      data-pack-id={activeBannerData.id}
      data-booster-phase={openingPhase}
      data-portal-effect={equippedCustomCosmetics.portalEffect?.style || 'standard'}
      style={{
        '--portal-color': equippedCustomCosmetics.portalEffect?.color || activeBannerData.color,
        '--portal-effect-color': equippedCustomCosmetics.portalEffect?.color || activeBannerData.color,
        '--portal-effect-duration': `${equippedCustomCosmetics.portalEffect?.visual?.durationMs || 1200}ms`,
        '--portal-effect-intensity': equippedCustomCosmetics.portalEffect?.visual?.intensity || 0.9,
        backgroundImage: portalBackground,
        boxShadow: equippedCustomCosmetics.portalEffect
          ? `inset 0 0 90px ${equippedCustomCosmetics.portalEffect.color}33`
          : undefined
      }}
    >
      {equippedPortalAtlas?.sheet && (
        <span
          className="portal-openai-effect-atlas"
          aria-hidden="true"
          style={{
            '--portal-effect-sheet': `url(${equippedPortalAtlas.sheet})`,
            '--portal-effect-columns': equippedPortalAtlas.columns || 4,
            '--portal-effect-rows': equippedPortalRows,
            '--portal-effect-row': `${equippedPortalRows > 1 ? (equippedPortalRow / (equippedPortalRows - 1)) * 100 : 0}%`
          }}
        />
      )}
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
        <button
          type="button"
          className="btn-retro"
          disabled={openingLocked}
          data-open-tcg-album="true"
          onClick={() => {
            setCollectionOpen(true);
            sound.playSfx('click');
          }}
        >
          {lang === 'fr' ? 'ALBUM DES TRAMES' : 'THREAD ALBUM'} {collectionOwnedCount}/{cardCatalog.definitions.length}
        </button>
        <button
          type="button"
          className="btn-retro"
          data-open-portal-lab="true"
          disabled={openingLocked}
          onClick={() => {
            setPortalLabOpen(true);
            sound.playSfx('click');
          }}
        >
          PORTAL LAB P3
        </button>
        <div className="portal-shard-counter">
          {getTranslation(lang, 'shards')}: <strong>{breachShards}</strong>
          {activeFreeBoosterCredits > 0 ? (
            <small> / {lang === 'fr' ? 'BOOSTER OFFERT' : 'FREE BOOSTER'} x{activeFreeBoosterCredits}</small>
          ) : null}
        </div>
      </div>

      <h1 className="cyber-title booster-portal-title">{getTranslation(lang, 'btnPortal')}</h1>
      <p className="booster-portal-lead">
        {lang === 'fr'
          ? 'Chaque booster renferme exactement 5 cartes. L Album des Trames conserve les copies, la maitrise, les finitions et les 100 derniers tirages sans doubler les remboursements de fragments.'
          : 'Every booster contains exactly 5 cards. The Thread Album preserves copies, mastery, finishes and the last 100 pulls without duplicating fragment refunds.'}
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

        {typeof onRerollRotation === 'function' && (
          <div data-personal-rotation-controls="true" aria-busy={rotationPending} style={{ marginTop: 12, padding: 12, border: '1px solid #67582f', borderRadius: 6 }}>
            <p style={{ margin: '0 0 10px' }}>{lang === 'fr'
              ? `Renouveler uniquement les offres temporaires : ${ROTATION_REROLL_GOLD_COST} Or. Disponible : ${gold} Or. Les boosters permanents, garanties et tirages obtenus ne changent pas.`
              : `Refresh temporary offers only: ${ROTATION_REROLL_GOLD_COST} Gold. Available: ${gold} Gold. Permanent boosters, guarantees and obtained pulls do not change.`}</p>
            {rotationConfirmation ? (
              <div role="group" aria-label={lang === 'fr' ? 'Confirmer le renouvellement payant' : 'Confirm paid rotation refresh'} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button type="button" className="btn-retro" disabled={!canRerollRotation} onClick={confirmRotationReroll}>
                  {rotationPending ? (lang === 'fr' ? 'SAUVEGARDE EN COURS…' : 'SAVING…') : (lang === 'fr' ? `CONFIRMER · ${ROTATION_REROLL_GOLD_COST} OR` : `CONFIRM · ${ROTATION_REROLL_GOLD_COST} GOLD`)}
                </button>
                <button type="button" className="btn-retro" disabled={rotationPending} onClick={() => { setRotationConfirmation(null); setRotationMessage(null); }}>
                  {lang === 'fr' ? 'ANNULER SANS FRAIS' : 'CANCEL AT NO COST'}
                </button>
              </div>
            ) : (
              <button type="button" className="btn-retro" disabled={!canRerollRotation} onClick={requestRotationReroll}>
                {lang === 'fr' ? 'RENOUVELER LA ROTATION…' : 'REFRESH ROTATION…'}
              </button>
            )}
            {rotationUniverseNames.length <= BOOSTER_ROTATION_SIZE && <p>{lang === 'fr' ? `Renouvellement indisponible : active plus de ${BOOSTER_ROTATION_SIZE} Trames illustrées.` : `Refresh unavailable: activate more than ${BOOSTER_ROTATION_SIZE} illustrated Threads.`}</p>}
            {rotationMessage && <p role="status">{getLocalizedText(rotationMessages[rotationMessage] || rotationMessages['persistence-failed'], lang)}</p>}
          </div>
        )}

        {catalogGroups.map(group => (
          <details
            key={group.id}
            data-booster-group={group.id}
            open={Boolean(normalizedPackQuery) || openPackGroups[group.id]}
            onToggle={event => {
              if (normalizedPackQuery) return;
              const open = event.currentTarget.open;
              setOpenPackGroups(previous => previous[group.id] === open ? previous : { ...previous, [group.id]: open });
            }}
            style={{ marginTop: 14, border: '1px solid #284047', borderRadius: 6, padding: 12 }}
          >
            <summary onClick={event => { if (normalizedPackQuery) event.preventDefault(); }} style={{ cursor: 'pointer', fontWeight: 700, padding: '6px 0' }}>
              {group.id === 'original' ? (lang === 'fr' ? 'OC / NEXUS' : 'ORIGINAL / NEXUS') : (lang === 'fr' ? 'UNIVERS DE FRANCHISE' : 'FRANCHISE UNIVERSES')} · {group.banners.length}
            </summary>
            <div className="booster-catalog-grid">
          {group.banners.map(banner => {
            const bannerHeroes = visibleHeroes.filter(hero => banner.match(hero));
            const owned = bannerHeroes.filter(hero => unlockedHeroes.includes(hero.id)).length;
            const isActive = activeBannerData.id === banner.id;
            const isAvailable = availableBannerIds.has(banner.id);
            const isPermanent = banner.scope === 'core';
            const packContentUpdate = banner.contentUpdate;
            const packArt = getPortalBoosterPackArt(banner.id)
              || getPortalBoosterArt(banner.universe);
            const packPrice = getBoosterPrice(banner);
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
                onClick={() => setDossierBannerId(banner.id)}
                disabled={openingLocked}
                className={`portal-booster ${packArt ? 'has-pack-art' : 'generated-pack-art'} ${isActive ? 'selected' : ''} ${!isAvailable ? 'unavailable' : ''}`}
                aria-pressed={isActive}
                aria-haspopup="dialog"
                title={!isAvailable
                  ? (lang === 'fr' ? 'Apercu uniquement: hors rotation actuelle.' : 'Preview only: outside the current rotation.')
                  : undefined}
                style={{
                  '--pack-color': banner.color,
                  cursor: openingLocked ? 'wait' : 'pointer',
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.93)), url(${packImage})`
                }}
              >
                <span className="portal-booster-kicker">
                  {banner.mode} / {banner.mediaLabel?.[lang] || (lang === 'fr' ? 'TRAME' : 'THREAD')}
                </span>
                <span className="portal-booster-title">{banner.label[lang]}</span>
                <span className="portal-booster-desc">{banner.desc[lang]}</span>
                <span className="portal-booster-meta">
                  {owned}/{bannerHeroes.length} - {packScope} - {packPrice} {lang === 'fr' ? 'Fragments' : 'Shards'}
                </span>
                <span className={`portal-booster-art-badge ${isPermanent ? 'permanent' : isAvailable ? 'active' : 'inactive'}`}>
                  {isPermanent
                    ? packContentUpdate
                      ? `${lang === 'fr' ? 'PERMANENT · MÀJ' : 'PERMANENT · UPDATE'} V${packContentUpdate.version}`
                      : 'PERMANENT'
                    : isAvailable
                      ? (lang === 'fr' ? 'ROTATION ACTIVE' : 'ACTIVE ROTATION')
                      : (lang === 'fr' ? 'HORS ROTATION' : 'OFF ROTATION')}
                </span>
              </button>
            );
          })}
            </div>
            {group.banners.length === 0 && <p>{lang === 'fr' ? 'Aucun booster dans cette sélection.' : 'No boosters in this selection.'}</p>}
          </details>
        ))}

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
          {activeContentUpdate && (
            <div
              className="portal-focus-rate booster-guarantee"
              data-content-update={activeContentUpdate.id}
              aria-live="polite"
            >
              <strong>
                {activeContentUpdate.type === 'editorial-wave'
                  ? (lang === 'fr' ? 'SÉLECTION ÉDITORIALE' : 'EDITORIAL SPOTLIGHT')
                  : (lang === 'fr' ? 'MISE À JOUR' : 'CONTENT UPDATE')} V{activeContentUpdate.version}
              </strong>
              {' · '}
              <time dateTime={activeContentUpdate.releasedAt}>
                {formatContentUpdateDate(activeContentUpdate.releasedAt, lang)}
              </time>
              {' · '}
              {activeContentUpdate.type === 'editorial-wave' ? '' : '+'}
              {(activeContentUpdate.featuredCardIds || activeContentUpdate.newCardIds).length}{' '}
              {activeContentUpdate.type === 'editorial-wave'
                ? (lang === 'fr' ? 'CARTES MISES EN AVANT' : 'FEATURED CARDS')
                : (lang === 'fr' ? 'CARTES' : 'CARDS')}
              <br />
              {getLocalizedText(activeContentUpdate.summary, lang)}
            </div>
          )}
          <div className="portal-focus-stats">
            <span>{activeOwnedCount}/{activeBannerHeroes.length} {lang === 'fr' ? 'persos' : 'characters'}</span>
            <span>{activeMissingCount} {lang === 'fr' ? 'signatures absentes' : 'missing signatures'}</span>
            <span>{activeRewardCandidates.length} {lang === 'fr' ? 'cartes possibles' : 'possible cards'}</span>
            <span>{activeBoosterPrice} {lang === 'fr' ? 'Fragments' : 'Shards'}</span>
          </div>
          <div className="booster-pool-types">
            {REWARD_KIND_ORDER.map(kind => (
              <span key={kind}>
                {REWARD_KIND_LABELS[kind]?.[lang] || kind} <strong>{rewardKindCounts[kind] || 0}</strong>
              </span>
            ))}
          </div>
          <button
            type="button"
            className="btn-retro booster-reward-manifest"
            disabled={openingLocked}
            aria-haspopup="dialog"
            onClick={() => setDossierBannerId(activeBannerData.id)}
          >
            {lang === 'fr' ? 'DOSSIER ET CATALOGUE COMPLETS' : 'COMPLETE DOSSIER AND CATALOG'} · {activeRewardCandidates.length}
          </button>
          <div className="portal-rate-grid">
            {Object.values(PORTAL_RARITIES).map(rarity => (
              <span key={rarity.id} style={{ '--rarity-color': rarity.color }}>
                {rarity.label[lang]} / {rarity.weight}%
              </span>
            ))}
          </div>
          <div className="portal-focus-rate booster-guarantee">
            {lang === 'fr'
              ? `GARANTIES: 5 cartes / 1 personnage / 1 Rare ou mieux${activeBannerData.guaranteeNonHeroRare ? ' hors personnage' : ''}.`
              : `GUARANTEES: 5 cards / 1 character / 1 Rare or better${activeBannerData.guaranteeNonHeroRare ? ' non-character reward' : ''}.`}
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
              ? 'Les missions et les modes restent lies a la progression de jeu. Les remboursements d echos sont plafonnes a 70 % du prix du pack.'
              : 'Missions and modes remain tied to gameplay progression. Echo refunds are capped at 70% of the pack price.'}
          </p>
        </div>

        <div
          className={`booster-universe-stage phase-${openingPhase}`}
          data-booster-phase={openingPhase}
          style={{ '--portal-color': activeBannerData.color }}
        >
          <div
            className="booster-stage-portal-visual"
            style={{
              '--portal-image': activeBackdrop ? `url(${activeBackdrop})` : 'none',
              '--portal-color': activeBannerData.color
            }}
            aria-hidden="true"
          >
            <span className="booster-stage-portal-backdrop" />
            <PortalAtlas
              universe={activeBannerData.universe}
              openingPhase={openingPhase}
              lang={lang}
              className="booster-stage-portal-atlas"
              decorative
              style={{ '--portal-atlas-color': activeBannerData.color }}
            />
          </div>

          {!cardsVisible && (
            <button
              type="button"
              className={`breach-booster-pack ${activeBoosterArt ? 'uses-real-art' : 'uses-generated-art'}`}
              onClick={() => setDossierBannerId(activeBannerData.id)}
              disabled={openingLocked}
              aria-haspopup="dialog"
              aria-label={lang === 'fr'
                ? `Consulter ${activeBannerData.label.fr} sans acheter`
                : `Preview ${activeBannerData.label.en} without buying`}
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
                    ? `Echos convertis automatiquement: +${boosterRefund} Fragments${rawBoosterRefund > boosterRefund ? ` (plafond applique sur ${rawBoosterRefund})` : ''}.`
                    : `Echoes automatically converted: +${boosterRefund} Shards${rawBoosterRefund > boosterRefund ? ` (cap applied to ${rawBoosterRefund})` : ''}.`}
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
              ? `OUVRIR LE BOOSTER — ${activeBoosterPrice} FRAGMENTS`
              : `OPEN BOOSTER — ${activeBoosterPrice} SHARDS`}
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

      <section className="booster-collection-panel" aria-label={lang === 'fr' ? 'Collection et personnalisation' : 'Collection and customization'}>
        <p>{portalCollectionTotal} {lang === 'fr' ? 'déblocages conservés. Consulte les cartes dans l’Album ; personnalise le HUD et ton profil dans le Dossier d’Ancre.' : 'preserved unlocks. Browse cards in the Album; customize your HUD and profile in the Anchor record.'}</p>
        <button type="button" className="btn-retro" onClick={() => setCollectionOpen(true)}>{lang === 'fr' ? 'Ouvrir l’Album' : 'Open Album'}</button>
        {onOpenAnchorProfile && <button type="button" className="btn-retro" onClick={onOpenAnchorProfile}>{lang === 'fr' ? 'Personnaliser l’Ancre' : 'Customize Anchor'}</button>}
      </section>

      {(portalStats?.history || []).length > 0 && (
        <details className="booster-history-panel" aria-labelledby="booster-history-title">
          <summary id="booster-history-title" className="booster-section-kicker" style={{ cursor: 'pointer' }}>
            {lang === 'fr' ? 'HISTORIQUE DE FAILLE' : 'RIFT HISTORY'} / {portalStats?.packsOpened || 0} {lang === 'fr' ? 'boosters' : 'boosters'}
          </summary>
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
        </details>
      )}

      {dossierBanner && (
        <PortalBoosterDossier
          key={dossierBanner.id}
          banner={dossierBanner}
          candidates={dossierCandidates}
          lang={lang}
          available={availableBannerIds.has(dossierBanner.id) && !openingLocked}
          selected={activeBannerData.id === dossierBanner.id}
          duplicateStreak={duplicateStreak}
          pityLimit={PITY_LIMIT}
          isCandidateOwned={isCandidateOwned}
          onClose={closeDossier}
          onSelect={bannerId => {
            handleSelectBanner(bannerId);
            closeDossier();
          }}
          kindLabels={REWARD_KIND_LABELS}
          kindOrder={REWARD_KIND_ORDER}
          rarities={PORTAL_RARITIES}
          Artwork={RewardArtwork}
          getRewardDetail={getRewardDetail}
        />
      )}

      {collectionOpen ? (
        <React.Suspense fallback={(
          <div className="tcg-album-overlay" role="status">
            <div className="tcg-empty-state">
              {lang === 'fr' ? 'Indexation de la collection...' : 'Indexing collection...'}
            </div>
          </div>
        )}>
          <CollectionHome
            lang={lang}
            definitions={collectionDefinitions}
            sets={cardSetCatalog.definitions}
            cards={portalCollection.cards || {}}
            setProgress={portalCollection.setProgress || {}}
            history={portalStats?.history || []}
            diagnostics={collectionDiagnostics}
            onClose={() => {
              setCollectionOpen(false);
              sound.playSfx('click');
            }}
            onUpdateCard={updateCollectionCard}
            onClaimMilestone={handleClaimSetMilestone}
          />
        </React.Suspense>
      ) : null}

      {portalLabOpen ? (
        <React.Suspense fallback={null}>
          <PortalLab
            isOpen
            lang={lang}
            initialUniverse={activeBannerData.universe}
            universes={portalLabUniverseNames}
            onClose={() => {
              setPortalLabOpen(false);
              sound.playSfx('click');
            }}
          />
        </React.Suspense>
      ) : null}

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
