// Halo 2 Metropolis ends by boarding the Protos Scarab and clearing its crew.
// Its hull is not a damageable Halo 3 reactor encounter.
export const SCARAB_BOARDING_SOURCE_URLS = Object.freeze([
  'https://www.halopedia.org/Metropolis',
  'https://www.halopedia.org/Protos-pattern_Scarab'
]);

export const SCARAB_BOARDING_CELL = Object.freeze({ x: 4, y: 1 });

export function createScarabBoardingEncounter(stage, battlefield, enemies) {
  if (Number(stage.id) !== 2 || stage.universe !== 'Halo'
    || battlefield.id !== 'metropolis_scarab_deck'
    || stage.customBattle || stage.forceBaseArena || stage.dlcSuppressedArena) return null;

  const hull = enemies.find(enemy => enemy.name === 'Covenant Scarab Mech');
  if (!hull) return null;
  const crew = enemies.filter(enemy => ['Covenant Grunt', 'Elite Minor'].includes(enemy.name));
  crew.forEach(enemy => { enemy.scarabCrew = true; });
  hull.scarabHull = true;
  // Jackal snipers defend the urban approach, not the Scarab passenger cabin.
  const approachGuard = enemies.find(enemy => enemy.name === 'Jackal Sniper');
  if (approachGuard) Object.assign(approachGuard, { gridX: 3, gridY: 5 });

  return {
    id: 'halo2_metropolis_scarab_boarding',
    sourceIncarnation: 'Halo 2 (2004) - Metropolis',
    sourceUrls: [...SCARAB_BOARDING_SOURCE_URLS],
    boardingCell: { ...SCARAB_BOARDING_CELL },
    boarded: false,
    boardedBy: null,
    hull,
    crew,
    complete: false
  };
}

export function advanceScarabBoardingEncounter(encounter, heroes) {
  if (!encounter) return null;
  const boardingHero = heroes.find(hero => hero.currentHp > 0
    && hero.gridX === encounter.boardingCell.x && hero.gridY === encounter.boardingCell.y);
  const justBoarded = !encounter.boarded && Boolean(boardingHero);
  if (justBoarded) {
    encounter.boarded = true;
    encounter.boardedBy = boardingHero.id;
  }
  const crewDefeated = encounter.crew.filter(enemy => enemy.currentHp <= 0).length;
  // A missing crew roster must never turn an empty encounter into a victory.
  encounter.complete = encounter.boarded && encounter.crew.length > 0
    && crewDefeated === encounter.crew.length;
  return {
    justBoarded,
    boarded: encounter.boarded,
    crewDefeated,
    crewRemaining: encounter.crew.length - crewDefeated,
    progress: Number(encounter.boarded) + crewDefeated,
    target: 1 + encounter.crew.length,
    complete: encounter.complete
  };
}

export function getScarabEncounterSummary(encounter) {
  if (!encounter) return null;
  return {
    id: encounter.id,
    sourceIncarnation: encounter.sourceIncarnation,
    boarded: encounter.boarded,
    boardedBy: encounter.boardedBy,
    boardingCell: { ...encounter.boardingCell },
    crewTotal: encounter.crew.length,
    crewDefeated: encounter.crew.filter(enemy => enemy.currentHp <= 0).length,
    hullDestroyed: false,
    completed: encounter.complete,
    representation: 'Tactical grid adaptation; scripted vehicle movement and closing cinematic are not reproduced.'
  };
}
