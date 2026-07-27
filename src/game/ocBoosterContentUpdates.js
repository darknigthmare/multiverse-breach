const OC_UNIVERSE = 'Nexus de Convergence';
const UPDATE_WAVE_ID = 'oc-wave-01';
const UPDATE_VERSION = '1.1';
const UPDATE_DATE = '2026-07-27';

const CHAPTER_BACKDROPS = Object.freeze({
  keepers: '/images/campaign-oc/chapter-01-atrium-v1.png',
  divergent: '/images/campaign-oc/chapter-02-origin-forge-v1.png',
  ledger: '/images/campaign-oc/chapter-03-black-ledger-v1.png',
  exodus: '/images/campaign-oc/chapter-04-broken-portal-yard-v1.png',
  lastMargin: '/images/campaign-oc/chapter-05-white-threshold-v1.png'
});

const deepFreeze = (value) => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
};

const makeArchiveCard = ({
  id,
  rarityId,
  name,
  color,
  image,
  mode,
  desc
}) => ({
  id,
  rewardId: id,
  kind: 'archive',
  rarityId,
  dropWeight: rarityId === 'anomaly' ? 2 : 1,
  name,
  universe: OC_UNIVERSE,
  color,
  data: {
    image,
    mode,
    desc
  }
});

const makeHudCard = ({
  id,
  rarityId,
  name,
  color,
  image,
  mode,
  desc
}) => ({
  id,
  rewardId: id,
  kind: 'hud',
  rarityId,
  dropWeight: rarityId === 'anomaly' ? 2 : 1,
  name,
  universe: OC_UNIVERSE,
  color,
  data: {
    image,
    mode,
    desc
  }
});

const makeUnlockableCard = ({
  id,
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
  universe: OC_UNIVERSE,
  color,
  data: {
    unlockable: {
      id,
      kind,
      universe: OC_UNIVERSE,
      color,
      name,
      ...unlockable
    }
  }
});

const makeUpdate = ({
  packId,
  summary,
  changelog,
  cards
}) => ({
  id: UPDATE_WAVE_ID,
  packId,
  waveId: UPDATE_WAVE_ID,
  version: UPDATE_VERSION,
  releasedAt: UPDATE_DATE,
  summary,
  changelog,
  newCardIds: cards.map(card => card.id),
  cards
});

const keepersCards = [
  makeArchiveCard({
    id: 'archive:oc_static_archives_inner_ring',
    rarityId: 'rare',
    name: {
      fr: 'Anneau intérieur des Archives statiques',
      en: 'Static Archives Inner Ring'
    },
    color: '#39c5bb',
    image: CHAPTER_BACKDROPS.keepers,
    mode: 'Tactics',
    desc: {
      fr: 'Stage custom où trois preuves contradictoires doivent rester lisibles au même tour pour résister au Juge des Trames.',
      en: 'A custom stage where three contradictory pieces of evidence must remain readable in the same turn to withstand the Thread Judge.'
    }
  }),
  makeHudCard({
    id: 'hud:oc_lock_of_name',
    rarityId: 'anomaly',
    name: {
      fr: 'Interface du Verrou du Nom',
      en: 'Lock of Name Interface'
    },
    color: '#39c5bb',
    image: CHAPTER_BACKDROPS.keepers,
    mode: 'RPG',
    desc: {
      fr: 'HUD A.R.C.A. qui suit les balises nominales et garde chaque signature de la cellule ZÉRO identifiable.',
      en: 'An A.R.C.A. HUD that tracks name beacons and keeps every Cell ZERO signature identifiable.'
    }
  }),
  makeUnlockableCard({
    id: 'intro-pose:oc_stay_in_my_voice',
    kind: 'introPose',
    rarityId: 'rare',
    name: {
      fr: 'Reste dans ma voix',
      en: 'Stay in My Voice'
    },
    color: '#7df9ff',
    unlockable: {
      style: 'ready',
      desc: {
        fr: 'L agent suit le signal cyan de Mirelle et stabilise son nom avant le début du combat custom.',
        en: 'The agent follows Mirelle cyan signal and stabilizes their name before the custom battle begins.'
      },
      animation: {
        key: 'intro-ready',
        durationMs: 1500
      }
    }
  }),
  makeUnlockableCard({
    id: 'profile-banner:oc_cell_zero_named_roster',
    kind: 'profileBanner',
    rarityId: 'rare',
    name: {
      fr: 'Registre nommé de la cellule ZÉRO',
      en: 'Cell ZERO Named Roster'
    },
    color: '#39c5bb',
    unlockable: {
      style: 'grid',
      desc: {
        fr: 'Bannière du Dossier d Ancre qui conserve les signatures reconnues lors du premier Verrou.',
        en: 'An Anchor Record banner preserving the signatures recognized during the first Lock.'
      },
      visual: {
        pattern: 'linear-grid',
        accent: '#39c5bb'
      }
    }
  }),
  makeUnlockableCard({
    id: 'profile-title:oc_keeper_of_names',
    kind: 'profileTitle',
    rarityId: 'epic',
    name: {
      fr: 'Gardien des Noms',
      en: 'Keeper of Names'
    },
    color: '#ffcf5a',
    unlockable: {
      desc: {
        fr: 'Titre public accordé à une Ancre qui protège une identité autant que sa matière.',
        en: 'A public title awarded to an Anchor who protects an identity as carefully as its physical form.'
      }
    }
  })
];

