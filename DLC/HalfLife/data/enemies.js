// Half-Life — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return applyHalfLifeEnemySourceContracts({
    monsters: [
      { name: 'Leaping Headcrab Zombie', hp: 70, atk: 8, spd: 4, color: '#8d6e63', weapon: 'claws' },
      { name: 'Combine Overwatch Soldier', hp: 85, atk: 10, spd: 5, color: '#34495e', weapon: 'gun' },
      { name: 'Acid-Spitting Bullsquid', hp: 90, atk: 11, spd: 5, color: '#d35400', weapon: 'acid' },
      { name: 'Vortigaunt Shock Trooper', hp: 105, atk: 13, spd: 5, color: '#6f8f4f', weapon: 'vortessence' },
      { name: 'Race X Shock Trooper', hp: 115, atk: 14, spd: 4, color: '#6b4b8a', weapon: 'spore_launcher' }
    ],
    bosses: [
      { name: 'Combine Gunship', hp: 560, atk: 20, spd: 5, color: '#424949', weapon: 'laser', special: 'Pulse Cannon Barrage' },
      {
        name: 'Alien Nihilanth Core', hp: 520, atk: 19, spd: 3, color: '#cca43b', weapon: 'portal_psionics', special: 'Teleportation Orb',
        canonicalName: 'Nihilanth',
        incarnation: 'Half-Life (1998) - Xen finale',
        equipment: ['Energy projectiles', 'Teleportation orbs', 'Orbiting energy spheres'],
        referenceUrl: 'https://combineoverwiki.net/wiki/Nihilanth',
        visualAnchor: 'Massive floating Nihilanth with an oversized head, small legs and vestigial chest arm, shackles, orange orbiting spheres and a head that opens over its brain. Organic Xen crystal cavern, never a Combine core or a Strider.',
        visualReviewStatus: 'pending'
      },
      { name: 'Gonarch Brood Mother', hp: 540, atk: 21, spd: 4, color: '#d6b36a', weapon: 'headcrab_brood', special: 'Headcrab Swarm Birth' }
    ],
    worldBoss: { name: 'Combine Strider Heavy', hp: 1350, atk: 33, spd: 3, color: '#2c3e50', weapon: 'warp_cannon', special: 'Dark Energy Impale' }
  });
}

export function createCanonEnemyExpansion() {
  return applyHalfLifeEnemySourceContracts({
    monsters: [
      { name: 'Houndeye Pack', hp: 75, atk: 11, spd: 6, color: '#7d6f3f', weapon: 'sonic_blast' },
      { name: 'Barnacle Ceiling Trap', hp: 65, atk: 10, spd: 2, color: '#a36b6b', weapon: 'tongue_grab' },
      { name: 'Antlion Guard Larva', hp: 130, atk: 15, spd: 6, color: '#8e6f2e', weapon: 'charge' }
    ],
    bosses: [
      { name: 'HECU Black Ops Squad', hp: 500, atk: 18, spd: 7, color: '#111317', weapon: 'suppressed_fire', special: 'Black Mesa Cleanup' },
      { name: 'Advisor Pod Core', hp: 650, atk: 22, spd: 4, color: '#5d4a73', weapon: 'psychic_lift', special: 'Neural Harvest' }
    ]
  });
}

// Exact legacy names remain the runtime/signature identities.
const SCIFI_ENEMY_SOURCE_CONTRACTS = {
  "Combine Overwatch Soldier": {
    "incarnation": "Half-Life 2 (2004) - standard Overwatch soldier with AR2",
    "referenceUrl": "https://combineoverwiki.net/wiki/Overwatch_Soldier",
    "visualAnchor": "Human-sized standard Combine Overwatch soldier in blue-grey armor, black enclosed gas-mask helmet with pale lenses and an AR2 pulse rifle. No white Elite armor or exposed Resistance face.",
    "equipment": [
      "Standard blue-grey Overwatch armor",
      "AR2 pulse rifle"
    ],
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13"
  },
  "Acid-Spitting Bullsquid": {
    "incarnation": "Half-Life (1998) - Xen bullsquid",
    "referenceUrl": "https://github.com/ValveSoftware/halflife/blob/master/dlls/bullsquid.cpp",
    "visualAnchor": "Stocky biped Xen bullsquid with thick orange-brown hide, two legs, a heavy tail and red mouth tentacles around the snout. Acid spit leaves the mouth; no humanoid arms, gun or Combine armor.",
    "equipment": [
      "Mouth acid spit",
      "Tail and mouth tentacles"
    ],
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13"
  },
  "Houndeye Pack": {
    "incarnation": "Half-Life (1998) - Houndeye, pack encounter abstraction",
    "referenceUrl": "https://github.com/ValveSoftware/halflife/blob/master/dlls/houndeye.cpp",
    "visualAnchor": "Stocky three-legged Houndeye with brown-yellow hide, pale belly and one large compound eye at the front. Sonic rings are centered on the animal; the legacy Pack label does not certify several bodies in one sprite.",
    "equipment": [
      "Sonic discharge organ"
    ],
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13"
  },
  "Barnacle Ceiling Trap": {
    "incarnation": "Half-Life (1998) - ceiling-attached barnacle",
    "referenceUrl": "https://combineoverwiki.net/wiki/Barnacle",
    "visualAnchor": "Sessile fleshy Xen barnacle attached to a ceiling, downward mouth and a long hanging sticky tongue. Its source movement is ceiling-fixed; no walking legs or handheld weapon. Ceiling attachment and tongue choreography still require mode-specific visual review.",
    "equipment": [
      "Hanging tongue and mouth"
    ],
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13"
  },
  "Zombie Poison Headcrab Host": {
    "incarnation": "Half-Life 2 (2004) - poison zombie host",
    "referenceUrl": "https://combineoverwiki.net/wiki/Poison_Zombie",
    "visualAnchor": "Bulky hunched human poison zombie in a worn jacket, carrying dark poison headcrabs across the shoulders and back, with one grasped for throwing. Preserve the distinct crab shapes; no green fire breath or ordinary bare zombie head.",
    "equipment": [
      "Carried poison headcrabs",
      "Infected hands"
    ],
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13"
  }
};

export function applyHalfLifeEnemySourceContracts(roster) {
  return { ...roster, monsters: (roster.monsters || []).map(actor => {
    const contract = SCIFI_ENEMY_SOURCE_CONTRACTS[actor.name];
    return contract ? { ...actor, ...structuredClone(contract) } : actor;
  }) };
}
