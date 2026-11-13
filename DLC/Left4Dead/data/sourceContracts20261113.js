// Closed per-actor source targets. Metadata and source-role descriptions never approve artwork.
const HERO_CONTRACTS = {
  "zoey_l4d": {
    "incarnation": "Left 4 Dead (2008), Zoey in the original survivor outfit",
    "visualAnchor": "Left 4 Dead 2008 Zoey: young adult human with dark ponytail, red zip-up jacket over a light shirt, dark jeans and trainers. Retain the original survivor outfit and physical firearm, not a sword, infected form or a later crossover costume.",
    "equipment": [
      "Standard survivor pistol",
      "Hunting Rifle",
      "Original red survivor jacket"
    ],
    "referenceUrl": "https://store.steampowered.com/app/500/Left_4_Dead/",
    "referenceUrls": [
      "https://store.steampowered.com/app/500/Left_4_Dead/"
    ],
    "sourceRoleContract": {
      "entityKind": "human-survivor",
      "sourceBody": "Original Left 4 Dead Zoey",
      "sourceGameplayBoundary": "The firearm loadout is a selectable equipment configuration available to survivors, not a Zoey-exclusive power or a guarantee that every weapon is carried at once.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-l4d.html.gz",
        "sha256": "331d946e007f4527263f7bac5178dceb9da0e42988ed7f76392d578802c2995b",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-l4d.html.gz",
        "sha256": "ba9941b3e4ed6af1cbb2fcf0554df488d78d66aee87b1e8a926191c176e529b5",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "weaponType": "gun",
    "canonStatus": "source role and selected edition documented; gameplay geometry and choreography remain adaptations; visual review pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13",
    "simple": {
      "name": "Pistolet de Zoey",
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
      "name": "Visée au fusil de chasse de Zoey",
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
      "name": "Couvert du groupe de survivants",
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
      "name": "Tir de précision de Zoey",
      "type": "bullet",
      "dmg": 4.5,
      "animationDuration": 1.1,
      "hitAt": 0.45,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "single",
        "delivery": "projectile",
        "range": 720
      },
      "color": "#b8d393"
    }
  },
  "bill_l4d": {
    "incarnation": "Left 4 Dead (2008), Bill in his original Vietnam-veteran survivor outfit",
    "visualAnchor": "Left 4 Dead 2008 Bill: older white human man, grey beard, green military beret, olive fatigue jacket and military trousers, with worn survivor gear. Keep him alive in the selected base-game survivor period, not a post-Sacrifice corpse or supernatural veteran.",
    "equipment": [
      "Assault Rifle",
      "Original military beret and fatigues"
    ],
    "referenceUrl": "https://store.steampowered.com/app/500/Left_4_Dead/",
    "referenceUrls": [
      "https://store.steampowered.com/app/500/Left_4_Dead/"
    ],
    "sourceRoleContract": {
      "entityKind": "human-survivor",
      "sourceBody": "Original Left 4 Dead Bill",
      "sourceGameplayBoundary": "Rifle cover and group protection are co-op adaptations. No innate supernatural shield, air strike or automatic post-death revival is granted.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-l4d.html.gz",
        "sha256": "331d946e007f4527263f7bac5178dceb9da0e42988ed7f76392d578802c2995b",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-l4d.html.gz",
        "sha256": "ba9941b3e4ed6af1cbb2fcf0554df488d78d66aee87b1e8a926191c176e529b5",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "weaponType": "gun",
    "canonStatus": "source role and selected edition documented; gameplay geometry and choreography remain adaptations; visual review pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13",
    "simple": {
      "name": "Rafale de vétéran de Bill",
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
      "name": "Bill Breach Technique",
      "type": "projectile",
      "cd": 8,
      "dmg": 2.2
    },
    "defense": {
      "name": "Couvert de Bill derrière la barricade",
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
      "name": "Couverture du vétéran Bill",
      "type": "shield_aoe",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.45,
      "targeting": {
        "effect": "guard",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "reduce": 0.45,
        "duration": 4
      },
      "color": "#b8d393"
    }
  },
  "ellis_l4d": {
    "incarnation": "Left 4 Dead 2 (2009), Ellis in the original mechanic survivor outfit",
    "visualAnchor": "Left 4 Dead 2 Ellis: young adult white human mechanic, dark hair under a baseball cap, yellow work T-shirt and blue jeans. He is a human survivor with ordinary equipment, not a summoned repair robot or a Left 4 Dead 2008 cast member.",
    "equipment": [
      "Ordinary survivor firearm",
      "Mechanic cap and work clothes"
    ],
    "referenceUrl": "https://store.steampowered.com/app/550/Left_4_Dead_2/",
    "referenceUrls": [
      "https://store.steampowered.com/app/550/Left_4_Dead_2/"
    ],
    "sourceRoleContract": {
      "entityKind": "human-survivor",
      "sourceBody": "Original Left 4 Dead 2 Ellis",
      "sourceGameplayBoundary": "Vehicle checks and team coordination are role-based support adaptations. He has no automatic battlefield repair spell or weapon unique to his biography.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-l4d2.html.gz",
        "sha256": "334443e8eea60e5de73bb372bee23a43f9391ec614f2288ea70544cc11f6ccdc",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-l4d2.html.gz",
        "sha256": "0e143ae78cd673d3dfc9220dea247341c9eb0191e9f9c755bae1c9ffd145eb2b",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "weaponType": "gun",
    "canonStatus": "source role and selected edition documented; gameplay geometry and choreography remain adaptations; visual review pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13",
    "simple": {
      "name": "Tir de survie d’Ellis",
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
      "name": "Vérifier le véhicule avec Ellis",
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
      "name": "Abri du mécanicien survivant",
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
      "name": "Remise en route par Ellis",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.45,
      "targeting": {
        "effect": "buff",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "buffMultiplier": 1.25,
        "duration": 4
      },
      "color": "#b8d393"
    }
  },
  "coach_l4d": {
    "incarnation": "Left 4 Dead 2 (2009), Coach in the original school-coach survivor outfit",
    "visualAnchor": "Left 4 Dead 2 Coach: broad stocky Black human man with a bald head, two-tone purple-and-yellow school-coach shirt, dark trousers and sturdy shoes. Preserve his human proportions and civilian sporting outfit, without military armor or a transformed Tank body.",
    "equipment": [
      "Ordinary survivor firearm",
      "School-coach polo shirt"
    ],
    "referenceUrl": "https://store.steampowered.com/app/550/Left_4_Dead_2/",
    "referenceUrls": [
      "https://store.steampowered.com/app/550/Left_4_Dead_2/"
    ],
    "sourceRoleContract": {
      "entityKind": "human-survivor",
      "sourceBody": "Original Left 4 Dead 2 Coach",
      "sourceGameplayBoundary": "Spoken group coordination is support, not an innate morale aura or shield. The firearm is a survivor equipment choice.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-l4d2.html.gz",
        "sha256": "334443e8eea60e5de73bb372bee23a43f9391ec614f2288ea70544cc11f6ccdc",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-l4d2.html.gz",
        "sha256": "0e143ae78cd673d3dfc9220dea247341c9eb0191e9f9c755bae1c9ffd145eb2b",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "weaponType": "gun",
    "canonStatus": "source role and selected edition documented; gameplay geometry and choreography remain adaptations; visual review pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13",
    "simple": {
      "name": "Tir du survivant Coach",
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
      "name": "Donner la prochaine consigne au groupe",
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
      "name": "Tenir un angle de couvert avec Coach",
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
      "name": "Consignes de Coach",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.45,
      "targeting": {
        "effect": "buff",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "buffMultiplier": 1.25,
        "duration": 4
      },
      "color": "#b8d393"
    }
  },
  "rochelle_l4d": {
    "incarnation": "Left 4 Dead 2 (2009), Rochelle in the original reporter survivor outfit",
    "visualAnchor": "Left 4 Dead 2 Rochelle: adult Black human woman with tied-back dark hair, pink Depeche Mode T-shirt and dark trousers. Keep the base-game human reporter presentation, ordinary pistol and civilian clothes, with no laser or infected anatomy.",
    "equipment": [
      "Standard survivor pistol",
      "Original pink reporter T-shirt"
    ],
    "referenceUrl": "https://store.steampowered.com/app/550/Left_4_Dead_2/",
    "referenceUrls": [
      "https://store.steampowered.com/app/550/Left_4_Dead_2/"
    ],
    "sourceRoleContract": {
      "entityKind": "human-survivor",
      "sourceBody": "Original Left 4 Dead 2 Rochelle",
      "sourceGameplayBoundary": "Route spotting and extraction guidance are support adaptations, not psychic scanning or a damaging energy weapon.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-l4d2.html.gz",
        "sha256": "334443e8eea60e5de73bb372bee23a43f9391ec614f2288ea70544cc11f6ccdc",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-l4d2.html.gz",
        "sha256": "0e143ae78cd673d3dfc9220dea247341c9eb0191e9f9c755bae1c9ffd145eb2b",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "weaponType": "gun",
    "canonStatus": "source role and selected edition documented; gameplay geometry and choreography remain adaptations; visual review pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13",
    "simple": {
      "name": "Pistolet de Rochelle",
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
      "name": "Repérer le prochain point d’extraction",
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
      "name": "Se couvrir avant de traverser",
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
      "name": "Repérage du trajet d’extraction",
      "type": "shield_aoe",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.45,
      "targeting": {
        "effect": "guard",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "reduce": 0.45,
        "duration": 4
      },
      "color": "#b8d393"
    }
  },
  "nick_l4d": {
    "incarnation": "Left 4 Dead 2 (2009), Nick in the original gambler survivor outfit",
    "visualAnchor": "Left 4 Dead 2 Nick: adult white human man with short dark hair, white suit jacket and trousers over a blue open-neck shirt. Maintain the worn gambler survivor appearance and ordinary pistols; no military uniform or unique supernatural gun ability.",
    "equipment": [
      "Standard survivor pistols",
      "Original white suit"
    ],
    "referenceUrl": "https://store.steampowered.com/app/550/Left_4_Dead_2/",
    "referenceUrls": [
      "https://store.steampowered.com/app/550/Left_4_Dead_2/"
    ],
    "sourceRoleContract": {
      "entityKind": "human-survivor",
      "sourceBody": "Original Left 4 Dead 2 Nick",
      "sourceGameplayBoundary": "One or two pistols are ordinary selectable survivor equipment. Double-pistol attacks are adaptations of that loadout, not a character-exclusive source power.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-l4d2.html.gz",
        "sha256": "334443e8eea60e5de73bb372bee23a43f9391ec614f2288ea70544cc11f6ccdc",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-l4d2.html.gz",
        "sha256": "0e143ae78cd673d3dfc9220dea247341c9eb0191e9f9c755bae1c9ffd145eb2b",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "weaponType": "gun",
    "canonStatus": "source role and selected edition documented; gameplay geometry and choreography remain adaptations; visual review pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13",
    "simple": {
      "name": "Premier pistolet de Nick",
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
      "name": "Deux pistolets du survivant Nick",
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
      "name": "Retrait derrière les caisses avec Nick",
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
      "name": "Double pistolet de Nick",
      "type": "bullet",
      "dmg": 4.5,
      "animationDuration": 1.1,
      "hitAt": 0.45,
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "single",
        "delivery": "projectile",
        "range": 720
      },
      "color": "#b8d393"
    }
  }
};
const ENEMY_CONTRACTS = {
  "Common Infected": {
    "incarnation": "Left 4 Dead (2008), ordinary common infected civilian",
    "visualAnchor": "Left 4 Dead 2008 common infected civilian: an aggressive human with disordered movement and damaged everyday clothing. This is an ordinary common-infected population target, not a uniform single named model, armored riot infected or a special-infected mutation.",
    "equipment": [
      "Civilian clothing remnants"
    ],
    "referenceUrl": "https://store.steampowered.com/app/500/Left_4_Dead/",
    "referenceUrls": [
      "https://store.steampowered.com/app/500/Left_4_Dead/"
    ],
    "sourceRoleContract": {
      "entityKind": "common-infected",
      "sourceBody": "Population of infected civilian humans; exact clothing model unresolved",
      "sourceGameplayBoundary": "A population contract cannot certify one invented universal face, outfit or handed weapon. A concrete source-model and scene selection remains OPEN.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-l4d.html.gz",
        "sha256": "331d946e007f4527263f7bac5178dceb9da0e42988ed7f76392d578802c2995b",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-l4d.html.gz",
        "sha256": "ba9941b3e4ed6af1cbb2fcf0554df488d78d66aee87b1e8a926191c176e529b5",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "canonStatus": "source role and selected edition documented; gameplay geometry and choreography remain adaptations; visual review pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13"
  },
  "Smoker": {
    "incarnation": "Left 4 Dead (2008), original Smoker special-infected model",
    "visualAnchor": "Left 4 Dead 2008 Smoker: tall distorted human infected, large neck and facial growths, long prehensile tongue and torn civilian clothing. Preserve the original special-infected body; no conventional weapon or invented snake companion.",
    "equipment": [
      "Prehensile tongue"
    ],
    "referenceUrl": "https://store.steampowered.com/app/500/Left_4_Dead/",
    "referenceUrls": [
      "https://store.steampowered.com/app/500/Left_4_Dead/"
    ],
    "sourceRoleContract": {
      "entityKind": "special-infected",
      "sourceBody": "Original Smoker infected human",
      "sourceGameplayBoundary": "Tongue restraint and dragging are source attack families. Timing, range and ordinary legacy claw fallback are game adaptations requiring review.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-l4d.html.gz",
        "sha256": "331d946e007f4527263f7bac5178dceb9da0e42988ed7f76392d578802c2995b",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-l4d.html.gz",
        "sha256": "ba9941b3e4ed6af1cbb2fcf0554df488d78d66aee87b1e8a926191c176e529b5",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "canonStatus": "source role and selected edition documented; gameplay geometry and choreography remain adaptations; visual review pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13"
  },
  "Hunter": {
    "incarnation": "Left 4 Dead (2008), original Hunter special-infected model",
    "visualAnchor": "Left 4 Dead 2008 Hunter: crouched hooded human infected in a dark hooded sweatshirt and trousers, low predatory posture, bare hands and feet. Keep the human hooded body and long-distance pounce, not an animal, firearm user or armored soldier.",
    "equipment": [
      "Hooded sweatshirt",
      "Clawed hands"
    ],
    "referenceUrl": "https://store.steampowered.com/app/500/Left_4_Dead/",
    "referenceUrls": [
      "https://store.steampowered.com/app/500/Left_4_Dead/"
    ],
    "sourceRoleContract": {
      "entityKind": "special-infected",
      "sourceBody": "Original Hunter infected human",
      "sourceGameplayBoundary": "Pouncing and pinning are source attack families; generic fallback claw balance is an adaptation, not proof of complete pin-and-rescue rules.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-l4d.html.gz",
        "sha256": "331d946e007f4527263f7bac5178dceb9da0e42988ed7f76392d578802c2995b",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-l4d.html.gz",
        "sha256": "ba9941b3e4ed6af1cbb2fcf0554df488d78d66aee87b1e8a926191c176e529b5",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "canonStatus": "source role and selected edition documented; gameplay geometry and choreography remain adaptations; visual review pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13"
  },
  "Boomer Bile Host": {
    "incarnation": "Left 4 Dead (2008), male Boomer special-infected model",
    "visualAnchor": "Original male Left 4 Dead Boomer: extremely swollen torso and belly, bloated human head, damaged civilian shirt and trousers, fluid-soiled body and short unstable posture. No female Boomette model or separate symbiotic host creature is selected.",
    "equipment": [
      "Bile-producing infected body"
    ],
    "referenceUrl": "https://store.steampowered.com/app/500/Left_4_Dead/",
    "referenceUrls": [
      "https://store.steampowered.com/app/500/Left_4_Dead/"
    ],
    "sourceRoleContract": {
      "entityKind": "special-infected",
      "sourceBody": "Male Boomer; Bile Host is a legacy encounter alias",
      "sourceGameplayBoundary": "Vomiting bile and the death explosion attract infected. They are not a fabricated poison rifle or a new host species.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-l4d.html.gz",
        "sha256": "331d946e007f4527263f7bac5178dceb9da0e42988ed7f76392d578802c2995b",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-l4d.html.gz",
        "sha256": "ba9941b3e4ed6af1cbb2fcf0554df488d78d66aee87b1e8a926191c176e529b5",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "canonStatus": "source role and selected edition documented; gameplay geometry and choreography remain adaptations; visual review pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13"
  },
  "Hunter Pounce": {
    "incarnation": "Left 4 Dead (2008), original Hunter during its pounce state",
    "visualAnchor": "Original Left 4 Dead hooded Hunter body during a crouch, leap or pinned attack, with dark sweatshirt and trousers and exposed hands and feet. Pounce names an action state, not another infected species or a different outfit.",
    "equipment": [
      "Hunter hooded clothing",
      "Clawed hands"
    ],
    "referenceUrl": "https://store.steampowered.com/app/500/Left_4_Dead/",
    "referenceUrls": [
      "https://store.steampowered.com/app/500/Left_4_Dead/"
    ],
    "sourceRoleContract": {
      "entityKind": "special-infected-state",
      "sourceBody": "Same source Hunter identity, selected pounce state",
      "sourceGameplayBoundary": "Keep the existing roster key and balance variant, but do not create a separate source character or an invented leap weapon.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-l4d.html.gz",
        "sha256": "331d946e007f4527263f7bac5178dceb9da0e42988ed7f76392d578802c2995b",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-l4d.html.gz",
        "sha256": "ba9941b3e4ed6af1cbb2fcf0554df488d78d66aee87b1e8a926191c176e529b5",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "canonStatus": "source role and selected edition documented; gameplay geometry and choreography remain adaptations; visual review pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13"
  },
  "Spitter Acid Pool": {
    "incarnation": "Left 4 Dead 2 (2009), acid pool left by the Spitter special infected",
    "visualAnchor": "Left 4 Dead 2 Spitter acid pool: a spreading, bubbling green acidic patch on the ground. The selected source is the pool hazard, with no independent humanoid torso, face, arms, legs or hand-held acid gun.",
    "equipment": [
      "Ground-bound acid pool"
    ],
    "referenceUrl": "https://store.steampowered.com/app/550/Left_4_Dead_2/",
    "referenceUrls": [
      "https://store.steampowered.com/app/550/Left_4_Dead_2/"
    ],
    "sourceRoleContract": {
      "entityKind": "environmental-hazard",
      "sourceBody": "Environmental acid patch caused by a Spitter; not the Spitter body",
      "sourceGameplayBoundary": "The name selects a pool, not a separate infected creature. Legacy movement speed and acid_spit actor mapping remain OPEN adaptations; this contract does not certify a walking pool.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-l4d2.html.gz",
        "sha256": "334443e8eea60e5de73bb372bee23a43f9391ec614f2288ea70544cc11f6ccdc",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-l4d2.html.gz",
        "sha256": "0e143ae78cd673d3dfc9220dea247341c9eb0191e9f9c755bae1c9ffd145eb2b",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "canonStatus": "source role and selected edition documented; gameplay geometry and choreography remain adaptations; visual review pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13"
  },
  "Witch": {
    "incarnation": "Left 4 Dead (2008), original seated Witch before being startled",
    "visualAnchor": "Original Left 4 Dead Witch: hunched human infected with long unkempt hair, pale damaged skin, very long claw-like fingernails, bare feet and torn civilian clothing, seated and crying before provocation. Not a bride, a daytime wandering sequel variant or a spell-casting witch.",
    "equipment": [
      "Elongated fingernails"
    ],
    "referenceUrl": "https://store.steampowered.com/app/500/Left_4_Dead/",
    "referenceUrls": [
      "https://store.steampowered.com/app/500/Left_4_Dead/"
    ],
    "sourceRoleContract": {
      "entityKind": "special-infected",
      "sourceBody": "Original seated and crying Witch",
      "sourceGameplayBoundary": "Startling triggers pursuit and claw attacks. Witch is an infected human title, not evidence for sorcery or a ranged scream projectile.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-l4d.html.gz",
        "sha256": "331d946e007f4527263f7bac5178dceb9da0e42988ed7f76392d578802c2995b",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-l4d.html.gz",
        "sha256": "ba9941b3e4ed6af1cbb2fcf0554df488d78d66aee87b1e8a926191c176e529b5",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "canonStatus": "source role and selected edition documented; gameplay geometry and choreography remain adaptations; visual review pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13"
  },
  "Witch Crying Corner": {
    "incarnation": "Left 4 Dead (2008), original Witch seated in a dark corner",
    "visualAnchor": "Same original Left 4 Dead Witch body in its seated crying posture, long unkempt hair, elongated nails, bare feet and torn civilian clothes. The corner is encounter placement, not a new Witch species, costume or bride model.",
    "equipment": [
      "Elongated fingernails"
    ],
    "referenceUrl": "https://store.steampowered.com/app/500/Left_4_Dead/",
    "referenceUrls": [
      "https://store.steampowered.com/app/500/Left_4_Dead/"
    ],
    "sourceRoleContract": {
      "entityKind": "special-infected-state",
      "sourceBody": "Original Witch, seated crying encounter state",
      "sourceGameplayBoundary": "Crying is an alert cue; Startled Scream is an encounter label, not a damaging magical sonic ability.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-l4d.html.gz",
        "sha256": "331d946e007f4527263f7bac5178dceb9da0e42988ed7f76392d578802c2995b",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-l4d.html.gz",
        "sha256": "ba9941b3e4ed6af1cbb2fcf0554df488d78d66aee87b1e8a926191c176e529b5",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "canonStatus": "source role and selected edition documented; gameplay geometry and choreography remain adaptations; visual review pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13"
  },
  "Tank Horde Breaker": {
    "incarnation": "Left 4 Dead (2008), original Tank in a horde or rescue encounter",
    "visualAnchor": "Original Left 4 Dead Tank: massively overgrown bare upper body, enormous arms, small human head and torn trousers, with a forward heavy posture. Retain the original infected body without armor, artificial gauntlets or a second Witch body fused to it.",
    "equipment": [
      "Thrown environmental rubble",
      "Massive infected hands"
    ],
    "referenceUrl": "https://store.steampowered.com/app/500/Left_4_Dead/",
    "referenceUrls": [
      "https://store.steampowered.com/app/500/Left_4_Dead/"
    ],
    "sourceRoleContract": {
      "entityKind": "special-infected",
      "sourceBody": "Original Tank infected human; Horde Breaker is an encounter alias",
      "sourceGameplayBoundary": "Punching, throwing rubble and striking movable props are source attack families. Safe Room Breach is a project encounter label and does not guarantee destruction of every locked safe-room door.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-l4d.html.gz",
        "sha256": "331d946e007f4527263f7bac5178dceb9da0e42988ed7f76392d578802c2995b",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-l4d.html.gz",
        "sha256": "ba9941b3e4ed6af1cbb2fcf0554df488d78d66aee87b1e8a926191c176e529b5",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "canonStatus": "source role and selected edition documented; gameplay geometry and choreography remain adaptations; visual review pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13"
  }
};
const clone = value => structuredClone(value);
export function applyLeft4DeadHeroSourceContracts(value, sourceId) {
  if (Array.isArray(value)) return value.map(actor => applyLeft4DeadHeroSourceContracts(actor));
  if (value?.universe && value.universe !== "Left 4 Dead") return value;
  const contract = HERO_CONTRACTS[sourceId || value?.id];
  return contract ? { ...value, ...clone(contract) } : value;
}
export function applyLeft4DeadEnemySourceContract(value, sourceName) {
  if (!value || value.universe && value.universe !== "Left 4 Dead") return value;
  const contract = ENEMY_CONTRACTS[sourceName || value.name];
  return contract ? { ...value, ...clone(contract) } : value;
}
export function applyLeft4DeadEnemySourceContracts(roster) {
  return { ...roster,
    ...(roster.monsters ? { monsters: roster.monsters.map(actor => applyLeft4DeadEnemySourceContract(actor)) } : {}),
    ...(roster.bosses ? { bosses: roster.bosses.map(actor => applyLeft4DeadEnemySourceContract(actor)) } : {}),
    ...(roster.worldBoss ? { worldBoss: applyLeft4DeadEnemySourceContract(roster.worldBoss) } : {}) };
}
export function applyLeft4DeadExpandedSourceContracts(record) {
  const hero = tuple => HERO_CONTRACTS[tuple[0]]
    ? [tuple[0], tuple[1], tuple[2], { ...(tuple[3] || {}), ...clone(HERO_CONTRACTS[tuple[0]]) }] : tuple;
  const enemy = value => ENEMY_CONTRACTS[typeof value === 'string' ? value : value?.name]
    ? applyLeft4DeadEnemySourceContract(typeof value === 'string' ? { name: value } : value) : value;
  return { ...record, hero: hero(record.hero), allies: record.allies.map(hero),
    monsters: record.monsters.map(enemy), bosses: record.bosses.map(enemy) };
}
