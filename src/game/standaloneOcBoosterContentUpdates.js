const UPDATE_WAVE_ID = 'oc-standalone-wave-01';
const UPDATE_VERSION = '1.1';
const UPDATE_DATE = '2026-08-01';

const STAGE_ART = Object.freeze({
  thalassa: '/backgrounds/lore-stages/thalassa-mnemique/melee.webp',
  meridien: '/backgrounds/lore-stages/meridien-creux/melee.webp',
  viridienne: '/backgrounds/lore-stages/viridienne-ultime/melee.webp'
});

const deepFreeze = (value) => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
};

const makeArchiveCard = ({
  id,
  universe,
  name,
  color,
  image,
  mode,
  desc
}) => ({
  id,
  rewardId: id,
  kind: 'archive',
  rarityId: 'rare',
  dropWeight: 1,
  name,
  universe,
  color,
  data: {
    image,
    mode,
    desc
  }
});

const makeUnlockableCard = ({
  id,
  universe,
  kind,
  rarityId,
  name,
  color,
  unlockable
}) => ({
  id,
  rewardId: id,
  kind,
  rarityId,
  dropWeight: rarityId === 'anomaly' ? 2 : 1,
  name,
  universe,
  color,
  data: {
    unlockable: {
      id,
      kind,
      universe,
      name,
      color,
      ...unlockable
    }
  }
});

const makeUpdate = ({
  packId,
  universe,
  summary,
  changelog,
  cards,
  chaseRewardId
}) => ({
  id: UPDATE_WAVE_ID,
  packId,
  bannerId: packId,
  universe,
  waveId: UPDATE_WAVE_ID,
  version: UPDATE_VERSION,
  releasedAt: UPDATE_DATE,
  summary,
  changelog,
  chaseRewardId,
  newCardIds: cards.map(card => card.id),
  cards
});

const thalassaUniverse = 'Thalassa Mnémique';
const thalassaCards = [
  makeArchiveCard({
    id: 'archive:oc_dlc_thalassa_drowned_dawn_crest',
    universe: thalassaUniverse,
    name: {
      fr: 'Crête de l’Aube Noyée',
      en: 'Crest of the Drowned Dawn'
    },
    color: '#64e6dd',
    image: STAGE_ART.thalassa,
    mode: 'Smash',
    desc: {
      fr: 'Stage custom vertical sur l’archive vivante du Léviathan. Les plateformes ouvrent les noms engloutis au lieu de les détruire.',
      en: 'A vertical custom stage across the Leviathan living archive. Its platforms open the drowned names instead of destroying them.'
    }
  }),
  makeUnlockableCard({
    id: 'battle-music:oc_dlc_thalassa_counter_song',
    universe: thalassaUniverse,
    kind: 'battleMusic',
    rarityId: 'rare',
    name: {
      fr: 'Contre-chant des neuf Cloches',
      en: 'Counter-Song of the Nine Bells'
    },
    color: '#64e6dd',
    unlockable: {
      desc: {
        fr: 'Arrangement procédural original qui sépare les neuf cloches de censure afin que chaque témoin conserve sa propre voix.',
        en: 'An original procedural arrangement separating the nine censorship bells so every witness keeps their own voice.'
      },
      musicStage: {
        id: 'custom-battle-music:oc_dlc_thalassa_counter_song',
        name: 'Thalassa Nine Bells Counter-Song',
        universe: thalassaUniverse,
        mode: 'Fighter',
        tags: ['customBattle', 'loreArena', 'nineBells', 'returnedNames']
      },
      state: 'battle'
    }
  }),
  makeUnlockableCard({
    id: 'stage-music:oc_dlc_thalassa_dawn_aurora',
    universe: thalassaUniverse,
    kind: 'stageMusic',
    rarityId: 'rare',
    name: {
      fr: 'Aurore des noms rendus',
      en: 'Aurora of Returned Names'
    },
    color: '#e8bd70',
    unlockable: {
      desc: {
        fr: 'Arrangement procédural original accompagnant l’aube commune qui remonte depuis la Neuvième Fosse.',
        en: 'An original procedural arrangement for the shared dawn rising from the Ninth Trench.'
      },
      musicStage: {
        id: 'custom-stage-music:oc_dlc_thalassa_dawn_aurora',
        name: 'Thalassa Returned Names Aurora',
        universe: thalassaUniverse,
        mode: 'Fighter',
        tags: ['customStage', 'loreArena', 'drownedDawn', 'ninthTrench']
      },
      state: 'grid'
    }
  }),
  makeUnlockableCard({
    id: 'npc-assist:oc_dlc_thalassa_sio_rescue_beacon',
    universe: thalassaUniverse,
    kind: 'npcAssist',
    rarityId: 'epic',
    name: {
      fr: 'Balise de contre-chant de Sio',
      en: 'Sio Counter-Song Beacon'
    },
    color: '#64e6dd',
    unlockable: {
      style: 'scout',
      desc: {
        fr: 'Sio Lume isole une cloche hostile, révèle sa ligne de pression et libère un souffle sûr pour la cellule.',
        en: 'Sio Lume isolates one hostile bell, reveals its pressure lane, and releases a safe breath for the cell.'
      },
      effect: {
        damage: 12,
        guardDamage: 16,
        healRatio: 0.05
      }
    }
  }),
  makeUnlockableCard({
    id: 'field-super:oc_dlc_thalassa_returned_names_tide',
    universe: thalassaUniverse,
    kind: 'fieldSuper',
    rarityId: 'anomaly',
    name: {
      fr: 'Marée des noms rendus',
      en: 'Tide of Returned Names'
    },
    color: '#e8bd70',
    unlockable: {
      sourceUltimateId: 'thalassa_mn_mique_ultimate',
      desc: {
        fr: 'Le Léviathan s’ouvre sans mourir : les identités volées traversent le terrain comme une aurore et repoussent les lignes hostiles.',
        en: 'The Leviathan opens without dying: stolen identities cross the field as an aurora and drive back hostile lines.'
      },
      effect: {
        damage: 36,
        guardDamage: 64,
        knockback: 330,
        healRatio: 0.03
      }
    }
  })
];

