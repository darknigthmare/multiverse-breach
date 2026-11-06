// Doom — definitions consumed by src/game/signatureSourceWave2.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureWave2Rows({ hero }) {
  return (hero("Doom", "doom_marine_classic", "Classic Doom Marine Origin Burst", "Classic Plasma Rifle Burst", "barrage", 350, "doom-weapons", {"hits":5,"color":"#8cbbff","note":"Classic plasma stream; no Doom Eternal equipment, Crucible, or newly granted Quad powerup."}));
}

export function createSignatureWave2Rows2({ enemy }) {
  return (enemy("Doom", "Spider Mastermind Core", "Hell Network Overload", "Spider Mastermind Chaingun", "barrage", 380, "doom-enemies", {"hits":3,"note":"Classic chaingun attack family; no plasma-ring or neural network magic."}));
}
