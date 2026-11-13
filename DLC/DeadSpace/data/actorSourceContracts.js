// Explicit source targets for the exclusive Gears/Dead Space40 batch.
// Catalog action objects below are projections of already effective actions.
// No image, animation, approval or new ability is granted.
const HEROES = Object.freeze({
  "isaac": {
    "incarnation": "Dead Space (2008), Isaac Clarke and level-3 engineering RIG",
    "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
    "visualAnchor": "Original 2008 Isaac wears the bronze-brown level-3 engineering RIG with heavy segmented ribs, enclosed helmet, three cyan visor bars and a cyan spinal health strip. Hold the 211-V Plasma Cutter as a separate engineering tool; no remake redesign, Advanced Suit or Arctic suit.",
    "equipment": [
      "211-V Plasma Cutter",
      "Level-3 engineering RIG",
      "Stasis and Kinesis modules"
    ],
    "weaponType": "plasma_cutter",
    "sourceScene": {
      "description": "Original Dead Space 2008 USG Ishimura campaign. The selected authored actions are Plasma Cutter fire, readiness and personal guard; Stasis/Kinesis are not arbitrary gravity damage.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    },
    "simple": {
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
    },
    "secondary": {
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
    },
    "defense": {
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
    },
    "special": {
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
  },
  "carver": {
    "incarnation": "Dead Space 3 (2013), John Carver in military RIG",
    "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_3",
    "visualAnchor": "Adult John Carver wears his bulky dark military RIG with red illuminated eye lenses and a blue/cyan spinal health strip. A physical modular military rifle is carried in both hands; no Isaac engineering helmet, Marker body growth or weapon made of hallucinations.",
    "equipment": [
      "Military RIG",
      "Physical modular military rifle"
    ],
    "weaponType": "gun",
    "sourceScene": {
      "description": "Dead Space 3 co-op campaign Carver model. Keep his soldier equipment distinct from Isaac and the hallucination sequences; the authored burst has bounded engine timing.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_3",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    },
    "simple": {
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
    },
    "secondary": {
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
    },
    "defense": {
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
    },
    "special": {
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
  },
  "ellie": {
    "incarnation": "Dead Space 2 (2011), Ellie Langford in civilian pilot workwear",
    "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_2",
    "visualAnchor": "Adult Ellie has dark hair tied back, pale sleeveless work top, brown utility trousers and practical boots. Use the living civilian pilot model of the Sprawl era; no Dead Space 3 winter coat or Isaac-style engineering RIG. Scene-specific eye state must be checked against the selected shot before art approval.",
    "equipment": [
      "Physical rifle used for cover",
      "Civilian pilot workwear"
    ],
    "weaponType": "gun",
    "sourceScene": {
      "description": "Dead Space 2 Ellie pilot scenes. Her escape route is not an area-damage power; exact pre/post-injury eye state remains a scene-review requirement.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_2",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    },
    "simple": {
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
    },
    "secondary": {
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
    },
    "defense": {
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
    },
    "special": {
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
  },
  "nicole_brennan": {
    "incarnation": "Dead Space (2008), living human medical officer Nicole Brennan",
    "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
    "visualAnchor": "Nicole is a living human medical officer in the original 2008 context, with loosely tied auburn/light-brown hair and practical grey-blue medical clothing. An ordinary datapad may support clinical instructions; no ghost glow, Marker lesions, summoned console or healing beam.",
    "equipment": [
      "Medical uniform",
      "Ordinary diagnostic datapad"
    ],
    "weaponType": "unarmed",
    "sourceScene": {
      "description": "Original Dead Space 2008 Nicole medical-record context, before her death; not a Marker hallucination or Dead Space 2 spectral version. Guard and clinical support are role adaptations.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    },
    "simple": {
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
    },
    "secondary": {
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
    },
    "defense": {
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
    },
    "special": {
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
  },
  "zach_hammond": {
    "incarnation": "Dead Space (2008), security chief Zach Hammond",
    "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
    "visualAnchor": "Original 2008 Zach Hammond is an adult Black man with close-cropped hair, dark brown security RIG and blue spinal lights. Carry the SWS Motorized Pulse Rifle; no remake model, Isaac engineering helmet or 211-V Plasma Cutter mislabeled as his rifle.",
    "equipment": [
      "SWS Motorized Pulse Rifle",
      "Original 2008 security RIG"
    ],
    "weaponType": "gun",
    "sourceScene": {
      "description": "Dead Space 2008 Kellion/Ishimura security chief, alive before the USM Valor encounter in Chapter 9; firearm action, not an escape-pod super.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    },
    "simple": {
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
    },
    "secondary": {
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
    },
    "defense": {
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
    },
    "special": {
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
  },
  "kendra_daniels": {
    "incarnation": "Dead Space (2008), original Kendra Daniels",
    "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
    "visualAnchor": "Original 2008 Kendra is an adult human woman with a short dark bob, practical grey-blue technical jumpsuit and a small handheld diagnostic pad. No remake face/costume, military RIG, conjured energy weapon or offensive terminal lightning.",
    "equipment": [
      "Handheld diagnostic pad",
      "Original technical jumpsuit"
    ],
    "weaponType": "terminal",
    "sourceScene": {
      "description": "Original Dead Space 2008 technician scenes. The existing W15 diagnostic/relay actions are zero-damage support adaptations, not source-certified healing or magic.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    },
    "simple": {
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
    },
    "secondary": {
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
    },
    "defense": {
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
    },
    "special": {
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
  },
  "hammond_ds": {
    "incarnation": "Dead Space (2008), Zach Hammond; retained historical duplicate actor ID",
    "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
    "visualAnchor": "This separate historical roster slot depicts the same living 2008 security chief Zach Hammond: adult Black man, close-cropped hair, brown security RIG, blue spinal lamps and physical Pulse Rifle. It is not a new character, ghost, remake model or merged save identity.",
    "equipment": [
      "SWS Motorized Pulse Rifle",
      "Original 2008 security RIG"
    ],
    "weaponType": "gun",
    "sourceScene": {
      "description": "Historical hammond_ds alias retained separately from zach_hammond. Its old mechanics are preserved and require a dedicated source-action review; they are not silently upgraded to the W15 kit.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    },
    "simple": {
      "name": "Security Pulse Rifle",
      "type": "bullet",
      "dmg": 1
    },
    "secondary": {
      "name": "Bridge Order Mark",
      "type": "signature",
      "cd": 7,
      "dmg": 1.8
    },
    "defense": {
      "name": "USG Command Guard",
      "type": "shield",
      "dur": 2,
      "reduce": 0.8
    },
    "special": {
      "name": "Escape Pod Sacrifice",
      "type": "nexus_aoe",
      "dmg": 4.6,
      "color": "#7f8c8d"
    },
    "sourceActionReview": "OPEN: historical duplicate keeps its existing action mechanics; no W15 source kit inferred from a shared character name."
  }
});
const ENEMIES = Object.freeze({
  "Necromorph Slasher Scythe": {
    "incarnation": "Dead Space (2008), standard human Slasher",
    "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
    "visualAnchor": "Original human Slasher with an emaciated humanoid torso, elongated bladed forelimbs, residual human legs and ragged civilian/workwear remnants. Scythe denotes its organic arm blades, not a carried medieval scythe or demonic armor.",
    "equipment": [
      "Organic forearm blades"
    ],
    "weapon": "claws",
    "sourceScene": {
      "description": "Descriptive historical alias for the original 2008 Slasher, not a new weapon-bearing species.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    }
  },
  "Necromorph Leaper Demon": {
    "incarnation": "Dead Space (2008), standard Leaper",
    "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
    "visualAnchor": "Leaper has a low horizontal human-derived body, powerful forearms and a long hooked/barbed tail; its lower limbs are fused into the tail form. Keep the crawling/leaping anatomy without demon horns, wings, human running legs or a carried sword.",
    "equipment": [
      "Natural forelimbs and barbed tail"
    ],
    "weapon": "tail",
    "sourceScene": {
      "description": "Original 2008 Leaper; Demon is a historical encounter label, not evidence of a crossover demon.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    }
  },
  "Necromorph Lurker Pod": {
    "incarnation": "Dead Space (2008), original Lurker crawler",
    "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
    "visualAnchor": "Small original Lurker with a compact low crawler body and three independently raised organic tentacles ending in projectile spines. Preserve the three-tentacle silhouette; no adult soldier RIG, quadruped animal model from another installment or mechanical turret.",
    "equipment": [
      "Three spine-projecting tentacles"
    ],
    "weapon": "spit",
    "sourceScene": {
      "description": "Original 2008 Lurker, with the historical Pod label treated as an encounter alias rather than a distinct species.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    }
  },
  "Slasher Necromorph": {
    "incarnation": "Dead Space (2008), standard Slasher",
    "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
    "visualAnchor": "Human-derived Slasher with a narrow upright torso, extremely long organic arm blades and torn civilian/work clothes, moving on human-derived legs. Do not substitute an armored military variant, a Divider or generic clawed demon.",
    "equipment": [
      "Organic arm blades"
    ],
    "weapon": "bone_blades",
    "sourceScene": {
      "description": "Original 2008 standard Slasher; a source model target, not approval of existing generated pixels.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    }
  },
  "Pregnant Necromorph": {
    "incarnation": "Dead Space (2008), Pregnant form",
    "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
    "visualAnchor": "Large heavy humanoid Necromorph with a swollen abdomen, thick body and long bladed forearms. The abdomen contains separate Swarmers; no explosive yellow Exploder sac, infant Lurker body or firearm.",
    "equipment": [
      "Organic forearm blades",
      "Abdominal Swarmer brood"
    ],
    "weapon": "swarm_burst",
    "sourceScene": {
      "description": "Original 2008 Pregnant; release of Swarmers is a source behavior and is not claimed to be fully simulated by the generic enemy AI.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    }
  },
  "Exploder Necromorph": {
    "incarnation": "Dead Space (2008), Exploder form",
    "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
    "visualAnchor": "Thin asymmetrical humanoid Exploder with one ordinary clawed arm and one conspicuously large yellow explosive pustule hanging from the other side. Its sac detonates; it is not an acid-spitting organ or a carried grenade launcher.",
    "equipment": [
      "Explosive organic sac"
    ],
    "weapon": "explosive_sac",
    "sourceScene": {
      "description": "Original 2008 Exploder; correct the former acid_sac descriptor without adding an unimplemented chemical-damage mechanic.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    }
  },
  "Divider Necromorph": {
    "incarnation": "Dead Space (2008), Divider form",
    "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
    "visualAnchor": "Very tall thin humanoid Divider with stretched torso, small head and long spindly limbs that can separate into independently moving components. No bulky Brute armor, gun, or invented magic splitting staff.",
    "equipment": [
      "Detachable organic limbs"
    ],
    "weapon": "split_attack",
    "sourceScene": {
      "description": "Original 2008 Divider; detached-limb simulation remains a distinct gameplay/animation requirement, not implied by metadata.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    }
  },
  "Leaper Necromorph": {
    "incarnation": "Dead Space (2008), standard Leaper",
    "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
    "visualAnchor": "Low elongated Leaper with thick supporting forearms and a long bladed tail replacing ordinary lower-body locomotion. Preserve the long tail and forearm-driven leaps; no upright human stride, wings or humanoid weapon.",
    "equipment": [
      "Natural forelimbs and barbed tail"
    ],
    "weapon": "tail",
    "sourceScene": {
      "description": "Original 2008 Leaper; separate historical roster entry retained without merging identities.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    }
  },
  "Infector Winged Corpse": {
    "incarnation": "Dead Space (2008), Infector form",
    "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
    "visualAnchor": "Broad low Infector with a flattened torso, two large membranous wing-like limbs and a projecting infection proboscis. It works on corpses; no Slasher scythes, adult humanoid gun stance or Resident Evil T-Virus equipment.",
    "equipment": [
      "Membranous wings",
      "Infection proboscis"
    ],
    "weapon": "infection",
    "sourceScene": {
      "description": "Original 2008 Infector, whose corpse-conversion behavior is not certified by a generic damage attack.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
      "reviewStatus": "documented-source-target; scene/frame comparison remains open"
    }
  },
  "Necromorph Infector Pod": {
    "canonStatus": "Unresolved Nexus-only encounter alias. No canonical Pod identity or visual source is established; existing combat remains an adaptation.",
    "sourceIdentityReview": "OPEN: canonical Infector base organism does not establish the invented Pod/boss form. Incarnation, visual contract and source scene remain unresolved.",
    "sourceResearchUrls": [
      "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)"
    ],
    "special": "Necromorph Corpse Infection (Nexus boss adaptation)",
    "sourceActionReview": "Nexus-only boss/Pod variant remains unresolved. Remove the Resident Evil T-Virus label; do not invent a canonical Pod organism, visual model or source-scene approval."
  },
  "Armored Brute Smasher": {
    "incarnation": "Dead Space (2008), armored Brute form",
    "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
    "visualAnchor": "Very large hunched humanoid Brute with broad organic frontal armor, massive forearms and comparatively small rear legs. Preserve its organic plating and vulnerable shoulder/back regions; no metal knight armor, gun turret or Payday Bulldozer identity.",
    "equipment": [
      "Organic frontal armor",
      "Heavy forelimbs"
    ],
    "weapon": "fists",
    "sourceScene": {
      "description": "Original 2008 Brute. Armored Brute Smasher is a descriptive Nexus boss alias and does not certify a named canonical boss variant.",
      "referenceUrl": "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
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
