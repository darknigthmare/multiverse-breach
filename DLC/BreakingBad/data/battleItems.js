// Breaking Bad — definitions consumed by src/game/battleItems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createBattleItemOverrides() {
  return ({
    pickups: [
      ['Fiole bleue instable', 'Unstable Blue Flask', 'Degats chimiques controles par A.R.C.A.'],
      ['Masque de labo', 'Lab Mask', 'Protection contre les statuts hostiles.'],
      ['Batterie improvisee', 'Improvised Battery', 'Recharge speciale et impulsion electrique.']
    ],
    summon: ['Equipe de laboratoire', 'Lab Crew', 'Des assistants temporaires saturent une case ennemie.'],
    ultimate: ['Reaction en chaine', 'Chain Reaction', 'Une reaction calculee nettoie l ecran sans briser la coherence Nexus.']
  });
}
