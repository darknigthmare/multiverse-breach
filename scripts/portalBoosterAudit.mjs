import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

import {
  BOOSTER_ART_BY_PACK_ID,
  BOOSTER_ART_BY_UNIVERSE,
  BOOSTER_ART_UNIVERSES,
  MULTIVERSE_CONVERGENCE_BOOSTER_ART,
  PERMANENT_OC_BOOSTERS
} from '../src/game/portalBoosterCatalog.js';
import {
  OC_BOOSTER_CONTENT_UPDATES,
  OC_BOOSTER_UPDATE_UNLOCKABLES,
  getOcBoosterContentUpdate
} from '../src/game/ocBoosterContentUpdates.js';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const errors = [];
const contentErrors = [];
const contentGaps = [];
const paths = new Set();
let totalBytes = 0;

const contentMinimums = Object.freeze({
  hero: 3,
  equipment: 3,
  event: 1,
  skin: 3,
  archive: 1,
  kart: 1,
  battleMusic: 1,
  stageMusic: 1,
  fieldSuper: 1,
  npcAssist: 1,
  koEffect: 1,
  portalEffect: 1,
  introPose: 1,
  victoryPose: 1,
  profileBanner: 1,
  profileTitle: 1,
  hud: 1
});

const isRecord = (value) => (
  value !== null
  && typeof value === 'object'
  && !Array.isArray(value)
);

const hasVisibleText = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (!isRecord(value)) {
    return false;
  }
  return Object.values(value).some(
    (entry) => typeof entry === 'string' && entry.trim().length > 0
  );
};

const isHexColor = (value) => /^#[0-9a-f]{6}$/i.test(String(value || ''));

const hasFiniteFields = (value, fieldNames) => (
  isRecord(value)
  && fieldNames.every((fieldName) => Number.isFinite(value[fieldName]))
);

const vite = await createServer({
  root: projectRoot,
  appType: 'custom',
  logLevel: 'silent',
  server: { middlewareMode: true }
});

let HEROES_DB;
let EQUIP_ITEMS_DB;
let EVENT_ITEMS_DB;
let SKIN_CATALOG;
let makeBoosterCandidates;
let KART_CATALOG;
let BATTLE_MUSIC_CATALOG;
let STAGE_MUSIC_CATALOG;
let FIELD_SUPER_CATALOG;
let NPC_ASSIST_CATALOG;
let KO_EFFECT_CATALOG;
let PORTAL_EFFECT_CATALOG;
let INTRO_POSE_CATALOG;
let VICTORY_POSE_CATALOG;
let PROFILE_BANNER_CATALOG;
let PROFILE_TITLE_CATALOG;
let getUnlockableById;
let BATTLE_ITEMS_BY_UNIVERSE;
try {
  const heroModule = await vite.ssrLoadModule('/src/game/heroes.js');
  const narrativeModule = await vite.ssrLoadModule('/src/game/narrativeSystems.js');
  const portalModule = await vite.ssrLoadModule('/src/components/PortalScreen.jsx');
  const unlockableModule = await vite.ssrLoadModule('/src/game/universeUnlockables.js');
  const battleItemModule = await vite.ssrLoadModule('/src/game/battleItems.js');
  HEROES_DB = heroModule.HEROES_DB;
  EQUIP_ITEMS_DB = heroModule.EQUIP_ITEMS_DB;
  EVENT_ITEMS_DB = heroModule.EVENT_ITEMS_DB;
  SKIN_CATALOG = narrativeModule.SKIN_CATALOG;
  makeBoosterCandidates = portalModule.default.makeBoosterCandidates;
  KART_CATALOG = unlockableModule.KART_CATALOG;
  BATTLE_MUSIC_CATALOG = unlockableModule.BATTLE_MUSIC_CATALOG;
  STAGE_MUSIC_CATALOG = unlockableModule.STAGE_MUSIC_CATALOG;
  FIELD_SUPER_CATALOG = unlockableModule.FIELD_SUPER_CATALOG;
  NPC_ASSIST_CATALOG = unlockableModule.NPC_ASSIST_CATALOG;
  KO_EFFECT_CATALOG = unlockableModule.KO_EFFECT_CATALOG;
  PORTAL_EFFECT_CATALOG = unlockableModule.PORTAL_EFFECT_CATALOG;
  INTRO_POSE_CATALOG = unlockableModule.INTRO_POSE_CATALOG;
  VICTORY_POSE_CATALOG = unlockableModule.VICTORY_POSE_CATALOG;
  PROFILE_BANNER_CATALOG = unlockableModule.PROFILE_BANNER_CATALOG;
  PROFILE_TITLE_CATALOG = unlockableModule.PROFILE_TITLE_CATALOG;
  getUnlockableById = unlockableModule.getUnlockableById;
  BATTLE_ITEMS_BY_UNIVERSE = battleItemModule.BATTLE_ITEMS_BY_UNIVERSE;
} finally {
  await vite.close();
}

