// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcResidentEvil from '../../DLC/ResidentEvil/data/battleItems.js';
import * as dlcHalo from '../../DLC/Halo/data/battleItems.js';
import * as dlcSilentHill from '../../DLC/SilentHill/data/battleItems.js';
import * as dlcDinoCrisis from '../../DLC/DinoCrisis/data/battleItems.js';
import * as dlcStargate from '../../DLC/Stargate/data/battleItems.js';
import * as dlcHalfLife from '../../DLC/HalfLife/data/battleItems.js';
import * as dlcPortal from '../../DLC/Portal/data/battleItems.js';
import * as dlcTheMatrix from '../../DLC/TheMatrix/data/battleItems.js';
import * as dlcBuckethead from '../../DLC/Buckethead/data/battleItems.js';
import * as dlcSystemOfADown from '../../DLC/SystemOfADown/data/battleItems.js';
import * as dlcKaamelott from '../../DLC/Kaamelott/data/battleItems.js';
import * as dlcBreakingBad from '../../DLC/BreakingBad/data/battleItems.js';
import * as dlcBuffyTheVampireSlayer from '../../DLC/BuffyTheVampireSlayer/data/battleItems.js';
import * as dlcCharmed from '../../DLC/Charmed/data/battleItems.js';

import { EQUIP_ITEMS_DB, EVENT_ITEMS_DB, HEROES_DB } from './heroes';
import { LORE_DB } from './lore';
import { FEATURED_BATTLE_ITEM_OVERRIDES } from './featuredUniversePacks';
import { ORIGINAL_UNIVERSE_DEFINITIONS } from './originalUniverseWave.js';
import { findBattlePickupSource, normalizeBattlePickupDefinition, resolveBattlePickupSemantics, withBattlePickupEffectNotice } from './battlePickupSemantics.js';

const slugify = (value) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '_')
  .replace(/^_+|_+$/g, '');

const paletteByMedia = {
  game: '#39c5bb',
  movie: '#ff8c00',
  series: '#9b59b6',
  manga: '#ff4fd8',
  music: '#ffeb3b'
};

const defaultColorFor = (universe) => paletteByMedia[LORE_DB[universe]?.mediaType] || '#39c5bb';

const mediaItemFlavor = {
  game: {
    offense: { fr: 'module offensif extrait des regles jouables du monde', en: 'offensive module extracted from the playable rules of the world' },
    defense: { fr: 'cache de survie convertie en protection Nexus', en: 'survival cache converted into Nexus protection' },
    tempo: { fr: 'routine de tempo qui recharge les actions du porteur', en: 'tempo routine that recharges the carrier actions' }
  },
  movie: {
    offense: { fr: 'plan d impact cinematographique condense en artefact', en: 'cinematic impact beat condensed into an artifact' },
    defense: { fr: 'accessoire de scene transforme en garde-fou narratif', en: 'screen prop turned into a narrative safeguard' },
    tempo: { fr: 'coupe de montage qui accelere une action decisive', en: 'editing cut that accelerates a decisive action' }
  },
  series: {
    offense: { fr: 'ressort d episode transforme en pression de combat', en: 'episode beat turned into combat pressure' },
    defense: { fr: 'ressource recurrente qui garde l escouade en vie', en: 'recurring resource that keeps the squad alive' },
    tempo: { fr: 'cliffhanger stabilise qui relance le tour suivant', en: 'stabilized cliffhanger that restarts the next turn' }
  },
  manga: {
    offense: { fr: 'technique d arc compressee en frappe ramassable', en: 'arc technique compressed into a pickup strike' },
    defense: { fr: 'talisman d arc qui retient la transformation', en: 'arc talisman that restrains transformation' },
    tempo: { fr: 'signal de power-up qui pousse le rythme du duel', en: 'power-up signal that pushes duel tempo' }
  },
  music: {
    offense: { fr: 'riff de resonance converti en onde offensive', en: 'resonance riff converted into an offensive wave' },
    defense: { fr: 'boucle harmonique qui amortit la pression ennemie', en: 'harmonic loop that absorbs enemy pressure' },
    tempo: { fr: 'pulse de scene qui synchronise le heros actif', en: 'stage pulse that synchronizes the active hero' }
  }
};

