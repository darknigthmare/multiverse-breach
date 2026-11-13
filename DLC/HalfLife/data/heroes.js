// Half-Life — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return applyHalfLifeHeroSourceContracts({
    id: 'freeman',
    name: 'Gordon Freeman',
    universe: 'Half-Life',
    incarnation: 'Half-Life 2 (2004) - HEV Mark V / Citadel',
    referenceUrl: 'https://www.half-life.com/en/halflife2',
    visualAnchor: 'Half-Life 2 Gordon Freeman: brown hair, beard, rectangular glasses, orange and gray HEV Mark V suit, crowbar and zero-point energy field manipulator. No HEV Mark IV, long-jump module or gluon gun from Half-Life (1998).',
    canonStatus: 'source-locked-gameplay-adaptation',
    visualReviewStatus: 'pending',
    equipment: ['Crowbar', 'HEV Mark V suit', 'Gravity Gun'],
    category: 'hacker',
    primaryColor: '#e65c00',
    secondaryColor: '#4f5d73',
    weaponType: 'crowbar',
    weaponColor: '#8b0000',
    stats: { hp: 145, atk: 15, def: 11, spd: 5 },
    simple: { name: 'Crowbar Whack', type: 'melee', dmg: 1.1 },
    secondary: { name: 'Gravity Gun Blast', type: 'gravity', cd: 6, dmg: 1.7 },
    defense: { name: 'HEV Shield Charge', type: 'shield', dur: 2.5, reduce: 0.85 },
    special: { name: 'Overcharged Gravity Gun', type: 'beam', dmg: 4.7, color: '#33ccff' }
  });
}

export function createEquipItemsDb() {
  return ({
    id: 'hev_battery',
    universe: 'Half-Life',
    name: { en: 'HEV Auxiliary Battery', fr: 'Batterie auxiliaire HEV' },
    desc: {
      fr: 'Module energetique de combinaison Hazardous Environment. Dans une Breche, il restaure la logique Half-Life du bouclier numerique, des alertes vocales et de la survie scientifique sous incident dimensionnel.',
      en: 'Hazardous Environment suit power module. In a Breach, it restores Half-Life logic: digital armor, suit warnings, and scientific survival during a dimensional incident.'
    },
    boost: { hp: 80, def: 5 },
    cost: 90
  });
}

export function createEquipItemsDb2() {
  return ({
    id: 'snark_cage',
    universe: 'Half-Life',
    name: { en: 'Xen Snark Containment Cage', fr: 'Cage de confinement snark Xen' },
    desc: {
      fr: 'Cage de laboratoire contenant des snarks de Xen. A.R.C.A. l emploie comme ancre offensive instable: courte fenetre de chaos biologique, morsures rapides et pression sur les lignes Combine.',
      en: 'Laboratory cage containing Xen snarks. A.R.C.A. uses it as an unstable offensive anchor: short biological chaos window, fast bites, and pressure against Combine lines.'
    },
    boost: { atk: 9 },
    cost: 100
  });
}

export function createEquipItemsDb3() {
  return ({
    id: 'longjump_mod',
    universe: 'Half-Life',
    name: { en: 'HEV Long Jump Module', fr: 'Module de saut long HEV' },
    desc: {
      fr: 'Module de mobilite Black Mesa concu pour traverser les espaces hostiles de Xen. Dans Multiverse Breach, il sert a franchir une rupture, quitter une case menacee ou transformer une fuite en repositionnement tactique.',
      en: 'Black Mesa mobility module designed to cross hostile Xen spaces. In Multiverse Breach, it crosses ruptures, exits threatened tiles, or turns retreat into tactical repositioning.'
    },
    boost: { spd: 3 },
    cost: 120
  });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_hl_snarks',
    name: { en: 'Xen Snark Release Case', fr: 'Boite de liberation snark Xen' },
    desc: {
      en: 'Opens a controlled Xen containment case. Snarks flood the breach for a short window, harassing Combine or alien targets while the HEV signal marks a safe fallback route.',
      fr: 'Ouvre une caisse de confinement Xen sous controle. Des snarks envahissent brievement la breche, harcelent les cibles Combine ou aliennes pendant que le signal HEV marque une route de repli sure.'
    },
    effect: 'spawn_snarks'
  });
}

