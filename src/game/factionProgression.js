import { EXPANDED_FACTION_UNIVERSES } from './expandedUniverses.js';
import { ORIGINAL_UNIVERSE_DEFINITIONS } from './originalUniverseWave.js';

const unique = values => [...new Set(values.filter(Boolean))];

// Explicit affinities for the legacy/core worlds and for expansion packs whose
// source tag is intentionally broader than the six mechanical Thread families.
// Keep this authored: a hash or a generic `multiverse` fallback would make the
// same universe change faction when catalogs are reordered and would erase its
// lore identity.
export const CURATED_FACTION_UNIVERSES = Object.freeze({
  sci_fi: Object.freeze([
    'Angels Fall First',
    "Avatar (Na'vi)",
    'Back to the Future',
    'Crysis',
    'Daikatana',
    'Dino Crisis',
    'Evolve',
    'Half-Life',
    'Interstellar Marines',
    'Invincible',
    'Le Cinquième Element',
    'Lost Planet 2',
    'Natural Selection 2',
    "No Man's Sky",
    'Red Faction',
    'Redneck Rampage',
    'Rick & Morty',
    'Sartorius Stedim Biotech',
    'Serious Sam',
    'Starship Troopers',
    'Stellar Dream — Safe Colony Mission',
    'Subverse — Safe Galactic Rebellion',
    'Turok',
    'Nexus de Convergence'
  ]),
  horror: Object.freeze([
    'Agony',
    'Bendy and the Ink Machine',
    'BioShock',
    'Buckshot Roulette',
    'Choo-Choo Charles',
    'Finding Frankie',
    'Halloween',
    'Hello Neighbor',
    'Jersey Devil',
    'Killing Floor 2',
    'Nemesis — Awaken Realms',
    'Phantasmagoria',
    'R.E.P.O.',
    'Scary Movie',
    'The Backrooms — Kane Pixels',
    'The Binding of Isaac: Rebirth',
    'The Darkness',
    'The Forest'
  ]),
  cyber: Object.freeze([
    'Atomic Heart',
    'Beat Banger — Safe Rhythm Studio',
    'BIT.TRIP',
    'Deus Ex',
    'E.Y.E: Divine Cybermancy',
    'Gex',
    "Goemon's Great Adventure",
    'Horizon Zero Dawn',
    'Jet Set Radio',
    "Mirror's Edge",
    'Murder Drones',
    'Putt-Putt',
    'Remember Me',
    'RoboCop',
    'SUPERHOT',
    'Tail Concerto',
    'The Surge',
    'The Truman Show',
    'Torbahead',
    'Vocaloid',
    'Wallace & Gromit'
  ]),
  arcane: Object.freeze([
    'Brütal Legend',
    'Crypt of the NecroDancer',
    'Cuphead',
    'Dark Souls',
    'Devil May Cry',
    'Extreme Ghostbusters',
    'Freddi Fish',
    'Heart of Darkness',
    'La Petite Histoire de France',
    'Les Kassos',
    'Les Zinzins de l’espace',
    'Magicka',
    'MediEvil',
    'Oggy et les Cafards',
    'Palworld',
    'Peepoodo — Safe Educational Adaptation',
    'Rock of Ages',
    'Skullgirls',
    'The Amazing Patate Show',
    'The Ball',
    'Trololo'
  ]),
  tactical: Object.freeze([
    'Absolver: Downfall',
    'Happy Wheels',
    'HITMAN — World of Assassination',
    'Killer Instinct',
    'Max Payne 2',
    'Metal Slug',
    'Overgrowth',
    'PUBG',
    'Rival Schools',
    'Sam & Max',
    'Soldier of Fortune',
    'Spy Fox',
    'Squirrel with a Gun',
    'Super Meat Boy',
    'Team Fortress 2',
    'The Wild Thornberrys',
    'Tom Clancy’s Splinter Cell',
    'Unreal Tournament 2004',
    'Wolfenstein',
    'Worms'
  ]),
  apocalypse: Object.freeze([
    'Borderlands 2',
    'BRINK',
    'Dead Rising',
    'Deponia',
    'Doom Sweeper — Safe Apocalypse',
    'Oddworld',
    'Plants vs. Zombies',
    'Postal'
  ])
});

