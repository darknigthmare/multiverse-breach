import {
  MUSIC_PROFILE_OVERRIDES,
  normalizeMusicUniverse,
  resolveStageMusicProfile
} from '../src/game/stageMusicProfiles.js';
import {
  STAGE_ARC_LORE_PROFILES,
  STAGE_LORE_PROFILES
} from '../src/game/stageLoreProfiles.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const coverageCases = [
  ['Gears of War', 'mus-gears-of-war'],
  ['The Predator', 'mus-predator'],
  ['Predator: Killer of Killers', 'mus-predator'],
  ['Predator: Badlands', 'mus-predator'],
  ['Daft Punk', 'mus-daft-punk'],
  ['Oliver Tree', 'mus-oliver-tree'],
  ['Hazbin Hotel', 'mus-hazbin-hotel'],
  ['Vocaloid', 'mus-vocaloid'],
  ['Splatterhouse', 'mus-splatterhouse'],
  ['Streets of Rage', 'mus-streets-of-rage'],
  ['Toy Soldiers', 'mus-toy-soldiers'],
  ['Stargate', 'mus-stargate'],
  ['Zombies Ate My Neighbors', 'mus-zombies-ate-my-neighbors'],
  ['Spy x Family', 'mus-spy-x-family'],
  ['War of the Worlds', 'mus-war-of-the-worlds'],
  ['Ghostbusters', 'mus-ghostbusters'],
  ['Tremors', 'mus-tremors'],
  ['Heavy Metal 2000', 'mus-heavy-metal-2000'],
  ['Exit 8', 'mus-exit-8'],
  ['The Thing', 'mus-the-thing'],
  ['Starship Troopers', 'mus-starship-troopers'],
  ['Voyage de Chihiro', 'mus-voyage-de-chihiro'],
  ['Death Note', 'mus-death-note'],
  ['Saw', 'mus-saw'],
  ['From', 'mus-from'],
  ['House of 1000 Corpses', 'mus-house-of-1000-corpses'],
  ['Iron Sky', 'mus-iron-sky'],
  ['Killer Tomatoes from Outer Space', 'mus-killer-tomatoes-from-outer-space'],
  ['Sharknado', 'mus-sharknado'],
  ['Godzilla The Animated Series', 'mus-godzilla-the-animated-series'],
  ['Pee-wee', 'mus-pee-wee'],
  ['Planete Hurlante', 'mus-planete-hurlante'],
  ['Kazaam', 'mus-kazaam'],
  ['House of the Dead', 'mus-house-of-the-dead'],
  ['House of the Dead 2', 'mus-house-of-the-dead-2'],
  ['House of the Dead 3', 'mus-house-of-the-dead-3'],
  ['The Simpsons', 'mus-the-simpsons'],
  ['Futurama', 'mus-futurama'],
  ['Final Fantasy VII', 'mus-final-fantasy-vii'],
  ['Left 4 Dead', 'mus-left-4-dead'],
  ['Cyberpunk: Edgerunners', 'mus-cyberpunk-edgerunners'],
  ['Chainsaw Man', 'mus-chainsaw-man'],
  ['Demon Slayer', 'mus-demon-slayer'],
  ['Steins;Gate', 'mus-steins-gate'],
  ['Dragon Ball Z', 'mus-dragon-ball-z'],
  ['Tokyo Ghoul', 'mus-tokyo-ghoul'],
  ['Fullmetal Alchemist', 'mus-fullmetal-alchemist'],
  ['Neon Genesis Evangelion', 'mus-neon-genesis-evangelion'],
  ['Parasyte', 'mus-parasyte'],
  ['Uzumaki', 'mus-uzumaki']
];

const overrideProfileIds = Object.values(MUSIC_PROFILE_OVERRIDES).map(profile => profile.id);
assert(overrideProfileIds.every(id => id.startsWith('mus-')), 'Every dedicated override must use a mus-* profile ID');
assert(new Set(overrideProfileIds).size === overrideProfileIds.length, 'Dedicated music profile IDs must be unique');

