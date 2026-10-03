// Half-Life (1998) rules, adapted to the existing 2D Smash arena. Crystal
// durability, distances and frame timings below are game balance choices.
export const NIHILANTH_SOURCE_URL = 'https://github.com/ValveSoftware/halflife/blob/0fc8913c542d6ba129ca8bede1505e7d2e8b4b4b/dlls/nihilanth.cpp';
export const NIHILANTH_ENCOUNTER_BALANCE = Object.freeze({
  crystalHp: 60,
  energySpheres: 20,
  healEveryTicks: 6,
  rechargeEveryTicks: 90,
  headOpeningTicks: 90,
  projectileEveryTicks: 135,
  projectileSpeed: 4,
  projectileLifetimeTicks: 180
});

export function createNihilanthEncounter(stage, arena) {
  if (Number(stage?.id) !== 10 || stage?.universe !== 'Half-Life'
    || stage?.customBattle || arena?.id !== 'xen_nihilanth_chamber') return null;
  return {
    boss: null, crystals: [], brain: null, energySpheres: 20,
    elapsedTicks: 0, rechargeTicks: 0, headOpeningTicks: 0,
    headOpen: false, projectileTicks: 0, projectiles: [],
    spheresAbsorbed: 0, spheresRecharged: 0, weakpointHits: 0,
    totalHealing: 0, phase: 'waiting'
  };
}

export function attachNihilanthBoss(runtime, boss, width, height) {
  if (!runtime || !boss?.isBoss || !/nihilanth/i.test(`${boss.name || ''} ${boss.canonicalName || ''}`)
    || runtime.boss) return false;
  runtime.boss = boss;
  runtime.anchor = { x: boss.x, y: boss.y };
  runtime.phase = 'crystals';
  const positions = [[0.22, 0.58], [0.51, 0.40], [0.77, 0.58]];
  runtime.crystals = positions.map(([x, y], index) => ({
    id: `nihilanth-healing-crystal-${index + 1}`, name: `Cristal de soin ${index + 1}`,
    encounterKind: 'healingCrystal', x: width * x, y: height * y,
    currentHp: NIHILANTH_ENCOUNTER_BALANCE.crystalHp,
    maxHp: NIHILANTH_ENCOUNTER_BALANCE.crystalHp,
    state: 'idle', isBoss: false, def: 0, vx: 0, vy: 0
  }));
  runtime.brain = {
    id: 'nihilanth-exposed-brain', name: 'Cerveau exposé du Nihilanth',
    encounterKind: 'brain', x: boss.x, y: boss.y - 64,
    currentHp: 0, maxHp: boss.maxHp, state: 'hidden', isBoss: false,
    def: boss.def, vx: 0, vy: 0
  };
  return true;
}

export function getNihilanthTargets(runtime) {
  if (!runtime?.boss) return [];
  Object.assign(runtime.brain, {
    x: runtime.boss.x, y: runtime.boss.y - 64,
    currentHp: runtime.boss.currentHp,
    state: runtime.boss.currentHp <= 0 ? 'dead' : runtime.headOpen ? 'idle' : 'hidden'
  });
  if (runtime.boss.currentHp <= 0) return [];
  const targets = runtime.crystals.filter(crystal => crystal.currentHp > 0);
  if (runtime.headOpen) targets.push(runtime.brain);
  return targets;
}

// Energy spheres heal rather than making the entire body immune. The original
// TakeDamage/TraceAttack pair also refuses a lethal hit outside the open head.
export function resolveNihilanthDamage(runtime, target, damage) {
  if (!runtime?.boss) return null;
  if (runtime.boss.currentHp <= 0) {
    return target === runtime.brain || target === runtime.boss
      ? { kind: 'blocked', damage: 0 } : null;
  }
  if (runtime.crystals.includes(target)) {
    const dealt = Math.min(target.currentHp, Math.max(0, Math.round(Number(damage) || 0)));
    target.currentHp -= dealt;
    if (target.currentHp <= 0) target.state = 'dead';
    return { kind: 'crystal', damage: dealt, target };
  }
  if (target === runtime.brain) {
    if (!runtime.headOpen) return { kind: 'blocked', damage: 0 };
    if (Number(damage) > 0) runtime.weakpointHits++;
    return { kind: 'brain', defender: runtime.boss, allowLethal: true };
  }
  if (target === runtime.boss) return { kind: 'body', defender: target, allowLethal: false };
  return null;
}