const divergentCards = [
  makeArchiveCard({
    id: 'archive:oc_origin_shard_foundry',
    rarityId: 'rare',
    name: {
      fr: 'Fonderie des Éclats d Origine',
      en: 'Origin Shard Foundry'
    },
    color: '#7df9ff',
    image: CHAPTER_BACKDROPS.divergent,
    mode: 'Smash',
    desc: {
      fr: 'Stage custom où les matrices copient la dernière doctrine et où les cristaux révèlent la faiblesse des doubles parfaits.',
      en: 'A custom stage where matrices copy the latest doctrine and crystals reveal the weakness of perfect doubles.'
    }
  }),
  makeUnlockableCard({
    id: 'battle-music:oc_divergent_shards',
    kind: 'battleMusic',
    rarityId: 'rare',
    name: {
      fr: 'Éclats divergents',
      en: 'Divergent Shards'
    },
    color: '#ff5b6e',
    unlockable: {
      desc: {
        fr: 'Arrangement procédural original pour affronter les versions possibles sans leur céder le droit de remplacer les vies vécues.',
        en: 'An original procedural arrangement for facing possible versions without granting them the right to replace lived lives.'
      },
      musicStage: {
        id: 'custom-battle-music:oc_divergent_shards',
        name: 'Divergent Shards Custom Battle',
        universe: OC_UNIVERSE,
        mode: 'Fighter',
        tags: ['customBattle', 'loreArena', 'originShards']
      },
      state: 'battle'
    }
  }),
  makeUnlockableCard({
    id: 'stage-music:oc_possible_lives_foundry',
    kind: 'stageMusic',
    rarityId: 'rare',
    name: {
      fr: 'Fonderie des vies possibles',
      en: 'Foundry of Possible Lives'
    },
    color: '#7df9ff',
    unlockable: {
      desc: {
        fr: 'Arrangement procédural original qui superpose les routes calculées par Nova aux fractures assumées par Marrow.',
        en: 'An original procedural arrangement layering Nova calculated routes over the fractures Marrow accepts.'
      },
      musicStage: {
        id: 'custom-stage-music:oc_possible_lives_foundry',
        name: 'Possible Lives Foundry Custom Stage',
        universe: OC_UNIVERSE,
        mode: 'Fighter',
        tags: ['customStage', 'loreArena', 'originForge']
      },
      state: 'grid'
    }
  }),
  makeUnlockableCard({
    id: 'ko-effect:oc_crystal_scar_break',
    kind: 'koEffect',
    rarityId: 'rare',
    name: {
      fr: 'Brisure de cicatrice cristalline',
      en: 'Crystal Scar Break'
    },
    color: '#ff5b6e',
    unlockable: {
      style: 'shards',
      desc: {
        fr: 'Le cristal qui remplace une cicatrice imitée éclate en fragments de Trame lors du K.-O.',
        en: 'The crystal replacing an imitated scar bursts into Thread shards on K.O.'
      },
      visual: {
        pattern: 'shards',
        durationMs: 900,
        intensity: 0.8
      }
    }
  }),
  makeUnlockableCard({
    id: 'field-super:oc_incompatible_versions_verdict',
    kind: 'fieldSuper',
    rarityId: 'anomaly',
    name: {
      fr: 'Verdict des versions incompatibles',
      en: 'Incompatible Versions Verdict'
    },
    color: '#ff5b6e',
    unlockable: {
      sourceUltimateId: 'nexus_de_convergence_ultimate',
      desc: {
        fr: 'Nova rend les routes lisibles tandis que Marrow force les versions incompatibles à déclarer laquelle choisit de continuer.',
        en: 'Nova makes the routes readable while Marrow forces incompatible versions to declare which one chooses to continue.'
      },
      effect: {
        damage: 38,
        guardDamage: 70,
        knockback: 360,
        healRatio: 0.02
      }
    }
  })
];

