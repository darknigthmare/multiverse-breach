// Buckethead — definitions consumed by src/game/battleItems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createBattleItemOverrides() {
  return ({
    pickups: [
      ['Mediator Pike', 'Pike Guitar Pick', 'Fragment de la Pike Series: en melee il declenche une rafale de notes directionnelle, en tactique il marque une case comme trajectoire de riff.'],
      ['Masque blanc resonant', 'Resonant White Mask', 'Ancre de persona muette: reduit la pression ennemie, cache le porteur dans une mesure de silence et stabilise les failles musicales trop bavardes.'],
      ['Bucket antenna', 'Bucket Antenna', 'Couronne de scene devenue recepteur A.R.C.A.: capte le tempo exact du labyrinthe et recharge une action speciale sans casser le mystere du personnage.']
    ],
    summon: ['Echo Death Cube K', 'Death Cube K Echo', 'Invocation temporaire: une nappe ambient sombre ralentit les ennemis, revele les couloirs caches et transforme la peur sonore en fenetre de repli.'],
    ultimate: ['Portail Bucketheadland', 'Bucketheadland Gate', 'Attaque ultime: le parc instrumental ouvre un labyrinthe de riffs, les automates hostiles sont dechires par le shred et l escouade suit une sortie tracee par la guitare.']
  });
}