export function tickNihilanthEncounter(runtime, engine) {
  const boss = runtime?.boss;
  if (!boss || boss.currentHp <= 0) return;
  const balance = NIHILANTH_ENCOUNTER_BALANCE;
  runtime.elapsedTicks++;
  // A levitating boss stays in the chamber instead of chasing on foot and
  // falling to the ground. The source animation remains pending art review.
  boss.x = runtime.anchor.x;
  boss.y = runtime.anchor.y + Math.sin(runtime.elapsedTicks / 50) * 3;
  boss.vx = 0;
  boss.vy = 0;
  const aliveCrystals = runtime.crystals.filter(crystal => crystal.currentHp > 0);

  if (runtime.energySpheres > 0 && boss.currentHp < boss.maxHp
    && runtime.elapsedTicks % balance.healEveryTicks === 0) {
    const healed = Math.min(boss.maxHp - boss.currentHp, boss.maxHp / balance.energySpheres);
    boss.currentHp += healed;
    runtime.energySpheres--;
    runtime.spheresAbsorbed++;
    runtime.totalHealing += healed;
    engine.particles.add(boss.x, boss.y - 40, 0, -0.4, '#e6a551', 4, 18, 'spark');
  }
  const needsRecharge = runtime.energySpheres < balance.energySpheres / 2 || boss.currentHp < boss.maxHp / 2;
  if (aliveCrystals.length && needsRecharge) {
    runtime.rechargeTicks++;
    if (runtime.rechargeTicks >= balance.rechargeEveryTicks) {
      runtime.spheresRecharged += balance.energySpheres - runtime.energySpheres;
      runtime.energySpheres = balance.energySpheres;
      runtime.rechargeTicks = 0;
      engine.objectivePulse = 'CRISTAL : ENERGIE RESTAUREE';
    }
  } else runtime.rechargeTicks = 0;

  if (!aliveCrystals.length && needsRecharge && !runtime.headOpen) {
    runtime.headOpeningTicks++;
    if (runtime.headOpeningTicks >= balance.headOpeningTicks) {
      runtime.headOpen = true;
      runtime.phase = 'brain';
      engine.objectivePulse = 'TETE OUVERTE : VISEZ LE CERVEAU';
      engine.playSfx('shield');
    }
  } else if (!runtime.headOpen) runtime.headOpeningTicks = 0;
  if (!aliveCrystals.length && !runtime.headOpen) runtime.phase = 'energy';

  runtime.projectileTicks++;
  const target = engine.getClosestHero(boss);
  if (target && runtime.projectileTicks >= balance.projectileEveryTicks) {
    runtime.projectileTicks = 0;
    boss.facing = target.x < boss.x ? -1 : 1;
    const x = boss.x + boss.facing * 12;
    const y = boss.y - 22;
    const dx = target.x - x;
    const dy = target.y - 18 - y;
    const distance = Math.max(1, Math.hypot(dx, dy));
    runtime.projectiles.push({ x, y, vx: dx / distance * balance.projectileSpeed,
      vy: dy / distance * balance.projectileSpeed, ticks: balance.projectileLifetimeTicks });
    engine.playSfx('shoot');
  }
  runtime.projectiles = runtime.projectiles.filter(projectile => {
    projectile.x += projectile.vx;
    projectile.y += projectile.vy;
    projectile.ticks--;
    const victim = engine.heroes.find(hero => hero.currentHp > 0
      && Math.hypot(hero.x - projectile.x, hero.y - 18 - projectile.y) < 16);
    if (victim) {
      engine.applyDamage(boss, victim, boss.atk, 12);
      return false;
    }
    return projectile.ticks > 0;
  });
  getNihilanthTargets(runtime);
}

export function getNihilanthObjectiveText(runtime, lang = 'fr') {
  if (!runtime?.boss || runtime.boss.currentHp <= 0) return null;
  const remaining = runtime.crystals.filter(crystal => crystal.currentHp > 0).length;
  if (remaining) return lang === 'fr'
    ? `Détruisez les cristaux de soin (${3 - remaining}/3). Ils rechargent les sphères du Nihilanth.`
    : `Destroy the healing crystals (${3 - remaining}/3). They recharge Nihilanth's spheres.`;
  if (!runtime.headOpen) return lang === 'fr'
    ? `Cristaux détruits. Affaiblissez le Nihilanth ou réduisez sa réserve (${runtime.energySpheres}/20 sphères), puis atteignez sa tête.`
    : `Crystals destroyed. Weaken Nihilanth or reduce its reserve (${runtime.energySpheres}/20 spheres), then reach its head.`;
  return lang === 'fr' ? 'Tête ouverte : montez sur les plateformes et frappez le cerveau exposé.'
    : 'Head open: climb the platforms and strike the exposed brain.';
}

export function getNihilanthEncounterSummary(runtime) {
  if (!runtime?.boss) return null;
  return {
    crystalsDestroyed: runtime.crystals.filter(crystal => crystal.currentHp <= 0).length,
    energySpheres: runtime.energySpheres, headOpen: runtime.headOpen,
    weakpointHits: runtime.weakpointHits, spheresAbsorbed: runtime.spheresAbsorbed,
    spheresRecharged: runtime.spheresRecharged, totalHealing: runtime.totalHealing
  };
}
