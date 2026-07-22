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
  ['Cyberpunk: Edgerunners', 'mus-cyberpunk-edgerunners'],
  ['Chainsaw Man', 'mus-chainsaw-man'],
  ['Demon Slayer', 'mus-demon-slayer'],
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
    familyFallbackViews: lorePlans.filter(plan => plan.profileId.startsWith('family-')).length
  }
}, null, 2));