const BATTLE_ITEM_OVERRIDES = {
  'Resident Evil': dlcResidentEvil.createBattleItemOverrides(),
  Halo: dlcHalo.createBattleItemOverrides(),
  'Silent Hill': dlcSilentHill.createBattleItemOverrides(),
  'Dino Crisis': dlcDinoCrisis.createBattleItemOverrides(),
  Stargate: dlcStargate.createBattleItemOverrides(),
  'Half-Life': dlcHalfLife.createBattleItemOverrides(),
  Portal: dlcPortal.createBattleItemOverrides(),
  'The Matrix': dlcTheMatrix.createBattleItemOverrides(),
  Buckethead: dlcBuckethead.createBattleItemOverrides(),
  'System of a Down': dlcSystemOfADown.createBattleItemOverrides(),
  Kaamelott: dlcKaamelott.createBattleItemOverrides(),
  'Breaking Bad': dlcBreakingBad.createBattleItemOverrides(),
  'Buffy the Vampire Slayer': dlcBuffyTheVampireSlayer.createBattleItemOverrides(),
  Charmed: dlcCharmed.createBattleItemOverrides()
};

Object.assign(BATTLE_ITEM_OVERRIDES, FEATURED_BATTLE_ITEM_OVERRIDES);

const makeLoreBackedItem = (universe, templateRole, color, loreItem = null) => {
  const slug = slugify(universe);
  const lore = LORE_DB[universe];
  const mediaType = lore?.mediaType || 'game';
  const flavor = mediaItemFlavor[mediaType] || mediaItemFlavor.game;
  const title = lore?.title || { fr: universe, en: universe };
  const templates = {
    offense: {
      id: `${slug}_field_relic`,
      role: 'offense',
      name: { fr: `Relique d impact ${title.fr}`, en: `${title.en} Impact Relic` },
      desc: {
        fr: `${title.fr}: ${flavor.offense.fr}. Le Nexus l autorise en melee comme declencheur lisible, avec une signature de Trame identifiable.`,
        en: `${title.en}: ${flavor.offense.en}. The Nexus allows it in melee as a readable trigger, not an abstract bonus.`
      },
      effect: { damage: 26, charge: 8 }
    },
    defense: {
      id: `${slug}_survival_cache`,
      role: 'defense',
      name: { fr: `Cache d ancrage ${title.fr}`, en: `${title.en} Anchor Cache` },
      desc: {
        fr: `${title.fr}: ${flavor.defense.fr}. En tactique, A.R.C.A. peut la poser comme zone de repli coherente avec le lore local.`,
        en: `${title.en}: ${flavor.defense.en}. In tactics, A.R.C.A. can place it as a fallback zone coherent with local lore.`
      },
      effect: { heal: 42, shield: 12 }
    },
    tempo: {
      id: `${slug}_tempo_core`,
      role: 'tempo',
      name: { fr: `Noyau de cadence ${title.fr}`, en: `${title.en} Cadence Core` },
      desc: {
        fr: `${title.fr}: ${flavor.tempo.fr}. Il sert a garder le rythme de la Trame sans transformer le combat en effet hors-sujet.`,
        en: `${title.en}: ${flavor.tempo.en}. It keeps the Thread rhythm without turning combat into an off-theme effect.`
      },
      effect: { charge: 28, heal: 18 }
    }
  };
  const template = templates[templateRole];
  const loreName = loreItem?.name;
  const loreDesc = loreItem?.desc;
  const description = loreName ? (loreDesc || {
    fr: `${loreName.fr || loreName.en} est un objet physique issu de ${title.fr}; son effet de combat conserve son usage reconnaissable.`,
    en: `${loreName.en || loreName.fr} is a physical ${title.en} prop whose combat effect preserves its recognizable use.`
  }) : template.desc;
  const semantics = resolveBattlePickupSemantics({ ...(loreName ? loreItem : template), universe });
  return {
    ...template,
    ...(loreName ? {
      name: loreName,
      desc: loreDesc || {
        fr: `${loreName.fr || loreName.en} est un objet physique issu de ${title.fr}; son effet de combat conserve son usage et sa silhouette reconnaissables.`,
        en: `${loreName.en || loreName.fr} is a physical ${title.en} prop whose combat effect preserves its recognizable use and silhouette.`
      },
      sourceItemId: loreItem.id,
      icon: loreItem.icon,
      iconPrompt: loreItem.iconPrompt,
      referenceUrl: loreItem.referenceUrl,
      visualAnchor: loreItem.visualAnchor,
      audit: loreItem.audit
    } : {}),
    ...semantics,
    desc: withBattlePickupEffectNotice(description, semantics.effectNotice),
    universe,
    tier: 'pickup',
    color,
    melee: {
      fr: 'Ramassable en melee: effet immediat sur le porteur et la ligne ennemie proche.',
      en: 'Melee pickup: immediate effect on the carrier and nearby enemy line.'
    },
    rpg: {
      fr: 'Commande RPG: consomme l ATB du heros actif pour declencher une relique de Trame.',
      en: 'RPG command: consumes the active hero ATB to trigger a Thread relic.'
    },
    tactics: {
      fr: 'En tactique: devient une case de ressource a poser ou a capturer.',
      en: 'In tactics: becomes a resource tile to place or capture.'
    }
  };
};