const ledgerCards = [
  makeArchiveCard({
    id: 'archive:oc_black_ledger_sublevel',
    rarityId: 'rare',
    name: {
      fr: 'Sous-registre interdit',
      en: 'Restricted Sub-Ledger'
    },
    color: '#d9b86b',
    image: CHAPTER_BACKDROPS.ledger,
    mode: 'RPG',
    desc: {
      fr: 'Stage custom où chaque ligne restaurée révèle une tombe et augmente l instabilité du moteur de Convergence.',
      en: 'A custom stage where every restored line reveals a grave and increases the Convergence Engine instability.'
    }
  }),
  makeHudCard({
    id: 'hud:oc_black_ledger_restored_lines',
    rarityId: 'anomaly',
    name: {
      fr: 'Lignes restaurées du Registre noir',
      en: 'Black Ledger Restored Lines'
    },
    color: '#d9b86b',
    image: CHAPTER_BACKDROPS.ledger,
    mode: 'Tactics',
    desc: {
      fr: 'HUD qui rend simultanément lisibles les preuves extraites, les absents retrouvés et la dette énergétique d A.R.C.A.',
      en: 'A HUD that simultaneously exposes extracted evidence, recovered absentees, and A.R.C.A. energy debt.'
    }
  }),
  makeUnlockableCard({
    id: 'stage-music:oc_unmarked_graves',
    kind: 'stageMusic',
    rarityId: 'rare',
    name: {
      fr: 'Tombes sans inscription',
      en: 'Unmarked Graves'
    },
    color: '#d9b86b',
    unlockable: {
      desc: {
        fr: 'Arrangement procédural original pour les lignes vides dont le coût prouve qu elles n ont jamais été de simples erreurs.',
        en: 'An original procedural arrangement for blank lines whose cost proves they were never simple clerical errors.'
      },
      musicStage: {
        id: 'custom-stage-music:oc_unmarked_graves',
        name: 'Unmarked Graves Custom Stage',
        universe: OC_UNIVERSE,
        mode: 'Fighter',
        tags: ['customStage', 'loreArena', 'blackLedger']
      },
      state: 'grid'
    }
  }),
  makeUnlockableCard({
    id: 'npc-assist:oc_living_archive_drone',
    kind: 'npcAssist',
    rarityId: 'epic',
    name: {
      fr: 'Drone-archive vivant',
      en: 'Living Archive Drone'
    },
    color: '#39c5bb',
    unlockable: {
      style: 'medic',
      desc: {
        fr: 'Le drone de Loom restitue les voix clandestinement sauvées et retisse brièvement la signature de la cellule.',
        en: 'Loom drone restores the voices she secretly saved and briefly reweaves the cell signature.'
      },
      effect: {
        damage: 10,
        guardDamage: 12,
        healRatio: 0.08
      }
    }
  }),
  makeUnlockableCard({
    id: 'profile-title:oc_cartographer_of_costs',
    kind: 'profileTitle',
    rarityId: 'epic',
    name: {
      fr: 'Cartographe des coûts',
      en: 'Cartographer of Costs'
    },
    color: '#d9b86b',
    unlockable: {
      desc: {
        fr: 'Titre public inspiré de Sable, pour qui aucune route sûre ne doit cacher son prix.',
        en: 'A public title inspired by Sable, for whom no safe route may hide its cost.'
      }
    }
  })
];