const meridienUniverse = 'Méridien Creux';
const meridienCards = [
  makeArchiveCard({
    id: 'archive:oc_dlc_meridien_mortgaged_tomorrow_dial',
    universe: meridienUniverse,
    name: {
      fr: 'Cadran du demain hypothéqué',
      en: 'Dial of Mortgaged Tomorrow'
    },
    color: '#ffb347',
    image: STAGE_ART.meridien,
    mode: 'Smash',
    desc: {
      fr: 'Stage custom sur les aiguilles de l’Horloge centrale. Les futurs saisis redeviennent des routes choisies à mesure que le cadran s’ouvre.',
      en: 'A custom stage across the Central Clock hands. Seized futures become chosen routes again as the dial opens.'
    }
  }),
  makeUnlockableCard({
    id: 'battle-music:oc_dlc_meridien_seconds_strike',
    universe: meridienUniverse,
    kind: 'battleMusic',
    rarityId: 'rare',
    name: {
      fr: 'Grève des secondes impayées',
      en: 'Strike of the Unpaid Seconds'
    },
    color: '#67f0ff',
    unlockable: {
      desc: {
        fr: 'Arrangement procédural original où les secondes cessent de servir les mécanismes de saisie et rendent l’initiative aux combattants.',
        en: 'An original procedural arrangement in which seconds stop serving the seizure machinery and return initiative to the fighters.'
      },
      musicStage: {
        id: 'custom-battle-music:oc_dlc_meridien_seconds_strike',
        name: 'Meridien Unpaid Seconds Strike',
        universe: meridienUniverse,
        mode: 'Fighter',
        tags: ['customBattle', 'loreArena', 'secondsStrike', 'timeDebt']
      },
      state: 'battle'
    }
  }),
  makeUnlockableCard({
    id: 'stage-music:oc_dlc_meridien_palace_ledger',
    universe: meridienUniverse,
    kind: 'stageMusic',
    rarityId: 'rare',
    name: {
      fr: 'Registre du Palais de l’Échéance',
      en: 'Palace of Maturity Ledger'
    },
    color: '#ffb347',
    unlockable: {
      desc: {
        fr: 'Arrangement procédural original qui transforme les échéances imposées en mesure collective lisible.',
        en: 'An original procedural arrangement turning imposed maturities into a readable collective measure.'
      },
      musicStage: {
        id: 'custom-stage-music:oc_dlc_meridien_palace_ledger',
        name: 'Meridien Palace Ledger',
        universe: meridienUniverse,
        mode: 'Fighter',
        tags: ['customStage', 'loreArena', 'maturityPalace', 'reclaimedHours']
      },
      state: 'grid'
    }
  }),
  makeUnlockableCard({
    id: 'kart:oc_dlc_meridien_smuggled_minute_courier',
    universe: meridienUniverse,
    kind: 'kart',
    rarityId: 'common',
    name: {
      fr: 'Coursier de la Minute de contrebande',
      en: 'Smuggled Minute Courier'
    },
    color: '#ffb347',
    unlockable: {
      style: 'needle',
      desc: {
        fr: 'Châssis cosmétique accordé à un intervalle libre qu’aucun registre ne peut détecter ni taxer. Les performances restent gérées par le garage.',
        en: 'A cosmetic chassis tuned to a free interval no ledger can detect or tax. Performance remains governed by garage upgrades.'
      }
    }
  }),
  makeUnlockableCard({
    id: 'field-super:oc_dlc_meridien_tomorrow_returned',
    universe: meridienUniverse,
    kind: 'fieldSuper',
    rarityId: 'anomaly',
    name: {
      fr: 'Demain rendu à ses propriétaires',
      en: 'Tomorrow Returned to Its Owners'
    },
    color: '#67f0ff',
    unlockable: {
      sourceUltimateId: 'm_ridien_creux_ultimate',
      desc: {
        fr: 'L’Horloge restitue les futurs qu’elle avait consommés : les voies alliées reprennent leur temps tandis que les mécanismes hostiles arrivent à échéance.',
        en: 'The Clock returns the futures it consumed: allied routes reclaim their time while hostile machinery reaches maturity.'
      },
      effect: {
        damage: 37,
        guardDamage: 68,
        knockback: 340,
        healRatio: 0.02
      }
    }
  })
];

