// Resident Evil — definitions consumed by src/game/battleItems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createBattleItemOverrides() {
  return ({
    pickups: [
      ['Herbe verte compacte', 'Compact Green Herb', 'Ressource de survie Raccoon City: en melee elle soigne au ramassage, en tactique elle devient une case de secours a proteger.'],
      ['Grenade flash R.P.D.', 'R.P.D. Flash Grenade', 'Contre-mesure anti-B.O.W.: aveugle les infectes proches, coupe une charge de Licker ou de chien zombie et ouvre une seconde de repositionnement.'],
      ['Munitions incendiaires Umbrella', 'Umbrella Incendiary Rounds', 'Cartouches recuperees dans un stockage de crise: brulent les mutations, percent les masses infectees et donnent a Leon une reponse courte contre les formes instables.']
    ],
    summon: ['Renfort S.T.A.R.S.', 'S.T.A.R.S. Backup', 'Invocation temporaire: un operateur S.T.A.R.S. traverse la breche, couvre les survivants et marque les B.O.W. prioritaires.'],
    ultimate: ['Confinement Raccoon City', 'Raccoon City Lockdown', 'Attaque ultime: sirenes, barricades et frappe anti-B.O.W. enferment la zone; une horde T-Virus deviee submerge les ennemis avant extraction A.R.C.A.']
  });
}
