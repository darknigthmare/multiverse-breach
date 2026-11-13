// Closed per-actor source targets. Metadata and source-role descriptions never approve artwork.
const HERO_CONTRACTS = {
  "chell": {
    "incarnation": "Portal 2 (2011), adult Chell in the single-player test chambers",
    "visualAnchor": "Portal 2 adult Chell: dark ponytail, white Aperture tank top, orange jumpsuit tied at the waist, long-fall boots and the white-and-black dual portal device. Retain her human proportions; no Portal 1 closed jumpsuit, firearms, turret backpack or neurotoxin emitter.",
    "equipment": [
      "Aperture dual portal device",
      "Long Fall Boots"
    ],
    "referenceUrl": "https://store.steampowered.com/app/620/Portal_2/",
    "referenceUrls": [
      "https://store.steampowered.com/app/620/Portal_2/"
    ],
    "sourceRoleContract": {
      "entityKind": "human-test-subject",
      "sourceBody": "Adult human Chell, Portal 2 default test outfit",
      "sourceGameplayBoundary": "The portal device places portals on compatible surfaces; it does not shoot damaging energy. Existing route/boot support abstractions are retained; no complete portal-physics claim.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-portal2.html.gz",
        "sha256": "7aef5201336463072da2f6ed16a6f9d2ed393d66447731ea422fb4d7913dabc8",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal2.html.gz",
        "sha256": "d6d0b0e92ca8dc7bb86ceb26da8c186da4f13242152d856aceed1bf9eaba6461",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "weaponType": "portalgun",
    "canonStatus": "source role and selected edition documented; gameplay geometry and choreography remain adaptations; visual review pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13",
    "simple": {
      "name": "Repérage de test de Chell",
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
        "reduce": 0.18
      }
    },
    "secondary": {
      "name": "Indication du passage de Chell",
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
      "cd": 6
    },
    "defense": {
      "name": "Appui des bottes de Chell",
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
      "name": "Repérage de passage de Chell",
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
        "reduce": 0.38
      },
      "meterCost": 100
    }
  },
  "atlas": {
    "incarnation": "Portal 2 (2011), cooperative ATLAS test-robot chassis",
    "visualAnchor": "Portal 2 ATLAS: short rounded spherical white shell, one blue optic, exposed dark joints, two arms and two legs, carrying the co-op portal device. Keep his compact body distinct from tall P-Body; no independent turret guns.",
    "equipment": [
      "ATLAS co-op portal device",
      "White spherical robot shell",
      "Blue optic"
    ],
    "referenceUrl": "https://store.steampowered.com/app/620/Portal_2/",
    "referenceUrls": [
      "https://store.steampowered.com/app/620/Portal_2/"
    ],
    "sourceRoleContract": {
      "entityKind": "test-robot",
      "sourceBody": "ATLAS cooperative robot, not a detached personality core",
      "sourceGameplayBoundary": "Co-op portal placement, pings and joint test coordination are support adaptations; no damaging portal shot or turret deployment.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-portal2.html.gz",
        "sha256": "7aef5201336463072da2f6ed16a6f9d2ed393d66447731ea422fb4d7913dabc8",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal2.html.gz",
        "sha256": "d6d0b0e92ca8dc7bb86ceb26da8c186da4f13242152d856aceed1bf9eaba6461",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "weaponType": "portalgun",
    "canonStatus": "source role and selected edition documented; gameplay geometry and choreography remain adaptations; visual review pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13",
    "simple": {
      "name": "Signal de test d’ATLAS",
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
      }
    },
    "secondary": {
      "name": "Coordination du passage par ATLAS",
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
      "cd": 6
    },
    "defense": {
      "name": "Appui mécanique d’ATLAS",
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
      "name": "Coordination de test d’ATLAS",
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
      "meterCost": 100
    }
  },
  "pbody": {
    "incarnation": "Portal 2 (2011), cooperative P-Body test-robot chassis",
    "visualAnchor": "Portal 2 P-Body: tall narrow oval white shell, orange optic, long slender articulated legs and arms with dark joints; co-op portal device held as test equipment. Do not substitute the short spherical ATLAS body.",
    "equipment": [
      "P-Body co-op portal device",
      "Tall oval robot shell",
      "Orange optic"
    ],
    "referenceUrl": "https://store.steampowered.com/app/620/Portal_2/",
    "referenceUrls": [
      "https://store.steampowered.com/app/620/Portal_2/"
    ],
    "sourceRoleContract": {
      "entityKind": "test-robot",
      "sourceBody": "P-Body cooperative robot",
      "sourceGameplayBoundary": "Co-op route signaling and test coordination are support abstractions, not a damaging laser or an offensive hard-light bridge power.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-portal2.html.gz",
        "sha256": "7aef5201336463072da2f6ed16a6f9d2ed393d66447731ea422fb4d7913dabc8",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal2.html.gz",
        "sha256": "d6d0b0e92ca8dc7bb86ceb26da8c186da4f13242152d856aceed1bf9eaba6461",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "weaponType": "portalgun",
    "canonStatus": "source role and selected edition documented; gameplay geometry and choreography remain adaptations; visual review pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13",
    "simple": {
      "name": "Signal de test de P-Body",
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
      }
    },
    "secondary": {
      "name": "Coordination du passage par P-Body",
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
      "cd": 6
    },
    "defense": {
      "name": "Appui mécanique de P-Body",
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
      "name": "Coordination de test de P-Body",
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
      "meterCost": 100
    }
  },
  "glados": {
    "incarnation": "Portal 2 (2011), GLaDOS in her central chamber chassis",
    "visualAnchor": "Portal 2 GLaDOS central chassis: suspended white and black segmented mechanical assembly, a yellow optic and ceiling-connected cables and supports. No humanoid legs, portable flight, potato shell or Portal 1 personality-core cluster in this selected form.",
    "equipment": [
      "Ceiling-mounted central AI chassis",
      "Yellow optic",
      "Facility connection cables"
    ],
    "referenceUrl": "https://store.steampowered.com/app/620/Portal_2/",
    "referenceUrls": [
      "https://store.steampowered.com/app/620/Portal_2/"
    ],
    "sourceRoleContract": {
      "entityKind": "central-ai-machine",
      "sourceBody": "Stationary chamber-linked machine, distinct from the PotatOS prop",
      "sourceGameplayBoundary": "The playable support slot relays instructions. Facility turrets and neurotoxin remain environmental systems, not portable equipment carried by GLaDOS.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-portal2.html.gz",
        "sha256": "7aef5201336463072da2f6ed16a6f9d2ed393d66447731ea422fb4d7913dabc8",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal2.html.gz",
        "sha256": "d6d0b0e92ca8dc7bb86ceb26da8c186da4f13242152d856aceed1bf9eaba6461",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "weaponType": "none",
    "canonStatus": "source role and selected edition documented; gameplay geometry and choreography remain adaptations; visual review pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13",
    "simple": {
      "name": "Indication de test de GLaDOS",
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
      }
    },
    "secondary": {
      "name": "Consigne de chambre de GLaDOS",
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
      "cd": 6
    },
    "defense": {
      "name": "Maintien du châssis de GLaDOS",
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
      "name": "Consigne de test de GLaDOS",
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
      "meterCost": 100
    }
  },
  "wheatley": {
    "incarnation": "Portal 2 (2011), Wheatley personality sphere before central-chassis transfer",
    "visualAnchor": "Portal 2 Wheatley personality sphere: white spherical casing, single blue optic, black side handles and articulated eye mount. Use his core form held or attached to facility rails; no Wheatley central chassis, independent combat-drone wings or gun.",
    "equipment": [
      "Personality sphere casing",
      "Blue optic",
      "Side handles and rail attachment"
    ],
    "referenceUrl": "https://store.steampowered.com/app/620/Portal_2/",
    "referenceUrls": [
      "https://store.steampowered.com/app/620/Portal_2/"
    ],
    "sourceRoleContract": {
      "entityKind": "personality-core",
      "sourceBody": "Detached or rail-mounted spherical core, not a flying sentry",
      "sourceGameplayBoundary": "Speech and warnings are zero-damage support. This form does not control the central-chassis bomb or turret systems.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-portal2.html.gz",
        "sha256": "7aef5201336463072da2f6ed16a6f9d2ed393d66447731ea422fb4d7913dabc8",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal2.html.gz",
        "sha256": "d6d0b0e92ca8dc7bb86ceb26da8c186da4f13242152d856aceed1bf9eaba6461",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "weaponType": "none",
    "canonStatus": "source role and selected edition documented; gameplay geometry and choreography remain adaptations; visual review pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13",
    "simple": {
      "name": "Signal du noyau Wheatley",
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
        "reduce": 0.18
      }
    },
    "secondary": {
      "name": "Repérage prudent de Wheatley",
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
      "cd": 6
    },
    "defense": {
      "name": "Retrait du noyau Wheatley",
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
        "reduce": 0.4
      },
      "reduce": 0.4,
      "dur": 1.2
    },
    "special": {
      "name": "Avertissement de Wheatley",
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
        "reduce": 0.38
      },
      "meterCost": 100
    }
  },
  "cave_johnson": {
    "incarnation": "Portal 2 (2011), Cave Johnson in the old-Aperture 1950s office portrait; human archival identity",
    "visualAnchor": "Cave Johnson in Portal 2 archival office material: adult human founder with dark hair and moustache in period business clothing. Keep an archival human presentation distinct from a personality sphere, robotic chassis or living present-day combatant; detailed portrait colors remain visually unverified.",
    "equipment": [
      "Archival Aperture portrait and recorded instructions"
    ],
    "referenceUrl": "https://store.steampowered.com/app/620/Portal_2/",
    "referenceUrls": [
      "https://store.steampowered.com/app/620/Portal_2/"
    ],
    "sourceRoleContract": {
      "entityKind": "archival-human",
      "sourceBody": "Human Cave Johnson selected from the old-Aperture 1950s office portrait; no present-day living body is claimed",
      "sourceGameplayBoundary": "Recorded test instructions are support adaptations. Combustible lemons are a speech proposal, not a delivered handheld explosive weapon; no moon-rock shield or firearm.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-portal2.html.gz",
        "sha256": "7aef5201336463072da2f6ed16a6f9d2ed393d66447731ea422fb4d7913dabc8",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal2.html.gz",
        "sha256": "d6d0b0e92ca8dc7bb86ceb26da8c186da4f13242152d856aceed1bf9eaba6461",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "weaponType": "none",
    "canonStatus": "source role and selected edition documented; gameplay geometry and choreography remain adaptations; visual review pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13",
    "simple": {
      "name": "Enregistrement de consigne de Cave",
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
      "name": "Annoncer la procédure du laboratoire",
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
      "name": "Retrait vers la zone de test sûre",
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
      "name": "Consignes enregistrées d'Aperture",
      "type": "buff",
      "dmg": 0,
      "color": "#f39c12",
      "animationDuration": 1.1,
      "hitAt": 0.45,
      "targeting": {
        "effect": "buff",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "buffMultiplier": 1.3,
        "duration": 6
      }
    },
    "sourceInvocationContract": {
      "kind": "same-universe-reinforcement",
      "performerHeroId": "chell",
      "performerIncarnation": "Portal 2 (2011), adult Chell in the single-player test chambers",
      "sourceSceneContext": "Portal 2 old-Aperture traversal: Chell hears the founder through archival test recordings and sees historical portraits. This Nexus support scene does not put living Cave Johnson beside Chell or give her a turret deployment.",
      "canonicalSummon": false,
      "sameCanonicalCombatSceneClaimed": false,
      "source1to1Verified": false,
      "visualFidelityApproved": false
    }
  },
  "caroline_portal": {
    "incarnation": "Portal 2 (2011), human Caroline in the old-Aperture 1950s office portrait",
    "visualAnchor": "Portal 2 human Caroline: adult human assistant with dark waved hair and period office clothing in the archival portrait. Do not replace her with a GLaDOS robotic shell, yellow mechanical optic or laser-wielding soldier; exact portrait coloring and facial resemblance remain pending visual review.",
    "equipment": [
      "Aperture administrative records"
    ],
    "referenceUrl": "https://store.steampowered.com/app/620/Portal_2/",
    "referenceUrls": [
      "https://store.steampowered.com/app/620/Portal_2/"
    ],
    "sourceRoleContract": {
      "entityKind": "archival-human",
      "sourceBody": "Human assistant, separate from the later GLaDOS machine form",
      "sourceGameplayBoundary": "Office coordination is support. Recorded history does not give human Caroline an energy gun, neurotoxin emitter or a physical robot body.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-portal2.html.gz",
        "sha256": "7aef5201336463072da2f6ed16a6f9d2ed393d66447731ea422fb4d7913dabc8",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal2.html.gz",
        "sha256": "d6d0b0e92ca8dc7bb86ceb26da8c186da4f13242152d856aceed1bf9eaba6461",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "weaponType": "none",
    "canonStatus": "source role and selected edition documented; gameplay geometry and choreography remain adaptations; visual review pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13",
    "simple": {
      "name": "Caroline vérifie le dossier du laboratoire",
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
      "name": "Coordonner le prochain test",
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
      "name": "Abri administratif d’Aperture",
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
      "name": "Coordination administrative de Caroline",
      "type": "guard",
      "dmg": 0,
      "color": "#e8d2a6",
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
      }
    },
    "sourceInvocationContract": {
      "kind": "same-universe-reinforcement",
      "performerHeroId": "chell",
      "performerIncarnation": "Portal 2 (2011), adult Chell in the single-player test chambers",
      "sourceSceneContext": "Portal 2 archival office material identifies human Caroline, separate from the later GLaDOS machine. Nexus cross-era coordination with adult Chell is an explicit adaptation, not a source scene in which the two humans fought together.",
      "canonicalSummon": false,
      "sameCanonicalCombatSceneClaimed": false,
      "source1to1Verified": false,
      "visualFidelityApproved": false
    }
  },
  "doug_rattmann": {
    "incarnation": "Portal 2: Lab Rat (2011), Doug Rattmann in the official bridge comic",
    "visualAnchor": "Official Lab Rat Doug Rattmann: dishevelled human scientist with unkempt hair, beard and lab clothing, linked to hand-drawn wall murals, hidden routes and the Companion Cube. Preserve the comic human identity; the cube is a prop, not a new limb or a combat terminal.",
    "equipment": [
      "Companion Cube",
      "Hand-drawn route murals"
    ],
    "referenceUrl": "https://store.steampowered.com/app/620/Portal_2/",
    "referenceUrls": [
      "https://store.steampowered.com/app/620/Portal_2/",
      "https://www.thinkwithportals.com/comic/"
    ],
    "sourceRoleContract": {
      "entityKind": "human-support",
      "sourceBody": "Human Aperture scientist in the official Lab Rat comic",
      "sourceGameplayBoundary": "Route clues and careful retreat are support abstractions; no hallucination attack, portal gun, administrative superpower or handheld terminal weapon.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/portal-lab-rat.html.gz",
        "sha256": "b8bb36a5a311b7cd7af6bd580a6d6c6fc16fb351d3f496c43c04fdc9ec7bb292",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal2.html.gz",
        "sha256": "d6d0b0e92ca8dc7bb86ceb26da8c186da4f13242152d856aceed1bf9eaba6461",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "weaponType": "none",
    "canonStatus": "source role and selected edition documented; gameplay geometry and choreography remain adaptations; visual review pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13",
    "simple": {
      "name": "Repérage de Rattmann",
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
        "reduce": 0.18
      }
    },
    "secondary": {
      "name": "Lecture du passage de Rattmann",
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
      "cd": 6
    },
    "defense": {
      "name": "Retrait discret de Rattmann",
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
        "reduce": 0.4
      },
      "reduce": 0.4,
      "dur": 1.2
    },
    "special": {
      "name": "Indication du passage de Rattmann",
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
        "reduce": 0.38
      },
      "meterCost": 100
    }
  },
  "glados_core": {
    "incarnation": "Portal 2 (2011), GLaDOS carried as PotatOS after Wheatley transfers her to a potato battery",
    "visualAnchor": "Portal 2 PotatOS: an irregular brown potato battery carrying GLaDOS electronics, a yellow optic, wires and clips. It is a small physical prop carried with the portal device, not a humanoid, full central chassis or armed hovering core.",
    "equipment": [
      "Potato battery",
      "GLaDOS optic and attached electronics",
      "Battery wires and clips"
    ],
    "referenceUrl": "https://store.steampowered.com/app/620/Portal_2/",
    "referenceUrls": [
      "https://store.steampowered.com/app/620/Portal_2/"
    ],
    "sourceRoleContract": {
      "entityKind": "potato-battery-ai",
      "sourceBody": "Potato-mounted AI prop with no limbs or portable weapon",
      "sourceGameplayBoundary": "Voice and low-power battery readings can inform the team. PotatOS has no damaging zap, neurotoxin installation or central-facility rewrite attack.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-portal2.html.gz",
        "sha256": "7aef5201336463072da2f6ed16a6f9d2ed393d66447731ea422fb4d7913dabc8",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal2.html.gz",
        "sha256": "d6d0b0e92ca8dc7bb86ceb26da8c186da4f13242152d856aceed1bf9eaba6461",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "weaponType": "none",
    "canonStatus": "source role and selected edition documented; gameplay geometry and choreography remain adaptations; visual review pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13",
    "simple": {
      "name": "Lecture de la batterie PotatOS",
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
      }
    },
    "secondary": {
      "name": "Consigne de test de PotatOS",
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
      "cd": 6
    },
    "defense": {
      "name": "Préserver la batterie PotatOS",
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
      "name": "Indications vocales de PotatOS",
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
      "meterCost": 100
    },
    "sourceInvocationContract": {
      "kind": "same-universe-reinforcement",
      "performerHeroId": "chell",
      "performerIncarnation": "Portal 2 (2011), adult Chell in the single-player test chambers",
      "sourceSceneContext": "Portal 2 after Wheatley puts GLaDOS on a potato battery: PotatOS accompanies and advises Chell, carried with her portal device. The support actor remains Chell; no potato laser, turret factory or neurotoxin system is carried into the scene.",
      "canonicalSummon": false,
      "sameCanonicalCombatSceneClaimed": false,
      "source1to1Verified": false,
      "visualFidelityApproved": false
    }
  },
  "cave_johnson_echo": {
    "sourceRoleContract": {
      "sourceWork": "Portal 2 (2011), archived Cave Johnson test instructions",
      "entityKind": "recorded-audio",
      "sourceBody": "No independent body or canon entity named Cave Johnson Echo is established. Preserve the legacy roster ID without designing a ghost or recording sphere.",
      "sourceGameplayBoundary": "The source is recorded speech. Zero-damage team instructions are a gameplay adaptation; no thrown combustible lemons, moon-rock shield or living duplicate.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false,
      "canonicalEntityStatus": "UNRESOLVED_LEGACY_ADAPTATION"
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-portal2.html.gz",
        "sha256": "7aef5201336463072da2f6ed16a6f9d2ed393d66447731ea422fb4d7913dabc8",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal2.html.gz",
        "sha256": "d6d0b0e92ca8dc7bb86ceb26da8c186da4f13242152d856aceed1bf9eaba6461",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "relatedSourceUrls": [
      "https://store.steampowered.com/app/620/Portal_2/"
    ],
    "incarnation": "Portal 2 (2011), Cave Johnson 1980s old-Aperture audio recordings; legacy Echo alias has no independent canonical body",
    "canonStatus": "legacy project adaptation; independent canonical actor body remains unresolved; no source identity or visual approval",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13",
    "simple": {
      "name": "Diffuser une consigne enregistrée",
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
      "name": "Rappeler la procédure Aperture",
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
      "name": "Rappeler la zone de test sûre",
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
      "name": "Instructions archivées de Cave Johnson",
      "type": "buff",
      "dmg": 0,
      "color": "#f39c12",
      "animationDuration": 1.1,
      "hitAt": 0.45,
      "targeting": {
        "effect": "buff",
        "targetSide": "ally",
        "shape": "group",
        "delivery": "support",
        "range": 760,
        "buffMultiplier": 1.3,
        "duration": 6
      }
    },
    "weaponType": "none",
    "equipment": [
      "Archived voice recordings; no independently embodied Echo"
    ],
    "sourceInvocationContract": {
      "kind": "same-universe-reinforcement",
      "performerHeroId": "chell",
      "performerIncarnation": "Portal 2 (2011), adult Chell in the single-player test chambers",
      "sourceSceneContext": "Portal 2 archived Cave Johnson instructions are played to Chell in old Aperture. An audio channel does not summon a ghost, a Recording Core body or real combustible lemons; adult Chell supplies the Nexus route-support action.",
      "canonicalSummon": false,
      "sameCanonicalCombatSceneClaimed": false,
      "source1to1Verified": false,
      "visualFidelityApproved": false
    }
  }
};
const ENEMY_CONTRACTS = {
  "Aperture Security Turret": {
    "incarnation": "Portal (2007), standard Aperture floor sentry turret",
    "visualAnchor": "Portal 2007 floor turret: white teardrop shell, black inner frame, one red optic, three narrow support legs and side-mounted gun assemblies. It is a grounded machine, not a humanoid carrying a rifle.",
    "equipment": [
      "Built-in sentry guns",
      "Three-legged floor mount"
    ],
    "referenceUrl": "https://store.steampowered.com/app/400/Portal/",
    "referenceUrls": [
      "https://store.steampowered.com/app/400/Portal/"
    ],
    "sourceRoleContract": {
      "entityKind": "turret-machine",
      "sourceBody": "Standard floor-mounted sentry",
      "sourceGameplayBoundary": "Enemy balance and mobility are adaptations; the source machine fires its own mounted guns.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-portal.html.gz",
        "sha256": "bd3322e6f758c7a32c4f99735d427c05f387894c9beeaed295245e0b9844b3f6",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
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
  "Defective Red Eye Turret": {
    "incarnation": "Portal 2 (2011), defective turret from the turret manufacturing line",
    "visualAnchor": "Portal 2 defective turret: exposed dark internal frame, red optic and incomplete or absent white outer shell, on narrow turret supports. Do not render an ordinary complete white sentry just because both have red eyes.",
    "equipment": [
      "Defective turret frame",
      "Red optic"
    ],
    "referenceUrl": "https://store.steampowered.com/app/620/Portal_2/",
    "referenceUrls": [
      "https://store.steampowered.com/app/620/Portal_2/"
    ],
    "sourceRoleContract": {
      "entityKind": "defective-turret-machine",
      "sourceBody": "Rejected manufacturing-line turret",
      "sourceGameplayBoundary": "Defective turrets are not healthy armed sentries. The retained legacy shoot profile is an open combat adaptation, not proof of working canonical guns.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-portal2.html.gz",
        "sha256": "7aef5201336463072da2f6ed16a6f9d2ed393d66447731ea422fb4d7913dabc8",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal2.html.gz",
        "sha256": "d6d0b0e92ca8dc7bb86ceb26da8c186da4f13242152d856aceed1bf9eaba6461",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
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
  "Sentry Drone Sphere": {
    "sourceRoleContract": {
      "sourceWork": "Portal 2 (2011), related Aperture personality-sphere technology",
      "entityKind": "unresolved-adaptation",
      "sourceBody": "No exact canonical flying combat entity named Sentry Drone Sphere is established.",
      "sourceGameplayBoundary": "A personality sphere is not evidence for a sentry drone, wings, tackle attack or turret equipment. Identity, body and gameplay remain unresolved.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false,
      "canonicalEntityStatus": "UNRESOLVED_LEGACY_ADAPTATION"
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-portal2.html.gz",
        "sha256": "7aef5201336463072da2f6ed16a6f9d2ed393d66447731ea422fb4d7913dabc8",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal2.html.gz",
        "sha256": "d6d0b0e92ca8dc7bb86ceb26da8c186da4f13242152d856aceed1bf9eaba6461",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "relatedSourceUrls": [
      "https://store.steampowered.com/app/620/Portal_2/"
    ],
    "canonStatus": "legacy project adaptation; independent canonical actor body remains unresolved; no source identity or visual approval",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13"
  },
  "Frankenturret Cube": {
    "incarnation": "Portal 2 (2011), Wheatley turret-and-weighted-cube hybrid",
    "visualAnchor": "Portal 2 Frankenturret: a weighted cube combined with visibly awkward turret components and thin mechanical legs. Preserve the cube-and-turret construction rather than inventing a humanoid robot; detailed assembly and lens positions require the pending model review.",
    "equipment": [
      "Weighted cube assembly",
      "Attached turret parts"
    ],
    "referenceUrl": "https://store.steampowered.com/app/620/Portal_2/",
    "referenceUrls": [
      "https://store.steampowered.com/app/620/Portal_2/"
    ],
    "sourceRoleContract": {
      "entityKind": "hybrid-test-prop",
      "sourceBody": "Turret-cube hybrid created during Wheatley testing",
      "sourceGameplayBoundary": "Shuffling or hopping is an adaptation of the unstable hybrid. It is not a standard sentry, a Companion Cube face or a source-approved crush finisher.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-portal2.html.gz",
        "sha256": "7aef5201336463072da2f6ed16a6f9d2ed393d66447731ea422fb4d7913dabc8",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal2.html.gz",
        "sha256": "d6d0b0e92ca8dc7bb86ceb26da8c186da4f13242152d856aceed1bf9eaba6461",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
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
  "Rocket Turret Mount": {
    "incarnation": "Portal (2007), fixed rocket sentry in Aperture test and central-AI chambers",
    "visualAnchor": "Portal 2007 rocket turret: fixed industrial launcher head, dark mechanical mounting and tracking optic, attached to facility structure. Keep it distinct from the three-legged bullet sentry.",
    "equipment": [
      "Facility-mounted rocket launcher",
      "Tracking optic"
    ],
    "referenceUrl": "https://store.steampowered.com/app/400/Portal/",
    "referenceUrls": [
      "https://store.steampowered.com/app/400/Portal/"
    ],
    "sourceRoleContract": {
      "entityKind": "rocket-turret-machine",
      "sourceBody": "Fixed rocket launcher mechanism",
      "sourceGameplayBoundary": "Tracks targets and launches rockets in Portal 2007. Movement, health and attack timing in this roster are balance adaptations.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-portal.html.gz",
        "sha256": "bd3322e6f758c7a32c4f99735d427c05f387894c9beeaed295245e0b9844b3f6",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
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
  "Excursion Funnel Hazard": {
    "incarnation": "Portal 2 (2011), Excursion Funnel transport volume",
    "visualAnchor": "Portal 2 Excursion Funnel: a projected blue transport funnel emitted from an installed circular apparatus; reversing changes its flow and presentation. Render the beam and its fixture as environment, with no face, arms, legs or separate creature body.",
    "equipment": [
      "Installed funnel emitter"
    ],
    "referenceUrl": "https://store.steampowered.com/app/620/Portal_2/",
    "referenceUrls": [
      "https://store.steampowered.com/app/620/Portal_2/"
    ],
    "sourceRoleContract": {
      "entityKind": "environmental-system",
      "sourceBody": "Transport volume and environmental emitter, not a combat creature",
      "sourceGameplayBoundary": "Funnel force transports objects and players; it is not innate damaging energy. The legacy tractor_beam combat mapping and mobile HP-bearing representation remain OPEN adaptations.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-portal2.html.gz",
        "sha256": "7aef5201336463072da2f6ed16a6f9d2ed393d66447731ea422fb4d7913dabc8",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal2.html.gz",
        "sha256": "d6d0b0e92ca8dc7bb86ceb26da8c186da4f13242152d856aceed1bf9eaba6461",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
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
  "Rocket Turret Prototype": {
    "incarnation": "Portal (2007), rocket-turret mechanism; Prototype is the legacy encounter label",
    "visualAnchor": "Portal 2007 fixed rocket turret apparatus, with mechanical mount, launcher and tracking optic. The legacy Prototype suffix does not establish an extra canonical model or a different armed robot body.",
    "equipment": [
      "Fixed rocket launcher apparatus"
    ],
    "referenceUrl": "https://store.steampowered.com/app/400/Portal/",
    "referenceUrls": [
      "https://store.steampowered.com/app/400/Portal/"
    ],
    "sourceRoleContract": {
      "entityKind": "rocket-turret-machine",
      "sourceBody": "Same source mechanism as the Portal 2007 rocket turret, with an unverified project encounter suffix",
      "sourceGameplayBoundary": "The suffix is a project encounter label, not an additional source prototype, new ammunition type or extra power.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-portal.html.gz",
        "sha256": "bd3322e6f758c7a32c4f99735d427c05f387894c9beeaed295245e0b9844b3f6",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
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
  "Gel Pump Hazard": {
    "incarnation": "Portal 2 (2011), installed gel distribution apparatus in old Aperture tests",
    "visualAnchor": "Portal 2 environmental gel apparatus: installed industrial pipes, outlets and colored test-gel splashes on chamber surfaces. There is no gel-pump humanoid, independent face or hand-held gel cannon.",
    "equipment": [
      "Installed pipes and gel outlet"
    ],
    "referenceUrl": "https://store.steampowered.com/app/620/Portal_2/",
    "referenceUrls": [
      "https://store.steampowered.com/app/620/Portal_2/"
    ],
    "sourceRoleContract": {
      "entityKind": "environmental-system",
      "sourceBody": "Gel distribution machinery and coated surfaces",
      "sourceGameplayBoundary": "Repulsion, propulsion and conversion gels alter surface behavior. A generic damaging gel attack and mobile creature body are legacy gameplay adaptations requiring review.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-portal2.html.gz",
        "sha256": "7aef5201336463072da2f6ed16a6f9d2ed393d66447731ea422fb4d7913dabc8",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal2.html.gz",
        "sha256": "d6d0b0e92ca8dc7bb86ceb26da8c186da4f13242152d856aceed1bf9eaba6461",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
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
  "Wheatley Central AI": {
    "incarnation": "Portal 2 (2011), Wheatley after transfer into the central AI chassis",
    "visualAnchor": "Portal 2 central Wheatley: the large suspended white-and-black central machine assembly now carrying his blue optic. It is distinct from the small rail-mounted personality sphere and does not gain a human body.",
    "equipment": [
      "Central AI chassis",
      "Blue optic",
      "Facility-linked bomb and turret apparatus"
    ],
    "referenceUrl": "https://store.steampowered.com/app/620/Portal_2/",
    "referenceUrls": [
      "https://store.steampowered.com/app/620/Portal_2/"
    ],
    "sourceRoleContract": {
      "entityKind": "central-ai-machine",
      "sourceBody": "Wheatley attached to the central-chamber machine",
      "sourceGameplayBoundary": "Bomb and turret encounters depend on the facility. The legacy Portal Loop Crush title is an encounter adaptation, not a portable portal superpower.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-portal2.html.gz",
        "sha256": "7aef5201336463072da2f6ed16a6f9d2ed393d66447731ea422fb4d7913dabc8",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal2.html.gz",
        "sha256": "d6d0b0e92ca8dc7bb86ceb26da8c186da4f13242152d856aceed1bf9eaba6461",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
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
  "Neurotoxin Vent System": {
    "incarnation": "Portal (2007), central AI chamber neurotoxin ventilation hazard",
    "visualAnchor": "Portal 2007 chamber hazard: installed air ducts, ventilation grilles and facility-connected machinery. Represent an environmental system and timer, not a separate green monster or humanoid boss.",
    "equipment": [
      "Chamber ventilation ducts"
    ],
    "referenceUrl": "https://store.steampowered.com/app/400/Portal/",
    "referenceUrls": [
      "https://store.steampowered.com/app/400/Portal/"
    ],
    "sourceRoleContract": {
      "entityKind": "environmental-system",
      "sourceBody": "Built-in chamber ventilation",
      "sourceGameplayBoundary": "A source chamber hazard, never a biological enemy body or a handheld poison device. Legacy boss HP and mobile combat behavior remain unverified adaptations.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-portal.html.gz",
        "sha256": "bd3322e6f758c7a32c4f99735d427c05f387894c9beeaed295245e0b9844b3f6",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
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
  "Fact Core Logic Snare": {
    "incarnation": "Portal 2 (2011), Fact Core attached during the final corrupted-core sequence",
    "visualAnchor": "Portal 2 Fact Core: small white spherical personality-core casing with its distinct colored optic and handles. It speaks incorrect facts; no humanoid body, independent combat drone or physical logic-snare apparatus is established.",
    "equipment": [
      "Personality-core casing",
      "Optic and mounting handles"
    ],
    "referenceUrl": "https://store.steampowered.com/app/620/Portal_2/",
    "referenceUrls": [
      "https://store.steampowered.com/app/620/Portal_2/"
    ],
    "sourceRoleContract": {
      "entityKind": "dialogue-core",
      "sourceBody": "Speaking personality sphere in the corrupted-core sequence",
      "sourceGameplayBoundary": "False facts are dialogue. Logic Snare and Contradiction Cascade are project encounter labels, not canon damaging fact beams or control powers.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-portal2.html.gz",
        "sha256": "7aef5201336463072da2f6ed16a6f9d2ed393d66447731ea422fb4d7913dabc8",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal2.html.gz",
        "sha256": "d6d0b0e92ca8dc7bb86ceb26da8c186da4f13242152d856aceed1bf9eaba6461",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
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
  "Space Core Vacuum Loop": {
    "incarnation": "Portal 2 (2011), Space Core in the final corrupted-core sequence",
    "visualAnchor": "Portal 2 Space Core: small white spherical personality-core shell, optic and handles, with excited dialogue about space. Keep the detached core body; no wings, vacuum generator or gravitational limbs.",
    "equipment": [
      "Personality-core casing",
      "Mounting handles"
    ],
    "referenceUrl": "https://store.steampowered.com/app/620/Portal_2/",
    "referenceUrls": [
      "https://store.steampowered.com/app/620/Portal_2/"
    ],
    "sourceRoleContract": {
      "entityKind": "dialogue-core",
      "sourceBody": "Speaking personality sphere",
      "sourceGameplayBoundary": "Its dialogue and the ending do not establish an innate vacuum, orbit-loop or gravity-pull attack. The legacy offensive slot remains an open adaptation.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-portal2.html.gz",
        "sha256": "7aef5201336463072da2f6ed16a6f9d2ed393d66447731ea422fb4d7913dabc8",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal2.html.gz",
        "sha256": "d6d0b0e92ca8dc7bb86ceb26da8c186da4f13242152d856aceed1bf9eaba6461",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
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
  "Cave Johnson Recording Core": {
    "sourceRoleContract": {
      "sourceWork": "Portal 2 (2011), archived Cave Johnson test recordings",
      "entityKind": "recorded-audio",
      "sourceBody": "Aperture recordings are speech delivered by facility audio. No independent canonical Recording Core body is established.",
      "sourceGameplayBoundary": "Combustible lemon dialogue is not a real delivered explosive weapon, and the existing narrative-hazard policy must not certify a boss body.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false,
      "canonicalEntityStatus": "UNRESOLVED_LEGACY_ADAPTATION"
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-portal2.html.gz",
        "sha256": "7aef5201336463072da2f6ed16a6f9d2ed393d66447731ea422fb4d7913dabc8",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal2.html.gz",
        "sha256": "d6d0b0e92ca8dc7bb86ceb26da8c186da4f13242152d856aceed1bf9eaba6461",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "relatedSourceUrls": [
      "https://store.steampowered.com/app/620/Portal_2/"
    ],
    "canonStatus": "legacy project adaptation; independent canonical actor body remains unresolved; no source identity or visual approval",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13"
  },
  "Aperture Cooperative Test Core": {
    "sourceRoleContract": {
      "sourceWork": "Portal 2 (2011), Aperture cooperative testing program",
      "entityKind": "unresolved-adaptation",
      "sourceBody": "The co-op program and GLaDOS supervisor are established; a distinct entity called Aperture Cooperative Test Core is not.",
      "sourceGameplayBoundary": "Do not manufacture an extra personality sphere, humanoid supervisor or autonomous Infinite Test Chamber power for this legacy encounter alias.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false,
      "canonicalEntityStatus": "UNRESOLVED_LEGACY_ADAPTATION"
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-portal2.html.gz",
        "sha256": "7aef5201336463072da2f6ed16a6f9d2ed393d66447731ea422fb4d7913dabc8",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal2.html.gz",
        "sha256": "d6d0b0e92ca8dc7bb86ceb26da8c186da4f13242152d856aceed1bf9eaba6461",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      }
    ],
    "relatedSourceUrls": [
      "https://store.steampowered.com/app/620/Portal_2/"
    ],
    "canonStatus": "legacy project adaptation; independent canonical actor body remains unresolved; no source identity or visual approval",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "portal-l4d-040-2026-11-13"
  },
  "GLaDOS Central Core": {
    "incarnation": "Portal (2007), GLaDOS in the central AI chamber before core detachment",
    "visualAnchor": "Portal 2007 GLaDOS: ceiling-suspended white and black central machinery, yellow optic, facility cables and detachable personality cores. Keep this machine form distinct from Portal 2 central GLaDOS, Wheatley and the potato battery.",
    "equipment": [
      "Suspended central AI chassis",
      "Detachable personality cores",
      "Facility-linked rocket and ventilation systems"
    ],
    "referenceUrl": "https://store.steampowered.com/app/400/Portal/",
    "referenceUrls": [
      "https://store.steampowered.com/app/400/Portal/"
    ],
    "sourceRoleContract": {
      "entityKind": "central-ai-machine",
      "sourceBody": "Portal 2007 chamber-linked central AI machine",
      "sourceGameplayBoundary": "Rocket redirection, core removal and the neurotoxin timer are chamber interactions. This is not a humanoid carrying a rocket launcher.",
      "sourceSceneReview": "OPEN",
      "sourceBodyVisualReview": "OPEN",
      "source1to1Verified": false
    },
    "sourceReferenceEvidence": [
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/steam-portal.html.gz",
        "sha256": "bd3322e6f758c7a32c4f99735d427c05f387894c9beeaed295245e0b9844b3f6",
        "scope": "edition-and-role text only; images and exact scene geometry not reviewed",
        "imageInspected": false
      },
      {
        "path": "docs/assets/p0-p1-p2-continuation-02-2026-11-13/portal-l4d-040/source-pages/wiki-portal-characters.html.gz",
        "sha256": "5aa65b7b53913a525e5e2a7d5ba0d1c9dada525aa0c0fcb64422c672b8752d6e",
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
export function applyPortalHeroSourceContracts(value, sourceId) {
  if (Array.isArray(value)) return value.map(actor => applyPortalHeroSourceContracts(actor));
  if (value?.universe && value.universe !== "Portal") return value;
  const contract = HERO_CONTRACTS[sourceId || value?.id];
  return contract ? { ...value, ...clone(contract) } : value;
}
export function applyPortalEnemySourceContract(value, sourceName) {
  if (!value || value.universe && value.universe !== "Portal") return value;
  const contract = ENEMY_CONTRACTS[sourceName || value.name];
  return contract ? { ...value, ...clone(contract) } : value;
}
export function applyPortalEnemySourceContracts(roster) {
  return { ...roster,
    ...(roster.monsters ? { monsters: roster.monsters.map(actor => applyPortalEnemySourceContract(actor)) } : {}),
    ...(roster.bosses ? { bosses: roster.bosses.map(actor => applyPortalEnemySourceContract(actor)) } : {}),
    ...(roster.worldBoss ? { worldBoss: applyPortalEnemySourceContract(roster.worldBoss) } : {}) };
}
