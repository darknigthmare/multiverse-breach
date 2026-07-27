import { BATTLE_ITEMS_BY_UNIVERSE } from './battleItems';
import { LORE_DB } from './lore';
import { OC_BOOSTER_UPDATE_UNLOCKABLES } from './ocBoosterContentUpdates.js';

const KART_STYLES = Object.freeze([
  {
    id: 'needle',
    label: { fr: 'profil vitesse', en: 'speed profile' }
  },
  {
    id: 'drift',
    label: { fr: 'profil drift', en: 'drift profile' }
  },
  {
    id: 'bastion',
    label: { fr: 'profil blinde', en: 'armored profile' }
  },
  {
    id: 'wing',
    label: { fr: 'profil aerodynamique', en: 'aerodynamic profile' }
  },
  {
    id: 'pulse',
    label: { fr: 'profil resonance', en: 'resonance profile' }
  }
]);

const ASSIST_STYLES = Object.freeze([
  { id: 'vanguard', label: { fr: 'avant-garde', en: 'vanguard' } },
  { id: 'medic', label: { fr: 'soutien medical', en: 'medical support' } },
  { id: 'breaker', label: { fr: 'rupture de garde', en: 'guard breaker' } },
  { id: 'scout', label: { fr: 'relais eclaireur', en: 'scout relay' } }
]);

const KO_STYLES = Object.freeze([
  { id: 'shards', label: { fr: 'eclats de Trame', en: 'Thread shards' } },
  { id: 'scanline', label: { fr: 'balayage A.R.C.A.', en: 'A.R.C.A. scanline' } },
  { id: 'rift', label: { fr: 'implosion de breche', en: 'breach implosion' } },
  { id: 'sigil', label: { fr: 'sceau de stabilisation', en: 'stabilization sigil' } }
]);

const PORTAL_STYLES = Object.freeze([
  { id: 'ring', label: { fr: 'anneau de resonance', en: 'resonance ring' } },
  { id: 'iris', label: { fr: 'iris de Trame', en: 'Thread iris' } },
  { id: 'fracture', label: { fr: 'fracture radiale', en: 'radial fracture' } },
  { id: 'gate', label: { fr: 'porte archivee', en: 'archived gate' } }
]);

const POSE_STYLES = Object.freeze([
  { id: 'ready', intro: { fr: 'garde de resonance', en: 'resonance guard' }, victory: { fr: 'verrouillage de coordonnee', en: 'coordinate lock' } },
  { id: 'breach', intro: { fr: 'traversee de breche', en: 'breach crossing' }, victory: { fr: 'sceau de Trame', en: 'Thread seal' } },
  { id: 'duel', intro: { fr: 'salut de duel', en: 'duel salute' }, victory: { fr: 'signature dominante', en: 'dominant signature' } },
  { id: 'echo', intro: { fr: 'materialisation echo', en: 'echo materialization' }, victory: { fr: 'dissipation du Sans-Auteur', en: 'Authorless dissipation' } }
]);

const BANNER_STYLES = Object.freeze([
  { id: 'grid', pattern: 'linear-grid' },
  { id: 'rings', pattern: 'concentric-rings' },
  { id: 'shards', pattern: 'diagonal-shards' },
  { id: 'signal', pattern: 'signal-bars' }
]);

const MEDIA_MUSIC_FLAVORS = Object.freeze({
  game: {
    battle: { fr: 'Boucle de combat', en: 'Battle Loop' },
    stage: { fr: 'Theme de niveau', en: 'Stage Theme' }
  },
  movie: {
    battle: { fr: 'Impact cinematographique', en: 'Cinematic Impact' },
    stage: { fr: 'Ambiance de scene', en: 'Scene Atmosphere' }
  },
  series: {
    battle: { fr: 'Signal de confrontation', en: 'Confrontation Signal' },
    stage: { fr: 'Generique de Trame', en: 'Thread Theme' }
  },
  manga: {
    battle: { fr: 'Rupture de planche', en: 'Panel Break' },
    stage: { fr: 'Encre de decor', en: 'Scenery Ink' }
  },
  music: {
    battle: { fr: 'Mix de fosse', en: 'Pit Mix' },
    stage: { fr: 'Balance de scene', en: 'Stage Soundcheck' }
  },
  other: {
    battle: { fr: 'Rupture de combat', en: 'Battle Breach' },
    stage: { fr: 'Echo de Trame', en: 'Thread Echo' }
  }
});

