//31 new kits and9 revisions; source supers are explicitly revised by chronological W17 errata.
export const ABILITIES_WAVE17_PART_A = Object.freeze({
  "tomba_hero": {
    "sourceHeroId": "tomba_hero",
    "universe": "Tomba",
    "sourceWork": "Tomba! (1997)",
    "sourceReference": "Tomba! (1997). Tomba grabs and throws enemies and swings the spiked ball. Evil Pig bags only seal their corresponding Evil Pigs, never an arbitrary crossover opponent.",
    "sourceUrl": null,
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Agrippé-projeté de Tomba",
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
      "name": "Moulinet de la boule à pointes",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Rebond hors de la trajectoire",
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
    "special": {
      "name": "Grand moulinet de la boule à pointes",
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
    }
  },
  "charles_tomba": {
    "sourceHeroId": "charles_tomba",
    "universe": "Tomba",
    "sourceWork": "Tomba! (1997)",
    "sourceReference": "Tomba! (1997). Charles teaches Tomba movement techniques including Animal Dash and swimming; the crossover uses visible instruction and route guidance, not an invented fighting super.",
    "sourceUrl": null,
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Charles montre le départ de l’Animal Dash",
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
      "name": "Leçon de trajectoire entre les branches",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Se retirer vers une branche sûre",
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
    "special": {
      "name": "Leçon complète de l’Animal Dash",
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
    }
  },
  "tabby_tomba": {
    "sourceHeroId": "tabby_tomba",
    "universe": "Tomba",
    "sourceWork": "Tomba! 2: The Evil Swine Return (1999)",
    "sourceReference": "Tomba! 2: The Evil Swine Return (1999). Tabby is Tomba’s kidnapped childhood friend in the second game. Signalling, reassurance and evacuation are adapted from that relationship; no travel-staff attack is sourced.",
    "sourceUrl": null,
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Tabby appelle Tomba depuis son refuge",
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
      "name": "Indiquer le passage de retour au village",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Rester dans le refuge de Tabby",
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
    "special": {
      "name": "Appel de retrouvailles de Tabby",
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
    }
  },
  "winston_tr": {
    "sourceHeroId": "winston_tr",
    "universe": "Tomb Raider",
    "sourceWork": "Tomb Raider II (1997), Croft Manor",
    "sourceReference": "Tomb Raider II (1997), Croft Manor. Winston serves refreshments and follows Lara through Croft Manor. The existing small food recovery is a declared game abstraction, never magical healing or a combat weapon.",
    "sourceUrl": null,
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "priorSourceReference": "Winston est le majordome portant son plateau à Croft Manor ; le ravitaillement est une récupération abstraite, pas une guérison magique ni un tir.",
    "simple": {
      "name": "Winston annonce le service au manoir",
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
      "cd": 8,
      "name": "Ravitaillement du plateau de Winston",
      "type": "heal",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "heal",
        "delivery": "support",
        "shape": "single",
        "range": 760,
        "targetSide": "ally",
        "healRatio": 0.12
      }
    },
    "defense": {
      "name": "Rester à l’écart du parcours d’entraînement",
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
    "special": {
      "name": "Pause de ravitaillement au manoir",
      "type": "heal",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "heal",
        "delivery": "support",
        "shape": "single",
        "range": 760,
        "targetSide": "ally",
        "healRatio": 0.12
      },
      "cd": 8
    }
  },
  "spyro_spyro": {
    "sourceHeroId": "spyro_spyro",
    "universe": "Spyro",
    "sourceWork": "Spyro Reignited Trilogy (2018), Spyro 2: Ripto’s Rage incarnation",
    "sourceReference": "Spyro Reignited Trilogy (2018), Spyro 2: Ripto’s Rage incarnation. Spyro breathes ordinary fire and charges with his horns. This action deliberately uses his available horn charge instead of claiming the conditional Superflame power-up is always present.",
    "sourceUrl": "https://www.spyrothedragon.com/pl/spyroreignitedtrilogy",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Souffle de flamme de Spyro",
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
      "name": "Charge cornue de Spyro",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Bond et repli des ailes",
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
    "special": {
      "name": "Charge cornue prolongée",
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
    }
  },
  "spyro_sparx": {
    "sourceHeroId": "spyro_sparx",
    "universe": "Spyro",
    "sourceWork": "Spyro Reignited Trilogy (2018), Spyro 2 companion role",
    "sourceReference": "Spyro Reignited Trilogy (2018), Spyro 2 companion role. Sparx follows Spyro as a health indicator, takes the loss associated with a hit and collects nearby gems. Guard values are an arena adaptation of this companion role; no damaging dragonfly barrier is claimed.",
    "sourceUrl": "https://www.spyrothedragon.com/pl/spyroreignitedtrilogy",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Sparx repère les gemmes du trajet",
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
      "name": "Sparx reste près de son dragon",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Écarter les ailes de la trajectoire",
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
    "special": {
      "name": "Accompagnement protecteur de Sparx",
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
    }
  },
  "spyro_hunter": {
    "sourceHeroId": "spyro_hunter",
    "universe": "Spyro",
    "sourceWork": "Spyro Reignited Trilogy (2018), Spyro: Year of the Dragon incarnation",
    "sourceReference": "Spyro Reignited Trilogy (2018), Spyro: Year of the Dragon incarnation. Hunter uses a bow in Year of the Dragon challenges. His own shot and athletic movement are retained; dragon fire is not transferred to him.",
    "sourceUrl": "https://www.spyrothedragon.com/pl/spyroreignitedtrilogy",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Flèche de l’arc de Hunter",
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
      "name": "Hunter repère une trajectoire dégagée",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Bond latéral du guépard",
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
    "special": {
      "name": "Tir ajusté de Hunter",
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
    }
  },
  "rayman_rayman": {
    "sourceHeroId": "rayman_rayman",
    "universe": "Rayman",
    "sourceWork": "Rayman Legends (2013), default costume",
    "sourceReference": "Rayman Legends (2013). Rayman Legends charged punch is a physical short-range strike of his floating white-gloved fist. It does not fire a long-range energy orb. The complete torso, shoes and both independent hands remain visible through the native release.",
    "sourceUrl": "https://www.ubisoft.com/en-us/company/about-us/our-brands/rayman",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coup de poing de Rayman",
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
      "name": "Poing chargé de Rayman",
      "type": "melee",
      "dmg": 1.2,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 130,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Petit bond de retrait de Rayman",
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
    "special": {
      "name": "Grand poing chargé de Rayman",
      "type": "melee",
      "dmg": 1.2,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 130,
        "targetSide": "enemy"
      }
    }
  },
  "rayman_globox": {
    "sourceHeroId": "rayman_globox",
    "universe": "Rayman",
    "sourceWork": "Rayman Legends (2013), default Globox",
    "sourceReference": "Rayman Legends (2013), default Globox. Globox is playable in Rayman Legends and uses his own elastic body attacks. Do not import the plum-juice intoxication from Hoodlum Havoc into this incarnation.",
    "sourceUrl": "https://www.ubisoft.com/en-us/company/about-us/our-brands/rayman",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Claque ventrale de Globox",
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
      "name": "Rebond corporel de Globox",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Globox se tasse et recule",
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
    "special": {
      "name": "Grande frappe ventrale de Globox",
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
    }
  },
  "rayman_barbara": {
    "sourceHeroId": "rayman_barbara",
    "universe": "Rayman",
    "sourceWork": "Rayman Legends (2013), default Barbara",
    "sourceReference": "Rayman Legends (2013), default Barbara. Barbara is a playable axe wielder in Rayman Legends; retain her axe attack rather than inventing a princess rescue spell.",
    "sourceUrl": "https://www.ubisoft.com/en-us/company/about-us/our-brands/rayman",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coup de hache de Barbara",
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
      "name": "Balayage de la hache de Barbara",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Recul de la guerrière viking",
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
    "special": {
      "name": "Grand balayage de Barbara",
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
    }
  },
  "woodruff_hero": {
    "sourceHeroId": "woodruff_hero",
    "universe": "Woodruff",
    "sourceWork": "Woodruff and the Schnibble of Azimuth (1994)",
    "sourceReference": "Woodruff and the Schnibble of Azimuth (1994). Woodruff solves inventory and language puzzles, learns syllables and uses the Tobozon and Transportozon. Collecting a formula does not grant an offensive energy burst.",
    "sourceUrl": null,
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Woodruff vérifie les objets de sa besace",
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
      "name": "Appel du Tobozon de Woodruff",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Chercher la route du Transportozon",
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
    "special": {
      "name": "Woodruff reconstitue les syllabes du Conseil",
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
    }
  },
  "professor_azimuth": {
    "sourceHeroId": "professor_azimuth",
    "universe": "Woodruff",
    "sourceWork": "Woodruff and the Schnibble of Azimuth (1994)",
    "sourceReference": "Woodruff and the Schnibble of Azimuth (1994). Azimuth built the Viblefrotzer that aged Woodruff. Laboratory preparation and safe calibration are adapted support; neither a Viblefrotzer combat pulse nor reversed growth is asserted.",
    "sourceUrl": null,
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Azimuth consulte ses notes de laboratoire",
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
      "name": "Préparer un retour au laboratoire",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Se retirer derrière le poste de contrôle",
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
    "special": {
      "name": "Calibrage prudent du Viblefrotzer",
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
    }
  },
  "master_boozook": {
    "sourceHeroId": "master_boozook",
    "universe": "Woodruff",
    "sourceWork": "Woodruff and the Schnibble of Azimuth (1994)",
    "sourceReference": "Woodruff and the Schnibble of Azimuth (1994). The Boozook master teaches Woodruff and helps reconstruct the Wisemen’s formulas. Guidance and language remain non-offensive.",
    "sourceUrl": null,
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Le Maître Bouzouk enseigne une syllabe",
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
      "name": "Recomposer la formule des Sages",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Se retirer près du Conseil",
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
    "special": {
      "name": "Leçon des syllabes du Conseil",
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
    }
  },
  "prey_2006_tommy_tawodi": {
    "sourceHeroId": "prey_2006_tommy_tawodi",
    "universe": "Prey (2006)",
    "sourceWork": "Prey (2006)",
    "sourceReference": "Prey (2006). Tommy uses the Sphere’s organic weapons and Spirit Walk in Prey2006. The present native attack is an ordinary alien-rifle burst, not an automatic resurrection attributed to Death Walk.",
    "sourceUrl": "https://nxeassets.xbox.com/shaxam/0201/21/3a/213a78dd-eeef-42f8-979a-c8a2158160da.PDF?v=1",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Tir du fusil organique de Tommy",
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
      "name": "Rafale du fusil de la Sphère",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Tommy se replie vers un abri",
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
    "special": {
      "name": "Rafale ajustée de Tommy",
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
    }
  },
  "prey_2006_jen": {
    "sourceHeroId": "prey_2006_jen",
    "universe": "Prey (2006)",
    "sourceWork": "Prey (2006), human Jen before the late-game transformation",
    "sourceReference": "Prey (2006), human Jen before the late-game transformation. Jen is the person Tommy is trying to rescue. Keep her own human support role; do not grant Tommy’s alien weapons, Spirit Walk or late forced transformation as a normal attack.",
    "sourceUrl": "https://nxeassets.xbox.com/shaxam/0201/21/3a/213a78dd-eeef-42f8-979a-c8a2158160da.PDF?v=1",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "priorSourceReference": "Jen est la personne recherchée par Tommy dans Prey 2006 ; liaison et refuge n’empruntent pas ses armes ni le Spirit Walk.",
    "simple": {
      "name": "Jen signale sa position dans la Sphère",
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
      "name": "Conserver le contact avec Tommy",
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
      "name": "Chercher un abri sur la voie de secours",
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
    "special": {
      "name": "Signal de refuge de Jen",
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
    }
  },
  "prey_2006_enisi": {
    "sourceHeroId": "prey_2006_enisi",
    "universe": "Prey (2006)",
    "sourceWork": "Prey (2006), Land of the Ancients guide",
    "sourceReference": "Prey (2006), Land of the Ancients guide. Enisi guides Tommy in the Land of the Ancients. Guidance can inform an ally but never makes him the user of Tommy’s Spirit Bow or organic gun.",
    "sourceUrl": "https://nxeassets.xbox.com/shaxam/0201/21/3a/213a78dd-eeef-42f8-979a-c8a2158160da.PDF?v=1",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "priorSourceReference": "Enisi conseille Tommy et le guide dans les épreuves spirituelles ; il ne reçoit pas le Spirit Bow du protagoniste.",
    "simple": {
      "name": "Enisi explique la prochaine épreuve",
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
      "name": "Guidage du grand-père dans le passage spirituel",
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
      "name": "Se retirer dans le lieu du conseil",
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
    "special": {
      "name": "Conseil d’Enisi dans la terre des Ancêtres",
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
    }
  },
  "beyond_good_evil_jade": {
    "sourceHeroId": "beyond_good_evil_jade",
    "universe": "Beyond Good & Evil",
    "sourceWork": "Beyond Good & Evil (2003)",
    "sourceReference": "Beyond Good & Evil (2003). Jade fights using her Daï-Jo and Gyrodisk, while her camera records animals and evidence. The photographic special is informational, applies zero HP damage and is never a blinding energy beam.",
    "sourceUrl": "https://www.ubisoft.com/en-us/game/beyond-good-and-evil/20th-anniversary-edition",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coup du Daï-Jo de Jade",
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
      "name": "Gyrodisk de Jade",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Esquive de Jade au Daï-Jo",
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
    "special": {
      "name": "Jade photographie les preuves",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy",
        "duration": 3,
        "buffMultiplier": 1,
        "informationOnly": true,
        "maxTargets": 1
      },
      "informationOnly": true,
      "sourceSpecificId": "jade-photographic-evidence-2003"
    }
  },
  "beyond_good_evil_peyj": {
    "sourceHeroId": "beyond_good_evil_peyj",
    "universe": "Beyond Good & Evil",
    "sourceWork": "Beyond Good & Evil (2003)",
    "sourceReference": "Beyond Good & Evil (2003). Pey’j uses his JetBoots for a physical ground-pound. Repairing the hovercraft is vehicle maintenance, not a magical heal on organic allies.",
    "sourceUrl": "https://www.ubisoft.com/en-us/game/beyond-good-and-evil/20th-anniversary-edition",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Frappe mécanique de Pey’j",
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
      "name": "Écrasement des JetBoots",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Pey’j s’ancre dans ses bottes",
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
    "special": {
      "name": "Grand écrasement des JetBoots",
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
    }
  },
  "beyond_good_evil_double_h": {
    "sourceHeroId": "beyond_good_evil_double_h",
    "universe": "Beyond Good & Evil",
    "sourceWork": "Beyond Good & Evil (2003)",
    "sourceReference": "Beyond Good & Evil (2003). Double H rams obstacles and uses his armoured body in Beyond Good & Evil. Retain a physical charge, not an energy blast invented for IRIS.",
    "sourceUrl": "https://www.ubisoft.com/en-us/game/beyond-good-and-evil/20th-anniversary-edition",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coup d’épaule de Double H",
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
      "name": "Charge de Double H",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Double H se met en garde",
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
    "special": {
      "name": "Charge renforcée de Double H",
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
    }
  },
  "metal_hellsinger_unknown": {
    "sourceHeroId": "metal_hellsinger_unknown",
    "universe": "Metal: Hellsinger",
    "sourceWork": "Metal: Hellsinger (2022), base game",
    "sourceReference": "Metal: Hellsinger (2022), base game. The Unknown attacks with the Terminus sword to the music. Fury is a real rhythm multiplier; the arena timing and numeric damage remain adapted rather than claiming an automatic16× gain.",
    "sourceUrl": "https://www.metalhellsinger.com/",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Entaille de Terminus sur le temps",
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
      "name": "Deuxième frappe rythmée de Terminus",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Esquive sur le temps de l’Unknown",
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
    "special": {
      "name": "Enchaînement de Terminus",
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
    }
  },
  "metal_hellsinger_paz": {
    "sourceHeroId": "metal_hellsinger_paz",
    "universe": "Metal: Hellsinger",
    "sourceWork": "Metal: Hellsinger (2022), sentient skull weapon",
    "sourceReference": "Metal: Hellsinger (2022), sentient skull weapon. Paz fires bolts that preserve Fury. His ThunderandHell ultimate crystallises enemies; this batch uses the attested basic firebolt instead of falsely presenting a generic damaging ultimate pulse.",
    "sourceUrl": "https://www.metalhellsinger.com/",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Trait de feu de Paz",
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
      "name": "Paz marque le rythme à conserver",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Avertissement du narrateur Paz",
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
    "special": {
      "name": "Trait rythmé du crâne Paz",
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
    }
  },
  "dantes_inferno_dante": {
    "sourceHeroId": "dantes_inferno_dante",
    "universe": "Dante's Inferno",
    "sourceWork": "Dante’s Inferno (2010), non-graphic fully clothed adaptation",
    "sourceReference": "Dante’s Inferno (2010), non-graphic fully clothed adaptation. Dante uses Death’s Scythe and Beatrice’s holy cross. Redemption is a distinct powered mode, not a generic judgment explosion. The depicted closed tunic intentionally softens graphic costume details.",
    "sourceUrl": "https://news.ea.com/press-releases/press-releases-details/2010/EA-Welcomes-Players-to-Hell-with-the-Release-of-Dantes-Inferno/default.aspx",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Fauchage de la faux de la Mort",
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
      "name": "Projectile de la croix sacrée",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Parade à la faux de Dante",
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
    "special": {
      "name": "Grand arc de la faux de la Mort",
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
    }
  },
  "dantes_inferno_beatrice": {
    "sourceHeroId": "dantes_inferno_beatrice",
    "universe": "Dante's Inferno",
    "sourceWork": "Dante’s Inferno (2010), redeemed guiding soul, fully clothed adaptation",
    "sourceReference": "Dante’s Inferno (2010), redeemed guiding soul, fully clothed adaptation. Beatrice is Dante’s pursued and redeemed soul. This clothed guiding apparition conveys reassurance; the crossover support values do not claim she performs Dante’s combat attacks.",
    "sourceUrl": "https://news.ea.com/press-releases/press-releases-details/2010/EA-Welcomes-Players-to-Hell-with-the-Release-of-Dantes-Inferno/default.aspx",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "priorSourceReference": "Beatrice est l’âme que Dante cherche à sauver et sa figure de salut ; appel et intercession ne lui attribuent aucune faux ni croisade armée.",
    "simple": {
      "name": "Appel de Beatrice vers Dante",
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
      "name": "Intercession de l’âme de Beatrice",
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
      "name": "Retrait dans la lumière de son apparition",
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
    "special": {
      "name": "Apparition bienveillante de Beatrice",
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
    }
  },
  "dantes_inferno_virgil": {
    "sourceHeroId": "dantes_inferno_virgil",
    "universe": "Dante's Inferno",
    "sourceWork": "Dante’s Inferno (2010)",
    "sourceReference": "Dante’s Inferno (2010). Virgil explains the infernal circles and guides Dante. He provides information and never gains a scythe, cross projectile or resurrecting spell.",
    "sourceUrl": "https://news.ea.com/press-releases/press-releases-details/2010/EA-Welcomes-Players-to-Hell-with-the-Release-of-Dantes-Inferno/default.aspx",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "priorSourceReference": "Virgile guide Dante et explique les cercles ; ses compétences transmettent uniquement des informations et un retrait prudent.",
    "simple": {
      "name": "Virgile décrit le cercle infernal",
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
      "name": "Avertissement du guide au prochain passage",
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
      "name": "S’écarter du combat avec Virgile",
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
    "special": {
      "name": "Conseil de Virgile sur le prochain cercle",
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
    }
  },
  "shadow_man_michael_leroi": {
    "sourceHeroId": "shadow_man_michael_leroi",
    "universe": "Shadow Man",
    "sourceWork": "Shadow Man (1999), Deadside Shadow Man form",
    "sourceReference": "Shadow Man (1999), Deadside Shadow Man form. Michael uses the Shadowgun in Deadside. Pin the active Shadow Man form; no daytime human-to-super-form swap is fabricated within one pose group.",
    "sourceUrl": "https://store.steampowered.com/app/1413870/Shadow_Man_Remastered/",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Tir du Shadowgun",
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
      "name": "Tir chargé du Shadowgun",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Pas de côté dans Deadside",
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
    "special": {
      "name": "Décharge chargée du Shadowgun",
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
    }
  },
  "shadow_man_mama_nettie": {
    "sourceHeroId": "shadow_man_mama_nettie",
    "universe": "Shadow Man",
    "sourceWork": "Shadow Man (1999)",
    "sourceReference": "Shadow Man (1999). Nettie binds the Mask of Shadows to Michael and guides him. Protective support is an explicit crossover adaptation, never a newly asserted damaging voodoo spell.",
    "sourceUrl": "https://store.steampowered.com/app/1413870/Shadow_Man_Remastered/",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "priorSourceReference": "Mama Nettie guide Michael LeRoi et lie le Masque des Ombres à lui ; le catalogue retient la guidance sans créer un nouveau sort offensif.",
    "simple": {
      "name": "Nettie explique le Masque des Ombres",
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
      "name": "Conseil protecteur de Mama Nettie",
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
      "name": "Retour au refuge de Nettie",
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
    "special": {
      "name": "Mise en garde de Mama Nettie",
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
    }
  },
  "shadow_man_jaunty": {
    "sourceHeroId": "shadow_man_jaunty",
    "universe": "Shadow Man",
    "sourceWork": "Shadow Man (1999), Marrow Gates guide",
    "sourceReference": "Shadow Man (1999), Marrow Gates guide. Jaunty is the Marrow Gates guide and navigation objective, not a gun-wielding fighter. All visible actions remain unarmed route signals; combat-style numbers are adapted support only.",
    "sourceUrl": "https://store.steampowered.com/app/1413870/Shadow_Man_Remastered/",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "priorSourceReference": "Jaunty garde l’accès de Deadside et conseille Shadow Man ; sa connaissance des passages est adaptée en soutien tactique.",
    "simple": {
      "name": "Jaunty décrit l’entrée de Deadside",
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
      "name": "Choisir le passage conseillé par Jaunty",
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
      "name": "Rejoindre le seuil gardé de Deadside",
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
    "special": {
      "name": "Jaunty indique la route du Teddy",
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
    }
  },
  "croc_croc": {
    "sourceHeroId": "croc_croc",
    "universe": "Croc: Legend of the Gobbos",
    "sourceWork": "Croc: Legend of the Gobbos (1997)",
    "sourceReference": "Croc: Legend of the Gobbos (1997). Croc spins his tail and ground-pounds. Crystal collection and level names do not provide an additional crystal energy attack.",
    "sourceUrl": "https://store.steampowered.com/app/3043940/Croc_Legend_of_the_Gobbos/",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coup de queue de Croc",
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
      "name": "Écrasement au sol de Croc",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Petit saut de repli de Croc",
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
    "special": {
      "name": "Grand tour de queue de Croc",
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
    }
  },
  "croc_beany_bird": {
    "sourceHeroId": "croc_beany_bird",
    "universe": "Croc: Legend of the Gobbos",
    "sourceWork": "Croc: Legend of the Gobbos (1997)",
    "sourceReference": "Croc: Legend of the Gobbos (1997). Beany carries Croc during flight segments. Route signalling and protection are adapted transport support; no laser, healing spell or aggressive bird weapon is introduced.",
    "sourceUrl": "https://store.steampowered.com/app/3043940/Croc_Legend_of_the_Gobbos/",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "priorSourceReference": "Beany transporte Croc dans ses séquences de vol ; la table ne lui invente pas de projectiles d’oiseau.",
    "simple": {
      "name": "Beany repère la plateforme suivante",
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
      "name": "Vol de transport de Beany",
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
      "name": "Se poser à l’écart du danger",
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
    "special": {
      "name": "Beany prépare le prochain vol",
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
    }
  },
  "gex_gex": {
    "sourceHeroId": "gex_gex",
    "universe": "Gex",
    "sourceWork": "Gex3: Deep Cover Gecko (1999), ordinary secret-agent hub costume",
    "sourceReference": "Gex3: Deep Cover Gecko (1999), ordinary secret-agent hub costume. Gex uses tail attacks and climbs surfaces. The source incarnation is fixed to the ordinary secret-agent costume, without importing a different television-level costume in each row.",
    "sourceUrl": "https://gextrilogy.com/",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coup de queue de Gex",
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
      "name": "Balayage tournoyant de Gex",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Gex se replie en appui mural",
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
    "special": {
      "name": "Grand tour de queue de Gex",
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
    }
  },
  "heart_of_darkness_andy": {
    "sourceHeroId": "heart_of_darkness_andy",
    "universe": "Heart of Darkness",
    "sourceWork": "Heart of Darkness (1998), later meteor life-energy phase",
    "sourceReference": "Heart of Darkness (1998), later meteor life-energy phase. After meeting Amigo and receiving the meteor’s power, Andy uses life energy. The earlier homemade plasma weapon is a separate phase and is not simultaneously added to this incarnation.",
    "sourceUrl": "https://www.thealmightyguru.com/Wiki/images/6/63/Heart_of_Darkness_-_PS1_-_USA_-_Manual.pdf",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Trait d’énergie vitale d’Andy",
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
      "name": "Décharge vitale du météore",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Roulade de retrait d’Andy",
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
    "special": {
      "name": "Trait vital chargé d’Andy",
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
    }
  },
  "heart_of_darkness_amigo_evacuation": {
    "sourceHeroId": "heart_of_darkness_amigo_evacuation",
    "universe": "Heart of Darkness",
    "sourceWork": "Heart of Darkness (1998), Amigo as rescue companion",
    "sourceReference": "Heart of Darkness (1998), Amigo as rescue companion. Amigo befriends Andy and helps him escape. The evacuation profile is a transport role, not a separate offensive monster or a copy of Andy’s life-energy power.",
    "sourceUrl": "https://www.thealmightyguru.com/Wiki/images/6/63/Heart_of_Darkness_-_PS1_-_USA_-_Manual.pdf",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "priorSourceReference": "Amigo est une créature alliée de l’aventure d’Andy ; le profil conserve exclusivement son aide au passage et à l’évacuation.",
    "simple": {
      "name": "Signaler le passage avec Amigo",
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
      "name": "Guider les compagnons hors du danger",
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
      "name": "Se placer derrière l’abri d’Amigo",
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
    "special": {
      "name": "Amigo prépare le sauvetage",
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
    }
  },
  "rival_schools_batsu": {
    "sourceHeroId": "rival_schools_batsu",
    "universe": "Rival Schools",
    "sourceWork": "Rival Schools: United by Fate (1997)",
    "sourceReference": "Rival Schools: United by Fate (1997). Batsu’s Super Guts Bullet is a Burning Vigor attack in the original1997 Rival Schools, independently listed by the period move guides. An actual palm releases the enlarged Guts projectile. The1997 source frame timing and exact palette remain uncertified.",
    "sourceUrl": "https://strategywiki.org/wiki/Rival_Schools/Moves",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Direct de Batsu",
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
      "name": "Coup de pied de Batsu",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Garde de Taiyo High",
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
    "special": {
      "name": "Super Guts Bullet",
      "type": "projectile",
      "dmg": 3.8,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy",
        "maxTargets": 1
      },
      "color": "#ffd067"
    }
  },
  "rival_schools_hinata": {
    "sourceHeroId": "rival_schools_hinata",
    "universe": "Rival Schools",
    "sourceWork": "Rival Schools: United by Fate (1997)",
    "sourceReference": "Rival Schools: United by Fate (1997). Fire Senpuu-Kyaku is Hinata’s Burning Vigor technique in the original Rival Schools. Its physical rotating kick uses fire around the kicking leg; it is not a thrown hand fireball or a Team Up summoning another pupil. Exact source hit count, frame timing and palette remain adapted and uncertified.",
    "sourceUrl": "https://strategywiki.org/wiki/Rival_Schools/Hinata",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coup de paume de Hinata",
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
      "name": "Coup de pied tournant de Hinata",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Garde vive de Hinata",
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
    "special": {
      "name": "Fire Senpuu-Kyaku",
      "type": "melee",
      "dmg": 3.8,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 145,
        "targetSide": "enemy",
        "maxTargets": 1
      },
      "color": "#ffad51"
    }
  },
  "rival_schools_kyosuke": {
    "sourceHeroId": "rival_schools_kyosuke",
    "universe": "Rival Schools",
    "sourceWork": "Rival Schools: United by Fate (1997)",
    "sourceReference": "Rival Schools: United by Fate (1997). Super Cross Cutter is Kyosuke’s original Rival Schools Burning Vigor attack. His hands release crossed energy cutters. Last Symphony is a different Team Up technique and must not silently create teammates in this solo atlas. Exact1997 palette, source frames and fan spread remain uncertified.",
    "sourceUrl": "https://strategywiki.org/wiki/Rival_Schools/Kyosuke",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Frappe précise de Kyosuke",
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
      "name": "Coup de pied ascendant de Kyosuke",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Garde posée de Kyosuke",
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
    "special": {
      "name": "Super Cross Cutter",
      "type": "projectile",
      "dmg": 3.8,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy",
        "maxTargets": 1
      },
      "color": "#8acfff"
    }
  },
  "jersey_devil_jersey_devil": {
    "sourceHeroId": "jersey_devil_jersey_devil",
    "universe": "Jersey Devil",
    "sourceWork": "Jersey Devil (1997)",
    "sourceReference": "Jersey Devil (1997). Jersey Devil punches, spins and glides. NITRO is the set of collected letters; it is not asserted to be an explosive fuel or a super-power source.",
    "sourceUrl": "https://www.videogamemanual.com/ps1/Jersey%20Devil%20%28USA%29.pdf",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coup de poing de Jersey Devil",
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
      "name": "Tourbillon de Jersey Devil",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Petit vol plané de Jersey Devil",
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
    "special": {
      "name": "Grand tourbillon de Jersey Devil",
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
    }
  },
  "tail_concerto_waffle": {
    "sourceHeroId": "tail_concerto_waffle",
    "universe": "Tail Concerto",
    "sourceWork": "Tail Concerto (1998), Police Robo patrol",
    "sourceReference": "Tail Concerto (1998), Police Robo patrol. The USA manual printedpages4 and6 depicts the Police Robo’s cream-gray body, brown segmented arms, blue-gray legs, red seat and twin back pipes. Printedpage23 depicts Waffle’s blue uniform and red tie. The bubble arrests nonlethally; controls include grab, throw and bubble blaster.",
    "sourceUrl": "https://www.videogamemanual.com/ps1/Tail%20Concerto%20%28USA%29.pdf",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Bulle d’arrestation du Police Robo",
      "type": "control",
      "dmg": 0,
      "animationDuration": 0.75,
      "hitAt": 0.3,
      "targeting": {
        "effect": "control",
        "delivery": "control",
        "shape": "single",
        "range": 260,
        "targetSide": "enemy",
        "controlKind": "bubble-capture",
        "duration": 1.25,
        "maxTargets": 1,
        "nonlethal": true,
        "tacticsTurns": 1,
        "requiresExplicitTargetEligibility": true
      },
      "nonlethal": true
    },
    "secondary": {
      "name": "Waffle ouvre la voie avec le Police Robo",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Repli du Police Robo",
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
    "special": {
      "name": "Bulle de capture du Police Robo",
      "type": "control",
      "dmg": 0,
      "animationDuration": 0.75,
      "hitAt": 0.3,
      "targeting": {
        "effect": "control",
        "delivery": "control",
        "shape": "single",
        "range": 260,
        "targetSide": "enemy",
        "controlKind": "bubble-capture",
        "duration": 1.25,
        "maxTargets": 1,
        "nonlethal": true,
        "tacticsTurns": 1,
        "requiresExplicitTargetEligibility": true
      },
      "nonlethal": true,
      "sourceControlKind": "waffle-bubble-capture"
    }
  },
  "tail_concerto_alicia": {
    "sourceHeroId": "tail_concerto_alicia",
    "universe": "Tail Concerto",
    "sourceWork": "Tail Concerto (1998), late-game rescue ally",
    "sourceReference": "Tail Concerto (1998), late-game rescue ally. The USA manual printedpage17 shows Alicia with white-blond front hair over dark fur, right-eye eyepatch, red-and-gold top, loose red trousers and white gloves. She is the eldest Pris sister and Black Cats leader. Late-game route support is a declared crossover adaptation, not a summoned Iron Giant.",
    "sourceUrl": "https://www.videogamemanual.com/ps1/Tail%20Concerto%20%28USA%29.pdf",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Alicia réoriente les Chats Noirs",
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
      "name": "Alicia indique la route des ballons",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Se replier avec les sœurs Pris",
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
    "special": {
      "name": "Signal d’évacuation d’Alicia",
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
    }
  },
  "tail_concerto_cyan": {
    "sourceHeroId": "tail_concerto_cyan",
    "universe": "Tail Concerto",
    "sourceWork": "Tail Concerto (1998), Prairie rescue ally",
    "sourceReference": "Tail Concerto (1998), Prairie rescue ally. The USA manual printedpage21 identifies Cyan as Captain of the Prairie Palace Guard and skilled Knight Robo pilot. It depicts his red-and-gold uniform and sword; the earlier blue-white armor palette was incorrect. This action remains rescue coordination, not an unverified playable sword combo.",
    "sourceUrl": "https://www.videogamemanual.com/ps1/Tail%20Concerto%20%28USA%29.pdf",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Cyan vérifie la route de Prairie",
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
      "name": "Cyan prépare la couverture d’évacuation",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Repli vers l’embarquement",
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
    "special": {
      "name": "Cyan sécurise le départ de Prairie",
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
    }
  },
  "redneck_rampage_leonard": {
    "sourceHeroId": "redneck_rampage_leonard",
    "universe": "Redneck Rampage",
    "sourceWork": "Redneck Rampage (1997), original game",
    "sourceReference": "Redneck Rampage (1997), original game. Leonard is the playable brother with a scattergun and rural arsenal. Bubba remains a level-exit objective and Bessie a rescue objective; neither is fabricated as an attacking summon.",
    "sourceUrl": "https://steamcdn-a.akamaihd.net/steam/apps/565550/manuals/Redneck_Rampage.pdf",
    "identityBasis": "canonical-role",
    "source1to1Verified": false,
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Tir du fusil de chasse de Leonard",
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
      "name": "Deuxième coup du fusil de Leonard",
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
      },
      "cd": 6
    },
    "defense": {
      "name": "Pas de côté dans Hickston",
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
    "special": {
      "name": "Tir ajusté du fusil de Leonard",
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
    }
  }
});