const viridienneUniverse = 'Viridienne Ultime';
const viridienneCards = [
  makeArchiveCard({
    id: 'archive:oc_dlc_viridienne_root_sun_heart',
    universe: viridienneUniverse,
    name: {
      fr: 'Cœur du Soleil-Racine',
      en: 'Heart of the Root-Sun'
    },
    color: '#ffe784',
    image: STAGE_ART.viridienne,
    mode: 'Smash',
    desc: {
      fr: 'Stage custom dans la couronne du Soleil-Racine. Chaque graine-planète libérée fait pousser une route différente à travers l’arène.',
      en: 'A custom stage inside the Root-Sun corona. Every freed planet-seed grows a different route through the arena.'
    }
  }),
  makeUnlockableCard({
    id: 'battle-music:oc_dlc_viridienne_wild_constellations',
    universe: viridienneUniverse,
    kind: 'battleMusic',
    rarityId: 'rare',
    name: {
      fr: 'Constellations sauvages',
      en: 'Wild Constellations'
    },
    color: '#79d989',
    unlockable: {
      desc: {
        fr: 'Arrangement procédural original où chaque graine stellaire choisit son rythme sans être ramenée à une prophétie unique.',
        en: 'An original procedural arrangement in which every star-seed chooses its rhythm without being reduced to one prophecy.'
      },
      musicStage: {
        id: 'custom-battle-music:oc_dlc_viridienne_wild_constellations',
        name: 'Viridienne Wild Constellations',
        universe: viridienneUniverse,
        mode: 'Fighter',
        tags: ['customBattle', 'loreArena', 'wildConstellations', 'starSeeds']
      },
      state: 'battle'
    }
  }),
  makeUnlockableCard({
    id: 'stage-music:oc_dlc_viridienne_federated_canopy',
    universe: viridienneUniverse,
    kind: 'stageMusic',
    rarityId: 'rare',
    name: {
      fr: 'Canopée des racines fédérées',
      en: 'Canopy of Federated Roots'
    },
    color: '#ffe784',
    unlockable: {
      desc: {
        fr: 'Arrangement procédural original qui distribue la lumière entre des racines distinctes sans rompre leur langage commun.',
        en: 'An original procedural arrangement distributing light among distinct roots without breaking their shared language.'
      },
      musicStage: {
        id: 'custom-stage-music:oc_dlc_viridienne_federated_canopy',
        name: 'Viridienne Federated Root Canopy',
        universe: viridienneUniverse,
        mode: 'Fighter',
        tags: ['customStage', 'loreArena', 'orbitCanopy', 'federatedRoots']
      },
      state: 'grid'
    }
  }),
  makeUnlockableCard({
    id: 'npc-assist:oc_dlc_viridienne_mousse_noeud_relay',
    universe: viridienneUniverse,
    kind: 'npcAssist',
    rarityId: 'epic',
    name: {
      fr: 'Relais de consensus de Mousse-Nœud',
      en: 'Mousse-Nœud Consensus Relay'
    },
    color: '#79d989',
    unlockable: {
      style: 'medic',
      desc: {
        fr: 'Mousse-Nœud redistribue la lumière entre les signatures proches : aucune racine ne soigne la cellule en renonçant à son choix.',
        en: 'Mousse-Nœud redistributes light among nearby signatures: no root heals the cell by surrendering its choice.'
      },
      effect: {
        damage: 10,
        guardDamage: 12,
        healRatio: 0.08
      }
    }
  }),
  makeUnlockableCard({
    id: 'field-super:oc_dlc_viridienne_each_seed_chooses_light',
    universe: viridienneUniverse,
    kind: 'fieldSuper',
    rarityId: 'anomaly',
    name: {
      fr: 'Chaque graine choisit sa lumière',
      en: 'Each Seed Chooses Its Light'
    },
    color: '#ffe784',
    unlockable: {
      sourceUltimateId: 'viridienne_ultime_ultimate',
      desc: {
        fr: 'Le Soleil-Racine devient une étoile parmi les autres et libère plusieurs spectres de croissance qui traversent tout le terrain.',
        en: 'The Root-Sun becomes one star among many and releases several spectra of growth across the whole field.'
      },
      effect: {
        damage: 35,
        guardDamage: 60,
        knockback: 320,
        healRatio: 0.04
      }
    }
  })
];

