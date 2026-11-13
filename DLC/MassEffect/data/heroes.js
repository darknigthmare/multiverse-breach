// Mass Effect — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return applyMassEffectHeroSourceContracts({
    id: 'shepard',
    name: 'Commander Shepard',
    universe: 'Mass Effect',
    category: 'marine',
    primaryColor: '#34495e',
    secondaryColor: '#e74c3c',
    weaponType: 'gun',
    weaponColor: '#1a1a1a',
    stats: { hp: 145, atk: 16, def: 10, spd: 6 },
    simple: { name: 'Omni-Blade / Rifle', type: 'bullet', dmg: 1.1 },
    secondary: { name: 'Singularity Field', type: 'gravity', cd: 7, dmg: 1.8 },
    defense: { name: 'Tech Shield', type: 'shield', dur: 2.5, reduce: 0.85 },
    special: { name: 'Mako Strike', type: 'melee_aoe', dmg: 5.1 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'omni_gel', universe: 'Mass Effect', name: { en: 'Omni-Gel Pack', fr: 'Pack d\'Omni-Gel' }, boost: { hp: 100 }, cost: 80 });
}

export function createEquipItemsDb2() {
  return ({ id: 'n7_chestplate', universe: 'Mass Effect', name: { en: 'N7 Heavy Carbon Armor', fr: 'Plastron Carbone N7' }, boost: { def: 10 }, cost: 130 });
}

export function createEquipItemsDb3() {
  return ({ id: 'element_zero', universe: 'Mass Effect', name: { en: 'Refined Element Zero', fr: 'Élément Zéro Purifié' }, boost: { atk: 10, spd: 1 }, cost: 120 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_me_mako',
    name: { en: 'Mako Airdrop Beacon', fr: 'Balise Airdrop du Mako' },
    desc: { en: 'Drops a heavy Mako armored vehicle onto the field, dealing 220 crash damage to all enemies.', fr: 'Largue un blindé Mako lourd écrasant tous les ennemis au sol (220 dégâts).' },
    effect: 'mako_drop'
  });
}

export function createExtraHeroData() {
  return applyMassEffectHeroSourceContracts([
    { id: 'garrus', name: 'Garrus Vakarian', cat: 'tactical', color: '#0984e3' },
    { id: 'liara', name: 'Liara T\'Soni', cat: 'hacker', color: '#74b9ff' }
  ]);
}

export function createCanonRosterExpansion() {
  return applyMassEffectHeroSourceContracts([
    { id: 'tali', name: 'Tali Zorah', cat: 'hacker', color: '#8e44ad' },
    { id: 'wrex', name: 'Urdnot Wrex', cat: 'marine', color: '#7b241c' },
    { id: 'ashley_williams', name: 'Ashley Williams', cat: 'marine', color: '#34495e' },
    { id: 'mordin', name: 'Mordin Solus', cat: 'hacker', color: '#95a5a6' }
  ]);
}