const runtimeUniverses = [...new Set(
  HEROES_DB.map((hero) => hero?.universe).filter(Boolean)
)];
const runtimeUniverseSet = new Set(runtimeUniverses);
const contentByUniverse = new Map(runtimeUniverses.map((universe) => [
  universe,
  {
    hero: 0,
    equipment: 0,
    event: 0,
    skin: 0,
    archive: 0,
    kart: 0,
    battleMusic: 0,
    stageMusic: 0,
    fieldSuper: 0,
    npcAssist: 0,
    koEffect: 0,
    portalEffect: 0,
    introPose: 0,
    victoryPose: 0,
    profileBanner: 0,
    profileTitle: 0,
    hud: 0
  }
]));
const idsByFamily = new Map([
  ['hero', new Set()],
  ['equipment', new Set()],
  ['event', new Set()],
  ['skin', new Set()],
  ['kart', new Set()],
  ['battleMusic', new Set()],
  ['stageMusic', new Set()],
  ['fieldSuper', new Set()],
  ['npcAssist', new Set()],
  ['koEffect', new Set()],
  ['portalEffect', new Set()],
  ['introPose', new Set()],
  ['victoryPose', new Set()],
  ['profileBanner', new Set()],
  ['profileTitle', new Set()]
]);

const registerId = (family, id, sourceLabel) => {
  if (!hasVisibleText(id)) {
    contentErrors.push(`${sourceLabel}: missing id`);
    return;
  }
  const familyIds = idsByFamily.get(family);
  if (familyIds.has(id)) {
    contentErrors.push(`${sourceLabel}: duplicate ${family} id "${id}"`);
  }
  familyIds.add(id);
};

HEROES_DB.forEach((hero, index) => {
  const sourceLabel = `hero[${index}]`;
  if (!isRecord(hero)) {
    contentErrors.push(`${sourceLabel}: expected an object`);
    return;
  }
  registerId('hero', hero.id, sourceLabel);
  if (!hasVisibleText(hero.name)) {
    contentErrors.push(`${sourceLabel}: missing name`);
  }
  if (!hasVisibleText(hero.universe)) {
    contentErrors.push(`${sourceLabel}: missing universe`);
    return;
  }
  const universeCounts = contentByUniverse.get(hero.universe);
  if (universeCounts) {
    universeCounts.hero++;
  }
});

EQUIP_ITEMS_DB.forEach((item, index) => {
  const sourceLabel = `equipment[${index}]`;
  if (!isRecord(item)) {
    contentErrors.push(`${sourceLabel}: expected an object`);
    return;
  }
  registerId('equipment', item.id, sourceLabel);
  if (!hasVisibleText(item.name)) {
    contentErrors.push(`${sourceLabel}: missing name`);
  }
  if (!hasVisibleText(item.universe)) {
    contentErrors.push(`${sourceLabel}: missing universe`);
  } else if (!runtimeUniverseSet.has(item.universe)) {
    contentErrors.push(`${sourceLabel}: unknown universe "${item.universe}"`);
  } else {
    contentByUniverse.get(item.universe).equipment++;
  }

  const boostEntries = isRecord(item.boost) ? Object.entries(item.boost) : [];
  if (
    boostEntries.length === 0
    || boostEntries.some(([statName, value]) => (
      !hasVisibleText(statName) || !Number.isFinite(value)
    ))
  ) {
    contentErrors.push(`${sourceLabel}: boost must contain finite numeric values`);
  }
});

