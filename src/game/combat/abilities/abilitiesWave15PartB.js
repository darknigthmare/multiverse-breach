// All40 selected kits. Central W15 composition separates new records and source revisions from the frozen plan.
export const ABILITIES_WAVE15_PART_B = Object.freeze({
  "baiken": {
    "sourceHeroId": "baiken",
    "universe": "Guilty Gear",
    "sourceWork": "Guilty Gear -Strive- (2021), Baiken DLC appearance (2022)",
    "sourceUrl": "https://www.guiltygear.com/ggst/en/character/bkn/",
    "sourceReference": "Guilty Gear -Strive- (2021), Baiken DLC appearance (2022). Adult woman, long pink hair, left-eye patch, missing right arm, black-and-white kimono with red lining and single left-hand katana. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Katana de Baiken",
      "type": "melee",
      "dmg": 1.1,
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
      "name": "Reprise de taille de Baiken",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Hiiragi de Baiken",
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
    "defenseName": "Hiiragi de Baiken",
    "special": {
      "name": "Taille du katana de Baiken",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 165,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "millia_rage": {
    "sourceHeroId": "millia_rage",
    "universe": "Guilty Gear",
    "sourceWork": "Guilty Gear -Strive- (2021), default Millia appearance",
    "sourceUrl": "https://www.guiltygear.com/ggst/en/character/mll/",
    "sourceReference": "Guilty Gear -Strive- (2021), default Millia appearance. Adult woman, long blonde living hair, yellow fur-trimmed coat dress and matching yellow fur-trimmed hat, black tights and yellow boots; hair forms one compact blade, no hand-held sword. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Pointe capillaire de Millia",
      "type": "melee",
      "dmg": 1.1,
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
      "name": "Reprise de la lame de cheveux",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Faultless Defense de Millia",
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
    "defenseName": "Faultless Defense de Millia",
    "special": {
      "name": "Taille capillaire de Millia",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 165,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "yoshimitsu_tekken": {
    "sourceHeroId": "yoshimitsu_tekken",
    "universe": "Tekken",
    "sourceWork": "Tekken 3 (1997), default Yoshimitsu costume",
    "sourceUrl": "https://tekken.com/",
    "sourceReference": "Tekken 3 (1997), default Yoshimitsu costume. Skeletal green-and-black armoured Manji swordsman, red-topped helmet, exposed mechanical left arm, physical katana; not the Tekken 8 squid costume. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coupe du sabre Manji",
      "type": "melee",
      "dmg": 1.1,
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
      "name": "Rotation du sabre de Yoshimitsu",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Parade Manji",
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
    "defenseName": "Parade Manji",
    "special": {
      "name": "Taille Manji de Yoshimitsu",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 165,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "true_ogre_tekken": {
    "sourceHeroId": "true_ogre_tekken",
    "universe": "Tekken",
    "sourceWork": "Tekken 3 (1997), True Ogre second form",
    "sourceUrl": "https://tekken.com/",
    "sourceReference": "Tekken 3 (1997), True Ogre second form. Large hunched green dragon-like monster, light dark fur and black circular skin markings, large green bat wings, horns, red mane and glowing red eyes, clawed LEFT hand and ONE LARGE VIPER replacing the RIGHT arm ending in a single snake head (no human right hand), long tail and clawed feet, only one gold anklet around left upper thigh; no gold torso or arm armour, no many-small-snakes Tag2 form. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Griffe de True Ogre",
      "type": "melee",
      "dmg": 1.1,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      }
    },
    "secondary": {
      "name": "Reprise de griffe de True Ogre",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 125,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Repli des ailes de True Ogre",
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
    "defenseName": "Repli des ailes de True Ogre",
    "special": {
      "name": "Griffe rapprochée de True Ogre",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 185,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "gon_tekken": {
    "sourceHeroId": "gon_tekken",
    "universe": "Tekken",
    "sourceWork": "Tekken 3 (1997), guest Gon",
    "sourceUrl": "https://tekken.com/",
    "sourceReference": "Tekken 3 (1997), guest Gon. Tiny orange-yellow biped dinosaur with very large round head, tiny forearms, short tail, white belly and dark eyes; no clothing or weapons. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Heurt de tête de Gon",
      "type": "melee",
      "dmg": 1.1,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 70,
        "targetSide": "enemy"
      }
    },
    "secondary": {
      "name": "Charge courte de Gon",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 90,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Petite posture de Gon",
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
    "defenseName": "Petite posture de Gon",
    "special": {
      "name": "Coup de tête de Gon",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 120,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "nightmare_sc": {
    "sourceHeroId": "nightmare_sc",
    "universe": "Soul Calibur",
    "sourceWork": "Soulcalibur (1998), default Nightmare",
    "sourceUrl": "https://en.bandainamcoent.eu/soulcalibur",
    "sourceReference": "Soulcalibur (1998), default Nightmare. Adult armoured warrior in dark blue plate, long red hair, oversized demonic right arm, giant organic Soul Edge sword with one visible eye; no later Soulcalibur VI armour. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coupe de Soul Edge",
      "type": "melee",
      "dmg": 1.1,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      }
    },
    "secondary": {
      "name": "Balayage de Soul Edge de Nightmare",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 125,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Blocage de Soul Edge",
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
    "defenseName": "Blocage de Soul Edge",
    "special": {
      "name": "Taille de Soul Edge de Nightmare",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 185,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "siegfried_sc": {
    "sourceHeroId": "siegfried_sc",
    "universe": "Soul Calibur",
    "sourceWork": "Soulcalibur (1998), human Siegfried alternate identity",
    "sourceUrl": "https://en.bandainamcoent.eu/soulcalibur",
    "sourceReference": "Soulcalibur (1998), human Siegfried alternate identity. Adult human knight with long blond hair, silver and purple armour, Requiem two-handed sword, normal human arms; no demonic arm or later crystal Soul Calibur. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coupe de Requiem",
      "type": "melee",
      "dmg": 1.1,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      }
    },
    "secondary": {
      "name": "Avancée en Base Hold de Siegfried",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 125,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Parade de Requiem",
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
    "defenseName": "Parade de Requiem",
    "special": {
      "name": "Taille de Requiem de Siegfried",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 185,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "ivy_sc": {
    "sourceHeroId": "ivy_sc",
    "universe": "Soul Calibur",
    "sourceWork": "Soulcalibur (1998), adult Ivy default costume",
    "sourceUrl": "https://en.bandainamcoent.eu/soulcalibur",
    "sourceReference": "Soulcalibur (1998), adult Ivy default costume. Adult woman with short silver-white hair, purple-and-white fitted battle outfit, silver left shoulder armour and gauntlet, physical segmented Valentine sword; retain a neutral nonsexual full-body game sprite. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Taille de Valentine",
      "type": "melee",
      "dmg": 1.1,
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
      "name": "Reprise de Valentine en forme lame",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Parade de Valentine",
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
    "defenseName": "Parade de Valentine",
    "special": {
      "name": "Coupe de Valentine d’Ivy",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 185,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "axel_sor": {
    "sourceHeroId": "axel_sor",
    "universe": "Streets of Rage",
    "sourceWork": "Streets of Rage 2 (1992), Axel Stone default",
    "sourceUrl": "https://www.streets4rage.com/",
    "sourceReference": "Streets of Rage 2 (1992), Axel Stone default. Adult blond man, red headband, white short-sleeve shirt, blue jeans, red fingerless gloves, white-and-red sneakers; clean-shaven 1992 appearance. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Direct d’Axel Stone",
      "type": "melee",
      "dmg": 1.1,
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
      "name": "Dragon Wing d’Axel",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Garde de boxe d’Axel",
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
    "defenseName": "Garde de boxe d’Axel",
    "special": {
      "name": "Grand Upper d’Axel",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 165,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "blaze_sor": {
    "sourceHeroId": "blaze_sor",
    "universe": "Streets of Rage",
    "sourceWork": "Streets of Rage 2 (1992), Blaze Fielding default",
    "sourceUrl": "https://www.streets4rage.com/",
    "sourceReference": "Streets of Rage 2 (1992), Blaze Fielding default. Adult woman, long dark brown hair, red headband, red sleeveless top, red skirt and red boots, red fingerless gloves; neutral fighting posture. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Paume de Blaze Fielding",
      "type": "melee",
      "dmg": 1.1,
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
      "name": "Reprise de paume rapprochée de Blaze",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Garde de judo de Blaze",
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
    "defenseName": "Garde de judo de Blaze",
    "special": {
      "name": "Kikou Shou de Blaze",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 165,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "adam_sor": {
    "sourceHeroId": "adam_sor",
    "universe": "Streets of Rage",
    "sourceWork": "Streets of Rage 4 (2020), Adam Hunter default",
    "sourceUrl": "https://www.streets4rage.com/",
    "sourceReference": "Streets of Rage 4 (2020), Adam Hunter default. Adult Black man with short dark hair, yellow open-collar short-sleeve shirt, black trousers and yellow-and-black shoes; empty hands, no literal sword. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Direct d’Adam Hunter",
      "type": "melee",
      "dmg": 1.1,
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
      "name": "Reprise de poing d’Adam",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Garde de rue d’Adam",
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
    "defenseName": "Garde de rue d’Adam",
    "special": {
      "name": "Sword Upper d’Adam",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 165,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "like_a_dragon_kazuma_kiryu": {
    "sourceHeroId": "like_a_dragon_kazuma_kiryu",
    "universe": "Like a Dragon",
    "sourceWork": "Yakuza Kiwami (2016), adult Kazuma Kiryu",
    "sourceUrl": "https://yakuza.sega.com/kiwami/",
    "sourceReference": "Yakuza Kiwami (2016), adult Kazuma Kiryu. Adult Japanese man, black slicked-back hair, light grey suit, burgundy open-collar shirt and white shoes, empty hands; no Daidoji agent outfit. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Direct du Dragon de Dojima",
      "type": "melee",
      "dmg": 1.1,
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
      "name": "Coup court de Kiryu",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Garde du Dragon de Dojima",
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
    "defenseName": "Garde du Dragon de Dojima",
    "special": {
      "name": "Tiger Drop de Kiryu",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 165,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "like_a_dragon_ichiban_kasuga": {
    "sourceHeroId": "like_a_dragon_ichiban_kasuga",
    "universe": "Like a Dragon",
    "sourceWork": "Yakuza: Like a Dragon (2020), Freelancer job",
    "sourceUrl": "https://yakuza.sega.com/likeadragon/",
    "sourceReference": "Yakuza: Like a Dragon (2020), Freelancer job. Adult Japanese man with curly dark hair and short goatee, burgundy suit, white open-collar shirt, empty hands; explicit Freelancer loadout, no Hero bat or fantasy costume. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Direct du Freelancer Ichiban",
      "type": "melee",
      "dmg": 1.1,
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
      "name": "Reprise de poing d’Ichiban",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Garde du Freelancer",
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
    "defenseName": "Garde du Freelancer",
    "special": {
      "name": "Poing du Freelancer Ichiban",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 165,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "like_a_dragon_goro_majima": {
    "sourceHeroId": "like_a_dragon_goro_majima",
    "universe": "Like a Dragon",
    "sourceWork": "Yakuza Kiwami (2016), adult Goro Majima",
    "sourceUrl": "https://yakuza.sega.com/kiwami/",
    "sourceReference": "Yakuza Kiwami (2016), adult Goro Majima. Adult Japanese man, short black side-parted UNDERCUT hair and GOATEE, a single plain black eyepatch over LEFT eye, uncovered RIGHT eye, yellow snakeskin blazer with gold chain over tattooed bare chest, black leather trousers and gloves, single compact tanto; Yakuza Kiwami default, NO ponytail, NO sunglasses or goggles. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coup du tanto de Majima",
      "type": "melee",
      "dmg": 1.1,
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
      "name": "Reprise du Mad Dog de Shimano",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Garde du tanto de Majima",
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
    "defenseName": "Garde du tanto de Majima",
    "special": {
      "name": "Taille du tanto de Majima",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 165,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "yorha_2b": {
    "sourceHeroId": "yorha_2b",
    "universe": "NieR",
    "sourceWork": "NieR:Automata (2017), default 2B",
    "sourceUrl": "https://www.niergame.com/",
    "sourceReference": "NieR:Automata (2017), default 2B. Adult female android, white bob haircut, black eye visor, black embroidered high-collar dress, black thigh-high boots and gloves, Virtuous Contract white katana; no black-box detonation. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coupe de Virtuous Contract",
      "type": "melee",
      "dmg": 1.1,
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
      "name": "Reprise de Virtuous Contract de 2B",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Garde de YoRHa 2B",
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
    "defenseName": "Garde de YoRHa 2B",
    "special": {
      "name": "Taille de Virtuous Contract de 2B",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 165,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "yorha_9s": {
    "sourceHeroId": "yorha_9s",
    "universe": "NieR",
    "sourceWork": "NieR:Automata (2017), default 9S",
    "sourceUrl": "https://www.niergame.com/",
    "sourceReference": "NieR:Automata (2017), default 9S. Male android with white short hair, black eye visor, black military coat and shorts, knee-high socks and boots, Cruel Oath black katana; no invented gun. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coupe de Cruel Oath",
      "type": "melee",
      "dmg": 1.1,
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
      "name": "Reprise de lame du Scanner 9S",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Garde du Scanner 9S",
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
    "defenseName": "Garde du Scanner 9S",
    "special": {
      "name": "Taille de Cruel Oath de 9S",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 165,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "yorha_a2": {
    "sourceHeroId": "yorha_a2",
    "universe": "NieR",
    "sourceWork": "NieR:Automata (2017), A2 before hair cutting, Type-40 Sword chosen loadout",
    "sourceUrl": "https://www.niergame.com/",
    "sourceReference": "NieR:Automata (2017), A2 before hair cutting, Type-40 Sword chosen loadout. Adult female android, very long white hair, worn black sleeveless top, worn black shorts and dark thigh-high leg coverings, Type-40 Sword; chosen obtainable weapon loadout, not a claim of exclusive weapon. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coupe de l’épée Type-40",
      "type": "melee",
      "dmg": 1.1,
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
      "name": "Reprise de lame d’A2",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Garde de l’androïde A2",
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
    "defenseName": "Garde de l’androïde A2",
    "special": {
      "name": "Taille de l’épée Type-40 d’A2",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 165,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "brutal_legend_eddie_riggs": {
    "sourceHeroId": "brutal_legend_eddie_riggs",
    "universe": "Brütal Legend",
    "sourceWork": "Brütal Legend (2009), Eddie Riggs",
    "sourceUrl": "https://www.doublefine.com/games/brutal-legend",
    "sourceReference": "Brütal Legend (2009), Eddie Riggs. Adult game character with long black hair, thick sideburns, black roadie T-shirt and vest, jeans and heavy boots, Separator battle axe; no photoreal actor likeness. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coup de Separator",
      "type": "melee",
      "dmg": 1.1,
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
      "name": "Reprise de la hache du roadie",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Garde de Separator",
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
    "defenseName": "Garde de Separator",
    "special": {
      "name": "Taille de Separator d’Eddie",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 165,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "brutal_legend_ophelia": {
    "sourceHeroId": "brutal_legend_ophelia",
    "universe": "Brütal Legend",
    "sourceWork": "Brütal Legend (2009), allied Ophelia before Sea of Black Tears",
    "sourceUrl": "https://www.doublefine.com/games/brutal-legend",
    "sourceReference": "Brütal Legend (2009), allied Ophelia before Sea of Black Tears. Adult living human woman with shoulder-length brown hair and green eyes, black choker, black short-sleeve Drowning Doom-logo T-shirt, spiked wrist bracers and belt, black jeans and black-and-white sneakers; paired compact physical blades, no pale blouse, corset, white hair streak, drowned blue skin or liquid powers. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coup de lame d’Ophelia",
      "type": "melee",
      "dmg": 1.1,
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
      "name": "Reprise des lames de l’Ophelia alliée",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Parade de l’Ophelia alliée",
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
    "defenseName": "Parade de l’Ophelia alliée",
    "special": {
      "name": "Taille des lames de l’Ophelia alliée",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 165,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "brutal_legend_lars_halford": {
    "sourceHeroId": "brutal_legend_lars_halford",
    "universe": "Brütal Legend",
    "sourceWork": "Brütal Legend (2009), Lars Halford of Ironheade",
    "sourceUrl": "https://www.doublefine.com/games/brutal-legend",
    "sourceReference": "Brütal Legend (2009), Lars Halford of Ironheade. Adult human resistance leader with long blond hair and green eyes, muscular bare torso with arm tattoo, dark leather trousers, belt and heavy boots; Battle Cry sword sheathed while empty hands rally allies, no invented red cape, torso armour or electric guitar. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Signal de la résistance de Lars",
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
      "name": "Coordination d’Ironheade",
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
        "duration": 3.5,
        "buffMultiplier": 1.18
      },
      "cd": 8
    },
    "defense": {
      "name": "Repli du chef Lars",
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
    "defenseName": "Repli du chef Lars",
    "special": {
      "name": "Ralliement d’Ironheade par Lars",
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
  "killer_instinct_jago_epee": {
    "sourceHeroId": "killer_instinct_jago_epee",
    "universe": "Killer Instinct",
    "sourceWork": "Killer Instinct (2013 reboot), default Jago",
    "sourceUrl": "https://www.ultra-combo.com/",
    "sourceReference": "Killer Instinct (2013 reboot), default Jago. Adult muscular monk with dark tied hair, blue lower-face mask, blue trousers and red sash, tiger-themed shin guards, sheathed curved sword; compact energy forms only between hands. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Paume de Jago",
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
      "name": "Double paume Endokuken",
      "type": "projectile",
      "dmg": 1.85,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 520,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Garde du Tigre de Jago",
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
    "defenseName": "Garde du Tigre de Jago",
    "special": {
      "name": "Endokuken de Jago",
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
      "meterCost": 100
    }
  },
  "killer_instinct_orchid_tonfas": {
    "sourceHeroId": "killer_instinct_orchid_tonfas",
    "universe": "Killer Instinct",
    "sourceWork": "Killer Instinct (2013 reboot), default Orchid",
    "sourceUrl": "https://www.ultra-combo.com/",
    "sourceReference": "Killer Instinct (2013 reboot), default Orchid. Adult woman, dark hair with goggles on head, green tactical sleeveless top, green combat trousers and gloves, paired physical tonfas; no literal black panther companion. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coup de tonfa d’Orchid",
      "type": "melee",
      "dmg": 1.1,
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
      "name": "Reprise des tonfas Ichi Ni",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Parade des tonfas d’Orchid",
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
    "defenseName": "Parade des tonfas d’Orchid",
    "special": {
      "name": "Ichi Ni San d’Orchid",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 165,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "killer_instinct_t_j_combo_boxe": {
    "sourceHeroId": "killer_instinct_t_j_combo_boxe",
    "universe": "Killer Instinct",
    "sourceWork": "Killer Instinct (2013 reboot, Season Two 2014), default T.J. Combo",
    "sourceUrl": "https://www.ultra-combo.com/",
    "sourceReference": "Killer Instinct (2013 reboot, Season Two 2014), default T.J. Combo. Adult muscular Black boxer with short hair, boxing gloves, sleeveless fight vest and boxing shorts and boots; natural arms in reboot, no cybernetic implants. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Jab de T.J. Combo",
      "type": "melee",
      "dmg": 1.1,
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
      "name": "Crochet du champion Combo",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Garde de boxe de T.J. Combo",
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
    "defenseName": "Garde de boxe de T.J. Combo",
    "special": {
      "name": "Powerline de T.J. Combo",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 165,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "magicka_blue_wizard_foudre": {
    "sourceHeroId": "magicka_blue_wizard_foudre",
    "universe": "Magicka",
    "sourceWork": "Magicka (2011), blue default robe with selected Lightning element",
    "sourceUrl": "https://www.paradoxinteractive.com/games/magicka/about",
    "sourceReference": "Magicka (2011), blue default robe with selected Lightning element. Small robed wizard with opaque deep blue hood, gold robe trim, dark hidden face, belt and wooden staff, compact white-blue lightning at staff tip; selected shared element, not a blue-exclusive class. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Étincelle de Foudre choisie",
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
      "name": "Trait de Foudre concentré",
      "type": "projectile",
      "dmg": 1.85,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 520,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Bouclier du magicien bleu",
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
    "defenseName": "Bouclier du magicien bleu",
    "special": {
      "name": "Trait de Foudre du magicien bleu",
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
      "meterCost": 100
    }
  },
  "magicka_red_wizard_feu": {
    "sourceHeroId": "magicka_red_wizard_feu",
    "universe": "Magicka",
    "sourceWork": "Magicka (2011), red default robe with selected Fire element",
    "sourceUrl": "https://www.paradoxinteractive.com/games/magicka/about",
    "sourceReference": "Magicka (2011), red default robe with selected Fire element. Small robed wizard with opaque deep red hood, gold robe trim, dark hidden face, belt and wooden staff, compact orange fire at staff tip; selected shared element, not a red-exclusive class. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Flammèche de Feu choisie",
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
      "name": "Trait de Feu concentré",
      "type": "projectile",
      "dmg": 1.85,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 520,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Bouclier du magicien rouge",
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
    "defenseName": "Bouclier du magicien rouge",
    "special": {
      "name": "Trait de Feu du magicien rouge",
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
      "meterCost": 100
    }
  },
  "magicka_yellow_wizard_froid": {
    "sourceHeroId": "magicka_yellow_wizard_froid",
    "universe": "Magicka",
    "sourceWork": "Magicka (2011), yellow default robe with selected Cold element",
    "sourceUrl": "https://www.paradoxinteractive.com/games/magicka/about",
    "sourceReference": "Magicka (2011), yellow default robe with selected Cold element. Small robed wizard with opaque yellow hood, gold robe trim, dark hidden face, belt and wooden staff, compact pale cyan cold at staff tip; selected shared element, not a yellow-exclusive class. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Souffle de Froid choisi",
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
      "name": "Trait de Froid concentré",
      "type": "projectile",
      "dmg": 1.85,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 520,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Bouclier du magicien jaune",
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
    "defenseName": "Bouclier du magicien jaune",
    "special": {
      "name": "Trait de Froid du magicien jaune",
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
      "meterCost": 100
    }
  },
  "metal_slug_marco_rossi": {
    "sourceHeroId": "metal_slug_marco_rossi",
    "universe": "Metal Slug",
    "sourceWork": "Metal Slug 2 (1998), Marco Rossi default",
    "sourceUrl": "https://www.snk-corp.co.jp/official/akeakaneogeo/metalslug2/",
    "sourceReference": "Metal Slug 2 (1998), Marco Rossi default. Adult blond soldier with red headband, red sleeveless vest over light shirt, tan trousers and brown boots, compact Heavy Machine Gun pickup; shared arcade weapon loadout. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Tir H de Marco",
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
      "name": "Rafale contrôlée H de Marco",
      "type": "projectile",
      "dmg": 1.85,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 520,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Repli de Marco Rossi",
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
    "defenseName": "Repli de Marco Rossi",
    "special": {
      "name": "Rafale H de Marco Rossi",
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
      "meterCost": 100
    }
  },
  "metal_slug_tarma_roving": {
    "sourceHeroId": "metal_slug_tarma_roving",
    "universe": "Metal Slug",
    "sourceWork": "Metal Slug 2 (1998), Tarma Roving default",
    "sourceUrl": "https://www.snk-corp.co.jp/official/akeakaneogeo/metalslug2/",
    "sourceReference": "Metal Slug 2 (1998), Tarma Roving default. Adult brown-haired soldier with sunglasses, white sleeveless shirt, yellow-orange vest, green trousers and brown boots, compact Heavy Machine Gun pickup; on foot, no SV-001 vehicle materialisation. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Tir H de Tarma",
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
      "name": "Rafale contrôlée H de Tarma",
      "type": "projectile",
      "dmg": 1.85,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 520,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Repli de Tarma Roving",
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
    "defenseName": "Repli de Tarma Roving",
    "special": {
      "name": "Rafale H de Tarma Roving",
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
      "meterCost": 100
    }
  },
  "metal_slug_eri_kasamoto": {
    "sourceHeroId": "metal_slug_eri_kasamoto",
    "universe": "Metal Slug",
    "sourceWork": "Metal Slug 2 (1998), Eri Kasamoto default",
    "sourceUrl": "https://www.snk-corp.co.jp/official/akeakaneogeo/metalslug2/",
    "sourceReference": "Metal Slug 2 (1998), Eri Kasamoto default. Adult blond soldier with green bandana, green military vest over light sleeveless top, green shorts and brown boots, compact arcade handgun; on foot, no vehicle. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coup de pistolet d’Eri",
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
      "name": "Tir ajusté d’Eri Kasamoto",
      "type": "projectile",
      "dmg": 1.85,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 520,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Repli d’Eri Kasamoto",
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
    "defenseName": "Repli d’Eri Kasamoto",
    "special": {
      "name": "Tir du pistolet d’Eri",
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
      "meterCost": 100
    }
  },
  "goemons_great_adventure_goemon": {
    "sourceHeroId": "goemons_great_adventure_goemon",
    "universe": "Goemon's Great Adventure",
    "sourceWork": "Goemon’s Great Adventure (1998 Japan / 1999 international), Goemon default",
    "sourceUrl": "https://www.konami.com/",
    "sourceReference": "Goemon’s Great Adventure (1998 Japan / 1999 international), Goemon default. Adult stylized Japanese hero with large spiky blue hair, red short kimono, white trousers and sandals, compact physical kiseru smoking pipe used as club; no giant Impact robot. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Heurt du kiseru",
      "type": "melee",
      "dmg": 1.1,
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
      "name": "Reprise du kiseru de Goemon",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Garde du kiseru",
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
    "defenseName": "Garde du kiseru",
    "special": {
      "name": "Coup de kiseru de Goemon",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 165,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "goemons_great_adventure_ebisumaru": {
    "sourceHeroId": "goemons_great_adventure_ebisumaru",
    "universe": "Goemon's Great Adventure",
    "sourceWork": "Goemon’s Great Adventure (1998 Japan / 1999 international), Ebisumaru default",
    "sourceUrl": "https://www.konami.com/",
    "sourceReference": "Goemon’s Great Adventure (1998 Japan / 1999 international), Ebisumaru default. Adult stocky round Japanese ninja with blue hooded costume, large round nose, dark moustache, white sandals, compact flat WOODEN PADDLE used as melee weapon; no meat tenderizer, mallet, flute or giant robot. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Heurt de la palette d’Ebisumaru",
      "type": "melee",
      "dmg": 1.1,
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
      "name": "Reprise de la palette du ninja bleu",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Garde du ninja Ebisumaru",
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
    "defenseName": "Garde du ninja Ebisumaru",
    "special": {
      "name": "Coup de palette d’Ebisumaru",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 165,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "goemons_great_adventure_yae": {
    "sourceHeroId": "goemons_great_adventure_yae",
    "universe": "Goemon's Great Adventure",
    "sourceWork": "Goemon’s Great Adventure (1998 Japan / 1999 international), Yae default",
    "sourceUrl": "https://www.konami.com/",
    "sourceReference": "Goemon’s Great Adventure (1998 Japan / 1999 international), Yae default. Adult woman ninja with very long dark green hair, purple long-sleeved shinobi outfit and loose long purple trousers, white obi belt, dark mesh at neckline/forearms, white tabi and sandals, physical katana; original N64 trousers costume, no modern pink skirt or red boots. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coupe du katana de Yae",
      "type": "melee",
      "dmg": 1.1,
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
      "name": "Reprise de lame de la kunoichi Yae",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Parade du katana de Yae",
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
    "defenseName": "Parade du katana de Yae",
    "special": {
      "name": "Taille du katana de Yae",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 165,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "sir_daniel_fortesque": {
    "sourceHeroId": "sir_daniel_fortesque",
    "universe": "MediEvil",
    "sourceWork": "MediEvil (1998 PlayStation), Sir Daniel Fortesque",
    "sourceUrl": "https://www.playstation.com/games/medievil/",
    "sourceReference": "MediEvil (1998 PlayStation), Sir Daniel Fortesque. Tall skeletal knight with one visible eye, jaw missing, silver battered armour and dark blue cape, physical short sword; no flesh body or firearm. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coupe de l’épée de Fortesque",
      "type": "melee",
      "dmg": 1.1,
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
      "name": "Reprise de l’épée de Gallowmere",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Parade du chevalier Fortesque",
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
    "defenseName": "Parade du chevalier Fortesque",
    "special": {
      "name": "Taille de l’épée de Sir Daniel",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 165,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "medievil_kiya": {
    "sourceHeroId": "medievil_kiya",
    "universe": "MediEvil",
    "sourceWork": "MediEvil 2 (2000 PlayStation), Kiya",
    "sourceUrl": "https://www.playstation.com/games/medievil/",
    "sourceReference": "MediEvil 2 (2000 PlayStation), Kiya. Adult Egyptian mummy princess, BLUE skin, long black hair and GREEN eyes, red lips and dark eye shadow, cloth bandages covering chest/arms/hands/hips and knees, brown boots, RED navel gem, gold headpiece and matching necklace, triangular earrings; original final MediEvil2 design, no invented burial tunic or weapon. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Indication du chemin de Kiya",
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
      "name": "Conseil de l’alliée Kiya",
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
        "duration": 3.5,
        "buffMultiplier": 1.18
      },
      "cd": 8
    },
    "defense": {
      "name": "Retrait prudent de Kiya",
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
    "defenseName": "Retrait prudent de Kiya",
    "special": {
      "name": "Guidage de Kiya dans le Londres victorien",
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
  "borderlands_2_maya_phaselock": {
    "sourceHeroId": "borderlands_2_maya_phaselock",
    "universe": "Borderlands 2",
    "sourceWork": "Borderlands 2 (2012), Maya default appearance, Phaselock enemy control",
    "sourceUrl": "https://borderlands.2k.com/borderlands-2/",
    "sourceReference": "Borderlands 2 (2012), Maya default appearance, Phaselock enemy control. Adult Siren woman, short blue bob hair, yellow-and-black Vault Hunter outfit, blue Siren tattoos on left arm, empty hands; compact violet-blue Phaselock light at tattooed hand, no handgun. Phaselock controls one accepted enemy at bounded range. Zero direct damage, no allied protection, no invented shield and no automatic Ruin damage. Engine-supported immobilisation and visible suspension are bounded gameplay adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Paume rapprochée de Maya",
      "type": "melee",
      "dmg": 1.1,
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
      "name": "Prise de Phaselock de Maya",
      "type": "control",
      "dmg": 0,
      "cd": 8,
      "animationDuration": 0.7,
      "hitAt": 0.26,
      "targeting": {
        "effect": "control",
        "delivery": "control",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy",
        "minTargets": 1,
        "controlKind": "phaselock",
        "controlDuration": 1.2,
        "controlTurns": 1
      }
    },
    "defense": {
      "name": "Repli de la Siren Maya",
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
    "defenseName": "Repli de la Siren Maya",
    "special": {
      "name": "Phaselock de Maya",
      "type": "control",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "meterCost": 100,
      "targeting": {
        "effect": "control",
        "delivery": "control",
        "shape": "single",
        "range": 480,
        "targetSide": "enemy",
        "minTargets": 1,
        "controlKind": "phaselock",
        "controlDuration": 2.4,
        "controlTurns": 1
      }
    }
  },
  "borderlands_2_zer0_decepti0n": {
    "sourceHeroId": "borderlands_2_zer0_decepti0n",
    "universe": "Borderlands 2",
    "sourceWork": "Borderlands 2 (2012), default Zer0",
    "sourceUrl": "https://borderlands.2k.com/borderlands-2/",
    "sourceReference": "Borderlands 2 (2012), default Zer0. Tall slender adult humanoid assassin in opaque black helmet with narrow red visor, black and grey armoured stealth suit, single physical katana; no visible human face or extra sword. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Coupe de la lame de Zer0",
      "type": "melee",
      "dmg": 1.1,
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
      "name": "Reprise rapprochée de Zer0",
      "type": "melee",
      "dmg": 1.9,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 105,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Retrait Decepti0n de Zer0",
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
    "defenseName": "Retrait Decepti0n de Zer0",
    "special": {
      "name": "Taille de l’épée de Zer0",
      "type": "melee",
      "dmg": 4.65,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 165,
        "targetSide": "enemy"
      },
      "meterCost": 100
    }
  },
  "borderlands_2_salvador_gunzerking": {
    "sourceHeroId": "borderlands_2_salvador_gunzerking",
    "universe": "Borderlands 2",
    "sourceWork": "Borderlands 2 (2012), Salvador default with explicitly chosen dual Dahl pistols",
    "sourceUrl": "https://borderlands.2k.com/borderlands-2/",
    "sourceReference": "Borderlands 2 (2012), Salvador default with explicitly chosen dual Dahl pistols. Short stocky muscular adult man, BLUE mohawk and dark beard with bandaged head, orange sleeveless shirt, bullet tattoos and bandoliers on arms/torso, olive trousers and heavy boots, one compact Dahl pistol in each hand; explicitly chosen obtainable dual-pistol loadout, not unique canonical equipment. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Tir équipé de Salvador",
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
      "name": "Reprise Gunzerking des deux pistolets",
      "type": "projectile",
      "dmg": 1.85,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 520,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Repli derrière le bouclier de Salvador",
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
    "defenseName": "Repli derrière le bouclier de Salvador",
    "special": {
      "name": "Rafale des deux pistolets de Salvador",
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
      "meterCost": 100
    }
  },
  "turok_tal_set_turok": {
    "sourceHeroId": "turok_tal_set_turok",
    "universe": "Turok",
    "sourceWork": "Turok: Dinosaur Hunter (1997), Tal’Set with bow",
    "sourceUrl": "https://www.nightdivestudios.com/turok/",
    "sourceReference": "Turok: Dinosaur Hunter (1997), Tal’Set with bow. Adult Indigenous male hunter with long dark hair and red headband, bare muscular arms, brown vest and trousers, physical longbow and quiver; no equipment exclusive to Turok 2. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Décoche de Tal’Set",
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
      "name": "Visée de l’arc de Dinosaur Hunter",
      "type": "projectile",
      "dmg": 1.85,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 520,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Repli du chasseur Tal’Set",
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
    "defenseName": "Repli du chasseur Tal’Set",
    "special": {
      "name": "Flèche de l’arc de Tal’Set",
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
      "meterCost": 100
    }
  },
  "turok_joshua_fireseed_turok": {
    "sourceHeroId": "turok_joshua_fireseed_turok",
    "universe": "Turok",
    "sourceWork": "Turok 2: Seeds of Evil (1998), Joshua Fireseed with Tek Bow standard arrow",
    "sourceUrl": "https://www.nightdivestudios.com/turok2/",
    "sourceReference": "Turok 2: Seeds of Evil (1998), Joshua Fireseed with Tek Bow standard arrow. Adult Indigenous male hunter, short black hair and dark headband, brown leather tactical vest over bare arms, tan trousers and brown boots, physical Tek Bow with standard arrow; match original Seeds of Evil cinematic model at right in Adonandturok2, no invented red-white face paint or Chronoscepter. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Décoche du Tek Bow",
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
      "name": "Visée du Tek Bow de Joshua",
      "type": "projectile",
      "dmg": 1.85,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 520,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Repli du Turok Joshua",
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
    "defenseName": "Repli du Turok Joshua",
    "special": {
      "name": "Flèche du Tek Bow de Joshua",
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
      "meterCost": 100
    }
  },
  "turok_adon": {
    "sourceHeroId": "turok_adon",
    "universe": "Turok",
    "sourceWork": "Turok 2: Seeds of Evil (1998), Adon mission-guide appearance",
    "sourceUrl": "https://www.nightdivestudios.com/turok2/",
    "sourceReference": "Turok 2: Seeds of Evil (1998), Adon mission-guide appearance. Adult alien female emissary, pale grey-blue skin, yellow eyes, gold diadem with purple jewel, blue-silver hair pulled back close behind head, engraved golden collar and shoulder pieces, dark plum sleeveless cropped top, visible pale grey-blue midriff, dark plum trousers, gold forearm bracers and shin armour over dark shoes; original Turok2 model, no ivory robe or Turok3 long black hair. Explicit selected version and loadout, no certified official frames. Contact range, timing and balance are bounded engine adaptations.",
    "identityBasis": "canonical-role",
    "canonicalVerified": false,
    "networkVerified": false,
    "source1to1Verified": false,
    "gameplayAdaptation": true,
    "simple": {
      "name": "Adon indique l’objectif",
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
      "name": "Conseil de l’émissaire Adon",
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
        "duration": 3.5,
        "buffMultiplier": 1.18
      },
      "cd": 8
    },
    "defense": {
      "name": "Retrait de l’apparition d’Adon",
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
    "defenseName": "Retrait de l’apparition d’Adon",
    "special": {
      "name": "Guidage de l’émissaire Adon",
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
  }
});
export const ABILITY_REVISIONS_WAVE15_PART_B = Object.freeze({});
