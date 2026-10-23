import { buff } from './rules.js';

// A concrete source contradiction found after the generic-slot inventory.
// Keep this correction separate from the immutable placeholder cohorts.
export const ABILITIES_CORRECTIONS = Object.freeze({
  mei_zhen: {
    universe: 'Mandate of Nine Heavens',
    secondary: { ...buff('Pas de l’Ancêtre', { duration: 3, buffMultiplier: 1.12 }), cd: 6 },
    sourceWork: 'Mandate of Nine Heavens — original project canon',
    sourceReference: 'src/game/originalUniversesManifest.json, mei_zhen: ancêtres / soutien ; la gardienne aide les morts à transmettre un message sans devenir des soldats. L’apparition guide les alliés et n’attaque personne.',
    identityBasis: 'authored-universe-canon',
    canonicalVerified: false,
    networkVerified: false
  }
});
