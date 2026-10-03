// Aliens (1986): rescue Newt in the processor hive, then escape. Positions,
// interaction radius and the shortened route are explicitly game adaptations.
export const ALIENS_RESCUE_SOURCE_URLS = Object.freeze([
  'https://www.20thcenturystudios.com/movies/aliens',
  'https://imsdb.com/scripts/Aliens.html',
  'https://en.wikipedia.org/wiki/Aliens_(film)'
]);

export const ALIENS_RESCUE_BALANCE = Object.freeze({ interactionRadius: 42 });
export const ALIENS_RESCUE_INCARNATION = "Aliens (1986) - Hadley's Hope atmosphere processor, LV-426";

export function createAliensRescueEncounter(stage, arena, width, height) {
  if (Number(stage?.id) !== 3 || stage?.universe !== 'Alien'
    || stage?.mode !== 'Smash' || stage?.incarnation !== ALIENS_RESCUE_INCARNATION
    || stage?.enemyRosterExclusive !== true || stage?.canonicalBossName !== 'Alien Queen'
    || stage?.customBattle || stage?.isCustomBattle || stage?.isCustom
    || arena?.id !== 'hadleys_processor_hive') return null;
  return {
    id: 'aliens-1986-newt-rescue', phase: 'search', queen: null,
    rescued: false, carrierId: null, complete: false,
    rescuePoint: { x: width * 0.67, y: height * 0.78, radius: ALIENS_RESCUE_BALANCE.interactionRadius },
    exitPoint: { x: width * 0.12, y: height * 0.78, radius: ALIENS_RESCUE_BALANCE.interactionRadius },
    sourceMechanics: 'Free Newt from the hive and leave the atmosphere processor together; killing the Queen in the hive is not the objective.',
    adaptation: 'Three combat waves precede the rescue. The 2D route and two interaction markers compress the nest, lifts, stairs and landing platform. Newt has no HP or damageable combat entity. Queen damage is nonlethal. Ripley Aliens uses her M41A, M240, hive cover and M41A grenade here with adapted combat ranges and effects; power-loader actions remain in other contexts. The Sulaco power-loader finale remains separate and unimplemented.'
  };
}

export function getAliensHiveHeroLoadout(runtime, hero) {
  if (!runtime || (hero?.sourceId || hero?.id) !== 'ripley_aliens'
    || hero?.incarnation !== 'Aliens (1986) - LV-426 / Sulaco') return hero;
  const rifle = { delivery: 'ranged', shape: 'single', range: 300, verticalRange: 35, directional: true };
  return {
    ...hero,
    aliensHiveLoadout: true,
    equipment: ['M41A pulse rifle with underbarrel grenade launcher', 'M240 incinerator'],
    simple: { ...hero.simple, smashProfile: { ...rifle } },
    secondary: { ...hero.secondary,
      smashProfile: { delivery: 'ranged', shape: 'multi', maxTargets: 3,
        range: 160, verticalRange: 35, directional: true } },
    defense: { ...hero.defense, name: 'Hive Cover', type: 'shield' },
    special: { ...hero.special, name: 'M41A Grenade', type: 'explosive',
      smashProfile: { ...rifle, verticalRange: 45 } }
  };
}

export function attachAliensRescueQueen(runtime, actor) {
  if (!runtime || runtime.queen || !actor?.isBoss || actor.name !== 'Alien Queen') return false;
  runtime.queen = actor;
  runtime.queenAnchor = { x: actor.x, y: actor.y };
  runtime.phase = 'rescue';
  return true;
}

export const isAtAliensRescuePoint = (actor, point) => Boolean(actor && point
  && Math.hypot(actor.x - point.x, actor.y - point.y) <= point.radius);

export const aliensRescueHeroId = hero => hero?.battleId || hero?.runtimeId || hero?.id || null;

export function getAliensRescueEncounterSummary(runtime, heroes = [], activeHero = null) {
  if (!runtime) return null;
  return {
    id: runtime.id, phase: runtime.phase, rescued: runtime.rescued,
    carrierId: runtime.carrierId, complete: runtime.complete,
    queenPresent: Boolean(runtime.queen),
    queenAlive: Boolean(runtime.queen && runtime.queen.currentHp > 0),
    rescuePoint: { ...runtime.rescuePoint }, exitPoint: { ...runtime.exitPoint },
    heroes: heroes.map(hero => ({
      id: aliensRescueHeroId(hero), name: hero.name,
      alive: hero.currentHp > 0,
      nearNewt: isAtAliensRescuePoint(hero, runtime.rescuePoint),
      nearExit: isAtAliensRescuePoint(hero, runtime.exitPoint)
    })),
    commands: {
      rescueNewt: Boolean(runtime.phase === 'rescue' && activeHero?.currentHp > 0
        && isAtAliensRescuePoint(activeHero, runtime.rescuePoint)),
      evacuate: Boolean(runtime.phase === 'escape' && activeHero?.currentHp > 0
        && aliensRescueHeroId(activeHero) === runtime.carrierId
        && isAtAliensRescuePoint(activeHero, runtime.exitPoint))
    },
    sourceUrls: [...ALIENS_RESCUE_SOURCE_URLS],
    sourceMechanics: runtime.sourceMechanics, adaptation: runtime.adaptation
  };
}

export function getAliensRescueObjectiveText(runtime, lang = 'fr') {
  if (!runtime) return null;
  const fr = lang === 'fr';
  if (runtime.complete) return fr ? 'Newt sauvée : évacuation du processeur réussie.' : 'Newt rescued: atmosphere processor evacuation complete.';
  if (runtime.phase === 'escape') return fr
    ? 'Newt vous accompagne. Rejoignez la sortie avec son porteur vivant, puis évacuez. La Reine reste vivante.'
    : 'Newt is with you. Reach the exit with her living carrier, then evacuate. The Queen survives.';
  if (runtime.phase === 'rescue') return fr
    ? 'Rejoignez le repère NEWT dans le nid, puis libérez-la. Il faut fuir la Reine, pas la tuer.'
    : 'Reach the NEWT marker in the nest, then free her. Escape the Queen rather than kill her.';
  return fr ? 'Traversez la ruche pour atteindre Newt. Le sauvetage devient disponible dans le nid de la Reine.'
    : 'Cross the hive to reach Newt. Rescue becomes available in the Queen’s nest.';
}
