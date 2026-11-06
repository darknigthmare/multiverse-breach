// Half-Life — definitions consumed by src/game/signatureSourceWave2.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureWave2Rows({ hero }) {
  return (hero("Half-Life", "vortigaunt_ally", "Vortigaunt Ally Origin Burst", "Vortigaunt Electrical Discharge", "lightning", 330, "hl-vort", {"note":"Shared Vortigaunt electrical attack family; no free resurrection, healing or alien-slave behavior imposed on the ally."}));
}

export function createSignatureWave2Rows2({ enemy }) {
  return (enemy("Half-Life", "Combine Overwatch Soldier", null, "Overwatch Rifle Burst", "barrage", 330, "hl-combine", {"hits":3}));
}

export function createSignatureWave2Rows3({ enemy }) {
  return (enemy("Half-Life", "Combine Hunter", null, "Hunter Flechette Salvo", "barrage", 350, "hl-hunter", {"hits":6,"note":"Flechette salvo condensed into contacts. Delayed explosive flechettes stuck to props are not yet simulated."}));
}

export function createSignatureWave2Rows4({ enemy }) {
  return (enemy("Half-Life", "Combine Gunship", "Pulse Cannon Barrage", "Gunship Pulse Cannon Burst", "barrage", 410, "hl-gunship", {"hits":5,"note":"Five effective cannon contacts; source flight, hit limits and 15-shot burst animation are not reproduced."}));
}

export function createSignatureWave2Rows5({ enemy }) {
  return (enemy("Half-Life", "Combine Strider Heavy", "Dark Energy Impale", "Strider Warp Cannon", "beam", 440, "hl-strider", {"note":"Native warp-cannon family; no whole-map damage, building destruction or source charging animation claimed."}));
}