const rows = coverageCases.map(([universe, expectedProfileId], index) => {
  const plan = resolveStageMusicProfile({
    id: `music-audit-${index}`,
    name: `${universe} audit arena`,
    universe,
    mode: index % 2 === 0 ? 'Smash' : 'Tactics'
  }, 'battle');

  assert(plan.profileId === expectedProfileId, `${universe}: expected ${expectedProfileId}, received ${plan.profileId}`);
  assert(plan.sourcePolicy === 'original-procedural-only', `${universe}: non-original music policy`);
  assert(plan.steps.length > 0, `${universe}: empty procedural sequence`);
  assert(plan.instrumentation.length >= 4, `${universe}: incomplete instrumentation`);
  assert(plan.tempo >= 48 && plan.tempo <= 196, `${universe}: tempo outside runtime bounds`);

  return {
    universe,
    normalizedUniverse: normalizeMusicUniverse(universe),
    profileId: plan.profileId,
    family: plan.family,
    tempo: plan.tempo,
    meter: `${plan.meter.beats}/${plan.meter.unit}`,
    steps: plan.steps.length,
    policy: plan.sourcePolicy
  };
});

const stateStage = {
  id: 'music-state-audit',
  name: 'Streets of Rage state audit',
  universe: 'Streets of Rage',
  mode: 'Race'
};
const statePlans = ['grid', 'battle', 'boss', 'race', 'lastLap', 'victory']
  .map(state => resolveStageMusicProfile(stateStage, state));
assert(new Set(statePlans.map(plan => plan.key)).size === statePlans.length, 'Music states must have distinct cache keys');
assert(statePlans.find(plan => plan.state === 'boss')?.bossLayerEnabled, 'Boss state must enable its extra layer');
assert(
  statePlans.find(plan => plan.state === 'lastLap')?.tempo > statePlans.find(plan => plan.state === 'race')?.tempo,
  'Last lap must be faster than the normal race state'
);

const modePlans = ['RPG', 'Tactics', 'Smash', 'Fighter', 'FPS', 'Race']
  .map(mode => resolveStageMusicProfile({
    id: `music-mode-${mode}`,
    name: `${mode} music audit`,
    universe: 'Gears of War',
    mode
  }, 'battle'));
assert(new Set(modePlans.map(plan => plan.tempo)).size >= 3, 'Game modes are not musically differentiated');

const animeLotCases = [
  ['Dragon Ball Z', 'mus-dragon-ball-z'],
  ['Tokyo Ghoul', 'mus-tokyo-ghoul'],
  ['Fullmetal Alchemist', 'mus-fullmetal-alchemist'],
  ['Neon Genesis Evangelion', 'mus-neon-genesis-evangelion']
];
const animeLotModes = [
  ['Fighter', 'combat'],
  ['Smash', 'melee'],
  ['RPG', 'rpg'],
  ['Tactics', 'tactics']
];
const animeLotRows = animeLotCases.map(([universe, expectedProfileId]) => {
  const profile = MUSIC_PROFILE_OVERRIDES[universe];
  assert(profile, `${universe}: dedicated anime-lot profile is missing`);
  assert(profile.sourcePolicy === 'original-procedural-only', `${universe}: copyrighted source policy`);
  assert(
    animeLotModes.every(([, modeVariant]) => profile.modeProfiles?.[modeVariant]),
    `${universe}: one or more mode-specific arrangements are missing`
  );
  assert(profile.encounterProfiles?.boss, `${universe}: boss arrangement is missing`);
  assert(profile.encounterProfiles?.worldBoss, `${universe}: world-boss arrangement is missing`);

  const plans = animeLotModes.map(([mode, expectedModeVariant]) => {
    const plan = resolveStageMusicProfile({
      id: `anime-lot-${expectedProfileId}-${expectedModeVariant}`,
      name: `${universe} ${expectedModeVariant} arena`,
      universe,
      mode
    }, 'battle');
    assert(plan.profileId === expectedProfileId, `${universe}/${mode}: incorrect profile`);
    assert(plan.modeVariant === expectedModeVariant, `${universe}/${mode}: incorrect mode arrangement`);
    assert(plan.encounterVariant === 'standard', `${universe}/${mode}: unexpected boss arrangement`);
    assert(plan.steps.length > 0, `${universe}/${mode}: empty procedural sequence`);
    assert(plan.instrumentation.length >= 6, `${universe}/${mode}: incomplete instrument palette`);
    return plan;
  });
  assert(
    new Set(plans.map(plan => plan.instrumentation.join('|'))).size === animeLotModes.length,
    `${universe}: gameplay modes reuse the same instrument palette`
  );
  assert(
    new Set(plans.map(plan => plan.sections.map(section => section.name).join('|'))).size === animeLotModes.length,
    `${universe}: gameplay modes reuse the same musical form`
  );

  const bossPlan = resolveStageMusicProfile({
    id: `anime-lot-${expectedProfileId}-boss`,
    name: `${universe} boss arena`,
    universe,
    mode: 'RPG',
    bossActive: true,
    bossName: `${universe} boss`
  }, 'boss');
  const worldBossPlan = resolveStageMusicProfile({
    id: `anime-lot-${expectedProfileId}-world-boss`,
    name: `${universe} world boss arena`,
    universe,
    mode: 'RPG',
    worldBoss: { name: `${universe} world boss` },
    isWorldBoss: true
  }, 'boss');
  assert(bossPlan.encounterVariant === 'boss', `${universe}: boss arrangement did not activate`);
  assert(worldBossPlan.encounterVariant === 'worldBoss', `${universe}: world-boss arrangement did not activate`);
  assert(bossPlan.bossLayerEnabled, `${universe}: boss layer is disabled`);
  assert(worldBossPlan.bossLayerEnabled, `${universe}: world-boss layer is disabled`);
  assert(bossPlan.key !== worldBossPlan.key, `${universe}: boss and world boss share a cache key`);
  assert(
    bossPlan.instrumentation.join('|') !== worldBossPlan.instrumentation.join('|'),
    `${universe}: boss and world boss reuse the same instrument palette`
  );
  assert(
    worldBossPlan.density > bossPlan.density,
    `${universe}: world-boss arrangement is not denser than the boss arrangement`
  );

  return {
    universe,
    profileId: expectedProfileId,
    modes: plans.map(plan => ({
      mode: plan.mode,
      modeVariant: plan.modeVariant,
      tempo: plan.tempo,
      meter: `${plan.meter.beats}/${plan.meter.unit}`,
      steps: plan.steps.length
    })),
    boss: {
      encounterVariant: bossPlan.encounterVariant,
      tempo: bossPlan.tempo,
      steps: bossPlan.steps.length
    },
    worldBoss: {
      encounterVariant: worldBossPlan.encounterVariant,
      tempo: worldBossPlan.tempo,
      steps: worldBossPlan.steps.length
    }
  };
});