const ORIGINAL_UNIVERSES_BY_FACTION = Object.fromEntries(
  ['sciFi', 'horror', 'cyber', 'arcane', 'tactical', 'apocalypse'].map(factionId => [
    factionId,
    ORIGINAL_UNIVERSE_DEFINITIONS
      .filter(world => world.faction === factionId)
      .map(world => world.universe)
  ])
);

export const BASE_FACTION_UNIVERSES = Object.freeze({
  sci_fi: Object.freeze(unique([
    'Alien', 'Predator', 'Prometheus', 'Stargate', 'Stargate Atlantis', 'Stargate Universe',
    'Stargate Infinity', 'Halo', 'Mass Effect', 'Gears of War', 'Star Wars', 'The Fifth Element',
    ...CURATED_FACTION_UNIVERSES.sci_fi,
    ...(EXPANDED_FACTION_UNIVERSES.sciFi || []),
    ...(ORIGINAL_UNIVERSES_BY_FACTION.sciFi || [])
  ])),
  horror: Object.freeze(unique([
    'Resident Evil', 'Silent Hill', 'Saw', 'Hellraiser', 'Dead Space', 'Chucky', 'Slender Man',
    ...(EXPANDED_FACTION_UNIVERSES.horror || []),
    ...CURATED_FACTION_UNIVERSES.horror,
    ...(ORIGINAL_UNIVERSES_BY_FACTION.horror || [])
  ])),
  cyber: Object.freeze(unique([
    'The Matrix', 'Portal', 'Ghost in the Shell', 'Digital Circus', 'Digimon',
    ...(EXPANDED_FACTION_UNIVERSES.cyber || []),
    ...CURATED_FACTION_UNIVERSES.cyber,
    ...(ORIGINAL_UNIVERSES_BY_FACTION.cyber || [])
  ])),
  arcane: Object.freeze(unique([
    'Harry Potter', 'Yu-Gi-Oh', 'Negima', 'Rosario + Vampire', 'BlazBlue',
    ...(EXPANDED_FACTION_UNIVERSES.arcane || []),
    ...CURATED_FACTION_UNIVERSES.arcane,
    ...(ORIGINAL_UNIVERSES_BY_FACTION.arcane || [])
  ])),
  tactical: Object.freeze(unique([
    'Metal Gear', 'Payday', 'Guilty Gear', 'Unreal', 'Counter-Strike', 'Rainbow Six',
    ...CURATED_FACTION_UNIVERSES.tactical,
    ...(ORIGINAL_UNIVERSES_BY_FACTION.tactical || [])
  ])),
  apocalypse: Object.freeze(unique([
    'Mad Max', 'Mad Max: Fury Road', 'Fallout', 'Doom', 'The Purge', 'Ghosts of Mars',
    ...CURATED_FACTION_UNIVERSES.apocalypse,
    ...(ORIGINAL_UNIVERSES_BY_FACTION.apocalypse || [])
  ]))
});

const makeRule = ({
  id,
  label,
  stat,
  bonus,
  reputationId,
  base = false,
  arcIds = []
}) => Object.freeze({
  id,
  label: Object.freeze(label),
  stat,
  bonus,
  multiplier: 1 + bonus,
  minMembers: 2,
  reputationId,
  base,
  arcIds: Object.freeze(arcIds)
});