const exodusCards = [
  makeArchiveCard({
    id: 'archive:oc_broken_portal_yard_update',
    rarityId: 'rare',
    name: {
      fr: 'Cour des portails brisés',
      en: 'Broken Portal Yard'
    },
    color: '#ff8c00',
    image: CHAPTER_BACKDROPS.exodus,
    mode: 'Tactics',
    desc: {
      fr: 'Stage custom d évacuation où Loom révèle les détails absents pendant que Bastion maintient la seule route causale.',
      en: 'An evacuation custom stage where Loom reveals missing details while Bastion holds the only causal route.'
    }
  }),
  makeUnlockableCard({
    id: 'kart:oc_causal_evacuation_chassis',
    kind: 'kart',
    rarityId: 'common',
    name: {
      fr: 'Châssis d évacuation causale',
      en: 'Causal Evacuation Chassis'
    },
    color: '#ff8c00',
    unlockable: {
      style: 'pulse',
      desc: {
        fr: 'Châssis cosmétique A.R.C.A. accordé à une balise de retour réelle; ses performances restent gérées par le garage.',
        en: 'An A.R.C.A. cosmetic chassis tuned to a real return beacon; its performance remains governed by garage upgrades.'
      }
    }
  }),
  makeUnlockableCard({
    id: 'battle-music:oc_only_causal_route',
    kind: 'battleMusic',
    rarityId: 'rare',
    name: {
      fr: 'La seule route causale',
      en: 'The Only Causal Route'
    },
    color: '#ff8c00',
    unlockable: {
      desc: {
        fr: 'Arrangement procédural original pour tenir une évacuation sans céder aux refuges parfaits écrits par le Sans-Auteur.',
        en: 'An original procedural arrangement for holding an evacuation without yielding to the perfect shelters written by the Authorless.'
      },
      musicStage: {
        id: 'custom-battle-music:oc_only_causal_route',
        name: 'Only Causal Route Custom Battle',
        universe: OC_UNIVERSE,
        mode: 'Fighter',
        tags: ['customBattle', 'loreArena', 'causalRoute']
      },
      state: 'battle'
    }
  }),
  makeUnlockableCard({
    id: 'npc-assist:oc_return_thread_drone',
    kind: 'npcAssist',
    rarityId: 'epic',
    name: {
      fr: 'Drone du fil de retour',
      en: 'Return Thread Drone'
    },
    color: '#39c5bb',
    unlockable: {
      style: 'scout',
      desc: {
        fr: 'Le relais de Loom scanne une issue, révèle les informations qu elle omet et maintient un fil jusqu à la cellule.',
        en: 'Loom relay scans an exit, exposes the information it omits, and maintains a thread back to the cell.'
      },
      effect: {
        damage: 12,
        guardDamage: 16,
        healRatio: 0.05
      }
    }
  }),
  makeUnlockableCard({
    id: 'portal-effect:oc_named_losses_gate',
    kind: 'portalEffect',
    rarityId: 'anomaly',
    name: {
      fr: 'Porte des pertes nommées',
      en: 'Gate of Named Losses'
    },
    color: '#ff8c00',
    unlockable: {
      style: 'gate',
      desc: {
        fr: 'Un portail causal qui conserve les noms, les pertes et les contradictions au lieu de ne montrer que le résultat désiré.',
        en: 'A causal portal that preserves names, losses, and contradictions instead of showing only the desired result.'
      },
      visual: {
        pattern: 'gate',
        durationMs: 1200,
        intensity: 0.9
      }
    }
  })
];

