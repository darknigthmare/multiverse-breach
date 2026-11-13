// Catalogue projection of the existing authored combat actions, not new mechanics.
// Baseline: Git 5952da01c; definitions in combat/abilities/abilitiesWave15PartC.js.
// Preserving these fields keeps collection labels and active combat consistent.
export const UT2004_ACTOR_CATALOG_ACTIONS = {
  "gorge": {
    "simple": {
      "name": "Tir du Flak Cannon de Gorge",
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
      }
    },
    "secondary": {
      "name": "Visée lourde du Juggernaut",
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
      "cd": 6
    },
    "defense": {
      "name": "Appui de l’armure de Gorge",
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
    "special": {
      "name": "Décharge du Flak Cannon de Gorge",
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
      "meterCost": 100
    }
  },
  "sapphire": {
    "simple": {
      "name": "Orbe secondaire du Shock Rifle",
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
      }
    },
    "secondary": {
      "name": "Visée du Shock Rifle de Sapphire",
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
      "cd": 6
    },
    "defense": {
      "name": "Dodge de Sapphire",
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
    "special": {
      "name": "Orbe du Shock Rifle de Sapphire",
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
      "meterCost": 100
    }
  },
  "frostbite": {
    "simple": {
      "name": "Roquette du lanceur de Frostbite",
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
      }
    },
    "secondary": {
      "name": "Visée du lance-roquettes de Frostbite",
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
      "cd": 6
    },
    "defense": {
      "name": "Dodge de Frostbite",
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
    "special": {
      "name": "Roquette de Frostbite",
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
      "meterCost": 100
    }
  }
};
