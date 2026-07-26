import { BATTLE_ITEMS_BY_UNIVERSE } from './battleItems';
import { LORE_DB } from './lore';

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
  const kartStyle = KART_STYLES[hashValue(universe) % KART_STYLES.length];

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

const CATALOG_BY_KIND = Object.freeze({
  kart: new Map(KART_CATALOG.map(item => [item.id, item])),
  battleMusic: new Map(BATTLE_MUSIC_CATALOG.map(item => [item.id, item])),
  stageMusic: new Map(STAGE_MUSIC_CATALOG.map(item => [item.id, item])),
  fieldSuper: new Map(FIELD_SUPER_CATALOG.map(item => [item.id, item]))
});

export const getUniverseUnlockables = (universe) => UNIVERSE_UNLOCKABLES[universe] || null;

export const getUnlockableById = (kind, id) => CATALOG_BY_KIND[kind]?.get(id) || null;