const hashValue = (value) => String(value).split('').reduce(
  (total, char) => ((total * 33) + char.charCodeAt(0)) >>> 0,
  5381
);

const getMediaType = (universe) => LORE_DB[universe]?.mediaType || 'other';

const getUltimateForUniverse = (universe) => (
  BATTLE_ITEMS_BY_UNIVERSE[universe]?.find(item => item.tier === 'ultimate')
);

const makeUniverseUnlockables = (universe) => {
  const mediaType = getMediaType(universe);
  const musicFlavor = MEDIA_MUSIC_FLAVORS[mediaType] || MEDIA_MUSIC_FLAVORS.other;
  const ultimate = getUltimateForUniverse(universe);
  const color = ultimate?.color || '#39c5bb';
  const universeHash = hashValue(universe);
  const kartStyle = KART_STYLES[universeHash % KART_STYLES.length];
  const assistStyle = ASSIST_STYLES[universeHash % ASSIST_STYLES.length];
  const assistProfile = {
    vanguard: { damage: 19, guardDamage: 18, healRatio: 0.02 },
    medic: { damage: 10, guardDamage: 12, healRatio: 0.08 },
    breaker: { damage: 14, guardDamage: 30, healRatio: 0.02 },
    scout: { damage: 12, guardDamage: 16, healRatio: 0.05 }
  }[assistStyle.id];
  const koStyle = KO_STYLES[hashValue(`${universe}:ko`) % KO_STYLES.length];
  const portalStyle = PORTAL_STYLES[hashValue(`${universe}:portal`) % PORTAL_STYLES.length];
  const poseStyle = POSE_STYLES[hashValue(`${universe}:pose`) % POSE_STYLES.length];
  const bannerStyle = BANNER_STYLES[hashValue(`${universe}:banner`) % BANNER_STYLES.length];

  return Object.freeze({
    kart: Object.freeze({
      id: `kart:${universe}`,
      kind: 'kart',
      universe,
      color,
      style: kartStyle.id,
      name: {
        fr: `Kart de Trame ${universe}`,
        en: `${universe} Thread Kart`
      },
      desc: {
        fr: `Chassis cosmetique A.R.C.A. accorde a ${universe}, ${kartStyle.label.fr}. Les performances restent gerees par le garage.`,
        en: `Cosmetic A.R.C.A. chassis tuned to ${universe}, ${kartStyle.label.en}. Performance remains governed by garage upgrades.`
      }
    }),
    battleMusic: Object.freeze({
      id: `battle-music:${universe}`,
      kind: 'battleMusic',
      universe,
      color,
      name: {
        fr: `${musicFlavor.battle.fr} - ${universe}`,
        en: `${universe} - ${musicFlavor.battle.en}`
      },
      desc: {
        fr: `Arrangement procedural original pour les combats custom de ${universe}.`,
        en: `Original procedural arrangement for custom ${universe} battles.`
      },
      musicStage: Object.freeze({
        id: `custom-battle-music:${universe}`,
        name: `${universe} Custom Battle`,
        universe,
        mode: 'Fighter',
        tags: Object.freeze(['customBattle', 'loreArena'])
      }),
      state: 'battle'
    }),
    stageMusic: Object.freeze({
      id: `stage-music:${universe}`,
      kind: 'stageMusic',
      universe,
      color,
      name: {
        fr: `${musicFlavor.stage.fr} - ${universe}`,
        en: `${universe} - ${musicFlavor.stage.en}`
      },
      desc: {
        fr: `Arrangement procedural original pour la presentation d un stage custom de ${universe}.`,
        en: `Original procedural arrangement for a custom ${universe} stage presentation.`
      },
      musicStage: Object.freeze({
        id: `custom-stage-music:${universe}`,
        name: `${universe} Custom Stage`,
        universe,
        mode: 'Fighter',
        tags: Object.freeze(['customStage', 'loreArena'])
      }),
      state: 'grid'
    }),
    fieldSuper: Object.freeze({
      id: `field-super:${universe}`,
      kind: 'fieldSuper',
      universe,
      color,
      sourceUltimateId: ultimate?.id || null,
      name: ultimate?.name || {
        fr: `Super de terrain ${universe}`,
        en: `${universe} Field Super`
      },
      desc: ultimate?.desc || {
        fr: `La Trame de ${universe} envahit temporairement toute l arene custom.`,
        en: `The ${universe} Thread temporarily overtakes the entire custom arena.`
      },
      effect: Object.freeze({
        damage: 34 + (hashValue(`${universe}:field`) % 8),
        guardDamage: 70,
        knockback: 360,
        healRatio: 0.04
      })
    }),
    npcAssist: Object.freeze({
      id: `npc-assist:${universe}`,
      kind: 'npcAssist',
      universe,
      color,
      style: assistStyle.id,
      name: {
        fr: `Assist PNJ - ${universe}`,
        en: `${universe} NPC Assist`
      },
      desc: {
        fr: `Echo de soutien original A.R.C.A. accorde a la Trame ${universe}, calibre comme ${assistStyle.label.fr}. Utilisable une fois par combat custom.`,
        en: `Original A.R.C.A. support echo tuned to the ${universe} Thread as ${assistStyle.label.en}. Usable once per custom battle.`
      },
      effect: Object.freeze({ ...assistProfile })
    }),
    koEffect: Object.freeze({
      id: `ko-effect:${universe}`,
      kind: 'koEffect',
      universe,
      color,
      style: koStyle.id,
      name: {
        fr: `K.-O. ${koStyle.label.fr} - ${universe}`,
        en: `${universe} ${koStyle.label.en} K.O.`
      },
      desc: {
        fr: `Effet cosmetique original ${koStyle.label.fr} joue lorsqu une signature provoque un K.-O.`,
        en: `Original ${koStyle.label.en} cosmetic played when a signature scores a K.O.`
      },
      visual: Object.freeze({ pattern: koStyle.id, durationMs: 900, intensity: 0.8 })
    }),
    portalEffect: Object.freeze({
      id: `portal-effect:${universe}`,
      kind: 'portalEffect',
      universe,
      color,
      style: portalStyle.id,
      name: {
        fr: `Portail ${portalStyle.label.fr} - ${universe}`,
        en: `${universe} ${portalStyle.label.en} Portal`
      },
      desc: {
        fr: `Habillage cosmetique original de portail inspire par la signature de ${universe}.`,
        en: `Original portal cosmetic inspired by the ${universe} signature.`
      },
      visual: Object.freeze({ pattern: portalStyle.id, durationMs: 1200, intensity: 0.9 })
    }),
    introPose: Object.freeze({
      id: `intro-pose:${universe}`,
      kind: 'introPose',
      universe,
      color,
      style: poseStyle.id,
      name: {
        fr: `Pose d introduction - ${universe}`,
        en: `${universe} Introduction Pose`
      },
      desc: {
        fr: `Animation cosmetique de ${poseStyle.intro.fr} avant un combat custom.`,
        en: `${poseStyle.intro.en} cosmetic animation before a custom battle.`
      },
      animation: Object.freeze({ key: `intro-${poseStyle.id}`, durationMs: 1500 })
    }),
    victoryPose: Object.freeze({
      id: `victory-pose:${universe}`,
      kind: 'victoryPose',
      universe,
      color,
      style: poseStyle.id,
      name: {
        fr: `Pose de victoire - ${universe}`,
        en: `${universe} Victory Pose`
      },
      desc: {
        fr: `Animation cosmetique de ${poseStyle.victory.fr} apres une victoire custom.`,
        en: `${poseStyle.victory.en} cosmetic animation after a custom victory.`
      },
      animation: Object.freeze({ key: `victory-${poseStyle.id}`, durationMs: 1800 })
    }),
    profileBanner: Object.freeze({
      id: `profile-banner:${universe}`,
      kind: 'profileBanner',
      universe,
      color,
      style: bannerStyle.id,
      name: {
        fr: `Banniere de profil - ${universe}`,
        en: `${universe} Profile Banner`
      },
      desc: {
        fr: `Banniere procedurale originale ${bannerStyle.pattern} pour le Dossier d Ancre.`,
        en: `Original procedural ${bannerStyle.pattern} banner for the Anchor record.`
      },
      visual: Object.freeze({ pattern: bannerStyle.pattern, accent: color })
    }),
    profileTitle: Object.freeze({
      id: `profile-title:${universe}`,
      kind: 'profileTitle',
      universe,
      color,
      name: {
        fr: `Archiviste de ${universe}`,
        en: `${universe} Archivist`
      },
      desc: {
        fr: `Titre public prouvant la stabilisation de la Trame ${universe}.`,
        en: `Public title proving stabilization of the ${universe} Thread.`
      }
    })
  });
};