// Six Thread families and sixteen campaign allegiances. Every label exposed by
// the faction dossiers now has a deterministic gameplay contract instead of a
// presentation-only name.
export const FACTION_RULES = Object.freeze([
  makeRule({ id: 'sci_fi', label: { fr: 'Front scientifique', en: 'Science Front' }, stat: 'hp', bonus: 0.08, reputationId: 'nexus_alliance', base: true }),
  makeRule({ id: 'horror', label: { fr: 'Survivants du Voile', en: 'Veil Survivors' }, stat: 'atk', bonus: 0.08, reputationId: 'erased', base: true }),
  makeRule({ id: 'cyber', label: { fr: 'IA et Cyber', en: 'AI and Cyber' }, stat: 'spd', bonus: 0.08, reputationId: 'archivists', base: true }),
  makeRule({ id: 'arcane', label: { fr: 'Mages et Occulte', en: 'Mages and Occult' }, stat: 'def', bonus: 0.08, reputationId: 'archivists', base: true }),
  makeRule({ id: 'tactical', label: { fr: 'Cellules tactiques', en: 'Tactical Cells' }, stat: 'atk', bonus: 0.08, reputationId: 'nexus_alliance', base: true }),
  makeRule({ id: 'apocalypse', label: { fr: 'Caravanes du monde mort', en: 'Dead-World Caravans' }, stat: 'hp', bonus: 0.08, reputationId: 'broken_throne', base: true }),
  makeRule({ id: 'hunting_free_fractures', label: { fr: 'Alliance du Nexus vs Libres-Fractures de chasse', en: 'Nexus Alliance vs Hunting Free-Fractures' }, stat: 'spd', bonus: 0.06, reputationId: 'free_fractures', arcIds: ['xeno_yautja_war'] }),
  makeRule({ id: 'erased_broken_throne', label: { fr: 'Effaces et Trone Brise', en: 'Erased and Broken Throne' }, stat: 'def', bonus: 0.06, reputationId: 'erased', arcIds: ['urban_legends'] }),
  makeRule({ id: 'resonance_archivists', label: { fr: 'Personas de Resonance et Archivistes', en: 'Resonance Personas and Archivists' }, stat: 'spd', bonus: 0.06, reputationId: 'archivists', arcIds: ['stage_resonance'] }),
  makeRule({ id: 'archivists_arcane', label: { fr: 'Archivistes, Mages et Occulte', en: 'Archivists, Mages, and Occult' }, stat: 'def', bonus: 0.06, reputationId: 'archivists', arcIds: ['arcane_paradox'] }),
  makeRule({ id: 'white_citadel_infernal_cabaret', label: { fr: 'Citadelle Blanche vs Cabaret infernal', en: 'White Citadel vs Infernal Cabaret' }, stat: 'atk', bonus: 0.06, reputationId: 'broken_throne', arcIds: ['hell_circus', 'dark_gotham'] }),
  makeRule({ id: 'nexus_alliance', label: { fr: 'Alliance du Nexus', en: 'Nexus Alliance' }, stat: 'hp', bonus: 0.06, reputationId: 'nexus_alliance', arcIds: ['frontline_sci_fi'] }),
  makeRule({ id: 'arca_containment', label: { fr: 'Protocoles de confinement A.R.C.A.', en: 'A.R.C.A. Containment Protocols' }, stat: 'def', bonus: 0.06, reputationId: 'nexus_alliance', arcIds: ['containment_labs'] }),
  makeRule({ id: 'ai_cyber', label: { fr: 'IA et Cyber', en: 'AI and Cyber' }, stat: 'spd', bonus: 0.06, reputationId: 'archivists', arcIds: ['cyber_reality'] }),
  makeRule({ id: 'free_fractures', label: { fr: 'Libres-Fractures', en: 'Free-Fractures' }, stat: 'atk', bonus: 0.06, reputationId: 'free_fractures', arcIds: ['duel_and_arena'] }),
  makeRule({ id: 'broken_throne', label: { fr: 'Trone Brise', en: 'Broken Throne' }, stat: 'atk', bonus: 0.06, reputationId: 'broken_throne', arcIds: ['wasteland_hellfront'] }),
  makeRule({ id: 'erased', label: { fr: 'Effaces', en: 'Erased' }, stat: 'def', bonus: 0.06, reputationId: 'erased', arcIds: ['urban_legends'] }),
  makeRule({ id: 'absurd_free_fractures', label: { fr: 'Libres-Fractures absurdes', en: 'Absurd Free-Fractures' }, stat: 'spd', bonus: 0.06, reputationId: 'free_fractures', arcIds: ['absurd_b_movie_front'] }),
  makeRule({ id: 'evacuation_cell', label: { fr: 'Alliance du Nexus - Cellule evacuation', en: 'Nexus Alliance - Evacuation Cell' }, stat: 'hp', bonus: 0.06, reputationId: 'nexus_alliance', arcIds: ['kaiju_disaster_protocol'] }),
  makeRule({ id: 'fate_arc_archivists', label: { fr: 'Archivistes des arcs de destin', en: 'Fate Arc Archivists' }, stat: 'def', bonus: 0.06, reputationId: 'archivists', arcIds: ['manga_war_council'] }),
  makeRule({ id: 'screen_archivists', label: { fr: 'Archivistes ecran et Cite-Mosaique', en: 'Screen Archivists and Mosaic City' }, stat: 'spd', bonus: 0.06, reputationId: 'archivists', arcIds: ['screen_archive_fracture'] }),
  makeRule({ id: 'biohazard_containment', label: { fr: 'Confinement A.R.C.A. - Biohazard', en: 'A.R.C.A. Containment - Biohazard' }, stat: 'hp', bonus: 0.06, reputationId: 'erased', arcIds: ['infection_mutation_cordon'] })
]);

