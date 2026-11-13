export const ORIGINAL_CONTENT_NOTICE = {
  en: 'Entirely original content created for Multiverse Breach.',
  fr: 'Contenu entièrement original créé pour Multiverse Breach.'
};

export function defineSkill(id, name, desc, role) {
  return { id, name, desc, role };
}

export function defineHero(contentPackId, universeSlug, {
  id,
  name,
  cat,
  color,
  weapon,
  stats,
  lore,
  visual,
  skills
}) {
  return {
    id,
    name,
    cat,
    color,
    weapon,
    weaponType: weapon,
    stats,
    skills,
    lore,
    loreLocalized: lore,
    contentPackId,
    contentOrigin: 'oc',
    originalContent: true,
    originalContentNotice: ORIGINAL_CONTENT_NOTICE,
    spriteSource: `/sprites/generated/heroes/${universeSlug}/${id.replaceAll('_', '-')}.png`,
    spritePrompt: `Entirely original character for Multiverse Breach, no existing franchise reference. ${visual} Complete 4 by 4 pixel-art combat sprite sheet: idle, run, attack, hit reactions; consistent silhouette and equipment; isolated on flat chroma green background; no text, no logo, no frame.`
  };
}

export function defineThreat(contentPackId, universeSlug, {
  id,
  name,
  nameLocalized,
  lore,
  visual,
  weapon,
  special,
  stats = {}
}) {
  return {
    id,
    name,
    nameLocalized,
    lore,
    loreLocalized: lore,
    weapon,
    special,
    ...stats,
    contentPackId,
    contentOrigin: 'oc',
    originalContent: true,
    originalContentNotice: ORIGINAL_CONTENT_NOTICE,
    spriteSource: `/sprites/generated/bosses/${universeSlug}/${id.replaceAll('_', '-')}.png`,
    spritePrompt: `Entirely original enemy for Multiverse Breach, no existing franchise reference. ${visual} Complete 4 by 4 pixel-art combat sprite sheet: idle, movement, signature attack, hit reactions; readable silhouette and anatomy; isolated on flat chroma green background; no text, no logo, no frame.`
  };
}

export function defineGear(contentPackId, universeSlug, {
  id,
  name,
  desc,
  boost,
  visual
}) {
  return [
    id,
    name.en,
    name.fr,
    boost,
    {
      contentPackId,
      contentOrigin: 'oc',
      originalContent: true,
      originalContentNotice: ORIGINAL_CONTENT_NOTICE,
      desc,
      icon: `/sprites/generated/items/${universeSlug}/${id.replaceAll('_', '-')}.png`,
      iconPrompt: `Entirely original Multiverse Breach relic. ${visual} Single centered pixel-art inventory icon, crisp silhouette, controlled glow, transparent background, no text, no logo, no border.`,
      visualAnchor: visual,
      audit: 'original-oc'
    }
  ];
}

export function defineEvent(contentPackId, universeSlug, {
  id,
  name,
  desc,
  visual
}) {
  return [
    id,
    name.en,
    name.fr,
    desc.en,
    desc.fr,
    {
      contentPackId,
      contentOrigin: 'oc',
      originalContent: true,
      originalContentNotice: ORIGINAL_CONTENT_NOTICE,
      icon: `/sprites/generated/items/${universeSlug}/${id.replaceAll('_', '-')}.png`,
      iconPrompt: `Entirely original Multiverse Breach event relic. ${visual} Single centered pixel-art event icon, strong readable silhouette, transparent background, no text, no logo, no border.`,
      summonIcon: `/sprites/generated/items/${universeSlug}/${universeSlug}-summon.png`,
      summonIconPrompt: `Entirely original Multiverse Breach allied assist inspired by this universe's visual language: ${visual} Single centered pixel-art summon icon, compact readable silhouette, transparent background, no text, no logo, no border.`,
      visualAnchor: visual,
      audit: 'original-oc'
    }
  ];
}

export function defineScene(id, speaker, text, direction) {
  return { id, speaker, text, direction };
}

export function defineMission({
  id,
  contentPackId,
  universe,
  previousStageId,
  mode,
  difficulty,
  tacticsBattlefieldId = null,
  smashArenaId = null,
  name,
  bossName,
  bossNameLocalized,
  enemyRoster,
  enemyRosterExclusive = true,
  intro,
  scenes,
  outro,
  objective,
  stakes,
  consequence,
  reward,
  rewardItemId,
  rewardItemName,
  eventRewardId = null,
  goldPrize,
  shardPrize,
  tokenPrize
}) {
  return {
    id,
    stageId: id,
    contentPackId,
    universe,
    ocDlc: true,
    dlcStage: true,
    contentOrigin: 'oc',
    originalContent: true,
    standalone: true,
    campaignDependency: null,
    previousStageId,
    mode,
    difficulty,
    tacticsBattlefieldId,
    smashArenaId,
    name,
    displayName: name,
    bossName,
    bossNameLocalized,
    enemyRoster,
    enemyRosterExclusive,
    intro,
    scenes,
    outro,
    storyBeat: { intro, scenes, outro },
    objective,
    stakes,
    consequence,
    reward,
    rewardItemId,
    rewardItemName,
    eventRewardId,
    goldPrize,
    shardPrize,
    tokenPrize
  };
}
