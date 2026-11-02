//41 reviewed identities: the blocked JohnWick kit remains explicit; effective artwork40 includes Tank.
export const ABILITIES_WAVE16_PART_B=Object.freeze({
  "sev_killzone": {
    "universe": "Killzone",
    "sourceWork": "Killzone2 (2009), Tomas Sevchenko ISA field uniform",
    "sourceReference": "Killzone2 (2009), Tomas Sevchenko ISA field uniform. Adult ISA rifleman with short dark hair, gray tactical armour over a khaki field uniform, gloves and boots, bare human face, no Helghast glowing goggles. M82 assault rifle held with both hands. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.playstation.com/en-us/games/killzone/",
    "sourceRecord": "CAPABILITIES_LOT_3/sev_killzone",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "M82 de Tomas Sevchenko",
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
      "name": "Rafale de l’ISA",
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
      "name": "Couvert de Sev derrière les blocs",
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
    "sourceHeroId": "sev_killzone",
    "priorSourceReference": "Sev est un fusilier ISA de Killzone 2 et 3 armé du M82 ; les trois gestes restent dans ce matériel.",
    "source1to1Verified": false,
    "defenseName": "Couvert de Sev derrière les blocs",
    "special": {
      "name": "Rafale M82 de Sev",
      "type": "projectile",
      "dmg": 4.1,
      "color": "#9d9f8a",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "cone",
        "delivery": "projectile",
        "range": 720,
        "coneAngle": 32
      },
      "meterCost": 100
    }
  },
  "rico_killzone": {
    "universe": "Killzone",
    "sourceWork": "Killzone2 (2009), Rico Velasquez ISA field uniform",
    "sourceReference": "Killzone2 (2009), Rico Velasquez ISA field uniform. Broad muscular dark-skinned ISA heavy gunner, close-shaven dark hair, heavy gray chest armour and military trousers, no Helghast helmet. M224-A1 light machine gun supported in both hands. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.playstation.com/en-us/games/killzone/",
    "sourceRecord": "CAPABILITIES_LOT_3/rico_killzone",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "M224-A1 de Rico",
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
      "name": "Couvrir le déplacement de l’ISA",
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
      "name": "Position de suppression de Rico",
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
    "sourceHeroId": "rico_killzone",
    "priorSourceReference": "Rico emploie une arme automatique lourde pour soutenir l’assaut ; couvert et soutien n’ajoutent aucun pouvoir de Helghast.",
    "source1to1Verified": false,
    "defenseName": "Position de suppression de Rico",
    "special": {
      "name": "Suppression à la M224-A1",
      "type": "projectile",
      "dmg": 4.3,
      "color": "#b39a67",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "cone",
        "delivery": "projectile",
        "range": 720,
        "coneAngle": 43
      },
      "meterCost": 100
    }
  },
  "echo_killzone": {
    "universe": "Killzone",
    "sourceWork": "Killzone: Shadow Fall (2013), Maya Echo Visari",
    "sourceReference": "Killzone: Shadow Fall (2013), Maya Echo Visari. Pale adult Helghast scout, distinctive deep red hood and scarf over dark fitted reinforced scout armour, human face visible beneath hood, no glowing full-face helmet. Scoped Helghast precision rifle, held with both hands. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.creativeuncut.com/gallery-27/kzsf-echo-concept.html",
    "sourceRecord": "CAPABILITIES_LOT_3/echo_killzone",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Visée de précision d’Echo",
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
      "name": "Observation du secteur par Echo",
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
      "name": "Se dérober sur le toit avec Echo",
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
    "sourceHeroId": "echo_killzone",
    "priorSourceReference": "Echo est opératrice du renseignement et tireuse de Shadow Fall ; observation et couvert accompagnent ce rôle.",
    "source1to1Verified": false,
    "defenseName": "Se dérober sur le toit avec Echo",
    "special": {
      "name": "Tir d’observation d’Echo",
      "type": "projectile",
      "dmg": 4.4,
      "color": "#b95e62",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "single",
        "delivery": "projectile",
        "range": 950
      },
      "meterCost": 100
    }
  },
  "jack_cooper_tf2": {
    "universe": "Titanfall 2",
    "sourceWork": "Titanfall2 (2016), campaign pilot after receiving Lastimosa equipment; selected R-201 loadout",
    "sourceReference": "Titanfall2 (2016), campaign pilot after receiving Lastimosa equipment; selected R-201 loadout. Human Militia pilot in gray-green pilot armour, enclosed pilot helmet with blue visor, compact jump kit on back, pouches, gloves and boots, no Titan chassis. Selected campaign R-201 assault rifle held with both hands. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.ea.com/games/titanfall/titanfall-2",
    "sourceRecord": "CAPABILITIES_LOT_3/jack_cooper_tf2",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Fusil du chargement de Cooper",
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
      "name": "Wallrun du pilote pour changer d’angle",
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
      "name": "Décrochage au jump kit de Cooper",
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
    "sourceHeroId": "jack_cooper_tf2",
    "priorSourceReference": "Titanfall 2 : Cooper utilise les armes de pilote et le jump kit pour courir sur les murs ; le fusil est un chargement sélectionnable et la mobilité une garde adaptée.",
    "source1to1Verified": false,
    "defenseName": "Décrochage au jump kit de Cooper",
    "special": {
      "name": "Flanc du pilote au jump kit",
      "type": "projectile",
      "dmg": 4.2,
      "color": "#55d8ff",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "multi",
        "delivery": "projectile",
        "range": 720,
        "maxTargets": 2
      },
      "meterCost": 100
    }
  },
  "bt_7274_tf2": {
    "universe": "Titanfall 2",
    "sourceWork": "Titanfall2 (2016), BT7274 Vanguard chassis, Expedition loadout",
    "sourceReference": "Titanfall2 (2016), BT7274 Vanguard chassis, Expedition loadout. Very tall Vanguard Titan, olive green and worn cream-gray armour plates, small central orange optical sensor, black joints, large mechanical feet, compact stocky torso, recognisable BT7274 chassis; never a human-sized turret. XO16A2 Chaingun physically held and supported by two mechanical arms; not a gun replacing a hand. Source guide says approximately7s of amped XO16 fire.14projectiles/7.4total animation seconds are explicit engine sampling, not a source bullet count or certified source duration.",
    "sourceUrl": "https://titanfall.wiki.gg/wiki/Expedition_(Titan_Loadout)",
    "sourceRecord": "CAPABILITIES_LOT_3/bt_7274_tf2",
    "identityBasis": "canonical-technique",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "XO-16 du chargement Expedition",
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
      "name": "Salve de roquettes de BT Expedition",
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
      "name": "Vortex Shield de BT",
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
    "sourceHeroId": "bt_7274_tf2",
    "priorSourceReference": "Titanfall 2 : le chargement Expedition de BT dispose du XO-16, d’une salve de roquettes et du Vortex Shield ; la garde ne prétend pas simuler chaque projectile capturé.",
    "source1to1Verified": false,
    "defenseName": "Vortex Shield de BT",
    "special": {
      "name": "Burst Core — XO-16",
      "type": "projectile",
      "dmg": 4.65,
      "color": "#78fbff",
      "animationDuration": 7.4,
      "hitAt": 0.45,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "single",
        "delivery": "projectile",
        "range": 640,
        "coneAngle": 45,
        "maxTargets": 1,
        "hitSequence": {
          "kind": "automatic-core",
          "hitCount": 14,
          "firstAt": 0.45,
          "lastAt": 6.95,
          "releaseWindow": 0.09,
          "nativeRecoveryAfter": 7.1,
          "countIsEngineSampling": true,
          "sourceApproximateDuration": 7
        }
      },
      "meterCost": 100,
      "hitSequence": {
        "kind": "automatic-core",
        "hitCount": 14,
        "firstAt": 0.45,
        "lastAt": 6.95,
        "releaseWindow": 0.09,
        "nativeRecoveryAfter": 7.1,
        "countIsEngineSampling": true,
        "sourceApproximateDuration": 7
      }
    }
  },
  "sarah_briggs_tf2": {
    "universe": "Titanfall 2",
    "sourceWork": "Titanfall2 (2016), Sarah Briggs as Marauder Corps commander",
    "sourceReference": "Titanfall2 (2016), Sarah Briggs as Marauder Corps commander. Adult woman Militia commander, short dark reddish-brown hair, green-brown military field jacket and trousers, harness, gloves and communication headset, human body rather than her Titan. Hand-held radio and command gestures; no personal laser cannon. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.ea.com/games/titanfall/titanfall-2",
    "sourceRecord": "CAPABILITIES_LOT_3/sarah_briggs_tf2",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Sarah Briggs transmet les coordonnées",
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
      "name": "Ordre de couverture du Marauder Corps",
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
      "name": "Repli au point de rassemblement de la Milice",
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
    "sourceHeroId": "sarah_briggs_tf2",
    "priorSourceReference": "Sarah Briggs dirige le Marauder Corps de la Milice dans Titanfall 2 ; les trois actions choisissent sa fonction de commandement et d’extraction.",
    "source1to1Verified": false,
    "defenseName": "Repli au point de rassemblement de la Milice",
    "special": {
      "name": "Ordres du Marauder Corps",
      "type": "buff",
      "dmg": 0,
      "color": "#32b5dc",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "buff",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 1200,
        "duration": 5,
        "buffMultiplier": 1.34,
        "reduce": 0.5,
        "healRatio": 0,
        "cleanses": false
      },
      "meterCost": 100
    }
  },
  "john_wick": {
    "universe": "John Wick",
    "sourceWork": "John Wick (2014), nightclub-era black suit",
    "sourceReference": "John Wick (2014), nightclub-era black suit. Adult man with shoulder-length dark hair and short beard, black tailored suit, white shirt, black tie, black shoes, compact two-handed pistol stance. Heckler and Koch P30L with compensator, selected from the2014 film. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.johnwick.movie/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Tir court de Wick",
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
      "name": "Prise et désarmement gun-fu",
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
      "name": "Se couvrir dans l’angle du couloir",
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
    "sourceHeroId": "john_wick",
    "priorSourceReference": "John Wick combine arme de poing et grappling dans le film de 2014 ; la garde est un couvert physique.",
    "source1to1Verified": false,
    "defenseName": "Se couvrir dans l’angle du couloir",
    "special": {
      "name": "Gun-fu de Wick",
      "type": "projectile",
      "dmg": 4.8,
      "color": "#d3c2a9",
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
  "johnny_silverhand_cp": {
    "universe": "Cyberpunk",
    "sourceWork": "Cyberpunk2077 (2020), Johnny Silverhand flashback appearance",
    "sourceReference": "Cyberpunk2077 (2020), Johnny Silverhand flashback appearance. Adult rocker with shoulder-length black hair, stubble, sunglasses, dark sleeveless vest, dog tags, dark trousers and boots, LEFT arm silver cybernetic and RIGHT arm organic. Malorian Arms3516 held in organic right hand; silver left arm may support, no second cybernetic arm. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.cyberpunk.net/",
    "sourceRecord": "CAPABILITIES_LOT_3/johnny_silverhand_cp",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Malorian Arms 3516 de Johnny",
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
      "name": "Revers au pistolet Malorian",
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
      "name": "Couvert du flashback de Silverhand",
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
    "sourceHeroId": "johnny_silverhand_cp",
    "priorSourceReference": "Le Malorian Arms 3516 est l’arme du Johnny des flashbacks de Cyberpunk 2077 ; les gestes restent ceux de ce chargement.",
    "source1to1Verified": false,
    "defenseName": "Couvert du flashback de Silverhand",
    "special": {
      "name": "Malorian Arms 3516",
      "type": "projectile",
      "dmg": 4.3,
      "color": "#d94444",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "single",
        "delivery": "projectile",
        "range": 720
      },
      "meterCost": 100
    }
  },
  "panam_palmer_cp": {
    "universe": "Cyberpunk",
    "sourceWork": "Cyberpunk2077 (2020), Aldecaldo missions with Overwatch",
    "sourceReference": "Cyberpunk2077 (2020), Aldecaldo missions with Overwatch. Adult Aldecaldo woman, dark hair in loose tied-back style, red cropped vest over light top, gray-green fitted utility trousers and boots, no helmet. Overwatch suppressed precision rifle; muzzle remains quiet with no exaggerated unsuppressed fireball. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.cyberpunk.net/",
    "sourceRecord": "CAPABILITIES_LOT_3/panam_palmer_cp",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Overwatch — visée de Panam",
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
      "name": "Repli sous la couverture des Aldecaldos",
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
      "name": "Angle de couverture de Panam",
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
    "sourceHeroId": "panam_palmer_cp",
    "priorSourceReference": "Panam utilise Overwatch et organise des missions avec les Aldecaldos ; le repli est une protection tactique.",
    "source1to1Verified": false,
    "defenseName": "Angle de couverture de Panam",
    "special": {
      "name": "Overwatch — tir de Panam",
      "type": "projectile",
      "dmg": 4.5,
      "color": "#de9952",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "single",
        "delivery": "projectile",
        "range": 900
      },
      "meterCost": 100
    }
  },
  "wolfenstein_machinegames_b_j_blazkowicz": {
    "universe": "Wolfenstein",
    "sourceWork": "Wolfenstein: The New Order (2014),1960 resistance campaign",
    "sourceReference": "Wolfenstein: The New Order (2014),1960 resistance campaign. Muscular adult man with very short fair hair, rugged brown-gray resistance jacket and dark field trousers, gloves and boots, no later cybernetic body or Laserkraft arm. Hand-held Laserkraftwerk with visible forward prongs and blue emitter; ordinary poses retain this selected weapon. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://bethesda.net/en/game/wolfenstein",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Fusil de Blazkowicz",
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
      "name": "Tir du Laserkraftwerk",
      "type": "beam",
      "dmg": 1.8,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "beam",
        "shape": "line",
        "range": 520,
        "targetSide": "enemy",
        "lineWidth": 32
      }
    },
    "defense": {
      "name": "Couvert de la résistance de Blazkowicz",
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
    "sourceHeroId": "wolfenstein_machinegames_b_j_blazkowicz",
    "priorSourceReference": "B.J. emploie le Laserkraftwerk dans The New Order ; le rayon est une adaptation de cette arme et non un pouvoir corporel. Base/secondary/defense: Arsenal de The New Order dans la continuité MachineGames.",
    "source1to1Verified": false,
    "defenseName": "Couvert de la résistance de Blazkowicz",
    "special": {
      "name": "Laserkraftwerk de Blazkowicz",
      "type": "beam",
      "dmg": 4.5,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "line",
        "delivery": "beam",
        "range": 730,
        "lineWidth": 42
      },
      "color": "#b8b19d",
      "meterCost": 100
    }
  },
  "wolfenstein_machinegames_anya_oliwa": {
    "universe": "Wolfenstein",
    "sourceWork": "Wolfenstein: The New Order (2014),1960 Berlin resistance ally",
    "sourceReference": "Wolfenstein: The New Order (2014),1960 Berlin resistance ally. Adult brown-haired woman in modest civilian resistance clothing, cream shirt under dark blue cardigan/jacket, practical dark skirt or trousers and shoes, no supersoldier armour. Small radio and mission notes; information support, not a firearm or supernatural blast. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://bethesda.net/en/game/wolfenstein",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Anya transmet l’état de mission",
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
      "name": "Anya prépare le repli des résistants",
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
      "name": "Anya protège le poste radio",
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
    "sourceHeroId": "wolfenstein_machinegames_anya_oliwa",
    "priorSourceReference": "Anya participe à la résistance et à ses communications ; l’appui de l’équipe ne lui attribue aucune arme ou force surnaturelle empruntée. Base/secondary/defense: Alliée et communicante de la résistance, sans pouvoir de supersoldat.",
    "source1to1Verified": false,
    "defenseName": "Anya protège le poste radio",
    "special": {
      "name": "Transmission de la résistance d’Anya",
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
      "color": "#b8b19d",
      "meterCost": 100
    }
  },
  "wolfenstein_machinegames_set_roth": {
    "universe": "Wolfenstein",
    "sourceWork": "Wolfenstein: The New Order (2014),1960 Berlin resistance engineer",
    "sourceReference": "Wolfenstein: The New Order (2014),1960 Berlin resistance engineer. Elderly thin man, unruly white-gray hair and beard, round spectacles, light worn engineer coat over dark practical clothing, tool belt and closed shoes; no camp uniform. Small hand tool and technology component; equipment maintenance, no magic staff or healing beam. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://bethesda.net/en/game/wolfenstein",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Set vérifie le raccord d’équipement",
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
      "name": "Set calibre la technologie Da’at Yichud",
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
      "name": "Set reste derrière le poste de travail",
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
    "sourceHeroId": "wolfenstein_machinegames_set_roth",
    "priorSourceReference": "Set Roth est l’ingénieur et savant de la résistance lié aux technologies Da’at Yichud ; l’entretien améliore abstraitement l’équipement allié, sans soin magique. Base/secondary/defense: Ingénieur de la résistance ; entretien sans magie ou soin médical inventé.",
    "source1to1Verified": false,
    "defenseName": "Set reste derrière le poste de travail",
    "special": {
      "name": "Maintenance des équipements par Set Roth",
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
      "color": "#b8b19d",
      "meterCost": 100
    }
  },
  "remember_me_nilin_chasseuse_de_memoires": {
    "universe": "Remember Me",
    "sourceWork": "Remember Me (2013), default Nilin outfit",
    "sourceReference": "Remember Me (2013), default Nilin outfit. Athletic adult memory hunter with short dark asymmetrical hair, fitted white cropped jacket over dark top, orange-brown trousers and dark boots, orange Sensen implant/gauntlet details. Unarmed Pressen strikes with Sensen gauntlet; no hand-held sword or gun. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://store.steampowered.com/app/228300/Remember_Me/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Pressen de puissance de Nilin",
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
      "cd": 8,
      "name": "Pressen de régénération de Nilin",
      "type": "heal",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "heal",
        "delivery": "support",
        "shape": "single",
        "range": 760,
        "targetSide": "self",
        "healRatio": 0.15
      }
    },
    "defense": {
      "name": "Esquive de Nilin dans Neo-Paris",
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
    "sourceHeroId": "remember_me_nilin_chasseuse_de_memoires",
    "priorSourceReference": "Sensen Fury est une capacité de combat de Nilin ; la rafale Pressen est simplifiée en séquence rapprochée, sans copier la durée ou les frames du jeu source. Base/secondary/defense: Puissance et régénération du Combo Lab ; soin du combo adapté.",
    "source1to1Verified": false,
    "defenseName": "Esquive de Nilin dans Neo-Paris",
    "special": {
      "name": "Sensen Fury de Nilin",
      "type": "melee",
      "dmg": 4.5,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "multi",
        "delivery": "melee",
        "range": 170,
        "maxTargets": 3
      },
      "color": "#b3cdd2",
      "meterCost": 100
    }
  },
  "caine_jw": {
    "universe": "John Wick",
    "sourceWork": "John Wick: Chapter4 (2023), cane-sword appearance",
    "sourceReference": "John Wick: Chapter4 (2023), cane-sword appearance. Adult man with short dark hair, round black sunglasses, dark high-collared shirt and tailored dark suit and shoes, calm listening posture. Straight steel blade drawn from walking cane; no supernatural sight or energy slash. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.johnwick.movie/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Estoc de la canne-épée",
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
      "name": "Riposte de Caine à l’écoute",
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
      "name": "Déviation de la canne de Caine",
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
    "sourceHeroId": "caine_jw",
    "priorSourceReference": "Caine utilise son ouïe et sa canne-épée dans Chapter 4 ; l’écoute ne devient pas une vision surnaturelle.",
    "source1to1Verified": false,
    "defenseName": "Déviation de la canne de Caine",
    "special": {
      "name": "Lame de la canne de Caine",
      "type": "melee",
      "dmg": 4.7,
      "color": "#d2d6d7",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "single",
        "delivery": "melee",
        "range": 170
      },
      "meterCost": 100
    }
  },
  "remember_me_bad_request_infiltration": {
    "universe": "Remember Me",
    "sourceWork": "Remember Me (2013), Episode2 Macrowave before imprisonment",
    "sourceReference": "Remember Me (2013), Episode2 Macrowave before imprisonment. Adult male Errorist memory hunter, brown skin, short brown cornrow/fade hairstyle, practical dark urban jacket with lighter shirt, trousers and boots, visible compact Sensen equipment; no prison restraints. Sensen/remembrane routing gesture and compact hand device; not a combat memory-remix attack. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://rememberme.fandom.com/wiki/Bad_Request",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Bad Request relève le point d’entrée",
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
      "name": "Bad Request ouvre la voie d’infiltration",
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
      "name": "Bad Request quitte la surveillance",
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
    "sourceHeroId": "remember_me_bad_request_infiltration",
    "priorSourceReference": "Bad Request est un allié mémoriste et infiltrateur ; le super représente son appui au parcours de Nilin, pas une technique de réécriture offensive nouvellement inventée. Base/secondary/defense: Allié mémoriste infiltrateur, sans remix offensif non attesté.",
    "source1to1Verified": false,
    "defenseName": "Bad Request quitte la surveillance",
    "special": {
      "name": "Itinéraire d’infiltration de Bad Request",
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
      "color": "#b3cdd2",
      "meterCost": 100
    }
  },
  "hellblade_senua": {
    "universe": "Hellblade: Senua’s Sacrifice",
    "sourceWork": "Hellblade: Senua’s Sacrifice (2017), early journey before first Hela encounter, initial steel sword",
    "sourceReference": "Hellblade: Senua’s Sacrifice (2017), early journey before first Hela encounter, initial steel sword. Young adult Pict warrior, dark brown braided high ponytail, leather headpiece with silver central blue-stone ornament, woad-blue paint around eyes and on LEFT arm, fur collar with Celtic brooch, patterned leather and plaid clothing, bare arms, sword belt, closed boots, closed cloth pouch at left hip and small iron mirror at right hip; no exposed severed head or later HellbladeII armour. Initial right-handed steel sword with ring pommel; polished LaTene iron mirror for Focus, not late-game Gramr. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://store.steampowered.com/news/posts/?appids=414340&enddate=1505995301&feed=steam_community_announcements",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Taille de l’épée de Senua",
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
      "name": "Focus du miroir de Senua",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "single",
        "range": 760,
        "targetSide": "self",
        "duration": 3,
        "buffMultiplier": 1.12
      }
    },
    "defense": {
      "name": "Parade de l’épée de Senua",
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
    "sourceHeroId": "hellblade_senua",
    "priorSourceReference": "Hellblade: Senua's Sacrifice : le Focus associé au miroir de Senua ralentit sa perception pendant les combats ; concentration temporaire adaptée, sans magie offensive inventée. Base/secondary/defense: Épée et Focus du premier Hellblade, sans attaque liée à un diagnostic réel.",
    "source1to1Verified": false,
    "defenseName": "Parade de l’épée de Senua",
    "special": {
      "name": "Concentration du miroir de Senua",
      "type": "buff",
      "dmg": 0,
      "color": "#dc743b",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "buff",
        "targetSide": "self",
        "shape": "single",
        "delivery": "support",
        "range": 1,
        "buffMultiplier": 1.45,
        "duration": 6
      },
      "meterCost": 100
    }
  },
  "john_rambo": {
    "sourceHeroId": "john_rambo",
    "universe": "Rambo",
    "sourceWork": "Rambo: First Blood PartII (1985), jungle bow appearance",
    "sourceReference": "Rambo: First Blood PartII (1985), jungle bow appearance. Muscular adult man with long dark hair, red headband, bare upper torso, olive military trousers, black boots and quiver; non-graphic neutral battle sprite. Film compound bow with one selected arrow; no fabrication detail, no firearm replacing bow. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.studiocanal.com/title/rambo-first-blood-part-ii-1985/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coup rapproché du soldat Rambo",
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
      "name": "Flèche de l’arc de Rambo",
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
      "name": "Repli derrière la végétation",
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
    "priorSourceReference": "First Blood Part II montre Rambo avec son arc et ses aptitudes militaires ; les gestes ne détaillent aucune fabrication d’arme.",
    "source1to1Verified": false,
    "defenseName": "Repli derrière la végétation",
    "special": {
      "name": "Flèche explosive de Rambo",
      "type": "explosive_aoe",
      "dmg": 4.5,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "area",
        "delivery": "projectile",
        "range": 700,
        "areaRadius": 115
      },
      "color": "#ced59c",
      "meterCost": 100
    }
  },
  "sam_trautman": {
    "sourceHeroId": "sam_trautman",
    "universe": "Rambo",
    "sourceWork": "Rambo: First Blood PartII (1985), colonel and radio contact",
    "sourceReference": "Rambo: First Blood PartII (1985), colonel and radio contact. Older adult military colonel, short gray-brown hair, olive service/field uniform and beret, black belt and boots, no Rambo red headband or bare torso. Hand-held military radio and restrained command gestures, no explosive arrows. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.studiocanal.com/title/rambo-first-blood-part-ii-1985/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Trautman vérifie la liaison radio",
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
      "name": "Transmettre la consigne d’extraction",
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
      "name": "Couvert du poste radio du colonel",
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
    "priorSourceReference": "Trautman est le supérieur et contact radio de Rambo ; il coordonne plutôt que dupliquer les exploits physiques du soldat.",
    "source1to1Verified": false,
    "defenseName": "Couvert du poste radio du colonel",
    "special": {
      "name": "Consigne radio du colonel Trautman",
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
      "color": "#ced59c",
      "meterCost": 100
    }
  },
  "daikatana_hiro_miyamoto": {
    "universe": "Daikatana",
    "sourceWork": "John Romero’s Daikatana (2000), Hiro Miyamoto",
    "sourceReference": "John Romero’s Daikatana (2000), Hiro Miyamoto. Adult Japanese swordsman, long tied-back black hair, green and dark layered combat tunic and trousers, forearm guards and boots, no modern anime uniform. Physical Daikatana sword held in right hand with controlled support, no detached beam replacing blade. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.gog.com/en/game/daikatana",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coupe courte de la Daikatana",
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
      "name": "Taille appuyée de Hiro",
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
      "name": "Parade de la Daikatana",
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
    "sourceHeroId": "daikatana_hiro_miyamoto",
    "priorSourceReference": "Hiro utilise l’épée Daikatana au fil des époques ; cette taille adapte l’arme réelle du jeu, sans inventer une téléportation offensive. Base/secondary/defense: Épée de Hiro au fil des époques, sans téléportation offensive.",
    "source1to1Verified": false,
    "defenseName": "Parade de la Daikatana",
    "special": {
      "name": "Taille de la Daikatana",
      "type": "melee",
      "dmg": 4.5,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "single",
        "delivery": "melee",
        "range": 170
      },
      "color": "#b8c5a3",
      "meterCost": 100
    }
  },
  "daikatana_mikiko_ebihara": {
    "universe": "Daikatana",
    "sourceWork": "John Romero’s Daikatana (2000), Mikiko Ebihara with selected episode1 arsenal",
    "sourceReference": "John Romero’s Daikatana (2000), Mikiko Ebihara with selected episode1 arsenal. Adult Japanese woman, short dark hair, fitted red/dark futuristic combat clothing, utility belt and boots; no sword replacing selected gun. Selected shared Ion Blaster from episode1; green charge/discharge at its barrel, not a personal innate power. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.gog.com/en/game/daikatana",
    "identityBasis": "authored-universe-canon",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Tir d’arsenal de Mikiko",
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
      "name": "Ion Blaster de Mikiko",
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
      "name": "Couvert de Mikiko dans le laboratoire",
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
    "sourceHeroId": "daikatana_mikiko_ebihara",
    "priorSourceReference": "Mikiko accompagne Hiro et utilise l’arsenal disponible ; l’Ion Blaster appartient au premier épisode. Ce choix de charge équipée est une adaptation d’arsenal, pas une technique exclusive. Base/secondary/defense: Arsenal de campagne partagé ; chargement équipé et déclaré adapté.",
    "source1to1Verified": false,
    "defenseName": "Couvert de Mikiko dans le laboratoire",
    "special": {
      "name": "Ion Blaster — couverture de Mikiko",
      "type": "bullet",
      "dmg": 4.5,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "single",
        "delivery": "projectile",
        "range": 720
      },
      "color": "#b8c5a3",
      "meterCost": 100
    }
  },
  "daikatana_superfly_johnson": {
    "universe": "Daikatana",
    "sourceWork": "John Romero’s Daikatana (2000), Superfly Johnson with selected episode1 arsenal",
    "sourceReference": "John Romero’s Daikatana (2000), Superfly Johnson with selected episode1 arsenal. Large muscular dark-skinned adult man, close-shaven head, practical dark futuristic armour and trousers, large boots and gloves. Selected shared Sidewinder episode1 weapon, held with both hands; not an exclusive supernatural power. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.gog.com/en/game/daikatana",
    "identityBasis": "authored-universe-canon",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Tir de soutien de Superfly",
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
      "name": "Sidewinder de Superfly",
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
      "name": "Repli de Superfly derrière les caisses",
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
    "sourceHeroId": "daikatana_superfly_johnson",
    "priorSourceReference": "Superfly combat aux côtés de Hiro avec les armes du jeu ; le Sidewinder est choisi dans cet arsenal commun. Son attribution ici est un équipement adapté, pas un superpouvoir personnel. Base/secondary/defense: Armes de campagne et couvert, sans pouvoir individuel.",
    "source1to1Verified": false,
    "defenseName": "Repli de Superfly derrière les caisses",
    "special": {
      "name": "Sidewinder — rafale de Superfly",
      "type": "bullet",
      "dmg": 4.5,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "single",
        "delivery": "projectile",
        "range": 720
      },
      "color": "#b8c5a3",
      "meterCost": 100
    }
  },
  "dead_rising_frank_west": {
    "universe": "Dead Rising",
    "sourceWork": "Dead Rising (2006), default Frank West",
    "sourceReference": "Dead Rising (2006), default Frank West. Stocky adult photojournalist with short dark hair, gray-brown blazer over open light shirt, dark trousers and shoes, camera hanging from neck strap. Unarmed Double Lariat, arms extended in a compact spin; camera stays strapped, not used as a gun. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.capcom.com/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coup de poing de Frank West",
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
      "name": "Photographie de repérage de Frank",
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
      "name": "Retrait derrière l’étal du centre commercial",
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
    "sourceHeroId": "dead_rising_frank_west",
    "priorSourceReference": "Frank peut apprendre le Double Lariat dans le premier Dead Rising ; le mouvement de lutte est simplifié en frappe propre sans détail de blessure. Base/secondary/defense: Compétences physiques et appareil de journaliste dans Dead Rising 1.",
    "source1to1Verified": false,
    "defenseName": "Retrait derrière l’étal du centre commercial",
    "special": {
      "name": "Double Lariat de Frank",
      "type": "melee",
      "dmg": 4.5,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "single",
        "delivery": "melee",
        "range": 170
      },
      "color": "#c4b394",
      "meterCost": 100
    }
  },
  "dead_rising_chuck_greene": {
    "universe": "Dead Rising",
    "sourceWork": "Dead Rising2 (2010), default Chuck Greene",
    "sourceReference": "Dead Rising2 (2010), default Chuck Greene. Adult blond short-haired biker, yellow motorcycle jacket with dark sleeves/trim, black protective trousers and boots, light stubble. Paddlesaw combined weapon held physically in both hands; no assembly instructions and no detached saw blades. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.capcom.com/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coup de batte de Chuck",
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
      "name": "Swing de l’arme combinée de Chuck",
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
      "name": "Repli derrière le banc d’atelier",
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
    "sourceHeroId": "dead_rising_chuck_greene",
    "priorSourceReference": "Chuck fabrique la Paddlesaw dans Dead Rising 2 à partir des éléments de l’atelier ; ce super reprend une arme combinée du jeu, sans recette de construction réelle. Base/secondary/defense: Objets et armes combinées de Dead Rising 2, sans recette réelle.",
    "source1to1Verified": false,
    "defenseName": "Repli derrière le banc d’atelier",
    "special": {
      "name": "Paddlesaw de Chuck",
      "type": "melee",
      "dmg": 4.5,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "single",
        "delivery": "melee",
        "range": 170
      },
      "color": "#c4b394",
      "meterCost": 100
    }
  },
  "dead_rising_nick_ramos": {
    "universe": "Dead Rising",
    "sourceWork": "Dead Rising3 (2013), default Nick Ramos",
    "sourceReference": "Dead Rising3 (2013), default Nick Ramos. Young adult mechanic with short dark hair, dark blue mechanic overalls over light undershirt, work belt and brown work boots. Sledge Saw held physically with both hands; no construction instructions and no thrown blade. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.capcom.com/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Outil de mécanicien de Nick",
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
      "name": "Réparation du passage par Nick",
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
      "name": "Couvert de l’atelier de Nick",
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
    "sourceHeroId": "dead_rising_nick_ramos",
    "priorSourceReference": "Nick utilise les armes combinées de Dead Rising 3, dont la Sledge Saw ; le coup est une adaptation de cet équipement, distinct du journalisme de Frank. Base/secondary/defense: Nick conserve son rôle de mécanicien de Dead Rising 3.",
    "source1to1Verified": false,
    "defenseName": "Couvert de l’atelier de Nick",
    "special": {
      "name": "Sledge Saw de Nick",
      "type": "melee",
      "dmg": 4.5,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "single",
        "delivery": "melee",
        "range": 170
      },
      "color": "#c4b394",
      "meterCost": 100
    }
  },
  "the_surge_warren": {
    "universe": "The Surge",
    "sourceWork": "The Surge (2017), Warren with selected early Lynx exo-rig",
    "sourceReference": "The Surge (2017), Warren with selected early Lynx exo-rig. Adult male worker with short dark hair, industrial yellow-orange and dark Lynx exo-rig around torso and limbs, work clothing and mechanical boots; no TheSurge2 protagonist. Selected industrial rig tool for basic strikes; VitalInjection uses own rig controls and affects Warren himself. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.deck13.com/games/the-surge",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Frappe de l’outil exo-rig de Warren",
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
      "cd": 8,
      "name": "Charge Vital Injection",
      "type": "heal",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "heal",
        "delivery": "support",
        "shape": "single",
        "range": 760,
        "targetSide": "self",
        "healRatio": 0.15
      }
    },
    "defense": {
      "name": "Garde de l’exo-rig de Warren",
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
    "sourceHeroId": "the_surge_warren",
    "priorSourceReference": "The Surge, premier jeu : l'implant Vital Injection consomme une charge pour rendre de la santé à Warren ; soin technologique de son exo-rig. Base/secondary/defense: Outils et implants du premier The Surge, sans démembrement.",
    "source1to1Verified": false,
    "defenseName": "Garde de l’exo-rig de Warren",
    "special": {
      "name": "Vital Injection de Warren",
      "type": "heal",
      "dmg": 0,
      "color": "#61d8ff",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "heal",
        "targetSide": "self",
        "shape": "single",
        "delivery": "support",
        "range": 1,
        "healRatio": 0.4
      },
      "meterCost": 100
    }
  },
  "the_surge_irina_beckett": {
    "universe": "The Surge",
    "sourceWork": "The Surge (2017), first CentralProductionB encounter before equipment handovers",
    "sourceReference": "The Surge (2017), first CentralProductionB encounter before equipment handovers. Adult female CREO survivor, practical worn industrial work clothing and an incomplete basic exo-rig, uncovered human head, no later completed MGGorgon security armour or helmet. Unarmed communication and route advice at first encounter, before the player gives her a staff. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.neoseeker.com/the-surge/NPCs_and_Side-Quests/Irina",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Irina décrit le secteur CREO",
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
      "name": "Irina indique l’abri de sécurité",
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
      "name": "Irina se met hors de portée",
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
    "sourceHeroId": "the_surge_irina_beckett",
    "priorSourceReference": "The Surge, premier jeu : Irina Beckett est une employée survivante qui échange avec Warren sur son équipement et la sécurité ; soutien d'information, sans arme ou personnage de The Surge 2. Base/secondary/defense: Survivante de soutien du premier jeu, sans arme ajoutée.",
    "source1to1Verified": false,
    "defenseName": "Irina se met hors de portée",
    "special": {
      "name": "Indications d'Irina sur la sécurité CREO",
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
  "rocky_balboa": {
    "universe": "Rocky",
    "sourceWork": "RockyII (1979), title-fight boxing attire",
    "sourceReference": "RockyII (1979), title-fight boxing attire. Muscular adult Italian-American boxer, dark short hair, bare upper torso, black boxing trunks with gold trim, red boxing gloves, white socks and boxing boots; no street jacket. Boxing gloves only; compact jab, hook and boxing footwork, no firearm despite old catalogue weaponType. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.mgm.com/movies/rocky-ii",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Jab de Balboa",
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
      "name": "Crochet au corps de Rocky",
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
      "name": "Garde haute de Rocky",
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
    "sourceHeroId": "rocky_balboa",
    "priorSourceReference": "Rocky boxe avec jabs et crochets ; la garde est une action de boxe, sans transformation ni bonus pharmacologique.",
    "source1to1Verified": false,
    "defenseName": "Garde haute de Rocky",
    "special": {
      "name": "Combinaison de Balboa",
      "type": "melee",
      "dmg": 4.7,
      "color": "#d6b4a4",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "single",
        "delivery": "melee",
        "range": 170
      },
      "meterCost": 100
    }
  },
  "the_darkness_jackie_estacado": {
    "universe": "The Darkness",
    "sourceWork": "The Darkness (2007), Jackie Estacado in first game",
    "sourceReference": "The Darkness (2007), Jackie Estacado in first game. Adult man with long straight dark hair, dark coat over dark shirt, trousers and boots; two compact serpentine Darkness heads attached through shadowy tendrils remain distinct from his human arms. Two restrained Darkness tendrils and a compact black-violet BlackHole manifestation, no gore or borrowed later-game costume. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.xbox.com/en-US/games/store/the-darkness/c035l0ns3sqn",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Pistolet de Jackie Estacado",
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
      "name": "Interception des bras de la Darkness",
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
      "name": "Protection d’ombre de Jackie",
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
    "sourceHeroId": "the_darkness_jackie_estacado",
    "priorSourceReference": "Le Black Hole est un pouvoir de la Darkness utilisé par Jackie dans le premier jeu ; l’impact est présenté comme une distorsion abstraite sans gore. Base/secondary/defense: Armes et manifestations abstraites de la Darkness, sans gore.",
    "source1to1Verified": false,
    "defenseName": "Protection d’ombre de Jackie",
    "special": {
      "name": "Black Hole de Jackie",
      "type": "area",
      "dmg": 4.5,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "area",
        "delivery": "area",
        "range": 530,
        "areaRadius": 135
      },
      "color": "#a597ba",
      "meterCost": 100
    }
  },
  "the_darkness_jenny_romano_soutien": {
    "universe": "The Darkness",
    "sourceWork": "The Darkness (2007), living civilian Jenny before her death",
    "sourceReference": "The Darkness (2007), living civilian Jenny before her death. Adult civilian woman with long auburn-brown hair, simple light casual shirt/cardigan, dark practical trousers and shoes, no spectral body. Reassuring gesture and keepsake; no Darkness tentacles, weapon, magic shield or spectral attack. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.xbox.com/en-US/games/store/the-darkness/c035l0ns3sqn",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Jenny rappelle un repère à Jackie",
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
      "name": "Jenny aide Jackie à garder le cap",
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
      "name": "Jenny rejoint un abri civil",
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
    "sourceHeroId": "the_darkness_jenny_romano_soutien",
    "priorSourceReference": "Jenny demeure un soutien civil de l’histoire de Jackie ; la protection traduit un ancrage affectif de gameplay, sans lui attribuer les pouvoirs de la Darkness. Base/secondary/defense: Soutien affectif civil, sans pouvoir de Darkness transmis.",
    "source1to1Verified": false,
    "defenseName": "Jenny rejoint un abri civil",
    "special": {
      "name": "Souvenir de Jenny — garder le cap",
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
      "color": "#a597ba",
      "meterCost": 100
    }
  },
  "the_darkness_johnny_powell_soutien": {
    "universe": "The Darkness",
    "sourceWork": "The DarknessII (2012), Johnny Powell as scholar at Jackie’s residence",
    "sourceReference": "The DarknessII (2012), Johnny Powell as scholar at Jackie’s residence. Middle-aged male scholar with messy dark hair and beard, spectacles, worn jacket over layered shirt, practical trousers and shoes. Book and relic notes only; no Darkness tentacles or offensive spell. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://store.steampowered.com/app/67370/The_Darkness_II/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Johnny Powell lit la relique",
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
      "name": "Johnny explique l’indice de la Brotherhood",
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
      "name": "Johnny reste à sa table d’étude",
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
    "sourceHeroId": "the_darkness_johnny_powell_soutien",
    "priorSourceReference": "Johnny Powell est le conseiller érudit de The Darkness II ; sa connaissance des reliques et de la Brotherhood devient une information d’équipe, pas une attaque occultiste. Base/secondary/defense: Érudit conseiller du second jeu, sans tentacule ou arme.",
    "source1to1Verified": false,
    "defenseName": "Johnny reste à sa table d’étude",
    "special": {
      "name": "Lecture des reliques par Johnny Powell",
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
      "color": "#a597ba",
      "meterCost": 100
    }
  },
  "chumbucket_mm": {
    "universe": "Mad Max",
    "sourceWork": "Mad Max (2015), Chumbucket as MagnumOpus mechanic",
    "sourceReference": "Mad Max (2015), Chumbucket as MagnumOpus mechanic. Hunched thin adult mechanic with scarred bald head, rough goggles, patched brown work clothing and leather harness, tools and work boots, recognisable stooped posture. Small wrench and repair/tool gesture; preparation of vehicle equipment, no healing of biological wounds. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.madmaxgame.com/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Chumbucket écoute le moteur",
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
      "name": "Réparer et préparer le Magnum Opus",
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
      "name": "Couvert derrière la carrosserie",
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
    "sourceHeroId": "chumbucket_mm",
    "priorSourceReference": "Chumbucket entretient le Magnum Opus du jeu Mad Max ; la réparation devient préparation protectrice et ne soigne pas des blessures humaines.",
    "source1to1Verified": false,
    "defenseName": "Couvert derrière la carrosserie",
    "special": {
      "name": "Réparation du Magnum Opus",
      "type": "guard",
      "dmg": 0,
      "color": "#c9b087",
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
  "aya_brea": {
    "universe": "Parasite Eve",
    "sourceWork": "Parasite Eve (1998), Aya NYPD field outfit and Liberate form",
    "sourceReference": "Parasite Eve (1998), Aya NYPD field outfit and Liberate form. Adult blonde NYPD officer with shoulder-length hair, blue-gray field jacket over light top, blue jeans and black boots, pistol retained for ordinary actions. In Liberate super ONLY she transforms into a pale cyan-white mitochondrial humanoid creature with wing-like arm appendages, neutral non-sexual complete body, then returns human; no Eve red dress or ThirdBirthday costume. Service handgun for ordinary actions; Liberate uses mitochondrial transformed-body strikes, never a pistol beam or a simple stat-buff. Liberate has seven attacks before returning human; one selected enemy and0.7s recovery stun are bounded crossover adaptations. Four drawings do not claim seven official animation frames.",
    "sourceUrl": "https://shrines.rpgclassics.com/psx/pe/pe.shtml",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Arme de service d’Aya",
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
      "cd": 8,
      "name": "Parasite Energy — Heal d’Aya",
      "type": "heal",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "heal",
        "delivery": "support",
        "shape": "single",
        "range": 760,
        "targetSide": "self",
        "healRatio": 0.15
      }
    },
    "defense": {
      "name": "Parasite Energy — Barrier d’Aya",
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
    "sourceHeroId": "aya_brea",
    "priorSourceReference": "Aya utilise arme de poing, Heal et Barrier dans Parasite Eve ; Heal restaure ses propres PV et ne soigne pas les compagnons. Ces capacités appartiennent à cette héroïne et non à Daniel Dollis.",
    "source1to1Verified": false,
    "defenseName": "Parasite Energy — Barrier d’Aya",
    "special": {
      "name": "Liberate — sept assauts mitochondriaux",
      "type": "melee",
      "dmg": 4.65,
      "color": "#ff5f4a",
      "animationDuration": 1.8,
      "hitAt": 0.45,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 190,
        "targetSide": "enemy",
        "maxTargets": 1,
        "hitSequence": {
          "kind": "liberate",
          "hitCount": 7,
          "firstAt": 0.45,
          "lastAt": 1.45,
          "nativeRecoveryAfter": 1.55,
          "sourceHitCountVerified": true,
          "engineTimingsAdapted": true
        },
        "postSequenceStunDuration": 0.7
      },
      "meterCost": 100,
      "hitSequence": {
        "kind": "liberate",
        "hitCount": 7,
        "firstAt": 0.45,
        "lastAt": 1.45,
        "nativeRecoveryAfter": 1.55,
        "sourceHitCountVerified": true,
        "engineTimingsAdapted": true
      },
      "postSequenceStunDuration": 0.7
    }
  },
  "daniel_dollis": {
    "universe": "Parasite Eve",
    "sourceWork": "Parasite Eve (1998), NYPD detective Daniel Dollis",
    "sourceReference": "Parasite Eve (1998), NYPD detective Daniel Dollis. Tall broad dark-skinned adult detective, very short dark hair, red-brown police casual jacket over light shirt, dark trousers and shoes, no mitochondrial body or Aya costume. Service pistol held in human hands, no ParasiteEnergy transferred from Aya. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.creativeuncut.com/gallery-01/pe-daniel-dollis.html",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Pistolet du détective Dollis",
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
      "name": "Couvrir le retrait du partenaire NYPD",
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
      "name": "Couvert de Daniel dans New York",
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
    "sourceHeroId": "daniel_dollis",
    "priorSourceReference": "Daniel est détective armé du NYPD ; la table ne lui transfère pas les pouvoirs mitochondriaux d’Aya.",
    "source1to1Verified": false,
    "defenseName": "Couvert de Daniel dans New York",
    "special": {
      "name": "Couverture au pistolet de Daniel Dollis",
      "type": "projectile",
      "dmg": 3.1,
      "color": "#ff826d",
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
  "maeda_pe": {
    "universe": "Parasite Eve",
    "sourceWork": "Parasite Eve (1998), Kunihiko Maeda as civilian scientist",
    "sourceReference": "Parasite Eve (1998), Kunihiko Maeda as civilian scientist. Slim adult Japanese scientist, short dark hair, spectacles, conservative brown-gray suit/jacket over light shirt and tie, dark trousers and shoes; no invented combat armour. Scientific notes and small research document; no personal mitochondrial powers. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.creativeuncut.com/gallery-01/pe-kunihiko-maeda.html",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Maeda examine l’indice biologique",
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
      "name": "Expliquer la piste mitochondriale",
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
      "name": "Retrait du scientifique derrière le groupe",
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
    "sourceHeroId": "maeda_pe",
    "priorSourceReference": "Maeda fournit son expertise scientifique sur les mitochondries ; ses explications ne sont pas une Parasite Energy personnelle.",
    "source1to1Verified": false,
    "defenseName": "Retrait du scientifique derrière le groupe",
    "special": {
      "name": "Analyse mitochondriale de Maeda",
      "type": "buff",
      "dmg": 0,
      "color": "#dc3c27",
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
  "ishikawa_gits": {
    "universe": "Ghost in the Shell",
    "sourceWork": "Ghost in the Shell: Stand Alone Complex (2002), Section9 Ishikawa",
    "sourceReference": "Ghost in the Shell: Stand Alone Complex (2002), Section9 Ishikawa. Older stocky adult Section9 analyst, full gray beard and gray hair, dark practical jacket and trousers, discreet cybernetic communications, no powered exosuit. Hand-held network terminal and listening gesture; no guaranteed magical hacking damage. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://theghostintheshell.jp/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Ishikawa lit les données du réseau",
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
      "name": "Recouper l’intrusion de la Section 9",
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
      "name": "Se déconnecter derrière le terminal",
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
    "sourceHeroId": "ishikawa_gits",
    "priorSourceReference": "Ishikawa collecte et analyse l’information ; l’intrusion réseau est un soutien et non un dégât magique garanti.",
    "source1to1Verified": false,
    "defenseName": "Se déconnecter derrière le terminal",
    "special": {
      "name": "Intrusion réseau de la Section 9",
      "type": "buff",
      "dmg": 0,
      "color": "#7f8c8d",
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
  "tachikoma": {
    "universe": "Ghost in the Shell",
    "sourceWork": "Ghost in the Shell: Stand Alone Complex (2002), standard blue Tachikoma",
    "sourceReference": "Ghost in the Shell: Stand Alone Complex (2002), standard blue Tachikoma. Bright blue four-legged spider-like Section9 multiped tank, rounded body and white circular sensors, two small manipulator arms, wheel-feet and visible ventral cannon; no human legs or human face. Integrated abdominal grenade launcher and integral machine gun; grenade emerges from physical ventral barrel. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://theghostintheshell.jp/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Mitrailleuse du Tachikoma",
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
      "name": "Grenade du lanceur abdominal",
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
      "name": "Blindage du Tachikoma",
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
    "sourceHeroId": "tachikoma",
    "priorSourceReference": "Le Tachikoma est un blindé de la Section 9 doté d’armement intégré ; les gestes utilisent ces équipements.",
    "source1to1Verified": false,
    "defenseName": "Blindage du Tachikoma",
    "special": {
      "name": "Grenade du lanceur abdominal",
      "type": "projectile",
      "dmg": 3.3,
      "color": "#3498db",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "area",
        "delivery": "projectile",
        "range": 520,
        "areaRadius": 90,
        "maxTargets": 4
      },
      "meterCost": 100
    }
  },
  "bioshock_rapture_tenenbaum": {
    "universe": "BioShock",
    "sourceWork": "BioShock (2007), Brigid Tenenbaum in Rapture",
    "sourceReference": "BioShock (2007), Brigid Tenenbaum in Rapture. Adult female physician with brown hair tied back, conservative worn pale medical coat over dark1950s clothing, practical skirt/trousers and shoes, no LittleSister child body. Medical/research case and supportive gesture; no offensive plasmid or hand fireballs. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://store.steampowered.com/app/7670/BioShock/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Observer les symptômes avec Tenenbaum",
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
      "name": "Assistance contre le conditionnement",
      "type": "cleanse",
      "dmg": 0,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "cleanse",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "cleanses": true
      }
    },
    "defense": {
      "name": "Refuge des Petites Sœurs",
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
    "sourceHeroId": "bioshock_rapture_tenenbaum",
    "priorSourceReference": "Tenenbaum est médecin et protectrice des Little Sisters ; étude, assistance et refuge ne lui prêtent pas de plasmide offensif.",
    "source1to1Verified": false,
    "defenseName": "Refuge des Petites Sœurs",
    "special": {
      "name": "Assistance médicale de Tenenbaum",
      "type": "cleanse",
      "dmg": 0,
      "color": "#d5e2d7",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "cleanse",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "cleanses": true
      },
      "meterCost": 100
    }
  },
  "houston_pd": {
    "universe": "Payday",
    "sourceWork": "PAYDAY2 (2013), Houston with default mask and lightweight heist suit",
    "sourceReference": "PAYDAY2 (2013), Houston with default mask and lightweight heist suit. Adult male heister with short dark hair, characteristic pale mask with green brow markings and dark mouth details, dark suit, tie, blue gloves and dress shoes; not Hoxton’s burned mask. Unarmed route/reconnaissance gestures for the selected Crook extraction role, no Burglar claim or magic dodge aura. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.paydaythegame.com/payday2/",
    "sourceRecord": "CAPABILITIES_LOT_3/houston_pd",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Houston reconnaît le chemin du casse",
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
      "name": "Repli coordonné du Crook de Houston",
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
      "name": "Écart sous le couvert du Crook",
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
    "sourceHeroId": "houston_pd",
    "priorSourceReference": "PAYDAY 2 associe Houston au perk deck Crook, qui combine armure légère et esquive ; la reconnaissance et le repli sont des adaptations tactiques, sans lui attribuer Burglar, associé à Clover.",
    "source1to1Verified": false,
    "defenseName": "Écart sous le couvert du Crook",
    "special": {
      "name": "Extraction silencieuse de Houston",
      "type": "guard",
      "dmg": 0,
      "color": "#93ae98",
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
        "reduce": 0.55,
        "healRatio": 0,
        "cleanses": false
      },
      "meterCost": 100
    }
  },
  "apollo_creed": {
    "universe": "Rocky",
    "sourceWork": "Rocky (1976), championship fight patriotic boxing attire",
    "sourceReference": "Rocky (1976), championship fight patriotic boxing attire. Muscular dark-skinned adult boxer, short black hair and moustache, red-white-blue patriotic boxing trunks, red boxing gloves, white socks and boxing boots, bare upper torso. Boxing gloves only, agile jab-cross and footwork; no firearm despite old catalogue weaponType. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.mgm.com/movies/rocky",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Jab d’Apollo",
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
      "name": "Croisé du champion Creed",
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
      "name": "Pas d’esquive d’Apollo",
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
    "sourceHeroId": "apollo_creed",
    "priorSourceReference": "Apollo emploie vitesse de pieds et combinaisons de boxe pendant ses combats ; les gestes restent de cette discipline.",
    "source1to1Verified": false,
    "defenseName": "Pas d’esquive d’Apollo",
    "special": {
      "name": "Jab-cross d’Apollo",
      "type": "melee",
      "dmg": 4.6,
      "color": "#d5bf9b",
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "single",
        "delivery": "melee",
        "range": 170
      },
      "meterCost": 100
    }
  },
  "david_dc2": {
    "universe": "Dino Crisis",
    "sourceWork": "Dino Crisis2 (2000), TRAT field pilot David Fork",
    "sourceReference": "Dino Crisis2 (2000), TRAT field pilot David Fork. Adult TRAT operative, short dark hair under red beret/bandanna, green tactical vest and field trousers, fingerless gloves and combat boots; not a character from firstDinoCrisis. Selected TRAT field rifle used for conventional armed cover, no dinosaur mutation or helicopter body. Bounded runtime adaptation, no source-frame certification.",
    "sourceUrl": "https://www.capcom.com/",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Tir du TRAT David",
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
      "name": "Préparer la récupération aérienne",
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
      "name": "Se couvrir près du véhicule",
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
    "sourceHeroId": "david_dc2",
    "priorSourceReference": "David Fork est membre du TRAT et pilote ; arme de terrain et soutien d’extraction restent dans son rôle de Dino Crisis 2.",
    "source1to1Verified": false,
    "defenseName": "Se couvrir près du véhicule",
    "special": {
      "name": "Couverture de David Fork",
      "type": "projectile",
      "dmg": 4.5,
      "color": "#c4b99d",
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
  "tank_matrix": {
    "universe": "The Matrix",
    "sourceWork": "The Matrix (1999), Tank as living Nebuchadnezzar operator",
    "sourceReference": "The Matrix (1999), Tank as living Nebuchadnezzar operator. Adult shipboard operator with medium-brown skin and short dark hair, worn earth-toned knit sweater, work trousers and boots, simple communication earpiece/headset, no black Matrix trenchcoat, no Agent sunglasses and no implanted headjack. A small physical shipboard console/keyboard is his support instrument, not a magical floating screen.. Operator support is an adapted game role, not source frames.",
    "sourceUrl": "https://www.warnerbros.com/movies/matrix",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Tank lit la ligne du code",
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
      "name": "Charger le programme d’entraînement demandé",
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
      "name": "Protection du poste d’opérateur de Tank",
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
    "sourceHeroId": "tank_matrix",
    "priorSourceReference": "Tank est opérateur du Nebuchadnezzar ; ses programmes fournissent un soutien et ne lui inventent pas un corps projeté dans la Matrix.",
    "source1to1Verified": false,
    "defenseName": "Protection du poste d’opérateur de Tank",
    "special": {
      "name": "Chargement d'entraînement de Tank",
      "type": "buff",
      "dmg": 0,
      "color": "#27ae60",
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
  }
});