Object.entries(EVENT_ITEMS_DB).forEach(([universe, item], index) => {
  const sourceLabel = `event[${index}]`;
  if (!isRecord(item)) {
    contentErrors.push(`${sourceLabel}: expected an object`);
    return;
  }
  registerId('event', item.id, sourceLabel);
  if (!hasVisibleText(item.name)) {
    contentErrors.push(`${sourceLabel}: missing name`);
  }
  if (!hasVisibleText(universe)) {
    contentErrors.push(`${sourceLabel}: missing universe key`);
  } else if (!runtimeUniverseSet.has(universe)) {
    contentErrors.push(`${sourceLabel}: unknown universe "${universe}"`);
  } else {
    contentByUniverse.get(universe).event++;
  }
  if (!hasVisibleText(item.effect)) {
    contentErrors.push(`${sourceLabel}: missing effect`);
  }
});

const heroById = new Map(HEROES_DB.map((hero) => [hero.id, hero]));
const collectibleSkins = [];
Object.entries(SKIN_CATALOG).forEach(([catalogKey, skin]) => {
  if (!isRecord(skin) || skin.id === 'default' || !skin.heroId) {
    return;
  }

  const sourceLabel = `skin["${catalogKey}"]`;
  const hero = heroById.get(skin.heroId);
  if (!hero) {
    if (skin.heroId !== 'player_anchor') {
      contentErrors.push(`${sourceLabel}: unknown hero "${skin.heroId}"`);
    }
    return;
  }

  registerId('skin', skin.id, sourceLabel);
  if (!hasVisibleText(skin.name)) {
    contentErrors.push(`${sourceLabel}: missing name`);
  }
  if (!hasVisibleText(hero.universe) || !runtimeUniverseSet.has(hero.universe)) {
    contentErrors.push(`${sourceLabel}: missing runtime universe for hero "${skin.heroId}"`);
    return;
  }

  collectibleSkins.push(skin);
  contentByUniverse.get(hero.universe).skin++;
});

const unlockableCatalogs = Object.freeze({
  kart: KART_CATALOG,
  battleMusic: BATTLE_MUSIC_CATALOG,
  stageMusic: STAGE_MUSIC_CATALOG,
  fieldSuper: FIELD_SUPER_CATALOG,
  npcAssist: NPC_ASSIST_CATALOG,
  koEffect: KO_EFFECT_CATALOG,
  portalEffect: PORTAL_EFFECT_CATALOG,
  introPose: INTRO_POSE_CATALOG,
  victoryPose: VICTORY_POSE_CATALOG,
  profileBanner: PROFILE_BANNER_CATALOG,
  profileTitle: PROFILE_TITLE_CATALOG
});
const kartStyles = new Set(['needle', 'drift', 'bastion', 'wing', 'pulse']);
const ultimateIdByUniverse = new Map(
  Object.entries(BATTLE_ITEMS_BY_UNIVERSE).map(([universe, items]) => [
    universe,
    items.find((item) => item?.tier === 'ultimate')?.id
  ])
);