export const STANDALONE_OC_BOOSTER_CONTENT_UPDATES = deepFreeze({
  'universe:Thalassa Mnémique': makeUpdate({
    packId: 'universe:Thalassa Mnémique',
    universe: thalassaUniverse,
    summary: {
      fr: 'Cinq nouvelles cartes exclusives rendent les noms engloutis, le contre-chant et l’aube commune jouables en combat custom.',
      en: 'Five new exclusive cards make the drowned names, counter-song, and shared dawn playable in custom battles.'
    },
    changelog: {
      fr: 'Ajout de la Crête jouable, de deux arrangements custom, de la balise de Sio et de la Marée des noms rendus.',
      en: 'Added the playable Crest, two custom arrangements, Sio beacon, and the Tide of Returned Names.'
    },
    cards: thalassaCards,
    chaseRewardId: 'field-super:oc_dlc_thalassa_returned_names_tide'
  }),
  'universe:Méridien Creux': makeUpdate({
    packId: 'universe:Méridien Creux',
    universe: meridienUniverse,
    summary: {
      fr: 'Cinq nouvelles cartes exclusives restituent les secondes impayées et les futurs saisis à celles et ceux qui doivent les choisir.',
      en: 'Five new exclusive cards return unpaid seconds and seized futures to the people who must choose them.'
    },
    changelog: {
      fr: 'Ajout du Cadran jouable, de deux arrangements custom, d’un coursier temporel et du Super Demain rendu.',
      en: 'Added the playable Dial, two custom arrangements, a time courier, and the Tomorrow Returned Field Super.'
    },
    cards: meridienCards,
    chaseRewardId: 'field-super:oc_dlc_meridien_tomorrow_returned'
  }),
  'universe:Viridienne Ultime': makeUpdate({
    packId: 'universe:Viridienne Ultime',
    universe: viridienneUniverse,
    summary: {
      fr: 'Cinq nouvelles cartes exclusives donnent à chaque graine, racine et constellation le droit de choisir sa propre lumière.',
      en: 'Five new exclusive cards give every seed, root, and constellation the right to choose its own light.'
    },
    changelog: {
      fr: 'Ajout du Cœur jouable, de deux arrangements custom, du relais de Mousse-Nœud et du Super des lumières choisies.',
      en: 'Added the playable Heart, two custom arrangements, Mousse-Nœud relay, and the chosen-lights Field Super.'
    },
    cards: viridienneCards,
    chaseRewardId: 'field-super:oc_dlc_viridienne_each_seed_chooses_light'
  })
});

export const STANDALONE_OC_BOOSTER_UPDATE_UNLOCKABLES = deepFreeze(Object.fromEntries(
  Object.values(STANDALONE_OC_BOOSTER_CONTENT_UPDATES)
    .flatMap(update => update.cards)
    .filter(card => card.data.unlockable)
    .map(card => [card.id, card.data.unlockable])
));

export const getStandaloneOcBoosterContentUpdate = (packId) => (
  STANDALONE_OC_BOOSTER_CONTENT_UPDATES[packId] || null
);
