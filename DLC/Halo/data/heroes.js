// Halo — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return applyHaloHeroSourceContracts({
    id: 'masterchief',
    name: 'Master Chief',
    universe: 'Halo',
    category: 'marine',
    primaryColor: '#2e5c1e',
    secondaryColor: '#ff9900',
    weaponType: 'gun',
    weaponColor: '#1c1c1c',
    stats: { hp: 150, atk: 16, def: 10, spd: 5 },
    simple: { name: 'Assault Rifle', type: 'bullet', dmg: 1.1 },
    secondary: { name: 'Plasma Grenade', type: 'projectile', cd: 6, dmg: 1.8 },
    defense: { name: 'Bubble Shield', type: 'shield', dur: 3.0, reduce: 0.9 },
    special: { name: 'Spartan Laser', type: 'beam', dmg: 4.5, color: '#ff3333' }
  });
}

export function createEquipItemsDb() {
  return ({
    id: 'mjolnir_shield',
    universe: 'Halo',
    name: { en: 'MJOLNIR Mk VI Shield Lattice', fr: 'Maille de bouclier MJOLNIR Mk VI' },
    desc: {
      fr: 'Fragment de sous-systeme energetique inspire de l armure MJOLNIR du Spartan-II: il ne rend pas invincible, il restaure la logique Halo du bouclier rechargeable et de l avancee sous feu controle.',
      en: 'Energy subsystem fragment inspired by Spartan-II MJOLNIR armor: it does not make the wearer invincible, it restores Halo logic of rechargeable shielding and controlled advance under fire.'
    },
    boost: { hp: 50, def: 8 },
    cost: 100
  });
}

export function createEquipItemsDb2() {
  return ({
    id: 'cortana_chip',
    universe: 'Halo',
    name: { en: 'Cortana Matrix Shard', fr: 'Eclat de matrice Cortana' },
    desc: {
      fr: 'Eclat de donnees tactiques sauve d une interface UNSC/Forerunner. A.R.C.A. l utilise comme aide de ciblage: prediction de trajectoire, lecture Covenant et verrouillage de noyau de faille.',
      en: 'Tactical data shard saved from a UNSC/Forerunner interface. A.R.C.A. uses it as targeting support: trajectory prediction, Covenant pattern reading, and rift-core lock.'
    },
    boost: { atk: 10 },
    cost: 120
  });
}

export function createEquipItemsDb3() {
  return ({
    id: 'magnum_ammo',
    universe: 'Halo',
    name: { en: 'M6D AP Magazine', fr: 'Chargeur perforant M6D' },
    desc: {
      fr: 'Chargeur calibre 12.7mm associe au magnum M6D de l ere Installation 04. Dans une faille, chaque tir sert de repere UNSC: court, net, fiable quand la Trame brouille les armes lourdes.',
      en: '12.7mm magazine tied to the M6D magnum from the Installation 04 era. In a rift, each shot acts as a UNSC anchor: short, clean, reliable when the Thread scrambles heavy weapons.'
    },
    boost: { spd: 2 },
    cost: 90
  });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_halo_warthog',
    name: { en: 'M12 Warthog LZ Beacon', fr: 'Balise LZ Warthog M12' },
    desc: {
      en: 'Marks a temporary UNSC landing lane. A remote M12 Warthog crosses the breach, suppresses Covenant infantry, knocks back light targets, and briefly opens an extraction corridor.',
      fr: 'Marque une ligne d atterrissage UNSC temporaire. Un Warthog M12 traverse la breche, cloue l infanterie Covenant, repousse les cibles legeres et ouvre brievement un couloir d extraction.'
    },
    effect: 'warthog_run'
  });
}

export function createExtraHeroData() {
  return applyHaloHeroSourceContracts([
    { id: 'arbiter', name: 'The Arbiter', cat: 'slayer', color: '#95a5a6' },
    { id: 'johnson', name: 'Sgt. Avery Johnson', cat: 'tactical', color: '#27ae60' }
  ]);
}

export function createCanonRosterExpansion() {
  return applyHaloHeroSourceContracts([
    { id: 'cortana', name: 'Cortana', cat: 'hacker', color: '#4dd2ff' },
    { id: 'noble_six', name: 'Noble Six', cat: 'marine', color: '#566573' },
    { id: 'buck_odst', name: 'Edward Buck', cat: 'tactical', color: '#34495e' },
    { id: 'kelly_087', name: 'Kelly-087', cat: 'slayer', color: '#1f7a3f' },
    { id: 'linda_058', name: 'Linda-058', cat: 'tactical', color: '#255f3f' }
  ]);
}