Object.entries(unlockableCatalogs).forEach(([kind, catalog]) => {
  if (!Array.isArray(catalog)) {
    contentErrors.push(`${kind} catalog: expected an array`);
    return;
  }

  catalog.forEach((unlockable, index) => {
    const sourceLabel = `${kind}[${index}]`;
    if (!isRecord(unlockable)) {
      contentErrors.push(`${sourceLabel}: expected an object`);
      return;
    }

    registerId(kind, unlockable.id, sourceLabel);
    if (unlockable.kind !== kind) {
      contentErrors.push(`${sourceLabel}: kind must be "${kind}"`);
    }
    if (!hasVisibleText(unlockable.name)) {
      contentErrors.push(`${sourceLabel}: missing localized name`);
    }
    if (!hasVisibleText(unlockable.desc)) {
      contentErrors.push(`${sourceLabel}: missing localized description`);
    }
    if (!isHexColor(unlockable.color)) {
      contentErrors.push(`${sourceLabel}: invalid color "${unlockable.color}"`);
    }
    if (!hasVisibleText(unlockable.universe)) {
      contentErrors.push(`${sourceLabel}: missing universe`);
      return;
    }
    if (!runtimeUniverseSet.has(unlockable.universe)) {
      contentErrors.push(`${sourceLabel}: unknown universe "${unlockable.universe}"`);
      return;
    }

    contentByUniverse.get(unlockable.universe)[kind]++;

    if (kind === 'kart' && !kartStyles.has(unlockable.style)) {
      contentErrors.push(`${sourceLabel}: unknown kart style "${unlockable.style}"`);
    }

    if (kind === 'battleMusic' || kind === 'stageMusic') {
      const musicStage = unlockable.musicStage;
      if (
        !isRecord(musicStage)
        || !hasVisibleText(musicStage.id)
        || !hasVisibleText(musicStage.name)
        || !hasVisibleText(musicStage.mode)
      ) {
        contentErrors.push(`${sourceLabel}: incomplete procedural music metadata`);
      } else if (musicStage.universe !== unlockable.universe) {
        contentErrors.push(
          `${sourceLabel}: music universe "${musicStage.universe}" does not match "${unlockable.universe}"`
        );
      }
      if (!hasVisibleText(unlockable.state)) {
        contentErrors.push(`${sourceLabel}: missing music state`);
      }
    }

    if (kind === 'fieldSuper') {
      const expectedUltimateId = ultimateIdByUniverse.get(unlockable.universe);
      if (!hasVisibleText(unlockable.sourceUltimateId)) {
        contentErrors.push(`${sourceLabel}: missing source ultimate id`);
      } else if (unlockable.sourceUltimateId !== expectedUltimateId) {
        contentErrors.push(
          `${sourceLabel}: source ultimate "${unlockable.sourceUltimateId}" does not match "${expectedUltimateId}"`
        );
      }
      if (
        !hasFiniteFields(
          unlockable.effect,
          ['damage', 'guardDamage', 'knockback', 'healRatio']
        )
      ) {
        contentErrors.push(`${sourceLabel}: incomplete finite field-super effect`);
      }
    }
  });
});

const candidateIds = new Set();
for (const universe of runtimeUniverses) {
  const universeHeroes = HEROES_DB.filter((hero) => hero.universe === universe);
  const candidates = makeBoosterCandidates({
    banner: {
      id: `audit:${universe}`,
      color: '#39c5bb',
      match: (hero) => hero.universe === universe
    },
    visibleHeroes: universeHeroes,
    disabledGearIds: new Set()
  });
  const candidateCounts = candidates.reduce((counts, candidate) => ({
    ...counts,
    [candidate.kind]: (counts[candidate.kind] || 0) + 1
  }), {});
  const sourceCounts = contentByUniverse.get(universe);

  for (const kind of [
    'hero',
    'equipment',
    'event',
    'skin',
    'kart',
    'battleMusic',
    'stageMusic',
    'fieldSuper',
    'npcAssist',
    'koEffect',
    'portalEffect',
    'introPose',
    'victoryPose',
    'profileBanner',
    'profileTitle'
  ]) {
    if ((candidateCounts[kind] || 0) !== sourceCounts[kind]) {
      contentErrors.push(
        `${universe}: PortalScreen exposes ${candidateCounts[kind] || 0} ${kind}, source registry contains ${sourceCounts[kind]}`
      );
    }
  }
  sourceCounts.archive = candidateCounts.archive || 0;
  sourceCounts.hud = candidateCounts.hud || 0;
  const rarityIds = new Set(
    candidates.map((candidate) => candidate.rarity?.id).filter(Boolean)
  );
  for (const rarityId of ['common', 'rare', 'epic', 'anomaly']) {
    if (!rarityIds.has(rarityId)) {
      contentErrors.push(
        `${universe}: booster pool is missing the "${rarityId}" rarity tier`
      );
    }
  }

  for (const candidate of candidates) {
    if (!hasVisibleText(candidate.id) || !hasVisibleText(candidate.rewardId)) {
      contentErrors.push(`${universe}: PortalScreen candidate is missing an id`);
      continue;
    }
    if (candidate.universe !== universe) {
      contentErrors.push(
        `${universe}: candidate "${candidate.id}" leaked from "${candidate.universe}"`
      );
    }
    if (candidateIds.has(candidate.id)) {
      contentErrors.push(`${universe}: duplicate PortalScreen candidate id "${candidate.id}"`);
    }
    candidateIds.add(candidate.id);

    if (!Object.prototype.hasOwnProperty.call(contentMinimums, candidate.kind)) {
      contentErrors.push(
        `${universe}: candidate "${candidate.id}" uses forbidden random kind "${candidate.kind}"`
      );
    }
    if (candidate.kind === 'mission' || candidate.kind === 'mode') {
      contentErrors.push(
        `${universe}: missions and modes must never be random booster rewards`
      );
    }

    if (unlockableCatalogs[candidate.kind]) {
      const unlockable = candidate.data?.unlockable;
      if (
        !isRecord(unlockable)
        || unlockable.id !== candidate.rewardId
        || unlockable.kind !== candidate.kind
        || unlockable.universe !== universe
      ) {
        contentErrors.push(
          `${universe}: candidate "${candidate.id}" has invalid ${candidate.kind} metadata`
        );
      }
    }
  }
}

