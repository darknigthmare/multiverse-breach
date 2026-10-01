// The Curse of the Black Pearl (2003), Isla de Muerta. The film's missing
// Turner payment is Will's blood, inherited from Bootstrap Bill; Jack also
// pays for the medallion he takes during the duel. Crossover heroes coordinate
// these source characters rather than replacing either donor.
export const PIRATES_CURSE_RULES = Object.freeze({
  totalPieces: 882,
  initialReturnedPieces: 880,
  finalCoins: 2,
  commandImpactTicks: 18
});

const unitId = unit => unit?.battleId || unit?.runtimeId || unit?.id;
const cursedNames = new Set(['Hector Barbossa', 'Cursed Aztec Pirate']);

export function isCanonPiratesCurseStage(stage = {}) {
  return Number(stage.id) === 269 && stage.mode === 'RPG'
    && stage.universe === 'Pirates of the Caribbean'
    && stage.enemyRosterExclusive === true
    && stage.canonicalBossName === 'Hector Barbossa'
    && stage.incarnation === 'Pirates of the Caribbean: The Curse of the Black Pearl (2003) - Isla de Muerta'
    && !stage.customBattle && !stage.isCustomBattle && !stage.isCustom;
}

export function createPiratesCurseEncounter(stage) {
  return isCanonPiratesCurseStage(stage) ? {
    curseActive: true,
    returnedPieces: PIRATES_CURSE_RULES.initialReturnedPieces,
    finalCoinsCollected: false,
    willBloodReady: false,
    jackBloodReady: false,
    ritualPending: false,
    commandPending: null,
    sourceShotFired: false,
    sourceShotResolved: false
  } : null;
}

export function isPiratesCursedCombatant(encounter, target, enemies) {
  return !!encounter && enemies.includes(target)
    && cursedNames.has(target?.canonicalName || target?.name);
}

export function isPiratesCurseProtected(encounter, target, enemies) {
  // Restitution and Jack's source shot form one finale transaction. The crew
  // are biologically mortal after restitution, but ordinary queued impacts
  // cannot interleave a new death before the duel has finished. Keep this
  // lock after shot resolution too: due callbacks run before victory checks.
  return !!(encounter?.curseActive || encounter?.sourceShotFired)
    && isPiratesCursedCombatant(encounter, target, enemies);
}

export function getPiratesBarbossa(encounter, enemies) {
  if (!encounter) return null;
  return enemies.find(enemy => enemy.isBoss && (enemy.canonicalName || enemy.name) === 'Hector Barbossa') || null;
}

export function getPiratesCurseNextCommand(encounter) {
  if (!encounter?.curseActive || encounter.commandPending) return null;
  if (!encounter.finalCoinsCollected) return 'collect-final-coins';
  if (!encounter.willBloodReady || !encounter.jackBloodReady) return 'coordinate-will';
  return 'restore-chest';
}

export function getPiratesCurseEncounterSnapshot(encounter, enemies, canCommand) {
  const boss = getPiratesBarbossa(encounter, enemies);
  if (!encounter || !boss) return null;
  const nextCommand = getPiratesCurseNextCommand(encounter);
  return {
    bossId: unitId(boss),
    phase: !encounter.curseActive ? 'mortal'
      : !encounter.finalCoinsCollected ? 'coins'
        : !encounter.willBloodReady || !encounter.jackBloodReady ? 'offerings' : 'restore',
    curseActive: encounter.curseActive,
    totalPieces: PIRATES_CURSE_RULES.totalPieces,
    returnedPieces: encounter.returnedPieces,
    finalCoinsCollected: encounter.finalCoinsCollected,
    willBloodReady: encounter.willBloodReady,
    jackBloodReady: encounter.jackBloodReady,
    ritualPending: encounter.ritualPending,
    commandPending: encounter.commandPending,
    sourceShotFired: encounter.sourceShotFired,
    sourceShotResolved: encounter.sourceShotResolved,
    cinematicLocked: encounter.sourceShotFired,
    sourceWill: { name: 'Will Turner', lineage: 'Bootstrap Bill Turner' },
    sourceJack: { name: 'Jack Sparrow' },
    commands: {
      collectFinalCoins: canCommand && nextCommand === 'collect-final-coins',
      coordinateWill: canCommand && nextCommand === 'coordinate-will',
      restoreChest: canCommand && nextCommand === 'restore-chest'
    },
    sourceMechanics: ['aztec-curse-immortality', 'all-coins-restored', 'bootstrap-lineage-will-blood', 'jack-own-payment', 'jack-final-pistol-shot'],
    adaptation: 'One ATB encounter with Barbossa and two pirates. Source Will and Jack are scripted assistants independent of the playable crossover squad, whose ordinary HP rules remain unchanged; three squad commands condense the final two medallions and their established donors. No player injury is required. Jack’s scripted shot resolves one simulation tick after Will restores the chest. A cinematic lock prevents ordinary queued or external damage from interleaving that finale, even after the source shot resolves but before victory checks. Barbossa’s death ends the cavern duel with the other pirates alive and mortal; their later surrender aboard the Dauntless is outside this encounter.'
  };
}
