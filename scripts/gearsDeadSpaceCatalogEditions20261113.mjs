import assert from 'node:assert/strict';
// Additive exact catalog editions for the9899 Gears/Dead Space batch.
// Historical plans and earlier edition fixtures remain unchanged.
export const GEARS_DEADSPACE_CATALOG_EDITIONS_20261113 = Object.freeze({
  "marcus": {
    "id": "marcus",
    "universe": "Gears of War",
    "incarnation": "Gears of War 2 (2008), Marcus Fenix in original Delta Squad armor",
    "weaponType": "chainsaw",
    "sourceFidelityAudit": "gears-deadspace-040-2026-11-13",
    "slots": {
      "simple": {
        "historical": {
          "name": "Lancer Fire",
          "type": "bullet",
          "dmg": 1
        },
        "current": {
          "name": "Lancer Fire",
          "type": "projectile",
          "dmg": 1,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 640,
            "targetSide": "enemy"
          },
          "slot": "simple",
          "sourceHeroId": "marcus"
        }
      },
      "secondary": {
        "historical": {
          "name": "Chainsaw Lunge",
          "type": "melee",
          "cd": 8,
          "dmg": 2.2
        },
        "current": {
          "cd": 6,
          "name": "Chainsaw Lunge",
          "type": "melee",
          "dmg": 2.2,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "melee",
            "shape": "single",
            "range": 170,
            "targetSide": "enemy"
          },
          "slot": "secondary",
          "sourceHeroId": "marcus"
        }
      },
      "defense": {
        "historical": {
          "name": "Roadie Cover",
          "type": "shield",
          "dur": 2.5,
          "reduce": 0.8
        },
        "current": {
          "name": "Roadie Cover",
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
            "duration": 2.5,
            "reduce": 0.8
          },
          "reduce": 0.8,
          "dur": 2.5,
          "slot": "defense",
          "sourceHeroId": "marcus"
        }
      },
      "special": {
        "historical": {
          "name": "Hammer of Dawn",
          "type": "beam_aoe",
          "dmg": 5,
          "color": "#ff4500"
        },
        "current": {
          "name": "Hammer of Dawn",
          "type": "beam_aoe",
          "dmg": 5,
          "animationDuration": 1.1,
          "hitAt": 0.451,
          "targeting": {
            "effect": "damage",
            "delivery": "beam",
            "shape": "area",
            "range": 640,
            "targetSide": "enemy",
            "areaRadius": 135,
            "maxTargets": 8
          },
          "color": "#ff6a39",
          "meterCost": 100,
          "slot": "special",
          "sourceHeroId": "marcus"
        }
      }
    }
  },
  "dom": {
    "id": "dom",
    "universe": "Gears of War",
    "incarnation": "Gears of War 2 (2008), Dominic Santiago in Delta Squad armor",
    "weaponType": "gun",
    "sourceFidelityAudit": "gears-deadspace-040-2026-11-13",
    "slots": {
      "simple": {
        "historical": {
          "name": "Lancer Cover Fire",
          "type": "bullet",
          "dmg": 1
        },
        "current": {
          "name": "Lancer Cover Fire",
          "type": "projectile",
          "dmg": 1,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 640,
            "targetSide": "enemy"
          },
          "slot": "simple",
          "sourceHeroId": "dom"
        }
      },
      "secondary": {
        "historical": {
          "name": "Gnasher Breach Shot",
          "type": "signature",
          "cd": 7,
          "dmg": 1.8
        },
        "current": {
          "cd": 6,
          "name": "Gnasher Breach Shot",
          "type": "projectile",
          "dmg": 1.8,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "cone",
            "range": 330,
            "targetSide": "enemy",
            "coneAngle": 40,
            "maxTargets": 3
          },
          "slot": "secondary",
          "sourceHeroId": "dom"
        }
      },
      "defense": {
        "historical": {
          "name": "Brotherhood Last Stand",
          "type": "shield",
          "dur": 2,
          "reduce": 0.8
        },
        "current": {
          "name": "Couvert rapproché de Dom",
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
            "duration": 2,
            "reduce": 0.8
          },
          "reduce": 0.8,
          "dur": 2,
          "slot": "defense",
          "sourceHeroId": "dom"
        }
      },
      "special": {
        "historical": {
          "name": "Maria Memory Charge",
          "type": "nexus_aoe",
          "dmg": 4.6,
          "color": "#3498db"
        },
        "current": {
          "name": "Salve de Gnasher de Dom",
          "type": "projectile",
          "dmg": 4.6,
          "animationDuration": 1.1,
          "hitAt": 0.451,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "cone",
            "range": 330,
            "targetSide": "enemy",
            "coneAngle": 40,
            "maxTargets": 3
          },
          "color": "#e2ad5c",
          "meterCost": 100,
          "slot": "special",
          "sourceHeroId": "dom"
        }
      }
    }
  },
  "cole": {
    "id": "cole",
    "universe": "Gears of War",
    "incarnation": "Gears of War 2 (2008), Augustus Cole in original Delta Squad armor",
    "weaponType": "gun",
    "sourceFidelityAudit": "gears-deadspace-040-2026-11-13",
    "slots": {
      "simple": {
        "historical": {
          "name": "Thrashball Tackle",
          "type": "bullet",
          "dmg": 1
        },
        "current": {
          "name": "Tir de Lancer de Cole",
          "type": "projectile",
          "dmg": 1.1,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 640,
            "targetSide": "enemy"
          },
          "slot": "simple",
          "sourceHeroId": "cole"
        }
      },
      "secondary": {
        "historical": {
          "name": "Boomshot Hype Shot",
          "type": "signature",
          "cd": 7,
          "dmg": 1.8
        },
        "current": {
          "cd": 6,
          "name": "Tir rapproché de Gnasher de Cole",
          "type": "projectile",
          "dmg": 1.9,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "cone",
            "range": 330,
            "targetSide": "enemy",
            "coneAngle": 40,
            "maxTargets": 3
          },
          "slot": "secondary",
          "sourceHeroId": "cole"
        }
      },
      "defense": {
        "historical": {
          "name": "Cole Train Brace",
          "type": "shield",
          "dur": 2,
          "reduce": 0.8
        },
        "current": {
          "name": "Garde personnelle de Cole",
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
            "duration": 2,
            "reduce": 0.65
          },
          "reduce": 0.65,
          "dur": 2,
          "slot": "defense",
          "sourceHeroId": "cole"
        }
      },
      "special": {
        "historical": {
          "name": "Cole Train Runs On Whole Grain",
          "type": "nexus_aoe",
          "dmg": 4.6,
          "color": "#f1c40f"
        },
        "current": {
          "name": "Assaut au Lancer de Cole",
          "type": "projectile",
          "dmg": 4.8,
          "animationDuration": 1.1,
          "hitAt": 0.451,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "line",
            "range": 640,
            "targetSide": "enemy",
            "lineWidth": 48,
            "maxTargets": 3
          },
          "color": "#e7b65c",
          "meterCost": 100,
          "slot": "special",
          "sourceHeroId": "cole"
        }
      }
    }
  },
  "baird": {
    "id": "baird",
    "universe": "Gears of War",
    "incarnation": "Gears of War 2 (2008), young Damon Baird in COG field armor",
    "weaponType": "gun",
    "sourceFidelityAudit": "gears-deadspace-040-2026-11-13",
    "slots": {
      "simple": {
        "historical": {
          "name": "Damon Baird Signature Strike",
          "type": "energy",
          "dmg": 1
        },
        "current": {
          "name": "Tir du Lancer de Baird",
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
          "slot": "simple",
          "sourceHeroId": "baird"
        }
      },
      "secondary": {
        "historical": {
          "name": "Damon Baird Breach Technique",
          "type": "signature",
          "cd": 8,
          "dmg": 2.2
        },
        "current": {
          "cd": 6,
          "name": "Vérification de l’équipement COG",
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
            "duration": 2.5,
            "reduce": 0.3
          },
          "slot": "secondary",
          "sourceHeroId": "baird"
        }
      },
      "defense": {
        "historical": {
          "name": "Damon Baird Guard",
          "type": "shield",
          "dur": 2,
          "reduce": 0.75
        },
        "current": {
          "name": "Couvert du mécanicien COG",
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
          "dur": 1.2,
          "slot": "defense",
          "sourceHeroId": "baird"
        }
      },
      "special": {
        "historical": {
          "name": "Damon Baird Origin Burst",
          "type": "origin_aoe",
          "dmg": 4.5,
          "color": "#95a5a6"
        },
        "current": {
          "name": "Maintenance du matériel COG",
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
            "duration": 5,
            "reduce": 0.45
          },
          "color": "#86b8cf",
          "meterCost": 100,
          "slot": "special",
          "sourceHeroId": "baird"
        }
      }
    }
  },
  "anya_stroud": {
    "id": "anya_stroud",
    "universe": "Gears of War",
    "incarnation": "Gears of War 3 (2011), Anya Stroud in frontline COG armor",
    "weaponType": "gun",
    "sourceFidelityAudit": "gears-deadspace-040-2026-11-13",
    "slots": {
      "simple": {
        "historical": {
          "name": "Anya Stroud Signature Strike",
          "type": "bullet",
          "dmg": 1
        },
        "current": {
          "name": "Tir du Lancer Mk2 d’Anya",
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
          },
          "slot": "simple",
          "sourceHeroId": "anya_stroud"
        }
      },
      "secondary": {
        "historical": {
          "name": "Anya Stroud Breach Technique",
          "type": "projectile",
          "cd": 8,
          "dmg": 2.2
        },
        "current": {
          "name": "Visée du Lancer d’Anya",
          "type": "projectile",
          "dmg": 1.85,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 480,
            "targetSide": "enemy"
          },
          "cd": 6,
          "slot": "secondary",
          "sourceHeroId": "anya_stroud"
        }
      },
      "defense": {
        "historical": {
          "name": "Anya Stroud Guard",
          "type": "shield",
          "dur": 2,
          "reduce": 0.75
        },
        "current": {
          "name": "Mise à couvert d’Anya",
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
          "dur": 1.2,
          "slot": "defense",
          "sourceHeroId": "anya_stroud"
        }
      },
      "special": {
        "historical": {
          "name": "Anya Stroud Origin Burst",
          "type": "origin_aoe",
          "dmg": 4.5,
          "color": "#d8d3c0"
        },
        "current": {
          "name": "Rafale du Lancer d’Anya",
          "type": "projectile",
          "dmg": 4.65,
          "animationDuration": 1.1,
          "hitAt": 0.451,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 640,
            "targetSide": "enemy"
          },
          "meterCost": 100,
          "slot": "special",
          "sourceHeroId": "anya_stroud"
        }
      }
    }
  },
  "hoffman_cog": {
    "id": "hoffman_cog",
    "universe": "Gears of War",
    "incarnation": "Gears of War 2 (2008), Colonel Victor Hoffman during the Jacinto defense",
    "weaponType": "gun",
    "sourceFidelityAudit": "gears-deadspace-040-2026-11-13",
    "slots": {
      "simple": {
        "historical": {
          "name": "Colonel Hoffman Signature Strike",
          "type": "bullet",
          "dmg": 1
        },
        "current": {
          "name": "Arme de service du colonel Hoffman",
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
          "slot": "simple",
          "sourceHeroId": "hoffman_cog"
        }
      },
      "secondary": {
        "historical": {
          "name": "Colonel Hoffman Breach Technique",
          "type": "projectile",
          "cd": 8,
          "dmg": 2.2
        },
        "current": {
          "cd": 6,
          "name": "Ordre de défense du commandement COG",
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
          "slot": "secondary",
          "sourceHeroId": "hoffman_cog"
        }
      },
      "defense": {
        "historical": {
          "name": "Colonel Hoffman Guard",
          "type": "shield",
          "dur": 2,
          "reduce": 0.75
        },
        "current": {
          "name": "Position couverte du colonel",
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
          "dur": 1.2,
          "slot": "defense",
          "sourceHeroId": "hoffman_cog"
        }
      },
      "special": {
        "historical": {
          "name": "Colonel Hoffman Origin Burst",
          "type": "origin_aoe",
          "dmg": 4.5,
          "color": "#4d5656"
        },
        "current": {
          "name": "Ordre de mise en défense de Hoffman",
          "type": "guard",
          "dmg": 0,
          "color": "#4d5656",
          "animationDuration": 1.1,
          "hitAt": 0.45,
          "targeting": {
            "effect": "guard",
            "targetSide": "ally",
            "shape": "group",
            "delivery": "support",
            "range": 760,
            "reduce": 0.45,
            "duration": 5
          },
          "slot": "special",
          "sourceHeroId": "hoffman_cog"
        }
      }
    }
  },
  "carmine_cog": {
    "id": "carmine_cog",
    "universe": "Gears of War",
    "incarnation": "Gears of War 3 (2011), specifically adult Clayton Carmine",
    "weaponType": "gun",
    "sourceFidelityAudit": "gears-deadspace-040-2026-11-13",
    "slots": {
      "simple": {
        "historical": {
          "name": "Carmine Signature Strike",
          "type": "bullet",
          "dmg": 1
        },
        "current": {
          "name": "Tir du Lancer de Clayton",
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
          },
          "slot": "simple",
          "sourceHeroId": "carmine_cog"
        }
      },
      "secondary": {
        "historical": {
          "name": "Carmine Breach Technique",
          "type": "projectile",
          "cd": 8,
          "dmg": 2.2
        },
        "current": {
          "name": "Visée du Lancer Mk2 de Clayton",
          "type": "projectile",
          "dmg": 1.85,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 480,
            "targetSide": "enemy"
          },
          "cd": 6,
          "slot": "secondary",
          "sourceHeroId": "carmine_cog"
        }
      },
      "defense": {
        "historical": {
          "name": "Carmine Guard",
          "type": "shield",
          "dur": 2,
          "reduce": 0.75
        },
        "current": {
          "name": "Garde du casque COG de Clayton",
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
          "dur": 1.2,
          "slot": "defense",
          "sourceHeroId": "carmine_cog"
        }
      },
      "special": {
        "historical": {
          "name": "Carmine Origin Burst",
          "type": "origin_aoe",
          "dmg": 4.5,
          "color": "#6c7a89"
        },
        "current": {
          "name": "Rafale du Lancer de Clayton Carmine",
          "type": "projectile",
          "dmg": 4.65,
          "animationDuration": 1.1,
          "hitAt": 0.451,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 640,
            "targetSide": "enemy"
          },
          "meterCost": 100,
          "slot": "special",
          "sourceHeroId": "carmine_cog"
        }
      }
    }
  },
  "kait_diaz": {
    "id": "kait_diaz",
    "universe": "Gears of War",
    "incarnation": "Gears 5 (2019), adult Kait in the winter COG field outfit",
    "weaponType": "gun",
    "sourceFidelityAudit": "gears-deadspace-040-2026-11-13",
    "slots": {
      "simple": {
        "historical": {
          "name": "Kait Diaz Signature Strike",
          "type": "melee",
          "dmg": 1
        },
        "current": {
          "name": "Tir du Lancer Mk3 de Kait",
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
          },
          "slot": "simple",
          "sourceHeroId": "kait_diaz"
        }
      },
      "secondary": {
        "historical": {
          "name": "Kait Diaz Breach Technique",
          "type": "signature",
          "cd": 8,
          "dmg": 2.2
        },
        "current": {
          "name": "Visée de terrain du Lancer de Kait",
          "type": "projectile",
          "dmg": 1.85,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 480,
            "targetSide": "enemy"
          },
          "cd": 6,
          "slot": "secondary",
          "sourceHeroId": "kait_diaz"
        }
      },
      "defense": {
        "historical": {
          "name": "Kait Diaz Guard",
          "type": "shield",
          "dur": 2,
          "reduce": 0.75
        },
        "current": {
          "name": "Mise à couvert de Kait",
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
          "dur": 1.2,
          "slot": "defense",
          "sourceHeroId": "kait_diaz"
        }
      },
      "special": {
        "historical": {
          "name": "Kait Diaz Origin Burst",
          "type": "origin_aoe",
          "dmg": 4.5,
          "color": "#7b241c"
        },
        "current": {
          "name": "Rafale du Lancer de Kait",
          "type": "projectile",
          "dmg": 4.65,
          "animationDuration": 1.1,
          "hitAt": 0.451,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 640,
            "targetSide": "enemy"
          },
          "meterCost": 100,
          "slot": "special",
          "sourceHeroId": "kait_diaz"
        }
      }
    }
  },
  "isaac": {
    "id": "isaac",
    "universe": "Dead Space",
    "incarnation": "Dead Space (2008), Isaac Clarke and level-3 engineering RIG",
    "weaponType": "plasma_cutter",
    "sourceFidelityAudit": "gears-deadspace-040-2026-11-13",
    "slots": {
      "simple": {
        "historical": {
          "name": "Cutter Vertical",
          "type": "laser",
          "dmg": 1.1
        },
        "current": {
          "name": "Tir du Plasma Cutter d’Isaac",
          "type": "projectile",
          "dmg": 1.2,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 580,
            "targetSide": "enemy"
          },
          "slot": "simple",
          "sourceHeroId": "isaac"
        }
      },
      "secondary": {
        "historical": {
          "name": "Stasis Slowdown",
          "type": "gravity",
          "cd": 6,
          "dmg": 1.6
        },
        "current": {
          "name": "Réglage du Plasma Cutter",
          "type": "buff",
          "dmg": 0,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "buff",
            "delivery": "support",
            "shape": "single",
            "range": 1,
            "targetSide": "self",
            "duration": 3,
            "buffMultiplier": 1.12
          },
          "cd": 6,
          "slot": "secondary",
          "sourceHeroId": "isaac"
        }
      },
      "defense": {
        "historical": {
          "name": "RIG Heavy Shield",
          "type": "shield",
          "dur": 2.5,
          "reduce": 0.85
        },
        "current": {
          "name": "Garde de l’ingénieur Isaac",
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
          "dur": 1.2,
          "slot": "defense",
          "sourceHeroId": "isaac"
        }
      },
      "special": {
        "historical": {
          "name": "Telekinetic Smash",
          "type": "gravity_aoe",
          "dmg": 4.9
        },
        "current": {
          "name": "Tir ajusté du Plasma Cutter",
          "type": "projectile",
          "dmg": 4.8,
          "animationDuration": 1.1,
          "hitAt": 0.451,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 650,
            "targetSide": "enemy"
          },
          "meterCost": 100,
          "slot": "special",
          "sourceHeroId": "isaac"
        }
      }
    }
  },
  "carver": {
    "id": "carver",
    "universe": "Dead Space",
    "incarnation": "Dead Space 3 (2013), John Carver in military RIG",
    "weaponType": "gun",
    "sourceFidelityAudit": "gears-deadspace-040-2026-11-13",
    "slots": {
      "simple": {
        "historical": {
          "name": "Security Rifle Burst",
          "type": "bullet",
          "dmg": 1
        },
        "current": {
          "name": "Tir du fusil militaire de Carver",
          "type": "projectile",
          "dmg": 1.2,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 600,
            "targetSide": "enemy"
          },
          "slot": "simple",
          "sourceHeroId": "carver"
        }
      },
      "secondary": {
        "historical": {
          "name": "Co-op Stasis Shot",
          "type": "signature",
          "cd": 7,
          "dmg": 1.8
        },
        "current": {
          "name": "Contrôle du chargeur de Carver",
          "type": "buff",
          "dmg": 0,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "buff",
            "delivery": "support",
            "shape": "single",
            "range": 1,
            "targetSide": "self",
            "duration": 3,
            "buffMultiplier": 1.12
          },
          "cd": 6,
          "slot": "secondary",
          "sourceHeroId": "carver"
        }
      },
      "defense": {
        "historical": {
          "name": "Soldier Trauma Guard",
          "type": "shield",
          "dur": 2,
          "reduce": 0.8
        },
        "current": {
          "name": "Couvert du soldat Carver",
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
          "dur": 1.2,
          "slot": "defense",
          "sourceHeroId": "carver"
        }
      },
      "special": {
        "historical": {
          "name": "Tau Volantis Push",
          "type": "nexus_aoe",
          "dmg": 4.6,
          "color": "#7f8c8d"
        },
        "current": {
          "name": "Rafale du fusil de Carver",
          "type": "projectile",
          "dmg": 4.8,
          "animationDuration": 1.1,
          "hitAt": 0.451,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 660,
            "targetSide": "enemy"
          },
          "meterCost": 100,
          "slot": "special",
          "sourceHeroId": "carver"
        }
      }
    }
  },
  "ellie": {
    "id": "ellie",
    "universe": "Dead Space",
    "incarnation": "Dead Space 2 (2011), Ellie Langford in civilian pilot workwear",
    "weaponType": "gun",
    "sourceFidelityAudit": "gears-deadspace-040-2026-11-13",
    "slots": {
      "simple": {
        "historical": {
          "name": "Engineer Cover Shot",
          "type": "bullet",
          "dmg": 1
        },
        "current": {
          "name": "Tir du fusil d’Ellie",
          "type": "projectile",
          "dmg": 1.1,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 560,
            "targetSide": "enemy"
          },
          "slot": "simple",
          "sourceHeroId": "ellie"
        }
      },
      "secondary": {
        "historical": {
          "name": "Ship Route Fix",
          "type": "signature",
          "cd": 7,
          "dmg": 1.8
        },
        "current": {
          "name": "Vérification du fusil d’Ellie",
          "type": "buff",
          "dmg": 0,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "buff",
            "delivery": "support",
            "shape": "single",
            "range": 1,
            "targetSide": "self",
            "duration": 3,
            "buffMultiplier": 1.12
          },
          "cd": 6,
          "slot": "secondary",
          "sourceHeroId": "ellie"
        }
      },
      "defense": {
        "historical": {
          "name": "Eye Trauma Grit",
          "type": "shield",
          "dur": 2,
          "reduce": 0.8
        },
        "current": {
          "name": "Mise à couvert d’Ellie",
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
          "dur": 1.2,
          "slot": "defense",
          "sourceHeroId": "ellie"
        }
      },
      "special": {
        "historical": {
          "name": "Sprawl Escape Vector",
          "type": "nexus_aoe",
          "dmg": 4.6,
          "color": "#fdcb6e"
        },
        "current": {
          "name": "Tir de couverture d’Ellie",
          "type": "projectile",
          "dmg": 4.6,
          "animationDuration": 1.1,
          "hitAt": 0.451,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 620,
            "targetSide": "enemy"
          },
          "meterCost": 100,
          "slot": "special",
          "sourceHeroId": "ellie"
        }
      }
    }
  },
  "nicole_brennan": {
    "id": "nicole_brennan",
    "universe": "Dead Space",
    "incarnation": "Dead Space (2008), living human medical officer Nicole Brennan",
    "weaponType": "unarmed",
    "sourceFidelityAudit": "gears-deadspace-040-2026-11-13",
    "slots": {
      "simple": {
        "historical": {
          "name": "Nicole Brennan Signature Strike",
          "type": "energy",
          "dmg": 1
        },
        "current": {
          "name": "Observation clinique de Nicole",
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
            "buffMultiplier": 1.08
          },
          "slot": "simple",
          "sourceHeroId": "nicole_brennan"
        }
      },
      "secondary": {
        "historical": {
          "name": "Nicole Brennan Breach Technique",
          "type": "signature",
          "cd": 8,
          "dmg": 2.2
        },
        "current": {
          "name": "Consignes de sécurité médicale",
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
          },
          "cd": 6,
          "slot": "secondary",
          "sourceHeroId": "nicole_brennan"
        }
      },
      "defense": {
        "historical": {
          "name": "Nicole Brennan Guard",
          "type": "shield",
          "dur": 2,
          "reduce": 0.75
        },
        "current": {
          "name": "Refuge dans le poste médical Ishimura",
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
          "dur": 1.2,
          "slot": "defense",
          "sourceHeroId": "nicole_brennan"
        }
      },
      "special": {
        "historical": {
          "name": "Nicole Brennan Origin Burst",
          "type": "origin_aoe",
          "dmg": 4.5,
          "color": "#85c1e9"
        },
        "current": {
          "name": "Consignes médicales de Nicole",
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
            "duration": 4,
            "reduce": 0.4
          },
          "meterCost": 100,
          "slot": "special",
          "sourceHeroId": "nicole_brennan"
        }
      }
    }
  },
  "zach_hammond": {
    "id": "zach_hammond",
    "universe": "Dead Space",
    "incarnation": "Dead Space (2008), security chief Zach Hammond",
    "weaponType": "gun",
    "sourceFidelityAudit": "gears-deadspace-040-2026-11-13",
    "slots": {
      "simple": {
        "historical": {
          "name": "Zach Hammond Signature Strike",
          "type": "bullet",
          "dmg": 1
        },
        "current": {
          "name": "Tir du Pulse Rifle de Hammond",
          "type": "projectile",
          "dmg": 1,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 480,
            "targetSide": "enemy"
          },
          "slot": "simple",
          "sourceHeroId": "zach_hammond"
        }
      },
      "secondary": {
        "historical": {
          "name": "Zach Hammond Breach Technique",
          "type": "projectile",
          "cd": 8,
          "dmg": 2.2
        },
        "current": {
          "name": "Rafale du chef de sécurité",
          "type": "projectile",
          "dmg": 1.65,
          "animationDuration": 0.55,
          "hitAt": 0.2,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 480,
            "targetSide": "enemy"
          },
          "cd": 6,
          "slot": "secondary",
          "sourceHeroId": "zach_hammond"
        }
      },
      "defense": {
        "historical": {
          "name": "Zach Hammond Guard",
          "type": "shield",
          "dur": 2,
          "reduce": 0.75
        },
        "current": {
          "name": "Appui du RIG de Hammond",
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
          "dur": 1.2,
          "slot": "defense",
          "sourceHeroId": "zach_hammond"
        }
      },
      "special": {
        "historical": {
          "name": "Zach Hammond Origin Burst",
          "type": "origin_aoe",
          "dmg": 4.5,
          "color": "#566573"
        },
        "current": {
          "name": "Rafale du Pulse Rifle de Hammond",
          "type": "projectile",
          "dmg": 4.4,
          "animationDuration": 1.1,
          "hitAt": 0.451,
          "targeting": {
            "effect": "damage",
            "delivery": "projectile",
            "shape": "single",
            "range": 640,
            "targetSide": "enemy"
          },
          "meterCost": 100,
          "slot": "special",
          "sourceHeroId": "zach_hammond"
        }
      }
    }
  },
  "kendra_daniels": {
    "id": "kendra_daniels",
    "universe": "Dead Space",
    "incarnation": "Dead Space (2008), original Kendra Daniels",
    "weaponType": "terminal",
    "sourceFidelityAudit": "gears-deadspace-040-2026-11-13",
    "slots": {
      "simple": {
        "historical": {
          "name": "Kendra Daniels Signature Strike",
          "type": "bullet",
          "dmg": 1
        },
        "current": {
          "name": "Lecture de diagnostic de Kendra",
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
            "buffMultiplier": 1.08
          },
          "slot": "simple",
          "sourceHeroId": "kendra_daniels"
        }
      },
      "secondary": {
        "historical": {
          "name": "Kendra Daniels Breach Technique",
          "type": "projectile",
          "cd": 8,
          "dmg": 2.2
        },
        "current": {
          "name": "Repérage des circuits par Kendra",
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
            "buffMultiplier": 1.14
          },
          "cd": 6,
          "slot": "secondary",
          "sourceHeroId": "kendra_daniels"
        }
      },
      "defense": {
        "historical": {
          "name": "Kendra Daniels Guard",
          "type": "shield",
          "dur": 2,
          "reduce": 0.75
        },
        "current": {
          "name": "Retrait de l’ingénieure Daniels",
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
          "dur": 1.2,
          "slot": "defense",
          "sourceHeroId": "kendra_daniels"
        }
      },
      "special": {
        "historical": {
          "name": "Kendra Daniels Origin Burst",
          "type": "origin_aoe",
          "dmg": 4.5,
          "color": "#c0c0c0"
        },
        "current": {
          "name": "Relais technique de Kendra Daniels",
          "type": "buff",
          "dmg": 0,
          "animationDuration": 1.1,
          "hitAt": 0.451,
          "targeting": {
            "effect": "buff",
            "delivery": "support",
            "shape": "group",
            "range": 760,
            "targetSide": "ally",
            "duration": 4,
            "buffMultiplier": 1.25
          },
          "meterCost": 100,
          "slot": "special",
          "sourceHeroId": "kendra_daniels"
        }
      }
    }
  }
});
export function assertGearsDeadSpaceCatalogEdition(actor, slot, historical) {
 const edition = GEARS_DEADSPACE_CATALOG_EDITIONS_20261113[actor?.id];
 assert.ok(edition, 'Unknown exact Gears/Dead Space catalog edition');
 for (const [field, expected] of Object.entries(edition)) if (field !== 'slots') assert.deepEqual(actor[field], expected, actor.id + ': exact catalog source ' + field);
 const record = edition.slots[slot]; assert.ok(record, 'Unknown exact Gears/Dead Space slot');
 assert.deepEqual(historical, record.historical, actor.id + ': historical catalog action changed');
 assert.deepEqual(actor[slot], record.current, actor.id + ': current catalog action changed');
}
