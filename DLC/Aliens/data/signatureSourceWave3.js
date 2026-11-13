// Aliens — definitions consumed by src/game/signatureSourceWave3.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureWave3Rows({ hero }) {
  return (hero('Aliens', 'hicks_aliens', 'Corporal Hicks Origin Burst', 'Hicks — Close Encounter Shotgun', 'barrage', 150, 'aliens-film-equipment', {
    note: 'Personal shotgun from the Aliens film loadout. One effective blast, not an orbital strike. Pellet spread and ammunition remain adapted.'
  }));
}

export function createSignatureWave3Rows2({ hero }) {
  return (hero('Aliens', 'hudson_aliens', 'Hudson Origin Burst', 'Hudson — Pulse Rifle Burst', 'barrage', 330, 'aliens-film-equipment', {
    hits: 4, note: 'Personal pulse-rifle fire; four contacts are a Nexus budget, not a film firing-rate measurement. Motion-tracker hacking and sentries are not supplied by this action.'
  }));
}

export function createSignatureWave3Rows3({ hero }) {
  return (hero('Aliens', 'vasquez_aliens', 'Vasquez Origin Burst', 'Vasquez — Smartgun Sweep', 'barrage', 330, 'aliens-film-equipment', {
    hits: 6, shape: 'multi', distribution: 'cycle', note: 'Smartgun-loadout adaptation, not the later BDU/pulse-rifle incarnation. Six shared-budget contacts; no invented automatic target detection through walls.'
  }));
}
