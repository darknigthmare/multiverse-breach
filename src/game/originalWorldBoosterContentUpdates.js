import { ORIGINAL_UNIVERSE_DEFINITIONS } from './originalUniverseWave.js';

const UPDATE_WAVE_ID = 'oc-original-wave-01';
const UPDATE_VERSION = '1.1';
const UPDATE_DATE = '2026-08-01';

const ASSIST_PROFILES = Object.freeze([
  Object.freeze({ style: 'vanguard', damage: 19, guardDamage: 18, healRatio: 0.02 }),
  Object.freeze({ style: 'medic', damage: 10, guardDamage: 12, healRatio: 0.08 }),
  Object.freeze({ style: 'breaker', damage: 14, guardDamage: 30, healRatio: 0.02 }),
  Object.freeze({ style: 'scout', damage: 12, guardDamage: 16, healRatio: 0.05 })
]);

export const deepFreezeOriginalWorldUpdate = (value) => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreezeOriginalWorldUpdate);
  return Object.freeze(value);
};

const hashText = (value) => String(value).split('').reduce(
  (total, character) => ((total * 33) + character.charCodeAt(0)) >>> 0,
  5381
);

const localizedText = (value, locale, fallback = '') => {
  if (typeof value === 'string') return value;
  return value?.[locale] || value?.fr || value?.en || fallback;
};

const makeUnlockableCard = ({
  id,
  kind,
  rarityId,
  universe,
  color,
  name,
  unlockable
}) => ({
  id,
  rewardId: id,
  kind,
  rarityId,
  dropWeight: rarityId === 'anomaly' ? 2 : 1,
  universe,
  color,
  name,
  contentOrigin: 'oc',
  originalContent: true,
  data: {
    unlockable: {
      id,
      kind,
      universe,
      color,
      name,
      contentOrigin: 'oc',
      originalContent: true,
      ...unlockable
    }
  }
});

const requireOriginalWorld = (world) => {
  if (
    !world
    || typeof world !== 'object'
    || !world.key
    || !world.universe
    || !world.booster?.id
    || !Array.isArray(world.stages)
    || world.stages.length < 3
    || !Array.isArray(world.heroes)
    || world.heroes.length < 2
  ) {
    throw new TypeError('An original world with a booster, three stages, and two heroes is required');
  }
};

