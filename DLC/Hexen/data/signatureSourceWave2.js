// Hexen — definitions consumed by src/game/signatureSourceWave2.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureWave2Rows({ hero }) {
  return (hero("Hexen", "hexen_baratus", "Quietus assembly", "Quietus — Sword Flame Fan", "fire", 330, "hexen-weapons", {"hits":5,"shape":"multi","distribution":"cycle","note":"Five Quietus projectiles represented as scheduled contacts. No melee-only conversion; source mana and weapon-piece progression are not simulated."}));
}

export function createSignatureWave2Rows2({ enemy }) {
  return (enemy("Hexen", "Zedek", "Undead Legion mastery", "Quietus — Sword Flame Fan", "fire", 330, "hexen-weapons", {"enemyId":"hexen_zedek","hits":5,"shape":"multi","distribution":"cycle","note":"Five Quietus projectiles represented as scheduled contacts. No melee-only conversion; source mana and weapon-piece progression are not simulated."}));
}

export function createSignatureWave2Rows3({ hero }) {
  return (hero("Hexen", "hexen_parias", "Wraithverge assembly", "Wraithverge — Four Spirits", "summon", 420, "hexen-weapons", {"hits":4,"shape":"multi","distribution":"cycle","kind":"summon","summonName":"Wraithverge spirits","note":"Four summoned spirits represented by four contacts. Homing agents, passage through walls, duration and mana economy are not reproduced."}));
}

export function createSignatureWave2Rows4({ enemy }) {
  return (enemy("Hexen", "Traductus", "Unlife church storm", "Wraithverge — Four Spirits", "summon", 420, "hexen-weapons", {"enemyId":"hexen_traductus","hits":4,"shape":"multi","distribution":"cycle","kind":"summon","summonName":"Wraithverge spirits","note":"Four summoned spirits represented by four contacts. Homing agents, passage through walls, duration and mana economy are not reproduced."}));
}

export function createSignatureWave2Rows5({ hero }) {
  return (hero("Hexen", "hexen_daedolon", "Bloodscourge assembly", "Bloodscourge — Seeking Fireballs", "fire", 380, "hexen-weapons", {"hits":3,"shape":"multi","distribution":"cycle","note":"Three Bloodscourge projectiles; homing is condensed into confirmed targets. No auto-hit through walls or enemy-side class substitution is claimed."}));
}

export function createSignatureWave2Rows6({ enemy }) {
  return (enemy("Hexen", "Menelkir", "Crystal Dais sorcery", "Bloodscourge — Seeking Fireballs", "fire", 380, "hexen-weapons", {"enemyId":"hexen_menelkir","hits":3,"shape":"multi","distribution":"cycle","note":"Three Bloodscourge projectiles; homing is condensed into confirmed targets. No auto-hit through walls or enemy-side class substitution is claimed."}));
}

export function createSignatureWave2Rows7({ enemy }) {
  return (enemy("Hexen", "Ettin", "Corrupted Legion rush", "Ettin Mace Strike", "slash", 78, "hexen-monsters", {"enemyId":"hexen_ettin"}));
}

export function createSignatureWave2Rows8({ enemy }) {
  return (enemy("Hexen", "Dark Bishop", "Phase teleport", "Dark Bishop Missile Volley", "orb", 340, "hexen-monsters", {"enemyId":"hexen_dark_bishop","hits":3,"note":"Bishop missile family; three contacts are adapted. Phase teleport is not granted by the volley."}));
}
