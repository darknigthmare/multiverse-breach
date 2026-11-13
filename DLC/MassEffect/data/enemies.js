// Mass Effect — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return applyMassEffectEnemySourceContracts({
    monsters: [
      { name: 'Reaper Husk Ghoul', hp: 70, atk: 9, spd: 6, color: '#8e44ad', weapon: 'melee' },
      { name: 'Collector Drone Soldier', hp: 85, atk: 11, spd: 5, color: '#e59866', weapon: 'laser' },
      { name: 'Geth Trooper Robot', hp: 95, atk: 10, spd: 5, color: '#34495e', weapon: 'plasma_rifle' }
    ],
    bosses: [
      { name: 'Sovereign Reaper Vanguard', hp: 650, atk: 23, spd: 4, color: '#2c3e50', weapon: 'beam', special: 'Red Indoctrination Ray' },
      { name: 'Saren Arterius Corrupted', hp: 520, atk: 19, spd: 6, color: '#7f8c8d', weapon: 'gun', special: 'Geth Glider Board Sweep' }
    ],
    worldBoss: { name: 'Human-Reaper Larva Node', hp: 1380, atk: 32, spd: 3, color: '#d35400', weapon: 'shockwave', special: 'Biotic Singularity Explosion' }
  });
}

export function createCanonEnemyExpansion() {
  return applyMassEffectEnemySourceContracts({
    monsters: [
      { name: 'Husks Swarm', hp: 75, atk: 10, spd: 6, color: '#6c7a89', weapon: 'shock_grab' },
      { name: 'Geth Rocket Trooper', hp: 100, atk: 13, spd: 5, color: '#2e4053', weapon: 'rocket' },
      { name: 'Cerberus Phantom', hp: 110, atk: 15, spd: 7, color: '#f1c40f', weapon: 'monomolecular_sword' },
      { name: 'Collector Drone', hp: 105, atk: 14, spd: 5, color: '#b7950b', weapon: 'particle_beam' }
    ],
    bosses: [
      { name: 'Saren Arterius', hp: 620, atk: 23, spd: 7, color: '#34495e', weapon: 'sovereign_augments', special: 'Indoctrinated Charge' },
      { name: 'Harbinger Avatar', hp: 680, atk: 25, spd: 5, color: '#d35400', weapon: 'collector_beam', special: 'Assuming Direct Control' }
    ]
  });
}

// Exact legacy names remain the runtime/signature identities.
const SCIFI_ENEMY_SOURCE_CONTRACTS = {
  "Geth Rocket Trooper": {
    "incarnation": "Mass Effect 2 (2010) - geth rocket trooper",
    "referenceUrl": "https://masseffect.fandom.com/wiki/Geth_Rocket_Trooper",
    "visualAnchor": "Synthetic geth trooper with plated grey armor, exposed synthetic joints, backward-swept head and single bright optic, carrying a physical rocket launcher. No human face, organic muscles or biotic casting.",
    "equipment": [
      "Geth rocket launcher"
    ],
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13"
  },
  "Cerberus Phantom": {
    "incarnation": "Mass Effect 3 (2012) - Cerberus Phantom",
    "referenceUrl": "https://masseffect.fandom.com/wiki/Phantom",
    "visualAnchor": "Slim human Cerberus Phantom in white-black segmented armor, enclosed orange visor helmet, monomolecular sword and integrated palm blaster. Keep the sword and armored human body distinct from an asari biotic or geth platform.",
    "equipment": [
      "Monomolecular sword",
      "Integrated palm blaster",
      "Phantom combat armor"
    ],
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13"
  },
  "Collector Drone": {
    "incarnation": "Mass Effect 2 (2010) - Collector drone with Collector assault rifle",
    "referenceUrl": "https://masseffect.fandom.com/wiki/Collector_Drone",
    "visualAnchor": "Insectoid Collector drone with brown-gold segmented carapace, narrow limbs, multi-eye head and organic Collector assault rifle. It is an ordinary drone; no Harbinger possession glow or Collector Particle Beam heavy weapon is assigned.",
    "equipment": [
      "Collector assault rifle"
    ],
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13",
    "weapon": "gun"
  },
  "Husk Shock Trooper": {
    "incarnation": "Mass Effect (2007) - Husk, legacy Shock Trooper label",
    "referenceUrl": "https://masseffect.fandom.com/wiki/Husk",
    "visualAnchor": "Emaciated converted human Husk with exposed dark cybernetic ribbing, blue circuitry and glowing blue eyes. The legacy Shock Trooper label denotes a game encounter variant; source identity remains a ME1 Husk, not a new Cerberus soldier species.",
    "equipment": [
      "Cybernetic claws",
      "ME1 electrical discharge"
    ],
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13"
  },
  "Geth Prime Platform": {
    "incarnation": "Mass Effect 2 (2010) - geth prime",
    "referenceUrl": "https://masseffect.fandom.com/wiki/Geth_Prime",
    "visualAnchor": "Very large broad-shouldered synthetic geth prime with heavy red-rust plating, exposed black joints, single bright optic and geth pulse rifle. No ME3 turret or combat-drone deployment is granted to this ME2 target.",
    "equipment": [
      "Heavy geth prime plating",
      "Geth pulse rifle"
    ],
    "canonStatus": "source-documented-gameplay-adaptation; individual visual review remains pending",
    "visualReviewStatus": "pending",
    "source1to1Verified": false,
    "artApproved": false,
    "sourceContractRevision": "scifi-lot-040-2026-11-13"
  }
};

export function applyMassEffectEnemySourceContracts(roster) {
  return { ...roster, monsters: (roster.monsters || []).map(actor => {
    const contract = SCIFI_ENEMY_SOURCE_CONTRACTS[actor.name];
    return contract ? { ...actor, ...structuredClone(contract) } : actor;
  }) };
}