const nexusHeroes = HEROES_DB.filter(
  (hero) => hero.universe === 'Nexus de Convergence'
);
const ocPoolSignatures = new Set();
const ocUpdateCandidateOwners = new Map();
for (const pack of PERMANENT_OC_BOOSTERS) {
  const featuredHeroIds = new Set(pack.heroIds);
  const candidates = makeBoosterCandidates({
    banner: {
      ...pack,
      match: (hero) => featuredHeroIds.has(hero.id)
    },
    visibleHeroes: nexusHeroes,
    disabledGearIds: new Set()
  });
  const poolIds = new Set(candidates.map(candidate => candidate.id));
  const heroIds = candidates
    .filter(candidate => candidate.kind === 'hero')
    .map(candidate => candidate.rewardId)
    .sort();
  const expectedHeroIds = [...pack.heroIds].sort();
  const poolSignature = heroIds.join('|');
  const update = getOcBoosterContentUpdate(pack.id);
  const updateCandidates = candidates.filter(candidate => candidate.isContentUpdate);
  const expectedUpdateIds = update?.newCardIds || [];
  const actualUpdateIds = updateCandidates.map(candidate => candidate.id);

  if (candidates.length < 5 || poolIds.size < 5) {
    contentErrors.push(`${pack.id}: targeted OC pool cannot supply five distinct cards`);
  }
  if (
    !update
    || pack.contentUpdate?.id !== update.id
    || pack.contentUpdate?.version !== update.version
    || pack.contentUpdate?.releasedAt !== update.releasedAt
  ) {
    contentErrors.push(`${pack.id}: missing or inconsistent OC content update metadata`);
  }
  if (
    expectedUpdateIds.length !== 5
    || JSON.stringify(actualUpdateIds) !== JSON.stringify(expectedUpdateIds)
  ) {
    contentErrors.push(
      `${pack.id}: OC content update pool differs from its five-card catalogue`
    );
  }
  if (new Set(updateCandidates.map(candidate => candidate.kind)).size < 3) {
    contentErrors.push(`${pack.id}: OC content update must span at least three reward kinds`);
  }
  if (updateCandidates.filter(candidate => candidate.rarity?.id === 'anomaly').length !== 1) {
    contentErrors.push(`${pack.id}: OC content update must expose exactly one Anomaly chase`);
  }
  for (const candidate of updateCandidates) {
    const definition = update.cards.find(card => card.id === candidate.id);
    const owners = ocUpdateCandidateOwners.get(candidate.id) || [];
    owners.push(pack.id);
    ocUpdateCandidateOwners.set(candidate.id, owners);

    if (
      !definition
      || candidate.rewardId !== definition.rewardId
      || candidate.rarity?.id !== definition.rarityId
      || candidate.contentUpdateVersion !== update.version
      || candidate.universe !== 'Nexus de Convergence'
    ) {
      contentErrors.push(`${pack.id}: invalid update candidate "${candidate.id}"`);
    }
    if (pack.rewardKinds && !pack.rewardKinds.includes(candidate.kind)) {
      contentErrors.push(
        `${pack.id}: update candidate "${candidate.id}" leaked outside rewardKinds`
      );
    }
    if (candidate.kind === 'archive' || candidate.kind === 'hud') {
      if (!hasVisibleText(candidate.data?.image) || !hasVisibleText(candidate.data?.mode)) {
        contentErrors.push(`${pack.id}: "${candidate.id}" lacks playable backdrop metadata`);
      }
    } else {
      const unlockable = candidate.data?.unlockable;
      if (
        !isRecord(unlockable)
        || unlockable.id !== candidate.rewardId
        || unlockable.kind !== candidate.kind
        || getUnlockableById(candidate.kind, candidate.rewardId) !== unlockable
      ) {
        contentErrors.push(
          `${pack.id}: supplemental unlockable "${candidate.id}" is not resolvable`
        );
      }
    }
  }
  if (JSON.stringify(heroIds) !== JSON.stringify(expectedHeroIds)) {
    contentErrors.push(`${pack.id}: targeted OC hero scope does not match its catalogue`);
  }
  if (ocPoolSignatures.has(poolSignature)) {
    contentErrors.push(`${pack.id}: duplicate targeted OC hero pool "${poolSignature}"`);
  }
  ocPoolSignatures.add(poolSignature);
  if (candidates.some(candidate => candidate.universe !== 'Nexus de Convergence')) {
    contentErrors.push(`${pack.id}: reward leaked from outside Nexus de Convergence`);
  }
  const rarityIds = new Set(
    candidates.map(candidate => candidate.rarity?.id).filter(Boolean)
  );
  for (const rarityId of ['common', 'rare', 'epic', 'anomaly']) {
    if (!rarityIds.has(rarityId)) {
      contentErrors.push(`${pack.id}: targeted OC pool is missing the "${rarityId}" rarity tier`);
    }
  }
  if (
    pack.rewardKinds
    && candidates.some(candidate => !pack.rewardKinds.includes(candidate.kind))
  ) {
    contentErrors.push(`${pack.id}: reward kind leaked outside its targeted manifest`);
  }
  const chase = candidates.find(candidate => candidate.id === pack.chaseRewardId);
  if (!chase || chase.rarity?.id !== 'anomaly' || chase.kind === 'hero') {
    contentErrors.push(`${pack.id}: missing thematic non-character Anomaly chase`);
  }
  if (!candidates.some(candidate => (
    candidate.kind !== 'hero'
    && ['rare', 'epic', 'anomaly'].includes(candidate.rarity?.id)
  ))) {
    contentErrors.push(`${pack.id}: missing guaranteed non-character Rare+ candidate`);
  }
}