export const UNIVERSE_UNLOCKABLES = Object.freeze(Object.fromEntries(
  Object.keys(BATTLE_ITEMS_BY_UNIVERSE)
    .map(universe => [universe, makeUniverseUnlockables(universe)])
));

export const KART_CATALOG = Object.freeze(Object.values(UNIVERSE_UNLOCKABLES)
  .map(entry => entry.kart));

export const BATTLE_MUSIC_CATALOG = Object.freeze(Object.values(UNIVERSE_UNLOCKABLES)
  .map(entry => entry.battleMusic));

export const STAGE_MUSIC_CATALOG = Object.freeze(Object.values(UNIVERSE_UNLOCKABLES)
  .map(entry => entry.stageMusic));

export const FIELD_SUPER_CATALOG = Object.freeze(Object.values(UNIVERSE_UNLOCKABLES)
  .map(entry => entry.fieldSuper));

export const NPC_ASSIST_CATALOG = Object.freeze(Object.values(UNIVERSE_UNLOCKABLES)
  .map(entry => entry.npcAssist));

export const KO_EFFECT_CATALOG = Object.freeze(Object.values(UNIVERSE_UNLOCKABLES)
  .map(entry => entry.koEffect));

export const PORTAL_EFFECT_CATALOG = Object.freeze(Object.values(UNIVERSE_UNLOCKABLES)
  .map(entry => entry.portalEffect));