const steinsGateProfile = MUSIC_PROFILE_OVERRIDES['Steins;Gate'];
assert(steinsGateProfile, 'Steins;Gate: dedicated profile is missing');
assert(steinsGateProfile.id === 'mus-steins-gate', 'Steins;Gate: incorrect profile ID');
assert(steinsGateProfile.sourcePolicy === 'original-procedural-only', 'Steins;Gate: copyrighted source policy');
assert(normalizeMusicUniverse('Steins Gate') === 'Steins;Gate', 'Steins;Gate: punctuation-free universe alias is missing');

const steinsGateModeCases = [
  ['Combat', 'combat'],
  ['Melee', 'melee'],
  ['RPG', 'rpg'],
  ['Tactics', 'tactics']
];
const steinsGateModePlans = steinsGateModeCases.map(([mode, expectedModeVariant]) => {
  const plan = resolveStageMusicProfile({
    id: `steins-gate-${expectedModeVariant}-audit`,
    name: `Steins;Gate ${mode} audit`,
    universe: 'Steins;Gate',
    mode
  }, 'battle');
  assert(plan.profileId === 'mus-steins-gate', `Steins;Gate/${mode}: incorrect profile`);
  assert(plan.modeVariant === expectedModeVariant, `Steins;Gate/${mode}: incorrect mode arrangement`);
  assert(plan.encounterVariant === 'standard', `Steins;Gate/${mode}: unexpected encounter arrangement`);
  assert(plan.steps.length > 0, `Steins;Gate/${mode}: empty procedural sequence`);
  assert(plan.instrumentation.length >= 6, `Steins;Gate/${mode}: incomplete instrument palette`);
  return plan;
});
assert(
  new Set(steinsGateModePlans.map(plan => plan.instrumentation.join('|'))).size === steinsGateModeCases.length,
  'Steins;Gate: gameplay modes reuse the same instrument palette'
);
assert(
  new Set(steinsGateModePlans.map(plan => plan.sections.map(section => section.name).join('|'))).size === steinsGateModeCases.length,
  'Steins;Gate: gameplay modes reuse the same musical form'
);
assert(
  new Set(steinsGateModePlans.map(plan => plan.key)).size === steinsGateModeCases.length,
  'Steins;Gate: gameplay modes share a runtime cache key'
);