const makeItemsForUniverse = (universe) => {
  const color = defaultColorFor(universe);
  const slug = slugify(universe);
  const override = BATTLE_ITEM_OVERRIDES[universe];
  const loreItems = EQUIP_ITEMS_DB.filter(item => item.universe === universe);
  const eventItem = EVENT_ITEMS_DB[universe];
  const pickups = override
    ? override.pickups.map((definition, index) => {
      const authored = normalizeBattlePickupDefinition(definition);
      const loreItem = findBattlePickupSource(authored, loreItems);
      const semantics = resolveBattlePickupSemantics({ ...loreItem, ...authored, universe });
      return {
        id: `${slug}_pickup_${index + 1}`,
        universe,
        tier: 'pickup',
        ...semantics,
        name: authored.name,
        desc: withBattlePickupEffectNotice(authored.desc, semantics.effectNotice),
        melee: { fr: 'Ramassable en melee: declenche son effet des que le heros le securise.', en: 'Melee pickup: triggers as soon as the hero secures it.' },
        rpg: { fr: 'Commande RPG: utilise la jauge ATB du heros actif pour convertir cet artefact en action de soutien.', en: 'RPG command: spends the active hero ATB to convert this artifact into a support action.' },
        tactics: { fr: 'En tactique: peut devenir une case bonus ou une ressource posee sur la carte.', en: 'In tactics: can become a bonus tile or placed map resource.' },
        color,
        ...(loreItem ? {
          sourceItemId: loreItem.id,
          icon: loreItem.icon,
          iconPrompt: loreItem.iconPrompt,
          referenceUrl: loreItem.referenceUrl,
          visualAnchor: loreItem.visualAnchor,
          audit: loreItem.audit
        } : {})
      };
    })
    : ['offense', 'defense', 'tempo'].map((templateRole, index) => makeLoreBackedItem(universe, templateRole, color, loreItems[index]));

  const summon = {
    id: `${slug}_summon`,
    universe,
    tier: 'summon',
    role: 'summon',
    name: {
      fr: override?.summon?.[0] || `Renfort de ${universe}`,
      en: override?.summon?.[1] || `${universe} Assist`
    },
    desc: {
      fr: override?.summon?.[2] || `Invocation PNJ temporaire: une signature alliee de ${universe} intervient sans rejoindre l escouade permanente.`,
      en: override?.summon?.[2] || `Temporary NPC assist: an allied ${universe} signature intervenes without joining the permanent squad.`
    },
    melee: { fr: 'En melee: PNJ de soutien pendant une courte fenetre, degats directs au front.', en: 'In melee: short assist window with direct frontline damage.' },
    rpg: { fr: 'Commande RPG: depense une ATB pleine pour appeler un renfort temporaire entre deux tours ennemis.', en: 'RPG command: spends a full ATB to call a temporary assist between enemy turns.' },
    tactics: { fr: 'En tactique: pose un marqueur allie qui frappe la case ennemie prioritaire.', en: 'In tactics: places an allied marker that strikes the priority enemy tile.' },
    effect: { summonDamage: 76, charge: 12 },
    color,
    ...(eventItem?.summonIcon ? {
      contentPackId: eventItem.contentPackId,
      contentOrigin: eventItem.contentOrigin,
      originalContent: eventItem.originalContent,
      originalContentNotice: eventItem.originalContentNotice,
      icon: eventItem.summonIcon,
      iconPrompt: eventItem.summonIconPrompt,
      visualAnchor: eventItem.visualAnchor,
      audit: eventItem.audit
    } : {})
  };

  const ultimate = {
    id: `${slug}_ultimate`,
    universe,
    tier: 'ultimate',
    role: 'ultimate',
    name: {
      fr: override?.ultimate?.[0] || eventItem?.name?.fr || `Cataclysme ${universe}`,
      en: override?.ultimate?.[1] || eventItem?.name?.en || `${universe} Ultimate Breach`
    },
    desc: {
      fr: override?.ultimate?.[2] || eventItem?.desc?.fr || `Attaque ultime de terrain: A.R.C.A. ouvre une breche massive de ${universe} et frappe tout l ecran.`,
      en: override?.ultimate?.[2] || eventItem?.desc?.en || `Stage ultimate: A.R.C.A. opens a massive ${universe} breach and strikes the whole screen.`
    },
    melee: { fr: 'En melee: attaque spectaculaire plein ecran, rare et decisive.', en: 'In melee: rare, decisive full-screen attack.' },
    rpg: { fr: 'Commande RPG: limite break d artefact, declenchee par le heros actif quand son ATB est prete.', en: 'RPG command: artifact limit break, triggered by the active hero when ATB is ready.' },
    tactics: { fr: 'En tactique: equivalent a une carte operationnelle a usage unique sur plusieurs cases.', en: 'In tactics: acts like a one-use operational card across several tiles.' },
    effect: { ultimateDamage: 145, charge: 18 },
    color,
    sourceItemId: eventItem?.id,
    icon: eventItem?.icon,
    iconPrompt: eventItem?.iconPrompt,
    referenceUrl: eventItem?.referenceUrl,
    visualAnchor: eventItem?.visualAnchor,
    audit: eventItem?.audit
  };

  return [...pickups, summon, ultimate];
};

