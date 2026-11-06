// Team Fortress 2 — definitions consumed by src/game/signatureSourceWave2.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureWave2Rows({ hero }) {
  return (hero("Team Fortress 2", "team_fortress_2_scout", "Bonk Flank", "Scattergun Double Shot", "barrage", 180, "tf-scattergun", {"hits":2,"note":"Scattergun attack adaptation, not Bonk invulnerability; no health or instant-kill bonus."}));
}

export function createSignatureWave2Rows2({ enemy }) {
  return (enemy("Team Fortress 2", "Robot Scout", "Bomb Sprint", "Scattergun Double Shot", "barrage", 180, "tf-scattergun", {"enemyId":"team_fortress_2_robot_scout","hits":2,"note":"Scattergun attack adaptation, not Bonk invulnerability; no health or instant-kill bonus."}));
}

export function createSignatureWave2Rows3({ hero }) {
  return (hero("Team Fortress 2", "team_fortress_2_soldier", "Banner Charge", "Rocket Launcher Salvo", "barrage", 340, "tf-rocket", {"hits":3,"shape":"multi","distribution":"cycle","note":"Three-contact rocket salvo. No Buff Banner, crit boost, source rocket-jump physics or arbitrary robot healing is supplied."}));
}

export function createSignatureWave2Rows4({ enemy }) {
  return (enemy("Team Fortress 2", "Robot Soldier", "Bomb Advance", "Rocket Launcher Salvo", "barrage", 340, "tf-rocket", {"enemyId":"team_fortress_2_robot_soldier","hits":3,"shape":"multi","distribution":"cycle","note":"Three-contact rocket salvo. No Buff Banner, crit boost, source rocket-jump physics or arbitrary robot healing is supplied."}));
}

export function createSignatureWave2Rows5({ enemy }) {
  return (enemy("Team Fortress 2", "Sergeant Crits", "Regenerating Barrage", "Rocket Launcher Salvo", "barrage", 340, "tf-rocket", {"enemyId":"team_fortress_2_sergeant_crits","hits":3,"shape":"multi","distribution":"cycle","note":"Three-contact rocket salvo. No Buff Banner, crit boost, source rocket-jump physics or arbitrary robot healing is supplied."}));
}

export function createSignatureWave2Rows6({ enemy }) {
  return (enemy("Team Fortress 2", "Robot Heavy", "Sustained Fire", "Minigun Sustained Burst", "barrage", 320, "tf-minigun", {"enemyId":"team_fortress_2_robot_heavy","hits":6}));
}

export function createSignatureWave2Rows7({ enemy }) {
  return (enemy("Team Fortress 2", "Giant Demoman Robot", "Giant Bomb Carry", "Grenade Launcher Salvo", "barrage", 320, "tf-grenade", {"enemyId":"team_fortress_2_giant_demoman","hits":4,"shape":"multi","distribution":"cycle"}));
}