for (const [candidateId, owners] of ocUpdateCandidateOwners) {
  if (owners.length !== 1) {
    contentErrors.push(
      `${candidateId}: OC content update leaked between packs (${owners.join(', ')})`
    );
  }
}

const ocContentUpdateCards = Object.values(OC_BOOSTER_CONTENT_UPDATES)
  .flatMap(update => update.cards);
const ocContentUpdateIds = new Set();
if (
  Object.keys(OC_BOOSTER_CONTENT_UPDATES).length !== 5
  || ocContentUpdateCards.length !== 25
) {
  contentErrors.push(
    `OC content update registry exposes ${ocContentUpdateCards.length} cards across `
    + `${Object.keys(OC_BOOSTER_CONTENT_UPDATES).length} packs`
  );
}
if (!Object.isFrozen(OC_BOOSTER_CONTENT_UPDATES)) {
  contentErrors.push('OC content update registry must be frozen');
}
for (const card of ocContentUpdateCards) {
  if (ocContentUpdateIds.has(card.id)) {
    contentErrors.push(`OC content update has duplicate card id "${card.id}"`);
  }
  ocContentUpdateIds.add(card.id);
  if (!Object.isFrozen(card) || !hasVisibleText(card.name) || !isHexColor(card.color)) {
    contentErrors.push(`OC content update card "${card.id}" has incomplete metadata`);
  }
  if (idsByFamily.get(card.kind)?.has(card.id)) {
    contentErrors.push(`OC content update card "${card.id}" collides with base catalogue`);
  }
  if (card.rarityId === 'anomaly' && Number(card.dropWeight) !== 2) {
    contentErrors.push(`OC Anomaly update card "${card.id}" must use featured weight 2`);
  }
  const unlockable = card.data?.unlockable;
  if (unlockable?.kind === 'fieldSuper') {
    const effect = unlockable.effect;
    if (
      !hasFiniteFields(effect, ['damage', 'guardDamage', 'knockback', 'healRatio'])
      || effect.damage > 41
      || effect.guardDamage > 70
      || effect.knockback > 360
      || effect.healRatio > 0.04
    ) {
      contentErrors.push(`OC Field Super "${card.id}" exceeds balanced effect bounds`);
    }
  }
}
if (
  Object.keys(OC_BOOSTER_UPDATE_UNLOCKABLES).length
  !== ocContentUpdateCards.filter(card => card.data?.unlockable).length
) {
  contentErrors.push('OC supplemental unlockable registry is incomplete');
}

