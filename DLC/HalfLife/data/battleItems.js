// Half-Life — definitions consumed by src/game/battleItems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createBattleItemOverrides() {
  return ({
    pickups: [
      ['Batterie auxiliaire HEV', 'HEV Auxiliary Battery', 'Module de combinaison Black Mesa: en melee il restaure l armure du porteur, en tactique il devient une case de recharge HEV sous feu Combine.'],
      ['Caisse Lambda', 'Lambda Crate', 'Cache de resistance Half-Life: munitions, medkit ou charge experimentale; elle transforme la rarete des ressources en decision de terrain.'],
      ['Nid de snarks Xen', 'Xen Snark Nest', 'Containment Xen instable: libere de petites creatures agressives qui harcelent les ennemis et cassent les lignes de tir.']
    ],
    summon: ['Cellule Resistance Lambda', 'Lambda Resistance Cell', 'Invocation temporaire: Barney et une cellule de resistance ouvrent une couverture courte, posent des munitions et guident les survivants vers la sortie.'],
    ultimate: ['Cascade de resonance controlee', 'Controlled Resonance Cascade', 'Attaque ultime: A.R.C.A. force une mini-cascade Black Mesa, aspire les cibles dans une rupture Xen puis referme la frequence avant invasion totale.']
  });
}
