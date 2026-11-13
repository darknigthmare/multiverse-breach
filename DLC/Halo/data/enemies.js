// Halo — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return applyHaloEnemySourceContracts({
    monsters: [
      { name: 'Covenant Grunt', hp: 70, atk: 7, spd: 5, color: '#33527a', weapon: 'plasma_pistol' },
      { name: 'Jackal Sniper', hp: 80, atk: 11, spd: 6, color: '#e67e22', weapon: 'beam_rifle' },
      { name: 'Elite Minor', hp: 110, atk: 10, spd: 5, color: '#335fa7', weapon: 'plasma_rifle', incarnation: 'Halo 2 (2004) - blue-armored Sangheili Minor', referenceUrl: 'https://www.halopedia.org/Sangheili_Minor', visualReviewStatus: 'pending' },
      { name: 'Forerunner Sentinel', hp: 90, atk: 12, spd: 7, color: '#7fd7ff', weapon: 'sentinel_beam' },
      { name: 'Flood Combat Form', hp: 120, atk: 13, spd: 5, color: '#8d7b46', weapon: 'infected_claws' }
    ],
    bosses: [
      { name: 'Brute Chieftain Tartarus', hp: 500, atk: 20, spd: 4, color: '#595045', weapon: 'gravity_hammer', special: 'Fist of Rukt Slam' },
      { name: 'Prophet of Regret', hp: 440, atk: 17, spd: 5, color: '#cca43b', weapon: 'gravity_throne', special: 'Gravity Throne Laser' },
      { name: '343 Guilty Spark Fragment', hp: 470, atk: 18, spd: 6, color: '#9fdfff', weapon: 'monitor_beam', special: 'Containment Protocol' }
    ],
    worldBoss: {
      name: 'Covenant Scarab Mech', hp: 1300, atk: 30, spd: 2, color: '#2c1f30', weapon: 'focus_cannon', special: 'Ultra-Focus Plasma Beam',
      canonicalName: 'Protos-pattern Scarab',
      incarnation: 'Halo 2 (2004) - Metropolis',
      equipment: ['Ultra-heavy focus cannon', 'Heavy plasma repeaters'],
      referenceUrl: 'https://www.halopedia.org/Protos-pattern_Scarab',
      visualAnchor: 'Halo 2 Protos-pattern Scarab: four legs, high purple-gray hull, broad flat deck, arched gangway and passenger cabin. No Halo 3 Deutoros exposed rear reactor.',
      visualReviewStatus: 'pending'
    }
  });
}

export function createCanonEnemyExpansion() {
  return applyHaloEnemySourceContracts({
    monsters: [
      { name: 'Hunter Bond Pair', hp: 165, atk: 16, spd: 3, color: '#34495e', weapon: 'fuel_rod' },
      { name: 'Brute Captain', hp: 125, atk: 14, spd: 5, color: '#5c5146', weapon: 'spiker' },
      { name: 'Yanme Drone Swarm', hp: 70, atk: 10, spd: 8, color: '#8fbc8f', weapon: 'needle_swarm' },
      { name: 'Flood Carrier Form', hp: 90, atk: 17, spd: 3, color: '#9a8b55', weapon: 'infection_burst' },
      { name: 'Promethean Knight', hp: 135, atk: 15, spd: 5, color: '#f0f7ff', weapon: 'hardlight_blade' }
    ],
    bosses: [
      { name: 'Gravemind Tendril', hp: 720, atk: 24, spd: 2, color: '#6b5a38', weapon: 'flood_mind', special: 'Logic Plague Whisper' },
      { name: 'Ur-Didact Echo', hp: 640, atk: 23, spd: 5, color: '#dfefff', weapon: 'constraint_field', special: 'Composer Pulse' }
    ]
  });
}

// Exact legacy names remain the runtime/signature identities.
const SCIFI_ENEMY_SOURCE_CONTRACTS = {
  "Covenant Grunt": {
    "incarnation": "Halo 2 (2004) - blue-armored Unggoy Major",
    "referenceUrl": "https://www.halopedia.org/Unggoy_Major",
    "visualAnchor": "Short stocky Unggoy Major with blue armor, methane backpack, snout respirator, small limbs and a green-charged Type-25 plasma pistol. Keep the alien respirator and tank rather than a human face or Spartan helmet.",
    "equipment": [
      "Methane respirator and tank",
      "Type-25 plasma pistol"
    ],
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13"
  },
  "Jackal Sniper": {
    "incarnation": "Halo 2 (2004) - Kig-Yar sniper with beam rifle",
    "referenceUrl": "https://www.halopedia.org/Kig-Yar_Sniper",
    "visualAnchor": "Lean bird-reptile Kig-Yar sniper with elongated head and muzzle, digitigrade legs, compact armor and long purple Type-50 beam rifle. The sniper loadout is not a shield-bearing pistol Jackal.",
    "equipment": [
      "Type-50 beam rifle"
    ],
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13"
  },
  "Elite Minor": {
    "incarnation": "Halo 2 (2004) - blue-armored Sangheili Minor",
    "referenceUrl": "https://www.halopedia.org/Sangheili_Minor",
    "visualAnchor": "Tall blue-armored Sangheili Minor with a curved helmet, four mandibles, digitigrade feet and purple-blue Type-25 plasma rifle. Preserve the blue Minor rank armor and rifle rather than Arbiter ceremonial armor.",
    "equipment": [
      "Blue Sangheili Minor armor",
      "Type-25 plasma rifle"
    ],
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13"
  },
  "Forerunner Sentinel": {
    "incarnation": "Halo 2 (2004) - standard Aggressor Sentinel",
    "referenceUrl": "https://www.halopedia.org/Aggressor_Sentinel",
    "visualAnchor": "Floating bronze-grey standard Aggressor Sentinel with central glowing eye, small angular body and articulated side appendages; its focused beam originates at the eye. It has no humanoid legs or handheld rifle.",
    "equipment": [
      "Integrated Sentinel beam emitter"
    ],
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13"
  },
  "Flood Combat Form": {
    "incarnation": "Halo 2 (2004) - unarmed human Flood combat form",
    "referenceUrl": "https://www.halopedia.org/Flood_combat_form",
    "visualAnchor": "Infected human combat form with collapsed head, burst chest infection mass, mottled human remnants and elongated striking tendrils. This contract selects an unarmed human host, not an armored infected Sangheili or carrier form.",
    "equipment": [
      "Flood striking tendrils"
    ],
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13"
  }
};

export function applyHaloEnemySourceContracts(roster) {
  return { ...roster, monsters: (roster.monsters || []).map(actor => {
    const contract = SCIFI_ENEMY_SOURCE_CONTRACTS[actor.name];
    return contract ? { ...actor, ...structuredClone(contract) } : actor;
  }) };
}