for (const [family, familyIds] of idsByFamily) {
  for (const id of familyIds) {
    const owners = [...idsByFamily.entries()]
      .filter(([, ids]) => ids.has(id))
      .map(([owner]) => owner);
    if (owners[0] === family && owners.length > 1) {
      contentErrors.push(`ID collision "${id}" between families: ${owners.join(', ')}`);
    }
  }
}

for (const [universe, counts] of contentByUniverse) {
  const missing = Object.fromEntries(
    Object.entries(contentMinimums)
      .filter(([kind, minimum]) => counts[kind] < minimum)
      .map(([kind, minimum]) => [
        kind,
        { actual: counts[kind], minimum }
      ])
  );
  if (Object.keys(missing).length === 0) {
    continue;
  }
  contentGaps.push({ universe, counts, missing });
  for (const [kind, gap] of Object.entries(missing)) {
    contentErrors.push(
      `${universe}: ${kind} has ${gap.actual}, requires at least ${gap.minimum}`
    );
  }
}

const contentTotals = {
  universes: runtimeUniverses.length,
  hero: HEROES_DB.length,
  equipment: EQUIP_ITEMS_DB.length,
  event: Object.keys(EVENT_ITEMS_DB).length,
  skin: collectibleSkins.length,
  archive: [...contentByUniverse.values()].reduce((sum, counts) => sum + counts.archive, 0),
  kart: KART_CATALOG.length,
  battleMusic: BATTLE_MUSIC_CATALOG.length,
  stageMusic: STAGE_MUSIC_CATALOG.length,
  fieldSuper: FIELD_SUPER_CATALOG.length,
  npcAssist: NPC_ASSIST_CATALOG.length,
  koEffect: KO_EFFECT_CATALOG.length,
  portalEffect: PORTAL_EFFECT_CATALOG.length,
  introPose: INTRO_POSE_CATALOG.length,
  victoryPose: VICTORY_POSE_CATALOG.length,
  profileBanner: PROFILE_BANNER_CATALOG.length,
  profileTitle: PROFILE_TITLE_CATALOG.length,
  hud: [...contentByUniverse.values()].reduce((sum, counts) => sum + counts.hud, 0),
  ocContentUpdate: ocContentUpdateCards.length
};
contentTotals.total = Object.entries(contentTotals)
  .filter(([kind]) => kind !== 'universes')
  .reduce((sum, [, count]) => sum + count, 0);

const missingUniverses = runtimeUniverses.filter(
  (universe) => universe !== 'Nexus de Convergence' && !BOOSTER_ART_BY_UNIVERSE[universe]
);
const orphanUniverses = BOOSTER_ART_UNIVERSES.filter(
  (universe) => !runtimeUniverseSet.has(universe)
);

if (missingUniverses.length > 0) {
  errors.push(`Missing runtime universes: ${missingUniverses.join(', ')}`);
}
if (orphanUniverses.length > 0) {
  errors.push(`Orphan catalogue universes: ${orphanUniverses.join(', ')}`);
}

