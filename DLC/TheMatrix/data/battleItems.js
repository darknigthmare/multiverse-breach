// The Matrix — definitions consumed by src/game/battleItems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createBattleItemOverrides() {
  return ({
    pickups: [
      ['Programme esquive', 'Dodge Program', 'Routine chargee par operateur: en melee elle donne une fenetre bullet time, en tactique elle permet de quitter une case menacee par un Agent.'],
      ['Code vert compile', 'Compiled Green Code', 'Fragment lisible de simulation: augmente les degats contre programmes et revele les regles cachees d une faille controlee.'],
      ['Telephone de sortie', 'Exit Phone', 'Point d extraction Zion: soigne legerement, repositionne le heros actif et empeche une boucle de respawn Agent pendant un court instant.']
    ],
    summon: ['Operateur Zion', 'Zion Operator', 'Invocation temporaire: Tank/Link charge armes, sorties et contre-mesures pendant que la ligne ennemie perd ses privileges systeme.'],
    ultimate: ['Bullet Time global', 'Global Bullet Time', 'Attaque ultime: Neo lit le code, Trinity verrouille la sortie et Morpheus force le choix; les ennemis ralentissent pendant que l escouade frappe toute la ligne.']
  });
}
