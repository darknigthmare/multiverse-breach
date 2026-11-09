//43 reviewed source kits, including withheld originals;40 effective drawing targets.
export const ABILITIES_WAVE17_PART_B=Object.freeze({
  "thomas_rogan_hotd": {
    "sourceHeroId": "thomas_rogan_hotd",
    "universe": "House of the Dead",
    "sourceWork": "The House of the Dead (1997), original arcade Rogan",
    "sourceReference": "The House of the Dead (1997), original arcade Rogan. original arcade silver AMS handgun. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "sourceUrl": "https://thehouseofthedead.fandom.com/wiki/Thomas_Rogan",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "source1to1Verified": false,
    "simple": {
      "name": "Tir du pistolet AMS de Rogan",
      "type": "projectile",
      "dmg": 1.15,
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
      "name": "Double tir de Rogan dans le manoir",
      "type": "projectile",
      "dmg": 1.75,
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
      "name": "Retrait de Rogan derrière le pilier",
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
      "name": "Salve du pistolet AMS de Rogan",
      "type": "projectile",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#ff4b3e"
    }
  },
  "g_hotd": {
    "sourceHeroId": "g_hotd",
    "universe": "House of the Dead",
    "sourceWork": "The House of the Dead (1997), original arcade G",
    "sourceReference": "The House of the Dead (1997), original arcade G. original arcade silver AMS handgun. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "sourceUrl": "https://thehouseofthedead.fandom.com/wiki/G",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "source1to1Verified": false,
    "simple": {
      "name": "Tir précis du pistolet de G",
      "type": "projectile",
      "dmg": 1.15,
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
      "name": "Double tir de G sur la cible repérée",
      "type": "projectile",
      "dmg": 1.75,
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
      "name": "Couvert de G derrière la porte",
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
      "name": "Tirs précis de G au laboratoire",
      "type": "projectile",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#ff6e61"
    }
  },
  "sophie_hotd": {
    "sourceHeroId": "sophie_hotd",
    "universe": "House of the Dead",
    "sourceWork": "The House of the Dead (1997), living DBR researcher Sophie Richards",
    "sourceReference": "The House of the Dead (1997), living DBR researcher Sophie Richards. no firearm; practical warning and evacuation gestures. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "sourceUrl": "https://thehouseofthedead.fandom.com/wiki/Sophie_Richards",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "source1to1Verified": false,
    "simple": {
      "name": "Signaler un passage libre à Rogan",
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
        "reduce": 0.3,
        "buffMultiplier": 1
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Indiquer la sortie du laboratoire",
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
        "reduce": 0.3,
        "buffMultiplier": 1
      }
    },
    "defense": {
      "name": "Se mettre à l’abri dans le manoir",
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
        "reduce": 0.3
      },
      "reduce": 0.3,
      "dur": 1.2
    },
    "special": {
      "name": "Alerte de Sophie depuis le manoir",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      },
      "meterCost": 100,
      "color": "#dc281b"
    }
  },
  "james_taylor_hotd2": {
    "sourceHeroId": "james_taylor_hotd2",
    "universe": "House of the Dead 2",
    "sourceWork": "The House of the Dead 2 (1998), original arcade James",
    "sourceReference": "The House of the Dead 2 (1998), original arcade James. silver AMS handgun held in both hands. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "sourceUrl": "https://thehouseofthedead.fandom.com/wiki/James_Taylor",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "source1to1Verified": false,
    "simple": {
      "name": "Tir du pistolet de James",
      "type": "projectile",
      "dmg": 1.15,
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
      "name": "Double tir de James dans la rue de Venise",
      "type": "projectile",
      "dmg": 1.75,
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
      "name": "Repli de James derrière le parapet",
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
      "name": "Salve de James sur le point exposé",
      "type": "projectile",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#ff9d4a"
    }
  },
  "gary_stewart_hotd2": {
    "sourceHeroId": "gary_stewart_hotd2",
    "universe": "House of the Dead 2",
    "sourceWork": "The House of the Dead 2 (1998), original arcade Gary",
    "sourceReference": "The House of the Dead 2 (1998), original arcade Gary. silver AMS handgun held in both hands. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "sourceUrl": "https://thehouseofthedead.fandom.com/wiki/Gary_Stewart",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "source1to1Verified": false,
    "simple": {
      "name": "Tir du pistolet de Gary",
      "type": "projectile",
      "dmg": 1.15,
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
      "name": "Double tir de Gary près du canal",
      "type": "projectile",
      "dmg": 1.75,
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
      "name": "Couvert de Gary derrière le pilier",
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
      "name": "Salve du pistolet de Gary",
      "type": "projectile",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#ffc06d"
    }
  },
  "amy_crystal_hotd2": {
    "sourceHeroId": "amy_crystal_hotd2",
    "universe": "House of the Dead 2",
    "sourceWork": "The House of the Dead 2 (1998), original arcade Amy",
    "sourceReference": "The House of the Dead 2 (1998), original arcade Amy. silver AMS handgun held in both hands; not a medkit. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "sourceUrl": "https://thehouseofthedead.fandom.com/wiki/Amy_Crystal",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "source1to1Verified": false,
    "simple": {
      "name": "Tir de service d’Amy Crystal",
      "type": "projectile",
      "dmg": 1.15,
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
      "name": "Double tir d’Amy au pont",
      "type": "projectile",
      "dmg": 1.75,
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
      "name": "Retrait d’Amy derrière la balustrade",
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
      "name": "Tirs de couverture d’Amy à Venise",
      "type": "projectile",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#dc7a27"
    }
  },
  "lisa_rogan_hotd3": {
    "sourceHeroId": "lisa_rogan_hotd3",
    "universe": "House of the Dead 3",
    "sourceWork": "The House of the Dead III (2002), Lisa during the 2019 rescue",
    "sourceReference": "The House of the Dead III (2002), Lisa during the 2019 rescue. complete black pump-action shotgun. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "sourceUrl": "https://thehouseofthedead.fandom.com/wiki/Lisa_Rogan",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "source1to1Verified": false,
    "simple": {
      "name": "Tir du fusil à pompe de Lisa",
      "type": "projectile",
      "dmg": 1.15,
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
      "name": "Second tir de Lisa après réarmement",
      "type": "projectile",
      "dmg": 1.75,
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
      "name": "Repli de Lisa derrière la porte EFI",
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
      "name": "Salve du fusil à pompe de Lisa",
      "type": "projectile",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#5dff88"
    }
  },
  "g_hotd3": {
    "sourceHeroId": "g_hotd3",
    "universe": "House of the Dead 3",
    "sourceWork": "The House of the Dead III (2002), gray-haired G during the 2019 rescue",
    "sourceReference": "The House of the Dead III (2002), gray-haired G during the 2019 rescue. complete black pump-action shotgun. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "sourceUrl": "https://thehouseofthedead.fandom.com/wiki/G",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "source1to1Verified": false,
    "simple": {
      "name": "Tir du fusil à pompe du vétéran G",
      "type": "projectile",
      "dmg": 1.15,
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
      "name": "Réarmement puis tir de G",
      "type": "projectile",
      "dmg": 1.75,
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
      "name": "Couvert de G derrière le bloc EFI",
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
      "name": "Salve du vétéran G dans l’installation",
      "type": "projectile",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#80ffab"
    }
  },
  "dan_taylor_hotd3": {
    "sourceHeroId": "dan_taylor_hotd3",
    "universe": "House of the Dead 3",
    "sourceWork": "The House of the Dead III (2002), Dan Taylor in the 2019 prologue",
    "sourceReference": "The House of the Dead III (2002), Dan Taylor in the 2019 prologue. complete black pump-action shotgun. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "sourceUrl": "https://thehouseofthedead.fandom.com/wiki/Dan_Taylor",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "source1to1Verified": false,
    "simple": {
      "name": "Tir du fusil à pompe de Dan",
      "type": "projectile",
      "dmg": 1.15,
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
      "name": "Tir de Dan après réarmement",
      "type": "projectile",
      "dmg": 1.75,
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
      "name": "Couvert du commando derrière la cloison",
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
      "name": "Dernière salve de Dan dans la coursive",
      "type": "projectile",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#3adc65"
    }
  },
  "bioshock_rapture_jack": {
    "sourceHeroId": "bioshock_rapture_jack",
    "universe": "BioShock",
    "sourceWork": "BioShock (2007), Jack in Rapture",
    "sourceReference": "BioShock (2007), Jack in Rapture. heavy pipe wrench in right hand; Electro Bolt only from left palm. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "secondary": {
      "cd": 6,
      "name": "Electro Bolt de Jack",
      "type": "beam",
      "dmg": 1.7,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "beam",
        "shape": "line",
        "range": 390,
        "targetSide": "enemy",
        "lineWidth": 32
      }
    },
    "defense": {
      "name": "Repli de Jack derrière les cloisons de Rapture",
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
    "sourceUrl": "https://bioshock.fandom.com/wiki/Jack",
    "source1to1Verified": false,
    "simple": {
      "name": "Coup de clé anglaise de Jack",
      "type": "melee",
      "dmg": 1.15,
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
    "special": {
      "name": "Electro Bolt de la main gauche de Jack",
      "type": "beam",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "beam",
        "shape": "line",
        "range": 520,
        "targetSide": "enemy",
        "lineWidth": 32
      },
      "meterCost": 100,
      "color": "#61d8ff"
    }
  },
  "bioshock_rapture_bouncer": {
    "sourceHeroId": "bioshock_rapture_bouncer",
    "universe": "BioShock",
    "sourceWork": "BioShock (2007), standard Bouncer Big Daddy",
    "sourceReference": "BioShock (2007), standard Bouncer Big Daddy. large mechanical drill integrated into right arm. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "secondary": {
      "cd": 6,
      "name": "Charge à la foreuse du Bouncer",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 150,
        "targetSide": "enemy"
      }
    },
    "defense": {
      "name": "Tenir sous l’armure de plongée du Bouncer",
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
        "reduce": 0.65
      },
      "reduce": 0.65,
      "dur": 1.2
    },
    "sourceUrl": "https://bioshock.fandom.com/wiki/Bouncer",
    "source1to1Verified": false,
    "simple": {
      "name": "Percussion de la foreuse du Bouncer",
      "type": "projectile",
      "dmg": 1.15,
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
    "special": {
      "name": "Charge à la foreuse du Bouncer",
      "type": "melee",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 85,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#3eb5dc"
    }
  },
  "counter_strike_sas": {
    "sourceHeroId": "counter_strike_sas",
    "universe": "Counter-Strike",
    "sourceWork": "Counter-Strike: Global Offensive (2018), default SAS counter-terrorist",
    "sourceReference": "Counter-Strike: Global Offensive (2018), default SAS counter-terrorist. complete M4A1-S rifle with attached long suppressor. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "secondary": {
      "cd": 6,
      "name": "Rafale contrôlée au M4A1-S",
      "type": "projectile",
      "dmg": 1.7,
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
      "name": "Couvert du SAS derrière une caisse de site",
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
    "sourceUrl": "https://counterstrike.fandom.com/wiki/SAS",
    "source1to1Verified": false,
    "simple": {
      "name": "Tir silencieux au M4A1-S",
      "type": "projectile",
      "dmg": 1.15,
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
    "special": {
      "name": "Séquence de tirs au M4A1-S du SAS",
      "type": "projectile",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#61d8ff"
    }
  },
  "counter_strike_gign": {
    "sourceHeroId": "counter_strike_gign",
    "universe": "Counter-Strike",
    "sourceWork": "Counter-Strike: Global Offensive (2018), default GIGN counter-terrorist",
    "sourceReference": "Counter-Strike: Global Offensive (2018), default GIGN counter-terrorist. complete FAMAS bullpup rifle. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "secondary": {
      "cd": 6,
      "name": "Mode rafale du FAMAS",
      "type": "projectile",
      "dmg": 1.7,
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
      "name": "Repli du GIGN derrière le couvert de désamorçage",
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
    "sourceUrl": "https://counterstrike.fandom.com/wiki/GIGN",
    "source1to1Verified": false,
    "simple": {
      "name": "Tir simple du FAMAS du GIGN",
      "type": "projectile",
      "dmg": 1.15,
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
    "special": {
      "name": "Trois rafales du FAMAS du GIGN",
      "type": "projectile",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#84fbff"
    }
  },
  "counter_strike_fbi": {
    "sourceHeroId": "counter_strike_fbi",
    "universe": "Counter-Strike",
    "sourceWork": "Counter-Strike: Global Offensive (2018), default FBI HRT counter-terrorist",
    "sourceReference": "Counter-Strike: Global Offensive (2018), default FBI HRT counter-terrorist. complete M4A4 carbine. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "secondary": {
      "cd": 6,
      "name": "Écran fumigène de reprise du site",
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
        "reduce": 0.35
      }
    },
    "defense": {
      "name": "Angle de repli de l’opérateur HRT",
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
    "sourceUrl": "https://counterstrike.fandom.com/wiki/FBI",
    "source1to1Verified": false,
    "simple": {
      "name": "Tir du M4A4 de l’opérateur HRT",
      "type": "projectile",
      "dmg": 1.15,
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
    "special": {
      "name": "Tirs de reprise du M4A4 HRT",
      "type": "projectile",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#3eb5dc"
    }
  },
  "team_fortress_2_scout": {
    "sourceHeroId": "team_fortress_2_scout",
    "universe": "Team Fortress 2",
    "sourceWork": "Team Fortress 2 (2007), stock RED Scout loadout",
    "sourceReference": "Team Fortress 2 (2007), stock RED Scout loadout. stock Scattergun primary, pistol secondary and aluminum bat melee; no Bonk drink. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "secondary": {
      "cd": 6,
      "name": "Pistolet secondaire du Scout",
      "type": "projectile",
      "dmg": 1.5,
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
      "name": "Double saut d’évitement du Scout",
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
    "sourceUrl": "https://wiki.teamfortress.com/wiki/Scout",
    "source1to1Verified": false,
    "simple": {
      "name": "Tir du Scattergun du Scout",
      "type": "projectile",
      "dmg": 1.15,
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
    "special": {
      "name": "Rafale rapprochée du Scattergun",
      "type": "projectile",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#61d8ff"
    }
  },
  "team_fortress_2_soldier": {
    "sourceHeroId": "team_fortress_2_soldier",
    "universe": "Team Fortress 2",
    "sourceWork": "Team Fortress 2 (2007), stock RED Soldier loadout",
    "sourceReference": "Team Fortress 2 (2007), stock RED Soldier loadout. stock Rocket Launcher primary, Shotgun secondary and Shovel melee; no banner backpack. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "secondary": {
      "cd": 6,
      "name": "Fusil à pompe secondaire du Soldier",
      "type": "projectile",
      "dmg": 1.8,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "cone",
        "range": 480,
        "targetSide": "enemy",
        "coneAngle": 38
      }
    },
    "defense": {
      "name": "Repli du Soldier derrière le couvert du front",
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
        "reduce": 0.5
      },
      "reduce": 0.5,
      "dur": 1.2
    },
    "sourceUrl": "https://wiki.teamfortress.com/wiki/Soldier",
    "source1to1Verified": false,
    "simple": {
      "name": "Roquette du lance-roquettes standard",
      "type": "projectile",
      "dmg": 1.15,
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
    "special": {
      "name": "Salve du lance-roquettes du Soldier",
      "type": "projectile",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#84fbff"
    }
  },
  "team_fortress_2_medic": {
    "sourceHeroId": "team_fortress_2_medic",
    "universe": "Team Fortress 2",
    "sourceWork": "Team Fortress 2 (2007), stock RED Medic loadout",
    "sourceReference": "Team Fortress 2 (2007), stock RED Medic loadout. stock Syringe Gun, stock Medi Gun and Bonesaw; no Kritzkrieg. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "secondary": {
      "cd": 8,
      "name": "Medi Gun du Medic",
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
        "healRatio": 0.2
      },
      "sourceMediGunWave17": true
    },
    "defense": {
      "name": "Recul du Medic derrière son patient",
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
        "reduce": 0.35
      },
      "reduce": 0.35,
      "dur": 1.2
    },
    "sourceUrl": "https://wiki.teamfortress.com/wiki/Medic",
    "source1to1Verified": false,
    "simple": {
      "name": "Tir du Syringe Gun du Medic",
      "type": "projectile",
      "dmg": 1.15,
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
    "special": {
      "name": "Faisceau de soin du Medi Gun",
      "type": "heal",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "heal",
        "delivery": "support",
        "shape": "single",
        "range": 760,
        "targetSide": "ally",
        "healRatio": 0.2
      },
      "cd": 8,
      "meterCost": 100,
      "color": "#3eb5dc",
      "sourceMediGunWave17": true
    }
  },
  "sanctum_skye_autumn": {
    "sourceHeroId": "sanctum_skye_autumn",
    "universe": "Sanctum",
    "sourceWork": "Sanctum 2 (2013), base-game Skye Autumn",
    "sourceReference": "Sanctum 2 (2013), base-game Skye Autumn. complete Sanctum 2 Assault Rifle held in both hands. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "sourceUrl": "https://sanctum.fandom.com/wiki/Skye_Autumn",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "source1to1Verified": false,
    "simple": {
      "name": "Tir du fusil d’assaut de Skye",
      "type": "projectile",
      "dmg": 1.15,
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
      "name": "Grenade secondaire du fusil de Skye",
      "type": "projectile",
      "dmg": 1.75,
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
      "name": "Double saut de Skye vers le couvert",
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
      "name": "Rafale soutenue du fusil de Skye",
      "type": "projectile",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#59efff"
    }
  },
  "sanctum_sweet_autumn": {
    "sourceHeroId": "sanctum_sweet_autumn",
    "universe": "Sanctum",
    "sourceWork": "Sanctum 2 (2013), base-game Sweet Autumn",
    "sourceReference": "Sanctum 2 (2013), base-game Sweet Autumn. complete REX rocket launcher held securely in both hands. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "sourceUrl": "https://sanctum.fandom.com/wiki/Sweet_Autumn",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "source1to1Verified": false,
    "simple": {
      "name": "Roquette REX de Sweet Autumn",
      "type": "projectile",
      "dmg": 1.15,
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
      "name": "Roquettes secondaires du REX",
      "type": "projectile",
      "dmg": 1.75,
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
      "name": "Écart aérien contrôlé de Sweet",
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
      "name": "Salve de roquettes REX de Sweet",
      "type": "projectile",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#7cffff"
    }
  },
  "sanctum_simo": {
    "sourceHeroId": "sanctum_simo",
    "universe": "Sanctum",
    "sourceWork": "Sanctum 2 (2013), SiMo UNIT 025-58",
    "sourceReference": "Sanctum 2 (2013), SiMo UNIT 025-58. complete Sanctum 2 Sniper Rifle in mechanical hands. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "sourceUrl": "https://sanctum.fandom.com/wiki/SiMo",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "source1to1Verified": false,
    "simple": {
      "name": "Tir du fusil de précision de SiMo",
      "type": "projectile",
      "dmg": 1.15,
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
      "name": "Tir secondaire du fusil de SiMo",
      "type": "projectile",
      "dmg": 1.75,
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
      "name": "Repositionnement mécanique de SiMo",
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
      "name": "Tir de SiMo sur le point faible",
      "type": "projectile",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#36ccdc"
    }
  },
  "hotline_miami_jacket": {
    "sourceHeroId": "hotline_miami_jacket",
    "universe": "Hotline Miami",
    "sourceWork": "Hotline Miami (2012), Jacket in 1989 wearing Richard mask",
    "sourceReference": "Hotline Miami (2012), Jacket in 1989 wearing Richard mask. ordinary complete wooden baseball bat; no other mask powers. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "sourceUrl": "https://hotlinemiami.fandom.com/wiki/Jacket",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "source1to1Verified": false,
    "simple": {
      "name": "Coup de batte de Jacket",
      "type": "melee",
      "dmg": 1.15,
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
      "name": "Revers de la batte de Jacket",
      "type": "melee",
      "dmg": 1.75,
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
      "name": "Repli de Jacket derrière l’encadrement",
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
      "name": "Enchaînement à la batte de Jacket",
      "type": "melee",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 85,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#31e3dd"
    }
  },
  "hotline_miami_biker": {
    "sourceHeroId": "hotline_miami_biker",
    "universe": "Hotline Miami",
    "sourceWork": "Hotline Miami (2012), Biker in 1989",
    "sourceReference": "Hotline Miami (2012), Biker in 1989. complete meat cleaver held in right hand; knives are separate physical equipment. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "sourceUrl": "https://hotlinemiami.fandom.com/wiki/Biker",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "source1to1Verified": false,
    "simple": {
      "name": "Coup de couperet de Biker",
      "type": "melee",
      "dmg": 1.15,
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
      "name": "Lancer du couteau de Biker",
      "type": "projectile",
      "dmg": 1.75,
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
      "name": "Retrait de Biker derrière la porte",
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
      "name": "Enchaînement au couperet de Biker",
      "type": "melee",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 85,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#54ffff"
    }
  },
  "hotline_miami_richter": {
    "sourceHeroId": "hotline_miami_richter",
    "universe": "Hotline Miami",
    "sourceWork": "Hotline Miami (2012), Richter in 1989 wearing rat mask",
    "sourceReference": "Hotline Miami (2012), Richter in 1989 wearing rat mask. complete compact suppressed submachine gun. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "sourceUrl": "https://hotlinemiami.fandom.com/wiki/Richter",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "source1to1Verified": false,
    "simple": {
      "name": "Tir silencieux de Richter",
      "type": "projectile",
      "dmg": 1.15,
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
      "name": "Double tir silencieux de Richter",
      "type": "projectile",
      "dmg": 1.75,
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
      "name": "Repli de Richter derrière le mur",
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
      "name": "Rafale de l’arme silencieuse de Richter",
      "type": "projectile",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#0ec0ba"
    }
  },
  "walking_dead_telltale_lee_everett": {
    "sourceHeroId": "walking_dead_telltale_lee_everett",
    "universe": "The Walking Dead — Telltale",
    "sourceWork": "The Walking Dead: Season One (2012), Lee before the final infection",
    "sourceReference": "The Walking Dead: Season One (2012), Lee before the final infection. complete fire axe held with two hands. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "sourceUrl": "https://walkingdead.fandom.com/wiki/Lee_Everett_(Telltale)",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "source1to1Verified": false,
    "simple": {
      "name": "Coup de hache de Lee Everett",
      "type": "melee",
      "dmg": 1.15,
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
      "name": "Revers de la hache de Lee",
      "type": "melee",
      "dmg": 1.75,
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
      "name": "Repli de Lee derrière la barricade",
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
      "name": "Dégagement à la hache de Lee",
      "type": "melee",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 85,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#b5543f"
    }
  },
  "clementine_final_season": {
    "sourceHeroId": "clementine_final_season",
    "universe": "The Walking Dead — Telltale",
    "sourceWork": "The Walking Dead: The Final Season (2018), Clementine before the final injury",
    "sourceReference": "The Walking Dead: The Final Season (2018), Clementine before the final injury. complete compact survival knife in right hand. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "sourceUrl": "https://walkingdead.fandom.com/wiki/Clementine_(Telltale)",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "source1to1Verified": false,
    "simple": {
      "name": "Coup du couteau de survie",
      "type": "melee",
      "dmg": 1.15,
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
      "name": "Frappe de dégagement de Clementine",
      "type": "melee",
      "dmg": 1.75,
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
      "name": "Retrait derrière la barricade d’Ericson",
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
      "name": "Dégagement au couteau de Clementine",
      "type": "melee",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 85,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#d87762"
    }
  },
  "walking_dead_telltale_kenny": {
    "sourceHeroId": "walking_dead_telltale_kenny",
    "universe": "The Walking Dead — Telltale",
    "sourceWork": "The Walking Dead: Season One (2012), Kenny before Season Two",
    "sourceReference": "The Walking Dead: Season One (2012), Kenny before Season Two. complete dark metal crowbar. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "sourceUrl": "https://walkingdead.fandom.com/wiki/Kenny_(Telltale)",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "source1to1Verified": false,
    "simple": {
      "name": "Coup du pied-de-biche de Kenny",
      "type": "melee",
      "dmg": 1.15,
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
      "name": "Revers du pied-de-biche",
      "type": "melee",
      "dmg": 1.75,
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
      "name": "Repli de Kenny derrière le véhicule",
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
      "name": "Dégagement au pied-de-biche de Kenny",
      "type": "melee",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 85,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#92311c"
    }
  },
  "crypt_necrodancer_cadence": {
    "sourceHeroId": "crypt_necrodancer_cadence",
    "universe": "Crypt of the NecroDancer",
    "sourceWork": "Crypt of the NecroDancer (2015), ordinary Cadence campaign equipment",
    "sourceReference": "Crypt of the NecroDancer (2015), ordinary Cadence campaign equipment. small physical basic dagger; carried inventory bomb only for secondary. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "secondary": {
      "cd": 6,
      "name": "Bombe de Cadence sur le battement",
      "type": "projectile",
      "dmg": 1.7,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "area",
        "range": 480,
        "targetSide": "enemy",
        "areaRadius": 75
      }
    },
    "defense": {
      "name": "Repli de Cadence sur un battement libre",
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
    "sourceUrl": "https://crypt-of-the-necrodancer.fandom.com/wiki/Cadence",
    "source1to1Verified": false,
    "simple": {
      "name": "Frappe de dague sur le battement",
      "type": "melee",
      "dmg": 1.15,
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
    "special": {
      "name": "Frappe de dague de Cadence sur le battement",
      "type": "melee",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 85,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#61d8ff"
    }
  },
  "crypt_necrodancer_melody": {
    "sourceHeroId": "crypt_necrodancer_melody",
    "universe": "Crypt of the NecroDancer",
    "sourceWork": "Crypt of the NecroDancer (2015), playable Melody",
    "sourceReference": "Crypt of the NecroDancer (2015), playable Melody. Golden Lute; damage only on actual movement, cardinal neighbors of departure and arrival. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "secondary": {
      "cd": 6,
      "name": "Frappe adjacente de la Golden Lute",
      "type": "melee",
      "dmg": 1.7,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "area",
        "range": 85,
        "targetSide": "enemy",
        "areaRadius": 75
      },
      "sourceGoldenLuteWave17": true
    },
    "defense": {
      "name": "Pas de Melody hors de la case menacée",
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
    "sourceUrl": "https://crypt-of-the-necrodancer.fandom.com/wiki/Melody",
    "source1to1Verified": false,
    "simple": {
      "name": "Déplacement adjacent de Melody",
      "type": "melee",
      "dmg": 1.15,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 85,
        "targetSide": "enemy"
      },
      "sourceGoldenLuteWave17": true
    },
    "special": {
      "name": "Pas de Melody et résonance de la Golden Lute",
      "type": "melee",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 85,
        "targetSide": "enemy"
      },
      "sourceGoldenLuteWave17": true,
      "meterCost": 100,
      "color": "#84fbff"
    }
  },
  "nemesis_awaken_realms_soldier": {
    "sourceHeroId": "nemesis_awaken_realms_soldier",
    "universe": "Nemesis — Awaken Realms",
    "sourceWork": "Nemesis (Awaken Realms, 2018), core-box Soldier",
    "sourceReference": "Nemesis (Awaken Realms, 2018), core-box Soldier. complete core-box Assault Rifle. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "secondary": {
      "cd": 6,
      "name": "Tir de couverture du Soldat",
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
      "name": "Repli du Soldat derrière une porte de coursive",
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
    "sourceUrl": "https://awakenrealms.com/games/awaken-realms/nemesis",
    "source1to1Verified": false,
    "simple": {
      "name": "Tir du fusil du Soldat",
      "type": "projectile",
      "dmg": 1.15,
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
    "special": {
      "name": "Tir de suppression du Soldat Nemesis",
      "type": "projectile",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#61d8ff"
    }
  },
  "nemesis_awaken_realms_scientist": {
    "sourceHeroId": "nemesis_awaken_realms_scientist",
    "universe": "Nemesis — Awaken Realms",
    "sourceWork": "Nemesis (Awaken Realms, 2018), core-box Scientist",
    "sourceReference": "Nemesis (Awaken Realms, 2018), core-box Scientist. core-box Scientist Pistol for ordinary shot; terminal analysis for super. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "secondary": {
      "cd": 6,
      "name": "Lecture de la console par le Scientifique",
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
      "name": "Retrait du Scientifique par la coursive sûre",
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
        "reduce": 0.35
      },
      "reduce": 0.35,
      "dur": 1.2
    },
    "sourceUrl": "https://awakenrealms.com/games/awaken-realms/nemesis",
    "source1to1Verified": false,
    "simple": {
      "name": "Tir du pistolet du Scientifique",
      "type": "projectile",
      "dmg": 1.15,
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
    "special": {
      "name": "Analyse du terminal par le Scientifique",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      },
      "meterCost": 100,
      "color": "#84fbff"
    }
  },
  "nemesis_awaken_realms_scout": {
    "sourceHeroId": "nemesis_awaken_realms_scout",
    "universe": "Nemesis — Awaken Realms",
    "sourceWork": "Nemesis (Awaken Realms, 2018), core-box Scout",
    "sourceReference": "Nemesis (Awaken Realms, 2018), core-box Scout. complete core-box Rifle, not an invented invisibility device. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "secondary": {
      "cd": 6,
      "name": "Progression silencieuse du Scout",
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
      "name": "Écart du Scout vers la porte libre",
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
    "sourceUrl": "https://awakenrealms.com/games/awaken-realms/nemesis",
    "source1to1Verified": false,
    "simple": {
      "name": "Tir du fusil de la Scout",
      "type": "projectile",
      "dmg": 1.15,
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
    "special": {
      "name": "Reconnaissance prudente de la Scout",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      },
      "meterCost": 100,
      "color": "#3eb5dc"
    }
  },
  "absolver_downfall_windfall": {
    "sourceHeroId": "absolver_downfall_windfall",
    "universe": "Absolver: Downfall",
    "sourceWork": "Absolver: Downfall (2018), declared custom Windfall Prospect configuration",
    "sourceReference": "Absolver: Downfall (2018), declared custom Windfall Prospect configuration. unarmed hands and feet, no literal wind projectile. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "identityBasis": "declared-player-configuration",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "secondary": {
      "cd": 6,
      "name": "Contre après esquive du style Windfall",
      "type": "melee",
      "dmg": 1.7,
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
      "name": "Évitement directionnel Windfall",
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
        "reduce": 0.5
      },
      "reduce": 0.5,
      "dur": 1.2
    },
    "sourceUrl": "https://absolvergame.com/news/absolver-downfall",
    "source1to1Verified": false,
    "simple": {
      "name": "Frappe du Prospect Windfall",
      "type": "melee",
      "dmg": 1.15,
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
    "special": {
      "name": "Contre physique après évitement Windfall",
      "type": "melee",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 85,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#61d8ff"
    }
  },
  "absolver_downfall_khalt": {
    "sourceHeroId": "absolver_downfall_khalt",
    "universe": "Absolver: Downfall",
    "sourceWork": "Absolver: Downfall (2018), declared custom Kahlt Prospect configuration",
    "sourceReference": "Absolver: Downfall (2018), declared custom Kahlt Prospect configuration. unarmed hands and feet, no supernatural stone armor. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "identityBasis": "declared-player-configuration",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "secondary": {
      "cd": 6,
      "name": "Riposte après absorption du style Kahlt",
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
      "name": "Absorption du choc par la posture Kahlt",
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
    "sourceUrl": "https://absolvergame.com/news/absolver-downfall",
    "source1to1Verified": false,
    "simple": {
      "name": "Frappe du Prospect Kahlt",
      "type": "melee",
      "dmg": 1.15,
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
    "special": {
      "name": "Riposte physique après absorption Kahlt",
      "type": "melee",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 85,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#84fbff"
    }
  },
  "absolver_downfall_forsaken": {
    "sourceHeroId": "absolver_downfall_forsaken",
    "universe": "Absolver: Downfall",
    "sourceWork": "Absolver: Downfall (2018), declared custom Forsaken Prospect configuration",
    "sourceReference": "Absolver: Downfall (2018), declared custom Forsaken Prospect configuration. unarmed hands and feet, no magic blade or borrowed weapon. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "identityBasis": "declared-player-configuration",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "secondary": {
      "cd": 6,
      "name": "Contre de la parade Forsaken",
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
      "name": "Parade directionnelle Forsaken",
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
        "reduce": 0.55
      },
      "reduce": 0.55,
      "dur": 1.2
    },
    "sourceUrl": "https://absolvergame.com/news/absolver-downfall",
    "source1to1Verified": false,
    "simple": {
      "name": "Frappe du Prospect Forsaken",
      "type": "melee",
      "dmg": 1.15,
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
    "special": {
      "name": "Contre physique après parade Forsaken",
      "type": "melee",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 85,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#3eb5dc"
    }
  },
  "atomic_heart_p3": {
    "sourceHeroId": "atomic_heart_p3",
    "universe": "Atomic Heart",
    "sourceWork": "Atomic Heart (2023), base-game P-3 using Zvezdochka and CHAR-les",
    "sourceReference": "Atomic Heart (2023), base-game P-3 using Zvezdochka and CHAR-les. complete heavy Zvezdochka saw-blade melee tool in right hand; SHOK from left polymer glove only. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "secondary": {
      "cd": 6,
      "name": "SHOK du gant de P-3",
      "type": "beam",
      "dmg": 1.7,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "beam",
        "shape": "line",
        "range": 350,
        "targetSide": "enemy",
        "lineWidth": 32
      }
    },
    "defense": {
      "name": "Bouclier polymérique de P-3",
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
    "sourceUrl": "https://atomic-heart.com/",
    "source1to1Verified": false,
    "simple": {
      "name": "Coup de Zvezdochka de P-3",
      "type": "melee",
      "dmg": 1.15,
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
    "special": {
      "name": "SHOK du gant CHAR-les de P-3",
      "type": "beam",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "beam",
        "shape": "line",
        "range": 520,
        "targetSide": "enemy",
        "lineWidth": 32
      },
      "meterCost": 100,
      "color": "#61d8ff"
    }
  },
  "atomic_heart_granny_zina": {
    "sourceHeroId": "atomic_heart_granny_zina",
    "universe": "Atomic Heart",
    "sourceWork": "Atomic Heart (2023), Baba Zina in the base game",
    "sourceReference": "Atomic Heart (2023), Baba Zina in the base game. complete Kalash rifle held in both hands. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "secondary": {
      "cd": 6,
      "name": "Tir de soutien de Baba Zina",
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
      "name": "Couvert dans le dépôt d’armes de Zina",
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
    "sourceUrl": "https://atomic-heart.fandom.com/wiki/Baba_Zina",
    "source1to1Verified": false,
    "simple": {
      "name": "Tir du Kalash de Zina",
      "type": "projectile",
      "dmg": 1.15,
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
    "special": {
      "name": "Rafale du Kalash de Baba Zina",
      "type": "projectile",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#84fbff"
    }
  },
  "atomic_heart_tereshkova": {
    "sourceHeroId": "atomic_heart_tereshkova",
    "universe": "Atomic Heart",
    "sourceWork": "Atomic Heart (2023), TER-A6 Tereshkova VDNKh hostess",
    "sourceReference": "Atomic Heart (2023), TER-A6 Tereshkova VDNKh hostess. unarmed hostess navigation and welcoming gestures. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "sourceUrl": "https://atomic-heart.fandom.com/wiki/Tereshkova",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Annonce d’accueil de Tereshkova",
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
      "name": "Guidage vers le passage du VDNKh",
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
      "name": "Position d’attente de l’hôtesse",
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
    "source1to1Verified": false,
    "special": {
      "name": "Orientation de l’hôtesse du VDNKh",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      },
      "meterCost": 100,
      "color": "#3eb5dc"
    }
  },
  "bendy_ink_machine_henry": {
    "sourceHeroId": "bendy_ink_machine_henry",
    "universe": "Bendy and the Ink Machine",
    "sourceWork": "Bendy and the Dark Revival (2022), visible ink-realm Henry replica; prior BATIM axe actions are declared adaptation",
    "sourceReference": "Bendy and the Dark Revival (2022), visible ink-realm Henry replica; prior BATIM axe actions are declared adaptation. complete physical studio axe; carried action adapted from BATIM rather than claimed as a 2022 source animation. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "secondary": {
      "cd": 6,
      "name": "Revers de la hache de Henry",
      "type": "melee",
      "dmg": 1.7,
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
      "name": "Repli de Henry dans la station de refuge",
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
    "sourceUrl": "https://bendy.wiki.gg/wiki/Henry_Stein_(ink_realm)",
    "source1to1Verified": false,
    "simple": {
      "name": "Coup de hache de Henry",
      "type": "melee",
      "dmg": 1.15,
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
    "special": {
      "name": "Geste de dégagement à la hache de Henry",
      "type": "melee",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 85,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#61d8ff"
    }
  },
  "bendy_ink_machine_boris": {
    "sourceHeroId": "bendy_ink_machine_boris",
    "universe": "Bendy and the Ink Machine",
    "sourceWork": "Bendy and the Ink Machine (2018), friendly Buddy Boris before transformation",
    "sourceReference": "Bendy and the Ink Machine (2018), friendly Buddy Boris before transformation. flashlight and safehouse guidance; no Gent Pipe attack invented. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "secondary": {
      "cd": 6,
      "name": "Signaler le refuge de Boris",
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
      "name": "S’abriter dans la pièce sûre de Boris",
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
        "reduce": 0.35
      },
      "reduce": 0.35,
      "dur": 1.2
    },
    "sourceUrl": "https://bendy.wiki.gg/wiki/Boris_the_Wolf_(ink_realm)",
    "source1to1Verified": false,
    "simple": {
      "name": "Montrer le passage avec la lampe de Boris",
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
        "reduce": 0.3,
        "buffMultiplier": 1
      }
    },
    "special": {
      "name": "Éclairage du refuge par Buddy Boris",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      },
      "meterCost": 100,
      "color": "#84fbff"
    }
  },
  "bendy_ink_machine_allison": {
    "sourceHeroId": "bendy_ink_machine_allison",
    "universe": "Bendy and the Ink Machine",
    "sourceWork": "Bendy and the Ink Machine (2018), friendly Allison Angel chapters 4–5",
    "sourceReference": "Bendy and the Ink Machine (2018), friendly Allison Angel chapters 4–5. complete broad physical sword held in right hand. Explicit source incarnation; new illustration and four-pose choreography are adapted, not copied official frames. Engine timings, strength, cooldown and support protection are declared adaptations, not source certification.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "secondary": {
      "cd": 6,
      "name": "Riposte à l’épée d’Allison Angel",
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
      "name": "Parade de l’épée d’Allison",
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
    "sourceUrl": "https://bendy.wiki.gg/wiki/Allison_Angel",
    "source1to1Verified": false,
    "simple": {
      "name": "Taille de l’épée d’Allison",
      "type": "melee",
      "dmg": 1.15,
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
    "special": {
      "name": "Riposte de l’épée d’Allison Angel",
      "type": "melee",
      "dmg": 4.2,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 85,
        "targetSide": "enemy"
      },
      "meterCost": 100,
      "color": "#3eb5dc"
    }
  },
  "dana_barrett_gb": {
    "sourceHeroId": "dana_barrett_gb",
    "universe": "Ghostbusters",
    "sourceWork": "Ghostbusters (1984), non-possessed Dana Barrett, orchestra musician",
    "sourceReference": "Ghostbusters (1984), non-possessed Dana Barrett, orchestra musician. ordinary music folder; trained cellist but no instrument used as a weapon or magical emitter. Separate unrelated human support replacement. Source role is ordinary and non-possessed. New simplified sprite costume and practical four-pose choreography remain adapted illustrations, not official source frames or certified source comparison. Protection is a bounded navigation adaptation, never healing or possessed damage.",
    "sourceUrl": "https://ghostbusters.fandom.com/wiki/Dana_Barrett",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "source1to1Verified": false,
    "simple": {
      "name": "Dana indique le passage libre",
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
        "reduce": 0.2
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Dana avertit les autres du danger",
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
        "reduce": 0.25
      }
    },
    "defense": {
      "name": "Dana se retire derrière la porte",
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
        "reduce": 0.3
      },
      "reduce": 0.3,
      "dur": 1.2
    },
    "special": {
      "name": "Dana guide le retour vers la sortie",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      },
      "meterCost": 100,
      "color": "#c0392b"
    }
  },
  "louis_tully_gb": {
    "sourceHeroId": "louis_tully_gb",
    "universe": "Ghostbusters",
    "sourceWork": "Ghostbusters (1984), non-possessed Louis Tully in blue tracksuit",
    "sourceReference": "Ghostbusters (1984), non-possessed Louis Tully in blue tracksuit. empty hands and practical warning gestures; no proton pack or supernatural power. Separate unrelated human support replacement. Source role is ordinary and non-possessed. New simplified sprite costume and practical four-pose choreography remain adapted illustrations, not official source frames or certified source comparison. Protection is a bounded navigation adaptation, never healing or possessed damage.",
    "sourceUrl": "https://www.gbfans.com/wiki/characters/louis-tully",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "source1to1Verified": false,
    "simple": {
      "name": "Louis signale la porte ouverte",
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
        "reduce": 0.2
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Louis prévient les voisins",
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
        "reduce": 0.25
      }
    },
    "defense": {
      "name": "Louis se replie derrière la porte",
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
        "reduce": 0.3
      },
      "reduce": 0.3,
      "dur": 1.2
    },
    "special": {
      "name": "Louis indique la sortie de l’immeuble",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      },
      "meterCost": 100,
      "color": "#a67c52"
    }
  },
  "hammond": {
    "sourceHeroId": "hammond",
    "universe": "Stargate",
    "sourceWork": "Stargate SG-1, Season1 (1997), Major General George Hammond at Stargate Command",
    "sourceReference": "Stargate SG-1, Season1 (1997), Major General George Hammond at Stargate Command. empty hands and concrete SGC command briefing / withdrawal instructions; no portable iris, stargate or staff weapon. Ordinary human command role. Four-pose gestures and temporary team protection adapt a concrete withdrawal instruction, not a supernatural shield or a remotely available iris. Simplified service-uniform illustration is not a certified actor likeness or official source frame.",
    "sourceUrl": "https://www.gateworld.net/wiki/George_Hammond",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "source1to1Verified": false,
    "simple": {
      "name": "Hammond précise le point de repli",
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
        "reduce": 0.2
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Briefing de sécurité de l’équipe SG",
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
        "reduce": 0.25
      }
    },
    "defense": {
      "name": "Hammond se retire derrière la console du SGC",
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
        "reduce": 0.3
      },
      "reduce": 0.3,
      "dur": 1.2
    },
    "special": {
      "name": "Ordre de repli du commandant du SGC",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 2,
        "reduce": 0.3
      },
      "meterCost": 100,
      "color": "#6d7d8b"
    }
  }
});