const steinsGateAliasCases = [
  ['Fighter', 'combat', steinsGateModePlans[0]],
  ['Smash', 'melee', steinsGateModePlans[1]]
];
const steinsGateAliasPlans = steinsGateAliasCases.map(([mode, expectedModeVariant, canonicalPlan]) => {
  const plan = resolveStageMusicProfile({
    id: `steins-gate-${mode.toLowerCase()}-alias-audit`,
    name: `Steins;Gate ${mode} alias audit`,
    universe: 'Steins Gate',
    mode
  }, 'battle');
  assert(plan.profileId === 'mus-steins-gate', `Steins;Gate/${mode}: alias resolved the wrong profile`);
  assert(plan.modeVariant === expectedModeVariant, `Steins;Gate/${mode}: alias resolved the wrong arrangement`);
  assert(
    plan.instrumentation.join('|') === canonicalPlan.instrumentation.join('|'),
    `Steins;Gate/${mode}: alias changed the canonical instrument palette`
  );
  assert(
    plan.sections.map(section => section.name).join('|') === canonicalPlan.sections.map(section => section.name).join('|'),
    `Steins;Gate/${mode}: alias changed the canonical musical form`
  );
  return plan;
});

const steinsGateBossPlan = resolveStageMusicProfile({
  id: 'steins-gate-sern-boss-audit',
  name: 'Steins;Gate SERN Rounder confrontation',
  universe: 'Steins;Gate',
  mode: 'RPG',
  bossActive: true,
  bossName: 'Yugo Tennouji / FB'
}, 'boss');
const steinsGateWorldBossPlan = resolveStageMusicProfile({
  id: 'steins-gate-attractor-field-audit',
  name: 'Steins;Gate Attractor Field finale',
  universe: 'Steins;Gate',
  mode: 'RPG',
  worldBoss: { name: 'SERN Attractor Field' },
  isWorldBoss: true
}, 'boss');
assert(steinsGateBossPlan.encounterVariant === 'boss', 'Steins;Gate: boss arrangement did not activate');
assert(steinsGateWorldBossPlan.encounterVariant === 'worldBoss', 'Steins;Gate: Attractor Field arrangement did not activate');
assert(steinsGateBossPlan.bossLayerEnabled, 'Steins;Gate: boss layer is disabled');
assert(steinsGateWorldBossPlan.bossLayerEnabled, 'Steins;Gate: world-boss layer is disabled');
assert(steinsGateBossPlan.key !== steinsGateWorldBossPlan.key, 'Steins;Gate: boss and Attractor Field share a cache key');
assert(
  steinsGateBossPlan.instrumentation.join('|') !== steinsGateWorldBossPlan.instrumentation.join('|'),
  'Steins;Gate: boss and Attractor Field reuse the same instrument palette'
);
assert(
  steinsGateWorldBossPlan.density > steinsGateBossPlan.density,
  'Steins;Gate: Attractor Field arrangement is not denser than the boss arrangement'
);
assert(
  steinsGateWorldBossPlan.instrumentation.includes('attractor-field-phase-pulse'),
  'Steins;Gate: Attractor Field signature pulse is missing'
);
assert(
  steinsGateWorldBossPlan.sections.some(section => section.name === 'operation-skuld'),
  'Steins;Gate: Operation Skuld section is missing from the finale'
);

const steinsGateAudit = {
  profileId: steinsGateProfile.id,
  modes: steinsGateModePlans.map(plan => ({
    mode: plan.mode,
    modeVariant: plan.modeVariant,
    tempo: plan.tempo,
    meter: `${plan.meter.beats}/${plan.meter.unit}`,
    steps: plan.steps.length
  })),
  aliases: steinsGateAliasPlans.map(plan => ({
    mode: plan.mode,
    modeVariant: plan.modeVariant,
    tempo: plan.tempo
  })),
  boss: {
    encounterVariant: steinsGateBossPlan.encounterVariant,
    tempo: steinsGateBossPlan.tempo,
    density: Number(steinsGateBossPlan.density.toFixed(3))
  },
  worldBoss: {
    encounterVariant: steinsGateWorldBossPlan.encounterVariant,
    tempo: steinsGateWorldBossPlan.tempo,
    density: Number(steinsGateWorldBossPlan.density.toFixed(3)),
    sections: steinsGateWorldBossPlan.sections.map(section => section.name)
  }
};

