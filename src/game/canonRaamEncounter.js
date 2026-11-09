// Gears of War (2006), Pale Horse: Kryll protect RAAM until dispersed by a
// grenade or sent to attack. Light protects the player from that swarm.
// Durations, shared ammunition and three selectable cover lanes adapt this
// source encounter to the existing ATB engine; they are not original timings.
export const RAAM_ENCOUNTER_RULES = Object.freeze({
  grenadeCharges: 4,
  // A slow solo ATB combatant must recharge and land one follow-up attack.
  // This twelve-second opening is an explicit turn-system adaptation.
  grenadeExposureTicks: 720,
  swarmTicks: 420,
  swarmHitInterval: 45,
  swarmDamageMultiplier: 0.6,
  grenadeDamage: 45,
  troikaCoverMultiplier: 0.55
});

const unitId = unit => unit?.battleId || unit?.runtimeId || unit?.id;

export function isCanonRaamStage(stage = {}) {
  return Number(stage.id) === 1 && stage.mode === 'RPG'
    && stage.universe === 'Gears of War' && stage.enemyRosterExclusive === true
    && stage.canonicalBossName === 'General RAAM' && !stage.customBattle;
}

export function createRaamEncounter(stage) {
  return isCanonRaamStage(stage) ? {
    grenadesRemaining: RAAM_ENCOUNTER_RULES.grenadeCharges,
    exposureTicks: 0, swarmTicks: 0, swarmElapsed: 0,
    swarmTargetId: null, attackCount: 0
  } : null;
}

export function getRaamBoss(encounter, enemies = []) {
  if (!encounter) return null;
  return enemies.find(unit => unit.isBoss && unit.currentHp > 0
    && (unit.canonicalName || unit.name) === 'General RAAM') || null;
}

export function isRaamShieldActive(encounter, boss) {
  return !!boss && !!encounter && encounter.swarmTicks <= 0 && encounter.exposureTicks <= 0;
}

export function getRaamLightPosition(hero, width) {
  return { x: Math.round(width * 0.39), y: hero.raamInitialHomeY ?? hero.homeY };
}

export function isHeroInRaamLight(hero, width) {
  if (!hero || hero.currentHp <= 0) return false;
  const light = getRaamLightPosition(hero, width);
  return Math.abs(hero.x - light.x) <= Math.max(18, width * 0.055)
    && Math.abs(hero.y - light.y) <= 24;
}

export function getRaamEnemyAction(abilityType) {
  if (!['simple', 'secondary', 'special'].includes(abilityType)) return null;
  return abilityType === 'simple'
    ? { name: 'Troika Fire', type: 'bullet', dmg: 1, encounterKind: 'troika', rpgProfile: { shape: 'single', delivery: 'ranged' } }
    : { name: 'Kryll Swarm', type: 'kryll_swarm', dmg: 0, cd: 3, encounterKind: 'kryll', rpgProfile: { shape: 'single', delivery: 'ranged' } };
}

export function startRaamKryll(encounter, target) {
  encounter.swarmTicks = RAAM_ENCOUNTER_RULES.swarmTicks;
  encounter.swarmElapsed = 0;
  encounter.swarmTargetId = unitId(target);
}

export function tickRaamEncounter(encounter, heroes) {
  if (!encounter) return null;
  if (encounter.exposureTicks > 0) encounter.exposureTicks--;
  if (encounter.swarmTicks <= 0) return null;
  encounter.swarmTicks--;
  encounter.swarmElapsed++;
  const target = heroes.find(hero => unitId(hero) === encounter.swarmTargetId && hero.currentHp > 0);
  if (!target) {
    encounter.swarmTicks = 0;
    encounter.swarmTargetId = null;
    return null;
  }
  if (encounter.swarmTicks <= 0) encounter.swarmTargetId = null;
  return encounter.swarmElapsed % RAAM_ENCOUNTER_RULES.swarmHitInterval === 0 ? target : null;
}

export function getRaamEncounterSnapshot(encounter, boss, heroes, width, canCommand) {
  if (!encounter || !boss) return null;
  const shieldActive = isRaamShieldActive(encounter, boss);
  return {
    bossId: unitId(boss),
    phase: encounter.swarmTicks > 0 ? 'kryll-out' : shieldActive ? 'shielded' : 'exposed',
    shieldActive,
    exposureTicks: encounter.exposureTicks,
    swarmTicks: encounter.swarmTicks,
    swarmTargetId: encounter.swarmTargetId,
    grenadesRemaining: encounter.grenadesRemaining,
    attackCount: encounter.attackCount,
    heroes: heroes.map(hero => ({ id: unitId(hero), name: hero.name, inLightCover: isHeroInRaamLight(hero, width) })),
    commands: {
      frag: canCommand && encounter.grenadesRemaining > 0,
      takeLightCover: canCommand,
      leaveLightCover: canCommand
    },
    sourceMechanics: ['kryll-shield', 'grenade-dispersal', 'swarm-exposure', 'light-protection'],
    adaptation: 'ATB commands, four frag grenades shared by the crossover squad and selectable lit cover lanes; source camera, original timing and active reload are not reproduced.'
  };
}