for (const universe of BOOSTER_ART_UNIVERSES) {
  const publicPath = BOOSTER_ART_BY_UNIVERSE[universe];

  if (!publicPath?.startsWith('/boosters/') || !publicPath.endsWith('.webp')) {
    errors.push(`${universe}: invalid public path "${publicPath}"`);
    continue;
  }

  if (paths.has(publicPath)) {
    errors.push(`${universe}: duplicate public path "${publicPath}"`);
  }
  paths.add(publicPath);

  const localPath = path.join(projectRoot, 'public', ...publicPath.split('/').filter(Boolean));
  try {
    const fileStats = await stat(localPath);
    totalBytes += fileStats.size;
    if (!fileStats.isFile() || fileStats.size < 50_000) {
      errors.push(`${universe}: suspicious booster asset (${fileStats.size} bytes)`);
    }
  } catch (error) {
    errors.push(`${universe}: missing asset (${error.code || error.message})`);
  }
}

if (PERMANENT_OC_BOOSTERS.length !== 5) {
  errors.push(`Expected five permanent OC boosters, found ${PERMANENT_OC_BOOSTERS.length}`);
}
const permanentOcIds = new Set();
for (const pack of PERMANENT_OC_BOOSTERS) {
  const publicPath = pack.art;
  if (permanentOcIds.has(pack.id)) {
    errors.push(`${pack.id}: duplicate permanent OC pack id`);
  }
  permanentOcIds.add(pack.id);
  if (
    BOOSTER_ART_BY_PACK_ID[pack.id] !== publicPath
    || !publicPath?.startsWith('/boosters/oc-')
    || !publicPath.endsWith('.webp')
  ) {
    errors.push(`${pack.id}: invalid permanent OC art mapping "${publicPath}"`);
    continue;
  }
  if (paths.has(publicPath)) {
    errors.push(`${pack.id}: duplicate public path "${publicPath}"`);
  }
  paths.add(publicPath);

  const localPath = path.join(projectRoot, 'public', ...publicPath.split('/').filter(Boolean));
  try {
    const fileStats = await stat(localPath);
    totalBytes += fileStats.size;
    if (!fileStats.isFile() || fileStats.size < 50_000 || fileStats.size > 800_000) {
      errors.push(`${pack.id}: suspicious booster asset (${fileStats.size} bytes)`);
    }
  } catch (error) {
    errors.push(`${pack.id}: missing asset (${error.code || error.message})`);
  }
}

const multiverseAssetPath = path.join(
  projectRoot,
  'public',
  ...MULTIVERSE_CONVERGENCE_BOOSTER_ART.split('/').filter(Boolean)
);
if (BOOSTER_ART_BY_PACK_ID.multi !== MULTIVERSE_CONVERGENCE_BOOSTER_ART) {
  errors.push('Multiverse convergence: invalid permanent pack mapping');
}
if (paths.has(MULTIVERSE_CONVERGENCE_BOOSTER_ART)) {
  errors.push('Multiverse convergence: duplicate public path');
}
paths.add(MULTIVERSE_CONVERGENCE_BOOSTER_ART);
try {
  const fileStats = await stat(multiverseAssetPath);
  totalBytes += fileStats.size;
  if (!fileStats.isFile() || fileStats.size < 50_000) {
    errors.push(`Multiverse convergence: suspicious booster asset (${fileStats.size} bytes)`);
  }
} catch (error) {
  errors.push(`Multiverse convergence: missing asset (${error.code || error.message})`);
}

console.log(JSON.stringify({
  runtimeUniverses: runtimeUniverses.length,
  catalogUniverses: BOOSTER_ART_UNIVERSES.length,
  permanentOcBoosters: PERMANENT_OC_BOOSTERS.length,
  uniqueAssets: paths.size,
  totalBytes,
  missingUniverses,
  orphanUniverses,
  contentTotals,
  contentMinimums,
  contentGaps,
  contentErrors,
  errors
}, null, 2));

if (errors.length > 0 || contentErrors.length > 0) {
  process.exitCode = 1;
}