const suppressedPlan = resolveStageMusicProfile({
  id: 'hidden-dlc-music-audit',
  name: 'Hidden DLC arena',
  universe: 'The Predator',
  mode: 'Smash',
  dlcSuppressedArena: true
}, 'battle');
assert(suppressedPlan.profileId === 'mus-nexus-de-convergence', 'Hidden DLC music must fall back to Nexus');
assert(suppressedPlan.universe === 'Nexus de Convergence', 'Hidden DLC must not expose its source universe through music');

const fusionPlan = resolveStageMusicProfile({
  id: 'fusion-music-audit',
  name: 'Ring in the Fog',
  universe: 'Halo',
  sourceUniverses: ['Halo', 'Silent Hill'],
  mode: 'RPG',
  isBoss: true
}, 'boss');
assert(fusionPlan.profileId.startsWith('fusion-'), 'Fusion stages must blend both source profiles');
assert(fusionPlan.sourceUniverses.length === 2, 'Fusion music lost one source universe');

const stageModeMap = {
  Combat: 'Fighter',
  Melee: 'Smash',
  RPG: 'RPG',
  Tactics: 'Tactics'
};
const loreProfiles = [
  ...Object.entries(STAGE_LORE_PROFILES).map(([universe, profile]) => ({ universe, profile })),
  ...Object.values(STAGE_ARC_LORE_PROFILES).map(profile => ({
    universe: profile.universes?.[0] || 'Nexus de Convergence',
    profile
  }))
];
const lorePlans = loreProfiles.flatMap(({ universe, profile }) => (
  Object.keys(profile.modes).map(modeName => {
    const stage = {
      id: `music-lore-${profile.key}-${modeName}`,
      name: profile.canonicalName,
      universe,
      sourceUniverses: profile.universes,
      mode: stageModeMap[modeName]
    };
    const first = resolveStageMusicProfile(stage, 'battle');
    const second = resolveStageMusicProfile(stage, 'battle');
    assert(first.key === second.key, `${profile.key}/${modeName}: music plan is not deterministic`);
    assert(first.steps.length > 0, `${profile.key}/${modeName}: empty music plan`);
    assert(first.sourcePolicy === 'original-procedural-only', `${profile.key}/${modeName}: invalid source policy`);
    return first;
  })
));
assert(lorePlans.length === loreProfiles.length * 4, 'Not every lore profile exposes all four gameplay music plans');
assert(new Set(lorePlans.map(plan => plan.key)).size === lorePlans.length, 'Two lore stage views share the same runtime music key');
const proceduralUniverseViews = lorePlans
  .filter(plan => plan.profileId.startsWith('universe-')).length;
const familyFallbackViews = lorePlans
  .filter(plan => plan.profileId.startsWith('family-')).length;
assert(proceduralUniverseViews > 0, 'No procedural universe profile was exercised');
assert(familyFallbackViews === 0, 'One or more lore views still use a raw family fallback');

console.log(JSON.stringify({
  coverage: rows,
  states: statePlans.map(plan => ({
    state: plan.state,
    tempo: plan.tempo,
    density: Number(plan.density.toFixed(3)),
    bossLayer: plan.bossLayerEnabled
  })),
  modes: modePlans.map(plan => ({
    mode: plan.mode,
    tempo: plan.tempo,
    density: Number(plan.density.toFixed(3))
  })),
  animeLot: animeLotRows,
  steinsGate: steinsGateAudit,
  hiddenDlcFallback: {
    universe: suppressedPlan.universe,
    profileId: suppressedPlan.profileId
  },
  fusion: {
    sources: fusionPlan.sourceUniverses,
    profileId: fusionPlan.profileId
  },
  allLoreStages: {
    profiles: loreProfiles.length,
    views: lorePlans.length,
    uniqueRuntimeKeys: new Set(lorePlans.map(plan => plan.key)).size,
    dedicatedViews: lorePlans.filter(plan => plan.profileId.startsWith('mus-')).length,
    fusionViews: lorePlans.filter(plan => plan.profileId.startsWith('fusion-')).length,
    proceduralUniverseViews,
    familyFallbackViews
  }
}, null, 2));
