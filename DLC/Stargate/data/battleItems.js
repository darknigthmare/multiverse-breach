// Stargate — definitions consumed by src/game/battleItems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createBattleItemOverrides() {
  return ({
    pickups: [
      ['Cellule au naquadah', 'Naquadah Cell', 'Source energetique instable: en melee elle charge une frappe, en tactique elle alimente une Porte ou surcharge un bouclier Goa uld.'],
      ['Balise GDO SGC', 'SGC GDO Beacon', 'Identification de retour Terre: securise une zone, valide les allies et bloque les signatures hostiles avant ouverture iris.'],
      ['Drone Ancien', 'Ancient Drone', 'Technologie des Anciens: projectile guidant qui traverse les defenses ordinaires et cherche le noyau de menace le plus dangereux.']
    ],
    summon: ['Equipe SG temporaire', 'Temporary SG Team', 'Invocation temporaire: une equipe SG franchit la Porte, pose un tir de couverture et marque les coordonnees de repli.'],
    ultimate: ['Surcharge de Porte', 'Gate Overload', 'Attaque ultime: les chevrons se verrouillent de force, un vortex instable arrache les signatures hostiles et l iris se referme avant contre-invasion.']
  });
}
