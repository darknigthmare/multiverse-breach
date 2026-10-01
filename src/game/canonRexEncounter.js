// MGS (1998): Stinger fire targets the radome, then the exposed cockpit.
// The tactical pools and shared launcher supply are an explicit game adaptation.
export const REX_SOURCE_INCARNATION = 'Metal Gear Solid (1998) - Shadow Moses';
export const REX_SOURCE_URLS = Object.freeze([
  'https://www.konami.com/mg/archive/mgs/',
  'https://archive.org/download/mgs-1-screenplay/MGS1_Screenplay_djvu.txt',
  'https://www.supercheats.com/playstation/walkthroughs/metalgearsolid-walkthrough05.txt',
  'https://www.supercheats.com/playstation/walkthroughs/metalgearsolid-walkthrough04.txt'
]);

export const REX_STINGER_ACTION = Object.freeze({
  name: 'Stinger mission supply', type: 'missile', dmg: 1,
  tactics: Object.freeze({ delivery: 'ranged', shape: 'single', range: 6, minRange: 2,
    maxTargets: 1, requiresLineOfSight: true, pierceUnits: false, pierceObstacles: false })
});

export function isCanonRexStage(stage) {
  return Boolean(stage && Number(stage.id) === 12 && stage.mode === 'Tactics' && stage.universe === 'Metal Gear'
    && stage.incarnation === REX_SOURCE_INCARNATION && stage.tacticsBattlefieldId === 'shadow_moses_rex_hangar'
    && stage.enemyRosterExclusive === true && stage.canonicalBossName === 'Metal Gear REX'
    && !stage.customBattle && !stage.isCustomBattle && !stage.isCustom
    && !stage.forceBaseArena && !stage.dlcSuppressedArena);
}

export function createRexEncounter(stage, battlefield, enemies) {
  if (!isCanonRexStage(stage) || battlefield.id !== 'shadow_moses_rex_hangar') return null;
  const body = enemies.find(enemy => enemy.name === 'Metal Gear REX Shadow'
    && enemy.canonicalName === 'Metal Gear REX'
    && enemy.incarnation === REX_SOURCE_INCARNATION && enemy.isBoss);
  if (!body) return null;
  const radomeMaxHp = Math.round(body.maxHp / 2);
  const cockpitMaxHp = body.maxHp - radomeMaxHp;
  body.rexBody = true;
  return {
    id: 'mgs1998_shadow_moses_rex', body,
    phase: 'radome', radomeHp: radomeMaxHp, radomeMaxHp,
    cockpitHp: cockpitMaxHp, cockpitMaxHp,
    grayFoxAssistance: false, missileShots: 0, complete: false,
    adaptation: 'The 720 existing boss HP are split between two tactical target pools. Shared mission Stinger supply, a stationary grid target, two-cell minimum range, damage values and turn timing are adaptations. Gray Fox assistance is summarized at the phase transition; his cinematic is not replayed. The mission disables REX and ends before the later fistfight with surviving Liquid Snake.'
  };
}

export function applyRexStingerDamage(encounter, amount) {
  if (!encounter || encounter.complete || !Number.isFinite(amount) || amount <= 0) return null;
  const target = encounter.phase === 'radome' ? 'radomeHp' : 'cockpitHp';
  const before = encounter[target];
  encounter[target] = Math.max(0, before - Math.round(amount));
  encounter.missileShots++;
  let transition = false;
  if (encounter.phase === 'radome' && encounter.radomeHp === 0) {
    encounter.grayFoxAssistance = true;
    encounter.phase = 'cockpit';
    transition = true;
  } else if (encounter.phase === 'cockpit' && encounter.cockpitHp === 0) {
    encounter.phase = 'complete';
    encounter.complete = true;
  }
  return { damage: before - encounter[target], transition, complete: encounter.complete };
}

export function getRexEncounterSummary(encounter) {
  if (!encounter) return null;
  return {
    id: encounter.id, sourceIncarnation: REX_SOURCE_INCARNATION,
    phase: encounter.phase, radomeHp: encounter.radomeHp, radomeMaxHp: encounter.radomeMaxHp,
    cockpitHp: encounter.cockpitHp, cockpitMaxHp: encounter.cockpitMaxHp,
    bodyProtected: true, grayFoxAssistance: encounter.grayFoxAssistance,
    missileShots: encounter.missileShots, completed: encounter.complete,
    rexDisabled: encounter.complete, liquidSurvives: true,
    targetCell: { x: encounter.body.gridX, y: encounter.body.gridY },
    sourceUrls: [...REX_SOURCE_URLS], adaptation: encounter.adaptation
  };
}