const universeNames = Array.from(new Set([
  ...Object.keys(LORE_DB),
  ...HEROES_DB.map(hero => hero.universe)
])).filter(Boolean).sort((a, b) => a.localeCompare(b));

const originalBattleItemsByUniverse = Object.freeze(Object.fromEntries(
  ORIGINAL_UNIVERSE_DEFINITIONS.map(world => [
    world.universe,
    Object.freeze(world.battleItems.map(item => Object.freeze({
      ...item,
      icon: world.audiovisual.itemIcons[item.id],
      sourceType: 'original',
      originalContent: true,
      contentOrigin: 'oc'
    })))
  ])
));

export const BATTLE_ITEMS_BY_UNIVERSE = Object.fromEntries(
  universeNames.map(universe => [
    universe,
    originalBattleItemsByUniverse[universe] || makeItemsForUniverse(universe)
  ])
);

export const BATTLE_ITEM_CATALOG = Object.values(BATTLE_ITEMS_BY_UNIVERSE).flat();

export const getBattleItemsForUniverse = (universe) => (
  BATTLE_ITEMS_BY_UNIVERSE[universe]
  || originalBattleItemsByUniverse[universe]
  || makeItemsForUniverse(universe)
);

export const getBattleItemPoolForStage = (stage) => {
  const universes = Array.from(new Set([
    ...(stage?.sourceUniverses || []),
    stage?.universe
  ].filter(Boolean)));
  // Narrative-only props remain searchable in the catalogue, not consumable in combat.
  return universes.flatMap(universe => getBattleItemsForUniverse(universe)).filter(item => (
    ['damage', 'summonDamage', 'ultimateDamage', 'heal', 'shield', 'charge']
      .some(key => Number(item.effect?.[key]) > 0)
  ));
};