const lastMarginCards = [
  makeArchiveCard({
    id: 'archive:oc_white_threshold_update',
    rarityId: 'rare',
    name: {
      fr: 'Seuil blanc',
      en: 'White Threshold'
    },
    color: '#ff5b6e',
    image: CHAPTER_BACKDROPS.lastMargin,
    mode: 'Smash',
    desc: {
      fr: 'Stage custom où chaque proposition doit être contredite puis ancrée par un souvenir plutôt que détruite par les dégâts.',
      en: 'A custom stage where every proposition must be contradicted and anchored by a memory rather than destroyed through damage.'
    }
  }),
  makeHudCard({
    id: 'hud:oc_six_origin_locks',
    rarityId: 'epic',
    name: {
      fr: 'Interface des six Verrous d Origine',
      en: 'Six Origin Locks Interface'
    },
    color: '#ff5b6e',
    image: CHAPTER_BACKDROPS.lastMargin,
    mode: 'RPG',
    desc: {
      fr: 'HUD de la cellule ZÉRO qui suit le Nom, la Contradiction, la Cicatrice, la Dette, le Retour et le Choix.',
      en: 'A Cell ZERO HUD tracking Name, Contradiction, Scar, Debt, Return, and Choice.'
    }
  }),
  makeUnlockableCard({
    id: 'battle-music:oc_last_margin',
    kind: 'battleMusic',
    rarityId: 'rare',
    name: {
      fr: 'Dernière marge',
      en: 'Last Margin'
    },
    color: '#ff5b6e',
    unlockable: {
      desc: {
        fr: 'Arrangement procédural original de la cellule ZÉRO au moment où elle refuse une paix obtenue par l effacement des différences.',
        en: 'An original procedural Cell ZERO arrangement for the moment it rejects peace obtained by erasing differences.'
      },
      musicStage: {
        id: 'custom-battle-music:oc_last_margin',
        name: 'Last Margin Custom Battle',
        universe: OC_UNIVERSE,
        mode: 'Fighter',
        tags: ['customBattle', 'loreArena', 'whiteThreshold']
      },
      state: 'battle'
    }
  }),
  makeUnlockableCard({
    id: 'field-super:oc_six_origin_locks_sentence',
    kind: 'fieldSuper',
    rarityId: 'anomaly',
    name: {
      fr: 'Sentence des six Verrous d Origine',
      en: 'Six Origin Locks Sentence'
    },
    color: '#ffcf5a',
    unlockable: {
      sourceUltimateId: 'nexus_de_convergence_ultimate',
      desc: {
        fr: 'La cellule ZÉRO impose au terrain une origine, une mémoire et une limite sans supprimer les suites encore possibles.',
        en: 'Cell ZERO imposes an origin, a memory, and a boundary upon the field without deleting the continuations still possible.'
      },
      effect: {
        damage: 40,
        guardDamage: 70,
        knockback: 360,
        healRatio: 0.04
      }
    }
  }),
  makeUnlockableCard({
    id: 'victory-pose:oc_record_not_erase',
    kind: 'victoryPose',
    rarityId: 'rare',
    name: {
      fr: 'Inscrire, ne pas effacer',
      en: 'Record, Do Not Erase'
    },
    color: '#39c5bb',
    unlockable: {
      style: 'echo',
      desc: {
        fr: 'L agent inscrit la signature vaincue dans un registre consultable au lieu de la retirer de la causalité.',
        en: 'The agent records the defeated signature in a readable ledger instead of removing it from causality.'
      },
      animation: {
        key: 'victory-echo',
        durationMs: 1800
      }
    }
  })
];