export const REPUTATION_TRACKS = Object.freeze([
  Object.freeze({
    id: 'nexus_alliance',
    label: Object.freeze({ fr: 'Alliance du Nexus', en: 'Nexus Alliance' }),
    gameplay: Object.freeze({ fr: 'Tenir les lignes et escorter les civils augmente les PV de toute cellule de 1 % par rang.', en: 'Holding lines and escorting civilians increases the whole cell HP by 1% per rank.' }),
    thresholds: Object.freeze([0, 120, 320, 650, 1100]),
    passive: Object.freeze({ stat: 'hp', perRank: 0.01 })
  }),
  Object.freeze({
    id: 'archivists',
    label: Object.freeze({ fr: 'Archivistes', en: 'Archivists' }),
    gameplay: Object.freeze({ fr: 'Clarifier les traces augmente les Fragments de Breche de 2 % par rang.', en: 'Clarifying traces increases Breach Shards by 2% per rank.' }),
    thresholds: Object.freeze([0, 120, 320, 650, 1100]),
    passive: Object.freeze({ resource: 'shards', perRank: 0.02 })
  }),
  Object.freeze({
    id: 'free_fractures',
    label: Object.freeze({ fr: 'Libres-Fractures', en: 'Free-Fractures' }),
    gameplay: Object.freeze({ fr: 'Stabiliser les missions instables augmente la vitesse de 1,5 % par rang.', en: 'Stabilizing unstable missions increases speed by 1.5% per rank.' }),
    thresholds: Object.freeze([0, 120, 320, 650, 1100]),
    passive: Object.freeze({ stat: 'spd', perRank: 0.015 })
  }),
  Object.freeze({
    id: 'broken_throne',
    label: Object.freeze({ fr: 'Trone Brise', en: 'Broken Throne' }),
    gameplay: Object.freeze({ fr: 'Survivre aux mondes morts augmente l attaque de 1,5 % par rang.', en: 'Surviving dead worlds increases attack by 1.5% per rank.' }),
    thresholds: Object.freeze([0, 120, 320, 650, 1100]),
    passive: Object.freeze({ stat: 'atk', perRank: 0.015 })
  }),
  Object.freeze({
    id: 'erased',
    label: Object.freeze({ fr: 'Effaces', en: 'Erased' }),
    gameplay: Object.freeze({ fr: 'Proteger les missions de memoire augmente la defense de 1,5 % par rang.', en: 'Protecting memory missions increases defense by 1.5% per rank.' }),
    thresholds: Object.freeze([0, 120, 320, 650, 1100]),
    passive: Object.freeze({ stat: 'def', perRank: 0.015 })
  })
]);

const REPUTATION_BY_ID = new Map(REPUTATION_TRACKS.map(track => [track.id, track]));
const BASE_RULE_IDS = new Set(Object.keys(BASE_FACTION_UNIVERSES));

const toSafeXp = value => Math.min(999999, Math.max(0, Math.floor(Number(value) || 0)));

export const normalizeReputationProgress = (progress = {}) => Object.fromEntries(
  REPUTATION_TRACKS.map(track => [
    track.id,
    {
      xp: toSafeXp(progress?.[track.id]?.xp ?? progress?.[track.id]),
      claimedRanks: unique(
        Array.isArray(progress?.[track.id]?.claimedRanks)
          ? progress[track.id].claimedRanks.map(Number).filter(rank => Number.isInteger(rank) && rank > 0 && rank < track.thresholds.length)
          : []
      ).sort((a, b) => a - b)
    }
  ])
);