export function createExtraHeroData() {
  return applyHalfLifeHeroSourceContracts([
    { id: 'barney', name: 'Barney Calhoun', cat: 'tactical', color: '#3498db' },
    { id: 'shephard', name: 'Adrian Shephard', cat: 'marine', color: '#7f8c8d' },
    { id: 'alyx_vance', name: 'Alyx Vance', cat: 'hacker', color: '#8e6f4e' }
  ]);
}

export function createCanonRosterExpansion() {
  return applyHalfLifeHeroSourceContracts([
    { id: 'eli_vance', name: 'Eli Vance', cat: 'hacker', color: '#6e4f39' },
    { id: 'kleiner', name: 'Dr. Kleiner', cat: 'hacker', color: '#bdc3c7' },
    { id: 'vortigaunt_ally', name: 'Vortigaunt Ally', cat: 'hacker', color: '#6f8f4f' },
    { id: 'dog_hl2', name: 'Dog', cat: 'marine', color: '#95a5a6' }
  ]);
}

export function createHeroOverrides() {
  return applyHalfLifeHeroSourceContracts({
    simple: { name: 'Crowbar Vector', type: 'melee', dmg: 1.1 },
    secondary: { name: 'Gravity Gun Punt', type: 'gravity', cd: 6, dmg: 1.8 },
    defense: { name: 'HEV Aux Power', type: 'shield', dur: 2.5, reduce: 0.85 },
    special: { name: 'Overcharged Gravity Gun', type: 'beam', dmg: 4.8, color: '#33ccff' }
  }, 'freeman');
}

