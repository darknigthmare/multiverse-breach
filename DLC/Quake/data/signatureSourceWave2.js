// Quake — definitions consumed by src/game/signatureSourceWave2.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureWave2Rows({ hero }) {
  return (hero("Quake", "quake_franchise_ranger", "Rune-powered arsenal", "Thunderbolt Discharge", "lightning", 360, "quake-weapons", {"hits":3,"shape":"multi","distribution":"cycle","note":"Quake 1996 lightning weapon; no Quake Champions ability and no water discharge simulation.","requiredContinuity":"Quake (1996)"}));
}

export function createSignatureWave2Rows2({ hero }) {
  return (hero("Quake", "quake_franchise_bitterman", "Operation Alien Overlord strike", "BFG10K Discharge", "orb", 400, "q2-weapons", {"shape":"multi","note":"Quake II BFG projectile-family adaptation; not Doom BFG rays, and not a simulation of persistent scanning beams.","requiredContinuity":"Quake II (1997)"}));
}

export function createSignatureWave2Rows3({ enemy }) {
  return (enemy("Quake", "Ogre", "Castle grenade arc", "Ogre Grenade Lob", "barrage", 310, "quake-ogre", {"enemyId":"quake_franchise_ogre","requiredContinuity":"Quake (1996)"}));
}

export function createSignatureWave2Rows4({ enemy }) {
  return (enemy("Quake", "Strogg Berserker", "Long Strogg lunge", "Berserker Spike Uppercut", "slash", 78, "q2-berserker", {"enemyId":"quake_franchise_berserker","requiredContinuity":"Quake II (1997)"}));
}

export function createSignatureWave2Rows5({ enemy }) {
  return (enemy("Quake", "Strogg Gladiator", "Precision rail shot", "Gladiator Railgun", "beam", 390, "q2-gladiator", {"enemyId":"quake_franchise_gladiator","minRange":42,"note":"Quake II rail shot. Melee uses a small no-fire zone; the RPG has no pixel-distance constraint. Source telegraph and ray geometry remain adapted.","requiredContinuity":"Quake II and Quake 4"}));
}