export const INTRO_POSE_CATALOG = Object.freeze(Object.values(UNIVERSE_UNLOCKABLES)
  .map(entry => entry.introPose));

export const VICTORY_POSE_CATALOG = Object.freeze(Object.values(UNIVERSE_UNLOCKABLES)
  .map(entry => entry.victoryPose));

export const PROFILE_BANNER_CATALOG = Object.freeze(Object.values(UNIVERSE_UNLOCKABLES)
  .map(entry => entry.profileBanner));

export const PROFILE_TITLE_CATALOG = Object.freeze(Object.values(UNIVERSE_UNLOCKABLES)
  .map(entry => entry.profileTitle));

const CATALOG_BY_KIND = Object.freeze({
  kart: new Map(KART_CATALOG.map(item => [item.id, item])),
  battleMusic: new Map(BATTLE_MUSIC_CATALOG.map(item => [item.id, item])),
  stageMusic: new Map(STAGE_MUSIC_CATALOG.map(item => [item.id, item])),
  fieldSuper: new Map(FIELD_SUPER_CATALOG.map(item => [item.id, item])),
  npcAssist: new Map(NPC_ASSIST_CATALOG.map(item => [item.id, item])),
  koEffect: new Map(KO_EFFECT_CATALOG.map(item => [item.id, item])),
  portalEffect: new Map(PORTAL_EFFECT_CATALOG.map(item => [item.id, item])),
  introPose: new Map(INTRO_POSE_CATALOG.map(item => [item.id, item])),
  victoryPose: new Map(VICTORY_POSE_CATALOG.map(item => [item.id, item])),
  profileBanner: new Map(PROFILE_BANNER_CATALOG.map(item => [item.id, item])),
  profileTitle: new Map(PROFILE_TITLE_CATALOG.map(item => [item.id, item]))
});

const OC_UPDATE_CATALOG_BY_KIND = Object.freeze(Object.fromEntries(
  Object.keys(CATALOG_BY_KIND).map(kind => [
    kind,
    new Map(
      Object.values(OC_BOOSTER_UPDATE_UNLOCKABLES)
        .filter(unlockable => unlockable.kind === kind)
        .map(unlockable => [unlockable.id, unlockable])
    )
  ])
));

export const getUniverseUnlockables = (universe) => UNIVERSE_UNLOCKABLES[universe] || null;

export const getUnlockableById = (kind, id) => (
  CATALOG_BY_KIND[kind]?.get(id)
  || OC_UPDATE_CATALOG_BY_KIND[kind]?.get(id)
  || null
);