export function createHeroOverrides2() {
  return applyHalfLifeHeroSourceContracts({
    weaponType: 'gun',
    weaponColor: '#1f2d36',
    simple: { name: 'Black Mesa 9mm Cover', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Resistance Crossfire', type: 'bullet', cd: 7, dmg: 1.7 },
    defense: { name: 'Security Door Hold', type: 'shield', dur: 2.0, reduce: 0.8 },
    special: { name: 'City 17 Evac Route', type: 'support_aoe', dmg: 4.1, color: '#3498db' }
  }, 'barney');
}

export function createHeroOverrides3() {
  return applyHalfLifeHeroSourceContracts({
    weaponType: 'gun',
    weaponColor: '#2f3b32',
    simple: { name: 'HECU Rifle Burst', type: 'bullet', dmg: 1.05 },
    secondary: { name: 'Pipe Wrench Breach', type: 'melee', cd: 6, dmg: 1.8 },
    defense: { name: 'Marine Cover Order', type: 'shield', dur: 2.1, reduce: 0.78 },
    special: { name: 'Race X Suppression', type: 'explosive_aoe', dmg: 4.6, color: '#7f8c8d' }
  }, 'shephard');
}

export function createHeroOverrides4() {
  return applyHalfLifeHeroSourceContracts({
    weaponType: 'gun',
    weaponColor: '#3a2c25',
    simple: { name: 'Resistance Pistol', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Combine Lock Hack', type: 'hack', cd: 6, dmg: 1.55 },
    defense: { name: 'Gravity Glove Pull', type: 'dodge', dur: 1.9, reduce: 0.8 },
    special: { name: 'Dog Breach Assist', type: 'summon_aoe', dmg: 4.5, color: '#8e6f4e' }
  }, 'alyx_vance');
}

// Source contracts align the raw catalog with the already authored mode kits.
// These declarations never approve portraits, atlases or source-frame fidelity.
const SCIFI_HERO_SOURCE_CONTRACTS = {
  "freeman": {
    "incarnation": "Half-Life 2 (2004) - HEV Mark V / Citadel",
    "referenceUrl": "https://www.half-life.com/en/halflife2",
    "visualAnchor": "Half-Life 2 Gordon Freeman: brown hair, beard, rectangular glasses, orange and grey HEV Mark V suit, crowbar and zero-point energy field manipulator. The Citadel overcharge is the blue Gravity Gun state, not the HL1 gluon gun or Mark IV suit.",
    "equipment": [
      "Crowbar",
      "HEV Mark V suit",
      "Gravity Gun"
    ],
    "weaponType": "crowbar",
    "canonStatus": "source-locked-gameplay-adaptation",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Coup de pied-de-biche de Freeman",
      "type": "melee",
      "dmg": 1.1,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 100,
        "targetSide": "enemy"
      }
    },
    "secondary": {
      "cd": 6,
      "name": "Projection au pistolet antigravité",
      "type": "projectile",
      "dmg": 1.8,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 550,
        "targetSide": "enemy"
      }
    },
    "defense": {
      "name": "Protection de la combinaison HEV",
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
      "name": "Pistolet antigravité surchargé",
      "type": "projectile",
      "dmg": 4.8,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 640,
        "targetSide": "enemy"
      },
      "color": "#8edaff",
      "meterCost": 100
    }
  },
  "barney": {
    "incarnation": "Half-Life 2 (2004), unmasked undercover Civil Protection and Resistance leader",
    "referenceUrl": "https://combineoverwiki.net/wiki/Barney_Calhoun",
    "visualAnchor": "Half-Life 2 unmasked Barney: adult human, short dark hair and stubble, blue-grey undercover Civil Protection uniform and armored vest, black boots, AR2 pulse rifle in the Resistance fighting phase. No Black Mesa security helmet or Blue Shift uniform is implied.",
    "equipment": [
      "Civil Protection disguise and armored vest",
      "AR2 pulse rifle"
    ],
    "weaponType": "gun",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Tir de l’AR2 de Barney",
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
      "name": "Barney guide la Résistance",
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
      "name": "Couvert de Barney",
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
      "name": "Tir de couverture à l’AR2",
      "type": "projectile",
      "dmg": 4.1,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 640,
        "targetSide": "enemy"
      },
      "color": "#e4c18b",
      "meterCost": 100
    }
  },
  "shephard": {
    "incarnation": "Half-Life: Opposing Force (1999), Adrian Shephard HECU loadout",
    "referenceUrl": "https://combineoverwiki.net/wiki/Adrian_Shephard",
    "visualAnchor": "Opposing Force 1999 Adrian Shephard: HECU Marine with olive helmet, dark gas mask and round eye lenses, PCV combat vest, camouflage fatigues and boots; physical HECU submachine gun. Keep the masked Marine instead of Freeman s glasses or HEV suit.",
    "equipment": [
      "HECU helmet and gas mask",
      "Powered Combat Vest",
      "HECU submachine gun"
    ],
    "weaponType": "gun",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Tir de HECU submachinegun de Adrian Shephard",
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
      "name": "Visée de HECU submachinegun de Adrian Shephard",
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
      "name": "Repli de Adrian Shephard en Half-Life: Opposing Force (1999)",
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
      "name": "Rafale HECU d’Adrian Shephard",
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
  "alyx_vance": {
    "incarnation": "Half-Life 2 (2004)",
    "referenceUrl": "https://combineoverwiki.net/wiki/Alyx_Vance",
    "visualAnchor": "Half-Life 2 2004 Alyx: adult woman with brown hair tied behind an orange headband, worn brown jacket over grey Black Mesa hoodie, jeans and fingerless gloves; Alyx Gun and her electrical multitool. This version does not wear the 2020 VR Gravity Gloves.",
    "equipment": [
      "Alyx Gun",
      "Electrical multitool",
      "Brown jacket and grey Black Mesa hoodie"
    ],
    "weaponType": "gun",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Tir du pistolet d’Alyx",
      "type": "projectile",
      "dmg": 1,
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
    "secondary": {
      "cd": 6,
      "name": "Ouverture du passage au multitool",
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
      "name": "Couvert d’Alyx",
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
      "name": "Tir de précision d’Alyx",
      "type": "projectile",
      "dmg": 4.5,
      "animationDuration": 1.1,
      "hitAt": 0.451,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "single",
        "range": 600,
        "targetSide": "enemy"
      },
      "color": "#edc388",
      "meterCost": 100
    }
  },
  "eli_vance": {
    "incarnation": "Half-Life 2 (2004), Black Mesa East",
    "referenceUrl": "https://combineoverwiki.net/wiki/Eli_Vance",
    "visualAnchor": "Half-Life 2 Black Mesa East Eli Vance: older Black man with grey hair and beard, green jacket over a grey Harvard shirt, visible left lower-leg prosthesis. His lab coordination is non-offensive support; keep his civilian clothes and prosthesis without an energy rifle.",
    "equipment": [
      "Civilian laboratory clothing",
      "Left lower-leg prosthesis",
      "Black Mesa East laboratory equipment"
    ],
    "weaponType": "terminal",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Eli compare les données de la Résistance",
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
      "name": "Transmettre le briefing de Black Mesa East",
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
      "name": "Retrait dans le laboratoire d’Eli",
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
      "name": "Coordination de Black Mesa East",
      "type": "buff",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.45,
      "targeting": {
        "effect": "buff",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 4,
        "buffMultiplier": 1.2
      },
      "color": "#b9c8ae",
      "meterCost": 100
    }
  },
  "kleiner": {
    "incarnation": "Half-Life 2 (2004), Kleiner’s laboratory",
    "referenceUrl": "https://combineoverwiki.net/wiki/Isaac_Kleiner",
    "visualAnchor": "Half-Life 2 Isaac Kleiner: older balding white scientist, round glasses, white lab coat over shirt and tie, dark trousers, laboratory instruments and teleportation console. Lamarr is a separate debeaked headcrab and is not grafted to his body or used as a firearm.",
    "equipment": [
      "White laboratory coat",
      "Glasses",
      "Teleportation laboratory console"
    ],
    "weaponType": "terminal",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Kleiner vérifie les relais du laboratoire",
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
      "name": "Préparer le transfert de secours",
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
      "name": "Se couvrir au pupitre de téléportation",
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
      "name": "Calibration du téléporteur",
      "type": "guard",
      "dmg": 0,
      "animationDuration": 1.1,
      "hitAt": 0.45,
      "targeting": {
        "effect": "guard",
        "delivery": "support",
        "shape": "group",
        "range": 760,
        "targetSide": "ally",
        "duration": 4,
        "reduce": 0.5
      },
      "color": "#a8ddeb",
      "meterCost": 100
    }
  },
  "vortigaunt_ally": {
    "incarnation": "Half-Life 2 (2004), freed allied Vortigaunt",
    "referenceUrl": "https://combineoverwiki.net/wiki/Vortigaunt",
    "visualAnchor": "Half-Life 2 freed allied Vortigaunt: olive-brown cyclopean alien, one large red eye, two long arms and a small chest arm, digitigrade legs; green Vortessence originates in its palms. No enslaved HL1 collar, gun or human soldier armor.",
    "equipment": [
      "Vortessence hands"
    ],
    "weaponType": "energy",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Décharge de Vortessence",
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
      "name": "Concentration du Vortigaunt libre",
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
      "name": "Repli du Vortigaunt allié",
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
      "name": "Décharge du Vortigaunt libre",
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
  "dog_hl2": {
    "incarnation": "Half-Life 2 (2004), Alyx’s robot Dog",
    "referenceUrl": "https://combineoverwiki.net/wiki/Dog",
    "visualAnchor": "Half-Life 2 Dog: very large asymmetric rust-brown and cream industrial biped robot, small bright sensor head, hydraulic torso, two long mechanical arms with large hands and industrial feet. Strikes are local mechanical hand contacts; no rifle or detached beam.",
    "equipment": [
      "Mechanical arms and hands",
      "Hydraulic industrial body"
    ],
    "weaponType": "fist",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Poussée du bras mécanique de Dog",
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
      "name": "Reprise de l’appui hydraulique",
      "type": "melee",
      "dmg": 1.65,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "melee",
        "shape": "single",
        "range": 85,
        "targetSide": "enemy"
      },
      "cd": 6
    },
    "defense": {
      "name": "Blocage des bras de Dog",
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
      "name": "Coup du bras mécanique de Dog",
      "type": "melee",
      "dmg": 4.4,
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
  }
};

export function applyHalfLifeHeroSourceContracts(value, sourceId) {
  if (Array.isArray(value)) return value.map(actor => applyHalfLifeHeroSourceContracts(actor));
  const contract = SCIFI_HERO_SOURCE_CONTRACTS[sourceId || value.id];
  return contract ? { ...value, ...structuredClone(contract) } : value;
}