export const getReputationRank = (trackId, progress = {}) => {
  const track = REPUTATION_BY_ID.get(trackId);
  if (!track) return 0;
  const xp = toSafeXp(progress?.[trackId]?.xp ?? progress?.[trackId]);
  return track.thresholds.reduce((rank, threshold, index) => (xp >= threshold ? index : rank), 0);
};

export const resolveUniverseFactionIds = universe => {
  const normalizedUniverse = String(universe || '').trim();
  if (!normalizedUniverse) return [];
  const ids = Object.entries(BASE_FACTION_UNIVERSES)
    .filter(([, universes]) => universes.includes(normalizedUniverse))
    .map(([factionId]) => factionId);
  return ids;
};

const getStageArcId = stage => String(
  stage?.arcId
  || stage?.characterArc?.id
  || stage?.trioArc?.id
  || stage?.universeArc?.id
  || stage?.fusionMission?.id
  || ''
).trim();

export const resolveMissionFactionIds = (stage = {}) => {
  const safeStage = stage && typeof stage === 'object' ? stage : {};
  const universes = unique([
    safeStage.universe,
    ...(Array.isArray(safeStage.sourceUniverses) ? safeStage.sourceUniverses : []),
    ...(Array.isArray(safeStage.universes) ? safeStage.universes : [])
  ]);
  const ids = universes.flatMap(resolveUniverseFactionIds);
  const arcId = getStageArcId(safeStage);
  FACTION_RULES.forEach(rule => {
    if (arcId && rule.arcIds.includes(arcId)) ids.push(rule.id);
  });
  return unique(ids);
};

export const getActiveFactionBonuses = ({ teamUniverses = [], heroUniverse, stage } = {}) => {
  const heroBaseIds = new Set(resolveUniverseFactionIds(heroUniverse));
  const missionIds = new Set(resolveMissionFactionIds(stage));
  return FACTION_RULES.filter(rule => {
    if (rule.base) {
      if (!heroBaseIds.has(rule.id)) return false;
      const memberCount = teamUniverses.filter(universe => resolveUniverseFactionIds(universe).includes(rule.id)).length;
      return memberCount >= rule.minMembers;
    }
    return missionIds.has(rule.id) && teamUniverses.length >= rule.minMembers;
  });
};

export const applyFactionBonuses = (stats = {}, context = {}) => {
  const next = { ...stats };
  const activeRules = getActiveFactionBonuses(context);
  activeRules.forEach(rule => {
    if (Number.isFinite(next[rule.stat])) next[rule.stat] = Math.round(next[rule.stat] * rule.multiplier);
  });
  const reputationProgress = normalizeReputationProgress(context.reputationProgress);
  REPUTATION_TRACKS.forEach(track => {
    if (!track.passive.stat || !Number.isFinite(next[track.passive.stat])) return;
    const rank = getReputationRank(track.id, reputationProgress);
    next[track.passive.stat] = Math.round(next[track.passive.stat] * (1 + rank * track.passive.perRank));
  });
  return { stats: next, activeRules };
};

export const getReputationResourceMultiplier = (resource, progress = {}) => REPUTATION_TRACKS
  .filter(track => track.passive.resource === resource)
  .reduce((multiplier, track) => (
    multiplier * (1 + getReputationRank(track.id, progress) * track.passive.perRank)
  ), 1);

export const awardMissionReputation = (progress, stage, { victory = false, firstClear = false } = {}) => {
  const next = normalizeReputationProgress(progress);
  const ruleIds = resolveMissionFactionIds(stage);
  const reputationIds = unique(
    ruleIds
      .map(ruleId => FACTION_RULES.find(rule => rule.id === ruleId)?.reputationId)
      .filter(Boolean)
  );
  if (!reputationIds.length) reputationIds.push('nexus_alliance');
  const gain = victory
    ? 12 + (firstClear ? 8 : 0) + (stage?.finalGameBoss ? 12 : 0) + (stage?.specialEventId ? 6 : 0)
    : 3;
  reputationIds.forEach(trackId => {
    next[trackId] = { ...next[trackId], xp: toSafeXp(next[trackId].xp + gain) };
  });
  return next;
};

export const FACTION_RULE_COUNT = FACTION_RULES.length;
export const BASE_FACTION_RULE_COUNT = [...BASE_RULE_IDS].length;
