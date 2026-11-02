// All40 are explicit revisions; each prior source reference remains inspectable.
export const ABILITIES_WAVE16_PART_A = Object.freeze({
  "crash_bandicoot": {
    "universe": "Crash Bandicoot",
    "sourceWork": "Crash Bandicoot: Warped (1998)",
    "sourceReference": "Crash Bandicoot: Warped (1998). Crash Bandicoot: Warped : le Death Tornado Spin prolonge l'attaque tournoyante de Crash après son déblocage. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": null,
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Spin Attack de Crash",
      "type": "melee",
      "dmg": 1,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 85,
        "targetSide": "enemy"
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Body Slam de Crash",
      "type": "melee",
      "dmg": 1.8,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 85,
        "targetSide": "enemy"
      }
    },
    "defense": {
      "name": "Recul entre deux plateformes",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "crash_bandicoot",
    "priorSourceReference": "Spin Attack et Body Slam font partie du répertoire de plateforme de Crash ; les nombres sont adaptés au moteur de combat.",
    "source1to1Verified": false,
    "special": {
      "name": "Death Tornado Spin",
      "type": "melee",
      "dmg": 3.8,
      "color": "#ff8a22",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "single",
        "delivery": "melee",
        "range": 185
      },
      "meterCost": 100
    }
  },
  "coco_bandicoot": {
    "universe": "Crash Bandicoot",
    "sourceWork": "Crash Bandicoot: Warped (1998)",
    "sourceReference": "Crash Bandicoot: Warped (1998). Crash Bandicoot: Warped : Coco pilote notamment le jet-ski et l'avion ; adaptation de ses compétences de pilotage pour protéger l'équipe. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": null,
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coco lit les données de son ordinateur",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Préparer un itinéraire de secours",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Se mettre à l’abri près du poste de Coco",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "coco_bandicoot",
    "priorSourceReference": "Coco emploie ses compétences techniques et son ordinateur ; son soutien n’impose pas de lui attribuer les attaques de Crash.",
    "source1to1Verified": false,
    "special": {
      "name": "Pilotage de secours de Coco",
      "type": "guard",
      "dmg": 0,
      "color": "#ffad45",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "reduce": 0.45,
        "duration": 5
      },
      "meterCost": 100
    }
  },
  "aku_aku": {
    "universe": "Crash Bandicoot",
    "sourceWork": "Crash Bandicoot: Warped (1998)",
    "sourceReference": "Crash Bandicoot: Warped (1998). Crash Bandicoot : l'accumulation de trois masques Aku Aku accorde temporairement l'invincibilité ; réduction de dégâts adaptée à l'arène. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": null,
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Aku Aku avertit Crash",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Protection du masque d’Aku Aku",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Abri du masque protecteur",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.6
      },
      "reduce": 0.6,
      "dur": 1.2
    },
    "sourceHeroId": "aku_aku",
    "priorSourceReference": "Aku Aku protège le joueur avec les masques du jeu ; cette réduction bornée reste une adaptation de la mécanique et non une invincibilité garantie.",
    "source1to1Verified": false,
    "special": {
      "name": "Protection des trois masques",
      "type": "guard",
      "dmg": 0,
      "color": "#dc6700",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "reduce": 0.45,
        "duration": 5
      },
      "meterCost": 100
    }
  },
  "earthworm_jim": {
    "sourceHeroId": "earthworm_jim",
    "universe": "Earthworm Jim",
    "sourceWork": "Earthworm Jim (1994), original video game",
    "sourceReference": "Earthworm Jim (1994), original video game. Jim retire son corps de ver de la combinaison et l’utilise comme fouet ; attaque jouable du premier jeu. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": null,
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Blaster de la combinaison de Jim",
      "type": "projectile",
      "dmg": 1.2,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Fouet du corps de ver",
      "type": "melee",
      "dmg": 1.7,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 140,
        "targetSide": "enemy"
      }
    },
    "defense": {
      "name": "Repli de la combinaison spatiale",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "priorSourceReference": "Dans le premier Earthworm Jim, Jim utilise son blaster et son corps de ver comme fouet ; sa garde est un retrait de plateforme adapté.",
    "source1to1Verified": false,
    "special": {
      "name": "Fouet du ver Jim",
      "type": "melee",
      "dmg": 4.5,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "single",
        "delivery": "melee",
        "range": 205
      },
      "color": "#ffce8b",
      "meterCost": 100
    }
  },
  "peter_puppy": {
    "sourceHeroId": "peter_puppy",
    "universe": "Earthworm Jim",
    "sourceWork": "Earthworm Jim (1994), original video game",
    "sourceReference": "Earthworm Jim (1994), original video game. Peter se transforme en créature féroce lorsqu’il est blessé ou effrayé ; renforcement adapté de cette transformation. Original game: no TV shirt. Monster form only in transformed super poses.",
    "sourceUrl": null,
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Prévenir Jim avec Peter Puppy",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Rejoindre le passage calme de Peter",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Se cacher avant la panique de Peter",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "priorSourceReference": "Peter Puppy alterne une petite forme vulnérable et une transformation déclenchée par la peur ; les actions préservent son accompagnement sans imposer une transformation au sprite de base.",
    "source1to1Verified": false,
    "special": {
      "name": "Métamorphose de Peter Puppy",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "buff",
        "targetSide": "self",
        "shape": "single",
        "delivery": "support",
        "range": 760,
        "buffMultiplier": 1.4,
        "duration": 4
      },
      "color": "#ffce8b",
      "meterCost": 100,
      "presentationKind": "peter-monster-transformation"
    }
  },
  "princess_whats_her_name": {
    "sourceHeroId": "princess_whats_her_name",
    "universe": "Earthworm Jim",
    "sourceWork": "Earthworm Jim (1994), original ending character",
    "sourceReference": "Earthworm Jim (1994), original ending character. La princesse est l’objectif du sauvetage et ne possède pas de super offensif attesté ; encouragement de rôle, pas aptitude guerrière inventée. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": null,
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Signal de la princesse à Jim",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Indiquer la voie de secours de la princesse",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Refuge de la personne à secourir",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "priorSourceReference": "Princess What’s-Her-Name est l’objectif du sauvetage d’Earthworm Jim ; signaux et refuge remplacent une aptitude guerrière non attestée.",
    "source1to1Verified": false,
    "special": {
      "name": "Signal de la princesse secourue",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "buff",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "buffMultiplier": 1.25,
        "duration": 4
      },
      "color": "#ffce8b",
      "meterCost": 100
    }
  },
  "guybrush_threepwood": {
    "universe": "Secret of Monkey Island",
    "sourceWork": "The Secret of Monkey Island (1990), original EGA/VGA costume",
    "sourceReference": "The Secret of Monkey Island (1990), original EGA/VGA costume. The Secret of Monkey Island (1990) : Guybrush apprend les répliques du duel d'insultes pour progresser dans les duels d'escrime ; avantage de préparation, sans citation inventée. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": null,
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Guybrush relève l’indice de pirate",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Réplique du duel d’insultes",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "defense": {
      "name": "Parade apprise du pirate Guybrush",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "guybrush_threepwood",
    "priorSourceReference": "Guybrush enquête et participe à des duels où la répartie compte ; le buff adapte l’avantage de dialogue sans dommage sonore.",
    "source1to1Verified": false,
    "special": {
      "name": "Réplique du duel d'insultes",
      "type": "buff",
      "dmg": 0,
      "color": "#ffd15a",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "buff",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "buffMultiplier": 1.3,
        "duration": 6
      },
      "meterCost": 100
    }
  },
  "elaine_marley": {
    "universe": "Secret of Monkey Island",
    "sourceWork": "The Secret of Monkey Island (1990)",
    "sourceReference": "The Secret of Monkey Island (1990). The Secret of Monkey Island (1990) : Elaine Marley est la gouverneure de Mêlée et prépare sa propre échappée au complot de LeChuck. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": null,
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Elaine examine le plan d’évasion",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Organiser la sortie de la gouverneure",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Repli de la gouverneure Marley",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "elaine_marley",
    "priorSourceReference": "Elaine agit avec initiative et prépare l’évasion dans Monkey Island ; la table n’invente pas une magie de gouverneure.",
    "source1to1Verified": false,
    "special": {
      "name": "Plan d'évasion de la gouverneure",
      "type": "guard",
      "dmg": 0,
      "color": "#fff47d",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "reduce": 0.45,
        "duration": 5
      },
      "meterCost": 100
    }
  },
  "stan_monkey": {
    "universe": "Secret of Monkey Island",
    "sourceWork": "The Secret of Monkey Island (1990)",
    "sourceReference": "The Secret of Monkey Island (1990). The Secret of Monkey Island (1990) : Stan vend des bateaux au joueur et argumente avec une gestuelle très animée ; soutien de persuasion, sans magie. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": null,
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Stan présente son argument commercial",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Négocier les fournitures du départ",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "defense": {
      "name": "Se placer derrière son comptoir de vente",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "stan_monkey",
    "priorSourceReference": "Stan est le vendeur bavard de Monkey Island ; ses gestes de marchand sont des soutiens et non des projectiles.",
    "source1to1Verified": false,
    "special": {
      "name": "Boniment de vente de Stan",
      "type": "buff",
      "dmg": 0,
      "color": "#dcae37",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "buff",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "buffMultiplier": 1.3,
        "duration": 6
      },
      "meterCost": 100
    }
  },
  "cuphead_cuphead": {
    "universe": "Cuphead",
    "sourceWork": "Cuphead (2017)",
    "sourceReference": "Cuphead (2017). Cuphead : le premier Super Art de Cuphead, Energy Beam, projette un large rayon depuis sa tête après remplissage des cartes. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": "https://studiomdhr.com/what-kind-of-game-is-cuphead/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Peashooter de Cuphead",
      "type": "projectile",
      "dmg": 1.2,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      }
    },
    "secondary": {
      "cd": 6,
      "name": "EX Mega Blast de Cuphead",
      "type": "projectile",
      "dmg": 1.8,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      }
    },
    "defense": {
      "name": "Dash d’évitement de Cuphead",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "cuphead_cuphead",
    "priorSourceReference": "Cuphead : le premier Super Art de Cuphead, Energy Beam, projette un large rayon depuis sa tête après remplissage des cartes. Base/secondary/defense: Peashooter, son EX et le dash du jeu.",
    "source1to1Verified": false,
    "special": {
      "name": "Super Art I — Energy Beam",
      "type": "beam",
      "dmg": 3.9,
      "color": "#61d8ff",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "line",
        "delivery": "beam",
        "range": 680,
        "lineWidth": 64
      },
      "meterCost": 100
    }
  },
  "cuphead_mugman": {
    "universe": "Cuphead",
    "sourceWork": "Cuphead (2017)",
    "sourceReference": "Cuphead (2017). SuperArtII grants Mugman himself invulnerability after activation, with4.85seconds selected from the targeted source reference. It is not an ally damage-reduction buff. The source-frame reproduction remains uncertified.",
    "sourceUrl": "https://studiomdhr.com/what-kind-of-game-is-cuphead/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Peashooter de Mugman",
      "type": "projectile",
      "dmg": 1.2,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      }
    },
    "secondary": {
      "cd": 6,
      "name": "EX du tir équipé de Mugman",
      "type": "projectile",
      "dmg": 1.8,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      }
    },
    "defense": {
      "name": "Dash de Mugman",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "cuphead_mugman",
    "priorSourceReference": "Cuphead : Mugman peut équiper le Super Art II Invincibility ; réduction de dégâts temporaire adaptée de cette protection, sans reproduction absolue de l'invincibilité. Base/secondary/defense: Armes et déplacements partagés, sans pouvoir de couleur.",
    "source1to1Verified": false,
    "special": {
      "name": "Super Art II — Invincibility de Mugman",
      "type": "guard",
      "dmg": 0,
      "color": "#84fbff",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "targetSide": "self",
        "shape": "single",
        "range": 1,
        "maxTargets": 1,
        "invulnerabilityKind": "mugman-super-art-ii",
        "duration": 4.85
      },
      "meterCost": 100,
      "protectionKind": "source-invincibility"
    },
    "priorSpecialSourceReference": "Cuphead : Mugman peut équiper le Super Art II Invincibility ; réduction de dégâts temporaire adaptée de cette protection, sans reproduction absolue de l'invincibilité."
  },
  "cuphead_ms_chalice": {
    "universe": "Cuphead",
    "sourceWork": "Cuphead: The Delicious Last Course (2022)",
    "sourceReference": "Cuphead: The Delicious Last Course (2022). ShieldPal is one persistent heart-marked familiar that absorbs one hit for Ms.Chalice herself. Only one may be active; a generic timed group guard is not the source mechanic.",
    "sourceUrl": "https://studiomdhr.com/what-kind-of-game-is-cuphead/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Tir équipé de Ms. Chalice",
      "type": "projectile",
      "dmg": 1.2,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Parry Dash de Ms. Chalice",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 760,
        "targetSide": "self",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Dodge Roll de Ms. Chalice",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "cuphead_ms_chalice",
    "priorSourceReference": "Cuphead: The Delicious Last Course : le Super Art II Shield Pal de Ms. Chalice fournit une protection supplémentaire absorbant un coup. Base/secondary/defense: Parry Dash et Dodge Roll du DLC de Ms. Chalice.",
    "source1to1Verified": false,
    "special": {
      "name": "Super Art II — Shield Pal",
      "type": "guard",
      "dmg": 0,
      "color": "#3eb5dc",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "targetSide": "self",
        "shape": "single",
        "range": 1,
        "maxTargets": 1,
        "shieldKind": "shield-pal-one-hit",
        "shieldHits": 1,
        "duration": 0
      },
      "meterCost": 100,
      "protectionKind": "shield-pal-one-hit"
    },
    "priorSpecialSourceReference": "Cuphead: The Delicious Last Course : le Super Art II Shield Pal de Ms. Chalice fournit une protection supplémentaire absorbant un coup."
  },
  "deponia_rufus": {
    "sourceHeroId": "deponia_rufus",
    "universe": "Deponia",
    "sourceWork": "Deponia (2012)",
    "sourceReference": "Deponia (2012). Rufus assemble des solutions improvisées dans les énigmes de Deponia ; avantage tactique adapté, pas un canon énergétique. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": "https://www.daedalic.com/deponia",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Examiner le mécanisme avec Rufus",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Bricolage improvisé de Deponia",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "defense": {
      "name": "Se retirer derrière l’assemblage",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "priorSourceReference": "Rufus résout les problèmes par assemblages et improvisations dans les énigmes de Deponia ; aucun gadget offensif précis non attesté n’est inventé.",
    "source1to1Verified": false,
    "special": {
      "name": "Bricolage de Rufus",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "buff",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "buffMultiplier": 1.25,
        "duration": 4
      },
      "color": "#dcb789",
      "meterCost": 100
    }
  },
  "deponia_goal": {
    "sourceHeroId": "deponia_goal",
    "universe": "Deponia",
    "sourceWork": "Deponia (2012)",
    "sourceReference": "Deponia (2012). Goal porte les données et devient une cible de l’Organon ; son soutien préserve l’accès aux informations sans attaque inventée. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": "https://www.daedalic.com/deponia",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Préserver les informations de Goal",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Organiser un passage hors de portée de l’Organon",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Mettre Goal à l’abri des poursuivants",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "priorSourceReference": "Goal est dépositaire de données et cible de l’Organon ; information et évasion restent au centre de son rôle.",
    "source1to1Verified": false,
    "special": {
      "name": "Mise en sécurité de Goal",
      "type": "shield_aoe",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "reduce": 0.45,
        "duration": 4
      },
      "color": "#dcb789",
      "meterCost": 100
    }
  },
  "deponia_bozo": {
    "sourceHeroId": "deponia_bozo",
    "universe": "Deponia",
    "sourceWork": "Chaos on Deponia (2012)",
    "sourceReference": "Chaos on Deponia (2012). Bozo est le capitaine qui transporte Rufus et Goal ; extraction protectrice de groupe. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": "https://www.daedalic.com/deponia",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Bozo annonce la route du bateau",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Embarquement de Rufus et Goal",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Abri dans la cabine de Bozo",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "priorSourceReference": "Bozo est le capitaine qui transporte ses compagnons ; navigation, embarquement et cabine sont des soutiens matériels.",
    "source1to1Verified": false,
    "special": {
      "name": "Extraction sur le bateau de Bozo",
      "type": "shield_aoe",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "reduce": 0.45,
        "duration": 4
      },
      "color": "#dcb789",
      "meterCost": 100
    }
  },
  "sam_and_max_sam_deduction": {
    "universe": "Sam & Max",
    "sourceWork": "Sam & Max Save the World, Telltale season1 (2006–2007)",
    "sourceReference": "Sam & Max Save the World, Telltale season1 (2006–2007). Sam & Max, anthologie classique et Telltale : Sam relie les indices et les dialogues de l'enquête de la Freelance Police ; soutien de déduction. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": "https://skunkapegames.com/samandmax/faq/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Sam relève un indice de la Freelance Police",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Sam relie le témoignage à l’affaire",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "defense": {
      "name": "Sam se retire derrière la DeSoto",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "sam_and_max_sam_deduction",
    "priorSourceReference": "Sam & Max, anthologie classique et Telltale : Sam relie les indices et les dialogues de l'enquête de la Freelance Police ; soutien de déduction. Base/secondary/defense: Déduction et dialogue de l’enquêteur, sans rayon.",
    "source1to1Verified": false,
    "special": {
      "name": "Déduction de Sam",
      "type": "buff",
      "dmg": 0,
      "color": "#61d8ff",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "buff",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "buffMultiplier": 1.3,
        "duration": 6
      },
      "meterCost": 100
    }
  },
  "sam_and_max_max_chaos": {
    "universe": "Sam & Max",
    "sourceWork": "Sam & Max Save the World, Telltale season1 (2006–2007)",
    "sourceReference": "Sam & Max Save the World, Telltale season1 (2006–2007). Sam & Max : Max porte son pistolet Luger dans la fiction de la Freelance Police ; action cartoon sans gore, pas une explosion universelle. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": "https://skunkapegames.com/samandmax/faq/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Luger de Max",
      "type": "projectile",
      "dmg": 1.2,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Diversion cartoon de Max",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "defense": {
      "name": "Bond d’évitement de Max",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "sam_and_max_max_chaos",
    "priorSourceReference": "Sam & Max : Max porte son pistolet Luger dans la fiction de la Freelance Police ; action cartoon sans gore, pas une explosion universelle. Base/secondary/defense: Pistolet et diversion cartoon de Max, sans gore.",
    "source1to1Verified": false,
    "special": {
      "name": "Tir du Luger de Max",
      "type": "projectile",
      "dmg": 3.1,
      "color": "#84fbff",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "single",
        "delivery": "projectile",
        "range": 640
      },
      "meterCost": 100
    }
  },
  "sam_and_max_sybil_pandemik_expertise": {
    "universe": "Sam & Max",
    "sourceWork": "Sam & Max Save the World, Telltale season1 (2006–2007)",
    "sourceReference": "Sam & Max Save the World, Telltale season1 (2006–2007). Sam & Max, saisons Telltale : Sybil Pandemik exerce successivement plusieurs métiers et apporte ses connaissances aux énigmes ; soutien d'expertise sans attaque personnelle. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": "https://skunkapegames.com/samandmax/faq/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Sybil examine le document",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Sybil partage son expertise du métier",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "defense": {
      "name": "Sybil reste derrière son bureau",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "sam_and_max_sybil_pandemik_expertise",
    "priorSourceReference": "Sam & Max, saisons Telltale : Sybil Pandemik exerce successivement plusieurs métiers et apporte ses connaissances aux énigmes ; soutien d'expertise sans attaque personnelle. Base/secondary/defense: Les professions de Sybil aident les énigmes, sans arme ou pouvoir.",
    "source1to1Verified": false,
    "special": {
      "name": "Expertise professionnelle de Sybil",
      "type": "buff",
      "dmg": 0,
      "color": "#3eb5dc",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "buff",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "buffMultiplier": 1.3,
        "duration": 6
      },
      "meterCost": 100
    }
  },
  "jet_set_radio_beat_casque_vert": {
    "universe": "Jet Set Radio",
    "sourceWork": "Jet Set Radio (2000), original Dreamcast",
    "sourceReference": "Jet Set Radio (2000), original Dreamcast. Jet Set Radio, jeu original : Beat enchaîne les grinds sur les rails et les échappées à rollers ; défense de déplacement sans attaque contre les patrouilles. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": "https://store.steampowered.com/app/205950/Jet_Set_Radio/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Beat marque la ligne de grind",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Beat franchit la rambarde",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Beat se décale sur ses rollers",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "jet_set_radio_beat_casque_vert",
    "priorSourceReference": "Jet Set Radio, jeu original : Beat enchaîne les grinds sur les rails et les échappées à rollers ; défense de déplacement sans attaque contre les patrouilles. Base/secondary/defense: Rollers, rails et repères graffiti ; épreuves sans combat.",
    "source1to1Verified": false,
    "special": {
      "name": "Grind de Beat à Tokyo-to",
      "type": "guard",
      "dmg": 0,
      "color": "#61d8ff",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "targetSide": "self",
        "shape": "single",
        "delivery": "support",
        "range": 1,
        "reduce": 0.6,
        "duration": 4
      },
      "meterCost": 100
    }
  },
  "jet_set_radio_gum_tenue_verte": {
    "universe": "Jet Set Radio",
    "sourceWork": "Jet Set Radio (2000), original Dreamcast",
    "sourceReference": "Jet Set Radio (2000), original Dreamcast. Jet Set Radio, jeu original : Gum est une membre des GG's qui franchit les lignes à rollers et utilise les murs ; évasion et style, sans arme ajoutée. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": "https://store.steampowered.com/app/205950/Jet_Set_Radio/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Gum montre le départ du parcours",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Gum prend appui sur le mur",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Gum évite la patrouille en rollers",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "jet_set_radio_gum_tenue_verte",
    "priorSourceReference": "Jet Set Radio, jeu original : Gum est une membre des GG's qui franchit les lignes à rollers et utilise les murs ; évasion et style, sans arme ajoutée. Base/secondary/defense: Démonstrations de rollers de Gum et wall-run, sans arme.",
    "source1to1Verified": false,
    "special": {
      "name": "Wall Ride de Gum",
      "type": "guard",
      "dmg": 0,
      "color": "#84fbff",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "targetSide": "self",
        "shape": "single",
        "delivery": "support",
        "range": 1,
        "reduce": 0.6,
        "duration": 4
      },
      "meterCost": 100
    }
  },
  "jet_set_radio_corn_bonnet_et_veste": {
    "universe": "Jet Set Radio",
    "sourceWork": "Jet Set Radio (2000), original Corn/Tab",
    "sourceReference": "Jet Set Radio (2000), original Corn/Tab. Jet Set Radio, jeu original : Corn participe aux GG's et aux parcours de graffiti de Tokyo-to ; préparation de route adaptée en coordination du groupe. Original2000 Corn/Tab has blue boiler suit; catalogue label veste does not import Future costume.",
    "sourceUrl": "https://store.steampowered.com/app/205950/Jet_Set_Radio/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Corn indique le mur à taguer",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Corn relie la ligne de graffiti",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "defense": {
      "name": "Corn quitte la zone de patrouille",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "jet_set_radio_corn_bonnet_et_veste",
    "priorSourceReference": "Jet Set Radio, jeu original : Corn participe aux GG's et aux parcours de graffiti de Tokyo-to ; préparation de route adaptée en coordination du groupe. Base/secondary/defense: Graffiti et parcours des GG’s du premier jeu.",
    "source1to1Verified": false,
    "special": {
      "name": "Tracé graffiti de Corn",
      "type": "buff",
      "dmg": 0,
      "color": "#3eb5dc",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "buff",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "buffMultiplier": 1.3,
        "duration": 6
      },
      "meterCost": 100
    }
  },
  "oddworld_abe_possession": {
    "universe": "Oddworld",
    "sourceWork": "Oddworld: Abe’s Oddysee (1997)",
    "sourceReference": "Oddworld: Abe’s Oddysee (1997). Abe chants to possess an explicitly eligible Slig enemy. The adapted channel lasts1.1seconds before proxy commands become active for2seconds or1Tactics turn. Chanting is interrupted on damage; no ally shield or Maya levitation is attributed to possession. Exact source animation frames and crossover timing remain uncertified.",
    "sourceUrl": "https://www.oddworld.com/oddworldgames/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Abe appelle les Mudokons",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Abe ouvre le passage aux sauvés",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Abe se cache derrière la machine",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "oddworld_abe_possession",
    "priorSourceReference": "Oddworld: Abe's Oddysee et suites : Abe chante pour prendre le contrôle de certains ennemis et ouvrir une voie aux Mudokons ; neutralisation protectrice adaptée, sans prétendre simuler ici un adversaire possédé complet. Base/secondary/defense: GameSpeak, sauvetage des Mudokons et cachettes.",
    "source1to1Verified": false,
    "special": {
      "name": "Chant de possession d’Abe",
      "type": "control",
      "dmg": 0,
      "animationDuration": 1.35,
      "hitAt": 1.1,
      "meterCost": 100,
      "targeting": {
        "effect": "control",
        "delivery": "control",
        "shape": "single",
        "targetSide": "enemy",
        "range": 480,
        "maxTargets": 1,
        "controlKind": "possession",
        "channelDuration": 1.1,
        "controlDuration": 2,
        "duration": 2,
        "turns": 1
      }
    },
    "priorSpecialSourceReference": "Oddworld: Abe's Oddysee et suites : Abe chante pour prendre le contrôle de certains ennemis et ouvrir une voie aux Mudokons ; neutralisation protectrice adaptée, sans prétendre simuler ici un adversaire possédé complet."
  },
  "oddworld_munch_telecommande": {
    "universe": "Oddworld",
    "sourceWork": "Oddworld: Munch’s Oddysee (2001)",
    "sourceReference": "Oddworld: Munch’s Oddysee (2001). Oddworld: Munch's Oddysee : Munch utilise les dispositifs de télécommande et son sonar dans les installations des Vykkers ; avantage de coordination adapté de cette action. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": "https://www.oddworld.com/oddworldgames/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Munch repère le relais de commande",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Munch détourne le dispositif Vykker",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Munch se retire derrière la console",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "oddworld_munch_telecommande",
    "priorSourceReference": "Oddworld: Munch's Oddysee : Munch utilise les dispositifs de télécommande et son sonar dans les installations des Vykkers ; avantage de coordination adapté de cette action. Base/secondary/defense: Opération des dispositifs Vykkers et libération, sans canon inventé.",
    "source1to1Verified": false,
    "special": {
      "name": "Commande à distance de Munch",
      "type": "buff",
      "dmg": 0,
      "color": "#84fbff",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "buff",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "buffMultiplier": 1.3,
        "duration": 6
      },
      "meterCost": 100
    }
  },
  "oddworld_stranger_live_ammo": {
    "universe": "Oddworld",
    "sourceWork": "Oddworld: Stranger’s Wrath (2005), bounty-hunter disguise",
    "sourceReference": "Oddworld: Stranger’s Wrath (2005), bounty-hunter disguise. Oddworld: Stranger's Wrath : les Fuzzles font partie des Live Ammo que Stranger lance avec son arbalète ; créatures mordantes, pas des balles humaines génériques. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": "https://www.oddworld.com/oddworldgames/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Fuzzles de l’arbalète de Stranger",
      "type": "projectile",
      "dmg": 1.2,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Boombat de Stranger",
      "type": "projectile",
      "dmg": 1.8,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      }
    },
    "defense": {
      "name": "Stranger se replace derrière le rocher",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "oddworld_stranger_live_ammo",
    "priorSourceReference": "Oddworld: Stranger's Wrath : les Fuzzles font partie des Live Ammo que Stranger lance avec son arbalète ; créatures mordantes, pas des balles humaines génériques. Base/secondary/defense: Fuzzles et Boombats sont des Live Ammo de son arbalète.",
    "source1to1Verified": false,
    "special": {
      "name": "Fuzzles — volée vivante de Stranger",
      "type": "projectile",
      "dmg": 3.1,
      "color": "#3eb5dc",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "single",
        "delivery": "projectile",
        "range": 640
      },
      "meterCost": 100
    }
  },
  "super_meat_boy_meat_boy": {
    "sourceHeroId": "super_meat_boy_meat_boy",
    "universe": "Super Meat Boy",
    "sourceWork": "Super Meat Boy (2010)",
    "sourceReference": "Super Meat Boy (2010). Meat Boy traverse les niveaux par la course et les sauts muraux ; renforcement de mobilité, pas nouvelle attaque de viande. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": "https://www.team-meat.com/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Repérer l’appui du saut mural",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Franchir le passage avec Meat Boy",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Se plaquer contre la paroi sûre",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "priorSourceReference": "Meat Boy court et saute sur les murs pour traverser les niveaux ; son corps n’est jamais converti en projectile ni en attaque nouvelle.",
    "source1to1Verified": false,
    "special": {
      "name": "Course et saut mural de Meat Boy",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "buff",
        "targetSide": "self",
        "shape": "single",
        "delivery": "support",
        "range": 760,
        "buffMultiplier": 1.4,
        "duration": 4
      },
      "color": "#f5b1ae",
      "meterCost": 100
    }
  },
  "super_meat_boy_bandage_girl": {
    "sourceHeroId": "super_meat_boy_bandage_girl",
    "universe": "Super Meat Boy",
    "sourceWork": "Super Meat Boy (2010)",
    "sourceReference": "Super Meat Boy (2010). Bandage Girl est l’objectif du sauvetage et devient jouable dans certaines séquences ; repli de plateforme adapté, pas soin magique déduit de son nom. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": "https://www.team-meat.com/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Bandage Girl indique l’issue",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Suivre l’itinéraire de plateforme",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Se tenir sur l’appui du sauvetage",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "priorSourceReference": "Bandage Girl est secourue puis jouable dans certaines séquences ; son nom n’autorise pas un soin magique.",
    "source1to1Verified": false,
    "special": {
      "name": "Itinéraire de secours de Bandage Girl",
      "type": "shield_aoe",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "reduce": 0.45,
        "duration": 4
      },
      "color": "#f5b1ae",
      "meterCost": 100
    }
  },
  "super_meat_boy_brownie": {
    "sourceHeroId": "super_meat_boy_brownie",
    "universe": "Super Meat Boy",
    "sourceWork": "Super Meat Boy (2010)",
    "sourceReference": "Super Meat Boy (2010). Brownie rivalise avec Meat Boy dans une course d’obstacles ; mobilité de son rôle, sans projectile ajouté. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": "https://www.team-meat.com/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Brownie marque le départ de la course",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Trouver le prochain appui de Brownie",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Reculer sur la plateforme stable",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "priorSourceReference": "Brownie rivalise dans une course d’obstacles avec Meat Boy ; mobilité et lecture des appuis remplacent toute attaque inventée.",
    "source1to1Verified": false,
    "special": {
      "name": "Course rivale de Brownie",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "buff",
        "targetSide": "self",
        "shape": "single",
        "delivery": "support",
        "range": 760,
        "buffMultiplier": 1.4,
        "duration": 4
      },
      "color": "#f5b1ae",
      "meterCost": 100
    }
  },
  "bit_trip_commander_video": {
    "universe": "BIT.TRIP",
    "sourceWork": "BIT.TRIP Presents Runner2: Future Legend of Rhythm Alien (2013)",
    "sourceReference": "BIT.TRIP Presents Runner2: Future Legend of Rhythm Alien (2013). CommanderVideo in RUNNER progresses by jumping, sliding and kicking in rhythm; synchronized successful traversal is adapted as a buff. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": "https://www.rerunner.game/presskit",
    "sourceRecord": "CAPABILITIES_LOT_3/bit_trip_commander_video",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "CommanderVideo — saut sur la mesure",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Glissade du parcours RUNNER",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Écart du coureur sur le beat",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "bit_trip_commander_video",
    "priorSourceReference": "RUNNER fournit saut, glissade et évitement rythmés ; ces actions sont des capacités de parcours sans laser.",
    "source1to1Verified": false,
    "special": {
      "name": "Perfect Run — rythme sans faute",
      "type": "buff",
      "dmg": 0,
      "color": "#f5c542",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "buff",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 1200,
        "duration": 5,
        "buffMultiplier": 1.3,
        "reduce": 0.5,
        "healRatio": 0,
        "cleanses": false
      },
      "meterCost": 100
    }
  },
  "bit_trip_commandgirl_video": {
    "universe": "BIT.TRIP",
    "sourceWork": "BIT.TRIP Presents Runner2: Future Legend of Rhythm Alien (2013)",
    "sourceReference": "BIT.TRIP Presents Runner2: Future Legend of Rhythm Alien (2013). CommandGirlVideo is a playable Runner2 character using its rhythm traversal actions, not a laser fighter. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": "https://www.rerunner.game/presskit",
    "sourceRecord": "CAPABILITIES_LOT_3/bit_trip_commandgirl_video",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "CommandGirlVideo garde la cadence",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Franchissement de Runner2",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Passer sous l’obstacle de Runner2",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "bit_trip_commandgirl_video",
    "priorSourceReference": "CommandGirlVideo est une coureuse de Runner2 ; les actions suivent les contrôles de parcours partagés plutôt qu’un arsenal inventé.",
    "source1to1Verified": false,
    "special": {
      "name": "Relais de course de CommandGirlVideo",
      "type": "guard",
      "dmg": 0,
      "color": "#ed86c5",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 1200,
        "duration": 5,
        "buffMultiplier": 1.25,
        "reduce": 0.48,
        "healRatio": 0,
        "cleanses": false
      },
      "meterCost": 100
    }
  },
  "sackboy_lbp": {
    "universe": "LittleBigPlanet",
    "sourceWork": "LittleBigPlanet2 (2011), default Sackboy",
    "sourceReference": "LittleBigPlanet2 (2011), default Sackboy. LittleBigPlanet 2 : le Grappling Hook permet à Sackboy de se balancer et de franchir des obstacles ; soutien de déplacement adapté. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": null,
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Sackboy repère la prise du niveau",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Grappin — aider le partenaire à passer",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Se mettre à l’abri sur la plateforme",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "sackboy_lbp",
    "priorSourceReference": "Sackboy utilise les prises et outils de plateforme de LittleBigPlanet ; la garde représente l’aide au passage.",
    "source1to1Verified": false,
    "special": {
      "name": "Grappin : sauvetage du partenaire",
      "type": "guard",
      "dmg": 0,
      "color": "#f2c06b",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "reduce": 0.45,
        "duration": 5
      },
      "meterCost": 100
    }
  },
  "toggle_lbp": {
    "universe": "LittleBigPlanet",
    "sourceWork": "LittleBigPlanet3 (2014), BigToggle",
    "sourceReference": "LittleBigPlanet3 (2014), BigToggle. LittleBigPlanet 3 : Toggle peut alterner entre sa grande forme lourde et sa petite forme légère ; défense fondée sur la grande forme. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": null,
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Percussion du Grand Toggle",
      "type": "melee",
      "dmg": 1,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 85,
        "targetSide": "enemy"
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Grand Toggle — appui de masse",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Masse accrue du Grand Toggle",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.6
      },
      "reduce": 0.6,
      "dur": 1.2
    },
    "sourceHeroId": "toggle_lbp",
    "priorSourceReference": "Toggle de LittleBigPlanet 3 peut prendre une grande forme lourde ; masse et appui sont adaptés aux règles de combat.",
    "source1to1Verified": false,
    "special": {
      "name": "Grand Toggle : masse accrue",
      "type": "guard",
      "dmg": 0,
      "color": "#cf9d48",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "targetSide": "self",
        "shape": "single",
        "delivery": "support",
        "range": 1,
        "reduce": 0.6,
        "duration": 4
      },
      "meterCost": 100
    }
  },
  "wallace_gromit_wallace": {
    "universe": "Wallace & Gromit",
    "sourceWork": "Wallace & Gromit: The Wrong Trousers (1993)",
    "sourceReference": "Wallace & Gromit: The Wrong Trousers (1993). Wallace & Gromit: The Wrong Trousers : Wallace offre à Gromit le pantalon mécanisé Techno Trousers, présenté comme du matériel ex-NASA, puis l'emploie au quotidien. Le réglage défensif est une adaptation de son usage, sans lui attribuer l'invention originale de cet équipement. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": "https://www.wallaceandgromit.com/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Wallace vérifie le Techno Trousers",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Wallace règle le Techno Trousers",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Wallace reste derrière sa machine",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "wallace_gromit_wallace",
    "priorSourceReference": "Wallace & Gromit: The Wrong Trousers : Wallace offre à Gromit le pantalon mécanisé Techno Trousers, présenté comme du matériel ex-NASA, puis l'emploie au quotidien. Le réglage défensif est une adaptation de son usage, sans lui attribuer l'invention originale de cet équipement. Base/secondary/defense: Inventions Aardman et réparation ; épreuves sans attaque.",
    "source1to1Verified": false,
    "special": {
      "name": "Réglage du Techno Trousers",
      "type": "guard",
      "dmg": 0,
      "color": "#61d8ff",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "reduce": 0.45,
        "duration": 5
      },
      "meterCost": 100
    }
  },
  "wallace_gromit_gromit": {
    "universe": "Wallace & Gromit",
    "sourceWork": "Wallace & Gromit: The Wrong Trousers (1993)",
    "sourceReference": "Wallace & Gromit: The Wrong Trousers (1993). Wallace & Gromit: The Wrong Trousers : Gromit installe des rails à grande vitesse pendant la poursuite en train miniature ; sauvetage et itinéraire, sans attaque ajoutée. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": "https://www.wallaceandgromit.com/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Gromit examine le mécanisme",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Gromit pose la voie de train de secours",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Gromit reste derrière le wagon",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "wallace_gromit_gromit",
    "priorSourceReference": "Wallace & Gromit: The Wrong Trousers : Gromit installe des rails à grande vitesse pendant la poursuite en train miniature ; sauvetage et itinéraire, sans attaque ajoutée. Base/secondary/defense: Observation et pose de rails de The Wrong Trousers.",
    "source1to1Verified": false,
    "special": {
      "name": "Dérivation de la voie de train",
      "type": "guard",
      "dmg": 0,
      "color": "#84fbff",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "reduce": 0.45,
        "duration": 5
      },
      "meterCost": 100
    }
  },
  "wallace_gromit_wendolene_ramsbottom": {
    "universe": "Wallace & Gromit",
    "sourceWork": "Wallace & Gromit: A Close Shave (1995)",
    "sourceReference": "Wallace & Gromit: A Close Shave (1995). Wallace & Gromit: A Close Shave : Wendolene s'oppose aux actions de Preston autour du Knit-o-Matic ; soutien de mise en sécurité de l'usine, sans arme personnelle. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": "https://www.wallaceandgromit.com/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Wendolene examine la filature",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Wendolene indique l’arrêt du Knit-o-Matic",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Wendolene quitte la machine dangereuse",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "wallace_gromit_wendolene_ramsbottom",
    "priorSourceReference": "Wallace & Gromit: A Close Shave : Wendolene s'oppose aux actions de Preston autour du Knit-o-Matic ; soutien de mise en sécurité de l'usine, sans arme personnelle. Base/secondary/defense: Connaissance de la filature et opposition à Preston dans A Close Shave.",
    "source1to1Verified": false,
    "special": {
      "name": "Arrêt du Knit-o-Matic",
      "type": "guard",
      "dmg": 0,
      "color": "#3eb5dc",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "reduce": 0.45,
        "duration": 5
      },
      "meterCost": 100
    }
  },
  "gex_agent_xtra": {
    "universe": "Gex",
    "sourceWork": "Gex3: Deep Cover Gecko (1999), stylised communicator adaptation",
    "sourceReference": "Gex3: Deep Cover Gecko (1999), stylised communicator adaptation. Agent Xtra briefs Gex and directs his assignments against Rez; this special is mission intelligence, not an attributed combat move. Practical stylised communicator depiction departs from filmed costume and does not reproduce the performer.",
    "sourceUrl": "https://gextrilogy.com/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Message de mission d’Agent Xtra",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Localiser le prochain objectif de Gex",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "defense": {
      "name": "Rester au poste de liaison de Xtra",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "gex_agent_xtra",
    "priorSourceReference": "Agent Xtra informe Gex et dirige ses missions dans les suites ; aucune arme personnelle n’est ajoutée à son rôle de liaison.",
    "source1to1Verified": false,
    "special": {
      "name": "Briefing d’Agent Xtra",
      "type": "buff",
      "dmg": 0,
      "color": "#c4dbf2",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "buff",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "duration": 4,
        "buffMultiplier": 1.2
      },
      "meterCost": 100
    }
  },
  "gex_alfred": {
    "universe": "Gex",
    "sourceWork": "Gex3: Deep Cover Gecko (1999)",
    "sourceReference": "Gex3: Deep Cover Gecko (1999). Alfred is Gex’s butler and helps manage the headquarters and mission hub; his assistance is practical preparation. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": "https://gextrilogy.com/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Alfred prépare le matériel du quartier général",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Organiser la sortie de service",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Abri dans le quartier général de Gex",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "gex_alfred",
    "priorSourceReference": "Alfred est le majordome du quartier général de Gex 3 ; préparation et itinéraire sont des soutiens pratiques.",
    "source1to1Verified": false,
    "special": {
      "name": "Préparatifs au quartier général",
      "type": "guard",
      "dmg": 0,
      "color": "#d7d1ba",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "duration": 4,
        "reduce": 0.5
      },
      "meterCost": 100
    }
  },
  "heart_of_darkness_whisky_rescue": {
    "sourceHeroId": "heart_of_darkness_whisky_rescue",
    "universe": "Heart of Darkness",
    "sourceWork": "Heart of Darkness (1998)",
    "sourceReference": "Heart of Darkness (1998). Whisky est le chien à sauver ; ce profil balise son trajet de secours, sans arme ni pouvoir de ténèbres. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": "https://www.thealmightyguru.com/Wiki/images/6/63/Heart_of_Darkness_-_PS1_-_USA_-_Manual.pdf",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Repérer la piste de Whisky",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Baliser le chemin pour secourir Whisky",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Refuge du chien retrouvé",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "priorSourceReference": "Whisky est le chien à sauver dans Heart of Darkness ; ce profil est un objectif de sauvetage, jamais un combattant doté des pouvoirs d’Andy.",
    "source1to1Verified": false,
    "special": {
      "name": "Parcours de sauvetage de Whisky",
      "type": "shield_aoe",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "reduce": 0.45,
        "duration": 4
      },
      "color": "#bee5a4",
      "meterCost": 100
    }
  },
  "freddi_fish_freddi": {
    "universe": "Freddi Fish",
    "sourceWork": "Freddi Fish and the Case of the Missing Kelp Seeds (1994)",
    "sourceReference": "Freddi Fish and the Case of the Missing Kelp Seeds (1994). Freddi solves the missing-seed mystery by collecting clues and helping other sea creatures. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/283940/manuals/freddifish1-manual.pdf?t=1578016205",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Freddi relève un indice",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Relier les traces des graines",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "defense": {
      "name": "Passage sûr entre les rochers",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "freddi_fish_freddi",
    "priorSourceReference": "Freddi enquête dans The Case of the Missing Kelp Seeds ; les gestes sont des énigmes et déplacements non offensifs.",
    "source1to1Verified": false,
    "special": {
      "name": "Indices des graines disparues",
      "type": "buff",
      "dmg": 0,
      "color": "#f2cf80",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "buff",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "duration": 4,
        "buffMultiplier": 1.2
      },
      "meterCost": 100
    }
  },
  "freddi_fish_luther": {
    "universe": "Freddi Fish",
    "sourceWork": "Freddi Fish and the Case of the Missing Kelp Seeds (1994)",
    "sourceReference": "Freddi Fish and the Case of the Missing Kelp Seeds (1994). Luther accompanies Freddi, retrieves objects and helps overcome underwater obstacles; this is puzzle cooperation, not a projectile attack. Fixed source incarnation; engine strengths/timing and cross-universe gameplay remain adapted.",
    "sourceUrl": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/283940/manuals/freddifish1-manual.pdf?t=1578016205",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Luther repère un objet utile",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Aider Freddi à franchir le passage",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Recul dans le courant libre",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "freddi_fish_luther",
    "priorSourceReference": "Luther aide à récupérer les objets et traverser les obstacles ; aucun projectile de poisson n’est inventé.",
    "source1to1Verified": false,
    "special": {
      "name": "Coup de nage de Luther",
      "type": "guard",
      "dmg": 0,
      "color": "#a8d8a6",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "duration": 4,
        "reduce": 0.5
      },
      "meterCost": 100
    }
  },
  "freddi_fish_cousin_calico": {
    "universe": "Freddi Fish",
    "sourceWork": "Freddi Fish4: The Case of the Hogfish Rustlers of Briny Gulch (1999)",
    "sourceReference": "Freddi Fish4: The Case of the Hogfish Rustlers of Briny Gulch (1999). Cousin Calico looks after a hogfish ranch; the special represents sheltering the group at the ranch after the rustler investigation. Female yellow/blue catfish with rancher hat; corrects the broad orange/purple placeholder without altering historical source records.",
    "sourceUrl": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/283940/manuals/freddifish1-manual.pdf?t=1578016205",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Compter les hogfish du ranch",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Ouvrir le refuge de Calico",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      }
    },
    "defense": {
      "name": "Abri du ranch de Briny Gulch",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 1.2,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 1.2
    },
    "sourceHeroId": "freddi_fish_cousin_calico",
    "priorSourceReference": "Cousin Calico s’occupe de son ranch dans Freddi Fish 4 ; le rôle de refuge et de soin du troupeau ne fournit pas d’arme.",
    "source1to1Verified": false,
    "special": {
      "name": "Refuge au ranch de Calico",
      "type": "guard",
      "dmg": 0,
      "color": "#d8bd91",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "duration": 4,
        "reduce": 0.5
      },
      "meterCost": 100
    }
  }
});