export const OC_BOOSTER_CONTENT_UPDATES = deepFreeze({
  'oc:keepers-of-name': makeUpdate({
    packId: 'oc:keepers-of-name',
    summary: {
      fr: 'Cinq nouvelles cartes exclusives consacrées au Verrou du Nom et à la reconnaissance de la cellule ZÉRO.',
      en: 'Five new exclusive cards dedicated to the Lock of Name and the recognition of Cell ZERO.'
    },
    changelog: {
      fr: 'Ajout des Archives statiques, du HUD nominal et de trois récompenses de profil ou d introduction.',
      en: 'Added the Static Archives, name-tracking HUD, and three profile or introduction rewards.'
    },
    cards: keepersCards
  }),
  'oc:divergent-shards': makeUpdate({
    packId: 'oc:divergent-shards',
    summary: {
      fr: 'Cinq nouvelles cartes exclusives consacrées aux doubles, aux cristaux d Origine et aux choix de Nova et Marrow.',
      en: 'Five new exclusive cards dedicated to doubles, Origin crystals, and the choices made by Nova and Marrow.'
    },
    changelog: {
      fr: 'Ajout de la Fonderie jouable, de deux arrangements custom, d un effet de K.-O. et d un Super de terrain.',
      en: 'Added the playable Foundry, two custom arrangements, a K.O. effect, and a Field Super.'
    },
    cards: divergentCards
  }),
  'oc:black-ledger': makeUpdate({
    packId: 'oc:black-ledger',
    summary: {
      fr: 'Cinq nouvelles cartes exclusives qui rendent la dette d A.R.C.A., ses preuves et les voix des absents consultables.',
      en: 'Five new exclusive cards making A.R.C.A. debt, its evidence, and the voices of the absent readable.'
    },
    changelog: {
      fr: 'Ajout du Sous-registre, du HUD restauré, d une musique de stage, du drone-archive et d un titre de profil.',
      en: 'Added the Sub-Ledger, restored HUD, stage music, archive drone, and a profile title.'
    },
    cards: ledgerCards
  }),
  'oc:impossible-exodus': makeUpdate({
    packId: 'oc:impossible-exodus',
    summary: {
      fr: 'Cinq nouvelles cartes exclusives conçues pour identifier une vraie route, évacuer la cellule et fermer les refuges mensongers.',
      en: 'Five new exclusive cards designed to identify a real route, evacuate the cell, and close deceptive shelters.'
    },
    changelog: {
      fr: 'Ajout de la Cour jouable, d un kart, d une musique de combat, d un assist et d un portail causal.',
      en: 'Added the playable Yard, a kart, battle music, an assist, and a causal portal.'
    },
    cards: exodusCards
  }),
  'oc:last-margin': makeUpdate({
    packId: 'oc:last-margin',
    summary: {
      fr: 'Cinq nouvelles cartes exclusives réunissant les six Verrous et la doctrine finale de la cellule ZÉRO.',
      en: 'Five new exclusive cards combining all six Locks and Cell ZERO final doctrine.'
    },
    changelog: {
      fr: 'Ajout du Seuil blanc, du HUD des Verrous, du thème final, d un Super de terrain et d une pose de victoire.',
      en: 'Added the White Threshold, Locks HUD, final theme, a Field Super, and a victory pose.'
    },
    cards: lastMarginCards
  })
});

export const OC_BOOSTER_UPDATE_UNLOCKABLES = deepFreeze(Object.fromEntries(
  Object.values(OC_BOOSTER_CONTENT_UPDATES)
    .flatMap(update => update.cards)
    .filter(card => card.data.unlockable)
    .map(card => [card.id, card.data.unlockable])
));

export const getOcBoosterContentUpdate = (packId) => (
  OC_BOOSTER_CONTENT_UPDATES[packId] || null
);