// Source contracts align the raw catalog with the already authored mode kits.
// These declarations never approve portraits, atlases or source-frame fidelity.
const SCIFI_HERO_SOURCE_CONTRACTS = {
  "masterchief": {
    "incarnation": "Halo 3",
    "referenceUrl": "https://www.halopedia.org/John-117",
    "visualAnchor": "Halo 3 Master Chief: tall Spartan-II in olive-green MJOLNIR Mark VI, closed helmet with gold visor, black undersuit, MA5C assault rifle and red-emitting M6 Spartan Laser. Full helmet throughout; this target is not Mark V or GEN3 armor.",
    "equipment": [
      "MJOLNIR Mark VI armor",
      "MA5C assault rifle",
      "Plasma grenade",
      "Bubble Shield equipment",
      "M6 Spartan Laser"
    ],
    "weaponType": "gun",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Rafale du MA5C",
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
      "name": "Grenade à plasma du Major",
      "type": "projectile",
      "dmg": 1.8,
      "animationDuration": 0.55,
      "hitAt": 0.2,
      "targeting": {
        "effect": "damage",
        "delivery": "projectile",
        "shape": "area",
        "range": 480,
        "targetSide": "enemy",
        "areaRadius": 80
      }
    },
    "defense": {
      "name": "Bubble Shield",
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
        "duration": 1.8,
        "reduce": 0.65
      },
      "reduce": 0.65,
      "dur": 1.8
    },
    "special": {
      "name": "Spartan Laser",
      "type": "beam",
      "dmg": 4.5,
      "color": "#ff3333",
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "line",
        "lineWidth": 42
      }
    }
  },
  "arbiter": {
    "incarnation": "Halo 2",
    "referenceUrl": "https://www.halopedia.org/Thel_%27Vadam",
    "visualAnchor": "Halo 2 Arbiter Thel: tall digitigrade Sangheili, four mandibles, silver ceremonial Arbiter armor and helmet, blue-violet energy sword and Covenant plasma rifle. Active camouflage belongs to this Halo 2 armor.",
    "equipment": [
      "Halo 2 Arbiter ceremonial armor",
      "Type-1 energy sword",
      "Type-25 plasma rifle",
      "Active camouflage"
    ],
    "weaponType": "energy_sword",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Taille de l’épée à énergie",
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
      "name": "Rafale du fusil à plasma",
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
      "name": "Camouflage actif de l’Arbiter",
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
    "special": {
      "name": "Energy Sword Lunge",
      "type": "nexus_aoe",
      "dmg": 4.6,
      "color": "#95a5a6"
    },
    "sourceSignatureDeclaration": {
      "audit": "scifi-lot-040-2026-11-13",
      "sourceKey": "halo-2",
      "actorId": "arbiter",
      "universe": "Halo",
      "incarnation": "Halo 2",
      "currentName": "Energy Sword Lunge",
      "preparedName": "Arbiter — Energy Sword Strike"
    }
  },
  "johnson": {
    "incarnation": "Halo 3",
    "referenceUrl": "https://www.halopedia.org/Avery_Johnson",
    "visualAnchor": "Halo 3 Avery Johnson: adult Black human Marine sergeant major, black moustache, olive field cap, green fatigues, Marine combat vest and boots. BR55-family battle rifle and the finale Spartan Laser are physical UNSC weapons; his cigar is not a smoke shield.",
    "equipment": [
      "UNSC Marine fatigues and field cap",
      "BR55-family battle rifle",
      "M6 Spartan Laser"
    ],
    "weaponType": "gun",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Rafale du BR55 de Johnson",
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
      "name": "Ordre de regroupement du sergent",
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
      "name": "Couvert du Marine Johnson",
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
      "name": "Spartan Laser",
      "type": "beam",
      "dmg": 4.3,
      "color": "#ff3333",
      "targeting": {
        "effect": "damage",
        "targetSide": "enemy",
        "shape": "line",
        "lineWidth": 38
      }
    }
  },
  "cortana": {
    "incarnation": "Halo 3 (2007), Cortana holographic AI",
    "referenceUrl": "https://www.halopedia.org/Cortana",
    "visualAnchor": "Halo 3 Cortana: translucent blue-violet feminine holographic AI, short dark bob, luminous body circuitry and digital projection edges. She is a projected intelligence without a physical firearm; tactical guidance is support.",
    "equipment": [
      "Holographic data interface"
    ],
    "weaponType": "terminal",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Lecture tactique de Cortana",
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
      "name": "Repérage du relais par Cortana",
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
      "name": "Redondance de l’IA Cortana",
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
      "name": "Guidage tactique de Cortana",
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
  "noble_six": {
    "incarnation": "Halo: Reach (2010), default adult Noble Six",
    "referenceUrl": "https://www.halopedia.org/SPARTAN-B312",
    "visualAnchor": "Halo Reach default adult Noble Six: opaque grey Mark V(B) Spartan helmet, amber visor, grey armor and black undersuit; hold a physical MA37 assault rifle. This target keeps the default helmet and does not borrow GEN2 Kelly or Linda armor.",
    "equipment": [
      "Default Mark V(B) armor",
      "MA37 assault rifle"
    ],
    "weaponType": "gun",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Tir du MA37 de Noble Six",
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
      "name": "Visée du MA37 de Reach",
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
      "name": "Garde de l’armure Mark V(B)",
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
      "name": "Rafale du MA37 de Noble Six",
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
  "buck_odst": {
    "incarnation": "Halo 3: ODST (2009), Buck before Spartan conversion",
    "referenceUrl": "https://www.halopedia.org/Edward_Buck",
    "visualAnchor": "Halo 3 ODST Buck before Spartan conversion: adult human in dark charcoal ODST ballistic armor, opaque visor helmet and black undersuit, holding a suppressed M7S SMG. He has neither Spartan armor nor a personal MJOLNIR shield.",
    "equipment": [
      "Halo 3 ODST ballistic armor and helmet",
      "M7S suppressed SMG"
    ],
    "weaponType": "gun",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Tir du M7S silencieux de Buck",
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
      "name": "Visée du M7S de l’ODST Buck",
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
      "name": "Repli de Buck en armure ODST",
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
      "name": "Rafale du M7S de Buck",
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
  "kelly_087": {
    "incarnation": "Halo 5: Guardians (2015)",
    "referenceUrl": "https://www.halopedia.org/Kelly-087",
    "visualAnchor": "Halo 5 Guardians Kelly-087: adult Spartan-II in white-and-grey GEN2 Hermes armor and closed Hermes helmet, carrying the physical Oathsworn M45D shotgun. Her armored proportions and shotgun remain distinct from Linda and her long Nornfang.",
    "equipment": [
      "GEN2 Hermes armor",
      "Oathsworn M45D shotgun"
    ],
    "weaponType": "gun",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Tir de l’Oathsworn de Kelly",
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
      "name": "Visée du M45D de Kelly",
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
      "name": "Garde de Kelly en armure Hermes",
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
      "name": "Tir du fusil Oathsworn de Kelly",
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
  "linda_058": {
    "incarnation": "Halo 5: Guardians (2015)",
    "referenceUrl": "https://www.halopedia.org/Linda-058",
    "visualAnchor": "Halo 5 Guardians Linda-058: adult Spartan-II in green GEN2 Argus armor, closed multi-optic Argus helmet and long red Nornfang sniper rifle. Keep the optic cluster and long rifle rather than a generic short assault rifle.",
    "equipment": [
      "GEN2 Argus armor",
      "Nornfang sniper rifle"
    ],
    "weaponType": "rifle",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Tir de précision du Nornfang",
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
      "name": "Visée Argus de Linda",
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
      "name": "Repli de Linda en armure Argus",
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
      "name": "Tir du Nornfang de Linda",
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
  "cortana_fragment": {
    "incarnation": "Halo 4 (2012) - rampant Cortana fragment, Mantle s Approach",
    "referenceUrl": "https://www.halopedia.org/Cortana",
    "visualAnchor": "Halo 4 Mantle s Approach Cortana fragment: fragmented blue holographic AI projection derived from the rampant Cortana, with short bob and interrupted luminous circuitry. It is data-support imagery, not a solid duplicate human or a handheld laser fighter.",
    "equipment": [
      "Fragmented holographic data interface"
    ],
    "weaponType": "terminal",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Fragment Data Relay",
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
      "name": "Mantle s Approach Data Access",
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
      "name": "Fragment Redundancy",
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
      "name": "Master Chief Tactical Relay",
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
  "buck": {
    "incarnation": "Halo 3: ODST (2009), Buck before Spartan conversion",
    "referenceUrl": "https://www.halopedia.org/Edward_Buck",
    "visualAnchor": "Halo 3 ODST Edward Buck: same pre-Spartan human incarnation as the historical buck_odst roster entry; dark ODST armor, helmet visor and compact suppressed M7S. Keep this legacy roster identity without inventing an orbital strike power.",
    "equipment": [
      "Halo 3 ODST ballistic armor and helmet",
      "M7S suppressed SMG"
    ],
    "weaponType": "gun",
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "simple": {
      "name": "Tir du M7S silencieux de Buck",
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
      "name": "Visée du M7S de l’ODST Buck",
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
      "name": "Repli de Buck en armure ODST",
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
      "name": "Rafale du M7S de Buck",
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

export function applyHaloHeroSourceContracts(value, sourceId) {
  if (Array.isArray(value)) return value.map(actor => applyHaloHeroSourceContracts(actor));
  const contract = SCIFI_HERO_SOURCE_CONTRACTS[sourceId || value.id];
  return contract ? { ...value, ...structuredClone(contract) } : value;
}