export const makeOriginalWorldBoosterContentUpdate = (world) => {
  requireOriginalWorld(world);

  const [openingStage, middleStage, finalStage] = world.stages;
  const [leadHero, supportHero] = world.heroes;
  const ultimate = world.battleItems?.find(item => item.tier === 'ultimate')
    || world.battleItems?.at(-1);
  const key = String(world.key);
  const universe = String(world.universe);
  const idStem = `oc_original_${key}_v11`;
  const color = world.visual?.colors?.accent
    || ultimate?.color
    || leadHero.primaryColor
    || '#39c5bb';
  const motif = world.visual?.motif || world.faction || 'rift';
  const titleFr = localizedText(world.title, 'fr', universe);
  const titleEn = localizedText(world.title, 'en', universe);
  const openingFr = localizedText(openingStage.name, 'fr', openingStage.id);
  const openingEn = localizedText(openingStage.name, 'en', openingStage.id);
  const middleFr = localizedText(middleStage.name, 'fr', middleStage.id);
  const middleEn = localizedText(middleStage.name, 'en', middleStage.id);
  const finalFr = localizedText(finalStage.name, 'fr', finalStage.id);
  const finalEn = localizedText(finalStage.name, 'en', finalStage.id);
  const leadName = localizedText(leadHero.name, 'fr', leadHero.id);
  const supportName = localizedText(supportHero.name, 'fr', supportHero.id);
  const conflictFr = localizedText(
    world.lore?.coreConflict || world.lore?.breach,
    'fr',
    titleFr
  );
  const conflictEn = localizedText(
    world.lore?.coreConflict || world.lore?.breach,
    'en',
    titleEn
  );
  const breachFr = localizedText(world.lore?.breach || world.lore?.origin, 'fr', conflictFr);
  const breachEn = localizedText(world.lore?.breach || world.lore?.origin, 'en', conflictEn);
  const outcomeFr = localizedText(
    world.narrativeArc?.outro || world.lore?.origin,
    'fr',
    conflictFr
  );
  const outcomeEn = localizedText(
    world.narrativeArc?.outro || world.lore?.origin,
    'en',
    conflictEn
  );
  const ultimateFr = localizedText(ultimate?.name, 'fr', titleFr);
  const ultimateEn = localizedText(ultimate?.name, 'en', titleEn);
  const ultimateDescFr = localizedText(ultimate?.desc, 'fr', conflictFr);
  const ultimateDescEn = localizedText(ultimate?.desc, 'en', conflictEn);
  const openingArt = openingStage.stageArt || world.audiovisual?.backdrop;
  const middleArt = middleStage.stageArt || openingArt;
  const finalArt = finalStage.stageArt || middleArt;
  const assistProfile = ASSIST_PROFILES[hashText(`${key}:assist:v11`) % ASSIST_PROFILES.length];
  const fieldSeed = hashText(`${key}:field:v11`);

  const archiveId = `archive:${idStem}_opening_record`;
  const battleMusicId = `battle-music:${idStem}_counteroffensive`;
  const stageMusicId = `stage-music:${idStem}_final_vigil`;
  const npcAssistId = `npc-assist:${idStem}_${supportHero.id}`;
  const fieldSuperId = `field-super:${idStem}_${ultimate?.id || 'world_verdict'}`;

  const archiveName = {
    fr: `Dossier restauré — ${openingFr}`,
    en: `Restored Archive — ${openingEn}`
  };
  const archiveCard = {
    id: archiveId,
    rewardId: archiveId,
    kind: 'archive',
    rarityId: 'common',
    dropWeight: 1,
    universe,
    color,
    name: archiveName,
    contentOrigin: 'oc',
    originalContent: true,
    data: {
      image: openingArt,
      backdrop: world.audiovisual?.backdrop || openingArt,
      mode: openingStage.mode || world.mode,
      stageKey: openingStage.stageKey || openingStage.id,
      sourceHeroId: leadHero.id,
      name: archiveName,
      desc: {
        fr: `${leadName} rouvre le dossier de ${openingFr}. ${localizedText(world.lore?.origin, 'fr', conflictFr)}`,
        en: `${leadName} reopens the ${openingEn} record. ${localizedText(world.lore?.origin, 'en', conflictEn)}`
      }
    }
  };

  const battleMusicName = {
    fr: `Contre-offensive de ${leadName} — ${middleFr}`,
    en: `${leadName}'s ${middleEn} Counteroffensive`
  };
  const battleMusicCard = makeUnlockableCard({
    id: battleMusicId,
    kind: 'battleMusic',
    rarityId: 'rare',
    universe,
    color,
    name: battleMusicName,
    unlockable: {
      desc: {
        fr: `Arrangement de combat original de ${titleFr}, construit autour de ${middleFr}. ${conflictFr}`,
        en: `An original ${titleEn} battle arrangement built around ${middleEn}. ${conflictEn}`
      },
      musicStage: {
        id: `custom-battle-music:${idStem}`,
        name: `${titleEn} V1.1 Custom Battle`,
        universe,
        mode: 'Fighter',
        stageKey: middleStage.stageKey || middleStage.id,
        image: middleArt,
        tags: ['customBattle', 'loreArena', 'originalContent', key]
      },
      state: 'battle',
      visual: {
        motif,
        color,
        image: middleArt,
        stageKey: middleStage.stageKey || middleStage.id
      },
      data: {
        sourceArc: world.narrativeArc?.id || key,
        heroId: leadHero.id,
        stageKey: middleStage.stageKey || middleStage.id,
        sourceLore: conflictEn
      }
    }
  });

  const stageMusicName = {
    fr: `Veille finale — ${finalFr}`,
    en: `${finalEn} Final Vigil`
  };
  const stageMusicCard = makeUnlockableCard({
    id: stageMusicId,
    kind: 'stageMusic',
    rarityId: 'rare',
    universe,
    color,
    name: stageMusicName,
    unlockable: {
      desc: {
        fr: `Arrangement de stage original qui accompagne l'approche de ${finalFr}. ${breachFr}`,
        en: `An original stage arrangement accompanying the approach to ${finalEn}. ${breachEn}`
      },
      musicStage: {
        id: `custom-stage-music:${idStem}`,
        name: `${titleEn} V1.1 Custom Stage`,
        universe,
        mode: 'Fighter',
        stageKey: finalStage.stageKey || finalStage.id,
        image: finalArt,
        tags: ['customStage', 'loreArena', 'originalContent', key]
      },
      state: 'grid',
      visual: {
        motif,
        color,
        image: finalArt,
        stageKey: finalStage.stageKey || finalStage.id
      },
      data: {
        sourceArc: world.narrativeArc?.id || key,
        heroId: leadHero.id,
        stageKey: finalStage.stageKey || finalStage.id,
        sourceLore: breachEn
      }
    }
  });

  const npcAssistName = {
    fr: `Renfort de Trame — ${supportName}`,
    en: `${supportName} Thread Assist`
  };
  const npcAssistCard = makeUnlockableCard({
    id: npcAssistId,
    kind: 'npcAssist',
    rarityId: 'epic',
    universe,
    color: supportHero.primaryColor || color,
    name: npcAssistName,
    unlockable: {
      style: assistProfile.style,
      desc: {
        fr: `${supportName} stabilise une brèche de ${titleFr} une fois par combat custom. ${outcomeFr}`,
        en: `${supportName} stabilizes a ${titleEn} breach once per custom battle. ${outcomeEn}`
      },
      effect: {
        damage: assistProfile.damage,
        guardDamage: assistProfile.guardDamage,
        healRatio: assistProfile.healRatio
      },
      visual: {
        motif,
        color: supportHero.primaryColor || color,
        image: supportHero.portrait
          || world.audiovisual?.heroPortraits?.[supportHero.id]
          || middleArt,
        stageKey: middleStage.stageKey || middleStage.id
      },
      data: {
        sourceArc: world.narrativeArc?.id || key,
        heroId: supportHero.id,
        leadHeroId: leadHero.id,
        stageKey: middleStage.stageKey || middleStage.id,
        sourceLore: outcomeEn
      }
    }
  });

  const fieldSuperName = {
    fr: `Résonance amplifiée — ${ultimateFr}`,
    en: `${ultimateEn} Amplified Field Resonance`
  };
  const fieldSuperCard = makeUnlockableCard({
    id: fieldSuperId,
    kind: 'fieldSuper',
    rarityId: 'anomaly',
    universe,
    color,
    name: fieldSuperName,
    unlockable: {
      sourceUltimateId: ultimate?.id || null,
      desc: {
        fr: `Super de terrain de ${titleFr} déclenché depuis ${finalFr}. ${ultimateDescFr}`,
        en: `${titleEn}'s Field Super, triggered from ${finalEn}. ${ultimateDescEn}`
      },
      effect: {
        damage: 38 + (fieldSeed % 4),
        guardDamage: 64 + (fieldSeed % 7),
        knockback: 330 + (fieldSeed % 31),
        healRatio: 0.01 + (fieldSeed % 4) * 0.01
      },
      visual: {
        motif,
        color,
        image: finalArt,
        backdrop: world.audiovisual?.backdrop || finalArt,
        stageKey: finalStage.stageKey || finalStage.id
      },
      data: {
        sourceArc: world.narrativeArc?.id || key,
        heroId: leadHero.id,
        allyId: supportHero.id,
        boss: world.worldBoss?.name || finalStage.boss,
        stageKey: finalStage.stageKey || finalStage.id,
        sourceLore: ultimateDescEn
      }
    }
  });

  const cards = [
    archiveCard,
    battleMusicCard,
    stageMusicCard,
    npcAssistCard,
    fieldSuperCard
  ];

  return deepFreezeOriginalWorldUpdate({
    id: UPDATE_WAVE_ID,
    packId: world.booster.id,
    waveId: UPDATE_WAVE_ID,
    version: UPDATE_VERSION,
    releasedAt: UPDATE_DATE,
    chaseRewardId: fieldSuperId,
    summary: {
      fr: `${titleFr} reçoit cinq cartes exclusives centrées sur ${leadName}, ${supportName} et ${finalFr}.`,
      en: `${titleEn} receives five exclusive cards centered on ${leadName}, ${supportName}, and ${finalEn}.`
    },
    changelog: {
      fr: `Ajout du dossier de ${openingFr}, de deux arrangements custom, du renfort ${supportName} et du Super ${ultimateFr}.`,
      en: `Added the ${openingEn} archive, two custom arrangements, ${supportName}'s assist, and the ${ultimateEn} Field Super.`
    },
    newCardIds: cards.map(card => card.id),
    cards
  });
};

export const ORIGINAL_WORLD_BOOSTER_CONTENT_UPDATES = deepFreezeOriginalWorldUpdate(
  Object.fromEntries(ORIGINAL_UNIVERSE_DEFINITIONS.map(world => [
    world.booster.id,
    makeOriginalWorldBoosterContentUpdate(world)
  ]))
);

export const collectOriginalWorldBoosterUpdateUnlockables = (
  updates = ORIGINAL_WORLD_BOOSTER_CONTENT_UPDATES
) => deepFreezeOriginalWorldUpdate(Object.fromEntries(
  Object.values(updates)
    .flatMap(update => update.cards)
    .map(card => card.data?.unlockable)
    .filter(Boolean)
    .map(unlockable => [unlockable.id, unlockable])
));

export const ORIGINAL_WORLD_BOOSTER_UPDATE_UNLOCKABLES =
  collectOriginalWorldBoosterUpdateUnlockables();

export const getOriginalWorldBoosterContentUpdate = (packId) => (
  ORIGINAL_WORLD_BOOSTER_CONTENT_UPDATES[packId] || null
);
