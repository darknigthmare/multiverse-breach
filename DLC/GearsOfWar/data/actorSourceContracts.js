// Explicit source targets for the exclusive Gears/Dead Space40 batch.
// Catalog action objects below are projections of already effective actions.
// No image, animation, approval or new ability is granted.
const HEROES = Object.freeze({
  "marcus": {
    "incarnation": "Gears of War 2 (2008), Marcus Fenix in original Delta Squad armor",
    "referenceUrl": "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Marcus_Fenix",
    "visualAnchor": "Adult Marcus with a dark bandana, short dark hair, scarred square face, heavy grey-blue COG armor and cyan armor lights. His Lancer Mk2 has a firearm barrel and an attached chainsaw bayonet; no old-man beard, Gears 4 farm clothes or E-Day model.",
    "equipment": [
      "Lancer Mk2 assault rifle with chainsaw bayonet",
      "COG combat armor",
      "Hammer of Dawn targeting designator"
    ],
    "weaponType": "chainsaw",
    "sourceWeaponFamily": "Mk2 Lancer firearm and attached chainsaw bayonet; existing hybrid engine family retained",
    "sourceScene": {
      "description": "Gears of War 2 campaign, Delta Squad; the Hammer of Dawn is an external satellite weapon guided by a designator, never a beam emitted by the rifle.",
      "referenceUrl": "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Marcus_Fenix",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    },
    "simple": {
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
    },
    "secondary": {
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
    },
    "defense": {
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
    },
    "special": {
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
  },
  "dom": {
    "incarnation": "Gears of War 2 (2008), Dominic Santiago in Delta Squad armor",
    "referenceUrl": "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Dominic_Santiago",
    "visualAnchor": "Adult Dom with short dark hair, dark facial stubble, exposed muscular arms, grey-blue COG plates and blue lights. Carry Lancer Mk2/Gnasher as physical weapons; no Gears 3 grief-era long beard or supernatural Maria manifestation.",
    "equipment": [
      "Lancer Mk2",
      "Gnasher shotgun",
      "COG combat armor"
    ],
    "weaponType": "gun",
    "sourceScene": {
      "description": "Gears of War 2 Delta Squad campaign; Maria is a person and story motivation, not an attacking entity.",
      "referenceUrl": "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Dominic_Santiago",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    },
    "simple": {
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
    },
    "secondary": {
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
    },
    "defense": {
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
    },
    "special": {
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
  },
  "cole": {
    "incarnation": "Gears of War 2 (2008), Augustus Cole in original Delta Squad armor",
    "referenceUrl": "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Augustus_Cole",
    "visualAnchor": "Adult Black, muscular Augustus Cole with close-cropped hair, broad exposed arms, grey-blue COG armor and blue lights. Physical Lancer and Gnasher remain separate from his former Thrashball role; no Thrashball uniform or dialogue turned into projectiles.",
    "equipment": [
      "Lancer Mk2",
      "Gnasher shotgun",
      "COG combat armor"
    ],
    "weaponType": "gun",
    "sourceScene": {
      "description": "Gears of War 2 Delta Squad combat model; Cole Train dialogue does not create a new weapon or energy power.",
      "referenceUrl": "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Augustus_Cole",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    },
    "simple": {
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
    },
    "secondary": {
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
    },
    "defense": {
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
    },
    "special": {
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
  },
  "baird": {
    "incarnation": "Gears of War 2 (2008), young Damon Baird in COG field armor",
    "referenceUrl": "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Damon_Baird",
    "visualAnchor": "Young adult Baird with short blond hair, goggles resting on his forehead, grey-blue COG armor and cyan lamps. He carries a physical Lancer and ordinary maintenance tools; no old-man beard, Fabricator, autonomous turret or later-era robot.",
    "equipment": [
      "Lancer Mk2",
      "COG field maintenance tools",
      "COG combat armor"
    ],
    "weaponType": "gun",
    "sourceScene": {
      "description": "Gears of War 2 campaign field mechanic; maintenance/guard remains an explicitly bounded support adaptation, not biological healing or a conjured robot.",
      "referenceUrl": "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Damon_Baird",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    },
    "simple": {
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
    },
    "secondary": {
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
    },
    "defense": {
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
    },
    "special": {
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
  },
  "anya_stroud": {
    "incarnation": "Gears of War 3 (2011), Anya Stroud in frontline COG armor",
    "referenceUrl": "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Anya_Stroud",
    "visualAnchor": "Adult blonde Anya in practical grey-blue COG combat armor with cyan lamps, dark underlayers and a physical Lancer Mk2. This is her frontline Gears 3 model, not the Gears 1 radio-room uniform or a later memorial image.",
    "equipment": [
      "Lancer Mk2",
      "COG combat armor"
    ],
    "weaponType": "gun",
    "sourceScene": {
      "description": "Gears of War 3, Anya as a frontline squad member; retain actual rifle recoil and no invented command-fire magic.",
      "referenceUrl": "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Anya_Stroud",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    },
    "simple": {
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
    },
    "secondary": {
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
    },
    "defense": {
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
    },
    "special": {
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
  },
  "hoffman_cog": {
    "incarnation": "Gears of War 2 (2008), Colonel Victor Hoffman during the Jacinto defense",
    "referenceUrl": "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Victor_Hoffman",
    "visualAnchor": "Older Colonel Victor Hoffman with weathered face, dark COG beret, heavy grey-blue officer armor and cyan armor lamps. A physical service firearm is carried; command orders do not project a holographic shield or summon soldiers.",
    "equipment": [
      "COG officer beret",
      "COG officer combat armor",
      "Physical COG service firearm"
    ],
    "weaponType": "gun",
    "sourceScene": {
      "description": "Gears of War 2 Jacinto command/defense scenes. Existing leadership buffs/guards are Nexus abstractions; no specific unseen firearm attachment is inferred.",
      "referenceUrl": "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Victor_Hoffman",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    },
    "simple": {
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
    },
    "secondary": {
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
    },
    "defense": {
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
    },
    "special": {
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
  },
  "carmine_cog": {
    "incarnation": "Gears of War 3 (2011), specifically adult Clayton Carmine",
    "referenceUrl": "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Carmine_family",
    "visualAnchor": "Clayton Carmine has a fully closed opaque COG helmet, grey-blue heavy armor, blue lamps and conspicuously muscular bare arms. Carry a Lancer Mk2; do not substitute Anthony, Benjamin, Gary or Lizzie, their helmets, sleeves or eras.",
    "equipment": [
      "Lancer Mk2",
      "Clayton Carmine COG helmet",
      "Heavy COG armor"
    ],
    "weaponType": "gun",
    "sourceScene": {
      "description": "Gears of War 3 adult Clayton model, selected already by the existing W14 source contract; the historical Carmine ID remains unchanged.",
      "referenceUrl": "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Carmine_family",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    },
    "simple": {
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
    },
    "secondary": {
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
    },
    "defense": {
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
    },
    "special": {
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
  },
  "kait_diaz": {
    "incarnation": "Gears 5 (2019), adult Kait in the winter COG field outfit",
    "referenceUrl": "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Kait_Diaz",
    "visualAnchor": "Adult Kait with dark brown hair, practical grey-blue winter COG armor, a visible fur collar and a physical Lancer Mk3. Preserve the winter field silhouette rather than Gears 4 Outsider clothing, Locust anatomy or a supernatural Swarm attack.",
    "equipment": [
      "Lancer Mk3",
      "Winter COG armor with fur collar"
    ],
    "weaponType": "gun",
    "sourceScene": {
      "description": "Gears 5 winter campaign model, consistent with W14. Personal connection to the Swarm is not an offensive mind-control ability.",
      "referenceUrl": "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Kait_Diaz",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    },
    "simple": {
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
    },
    "secondary": {
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
    },
    "defense": {
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
    },
    "special": {
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
});
const ENEMIES = Object.freeze({
  "Locust Drone": {
    "incarnation": "Gears of War (2006), ordinary Locust Drone infantry",
    "referenceUrl": "https://en.wikipedia.org/wiki/Gears_of_War_(video_game)",
    "visualAnchor": "Pale grey humanoid Locust Drone with a broad heavy head, thick neck, muscular stocky body, dark Locust harness/armor and a carried Hammerburst. No elite Theron cape, Swarm red tissue or Skaarj wrist blades.",
    "equipment": [
      "Hammerburst assault rifle",
      "Locust infantry armor"
    ],
    "weapon": "gun",
    "sourceScene": {
      "description": "Original 2006 Locust infantry campaign model; ordinary Drone rather than Grenadier, Theron or Swarm Drone.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Gears_of_War_(video_game)",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    }
  },
  "Locust Wretch": {
    "incarnation": "Gears of War (2006), non-Lambent Wretch",
    "referenceUrl": "https://en.wikipedia.org/wiki/Gears_of_War_(video_game)",
    "visualAnchor": "Small hunched pale-grey Locust Wretch with long forelimbs, digitigrade hind limbs, clawed hands and a toothy head. It runs and climbs close to the ground; no gun, armor plates, Lambent yellow glow or explosive sac.",
    "equipment": [
      "Natural claws"
    ],
    "weapon": "claws",
    "sourceScene": {
      "description": "Original non-Lambent Wretch; distinct from the explosive Lambent Wretches in the Imulsion facility.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Gears_of_War_(video_game)",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    }
  },
  "Explosive Ticker": {
    "incarnation": "Gears of War 2 (2008), Locust explosive Ticker",
    "referenceUrl": "https://en.wikipedia.org/wiki/Gears_of_War_2",
    "visualAnchor": "Low-slung squat Ticker with small eyes, tusk-like jaws, short scuttling legs and a visible explosive charge strapped to its back. Preserve the separate bomb harness; no wild unarmed Ticker or human suicide bomber anatomy.",
    "equipment": [
      "Locust explosive backpack harness"
    ],
    "weapon": "suicide",
    "sourceScene": {
      "description": "Gears of War 2 explosive Ticker, distinct from the wild Ticker later used to consume fortifications.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Gears_of_War_2",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    }
  },
  "Theron Guard": {
    "incarnation": "Gears of War (2006), standard Theron Guard",
    "referenceUrl": "https://en.wikipedia.org/wiki/Gears_of_War_(video_game)",
    "visualAnchor": "Tall Locust Theron Guard in ornate red-brown armor, distinctive crested helmet and draped coat/cape, carrying a physical Torque Bow. No unarmored Drone, later armored Kantus or RAAM-sized silhouette.",
    "equipment": [
      "Torque Bow",
      "Theron Guard helmet and armor"
    ],
    "weapon": "torque_bow",
    "sourceScene": {
      "description": "Original Gears of War Torque Bow guard; standard Guard rather than a Theron Sentinel or cross-game elite.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Gears_of_War_(video_game)",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    }
  },
  "Boomer Locust": {
    "incarnation": "Gears of War (2006), Boomshot-equipped Boomer",
    "referenceUrl": "https://en.wikipedia.org/wiki/Gears_of_War_(video_game)",
    "visualAnchor": "Very large heavyset pale Locust with a small head, thick exposed arms, heavy dark shoulder armor and a two-handed Boomshot grenade launcher. No Grinder minigun, Mauler shield or Berserker anatomy.",
    "equipment": [
      "Boomshot grenade launcher",
      "Boomer armor"
    ],
    "weapon": "boomshot",
    "sourceScene": {
      "description": "Original Boomshot Boomer, not another Boomer caste or a generic rocket soldier.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Gears_of_War_(video_game)",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    }
  },
  "Kantus Priest": {
    "incarnation": "Gears of War 2 (2008), standard Kantus priest",
    "referenceUrl": "https://en.wikipedia.org/wiki/Gears_of_War_2",
    "visualAnchor": "Tall lean Kantus with long limbs, elongated head, dark reddish ceremonial armor/robes and a physical Gorgon pistol. Keep the narrow priest silhouette distinct from the bulky armored Kantus of Gears 3; no conjured staff or wings.",
    "equipment": [
      "Gorgon pistol",
      "Kantus ceremonial armor"
    ],
    "weapon": "gorgon_pistol",
    "sourceScene": {
      "description": "Gears of War 2 standard Kantus. Source revival/coordination does not mean our generic enemy AI implements that full mechanic.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Gears_of_War_2",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    }
  },
  "Corpser Hatchling": {
    "incarnation": "Gears of War 3 (2011), juvenile Corpser hatchling",
    "referenceUrl": "https://en.wikipedia.org/wiki/Gears_of_War_3",
    "visualAnchor": "Small juvenile Corpser with a compact arachnid-like body, recessed head and long jointed digging limbs spreading around it. Keep the juvenile scale and bare creature anatomy; no adult armored head, Brumak guns or dorsal rocket rack.",
    "equipment": [
      "Natural digging limbs"
    ],
    "weapon": "burrow_claws",
    "sourceScene": {
      "description": "Gears of War 3 juvenile Corpsers in the underground nest; not the adult mother or an ordinary armored adult.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Gears_of_War_3",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    }
  },
  "General RAAM": {
    "incarnation": "Gears of War (2006) - Lightmass Bomb train",
    "referenceUrl": "https://en.wikipedia.org/wiki/Gears_of_War_(video_game)",
    "visualAnchor": "Huge pale Locust general, dark heavy armor, Troika heavy machine gun and protective Kryll swarm on the moving Lightmass Bomb train. No Skorge chainsaw staff or Brumak vehicle.",
    "equipment": [
      "Troika heavy machine gun",
      "Kryll swarm"
    ],
    "canonicalName": "General RAAM",
    "sourceScene": {
      "description": "Gears of War 2006 Lightmass Bomb train encounter; preserve the existing exact incarnation, Troika, Kryll protection and Lightmass scene binding.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Gears_of_War_(video_game)",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    }
  },
  "High Priest Skorge": {
    "incarnation": "Gears of War 2 (2008), Skorge at Nexus",
    "referenceUrl": "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Skorge",
    "visualAnchor": "Skorge is a tall narrow Kantus leader with pale grey skin, an elongated head, dark reddish ceremonial armor and a double-ended chainsaw staff. No RAAM Troika, generic wizard staff or Reaver body fused into the character.",
    "equipment": [
      "Double-ended chainsaw staff",
      "Skorge armor"
    ],
    "weapon": "staff",
    "sourceScene": {
      "description": "Gears of War 2 Nexus duel, on foot; his Hydra mount belongs to a separate encounter and must not be merged into the staff model.",
      "referenceUrl": "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Skorge",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    }
  },
  "Berserker Matriarch": {
    "incarnation": "Gears 5 (2019), the Matriarch at the Mount Kadar laboratory",
    "referenceUrl": "https://en.wikipedia.org/wiki/Gears_5",
    "visualAnchor": "The Gears 5 Matriarch is a massive blind, heavily plated female Locust with powerful forelimbs and a vulnerable exposed back. Target her laboratory/ice-arena form; do not reuse an ordinary 2006 Berserker, a Lambent Berserker or invented weapons.",
    "equipment": [
      "Natural armored body and charging limbs"
    ],
    "weapon": "blind_charge",
    "sourceScene": {
      "description": "Gears 5 Act II Mount Kadar laboratory/ice-arena Matriarch boss; historical Berserker Matriarch name is a roster alias, not a license to merge Berserker forms.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Gears_5",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    }
  },
  "Karn Locust General": {
    "incarnation": "Gears of War: Judgment (2013), Karn mounted on Shibboleth",
    "referenceUrl": "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Karn",
    "visualAnchor": "Karn is a pale armored Locust general positioned on the back of the large arachnid-like Shibboleth. Preserve rider and mount as distinct bodies; do not replace the mount with a Brumak or label Karn a generic sniper.",
    "equipment": [
      "Shibboleth mount",
      "Karn armor"
    ],
    "weapon": "mount_command",
    "sourceScene": {
      "description": "Judgment final Halvo Bay battle with Karn and Shibboleth. The generic actor AI does not claim complete separately controlled rider/mount mechanics.",
      "referenceUrl": "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Karn",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    }
  },
  "Queen Myrrah": {
    "incarnation": "Gears of War 3 (2011), Myrrah and the Tempest encounter",
    "referenceUrl": "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Myrrah",
    "visualAnchor": "Adult Myrrah is a pale human-looking queen with light hair and elaborate dark-gold Locust regalia. Her physical Tempest mount is a separate enormous winged creature; do not fuse its wings or limbs into Myrrah or borrow Skorge armor.",
    "equipment": [
      "Locust royal armor",
      "Tempest mount"
    ],
    "weapon": "tempest",
    "sourceScene": {
      "description": "Gears of War 3 final Azura Tempest fight; rider and creature remain distinct source entities. A lone queen sprite cannot certify a mounted boss depiction.",
      "referenceUrl": "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Myrrah",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    }
  },
  "Corpser Burrower": {
    "incarnation": "Gears of War (2006), adult Corpser in the Imulsion mine",
    "referenceUrl": "https://en.wikipedia.org/wiki/Gears_of_War_(video_game)",
    "visualAnchor": "Enormous subterranean arachnid-shaped Corpser with a recessed body, broad multi-eyed head and very long raised hooked digging limbs. Its source creature has no gun arms or dorsal missile pack; preserve adult rather than hatchling proportions.",
    "equipment": [
      "Natural hooked digging limbs"
    ],
    "weapon": "burrow_claws",
    "sourceScene": {
      "description": "Original 2006 underground Imulsion-mine Corpser encounter, distinct from the Gears 3 nest mother and juveniles.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Gears_of_War_(video_game)",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    }
  },
  "Gargantuan Brumak": {
    "incarnation": "Gears of War 2 (2008), armed Brumak before Lambent mutation",
    "referenceUrl": "https://en.wikipedia.org/wiki/Gears_of_War_2",
    "visualAnchor": "Huge grey reptilian Brumak with a separate Locust pilot, heavy metal harness, arm-mounted guns and a dorsal missile rack. No tentacles, glowing Imulsion growths or final Lambent Brumak form; Gargantuan is Nexus scaling, not a separate canonical species.",
    "equipment": [
      "Locust pilot and harness",
      "Arm-mounted guns",
      "Dorsal rocket rack"
    ],
    "weapon": "rockets",
    "sourceScene": {
      "description": "Gears of War 2 armed Brumak campaign model before Lambent transformation. Boss scale, phases and target geometry remain existing Nexus adaptations.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Gears_of_War_2",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    }
  }
});
const copy = value => structuredClone(value);
const status = Object.freeze({ sourceFidelityAudit: 'gears-deadspace-040-2026-11-13',
  canonStatus: 'Source target documented individually. Existing numerical combat, timing and geometry remain Nexus adaptations; artwork and animation review remain open.',
  gameplayAdaptation: true, source1to1Verified: false, artApproved: false });
export function sourceHeroContract(id) {
  if (!Object.hasOwn(HEROES, id)) throw new Error(`Unknown exact source hero: ${id}`);
  return { ...status, ...copy(HEROES[id]) };
}
export function sourceEnemyContract(name) {
  if (!Object.hasOwn(ENEMIES, name)) throw new Error(`Unknown exact source enemy: ${name}`);
  return { ...status, ...copy(ENEMIES[name]) };
}

// Exact allowlist only: other enemies/expansions keep their original records.
export function applySourceEnemyContracts(roster) {
  const apply = actor => actor && Object.hasOwn(ENEMIES, actor.name)
    ? { ...actor, ...sourceEnemyContract(actor.name) } : actor;
  return { ...roster,
    ...(roster.monsters ? { monsters: roster.monsters.map(apply) } : {}),
    ...(roster.bosses ? { bosses: roster.bosses.map(apply) } : {}),
    ...(roster.worldBoss ? { worldBoss: apply(roster.worldBoss) } : {}) };
}
