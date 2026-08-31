import { HEROES_DB as BASE_HEROES_DB } from './heroes.js';

export const ARC_UNLOCK_RULES = Object.freeze({
  personalMinLevel: 3,
  universeMinHeroes: 3,
  universeMinLevel: 4,
  trioMinLevel: 5
});

export function projectCharacterArcStage(arc) {
  return {
    id: arc.stageId,
    name: arc.title.en,
    displayName: arc.title,
    universe: arc.heroId === 'player_anchor'
      ? 'Nexus de Convergence'
      : (BASE_HEROES_DB.find(hero => hero.id === arc.heroId)?.universe || 'Nexus de Convergence'),
    mode: arc.mode,
    difficulty: arc.difficulty,
    goldPrize: 150,
    shardPrize: 60,
    tokenPrize: 2,
    bossName: arc.bossName,
    rewardItemId: arc.rewardItemId,
    rewardItemName: arc.reward,
    characterArc: arc,
    ...(arc.escort ? { escort: arc.escort, tacticsBattlefieldId: arc.tacticsBattlefieldId } : {}),
    requiredTeam: {
      ...(arc.requiredTeam || {
        type: 'character',
        heroId: arc.heroId,
        allowAnchor: arc.allowAnchor === true
      }),
      arcId: arc.id
    }
  };
}

// A protected story identity can unlock its own arc without imposing its
// personal level gate on the companions deployed to escort it.
export const resolveMissionHeroLevelRequirement = (stage) => {
  if (stage?.characterArc) {
    const protectedHeroId = stage.characterArc.heroId;
    if (stage.requiredTeam?.excludedHeroIds?.includes(protectedHeroId)) return 1;
    return Math.max(
      ARC_UNLOCK_RULES.personalMinLevel,
      stage.characterArc.unlock?.type === 'level' ? stage.characterArc.unlock.value : 0
    );
  }
  if (stage?.trioArc || stage?.requiredTeam?.type === 'exact') return ARC_UNLOCK_RULES.trioMinLevel;
  if (stage?.universeArc || stage?.requiredTeam?.type === 'universe') return ARC_UNLOCK_RULES.universeMinLevel;
  return 1;
};