// Source contracts align the raw catalog with the already authored mode kits.
// These declarations never approve portraits, atlases or source-frame fidelity.
const SCIFI_HERO_SOURCE_CONTRACTS = {
  "shepard": {
    "incarnation": "Mass Effect 2 (2010), male default Shepard, Soldier",
    "referenceUrl": "https://guides.gamercorner.net/me2/classes/soldier",
    "visualAnchor": "Mass Effect 2 default male Soldier Shepard: short dark hair, adult human face, black N7 armor with red-white N7 marking and physical M-8 Avenger rifle. Class actions are personal Adrenaline Rush and single-target Concussive Shot; no ME3 omni-blade, Singularity or Sentinel Tech Armor.",
    "equipment": [
      "ME2 N7 armor",
      "M-8 Avenger assault rifle"
    ],
    "weaponType": "gun",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Tir du M-8 Avenger",
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
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Adrenaline Rush",
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
      }
    },
    "defense": {
      "name": "Couvert N7 de Shepard",
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
      "name": "Concussive Shot",
      "type": "projectile",
      "dmg": 5.1,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 640,
        "targetSide": "enemy"
      },
      "color": "#72aee8",
      "meterCost": 100
    }
  },
  "garrus": {
    "incarnation": "Mass Effect 2 (2010), Garrus after Archangel recruitment",
    "referenceUrl": "https://guides.gamercorner.net/me2/party-members/garrus",
    "visualAnchor": "Mass Effect 2 Garrus after Archangel recruitment: tall male turian with swept cranial plates, facial blue markings, recruitment scars and damaged blue-black armor, visor and M-92 Mantis sniper rifle. Overload is tech; his personal cover does not generate an allied barrier.",
    "equipment": [
      "Damaged blue-black Archangel armor",
      "Targeting visor",
      "M-92 Mantis sniper rifle"
    ],
    "weaponType": "gun",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Tir de précision de Garrus",
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
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Overload",
      "type": "projectile",
      "dmg": 1.8,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 600,
        "targetSide": "enemy"
      }
    },
    "defense": {
      "name": "Couvert de Garrus",
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
      "name": "Concussive Shot",
      "type": "projectile",
      "dmg": 4.6,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 640,
        "targetSide": "enemy"
      },
      "color": "#8fc4f4",
      "meterCost": 100
    }
  },
  "liara": {
    "incarnation": "Mass Effect 2: Lair of the Shadow Broker (2010)",
    "referenceUrl": "https://guides.gamercorner.net/me2/party-members/liara",
    "visualAnchor": "Mass Effect 2 Lair of the Shadow Broker Liara: adult blue asari with swept cranial crest, selected white-blue DLC combat outfit and M-3 Predator heavy pistol. Warp and localized Singularity are biotics; no hair, hacking data storm or ME1 Barrier loadout.",
    "equipment": [
      "White-blue Shadow Broker DLC outfit",
      "M-3 Predator heavy pistol"
    ],
    "weaponType": "gun",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Tir du M-3 Predator de Liara",
      "type": "projectile",
      "dmg": 1,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 520,
        "targetSide": "enemy"
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Warp",
      "type": "projectile",
      "dmg": 1.8,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 600,
        "targetSide": "enemy"
      }
    },
    "defense": {
      "name": "Couvert de Liara",
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
      "name": "Singularity",
      "type": "area",
      "dmg": 4.6,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "area",
        "shape": "area",
        "range": 640,
        "targetSide": "enemy",
        "areaRadius": 115
      },
      "color": "#84a9ff",
      "meterCost": 100
    }
  },
  "tali": {
    "incarnation": "Mass Effect 2 (2010)",
    "referenceUrl": "https://guides.gamercorner.net/me2/party-members/tali",
    "visualAnchor": "Mass Effect 2 Tali: short adult quarian fully sealed in a purple hooded environmental suit, opaque mask and visor, breathing fittings and patterned fabric panels. Keep the face concealed and the shotgun separate from the projected Attack Drone. The shotgun model remains a separate art/model review question.",
    "equipment": [
      "Sealed purple ME2 environmental suit",
      "ME2 shotgun",
      "Omni-tool Combat Drone projection"
    ],
    "weaponType": "gun",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Fusil à pompe de Tali",
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
      "name": "Combat Drone de Tali",
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
      "name": "Couvert de la technicienne quarienne",
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
      "name": "Drone de combat de Tali",
      "type": "projectile",
      "dmg": 4.5,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 570,
        "targetSide": "enemy"
      },
      "color": "#c08de8",
      "meterCost": 100
    }
  },
  "wrex": {
    "incarnation": "Mass Effect (2007)",
    "referenceUrl": "https://www.gamerguides.com/mass-effect-1-legendary-edition/guide/talents/biotic/",
    "visualAnchor": "Mass Effect 2007 Wrex: very broad krogan with high ridged crest, red face markings and scars, heavy red armor over a dark undersuit, shotgun and wrist omni-tool. Barrier protects Wrex personally; ME3 Vanguard Biotic Charge is not part of this ME1 kit.",
    "equipment": [
      "Heavy red ME1 krogan armor",
      "ME1 shotgun",
      "Wrist omni-tool"
    ],
    "weaponType": "gun",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Fusil à pompe de Wrex",
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
      "name": "Throw biotique de Wrex",
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
      "name": "Barrier du Krogan biotique",
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
    "special": {
      "name": "Barrière biotique de Wrex",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "single",
        "range": 1,
        "targetSide": "self",
        "duration": 4,
        "reduce": 0.45
      },
      "reduce": 0.45,
      "dur": 4,
      "color": "#8da8f5",
      "meterCost": 100
    }
  },
  "ashley_williams": {
    "incarnation": "Mass Effect 3 (2012), Alliance officer Ashley",
    "referenceUrl": "https://masseffect.fandom.com/wiki/Ashley_Williams",
    "visualAnchor": "Mass Effect 3 Alliance officer Ashley Williams: adult human woman with long dark hair, blue Alliance combat armor and physical M8 Avenger assault rifle. Keep the Alliance officer outfit, human anatomy and firearm; she has no biotic casting.",
    "equipment": [
      "Blue ME3 Alliance combat armor",
      "M8 Avenger assault rifle"
    ],
    "weaponType": "gun",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Tir du M8 Avenger d’Ashley",
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
      "name": "Visée de l’officière Ashley",
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
      "cd": 6
    },
    "defense": {
      "name": "Garde de l’armure Alliance d’Ashley",
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
      "name": "Rafale du M8 Avenger d’Ashley",
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
  "mordin": {
    "incarnation": "Mass Effect 2 (2010)",
    "referenceUrl": "https://masseffect.fandom.com/wiki/Mordin_Solus",
    "visualAnchor": "Mass Effect 2 Mordin Solus: adult salarian with tall orange-tan head, distinct facial markings, white-blue STG scientist suit and wrist omni-tool. Incinerate is a finite orange thermal tech discharge from that tool, not a rifle or a sustained beam.",
    "equipment": [
      "White-blue ME2 STG scientist suit",
      "Wrist omni-tool"
    ],
    "weaponType": "omnitool",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Projection incendiaire du omni-outil",
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
      "name": "Visée du omni-outil de Mordin",
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
      "cd": 6
    },
    "defense": {
      "name": "Retrait du scientifique Mordin",
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
      "name": "Incinération du omni-outil de Mordin",
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
  }
};

export function applyMassEffectHeroSourceContracts(value, sourceId) {
  if (Array.isArray(value)) return value.map(actor => applyMassEffectHeroSourceContracts(actor));
  const contract = SCIFI_HERO_SOURCE_CONTRACTS[sourceId || value.id];
  return contract ? { ...value, ...structuredClone(contract) } : value;
}
